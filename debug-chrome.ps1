param(
    [string]$Url = "http://127.0.0.1:3000/studio",
    [int]$Port = 9222
)

powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\scripts\start-chrome-debug.ps1" -Url $Url -Port $Port
