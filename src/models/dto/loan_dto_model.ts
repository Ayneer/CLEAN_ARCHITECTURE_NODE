import {
  LoanPaymentChannel,
  LoanPaymentType,
  LoanRateType,
  LoanState,
  DocumentType,
} from "../../domain/enum";

export class LoanDtoModel {
  amount: number;
  initialDate?: string; //YYYY-MM-DD
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

  constructor(props: LoanDtoModel) {
    this.amount = props.amount;
    this.initialDate = props.initialDate;
    this.documents = props.documents;
    this.rate = props.rate;
    this.client = props.client;
    this.ownerId = props.ownerId;
  }
}
