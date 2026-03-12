param(
    [int]$Port = 9222
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. "$PSScriptRoot\chrome-debug-common.ps1"

$projectRoot = Split-Path -Parent $PSScriptRoot
$userDataDir = Join-Path $projectRoot ".tmp\chrome-debug"

Write-Host "[CHROME][INFO] Cerrando instancias de Chrome de depuracion..." -ForegroundColor Yellow
Stop-DebugChrome -UserDataDir $userDataDir -Port $Port
Start-Sleep -Seconds 1

if (Test-DebugPort -Port $Port) {
    Write-Host "[CHROME][WARN] El puerto $Port sigue abierto tras el cierre." -ForegroundColor Yellow
    exit 1
}

Write-Host "[CHROME][SUCCESS] Chrome de depuracion detenido." -ForegroundColor Green
