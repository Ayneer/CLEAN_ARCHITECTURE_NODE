import { LoanMovementChannel, LoanMovementType } from "../enum";

export interface LoanPaymentRequest {
  amount: number; // Monto del movimiento
  date: string; // Fecha real/actual del movimiento, YYYY-MM-DD
  type: LoanMovementType; // Tipo de movimiento
  description?: string; // Descripción del moviemtiento
  movementChannel: LoanMovementChannel; // Canal de pago
}
