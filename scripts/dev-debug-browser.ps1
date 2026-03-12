param(
    [string]$AppUrl = "http://127.0.0.1:3000",
    [string]$Route = "/",
    [int]$Port = 9222,
    [int]$AppTimeoutSeconds = 90
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. "$PSScriptRoot\chrome-debug-common.ps1"

$projectRoot = Split-Path -Parent $PSScriptRoot
$fullUrl = "$AppUrl$Route"

Write-Host "[FLOW][INFO] Preparando entorno de navegador para QA..." -ForegroundColor Cyan

$appReady = Wait-ForHttpOk -Url $AppUrl -TimeoutSeconds 2
if (-not $appReady) {
    Write-Host "[FLOW][INFO] No hay app respondiendo en $AppUrl. Arrancando npm run dev:quiet..." -ForegroundColor Yellow
    $devCommand = "Set-Location '$projectRoot'; npm run dev:quiet"
    Start-Process -FilePath "powershell" -WorkingDirectory $projectRoot -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy", "Bypass",
        "-Command", $devCommand
    ) | Out-Null

    if (-not (Wait-ForHttpOk -Url $AppUrl -TimeoutSeconds $AppTimeoutSeconds)) {
        Write-Host "[FLOW][ERROR] La app no respondio en $AppUrl tras $AppTimeoutSeconds segundos." -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "[FLOW][SUCCESS] Reutilizando app ya activa en $AppUrl." -ForegroundColor Green
}

& "$PSScriptRoot\start-chrome-debug.ps1" -Url $fullUrl -Port $Port -TimeoutSeconds 15
