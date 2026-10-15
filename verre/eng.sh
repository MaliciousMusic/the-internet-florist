#!/bin/sh
# eng.sh <name> [mk2 key=value ...]: builds the shop body with these settings, rebuilds the lab page and renders the vessel alone
# in the engine (1000 x 1000) -> out/eng_<name>.png
SP="C:/Users/agent/Desktop/flower/flower-atelier"
N=$1; shift
cd "$SP/verre" && python build_body.py "$@" | head -2 && cd "$SP" && sh mkqa.sh >/dev/null && \
sh ws/gate.sh sh ws/chrome1.sh shot "http://localhost:8765/lab/qa13.html?gal=1&ids=verre-danseuses&cols=1&nc=$(date +%s)" "$SP/verre/out/eng_$N.png" 1000 1000
