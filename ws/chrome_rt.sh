#!/bin/sh
# chrome_rt.sh dom|shot <url> <out> [W H]: one headless Chrome in REAL time (no virtual time: async work such as image decoding completes), through the gate
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
PROF="C:/Users/agent/Desktop/flower-atelier/chrome_g${GATE_SLOT:-0}"
if [ "$1" = shot ]; then timeout 120 "$CH" --headless=new --no-first-run --allow-file-access-from-files --hide-scrollbars --user-data-dir="$PROF" --timeout=${RT_MS:-15000} --window-size="${4:-1400},${5:-900}" --screenshot="$3" "$2" >/dev/null 2>&1; [ -f "$3" ] && echo "ok $3" || echo "PAS D'IMAGE"
else timeout 120 "$CH" --headless=new --no-first-run --allow-file-access-from-files --user-data-dir="$PROF" --timeout=${RT_MS:-15000} --window-size=1400,900 --dump-dom "$2" 2>/dev/null | python -c "
import sys,re,html
s=sys.stdin.read();m=re.search(r'<pre id=\"out\"[^>]*>(.*?)</pre>',s,re.S)
print(html.unescape(m.group(1)) if m else 'NO OUTPUT '+s[:200])" > "$3"; head -c 400 "$3"; echo; fi
