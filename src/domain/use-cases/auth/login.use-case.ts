import { JsonWebToken } from "../../../config";
import { LoginUserDto, RegisterUserDto } from "../../../config/dtos/auth";
import { CustomError } from "../../../config/errors/custom.error";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { UserTokenModel } from "../../../models/user_token_model";

interface LoginUseCase {
  excecute(loginUserDto: LoginUserDto): Promise<UserTokenModel>;
}

type SignToken = (
  data: object | string,
  duration?: number
) => Promise<string | null>;

export class LoginUser implements LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken
  ) {}

  async excecute(loginUserDto: LoginUserDto): Promise<UserTokenModel> {
    const user = await this.authRepository.login(loginUserDto);
    const token = await this.signToken({ id: user.id });

    if (!token) throw CustomError.internalServerError();

    return new UserTokenModel({
      user: {
        name: user.name!,
        email: user.email!,
        id: user.id!,
        role: user.role!,
      },
      token,
    });
  }
}
