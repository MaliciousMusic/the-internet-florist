#!/bin/sh
# qawatch.sh <url> <out.json>: one headless QA run, killed if free RAM drops under 3 GB (checked every 3 s)
SP="C:/Users/agent/Desktop/flower-atelier"
sh "$SP/ws/chrome1.sh" dom "$1" "$2" > "$2.log" 2>&1 &
PID=$!; minr=99
while kill -0 $PID 2>/dev/null; do
  r=$(powershell -NoProfile -Command "[string]::Format([cultureinfo]::InvariantCulture,'{0:F1}',(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB)" | tr -d '\r')
  minr=$(python -c "print(min($minr,$r))")
  if python -c "import sys;sys.exit(0 if $r<3.0 else 1)"; then
    powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | Where-Object { \$_.CommandLine -like '*chrome_g*' } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force -ErrorAction SilentlyContinue }"
    echo "KILLED (free RAM $r GB)"; break
  fi
  sleep 3
done
wait $PID 2>/dev/null
echo "min free RAM: $minr GB"; head -c 300 "$2"; echo
