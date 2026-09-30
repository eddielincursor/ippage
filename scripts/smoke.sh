#!/usr/bin/env bash
# After astro build: nested essays, namespaced OG images, and valid JSON-LD must exist.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
dist="$root/dist"
site="https://eddielincursor.github.io/ippage"

fail() {
  echo "smoke: $*" >&2
  exit 1
}

[ -d "$dist" ] || fail "dist/ is missing; run npm run build first"

need=(
  "essays/notes/keep-scripts-near-the-mess/index.html"
  "essays/site/index.html"
  "og/site.png"
  "og/essay/site.png"
  "og/essay/notes/keep-scripts-near-the-mess.png"
  "og/topic-programming.png"
)

for file in "${need[@]}"; do
  [ -f "$dist/$file" ] || fail "missing $file"
done

python3 - "$dist" "$site" <<'PY' || fail "JSON-LD / sitemap checks failed"
import json
import re
import sys
from pathlib import Path

dist = Path(sys.argv[1])
site = sys.argv[2]

def json_ld(html: str) -> dict:
    match = re.search(
        r'<script type="application/ld\+json">(.*?)</script>',
        html,
        re.S,
    )
    if not match:
        raise SystemExit("missing JSON-LD script")
    payload = match.group(1)
    if "<" in payload:
        raise SystemExit("JSON-LD still contains raw <")
    return json.loads(payload)

site_essay = json_ld((dist / "essays/site/index.html").read_text())
types = {node["@type"] for node in site_essay["@graph"]}
if types != {"BlogPosting", "BreadcrumbList"}:
    raise SystemExit(f"unexpected essay schema types: {types}")

image = next(node["image"] for node in site_essay["@graph"] if node["@type"] == "BlogPosting")
expected = f"{site}/og/essay/site.png"
if image != expected:
    raise SystemExit(f"essay named site collided with site OG image: {image}")

topic = json_ld((dist / "topics/programming/index.html").read_text())
topic_types = {node["@type"] for node in topic["@graph"]}
if "FAQPage" in topic_types:
    raise SystemExit("topic page still emits FAQPage")
if "CollectionPage" not in topic_types:
    raise SystemExit("topic page missing CollectionPage")

html = (dist / "essays/site/index.html").read_text()
if f'content="{expected}"' not in html:
    raise SystemExit("og:image for site.md is not namespaced")

sitemap = (dist / "sitemap-0.xml").read_text()
if "/essays/notes/keep-scripts-near-the-mess/" not in sitemap:
    raise SystemExit("nested essay missing from sitemap")
if not re.search(
    rf"<loc>{re.escape(site)}/essays/site/</loc>\s*<lastmod>2026-07-01",
    sitemap,
):
    raise SystemExit("sitemap lastmod for site.md did not use updatedDate")
PY

echo "smoke: ok"
