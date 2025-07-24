import { Router } from "express";
import {
  AuthFirebaseDatasourceImpl,
  ClientFirebaseDatasourceImpl,
  LoanController,
  LoanFirebaseDatasourceImpl,
} from "../../infrastucture";
import {
  CreateLoanUseCase,
  GetPaymentDetailLoanUseCase,
  PayLoanUseCase,
} from "../../domain";
import { JsonWebToken } from "../../config/jwt";
import { LoanMiddleware, AuthMiddleware } from "../middlewares";
import { CreateLoanDto, GetPaymentDetailLoanDto, PayLoanDto } from "../../config/dtos";

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
    const getPaymentDetailLoanUseCase = new GetPaymentDetailLoanUseCase(
      loanRepository
    );

    //Dtos
    const createLoanDto = new CreateLoanDto();
    const payLoanDto = new PayLoanDto();
    const getPaymentDetailLoanDto = new GetPaymentDetailLoanDto();

    //Middlewares
    const { validateJwt } = new AuthMiddleware(
      authRepository,
      JsonWebToken.validateJWT
    );
    const { validateCreateLoanDto, validatePayLoanDto, validateGetPaymentDetailLoanDto } = new LoanMiddleware(
      createLoanDto,
      payLoanDto,
      getPaymentDetailLoanDto
    );

    //Controller
    const controller = new LoanController(
      createLoanUseCase,
      payLoanUseCase,
      getPaymentDetailLoanUseCase
    );

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
      "/:id/payment/detail",
      [validateJwt, validateGetPaymentDetailLoanDto],
      controller.getPaymentDetailLoan
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
