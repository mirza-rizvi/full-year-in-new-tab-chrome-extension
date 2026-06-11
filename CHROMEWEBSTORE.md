# Chrome Web Store Handoff

This file tracks publishing metadata for coding agents and maintainers. Keep it current whenever manifest fields, permissions, privacy behavior, or extension purpose changes.

## Single Purpose

Full Year in New Tab replaces the Chrome new-tab page with a local, full-year calendar.

The extension helps users see the current year, date context, week numbers, progress through the year, and calendar display preferences from a new tab.

## Manifest Surface

- Manifest version: MV3
- Extension surface: `chrome_url_overrides.newtab`
- Background worker: none
- Options page: none
- Popup: none
- Side panel: none
- Content scripts: none
- Incognito: not allowed

## Permissions

Current manifest permissions: none.

Justification: the extension does not need Chrome extension permissions. Settings are stored locally with page `localStorage`, and the extension does not access browser history, tabs, identity, storage permission APIs, bookmarks, or page content.

## Host Permissions

Current host permissions: none.

Justification: the extension does not read, modify, or request data from websites.

## Privacy

No user data is collected, transmitted, sold, or shared.

Local-only data:

- `localStorage["fyi:calendar-settings"]`: display and theme preferences for the calendar.

The extension does not use:

- analytics
- telemetry
- tracking pixels
- cookies
- Chrome sync storage
- remote requests
- remote assets
- background workers

Privacy document: `docs/PRIVACY.md`.

## Content Security Policy

The extension uses a restrictive CSP in `manifest.json`:

```text
default-src 'none'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self';
```

The pre-paint `theme-bootstrap.js` script is packaged locally and loaded before the app bundle to avoid a theme flash.

## Release

Run:

```bash
npm run release
```

This runs typecheck, tests, build, and creates the Chrome Web Store zip from `dist`.

Before submission, verify:

- `manifest.json` has no `permissions`.
- `manifest.json` has no `host_permissions`.
- `dist/` contains no source maps unless intentionally enabled.
- `docs/PRIVACY.md` matches runtime behavior.
- Screenshots and listing text describe a local full-year new-tab calendar only.
