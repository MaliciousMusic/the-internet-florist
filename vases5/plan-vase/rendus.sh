#!/bin/sh
# before/after renders of the vessel plan: one model bouquet per vessel, with (apres) and without (avant, &noplan=1) the plan; one Chrome at a time through ws/gate.sh
SP="C:/Users/agent/Desktop/flower/flower-atelier"; Q="file:///$SP/ch/vases-plan/lab/qa13.html"; O="$SP/ch/vases-plan/vases5/plan-vase/rendus"; mkdir -p "$O"
SEED=${SEED:-23}
for spec in "bronze-carpe:33" "verre-danseuses:18" "gres-chauve-souris:68" "cylindre-verre-clair:18" "soliflore-balustre-noir:13"; do
  v=${spec%%:*}; m=${spec##*:}
  for k in avant apres; do
    f="$O/${v}_${k}_s$SEED.png"; [ -f "$f" ] && continue
    x=""; [ $k = avant ] && x="&noplan=1"
    GATE_RAM=${GATE_RAM:-5} sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" shot "$Q?vbq=$m&vase=$v&seed=$SEED$x" "$f" 900 900
  done
done
