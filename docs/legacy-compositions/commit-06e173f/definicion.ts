/**
 * DEFINICION - La Definición (Diccionario, términos)
 * Grupo: Educar
 */

import type { LayoutOption, IntentRequiredField } from '@/lib/creation-flow-types'

export const DEFINICION_DESCRIPTION = 'Definiciones y términos estilo diccionario. 12 composiciones educativas.'
export const DEFINICION_EXTENDED_DESCRIPTION = `
Para definir términos, conceptos o jerga con claridad y estilo.
Formato diccionario o explicación de conceptos.
`.trim()

export const DEFINICION_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'word',
        label: 'Palabra o Término',
        placeholder: 'Ej: Innovación',
        type: 'text',
        required: true,
        aiContext: 'The word or term to define'
    },
    {
        id: 'definition',
        label: 'Definición',
        placeholder: 'Ej: Proceso de crear algo nuevo...',
        type: 'text',
        required: true,
        aiContext: 'The definition or explanation'
    },
    {
        id: 'phonetic',
        label: 'Fonética (Opcional)',
        placeholder: 'Ej: /i-no-va-sión/',
        type: 'text',
        required: false,
        aiContext: 'Pronunciation guide'
    }
]

// 1. CLÁSICO - Dictionary Entry
export const DEFINICION_CLASICO_PROMPT = `
# Composition Type
Classic Dictionary Entry

# Visual Hierarchy
- **Primary**: The WORD in elegant bold serif typography
- **Secondary**: Phonetic pronunciation guide /fəˈnetɪk/
- **Tertiary**: Definition text block with part of speech (n. adj. v.)

# Zoning Guide
- **Zone Word**: Bold headword at top left
- **Zone Phonetic**: Pronunciation guide below word
- **Zone Definition**: Definition text body

# Style Modifiers
- **Texture**: Old paper grain, letterpress print effect
- **Lighting**: Even flat lighting, scanned page feel
- **Palette**: Black ink on off-white or cream paper

# Negative Constraints
- **Avoid**: Modern sans-serifs, neon colors, busy backgrounds
`

// 2. MINIMALISTA - Huge Typography
export const DEFINICION_MINIMALISTA_PROMPT = `
# Composition Type
Minimalist Giant Word

# Visual Hierarchy
- **Primary**: The WORD filling the canvas edge-to-edge
- **Secondary**: Tiny definition text tucked in a corner
- **Tertiary**: One small geometric accent shape

# Zoning Guide
- **Zone Word**: Massive typography spanning full width
- **Zone Definition**: Micro text in corner
- **Zone Accent**: Minimal geometric element

# Style Modifiers
- **Texture**: Smooth vector matte, Swiss design
- **Lighting**: Flat design, no shadows
- **Palette**: High contrast B&W or single bright color background

# Negative Constraints
- **Avoid**: Clutter, gradients, photos, skeuomorphism
`

// 3. MAPA - Concept Mind Map
export const DEFINICION_MAPA_PROMPT = `
# Composition Type
Concept Mind Map

# Visual Hierarchy
- **Primary**: Central node with the WORD as hub
- **Secondary**: Branching lines connecting to related keywords
- **Tertiary**: Definition text on the side or in a panel

# Zoning Guide
- **Zone Hub**: Central word node
- **Zone Branches**: Radiating related concepts
- **Zone Definition**: Definition panel or sidebar

# Style Modifiers
- **Texture**: Whiteboard marker, digital diagram, flow chart
- **Lighting**: Clean even screen lighting
- **Palette**: Tech colors (blue, grey, white)

# Negative Constraints
- **Avoid**: Messy handwriting, tangled spaghetti lines
`

// 4. ENCICLOPEDIA - Academic Layout
export const DEFINICION_ENCICLOPEDIA_PROMPT = `
# Composition Type
Encyclopedia Layout

# Visual Hierarchy
- **Primary**: Two-column text layout like a reference book
- **Secondary**: Vintage engraving or scientific illustration of concept
- **Tertiary**: Caption text under the illustration

# Zoning Guide
- **Zone Illustration**: Vintage or technical diagram
- **Zone Text**: Column layout text block
- **Zone Caption**: Figure caption and credits

# Style Modifiers
- **Texture**: Vintage book, academic journal pages
- **Lighting**: Library reading atmosphere
- **Palette**: Sepia, muted tones, scholarly feel

# Negative Constraints
- **Avoid**: Cartoons, web 2.0 gloss, modern stock photos
`

