
import { buildCarouselPrompt } from '../lib/prompts/carousel/builder'
import { getNarrativeStructure, getNarrativeComposition } from '../lib/carousel-structures'

// Mock Data
const ctx = {
    brandName: 'Acme Corp',
    brandTone: 'Professional, Innovative, Urgent',
    targetAudience: 'CEOs, CTOs',
    intent: 'How to optimize AI workflows',
    slidesCount: 8,
    format: 'Instagram Carousel',
    visualAnalysis: 'The image shows a modern, clean office...',
    includeLogo: true,
    language: 'fr'
}

// Test Case: Problem-Solution with Chaos-Order
const structureId = 'problema-solucion'
const compositionId = 'chaos-order'

const structure = getNarrativeStructure(structureId)
const composition = getNarrativeComposition(structureId, compositionId)

if (!structure || !composition) {
    console.error('Structure or Composition not found!')
    process.exit(1)
}

console.log('--- Generating Prompt ---')
console.log('Context:', ctx)
console.log('Structure:', structure.name)
console.log('Composition:', composition.name)

const prompt = buildCarouselPrompt(ctx, structure, composition)

console.log('\n--- GENERATED PROMPT ---\n')
console.log(prompt)
console.log('\n------------------------\n')
