const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const INTENTS = [
  'oferta','escaparate','catalogo','lanzamiento','servicio','comunicado','evento','lista','comparativa','efemeride','equipo','cita','talento','logro','bts','dato','pasos','definicion','pregunta','reto'
]

const overridesPath = path.join(process.cwd(), 'src', 'data', 'legacy-layout-overrides.json')
const generatorPath = path.join(process.cwd(), 'skills', 'composition-library-author', 'scripts', 'generate_legacy_composition.py')

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'))
const writeJson = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')

const hashSeed = (text) => {
  return text.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0) || 1
}

const detectIntent = (item) => {
  const id = String(item.id || '').toLowerCase()
  const name = String(item.name || '').toLowerCase()
  const description = String(item.description || '').toLowerCase()
  const instruction = String(item.promptInstruction || '').toLowerCase()
  const haystack = `${id} ${name} ${description} ${instruction}`

  const prefix = id.includes('-') ? id.split('-')[0] : ''
  if (INTENTS.includes(prefix)) return prefix

  for (const intent of INTENTS) {
    if (haystack.includes(intent)) return intent
  }

  return 'servicio'
}

const buildGoal = (item) => {
  const name = String(item.name || item.id || '').trim()
  const description = String(item.description || '').trim()
  const instruction = String(item.promptInstruction || '').trim()
  const parts = [name, description, instruction, `ID:${item.id}`].filter(Boolean)
  return parts.join(' | ')
}

const buildFallbackStructuralPrompt = (intent, goal) => {
  return [
    `Composicion base para intent ${intent}.`,
    `Estructura guiada por el objetivo: ${goal}.`,
    'Prioriza una zona de texto limpia y estable para lectura rapida.',
    'Distribuye el contenido en bloques grandes con jerarquia clara.',
    'Evita superposiciones que reduzcan legibilidad.',
    'Reserva un area secundaria para apoyo visual discreto.',
    'Mantiene el logo en una esquina con presencia baja.',
    'Alinea la composicion al objetivo declarado.',
  ].join('\\n')
}

const runGenerator = (intent, goal, seed) => {
  const args = [
    generatorPath,
    '--intent', intent,
    '--goal', goal,
    '--count', '1',
    '--text-density', 'mid',
    '--tone', 'editorial',
    '--seed', String(seed)
  ]

  const result = spawnSync('python', args, { encoding: 'utf8' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'generator failed')
  }

  const output = String(result.stdout || '').trim()
  if (!output) throw new Error('empty generator output')
  return JSON.parse(output)
}

const extractStructuralPrompt = (payload) => {
  if (!payload) return ''
  if (Array.isArray(payload)) {
    return payload?.[0]?.structuralPrompt || ''
  }
  if (Array.isArray(payload.variants)) {
    return payload.variants?.[0]?.structuralPrompt || ''
  }
  return payload.structuralPrompt || ''
}

const extractSkillVersion = (payload) => {
  if (!payload) return ''
  if (Array.isArray(payload)) {
    return payload?.[0]?.skillVersion || ''
  }
  if (Array.isArray(payload.variants)) {
    return payload.variants?.[0]?.skillVersion || ''
  }
  return payload.skillVersion || ''
}

const main = () => {
  if (!fs.existsSync(generatorPath)) {
    console.error('Missing generator:', generatorPath)
    process.exit(1)
  }

  const overrides = readJson(overridesPath)
  const ids = Object.keys(overrides)
  const existingPrompts = new Set(
    ids.map((id) => String(overrides[id].structuralPrompt || '').trim()).filter(Boolean)
  )

  const missing = ids.filter((id) => !String(overrides[id].structuralPrompt || '').trim())
  if (missing.length === 0) {
    console.log('No missing structural prompts found.')
    return
  }

  console.log(`Found ${missing.length} missing structural prompts.`)

  for (let i = 0; i < missing.length; i++) {
    const id = missing[i]
    const item = overrides[id]
    const intent = detectIntent(item)
    const goal = buildGoal(item) || `Composicion ${id}`
    let seed = hashSeed(`${id}|${intent}|${goal}`)

    let generated = ''
    for (let attempt = 0; attempt < 3; attempt++) {
      const output = runGenerator(intent, goal, seed + attempt)
      const candidate = extractStructuralPrompt(output)
      const skillVersion = extractSkillVersion(output)
      if (candidate && !existingPrompts.has(candidate)) {
        generated = candidate
        existingPrompts.add(candidate)
        if (skillVersion) overrides[id].skillVersion = skillVersion
        break
      }
    }

    if (generated) {
      overrides[id].structuralPrompt = generated
      console.log(`[${i + 1}/${missing.length}] OK: ${id} (${intent})`)
    } else {
      const fallback = buildFallbackStructuralPrompt(intent, goal)
      overrides[id].structuralPrompt = fallback
      console.warn(`[${i + 1}/${missing.length}] FALLBACK: ${id} (${intent})`)
    }
  }

  writeJson(overridesPath, overrides)
  console.log('Updated legacy-layout-overrides.json')
}

main()
