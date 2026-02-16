/**
 * Generates shared-layouts.ts from orphan keys in legacy-layout-overrides.json
 * Usage: node scripts/generate-shared-layouts.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const legacy = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'legacy-layout-overrides.json'), 'utf8'))

const intents = [
    'bts', 'catalogo', 'cita', 'comunicado', 'comparativa',
    'dato', 'def', 'efemeride', 'equipo', 'escaparate',
    'evento', 'lanzamiento', 'lista', 'logro', 'oferta',
    'pasos', 'pregunta', 'reto', 'servicio', 'talento',
]

const orphanEntries = Object.entries(legacy).filter(
    ([k]) => !intents.some(i => k.startsWith(i + '-'))
)

const escapeTs = (s) => {
    if (!s) return ''
    return s
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
}

let output = `/**
 * Shared / utility layout definitions
 * 
 * These layouts don't belong to any specific intent but are kept
 * for potential future use or cross-intent reuse.
 * 
 * Migrated from legacy-layout-overrides.json
 */

import type { LayoutOption } from '@/lib/creation-flow-types'

export const SHARED_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [\n`

for (const [, entry] of orphanEntries) {
    const id = entry.id || ''
    const name = entry.name || ''
    const description = entry.description || ''
    const svgIcon = entry.svgIcon || ''
    const textZone = entry.textZone || 'center'
    const promptInstruction = entry.promptInstruction || ''
    const structuralPrompt = entry.structuralPrompt || ''

    output += `    {\n`
    output += `        id: '${escapeTs(id)}',\n`
    output += `        name: '${escapeTs(name)}',\n`
    output += `        description: '${escapeTs(description)}',\n`
    output += `        svgIcon: '${escapeTs(svgIcon)}',\n`
    output += `        textZone: '${escapeTs(textZone)}',\n`
    output += `        promptInstruction: '${escapeTs(promptInstruction)}',\n`
    output += `        structuralPrompt: \`${structuralPrompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,\n`
    output += `    },\n`
}

output += `]\n`

const outPath = join(ROOT, 'src', 'lib', 'prompts', 'intents', 'shared-layouts.ts')
writeFileSync(outPath, output, 'utf8')
console.log(`✅ Generated ${outPath} with ${orphanEntries.length} layouts`)
