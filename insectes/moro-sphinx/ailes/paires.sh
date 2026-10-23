#!/bin/sh
# The four wing faces rendered flat and compared with their flattened photos (aile.py paire): one line of numbers per face.
for f in "fore upper avant-dessus" "fore under avant-dessous" "hind upper arriere-dessus" "hind under arriere-dessous"; do
  set -- $f
  D=refcache/macroglossum/ailes/$3
  node --max-old-space-size=900 insectes/outils/aile-plat.mjs moro-sphinx $1 $2 insectes/moro-sphinx/ailes/$3.json $D/rendu.png >/dev/null || exit 1
  printf '%s ' $3; python insectes/outils/aile.py paire insectes/moro-sphinx/ailes/cadres.json $3 $D/rendu.png
done
