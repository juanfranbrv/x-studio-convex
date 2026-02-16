# Script para matar TODOS los procesos de Chrome (Incluso los más resistentes)
Write-Host "--- Limpieza Profunda de Chrome ---" -ForegroundColor Red

# 1. Parar el proceso de forma directa
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. taskkill es más rudo y necesario en Windows
taskkill /F /IM chrome.exe /T 2>$null

# 3. Limpiar procesos de Google Update que a veces bloquean el perfil
taskkill /F /IM GoogleUpdate.exe /T 2>$null
taskkill /F /IM GoogleUpdateBroker.exe /T 2>$null

# 4. Pequeña espera para que Windows libere los sockets
Start-Sleep -Seconds 2

Write-Host "Limpieza completada." -ForegroundColor Green
