import { CustomError } from "../../../config";
import { PayLoanDtoModel } from "../../../models/dto";
import { DateUtil } from "../../../utils/date_util";
import { LoanEntity } from "../../entities";
import { LoanMovementChannel, LoanMovementType, LoanState } from "../../enum";
import { UseCaseInterface } from "../../interfaces/use_case_interface";
import { LoanRepository } from "../../repositories";
import { LoanUtils } from "../utils";

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

      const interestAmount = LoanUtils.getInterestAmount(loanEntity);
      let arrearInterests = loanEntity.arrearInterests;
      let amountCount: number = data.amount;
      let newMovements: {
        amount: number;
        date: string;
        quoteDate: string;
        type: LoanMovementType;
        description?: string;
        movementChannel: LoanMovementChannel;
      }[] = [];
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
                quoteDate: data.date ?? DateUtil.formatDate(new Date()),
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

          //Validamos si habrá mas de un movimiento
          if (amountCount > interestAmount) {
            newMovements.push({
              amount: data.amount,
              date: data.date ?? DateUtil.formatDate(new Date()),
              quoteDate: DateUtil.formatDate(new Date()),
              type: LoanMovementType.INFORMATION,
              movementChannel: data.channel,
              description:
                data.description ??
                `Abono a intereses por concepto de: ${data.amount}`,
            });
          }
          while (amountCount > 0) {
            const interestOlder = arrearInterests.reduce((prev, current) => {
              return DateUtil.parseDate(prev.date) <
                DateUtil.parseDate(current.date)
                ? prev
                : current;
            });
            let movementAmount: number = interestAmount;

            if (amountCount > interestAmount) {
              if(interestOlder.amount === interestAmount){
                amountCount = amountCount - interestAmount;
              }else{
                amountCount = amountCount - interestOlder.amount;
                movementAmount = interestOlder.amount;
              }
            } else if (amountCount > 0 && amountCount <= interestAmount) {
              movementAmount = amountCount;
              amountCount = 0;
            }

            newMovements.push({
              amount: movementAmount,
              date: DateUtil.formatDate(new Date()),
              quoteDate: interestOlder.date,
              type: LoanMovementType.INTEREST_PAYMENT,
              movementChannel: data.channel,
              description:
                data.description ??
                `Abono a intereses en mora por concepto de: ${movementAmount}`,
            });
            arrearInterests = this.validateArrearInterests(
              arrearInterests,
              movementAmount,
              interestOlder.date
            );
          }

          // Update the loan entity with the new principal amount
          updatedLoanEntity = {
            ...updatedLoanEntity,
            balance: loanEntity.balance - data.amount,
            interestBalance: loanEntity.interestBalance - data.amount,
            movements: [...loanEntity.movements, ...newMovements],
            arrearInterests,
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
                quoteDate: data.date ?? DateUtil.formatDate(new Date()),
                type: LoanMovementType.QUOTA_PAYMENT,
                movementChannel: data.channel,
                description:
                  data.description ??
                  `Pago de cuota por concepto de: ${data.amount}`,
              },
            ],
            arrearInterests: [],
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
                quoteDate: data.date ?? DateUtil.formatDate(new Date()),
                type: LoanMovementType.TOTAL_PAYMENT,
                movementChannel: data.channel,
                description:
                  data.description ??
                  `Pago total por concepto de: ${data.amount}`,
              },
            ],
            arrearInterests: [],
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

  private validateLoanMovementType(
    data: PayLoanDtoModel,
    loan: LoanEntity
  ): void {
    if (data.type === LoanMovementType.PRINCIPAL_PAYMENT) {
      if (loan.interestBalance > 0) {
        throw CustomError.badRequest(
          "PRINCIPAL_PAYMENT",
          `No puedes abonar al capital mientras se tenga saldo de intereses`
        );
      }
      if (data.amount > loan.princilaCurrentAmount) {
        throw CustomError.badRequest(
          "PRINCIPAL_PAYMENT",
          `El monto a pagar no puede ser mayor al capital actual`
        );
      }
    } else if (data.type === LoanMovementType.INTEREST_PAYMENT) {
      if (loan.interestBalance === 0) {
        throw CustomError.badRequest(
          "INTEREST_PAYMENT",
          `No se puede abonar a los intereses, debido a que actualmente su saldo es 0`
        );
      }
      if (data.amount > loan.interestBalance) {
        throw CustomError.badRequest(
          "INTEREST_PAYMENT",
          `El monto a pagar no puede ser mayor al saldo de intereses, con el tipo de movimiento: ${LoanMovementType.QUOTA_PAYMENT}`
        );
      }
    } else if (data.type === LoanMovementType.QUOTA_PAYMENT) {
      if (data.amount >= loan.balance) {
        throw CustomError.badRequest(
          "QUOTA_PAYMENT",
          `El monto a pagar no puede ser mayor o igual a la deuda total actual, con el tipo de movimiento: ${LoanMovementType.QUOTA_PAYMENT}`
        );
      }
    } else if (data.type === LoanMovementType.TOTAL_PAYMENT) {
      if (data.amount !== loan.balance) {
        throw CustomError.badRequest(
          "TOTAL_PAYMENT",
          `El monto a pagar debe ser igual al saldo del prestamo más intereses actuales, con el tipo de movimiento: ${LoanMovementType.QUOTA_PAYMENT}`
        );
      }
    }
  }

  private validateArrearInterests(
    arrearInterests: {
      amount: number;
      date: string;
    }[],
    amount: number,
    date: string
  ): {
    amount: number;
    date: string;
  }[] {
    const interest = arrearInterests.filter((arrearInterest) => {
      return arrearInterest.date === date;
    })[0];
    let newArrearInterests = [...arrearInterests];

    if (interest !== null) {
      if (amount === interest.amount) {
        newArrearInterests = arrearInterests.filter((arrearInterest) => {
          return arrearInterest.date !== date;
        });
      } else {
        newArrearInterests = arrearInterests.map((arrearInterest) => {
          if (arrearInterest.date === date) {
            return {
              ...arrearInterest,
              amount: arrearInterest.amount - amount,
            };
          } else {
            return arrearInterest;
          }
        });
      }
    }

    return newArrearInterests;
  }
}
