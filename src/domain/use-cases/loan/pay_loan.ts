import { CustomError } from "../../../config";
import { PayLoanDtoModel } from "../../../models/dto";
import { DateUtil } from "../../../utils/date_util";
import { LoanEntity } from "../../entities";
import { LoanMovementType, LoanState } from "../../enum";
import { UseCaseInterface } from "../../interfaces/use_case_interface";
import { LoanRepository } from "../../repositories";

export class PayLoanUseCase
  implements UseCaseInterface<PayLoanDtoModel, LoanEntity>
{
  constructor(private readonly loanRepository: LoanRepository) {}

  async excecute(data: PayLoanDtoModel): Promise<LoanEntity> {
    try {
      //Search for the loan by ID
      const loanEntity: LoanEntity | null =
        await this.loanRepository.getLoanById(data.loanId);
      if (!loanEntity) {
        throw CustomError.notFound("Loan not found");
      }

      //Validate loan owner
      if (loanEntity.ownerId !== data.ownerId) {
        throw CustomError.forbidden(
          "You are not allowed to pay this loan, it does not belong to you"
        );
      }

      //Validate loan state
      if (loanEntity.state !== LoanState.ACTIVE) {
        throw CustomError.badRequest(
          "You cannot pay the loan, please contact support"
        );
      }

      let updatedLoanEntity: LoanEntity = new LoanEntity({
        ...loanEntity,
        finalDate: "",
      });

      switch (data.type) {
        case LoanMovementType.PRINCIPAL_PAYMENT: {
          // Validate the loan movement type
          this.validateLoanMovementType(data, loanEntity);
          // Update the loan entity with the new principal amount
          updatedLoanEntity = {
            ...updatedLoanEntity,
            balance: loanEntity.balance - data.amount,
            princilaCurrentAmount:
              loanEntity.princilaCurrentAmount - data.amount,
            movements: [
              ...loanEntity.movements,
              {
                amount: data.amount,
                date: data.date ?? DateUtil.formatDate(new Date()),
                type: LoanMovementType.PRINCIPAL_PAYMENT,
                movementChannel: data.channel,
                description:
                  data.description ??
                  `Abono a capital por concepto de: ${data.amount}`,
              },
            ],
          };
          break;
        }

        case LoanMovementType.INTEREST_PAYMENT: {
          // Validate the loan movement type
          this.validateLoanMovementType(data, loanEntity);
          // Update the loan entity with the new principal amount
          updatedLoanEntity = {
            ...updatedLoanEntity,
            balance: loanEntity.balance - data.amount,
            interestBalance: loanEntity.interestBalance - data.amount,
            movements: [
              ...loanEntity.movements,
              {
                amount: data.amount,
                date: data.date ?? DateUtil.formatDate(new Date()),
                type: LoanMovementType.INTEREST_PAYMENT,
                movementChannel: data.channel,
                description:
                  data.description ??
                  `Abono a intereses por concepto de: ${data.amount}`,
              },
            ],
          };
          break;
        }

        case LoanMovementType.QUOTA_PAYMENT: {
          // Validate the loan movement type
          this.validateLoanMovementType(data, loanEntity);
          // Update the loan entity with the new principal amount
          updatedLoanEntity = {
            ...updatedLoanEntity,
            balance: loanEntity.balance - data.amount,
            interestBalance: 0,
            princilaCurrentAmount:
              loanEntity.princilaCurrentAmount -
              (data.amount - loanEntity.interestBalance),
            movements: [
              ...loanEntity.movements,
              {
                amount: data.amount,
                date: data.date ?? DateUtil.formatDate(new Date()),
                type: LoanMovementType.QUOTA_PAYMENT,
                movementChannel: data.channel,
                description:
                  data.description ??
                  `Pago de cuota por concepto de: ${data.amount}`,
              },
            ],
          };
          break;
        }

        case LoanMovementType.TOTAL_PAYMENT: {
          // Validate the loan movement type
          this.validateLoanMovementType(data, loanEntity);
          // Update the loan entity with the new principal amount
          updatedLoanEntity = {
            ...updatedLoanEntity,
            balance: loanEntity.balance - data.amount,
            interestBalance: 0,
            princilaCurrentAmount: 0,
            movements: [
              ...loanEntity.movements,
              {
                amount: data.amount,
                date: data.date ?? DateUtil.formatDate(new Date()),
                type: LoanMovementType.TOTAL_PAYMENT,
                movementChannel: data.channel,
                description:
                  data.description ??
                  `Pago total por concepto de: ${data.amount}`,
              },
            ],
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

      this.loanRepository.updateLoan(data.loanId, updatedLoanEntity);
      return updatedLoanEntity;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error(error);
      throw CustomError.internalServerError();
    }
  }

  private validateLoanMovementType(
    data: PayLoanDtoModel,
    loan: LoanEntity
  ): void {
    if (data.type === LoanMovementType.PRINCIPAL_PAYMENT) {
      if (loan.interestBalance > 0) {
        throw CustomError.badRequest(
          "PRINCIPAL_PAYMENT",
          "No puedes abonar al capital mientras se tenga saldo de intereses"
        );
      }
      if (data.amount > loan.princilaCurrentAmount) {
        throw CustomError.badRequest(
          "PRINCIPAL_PAYMENT",
          "El monto a pagar no puede ser mayor al capital actual"
        );
      }
    } else if (data.type === LoanMovementType.INTEREST_PAYMENT) {
      if (loan.interestBalance === 0) {
        throw CustomError.badRequest(
          "INTEREST_PAYMENT",
          "No se puede abonar a los intereses, debido a que actualmente su saldo es 0"
        );
      }
      if (data.amount > loan.interestBalance) {
        throw CustomError.badRequest(
          "INTEREST_PAYMENT",
          "El monto a pagar no puede ser mayor al saldo de intereses"
        );
      }
    } else if (data.type === LoanMovementType.QUOTA_PAYMENT) {
      if (data.amount > loan.interestBalance && data.amount <= loan.balance) {
        throw CustomError.badRequest(
          "INTEREST_PAYMENT",
          `El monto a pagar no puede ser menor al saldo del prestamo más intereses actuales y no puede ser mayor a la deuda actual`
        );
      }
    } else if (data.type === LoanMovementType.TOTAL_PAYMENT) {
      if (data.amount !== loan.balance) {
        throw CustomError.badRequest(
          "INTEREST_PAYMENT",
          `El monto a pagar debe ser igual al saldo del prestamo más intereses actuales`
        );
      }
    }
  }
}
