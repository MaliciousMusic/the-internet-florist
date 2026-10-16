#!/bin/sh
# shot.sh <svg> <png> [W H] [bg]: renders an SVG in one headless Chrome through the shared gate (its own page, in this folder)
SP="C:/Users/agent/Desktop/flower/flower-atelier"
W=${3:-1200}; H=${4:-1100}; BG=${5:-#ececea}
F="$(cd "$(dirname "$1")" && pwd -W)/$(basename "$1")"
HT="$(cd "$(dirname "$0")" && pwd -W)/work/_shot_$$.html"
printf '<!doctype html><html><body style="margin:0;background:%s"><img src="file:///%s" style="display:block;width:%spx;height:%spx"></body></html>' "$BG" "$F" "$W" "$H" > "$HT"
rm -f "$2"
sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" shot "file:///$HT" "$(cd "$(dirname "$2")" && pwd -W)/$(basename "$2")" "$W" "$H"
rm -f "$HT"
