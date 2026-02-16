
import { getLegacyCompositions } from '../src/lib/legacy-compositions'
import { suggestCompositionIcon } from '../src/lib/ai-composition-icon'
import { upsertCustomLegacyLayout, upsertLegacyLayoutOverride } from '../src/lib/legacy-warehouse'
import { LayoutOption } from '../src/lib/creation-flow-types'

process.env.NEXT_PUBLIC_CONVEX_URL = "https://warmhearted-schnauzer-446.convex.cloud"
process.env.CONVEX_URL = "https://warmhearted-schnauzer-446.convex.cloud"

async function main() {
    console.log('🚀 Iniciando asignación masiva de iconos...')
    const all = await getLegacyCompositions()
    let count = 0
    let updated = 0
    const LIMIT = 5 // User requested a small test case

    for (const comp of all) {
        count++
        // Asignar si no tiene, si es el default, o si es un SVG (queremos migrar a Material Symbols)
        // Nota: Si el usuario quiere mantener los SVG actuales, podríamos ser más selectivos.
        // Pero el objetivo es automatizar y estandarizar.
        if (!comp.svgIcon || comp.svgIcon === 'Layout' || comp.svgIcon.startsWith('<svg')) {
            if (updated >= LIMIT) break;

            console.log(`\nProcessing [${count}/${all.length}]: ${comp.name}...`)
            try {
                const suggested = await suggestCompositionIcon(comp.name)
                if (suggested) {
                    console.log(`   ✨ Sugerido: ${suggested}`)
                    const layout: LayoutOption = {
                        id: comp.id,
                        name: comp.name,
                        description: comp.description || '',
                        svgIcon: suggested,
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
                    updated++
                } else {
                    console.log(`   ⚠️ No se pudo sugerir icono.`)
                }
            } catch (error) {
                console.error(`   ❌ Error en ${comp.name}:`, error)
            }
        }
    }

    console.log(`\n✅ Proceso completado.`)
    console.log(`Total procesado: ${count}`)
    console.log(`Total actualizado: ${updated}`)
    process.exit(0)
}

main().catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
})
