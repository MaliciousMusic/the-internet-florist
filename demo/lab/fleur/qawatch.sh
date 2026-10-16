#!/bin/sh
# qawatch.sh <url> <out.json>: one headless QA run, killed if free RAM drops under 3 GB (checked every 3 s); only its own Chrome is killed, never another session's
SP="C:/Users/agent/Desktop/flower-atelier"
QL="$SP/ws/locks/qa"; mkdir -p "$SP/ws/locks"
while ! mkdir "$QL" 2>/dev/null; do
  t=$(cat "$QL/t" 2>/dev/null || echo 0); [ $(( $(date +%s) - t )) -gt 2700 ] && rm -rf "$QL"
  sleep 10
done
date +%s > "$QL/t"; trap 'rm -rf "$QL"' EXIT
# the QA Chrome takes a gate slot like every other render (3 at most on the PC) and records which one, so that only it is killed
SLF="$QL/slot"; rm -f "$SLF"
sh "$SP/ws/gate.sh" sh -c 'echo "$GATE_SLOT" > "$0"; exec sh "$1" dom "$2" "$3"' "$SLF" "$SP/ws/chrome1.sh" "$1" "$2" > "$2.log" 2>&1 &
PID=$!; minr=99
while kill -0 $PID 2>/dev/null; do
  r=$(powershell -NoProfile -Command "[string]::Format([cultureinfo]::InvariantCulture,'{0:F1}',(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB)" | tr -d '\r')
  minr=$(python -c "print(min($minr,$r))")
  if python -c "import sys;sys.exit(0 if $r<3.0 else 1)"; then
    S=$(cat "$SLF" 2>/dev/null); [ -n "$S" ] || { sleep 3; continue; }  # still waiting at the gate: nothing of ours to kill
    powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | Where-Object { \$_.CommandLine -like '*chrome_g$S*' } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force -ErrorAction SilentlyContinue }"
    echo "KILLED (free RAM $r GB)"; break
  fi
  sleep 3
done
wait $PID 2>/dev/null
echo "min free RAM: $minr GB"; head -c 300 "$2"; echo
