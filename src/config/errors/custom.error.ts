import { CustomErrorUtils } from "./custom_error_util";

export interface ErrorModel {
  statusCode: number;
  message: string;
}

export class CustomError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly codeError?: string,
    public readonly detail?: string
  ) {
    super(message);
  }

  static badRequest(message: string, detail?: string) {
    return new CustomError(
      400,
      message,
      CustomErrorUtils.getErrorCode(message),
      detail
    );
  }

  static unauthorized(message: string) {
    return new CustomError(401, message);
  }

  static forbidden(message: string) {
    return new CustomError(403, message);
  }

  static notFound(message: string) {
    return new CustomError(404, message);
  }

  static internalServerError(message: string = "Internal Server Error") {
    return new CustomError(500, message);
  }
}
