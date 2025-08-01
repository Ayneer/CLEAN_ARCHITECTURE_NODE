import { CustomError } from "../../../../config/errors/custom.error";
import { DateUtil } from "../../../../utils/date_util";
import { LoanEntity } from "../../../entities";
import { LoanMovementType, LoanState } from "../../../enum";
import { LoanPaymentRequest } from "../../../interfaces/loan_payment_request_interface";

export class TotalPayment {
  public static pay(
    data: LoanPaymentRequest,
    loan: LoanEntity
  ): Partial<LoanEntity> {
    this.validatePay(data, loan);

    return {
      balance: loan.balance - data.amount,
      interestBalance: 0,
      princilaCurrentAmount: 0,
      movements: [
        ...loan.movements,
        {
          amount: data.amount,
          date: DateUtil.formatDate(new Date()),
          quoteDate: data.date ?? DateUtil.formatDate(new Date()),
          type: LoanMovementType.TOTAL_PAYMENT,
          movementChannel: data.movementChannel,
          description:
            data.description ?? `Pago total por concepto de: ${data.amount}`,
        },
      ],
      arrearInterests: [],
    };
  }

  private static validatePay(data: LoanPaymentRequest, loan: LoanEntity): void {
    if (loan.state === LoanState.CLOSED) {
      throw CustomError.badRequest(
        "PRINCIPAL_PAYMENT",
        `No puedes pagar el total de un prestamo en estado CERRADO`
      );
    }
    if (data.amount !== loan.balance) {
      throw CustomError.badRequest(
        "TOTAL_PAYMENT",
        `El monto a pagar debe ser igual al saldo del prestamo más intereses actuales, con el tipo de movimiento: ${LoanMovementType.QUOTA_PAYMENT}`
      );
    }
  }
}
