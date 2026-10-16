#!/bin/sh
# serre/shot.sh <ws> <pl|qa13> "<query>" <out.png> [W] [H]: screenshot of a workspace page in headless Chrome; the png lands in serre/ws/<ws>/; prints the page's JS errors
R="$(cd "$(dirname "$0")/.." && pwd)"; W="$R/serre/ws/$1"; PG="$2"; [ "$PG" = qa ] && PG=qa13
CH=$(sh "$R/serre/chrome.sh") || exit 1
U=$(cygpath -m "$W" 2>/dev/null || echo "$W"); U="file:///${U#/}"
HL=--headless=new; case "$CH" in *headless_shell*) HL=--headless;; esac
PROF=$(mktemp -d); mkdir -p "$(dirname "$W/$4")"
timeout 300 "$CH" $HL --no-sandbox --disable-gpu --disable-dev-shm-usage --no-first-run --allow-file-access-from-files --hide-scrollbars --user-data-dir="$PROF" --virtual-time-budget=60000 --window-size="${5:-1400},${6:-1800}" --enable-logging=stderr --v=0 --screenshot="$W/$4" "$U/$PG.html?$3" >/dev/null 2>"$PROF.log"
grep -a "CONSOLE" "$PROF.log" | grep -ai "error\|uncaught" | sed 's/^.*CONSOLE[^]]*\] //' | head -5
rm -rf "$PROF" "$PROF.log"
[ -f "$W/$4" ] && echo "ok $W/$4" || echo "PAS D'IMAGE (timeout ou crash)"
