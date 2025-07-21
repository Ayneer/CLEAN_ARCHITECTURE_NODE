import { Router } from "express";
import {
  AuthFirebaseDatasourceImpl,
  ClientFirebaseDatasourceImpl,
  LoanController,
  LoanFirebaseDatasourceImpl,
} from "../../infrastucture";
import { CreateLoanUseCase, PayLoanUseCase } from "../../domain";
import { JsonWebToken } from "../../config/jwt";
import { LoanMiddleware, AuthMiddleware } from "../middlewares";
import { CreateLoanDto, PayLoanDto } from "../../config/dtos";

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
    const payLoanUseCase = new PayLoanUseCase(loanRepository);

    //Middlewares
    const { validateJwt } = new AuthMiddleware(
      authRepository,
      JsonWebToken.validateJWT
    );
    const createLoanDto = new CreateLoanDto();
    const payLoanDto = new PayLoanDto();
    const { validateCreateLoanDto, validatePayLoanDto } = new LoanMiddleware(
      createLoanDto,
      payLoanDto
    );

    //Controller
    const controller = new LoanController(createLoanUseCase, payLoanUseCase);

    router.post(
      "/create",
      [validateJwt, validateCreateLoanDto],
      controller.createLoan
    );

    router.post(
      "/additional-loan",
      [validateJwt, validateCreateLoanDto],
      controller.createLoan
    );

    router.get(
      "/:id",
      [validateJwt, validateCreateLoanDto],
      controller.createLoan
    );

    router.get(
      "/all",
      [validateJwt, validateCreateLoanDto],
      controller.createLoan
    );

    router.post(
      "/:id/payment/create",
      [validateJwt, validatePayLoanDto],
      controller.payLoan
    );

    router.delete(
      "/payment/delete",
      [validateJwt, validateCreateLoanDto],
      controller.createLoan
    );

    router.put(
      "/payment/update",
      [validateJwt, validateCreateLoanDto],
      controller.createLoan
    );

    return router;
  }
}
