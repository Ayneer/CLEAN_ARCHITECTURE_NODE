import { CustomError } from "../../../config";
import { LoanEntity } from "../../../domain";

export class LoanMapper {
  static loanEntityFromObject(
    object: { [key: string]: any },
    fieldsToDelete: (keyof LoanEntity)[] = []
  ): LoanEntity {
    const validated = this.validateRequiredFields(object);

    const loan: LoanEntity = new LoanEntity({
      id: validated.id || validated._id,
      amount: validated.amount,
      balance: validated.balance,
      initialDate: validated.initialDate,
      state: validated.state,
      documents: validated.documents,
      arrearInterests: validated.arrearInterests,
      rate: validated.rate,
      movements: validated.movements,
      clientId: validated.clientId,
      ownerId: validated.ownerId,
      interestBalance: validated.interestBalance,
      princilaCurrentAmount: validated.princilaCurrentAmount,
      paymentFrequency: validated.paymentFrequency,
      code: validated.code,
    });

    fieldsToDelete.forEach((field) => delete loan[field]);

    return loan;
  }

  private static validateRequiredFields(object: { [key: string]: any }): {
    [key: string]: any;
  } {
    const requiredFields: {
      key: keyof LoanEntity | "_id";
      allowZero?: boolean;
    }[] = [
      { key: "id" },
      { key: "_id" },
      { key: "code" },
      { key: "amount" },
      { key: "balance" },
      { key: "interestBalance" },
      { key: "princilaCurrentAmount" },
      { key: "initialDate" },
      { key: "state" },
      { key: "documents" },
      { key: "rate" },
      { key: "movements" },
      { key: "arrearInterests" },
      { key: "clientId" },
      { key: "ownerId" },
      { key: "paymentFrequency" },
    ];

    for (const { key } of requiredFields) {
      const value = object[key];
      const isEmpty = value === undefined || value === null;

      if (key === "id" || key === "_id") {
        if (!object.id && !object._id) {
          throw CustomError.badRequest(`Missing id`);
        }
        continue;
      }

      if (isEmpty) {
        throw CustomError.badRequest(`Missing ${key}`);
      }
    }

    return object;
  }
}
