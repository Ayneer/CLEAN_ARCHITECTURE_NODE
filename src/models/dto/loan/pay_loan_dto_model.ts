import { LoanMovementChannel, LoanMovementType } from "../../../domain";

export class PayLoanDtoModel {
  loanId: string;
  ownerId: string;
  amount: number;
  date?: string; //YYYY-MM-DD
  type: LoanMovementType;
  channel: LoanMovementChannel;
  description?: string;

  constructor(props: PayLoanDtoModel) {
    this.loanId = props.loanId;
    this.ownerId = props.ownerId;
    this.amount = props.amount;
    this.date = props.date;
    this.type = props.type;
    this.channel = props.channel;
    this.description = props.description;
  }
}