// 5. URBANO - Street Sticker Style
export const DEFINICION_URBANO_PROMPT = `
# Composition Type
Urban Dictionary Sticker

# Visual Hierarchy
- **Primary**: WORD designed as a die-cut sticker graphic
- **Secondary**: Graffiti tag background or concrete wall
- **Tertiary**: Definition on taped paper note or speech bubble

# Zoning Guide
- **Zone Sticker**: Bold word as sticker art
- **Zone Wall**: Urban texture background
- **Zone Note**: Definition on note or bubble

# Style Modifiers
- **Texture**: Street wear aesthetic, concrete, sticker gloss
- **Lighting**: Hard flash photography
- **Palette**: Neon green, hot pink, black asphalt

# Negative Constraints
- **Avoid**: Elegant serif fonts, corporate feel, pastels
`

// 6. TECH - Code Block Style
export const DEFINICION_TECH_PROMPT = `
# Composition Type
Code Definition Block

# Visual Hierarchy
- **Primary**: IDE or code editor window frame
- **Secondary**: The WORD defined as a const or variable assignment
- **Tertiary**: Syntax highlighting colors

# Zoning Guide
- **Zone Editor**: Code editor window chrome
- **Zone Code**: Code block with syntax highlighting
- **Zone Comment**: Definition as code comment

# Style Modifiers
- **Texture**: Dark mode UI, monospaced font
- **Lighting**: Screen glow effect
- **Palette**: Dark grey background, pastel code colors (Dracula theme)

# Negative Constraints
- **Avoid**: White backgrounds, variable width fonts, no code feel
`

// 7. NEON - Glowing Typography
export const DEFINICION_NEON_PROMPT = `
# Composition Type
Neon Sign Typography

# Visual Hierarchy
- **Primary**: WORD rendered as glowing neon sign tubes
- **Secondary**: Dark brick or night background
- **Tertiary**: Definition in subtle painted text below

# Zoning Guide
- **Zone Neon**: Glowing neon word as hero
- **Zone Background**: Dark atmospheric backdrop
- **Zone Definition**: Painted or chalk definition text

# Style Modifiers
- **Texture**: Glass neon tubes, glow effects, reflections
- **Lighting**: Self-luminous neon, ambient light spill
- **Palette**: Neon colors (pink, blue, green) against dark

# Negative Constraints
- **Avoid**: Daylight, flat graphics, no glow
`

// 8. TARJETA - Flash Card Style
export const DEFINICION_TARJETA_PROMPT = `
# Composition Type
Study Flash Card

# Visual Hierarchy
- **Primary**: Clean card shape with WORD on "front"
- **Secondary**: Definition visible as if peeking from "back"
- **Tertiary**: Category or subject tag in corner

# Zoning Guide
- **Zone Front**: Card face with word
- **Zone Back**: Definition content visible
- **Zone Category**: Subject or topic tag

# Style Modifiers
- **Texture**: Index card paper, clean study aesthetic
- **Lighting**: Soft, even, readable
- **Palette**: White cards with colored accents

# Negative Constraints
- **Avoid**: Complex design, hard to read, cluttered
`

// 9. ILUSTRADO - Visual Metaphor
export const DEFINICION_ILUSTRADO_PROMPT = `
# Composition Type
Illustrated Definition

# Visual Hierarchy
- **Primary**: Visual metaphor illustration representing the concept
- **Secondary**: WORD as typographic element integrated with illustration
- **Tertiary**: Brief definition text as caption

# Zoning Guide
- **Zone Illustration**: Visual representation of concept
- **Zone Word**: Integrated typography with visual
- **Zone Caption**: Definition caption below

# Style Modifiers
- **Texture**: Editorial illustration, conceptual art
- **Lighting**: Artistic, mood-appropriate
- **Palette**: Concept-appropriate color choices

# Negative Constraints
- **Avoid**: Abstract only, text-only, no visual metaphor
`

// 10. VERSUS - Compare Terms
export const DEFINICION_VERSUS_PROMPT = `
# Composition Type
Term Comparison Split

# Visual Hierarchy
- **Primary**: Two related/confused terms side by side
- **Secondary**: Their respective definitions below each
- **Tertiary**: "VS" or "≠" separator between them

# Zoning Guide
- **Zone Term A**: First term and its definition
- **Zone Term B**: Second term and its definition
- **Zone Divider**: Visual separator clarifying difference

# Style Modifiers
- **Texture**: Educational infographic, clear comparison
- **Lighting**: Even, balanced across both
- **Palette**: Distinct colors for each term

# Negative Constraints
- **Avoid**: Unclear which is which, biased presentation
`

