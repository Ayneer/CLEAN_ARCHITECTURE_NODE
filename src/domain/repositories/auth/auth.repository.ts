import { DeleteOneUserByIdDto, GetUserByIdDto, LoginUserDto } from "../../../config";
import { UserEntity } from "../../";

export abstract class AuthRepository {
  abstract login(loginUserDto: LoginUserDto): Promise<Partial<UserEntity>>;
  abstract register(registerUser: Partial<UserEntity>): Promise<UserEntity>;
  abstract getAllUsers(): Promise<Partial<UserEntity>[]>;
  abstract getOneUserById(getUserByIdDto: GetUserByIdDto): Promise<Partial<UserEntity>>;
  abstract deleteAllUsers(): Promise<void>;
  abstract deleteUserById(deleteUserByIdDto: DeleteOneUserByIdDto): Promise<Partial<UserEntity>[]>;
  abstract getUserByEmail(email: string, fielsToDelete?: (keyof UserEntity)[]): Promise<UserEntity | null>;
  abstract createUser(registerUser: Partial<UserEntity>): Promise<UserEntity>
}
