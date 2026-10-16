#!/bin/sh
# shot.sh <svg> <png> W H [bg]: renders an SVG in one headless Chrome through the shared gate (own html, not verre/out/_shot.html)
SP="C:/Users/agent/Desktop/flower/flower-atelier"
D="$(cd "$(dirname "$0")" && pwd -W)"
F="$(cd "$(dirname "$1")" && pwd -W)/$(basename "$1")"
HT="$D/work/_shot_$$.html"
printf '<!doctype html><html><body style="margin:0;background:%s"><img src="file:///%s" style="display:block;width:%spx;height:%spx"></body></html>' "${5:-#f8f4ee}" "$F" "$3" "$4" > "$HT"
rm -f "$2"
sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" shot "file:///$HT" "$(cd "$(dirname "$2")" && pwd -W)/$(basename "$2")" "$3" "$4"
rm -f "$HT"
