import { NextFunction, Request, Response } from "express";
import { CreateLoanUseCase, LoanEntity } from "../../../domain";

export class LoanController {
  constructor(
    private readonly createLoanUseCase: CreateLoanUseCase,
  ) {}

  createLoan = (req: Request, res: Response, next: NextFunction) => {
    this.createLoanUseCase
      .excecute(req.body.loanDtoModel)
      .then((data: LoanEntity) => res.status(200).json(data))
      .catch((error) => next(error));
  };
 
}
