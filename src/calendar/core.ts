export type ISODate = string;
export type WeekStart = 0 | 1;

export const SUNDAY_WEEK_START: WeekStart = 0;
export const ISO_WEEK_START: WeekStart = 1;
const DAY_MS = 86_400_000;

export interface YearProgress {
  dayOfYear: number;
  daysInYear: number;
  remainingDays: number;
  progressPct: number;
}

export interface MonthRow {
  weekNumber: number;
  days: Array<Date | null>;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toWeekIndex(day: number, weekStart: WeekStart): number {
  return (day - weekStart + 7) % 7;
}

export function startOfWeek(date: Date, weekStart: WeekStart = ISO_WEEK_START): Date {
  const day = startOfDay(date);
  day.setDate(day.getDate() - toWeekIndex(day.getDay(), weekStart));
  return day;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameWeek(a: Date, b: Date, weekStart: WeekStart = ISO_WEEK_START): boolean {
  return isSameDay(startOfWeek(a, weekStart), startOfWeek(b, weekStart));
}

export function getDaysInYear(year: number): number {
  return Math.round(
    (new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) / DAY_MS,
  );
}

export function getDayOfYear(date: Date): number {
  const current = startOfDay(date);
  const yearStart = new Date(current.getFullYear(), 0, 1);
  return Math.floor((current.getTime() - yearStart.getTime()) / DAY_MS) + 1;
}

export function getYearProgress(date: Date): YearProgress {
  const dayOfYear = getDayOfYear(date);
  const daysInYear = getDaysInYear(date.getFullYear());
  return {
    dayOfYear,
    daysInYear,
    remainingDays: daysInYear - dayOfYear,
    progressPct: (dayOfYear / daysInYear) * 100,
  };
}

export function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const jan1 = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - jan1) / DAY_MS + 1) / 7);
}

export function formatISODate(date: Date): ISODate {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function parseISODate(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

export function shiftMonth(date: Date, monthOffset: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth() + monthOffset;
  const day = date.getDate();
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = ((month % 12) + 12) % 12;
  const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  return new Date(targetYear, targetMonth, Math.min(day, maxDay));
}

export function shiftDay(date: Date, days: number): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getMonthRows(year: number, month: number, weekStart: WeekStart = ISO_WEEK_START): MonthRow[] {
  const firstDate = new Date(year, month, 1);
  const firstOffset = toWeekIndex(firstDate.getDay(), weekStart);
  const weekNumberOffset = toWeekIndex(ISO_WEEK_START, weekStart);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows: MonthRow[] = [];
  let counter = 1 - firstOffset;

  while (counter <= daysInMonth) {
    const weekNumberDate = new Date(year, month, counter + weekNumberOffset);
    const row: MonthRow = { weekNumber: isoWeek(weekNumberDate), days: [] };

    for (let col = 0; col < 7; col += 1, counter += 1) {
      row.days.push(counter < 1 || counter > daysInMonth ? null : new Date(year, month, counter));
    }

    rows.push(row);
  }

  return rows;
}

export function getUiLocale(): string {
  if (typeof chrome !== 'undefined' && chrome?.i18n?.getUILanguage) {
    return chrome.i18n.getUILanguage();
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'en-US';
}

export function getQuarterNumber(monthIndex: number): number {
  return Math.floor(monthIndex / 3) + 1;
}
