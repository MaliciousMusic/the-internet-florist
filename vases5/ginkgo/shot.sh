#!/bin/sh
# shot.sh <svg> <png> [W H] [bg]: renders an SVG in one headless Chrome through the shared gate (own html, never the shared one)
SP="C:/Users/agent/Desktop/flower/flower-atelier"
W=${3:-800}; H=${4:-1500}; BG=${5:-#ecebe7}
F="$(cd "$(dirname "$1")" && pwd -W)/$(basename "$1")"
HT="$SP/vases5/ginkgo/out/work/_shot_$(basename "$2" .png).html"
printf '<!doctype html><html><body style="margin:0;background:%s"><img src="file:///%s" style="display:block;width:%spx;height:%spx"></body></html>' "$BG" "$F" "$W" "$H" > "$HT"
rm -f "$2"
sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" shot "file:///$HT" "$(cd "$(dirname "$2")" && pwd -W)/$(basename "$2")" "$W" "$H"
