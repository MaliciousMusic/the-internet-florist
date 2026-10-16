#!/bin/sh
# serre/run.sh <ws> "<query>" <out.json> [pl]: runs a headless batch of a workspace page (QA, perf, sptime, lsdbg) and keeps its JSON (the <pre id="out"> of the page) in serre/ws/<ws>/
# summary of a QA run: python3 serre/qasum.py serre/ws/<ws>/<out.json>
R="$(cd "$(dirname "$0")/.." && pwd)"; W="$R/serre/ws/$1"; PG=qa13; [ "$4" = pl ] && PG=pl
CH=$(sh "$R/serre/chrome.sh") || exit 1
for p in python3 python; do $p -c "" 2>/dev/null && PY=$p && break; done
U=$(cygpath -m "$W" 2>/dev/null || echo "$W"); U="file:///${U#/}"
HL=--headless=new; case "$CH" in *headless_shell*) HL=--headless;; esac
PROF=$(mktemp -d)
timeout 1500 "$CH" $HL --no-sandbox --disable-gpu --disable-dev-shm-usage --no-first-run --allow-file-access-from-files --user-data-dir="$PROF" --virtual-time-budget=900000 --run-all-compositor-stages-before-draw --window-size=1200,900 --dump-dom "$U/$PG.html?$2" 2>/dev/null | $PY -c "
import sys,re,html
s=sys.stdin.read();m=re.search(r'<pre id=\"out\">(.*?)</pre>',s,re.S)
print(html.unescape(m.group(1)) if m else 'NO OUTPUT '+s[:300])" > "$W/$3"
rm -rf "$PROF"
head -c 300 "$W/$3"; echo
