const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const IDS = [
  'author','call_to_action','catalogo-carrusel','catalogo-comparativo','catalogo-detail','catalogo-flatlay','catalogo-grid','catalogo-hero','catalogo-lifestyle','catalogo-lookbook','catalogo-masonry','catalogo-shelf','catalogo-variants','celebration_context','cita-bocadillo','cita-carousel','cita-float','cita-frame','cita-manuscript','cita-minimal','cita-neon','cita-portrait','cita-split','cita-texture','cita-typo','comunicado-card','comunicado-community','comunicado-editorial','comunicado-memo','comunicado-minimal','comunicado-modern','comunicado-oficial','comunicado-poster','comunicado-ticker','comunicado-timeline','comunicado-urgent','cta','def-classic','def-emoji','def-encyclopedia','def-ilustrado','def-map','def-minimal','def-neon','def-tarjeta','def-tech','def-urban','def-versus','duration','efemeride-bandera','efemeride-calendar','efemeride-collage','efemeride-countdown','efemeride-hero','efemeride-history','efemeride-mensaje','efemeride-neon','efemeride-party','efemeride-religioso','efemeride-seasonal','escaparate-bodegon','escaparate-capas','escaparate-contraste','escaparate-diagonal','escaparate-espiral','escaparate-gobo','escaparate-levitacion','escaparate-marco','escaparate-radial','escaparate-simetria','escaparate-zen',
  'context','effective_date','location','message','phonetic','servicio-free','source','style','tagline','urgency_text',
  'lanzamiento-apertura','lanzamiento-misterio','pregunta-contro','pregunta-debate','pregunta-emoji','talento-benefits'
]

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

  const result = spawnSync('python', args, {
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1',
    }
  })
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
  if (Array.isArray(payload)) return payload?.[0]?.structuralPrompt || ''
  if (Array.isArray(payload.variants)) return payload.variants?.[0]?.structuralPrompt || ''
  return payload.structuralPrompt || ''
}

const extractSkillVersion = (payload) => {
  if (!payload) return ''
  if (Array.isArray(payload)) return payload?.[0]?.skillVersion || ''
  if (Array.isArray(payload.variants)) return payload.variants?.[0]?.skillVersion || ''
  return payload.skillVersion || ''
}

const main = () => {
  if (!fs.existsSync(generatorPath)) {
    console.error('Missing generator:', generatorPath)
    process.exit(1)
  }

  const overrides = readJson(overridesPath)
  const existingPrompts = new Set(
    Object.values(overrides).map((v) => String(v.structuralPrompt || '').trim()).filter(Boolean)
  )

  let updated = 0
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i]
    const item = overrides[id]
    if (!item) continue

    const intent = detectIntent(item)
    const goal = buildGoal(item) || `Composicion ${id}`
    let seed = hashSeed(`${id}|${intent}|${goal}`)

    let generated = ''
    let skillVersion = ''
    for (let attempt = 0; attempt < 3; attempt++) {
      const output = runGenerator(intent, goal, seed + attempt)
      const candidate = extractStructuralPrompt(output)
      const version = extractSkillVersion(output)
      if (candidate && !existingPrompts.has(candidate)) {
        generated = candidate
        skillVersion = version
        existingPrompts.add(candidate)
        break
      }
    }

    if (generated) {
      overrides[id].structuralPrompt = generated
      if (skillVersion) overrides[id].skillVersion = skillVersion
      updated++
      console.log(`[${i + 1}/${IDS.length}] OK: ${id} (${intent})`)
    } else {
      console.warn(`[${i + 1}/${IDS.length}] SKIP: ${id} (${intent})`)
    }
  }

  writeJson(overridesPath, overrides)
  console.log(`Updated ${updated} compositions`) 
}

main()
