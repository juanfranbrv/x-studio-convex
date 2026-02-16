const fs = require('fs')
const path = require('path')
const POTRACE = require('potrace')

const WISDOM_BASE_URL = 'https://wisdom-gate.juheapi.com'
const DEFAULT_MODEL = 'gemini-2.5-flash-image'

const extractIntentLayouts = (intent) => {
  const intentFile = path.join(process.cwd(), 'src', 'lib', 'prompts', 'intents', `${intent}.ts`)
  if (!fs.existsSync(intentFile)) return []

  const raw = fs.readFileSync(intentFile, 'utf8')
  const blockStart = raw.indexOf(`export const ${intent.toUpperCase()}_LAYOUTS`)
  if (blockStart === -1) return []

  const assignIndex = raw.indexOf('=', blockStart)
  if (assignIndex === -1) return []
  const openBracket = raw.indexOf('[', assignIndex)
  if (openBracket === -1) return []

  let depth = 0
  let endBracket = -1
  let inArrayString = false
  let arrayStringChar = ''
  for (let i = openBracket; i < raw.length; i++) {
    const ch = raw[i]
    if ((ch === '"' || ch === "'" || ch === '`') && !inArrayString) {
      inArrayString = true
      arrayStringChar = ch
    } else if (inArrayString && ch === arrayStringChar && raw[i - 1] !== '\\') {
      inArrayString = false
      arrayStringChar = ''
    }
    if (inArrayString) continue

    if (ch === '[') depth += 1
    if (ch === ']') {
      depth -= 1
      if (depth === 0) {
        endBracket = i
        break
      }
    }
  }
  if (endBracket === -1) return []

  const block = raw.slice(openBracket + 1, endBracket)
  const objects = []
  let objStart = -1
  let braceDepth = 0
  let inString = false
  let stringChar = ''

  for (let i = 0; i < block.length; i++) {
    const ch = block[i]
    if ((ch === '"' || ch === "'") && !inString) {
      inString = true
      stringChar = ch
    } else if (inString && ch === stringChar && block[i - 1] !== '\\') {
      inString = false
      stringChar = ''
    }
    if (inString) continue

    if (ch === '{') {
      if (braceDepth === 0) objStart = i
      braceDepth += 1
    } else if (ch === '}') {
      braceDepth -= 1
      if (braceDepth === 0 && objStart !== -1) {
        objects.push(block.slice(objStart, i + 1))
        objStart = -1
      }
    }
  }

  const parseField = (text, field) => {
    const regex = new RegExp(`${field}\\s*:\\s*([\\\`'\\\"])([\\s\\S]*?)\\1`)
    const match = text.match(regex)
    return match ? match[2].trim() : ''
  }

  return objects
    .map((obj) => ({
      id: parseField(obj, 'id'),
      name: parseField(obj, 'name'),
      description: parseField(obj, 'description'),
      promptInstruction: parseField(obj, 'promptInstruction'),
      structuralPrompt: parseField(obj, 'structuralPrompt'),
      textZone: parseField(obj, 'textZone'),
    }))
    .filter((item) => item.id)
}

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

const toDataUrl = (filePath) => {
  const buffer = fs.readFileSync(filePath)
  const base64 = buffer.toString('base64')
  const ext = path.extname(filePath).toLowerCase()
  const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png'
  return `data:${mimeType};base64,${base64}`
}

const buildPrompt = (composition) => {
  const name = composition?.name || composition?.id || 'Composicion'
  const description = composition?.description || ''
  const instruction = composition?.promptInstruction || ''
  const structural = composition?.structuralPrompt || ''

  return [
    'Create a minimal monochrome icon made of thick geometric shapes.',
    'Use 3 to 5 distinct intensity levels of the SAME hue (no gradients).',
    'Each intensity must be a solid flat fill (no transparency effects, no textures).',
    'Ensure the different intensities help separate layers or hierarchy.',
    'No text, no letters, no numbers.',
    'No thin lines. Use large blocks and circles only.',
    'Single color on transparent background.',
    'The icon must represent this composition clearly:',
    `Name: ${name}`,
    `Description: ${description}`,
    `Prompt instruction: ${instruction}`,
    `Structural prompt: ${structural}`,
  ].join('\n')
}

