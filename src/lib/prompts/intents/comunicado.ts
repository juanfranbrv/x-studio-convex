/**
 * COMUNICADO - El Comunicado (Aviso, información densa)
 * Grupo: Informar
 * 
 * Intent para anuncios oficiales y comunicaciones importantes.
 * Prioriza la legibilidad del texto sobre elementos visuales decorativos.
 */

import type { LayoutOption, IntentRequiredField } from '@/lib/creation-flow-types'

export const COMUNICADO_DESCRIPTION = 'Layouts oficiales para anuncios, noticias importantes y actualizaciones. 12 composiciones desde institucional hasta moderno.'
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
# Composition Type
Official Authority Announcement

# Visual Hierarchy
- **Primary**: Company seal, logo, or official crest positioned prominently at top
- **Secondary**: Clean, hierarchical text layout with clear [TITLE] and body sections
- **Tertiary**: Formal footer with dates, signatures, or contact information

# Zoning Guide
- **Zone Header**: Top 15% reserved for official branding and seal
- **Zone Body**: Center 70% clean single-column text area with generous margins
- **Zone Footer**: Bottom 15% distinct separator for validity dates or contacts

# Style Modifiers
- **Texture**: Subtle paper texture, embossed seal effect, formal document feel
- **Lighting**: Even, institutional lighting, no dramatic shadows
- **Palette**: White or cream background, dark text, minimal accent color

# Negative Constraints
- **Avoid**: Playful graphics, informal tone, distracting decorations
`

// 2. URGENTE - Alert Layout
export const COMUNICADO_URGENTE_PROMPT = `
# Composition Type
High-Visibility Alert

# Visual Hierarchy
- **Primary**: Large warning icon, exclamation mark, or alert banner as attention grabber
- **Secondary**: Centralized message block with maximum contrast against background
- **Tertiary**: Bold borders or diagonal stripes framing the message

# Zoning Guide
- **Zone Alert**: Top banner or central icon establishing urgency
- **Zone Message**: High-contrast content block in the center
- **Zone Frame**: Solid borders or color bands at top/bottom

# Style Modifiers
- **Texture**: Construction signage aesthetic, hazard stripes if appropriate
- **Lighting**: High contrast, no soft gradients, stark and direct
- **Palette**: Yellow/Black, Red/White, or brand colors at maximum contrast

# Negative Constraints
- **Avoid**: Subtle messaging, calm colors, hidden information
`

// 3. MODERNO - Tech-Forward
export const COMUNICADO_MODERNO_PROMPT = `
# Composition Type
Asymmetric Tech Layout

# Visual Hierarchy
- **Primary**: Geometric masks, abstract shapes, or bold content blocks on one side
- **Secondary**: Clean whitespace balancing the heavy visual elements
- **Tertiary**: Tech-inspired accents (thin lines, dots, data visualization elements)

# Zoning Guide
- **Zone Visual**: 60% geometric or abstract graphic zone
- **Zone Content**: 40% clean text area with high hierarchy contrast
- **Zone Accents**: Scattered micro-elements adding tech feel

# Style Modifiers
- **Texture**: Glass morphism, gradient overlays, frosted effects
- **Lighting**: Cool digital lighting, subtle glows, modern ambiance
- **Palette**: Dark mode friendly, vibrant accents on neutral bases

# Negative Constraints
- **Avoid**: Traditional layouts, dated graphics, corporate blandness
`

// 4. EDITORIAL - Magazine Style
export const COMUNICADO_EDITORIAL_PROMPT = `
# Composition Type
Editorial Magazine Spread

# Visual Hierarchy
- **Primary**: Massive typographical element or pull quote as graphic centerpiece
- **Secondary**: Abstract brand patterns or blurred photography as background
- **Tertiary**: Discrete attribution or secondary details area

# Zoning Guide
- **Zone Background**: Full bleed atmospheric background or pattern
- **Zone Typography**: Center-dominant oversized text treatment
- **Zone Caption**: Minimal footer for supporting information

# Style Modifiers
- **Texture**: High-end print quality, rich color depth
- **Lighting**: Gallery or studio lighting, sophisticated ambiance
- **Palette**: Rich solid colors, "quiet luxury" aesthetic

# Negative Constraints
- **Avoid**: Cluttered layouts, multiple focal points, busy backgrounds
`

// 5. COMUNIDAD - Warm and Human
export const COMUNICADO_COMUNIDAD_PROMPT = `
# Composition Type
Community-Centric Warm Layout

# Visual Hierarchy
- **Primary**: Organic curved shapes, circles, or soft framing elements
- **Secondary**: Space for lifestyle imagery or community photos
- **Tertiary**: Conversational text flow that feels approachable

# Zoning Guide
- **Zone Organic**: Curved borders and soft frames creating warmth
- **Zone Imagery**: Integration space for human/community visuals
- **Zone Text**: Wrapped or balanced text in conversational style

# Style Modifiers
- **Texture**: Hand-drawn elements, organic shapes, human touch
- **Lighting**: Warm, inviting, natural feeling light
- **Palette**: Soft pastels, warm neutrals, friendly color combinations

