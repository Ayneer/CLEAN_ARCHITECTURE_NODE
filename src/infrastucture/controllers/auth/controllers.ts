import { NextFunction, Request, Response } from "express";
import {
  GetAllUser,
  LoginUser,
  RegisterUser,
  GetOneUserById,
  DeleteAllUser,
  DeleteOneUserById,
} from "../../../domain/use-cases/auth";
import {
  DeleteOneUserByIdDto,
  GetUserByIdDto,
  LoginUserDto,
} from "../../../config";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUser,
    private readonly loginUserUseCase: LoginUser,
    private readonly getAllUsersUseCase: GetAllUser,
    private readonly getOneUserByIdUseCase: GetOneUserById,
    private readonly deleteAllUsersUseCase: DeleteAllUser,
    private readonly deleteOneUserByIdUseCase: DeleteOneUserById
  ) {}

  registerUser = (req: Request, res: Response, next: NextFunction) => {
    this.registerUserUseCase
      .excecute(req.body.registerUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => next(error));
  };

  loginUser = (req: Request, res: Response, next: NextFunction) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      res.status(400).json(error);
    }
    this.loginUserUseCase
      .excecute(loginUserDto!)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    this.getAllUsersUseCase
      .excecute()
      .then((users) => res.json(users))
      .catch((error) => next(error));
  };

  getOneUsers = (req: Request, res: Response, next: NextFunction) => {
    const [error, userIdDto] = GetUserByIdDto.validate(req.params);
    if (error) {
      res.status(400).json(error);
    }

    this.getOneUserByIdUseCase
      .excecute(userIdDto!)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  deleteAllUsers = (req: Request, res: Response, next: NextFunction) => {
    this.deleteAllUsersUseCase
      .excecute()
      .then((users) => res.json(users))
      .catch((error) => next(error));
  };

  deleteOneUserById = (req: Request, res: Response, next: NextFunction) => {
    const [error, userIdDto] = DeleteOneUserByIdDto.validate(req.params);
    if (error) {
      res.status(400).json(error);
    }

    this.deleteOneUserByIdUseCase
      .excecute(userIdDto!)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };
}
