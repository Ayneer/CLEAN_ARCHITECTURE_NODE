import Joi from "joi";
import { getParamsErrorMessages, patternEmail } from "../..";
import { Dto } from "../dto";

export interface UserDto {
  name: string,
  email: string,
  password: string,
  roles?: string[]
}

export class RegisterUserDto extends Dto {

  constructor(
    public name?: string,
    public email?: string,
    public password?: string,
    public roles?: string[]
  ) {
    super();
  }

  validate<UserDto>(object: { [key: string]: any }): [string?, UserDto?] {
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
      roles: Joi.array()
        .items(Joi.string().valid('USER_ROLE', 'ADMIN_ROLE',))
        .messages(getParamsErrorMessages("user_roles")),
      user: Joi.object()
        .required()
        .messages(getParamsErrorMessages("user_roles")),
    })
      .unknown(false)
      .messages(getParamsErrorMessages("user_object"))

    const { error } = validator.validate(object);

    if (error) {
      return [error.message, undefined];
    } else {
      const { name, email, password, roles } = object;
      return [undefined, { name, email, password, roles } as UserDto];
    }
  }
}
