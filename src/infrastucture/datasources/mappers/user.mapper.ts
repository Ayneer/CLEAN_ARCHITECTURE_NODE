import { PartialSchemaMap } from "joi";
import { CustomError } from "../../../config";
import { UserEntity } from "../../../domain";

export class UserMapper {
  static userEntityFromObject(
    object: { [key: string]: any },
    fielsToDelete: (keyof UserEntity)[] = []
  ): UserEntity {
    const { id, _id, name, email, password, role, img } = object;

    if (!id && !_id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing name");
    if (!email) throw CustomError.badRequest("Missing email");
    if (!password) throw CustomError.badRequest("Missing password");
    if (!role) throw CustomError.badRequest("Missing role");
    if (!img) throw CustomError.badRequest("Missing img");

    const newUser: UserEntity = new UserEntity({
      id: id || _id,
      name,
      email,
      password,
      role,
      img,
    });

    fielsToDelete.forEach((field) => {
      delete newUser[field];
    });

    return newUser;
  }

  static userEntityWitouPasswordFromObject(object: {
    [key: string]: any;
  }): UserEntity {
    const { id, _id, name, email, password, role } = object;

    if (!id || !_id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing name");
    if (!email) throw CustomError.badRequest("Missing email");
    if (!password) throw CustomError.badRequest("Missing password");
    if (!role) throw CustomError.badRequest("Missing role");

    return new UserEntity({
      id: id || _id,
      name,
      email,
      password,
      role,
    });
  }
}
