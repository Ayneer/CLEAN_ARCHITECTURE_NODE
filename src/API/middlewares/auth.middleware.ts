import { NextFunction, Request, Response } from "express";
import { CustomError, ErrorModel, UserDto } from "../../config";
import { AuthRepository } from "../../domain/repositories/auth/auth.repository";
import { UserEntity } from "../../domain";
import { Dto } from "../../config/dtos/dto";

type SignToken = <T>(token: string) => Promise<T | null>;

export class AuthMiddleware {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly validateToken: SignToken,
    private readonly registerUserDto: Dto
  ) {}

  validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.header("Authorization");

      if (!header || !header.startsWith("Bearer "))
        throw CustomError.unauthorized(
          "You do not have permition to see this - Bearer"
        );

      const token = header.split(" ").at(1)?.trim() ?? "";
      const data = await this.validateToken<{ id: string }>(token);
      if (!token || !data || !data.id)
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
      const [error, detail, registerUserDto] = this.registerUserDto.validate<UserDto>(
        req.body
      );
      if (error) {
        res.status(400).json(error);
      }

      const userLogged = req.body.user as Partial<UserEntity>;

      // if (
      //   (registerUserDto?.roles?.some((role) =>
      //     ["ADMIN_ROLE"].includes(role)
      //   ) &&
      //     !userLogged.role?.includes("SUPER_ADMIN")) ||
      //   ((registerUserDto?.roles?.some((role) =>
      //     ["USER_ROLE"].includes(role)
      //   ) ||
      //     !registerUserDto?.roles) &&
      //     !userLogged.role?.some((role) =>
      //       ["ADMIN_ROLE", "SUPER_ADMIN"].includes(role)
      //     ))
      // ) {
      //   throw CustomError.unauthorized(
      //     "You do not have permition to see this - Create User"
      //   );
      // }

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
      const [error, detail, registerUserDto] = this.registerUserDto.validate<UserDto>(
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
