#!/bin/sh
# Everything left to render for the moro-sphinx, one heavy step at a time behind the gate (one render for the whole chantier, GATE_MAX=1, and 4.4 GB free at least, AGENTS.md):
# the flat wing pairs, the whole-moth pairs, the animation sheet, the runtime wing sheet, the atlas (baked, packed, weighed).
G="sh C:/Users/agent/Desktop/flower/flower-atelier/ch/insectes-suite/ws/gate.sh"; N="node --max-old-space-size=900"; export GATE_RAM=${GATE_RAM:-4.4} GATE_MAX=1
P=insectes/moro-sphinx/planches; mkdir -p $P
[ "$1" = "--plat" ] && { $G sh insectes/moro-sphinx/ailes/paires.sh || exit 1; }
$G python insectes/outils/paires.py moro-sphinx || exit 1
$G $N insectes/outils/planche-sphinx.mjs $P/anim.png 8 || exit 1
$G $N insectes/outils/ailes.mjs moro-sphinx 10 || exit 1
$G $N insectes/outils/cuisson.mjs moro-sphinx || exit 1
python insectes/outils/atlas.py insectes/moro-sphinx/atlas moro-sphinx
python -c "
from PIL import Image; im=Image.open('$P/anim.png'); im.convert('RGB').save('$P/anim.jpg', quality=88); print('anim', im.size)"
