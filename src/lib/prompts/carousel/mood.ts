/**
 * Dynamic Mood Map for Carousel Slides
 * Maps slide number (1-indexed) to visual atmosphere instructions.
 */
export const MOOD_MAP: Record<number, string> = {
    1: "Ominous, heavy, dark shadows, overwhelming scale, oppressive atmosphere.",
    2: "High tension, sharp contrast, cold clinical lighting, sense of blockage.",
    3: "Neutral, professional, clean studio lighting, focused and sharp.",
    4: "Bright, airy, welcoming, warm professional tones, soft shadows.",
    5: "Optimistic, triumphant, golden hour lighting, high clarity, successful atmosphere."
}

export type MoodCurve = 'problem-solution' | 'educational' | 'showcase' | 'storytelling'

/**
 * Returns a visual mood description based on the slide position.
 * Uses the fixed MOOD_MAP for 1-5 slides, or calculates based on curve for different counts.
 */
export function getMoodForSlide(
    index: number, // 0-indexed
    totalSlides: number,
    role: 'hook' | 'content' | 'cta' = 'content',
    curve: MoodCurve = 'problem-solution'
): string {
    const slideNumber = index + 1 // Convert to 1-indexed for MOOD_MAP

    // If we have exactly 5 slides, use the fixed MOOD_MAP
    if (totalSlides === 5 && MOOD_MAP[slideNumber]) {
        return MOOD_MAP[slideNumber]
    }

    // For other slide counts, calculate based on narrative arc
    const progress = index / Math.max(1, totalSlides - 1) // 0 to 1

    if (curve === 'problem-solution') {
        if (progress <= 0.2) { // Hook / Problem (First 20%)
            return "Ominous, heavy, dark shadows, overwhelming scale, oppressive atmosphere."
        }
        if (progress <= 0.4) { // Agitation (20-40%)
            return "High tension, sharp contrast, cold clinical lighting, sense of blockage."
        }
        if (progress <= 0.6) { // Transition (40-60%)
            return "Neutral, professional, clean studio lighting, focused and sharp."
        }
        if (progress <= 0.8) { // Approaching Solution (60-80%)
            return "Bright, airy, welcoming, warm professional tones, soft shadows."
        }
        // CTA / Resolution (80-100%)
        return "Optimistic, triumphant, golden hour lighting, high clarity, successful atmosphere."
    }

    // Fallback for other curves
    if (curve === 'educational') {
        return "Clean, organized, neutral studio lighting, sharp focus, minimal distractions, professional atmosphere."
    }
    if (curve === 'showcase') {
        return "Luxurious, premium, golden hour or studio lighting, depth of field, focused on detail and texture."
    }

    // Default fallback
    return "Balanced, professional lighting, clear composition, on-brand atmosphere."
}
