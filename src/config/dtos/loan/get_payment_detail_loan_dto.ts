import Joi from "joi";
import { getParamsErrorMessages } from "../..";
import { Dto } from "../dto";
import { GetPaymentDetailLoanDtoModel } from "../../../models";
import { DtoUtil } from "../utils/dto_util";

export class GetPaymentDetailLoanDto extends Dto<GetPaymentDetailLoanDtoModel> {
  constructor() {
    super();
  }

  validate(object: {
    [key: string]: any;
  }): [string?, string?, GetPaymentDetailLoanDtoModel?] {
    const validator = Joi.object({
      loanId: Joi.string()
        .required()
        .messages(getParamsErrorMessages("loan_id")),
    })
      .unknown(true)
      .messages(getParamsErrorMessages("payment_deatil_loan_object"));

    const { error } = validator.validate(object);

    if (error) {
      return [
        error.message,
        DtoUtil.getErrorDetail(error.message, error.details[0].path),
        undefined,
      ];
    } else {
      const { loanId, user } = object;
      return [
        undefined,
        undefined,
        new GetPaymentDetailLoanDtoModel({
          loanId,
          ownerId: user.id,
        }),
      ];
    }
  }
}
