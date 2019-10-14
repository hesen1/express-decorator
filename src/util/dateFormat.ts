import { LocaleTypes, TimeZoneTypes, TimeTypes, ThirtyOneDays, ThirtyDays } from "../const/date";
import { isObject } from "util";

export default class DateFormat {
  static getToday(date: string | Date, format: string): Date | string | number {
    return DateFormat.toLocaleString();
  }

  static format(date: string | Date, format?: string) {
    return DateFormat.toShanghaiString(date);
  }

  // TODO: 加年份功能，待测试，还是要算天
  static add(date: string | Date, num: number, type: string, format?: string): string {
    date = date || new Date();
    if (typeof date === "string") {
      date = new Date(Date.parse(date));
    }
    if (num === 0) {
      return DateFormat.format(date, format);
    }
    if (type === TimeTypes.Year || type === TimeTypes.Years) {
      const year: number = date.getFullYear();
      // const dateB: string = date.toLocaleString().replace(/^\d{4}/, `${year - num}`);
      // // if (date.getMonth() + 1 === 2 && date.getDate() === 29) {
      // //   dateB = date.toLocaleString().replace(/^\d{4}/, `${year - num}`)
      // //     .replace(/-\d{2} /, "-28 ");
      // // }
      // let times: number = date.getTime() + DateFormat.millisecondsDiff(dateB, date);
      // if (date.getMonth() + 1 < 2 || (date.getMonth() + 1 === 2 && date.getDate() < 29)) {
      //   times += 1 * 24 * 3600 * 1000;
      // } else if (date.getMonth() + 1 > 2) {
      //   times -= 1 * 24 * 3600 * 1000;
      // }
      date = new Date(date.getTime() +
        DateFormat.computeDaysForSubOld(year, year + num, date.getMonth() + 1, date.getDate()) * 24 * 3600 * 1000);
    }
    return DateFormat.format(date, format);
  }

  static sub(date: string | Date, num: number, type: string, format?: string): string {
    date = date || new Date();
    if (typeof date === "string") {
      date = new Date(Date.parse(date));
    }
    if (num === 0) {
      return DateFormat.format(date, format);
    }
    if (type === TimeTypes.Year || type === TimeTypes.Years) {
      const year: number = date.getFullYear();
      // let dateB: string = date.toLocaleString().replace(/^\d{4}/, `${year - num}`);
      // if (date.getMonth() + 1 === 2 && date.getDate() === 29) {
      //   dateB = date.toLocaleString().replace(/^\d{4}/, `${year - num}`)
      //     .replace(/-\d{2} /, "-28 ");
      // }
      // date = new Date(date.getTime() - DateFormat.millisecondsDiff(date, dateB));
      date = new Date(date.getTime() -
        DateFormat.computeDaysForSubOld(year, year - num, date.getMonth() + 1, date.getDate()) * 24 * 3600 * 1000);
    }
    return DateFormat.format(date, format);
  }

  /**
   * 计算A日期，减或加几年时需要加，或减多少天
   * @param startYear 起始年
   * @param endYear 最终年
   * @param month 某一月
   * @example 2018-09-11 加两年 -》 2020-09-11
   */
  static computeDaysForSubOld(startYear: number, endYear: number, month: number, day: number): number {
    let days: number = 0;
    let tempMonth: number = 12;
    if (startYear > endYear) {
      startYear += endYear;
      endYear = startYear - endYear;
      startYear = startYear - endYear;
    }
    while (startYear <= endYear) {
      while (tempMonth > 0) {
        if (startYear === endYear && tempMonth < month) {
          break;
        }
        if (startYear === endYear && tempMonth === month) {
          if (ThirtyOneDays.indexOf(tempMonth) !== -1) {
            days += 31 - day;
          } else if (ThirtyDays.indexOf(tempMonth) !== -1) {
            days += 30 - day;
          } else {
            DateFormat.isLeapYear(startYear) ? days += 29 - day : days += 28 - day;
          }
        }
        if (ThirtyOneDays.indexOf(tempMonth) !== -1) {
          days += 31;
        } else if (ThirtyDays.indexOf(tempMonth) !== -1) {
          days += 30;
        } else {
          DateFormat.isLeapYear(startYear) ? days += 29 : days += 28;
        }
        tempMonth--;
      }
      tempMonth = 12;
      startYear++;
    }
    return days;
  }

  // TODO: 写天数计算方式
  static computeDaysForSubYear(startYear: number, endYear: number, month: number, day: number): number {
    const days: number = 0;
    const beginWithMarch: boolean = month === 2 && day > 28;
    if (startYear === endYear) {
      return days;
    }
    // let tempMonth: number = 12;
    const aIsLeapYear: boolean = DateFormat.isLeapYear(startYear);
    const bIsLeapYear: boolean = DateFormat.isLeapYear(--startYear);

    return days;
  }

