param(
    [string]$Url = "http://127.0.0.1:3000",
    [int]$Port = 9222,
    [int]$TimeoutSeconds = 15,
    [switch]$ReuseExisting
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. "$PSScriptRoot\chrome-debug-common.ps1"

$projectRoot = Split-Path -Parent $PSScriptRoot
$userDataDir = Join-Path $projectRoot ".tmp\chrome-debug"
New-Item -ItemType Directory -Path $userDataDir -Force | Out-Null

Write-Host "[CHROME][INFO] Preparando Chrome para depuracion remota..." -ForegroundColor Cyan
Write-Host "[CHROME][INFO] Perfil aislado: $userDataDir" -ForegroundColor DarkCyan

if (Test-DebugPort -Port $Port) {
    $endpoint = Get-DebugEndpoint -Port $Port
    if ($endpoint) {
        Write-Host "[CHROME][SUCCESS] Puerto $Port ya disponible." -ForegroundColor Green
        Write-Host "[CHROME][DEBUG] Browser endpoint: $($endpoint.Browser)" -ForegroundColor DarkGreen
        Write-Host "[CHROME][DEBUG] WebSocket endpoint: $($endpoint.webSocketDebuggerUrl)" -ForegroundColor DarkGreen
        if ($ReuseExisting) {
            exit 0
        }
    }
}

Stop-DebugChrome -UserDataDir $userDataDir -Port $Port

$chromePath = Get-ChromePath
$arguments = @(
    "--remote-debugging-port=$Port",
    "--remote-allow-origins=*",
    "--user-data-dir=$userDataDir",
    "--no-first-run",
    "--no-default-browser-check",
    "--new-window",
    $Url
)

Write-Host "[CHROME][INFO] Lanzando: $chromePath" -ForegroundColor Cyan
Start-Process -FilePath $chromePath -ArgumentList $arguments | Out-Null

if (-not (Wait-ForTcpPort -Port $Port -TimeoutSeconds $TimeoutSeconds)) {
    Write-Host "[CHROME][ERROR] El puerto $Port no se abrio tras lanzar Chrome." -ForegroundColor Red
    exit 1
}

$endpoint = Get-DebugEndpoint -Port $Port
Write-Host "[CHROME][SUCCESS] Puerto $Port listo para DevTools MCP." -ForegroundColor Green
if ($endpoint) {
    Write-Host "[CHROME][DEBUG] Browser endpoint: $($endpoint.Browser)" -ForegroundColor DarkGreen
    Write-Host "[CHROME][DEBUG] WebSocket endpoint: $($endpoint.webSocketDebuggerUrl)" -ForegroundColor DarkGreen
}
else {
    Write-Host "[CHROME][WARN] El puerto responde, pero /json/version no devolvio datos." -ForegroundColor Yellow
}
