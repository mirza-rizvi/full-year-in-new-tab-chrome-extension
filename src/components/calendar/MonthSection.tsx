import { useComputed } from '@preact/signals';
import { useMemo } from 'preact/hooks';
import {
  formatISODate,
  getQuarterNumber,
  getUiLocale,
  isSameDay,
  isSameWeek,
  type MonthRow,
  parseISODate,
} from '@/calendar/core';
import {
  selectedISO,
  setSelectedISO,
  settings,
  todayISO,
  weekStartValue,
} from '@/state/store';
import { t } from '@/i18n/messages';
import calStyles from './Calendar.module.css';

const _locale = getUiLocale();
const SHORT_WEEKDAY_FMT = new Intl.DateTimeFormat(_locale, { weekday: 'narrow' });
const LONG_WEEKDAY_FMT = new Intl.DateTimeFormat(_locale, { weekday: 'long' });
const HEADER_REFERENCE = new Date(Date.UTC(2024, 0, 7));

interface Props {
  monthIndex: number;
  name: string;
  rows: MonthRow[];
  year: number;
  fullDateFormatter: Intl.DateTimeFormat;
}

export default function MonthSection({
  monthIndex,
  name,
  rows,
  year,
  fullDateFormatter,
}: Props) {
  const today = useComputed(() => parseISODate(todayISO.value));
  const selected = selectedISO;

  const showQuarter = settings.value.showQuarterLabels;
  const showWeekNumbers = settings.value.showWeekNumbers;
  const highlightCurrentWeek = settings.value.highlightCurrentWeek;
  const emphasizeWeekends = settings.value.emphasizeWeekends;
  const showTone = settings.value.showPastFutureTone;
  const previewable = settings.value.weekPreviewOnHover;
  const showQuarterBoundary = settings.value.showQuarterBoundaries && [2, 5, 8].includes(monthIndex);
  const selectedDate = parseISODate(selected.value);
  const ws = weekStartValue.value;
  const todayDate = today.value;

  const isCurrent = todayDate.getMonth() === monthIndex && todayDate.getFullYear() === year;
  const isPast = year === todayDate.getFullYear() && monthIndex < todayDate.getMonth();

  const headerCells = useMemo<Array<{ short: string; long: string }>>(() => {
    const cells: Array<{ short: string; long: string }> = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(HEADER_REFERENCE);
      d.setUTCDate(HEADER_REFERENCE.getUTCDate() + ((ws + i) % 7));
      cells.push({ short: SHORT_WEEKDAY_FMT.format(d), long: LONG_WEEKDAY_FMT.format(d) });
    }
    return cells;
  }, [ws]);

  const sectionCls = [
    calStyles.section,
    isCurrent ? calStyles.current : '',
    isPast ? calStyles.past : '',
    showTone && monthIndex > todayDate.getMonth() && year === todayDate.getFullYear() ? calStyles.future : '',
    showQuarterBoundary ? calStyles.quarterEnd : '',
  ]
    .filter(Boolean)
    .join(' ');

  const monthName = settings.value.showMonthNumbers ? `${String(monthIndex + 1).padStart(2, '0')} ${name}` : name;

  return (
    <article class={sectionCls} data-month={monthIndex}>
      {showQuarter && <span class={calStyles.quarter}>{t('quarterLabel', [getQuarterNumber(monthIndex)])}</span>}
      <h2 class={calStyles.name}>{monthName}</h2>

      <div class={`${calStyles.dayHeaders} ${showWeekNumbers ? '' : calStyles.noWeek}`}>
        {showWeekNumbers && (
          <span class={calStyles.weekCorner} title={t('weekHeaderTitle')}>
            {t('weekHeaderShort')}
          </span>
        )}
        {headerCells.map((cell) => (
          <span
            key={cell.long}
            class={calStyles.headerCell}
            title={cell.long}
            aria-label={cell.long}
            data-testid="weekday-header"
          >
            {cell.short}
          </span>
        ))}
      </div>

      <div class={`${calStyles.dayGrid} ${showWeekNumbers ? '' : calStyles.noWeek}`}>
        {rows.map((row) => {
          const rowHasCurrentWeek = row.days.some(
            (d) => d && isSameWeek(d, todayDate, ws),
          );
          const rowHasSelectedWeek = row.days.some(
            (d) => d && isSameWeek(d, selectedDate, ws),
          );
          return (
            <div
              key={row.weekNumber}
              class={`${calStyles.weekRow} ${previewable ? calStyles.previewable : ''}`}
              data-testid="calendar-week-row"
            >
              {showWeekNumbers && (
                <span
                  class={[
                    calStyles.weekNumber,
                    highlightCurrentWeek && rowHasCurrentWeek ? calStyles.current : '',
                    rowHasSelectedWeek ? calStyles.selectedWeekNumber : '',
                  ].filter(Boolean).join(' ')}
                  aria-label={t('weekNumberAria', [row.weekNumber])}
                >
                  {row.weekNumber}
                </span>
              )}
              {row.days.map((d, dayIndex) => {
                if (!d) {
                  return (
                    <span
                      key={`empty-${row.weekNumber}-${dayIndex}`}
                      class={`${calStyles.day} ${calStyles.empty}`}
                      aria-hidden="true"
                    />
                  );
                }
                const iso = formatISODate(d);
                const isToday = isSameDay(d, todayDate);
                const inCurrentWeek = isSameWeek(d, todayDate, ws);
                const inSelectedWeek = isSameWeek(d, selectedDate, ws);
                const weekday = d.getDay();
                const isWeekend = weekday === 0 || weekday === 6;
                const spoken = fullDateFormatter.format(d);
                const isSelected = selected.value === iso;
                const isPastDay = showTone && d.getTime() < todayDate.getTime();
                const isFutureDay = showTone && d.getTime() > todayDate.getTime();
                const sameSelectedWeekday = settings.value.showSelectedContext && weekday === selectedDate.getDay();
                const cls = [
                  calStyles.day,
                  'day',
                  settings.value.dayEmphasis === 'weekend' && isWeekend ? calStyles.weekend : '',
                  settings.value.dayEmphasis === 'workday' && !isWeekend ? calStyles.workday : '',
                  emphasizeWeekends && settings.value.dayEmphasis === 'weekend' && isWeekend ? calStyles.weekend : '',
                  highlightCurrentWeek && inCurrentWeek ? calStyles.currentWeek : '',
                  settings.value.showSelectedContext && inSelectedWeek ? calStyles.selectedWeek : '',
                  sameSelectedWeekday ? calStyles.selectedWeekday : '',
                  isPastDay ? calStyles.pastDay : '',
                  isFutureDay ? calStyles.futureDay : '',
                  isToday ? calStyles.today : '',
                  isSelected ? calStyles.selected : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={iso}
                    class={cls}
                    type="button"
                    data-iso={iso}
                    title={iso}
                    tabIndex={isSelected ? 0 : -1}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => setSelectedISO(iso)}
                    aria-label={t(
                      isToday ? 'todayAriaLabel' : 'dayAriaLabel',
                      [spoken, iso],
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </article>
  );
}
