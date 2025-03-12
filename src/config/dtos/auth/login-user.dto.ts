import Joi from "joi";
import { getParamsErrorMessages, patternEmail } from "../..";

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const validator = Joi.object({
      email: Joi.string()
        .regex(patternEmail)
        .required()
        .messages(getParamsErrorMessages("user_email")),
      password: Joi.string()
        .required()
        .messages(getParamsErrorMessages("user_password")),
    })
      .unknown(false)
      .messages(getParamsErrorMessages("user_object"));

    const { error, value } = validator.validate(object);

    if (error && !value) {
      // console.log(error.details[0].type)
      return [error.message, undefined];
    } else {
      // const { email, password } = object;
      // return [undefined, new RegisterUserDto(name, email, password) ]
      return [undefined, object as LoginUserDto];
    }
  }
}
