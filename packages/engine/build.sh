#!/bin/sh
# build.sh: the drawing engine as it is stored on-chain (dist/engine.b64) and the pages BelaiEngine.html() returns.
# Reproducible: the same sources give the same bytes with node + terser 5.51.2 and python + zopfli 0.4.3 (pip install zopfli==0.4.3).
set -e
E="$(cd "$(dirname "$0")" && pwd)"; R="$E/../.."; D="$E/dist"; mkdir -p "$D/samples"
# the engine modules: the order of the app (demo/src/build.sh), from p2.js to k1.js; the shop's own screens (u1, u2, w1, u3) stay out
LIST=$(sed -n 's/^cat a1\.html \(p2\.js .* k1\.js\) .* > \.\.\/index\.html$/\1/p' "$R/demo/src/build.sh")
[ -n "$LIST" ] || { echo "ordre des modules introuvable dans demo/src/build.sh"; exit 1; }
(cd "$R/demo/src" && for f in $LIST; do cat "$f"; printf '\n'; done) > "$D/engine.js"
cat "$E/boot.js" >> "$D/engine.js"
npx -y terser@5.51.2 "$D/engine.js" --compress passes=2 --mangle --toplevel --ecma 2020 -o "$D/engine.min.js"
python "$E/pack.py" "$E" "$D"
