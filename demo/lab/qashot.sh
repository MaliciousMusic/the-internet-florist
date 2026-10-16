#!/bin/sh
# screenshot of the QA page (headless Chrome, own throwaway profile, file URL)
Q="$1"; OUT="$2"; W="${3:-1200}"; H="${4:-1400}"
timeout 240 "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-first-run --allow-file-access-from-files --hide-scrollbars --user-data-dir="C:/Users/agent/AppData/Local/Temp/claude/C--Users-agent-Desktop-flower/66d88b75-4a3d-47fa-a981-a4de33e86f71/scratchpad/chrome_shot2" --virtual-time-budget=60000 --window-size=$W,$H --screenshot="C:/Users/agent/AppData/Local/Temp/claude/C--Users-agent-Desktop-flower/66d88b75-4a3d-47fa-a981-a4de33e86f71/scratchpad/$OUT" "file:///C:/Users/agent/AppData/Local/Temp/claude/C--Users-agent-Desktop-flower/66d88b75-4a3d-47fa-a981-a4de33e86f71/scratchpad/lab/qa13.html?$Q" >/dev/null 2>&1
