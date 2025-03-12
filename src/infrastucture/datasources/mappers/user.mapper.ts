import { CustomError } from "../../../config";
import { UserEntity } from "../../../domain";

export class UserMapper {
    static userEntityFromObject(object: {[key: string]: any}): UserEntity{
        const { id, _id, name, email, password, roles } = object;
        
        if(!id || !_id) throw CustomError.badRequest('Missing id');
        if(!name) throw CustomError.badRequest('Missing name');
        if(!email) throw CustomError.badRequest('Missing email');
        if(!password) throw CustomError.badRequest('Missing password');
        if(!roles || typeof roles !== 'object' || roles.length <= 0) throw CustomError.badRequest('Missing roles');
        
        return new UserEntity(
            id || _id,
            name,
            email,
            password,
            roles
        );
    }
}