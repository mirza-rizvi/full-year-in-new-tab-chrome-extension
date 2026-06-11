# Performance Improvements

This directory is the handoff package for keeping **Full Year in New Tab** fast. The current app is a Vite/Preact/TypeScript Chrome MV3 extension that renders a full-year calendar on every new tab.

## Status

The current performance pass is implemented.

Verified commands:

```bash
npm run typecheck
npm test -- tests/calendar-view.test.tsx tests/calendar-performance.test.tsx
npm run build
```

Current production build baseline:

| Asset | Raw | Gzip | Notes |
| --- | ---: | ---: | --- |
| `newtab.html` | 0.46 kB | 0.30 kB | Includes pre-paint theme script reference |
| `newtab-*.css` | 13.60 kB | 3.64 kB | CSS Modules + global tokens |
| `newtab-*.js` | 43.75 kB | 14.60 kB | Preact app bundle |
| Font asset | 0 kB | 0 kB | System font stack; no bundled WOFF2 |

## Documents

- `PLAN.md`: implementation checklist and acceptance criteria.
- `RUNTIME-HOT-PATHS.md`: render, DOM, hover, and keyboard performance model.
- `BUNDLE-AND-RELEASE.md`: bundle budgets, release constraints, and asset guidance.
- `TESTING-AND-PROFILING.md`: automated checks and Chrome profiling steps.

## Performance Rules

- Pointer hover/focus must not write to Preact Signals.
- Week preview must stay CSS-owned through `.weekRow.previewable:hover` and `.weekRow.previewable:focus-within`.
- Keyboard roving tab index must update only the previous and current selected buttons.
- No external assets, remote requests, inline scripts, or `eval`.
- Keep the pre-paint `theme-bootstrap.js` separate and CSP-compatible.
