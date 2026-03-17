Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-ChromePath {
    $candidates = @(
        "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "${env:LocalAppData}\Google\Chrome\Application\chrome.exe"
    ) | Where-Object { $_ -and (Test-Path $_) }

    $candidateList = @($candidates)
    if ($candidateList.Count -gt 0) {
        return $candidateList[0]
    }

    throw "No se encontro chrome.exe en las rutas habituales."
}

function Test-DebugPort {
    param(
        [int]$Port = 9222
    )

    try {
        $result = Test-NetConnection -ComputerName "127.0.0.1" -Port $Port -WarningAction SilentlyContinue
        return [bool]$result.TcpTestSucceeded
    }
    catch {
        return $false
    }
}

function Get-DebugEndpoint {
    param(
        [int]$Port = 9222
    )

    try {
        return Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 3
    }
    catch {
        return $null
    }
}

function Get-DebugPortOwnerProcessId {
    param(
        [int]$Port = 9222
    )

    try {
        $connection = Get-NetTCPConnection -LocalAddress "127.0.0.1" -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
            Select-Object -First 1

        if ($connection) {
            return [int]$connection.OwningProcess
        }
    }
    catch {
    }

    return $null
}

function Get-ProcessDescendants {
    param(
        [int[]]$RootProcessIds
    )

    if (-not $RootProcessIds -or $RootProcessIds.Count -eq 0) {
        return @()
    }

    $allProcesses = @(Get-CimInstance Win32_Process -Filter "name = 'chrome.exe'" -ErrorAction SilentlyContinue)
    $pending = New-Object System.Collections.Generic.Queue[int]
    $visited = New-Object System.Collections.Generic.HashSet[int]

    foreach ($rootId in $RootProcessIds) {
        if ($visited.Add($rootId)) {
            $pending.Enqueue($rootId)
        }
    }

    while ($pending.Count -gt 0) {
        $currentId = $pending.Dequeue()
        $children = @($allProcesses | Where-Object { $_.ParentProcessId -eq $currentId })

        foreach ($child in $children) {
            if ($visited.Add([int]$child.ProcessId)) {
                $pending.Enqueue([int]$child.ProcessId)
            }
        }
    }

    return @($visited)
}

function Stop-DebugChrome {
    param(
        [string]$UserDataDir,
        [int]$Port = 9222
    )

    $normalizedUserDataDir = [System.IO.Path]::GetFullPath($UserDataDir)
    $processes = Get-CimInstance Win32_Process -Filter "name = 'chrome.exe'" -ErrorAction SilentlyContinue
    $rootProcessIds = @()

    foreach ($process in @($processes)) {
        $commandLine = [string]$process.CommandLine
        if (
            $commandLine -like "*--remote-debugging-port=$Port*" -or
            $commandLine -like "*$normalizedUserDataDir*"
        ) {
            $rootProcessIds += [int]$process.ProcessId
        }
    }

    $processIdsToStop = Get-ProcessDescendants -RootProcessIds $rootProcessIds | Sort-Object -Descending
    foreach ($processId in @($processIdsToStop)) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
}

function Wait-ForTcpPort {
    param(
        [int]$Port = 9222,
        [int]$TimeoutSeconds = 15
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        if (Test-DebugPort -Port $Port) {
            return $true
        }

        Start-Sleep -Milliseconds 500
    }

    return $false
}

function Wait-ForHttpOk {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 45
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                return $true
            }
        }
        catch {
        }

        Start-Sleep -Milliseconds 750
    }

    return $false
}
