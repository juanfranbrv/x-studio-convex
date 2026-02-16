const fs = require('fs')
const path = require('path')

const WISDOM_BASE_URL = 'https://wisdom-gate.juheapi.com'
const DEFAULT_MODEL = 'gemini-2.5-flash-image'
const POTRACE = require('potrace')

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

loadEnvFile()
const WISDOM_API_KEY = process.env.WISDOM_API_KEY || ''

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'))

const toDataUrl = (filePath) => {
  const buffer = fs.readFileSync(filePath)
  const base64 = buffer.toString('base64')
  const ext = path.extname(filePath).toLowerCase()
  const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png'
  return `data:${mimeType};base64,${base64}`
}

const pickComposition = (overrides, id) => {
  if (id && overrides[id]) return overrides[id]
  const first = Object.values(overrides)[0]
  return first || null
}

const buildPrompt = (composition) => {
  const name = composition?.name || 'Composicion'
  const description = composition?.description || ''
  const structural = composition?.structuralPrompt || ''
  const instruction = composition?.promptInstruction || ''

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

const main = async () => {
  if (!WISDOM_API_KEY) {
    console.error('Missing WISDOM_API_KEY env var.')
    process.exit(1)
  }

  const overridesPath = path.join(process.cwd(), 'src', 'data', 'legacy-layout-overrides.json')
  const overrides = readJson(overridesPath)
  const compositionId = process.argv[2]
  const modelArg = process.argv[3]
  const styleArg = process.argv[4]
  const model = modelArg && modelArg.trim() ? modelArg.trim() : DEFAULT_MODEL
  const composition = pickComposition(overrides, compositionId)

  if (!composition) {
    console.error('No composition found to test.')
    process.exit(1)
  }

  const styleImagePath = styleArg && styleArg.trim()
    ? styleArg.trim()
    : path.join(process.cwd(), 'public', 'plantillas', 'plantilla1.png')
  if (!fs.existsSync(styleImagePath)) {
    console.error('Style image not found at:', styleImagePath)
    process.exit(1)
  }

  const prompt = buildPrompt(composition)
  const styleDataUrl = toDataUrl(styleImagePath)

  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { data: styleDataUrl.split('base64,')[1], mimeType: 'image/png' } }
      ]
    }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: {
        aspectRatio: '1:1',
        imageSize: '1K'
      }
    }
  }

  const response = await fetch(`${WISDOM_BASE_URL}/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': WISDOM_API_KEY
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Wisdom image generation failed:', errorText)
    process.exit(1)
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

  if (!inlineData?.data) {
    console.error('No image data found in Wisdom response.')
    process.exit(1)
  }

  const outDir = path.join(process.cwd(), 'public', 'debug')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const pngPath = path.join(outDir, `icon-style-test-${composition.id}.png`)
  const svgPath = path.join(outDir, `icon-style-test-${composition.id}.svg`)
  fs.writeFileSync(pngPath, Buffer.from(inlineData.data, 'base64'))

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
      const normalized = svg
        .replace(/fill="[^"]*"/g, 'fill="currentColor"')
        .replace(/<path(?![^>]*fill=)/g, '<path fill="currentColor"')
      fs.writeFileSync(svgPath, normalized, 'utf8')
      return resolve()
    })
  })

  console.log(`Saved image to ${pngPath}`)
  console.log(`Saved SVG to ${svgPath}`)
  console.log(`Composition used: ${composition.id}`)
  console.log(`Model used: ${model}`)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
