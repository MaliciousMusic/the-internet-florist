#!/bin/sh
# gate.sh <command...>: runs one heavy job (headless Chrome, resvg bake, SAM) when a slot is free (GATE_MAX, 3 by default,
# shared by every workspace) and the PC has room (CPU under GATE_CPU %, more than GATE_RAM GB of free RAM); the slot number
# is exported as GATE_SLOT
# GATE_RAM is 5.5 by default (2026-10-22): a render of the rich lily scenes grows to about 2.5 GB after it starts, and free RAM must stay over 3 GB
# 2026-10-24: two jobs could share a slot. A waiter that found a slot just made, before its t was written, took it for a dead
# one and removed it; and a job longer than 15 minutes lost its slot the same way. Now a slot carries its owner's id and a
# heartbeat refreshes it while the job lives (even if this gate is killed), so it is stale only after 90 s without one; a
# slot with no t yet is judged by its own date; slots of the older gate (no id) keep the 15-minute rule.
# 2026-10-24, later: a waiter could still read t while the heartbeat was rewriting it, find it empty, fall back to the
# slot's creation date and remove a live slot. The heartbeat now replaces t in one rename, and an empty t is read again
# a second later before anything is judged. Waiters also queue in arrival order (tickets in $LK/queue, GATE_SINCE=<epoch>
# keeps an older place): only the first may take a slot, so a job asking for more RAM is no longer passed forever by
# lighter ones. A first waiter that finds the PC idle but short of RAM for GATE_YIELD seconds (600) goes to the back.
SP="C:/Users/agent/Desktop/flower/flower-atelier"
LK=${GATE_LOCKS:-$SP/ws/locks}; Q="$LK/queue"; mkdir -p "$Q"; MAX=${GATE_MAX:-3}; NEED=${GATE_RAM:-5.5}; CPU=${GATE_CPU:-85}
YIELD=${GATE_YIELD:-600}; SLOT=""; waited=0; since=""
ID="$$-$(date +%s%N)"
TK="$Q/${GATE_SINCE:-$(date +%s)}-$ID"
: > "$TK"
trap 'rm -f "$TK"; exit 143' INT TERM
while [ -z "$SLOT" ]; do
  now=$(date +%s)
  touch "$TK"
  for f in "$Q"/*; do
    [ -f "$f" ] && [ $((now - $(stat -c %Y "$f" 2>/dev/null || echo "$now"))) -gt 60 ] && rm -f "$f"
  done
  first=$(ls "$Q" | sort -n | head -1)
  if [ "$Q/$first" != "$TK" ]; then
    since=""
    [ $waited = 0 ] && echo "gate: d'autres rendus attendent avant moi, j'attends mon tour" >&2; waited=1; sleep 3; continue
  fi
  for i in $(seq 1 $MAX); do
    d="$LK/slot$i"
    if [ -d "$d" ]; then
      t=$(cat "$d/t" 2>/dev/null); [ -n "$t" ] || { sleep 1; t=$(cat "$d/t" 2>/dev/null); }
      [ -n "$t" ] || t=$(stat -c %Y "$d" 2>/dev/null || echo "$now")
      if [ -f "$d/id" ]; then life=90; else life=900; fi
      [ $((now - t)) -gt $life ] && rm -rf "$d"
    fi
    if mkdir "$d" 2>/dev/null; then echo "$now" > "$d/t"; echo "$ID" > "$d/id"; SLOT=$i; break; fi
  done
  if [ -n "$SLOT" ]; then
    L=$(powershell -NoProfile -Command "\$c=(Get-CimInstance Win32_Processor|Measure-Object LoadPercentage -Average).Average;\$m=(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB;[string]::Format([cultureinfo]::InvariantCulture,'{0:F0} {1:F1}',\$c,\$m)" | tr -d '\r')
    cpu=${L% *}; ram=${L#* }
    ok=$(python -c "print(1 if float('$cpu')<$CPU and float('$ram')>$NEED else 0)" 2>/dev/null)
    if [ "$ok" != 1 ]; then
      rm -rf "$LK/slot$SLOT"; SLOT=""
      [ $waited = 0 ] && echo "gate: PC chargé (CPU $cpu %, RAM libre $ram Go), j'attends" >&2; waited=1
      [ -n "$since" ] || since=$now
      if [ $((now - since)) -gt $YIELD ]; then
        nt="$Q/$(date +%s)-$ID"; mv -f "$TK" "$nt" && TK=$nt; since=""
        echo "gate: RAM libre sous $NEED Go depuis $YIELD s, PC au repos : je passe en fin de file" >&2
      fi
      sleep 8
    fi
  else
    since=""
    [ $waited = 0 ] && echo "gate: $MAX rendu(s) déjà en cours, j'attends un créneau" >&2; waited=1; sleep 3
  fi
done
rm -f "$TK"
D="$LK/slot$SLOT"
mine() { [ "$(cat "$D/id" 2>/dev/null)" = "$ID" ]; }
export GATE_SLOT=$SLOT
"$@" &
J=$!
# the heartbeat keeps the slot while the job lives, then frees it; it outlives this gate if the gate alone is killed
( while kill -0 $J 2>/dev/null && mine; do date +%s > "$D/t.n" && mv -f "$D/t.n" "$D/t"; sleep 15; done; mine && rm -rf "$D" ) >/dev/null 2>&1 &
HB=$!
# stopping the gate stops its whole job (the node or python under a sh -c too)
trap 'w=$(cat /proc/$J/winpid 2>/dev/null); [ -n "$w" ] && taskkill //F //T //PID "$w" >/dev/null 2>&1; kill $J 2>/dev/null; mine && rm -rf "$D"; kill $HB 2>/dev/null; exit 143' INT TERM
wait $J; rc=$?
mine && rm -rf "$D"
kill $HB 2>/dev/null
exit $rc
