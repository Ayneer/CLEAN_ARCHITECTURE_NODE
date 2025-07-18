import Joi from "joi";
import { getParamsErrorMessages, patternEmail } from "../..";
import { Dto } from "../dto";
import { UserDto } from "../../../models";

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
        this.getErrorDetail(error.message, error.details[0].path),
        undefined,
      ];
    } else {
      const { name, email, password, roles, img } = object;
      return [
        undefined,
        undefined,
        { name, email, password, roles, img } as UserDto,
      ];
    }
  }

  private getErrorDetail(error: string, value: (string | number)[]): string {
    if (error.includes("required")) {
      return `${value} field is required`;
    }
    if (error.includes("format_error")) {
      return `${value} field has a bad format`;
    }
    return "There ara some value whit error or is required in the request";
  }
}
