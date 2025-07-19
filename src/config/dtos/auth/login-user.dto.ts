import Joi from "joi";
import { getParamsErrorMessages, patternEmail } from "../..";
import { Dto } from "../dto";
import { UserLoginDtoModel } from "../../../models/dto";
import { DtoUtil } from "../utils/dto_util";

export class LoginUserDto extends Dto<UserLoginDtoModel> {
  constructor() {
    super();
  }

  validate(object: {
    [key: string]: any;
  }): [string?, string?, UserLoginDtoModel?] {
    const validator = Joi.object({
      email: Joi.string()
        .required()
        .regex(patternEmail)
        .messages(getParamsErrorMessages("user_email")),
      password: Joi.string()
        .required()
        .messages(getParamsErrorMessages("user_password")),
    })
      .unknown(false)
      .messages(getParamsErrorMessages("user_object"));

    const { error } = validator.validate(object);

    if (error) {
      return [
        error.message,
        DtoUtil.getErrorDetail(error.message, error.details[0].path),
      ];
    } else {
      return [
        undefined,
        undefined,
        new UserLoginDtoModel({
          email: object.email,
          password: object.password,
        }),
      ];
    }
  }
}
