import Joi from "joi";
import { getParamsErrorMessages, patternEmail } from "../..";

export class GetUserByIdDto {
  private constructor(public id: string) {}

  static validate(id: string): [string?, GetUserByIdDto?] {
    const validator = Joi.string()
      .required()
      .messages(getParamsErrorMessages("user_id"));

    const { error, value } = validator.validate(id);

    if (error && !value) {
      return [error.message, undefined];
    } else {
      return [undefined, { id } as GetUserByIdDto];
    }
  }
}
