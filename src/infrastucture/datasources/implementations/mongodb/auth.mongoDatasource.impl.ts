import { AuthRepository, UserEntity } from "../../../../domain";
import {
  BcryptAdapter,
  CustomError,
  DeleteOneUserByIdDto,
  envs,
  GetUserByIdDto,
  LoginUserDto,
} from "../../../../config";
import { UserModel } from "../../../../drivers/data";
import { UserMapper } from "../../mappers";
import { UserDto } from "../../../../models";
import {
  Hash,
  CompareHash,
  UserMapperType,
} from "../../../../utils/types_util";

export class AuthMongoDatasourceImpl implements AuthRepository {
  constructor(
    private readonly hashPassword: Hash = BcryptAdapter.generateBcryptHash,
    private readonly compareHashPassword: CompareHash = BcryptAdapter.compareBcryptHash,
    private readonly userMapper: UserMapperType = UserMapper.userEntityFromObject
  ) { }
  
  getUserByEmail(email: string): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  createUser(registerUserDto: UserDto, fielsToDelete?: (keyof UserEntity)[]): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  async login(loginUserDto: LoginUserDto): Promise<Partial<UserEntity>> {
    // try {
    //   const { email, password } = loginUserDto;

    //   //verificar el correo y comparar contraseña
    //   const userExist = await UserModel.findOne({ email });
    //   if (!userExist || !this.compareHashPassword(password, userExist.password))
    //     throw CustomError.badRequest("Wrong credentials");

    //   //mapear respuesta
    //   return Promise.resolve(this.userMapper(userExist));
    // } catch (error) {
    //   if (error instanceof CustomError) {
    //     throw error;
    //   }
    //   throw CustomError.internalServerError();
    // }
    throw CustomError.internalServerError();
  }

  async register(registerUserDto: UserDto): Promise<UserEntity> {
    try {
      const { name, email, password, role } = registerUserDto;

      //verificar el correo
      const emailExist = await UserModel.findOne({ email });
      if (emailExist) throw CustomError.badRequest("User already exists");

      // hash contraseña
      const user = await UserModel.create({
        name,
        email,
        password: this.hashPassword(password),
        role
      });

      await user.save();
      //mapear respuesta

      return Promise.resolve(this.userMapper(user));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }

  async getAllUsers(): Promise<Partial<UserEntity>[]> {
    try {
      //verificar el correo y comparar contraseña
      const users = await UserModel.find({});

      //mapear respuesta
      return Promise.resolve(users.map(user => this.userMapper(user, ['password'])));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }

  async getOneUserById(getUserByIdDto: GetUserByIdDto): Promise<Partial<UserEntity>> {
    try {
      const { id } = getUserByIdDto;
      //verificar el correo
      const userExist = await UserModel.findOne({ _id: id });
      if (!userExist) throw CustomError.badRequest("User does not exist");

      //mapear respuesta
      return Promise.resolve(this.userMapper(userExist));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }

  async deleteAllUsers(): Promise<void> {
    try {
      await UserModel.deleteMany({ email: { $ne: envs.ROOT_USER_EMAIL } });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }

  async deleteUserById(deleteUserByIdDto: DeleteOneUserByIdDto): Promise<Partial<UserEntity>[]> {
    try {
      const { id } = deleteUserByIdDto;

      //verificar el correo
      const userExist = await UserModel.findOneAndDelete({ _id: id, email: { $ne: envs.ROOT_USER_EMAIL } });
      if (!userExist) throw CustomError.badRequest("User does not exist or does not allow delete");

      return await this.getAllUsers();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }
}
