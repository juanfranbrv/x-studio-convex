/**
 * Detects the language of a text based on common words and patterns
 * Supports: Spanish, English, French, German, Portuguese, Italian, Catalan
 */
export function detectLanguage(text: string): string {
    if (!text || text.trim().length === 0) return 'es'; // Default to Spanish

    const lowerText = text.toLowerCase();
    const normalizedText = lowerText.normalize('NFD').replace(/\p{M}+/gu, '');

    // Language-specific keywords.
    // NOTE: Keywords are stored without diacritics to match normalizedText.
    const patterns = {
        es: {
            common: ['el', 'la', 'de', 'que', 'y', 'en', 'los', 'las', 'del', 'para', 'con', 'por', 'una'],
            strong: ['quien', 'quienes', 'cual', 'cuales', 'cuanto', 'cuanta', 'cuantos', 'cuantas', 'porque', 'aqui', 'asi', 'tambien', 'mas']
        },
        en: {
            common: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'this', 'have', 'from', 'they', 'been', 'which'],
            strong: ['what', 'who', 'where', 'when', 'how']
        },
        fr: {
            common: ['le', 'la', 'de', 'et', 'les', 'des', 'un', 'une', 'dans', 'pour', 'que', 'qui', 'sur', 'avec', 'par', 'plus', 'ce', 'nous', 'vous'],
            strong: ['est', 'au', 'aux', 'pas', 'tout', 'tres', 'etre']
        },
        de: {
            common: ['der', 'die', 'das', 'und', 'den', 'des', 'dem', 'ein', 'eine', 'ist', 'sind', 'mit', 'auf', 'von', 'zu'],
            strong: ['nicht', 'werden', 'wurde', 'auch', 'fur']
        },
        pt: {
            common: ['o', 'a', 'de', 'e', 'que', 'do', 'da', 'em', 'um', 'para', 'com', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'como'],
            strong: ['nao', 'porque']
        },
        it: {
            common: ['il', 'di', 'e', 'la', 'che', 'per', 'un', 'in', 'del', 'le', 'da', 'con', 'una', 'dei', 'delle', 'alla', 'nel', 'sono'],
            strong: ['piu']
        },
        ca: {
            common: ['el', 'la', 'de', 'i', 'que', 'en', 'els', 'les', 'del', 'per', 'amb', 'una', 'aquest', 'aquesta', 'mes', 'com', 'son', 'esta'],
            strong: ['tambe', 'pero']
        }
    };

    // Count matches for each language
    const scores: Record<string, number> = {
        es: 0,
        en: 0,
        fr: 0,
        de: 0,
        pt: 0,
        it: 0,
        ca: 0
    };

    // Split text into words (Unicode-safe)
    const words = normalizedText.match(/[\p{L}\p{M}]+/gu) || [];
    const wordCounts = new Map<string, number>();
    for (const word of words) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }

    // Score each language based on common word matches (frequency-aware)
    for (const [lang, groups] of Object.entries(patterns)) {
        for (const keyword of groups.common) {
            const count = wordCounts.get(keyword);
            if (count) scores[lang] += count;
        }
        for (const keyword of groups.strong) {
            const count = wordCounts.get(keyword);
            if (count) scores[lang] += count * 2;
        }
    }

    // Additional heuristics
    // Portuguese specific: ção, ções, ões
    if (lowerText.match(/ção|ções|ões/g)) {
        scores.pt += 3;
    }

    // French specific: accents and specific patterns
    if (lowerText.match(/[àâéèêëîïôùûç]/g)) {
        scores.fr += 2;
    }

    // German specific: umlauts and ß
    if (lowerText.match(/[äöüß]/g)) {
        scores.de += 3;
    }

    // Catalan specific: à, è, ò, ï, ü (but not ñ)
    if (lowerText.match(/[àèòïü]/g) && !lowerText.match(/ñ/g)) {
        scores.ca += 2;
    }

    // Spanish specific: ñ
    if (lowerText.match(/ñ/g)) {
        scores.es += 2;
    }

    // Spanish-specific punctuation and accents
    if (lowerText.match(/[¿¡]/g)) {
        scores.es += 3;
    }

    if (lowerText.match(/[áéíóúü]/g)) {
        scores.es += 1;
    }

    // Additional distinctive patterns (short-text friendly)
    if (lowerText.match(/\bl[']\w+/g)) scores.fr += 2;
    if (lowerText.match(/\b(c'est|d'accord|qu'|l'|j')/g)) scores.fr += 2;
    if (lowerText.match(/\b(der|die|das)\b/g)) scores.de += 1;
    if (lowerText.match(/\b(nicht|aber|wenn|dass)\b/g)) scores.de += 2;
    if (lowerText.match(/\b(che|per|anche|non|una)\b/g)) scores.it += 1;
    if (lowerText.match(/\b(nao|porque|tambem)\b/g)) scores.pt += 2;
    if (lowerText.match(/\b(pero|tambien|quien|cual|porque)\b/g)) scores.es += 1;
    if (lowerText.match(/\b(aquest|aquesta|tambe|perque)\b/g)) scores.ca += 2;

    // Find the language with highest score (tie-breaker: es)
    let maxScore = 0;
    let detectedLang = 'es';
    let secondScore = 0;

    for (const [lang, score] of Object.entries(scores)) {
        if (score > maxScore) {
            secondScore = maxScore;
            maxScore = score;
            detectedLang = lang;
        } else if (score > secondScore) {
            secondScore = score;
        }
    }

    if (maxScore === secondScore && maxScore > 0) {
        detectedLang = 'es';
    }

    console.log(`🌐 Language detection scores:`, scores);
    console.log(`✅ Detected language: ${detectedLang}`);

    return detectedLang;
}
