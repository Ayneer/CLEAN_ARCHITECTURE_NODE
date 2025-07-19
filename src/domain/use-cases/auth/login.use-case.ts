import { BcryptAdapter, JsonWebToken } from "../../../config";
import { LoginUserDto, RegisterUserDto } from "../../../config/dtos/auth";
import { CustomError } from "../../../config/errors/custom.error";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { UserLoginDtoModel } from "../../../models/dto";
import { UserTokenModel } from "../../../models/user_token_model";
import { SignToken } from "../../../utils/types_util";
import { UseCaseInterface } from "../../interfaces/use_case_interface";

export class LoginUser implements UseCaseInterface<UserLoginDtoModel, UserTokenModel> {
  private hashPassword = BcryptAdapter.generateBcryptHash;
  private comparePassword = BcryptAdapter.compareBcryptHash;
  
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken
  ) {}

  async excecute(loginUserDto: UserLoginDtoModel): Promise<UserTokenModel> {
    const { email, password } = loginUserDto;

    //Validate the email and password
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw CustomError.badRequest("Credentials are not valid");
    }

    //Compare the password
    const isPasswordValid = this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw CustomError.badRequest("Credentials are not valid");
    }

    //Generate a token for the user
    const token = await this.signToken({ id: user.id });

    if (!token) throw CustomError.internalServerError();

    return new UserTokenModel({
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
        role: user.role,
        img: user.img,
      },
      token,
    });
  }
}
