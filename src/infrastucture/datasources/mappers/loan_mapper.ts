import { PartialSchemaMap } from "joi";
import { CustomError } from "../../../config";
import { LoanEntity } from "../../../domain";

export class LoanMapper {
  static loanEntityFromObject(
    object: { [key: string]: any },
    fielsToDelete: (keyof LoanEntity)[] = []
  ): LoanEntity {
    const {
      id,
      _id,
      amount,
      balance,
      initialDate,
      state,
      documents,
      rate,
      movements,
      clientId,
      ownerId,
      interestBalance,
      princilaCurrentAmount,
      paymentFrequency
    } = object;

    if (!id && !_id) throw CustomError.badRequest("Missing id");
    if (amount === undefined || amount === null) throw CustomError.badRequest("Missing amount");
    if (balance === undefined || balance === undefined) throw CustomError.badRequest("Missing balance");
    if (interestBalance === undefined || interestBalance === null) throw CustomError.badRequest("Missing interestBalance");
    if (princilaCurrentAmount === undefined || princilaCurrentAmount === null) throw CustomError.badRequest("Missing princilaCurrentAmount");
    if (!initialDate) throw CustomError.badRequest("Missing initialDate");
    if (!state) throw CustomError.badRequest("Missing state");
    if (!documents) throw CustomError.badRequest("Missing documents");
    if (!rate) throw CustomError.badRequest("Missing rate");
    if (!movements) throw CustomError.badRequest("Missing movements");
    if (!clientId) throw CustomError.badRequest("Missing clientId");
    if (!ownerId) throw CustomError.badRequest("Missing ownerId");
    if (!paymentFrequency) throw CustomError.badRequest("Missing paymentFrequency");

    const loan: LoanEntity = new LoanEntity({
      id: id || _id,
      amount,
      balance,
      initialDate,
      state,
      documents,
      rate,
      movements,
      clientId,
      ownerId,
      interestBalance,
      princilaCurrentAmount,
      paymentFrequency
    });

    fielsToDelete.forEach((field) => {
      delete loan[field];
    });

    return loan;
  }
}
