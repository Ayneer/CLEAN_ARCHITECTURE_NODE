import { NextFunction, Request, Response } from "express";
import { CustomError, JsonWebToken } from "../../config";
import { AuthRepository } from "../../domain/repositories/auth/auth.repository";

export class AuthMiddleware {
  constructor(private readonly authRepository: AuthRepository) {}

  validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");

    if (!header || !header.startsWith("Bearer "))
      throw CustomError.unauthorized("You do not have permition to see this");

    const token = header.split(" ").at(1) ?? "";

    try {
      const data = await JsonWebToken.validateJWT<{ id: string }>(token);
      if (!token || !data || !data.id)
        throw CustomError.unauthorized("You do not have permition to see this");

      const user = await this.authRepository.getOneUserById({ id: data.id });

      if (!user)
        throw CustomError.unauthorized("You do not have permition to see this");

      req.body.user = user;

      next();
    } catch (error) {
      next(error);
    }
  };
}
