import { normalizeLocale } from '@/locales/config'

type Locale = string

const BASIC_TEMPLATE_NAME_EN: Record<string, string> = {
    'basic-orbit-hook': 'Orbit Focus',
    'basic-split-stage': 'Split Stage',
    'basic-card-core': 'Card Core',
    'basic-z-path': 'Z Path',
    'basic-modular-grid': 'Modular Grid',
    'basic-pillar-rhythm': 'Column Rhythm',
    'basic-diagonal-pulse': 'Diagonal Pulse',
    'basic-timeline-ribbon': 'Timeline Ribbon',
    'basic-frame-focus': 'Focus Frame',
    'basic-cta-stage': 'CTA Stage',
    'basic-tercios-grid': 'Active Thirds',
    'basic-golden-spiral': 'Guiding Spiral',
    'basic-u-frame': 'U Frame',
    'basic-golden-triangle': 'Guiding Triangle',
    'basic-negative-chamber': 'Negative Chamber',
    'basic-symmetric-core': 'Symmetric Core',
    'basic-f-scan': 'F Scan',
    'basic-z-scan': 'Z Scan',
    'basic-odd-cluster': 'Odd Cluster',
    'basic-leading-lines': 'Leading Lines',
    'basic-radial-hub': 'Radial Hub',
    'basic-vanishing-run': 'Central Vanishing Point',
    'basic-pyramid-stack': 'Modular Pyramid',
    'basic-layered-depth': 'Layered Depth',
    'basic-twin-cards': 'Twin Cards',
    'basic-crosshair-focus': 'Crosshair Focus',
    'basic-ribbon-s': 'S Ribbon',
    'basic-arc-stage': 'Arc Stage',
    'basic-window-strips': 'Strip Windows',
    'basic-offset-quadrants': 'Offset Quadrants',
}

const BASIC_TEMPLATE_DESCRIPTION_EN: Record<string, string> = {
    'basic-orbit-hook': 'Clear focal point with clean text areas.',
    'basic-split-stage': 'Text-and-visual balance with instant readability.',
    'basic-card-core': 'Solid central card for dense messages.',
    'basic-z-path': 'Guided visual path for storytelling.',
    'basic-modular-grid': 'Robust multi-block structure.',
    'basic-pillar-rhythm': 'Clean vertical cadence for sequential ideas.',
    'basic-diagonal-pulse': 'Controlled tension for high-energy messages.',
    'basic-timeline-ribbon': 'Ideal for progress, processes, and steps.',
    'basic-frame-focus': 'Emphasizes one main idea with breathing room.',
    'basic-cta-stage': 'Composition focused on closing and action.',
    'basic-tercios-grid': 'Rule-of-thirds grid with a clear journey.',
    'basic-golden-spiral': 'Progressive flow toward the main focal point.',
    'basic-u-frame': 'Perimeter container with a strong central focus.',
    'basic-golden-triangle': 'Diagonal tension with clear hierarchy.',
    'basic-negative-chamber': 'Lots of air for high-impact headlines.',
    'basic-symmetric-core': 'Axial order with instant readability.',
    'basic-f-scan': 'Hierarchy designed for block-by-block reading.',
    'basic-z-scan': 'Natural left-to-right reading path.',
    'basic-odd-cluster': '3-5 node grouping with a central focal point.',
    'basic-leading-lines': 'Visual direction toward one key point.',
    'basic-radial-hub': 'Magnetic center with orbiting support areas.',
    'basic-vanishing-run': 'Structural depth with a vanishing axis.',
    'basic-pyramid-stack': 'Stable hierarchy across three levels.',
    'basic-layered-depth': 'Three depth planes for staged storytelling.',
    'basic-twin-cards': 'Clean comparison with two modules.',
    'basic-crosshair-focus': 'Strong focal point with crossing guides.',
    'basic-ribbon-s': 'Sinuous flow for sequential stories.',
    'basic-arc-stage': 'Curved stage with a closing base.',
    'basic-window-strips': 'Strip-based reading with segmented visuals.',
    'basic-offset-quadrants': 'Offset blocks with asymmetrical balance.',
}

const STRUCTURE_NAME_EN: Record<string, string> = {
    'problema-solucion': 'Problem-Solution',
    'antes-despues': 'Before-After',
    'paso-a-paso': 'Step-by-Step',
    'lista-tips': 'Tips List',
    'top-ranking': 'Top / Ranking',
    'mitos-vs-realidad': 'Myths vs Reality',
    'errores-comunes': 'Common Mistakes',
    'framework-pas': 'PAS Framework',
    'comparativa-productos': 'Product Comparison',
    'cronologia-historia': 'Timeline / History',
    'estudio-caso': 'Case Study',
    'tutorial-how-to': 'Tutorial / How-To',
    'cifras-dato': 'Data / Stats',
    'frase-celebre': 'Quote',
    'meme-humor': 'Meme / Humor',
    'promocion-oferta': 'Promotion / Offer',
    'checklist-diagnostico': 'Diagnostic Checklist',
    'preguntas-respuestas': 'Q&A',
    'comunicado-operativo': 'Operational Notice',
}

