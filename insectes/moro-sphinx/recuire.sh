#!/bin/sh
# The atlas baked again and weighed, then the animation sheet, one render at a time behind the gate.
G="sh C:/Users/agent/Desktop/flower/flower-atelier/ch/insectes-suite/ws/gate.sh"; N="node --max-old-space-size=900"; export GATE_RAM=${GATE_RAM:-4.4} GATE_MAX=1
P=insectes/moro-sphinx/planches
$G python insectes/outils/paires.py moro-sphinx || exit 1
$G $N insectes/outils/cuisson.mjs moro-sphinx || exit 1
python insectes/outils/atlas.py insectes/moro-sphinx/atlas moro-sphinx || exit 1
$G $N insectes/outils/ailes.mjs moro-sphinx 10 || exit 1
$G $N insectes/outils/planche-sphinx.mjs $P/anim.png 8 || exit 1
python -c "from PIL import Image; Image.open('$P/anim.png').convert('RGB').save('$P/anim.jpg', quality=88); print('anim fini')"
