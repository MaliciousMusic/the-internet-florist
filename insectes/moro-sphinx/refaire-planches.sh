#!/bin/sh
# After a change to the model: the whole-moth pairs and the animation sheet again, one render at a time behind the gate.
G="sh C:/Users/agent/Desktop/flower/flower-atelier/ch/insectes-suite/ws/gate.sh"; N="node --max-old-space-size=900"; export GATE_RAM=${GATE_RAM:-4.4} GATE_MAX=1
P=insectes/moro-sphinx/planches
$G python insectes/outils/paires.py moro-sphinx ${1:+--only $1} || exit 1
[ -n "$1" ] && exit 0
$G $N insectes/outils/planche-sphinx.mjs $P/anim.png 8 || exit 1
python -c "from PIL import Image; Image.open('$P/anim.png').convert('RGB').save('$P/anim.jpg', quality=88)"
