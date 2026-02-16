'use server'

import { revalidatePath } from 'next/cache'
import { getLegacyCompositions, type LegacyComposition } from '@/lib/legacy-compositions'
import { readBasicLegacyLayouts, readPromotedLegacyLayouts, removeLegacyLayoutFromModes, setLegacyLayoutMode } from '@/lib/legacy-promotions'
import { deleteCustomLegacyLayout, deleteLegacyLayoutOverride, removeLegacyLayoutFromWarehouse, restoreLegacyLayoutToWarehouse, upsertCustomLegacyLayout, upsertLegacyLayoutOverride } from '@/lib/legacy-warehouse'
import { generateCompositionIconSvg } from '@/lib/composition-icon'
import { generateLegacyAutoCompositions, type AutoDensity, type AutoTone } from '@/lib/legacy-composition-auto'
import type { IntentCategory, LayoutOption } from '@/lib/creation-flow-types'
import { suggestCompositionIcon } from './ai-composition-icon'

function norm(value: FormDataEntryValue | null): string {
    return String(value || '').trim()
}

function fromForm(formData: FormData): LayoutOption | null {
    const id = norm(formData.get('id'))
    const name = norm(formData.get('name'))
    const description = norm(formData.get('description'))
    const promptInstruction = norm(formData.get('promptInstruction'))
    if (!id || !name || !description) return null

    return {
        id,
        name,
        description,
        svgIcon: norm(formData.get('svgIcon')) || 'Layout',
        textZone: (norm(formData.get('textZone')) as LayoutOption['textZone']) || 'center',
        promptInstruction,
        structuralPrompt: norm(formData.get('structuralPrompt')),
        skillVersion: 'legacy',
    }
}

export async function saveAction(formData: FormData) {
    const source = norm(formData.get('source')) === 'custom' ? 'custom' : 'snapshot'
    const modeBasic = formData.get('modeBasic') === 'on'
    const modeAdvanced = formData.get('modeAdvanced') === 'on'
    const layout = fromForm(formData)
    if (!layout) return

    const originalId = norm(formData.get('originalId'))
    if (source === 'custom') {
        if (originalId && originalId !== layout.id) {
            await deleteCustomLegacyLayout(originalId)
            await removeLegacyLayoutFromModes(originalId)
            await deleteLegacyLayoutOverride(originalId)
        }
        await upsertCustomLegacyLayout(layout)
    } else {
        await upsertLegacyLayoutOverride(layout)
    }

    const composition: LegacyComposition = {
        id: layout.id,
        name: layout.name,
        description: layout.description,
        file: source === 'custom' ? 'custom' : 'snapshot',
        svgIcon: layout.svgIcon || 'Layout',
        textZone: layout.textZone || 'center',
        promptInstruction: layout.promptInstruction || '',
        structuralPrompt: layout.structuralPrompt || '',
        source,
    }

    await restoreLegacyLayoutToWarehouse(layout.id)
    await setLegacyLayoutMode(composition, 'basic', modeBasic)
    await setLegacyLayoutMode(composition, 'advanced', modeAdvanced)

    revalidatePath('/admin/compositions')
    revalidatePath('/admin/legacy-compositions') // Keep for transition
    revalidatePath('/admin')
    revalidatePath('/image')
}

export async function regenerateIconAction(formData: FormData) {
    const source = norm(formData.get('source')) === 'custom' ? 'custom' : 'snapshot'
    const layout = fromForm(formData)
    if (!layout) return

    const svgIcon = generateCompositionIconSvg(layout)
    const updatedLayout: LayoutOption = { ...layout, svgIcon }

    const originalId = norm(formData.get('originalId'))
    if (source === 'custom') {
        if (originalId && originalId !== updatedLayout.id) {
            await deleteCustomLegacyLayout(originalId)
            await removeLegacyLayoutFromModes(originalId)
            await deleteLegacyLayoutOverride(originalId)
        }
        await upsertCustomLegacyLayout(updatedLayout)
    } else {
        await upsertLegacyLayoutOverride(updatedLayout)
    }

    const composition: LegacyComposition = {
        id: updatedLayout.id,
        name: updatedLayout.name,
        description: updatedLayout.description,
        file: source === 'custom' ? 'custom' : 'snapshot',
        svgIcon: updatedLayout.svgIcon || 'Layout',
        textZone: updatedLayout.textZone || 'center',
        promptInstruction: updatedLayout.promptInstruction || '',
        structuralPrompt: updatedLayout.structuralPrompt || '',
        source,
    }

    await restoreLegacyLayoutToWarehouse(updatedLayout.id)
    await setLegacyLayoutMode(composition, 'basic', formData.get('modeBasic') === 'on')
    await setLegacyLayoutMode(composition, 'advanced', formData.get('modeAdvanced') === 'on')

    revalidatePath('/admin/compositions')
    revalidatePath('/admin/legacy-compositions')
    revalidatePath('/admin')
    revalidatePath('/image')
}

export async function toggleModeAction(formData: FormData) {
    const layoutId = norm(formData.get('layoutId'))
    const mode = norm(formData.get('mode')) as 'basic' | 'advanced'
    const enabled = norm(formData.get('enabled')) === '1'
    if (!layoutId || (mode !== 'basic' && mode !== 'advanced')) return

    const all = await getLegacyCompositions()
    const item = all.find((entry) => entry.id === layoutId)
    if (!item) return

    await setLegacyLayoutMode(item, mode, enabled)

    revalidatePath('/admin/compositions')
    revalidatePath('/admin/legacy-compositions')
    revalidatePath('/admin')
    revalidatePath('/image')
}

