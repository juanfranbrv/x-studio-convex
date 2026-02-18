import './env-loader'
import { getLegacyCompositions } from '../src/lib/legacy-compositions'
import { upsertCustomLegacyLayout, upsertLegacyLayoutOverride } from '../src/lib/legacy-warehouse'
import { LayoutOption } from '../src/lib/creation-flow-types'

const TARGET_ICON = 'wand_stars'

async function main() {
    console.log('Updating Libre compositions icon...')
    const all = await getLegacyCompositions()
    const libre = all.filter(comp => (comp.name || '').trim().toLowerCase() === 'libre')
    console.log(`Found ${libre.length} Libre compositions.`)

    let updated = 0
    for (const comp of libre) {
        const layout: LayoutOption = {
            id: comp.id,
            name: comp.name,
            description: comp.description || '',
            svgIcon: TARGET_ICON,
            textZone: (comp.textZone as any) || 'center',
            promptInstruction: comp.promptInstruction || '',
            structuralPrompt: comp.structuralPrompt || '',
            skillVersion: 'legacy',
        }

        // Always upsert override to avoid stale overrides masking custom layouts.
        await upsertLegacyLayoutOverride(layout)

        if (comp.source === 'custom') {
            await upsertCustomLegacyLayout(layout)
        }
        updated++
    }

    console.log(`Done. Updated ${updated} compositions to icon "${TARGET_ICON}".`)
}

main().catch((err) => {
    console.error('Failed to update Libre icons:', err)
    process.exit(1)
})
