#!/bin/sh
# dbgdump.sh <url> : dump-dom of a page (through the gate) and print the text of <pre id="dbgout">
SP="C:/Users/agent/Desktop/flower-atelier"
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
PROF="$SP/chrome_g${GATE_SLOT:-0}"
timeout 600 "$CH" --headless=new --disable-gpu --no-first-run --allow-file-access-from-files --user-data-dir="$PROF" --virtual-time-budget=120000 --window-size=1400,1000 --hide-scrollbars --dump-dom "$1" 2>/dev/null | python -c "
import sys,re,html
s=sys.stdin.read();m=re.search(r'<pre id=\"dbgout\">(.*?)</pre>',s,re.S)
print(html.unescape(m.group(1)) if m else 'NO DBG '+s[:200])"
