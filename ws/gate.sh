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
# 2026-10-24, noon: on this PC every new process leaks about 4 KB of kernel token pool until reboot (a driver bug), and
# waiters that forked date, stat, ls and sort every 3 s leaked 3 GB overnight. Waiting now runs on shell builtins only:
# clock by printf, sleep by a timed read on a fifo, free RAM from /proc/meminfo, ticket ages written inside the tickets.
# A waiter polls every GATE_POLL seconds (20); PowerShell checks CPU and RAM once, just before a start.
# 2026-10-25 (owner): the floor is 4 GB for good (5.5 was too much), and the RAM is read live from fleur/res/ram.txt, written every
# 2 s by fleur/res/ramlive.py (shell builtins only, no PowerShell at each start); PowerShell is the fallback when that file is older than
# 10 s. To throttle well, a job also waits GATE_SETTLE seconds (30) after the last start, the time a new render takes to reach its size.
SP="C:/Users/agent/Desktop/flower/flower-atelier"
LK=${GATE_LOCKS:-$SP/ws/locks}; Q="$LK/queue"; [ -d "$Q" ] || mkdir -p "$Q"
MAX=${GATE_MAX:-3}; NEED=${GATE_RAM:-4}; CPU=${GATE_CPU:-85}; YIELD=${GATE_YIELD:-600}; POLL=${GATE_POLL:-20}; SETTLE=${GATE_SETTLE:-30}
RAMTXT="$SP/fleur/res/ram.txt"
SLOT=""; waited=0; since=""
case $NEED in *.*) i=${NEED%%.*}; f=${NEED#*.}; NEEDK=$(( ${i:-0} * 1048576 + ${f:0:1} * 104858 ));; *) NEEDK=$(( NEED * 1048576 ));; esac
case $NEED in *.*) i=${NEED%%.*}; f=${NEED#*.}00; NEEDC=$(( 10#${i:-0} * 100 + 10#${f:0:2} ));; *) NEEDC=$(( NEED * 100 ));; esac
# live() reads ram.txt: LIVE=1 when fresh, with RAMC (free RAM in hundredths of a GB) and LCPU; SETTLED=0 when a slot started < SETTLE s ago
live() { local t r c m x; LIVE=0; read -r t r c m x < "$RAMTXT" 2>/dev/null || return; [ -n "$t" ] && [ $((now - t)) -le 10 ] || return
  RAMC=$(( 10#${r%%.*} * 100 + 10#${r#*.} )); LCPU=${c%%.*}; LIVE=1; }
settled() { local d t0; SETTLED=1; for d in "$LK"/slot*; do [ -f "$d/t0" ] || continue; t0=""; read -r t0 < "$d/t0" 2>/dev/null; [ -n "$t0" ] && [ $((now - t0)) -lt $SETTLE ] && SETTLED=0; done; }
printf -v now '%(%s)T' -1
ID="$$-$now$RANDOM"
printf -v TK '%s/%010d-%s' "$Q" "${GATE_SINCE:-$now}" "$ID"
echo "$now" > "$TK"
FF="$Q/.fifo-$ID"; mkfifo "$FF" && exec 9<>"$FF"; rm -f "$FF"
nap() { read -t "$1" -u 9 _; }
freek() { local k v u; FREEK=0; while read -r k v u; do [ "$k" = MemFree: ] && { FREEK=$v; return; }; done < /proc/meminfo; }
trap 'rm -f "$TK"; exit 143' INT TERM
while [ -z "$SLOT" ]; do
  printf -v now '%(%s)T' -1
  echo "$now" > "$TK"
  tks=("$Q"/*); first=""
  for f in "${tks[@]}"; do
    [ -f "$f" ] || continue
    t=""; read -r t < "$f" 2>/dev/null; [ -n "$t" ] || t=$(stat -c %Y "$f" 2>/dev/null)
    if [ -n "$t" ] && [ $((now - t)) -gt 120 ]; then rm -f "$f"; continue; fi
    [ -n "$first" ] || first=$f
  done
  if [ "$first" != "$TK" ]; then
    since=""
    [ $waited = 0 ] && echo "gate: d'autres rendus attendent avant moi, j'attends mon tour" >&2; waited=1; nap $POLL; continue
  fi
  free=""
  for ((i = 1; i <= MAX; i++)); do
    d="$LK/slot$i"
    if [ -d "$d" ]; then
      t=""; read -r t < "$d/t" 2>/dev/null; [ -n "$t" ] || { nap 1; read -r t < "$d/t" 2>/dev/null; }
      [ -n "$t" ] || t=$(stat -c %Y "$d" 2>/dev/null || echo "$now")
      if [ -f "$d/id" ]; then life=90; else life=900; fi
      [ $((now - t)) -gt $life ] && rm -rf "$d"
    fi
    [ -d "$d" ] || { free=$i; break; }
  done
  if [ -z "$free" ]; then
    since=""
    [ $waited = 0 ] && echo "gate: $MAX rendu(s) déjà en cours, j'attends un créneau" >&2; waited=1; nap $POLL; continue
  fi
  ok=0; live; settled
  if [ $LIVE = 1 ]; then
    cpu=$LCPU; [ "$SETTLED" = 1 ] && [ "${cpu:-100}" -lt "$CPU" ] && [ "$RAMC" -gt "$NEEDC" ] && ok=1
  elif freek; [ "$FREEK" -gt "$NEEDK" ]; then
    L=$(powershell -NoProfile -Command "\$c=(Get-CimInstance Win32_Processor|Measure-Object LoadPercentage -Average).Average;\$m=(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB;[string]::Format([cultureinfo]::InvariantCulture,'{0:F0} {1:F1}',\$c,\$m)" | tr -d '\r')
    cpu=${L% *}; ram=${L#* }; cpu=${cpu%%.*}
    freek; [ "${cpu:-100}" -lt "$CPU" ] && [ "$FREEK" -gt "$NEEDK" ] && ok=1
  else
    cpu="?"
  fi
  if [ $ok = 1 ] && mkdir "$LK/slot$free" 2>/dev/null; then
    echo "$now" > "$LK/slot$free/t"; echo "$now" > "$LK/slot$free/t0"; echo "$ID" > "$LK/slot$free/id"; SLOT=$free; break
  fi
  [ $waited = 0 ] && echo "gate: PC chargé (CPU $cpu %, RAM libre insuffisante pour $NEED Go), j'attends" >&2; waited=1
  [ -n "$since" ] || since=$now
  if [ $((now - since)) -gt $YIELD ]; then
    printf -v nt '%s/%010d-%s' "$Q" "$now" "$ID"; mv -f "$TK" "$nt" && TK=$nt; since=""
    echo "gate: RAM libre sous $NEED Go depuis $YIELD s, PC au repos : je passe en fin de file" >&2
  fi
  nap $POLL
done
rm -f "$TK"
D="$LK/slot$SLOT"
mine() { local x=""; read -r x < "$D/id" 2>/dev/null; [ "$x" = "$ID" ]; }
export GATE_SLOT=$SLOT
"$@" 9>&- &
J=$!
# the heartbeat keeps the slot while the job lives, then frees it; it outlives this gate if the gate alone is killed
( while kill -0 $J 2>/dev/null && mine; do printf '%(%s)T\n' -1 > "$D/t.n" && mv -f "$D/t.n" "$D/t"; nap 15; done; mine && rm -rf "$D" ) >/dev/null 2>&1 &
HB=$!
# stopping the gate stops its whole job (the node or python under a sh -c too)
trap 'w=""; read -r w < /proc/$J/winpid 2>/dev/null; [ -n "$w" ] && taskkill //F //T //PID "$w" >/dev/null 2>&1; kill $J 2>/dev/null; mine && rm -rf "$D"; kill $HB 2>/dev/null; exit 143' INT TERM
wait $J; rc=$?
mine && rm -rf "$D"
kill $HB 2>/dev/null
exit $rc