// 11. EMOJI - Modern Visual Dictionary
export const DEFINICION_EMOJI_PROMPT = `
# Composition Type
Visual Emoji Dictionary

# Visual Hierarchy
- **Primary**: Large emoji or icon representing the concept
- **Secondary**: WORD below the emoji as label
- **Tertiary**: Brief modern definition in casual tone

# Zoning Guide
- **Zone Emoji**: Large central emoji or icon
- **Zone Word**: Word label below emoji
- **Zone Definition**: Casual definition text

# Style Modifiers
- **Texture**: Gen-Z aesthetic, Apple emoji style
- **Lighting**: Flat, clean, digital-native
- **Palette**: Bright, friendly, accessible colors

# Negative Constraints
- **Avoid**: Formal academic tone, old-fashioned feel
`

export const DEFINICION_LAYOUTS: LayoutOption[] = [
    {
        id: 'definicion-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    {
        id: 'def-classic',
        name: 'Diccionario',
        description: 'Clásico Serif',
        svgIcon: 'Book',
        textZone: 'top',
        promptInstruction: 'Classic elegant dictionary entry.',
        structuralPrompt: DEFINICION_CLASICO_PROMPT,
    },
    {
        id: 'def-minimal',
        name: 'Minimal',
        description: 'Impacto Visual',
        svgIcon: 'Type',
        textZone: 'center',
        promptInstruction: 'Massive typography, minimal style.',
        structuralPrompt: DEFINICION_MINIMALISTA_PROMPT,
    },
    {
        id: 'def-map',
        name: 'Mapa',
        description: 'Conexiones',
        svgIcon: 'GitBranch',
        textZone: 'center',
        promptInstruction: 'Mind map connecting concepts.',
        structuralPrompt: DEFINICION_MAPA_PROMPT,
    },
    {
        id: 'def-encyclopedia',
        name: 'Enciclopedia',
        description: 'Académico',
        svgIcon: 'Library',
        textZone: 'right',
        promptInstruction: 'Vintage encyclopedia layout.',
        structuralPrompt: DEFINICION_ENCICLOPEDIA_PROMPT,
    },
    {
        id: 'def-urban',
        name: 'Urbano',
        description: 'Sticker Style',
        svgIcon: 'Tag',
        textZone: 'center',
        promptInstruction: 'Street style sticker definition.',
        structuralPrompt: DEFINICION_URBANO_PROMPT,
    },
    {
        id: 'def-tech',
        name: 'Código',
        description: 'Tech/Dev',
        svgIcon: 'Code',
        textZone: 'center',
        promptInstruction: 'Code editor syntax definition.',
        structuralPrompt: DEFINICION_TECH_PROMPT,
    },
    {
        id: 'def-neon',
        name: 'Neon',
        description: 'Letrero',
        svgIcon: 'Zap',
        textZone: 'center',
        promptInstruction: 'Glowing neon sign typography.',
        structuralPrompt: DEFINICION_NEON_PROMPT,
    },
    {
        id: 'def-tarjeta',
        name: 'Tarjeta',
        description: 'Flashcard',
        svgIcon: 'Copy',
        textZone: 'center',
        promptInstruction: 'Study flashcard design.',
        structuralPrompt: DEFINICION_TARJETA_PROMPT,
    },
    {
        id: 'def-ilustrado',
        name: 'Ilustrado',
        description: 'Metáfora',
        svgIcon: 'PenTool',
        textZone: 'center',
        promptInstruction: 'Visual metaphor illustration.',
        structuralPrompt: DEFINICION_ILUSTRADO_PROMPT,
    },
    {
        id: 'def-versus',
        name: 'Versus',
        description: 'Comparativa',
        svgIcon: 'SplitHorizontal',
        textZone: 'center',
        promptInstruction: 'Term comparison split screen.',
        structuralPrompt: DEFINICION_VERSUS_PROMPT,
    },
    {
        id: 'def-emoji',
        name: 'Emoji',
        description: 'Icono Moderno',
        svgIcon: 'Smile',
        textZone: 'center',
        promptInstruction: 'Large emoji visual dictionary.',
        structuralPrompt: DEFINICION_EMOJI_PROMPT,
    },
]
