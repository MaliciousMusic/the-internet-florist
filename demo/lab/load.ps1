$cpu=(Get-CimInstance Win32_Processor | Measure-Object LoadPercentage -Average).Average
$os=Get-CimInstance Win32_OperatingSystem
$ch=Get-Process chrome -ErrorAction SilentlyContinue
$qa=(Get-CimInstance Win32_Process -Filter "name='chrome.exe'" | Where-Object { $_.CommandLine -like '*chrome_qa*' -or $_.CommandLine -like '*chrome_shot*' } | Measure-Object).Count
'CPU {0:N0} % | RAM libre {1:N1} Go / {2:N1} Go ({3:N0} %) | Chrome {4} proc. {5:N2} Go (dont {6} proc. de test)' -f $cpu,($os.FreePhysicalMemory/1MB),($os.TotalVisibleMemorySize/1MB),(100*$os.FreePhysicalMemory/$os.TotalVisibleMemorySize),($ch|Measure-Object).Count,(($ch|Measure-Object WorkingSet64 -Sum).Sum/1GB),$qa
