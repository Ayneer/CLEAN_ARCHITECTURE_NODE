import { LoanEntity, ClientEntity } from "../domain/entities";

export class LoanModel {
  loan: LoanEntity;
  client: ClientEntity;
  
  constructor(props: LoanModel ) {
    this.loan = props.loan;
    this.client = props.client;
  }
}
