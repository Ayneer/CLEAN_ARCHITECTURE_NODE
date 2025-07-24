import { DateUtil } from "../../../utils/date_util";
import { LoanEntity } from "../../entities";
import { LoanMovementType, LoanRateType, PaymentFrequency } from "../../enum";

export class LoanUtils {
  static setLoanInterests(loanEntity: LoanEntity): LoanEntity {
    const { initialDate, interestBalance, paymentFrequency } = loanEntity;
    const interestAmount = this.getInterestAmount(loanEntity); //Monto de interes por periodo del prestamo
    let lastDate: string = initialDate; //Última fecha que se usará para buscar y calcular intereses en mora
    let newInterestAmount: number = interestBalance;
    let interestNumber: number = 0;
    let arrearInterests = [...loanEntity.arrearInterests];

    //Se obtiene la fecha del último interes en mora
    //A partir de esta su buscarán nuevos intereses en mora (Sí los tiene)
    if (arrearInterests.length > 0) {
      lastDate = arrearInterests.reduce((prev, current) => {
        return DateUtil.parseDate(prev.date) > DateUtil.parseDate(current.date)
          ? prev
          : current;
      }).date;
    } else {
      //Sí no tiene intereses en mora, buscamos por la fecha del último pago a intereses que tenga
      const movements = loanEntity.movements.filter((movement) => {
        return (
          movement.type === LoanMovementType.INTEREST_PAYMENT ||
          movement.type === LoanMovementType.QUOTA_PAYMENT
        );
      });
      if (movements.length > 0) {
        //Get the most recent movement by date
        lastDate = movements.reduce((prev, current) => {
          return DateUtil.parseDate(prev.quoteDate) >
            DateUtil.parseDate(current.quoteDate)
            ? prev
            : current;
        }).quoteDate;
      }
    }

    const lastPaymentDate = DateUtil.parseDate(lastDate);

    //Validamos todos los periodos de pagos en mora que tiene el prestamo
    const differenceInMonths = DateUtil.getDifferenceInMonths(
      lastPaymentDate,
      DateUtil.getCurrentDate()
    );

    const differenceInDays = DateUtil.getDifferenceInDays(
      lastPaymentDate,
      DateUtil.getCurrentDate()
    );

    switch (paymentFrequency) {
      case PaymentFrequency.MONTHLY:
        interestNumber = differenceInMonths;
        break;

      case PaymentFrequency.BIWEEKLY:
        interestNumber = Math.floor(differenceInDays / 15);
        break;

      case PaymentFrequency.WEEKLY:
        interestNumber = Math.floor(differenceInDays / 7);
        break;

      case PaymentFrequency.DAILY:
        interestNumber = differenceInDays;
        break;

      default:
        interestNumber = Math.floor(differenceInDays / paymentFrequency);
        break;
    }

    //Se encontraron periodos en mora
    if (interestNumber >= 1) {
      console.log("Se encontraron periodos en mora");
      let stringDate = DateUtil.formatDate(lastPaymentDate);
      for (let index = 1; index <= interestNumber; index++) {
        let newDate: Date;
        if (paymentFrequency === PaymentFrequency.MONTHLY) {
          newDate = DateUtil.addMonth(new Date(lastPaymentDate), index);
        } else if (paymentFrequency === PaymentFrequency.BIWEEKLY) {
          newDate = DateUtil.getNextBiWeeklyDate(new Date(stringDate));
        } else {
          newDate = DateUtil.addDays(
            new Date(lastPaymentDate),
            index * paymentFrequency
          );
        }
        stringDate = DateUtil.formatDate(newDate);
        if (
          !arrearInterests.some(
            (arrearInterest) => arrearInterest.date === stringDate
          )
        ) {
          newInterestAmount += interestAmount;
          arrearInterests.push({
            amount: interestAmount,
            date: stringDate,
          });
        }
      }
    }

    const updatedLoanEntity: LoanEntity = {
      ...loanEntity,
      balance: loanEntity.balance - interestBalance + newInterestAmount,
      interestBalance: newInterestAmount,
      arrearInterests,
    };

    return updatedLoanEntity;
  }

  static getInterestAmount(loanEntity: LoanEntity) {
    const ONE_HUNDRED_PERCENT = 100;
    const totalAmount: number =
      loanEntity.rate.type === LoanRateType.FIXED
        ? loanEntity.amount
        : loanEntity.princilaCurrentAmount;
    return totalAmount * (loanEntity.rate.value / ONE_HUNDRED_PERCENT);
  }

  static compareArrearInterests(
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
}
