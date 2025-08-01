import { CustomError } from "../../../config/errors/custom.error";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { SignToken, UserMapperType } from "../../../utils/types_util";
import { UseCaseInterface } from "../../interfaces/use_case_interface";
import { UserTokenModel } from "../../../models/user_token_model";
import { UserDto } from "../../../models";
import { UserMapper } from "../../../infrastucture";
import { BcryptAdapter } from "../../../config";

export class RegisterUser implements UseCaseInterface<UserDto, UserTokenModel> {
  private readonly userMapper: UserMapperType = UserMapper.userEntityFromObject;
  private readonly hashPassword = BcryptAdapter.generateBcryptHash;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken
  ) {}

  async excecute(data: UserDto): Promise<UserTokenModel> {
    try {
      //Verify if the user exists
      const userExist = await this.authRepository.getUserByEmail(data.email);
      if (userExist) {
        throw CustomError.badRequest("User already exists");
      }

      //Register the user
      const newUser = await this.authRepository.createUser(
        {
          ...data,
          password: this.hashPassword(data.password),
          role: data.role ?? "ADMIN_ROLE",
          img: data.img ?? "DEFAULT_IMG_URL",
        },
        ["password"]
      );

      //Create a token for the user
      const token = await this.signToken({ id: newUser.id });

      if (!token) throw CustomError.internalServerError();

      return new UserTokenModel({
        token,
        user: {
          ...newUser,
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error(error);
      throw CustomError.internalServerError();
    }
  }
}
