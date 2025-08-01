import { NextFunction, Request, Response } from "express";
import { Dto } from "../../config/dtos/dto";
import { GetPaymentDetailLoanDtoModel, LoanDtoModel, PayLoanDtoModel } from "../../models";
import { CustomError } from "../../config";

export class LoanMiddleware {
  constructor(
    private readonly createLoanDto: Dto<LoanDtoModel>,
    private readonly payLoanDto: Dto<PayLoanDtoModel>,
    private readonly getPaymentDetailLoanDto: Dto<GetPaymentDetailLoanDtoModel>
  ) {}

  validateCreateLoanDto = (req: Request, res: Response, next: NextFunction) => {
    try {
      const [error, detail, loanDtoModel] = this.createLoanDto.validate(
        req.body
      );

      if (error) {
        throw CustomError.badRequest(error, detail);
      }

      req.body.loanDtoModel = loanDtoModel;
      next();
    } catch (error) {
      next(error);
    }
  };

  validatePayLoanDto = (req: Request, res: Response, next: NextFunction) => {
    try {
      const [error, detail, loanDtoModel] = this.payLoanDto.validate({
        ...req.body,
        loanId: req.params.id,
      });

      if (error) {
        throw CustomError.badRequest(error, detail);
      }

      req.body.loanDtoModel = loanDtoModel;
      next();
    } catch (error) {
      next(error);
    }
  };

  validateGetPaymentDetailLoanDto = (req: Request, res: Response, next: NextFunction) => {
    try {
      const [error, detail, getPaymentDetailLoanDtoModel] = this.getPaymentDetailLoanDto.validate({
        ...req.body,
        loanId: req.params.id,
      });

      if (error) {
        throw CustomError.badRequest(error, detail);
      }

      req.body.getPaymentDetailLoanDtoModel = getPaymentDetailLoanDtoModel;
      next();
    } catch (error) {
      next(error);
    }
  };
}
