import { Router } from "express";
import { AuthController } from "../../infrastucture/controllers/auth/controllers";
import {
  AuthMongoDatasourceImpl
} from "../../infrastucture";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { JsonWebToken } from "../../config";
import { LoginUser, RegisterUser } from "../../application/use-cases/auth";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    //Impl of repository
    const authRepository = new AuthMongoDatasourceImpl();

    //
    const signToken = JsonWebToken.generateJWT;

    //Uses cases
    const registerUserUseCase = new RegisterUser(authRepository, signToken);
    const loginUserUseCase = new LoginUser(authRepository, signToken);
    
    //Middlewares
    const authMiddleware = new AuthMiddleware(authRepository);

    //Controller
    const controller = new AuthController(
      registerUserUseCase,
      loginUserUseCase
    );

    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.get("/", [authMiddleware.validateJwt], controller.registerUser);

    return router;
  }
}
