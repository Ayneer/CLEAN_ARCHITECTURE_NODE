import Joi from "joi";
import { getParamsErrorMessages } from "../..";

export class DeleteOneUserByIdDto {
  private constructor(public id: string) {}

  static validate(object: { [key: string]: any }): [string?, DeleteOneUserByIdDto?] {
      const validator = Joi.object({
            id: Joi.string()
              .required()
              .messages(getParamsErrorMessages("user_id")),
          })
            .unknown(false)
            .messages(getParamsErrorMessages("user_object"));
  
      const { error, value } = validator.validate(object);
  
      if (error && !value) {
        return [error.message, undefined];
      } else {
        return [undefined, { id: object.id } as DeleteOneUserByIdDto];
      }
    }
}