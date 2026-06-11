# Bundle And Release Performance

## Current Build Baseline

After the performance pass:

```text
dist/newtab.html                  0.46 kB │ gzip:  0.30 kB
dist/assets/newtab-*.css         13.60 kB │ gzip:  3.64 kB
dist/assets/newtab-*.js          43.75 kB │ gzip: 14.60 kB
```

No WOFF2 font asset is emitted.

## Asset Policy

- Use the system font stack from `src/styles/global.css`.
- Do not add remote fonts or remote images.
- Do not re-add bundled fonts unless there is a product requirement and the size cost is accepted.
- Keep icons in `icons/` and copied through `vite-plugin-static-copy`.

The previous Inter variable font was about `352 kB` raw. Removing it is the largest first-load win in the current app.

## Theme Bootstrap

`public/theme-bootstrap.js` is intentionally loaded as:

```html
<script src="theme-bootstrap.js"></script>
```

Vite warns that it cannot bundle this non-module script. Keep it this way unless a replacement still runs before first paint and remains CSP-compatible.

## Release Checks

Run the release script before packaging:

```bash
bash release.sh
```

The script runs typecheck, tests, build, and creates `full-year-in-new-tab-v<version>.zip` from `dist`.

Before release, inspect `unzip -l` output from the script:

- `manifest.json` is present.
- `_locales/` is present.
- `icons/` is present.
- `theme-bootstrap.js` is present.
- No unexpected font asset is present.
- No source maps are present unless intentionally enabled.

## Budgets

Treat these as soft budgets for future changes:

| Asset | Budget |
| --- | ---: |
| JS gzip | under 18 kB |
| CSS gzip | under 5 kB |
| Extension zip | under 100 kB unless icons dominate |
| Font assets | 0 kB by default |

If a feature exceeds a budget, document the reason in this directory before release.
