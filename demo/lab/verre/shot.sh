#!/bin/sh
# shot.sh <svg> <png> [W H]: renders an SVG file in one headless Chrome (through the shared gate)
SP="C:/Users/agent/Desktop/flower-atelier"
W=${3:-1200}; H=${4:-1435}
F="$(cd "$(dirname "$1")" && pwd -W)/$(basename "$1")"
HT="$SP/verre/out/_shot.html"
printf '<!doctype html><html><body style="margin:0;background:#777"><img src="file:///%s" style="display:block;width:%spx;height:%spx"></body></html>' "$F" "$W" "$H" > "$HT"
rm -f "$2"
sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" shot "file:///$HT" "$(cd "$(dirname "$2")" && pwd -W)/$(basename "$2")" "$W" "$H"
