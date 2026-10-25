#!/bin/sh
# The fibres' opacity per contrast level calibrated against each flattened photo's grain: n damped rounds (fibres.py --etalonne).
n=${1:-3}; t=0
while [ $t -lt $n ]; do
  for f in "fore upper avant-dessus" "fore under avant-dessous" "hind upper arriere-dessus" "hind under arriere-dessous"; do
    set -- $f
    D=refcache/macroglossum/ailes/$3
    node --max-old-space-size=900 insectes/outils/aile-plat.mjs moro-sphinx $1 $2 insectes/moro-sphinx/ailes/$3.json $D/rendu.png >/dev/null || exit 1
    printf '%s ' $3; python insectes/outils/fibres.py insectes/moro-sphinx/ailes/cadres.json $3 --etalonne $D/rendu.png | tr '\n' ' '; echo
  done
  t=$((t + 1))
done
