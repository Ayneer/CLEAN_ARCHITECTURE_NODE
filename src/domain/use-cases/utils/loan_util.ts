import { DateUtil } from "../../../utils/date_util";
import { LoanEntity } from "../../entities";
import {
  LoanMovementType,
  LoanRateType,
  LoanState,
  PaymentFrequency,
} from "../../enum";
import { v4 as uuidv4 } from "uuid";
import { LoanArrearInterest } from "../../interfaces/arrear_interest_interface";

export class LoanUtils {
  public static setLoanInterests(loanEntity: LoanEntity): LoanEntity {
    const interestAmount = this.getInterestAmount(loanEntity); //Obtengo el valor del interes que se debe pagar por cada periodo del prestamo
    const lastPaymentDate = this.getLastRelevantDate(loanEntity); //Obtengo la ultima fecha de pago realizado
    const interestNumber = this.getMissedPaymentPeriods(
      //Obtengo los periodos del prestamo que no se han pagado, desde el ultimo pago
      loanEntity.paymentFrequency,
      lastPaymentDate
    );
    const { updatedArrearInterests, updatedInterestBalance } =
      this.calculateNewArrearInterests(
        loanEntity,
        interestAmount,
        interestNumber,
        lastPaymentDate
      );

    const updatedLoanEntity: LoanEntity = {
      ...loanEntity,
      balance:
        loanEntity.balance -
        loanEntity.interestBalance +
        updatedInterestBalance,
      interestBalance: updatedInterestBalance,
      arrearInterests: updatedArrearInterests,
      state:
        updatedArrearInterests.length > 0
          ? LoanState.ARREAR_INTEREST
          : loanEntity.state,
    };

    return updatedLoanEntity;
  }

  private static getLastRelevantDate(loan: LoanEntity): Date {
    const { initialDate, arrearInterests, movements } = loan;

    //Se obtiene la fecha del último interes en mora (la mas reciente)
    //A partir de esta su buscarán nuevos intereses en mora (Sí los tiene)
    if (arrearInterests.length > 0) {
      return DateUtil.parseDate(
        arrearInterests.reduce(
          (prev, current) =>
            DateUtil.parseDate(prev.date) > DateUtil.parseDate(current.date)
              ? prev
              : current,
          arrearInterests[0]
        ).date
      );
    }

    //Sí no tiene intereses en mora, buscamos por la fecha del último pago a intereses que tenga
    const filteredMovements = movements.filter(
      (movement) =>
        movement.type === LoanMovementType.INTEREST_PAYMENT ||
        movement.type === LoanMovementType.QUOTA_PAYMENT
    );

    if (filteredMovements.length > 0) {
      return DateUtil.parseDate(
        filteredMovements.reduce(
          (prev, current) =>
            DateUtil.parseDate(prev.quoteDate) >
            DateUtil.parseDate(current.quoteDate)
              ? prev
              : current,
          filteredMovements[0]
        ).quoteDate
      );
    }

    //Si no tiene retorno la fecha inicial del prestamo
    return DateUtil.parseDate(initialDate);
  }

  private static getMissedPaymentPeriods(
    frequency: number,
    fromDate: Date
  ): number {
    const currentDate = DateUtil.getCurrentDate();
    const daysDiff = DateUtil.getDifferenceInDays(fromDate, currentDate);
    const monthsDiff = DateUtil.getDifferenceInMonths(fromDate, currentDate);

    switch (frequency) {
      case PaymentFrequency.MONTHLY:
        return monthsDiff;
      case PaymentFrequency.BIWEEKLY:
        return Math.floor(daysDiff / PaymentFrequency.BIWEEKLY);
      case PaymentFrequency.WEEKLY:
        return Math.floor(daysDiff / PaymentFrequency.WEEKLY);
      case PaymentFrequency.DAILY:
        return daysDiff;
      default:
        return Math.floor(daysDiff / frequency);
    }
  }

  private static calculateNewArrearInterests(
    loan: LoanEntity,
    interestAmount: number,
    periodsMissed: number,
    lastDate: Date
  ): {
    updatedInterestBalance: number;
    updatedArrearInterests: LoanArrearInterest[];
  } {
    if (periodsMissed < 1) {
      return {
        updatedInterestBalance: loan.interestBalance,
        updatedArrearInterests: [...loan.arrearInterests],
      };
    }

    const arrearInterests = [...loan.arrearInterests];
    let updatedBalance = loan.interestBalance;
    let stringDate = DateUtil.formatDate(lastDate);

    for (let i = 1; i <= periodsMissed; i++) {
      let newDate: Date;

      switch (loan.paymentFrequency) {
        case PaymentFrequency.MONTHLY:
          newDate = DateUtil.addMonth(lastDate, i);
          break;
        case PaymentFrequency.BIWEEKLY:
          newDate = DateUtil.getNextBiWeeklyDate(new Date(stringDate));
          break;
        default:
          newDate = DateUtil.addDays(lastDate, i * loan.paymentFrequency);
          break;
      }

      stringDate = DateUtil.formatDate(newDate);

      const alreadyExists = arrearInterests.some(
        (ai) => ai.date === stringDate
      );
      if (!alreadyExists) {
        arrearInterests.push({ amount: interestAmount, date: stringDate });
        updatedBalance += interestAmount;
      }
    }

    return {
      updatedInterestBalance: updatedBalance,
      updatedArrearInterests: arrearInterests,
    };
  }

  public static getInterestAmount(loanEntity: LoanEntity) {
    const ONE_HUNDRED_PERCENT = 100;
    const totalAmount: number =
      loanEntity.rate.type === LoanRateType.FIXED
        ? loanEntity.amount
        : loanEntity.princilaCurrentAmount;
    return totalAmount * (loanEntity.rate.value / ONE_HUNDRED_PERCENT);
  }

  public static compareArrearInterests(
    arrearInterestsA: {
      amount: number;
      date: string;
    }[],
    arrearInterestsB: {
      amount: number;
      date: string;
    }[]
  ): boolean {
    if (arrearInterestsA.length !== arrearInterestsB.length) {
      return false;
    }

    for (let index = 0; index < arrearInterestsA.length; index++) {
      const arrearInterest = arrearInterestsA[index];
      if (
        arrearInterest.amount !== arrearInterestsB[index].amount ||
        arrearInterest.date !== arrearInterestsB[index].date
      ) {
        return false;
      }
    }

    return true;
  }

  public static readonly generateConsecutiveUUID = async () => {
    try {
      // Genera un UUID
      const uuid = uuidv4();

      const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
      const consecutive = (
        uuid.replace(/\D/g, "").slice(0, 4) + timestamp
      ).padStart(10, "0");

      return consecutive;
    } catch (error) {
      console.error("Error al generar el consecutivo:", error);
    }
  };
}