# Negative Constraints
- **Avoid**: Cold corporate feel, rigid geometric layouts, impersonal tone
`

// 6. MINIMAL - Swiss Design
export const COMUNICADO_MINIMAL_PROMPT = `
# Composition Type
Swiss Minimalist Utility

# Visual Hierarchy
- **Primary**: Strict grid alignment with left-aligned or rigid center axis
- **Secondary**: Vast amounts of deliberate whitespace
- **Tertiary**: Single bold geometric element as anchor

# Zoning Guide
- **Zone Grid**: Content aligned to invisible but precise grid
- **Zone Negative**: Generous white space as design element
- **Zone Anchor**: Single line, circle, or geometric divider

# Style Modifiers
- **Texture**: Pure, flat surfaces, no gradients or shadows
- **Lighting**: Even, clinical, Swiss poster aesthetic
- **Palette**: Monochrome or strict duo-tone, Bauhaus-inspired

# Negative Constraints
- **Avoid**: Decorative elements, multiple colors, busy layouts
`

// 7. TARJETA - Card Format
export const COMUNICADO_TARJETA_PROMPT = `
# Composition Type
Floating Card Announcement

# Visual Hierarchy
- **Primary**: Central floating card or panel containing the message
- **Secondary**: Subtle shadow or elevation effect separating card from background
- **Tertiary**: Background treatment (gradient, blur, or pattern)

# Zoning Guide
- **Zone Card**: Centered card at 80% width with rounded corners
- **Zone Shadow**: Soft drop shadow creating depth
- **Zone Background**: Atmospheric background behind the card

# Style Modifiers
- **Texture**: Clean card surfaces, subtle elevation cues
- **Lighting**: Light source from above creating natural shadow
- **Palette**: White or light card on colored or gradient background

# Negative Constraints
- **Avoid**: Flat 2D feel, no depth, card blending with background
`

// 8. MARQUESINA - Ticker/Banner
export const COMUNICADO_MARQUESINA_PROMPT = `
# Composition Type
News Ticker Banner

# Visual Hierarchy
- **Primary**: Bold banner strip across top or center with scrolling news feel
- **Secondary**: Supporting content above and below the banner
- **Tertiary**: "BREAKING" or "IMPORTANTE" label badges

# Zoning Guide
- **Zone Banner**: Horizontal band spanning full width at focal point
- **Zone Context**: Areas above/below for logo and details
- **Zone Badges**: Corner or inline badges for news labels

# Style Modifiers
- **Texture**: Broadcast news aesthetic, LED ticker feel
- **Lighting**: Screen-like glow, broadcast studio lighting
- **Palette**: News channel colors (red/white/blue) or brand equivalent

# Negative Constraints
- **Avoid**: Static non-news feel, unclear main message, buried headline
`

// 9. MEMO - Internal Note Style
export const COMUNICADO_MEMO_PROMPT = `
# Composition Type
Internal Memo Format

# Visual Hierarchy
- **Primary**: Structured header with TO/FROM/DATE/RE fields
- **Secondary**: Clean body text in professional document format
- **Tertiary**: Optional signature or stamp at bottom

# Zoning Guide
- **Zone Header**: Top section with memo metadata fields
- **Zone Body**: Main content area with clear paragraph structure
- **Zone Signature**: Bottom area for signature, initials, or stamps

# Style Modifiers
- **Texture**: Office paper texture, typewriter or clean digital type
- **Lighting**: Flat office lighting, no drama
- **Palette**: White/cream paper, dark ink, minimal color

# Negative Constraints
- **Avoid**: Marketing flair, decorative elements, informal tone
`

// 10. CARTEL - Poster Bold
export const COMUNICADO_CARTEL_PROMPT = `
# Composition Type
Bold Poster Announcement

# Visual Hierarchy
- **Primary**: Giant headline typography filling most of the canvas
- **Secondary**: Minimal supporting text in high contrast
- **Tertiary**: Simple graphic element or border treatment

# Zoning Guide
- **Zone Headline**: 80% of canvas for massive type treatment
- **Zone Details**: Small zone for supporting information
- **Zone Brand**: Minimal corner space for logo if needed

# Style Modifiers
- **Texture**: Bold, impactful, protest poster aesthetic
- **Lighting**: High contrast, stark visibility
- **Palette**: Two colors maximum, high impact combinations

# Negative Constraints
- **Avoid**: Small type, complex layouts, multiple messages
`

// 11. TIMELINE - Dated Progression
export const COMUNICADO_TIMELINE_PROMPT = `
# Composition Type
Timeline Progression Layout

# Visual Hierarchy
- **Primary**: Vertical or horizontal timeline showing key dates or phases
- **Secondary**: Milestone markers or icons at each point
- **Tertiary**: Brief text labels at each timeline stop

# Zoning Guide
- **Zone Line**: Central spine or track connecting events
- **Zone Nodes**: Equidistant points for each date/phase
- **Zone Labels**: Alternating or consistent label positions

# Style Modifiers
- **Texture**: Infographic clarity, clean data visualization
- **Lighting**: Even, informational, no drama
- **Palette**: Progressive color scheme or consistent accent color

