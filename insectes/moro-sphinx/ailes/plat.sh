#!/bin/sh
# The four wing faces of the moro-sphinx laid flat and read (aile.py plat), one at a time behind the gate. The starting mask is
# refcache/macroglossum/ailes/<face>/sam.png: the wing's region of the cadres (written by hand when SAM could not run, ETAT.md);
# pass --sam to have SAM redo it. Order: the faces seen whole first (avant-dessus, arriere-dessous), then those they complete.
PY=C:/Users/agent/Desktop/flower/flower-atelier/vases5/.venv-depth/Scripts/python.exe
C=insectes/moro-sphinx/ailes/cadres.json; SAM=$1
for f in "avant-dessus 4" "arriere-dessous 5" "arriere-dessus 5" "avant-dessous 4"; do
  set -- $f
  GATE_MAX=1 sh ws/gate.sh $PY insectes/outils/aile.py plat $C $1 --k $2 $SAM || exit 1
done
