import mongoose from "mongoose";
import { UserModel } from "./models/user.model";
import { BcryptAdapter, CustomError } from "../../../config";

interface Options {
  mongoUrl: string;
  dbName: string;
  rootUserName: string;
  rootUserEmail: string;
  rootUserPassword: string;
}

type Hash = (password: string) => string;

export class MongoDatabase {

  constructor(
    private readonly hashPassword: Hash = BcryptAdapter.generateBcryptHash,
  ) { }

  async connect(options: Options) {
    const { dbName, mongoUrl, rootUserEmail, rootUserName, rootUserPassword } = options;
    try {

      await mongoose.connect(mongoUrl, {
        dbName,
      });

      //Create default super user ['SUPER_ADMIN']
      const superUser = await UserModel.findOne({ email: rootUserEmail });
      if (!superUser) {
        await new UserModel({
          email: rootUserEmail,
          name: rootUserName,
          password: this.hashPassword(rootUserPassword),
          roles: ['SUPER_ADMIN']
        }).save();
      } else if (!superUser.roles.some(role => role == 'SUPER_ADMIN')) {
        throw CustomError.internalServerError('User admin error');
      }

      console.log("Mongo connection successfull");
    } catch (error) {
      console.log("Mongo connection error");
      throw error;
    }
  }


}
