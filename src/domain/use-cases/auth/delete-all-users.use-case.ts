import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";

interface DeleteAllUserUseCase {
    excecute(): Promise<void>;
}


export class DeleteAllUser implements DeleteAllUserUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    async excecute(): Promise<void> {
        await this.authRepository.deleteAllUsers();
    }
}
