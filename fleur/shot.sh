#!/bin/sh
# shot.sh <name> "<query>" : renders pilote/sv.html?<query>&snap=<name> in one headless Chrome (through gate.sh), saves fleur/out/<name>.png
# and prints the sheet's measures (heads, elements / KB / patches / ms per head). The atelier server (8765) and recv.py (8781) must be running.
#   grid  : grid=1&sid=anemone-coronaria&cws=rouge,bleu&st=.3:0,1:0,1:.75&view=3,2,0&D=150   (stages op:wilt × colourways × views)
#   plant : plant=1&...
SP="C:/Users/agent/Desktop/flower-atelier"
mkdir -p "$SP/fleur/out"; rm -f "$SP/bronze/out/$1"
sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" dom "http://localhost:8765/pilote/sv.html?$2&snap=$1&nc=$(date +%s)" "$SP/fleur/out/$1.json" >/dev/null 2>&1
if [ -f "$SP/bronze/out/$1" ]; then mv -f "$SP/bronze/out/$1" "$SP/fleur/out/$1.png"; echo "$SP/fleur/out/$1.png"; else echo "PAS D'IMAGE"; fi
cat "$SP/fleur/out/$1.json"; echo
