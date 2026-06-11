import type { ResolvedTheme, ThemePreference } from '@/state/types';

export function resolveTheme(pref: ThemePreference, systemDark: boolean): ResolvedTheme {
  if (pref === 'dark') return 'dark';
  if (pref === 'light') return 'light';
  return systemDark ? 'dark' : 'light';
}

export function applyTheme(root: HTMLElement, pref: ThemePreference, systemDark: boolean): ResolvedTheme {
  const resolved = resolveTheme(pref, systemDark);
  root.dataset.theme = resolved;
  return resolved;
}

export function nextThemePreference(p: ThemePreference): ThemePreference {
  return p === 'system' ? 'dark' : p === 'dark' ? 'light' : 'system';
}
