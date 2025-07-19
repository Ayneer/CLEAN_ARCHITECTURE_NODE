import { NextFunction, Request, Response } from "express";
import { Dto } from "../../config/dtos/dto";
import { LoanDtoModel } from "../../models";
import { CustomError } from "../../config";

export class LoanMiddleware {
  constructor(private readonly createLoanDto: Dto<LoanDtoModel>) {}

  validateCreateLoanDto = (req: Request, res: Response, next: NextFunction) => {
    try {
      const [error, detail, loanDtoModel] = this.createLoanDto.validate(
        req.body
      );

      if (error) {
        throw CustomError.badRequest(error, detail);
      }

      console.log("Loan DTO validated successfully:", loanDtoModel);

      req.body.loanDtoModel = loanDtoModel;
      next();
    } catch (error) {
      next(error);
    }
  };
}