const normalizeSvgFill = (svg) => (
  svg
    .replace(/fill="[^"]*"/g, 'fill="currentColor"')
    .replace(/<path(?![^>]*fill=)/g, '<path fill="currentColor"')
)

const traceToSvg = async (pngPath, svgPath) => {
  await new Promise((resolve, reject) => {
    POTRACE.posterize(pngPath, {
      steps: [60, 120, 180, 220],
      threshold: 200,
      turdSize: 5,
      optTolerance: 0.2,
      color: 'currentColor',
      background: 'transparent'
    }, (err, svg) => {
      if (err) return reject(err)
      const normalized = normalizeSvgFill(svg)
      fs.writeFileSync(svgPath, normalized, 'utf8')
      return resolve()
    })
  })
}

const generateImage = async (prompt, styleDataUrl, model, apiKey) => {
  const response = await fetch(`${WISDOM_BASE_URL}/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { data: styleDataUrl.split('base64,')[1], mimeType: styleDataUrl.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png' } }
        ]
      }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '1K'
        }
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Wisdom image generation failed: ${errorText}`)
  }

  const data = await response.json()
  const candidate = data.candidates?.[0]
  let inlineData = null
  if (candidate) {
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData?.data) {
        inlineData = part.inlineData
        break
      }
    }
  }

  if (!inlineData?.data) throw new Error('No image data found in Wisdom response.')
  return Buffer.from(inlineData.data, 'base64')
}

const main = async () => {
  loadEnvFile()
  const apiKey = process.env.WISDOM_API_KEY || ''
  if (!apiKey) {
    console.error('Missing WISDOM_API_KEY env var.')
    process.exit(1)
  }

  const intent = process.argv[2]
  if (!intent) {
    console.error('Usage: node scripts/generate-icons-for-intent.js <intent> [model] [styleImagePath]')
    process.exit(1)
  }

  const model = process.argv[3] && process.argv[3].trim() ? process.argv[3].trim() : DEFAULT_MODEL
  const stylePath = process.argv[4] && process.argv[4].trim()
    ? process.argv[4].trim()
    : path.join(process.cwd(), 'public', 'plantillas', 'plantilla1.png')

  if (!fs.existsSync(stylePath)) {
    console.error('Style image not found:', stylePath)
    process.exit(1)
  }

  const overridesPath = path.join(process.cwd(), 'src', 'data', 'legacy-layout-overrides.json')
  const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'))
  const intentLayouts = extractIntentLayouts(intent)
  if (intentLayouts.length === 0) {
    console.log('No intent layouts found for:', intent)
    return
  }

  const entries = intentLayouts.map((layout) => {
    const existing = overrides[layout.id]
    if (existing) return { ...layout, ...existing }
    return layout
  })

  const outDir = path.join(process.cwd(), 'public', 'debug', 'intent-icons', intent)
  fs.mkdirSync(outDir, { recursive: true })

  const styleDataUrl = toDataUrl(stylePath)
  let updated = 0

  for (let i = 0; i < entries.length; i++) {
    const item = entries[i]
    const prompt = buildPrompt(item)
    const pngBuffer = await generateImage(prompt, styleDataUrl, model, apiKey)

    const pngPath = path.join(outDir, `icon-${item.id}.png`)
    const svgPath = path.join(outDir, `icon-${item.id}.svg`)
    fs.writeFileSync(pngPath, pngBuffer)
    await traceToSvg(pngPath, svgPath)

    const svgIcon = fs.readFileSync(svgPath, 'utf8')
    if (!overrides[item.id]) {
      overrides[item.id] = {
        id: item.id,
        name: item.name || item.id,
        description: item.description || '',
        promptInstruction: item.promptInstruction || '',
        structuralPrompt: item.structuralPrompt || '',
        svgIcon: svgIcon,
        textZone: item.textZone || 'center',
      }
      updated++
    } else {
      overrides[item.id].svgIcon = svgIcon
      updated++
    }

    console.log(`[${i + 1}/${entries.length}] OK: ${item.id}`)
  }

  fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2), 'utf8')
  console.log(`Updated svgIcon for ${updated} compositions (${intent})`)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
