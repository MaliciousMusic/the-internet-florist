#!/bin/sh
# etalonne.sh <id> <sid> <tours> "<which face record>"...: the dust of each wing face calibrated against its flattened photo,
# a few damped rounds (BONNES-PRATIQUES §16.3). Faces: "fore upper avant-dessus" etc.
id=$1; sid=$2; n=$3; shift 3
one() {
  D=refcache/$sid/ailes/$3
  node insectes/outils/aile-plat.mjs $id $1 $2 insectes/$id/ailes/$3.json $D/rendu.png >/dev/null
  python insectes/outils/poudre.py insectes/$id/ailes/$3.json $D/plat.png $D/rendu.png --ecrire insectes/$id/ailes/etalonnage.json $3 | tail -1
}
t=0
while [ $t -lt $n ]; do
  for f in "$@"; do one $f; done
  t=$((t + 1))
done
