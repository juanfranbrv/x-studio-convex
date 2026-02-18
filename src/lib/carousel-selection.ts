export type CarouselCompositionLite = {
    id: string
    name: string
    description: string
    layoutPrompt: string
    mode?: 'basic' | 'advanced'
}

function hashSeed(seed: string): number {
    let hash = 0
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
    }
    return hash
}

function normalizeForMatch(value: string): string {
    return (value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
}

function scoreBaseId(baseId: string, prompt: string, slideCount: number): number {
    const text = normalizeForMatch(prompt)
    const words = new Set(text.split(/[^a-z0-9]+/g).filter(Boolean))
    let score = 0

    const hasAny = (...tokens: string[]) => tokens.some((token) => words.has(token) || text.includes(token))

    if (hasAny('paso', 'pasos', 'proceso', 'guia', 'tutorial', 'metodo', 'roadmap', 'timeline')) {
        if (['basic-ribbon-s', 'basic-timeline-ribbon', 'basic-z-path', 'basic-z-scan', 'basic-f-scan'].includes(baseId)) score += 5
    }
    if (hasAny('comparativa', 'versus', 'vs', 'opcion', 'opciones', 'antes', 'despues', 'mejor')) {
        if (['basic-split-stage', 'basic-twin-cards', 'basic-offset-quadrants', 'basic-modular-grid'].includes(baseId)) score += 5
    }
    if (hasAny('dato', 'datos', 'estadistica', 'estadisticas', 'metricas', 'numeros', 'ranking')) {
        if (['basic-modular-grid', 'basic-tercios-grid', 'basic-pillar-rhythm', 'basic-window-strips'].includes(baseId)) score += 5
    }
    if (hasAny('oferta', 'promo', 'promocion', 'inscribete', 'reserva', 'cta', 'comprar', 'apuntate')) {
        if (['basic-cta-stage', 'basic-arc-stage', 'basic-window-strips', 'basic-crosshair-focus'].includes(baseId)) score += 5
    }
    if (hasAny('problema', 'dolor', 'error', 'reto', 'riesgo', 'alerta', 'urgente')) {
        if (['basic-diagonal-pulse', 'basic-golden-triangle', 'basic-leading-lines', 'basic-crosshair-focus'].includes(baseId)) score += 5
    }
    if (hasAny('marca', 'vision', 'historia', 'manifesto', 'inspiracion', 'valores')) {
        if (['basic-orbit-hook', 'basic-golden-spiral', 'basic-frame-focus', 'basic-radial-hub'].includes(baseId)) score += 4
    }

    if (slideCount <= 3 && ['basic-split-stage', 'basic-tercios-grid', 'basic-crosshair-focus', 'basic-negative-chamber'].includes(baseId)) {
        score += 2
    }
    if (slideCount >= 8 && ['basic-ribbon-s', 'basic-window-strips', 'basic-timeline-ribbon', 'basic-f-scan', 'basic-z-scan'].includes(baseId)) {
        score += 2
    }

    return score
}

export function getAutomaticBasicComposition(
    compositions: CarouselCompositionLite[],
    seed: string,
    context?: { prompt?: string; slideCount?: number }
): CarouselCompositionLite | undefined {
    if (!compositions.length) return undefined
    const basics = compositions.filter((comp) => comp.mode === 'basic')
    const pool = basics.length > 0 ? basics : compositions

    const rawSeed = seed || 'carousel'
    const parsedPrompt = context?.prompt ?? rawSeed.split('|')[1] ?? ''
    const parsedSlideCount = context?.slideCount ?? (Number(rawSeed.split('|')[2] || 0) || 5)

    const ranked = pool
        .map((comp) => {
            const baseId = comp.id.includes('::') ? comp.id.split('::')[1] : comp.id
            return { comp, score: scoreBaseId(baseId, parsedPrompt, parsedSlideCount) }
        })
        .sort((a, b) => b.score - a.score)

    const topScore = ranked[0]?.score ?? 0
    const tied = ranked.filter((entry) => entry.score === topScore)
    if (tied.length === 1) return tied[0].comp

    const tieIndex = hashSeed(rawSeed) % tied.length
    return tied[tieIndex].comp
}
