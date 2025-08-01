import { CustomError } from "../../../../config/errors/custom.error";
import { DateUtil } from "../../../../utils/date_util";
import { LoanEntity } from "../../../entities";
import { LoanMovementType, LoanState } from "../../../enum";
import { LoanPaymentRequest } from "../../../interfaces/loan_payment_request_interface";

export class QuotaPayment {
  public static pay(
    data: LoanPaymentRequest,
    loan: LoanEntity
  ): Partial<LoanEntity> {
    this.validatePay(data, loan);

    return {
      balance: loan.balance - data.amount,
      interestBalance: 0,
      princilaCurrentAmount:
        loan.princilaCurrentAmount - (data.amount - loan.interestBalance),
      movements: [
        ...loan.movements,
        {
          amount: data.amount,
          date: DateUtil.formatDate(new Date()),
          quoteDate: data.date ?? DateUtil.formatDate(new Date()),
          type: LoanMovementType.QUOTA_PAYMENT,
          movementChannel: data.movementChannel,
          description:
            data.description ?? `Pago de cuota por concepto de: ${data.amount}`,
        },
      ],
      arrearInterests: [],
    };
  }

  private static validatePay(data: LoanPaymentRequest, loan: LoanEntity): void {
    if (loan.state === LoanState.CLOSED) {
      throw CustomError.badRequest(
        "PRINCIPAL_PAYMENT",
        `No puedes pagar una cuota de un prestamo en estado CERRADO`
      );
    }
    if (loan.arrearInterests.length > 1) {
      throw CustomError.badRequest(
        "QUOTA_PAYMENT",
        `No puedes pagar una cuota si tienes intereses en mora, salda su deuda realizando abonos a intereses primero.`
      );
    }
    if (data.amount >= loan.balance) {
      throw CustomError.badRequest(
        "QUOTA_PAYMENT",
        `El monto a pagar no puede ser mayor o igual a la deuda total actual, con el tipo de movimiento: ${LoanMovementType.QUOTA_PAYMENT}`
      );
    }
  }
}
