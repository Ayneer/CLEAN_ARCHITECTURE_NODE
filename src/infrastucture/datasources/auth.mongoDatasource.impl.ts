import { AuthRepository, UserEntity } from "../../domain";
import {
  BcryptAdapter,
  CustomError,
  GetUserByIdDto,
  LoginUserDto,
  RegisterUserDto,
} from "../../config";
import { UserModel } from "../../drivers/data";
import { UserMapper } from "./mappers";

type hash = (password: string) => string;
type compareHash = (password: string, hash: string) => boolean;
type userMapper = (object: { [key: string]: any }) => UserEntity;

export class AuthMongoDatasourceImpl implements AuthRepository {
  constructor(
    private readonly hashPassword: hash = BcryptAdapter.generateBcryptHash,
    private readonly compareHashPassword: compareHash = BcryptAdapter.compareBcryptHash,
    private readonly userMapper: userMapper = UserMapper.userEntityFromObject
  ) {}

  getAllUsers(): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  async getOneUserById(getUserByIdDto: GetUserByIdDto): Promise<UserEntity> {
    try {
      const { id } = getUserByIdDto;

      //verificar el correo y comparar contraseña
      const userExist = await UserModel.findOne({ id });
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

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    try {
      const { email, password } = loginUserDto;

      //verificar el correo y comparar contraseña
      const userExist = await UserModel.findOne({ email });
      if (!userExist || !this.compareHashPassword(password, userExist.password))
        throw CustomError.badRequest("Wrong credentials");

      //mapear respuesta
      return Promise.resolve(this.userMapper(userExist));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    try {
      const { name, email, password } = registerUserDto;

      //verificar el correo
      const emailExist = await UserModel.findOne({ email });
      if (emailExist) throw CustomError.badRequest("User already exists");

      // hash contraseña
      const user = await UserModel.create({
        name,
        email,
        password: this.hashPassword(password),
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
}
