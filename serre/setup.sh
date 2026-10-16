#!/bin/sh
# serre/setup.sh: makes sure a headless Chrome exists (installs Playwright's Chromium when there is none), then checks that a workspace page builds
R="$(cd "$(dirname "$0")/.." && pwd)"
if ! sh "$R/serre/chrome.sh" >/dev/null 2>&1; then
  echo "pas de Chrome : installation de Chromium (Playwright)…"
  npx -y playwright install --with-deps chromium >/dev/null 2>&1 || npx -y playwright install chromium >/dev/null 2>&1 || { pip install -q playwright && python3 -m playwright install --with-deps chromium; } >/dev/null 2>&1
fi
CH=$(sh "$R/serre/chrome.sh") || exit 1
echo "Chrome : $CH"
command -v node >/dev/null 2>&1 && echo "node : $(node --version)" || echo "node absent : la vérification de syntaxe du build sera sautée"
mkdir -p "$R/serre/ws/_test" && sh "$R/serre/build.sh" _test && sh "$R/serre/shot.sh" _test pl "pl=rose-standard&sec=views&vw=face&stg=ouvert&ncol=1" test.png 500 500 && rm -rf "$R/serre/ws/_test"
