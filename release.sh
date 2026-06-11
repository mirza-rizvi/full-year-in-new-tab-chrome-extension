#!/usr/bin/env bash
# ──────────────────────────────────────────────
# Full Year in New Tab — Chrome Web Store release
# Usage: bash release.sh
# Produces: full-year-in-new-tab-v<version>.zip
# ──────────────────────────────────────────────
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "▸ Type-checking…"
npm run typecheck

echo "▸ Running tests…"
npm run test --silent

echo "▸ Building…"
rm -rf dist
npm run build

VERSION=$(python3 - <<'PY'
import json
from pathlib import Path
print(json.loads(Path("dist/manifest.json").read_text(encoding="utf-8"))["version"])
PY
)

if [[ -z "${VERSION}" ]]; then
  echo "ERROR: Could not read version from dist/manifest.json" >&2
  exit 1
fi

ZIPNAME="full-year-in-new-tab-v${VERSION}.zip"
rm -f "${ZIPNAME}"

(
  cd dist
  zip -r "../${ZIPNAME}" .
)

echo ""
echo "✓  ${ZIPNAME}"
echo ""
unzip -l "${ZIPNAME}"
SIZE=$(du -sh "${ZIPNAME}" | cut -f1)
echo ""
echo "Total: ${SIZE}"