# Negative Constraints
- **Avoid**: Unclear progression, crowded nodes, confusing flow direction
`

export const COMUNICADO_LAYOUTS: LayoutOption[] = [
    {
        id: 'comunicado-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'help_center',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    {
        id: 'comunicado-oficial',
        name: 'Oficial',
        description: 'Autoridad y Claridad',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="26" cy="26" r="8" fill="currentColor" fill-opacity="0.7" /><circle cx="86" cy="22" r="8" fill="currentColor" fill-opacity="0.5" /><circle cx="70" cy="60" r="10" fill="currentColor" fill-opacity="0.6" /><rect x="34" y="28" width="44" height="6" rx="3" fill="currentColor" fill-opacity="0.3" /><rect x="60" y="36" width="8" height="22" rx="4" fill="currentColor" fill-opacity="0.3" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Official announcement layout with maximum readability.',
        structuralPrompt: COMUNICADO_OFICIAL_PROMPT,
        referenceImageDescription: COMUNICADO_DESCRIPTION, // Keeping this as it might be relevant? Or remove? It was in creation-flow-types.
        textFields: [
            { id: 'announcement_title', label: 'Título', placeholder: 'Cambio de Horario', defaultValue: '', aiContext: 'Main announcement headline' },
            { id: 'announcement_body', label: 'Contenido', placeholder: 'Detalla aquí el mensaje...', defaultValue: '', aiContext: 'Full announcement text' },
            { id: 'effective_date', label: 'Fecha/Pie', placeholder: 'A partir del 15 de enero', defaultValue: '', aiContext: 'When it takes effect' },
        ]
    },
    {
        id: 'comunicado-urgent',
        name: 'Urgente / Alerta',
        description: 'Alta Visibilidad',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Horizontal or bold alert layout with high contrast.',
        structuralPrompt: COMUNICADO_URGENTE_PROMPT,
    },
    {
        id: 'comunicado-modern',
        name: 'Moderno',
        description: 'Asimétrico Tech',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="48" width="16" height="22" rx="6" fill="currentColor" fill-opacity="0.45" /><rect x="38" y="40" width="16" height="30" rx="6" fill="currentColor" fill-opacity="0.55" /><rect x="60" y="30" width="16" height="40" rx="6" fill="currentColor" fill-opacity="0.65" /><rect x="82" y="22" width="16" height="48" rx="6" fill="currentColor" fill-opacity="0.75" /><rect x="16" y="18" width="64" height="8" rx="4" fill="currentColor" fill-opacity="0.3" /><rect x="86" y="10" width="26" height="60" rx="8" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'right',
        promptInstruction: 'Asymmetric modern layout with geometric masks.',
        structuralPrompt: COMUNICADO_MODERNO_PROMPT,
    },
    {
        id: 'comunicado-editorial',
        name: 'Editorial',
        description: 'Foco Tipográfico',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Typography focused layout for short impactful messages.',
        structuralPrompt: COMUNICADO_EDITORIAL_PROMPT,
    },
    {
        id: 'comunicado-community',
        name: 'Comunidad',
        description: 'Cercano y Humano',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><circle cx="86" cy="22" r="6" fill="currentColor" fill-opacity="0.45" /><rect x="8" y="10" width="26" height="60" rx="8" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'left',
        promptInstruction: 'Warm, human-centric layout with soft shapes.',
        structuralPrompt: COMUNICADO_COMUNIDAD_PROMPT,
    },
    {
        id: 'comunicado-minimal',
        name: 'Minimal',
        description: 'Puro Estilo Suizo',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="12" width="26" height="56" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="38" y="12" width="44" height="56" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="86" y="12" width="26" height="56" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Stark, minimal layout with rigid grid.',
        structuralPrompt: COMUNICADO_MINIMAL_PROMPT,
    },
    {
        id: 'comunicado-card',
        name: 'Tarjeta',
        description: 'Flotante',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Floating card layout with soft shadows.',
        structuralPrompt: COMUNICADO_TARJETA_PROMPT,
    },
    {
        id: 'comunicado-ticker',
        name: 'Marquesina',
        description: 'Noticia / TV',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><circle cx="86" cy="22" r="6" fill="currentColor" fill-opacity="0.45" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'News ticker banner style announcement.',
        structuralPrompt: COMUNICADO_MARQUESINA_PROMPT,
    },
    {
        id: 'comunicado-memo',
        name: 'Memo',
        description: 'Interno',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Internal office memo format.',
        structuralPrompt: COMUNICADO_MEMO_PROMPT,
    },
    {
        id: 'comunicado-poster',
        name: 'Cartel',
        description: 'Impacto Visual',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Bold poster style with massive typography.',
        structuralPrompt: COMUNICADO_CARTEL_PROMPT,
    },
    {
        id: 'comunicado-timeline',
        name: 'Timeline',
        description: 'Cronología',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="12" width="100" height="56" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="14" y="48" width="92" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /><rect x="14" y="26" width="60" height="10" rx="6" fill="currentColor" fill-opacity="0.5" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Timeline progression for dates or phases.',
        structuralPrompt: COMUNICADO_TIMELINE_PROMPT,
    },
]
