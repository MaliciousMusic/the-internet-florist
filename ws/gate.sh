#!/bin/sh
# gate.sh <command...>: runs one heavy job (headless Chrome, resvg bake, SAM) when a slot is free (GATE_MAX, 3 by default,
# shared by every workspace) and the PC has room (CPU under GATE_CPU %, more than GATE_RAM GB of free RAM); the slot number
# is exported as GATE_SLOT
# GATE_RAM is 5.5 by default (2026-10-22): a render of the rich lily scenes grows to about 2.5 GB after it starts, and free RAM must stay over 3 GB
# 2026-10-24: two jobs could share a slot. A waiter that found a slot just made, before its t was written, took it for a dead
# one and removed it; and a job longer than 15 minutes lost its slot the same way. Now a slot carries its owner's id and a
# heartbeat refreshes it while the job lives (even if this gate is killed), so it is stale only after 90 s without one; a
# slot with no t yet is judged by its own date; slots of the older gate (no id) keep the 15-minute rule.
SP="C:/Users/agent/Desktop/flower/flower-atelier"
LK=${GATE_LOCKS:-$SP/ws/locks}; mkdir -p "$LK"; MAX=${GATE_MAX:-3}; NEED=${GATE_RAM:-5.5}; CPU=${GATE_CPU:-85}; SLOT=""; waited=0
ID="$$-$(date +%s%N)"
while [ -z "$SLOT" ]; do
  now=$(date +%s)
  for i in $(seq 1 $MAX); do
    d="$LK/slot$i"
    if [ -d "$d" ]; then
      t=$(cat "$d/t" 2>/dev/null); [ -n "$t" ] || t=$(stat -c %Y "$d" 2>/dev/null || echo "$now")
      if [ -f "$d/id" ]; then life=90; else life=900; fi
      [ $((now - t)) -gt $life ] && rm -rf "$d"
    fi
    if mkdir "$d" 2>/dev/null; then echo "$now" > "$d/t"; echo "$ID" > "$d/id"; SLOT=$i; break; fi
  done
  if [ -n "$SLOT" ]; then
    L=$(powershell -NoProfile -Command "\$c=(Get-CimInstance Win32_Processor|Measure-Object LoadPercentage -Average).Average;\$m=(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB;[string]::Format([cultureinfo]::InvariantCulture,'{0:F0} {1:F1}',\$c,\$m)" | tr -d '\r')
    cpu=${L% *}; ram=${L#* }
    ok=$(python -c "print(1 if float('$cpu')<$CPU and float('$ram')>$NEED else 0)" 2>/dev/null)
    if [ "$ok" != 1 ]; then rm -rf "$LK/slot$SLOT"; SLOT=""; [ $waited = 0 ] && echo "gate: PC chargé (CPU $cpu %, RAM libre $ram Go), j'attends" >&2; waited=1; sleep 8; fi
  else
    [ $waited = 0 ] && echo "gate: $MAX rendu(s) déjà en cours, j'attends un créneau" >&2; waited=1; sleep 3
  fi
done
D="$LK/slot$SLOT"
mine() { [ "$(cat "$D/id" 2>/dev/null)" = "$ID" ]; }
export GATE_SLOT=$SLOT
"$@" &
J=$!
# the heartbeat keeps the slot while the job lives, then frees it; it outlives this gate if the gate alone is killed
( while kill -0 $J 2>/dev/null && mine; do date +%s > "$D/t"; sleep 15; done; mine && rm -rf "$D" ) >/dev/null 2>&1 &
HB=$!
# stopping the gate stops its whole job (the node or python under a sh -c too)
trap 'w=$(cat /proc/$J/winpid 2>/dev/null); [ -n "$w" ] && taskkill //F //T //PID "$w" >/dev/null 2>&1; kill $J 2>/dev/null; mine && rm -rf "$D"; kill $HB 2>/dev/null; exit 143' INT TERM
wait $J; rc=$?
mine && rm -rf "$D"
kill $HB 2>/dev/null
exit $rc
