import { Router } from "express";
import {
  AuthFirebaseDatasourceImpl,
  ClientFirebaseDatasourceImpl,
  LoanController,
  LoanFirebaseDatasourceImpl,
} from "../../infrastucture";
import { CreateLoanUseCase } from "../../domain";
import { JsonWebToken } from "../../config/jwt";
import { LoanMiddleware, AuthMiddleware } from "../middlewares";
import { CreateLoanDto } from "../../config/dtos";

export class LoanRoute {
  static get routes(): Router {
    const router = Router();

    //Impl of repository
    const clientRepository = new ClientFirebaseDatasourceImpl();
    const loanRepository = new LoanFirebaseDatasourceImpl();
    const authRepository = new AuthFirebaseDatasourceImpl();

    //Uses cases
    const createLoanUseCase = new CreateLoanUseCase(
      loanRepository,
      clientRepository
    );

    //Middlewares
    const { validateJwt } = new AuthMiddleware(
      authRepository,
      JsonWebToken.validateJWT
    );
    const { validateCreateLoanDto } = new LoanMiddleware(new CreateLoanDto());

    //Controller
    const controller = new LoanController(createLoanUseCase);

    router.post(
      "/create",
      [validateJwt, validateCreateLoanDto],
      controller.createLoan
    );

    return router;
  }
}
