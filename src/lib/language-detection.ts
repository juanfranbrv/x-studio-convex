/**
 * Detects the language of a text based on common words and patterns
 * Supports: Spanish, English, French, German, Portuguese, Italian, Catalan
 */
export function detectLanguage(text: string): string {
    if (!text || text.trim().length === 0) return 'es'; // Default to Spanish

    const lowerText = text.toLowerCase();

    // Language-specific common words (most distinctive ones)
    const patterns = {
        es: ['el', 'la', 'de', 'que', 'y', 'en', 'los', 'las', 'del', 'para', 'con', 'por', 'una', 'este', 'sobre', 'más', 'como', 'pero', 'sus', 'también'],
        en: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'this', 'have', 'from', 'they', 'been', 'which'],
        fr: ['le', 'la', 'de', 'et', 'les', 'des', 'un', 'une', 'dans', 'pour', 'que', 'qui', 'sur', 'avec', 'par', 'plus', 'ce', 'sont', 'nous', 'vous'],
        de: ['der', 'die', 'das', 'und', 'den', 'des', 'dem', 'ein', 'eine', 'ist', 'sind', 'mit', 'für', 'auf', 'von', 'zu', 'auch', 'nicht', 'werden', 'wurde'],
        pt: ['o', 'a', 'de', 'e', 'que', 'do', 'da', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'como'],
        it: ['il', 'di', 'e', 'la', 'che', 'per', 'un', 'in', 'del', 'le', 'da', 'con', 'una', 'dei', 'delle', 'alla', 'nel', 'sono', 'più', 'come'],
        ca: ['el', 'la', 'de', 'i', 'que', 'en', 'els', 'les', 'del', 'per', 'amb', 'una', 'aquest', 'aquesta', 'més', 'com', 'però', 'també', 'són', 'està']
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

    // Split text into words
    const words = lowerText.match(/\b\w+\b/g) || [];
    const wordSet = new Set(words);

    // Score each language based on common word matches
    for (const [lang, keywords] of Object.entries(patterns)) {
        keywords.forEach(keyword => {
            if (wordSet.has(keyword)) {
                scores[lang]++;
            }
        });
    }

    // Additional heuristics
    // Portuguese specific: ção, ões
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

    // Find the language with highest score
    let maxScore = 0;
    let detectedLang = 'es';

    for (const [lang, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            detectedLang = lang;
        }
    }

    console.log(`🌐 Language detection scores:`, scores);
    console.log(`✅ Detected language: ${detectedLang}`);

    return detectedLang;
}
