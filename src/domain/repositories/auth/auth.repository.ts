import { DeleteOneUserByIdDto, GetUserByIdDto, LoginUserDto, UserDto } from "../../../config";
import { UserEntity } from "../../";

export abstract class AuthRepository {
  constructor() { }

  abstract login(loginUserDto: LoginUserDto): Promise<Partial<UserEntity>>;
  abstract register(registerUserDto: UserDto): Promise<Partial<UserEntity>>;
  abstract getAllUsers(): Promise<Partial<UserEntity>[]>;
  abstract getOneUserById(getUserByIdDto: GetUserByIdDto): Promise<Partial<UserEntity>>;
  abstract deleteAllUsers(): Promise<void>;
  abstract deleteUserById(deleteUserByIdDto: DeleteOneUserByIdDto): Promise<Partial<UserEntity>[]>;
}