export async function deleteAction(formData: FormData) {
    const layoutId = norm(formData.get('layoutId'))
    const source = norm(formData.get('source')) === 'custom' ? 'custom' : 'snapshot'
    if (!layoutId) return

    await removeLegacyLayoutFromModes(layoutId)
    await deleteLegacyLayoutOverride(layoutId)
    if (source === 'custom') await deleteCustomLegacyLayout(layoutId)
    else await removeLegacyLayoutFromWarehouse(layoutId)

    revalidatePath('/admin/compositions')
    revalidatePath('/admin/legacy-compositions')
    revalidatePath('/admin')
    revalidatePath('/image')
}

export async function autoGenerateAction(formData: FormData) {
    const intentRaw = norm(formData.get('intent'))
    const intent = intentRaw as IntentCategory

    const goal = norm(formData.get('goal'))
    if (!goal) return

    const countRaw = Number(norm(formData.get('count')) || '3')
    const count = Number.isFinite(countRaw) ? Math.min(12, Math.max(1, Math.round(countRaw))) : 3

    const densityRaw = norm(formData.get('textDensity'))
    const textDensity: AutoDensity = densityRaw === 'low' || densityRaw === 'high' ? densityRaw : 'mid'

    const toneRaw = norm(formData.get('tone'))
    const tone: AutoTone = (
        toneRaw === 'comercial' ||
        toneRaw === 'institucional' ||
        toneRaw === 'didactico' ||
        toneRaw === 'dinamico'
    ) ? toneRaw : 'editorial'

    const modePresetRaw = norm(formData.get('modePreset'))
    const modePreset: 'auto' | 'basic' | 'advanced' | 'both' =
        modePresetRaw === 'basic' || modePresetRaw === 'advanced' || modePresetRaw === 'both' ? modePresetRaw : 'auto'

    const seedRaw = Number(norm(formData.get('seed')) || '0')
    const seed = Number.isFinite(seedRaw) && seedRaw > 0 ? Math.round(seedRaw) : Date.now()

    const existing = await getLegacyCompositions()
    const generated = generateLegacyAutoCompositions({
        intent,
        goal,
        count,
        textDensity,
        tone,
        seed,
        existingIds: existing.map((item) => item.id),
    })

    for (const item of generated) {
        const layout = item.layout
        await upsertCustomLegacyLayout(layout)
        await restoreLegacyLayoutToWarehouse(layout.id)

        const modeBasic = modePreset === 'basic' ? true : modePreset === 'advanced' ? false : modePreset === 'both' ? true : item.modeBasic
        const modeAdvanced = modePreset === 'basic' ? false : modePreset === 'advanced' ? true : modePreset === 'both' ? true : item.modeAdvanced

        const composition: LegacyComposition = {
            id: layout.id,
            name: layout.name,
            description: layout.description,
            file: 'custom',
            svgIcon: layout.svgIcon || 'Layout',
            textZone: layout.textZone || 'center',
            promptInstruction: layout.promptInstruction || '',
            structuralPrompt: layout.structuralPrompt || '',
            source: 'custom',
        }

        await setLegacyLayoutMode(composition, 'basic', modeBasic)
        await setLegacyLayoutMode(composition, 'advanced', modeAdvanced)
    }

    revalidatePath('/admin/compositions')
    revalidatePath('/admin/legacy-compositions')
    revalidatePath('/admin')
    revalidatePath('/image')
}

export type CompositionSummary = {
    id: string
    name: string
    intent: string
    svgIcon: string
    isBasic: boolean
    isAdvanced: boolean
    structuralPrompt?: string
}

export async function getCompositionsSummaryAction(): Promise<CompositionSummary[]> {
    const [all, promoted, basic] = await Promise.all([
        getLegacyCompositions(),
        readPromotedLegacyLayouts(),
        readBasicLegacyLayouts()
    ])

    const promotedIds = new Set(promoted.map(p => p.id))
    const basicIds = new Set(basic.map(b => b.id))

    return all.map(comp => {
        // Infer intent from file (e.g. "oferta.ts" -> "oferta")
        let intent = comp.file.replace('.ts', '').replace('layout-', '')
        if (intent === 'custom' || intent === 'snapshot') {
            // Try to extract from ID if it's a known intent prefix
            const parts = comp.id.split('-')
            if (parts.length > 1) intent = parts[0]
        }

        return {
            id: comp.id,
            name: comp.name,
            intent,
            svgIcon: comp.svgIcon,
            isBasic: basicIds.has(comp.id),
            isAdvanced: promotedIds.has(comp.id),
            structuralPrompt: comp.structuralPrompt
        }
    })
}

export async function suggestIconAction(id: string, name: string, description: string, promptInstruction: string) {
    const suggested = await suggestCompositionIcon(name)
    return suggested
}

export async function batchAssignIconsAction() {
    const all = await getLegacyCompositions()
    const results = { count: 0, updated: 0 }

    for (const comp of all) {
        results.count++
        // Only assign if it doesn't already have one, or if it has the default "Layout"
        if (!comp.svgIcon || comp.svgIcon === 'Layout' || comp.svgIcon.startsWith('<svg')) {
            const suggested = await suggestCompositionIcon(comp.name)
            if (suggested) {
                const layout: LayoutOption = {
                    id: comp.id,
                    name: comp.name,
                    description: comp.description,
                    svgIcon: suggested, // This will be the Material Symbol name
                    textZone: (comp.textZone as any) || 'center',
                    promptInstruction: comp.promptInstruction || '',
                    structuralPrompt: comp.structuralPrompt || '',
                    skillVersion: 'legacy',
                }

                if (comp.source === 'custom') {
                    await upsertCustomLegacyLayout(layout)
                } else {
                    await upsertLegacyLayoutOverride(layout)
                }
                results.updated++
            }
        }
    }

    revalidatePath('/admin/compositions')
    return results
}

