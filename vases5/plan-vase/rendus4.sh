#!/bin/sh
# step 4 renders: the vessel's class shaping the mass (z7-plan vpAspK), without (?noasp=1) and with; one Chrome at a time through ws/gate.sh
SP="C:/Users/agent/Desktop/flower/flower-atelier"; Q="file:///$SP/ch/vases-plan/lab/qa13.html"; O="$SP/ch/vases-plan/vases5/plan-vase/rendus4"; mkdir -p "$O"
for spec in "gres-chauve-souris:68" "cylindre-verre-clair:18" "gres-chauve-souris:33" "cylindre-verre-clair:62"; do v=${spec%%:*}; m=${spec##*:}
  for k in avant apres; do f="$O/${v}_m${m}_${k}.png"; [ -f "$f" ] && continue; x=""; [ $k = avant ] && x="&noasp=1"
    GATE_RAM=${GATE_RAM:-5} sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" shot "$Q?vbq=$m&vase=$v&seed=23$x" "$f" 900 900; done; done
