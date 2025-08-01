import { NextFunction, Request, Response } from "express";
import {
  CreateLoanUseCase,
  GetPaymentDetailLoanUseCase,
  LoanEntity,
  PayLoanUseCase,
} from "../../../domain";

export class LoanController {
  constructor(
    private readonly createLoanUseCase: CreateLoanUseCase,
    private readonly payLoanUseCase: PayLoanUseCase,
    private readonly getPaymentDetailLoanUseCase: GetPaymentDetailLoanUseCase
  ) {}

  createLoan = (req: Request, res: Response, next: NextFunction) => {
    this.createLoanUseCase
      .excecute(req.body.loanDtoModel)
      .then((data: LoanEntity) => res.status(200).json(data))
      .catch((error) => next(error));
  };

  getPaymentDetailLoan = (req: Request, res: Response, next: NextFunction) => {
    this.getPaymentDetailLoanUseCase
      .excecute(req.body.getPaymentDetailLoanDtoModel)
      .then((data: LoanEntity) => res.status(200).json(data))
      .catch((error) => next(error));
  };

  payLoan = (req: Request, res: Response, next: NextFunction) => {
    this.payLoanUseCase
      .excecute(req.body.loanDtoModel)
      .then((data: LoanEntity) => res.status(200).json(data))
      .catch((error) => next(error));
  };
}
