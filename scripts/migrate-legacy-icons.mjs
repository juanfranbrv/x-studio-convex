/**
 * Migration script: Replace svgIcon values in intent TS files with
 * the inline SVG strings from legacy-layout-overrides.json.
 *
 * Usage:  node scripts/migrate-legacy-icons.mjs
 *
 * Strategy: For each layout block in a TS file identified by its `id`,
 * find the corresponding svgIcon line and replace the value.
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Load legacy JSON ──────────────────────────────────────────────
const legacyPath = join(ROOT, 'src', 'data', 'legacy-layout-overrides.json')
const legacy = JSON.parse(readFileSync(legacyPath, 'utf8'))

// ── Intent files ──────────────────────────────────────────────────
const INTENTS_DIR = join(ROOT, 'src', 'lib', 'prompts', 'intents')

const INTENT_FILES = [
    'bts', 'catalogo', 'cita', 'comunicado', 'comparativa',
    'dato', 'definicion', 'efemeride', 'equipo', 'escaparate',
    'evento', 'lanzamiento', 'lista', 'logro', 'oferta',
    'pasos', 'pregunta', 'reto', 'servicio', 'talento',
]

let totalReplaced = 0

for (const intent of INTENT_FILES) {
    const filePath = join(INTENTS_DIR, `${intent}.ts`)
    const lines = readFileSync(filePath, 'utf8').split('\n')
    let replacedInFile = 0
    let currentLayoutId = null

    for (let i = 0; i < lines.length; i++) {
        // Track which layout block we're inside
        const idMatch = lines[i].match(/id:\s*'([^']+)'/)
        if (idMatch) {
            currentLayoutId = idMatch[1]
        }

        // If we're inside a known layout and hit an svgIcon line, replace it
        if (currentLayoutId && legacy[currentLayoutId]) {
            const svgIconMatch = lines[i].match(/^(\s*)svgIcon:\s*(?:'[^']*'|"[^"]*")/)
            if (svgIconMatch) {
                const indent = svgIconMatch[1]
                const legacySvg = legacy[currentLayoutId].svgIcon
                if (legacySvg) {
                    // Escape single quotes in SVG for TS string literal
                    const escaped = legacySvg.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
                    lines[i] = `${indent}svgIcon: '${escaped}',`
                    replacedInFile++
                }
            }
        }
    }

    if (replacedInFile > 0) {
        writeFileSync(filePath, lines.join('\n'), 'utf8')
        console.log(`✅ ${intent}.ts — ${replacedInFile} svgIcon(s) replaced`)
        totalReplaced += replacedInFile
    } else {
        console.log(`⚠️  ${intent}.ts — no replacements`)
    }
}

console.log(`\nDone. ${totalReplaced} total replacements across all files.`)
