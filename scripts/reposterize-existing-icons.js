const fs = require('fs')
const path = require('path')
const POTRACE = require('potrace')

const normalizeSvgFill = (svg) => (
  svg
    .replace(/fill="[^"]*"/g, 'fill="currentColor"')
    .replace(/<path(?![^>]*fill=)/g, '<path fill="currentColor"')
)

const posterizePng = async (pngPath, svgPath) => {
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
      fs.writeFileSync(svgPath, normalizeSvgFill(svg), 'utf8')
      return resolve()
    })
  })
}

const main = async () => {
  const root = path.join(process.cwd(), 'public', 'debug', 'intent-icons')
  if (!fs.existsSync(root)) {
    console.error('No intent-icons folder found.')
    process.exit(1)
  }

  const overridesPath = path.join(process.cwd(), 'src', 'data', 'legacy-layout-overrides.json')
  const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'))

  const intentDirs = fs.readdirSync(root).filter((entry) => {
    const full = path.join(root, entry)
    return fs.statSync(full).isDirectory()
  })

  let updated = 0

  for (const intentDir of intentDirs) {
    const fullDir = path.join(root, intentDir)
    const files = fs.readdirSync(fullDir).filter((f) => f.endsWith('.png') && f.startsWith('icon-'))

    for (const file of files) {
      const pngPath = path.join(fullDir, file)
      const svgName = file.replace(/\.png$/i, '.svg')
      const svgPath = path.join(fullDir, svgName)
      const layoutId = file.replace(/^icon-/, '').replace(/\.png$/i, '')

      await posterizePng(pngPath, svgPath)
      const svgIcon = fs.readFileSync(svgPath, 'utf8')
      if (overrides[layoutId]) {
        overrides[layoutId].svgIcon = svgIcon
        updated++
      }
      console.log(`OK: ${layoutId}`)
    }
  }

  fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2), 'utf8')
  console.log(`Updated ${updated} svgIcon entries.`)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
