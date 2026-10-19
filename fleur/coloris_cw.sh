#!/bin/sh
# coloris_cw.sh: the measured grid of one colourway, then its calibration photo | render (BONNES-PRATIQUES §15.2 points 3, 4, 7-9 and §16).
# Run from the root of the chantier's copy (ch/<nom>). Photos are paths under refcache/<sid>/, frames are apparence.py frames "x0,y0,x1,y1,..."
#
#   sh fleur/coloris_cw.sh pieces <sid> <cw> <photo> "<frame>" ["<frame>" ...]
#       each piece of the photo flattened (apparence.py piece, refcache/<sid>/apparence/<cw>/<cw>-t<i>), then the grid of the colourway
#       (apparence.py grille, 18 x 72) in refcache/<sid>/apparence/grille-<cw>.json.
#       EXCL="<hex>[,<hex>]" removes a component laid on the piece (filaments, anthers) by its colour: keep it narrow and LOOK at the maps
#       (the .npy, as an image) before trusting the grid; MOTIF=1 keeps the 5-95 percentiles (blotches, streaks, rims), else 35-85.
#   PUT="<command with {G}>" sh fleur/coloris_cw.sh calib <sid> <cw> <photo> <rounds> "<frame>" ["<frame>" ...]
#       <rounds> times: rebuild the app, render the solo piece (Q, default the open stage, view 0, D 600, piece 0, heart hidden),
#       find its frame (repere.py), one table per photo frame (apparence.py paire, <cw>-paire-m<i>), then calibre.py on all the tables
#       (K, default .8) and PUT puts the grid back into the sort's code ({G} = the grid's json). Several frames = several pieces of the
#       photo: a patterned colourway is calibrated on 3-4 of them, never on one (one tepal's blotch is not the colourway's).
#       The first run keeps grille-<cw>.json.orig. The tables are the proofs of points 7-9 (sortie.py reads <cw>-paire-*.txt).
set -e
CMD=$1; SID=$2; CW=$3; PH=$4; shift 4
R=refcache/$SID; A=$R/apparence; G=$A/grille-$CW.json; mkdir -p "$A/$CW"
case "$CMD" in
  pieces)
    i=1; maps=""
    for f in "$@"; do
      python fleur/apparence.py piece "$R/$PH" "$f" --out "$A/$CW/$CW-t$i" ${EXCL:+--exclure "$EXCL"} 2>&1 | tail -1 | cut -c1-160
      maps="$maps $A/$CW/$CW-t$i.npy"; i=$((i+1))
    done
    python fleur/apparence.py grille "$G" $maps --nu 18 --nv 72 ${MOTIF:+--motif} 2>&1 | tail -2 ;;
  calib)
    N=$1; shift
    [ -n "$PUT" ] || { echo "PUT ? (the command that puts {G} into the sort's code)"; exit 1; }
    [ -f "$G.orig" ] || cp "$G" "$G.orig"
    Q=${Q:-"st=1:0&view=0&D=600&det=2&seed=7&solo=0&nohrt=1"}
    for r in $(seq 1 "$N"); do
      sh mkapp.sh >/dev/null
      sh fleur/shot_p.sh "solo_${SID}_$CW" "grid=1&sid=$SID&cws=$CW&$Q" >/dev/null 2>&1
      PNG=fleur/out/solo_${SID}_$CW.png; RF="$(python fleur/repere.py "$PNG")"; i=0; T=""
      for f in "$@"; do
        i=$((i+1))
        python fleur/apparence.py paire "$R/$PH" "$f" "$PNG" "$RF" --out "$A/$CW/$CW-paire-m$i" | grep Bilan | sed "s/^/  tour $r, pièce $i : /"
        T="$T $A/$CW/$CW-paire-m$i.json"
      done
      [ "$r" -lt "$N" ] || break
      python fleur/calibre.py "$G" $T --out "$G" --k "${K:-.8}"
      sh -c "$(echo "$PUT" | sed "s#{G}#$G#g")" >/dev/null
    done ;;
  *) sed -n 2,17p "$0" ;;
esac
