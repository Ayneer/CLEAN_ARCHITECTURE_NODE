import { Router } from "express";
import { AuthController } from "../../infrastucture/controllers/auth/controllers";
import {
  AuthMongoDatasourceImpl
} from "../../infrastucture";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { JsonWebToken, RegisterUserDto } from "../../config";
import { DeleteAllUser, DeleteOneUserById, GetAllUser, GetOneUserById, LoginUser, RegisterUser } from "../../application/use-cases/auth";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    //Impl of repository
    const authRepository = new AuthMongoDatasourceImpl();

    //
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
    const { validateJwt, validateUserRegister, validateRoles } = new AuthMiddleware(authRepository, validateToken, new RegisterUserDto());

    //Controller
    const controller = new AuthController(
      registerUserUseCase,
      loginUserUseCase,
      getAllUserUseCase,
      getOneUserByIdUseCase,
      deleteAllUserUseCase,
      deleteOneUserByIdUseCase
    );

    router.post("/login", controller.loginUser);
    router.post("/register", [validateJwt, validateUserRegister], controller.registerUser);
    router.get("/", [validateJwt, validateRoles(['SUPER_ADMIN', 'ADMIN_ROLE'])], controller.getAllUsers);
    router.get("/:id", [validateJwt, validateRoles(['SUPER_ADMIN', 'ADMIN_ROLE'])], controller.getOneUsers); //get one user
    router.delete("/", [validateJwt, validateRoles(['SUPER_ADMIN'])], controller.deleteAllUsers); //Delete all user
    router.delete("/:id", [validateJwt, validateRoles(['SUPER_ADMIN'])], controller.deleteOneUserById); //Delete one user

    return router;
  }
}
