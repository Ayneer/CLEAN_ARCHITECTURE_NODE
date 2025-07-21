export class DateUtil {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
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
    result.setDate(result.getDate() + days);
    return result;
  }
}