import { CustomError } from "../../../config";
import { LoanDtoModel } from "../../../models/dto";
import { LoanEntity, ClientEntity } from "../../entities";
import { LoanState } from "../../enum";
import { UseCaseInterface } from "../../interfaces/use_case_interface";
import { ClientRepository, LoanRepository } from "../../repositories";

export class CreateLoanUseCase implements UseCaseInterface<LoanDtoModel, LoanEntity> {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async excecute(data: LoanDtoModel): Promise<LoanEntity> {
    try {
      console.log("Executing CreateLoanUseCase with data:", data);
      const { client } = data;

      const clientEntity: ClientEntity | null =
        await this.clientRepository.getClientByDocument(
          client.documentNumber,
          client.documentType
        );
      let createdClient: ClientEntity;

      if (!clientEntity) {
        createdClient = await this.clientRepository.createClient(client);
      } else {
        createdClient = { ...clientEntity };
      }

      const loanEntity: LoanEntity = await this.loanRepository.createLoan({
        amount: data.amount,
        balance: data.amount,
        initialDate: data.initialDate,
        state: LoanState.ACTIVE,
        documents: data.documents,
        rate: data.rate,
        payments: [],
        clientId: createdClient.id,
      });

      return loanEntity;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error(error);
      throw CustomError.internalServerError();
    }
  }
}
