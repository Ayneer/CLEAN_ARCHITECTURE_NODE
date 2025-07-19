import { DeleteOneUserByIdDto, GetUserByIdDto, LoginUserDto } from "../../../config";
import { UserEntity } from "../../";
import { UserDto } from "../../../models";

export abstract class AuthRepository {
  constructor() { }

  abstract login(loginUserDto: LoginUserDto): Promise<Partial<UserEntity>>;
  abstract register(registerUserDto: UserDto): Promise<UserEntity>;
  abstract getAllUsers(): Promise<Partial<UserEntity>[]>;
  abstract getOneUserById(getUserByIdDto: GetUserByIdDto): Promise<Partial<UserEntity>>;
  abstract deleteAllUsers(): Promise<void>;
  abstract deleteUserById(deleteUserByIdDto: DeleteOneUserByIdDto): Promise<Partial<UserEntity>[]>;
  abstract getUserByEmail(email: string, fielsToDelete?: (keyof UserEntity)[]): Promise<UserEntity | null>;
  abstract createUser(registerUserDto: UserDto, fielsToDelete?: (keyof UserEntity)[]): Promise<UserEntity>
}
