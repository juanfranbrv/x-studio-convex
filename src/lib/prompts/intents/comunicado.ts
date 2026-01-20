/**
 * COMUNICADO - El Comunicado (Aviso, información densa)
 * Grupo: Informar
 * 
 * Intent para anuncios oficiales y comunicaciones importantes.
 * Prioriza la legibilidad del texto sobre elementos visuales decorativos.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const COMUNICADO_EXTENDED_DESCRIPTION = `
Ideal para anuncios oficiales, cambios de horario, nuevas políticas o 
información importante. El diseño prioriza la legibilidad del texto 
sobre elementos visuales decorativos.
`.trim()

export const COMUNICADO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'announcement_title',
        label: 'Título del Comunicado',
        placeholder: 'Ej: Cambio de Horario',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'Main announcement headline'
    },
    {
        id: 'announcement_body',
        label: 'Texto del Comunicado',
        placeholder: 'Detalla aquí el mensaje completo...',
        type: 'textarea',
        required: true,
        aiContext: 'Full announcement text body'
    },
    {
        id: 'effective_date',
        label: 'Fecha Efectiva (opcional)',
        placeholder: 'A partir del 15 de enero',
        type: 'text',
        required: false,
        aiContext: 'When the announcement takes effect'
    }
]

// 1. OFICIAL - Authority Layout
export const COMUNICADO_OFICIAL_PROMPT = `
<structural_instruction>
    <composition_type>Official Authority Announcement</composition_type>
    <visual_hierarchy>
        <primary>Company seal, logo, or official crest positioned prominently at top</primary>
        <secondary>Clean, hierarchical text layout with clear [TITLE] and body sections</secondary>
        <tertiary>Formal footer with dates, signatures, or contact information</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>Top 15% reserved for official branding and seal</zone_header>
        <zone_body>Center 70% clean single-column text area with generous margins</zone_body>
        <zone_footer>Bottom 15% distinct separator for validity dates or contacts</zone_footer>
    </zoning_guide>
    <style_modifiers>
        <texture>Subtle paper texture, embossed seal effect, formal document feel</texture>
        <lighting>Even, institutional lighting, no dramatic shadows</lighting>
        <palette>White or cream background, dark text, minimal accent color</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Playful graphics, informal tone, distracting decorations</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. URGENTE - Alert Layout
export const COMUNICADO_URGENTE_PROMPT = `
<structural_instruction>
    <composition_type>High-Visibility Alert</composition_type>
    <visual_hierarchy>
        <primary>Large warning icon, exclamation mark, or alert banner as attention grabber</primary>
        <secondary>Centralized message block with maximum contrast against background</secondary>
        <tertiary>Bold borders or diagonal stripes framing the message</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_alert>Top banner or central icon establishing urgency</zone_alert>
        <zone_message>High-contrast content block in the center</zone_message>
        <zone_frame>Solid borders or color bands at top/bottom</zone_frame>
    </zoning_guide>
    <style_modifiers>
        <texture>Construction signage aesthetic, hazard stripes if appropriate</texture>
        <lighting>High contrast, no soft gradients, stark and direct</lighting>
        <palette>Yellow/Black, Red/White, or brand colors at maximum contrast</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Subtle messaging, calm colors, hidden information</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. MODERNO - Tech-Forward
export const COMUNICADO_MODERNO_PROMPT = `
<structural_instruction>
    <composition_type>Asymmetric Tech Layout</composition_type>
    <visual_hierarchy>
        <primary>Geometric masks, abstract shapes, or bold content blocks on one side</primary>
        <secondary>Clean whitespace balancing the heavy visual elements</secondary>
        <tertiary>Tech-inspired accents (thin lines, dots, data visualization elements)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_visual>60% geometric or abstract graphic zone</zone_visual>
        <zone_content>40% clean text area with high hierarchy contrast</zone_content>
        <zone_accents>Scattered micro-elements adding tech feel</zone_accents>
    </zoning_guide>
    <style_modifiers>
        <texture>Glass morphism, gradient overlays, frosted effects</texture>
        <lighting>Cool digital lighting, subtle glows, modern ambiance</lighting>
        <palette>Dark mode friendly, vibrant accents on neutral bases</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Traditional layouts, dated graphics, corporate blandness</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. EDITORIAL - Magazine Style
export const COMUNICADO_EDITORIAL_PROMPT = `
<structural_instruction>
    <composition_type>Editorial Magazine Spread</composition_type>
    <visual_hierarchy>
        <primary>Massive typographical element or pull quote as graphic centerpiece</primary>
        <secondary>Abstract brand patterns or blurred photography as background</secondary>
        <tertiary>Discrete attribution or secondary details area</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_background>Full bleed atmospheric background or pattern</zone_background>
        <zone_typography>Center-dominant oversized text treatment</zone_typography>
        <zone_caption>Minimal footer for supporting information</zone_caption>
    </zoning_guide>
    <style_modifiers>
        <texture>High-end print quality, rich color depth</texture>
        <lighting>Gallery or studio lighting, sophisticated ambiance</lighting>
        <palette>Rich solid colors, "quiet luxury" aesthetic</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cluttered layouts, multiple focal points, busy backgrounds</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. COMUNIDAD - Warm and Human
export const COMUNICADO_COMUNIDAD_PROMPT = `
<structural_instruction>
    <composition_type>Community-Centric Warm Layout</composition_type>
    <visual_hierarchy>
        <primary>Organic curved shapes, circles, or soft framing elements</primary>
        <secondary>Space for lifestyle imagery or community photos</secondary>
        <tertiary>Conversational text flow that feels approachable</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_organic>Curved borders and soft frames creating warmth</zone_organic>
        <zone_imagery>Integration space for human/community visuals</zone_imagery>
        <zone_text>Wrapped or balanced text in conversational style</zone_text>
    </zoning_guide>
    <style_modifiers>
        <texture>Hand-drawn elements, organic shapes, human touch</texture>
        <lighting>Warm, inviting, natural feeling light</lighting>
        <palette>Soft pastels, warm neutrals, friendly color combinations</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cold corporate feel, rigid geometric layouts, impersonal tone</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. MINIMAL - Swiss Design
export const COMUNICADO_MINIMAL_PROMPT = `
<structural_instruction>
    <composition_type>Swiss Minimalist Utility</composition_type>
    <visual_hierarchy>
        <primary>Strict grid alignment with left-aligned or rigid center axis</primary>
        <secondary>Vast amounts of deliberate whitespace</secondary>
        <tertiary>Single bold geometric element as anchor</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Content aligned to invisible but precise grid</zone_grid>
        <zone_negative>Generous white space as design element</zone_negative>
        <zone_anchor>Single line, circle, or geometric divider</zone_anchor>
    </zoning_guide>
    <style_modifiers>
        <texture>Pure, flat surfaces, no gradients or shadows</texture>
        <lighting>Even, clinical, Swiss poster aesthetic</lighting>
        <palette>Monochrome or strict duo-tone, Bauhaus-inspired</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Decorative elements, multiple colors, busy layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. TARJETA - Card Format
export const COMUNICADO_TARJETA_PROMPT = `
<structural_instruction>
    <composition_type>Floating Card Announcement</composition_type>
    <visual_hierarchy>
        <primary>Central floating card or panel containing the message</primary>
        <secondary>Subtle shadow or elevation effect separating card from background</secondary>
        <tertiary>Background treatment (gradient, blur, or pattern)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_card>Centered card at 80% width with rounded corners</zone_card>
        <zone_shadow>Soft drop shadow creating depth</zone_shadow>
        <zone_background>Atmospheric background behind the card</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean card surfaces, subtle elevation cues</texture>
        <lighting>Light source from above creating natural shadow</lighting>
        <palette>White or light card on colored or gradient background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Flat 2D feel, no depth, card blending with background</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. MARQUESINA - Ticker/Banner
export const COMUNICADO_MARQUESINA_PROMPT = `
<structural_instruction>
    <composition_type>News Ticker Banner</composition_type>
    <visual_hierarchy>
        <primary>Bold banner strip across top or center with scrolling news feel</primary>
        <secondary>Supporting content above and below the banner</secondary>
        <tertiary>"BREAKING" or "IMPORTANTE" label badges</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_banner>Horizontal band spanning full width at focal point</zone_banner>
        <zone_context>Areas above/below for logo and details</zone_context>
        <zone_badges>Corner or inline badges for news labels</zone_badges>
    </zoning_guide>
    <style_modifiers>
        <texture>Broadcast news aesthetic, LED ticker feel</texture>
        <lighting>Screen-like glow, broadcast studio lighting</lighting>
        <palette>News channel colors (red/white/blue) or brand equivalent</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static non-news feel, unclear main message, buried headline</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. MEMO - Internal Note Style
export const COMUNICADO_MEMO_PROMPT = `
<structural_instruction>
    <composition_type>Internal Memo Format</composition_type>
    <visual_hierarchy>
        <primary>Structured header with TO/FROM/DATE/RE fields</primary>
        <secondary>Clean body text in professional document format</secondary>
        <tertiary>Optional signature or stamp at bottom</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>Top section with memo metadata fields</zone_header>
        <zone_body>Main content area with clear paragraph structure</zone_body>
        <zone_signature>Bottom area for signature, initials, or stamps</zone_signature>
    </zoning_guide>
    <style_modifiers>
        <texture>Office paper texture, typewriter or clean digital type</texture>
        <lighting>Flat office lighting, no drama</lighting>
        <palette>White/cream paper, dark ink, minimal color</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Marketing flair, decorative elements, informal tone</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. CARTEL - Poster Bold
export const COMUNICADO_CARTEL_PROMPT = `
<structural_instruction>
    <composition_type>Bold Poster Announcement</composition_type>
    <visual_hierarchy>
        <primary>Giant headline typography filling most of the canvas</primary>
        <secondary>Minimal supporting text in high contrast</secondary>
        <tertiary>Simple graphic element or border treatment</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_headline>80% of canvas for massive type treatment</zone_headline>
        <zone_details>Small zone for supporting information</zone_details>
        <zone_brand>Minimal corner space for logo if needed</zone_brand>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold, impactful, protest poster aesthetic</texture>
        <lighting>High contrast, stark visibility</lighting>
        <palette>Two colors maximum, high impact combinations</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small type, complex layouts, multiple messages</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. TIMELINE - Dated Progression
export const COMUNICADO_TIMELINE_PROMPT = `
<structural_instruction>
    <composition_type>Timeline Progression Layout</composition_type>
    <visual_hierarchy>
        <primary>Vertical or horizontal timeline showing key dates or phases</primary>
        <secondary>Milestone markers or icons at each point</secondary>
        <tertiary>Brief text labels at each timeline stop</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_line>Central spine or track connecting events</zone_line>
        <zone_nodes>Equidistant points for each date/phase</zone_nodes>
        <zone_labels>Alternating or consistent label positions</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>Infographic clarity, clean data visualization</texture>
        <lighting>Even, informational, no drama</lighting>
        <palette>Progressive color scheme or consistent accent color</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear progression, crowded nodes, confusing flow direction</avoid>
    </negative_constraints>
</structural_instruction>
`

export const COMUNICADO_DESCRIPTION = 'Layouts oficiales para anuncios, noticias importantes y actualizaciones. 11 composiciones desde institucional hasta moderno.'
