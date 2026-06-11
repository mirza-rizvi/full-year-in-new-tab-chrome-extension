import { useComputed, useSignalEffect } from '@preact/signals';
import { useEffect, useMemo, useRef } from 'preact/hooks';
import MonthSection from './MonthSection';
import {
  selectedISO,
  setSelectedISO,
  settings,
  todayISO,
  weekStartValue,
} from '@/state/store';
import {
  formatISODate,
  getMonthRows,
  parseISODate,
  shiftDay,
  shiftMonth,
} from '@/calendar/core';
import { t, getUiLocale } from '@/i18n/messages';
import styles from './Calendar.module.css';

export default function Calendar() {
  const containerRef = useRef<HTMLElement | null>(null);
  const locale = getUiLocale();

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long' }),
    [locale],
  );
  const fullDateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    [locale],
  );

  const year = useComputed(() => parseISODate(todayISO.value).getFullYear());

  const months = useComputed(() => {
    const y = year.value;
    const ws = weekStartValue.value;
    const list: Array<{ index: number; name: string; rows: ReturnType<typeof getMonthRows> }> = [];
    for (let i = 0; i < 12; i += 1) {
      list.push({
        index: i,
        name: monthFormatter.format(new Date(y, i, 1)),
        rows: getMonthRows(y, i, ws),
      });
    }
    return list;
  });

  const prevSelectedISORef = useRef<string | null>(null);

  useSignalEffect(() => {
    const sel = selectedISO.value;
    if (!containerRef.current) return;

    const prev = prevSelectedISORef.current;
    if (prev && prev !== sel) {
      const prevBtn = containerRef.current.querySelector<HTMLButtonElement>(
        `button[data-iso="${prev}"]`,
      );
      if (prevBtn) prevBtn.tabIndex = -1;
    }

    const btn = containerRef.current.querySelector<HTMLButtonElement>(
      `button[data-iso="${sel}"]`,
    );
    if (btn) btn.tabIndex = 0;

    prevSelectedISORef.current = sel;
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        !target ||
        typeof (target as Element).matches !== 'function' ||
        !(target as Element).matches('button.day')
      ) {
        return;
      }
      const button = target as HTMLButtonElement;
      const iso = button.dataset.iso;
      if (!iso) return;
      const date = parseISODate(iso);
      let next: Date | null = null;
      if (event.key === 'ArrowLeft') next = shiftDay(date, -1);
      else if (event.key === 'ArrowRight') next = shiftDay(date, 1);
      else if (event.key === 'ArrowUp') next = shiftDay(date, -7);
      else if (event.key === 'ArrowDown') next = shiftDay(date, 7);
      else if (event.key === 'PageUp') next = shiftMonth(date, -1);
      else if (event.key === 'PageDown') next = shiftMonth(date, 1);
      else if (event.key === 'Home') next = new Date(date.getFullYear(), 0, 1);
      else if (event.key === 'End') next = new Date(date.getFullYear(), 11, 31);
      else if (event.key === 't' || event.key === 'T') next = parseISODate(todayISO.value);
      else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setSelectedISO(iso);
        return;
      }

      if (next) {
        if (next.getFullYear() !== year.value) return;
        event.preventDefault();
        const nextIso = formatISODate(next);
        setSelectedISO(nextIso);
        requestAnimationFrame(() => {
          const btn = containerRef.current?.querySelector<HTMLButtonElement>(
            `button[data-iso="${nextIso}"]`,
          );
          btn?.focus();
        });
      }
    };

    const node = containerRef.current;
    if (!node) return undefined;
    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
    };
  }, [year.value]);

  const modeClassByName = {
    balanced: styles.modeBalanced,
    planning: styles.modePlanning,
    wall: styles.modeWall,
    dense: styles.modeDense,
  };
  const modeClass = modeClassByName[settings.value.displayMode] ?? '';

  return (
    <section
      class={`${styles.calendar} ${settings.value.density === 'compact' ? styles.compact : ''} ${modeClass}`}
      ref={containerRef}
      aria-label={t('calendarTitle')}
    >
      {months.value.map((m) => (
        <MonthSection
          key={m.index}
          monthIndex={m.index}
          name={m.name}
          rows={m.rows}
          year={year.value}
          fullDateFormatter={fullDateFormatter}
        />
      ))}
    </section>
  );
}
