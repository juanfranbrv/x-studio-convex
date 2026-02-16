/**
 * fix-svg-escaping.mjs
 *
 * Scans TypeScript intent files for svgIcon properties whose single-quoted
 * string values contain literal newlines, tabs, or carriage returns, and
 * replaces them with their escaped equivalents (\n, \t, \r).
 *
 * Usage:  node scripts/fix-svg-escaping.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const intentsDir = path.join(__dirname, '..', 'src', 'lib', 'prompts', 'intents')

// Files to process – add more as needed
const targetFiles = ['servicio.ts', 'oferta.ts']

let totalFixed = 0

for (const file of targetFiles) {
    const filePath = path.join(intentsDir, file)
    if (!fs.existsSync(filePath)) {
        console.log(`⏭  ${file} — not found, skipping`)
        continue
    }

    let content = fs.readFileSync(filePath, 'utf-8')
    const original = content

    // Strategy: find all single-quoted svgIcon values and escape them.
    // Pattern: svgIcon: '<svg ... </svg>'
    // The SVG content may span multiple lines.

    // We match svgIcon: ' ... ' where the value may contain newlines
    // Using a regex that captures from svgIcon: ' to the closing </svg>'
    const svgIconRegex = /svgIcon:\s*'(<svg[\s\S]*?<\/svg>)'/g

    let match
    let fixCount = 0

    while ((match = svgIconRegex.exec(content)) !== null) {
        const rawSvg = match[1]
        // Check if the raw SVG contains literal newlines/tabs
        if (rawSvg.includes('\n') || rawSvg.includes('\r') || rawSvg.includes('\t')) {
            const escaped = rawSvg
                .replace(/\\/g, '\\\\')   // escape backslashes first
                .replace(/\n/g, '\\n')     // escape newlines
                .replace(/\r/g, '\\r')     // escape carriage returns  
                .replace(/\t/g, '\\t')     // escape tabs

            // But we need to be careful: the original may already have some
            // escaped sequences. Let's just do the replacement on the raw match.
            const fullMatch = match[0]
            const fixedMatch = `svgIcon: '${escaped}'`
            content = content.replace(fullMatch, fixedMatch)

            // Reset regex since we changed the content
            svgIconRegex.lastIndex = 0
            fixCount++
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8')
        console.log(`✅ ${file} — fixed ${fixCount} svgIcon strings`)
        totalFixed += fixCount
    } else {
        console.log(`✓  ${file} — no changes needed`)
    }
}

console.log(`\nDone. Fixed ${totalFixed} total svgIcon strings.`)
