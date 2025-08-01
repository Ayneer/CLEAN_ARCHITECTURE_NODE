import { LoanMovementChannel, LoanMovementType } from "../enum";

export interface LoanMovement {
  amount: number; // Monto del movimiento
  date: string; // Fecha real/actual del movimiento, YYYY-MM-DD
  quoteDate: string; // Fecha que le corresponde al pago realizado, YYYY-MM-DD
  type: LoanMovementType; // Tipo de movimiento
  description?: string; // Descripción del moviemtiento
  movementChannel: LoanMovementChannel; // Canal de pago
}
