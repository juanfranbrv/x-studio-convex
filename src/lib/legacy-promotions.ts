import { promises as fs } from 'fs'
import path from 'path'
import type { LayoutOption } from '@/lib/creation-flow-types'
import type { LegacyComposition } from '@/lib/legacy-compositions'

const PROMOTED_FILE_PATH = path.join(
    process.cwd(),
    'src',
    'data',
    'legacy-promoted-layouts.json'
)

const BASIC_FILE_PATH = path.join(
    process.cwd(),
    'src',
    'data',
    'legacy-basic-layouts.json'
)

export async function readPromotedLegacyLayouts(): Promise<LayoutOption[]> {
    try {
        const raw = await fs.readFile(PROMOTED_FILE_PATH, 'utf8')
        const parsed = JSON.parse(raw) as LayoutOption[]
        if (!Array.isArray(parsed)) return []
        return parsed.filter((item) => item && typeof item.id === 'string')
    } catch {
        return []
    }
}

async function writePromotedLegacyLayouts(layouts: LayoutOption[]): Promise<void> {
    const normalized = layouts
        .filter((item) => item && typeof item.id === 'string')
        .sort((a, b) => a.id.localeCompare(b.id, 'es', { sensitivity: 'base' }))
    await fs.writeFile(PROMOTED_FILE_PATH, JSON.stringify(normalized, null, 2), 'utf8')
}

export async function readBasicLegacyLayouts(): Promise<LayoutOption[]> {
    try {
        const raw = await fs.readFile(BASIC_FILE_PATH, 'utf8')
        const parsed = JSON.parse(raw) as LayoutOption[]
        if (!Array.isArray(parsed)) return []
        return parsed.filter((item) => item && typeof item.id === 'string')
    } catch {
        return []
    }
}

async function writeBasicLegacyLayouts(layouts: LayoutOption[]): Promise<void> {
    const normalized = layouts
        .filter((item) => item && typeof item.id === 'string')
        .sort((a, b) => a.id.localeCompare(b.id, 'es', { sensitivity: 'base' }))
    await fs.writeFile(BASIC_FILE_PATH, JSON.stringify(normalized, null, 2), 'utf8')
}

function toLayoutOption(item: LegacyComposition): LayoutOption {
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        svgIcon: item.svgIcon || 'Layout',
        textZone: (item.textZone as LayoutOption['textZone']) || 'center',
        promptInstruction: item.promptInstruction || '',
        structuralPrompt: item.structuralPrompt || '',
        skillVersion: 'legacy',
    }
}

export async function promoteLegacyComposition(item: LegacyComposition): Promise<void> {
    const current = await readPromotedLegacyLayouts()
    const next = current.filter((layout) => layout.id !== item.id)
    next.push(toLayoutOption(item))
    await writePromotedLegacyLayouts(next)
}

export async function demoteLegacyComposition(layoutId: string): Promise<void> {
    const current = await readPromotedLegacyLayouts()
    const next = current.filter((layout) => layout.id !== layoutId)
    await writePromotedLegacyLayouts(next)
}

export async function promoteLegacyCompositionToBasic(item: LegacyComposition): Promise<void> {
    const layout = toLayoutOption(item)
    const current = await readBasicLegacyLayouts()
    const next = current.filter((entry) => entry.id !== layout.id)
    next.push(layout)
    await writeBasicLegacyLayouts(next)
}

export async function demoteLegacyCompositionFromBasic(layoutId: string): Promise<void> {
    const current = await readBasicLegacyLayouts()
    const next = current.filter((layout) => layout.id !== layoutId)
    await writeBasicLegacyLayouts(next)
}

export async function setLegacyLayoutMode(item: LegacyComposition, mode: 'basic' | 'advanced', enabled: boolean): Promise<void> {
    if (mode === 'advanced') {
        if (enabled) await promoteLegacyComposition(item)
        else await demoteLegacyComposition(item.id)
        return
    }
    if (enabled) await promoteLegacyCompositionToBasic(item)
    else await demoteLegacyCompositionFromBasic(item.id)
}

export async function removeLegacyLayoutFromModes(layoutId: string): Promise<void> {
    await demoteLegacyComposition(layoutId)
    await demoteLegacyCompositionFromBasic(layoutId)
}

