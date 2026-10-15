#!/bin/sh
# gate.sh <command...>: runs one headless-Chrome job when a slot is free (GATE_MAX, 3 by default, shared by every workspace)
# and the PC has room (CPU under 85 %, more than 3.8 GB of free RAM); the slot number is exported as GATE_SLOT
SP="C:/Users/agent/Desktop/flower/flower-atelier"
LK="$SP/ws/locks"; mkdir -p "$LK"; MAX=${GATE_MAX:-3}; SLOT=""; waited=0
while [ -z "$SLOT" ]; do
  now=$(date +%s)
  for i in $(seq 1 $MAX); do
    d="$LK/slot$i"
    # a slot held for more than 15 minutes is stale (its job died without cleaning up)
    if [ -d "$d" ]; then t=$(cat "$d/t" 2>/dev/null || echo 0); [ $((now - t)) -gt 900 ] && rm -rf "$d"; fi
    if mkdir "$d" 2>/dev/null; then echo "$now" > "$d/t"; SLOT=$i; break; fi
  done
  if [ -n "$SLOT" ]; then
    L=$(powershell -NoProfile -Command "\$c=(Get-CimInstance Win32_Processor|Measure-Object LoadPercentage -Average).Average;\$m=(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB;[string]::Format([cultureinfo]::InvariantCulture,'{0:F0} {1:F1}',\$c,\$m)" | tr -d '\r')
    cpu=${L% *}; ram=${L#* }
    ok=$(python -c "print(1 if float('$cpu')<85 and float('$ram')>3.8 else 0)" 2>/dev/null)
    if [ "$ok" != 1 ]; then rm -rf "$LK/slot$SLOT"; SLOT=""; [ $waited = 0 ] && echo "gate: PC chargé (CPU $cpu %, RAM libre $ram Go), j'attends" >&2; waited=1; sleep 8; fi
  else
    [ $waited = 0 ] && echo "gate: 3 rendus déjà en cours, j'attends un créneau" >&2; waited=1; sleep 3
  fi
done
trap 'rm -rf "$LK/slot$SLOT"' EXIT INT TERM
export GATE_SLOT=$SLOT
"$@"
