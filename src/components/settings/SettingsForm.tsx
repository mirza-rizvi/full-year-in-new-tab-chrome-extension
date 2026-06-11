import { useComputed } from '@preact/signals';
import { useState } from 'preact/hooks';
import {
  applyDisplayMode,
  clearLocalCalendarData,
  resetCalendarSettings,
  setCalendarSettings,
  settings,
} from '@/state/store';
import { t } from '@/i18n/messages';
import {
  DEFAULT_SETTINGS,
  type CalendarDensity,
  type CalendarDisplayMode,
  type DayEmphasis,
  type ThemePreference,
  type WeekStartName,
} from '@/state/types';
import styles from './SettingsForm.module.css';

interface Props {
  showOpenNewTab?: boolean;
}

interface SettingLabelProps {
  controlId: string;
  helpKey: string;
  labelKey: string;
}

function SettingLabel({ controlId, helpKey, labelKey }: SettingLabelProps) {
  const label = t(labelKey);
  const help = t(helpKey);
  const tooltipId = `${controlId}-help`;

  return (
    <span class={styles.labelGroup}>
      <label htmlFor={controlId}>{label}</label>
      <span class={styles.helpWrap}>
        <button
          type="button"
          class={styles.help}
          aria-label={`${label}: ${help}`}
          aria-describedby={tooltipId}
          data-testid="setting-help"
        >
          ?
        </button>
        <span id={tooltipId} role="tooltip" class={styles.tooltip}>
          {help}
        </span>
      </span>
    </span>
  );
}

