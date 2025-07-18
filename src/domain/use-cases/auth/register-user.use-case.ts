import { RegisterUserDto, UserDto } from "../../../config/dtos/auth";
import { CustomError } from "../../../config/errors/custom.error";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { SignToken } from "../../../utils/types_util";
import { UserEntity } from "../../entities/user.entity";
import { UseCaseInterface } from "../../interfaces/use_case_interface";
import { UserTokenModel } from "../../models/user_token_model";

export class RegisterUser implements UseCaseInterface<UserDto, UserTokenModel> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken
  ) {}

  async excecute(data: UserDto): Promise<UserTokenModel> {
    const user = await this.authRepository.register(data);
    const token = await this.signToken({ id: user.id });

    if (!token) throw CustomError.internalServerError();

    return new UserTokenModel({
      token,
      user: new UserEntity({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
        img: user.img,
      })
    });
  }
}
