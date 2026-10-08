#!/bin/sh
# chrome1.sh shot <url> <out.png> <W> <H> | dom <url> <out.json>: one headless Chrome, its own throwaway profile per gate slot (run it through gate.sh)
SP="C:/Users/agent/Desktop/flower-atelier"
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
PROF="$SP/chrome_g${GATE_SLOT:-0}"
LOG="$SP/ws/locks/log${GATE_SLOT:-0}.txt"
if [ "$1" = shot ]; then
  timeout 300 "$CH" --headless=new --disable-gpu --no-first-run --allow-file-access-from-files --hide-scrollbars --user-data-dir="$PROF" --virtual-time-budget=60000 --window-size="$4,$5" --enable-logging=stderr --v=0 --screenshot="$3" "$2" >/dev/null 2>"$LOG"
  # page errors (uncaught exceptions, console errors) are worth seeing
  grep -a "CONSOLE" "$LOG" | grep -ai "error\|uncaught" | sed 's/^.*CONSOLE[^]]*\] //' | head -5
  [ -f "$3" ] && echo "ok $3" || echo "PAS D'IMAGE (timeout ou crash)"
else
  timeout 1500 "$CH" --headless=new --disable-gpu --no-first-run --allow-file-access-from-files --user-data-dir="$PROF" --virtual-time-budget=900000 --run-all-compositor-stages-before-draw --window-size=1200,900 --dump-dom "$2" 2>/dev/null | python -c "
import sys,re,html
s=sys.stdin.read();m=re.search(r'<pre id=\"out\">(.*?)</pre>',s,re.S)
print(html.unescape(m.group(1)) if m else 'NO OUTPUT '+s[:300])" > "$3"
  head -c 300 "$3"; echo
fi
