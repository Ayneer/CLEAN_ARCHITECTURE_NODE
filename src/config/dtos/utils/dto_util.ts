export class DtoUtil {
  static getErrorDetail(error: string, value: (string | number)[]): string {
    if (error.includes("required")) {
      return `${value} field is required`;
    }
    if (error.includes("format_error")) {
      return `${value} field has a bad format`;
    }
    return "There ara some value whit error or is required in the request";
  }
}
