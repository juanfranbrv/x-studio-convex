export type CarouselCompositionGovernanceInput = {
    composition_id: string
    name: string
    description: string
    layoutPrompt: string
    scope: string
    mode: string
    structure_id?: string
    isActive?: boolean
}

export type CarouselCompositionRecommendation = {
    suggestedMode: 'basic' | 'advanced'
    suggestedScope: 'global' | 'narrative'
    reasoning: string[]
    shouldChangeMode: boolean
    shouldChangeScope: boolean
    shouldChangeAnything: boolean
    scores: {
        basic: number
        advanced: number
        global: number
        narrative: number
    }
}

const BASIC_KEYWORDS = [
    'grid', 'split', 'card', 'frame', 'focus', 'core', 'modular', 'module',
    'timeline', 'ribbon', 'scan', 'axis', 'columns', 'column', 'container',
    'window', 'stage', 'stack', 'rule of thirds', 'spiral', 'triangle', 'u frame'
]

const ADVANCED_KEYWORDS = [
    'metaphor', 'maze', 'bridge', 'storm', 'knot', 'fog', 'hurdle', 'target',
    'punchline', 'meme', 'myth', 'reality', 'chaos', 'abyss', 'lock', 'key',
    'debunk', 'transformation', 'contrast', 'chasm', 'quote focus', 'weather metaphor'
]

const GLOBAL_KEYWORDS = [
    'clean', 'modular', 'versatile', 'flexible', 'reusable', 'neutral',
    'scannable', 'structure', 'layout system', 'balanced', 'safe text area',
    'grid system', 'clear text', 'robust', 'universal'
]

const NARRATIVE_LOCK_KEYWORDS = [
    'problem', 'solution', 'before', 'after', 'ranking', 'myth', 'reality',
    'mistake', 'pas', 'checklist', 'q&a', 'question', 'answer', 'timeline',
    'case study', 'offer', 'quote', 'meme', 'humor', 'diagnostic', 'operational'
]

function normalize(value: string) {
    return (value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
}

function countMatches(text: string, keywords: string[]) {
    return keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0)
}

export function getCarouselCompositionRecommendation(
    composition: CarouselCompositionGovernanceInput
): CarouselCompositionRecommendation {
    const text = normalize([
        composition.composition_id,
        composition.name,
        composition.description,
        composition.layoutPrompt,
        composition.structure_id || '',
    ].join(' | '))

    const basic = countMatches(text, BASIC_KEYWORDS) + (composition.composition_id.startsWith('basic-') ? 4 : 0)
    const advanced = countMatches(text, ADVANCED_KEYWORDS) + (text.includes('metaphor') ? 2 : 0)
    const global = countMatches(text, GLOBAL_KEYWORDS) + (composition.composition_id.startsWith('basic-') ? 5 : 0)
    const narrative = countMatches(text, NARRATIVE_LOCK_KEYWORDS) + (composition.composition_id.includes('::') ? 3 : 0)

    const suggestedMode: 'basic' | 'advanced' = advanced > basic + 1 ? 'advanced' : 'basic'
    const rawSuggestedScope: 'global' | 'narrative' = global > narrative + 1 ? 'global' : 'narrative'
    const suggestedScope: 'global' | 'narrative' =
        rawSuggestedScope === 'narrative' && !composition.structure_id
            ? 'global'
            : rawSuggestedScope
    const shouldChangeMode = composition.mode !== suggestedMode
    const shouldChangeScope = composition.scope !== suggestedScope
    const shouldChangeAnything = shouldChangeMode || shouldChangeScope

    const reasoning: string[] = []
    if (suggestedMode === 'basic') {
        reasoning.push('La composición parece estructural y reutilizable, adecuada para autoselección.')
    } else {
        reasoning.push('La composición parece demasiado específica o conceptual para dejarla en el pool automático.')
    }

    if (rawSuggestedScope === 'narrative' && !composition.structure_id) {
        reasoning.push('Se conserva como global porque esta composición no tiene narrativa asignada y no se reasigna automáticamente.')
    } else if (suggestedScope === 'global') {
        reasoning.push('Su lenguaje visual parece genérico y reaprovechable entre narrativas.')
    } else {
        reasoning.push('Su semántica parece muy ligada a una narrativa concreta.')
    }

    return {
        suggestedMode,
        suggestedScope,
        reasoning,
        shouldChangeMode,
        shouldChangeScope,
        shouldChangeAnything,
        scores: { basic, advanced, global, narrative }
    }
}
