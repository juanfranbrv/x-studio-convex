const fs = require('fs')
const path = require('path')

const WISDOM_BASE_URL = 'https://wisdom-gate.juheapi.com'
const MODEL = 'gemini-3-flash-preview'

const loadEnvFile = () => {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) return
    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  })
}

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'))
const writeJson = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')

const buildPrompt = (item) => {
  const intent = item.id.includes('-') ? item.id.split('-')[0] : 'general'
  const name = item.name || item.id
  const description = item.description || ''
  const instruction = item.promptInstruction || ''
  const zone = item.textZone || ''

  return [
    'Eres un director de arte. Genera un prompt estructural de composicion en español.',
    'Debe ser corto, claro y util para un modelo de imagen.',
    'Formato EXACTO con estas secciones y 3 puntos cada una:',
    '## Composición: <titulo corto>',
    '**Estructura:** <1 linea>',
    '### Jerarquía Visual',
    '1. ...',
    '2. ...',
    '3. ...',
    '### Distribución',
    '- ...',
    '- ...',
    '- ...',
    '### Estilo',
    '- ...',
    '- ...',
    '- ...',
    '### Evitar',
    '<1 linea>',
    'No uses emojis. No uses comillas. No inventes datos.',
    '',
    `Intent: ${intent}`,
    `Nombre: ${name}`,
    `Descripcion: ${description}`,
    `Prompt instruction: ${instruction}`,
    `Zona de texto: ${zone}`,
  ].join('\n')
}

const generateStructural = async (item, apiKey) => {
  const prompt = buildPrompt(item)

  const response = await fetch(`${WISDOM_BASE_URL}/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
      },
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Wisdom text failed: ${errorText}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  return text.trim()
}

const main = async () => {
  loadEnvFile()
  const apiKey = process.env.WISDOM_API_KEY || ''
  if (!apiKey) {
    console.error('Missing WISDOM_API_KEY env var.')
    process.exit(1)
  }

  const overridesPath = path.join(process.cwd(), 'src', 'data', 'legacy-layout-overrides.json')
  const overrides = readJson(overridesPath)
  const ids = Object.keys(overrides)

  const missing = ids.filter((id) => !String(overrides[id].structuralPrompt || '').trim())
  if (missing.length === 0) {
    console.log('No missing structural prompts found.')
    return
  }

  console.log(`Found ${missing.length} missing structural prompts.`)

  for (let i = 0; i < missing.length; i++) {
    const id = missing[i]
    const item = overrides[id]
    try {
      const generated = await generateStructural(item, apiKey)
      if (generated) {
        overrides[id].structuralPrompt = generated
        console.log(`[${i + 1}/${missing.length}] OK: ${id}`)
      } else {
        console.warn(`[${i + 1}/${missing.length}] EMPTY: ${id}`)
      }
    } catch (err) {
      console.error(`[${i + 1}/${missing.length}] ERROR: ${id} -> ${err.message}`)
    }
  }

  writeJson(overridesPath, overrides)
  console.log('Updated legacy-layout-overrides.json')
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
