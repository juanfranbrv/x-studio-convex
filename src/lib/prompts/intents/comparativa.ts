/**
 * COMPARATIVA - La Comparativa (Antes/Después o Vs)
 * Grupo: Informar
 * 
 * Diseño partido para enfrentar dos conceptos: Antes/Después, 
 * Mito/Realidad o Producto A/B.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const COMPARATIVA_EXTENDED_DESCRIPTION = `
Diseño partido (split screen) para enfrentar dos conceptos: Antes/Después, 
Mito/Realidad o Producto A/B. Muy efectivo para educar o mostrar resultados 
tangibles.
`.trim()

export const COMPARATIVA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'item_a',
        label: 'Elemento A',
        placeholder: 'Ej: Antes',
        type: 'text',
        required: true,
        aiContext: 'First item of comparison/Left side'
    },
    {
        id: 'item_b',
        label: 'Elemento B',
        placeholder: 'Ej: Después',
        type: 'text',
        required: true,
        aiContext: 'Second item of comparison/Right side'
    },
    {
        id: 'topic',
        label: 'Tema',
        placeholder: 'Ej: Resultados del tratamiento',
        type: 'text',
        required: false,
        aiContext: 'Subject of the comparison'
    }
]

// 1. DIVIDIDO - Classic Vertical Split
export const COMPARATIVA_DIVIDIDO_PROMPT = `
# Classic Vertical Split Screen

## Visual Hierarchy
- **Primary:** 50/50 vertical split between two states or options
- **Secondary:** Distinct visual separator line down the center
- **Tertiary:** Minimal labels ("Before"/"After") at top of each side

## Zoning Guide
- **Zone Left:** 50% "Before" or "Problem" state (can be desaturated)
- **Zone Right:** 50% "After" or "Solution" state (vibrant, resolved)
- **Divider:** Clear vertical separator line

## Style Modifiers
- **Texture:** High contrast between the two states
- **Lighting:** Different mood lighting per side to emphasize change
- **Palette:** Desaturated vs vibrant, chaos vs order

## Negative Constraints
- **Avoid:** Unclear division, similar appearance on both sides
`.trim()

// 2. VERSUS - Battle Layout
export const COMPARATIVA_VERSUS_PROMPT = `
# Aggressive Versus Battle

## Visual Hierarchy
- **Primary:** Dynamic diagonal split separating two contenders
- **Secondary:** Large "VS" badge or lightning bolt at center intersection
- **Tertiary:** Contender names or labels on each side

## Zoning Guide
- **Zone Left:** Contender A with one color theme (cool tones)
- **Zone Right:** Contender B with opposing color (warm tones)
- **Zone Center:** Explosive "VS" typography element

## Style Modifiers
- **Texture:** Sports, gaming, high energy competition
- **Lighting:** Clashing colored rim lights (Blue vs Red)
- **Palette:** High contrast complementary colors

## Negative Constraints
- **Avoid:** Peaceful static layout, monochrome, equal treatment
`.trim()

// 3. TRANSFORMACIÓN - Before/After Hero
export const COMPARATIVA_TRANSFORMACION_PROMPT = `
# Transformation Showcase

## Visual Hierarchy
- **Primary:** Large "After" result image as main hero
- **Secondary:** Small "Before" snapshot inset in corner with frame
- **Tertiary:** Curved arrow pointing from before to after

## Zoning Guide
- **Zone Main:** Full canvas showing impressive result
- **Zone Inset:** Small corner showing starting point
- **Zone Arrow:** Visual connector between states

## Style Modifiers
- **Texture:** Testimonial, proof-of-concept, realistic results
- **Lighting:** Professional lighting on the result
- **Palette:** Aspirational, impressive, achievement-focused

## Negative Constraints
- **Avoid:** Equal sizing, no clear improvement visible
`.trim()

// 4. CHECKLIST - Feature Grid
export const COMPARATIVA_CHECKLIST_PROMPT = `
# Side-by-Side Feature Comparison

## Visual Hierarchy
- **Primary:** Two columns: Option A vs Option B
- **Secondary:** Rows with checkmarks (green) vs X marks (red) per feature
- **Tertiary:** Product/option names as headers

## Zoning Guide
- **Headers:** Option headers at top of each column
- **Features:** Feature rows spanning both columns
- **Marks:** Check/X indicators in each cell

## Style Modifiers
- **Texture:** Review site, comparison table, informational
- **Lighting:** Even, readable, no drama
- **Palette:** Green for yes, red for no, neutral base

## Negative Constraints
- **Avoid:** Ambiguous marks, unclear winner, crowded rows
`.trim()

// 5. SLIDER - Interactive Reveal
export const COMPARATIVA_SLIDER_PROMPT = `
# Interactive Slider Comparison

## Visual Hierarchy
- **Primary:** Full-width image split in the middle
- **Secondary:** Slider handle graphic suggesting drag interaction
- **Tertiary:** Two states of the same subject blending at slider

## Zoning Guide
- **Zone Left:** One state visible on left of slider
- **Zone Right:** Alternate state visible on right of slider
- **Handle:** Draggable slider indicator at center

## Style Modifiers
- **Texture:** UI/UX demo, interactive feel, app interface
- **Lighting:** Consistent across both sides for fair comparison
- **Palette:** Same subject, different treatments

## Negative Constraints
- **Avoid:** Static non-interactive feel, missing slider UI element
`.trim()

// 6. EVOLUCIÓN - Timeline Progress
export const COMPARATIVA_EVOLUCION_PROMPT = `
# Evolution Timeline

## Visual Hierarchy
- **Primary:** Horizontal progression from old to new (left to right)
- **Secondary:** Connecting arrow or timeline bar running through
- **Tertiary:** Year labels or version numbers at each stage

## Zoning Guide
- **Zone Start:** Old/original version on left
- **Zone Middle:** Transition states (optional)
- **Zone End:** New/current version on right

## Style Modifiers
- **Texture:** Growth story, history, progress documentation
- **Lighting:** Consistent across timeline for fair comparison
- **Palette:** Progressive improvement in quality/vibrancy

## Negative Constraints
- **Avoid:** Unclear timeline direction, random ordering
`.trim()

// 7. MITO_REALIDAD - Myth vs Reality
export const COMPARATIVA_MITO_PROMPT = `
# Myth vs Reality Debunk

## Visual Hierarchy
- **Primary:** Split showing "MYTH" crossed out vs "REALITY" highlighted
- **Secondary:** X mark over myth, checkmark on reality
- **Tertiary:** Brief text explaining each side

## Zoning Guide
- **Zone Myth:** Left/top with red X and struck-through text
- **Zone Reality:** Right/bottom with green check and validated text
- **Education:** Brief explanatory text for each

## Style Modifiers
- **Texture:** Educational, fact-checking, debunking aesthetic
- **Lighting:** Dramatic contrast between wrong and right
- **Palette:** Red for myth (wrong), green for reality (correct)

## Negative Constraints
- **Avoid:** Unclear which is correct, missing verdict indicators
`.trim()

// 8. EXPECTATIVA - Expectation vs Reality
export const COMPARATIVA_EXPECTATIVA_PROMPT = `
# Expectation vs Reality Humor

## Visual Hierarchy
- **Primary:** Split showing idealized "Expectation" vs honest "Reality"
- **Secondary:** "What I imagined" vs "What happened" labels
- **Tertiary:** Humorous contrast between the two states

## Zoning Guide
- **Zone Expectation:** Polished, perfect, idealized vision
- **Zone Reality:** Honest, funny, real-life outcome
- **Labels:** Clear labels for each side

## Style Modifiers
- **Texture:** Meme format, relatable humor, social media native
- **Lighting:** Perfect lighting on expectation, real on reality
- **Palette:** Dreamy for expectation, realistic for reality

## Negative Constraints
- **Avoid:** Both looking similar, missing humor, unclear contrast
`.trim()

// 9. PRECIO - Price Comparison
export const COMPARATIVA_PRECIO_PROMPT = `
# Price Tier Comparison

## Visual Hierarchy
- **Primary:** 2-3 pricing columns/cards showing different tiers
- **Secondary:** Feature lists in each tier
- **Tertiary:** Highlighted "Best Value" or recommended option

## Zoning Guide
- **Zone Basic:** Entry-level tier with basic features
- **Zone Recommended:** Middle or premium tier highlighted
- **Zone Premium:** Top tier with all features

## Style Modifiers
- **Texture:** SaaS pricing page, subscription comparison
- **Lighting:** Spotlight on recommended option
- **Palette:** Highlight color on best value, neutral on others

## Negative Constraints
- **Avoid:** Unclear pricing, hard to compare features, no recommendation
`.trim()

// 10. HORIZONTAL - Top/Bottom Split
export const COMPARATIVA_HORIZONTAL_PROMPT = `
# Horizontal Split Comparison

## Visual Hierarchy
- **Primary:** Top half showing one state, bottom half showing the other
- **Secondary:** Horizontal divider line between states
- **Tertiary:** Labels identifying each section

## Zoning Guide
- **Zone Top:** 50% for first comparison element
- **Zone Bottom:** 50% for second comparison element
- **Divider:** Horizontal separator

## Style Modifiers
- **Texture:** Before/after, option comparison, clean layout
- **Lighting:** Consistent across both halves
- **Palette:** Contrasting treatments to show difference

## Negative Constraints
- **Avoid:** Vertical confusion, unequal zone sizes, unclear comparison
`.trim()

// 11. ZOOM - Detail Comparison
export const COMPARATIVA_ZOOM_PROMPT = `
# Zoomed Detail Comparison

## Visual Hierarchy
- **Primary:** Two magnified detail shots side by side
- **Secondary:** Magnifying glass or zoom UI elements
- **Tertiary:** Labels identifying what's being compared

## Zoning Guide
- **Zone Detail A:** Zoomed view of option A
- **Zone Detail B:** Zoomed view of option B
- **Context:** Optional context showing full items

## Style Modifiers
- **Texture:** Quality comparison, texture detail, macro focus
- **Lighting:** Clinical, revealing, honest lighting
- **Palette:** Neutral to not bias either option

## Negative Constraints
- **Avoid:** Low resolution, different zoom levels, biased framing
`.trim()

// 12. FUSIÓN - Intersection/Hybrid (NEW)
export const COMPARATIVA_FUSION_PROMPT = `
# Fusion Intersection

## Visual Hierarchy
- **Primary:** Two overlapping circles or zones creating a central union
- **Secondary:** Elements A and B distinct in outer zones
- **Tertiary:** Central zone showing the combination or best of both

## Zoning Guide
- **Zone A:** Left/Top circle section (Element A)
- **Zone B:** Right/Bottom circle section (Element B)
- **Zone Fusion:** Overlapping central area (Synthesis)

## Style Modifiers
- **Texture:** Transparency, blending modes, ethereal
- **Lighting:** Glowing core at intersection
- **Palette:** Color A blends with Color B to make Color C

## Negative Constraints
- **Avoid:** Separated distinct zones, no overlap, opaque layers
`.trim()


export const COMPARATIVA_DESCRIPTION = 'Diseño comparativo: Antes/Después, VS, Evolución. 12 composiciones para contrastar.'

export const COMPARATIVA_LAYOUTS: LayoutOption[] = [
    {
        id: 'comp-split',
        name: 'Dividido',
        description: '50/50',
        svgIcon: 'Columns',
        textZone: 'center',
        promptInstruction: COMPARATIVA_DIVIDIDO_PROMPT,
        structuralPrompt: COMPARATIVA_DIVIDIDO_PROMPT,
    },
    {
        id: 'comp-versus',
        name: 'Versus',
        description: 'Batalla',
        svgIcon: 'Swords',
        textZone: 'center',
        promptInstruction: COMPARATIVA_VERSUS_PROMPT,
        structuralPrompt: COMPARATIVA_VERSUS_PROMPT,
    },
    {
        id: 'comp-transformation',
        name: 'Antes/Después',
        description: 'Transformación',
        svgIcon: 'RefreshCw',
        textZone: 'overlay',
        promptInstruction: COMPARATIVA_TRANSFORMACION_PROMPT,
        structuralPrompt: COMPARATIVA_TRANSFORMACION_PROMPT,
    },
    {
        id: 'comp-checklist',
        name: 'Checklist',
        description: 'Grid Vs',
        svgIcon: 'ListChecks',
        textZone: 'top',
        promptInstruction: COMPARATIVA_CHECKLIST_PROMPT,
        structuralPrompt: COMPARATIVA_CHECKLIST_PROMPT,
    },
    {
        id: 'comp-slider',
        name: 'Slider',
        description: 'Interactivo',
        svgIcon: 'MoveHorizontal',
        textZone: 'center',
        promptInstruction: COMPARATIVA_SLIDER_PROMPT,
        structuralPrompt: COMPARATIVA_SLIDER_PROMPT,
    },
    {
        id: 'comp-evolution',
        name: 'Evolución',
        description: 'Timeline',
        svgIcon: 'TrendingUp',
        textZone: 'bottom',
        promptInstruction: COMPARATIVA_EVOLUCION_PROMPT,
        structuralPrompt: COMPARATIVA_EVOLUCION_PROMPT,
    },
    {
        id: 'comp-myth',
        name: 'Mito',
        description: 'Mito vs Realidad',
        svgIcon: 'AlertTriangle',
        textZone: 'center',
        promptInstruction: COMPARATIVA_MITO_PROMPT,
        structuralPrompt: COMPARATIVA_MITO_PROMPT,
    },
    {
        id: 'comp-expect',
        name: 'Expectativa',
        description: 'Humor',
        svgIcon: 'Smile',
        textZone: 'bottom',
        promptInstruction: COMPARATIVA_EXPECTATIVA_PROMPT,
        structuralPrompt: COMPARATIVA_EXPECTATIVA_PROMPT,
    },
    {
        id: 'comp-pricing',
        name: 'Precios',
        description: 'Tiers',
        svgIcon: 'CreditCard',
        textZone: 'center',
        promptInstruction: COMPARATIVA_PRECIO_PROMPT,
        structuralPrompt: COMPARATIVA_PRECIO_PROMPT,
    },
    {
        id: 'comp-horizontal',
        name: 'Horizontal',
        description: 'Arriba/Abajo',
        svgIcon: 'Rows2',
        textZone: 'center',
        promptInstruction: COMPARATIVA_HORIZONTAL_PROMPT,
        structuralPrompt: COMPARATIVA_HORIZONTAL_PROMPT,
    },
    {
        id: 'comp-zoom',
        name: 'Zoom',
        description: 'Detalle',
        svgIcon: 'ZoomIn',
        textZone: 'right',
        promptInstruction: COMPARATIVA_ZOOM_PROMPT,
        structuralPrompt: COMPARATIVA_ZOOM_PROMPT,
    },
    {
        id: 'comp-fusion',
        name: 'Fusión',
        description: 'Intersección',
        svgIcon: 'Merge',
        textZone: 'center',
        promptInstruction: COMPARATIVA_FUSION_PROMPT,
        structuralPrompt: COMPARATIVA_FUSION_PROMPT,
    }
]
