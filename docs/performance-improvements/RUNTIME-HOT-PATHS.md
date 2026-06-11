# Runtime Hot Paths

## Calendar Render Model

The calendar renders 12 `MonthSection` components and roughly 365 day buttons. Preact Signals are used for durable app state:

- `todayISO`: current calendar year and current-day styling.
- `selectedISO`: selected date and selected-week context.
- `settings`: display mode, density, week numbers, preview toggle, and styling options.
- `weekStartValue`: computed week-start value derived from settings.

Durable state changes can rerender visible calendar sections. Transient pointer state must not.

## Hover And Focus Preview

Week preview is intentionally CSS-owned:

- Each week row renders as `.weekRow`.
- Rows include `.previewable` only when `settings.value.weekPreviewOnHover` is true.
- CSS selectors handle preview visuals:
  - `.weekRow.previewable:hover`
  - `.weekRow.previewable:focus-within`

This avoids signal writes on `mouseover` and `focus`, so moving the pointer across day buttons causes no Preact render work.

Do not reintroduce a `previewISO` signal unless profiling proves a CSS-only approach cannot support a required behavior.

## Keyboard Navigation

Keyboard navigation is delegated from `Calendar` to day buttons:

- Arrow keys move by day/week.
- PageUp/PageDown move by month.
- Home/End move to year start/end.
- `t` returns to today.
- Enter/Space selects the focused date.

The roving tab index effect updates only two DOM nodes on selection changes:

- previous selected button: `tabIndex = -1`
- new selected button: `tabIndex = 0`

Avoid `querySelectorAll('button.day')` sweeps in this path.

## Accepted Budgets

| Interaction | Budget |
| --- | --- |
| Day hover | 0 `MonthSection` rerenders |
| Day focus for preview | 0 `MonthSection` rerenders |
| Arrow-key selection | O(1) tab-index DOM writes |
| Week-start setting change | Full month grid recomputation allowed |
| Display mode setting change | Full calendar class/style rerender allowed |

## Known Tradeoffs

Selection context still depends on `selectedISO`, so selecting a date can rerender month sections to update selected week and weekday styling. That is acceptable because selection is lower frequency than pointer movement. Optimize it only after profiling shows keyboard navigation remains a bottleneck.
