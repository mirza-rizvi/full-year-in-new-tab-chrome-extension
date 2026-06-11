type RawMessages = Record<string, { message: string }>;

const fallback: RawMessages = {
  calendarTitle: { message: 'Full year calendar' },
  settingsTitle: { message: 'Calendar settings' },
  settingsSubtitle: { message: 'Customize the full-year calendar view.' },
  settingsButtonLabel: { message: 'Settings' },
  settingsButtonAria: { message: 'Open calendar settings' },
  todayButtonLabel: { message: 'Today' },
  todayButtonAria: { message: 'Jump to today' },
  selectedDateLabel: { message: 'Selected: $1' },
  todayContextLabel: { message: 'Today: $1' },
  labelWeek: { message: 'W$1' },
  labelDayOfYear: { message: 'Day $1 of $2' },
  labelRemainingDays: { message: '$1 remaining' },
  headerLabelWithWeek: { message: '$1 · $2 · $3 · $4' },
  headerLabelWithoutWeek: { message: '$1 · $2 · $3' },
  dayAriaLabel: { message: '$1. Activate to select $2.' },
  todayAriaLabel: { message: 'Today: $1. Activate to select $2.' },
  weekNumberAria: { message: 'ISO week $1' },
  weekHeaderShort: { message: 'W' },
  weekHeaderTitle: { message: 'ISO week numbers' },
  quarterLabel: { message: 'Q$1' },
  optionsSectionAppearance: { message: 'Appearance' },
  optionsSectionCalendar: { message: 'Calendar' },
  optionsSectionPrivacy: { message: 'Privacy' },
  optionsPrivacyDescription: { message: 'Your settings stay on this device. This extension has no analytics, tracking, sync storage, background worker, or network requests.' },
  optionsEraseLocalDataButton: { message: 'Erase local data' },
  optionsThemeLabel: { message: 'Theme' },
  optionsThemeSystem: { message: 'System' },
  optionsThemeDark: { message: 'Dark' },
  optionsThemeLight: { message: 'Light' },
  optionsDisplayModeLabel: { message: 'Mode' },
  optionsDisplayModeHelp: { message: 'Applies a preset layout for the calendar. Balanced is the default; Planning shows more planning aids; Wall calendar reduces extra detail; Dense fits more information tightly.' },
  optionsDisplayModeBalanced: { message: 'Balanced' },
  optionsDisplayModePlanning: { message: 'Planning' },
  optionsDisplayModeWall: { message: 'Wall calendar' },
  optionsDisplayModeDense: { message: 'Dense' },
  optionsDensityLabel: { message: 'Density' },
  optionsDensityHelp: { message: 'Changes spacing inside the calendar. Compact fits more rows into tight screens.' },
  optionsDensityComfortable: { message: 'Comfortable' },
  optionsDensityCompact: { message: 'Compact' },
  optionsDayEmphasisLabel: { message: 'Day emphasis' },
  optionsDayEmphasisHelp: { message: 'Chooses which kind of days receive extra visual weight: weekends, workdays, or none.' },
  optionsDayEmphasisWeekend: { message: 'Weekends' },
  optionsDayEmphasisWorkday: { message: 'Workdays' },
  optionsDayEmphasisNone: { message: 'None' },
  optionsWeekStartLabel: { message: 'Week start' },
  optionsWeekStartHelp: { message: 'Chooses whether each calendar row starts on Sunday or Monday.' },
  optionsWeekStartSunday: { message: 'Sunday' },
  optionsWeekStartMonday: { message: 'Monday' },
  optionsShowProgressBarLabel: { message: 'Show year progress' },
  optionsShowProgressBarHelp: { message: 'Shows or hides the progress bar for how far through the year today is.' },
  optionsShowPastFutureTone: { message: 'Tone past and future days' },
  optionsShowPastFutureToneHelp: { message: 'Dims past days and subtly distinguishes future days from today.' },
  optionsShowSelectedContext: { message: 'Show selected date context' },
  optionsShowSelectedContextHelp: { message: 'Shows the selected date in the header and highlights its week and weekday.' },
  optionsShowWeekNumbersLabel: { message: 'Show week numbers' },
  optionsShowWeekNumbersHelp: { message: 'Shows ISO week numbers beside each calendar row.' },
  optionsShowQuarterLabels: { message: 'Show quarter labels' },
  optionsShowQuarterLabelsHelp: { message: 'Shows Q1 through Q4 labels on months.' },
  optionsShowQuarterBoundaries: { message: 'Show quarter boundaries' },
  optionsShowQuarterBoundariesHelp: { message: 'Marks the last month of each quarter.' },
  optionsShowMonthNumbers: { message: 'Show month numbers' },
  optionsShowMonthNumbersHelp: { message: 'Prefixes month names with 01 through 12.' },
  optionsHighlightCurrentWeek: { message: 'Highlight current week' },
  optionsHighlightCurrentWeekHelp: { message: 'Highlights the week containing today.' },
  optionsEmphasizeWeekends: { message: 'Emphasize weekends' },
  optionsEmphasizeWeekendsHelp: { message: 'Adds weekend styling when weekend emphasis is enabled.' },
  optionsWeekPreviewOnHover: { message: 'Preview week on hover' },
  optionsWeekPreviewOnHoverHelp: { message: 'Highlights a week while you hover or keyboard-focus a day, without changing the selected date.' },
  optionsThemeHelp: { message: 'Chooses the color theme. System follows your browser or operating system preference.' },
  optionsResetButton: { message: 'Reset defaults' },
  optionsOpenNewTab: { message: 'Open new tab' },
  optionsSaved: { message: 'Settings saved.' },
  optionsResetDone: { message: 'Defaults restored.' },
  optionsLocalDataErased: { message: 'Local data erased.' },
};

export function t(key: string, substitutions: Array<string | number> = []): string {
  if (typeof chrome !== 'undefined' && chrome.i18n?.getMessage) {
    const result = chrome.i18n.getMessage(key, substitutions.map(String));
    if (result) return result;
  }
  const raw = fallback[key]?.message ?? key;
  return raw.replace(/\$(\d+)/g, (_match, idx) => {
    const i = Number(idx) - 1;
    const sub = substitutions[i];
    return sub == null ? '' : String(sub);
  });
}

export function getUiLocale(): string {
  if (typeof chrome !== 'undefined' && chrome.i18n?.getUILanguage) {
    return chrome.i18n.getUILanguage();
  }
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return 'en-US';
}
