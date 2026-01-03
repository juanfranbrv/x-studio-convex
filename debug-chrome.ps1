# Script para lanzar Chrome en modo Debug (USANDO TU PERFIL REAL)
Write-Host "--- Lanzando entorno de depuración ---" -ForegroundColor Cyan

# 1. Limpieza total previa
powershell -ExecutionPolicy Bypass -File ./kill-chrome.ps1

# 2. Definir ruta y argumentos de forma segura (como array)
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

# Usamos un array de argumentos para evitar líos con los espacios de PowerShell
$arguments = @(
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
    "http://localhost:3000/studio"
)

Write-Host "Lanzando Chrome con puerto 9222 habilitado..." -ForegroundColor Green
Start-Process $chromePath -ArgumentList $arguments

# 3. Verificación de puerto
Write-Host "Verificando puerto 9222..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
$portCheck = netstat -ano | findstr 9222
if ($portCheck) {
    Write-Host "¡ÉXITO! El puerto 9222 está abierto." -ForegroundColor Green
}
else {
    Write-Host "ERROR: El puerto 9222 sigue cerrado. Por favor, asegúrate de cerrar Chrome manualmente y vuelve a probar." -ForegroundColor Red
}

