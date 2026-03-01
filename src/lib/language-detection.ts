import { log } from './logger'

/**
 * Detects the language of a text based on common words and patterns.
 * Supports: Spanish, English, French, German, Portuguese, Italian, Catalan.
 */
export function detectLanguage(text: string): string {
    if (!text || text.trim().length === 0) return 'es'

    const lowerText = text.toLowerCase()
    const normalizedText = lowerText.normalize('NFD').replace(/\p{M}+/gu, '')

    const patterns = {
        es: {
            common: ['el', 'la', 'de', 'que', 'y', 'en', 'los', 'las', 'del', 'para', 'con', 'por', 'una'],
            strong: ['quien', 'quienes', 'cual', 'cuales', 'porque', 'aqui', 'asi', 'tambien', 'mas', 'desde', 'hasta'],
        },
        en: {
            common: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'this', 'have', 'from', 'they'],
            strong: ['what', 'who', 'where', 'when', 'how'],
        },
        fr: {
            // Keep French "common" list focused on less ambiguous words.
            common: ['avec', 'dans', 'pour', 'sur', 'nous', 'vous', 'mais', 'donc', 'sans', 'chez'],
            strong: ['est', 'pas', 'tout', 'tres', 'etre', 'ainsi', 'alors'],
        },
        de: {
            common: ['der', 'die', 'das', 'und', 'den', 'des', 'dem', 'ein', 'eine', 'ist', 'sind', 'mit', 'auf', 'von', 'zu'],
            strong: ['nicht', 'werden', 'wurde', 'auch', 'fur'],
        },
        pt: {
            common: ['o', 'a', 'de', 'e', 'que', 'do', 'da', 'em', 'um', 'para', 'com', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'como'],
            strong: ['nao', 'porque'],
        },
        it: {
            common: ['il', 'di', 'e', 'la', 'che', 'per', 'un', 'in', 'del', 'le', 'da', 'con', 'una', 'dei', 'delle', 'alla', 'nel', 'sono'],
            strong: ['piu'],
        },
        ca: {
            common: ['el', 'la', 'de', 'i', 'que', 'en', 'els', 'les', 'del', 'per', 'amb', 'una', 'mes', 'com', 'son', 'esta'],
            // Includes Catalan + Valencian high-signal forms.
            strong: [
                'aixo', 'aquest', 'aquesta', 'aquests', 'aquestes', 'allo', 'acord',
                'tambe', 'perque', 'dons', 'doncs', 'fins', 'despres', 'avui',
                'hui', 'aci', 'eixe', 'eixa', 'xiquet', 'xiqueta', 'vosaltres', 'vostres',
                'nostre', 'nostra', 'seua', 'seues', 'llengua', 'servei', 'cal',
            ],
        },
    } as const

    const scores: Record<string, number> = {
        es: 0,
        en: 0,
        fr: 0,
        de: 0,
        pt: 0,
        it: 0,
        ca: 0,
    }

    const words = normalizedText.match(/[\p{L}\p{M}]+/gu) || []
    const wordCounts = new Map<string, number>()
    for (const word of words) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    }

    for (const [lang, groups] of Object.entries(patterns)) {
        for (const keyword of groups.common) {
            const count = wordCounts.get(keyword)
            if (count) scores[lang] += count
        }
        for (const keyword of groups.strong) {
            const count = wordCounts.get(keyword)
            if (count) scores[lang] += count * 3
        }
    }

    const countMatches = (source: string, regex: RegExp): number => (source.match(regex) || []).length

    const frenchMarkers = countMatches(lowerText, /\b(c'est|d'accord|qu'|l'|j'|n'|d'|s'|t'|je|tu|vous|nous)\b/g)
    const catalanMarkers = countMatches(
        normalizedText,
        /\b(aixo|aquest|aquesta|aquests|aquestes|allo|tambe|perque|doncs|fins|despres|avui|hui|aci|eixe|eixa|xiquet|xiqueta|vosaltres|vostres|seua|seues|llengua)\b/g
    )

    if (countMatches(lowerText, /\u00e7\u00e3o|\u00e7\u00f5es|\u00f5es/g) > 0) scores.pt += 3
    if (countMatches(lowerText, /[\u00e4\u00f6\u00fc\u00df]/g) > 0) scores.de += 3
    if (countMatches(lowerText, /[\u00bf\u00a1]/g) > 0) scores.es += 3
    if (countMatches(lowerText, /[\u00f1]/g) > 0) scores.es += 2

    if (countMatches(lowerText, /[\u00e0\u00e8\u00f2\u00ef\u00fc]/g) > 0 && countMatches(lowerText, /[\u00f1]/g) === 0) {
        scores.ca += 2
    }
    if (countMatches(lowerText, /[\u00e0\u00e2\u00e9\u00e8\u00ea\u00eb\u00ee\u00ef\u00f4\u00f9\u00fb\u00e7]/g) > 0) {
        scores.fr += 1
    }

    scores.fr += frenchMarkers * 3
    scores.ca += catalanMarkers * 3

    // Penalize false French positives in Valencian/Catalan texts.
    if (frenchMarkers === 0 && catalanMarkers >= 2) {
        scores.ca += 4
        scores.fr = Math.max(0, scores.fr - 3)
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const [firstLang, firstScore] = sorted[0] || ['es', 0]
    const [, secondScore] = sorted[1] || ['es', 0]

    let detectedLang = firstLang
    if (firstScore === secondScore && firstScore > 0) {
        if (scores.ca === firstScore) detectedLang = 'ca'
        else detectedLang = 'es'
    }

    if (detectedLang === 'fr' && scores.ca >= scores.fr - 1 && catalanMarkers > 0) {
        detectedLang = 'ca'
    }

    log.debug('FLOW', 'Deteccion de idioma', {
        idioma: detectedLang,
        puntuaciones: scores,
        marcadores_ca: catalanMarkers,
        marcadores_fr: frenchMarkers,
    })

    return detectedLang
}
