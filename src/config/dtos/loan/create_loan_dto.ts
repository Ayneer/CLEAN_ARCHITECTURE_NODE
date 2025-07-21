import Joi from "joi";
import { datePattern, getParamsErrorMessages, patternEmail } from "../..";
import { Dto } from "../dto";
import { LoanDtoModel, UserDto } from "../../../models";
import { DtoUtil } from "../utils/dto_util";
import {
  LoanRateType,
  DocumentType,
} from "../../../domain/enum";

export class CreateLoanDto extends Dto<LoanDtoModel> {
  constructor() {
    super();
  }

  validate(object: { [key: string]: any }): [string?, string?, LoanDtoModel?] {
    const validator = Joi.object({
      amount: Joi.number()
        .required()
        .messages(getParamsErrorMessages("loan_amount")),
      initialDate: Joi.string()
        .regex(datePattern)
        .messages(getParamsErrorMessages("loan_initial_date")),
      paymentFrequency: Joi.number()
        .required()
        .messages(getParamsErrorMessages("loan_payment_frequency")),
      documents: Joi.array()
        .items(
          Joi.object({
            name: Joi.string()
              .required()
              .messages(getParamsErrorMessages("loan_document_name")),
            url: Joi.string()
              .uri()
              .required()
              .messages(getParamsErrorMessages("loan_document_url")),
            description: Joi.string()
              .required()
              .messages(getParamsErrorMessages("loan_document_description")),
            date: Joi.string()
              .regex(datePattern)
              .required()
              .messages(getParamsErrorMessages("loan_document_date")),
          })
        )
        .messages(getParamsErrorMessages("loan_documents")),
      rate: Joi.object({
        value: Joi.number()
          .required()
          .messages(getParamsErrorMessages("loan_rate_value")),
        type: Joi.string()
          .valid(...Object.values(LoanRateType))
          .required()
          .messages(getParamsErrorMessages("loan_rate_type")),
      })
        .required()
        .messages(getParamsErrorMessages("loan_rate")),
      client: Joi.object({
        name: Joi.string()
          .required()
          .messages(getParamsErrorMessages("loan_client_name")),
        documentNumber: Joi.string()
          .required()
          .messages(getParamsErrorMessages("loan_client_document_number")),
        documentType: Joi.string()
          .valid(...Object.values(DocumentType))
          .required()
          .messages(getParamsErrorMessages("loan_client_document_type")),
        email: Joi.string()
          .optional()
          .regex(patternEmail)
          .messages(getParamsErrorMessages("loan_client_email")),
        phone: Joi.string()
          .required()
          .messages(getParamsErrorMessages("loan_client_phone")),
        address: Joi.string()
          .required()
          .messages(getParamsErrorMessages("loan_client_address")),
        city: Joi.string()
          .required()
          .messages(getParamsErrorMessages("loan_client_city")),
      })
        .required()
        .messages(getParamsErrorMessages("loan_client")),
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
      const { amount, initialDate, documents, rate, client, user,paymentFrequency } = object;
      return [
        undefined,
        undefined,
        new LoanDtoModel({
          amount,
          initialDate: initialDate ?? null,
          paymentFrequency,
          documents,
          rate,
          client,
          ownerId: user.id,
        }),
      ];
    }
  }
}
