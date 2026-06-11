import { useEffect } from 'preact/hooks';
import { effect } from '@preact/signals';
import Layout from './shell/Layout';
import { applyTheme } from '@/theme/bootstrap';
import { setTodayISO, settings, todayISO } from '@/state/store';
import { formatISODate, startOfDay } from '@/calendar/core';

const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

function syncThemeToRoot(): void {
  applyTheme(
    document.documentElement,
    settings.value.themePreference,
    systemThemeQuery.matches,
  );
}

function scheduleMidnightRefresh(): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const tick = (): void => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 100);
    timer = setTimeout(() => {
      setTodayISO(formatISODate(startOfDay(new Date())));
      tick();
    }, Math.max(1000, next.getTime() - now.getTime()));
  };
  tick();
  return () => {
    if (timer) clearTimeout(timer);
  };
}

export default function App() {
  useEffect(() => {
    const disposeThemeEffect = effect(() => {
      // Re-runs when themePreference changes
      void settings.value.themePreference;
      syncThemeToRoot();
    });

    const onSystemTheme = (): void => {
      if (settings.value.themePreference === 'system') syncThemeToRoot();
    };
    systemThemeQuery.addEventListener('change', onSystemTheme);

    const stopMidnight = scheduleMidnightRefresh();

    const refreshIfDateChanged = (): void => {
      const iso = formatISODate(startOfDay(new Date()));
      if (iso !== todayISO.value) setTodayISO(iso);
    };
    const onVisibility = (): void => {
      if (!document.hidden) refreshIfDateChanged();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', refreshIfDateChanged);

    return () => {
      disposeThemeEffect();
      systemThemeQuery.removeEventListener('change', onSystemTheme);
      stopMidnight();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', refreshIfDateChanged);
    };
  }, []);

  return <Layout />;
}
