import { CustomError } from "../../../../config/errors/custom.error";
import { PayLoanDtoModel } from "../../../../models/dto";
import { DateUtil } from "../../../../utils/date_util";
import { LoanEntity } from "../../../entities";
import { LoanMovementType } from "../../../enum";

export class PrincipalPayment {
  public static pay(
    data: PayLoanDtoModel,
    loan: LoanEntity
  ): Partial<LoanEntity> {
    // Validate the loan
    this.validatePay(data, loan);

    // Update the loan entity with the new principal amount
    return {
      balance: loan.balance - data.amount,
      princilaCurrentAmount: loan.princilaCurrentAmount - data.amount,
      movements: [
        ...loan.movements,
        {
          amount: data.amount,
          date: DateUtil.formatDate(new Date()),
          quoteDate: data.date ?? DateUtil.formatDate(new Date()),
          type: LoanMovementType.PRINCIPAL_PAYMENT,
          movementChannel: data.channel,
          description:
            data.description ??
            `Abono a capital por concepto de: ${data.amount}`,
        },
      ],
    };
  }

  private static validatePay(data: PayLoanDtoModel, loan: LoanEntity): void {
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
  }
}
