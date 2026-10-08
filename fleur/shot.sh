#!/bin/sh
# shot.sh <name> "<query>" : renders pilote/sv.html?<query>&snap=<name> of this working copy (the main atelier or a chantier ch/<nom>) in one
# headless Chrome (through the shared gate.sh), saves fleur/out/<name>.png here and prints the sheet's measures (heads, elements / KB / patches
# per head). The atelier server (8765, serving the main atelier and its ch/) and recv.py (8781) must be running.
#   grid  : grid=1&sid=anemone-coronaria&cws=rouge,bleu&st=.3:0,1:0,1:.75&view=3,2,0&D=150   (stages op:wilt x colourways x views)
#   plant : plant=1&...
MAIN="C:/Users/agent/Desktop/flower-atelier"
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
REL="${ROOT#$MAIN}"; REL="${REL#/}"
PFX=""; [ -n "$REL" ] && PFX="$(basename "$ROOT")_"
N="$PFX$1"
mkdir -p "$ROOT/fleur/out"; rm -f "$MAIN/bronze/out/$N"
sh "$MAIN/ws/gate.sh" sh "$MAIN/ws/chrome1.sh" dom "http://localhost:8765/${REL:+$REL/}pilote/sv.html?$2&snap=$N&nc=$(date +%s)" "$ROOT/fleur/out/$1.json" >/dev/null 2>&1
if [ -f "$MAIN/bronze/out/$N" ]; then mv -f "$MAIN/bronze/out/$N" "$ROOT/fleur/out/$1.png"; echo "$ROOT/fleur/out/$1.png"; else echo "PAS D'IMAGE"; fi
cat "$ROOT/fleur/out/$1.json"; echo
