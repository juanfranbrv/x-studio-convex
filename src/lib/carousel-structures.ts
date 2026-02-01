import { PROBLEMA_SOLUCION_COMPOSITIONS } from './prompts/carousel/problema-solucion'
import { ANTES_DESPUES_COMPOSITIONS } from './prompts/carousel/antes-despues'
import { PASO_A_PASO_COMPOSITIONS } from './prompts/carousel/paso-a-paso'
import { LISTA_TIPS_COMPOSITIONS } from './prompts/carousel/lista-tips'
import { TOP_RANKING_COMPOSITIONS } from './prompts/carousel/top-ranking'
import { MITOS_VS_REALIDAD_COMPOSITIONS } from './prompts/carousel/mitos-vs-realidad'
import { ERRORES_COMUNES_COMPOSITIONS } from './prompts/carousel/errores-comunes'
import { FRAMEWORK_PAS_COMPOSITIONS } from './prompts/carousel/framework-pas'
import { COMPARATIVA_PRODUCTOS_COMPOSITIONS } from './prompts/carousel/comparativa-productos'
import { CRONOLOGIA_HISTORIA_COMPOSITIONS } from './prompts/carousel/cronologia-historia'
import { ESTUDIO_CASO_COMPOSITIONS } from './prompts/carousel/estudio-caso'
import { TUTORIAL_HOW_TO_COMPOSITIONS } from './prompts/carousel/tutorial-how-to'
import { CIFRAS_DATO_COMPOSITIONS } from './prompts/carousel/cifras-dato'
import { FRASE_CELEBRE_COMPOSITIONS } from './prompts/carousel/frase-celebre'
import { MEME_HUMOR_COMPOSITIONS } from './prompts/carousel/meme-humor'
import { PROMOCION_OFERTA_COMPOSITIONS } from './prompts/carousel/promocion-oferta'
import { CHECKLIST_DIAGNOSTICO_COMPOSITIONS } from './prompts/carousel/checklist-diagnostico'
import { PREGUNTAS_RESPUESTAS_COMPOSITIONS } from './prompts/carousel/preguntas-respuestas'

export interface CarouselComposition {
    id: string
    name: string
    description: string
    layoutPrompt: string
    iconPrompt: string
}

export interface NarrativeStructure {
    id: string
    name: string
    summary: string
    compositions: CarouselComposition[]
}

type NarrativeContext = {
    id: NarrativeStructure['id']
    name: string
    summary: string
    tension: string
    flow: string
    proof: string
    cta: string
}

const NARRATIVE_CONTEXTS: NarrativeContext[] = [
    { id: 'problema-solucion', name: 'Problem-Solution', summary: 'Expose a pain, then show the relief.', tension: 'pain vs remedy', flow: 'two-part reveal', proof: 'evidence of success', cta: 'try the fix' },
    { id: 'antes-despues', name: 'Before-After', summary: 'Contrast current state with desired state.', tension: 'before vs after', flow: 'contrast then uplift', proof: 'transformation metric', cta: 'move to the after' },
    { id: 'paso-a-paso', name: 'Step-by-Step', summary: 'Sequential guidance from start to finish.', tension: 'progression clarity', flow: 'ordered steps', proof: 'completion confidence', cta: 'start the sequence' },
    { id: 'lista-tips', name: 'Tips List', summary: 'Quick wins in a scannable list.', tension: 'problem and quick fixes', flow: 'bullet rhythm', proof: 'practicality', cta: 'apply a tip' },
    { id: 'top-ranking', name: 'Top / Ranking', summary: 'Ordered highlights from #1 downward.', tension: 'best vs rest', flow: 'descending importance', proof: 'rank criteria', cta: 'pick your top choice' },
    { id: 'mitos-vs-realidad', name: 'Myths vs Reality', summary: 'Debunk misconceptions with facts.', tension: 'myth vs fact', flow: 'paired contrast', proof: 'evidence links', cta: 'adopt the fact' },
    { id: 'errores-comunes', name: 'Common Mistakes', summary: 'Spot pitfalls and how to avoid them.', tension: 'mistake vs fix', flow: 'flag then correct', proof: 'avoidance benefit', cta: 'avoid the mistake' },
    { id: 'framework-pas', name: 'PAS Framework', summary: 'Problem–Agitation–Solution arc.', tension: 'pain amplified then solved', flow: 'P-A-S stages', proof: 'resolution', cta: 'apply PAS' },

    // Updated / Renamed Structures
    { id: 'comparativa-productos', name: 'Product Comparison', summary: 'Side-by-side alternatives.', tension: 'option A vs B', flow: 'parallel stacks', proof: 'criteria rows', cta: 'choose option' },
    { id: 'cronologia-historia', name: 'Timeline / History', summary: 'Storytelling through time.', tension: 'past vs present', flow: 'chronological arc', proof: 'milestones', cta: 'learn the history' },
    { id: 'estudio-caso', name: 'Case Study', summary: 'Story of a real result.', tension: 'challenge vs outcome', flow: 'context → action → result', proof: 'metrics', cta: 'replicate success' },
    { id: 'tutorial-how-to', name: 'Tutorial / How-To', summary: 'Practical hands-on guide.', tension: 'confusion vs skill', flow: 'instructional steps', proof: 'final outcome', cta: 'do it yourself' },
    { id: 'cifras-dato', name: 'Data / Stats', summary: 'Numbers-driven narrative.', tension: 'insight vs noise', flow: 'lead stat then context', proof: 'source cues', cta: 'use the insight' },
    { id: 'frase-celebre', name: 'Quote', summary: 'Inspirational or famous quote.', tension: 'thought vs action', flow: 'quote focus', proof: 'author authority', cta: 'share the quote' },
    { id: 'meme-humor', name: 'Meme / Humor', summary: 'Relatable humor and engagement.', tension: 'expectation vs reality', flow: 'punchline', proof: 'relatability', cta: 'laugh and share' },
    { id: 'promocion-oferta', name: 'Promotion / Offer', summary: 'Value proposition ending in action.', tension: 'value vs cost', flow: 'hook → proof → CTA', proof: 'benefit highlight', cta: 'claim the offer' },
    { id: 'checklist-diagnostico', name: 'Diagnostic Checklist', summary: 'Self-assessment with criteria.', tension: 'uncertainty vs clarity', flow: 'signals → score → outcome', proof: 'criteria match', cta: 'act on your result' },
    { id: 'preguntas-respuestas', name: 'Q&A', summary: 'Doubts resolved in Q and A.', tension: 'question → answer', proof: 'clear response', cta: 'ask or act' }
]

