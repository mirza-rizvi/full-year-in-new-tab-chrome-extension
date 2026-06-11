import { render } from 'preact';
import type { ComponentChildren } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/components/App';
import SettingsModal, { openSettings } from '../src/components/settings/SettingsModal';
import Calendar from '../src/components/calendar/Calendar';
import {
  applyDisplayMode,
  applySettingsPatch,
  selectedISO,
  settings,
  setTodayISO,
} from '../src/state/store';

function mount(node: ComponentChildren): HTMLElement {
  const host = document.createElement('div');
  document.body.append(host);
  render(<>{node}</>, host);
  return host;
}

describe('minimal calendar view', () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        storage = {};
      },
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    applySettingsPatch({
      themePreference: 'system',
      weekStart: 'sunday',
      showProgressBar: true,
      showWeekNumbers: false,
      showQuarterLabels: false,
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
    } as Partial<typeof settings.value>);
    setTodayISO('2026-06-08');
    selectedISO.value = '2026-06-08';
    vi.unstubAllGlobals();
  });

  it('renders the year header and all twelve months without extra app UI', () => {
    setTodayISO('2026-06-08');

    const host = mount(<App />);

    expect(host.querySelector('h1')?.textContent).toBe('2026');
    expect(host.querySelectorAll('article').length).toBe(12);
    expect(host.textContent).toContain('January');
    expect(host.textContent).toContain('December');
    expect(host.textContent).not.toContain('Tasks');
    expect(host.textContent).not.toContain('Notes');
    expect(host.textContent).not.toContain('Timer');
    expect(host.textContent).not.toContain('Goals');
    expect(host.textContent).not.toContain('Command palette');
  });

  it('starts weeks on Sunday by default', () => {
    const host = mount(<Calendar />);

    const firstMonthHeaders = Array.from(
      host.querySelectorAll('article:first-child [data-testid="weekday-header"]'),
    ).map((node) => node.textContent);

    expect(firstMonthHeaders).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
  });

  it('opens calendar settings and applies display toggles', async () => {
    const host = mount(
      <>
        <button type="button" onClick={openSettings}>
          Open
        </button>
        <SettingsModal />
        <Calendar />
      </>,
    );

    host.querySelector<HTMLButtonElement>('button')?.click();
    await Promise.resolve();

    expect(host.querySelector('[role="dialog"]')?.textContent).toContain('Calendar settings');

    const mode = host.querySelector<HTMLSelectElement>('select[name="displayMode"]');
    if (mode) {
      mode.value = 'wall';
      mode.dispatchEvent(new Event('change', { bubbles: true }));
    }
    await Promise.resolve();
    expect(host.textContent).toContain('Settings saved.');
    expect(settings.value.displayMode).toBe('wall');

    host
      .querySelector<HTMLInputElement>('input[name="showWeekNumbers"]')
      ?.click();
    await Promise.resolve();
    expect(host.querySelector('[aria-label="ISO week 1"]')).not.toBeNull();

    host
      .querySelector<HTMLInputElement>('input[name="showQuarterLabels"]')
      ?.click();
    await Promise.resolve();
    expect(host.textContent).toContain('Q1');
  });

  it('shows accessible help tooltips for every setting without changing values', async () => {
    const host = mount(
      <>
        <button type="button" onClick={openSettings}>
          Open
        </button>
        <SettingsModal />
      </>,
    );

    host.querySelector<HTMLButtonElement>('button')?.click();
    await Promise.resolve();

    const helpButtons = host.querySelectorAll<HTMLButtonElement>('[data-testid="setting-help"]');
    const progressToggle = host.querySelector<HTMLInputElement>('input[name="showProgressBar"]');

    expect(helpButtons.length).toBe(15);
    expect(host.textContent).toContain('Shows or hides the progress bar for how far through the year today is.');
    expect(host.textContent).toContain('Highlights a week while you hover or keyboard-focus a day, without changing the selected date.');
    expect(helpButtons[0]?.type).toBe('button');

    expect(progressToggle?.checked).toBe(true);
    helpButtons[0]?.click();
    helpButtons[0]?.focus();
    await Promise.resolve();
    expect(progressToggle?.checked).toBe(true);
  });

  it('persists calendar settings in localStorage', () => {
    applySettingsPatch({ weekStart: 'monday', density: 'compact' } as Partial<typeof settings.value>);

    expect(JSON.parse(localStorage.getItem('fyi:calendar-settings') ?? '{}')).toMatchObject({
      weekStart: 'monday',
      density: 'compact',
    });
  });

  it('erases local calendar data and legacy theme keys from privacy settings', async () => {
    localStorage.setItem('fyi:theme-pref', 'dark');
    localStorage.setItem('fyi:theme-cache', 'dark');
    applySettingsPatch({ weekStart: 'monday', density: 'compact' } as Partial<typeof settings.value>);

    const host = mount(<SettingsModal />);
    openSettings();
    await Promise.resolve();

    host.querySelector<HTMLButtonElement>('button[data-testid="erase-local-data"]')?.click();
    await Promise.resolve();

    expect(localStorage.getItem('fyi:calendar-settings')).toBeNull();
    expect(localStorage.getItem('fyi:theme-pref')).toBeNull();
    expect(localStorage.getItem('fyi:theme-cache')).toBeNull();
    expect(settings.value.weekStart).toBe('sunday');
    expect(settings.value.density).toBe('comfortable');
    expect(host.textContent).toContain('Local data erased.');
  });

  it('shows selected date context and a today return affordance when another day is selected', async () => {
    setTodayISO('2026-06-08');
    const host = mount(<App />);

    host.querySelector<HTMLButtonElement>('button[data-iso="2026-07-10"]')?.click();
    await Promise.resolve();

    expect(host.textContent).toContain('Selected: Friday, July 10, 2026');
    expect(host.textContent).toContain('Today: Monday, June 8');
    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-07-10"]')?.className).toContain(
      'selected',
    );
    expect(
      host.querySelector<HTMLButtonElement>('button[data-iso="2026-07-06"]')?.className,
    ).toContain('selectedWeek');
    expect(
      host.querySelector<HTMLButtonElement>('button[data-iso="2026-01-02"]')?.className,
    ).toContain('selectedWeekday');
  });

  it('marks past, today, future, current month, and quarter boundary states', async () => {
    setTodayISO('2026-06-08');

    const host = mount(<Calendar />);

    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-01-01"]')?.className).toContain(
      'pastDay',
    );
    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-06-08"]')?.className).toContain(
      'today',
    );
    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-12-31"]')?.className).toContain(
      'futureDay',
    );
    expect(host.querySelector('article[data-month="5"]')?.className).toContain('current');

    applySettingsPatch({ showQuarterBoundaries: true } as Partial<typeof settings.value>);
    await Promise.resolve();
    expect(host.querySelector('article[data-month="2"]')?.className).toContain('quarterEnd');
  });

  it('marks week rows as previewable without changing selected date on hover', async () => {
    setTodayISO('2026-06-08');
    selectedISO.value = '2026-06-08';
    const host = mount(<Calendar />);

    const target = host.querySelector<HTMLButtonElement>('button[data-iso="2026-08-12"]');
    const row = target?.closest('[data-testid="calendar-week-row"]');

    expect(row?.className).toContain('previewable');

    host
      .querySelector<HTMLButtonElement>('button[data-iso="2026-08-12"]')
      ?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await Promise.resolve();

    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-08-10"]')?.className).not.toContain(
      'previewWeek',
    );
    expect(selectedISO.value).toBe('2026-06-08');
  });

  it('removes previewable week rows when hover preview is disabled', () => {
    applySettingsPatch({ weekPreviewOnHover: false } as Partial<typeof settings.value>);

    const host = mount(<Calendar />);

    expect(host.querySelector('[data-testid="calendar-week-row"]')?.className).not.toContain('previewable');
  });

  it('keeps roving tab index correct during keyboard navigation', async () => {
    setTodayISO('2026-06-08');
    selectedISO.value = '2026-06-08';
    const host = document.createElement('div');
    document.body.append(host);
    await act(() => {
      render(<Calendar />, host);
    });
    const current = host.querySelector<HTMLButtonElement>('button[data-iso="2026-06-08"]');

    await act(() => {
      current?.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

    expect(selectedISO.value).toBe('2026-06-09');
    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-06-08"]')?.tabIndex).toBe(-1);
    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-06-09"]')?.tabIndex).toBe(0);
  });

  it('applies display mode presets and persists them', () => {
    applyDisplayMode('planning');

    expect(settings.value).toMatchObject({
      displayMode: 'planning',
      showWeekNumbers: true,
      showQuarterLabels: true,
      showQuarterBoundaries: true,
      density: 'comfortable',
    });
    expect(JSON.parse(localStorage.getItem('fyi:calendar-settings') ?? '{}')).toMatchObject({
      displayMode: 'planning',
      showWeekNumbers: true,
    });

    applyDisplayMode('dense');
    expect(settings.value).toMatchObject({
      displayMode: 'dense',
      density: 'compact',
      showMonthNumbers: true,
    });
  });

  it('supports month numbers and workday emphasis settings', () => {
    applySettingsPatch({
      showMonthNumbers: true,
      dayEmphasis: 'workday',
      emphasizeWeekends: false,
    } as Partial<typeof settings.value>);

    const host = mount(<Calendar />);

    expect(host.querySelector('article:first-child h2')?.textContent).toBe('01 January');
    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-01-05"]')?.className).toContain(
      'workday',
    );
    expect(host.querySelector<HTMLButtonElement>('button[data-iso="2026-01-04"]')?.className).not.toContain(
      'weekend',
    );
  });
});