export default function SettingsForm({ showOpenNewTab = false }: Props) {
  const [status, setStatus] = useState('');
  const value = useComputed(() => settings.value);

  const announce = (key: string): void => {
    setStatus(t(key));
    window.setTimeout(() => setStatus(''), 1800);
  };

  const set = <K extends keyof typeof DEFAULT_SETTINGS>(
    key: K,
    val: (typeof DEFAULT_SETTINGS)[K],
  ): void => {
    setCalendarSettings({ [key]: val } as Partial<typeof DEFAULT_SETTINGS>);
    announce('optionsSaved');
  };

  const setDisplayMode = (mode: CalendarDisplayMode): void => {
    applyDisplayMode(mode);
    announce('optionsSaved');
  };

  const reset = (): void => {
    resetCalendarSettings();
    announce('optionsResetDone');
  };

  const eraseLocalData = (): void => {
    clearLocalCalendarData();
    announce('optionsLocalDataErased');
  };

  return (
    <div class={styles.form}>
      <section class={styles.section}>
        <h2 class={styles.heading}>{t('optionsSectionAppearance')}</h2>
        <div class={styles.row}>
          <SettingLabel
            controlId="setting-display-mode"
            labelKey="optionsDisplayModeLabel"
            helpKey="optionsDisplayModeHelp"
          />
          <select
            id="setting-display-mode"
            name="displayMode"
            value={value.value.displayMode}
            onChange={(e) => setDisplayMode((e.target as HTMLSelectElement).value as CalendarDisplayMode)}
          >
            <option value="balanced">{t('optionsDisplayModeBalanced')}</option>
            <option value="planning">{t('optionsDisplayModePlanning')}</option>
            <option value="wall">{t('optionsDisplayModeWall')}</option>
            <option value="dense">{t('optionsDisplayModeDense')}</option>
          </select>
        </div>
        <div class={styles.row}>
          <SettingLabel
            controlId="setting-theme-preference"
            labelKey="optionsThemeLabel"
            helpKey="optionsThemeHelp"
          />
          <select
            id="setting-theme-preference"
            name="themePreference"
            value={value.value.themePreference}
            onChange={(e) =>
              set('themePreference', (e.target as HTMLSelectElement).value as ThemePreference)
            }
          >
            <option value="system">{t('optionsThemeSystem')}</option>
            <option value="dark">{t('optionsThemeDark')}</option>
            <option value="light">{t('optionsThemeLight')}</option>
          </select>
        </div>
        <div class={styles.row}>
          <SettingLabel
            controlId="setting-density"
            labelKey="optionsDensityLabel"
            helpKey="optionsDensityHelp"
          />
          <select
            id="setting-density"
            name="density"
            value={value.value.density}
            onChange={(e) => set('density', (e.target as HTMLSelectElement).value as CalendarDensity)}
          >
            <option value="comfortable">{t('optionsDensityComfortable')}</option>
            <option value="compact">{t('optionsDensityCompact')}</option>
          </select>
        </div>
        <div class={styles.row}>
          <SettingLabel
            controlId="setting-day-emphasis"
            labelKey="optionsDayEmphasisLabel"
            helpKey="optionsDayEmphasisHelp"
          />
          <select
            id="setting-day-emphasis"
            name="dayEmphasis"
            value={value.value.dayEmphasis}
            onChange={(e) => set('dayEmphasis', (e.target as HTMLSelectElement).value as DayEmphasis)}
          >
            <option value="weekend">{t('optionsDayEmphasisWeekend')}</option>
            <option value="workday">{t('optionsDayEmphasisWorkday')}</option>
            <option value="none">{t('optionsDayEmphasisNone')}</option>
          </select>
        </div>
      </section>

      <section class={styles.section}>
        <h2 class={styles.heading}>{t('optionsSectionCalendar')}</h2>
        <div class={styles.row}>
          <SettingLabel
            controlId="setting-week-start"
            labelKey="optionsWeekStartLabel"
            helpKey="optionsWeekStartHelp"
          />
          <select
            id="setting-week-start"
            name="weekStart"
            value={value.value.weekStart}
            onChange={(e) => set('weekStart', (e.target as HTMLSelectElement).value as WeekStartName)}
          >
            <option value="sunday">{t('optionsWeekStartSunday')}</option>
            <option value="monday">{t('optionsWeekStartMonday')}</option>
          </select>
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-show-progress-bar"
            name="showProgressBar"
            type="checkbox"
            checked={value.value.showProgressBar}
            onChange={(e) => set('showProgressBar', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-show-progress-bar"
            labelKey="optionsShowProgressBarLabel"
            helpKey="optionsShowProgressBarHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-show-past-future-tone"
            name="showPastFutureTone"
            type="checkbox"
            checked={value.value.showPastFutureTone}
            onChange={(e) => set('showPastFutureTone', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-show-past-future-tone"
            labelKey="optionsShowPastFutureTone"
            helpKey="optionsShowPastFutureToneHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-show-selected-context"
            name="showSelectedContext"
            type="checkbox"
            checked={value.value.showSelectedContext}
            onChange={(e) => set('showSelectedContext', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-show-selected-context"
            labelKey="optionsShowSelectedContext"
            helpKey="optionsShowSelectedContextHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-show-week-numbers"
            name="showWeekNumbers"
            type="checkbox"
            checked={value.value.showWeekNumbers}
            onChange={(e) => set('showWeekNumbers', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-show-week-numbers"
            labelKey="optionsShowWeekNumbersLabel"
            helpKey="optionsShowWeekNumbersHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-show-quarter-labels"
            name="showQuarterLabels"
            type="checkbox"
            checked={value.value.showQuarterLabels}
            onChange={(e) => set('showQuarterLabels', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-show-quarter-labels"
            labelKey="optionsShowQuarterLabels"
            helpKey="optionsShowQuarterLabelsHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-show-quarter-boundaries"
            name="showQuarterBoundaries"
            type="checkbox"
            checked={value.value.showQuarterBoundaries}
            onChange={(e) => set('showQuarterBoundaries', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-show-quarter-boundaries"
            labelKey="optionsShowQuarterBoundaries"
            helpKey="optionsShowQuarterBoundariesHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-show-month-numbers"
            name="showMonthNumbers"
            type="checkbox"
            checked={value.value.showMonthNumbers}
            onChange={(e) => set('showMonthNumbers', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-show-month-numbers"
            labelKey="optionsShowMonthNumbers"
            helpKey="optionsShowMonthNumbersHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-highlight-current-week"
            name="highlightCurrentWeek"
            type="checkbox"
            checked={value.value.highlightCurrentWeek}
            onChange={(e) => set('highlightCurrentWeek', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-highlight-current-week"
            labelKey="optionsHighlightCurrentWeek"
            helpKey="optionsHighlightCurrentWeekHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-emphasize-weekends"
            name="emphasizeWeekends"
            type="checkbox"
            checked={value.value.emphasizeWeekends}
            onChange={(e) => set('emphasizeWeekends', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-emphasize-weekends"
            labelKey="optionsEmphasizeWeekends"
            helpKey="optionsEmphasizeWeekendsHelp"
          />
        </div>
        <div class={`${styles.row} ${styles.check}`}>
          <input
            id="setting-week-preview-on-hover"
            name="weekPreviewOnHover"
            type="checkbox"
            checked={value.value.weekPreviewOnHover}
            onChange={(e) => set('weekPreviewOnHover', (e.target as HTMLInputElement).checked)}
          />
          <SettingLabel
            controlId="setting-week-preview-on-hover"
            labelKey="optionsWeekPreviewOnHover"
            helpKey="optionsWeekPreviewOnHoverHelp"
          />
        </div>
      </section>

      <section class={styles.section}>
        <h2 class={styles.heading}>{t('optionsSectionPrivacy')}</h2>
        <p class={styles.hint}>{t('optionsPrivacyDescription')}</p>
        <div class={`${styles.row} ${styles.btnRow}`}>
          <button
            type="button"
            class={`pill ${styles.danger}`}
            onClick={eraseLocalData}
            data-testid="erase-local-data"
          >
            {t('optionsEraseLocalDataButton')}
          </button>
        </div>
      </section>

      <div class={`${styles.row} ${styles.btnRow}`}>
        <button type="button" class="pill" onClick={reset}>
          {t('optionsResetButton')}
        </button>
        {showOpenNewTab && (
          <a class="pill" href="newtab.html" target="_blank" rel="noopener noreferrer">
            {t('optionsOpenNewTab')}
          </a>
        )}
      </div>

      <p class={styles.status} aria-live="polite">
        {status}
      </p>
    </div>
  );
}
