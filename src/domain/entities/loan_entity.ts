import {
  LoanRateType,
  LoanState,
} from "../enum";
import { LoanArrearInterest } from "../interfaces/arrear_interest_interface";
import { LoanMovement } from "../interfaces/loan_movement_interface";

export class LoanEntity {
  id: string;
  code: string;
  amount: number; // monto inicial del prestamo
  balance: number; // saldo del capital más intereses
  interestBalance: number; // saldo de intereses del prestamo
  princilaCurrentAmount: number; // monto actual del capital - varia con los abonos al capital
  initialDate: string; //YYYY-MM-DD
  finalDate?: string; //YYYY-MM-DD
  state: LoanState;
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
  movements: LoanMovement[];
  arrearInterests: LoanArrearInterest[]; //Intereses en mora
  clientId: string; // ID del cliente
  ownerId: string;

  constructor(props: LoanEntity) {
    this.id = props.id;
    this.code = props.code;
    this.amount = props.amount;
    this.balance = props.balance;
    this.interestBalance = props.interestBalance;
    this.princilaCurrentAmount = props.princilaCurrentAmount;
    this.initialDate = props.initialDate;
    this.finalDate = props.finalDate;
    this.state = props.state;
    this.paymentFrequency = props.paymentFrequency;
    this.documents = props.documents;
    this.rate = props.rate;
    this.movements = props.movements;
    this.arrearInterests = props.arrearInterests;
    this.clientId = props.clientId;
    this.ownerId = props.ownerId;
  }
}
