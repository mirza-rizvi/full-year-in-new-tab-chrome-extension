import { computed, signal, type ReadonlySignal, type Signal } from '@preact/signals';
import {
  ISO_WEEK_START,
  SUNDAY_WEEK_START,
  type ISODate,
  type WeekStart,
  formatISODate,
  startOfDay,
} from '@/calendar/core';
import { DEFAULT_SETTINGS, type CalendarDisplayMode, type Settings } from './types';

const todayDate = startOfDay(new Date());
const CALENDAR_SETTINGS_KEY = 'fyi:calendar-settings';
const LEGACY_THEME_PREF_KEY = 'fyi:theme-pref';
const LEGACY_THEME_CACHE_KEY = 'fyi:theme-cache';

function readCalendarSettings(): Partial<Settings> {
  try {
    const raw = localStorage.getItem(CALENDAR_SETTINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function persistCalendarSettings(value: Settings): void {
  try {
    localStorage.setItem(CALENDAR_SETTINGS_KEY, JSON.stringify(value));
  } catch {
    // Settings persistence is best-effort in restricted browser contexts.
  }
}

function removeLegacyThemeStorage(): void {
  try {
    localStorage.removeItem(LEGACY_THEME_PREF_KEY);
    localStorage.removeItem(LEGACY_THEME_CACHE_KEY);
  } catch {
    // Legacy cleanup is best-effort in restricted browser contexts.
  }
}

removeLegacyThemeStorage();

export const settings: Signal<Settings> = signal({ ...DEFAULT_SETTINGS, ...readCalendarSettings() });
export const todayISO: Signal<ISODate> = signal(formatISODate(todayDate));
export const selectedISO: Signal<ISODate> = signal(formatISODate(todayDate));
export const settingsModalOpen: Signal<boolean> = signal(false);

export const weekStartValue: ReadonlySignal<WeekStart> = computed(() =>
  settings.value.weekStart === 'sunday' ? SUNDAY_WEEK_START : ISO_WEEK_START,
);

const DISPLAY_MODE_PRESETS: Record<CalendarDisplayMode, Partial<Settings>> = {
  balanced: {
    displayMode: 'balanced',
    density: 'comfortable',
    showProgressBar: true,
    showWeekNumbers: false,
    showQuarterLabels: false,
    showQuarterBoundaries: false,
    showMonthNumbers: false,
    showPastFutureTone: true,
    showSelectedContext: true,
    highlightCurrentWeek: true,
    weekPreviewOnHover: true,
    dayEmphasis: 'weekend',
    emphasizeWeekends: true,
  },
  planning: {
    displayMode: 'planning',
    density: 'comfortable',
    showProgressBar: true,
    showWeekNumbers: true,
    showQuarterLabels: true,
    showQuarterBoundaries: true,
    showMonthNumbers: true,
    showPastFutureTone: true,
    showSelectedContext: true,
    highlightCurrentWeek: true,
    weekPreviewOnHover: true,
    dayEmphasis: 'weekend',
    emphasizeWeekends: true,
  },
  wall: {
    displayMode: 'wall',
    density: 'comfortable',
    showProgressBar: true,
    showWeekNumbers: false,
    showQuarterLabels: false,
    showQuarterBoundaries: true,
    showMonthNumbers: false,
    showPastFutureTone: true,
    showSelectedContext: true,
    highlightCurrentWeek: true,
    weekPreviewOnHover: false,
    dayEmphasis: 'weekend',
    emphasizeWeekends: true,
  },
  dense: {
    displayMode: 'dense',
    density: 'compact',
    showProgressBar: true,
    showWeekNumbers: true,
    showQuarterLabels: false,
    showQuarterBoundaries: true,
    showMonthNumbers: true,
    showPastFutureTone: true,
    showSelectedContext: true,
    highlightCurrentWeek: true,
    weekPreviewOnHover: true,
    dayEmphasis: 'weekend',
    emphasizeWeekends: true,
  },
};

export function setSelectedISO(iso: ISODate): void {
  selectedISO.value = iso;
}

export function applySettingsPatch(patch: Partial<Settings>): void {
  settings.value = { ...settings.value, ...patch };
  persistCalendarSettings(settings.value);
}

export function setCalendarSettings(patch: Partial<Settings>): void {
  applySettingsPatch(patch);
}

export function applyDisplayMode(mode: CalendarDisplayMode): void {
  applySettingsPatch(DISPLAY_MODE_PRESETS[mode]);
}

export function resetCalendarSettings(): void {
  settings.value = { ...DEFAULT_SETTINGS };
  persistCalendarSettings(settings.value);
}

export function clearLocalCalendarData(): void {
  try {
    localStorage.removeItem(CALENDAR_SETTINGS_KEY);
    localStorage.removeItem(LEGACY_THEME_PREF_KEY);
    localStorage.removeItem(LEGACY_THEME_CACHE_KEY);
  } catch {
    // Local data removal is best-effort in restricted browser contexts.
  }
  settings.value = { ...DEFAULT_SETTINGS };
}

export function setTodayISO(iso: ISODate): void {
  todayISO.value = iso;
}
