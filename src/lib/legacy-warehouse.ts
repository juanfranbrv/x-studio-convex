import { promises as fs } from 'fs'
import path from 'path'
import type { LayoutOption } from '@/lib/creation-flow-types'

const REMOVED_IDS_FILE_PATH = path.join(
    process.cwd(),
    'src',
    'data',
    'legacy-removed-layout-ids.json'
)

const CUSTOM_LAYOUTS_FILE_PATH = path.join(
    process.cwd(),
    'src',
    'data',
    'legacy-custom-layouts.json'
)

const OVERRIDES_FILE_PATH = path.join(
    process.cwd(),
    'src',
    'data',
    'legacy-layout-overrides.json'
)

type LayoutOverridesMap = Record<string, LayoutOption>

function normalizeLayout(input: Partial<LayoutOption> | null | undefined): LayoutOption | null {
    const id = String(input?.id || '').trim()
    if (!id) return null

    const name = String(input?.name || '').trim() || id
    const description = String(input?.description || '').trim() || 'Composicion sin descripcion'
    const svgIcon = String(input?.svgIcon || 'Layout').trim() || 'Layout'
    const textZone = (input?.textZone as LayoutOption['textZone']) || 'center'
    const promptInstruction = String(input?.promptInstruction || '').trim()
    const structuralPrompt = String(input?.structuralPrompt || '').trim()
    const skillVersion = String(input?.skillVersion || 'legacy').trim() || 'legacy'

    return {
        id,
        name,
        description,
        svgIcon,
        textZone,
        promptInstruction,
        structuralPrompt,
        skillVersion,
    }
}

export async function readRemovedLegacyLayoutIds(): Promise<string[]> {
    try {
        const raw = await fs.readFile(REMOVED_IDS_FILE_PATH, 'utf8')
        const parsed = JSON.parse(raw) as string[]
        if (!Array.isArray(parsed)) return []
        return parsed.filter((id) => typeof id === 'string' && id.trim().length > 0)
    } catch {
        return []
    }
}

async function writeRemovedLegacyLayoutIds(ids: string[]): Promise<void> {
    const normalized = Array.from(new Set(ids.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base' })
    )
    await fs.writeFile(REMOVED_IDS_FILE_PATH, JSON.stringify(normalized, null, 2), 'utf8')
}

export async function removeLegacyLayoutFromWarehouse(layoutId: string): Promise<void> {
    if (!layoutId) return
    const current = await readRemovedLegacyLayoutIds()
    await writeRemovedLegacyLayoutIds([...current, layoutId])
}

export async function restoreLegacyLayoutToWarehouse(layoutId: string): Promise<void> {
    if (!layoutId) return
    const current = await readRemovedLegacyLayoutIds()
    await writeRemovedLegacyLayoutIds(current.filter((id) => id !== layoutId))
}

export async function readCustomLegacyLayouts(): Promise<LayoutOption[]> {
    try {
        const raw = await fs.readFile(CUSTOM_LAYOUTS_FILE_PATH, 'utf8')
        const parsed = JSON.parse(raw) as LayoutOption[]
        if (!Array.isArray(parsed)) return []
        return parsed
            .map((item) => normalizeLayout(item))
            .filter((item): item is LayoutOption => Boolean(item))
    } catch {
        return []
    }
}

async function writeCustomLegacyLayouts(layouts: LayoutOption[]): Promise<void> {
    const normalized = layouts
        .map((item) => normalizeLayout(item))
        .filter((item): item is LayoutOption => Boolean(item))
        .sort((a, b) => a.id.localeCompare(b.id, 'es', { sensitivity: 'base' }))
    await fs.writeFile(CUSTOM_LAYOUTS_FILE_PATH, JSON.stringify(normalized, null, 2), 'utf8')
}

export async function upsertCustomLegacyLayout(layout: LayoutOption): Promise<void> {
    const normalized = normalizeLayout(layout)
    if (!normalized) return
    const current = await readCustomLegacyLayouts()
    const next = current.filter((item) => item.id !== normalized.id)
    next.push(normalized)
    await writeCustomLegacyLayouts(next)
}

export async function deleteCustomLegacyLayout(layoutId: string): Promise<void> {
    const id = String(layoutId || '').trim()
    if (!id) return
    const current = await readCustomLegacyLayouts()
    const next = current.filter((item) => item.id !== id)
    await writeCustomLegacyLayouts(next)
}

export async function readLegacyLayoutOverrides(): Promise<LayoutOverridesMap> {
    try {
        const raw = await fs.readFile(OVERRIDES_FILE_PATH, 'utf8')
        const parsed = JSON.parse(raw) as LayoutOverridesMap
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
        const sanitized: LayoutOverridesMap = {}
        for (const [id, value] of Object.entries(parsed)) {
            const normalized = normalizeLayout({ ...(value || {}), id })
            if (!normalized) continue
            sanitized[id] = normalized
        }
        return sanitized
    } catch {
        return {}
    }
}

async function writeLegacyLayoutOverrides(overrides: LayoutOverridesMap): Promise<void> {
    const sortedIds = Object.keys(overrides).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
    const normalized: LayoutOverridesMap = {}
    for (const id of sortedIds) {
        const value = normalizeLayout({ ...(overrides[id] || {}), id })
        if (!value) continue
        normalized[id] = value
    }
    await fs.writeFile(OVERRIDES_FILE_PATH, JSON.stringify(normalized, null, 2), 'utf8')
}

export async function upsertLegacyLayoutOverride(layout: LayoutOption): Promise<void> {
    const normalized = normalizeLayout(layout)
    if (!normalized) return
    const current = await readLegacyLayoutOverrides()
    current[normalized.id] = normalized
    await writeLegacyLayoutOverrides(current)
}

export async function deleteLegacyLayoutOverride(layoutId: string): Promise<void> {
    const id = String(layoutId || '').trim()
    if (!id) return
    const current = await readLegacyLayoutOverrides()
    delete current[id]
    await writeLegacyLayoutOverrides(current)
}

