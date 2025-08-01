import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../config";
import { AuthRepository } from "../../domain/repositories/auth/auth.repository";
import { UserEntity } from "../../domain";
import { Dto } from "../../config/dtos/dto";
import { Token } from "../../utils/types_util";
import { UserDto, UserLoginDtoModel } from "../../models";

export class AuthMiddleware {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly validateToken: Token,
    private readonly registerUserDto?: Dto<UserDto>,
    private readonly userLoginDto?: Dto<UserLoginDtoModel>
  ) {}

  validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.header("Authorization");

      if (!header?.startsWith("Bearer "))
        throw CustomError.unauthorized(
          "You do not have permition to see this - Bearer"
        );

      const token = header.split(" ").at(1)?.trim() ?? "";
      const data = await this.validateToken<{ id: string }>(token);
      if (!token || !data?.id)
        throw CustomError.unauthorized(
          "You do not have permition to see this - token"
        );

      const user = await this.authRepository.getOneUserById({ id: data.id });

      if (!user)
        throw CustomError.unauthorized(
          "You do not have permition to see this - user"
        );

      req.body.user = user;
      next();
    } catch (error) {
      if (error instanceof CustomError) {
        next(
          CustomError.unauthorized(
            "You do not have permition to see this - user"
          )
        );
      } else {
        next(error);
      }
    }
  };

  validateUserRegisterByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [error, registerUserDto] = this.registerUserDto!.validate(
        req.body
      );
      if (error) {
        res.status(400).json(error);
      }

      req.body.registerUserDto = registerUserDto;

      next();
    } catch (error) {
      next(error);
    }
  };

  validateUserRegister = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [error, detail, registerUserDto] = this.registerUserDto!.validate(
        req.body
      );

      if (error) {
        throw CustomError.badRequest(error, detail);
      }

      req.body.registerUserDto = registerUserDto;
      next();
    } catch (error) {
      next(error);
    }
  };

  validateUserLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [error, detail, userLoginDtoModel] = this.userLoginDto!.validate(
        req.body
      );

      if (error) {
        throw CustomError.badRequest(error, detail);
      }

      req.body.userLoginDtoModel = userLoginDtoModel;
      next();
    } catch (error) {
      next(error);
    }
  };

  validateRoles =
    (allowedRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const userLogged = req.body.user as Partial<UserEntity>;

      if (allowedRoles.some((role) => userLogged.role?.includes(role))) {
        next();
      } else {
        next(CustomError.unauthorized("You do not have permition to do this"));
      }
    };
}
