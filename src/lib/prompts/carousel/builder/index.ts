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
    factsToPreserve?: string[]
    writingMode?: 'structure' | 'expand'
    brandVoice?: string
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
- **Writing Mode**: ${ctx.writingMode === 'structure' ? 'Structure user-provided content' : 'Expand and elevate sparse input'}

${ctx.brandVoice ? `## Brand Voice Instructions
${ctx.brandVoice}
` : ''}

${ctx.visualAnalysis ? `## Visual Reference (PRIMARY SOURCE OF TRUTH)
**Reference Image Analysis**:
${ctx.visualAnalysis}

**CRITICAL VISUAL DIRECTIVE**:
This analysis describes the exact visual aesthetic you must replicate for all slides.
- The "visualPrompt" field for each slide must describe a scene that matches this aesthetic.
- Copy the lighting, color tones, textures, and mood from this reference.
- Do not invent different aesthetics or unrelated scene descriptions.
- If in doubt about visual style, default to this analysis.

Example: If analysis says "soft studio lighting, muted earth tones, shallow depth of field, minimalist composition",
every slide's visualPrompt should describe scenes with those same attributes.
` : ''}

${ctx.factsToPreserve && ctx.factsToPreserve.length > 0 ? `## Concrete User Details To Integrate Naturally
These are concrete details provided by the user. Integrate them naturally into the slide copy and visual direction whenever they matter.
${ctx.factsToPreserve.map((fact) => `- ${fact}`).join('\n')}

Rules:
- Do not turn them into sterile labels, chips, or metadata.
- If the source content is list-like (requirements, benefits, levels, steps, reasons), transform it into editorial bullets or grouped points instead of flattening it into one paragraph.
- Preserve the user's meaning, but correct casing, punctuation, accents, and small writing mistakes when rephrasing.
- Never copy obvious spelling mistakes or malformed capitalization literally unless the user is providing an intentional quote.
- Do not generalize them into generic marketing filler.
- Do not replace them with invented alternatives.
- Weave them into title, description, and visualPrompt where they make narrative sense.
- Keep the exact meaning and practical intent of the user input.
- If the user supplied several concrete details, distribute them across the requested number of slides instead of dropping them.` : ''}

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
3. **Semantic Alignment**: The layout must reinforce the slide's specific message (e.g., use a "Bridge" layout for a transition slide).
4. **No Color Instructions in Layout**: Never include hex codes, color names, or palette directives inside composition/layout descriptions.

### Consistency Contract (Critical)
- All slides must share the same base layout, typography scale, and spacing system.
- Visual prompts must describe scenes that fit inside one consistent template.
- Do not introduce new layout patterns, type hierarchies, or background treatments.

# Instagram Carousel Copywriting Standard
- Think like a high-performing Instagram carousel writer, not like a generic summarizer.
- Slide 1 must act as a HOOK:
  it should stop the scroll, create curiosity, name the pain/opportunity, or frame the promise clearly.
- Middle slides must DEVELOP the message:
  each one should add one meaningful idea, proof point, reason, step, or consequence.
- The final slide must act as a CTA:
  it should close the narrative, resolve the arc, and ask for one clear action.
- Prioritize scannability, clarity, rhythm, and persuasive progression.
- Avoid vague filler. Each slide must earn its place.
- Titles should be punchy and social-friendly. Descriptions should add meaning, not repeat the title.
- When the user gives dense informational content, descriptions should create hierarchy instead of copying the block literally:
  use a short lead sentence plus bullets or grouped points when that improves scanability.
- When the user provided concrete content, preserve it and upgrade its presentation for Instagram instead of replacing it.
- If the buyer and the end user are different, speak to the real decision-maker.
- For educational, family, academy, health or service offers, optimize the narrative for the person who decides, pays, or books.
- Good hooks can be: a promise, a contrast, a sharp question, a useful insight, or an immediate payoff.
- Bad hooks are: flat summaries, obvious intros, or bureaucratic wording.
- The CTA should sound like a natural next step, not like a robotic footer.

# Short Example Of Desired Energy
User content:
"Curso de Arduino para chicos de 10+ años"

Good narrative direction:
- Slide 1 hook: speak to the parent and promise creation, curiosity, or future skills.
- Middle slide: explain what they will actually learn in concrete terms.
- Final slide: invite to reserve a place or ask for info with a clear verb.

This is the level of editorial instinct expected from the writer.

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
  - "visualPrompt": string (semantic scene description only: what should be shown and why for this slide, never colors, medium, camera, lighting or visual style)
  - "focus": string
- "suggestions": array with exactly 3 alternative packages, each containing:
  - "title": string
  - "subtitle": string
  - "detectedIntent": string
  - "hook": string
  - "structure": { "id": string, "name": string }
  - "caption": string
  - "slides": array following the same schema above

## Important
- **Strict JSON**: Return only valid JSON. No markdown code blocks like \`\`\`json.
- **Role Discipline**:
  - Slide 0 must feel like a real hook, not like a generic intro.
  - Final slide must feel like a real CTA, not like a weak summary.
  - Middle slides must feel like progression, not repetition.
- **Visuals**: Ensure "composition" matches the intended visual metaphor for that slide.
- **visualPrompt Language**: The "visualPrompt" field must be written in the exact same language as the user's request. Never default it to English unless the user wrote in English.
- **visualPrompt Scope**: The "visualPrompt" must define only the semantic content of the scene for that specific slide. It must not prescribe colors, palette, illustration vs photography, camera, lens, lighting, rendering technique, texture, or finish.
- **Conceptuality Over Literalism**: Visual prompts should stay conceptual-editorial. Suggest category-level contexts, not fake-specific facilities. Example: "entorno academico neutro" is valid; "recepcion moderna de la academia" is not unless the user explicitly provided that place.
- **Prop Hierarchy**: Supporting objects may appear, but they must not become the protagonist unless the slide is explicitly about that object or machine.
- **No Font Names in Copy**: Never include font family names (e.g., Google Sans Flex, Inter, Roboto) inside title/description/visualPrompt.
- **Brand Kit Fonts Are Mandatory**: If the Brand Kit defines heading/body fonts, treat them as the typography source of truth for the carousel. Respect those roles conceptually, but never write the font family names inside the JSON copy.
${ctx.includeLogo ? LOGO_PROTECTION_RULE : ''}
${BRAND_DNA_RULE}
${BRAND_COLORS_RULE}
${LANGUAGE_ENFORCEMENT_RULE}
${ctx.language ? `**IMPORTANT**: The detected language is "${ctx.language}". All content must be in this language.` : ''}
`
}
