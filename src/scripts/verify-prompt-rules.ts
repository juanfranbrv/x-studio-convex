
import { buildCarouselPrompt } from '../lib/prompts/carousel/builder/index'
import { getNarrativeStructure, getNarrativeComposition } from '../lib/carousel-structures'

const ctx = {
    brandName: 'Test Brand',
    brandTone: 'Friendly',
    brandColors: ['#FF0000', '#00FF00'],
    targetAudience: 'Everyone',
    intent: 'Test Intent',
    includeLogo: true,
    visualAnalysis: 'Visuals',
    language: 'es'
}

const structure = getNarrativeStructure('problem-solution')!
const composition = getNarrativeComposition('problem-solution', 'minimal')!

const prompt = buildCarouselPrompt(ctx, structure, composition)

const checks = [
    { id: 'Visual Reference', text: '## Visual Reference' },
    { id: 'Logo Protection', text: '## LOGO PROTECTION (CRITICAL)' },
    { id: 'Language Enforcement', text: '## LANGUAGE ENFORCEMENT (CRITICAL)' },
    { id: 'Brand DNA', text: 'PRIORITY 9 - BRAND DNA & IDENTITY' },
    { id: 'Brand Colors Rule', text: 'PRIORITY 4 - BRAND COLOR PALETTE' },
    { id: 'Brand Colors Content', text: '- **Brand Colors**: #FF0000, #00FF00' },
    { id: 'Detect Language', text: 'detected language is "es"' }
]

console.log('--- Verification Report ---')
checks.forEach(check => {
    const passed = prompt.includes(check.text)
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${check.id}`)
})
