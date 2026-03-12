param(
    [int]$Port = 9222
)

powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\scripts\stop-chrome-debug.ps1" -Port $Port
