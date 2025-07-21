import { LoanEntity } from "../../entities";

export abstract class LoanRepository {
  abstract createLoan(loan: Partial<LoanEntity>): Promise<LoanEntity>;
  abstract getLoanById(id: string): Promise<LoanEntity | null>;
}