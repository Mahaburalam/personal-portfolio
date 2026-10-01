#!/usr/bin/env bash
# Renders the static pipeline SVGs to PNG (1920×1080 and 3840×2160) with headless Chrome.
# Run after `pnpm gen:pipeline`. Needs google-chrome (or set CHROME=/path/to/chromium).
set -euo pipefail
cd "$(dirname "$0")/../../public/hero/pipeline"
CHROME="${CHROME:-google-chrome}"
for theme in dark light; do
  for scale in 1 2; do
    out="pipeline-${theme}.png"
    [ "$scale" = 2 ] && out="pipeline-${theme}@4k.png"
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --default-background-color=00000000 \
      --window-size=1920,1080 --force-device-scale-factor="$scale" \
      --screenshot="$PWD/$out" "file://$PWD/pipeline-${theme}.svg" >/dev/null 2>&1
    echo "$out"
  done
done
