import { DeleteOneUserByIdDto, GetUserByIdDto } from "../../../config";
import { UserEntity } from "../../../domain";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";

interface DeleteOneUserByIdUseCase {
    excecute(getUserByIdDto: DeleteOneUserByIdDto): Promise<Partial<UserEntity>[]>;
}


export class DeleteOneUserById implements DeleteOneUserByIdUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    async excecute(getUserByIdDto: GetUserByIdDto): Promise<Partial<UserEntity>[]> {
        const users = await this.authRepository.deleteUserById(getUserByIdDto);

        return users;
    }
}
