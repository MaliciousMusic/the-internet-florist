# res.ps1 <out.csv> [seconds]: samples the PC's load while a flower is made, every <seconds> (15 by default), until fleur/res.stop exists
# (or 8 hours): UTC time, CPU %, free RAM (GB), GPU 3D % (all adapters), headless Chrome browsers (the gate's profiles, child processes not counted), all Chromes, pythons, nodes.
param([string]$out, [int]$every = 15)
$stop = Join-Path $PSScriptRoot 'res.stop'
if (Test-Path $stop) { Remove-Item $stop }
if (-not (Test-Path $out)) { 'utc,cpu,ram_free_gb,gpu3d,chrome_headless,chrome_all,python,node' | Out-File -Encoding ascii $out }
$t0 = Get-Date
while (-not (Test-Path $stop) -and ((Get-Date) - $t0).TotalHours -lt 8) {
  $cpu = (Get-CimInstance Win32_Processor | Measure-Object LoadPercentage -Average).Average
  $ram = (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB
  $gpu = (Get-CimInstance Win32_PerfFormattedData_GPUPerformanceCounters_GPUEngine -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*engtype_3D*' } | Measure-Object UtilizationPercentage -Sum).Sum
  $ch = @(Get-CimInstance Win32_Process -Filter "Name='chrome.exe'")
  $hl = @($ch | Where-Object { $_.CommandLine -like '*chrome_g*' -and $_.CommandLine -notlike '*--type=*' }).Count  # browsers, not their child processes
  $py = @(Get-Process python -ErrorAction SilentlyContinue).Count
  $nd = @(Get-Process node -ErrorAction SilentlyContinue).Count
  $line = [string]::Format([cultureinfo]::InvariantCulture, '{0},{1:F0},{2:F2},{3:F0},{4},{5},{6},{7}', (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss'), $cpu, $ram, $gpu, $hl, $ch.Count, $py, $nd)
  Add-Content -Encoding ascii $out $line
  Start-Sleep -Seconds $every
}
