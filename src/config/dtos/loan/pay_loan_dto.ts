import Joi from "joi";
import { datePattern, getParamsErrorMessages } from "../..";
import { Dto } from "../dto";
import { PayLoanDtoModel } from "../../../models";
import { DtoUtil } from "../utils/dto_util";
import { LoanMovementType, LoanMovementChannel } from "../../../domain/enum";

export class PayLoanDto extends Dto<PayLoanDtoModel> {
  constructor() {
    super();
  }

  validate(object: {
    [key: string]: any;
  }): [string?, string?, PayLoanDtoModel?] {
    const validator = Joi.object({
      loanId: Joi.string()
        .required()
        .messages(getParamsErrorMessages("loan_loan_id")),
      amount: Joi.number()
        .required()
        .messages(getParamsErrorMessages("loan_amount")),
      payments: Joi.array()
        .items(
          Joi.object({
            type: Joi.valid(...Object.values(LoanMovementType))
              .required()
              .messages(getParamsErrorMessages("loan_movement_type")),
            channel: Joi.valid(...Object.values(LoanMovementChannel))
              .required()
              .messages(getParamsErrorMessages("loan_movement_channel")),
            date: Joi.string()
              .regex(datePattern)
              .messages(getParamsErrorMessages("loan_initial_date")),
            description: Joi.string().messages(
              getParamsErrorMessages("loan_description")
            ),
          })
        )
        .min(1)
        .required()
        .messages(getParamsErrorMessages("loan_payments")),
    })
      .unknown(true)
      .messages(getParamsErrorMessages("loan_object"));

    const { error } = validator.validate(object);

    if (error) {
      return [
        error.message,
        DtoUtil.getErrorDetail(error.message, error.details[0].path),
        undefined,
      ];
    } else {
      const { loanId, ownerId, payments } = object;
      return [
        undefined,
        undefined,
        new PayLoanDtoModel({
          loanId,
          ownerId,
          payments,
        }),
      ];
    }
  }
}
