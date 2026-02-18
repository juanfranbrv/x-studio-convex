
import { NarrativeStructure, CarouselComposition } from "@/lib/carousel-structures"
import { CAROUSEL_GENERATOR_ROLE } from "./roles"
import { LOGO_PROTECTION_RULE, LANGUAGE_ENFORCEMENT_RULE, BRAND_DNA_RULE, BRAND_COLORS_RULE } from "./rules"

export interface CarouselPromptContext {
    brandName: string
    brandTone: string
    brandColors?: string[]
    targetAudience: string
    intent: string
    format?: string
    slidesCount?: number
    visualAnalysis?: string
    includeLogo?: boolean
    language?: string
}

export function buildCarouselPrompt(
    ctx: CarouselPromptContext,
    narrative: NarrativeStructure,
    composition: CarouselComposition
): string {
    const colorList = ctx.brandColors?.join(', ') || 'Use brand colors'

    return `
${CAROUSEL_GENERATOR_ROLE}

# Context
## Brand Profile
- **Brand**: ${ctx.brandName}
- **Tone**: ${ctx.brandTone}
- **Audience**: ${ctx.targetAudience}
${ctx.brandColors ? `- **Brand Colors**: ${colorList}` : ''}

## Request Overview
- **Intent**: ${ctx.intent}
- **Format**: ${ctx.format || "Standard Carousel"}
- **Target Slides**: ${ctx.slidesCount || 8 - 10}

${ctx.visualAnalysis ? `## Visual Reference (PRIMARY SOURCE OF TRUTH)
**Reference Image Analysis**:
${ctx.visualAnalysis}

⚠️ **CRITICAL VISUAL DIRECTIVE**:
This analysis describes the EXACT visual aesthetic you MUST replicate for ALL slides.
- The "visualPrompt" field for EACH slide MUST describe a scene that MATCHES this aesthetic
- Copy the lighting, color tones, textures, and mood from this reference
- Do NOT invent different aesthetics or unrelated scene descriptions
- If in doubt about visual style, DEFAULT TO THIS ANALYSIS

Example: If analysis says "soft studio lighting, muted earth tones, shallow depth of field, minimalist composition", 
every slide's visualPrompt should describe scenes WITH those same attributes.
` : ''}

# Narrative Framework
## Strategy: ${narrative.name}
${narrative.summary}
**Objective**: Use the "${narrative.id}" structure to guide the user through a logical emotional journey.

# Visual & Composition Rules
## Selected Layout Style: ${composition.name}
**Visual Metaphor**: ${composition.description}
**Composition ID**: "${composition.id}"

### Design Guidelines
1. **Architecture First**: Define only grid, zones, anchors, hierarchy and spacing rhythm.
2. **Abstract & Geometric**: Avoid scene-level art direction in composition fields; focus on structure.
3. **Semantic Alignment**: The layout MUST reinforce the slide's specific message (e.g., use a "Bridge" layout for a transition slide).
4. **No Color Instructions in Layout**: Never include hex codes, color names, or palette directives inside composition/layout descriptions.

### Consistency Contract (Critical)
- All slides must share the SAME base layout, typography scale, and spacing system.
- Visual prompts must describe scenes that fit inside ONE consistent template.
- Do not introduce new layout patterns, type hierarchies, or background treatments.

# Task
Generate a JSON object representing the carousel slides.

## JSON Output Structure
The output must be a single JSON object with:
- "detectedIntent": string
- "hook": string
- "structure": { "id": string, "name": string }
- "caption": string
- "optimalSlideCount": number
- "slides": array of objects with:
  - "index": number (0-based)
  - "role": "hook" | "content" | "cta"
  - "title": string
  - "description": string
  - "composition": string (layout blueprint only, no colors or typography)
  - "visualPrompt": string (scene description aligned with the Visual Reference)
  - "focus": string
- "suggestions": array with EXACTLY 3 alternative packages, each containing:
  - "title": string
  - "subtitle": string
  - "detectedIntent": string
  - "hook": string
  - "structure": { "id": string, "name": string }
  - "caption": string
  - "slides": array following the same schema above

## Important
- **Strict JSON**: Return ONLY valid JSON. No markdown code blocks like \`\`\`json.
- **Visuals**: Ensure "composition" matches the intended visual metaphor for that slide.
- **No Font Names in Copy**: Never include font family names (e.g., Google Sans Flex, Inter, Roboto) inside title/description/visualPrompt.
${ctx.includeLogo ? LOGO_PROTECTION_RULE : ''}
${BRAND_DNA_RULE}
${BRAND_COLORS_RULE}
${LANGUAGE_ENFORCEMENT_RULE}
${ctx.language ? `**IMPORTANT**: The detected language is "${ctx.language}". All content MUST be in this language.` : ''}
`
}
