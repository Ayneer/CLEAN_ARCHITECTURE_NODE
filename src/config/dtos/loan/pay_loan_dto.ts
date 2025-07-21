import Joi from "joi";
import { datePattern, getParamsErrorMessages, patternEmail } from "../..";
import { Dto } from "../dto";
import { PayLoanDtoModel, UserDto } from "../../../models";
import { DtoUtil } from "../utils/dto_util";
import {
  LoanRateType,
  LoanMovementType,
  LoanMovementChannel,
} from "../../../domain/enum";

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
      const { loanId, amount, date, user, type, channel, description } = object;
      return [
        undefined,
        undefined,
        new PayLoanDtoModel({
          loanId,
          amount,
          date: date ?? null,
          type: type,
          channel: channel,
          description: description,
          ownerId: user.id,
        }),
      ];
    }
  }
}
