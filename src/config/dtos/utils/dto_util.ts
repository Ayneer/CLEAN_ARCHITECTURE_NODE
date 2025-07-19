import { LoanRateType, DocumentType } from "../../../domain/enum";

export class DtoUtil {
  static getErrorDetail(error: string, value: (string | number)[]): string {
    if (error.includes("required")) {
      return `${value} field is required`;
    }
    if (error.includes("format_error")) {
      return `${value} field has a bad format`;
    }
    if (error.includes("loan_rate_type_error")) {
      return `${value} field has a not valid value. try with: ${Object.values(LoanRateType).join(", ")}`;
    }
    if (error.includes("loan_client_document_type_error")) {
      return `${value} field has a not valid value. try with: ${Object.values(DocumentType).join(", ")}`;
    }
    return "There ara some value whit error or is required in the request";
  }
}
