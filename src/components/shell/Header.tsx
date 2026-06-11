import { useComputed } from '@preact/signals';
import { useMemo } from 'preact/hooks';
import { settings, todayISO, selectedISO, setSelectedISO } from '@/state/store';
import { openSettings } from '../settings/SettingsModal';
import { t, getUiLocale } from '@/i18n/messages';
import { getYearProgress, isoWeek, parseISODate } from '@/calendar/core';
import styles from './Header.module.css';

export default function Header() {
  const locale = getUiLocale();
  const formatters = useMemo(
    () => ({
      longDate: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      fullDate: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }),
    [locale],
  );

  const headerLabel = useComputed(() => {
    const date = parseISODate(todayISO.value);
    const progress = getYearProgress(date);
    const week = isoWeek(date);
    const datePart = formatters.longDate.format(date);
    const progressPart = t('labelDayOfYear', [progress.dayOfYear, progress.daysInYear]);
    const remainingPart = t('labelRemainingDays', [progress.remainingDays]);
    if (settings.value.showWeekNumbers) {
      return t('headerLabelWithWeek', [datePart, t('labelWeek', [week]), progressPart, remainingPart]);
    }
    return t('headerLabelWithoutWeek', [datePart, progressPart, remainingPart]);
  });

  const yearText = useComputed(() => parseISODate(todayISO.value).getFullYear().toString());

  const selectedContext = useComputed(() => {
    if (!settings.value.showSelectedContext || selectedISO.value === todayISO.value) return '';
    return t('selectedDateLabel', [formatters.fullDate.format(parseISODate(selectedISO.value))]);
  });

  const todayContext = useComputed(() =>
    selectedContext.value ? t('todayContextLabel', [formatters.longDate.format(parseISODate(todayISO.value))]) : '',
  );

  const progressPct = useComputed(() => {
    const date = parseISODate(todayISO.value);
    return getYearProgress(date).progressPct;
  });

  const handleToday = (): void => {
    setSelectedISO(todayISO.value);
  };

  void selectedISO; // ensure header rerenders when selection changes (for selected-day affordances)

  return (
    <header class={styles.header}>
      <div class={styles.row}>
        <div class={styles.copy}>
          <h1 class={styles.year}>{yearText.value}</h1>
          <p class={styles.label}>{headerLabel.value}</p>
          {selectedContext.value && (
            <p class={styles.selectedContext}>
              <span>{selectedContext.value}</span>
              <span>{todayContext.value}</span>
            </p>
          )}
        </div>
        <div class={styles.actions}>
          <button class="pill" type="button" onClick={handleToday} aria-label={t('todayButtonAria')}>
            {t('todayButtonLabel')}
          </button>
          <button
            class="pill"
            type="button"
            onClick={openSettings}
            aria-label={t('settingsButtonAria')}
            title={t('settingsButtonAria')}
          >
            {t('settingsButtonLabel')}
          </button>
        </div>
      </div>
      <div class={styles.progressTrack} hidden={!settings.value.showProgressBar} aria-hidden="true">
        <div class={styles.progressFill} style={{ width: `${progressPct.value.toFixed(2)}%` }} />
      </div>
    </header>
  );
}
