import { GetUserByIdDto } from "../../../config";
import { UserEntity } from "../../../domain";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";

interface GetOneUserByIdUseCase {
    excecute(getUserByIdDto: GetUserByIdDto): Promise<Partial<UserEntity>>;
}


export class GetOneUserById implements GetOneUserByIdUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    async excecute(getUserByIdDto: GetUserByIdDto): Promise<Partial<UserEntity>> {
        const users = await this.authRepository.getOneUserById(getUserByIdDto);

        return users;
    }
}
