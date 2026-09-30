#!/usr/bin/env bash
# Runs unit tests, astro check, build, and dist smoke checks when the agent finishes.
set -uo pipefail

cat >/dev/null

cd "$(dirname "$0")/../.." || exit 0

[ -f package.json ] || exit 0
[ -d node_modules ] || exit 0

log=$(mktemp)
trap 'rm -f "$log"' EXIT

export NO_COLOR=1 FORCE_COLOR=0

if npx --no-install astro check >>"$log" 2>&1 \
  && npm test >>"$log" 2>&1 \
  && npm run build >>"$log" 2>&1 \
  && npm run smoke >>"$log" 2>&1; then
  exit 0
fi

tail -n 40 "$log" | sed -E 's/\x1b\[[0-9;]*m//g' | jq -Rs '{followup_message: ("網站驗證失敗，請修好再結束。astro check / build 輸出：\n" + .)}'
exit 0
