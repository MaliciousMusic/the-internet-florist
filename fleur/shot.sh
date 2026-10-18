#!/bin/sh
# shot.sh <name> "<query>" : renders pilote/sv.html?<query>&snap=<name> of this working copy (the main atelier or a chantier ch/<nom>) in one
# headless Chrome (through the shared gate.sh), saves fleur/out/<name>.png here and prints the sheet's measures (heads, elements / KB / patches
# per head). The atelier server (8805, serving the main atelier and its ch/) and recv.py (8781) must be running.
#   grid  : grid=1&sid=anemone-coronaria&cws=rouge,bleu&st=.3:0,1:0,1:.75&view=3,2,0&D=150   (stages op:wilt x colourways x views)
#   plant : plant=1&...
# A stale build is rebuilt first: mkapp.sh when an app/*.js (or p2-p4.js, mkapp.sh) is newer than demo7.html, then pilote/mksv.py when demo7.html
# or pilote/svtest.js is newer than pilote/sv.html (a render of an old build was a lost turn). A page that throws says it: "ERREUR JS : ..."
# (the errors pilote/svtest.js caught), instead of a bare NO OUTPUT.
MAIN="${SHOT_MAIN:-C:/Users/agent/Desktop/flower/flower-atelier}"   # SHOT_MAIN: pipe.py selftest only (a stand-in gate, no Chrome)
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
REL="${ROOT#$MAIN}"; REL="${REL#/}"
PFX=""; [ -n "$REL" ] && PFX="$(basename "$ROOT")_"
N="$PFX$1"
(cd "$ROOT" || exit 1
  stale=""; [ -f demo7.html ] || stale=1
  for f in app/*.js p2.js p3.js p4.js mkapp.sh; do [ -z "$stale" ] && [ "$f" -nt demo7.html ] && stale=1; done
  if [ -n "$stale" ]; then b="$(sh mkapp.sh | tail -1)"; case "$b" in *"syntax ok"*) echo "rebuilt: $b" >&2 ;; *) echo "ERREUR DE CONSTRUCTION : $b"; exit 1 ;; esac; fi
  if [ ! -f pilote/sv.html ] || [ demo7.html -nt pilote/sv.html ] || [ pilote/svtest.js -nt pilote/sv.html ]; then python pilote/mksv.py >/dev/null || { echo "ERREUR DE CONSTRUCTION : mksv.py"; exit 1; }; fi
) || { echo "PAS D'IMAGE"; exit 1; }
mkdir -p "$ROOT/fleur/out"; rm -f "$MAIN/bronze/out/$N"
sh "$MAIN/ws/gate.sh" sh "$MAIN/ws/chrome1.sh" dom "http://localhost:8805/${REL:+$REL/}pilote/sv.html?$2&snap=$N&nc=$(date +%s)" "$ROOT/fleur/out/$1.json" >/dev/null 2>&1
IMG=0; if [ -f "$MAIN/bronze/out/$N" ]; then mv -f "$MAIN/bronze/out/$N" "$ROOT/fleur/out/$1.png"; echo "$ROOT/fleur/out/$1.png"; IMG=1; else echo "PAS D'IMAGE"; fi
python -c "
import json,sys
t=open(sys.argv[1],encoding='utf-8',errors='replace').read()
try:o=json.loads(t)
except Exception:o=None
e=o.get('jserr') if isinstance(o,dict) else None
if e:print(('ERREUR JS : ' if o.get('fallback') or sys.argv[2]=='0' else 'avertissement JS (image faite) : ')+' | '.join(map(str,e))[:600])
elif t.startswith('NO OUTPUT'):print('PAS DE SORTIE : la page n a rien rendu et aucune erreur JS n a ete captee')
" "$ROOT/fleur/out/$1.json" "$IMG" 2>/dev/null
cat "$ROOT/fleur/out/$1.json"; echo