type TemplateBuilder = (ctx: NarrativeContext) => CarouselComposition

const withContextName = (base: string, ctx: NarrativeContext) => `${base} · ${ctx.name}`

// Explicit compositions map
function getCompositionsForStructure(ctx: NarrativeContext): CarouselComposition[] {
    switch (ctx.id) {
        case 'problema-solucion': return PROBLEMA_SOLUCION_COMPOSITIONS
        case 'antes-despues': return ANTES_DESPUES_COMPOSITIONS
        case 'paso-a-paso': return PASO_A_PASO_COMPOSITIONS
        case 'lista-tips': return LISTA_TIPS_COMPOSITIONS
        case 'top-ranking': return TOP_RANKING_COMPOSITIONS
        case 'mitos-vs-realidad': return MITOS_VS_REALIDAD_COMPOSITIONS
        case 'errores-comunes': return ERRORES_COMUNES_COMPOSITIONS
        case 'framework-pas': return FRAMEWORK_PAS_COMPOSITIONS
        case 'comparativa-productos': return COMPARATIVA_PRODUCTOS_COMPOSITIONS
        case 'cronologia-historia': return CRONOLOGIA_HISTORIA_COMPOSITIONS
        case 'estudio-caso': return ESTUDIO_CASO_COMPOSITIONS
        case 'tutorial-how-to': return TUTORIAL_HOW_TO_COMPOSITIONS
        case 'cifras-dato': return CIFRAS_DATO_COMPOSITIONS
        case 'frase-celebre': return FRASE_CELEBRE_COMPOSITIONS
        case 'meme-humor': return MEME_HUMOR_COMPOSITIONS
        case 'promocion-oferta': return PROMOCION_OFERTA_COMPOSITIONS
        case 'checklist-diagnostico': return CHECKLIST_DIAGNOSTICO_COMPOSITIONS
        case 'preguntas-respuestas': return PREGUNTAS_RESPUESTAS_COMPOSITIONS
        default: return []
    }
}

export const CAROUSEL_STRUCTURES: NarrativeStructure[] = NARRATIVE_CONTEXTS.map((ctx) => ({
    id: ctx.id,
    name: ctx.name,
    summary: ctx.summary,
    compositions: getCompositionsForStructure(ctx)
}))

export function getNarrativeStructure(id?: string): NarrativeStructure | undefined {
    if (!id) return undefined
    return CAROUSEL_STRUCTURES.find((structure) => structure.id === id)
}

export function getNarrativeComposition(structureId: string, compositionId: string): CarouselComposition | undefined {
    const structure = getNarrativeStructure(structureId)
    if (!structure) return undefined
    const direct = structure.compositions.find((comp) => comp.id === compositionId)
    if (direct) return direct
    const baseId = compositionId.includes('::') ? compositionId.split('::')[1] : compositionId
    return structure.compositions.find((comp) => comp.id.endsWith(`::${baseId}`))
}