  static computeDaysForSubMonth(month: number, day: number, year: number, num: number): number {
    const days: number = 0;
    return days;
  }

  /**
   * 计算日期A、B差多少天
   * @param dateA 日期A
   * @param dateB 日期B
   */
  static dayDiff(dateA: string | Date, dateB: string | Date) {
    const a: number = typeof dateA === "string" ? Date.parse(dateA) : dateA.getTime();
    const b: number = typeof dateB === "string" ? Date.parse(dateB) : dateB.getTime();
    if (b > a) {
      return Math.ceil((b - a) / (24 * 3600 * 1000));
    }
    return Math.ceil((a - b) / (24 * 3600 * 1000));
  }

  /**
   * 计算日期A、B差多少毫秒
   * @param dateA 日期A
   * @param dateB 日期B
   */
  static millisecondsDiff(dateA: string | Date, dateB: string | Date) {
    const a: number = typeof dateA === "string" ? Date.parse(dateA) : dateA.getTime();
    const b: number = typeof dateB === "string" ? Date.parse(dateB) : dateB.getTime();
    if (b > a) {
      return b - a;
    }
    return a - b;
  }

  /**
   * 是否是闰年
   * @param year 年份
   */
  static isLeapYear(year: number): boolean {
    return year % 4 === 0 && !(year % 100 === 0 && year % 400 !== 0);
  }

  /**
   * 和new Date().toLocaleString行为一样, 但无论那个时区，都是ZH
   */
  private static toZHString(date?: string | Date, options?: Intl.DateTimeFormatOptions): string {
    options = options || undefined;
    let d: Date = new Date();
    if (date instanceof Date) {
      d = date;
    } else if (typeof date === "string") {
      d = new Date(Date.parse(date));
    }
    const tempDate: string = d.toLocaleString(LocaleTypes.ZH, options);
    return tempDate.replace(/-\d{1}-/, `-0${tempDate[tempDate.indexOf("-") + 1]}-`)
      .replace(/-\d{1} /, `-0${tempDate[tempDate.lastIndexOf("-") + 1]} `);
  }

  /**
   * 获取上海时区时间(默认今天)，格式：YYYY-MM-DD HH:mm:ss
   * @param locales
   * @param options
   */
  static toShanghaiString(date?: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const o: Intl.DateTimeFormatOptions = { timeZone: TimeZoneTypes.Shanghai };
    options && isObject(options) ? options.timeZone = TimeZoneTypes.Shanghai : options = o;
    return DateFormat.toZHString(date, options);
  }

  /**
   * 返回一个 ISO（ISO 8601 Extended Format）格式的字符串： YYYY-MM-DDTHH:mm:ss.sssZ。时区总是UTC（协调世界时），加一个后缀“Z”标识。
   */
  private static toISOString(): string {
    return new Date().toISOString();
  }

  /**
   * 获取本地时区与UTC（协调世界时）的时间差值，单位 分/minute，
   * 如果本地时区晚于协调世界时，则该差值为正值，如果早于协调世界时则为负值
   * @param {Boolean} needOppositeNumber 需要取相反数, -600 -> 600
   */
  static getTimezoneOffsetInMinutes(needOppositeNumber: boolean = true): number {
    const opposite: number = needOppositeNumber ? -1 : 1;
    return new Date().getTimezoneOffset() * opposite;
  }

  /**
   * 获取本地时区与UTC（协调世界时）的时间差值，单位 时/hour，
   * 如果本地时区晚于协调世界时，则该差值为正值，如果早于协调世界时则为负值
   * @param {Boolean} needOppositeNumber 需要取相反数, -8 -> 8
   */
  static getTimezoneOffsetInHours(needOppositeNumber: boolean = true): number {
    return DateFormat.getTimezoneOffsetInMinutes(needOppositeNumber) / 60;
  }

  /**
   * 获取本地时区与UTC（协调世界时）的时间差值，单位 秒/second，
   * 如果本地时区晚于协调世界时，则该差值为正值，如果早于协调世界时则为负值
   * @param {Boolean} needOppositeNumber 需要取相反数, -8 -> 8
   */
  static getTimezoneOffsetInSeconds(needOppositeNumber: boolean = true): number {
    return DateFormat.getTimezoneOffsetInMinutes(needOppositeNumber) * 60;
  }
}

// console.log(new Date().getTime());
console.log(DateFormat.sub("2016-03-25 10:23:55", 4, TimeTypes.Year));
// console.log(new Date(Date.parse("2016-03-29 23:59:59") - DateFormat.millisecondsDiff("2016-03-29 23:59:59", "2014-02-29 00:00:00")));
// const test: Intl.DateTimeFormatOptions = {};
// console.log(test instanceof Intl.); "2016-02-29 10:23:55"
