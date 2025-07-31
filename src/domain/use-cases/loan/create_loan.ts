import { CustomError } from "../../../config";
import { LoanDtoModel } from "../../../models/dto";
import { DateUtil } from "../../../utils/date_util";
import { LoanEntity, ClientEntity } from "../../entities";
import { LoanState } from "../../enum";
import { UseCaseInterface } from "../../interfaces/use_case_interface";
import { ClientRepository, LoanRepository } from "../../repositories";
import { LoanUtils } from "../utils";

export class CreateLoanUseCase
  implements UseCaseInterface<LoanDtoModel, LoanEntity>
{
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async excecute(data: LoanDtoModel): Promise<LoanEntity> {
    try {
      const { client } = data;
      let createdClient: ClientEntity;

      const clientEntity: ClientEntity | null =
        await this.clientRepository.getClientByDocument(
          client.documentNumber,
          client.documentType
        );

      if (!clientEntity) {
        createdClient = await this.clientRepository.createClient(client);
      } else {
        createdClient = { ...clientEntity };
      }

      const code = await LoanUtils.generateConsecutiveUUID();

      const loanEntity: LoanEntity = await this.loanRepository.createLoan({
        code,
        amount: data.amount,
        balance: data.amount,
        interestBalance: 0,
        princilaCurrentAmount: data.amount,
        initialDate: data.initialDate ?? DateUtil.formatDate(new Date()),
        finalDate: "",
        state: data.state ?? LoanState.ACTIVE,
        paymentFrequency: data.paymentFrequency,
        documents: data.documents ?? [],
        rate: data.rate,
        movements: [],
        arrearInterests: [],
        clientId: createdClient.id,
        ownerId: data.ownerId,
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
