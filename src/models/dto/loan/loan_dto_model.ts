import { LoanRateType, DocumentType, LoanState } from "../../../domain/enum";

export class LoanDtoModel {
  amount: number;
  initialDate?: string; //YYYY-MM-DD
  paymentFrequency: number; // Frecuencia de pago del prestamo
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
  client: {
    name: string;
    documentNumber: string;
    documentType: DocumentType;
    email?: string;
    phone: string;
    address: string;
    city: string;
  };
  ownerId: string;
  state?: LoanState;

  constructor(props: LoanDtoModel) {
    this.amount = props.amount;
    this.initialDate = props.initialDate;
    this.paymentFrequency = props.paymentFrequency;
    this.documents = props.documents;
    this.rate = props.rate;
    this.client = props.client;
    this.ownerId = props.ownerId;
    this.state = props.state;
  }
}
