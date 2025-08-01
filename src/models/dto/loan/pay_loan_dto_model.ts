import { LoanPaymentRequest } from "../../../domain/interfaces/loan_payment_request_interface";

export class PayLoanDtoModel {
  loanId: string;
  ownerId: string;
  payments: LoanPaymentRequest[];

  constructor(props: PayLoanDtoModel) {
    this.loanId = props.loanId;
    this.ownerId = props.ownerId;
    this.payments = props.payments;
  }
}
