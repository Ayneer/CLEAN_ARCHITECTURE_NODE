import {
  LoanPaymentChannel,
  LoanPaymentType,
  LoanRateType,
  LoanState,
} from "../enum";

export class LoanEntity {
  id: string;
  amount: number;
  balance: number; // saldo del prestamo
  initialDate: string; //YYYY-MM-DD
  finalDate?: string; //YYYY-MM-DD
  state: LoanState;
  documents: {
    name: string; // Nombre del documento
    url: string; // URL del documento almacenado
    description: string; // Descripción del documento
    date: string; // Fecha de carga del documento, YYYY-MM-DD
  }[];
  rate: {
    value: number; // Tasa de interes
    type: LoanRateType;
  };
  payments: {
    amount: number; // Monto del pago
    date: string; // Fecha del pago, YYYY-MM-DD
    type: LoanPaymentType; // Tipo de pago
    description?: string; // Descripción del pago
    paymentChannel: LoanPaymentChannel; // Canal de pago
  }[];
  clientId: string; // ID del cliente
  ownerId: string;

  constructor(props: LoanEntity) {
    this.id = props.id;
    this.amount = props.amount;
    this.balance = props.balance;
    this.initialDate = props.initialDate;
    this.finalDate = props.finalDate;
    this.state = props.state;
    this.documents = props.documents;
    this.rate = props.rate;
    this.payments = props.payments;
    this.clientId = props.clientId;
    this.ownerId = props.ownerId;
  }
}
