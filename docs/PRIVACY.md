# Privacy

Full Year in New Tab is designed to work locally inside the browser.

## What Stays On Device

The extension stores calendar display preferences in `localStorage` under one key:

- `fyi:calendar-settings`

These preferences include theme, week start, density, display mode, and calendar display toggles. They are used only to render the new-tab calendar.

## What Is Not Collected

The extension does not collect, transmit, sell, or share personal data. It does not use:

- analytics
- tracking pixels
- telemetry
- remote requests
- cookies
- Chrome sync storage
- a background worker
- host permissions

## Browser Signals Used Locally

The extension reads local browser signals only to render the page:

- preferred color scheme, when theme is set to System
- browser UI language, for date and weekday formatting

These values are not stored separately and are not sent anywhere.

## Erasing Local Data

Open Settings, then use **Erase local data** in the Privacy section. This removes saved calendar settings and legacy theme keys from local storage, then resets the in-memory view to defaults.

## Chrome Web Store Disclosure Summary

This extension does not collect user data. Settings are stored locally on the device only. The extension has no permissions, no host permissions, no background worker, no analytics, and no network requests.
