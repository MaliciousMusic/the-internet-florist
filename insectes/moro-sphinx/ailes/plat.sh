#!/bin/sh
# The four wing faces of the moro-sphinx laid flat and read (aile.py plat), one model at a time behind the gate.
# Order: the faces seen whole first (avant-dessus, arriere-dessous), then those they complete.
PY=C:/Users/agent/Desktop/flower/flower-atelier/vases5/.venv-depth/Scripts/python.exe
C=insectes/moro-sphinx/ailes/cadres.json
for f in "avant-dessus 4" "arriere-dessous 5" "arriere-dessus 5" "avant-dessous 4"; do
  set -- $f
  GATE_MAX=1 sh ws/gate.sh $PY insectes/outils/aile.py plat $C $1 --k $2 || exit 1
done
