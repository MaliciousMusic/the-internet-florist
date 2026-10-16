#!/bin/sh
# serre/chrome.sh: prints the path of a Chrome or Chromium that runs headless (the CHROME variable, a system browser, or Playwright's); otherwise says how to get one
for c in "$CHROME" google-chrome google-chrome-stable chromium chromium-browser "/c/Program Files/Google/Chrome/Application/chrome.exe" "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
  [ -n "$c" ] || continue
  if [ -x "$c" ]; then echo "$c"; exit 0; fi
  p=$(command -v "$c" 2>/dev/null) && { echo "$p"; exit 0; }
done
for p in /opt/pw-browsers/chromium-*/chrome-linux*/chrome "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome "$HOME"/.cache/ms-playwright/chromium_headless_shell-*/chrome-*/headless_shell; do
  [ -x "$p" ] && { echo "$p"; exit 0; }
done
echo "aucun Chrome trouvé : lancer sh serre/setup.sh" >&2; exit 1
