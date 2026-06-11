# Performance Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the full-year Chrome new-tab calendar responsive by removing render work from pointer hot paths, reducing first-load asset weight, and preserving keyboard/accessibility behavior.

**Architecture:** Durable calendar state remains in Preact Signals. Transient hover/focus preview is represented by DOM/CSS row state instead of signal writes. Bundle work avoids network requests and keeps MV3 CSP compatibility.

**Tech Stack:** Preact 10, `@preact/signals`, Vite 5, TypeScript, Vitest, CSS Modules, Chrome MV3.

---

## Current Baseline

Verified after this performance pass:

- `npm run typecheck` passes.
- `npm test -- tests/calendar-view.test.tsx tests/calendar-performance.test.tsx` passes.
- `npm run build` passes.
- Production build output:
  - `dist/newtab.html`: `0.46 kB`, gzip `0.30 kB`
  - CSS: `13.60 kB`, gzip `3.64 kB`
  - JS: `43.75 kB`, gzip `14.60 kB`
  - No emitted font asset.

The Vite warning about `<script src="theme-bootstrap.js">` is expected. That script is intentionally non-module so it can run before the bundled app and set the theme before first paint.

## Task 1: CSS-Owned Week Preview

**Files:**

- Modify: `src/components/calendar/Calendar.tsx`
- Modify: `src/components/calendar/MonthSection.tsx`
- Modify: `src/components/calendar/Calendar.module.css`
- Test: `tests/calendar-view.test.tsx`
- Test: `tests/calendar-performance.test.tsx`

- [x] Remove the local `previewISO` signal from `Calendar`.
- [x] Remove `previewISO` and `onPreview` props from `MonthSection`.
- [x] Remove hover/focus handlers that write preview state.
- [x] Render each calendar row as a keyed `.weekRow`.
- [x] Add `.previewable` only when `settings.value.weekPreviewOnHover` is enabled.
- [x] Move preview visuals to `.weekRow.previewable:hover` and `.weekRow.previewable:focus-within`.
- [x] Add a render-count test proving day hover/focus causes no `MonthSection` rerenders.

Acceptance:

- Hovering a day does not change `selectedISO`.
- Hovering/focusing a day does not increment `MonthSection` render counts.
- Toggling `weekPreviewOnHover` removes the `.previewable` row class.

## Task 2: Keyboard And DOM Mutation Guardrails

**Files:**

- Modify: `src/components/calendar/Calendar.tsx`
- Test: `tests/calendar-view.test.tsx`

- [x] Keep roving tab index updates O(1) by demoting only the previous selected button and promoting only the new selected button.
- [x] Use structural DOM checks for delegated keyboard events instead of realm-sensitive `instanceof HTMLButtonElement`.
- [x] Add a keyboard regression test for ArrowRight selection movement and tab index updates.

Acceptance:

- Arrow navigation updates `selectedISO`.
- The previous day has `tabIndex=-1`.
- The newly selected day has `tabIndex=0`.

## Task 3: Bundle And Paint Cost Reduction

**Files:**

- Modify: `src/styles/global.css`
- Modify: `src/components/calendar/Calendar.module.css`
- Document: `docs/performance-improvements/BUNDLE-AND-RELEASE.md`

- [x] Remove the bundled Inter variable font import.
- [x] Use the system UI font stack.
- [x] Remove the animated today pulse and keep a static today ring.
- [x] Confirm the production build no longer emits the `InterVariable` asset.

Acceptance:

- No `dist/assets/*.woff2` is emitted by `npm run build`.
- Calendar remains readable in dark and light themes.
- Reduced-motion users and default users both avoid the old infinite today animation.

## Task 4: Handoff Documentation

**Files:**

- Create: `docs/performance-improvements/README.md`
- Replace: `docs/performance-improvements/PLAN.md`
- Create: `docs/performance-improvements/RUNTIME-HOT-PATHS.md`
- Create: `docs/performance-improvements/BUNDLE-AND-RELEASE.md`
- Create: `docs/performance-improvements/TESTING-AND-PROFILING.md`

- [x] Capture measured baseline and accepted budgets.
- [x] Explain why hover preview must remain CSS-owned.
- [x] Document bundle/release constraints for Chrome MV3.
- [x] Document automated and manual profiling checks.

Acceptance:

- A future engineer can verify the current performance contracts without rediscovering the architecture.
- Stale signal-preview guidance has been removed.

## Future Work

Do not implement these until profiling shows a real bottleneck:

- Split selected-week rendering into finer-grained row or day components.
- Cache formatted full date labels per rendered day.
- Add browser-level performance tests with Playwright and Chrome tracing.
- Revisit CSS containment if layout profiling shows row changes invalidating more than one month section.
