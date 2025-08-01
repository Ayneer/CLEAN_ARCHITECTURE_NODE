import { CustomError } from "../../../../config";
import { PayLoanDtoModel } from "../../../../models/dto";
import { DateUtil } from "../../../../utils/date_util";
import { LoanEntity } from "../../../entities";
import { LoanMovementType, LoanState } from "../../../enum";
import { LoanPaymentRequest } from "../../../interfaces/loan_payment_request_interface";
import { UseCaseInterface } from "../../../interfaces/use_case_interface";
import { LoanRepository } from "../../../repositories";
import { LoanUtils } from "../../utils";
import { InterestPayment } from "./interest_payment";
import { PrincipalPayment } from "./principal_payment";
import { QuotaPayment } from "./quota_payment";
import { TotalPayment } from "./total_payment";

export class PayLoanUseCase
  implements UseCaseInterface<PayLoanDtoModel, LoanEntity>
{
  constructor(private readonly loanRepository: LoanRepository) {}

  async excecute(data: PayLoanDtoModel): Promise<LoanEntity> {
    try {
      //Validate data
      const loanEntity: LoanEntity = await this.canPayLoan(data);

      if (!this.canRegisterMultiplesMovements(data, loanEntity)) {
        throw CustomError.forbidden(
          "No puedes registrar todas los movimientos enviados. Por favor valida la información y vuelve a intentarlo."
        );
      }

      const payments = this.getPayments(data, loanEntity);
      let updatedLoanEntity = {
        ...loanEntity,
        finalDate: "",
      };

      for (const payment of payments) {
        updatedLoanEntity = {
          ...updatedLoanEntity,
          ...this.updateLoanyByMovementType(payment, loanEntity),
        };
        if (updatedLoanEntity.balance === 0) {
          updatedLoanEntity = {
            ...updatedLoanEntity,
            state: LoanState.CLOSED,
            finalDate: payment.date ?? DateUtil.formatDate(new Date()),
          };
        }
      }

      await this.loanRepository.updateLoan(data.loanId, updatedLoanEntity);
      return updatedLoanEntity;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error(error);
      throw CustomError.internalServerError();
    }
  }

  private getPayments(
    data: PayLoanDtoModel,
    loanEntity: LoanEntity
  ): LoanPaymentRequest[] {
    if (loanEntity.state !== LoanState.ACTIVE_OLD) {
      return data.payments.sort((a, b) => {
        return a.type === LoanMovementType.INTEREST_PAYMENT ? -1 : 1;
      });
    }

    return data.payments;
  }

  private canRegisterMultiplesMovements(
    data: PayLoanDtoModel,
    loanEntity: LoanEntity
  ): boolean {
    const payments = data.payments;
    const isActiveOld = loanEntity.state === LoanState.ACTIVE_OLD;

    if (payments.length < 1 || payments.length > 2) {
      return false;
    }

    // Si es estado antiguo, permitir cualquier combinación de hasta 2 pagos
    if (isActiveOld) {
      return true;
    }

    // Si son exactamente 2 pagos, validar que sean 1 interés y 1 capital
    if (payments.length === 2) {
      const paymentTypes = payments.map((p) => p.type);
      const hasInterest = paymentTypes.includes(
        LoanMovementType.INTEREST_PAYMENT
      );
      const hasPrincipal = paymentTypes.includes(
        LoanMovementType.PRINCIPAL_PAYMENT
      );

      return hasInterest && hasPrincipal;
    }

    // Para un solo pago en préstamos no antiguos, también es válido
    return true;
  }

  private async canPayLoan(data: PayLoanDtoModel): Promise<LoanEntity> {
    if (data.payments.length === 0) {
      throw CustomError.badRequest("Debes agregar al menos un pago");
    }

    //Search for the loan by ID
    const loanEntity: LoanEntity | null = await this.loanRepository.getLoanById(
      data.loanId
    );
    if (!loanEntity) {
      throw CustomError.notFound("Loan not found");
    }

    //Validate loan owner
    if (loanEntity.ownerId !== data.ownerId) {
      throw CustomError.forbidden(
        "You are not allowed to pay this loan, it does not belong to you"
      );
    }

    const canPayLoanByState = [
      LoanState.ACTIVE,
      LoanState.ARREAR_INTEREST,
      LoanState.ACTIVE_OLD,
    ].some((state) => state === loanEntity.state);

    //Validate loan state
    if (!canPayLoanByState) {
      throw CustomError.badRequest(
        "You cannot pay the loan, please contact support"
      );
    }

    const currentArrearInterests = LoanUtils.setLoanInterests(
      new LoanEntity(loanEntity)
    ).arrearInterests;
    if (
      !LoanUtils.compareArrearInterests(
        currentArrearInterests,
        loanEntity.arrearInterests
      )
    ) {
      throw CustomError.badRequest(
        "You cannot pay the loan, please contact support - different arrearInterests"
      );
    }

    return loanEntity;
  }

  private updateLoanyByMovementType(
    data: LoanPaymentRequest,
    loanEntity: LoanEntity
  ) {
    switch (data.type) {
      case LoanMovementType.PRINCIPAL_PAYMENT: {
        return PrincipalPayment.pay(data, loanEntity);
      }
      case LoanMovementType.INTEREST_PAYMENT: {
        return InterestPayment.pay(data, loanEntity);
      }
      case LoanMovementType.QUOTA_PAYMENT: {
        return QuotaPayment.pay(data, loanEntity);
      }
      case LoanMovementType.TOTAL_PAYMENT: {
        return TotalPayment.pay(data, loanEntity);
      }
    }
  }
}
