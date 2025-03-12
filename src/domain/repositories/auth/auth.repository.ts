import { GetUserByIdDto, LoginUserDto, RegisterUserDto } from "../../../config";
import { UserEntity } from "../../";

export abstract class AuthRepository {
  constructor() {}

  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;

  abstract getAllUsers(): Promise<UserEntity>;
  abstract getOneUserById(getUserByIdDto: GetUserByIdDto): Promise<UserEntity>;
}
