import Joi from "joi";
import { getParamsErrorMessages, patternEmail } from "../..";
import { Dto } from "../dto";
import { UserDto } from "../../../models";
import { DtoUtil } from "../utils/dto_util";

export class RegisterUserDto extends Dto<UserDto> {
  constructor() {
    super();
  }

  validate(object: {
    [key: string]: any;
  }): [string?, string?, UserDto?] {
    const validator = Joi.object({
      name: Joi.string()
        .required()
        .messages(getParamsErrorMessages("user_name")),
      email: Joi.string()
        .regex(patternEmail)
        .required()
        .messages(getParamsErrorMessages("user_email")),
      password: Joi.string()
        .required()
        .messages(getParamsErrorMessages("user_password")),
      role: Joi.string()
        .valid("USER_ROLE", "ADMIN_ROLE")
        .messages(getParamsErrorMessages("user_role")),
      img: Joi.string().messages(getParamsErrorMessages("user_img")),
    })
      .unknown(false)
      .messages(getParamsErrorMessages("user_object"));

    const { error } = validator.validate(object);

    if (error) {
      return [
        error.message,
        DtoUtil.getErrorDetail(error.message, error.details[0].path),
        undefined,
      ];
    } else {
      const { name, email, password, role, img } = object;
      return [
        undefined,
        undefined,
        new UserDto({ name, email, password, role, img }),
      ];
    }
  }
}
