export class GetPaymentDetailLoanDtoModel {
  loanId: string;
  ownerId: string;

  constructor(props: GetPaymentDetailLoanDtoModel) {
    this.loanId = props.loanId;
    this.ownerId = props.ownerId;
  }
}
