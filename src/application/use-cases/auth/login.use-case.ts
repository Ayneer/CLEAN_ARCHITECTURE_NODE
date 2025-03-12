import { JsonWebToken } from "../../../config";
import { LoginUserDto, RegisterUserDto } from "../../../config/dtos/auth";
import { CustomError } from "../../../config/errors/custom.error";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { UserToken } from "./utils.auth.use-case";

interface LoginUseCase {
  excecute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

type SignToken = (data: object | string, duration?: number) => Promise<string | null>;

export class LoginUser implements LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken
) {}

  async excecute(loginUserDto: LoginUserDto): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDto);
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
