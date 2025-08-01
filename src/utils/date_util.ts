export class DateUtil {
  static formatDate(date: Date): string {
    return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
  }

  static getCurrentDate(): Date {
    return this.parseDate(this.formatDate(new Date()));
  }

  static parseDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    return date;
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getUTCDate() + days);
    return result;
  }

  static addMonth(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  static getDifferenceInMonths(date1: Date, latestDate: Date): number {
    const yearDiff = latestDate.getFullYear() - date1.getFullYear();
    const monthDiff = latestDate.getMonth() - date1.getMonth();
    let diff = yearDiff * 12 + monthDiff;
    if (date1.getUTCDate() > latestDate.getUTCDate() && diff > 0) {
      diff--;
    }
    return diff;
  }

  static getDifferenceInDays(date1: Date, latestDate: Date): number {
    const diffInMs = latestDate.getTime() - date1.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  static getNextBiWeeklyDate(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth();

    if (this.isLastDayOfMonth(date)) {
      return new Date(year, month + 1, 15);
    } else {
      return new Date(year, month + 1, 0);
    }
  }

  static isLastDayOfMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const lastDay = new Date(year, month + 1, 0);

    if (this.formatDate(lastDay) === this.formatDate(date)) {
      return true;
    }
    return false;
  }
}
