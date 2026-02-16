import { promises as fs } from 'fs'
import path from 'path'
import {
    readCustomLegacyLayouts,
    readLegacyLayoutOverrides,
    readRemovedLegacyLayoutIds,
} from '@/lib/legacy-warehouse'
import type { LayoutOption } from '@/lib/creation-flow-types'

export interface LegacyComposition {
    id: string
    name: string
    description: string
    file: string
    svgIcon: string
    textZone: string
    promptInstruction: string
    structuralPrompt: string
    source: 'snapshot' | 'custom'
}

const SNAPSHOT_DIR = path.join(
    process.cwd(),
    'docs',
    'legacy-compositions',
    'commit-06e173f'
)

const clean = (value?: string | null) => (value || '').trim()

const unquote = (value: string) => {
    if (!value) return ''
    const trimmed = value.trim()
    if (
        (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('`') && trimmed.endsWith('`'))
    ) {
        return trimmed.slice(1, -1)
    }
    return trimmed
}

function extractCompositionBlocks(fileContent: string): string[] {
    const blockRegex = /\{\s*id:\s*'[^']+'[\s\S]*?\n\s*\},/g
    const matches = fileContent.match(blockRegex) || []
    return matches.filter((block) => block.includes('promptInstruction:'))
}

function parseBlock(block: string, file: string): LegacyComposition | null {
    const idMatch = block.match(/id:\s*'([^']+)'/)
    const nameMatch = block.match(/name:\s*'([^']+)'/)
    const descriptionMatch = block.match(/description:\s*'([^']+)'/)
    const svgIconMatch = block.match(/svgIcon:\s*'([^']+)'/)
    const textZoneMatch = block.match(/textZone:\s*'([^']+)'/)
    const promptMatch = block.match(/promptInstruction:\s*('(?:[^'\\]|\\.)*'|`[\s\S]*?`)/)
    const structuralMatch = block.match(/structuralPrompt:\s*('(?:[^'\\]|\\.)*'|`[\s\S]*?`)/)

    if (!idMatch || !nameMatch || !descriptionMatch || !promptMatch) {
        return null
    }

    return {
        id: clean(idMatch[1]),
        name: clean(nameMatch[1]),
        description: clean(descriptionMatch[1]),
        file,
        svgIcon: clean(svgIconMatch?.[1] || 'Layout'),
        textZone: clean(textZoneMatch?.[1] || 'center'),
        promptInstruction: clean(unquote(promptMatch[1])),
        structuralPrompt: clean(structuralMatch ? unquote(structuralMatch[1]) : ''),
        source: 'snapshot',
    }
}

function layoutToLegacy(item: LayoutOption): LegacyComposition | null {
    const id = clean(item.id)
    if (!id) return null
    return {
        id,
        name: clean(item.name) || id,
        description: clean(item.description) || 'Composicion sin descripcion',
        file: 'custom',
        svgIcon: clean(item.svgIcon || 'Layout'),
        textZone: clean(item.textZone || 'center'),
        promptInstruction: clean(item.promptInstruction),
        structuralPrompt: clean(item.structuralPrompt),
        source: 'custom',
    }
}

export async function getLegacyCompositions(): Promise<LegacyComposition[]> {
    try {
        const removedIds = new Set(await readRemovedLegacyLayoutIds())
        const customLayouts = await readCustomLegacyLayouts()
        const overrides = await readLegacyLayoutOverrides()
        const dirEntries = await fs.readdir(SNAPSHOT_DIR, { withFileTypes: true })
        const files = dirEntries
            .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
            .map((entry) => entry.name)
            .filter((name) => name !== 'creation-flow-types.ts')

        const all = new Map<string, LegacyComposition>()

        for (const file of files) {
            const filePath = path.join(SNAPSHOT_DIR, file)
            const raw = await fs.readFile(filePath, 'utf8')
            const blocks = extractCompositionBlocks(raw)
            for (const block of blocks) {
                const parsed = parseBlock(block, file)
                if (parsed) all.set(parsed.id, parsed)
            }
        }

        for (const customLayout of customLayouts) {
            const parsed = layoutToLegacy(customLayout)
            if (!parsed) continue
            all.set(parsed.id, parsed)
        }

        for (const [id, override] of Object.entries(overrides)) {
            const current = all.get(id)
            const overrideParsed = layoutToLegacy(override)
            if (!overrideParsed) continue
            all.set(id, {
                ...(current || overrideParsed),
                id,
                name: overrideParsed.name,
                description: overrideParsed.description,
                svgIcon: overrideParsed.svgIcon,
                textZone: overrideParsed.textZone,
                promptInstruction: overrideParsed.promptInstruction,
                structuralPrompt: overrideParsed.structuralPrompt,
            })
        }

        return Array.from(all.values())
            .filter((entry) => !removedIds.has(entry.id))
            .sort((a, b) => {
            const byFile = a.file.localeCompare(b.file, 'es', { sensitivity: 'base' })
            if (byFile !== 0) return byFile
            return a.id.localeCompare(b.id, 'es', { sensitivity: 'base' })
            })
    } catch {
        return []
    }
}
