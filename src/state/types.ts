import type { ISODate, WeekStart } from '@/calendar/core';

export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';
export type WeekStartName = 'monday' | 'sunday';
export type CalendarDensity = 'compact' | 'comfortable';
export type CalendarDisplayMode = 'balanced' | 'planning' | 'wall' | 'dense';
export type DayEmphasis = 'weekend' | 'workday' | 'none';

export interface Settings {
  themePreference: ThemePreference;
  weekStart: WeekStartName;
  showProgressBar: boolean;
  showQuarterLabels: boolean;
  showWeekNumbers: boolean;
  highlightCurrentWeek: boolean;
  emphasizeWeekends: boolean;
  density: CalendarDensity;
  displayMode: CalendarDisplayMode;
  showPastFutureTone: boolean;
  showSelectedContext: boolean;
  showQuarterBoundaries: boolean;
  showMonthNumbers: boolean;
  weekPreviewOnHover: boolean;
  dayEmphasis: DayEmphasis;
}

export interface AppState {
  settings: Settings;
  selectedISO: ISODate;
  todayISO: ISODate;
  weekStartValue: WeekStart;
}

export const DEFAULT_SETTINGS: Settings = {
  themePreference: 'system',
  weekStart: 'sunday',
  showProgressBar: true,
  showQuarterLabels: false,
  showWeekNumbers: false,
  highlightCurrentWeek: true,
  emphasizeWeekends: true,
  density: 'comfortable',
  displayMode: 'balanced',
  showPastFutureTone: true,
  showSelectedContext: true,
  showQuarterBoundaries: false,
  showMonthNumbers: false,
  weekPreviewOnHover: true,
  dayEmphasis: 'weekend',
};