const STRUCTURE_SUMMARY_EN: Record<string, string> = {
    'problema-solucion': 'Expose a pain, then show the relief.',
    'antes-despues': 'Contrast the current state with the desired state.',
    'paso-a-paso': 'Sequential guidance from start to finish.',
    'lista-tips': 'Quick wins in a scannable list.',
    'top-ranking': 'Ordered highlights from #1 downward.',
    'mitos-vs-realidad': 'Debunk misconceptions with facts.',
    'errores-comunes': 'Spot pitfalls and how to avoid them.',
    'framework-pas': 'Problem-Agitation-Solution arc.',
    'comparativa-productos': 'Side-by-side alternatives.',
    'cronologia-historia': 'Storytelling through time.',
    'estudio-caso': 'Story of a real result.',
    'tutorial-how-to': 'Practical hands-on guide.',
    'cifras-dato': 'Numbers-driven narrative.',
    'frase-celebre': 'Inspirational or famous quote.',
    'meme-humor': 'Relatable humor and engagement.',
    'promocion-oferta': 'Value proposition ending in action.',
    'checklist-diagnostico': 'Self-assessment with criteria.',
    'preguntas-respuestas': 'Doubts resolved in Q&A format.',
    'comunicado-operativo': 'Clear operational updates and changes.',
}

function repairMojibake(value: string): string {
    if (!value) return value
    if (!/[\u00C3\u00C2\u00E2]/.test(value)) return value

    try {
        return decodeURIComponent(escape(value))
    } catch {
        return value
            .replace(/\u00C3\u00A1/g, 'á')
            .replace(/\u00C3\u00A9/g, 'é')
            .replace(/\u00C3\u00AD/g, 'í')
            .replace(/\u00C3\u00B3/g, 'ó')
            .replace(/\u00C3\u00BA/g, 'ú')
            .replace(/\u00C3\u00B1/g, 'ñ')
            .replace(/\u00C3\u0081/g, 'Á')
            .replace(/\u00C3\u0089/g, 'É')
            .replace(/\u00C3\u008D/g, 'Í')
            .replace(/\u00C3\u201C/g, 'Ó')
            .replace(/\u00C3\u0160/g, 'Ú')
            .replace(/\u00C3\u2018/g, 'Ñ')
            .replace(/\u00E2\u20AC\u201C/g, '–')
            .replace(/\u00E2\u2020\u2019/g, '→')
            .replace(/\u00C2\u00B7/g, '·')
    }
}

function firstSentence(text?: string): string {
    const safe = repairMojibake(text || '').trim()
    if (!safe) return ''
    const [sentence] = safe.split(/(?<=[.!?])\s+/)
    return sentence.trim()
}

function looksSpanish(value: string): boolean {
    return /\b(la|el|los|las|de|para|con|sin|pasos|guia|guía|mejor|adaptación|adaptacion|progreso|lectura|historia|comparación|comparacion|mensaje|mensajes|foco|claro|clara|ideal|flujo|estructura|aire|acción|accion|bloques|tarjeta|ruta|ritmo|columna|columnas|marco|cierre)\b/i.test(
        repairMojibake(value).toLowerCase()
    )
}

export function localizeCarouselStructureName(id: string, fallback: string, locale: Locale): string {
    const normalized = normalizeLocale(locale)
    const safeFallback = repairMojibake(fallback)
    if (normalized === 'en-US') return STRUCTURE_NAME_EN[id] || safeFallback
    return safeFallback
}

export function localizeCarouselStructureSummary(id: string, fallback: string, locale: Locale): string {
    const normalized = normalizeLocale(locale)
    const safeFallback = repairMojibake(fallback)
    if (normalized === 'en-US') return STRUCTURE_SUMMARY_EN[id] || safeFallback
    return safeFallback
}

export function localizeCarouselCompositionName(id: string, fallback: string, locale: Locale): string {
    const normalized = normalizeLocale(locale)
    const safeFallback = repairMojibake(fallback)
    if (normalized !== 'en-US') return safeFallback

    if (id.endsWith('::free')) return 'Open (AI)'

    const baseId = id.includes('::') ? id.split('::')[1] : id
    return BASIC_TEMPLATE_NAME_EN[baseId] || safeFallback
}

export function localizeCarouselCompositionDescription(
    id: string,
    fallback: string,
    layoutPrompt: string | undefined,
    locale: Locale
): string {
    const normalized = normalizeLocale(locale)
    const safeFallback = repairMojibake(fallback)
    if (normalized !== 'en-US') return safeFallback

    if (id.endsWith('::free')) return 'AI chooses the best adaptation.'

    const baseId = id.includes('::') ? id.split('::')[1] : id
    if (BASIC_TEMPLATE_DESCRIPTION_EN[baseId]) {
        return BASIC_TEMPLATE_DESCRIPTION_EN[baseId]
    }

    if (!safeFallback || looksSpanish(safeFallback)) {
        const promptSentence = firstSentence(layoutPrompt)
        if (promptSentence) return promptSentence
    }

    return safeFallback
}
