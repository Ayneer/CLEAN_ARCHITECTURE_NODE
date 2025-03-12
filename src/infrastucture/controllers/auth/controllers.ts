import { NextFunction, Request, Response } from "express";
import { AuthRepository } from "../../../domain";
import { LoginUser, RegisterUser } from "../../../application/use-cases/auth";
import { LoginUserDto, RegisterUserDto } from "../../../config";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUser,
    private readonly loginUserUseCase: LoginUser
  ) {}

  registerUser = (req: Request, res: Response, next: NextFunction) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      res.status(400).json(error);
    }
    this.registerUserUseCase
      .excecute(registerUserDto!)
      .then(res.json)
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
}
