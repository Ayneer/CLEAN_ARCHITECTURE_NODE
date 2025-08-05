import { CustomError } from "../../../config/errors/custom.error";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { SignToken } from "../../../utils/types_util";
import { UseCaseInterface } from "../../interfaces/use_case_interface";
import { UserTokenModel } from "../../../models/user_token_model";
import { UserDto } from "../../../models";
import { BcryptAdapter } from "../../../config";

export class RegisterUser implements UseCaseInterface<UserDto, UserTokenModel> {
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
        throw CustomError.badRequest("Ya existe el usuario");
      }

      //Register the user
      const newUser = await this.authRepository.createUser(
        {
          ...data,
          password: this.hashPassword(data.password),
          role: data.role ?? "ADMIN_ROLE",
          img: "DEFAULT_IMG_URL",
        }
      );

      //Create a token for the user
      const token = await this.signToken({ id: newUser.id });

      if (!token) throw CustomError.internalServerError();

      return new UserTokenModel({
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          img: newUser.img,
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
