import { CustomError } from "../../../../config";
import { PayLoanDtoModel } from "../../../../models/dto";
import { DateUtil } from "../../../../utils/date_util";
import { LoanEntity } from "../../../entities";
import { LoanMovementType, LoanState } from "../../../enum";
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
      let updatedLoanEntity: LoanEntity = new LoanEntity({
        ...loanEntity,
        finalDate: "",
      });

      switch (data.type) {
        case LoanMovementType.PRINCIPAL_PAYMENT: {
          updatedLoanEntity = {
            ...updatedLoanEntity,
            ...PrincipalPayment.pay(data, loanEntity)
          };
          break;
        }

        case LoanMovementType.INTEREST_PAYMENT: {
          updatedLoanEntity = {
            ...updatedLoanEntity,
            ...InterestPayment.pay(data, loanEntity)
          };
          break;
        }

        case LoanMovementType.QUOTA_PAYMENT: {
          updatedLoanEntity = {
            ...updatedLoanEntity,
            ...QuotaPayment.pay(data, loanEntity)
          };
          break;
        }

        case LoanMovementType.TOTAL_PAYMENT: {
          updatedLoanEntity = {
            ...updatedLoanEntity,
            ...TotalPayment.pay(data, loanEntity)
          };
          break;
        }
      }

      if (updatedLoanEntity.balance === 0) {
        updatedLoanEntity = {
          ...updatedLoanEntity,
          state: LoanState.CLOSED,
          finalDate: data.date ?? DateUtil.formatDate(new Date()),
        };
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

  private async canPayLoan(data: PayLoanDtoModel): Promise<LoanEntity> {
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
}
