import { CustomError } from "../../../../config/errors/custom.error";
import { DateUtil } from "../../../../utils/date_util";
import { LoanEntity } from "../../../entities";
import { LoanMovementType, LoanState } from "../../../enum";
import { LoanArrearInterest } from "../../../interfaces/arrear_interest_interface";
import { LoanMovement } from "../../../interfaces/loan_movement_interface";
import { LoanPaymentRequest } from "../../../interfaces/loan_payment_request_interface";
import { LoanUtils } from "../../utils";

export class InterestPayment {
  public static pay(
    data: LoanPaymentRequest,
    loan: LoanEntity
  ): Partial<LoanEntity> {
    const interestAmount = LoanUtils.getInterestAmount(loan);
    let amountCount: number = data.amount;
    let newMovements: LoanMovement[] = [];

    //Cuando se trate de un prestamo activo pero viejo, se debe tomar otra logica!!!!

    //Validamos si habrá mas de un movimiento
    if (amountCount > interestAmount) {
      newMovements.push({
        amount: data.amount,
        date: DateUtil.formatDate(new Date()),
        quoteDate: data.date ?? DateUtil.formatDate(new Date()),
        type: LoanMovementType.INFORMATION,
        movementChannel: data.movementChannel,
        description:
          data.description ??
          `Abono a intereses por concepto de: ${data.amount}`,
      });
    }

    const { movements, arrearInterests } = this.getInterestPaymentMovements(
      data,
      loan,
      interestAmount
    );

    // Update the loan entity with the new principal amount
    return {
      balance: loan.balance - data.amount,
      interestBalance: loan.interestBalance - data.amount,
      movements: [...loan.movements, ...newMovements, ...movements],
      arrearInterests,
    };
  }

  private static getInterestPaymentMovements(
    data: LoanPaymentRequest,
    loan: LoanEntity,
    interestAmount: number
  ): { movements: LoanMovement[]; arrearInterests: LoanArrearInterest[] } {
    let amountCount: number = data.amount;
    let newMovements: LoanMovement[] = [];
    let arrearInterests = [...loan.arrearInterests];

    while (amountCount > 0) {
      const interestOlder = loan.arrearInterests.reduce((prev, current) => {
        return DateUtil.parseDate(prev.date) < DateUtil.parseDate(current.date)
          ? prev
          : current;
      }, loan.arrearInterests[0]);

      let movementAmount: number = interestAmount;

      if (amountCount > interestAmount) {
        if (interestOlder.amount === interestAmount) {
          amountCount = amountCount - interestAmount;
        } else {
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
        movementChannel: data.movementChannel,
        description:
          data.description ??
          `Abono a intereses en mora por concepto de: ${movementAmount}`,
      });

      arrearInterests = this.updateArrearInterests(
        interestOlder.amount,
        arrearInterests,
        movementAmount,
        interestOlder.date
      );
    }

    return { movements: newMovements, arrearInterests };
  }

  private static updateArrearInterests(
    arrearInterestAmount: number,
    arrearInterests: LoanArrearInterest[],
    amount: number,
    date: string
  ): LoanArrearInterest[] {
    if (amount === arrearInterestAmount) {
      return arrearInterests.filter(
        (arrearInterest) => arrearInterest.date !== date
      );
    }

    return arrearInterests.map((arrearInterest) => {
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

  private static validatePay(data: LoanPaymentRequest, loan: LoanEntity): void {
    if (loan.state === LoanState.CLOSED) {
      throw CustomError.badRequest(
        "PRINCIPAL_PAYMENT",
        `No puedes abonar a los intereses de un prestamo en estado CERRADO`
      );
    }
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
  }
}
