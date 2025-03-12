import { JsonWebToken } from "../../../config";
import { RegisterUserDto } from "../../../config/dtos/auth";
import { CustomError } from "../../../config/errors/custom.error";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { UserToken } from "./utils.auth.use-case";

interface RegisterUserUseCase {
  excecute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignToken = (data: object | string, duration?: number) => Promise<string | null>;

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken
) {}

  async excecute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    const user = await this.authRepository.register(registerUserDto!);
    const token = await this.signToken({ id: user.id });

    if(!token)
        throw CustomError.internalServerError();

    return {
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
      token,
    };
  }
}
