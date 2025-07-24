import { CustomError } from "../../../config";
import { GetPaymentDetailLoanDtoModel } from "../../../models/dto";
import { DateUtil } from "../../../utils/date_util";
import { LoanEntity } from "../../entities";
import { LoanMovementType, LoanRateType, LoanState } from "../../enum";
import { UseCaseInterface } from "../../interfaces/use_case_interface";
import { LoanRepository } from "../../repositories";
import { LoanUtils } from "../utils";

export class GetPaymentDetailLoanUseCase
  implements UseCaseInterface<GetPaymentDetailLoanDtoModel, LoanEntity>
{
  constructor(private readonly loanRepository: LoanRepository) {}

  async excecute(data: GetPaymentDetailLoanDtoModel): Promise<LoanEntity> {
    try {
      const { loanId, ownerId } = data;
      //Search for the loan by ID
      const loanEntity: LoanEntity | null =
        await this.loanRepository.getLoanById(loanId);
      if (!loanEntity) {
        throw CustomError.notFound("Loan not found");
      }

      //Validate loan owner
      if (loanEntity.ownerId !== ownerId) {
        throw CustomError.forbidden(
          "You are not allowed to see this loan, it does not belong to you"
        );
      }

      const newLoan = LoanUtils.setLoanInterests(new LoanEntity(loanEntity));

      await this.loanRepository.updateLoan(loanId, {
        ...newLoan,
        finalDate: "",
      });
      return newLoan;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error(error);
      throw CustomError.internalServerError();
    }
  }
}
