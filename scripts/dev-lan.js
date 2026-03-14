const { networkInterfaces } = require('os')
const { spawn } = require('child_process')

const projectRoot = __dirname.replace(/[\\/]scripts$/, '')
const useQuietLogs = process.argv.includes('--quiet')
const port = process.env.PORT || '3000'

function isPrivateIPv4(address) {
  return (
    /^192\.168\./.test(address) ||
    /^10\./.test(address) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(address)
  )
}

function scoreInterface(name, address) {
  const lowered = name.toLowerCase()
  let score = 0

  if (lowered.includes('wi-fi') || lowered.includes('wifi') || lowered.includes('wlan')) score += 60
  if (lowered.includes('ethernet')) score += 30
  if (lowered.includes('vethernet') || lowered.includes('hyper-v') || lowered.includes('virtual')) score -= 40
  if (isPrivateIPv4(address)) score += 20
  if (address.startsWith('192.168.')) score += 10

  return score
}

function getBestLanIp() {
  const candidates = []
  const interfaces = networkInterfaces()

  for (const [name, entries] of Object.entries(interfaces)) {
    for (const entry of entries || []) {
      if (!entry || entry.family !== 'IPv4' || entry.internal) continue
      if (!isPrivateIPv4(entry.address)) continue

      candidates.push({
        name,
        address: entry.address,
        score: scoreInterface(name, entry.address),
      })
    }
  }

  if (!candidates.length) return null

  candidates.sort((a, b) => b.score - a.score)
  return candidates[0]
}

function buildOrigins(lanOrigin) {
  return [
    lanOrigin,
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`,
  ].join(',')
}

const bestLan = getBestLanIp()

if (!bestLan) {
  console.error('[LAN] No se pudo detectar una IP privada util para exponer la app en red local.')
  process.exit(1)
}

const lanOrigin = `http://${bestLan.address}:${port}`
const env = {
  ...process.env,
  NEXT_PUBLIC_APP_URL: lanOrigin,
  NEXT_ALLOWED_DEV_ORIGINS: buildOrigins(lanOrigin),
  NEXT_DISABLE_TURBOPACK: '1',
}

console.log('\n[LAN] X-Studio en red local')
console.log(`[LAN] Interfaz: ${bestLan.name}`)
console.log(`[LAN] URL local: ${lanOrigin}`)
console.log(`[LAN] allowedDevOrigins: ${env.NEXT_ALLOWED_DEV_ORIGINS}\n`)

function startProcess(label, command) {
  const child = spawn(command, {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
    shell: true,
  })

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[LAN] ${label} terminó con código ${code}`)
      process.exit(code)
    }
  })

  return child
}

const convexProcess = startProcess(
  'convex',
  useQuietLogs
    ? 'powershell -ExecutionPolicy Bypass -Command "npx convex dev 2>&1 | node scripts/dev-log-filter.js convex"'
    : 'npx convex dev'
)

const nextProcess = startProcess(
  'next',
  useQuietLogs
    ? `powershell -ExecutionPolicy Bypass -Command "npx next dev --hostname 0.0.0.0 --port ${port} 2>&1 | node scripts/dev-log-filter.js next"`
    : `npx next dev --hostname 0.0.0.0 --port ${port}`
)

function shutdown() {
  try {
    convexProcess.kill()
  } catch {}

  try {
    nextProcess.kill()
  } catch {}
}

process.on('SIGINT', () => {
  shutdown()
  process.exit(0)
})

process.on('SIGTERM', () => {
  shutdown()
  process.exit(0)
})
