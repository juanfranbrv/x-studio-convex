import fs from 'fs'
import path from 'path'

const MATERIAL_ICONS_URL = 'https://fonts.google.com/metadata/icons'
const MATERIAL_SYMBOLS_URL = 'https://fonts.google.com/metadata/icons?bundle=materialsymbols'

async function fetchWithRetry(url, type, retries = 3) {
    console.log(`Fetching ${type} metadata...`)
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error(`HTTP ${response.status} for ${type}`)
            const text = await response.text()
            const jsonStr = text.startsWith(")]}'") ? text.substring(4) : text
            return JSON.parse(jsonStr)
        } catch (e) {
            console.warn(`Attempt ${i + 1} failed for ${type}: ${e.message}`)
            if (i === retries - 1) throw e
            await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        }
    }
}

async function start() {
    try {
        const iconsData = await fetchWithRetry(MATERIAL_ICONS_URL, 'Material Icons')
        const symbolsData = await fetchWithRetry(MATERIAL_SYMBOLS_URL, 'Material Symbols')

        const icons = iconsData.icons.map(icon => ({
            name: icon.name,
            tags: icon.tags,
            categories: icon.categories,
            version: icon.version,
            type: 'icon'
        }))

        const symbols = symbolsData.icons.map(icon => ({
            name: icon.name,
            tags: icon.tags,
            categories: icon.categories,
            version: icon.version,
            type: 'symbol'
        }))

        // Merge them by name
        const allMap = new Map()

        // Add Symbols first (they are newer and if there's an overlap, Symbols might be better or preferred)
        for (const symbol of symbols) {
            allMap.set(symbol.name, symbol)
        }

        for (const icon of icons) {
            if (!allMap.has(icon.name)) {
                allMap.set(icon.name, icon)
            } else {
                const existing = allMap.get(icon.name)
                existing.hasIconVersion = true
            }
        }

        console.log(`Checking for split_scene: ${allMap.has('split_scene')}`)

        const all = Array.from(allMap.values())

        const outputDir = path.join(process.cwd(), 'src/lib/icons')
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
        }

        fs.writeFileSync(path.join(outputDir, 'material-icons.json'), JSON.stringify(all, null, 2))
        console.log(`Successfully saved ${all.length} icons/symbols to material-icons.json`)

    } catch (error) {
        console.error('Fatal error:', error)
        process.exit(1)
    }
}

start()
