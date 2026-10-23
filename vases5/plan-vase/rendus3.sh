#!/bin/sh
# step 3 renders: a model bouquet over its vessel's capacity, in the vessel as it is and as the Composer scales it (vpFit); one Chrome at a time
SP="C:/Users/agent/Desktop/flower/flower-atelier"; Q="file:///$SP/ch/vases-plan/lab/qa13.html"; O="$SP/ch/vases-plan/vases5/plan-vase/rendus3"; mkdir -p "$O"
for spec in "71:soliflore-balustre-noir:1.30" "27:balustre-argent-patine:1.10" "25:calice-souffle-col-tube:1.50"; do
  m=${spec%%:*}; r=${spec#*:}; v=${r%%:*}; k=${r##*:}
  for vv in "$v" "$v~$k"; do f="$O/m${m}_$(echo $vv | tr '~' '_').png"; [ -f "$f" ] && continue
    GATE_RAM=${GATE_RAM:-5} sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" shot "$Q?vbq=$m&vase=$vv&seed=23" "$f" 900 900; done
done
