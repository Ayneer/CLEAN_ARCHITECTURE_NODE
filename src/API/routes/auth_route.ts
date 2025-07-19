import { Router } from "express";
import { AuthController } from "../../infrastucture/controllers/auth/controllers";
import { AuthFirebaseDatasourceImpl } from "../../infrastucture";
import { AuthMiddleware } from "../middlewares/auth_middleware";
import { JsonWebToken, LoginUserDto, RegisterUserDto } from "../../config";
import {
  DeleteAllUser,
  DeleteOneUserById,
  GetAllUser,
  GetOneUserById,
  LoginUser,
  RegisterUser,
} from "../../domain/use-cases/auth";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    //Impl of repository
    const authRepository = new AuthFirebaseDatasourceImpl();

    //Utils
    const signToken = JsonWebToken.generateJWT;
    const validateToken = JsonWebToken.validateJWT;

    //Uses cases
    const registerUserUseCase = new RegisterUser(authRepository, signToken);
    const loginUserUseCase = new LoginUser(authRepository, signToken);
    const getAllUserUseCase = new GetAllUser(authRepository);
    const getOneUserByIdUseCase = new GetOneUserById(authRepository);
    const deleteAllUserUseCase = new DeleteAllUser(authRepository);
    const deleteOneUserByIdUseCase = new DeleteOneUserById(authRepository);

    //Middlewares
    const {
      validateJwt,
      validateUserRegister,
      validateRoles,
      validateUserRegisterByAdmin,
      validateUserLogin,
    } = new AuthMiddleware(
      authRepository,
      validateToken,
      new RegisterUserDto(),
      new LoginUserDto()
    );

    //Controller
    const controller = new AuthController(
      registerUserUseCase,
      loginUserUseCase,
      getAllUserUseCase,
      getOneUserByIdUseCase,
      deleteAllUserUseCase,
      deleteOneUserByIdUseCase
    );

    router.post("/register", [validateUserRegister], controller.registerUser);
    router.post("/login", [validateUserLogin], controller.loginUser);
    router.post(
      "/register-by-admin",
      [validateJwt, validateUserRegisterByAdmin],
      controller.registerUser
    );
    router.get(
      "/",
      [validateJwt, validateRoles(["SUPER_ADMIN", "ADMIN_ROLE"])],
      controller.getAllUsers
    );
    router.get(
      "/:id",
      [validateJwt, validateRoles(["SUPER_ADMIN", "ADMIN_ROLE"])],
      controller.getOneUsers
    ); //get one user
    router.delete(
      "/",
      [validateJwt, validateRoles(["SUPER_ADMIN"])],
      controller.deleteAllUsers
    ); //Delete all user
    router.delete(
      "/:id",
      [validateJwt, validateRoles(["SUPER_ADMIN"])],
      controller.deleteOneUserById
    ); //Delete one user

    return router;
  }
}
