#!/bin/sh
# run the QA page in headless Chrome (own throwaway profile) and print the JSON result
Q="$1"; OUT="$2"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-first-run --allow-file-access-from-files --user-data-dir="C:/Users/agent/AppData/Local/Temp/claude/C--Users-agent-Desktop-flower/66d88b75-4a3d-47fa-a981-a4de33e86f71/scratchpad/chrome_qa_$3" --virtual-time-budget=900000 --run-all-compositor-stages-before-draw --window-size=1200,900 --dump-dom "file:///C:/Users/agent/AppData/Local/Temp/claude/C--Users-agent-Desktop-flower/66d88b75-4a3d-47fa-a981-a4de33e86f71/scratchpad/lab/qa13.html?$Q" 2>/dev/null | python -c "
import sys,re,html
s=sys.stdin.read();m=re.search(r'<pre id=\"out\">(.*?)</pre>',s,re.S)
print(html.unescape(m.group(1)) if m else 'NO OUTPUT '+s[:300])" > "$OUT"
