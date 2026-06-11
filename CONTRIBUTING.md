# Contributing

Thanks for taking the time to improve Full Year in New Tab.

## Development Setup

Install dependencies:

```bash
npm install
```

Run the local Vite dev server:

```bash
npm run dev
```

Build the extension and load the generated `dist/` directory in Chrome with **Load unpacked**.

## Required Checks

Run these before opening a pull request:

```bash
npm run typecheck
npm test
npm run build
```

For release packaging, use:

```bash
npm run release
```

## Chrome Extension Rules

This extension is intentionally local and permission-light. Do not add any of the following without updating tests and the publishing handoff in `CHROMEWEBSTORE.md`:

- Manifest permissions
- Host permissions
- Background workers
- Remote assets
- Remote requests
- Analytics or telemetry
- Chrome sync storage

Keep CSP-compatible code. Do not add inline app scripts, `eval`, `Function()`, or remotely loaded code.

## Code Guidelines

- Keep date logic in `src/calendar/core.ts` when possible.
- Keep DOM and UI behavior in Preact components.
- Preserve local settings storage under `fyi:calendar-settings`.
- Add focused tests for behavior changes.
- Keep README, `docs/PRIVACY.md`, and `CHROMEWEBSTORE.md` aligned when public behavior or privacy posture changes.

## Pull Request Checklist

- The change has a focused purpose.
- Required checks pass.
- Extension privacy and permission posture are unchanged, or the docs/tests were updated.
- Manual QA was run for browser-visible changes.
