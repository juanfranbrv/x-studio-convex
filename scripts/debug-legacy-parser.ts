
import { getLegacyCompositions } from '../src/lib/legacy-compositions'

async function main() {
    console.log('🔍 Debugging Legacy Composition Parser...')
    const all = await getLegacyCompositions()
    console.log(`✅ Found ${all.length} total compositions.`)

    const talento = all.filter(c => c.id.startsWith('talento'))
    const pregunta = all.filter(c => c.id.startsWith('pregunta'))

    console.log(`\n📂 Talento: ${talento.length} found`)
    talento.forEach(c => console.log(`   - ${c.id}: ${c.name}`))

    console.log(`\n📂 Pregunta: ${pregunta.length} found`)
    pregunta.forEach(c => console.log(`   - ${c.id}: ${c.name}`))
}

main().catch(console.error)
