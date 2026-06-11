import { describe, expect, it } from 'vitest';
import {
  ISO_WEEK_START,
  SUNDAY_WEEK_START,
  formatISODate,
  getDayOfYear,
  getDaysInYear,
  getMonthRows,
  getQuarterNumber,
  getYearProgress,
  isSameDay,
  isSameWeek,
  isoWeek,
  parseISODate,
  shiftDay,
  shiftMonth,
  startOfDay,
  startOfWeek,
  toWeekIndex,
} from '../src/calendar/core';

describe('calendar core', () => {
  it('startOfDay strips time', () => {
    const d = new Date(2026, 4, 4, 14, 30, 12);
    const s = startOfDay(d);
    expect(s.getHours()).toBe(0);
    expect(s.getMinutes()).toBe(0);
    expect(s.getSeconds()).toBe(0);
  });

  it('formatISODate pads month/day', () => {
    expect(formatISODate(new Date(2026, 0, 9))).toBe('2026-01-09');
    expect(formatISODate(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('parseISODate round-trips', () => {
    const iso = '2026-05-04';
    const d = parseISODate(iso);
    expect(formatISODate(d)).toBe(iso);
  });

  it('isoWeek matches known values', () => {
    expect(isoWeek(new Date(2026, 0, 1))).toBe(1);
    expect(isoWeek(new Date(2024, 11, 30))).toBe(1);
    expect(isoWeek(new Date(2020, 11, 31))).toBe(53);
  });

  it('getDayOfYear handles leap years', () => {
    expect(getDayOfYear(new Date(2024, 1, 29))).toBe(60);
    expect(getDayOfYear(new Date(2025, 1, 28))).toBe(59);
  });

  it('getDaysInYear', () => {
    expect(getDaysInYear(2024)).toBe(366);
    expect(getDaysInYear(2025)).toBe(365);
  });

  it('getYearProgress', () => {
    const progress = getYearProgress(new Date(2025, 0, 1));
    expect(progress.dayOfYear).toBe(1);
    expect(progress.remainingDays).toBe(364);
    expect(progress.progressPct).toBeCloseTo(100 / 365, 4);
  });

  it('isSameDay / isSameWeek', () => {
    const a = new Date(2026, 4, 4);
    const b = new Date(2026, 4, 4, 23);
    const c = new Date(2026, 4, 5);
    expect(isSameDay(a, b)).toBe(true);
    expect(isSameDay(a, c)).toBe(false);
    expect(isSameWeek(a, c, ISO_WEEK_START)).toBe(true);
  });

  it('toWeekIndex', () => {
    expect(toWeekIndex(0, ISO_WEEK_START)).toBe(6);
    expect(toWeekIndex(1, ISO_WEEK_START)).toBe(0);
    expect(toWeekIndex(0, SUNDAY_WEEK_START)).toBe(0);
  });

  it('startOfWeek respects weekStart', () => {
    const wed = new Date(2026, 4, 6);
    expect(formatISODate(startOfWeek(wed, ISO_WEEK_START))).toBe('2026-05-04');
    expect(formatISODate(startOfWeek(wed, SUNDAY_WEEK_START))).toBe('2026-05-03');
  });

  it('shiftMonth clamps day for shorter months', () => {
    const jan31 = new Date(2025, 0, 31);
    expect(formatISODate(shiftMonth(jan31, 1))).toBe('2025-02-28');
  });

  it('shiftDay', () => {
    expect(formatISODate(shiftDay(new Date(2026, 0, 1), 1))).toBe('2026-01-02');
    expect(formatISODate(shiftDay(new Date(2026, 0, 1), -1))).toBe('2025-12-31');
  });

  it('getMonthRows: jan 2026 ISO has 5 rows starting Mon Dec 29', () => {
    const rows = getMonthRows(2026, 0, ISO_WEEK_START);
    expect(rows.length).toBe(5);
    expect(rows[0]!.days[0]).toBeNull();
    expect(rows[0]!.weekNumber).toBe(1);
    expect(rows[rows.length - 1]!.days.filter((d): d is Date => !!d).pop()?.getDate()).toBe(31);
  });

  it('getMonthRows fills 7 cols per row', () => {
    const rows = getMonthRows(2024, 1, ISO_WEEK_START);
    rows.forEach((row) => expect(row.days.length).toBe(7));
  });

  it('getQuarterNumber', () => {
    expect(getQuarterNumber(0)).toBe(1);
    expect(getQuarterNumber(2)).toBe(1);
    expect(getQuarterNumber(3)).toBe(2);
    expect(getQuarterNumber(11)).toBe(4);
  });
});
