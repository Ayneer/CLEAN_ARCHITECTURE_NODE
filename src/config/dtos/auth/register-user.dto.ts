import Joi from "joi";
import { getParamsErrorMessages, patternEmail } from "../..";

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
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
    })
      .unknown(false)
      .messages(getParamsErrorMessages("user_object"))

    const { error, value } = validator.validate(object);

    if (error) {
      // console.log(error.details[0].type)
      return [error.message, undefined];
    } else {
      const { name, email, password } = object;
      // return [undefined, new RegisterUserDto(name, email, password) ]
      return [undefined, object as RegisterUserDto];
    }
  }
}
