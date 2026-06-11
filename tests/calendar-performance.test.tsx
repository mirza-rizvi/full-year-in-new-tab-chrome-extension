import { render } from 'preact';
import type { ComponentChildren } from 'preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applySettingsPatch, selectedISO, settings, setTodayISO } from '../src/state/store';

const monthRenderCounts = vi.hoisted(() => new Map<number, number>());

vi.mock('../src/components/calendar/MonthSection', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/components/calendar/MonthSection')>();
  return {
    default: (props: Parameters<typeof actual.default>[0]) => {
      monthRenderCounts.set(props.monthIndex, (monthRenderCounts.get(props.monthIndex) ?? 0) + 1);
      return actual.default(props);
    },
  };
});

const { default: Calendar } = await import('../src/components/calendar/Calendar');

function mount(node: ComponentChildren): HTMLElement {
  const host = document.createElement('div');
  document.body.append(host);
  render(<>{node}</>, host);
  return host;
}

describe('calendar performance contracts', () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    monthRenderCounts.clear();
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
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('does not rerender month sections on day hover or focus preview', async () => {
    const host = mount(<Calendar />);
    const before = new Map(monthRenderCounts);
    const target = host.querySelector<HTMLButtonElement>('button[data-iso="2026-08-12"]');

    target?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    target?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await Promise.resolve();

    expect(monthRenderCounts).toEqual(before);
  });
});
