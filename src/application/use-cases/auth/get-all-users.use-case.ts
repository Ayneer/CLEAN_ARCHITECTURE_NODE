import { UserEntity } from "../../../domain";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";

interface GetAllUserUseCase {
    excecute(): Promise<Partial<UserEntity>[]>;
}


export class GetAllUser implements GetAllUserUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    async excecute(): Promise<Partial<UserEntity>[]> {
        const users = await this.authRepository.getAllUsers();

        return users;
    }
}
