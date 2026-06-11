# Testing And Profiling

## Automated Checks

Run the full local verification set:

```bash
npm run typecheck
npm test
npm run build
```

For performance-specific work, run:

```bash
npm test -- tests/calendar-view.test.tsx tests/calendar-performance.test.tsx
```

Relevant tests:

- `tests/calendar-performance.test.tsx`: verifies hover/focus preview does not rerender `MonthSection`.
- `tests/calendar-view.test.tsx`: verifies preview row classes, disabled preview behavior, selected date behavior, keyboard navigation, and display settings.

## Manual Chrome Profiling

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Load unpacked from the repository `dist/` directory.
5. Open a new tab.
6. Open DevTools Performance.
7. Record rapid pointer movement across several calendar rows for 2 seconds.
8. Stop recording.

Expected result:

- Pointer movement shows style/paint work for hover state.
- Pointer movement does not show Preact component render work.
- No long tasks appear during normal hover.

## Keyboard Profiling

1. Focus the selected day.
2. Record a Performance trace.
3. Hold ArrowRight for several date moves.
4. Stop recording.

Expected result:

- Selection changes remain responsive.
- Tab-index updates are limited to previous and current selected buttons.
- Any month rerender work comes from selected-week styling, not tab-index sweeps.

## Regression Checklist

Use this checklist after performance changes:

- Hover preview works with mouse.
- Hover preview works with keyboard focus.
- Disabling week preview removes preview row styling.
- Week numbers still align with day rows.
- Sunday and Monday week-start modes still render headers correctly.
- Compact, balanced, planning, wall, and dense modes still fit the viewport.
- Today is visible with a static ring.
- Past/future tone and selected-week context still render.
- Build output does not include a font asset.
