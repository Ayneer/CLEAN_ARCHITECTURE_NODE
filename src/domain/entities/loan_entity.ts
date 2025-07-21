import {
  LoanMovementChannel,
  LoanMovementType,
  LoanRateType,
  LoanState,
} from "../enum";

export class LoanEntity {
  id: string;
  amount: number; // monto inicial del prestamo
  balance: number; // saldo del prestamo más intereses
  interestBalance: number; // saldo de intereses del prestamo
  princilaCurrentAmount: number; // monto actual del capital - varia con cada movimiento
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
  movements: {
    amount: number; // Monto del movimiento
    date: string; // Fecha del movimiento, YYYY-MM-DD
    type: LoanMovementType; // Tipo de movimiento
    description?: string; // Descripción del moviemtiento
    movementChannel: LoanMovementChannel; // Canal de pago
  }[];
  clientId: string; // ID del cliente
  ownerId: string;

  constructor(props: LoanEntity) {
    this.id = props.id;
    this.amount = props.amount;
    this.balance = props.balance;
    this.interestBalance = props.interestBalance;
    this.princilaCurrentAmount = props.princilaCurrentAmount;
    this.initialDate = props.initialDate;
    this.finalDate = props.finalDate;
    this.state = props.state;
    this.documents = props.documents;
    this.rate = props.rate;
    this.movements = props.movements;
    this.clientId = props.clientId;
    this.ownerId = props.ownerId;
  }
}
