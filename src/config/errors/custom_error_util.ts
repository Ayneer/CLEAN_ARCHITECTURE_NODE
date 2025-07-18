export class CustomErrorUtils {
  static getErrorCode(error: string): string {
    switch (error) {
      case "required_user_name":
        return "RBDE_0001"; //Required Body Data Error
      case "required_user_email":
        return "RBDE_0002";
      case "required_user_password":
        return "RBDE_0003";
      case "required_user_roles":
        return "RBDE_0004";

      case "user_email_format_error":
        return "FBDE_0001"; //Format Body Data Error

      case "Internal Server Error":
        return "ISE_0001"; //Internal Server Error

      default:
        return "UISE_0001"; //Unknow Internal Server Error
    }
  }
}
