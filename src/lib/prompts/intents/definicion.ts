/**
 * DEFINICION - La Definición (Diccionario, términos)
 * Grupo: Educar
 * 
 * Para definir términos, conceptos o jerga con claridad y estilo.
 * Formato diccionario o explicación de conceptos.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

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
<structural_instruction>
    <composition_type>Classic Dictionary Entry</composition_type>
    <visual_hierarchy>
        <primary>The WORD in elegant bold serif typography</primary>
        <secondary>Phonetic pronunciation guide /fəˈnetɪk/</secondary>
        <tertiary>Definition text block with part of speech (n. adj. v.)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_word>Bold headword at top left</zone_word>
        <zone_phonetic>Pronunciation guide below word</zone_phonetic>
        <zone_definition>Definition text body</zone_definition>
    </zoning_guide>
    <style_modifiers>
        <texture>Old paper grain, letterpress print effect</texture>
        <lighting>Even flat lighting, scanned page feel</lighting>
        <palette>Black ink on off-white or cream paper</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Modern sans-serifs, neon colors, busy backgrounds</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. MINIMALISTA - Huge Typography
export const DEFINICION_MINIMALISTA_PROMPT = `
<structural_instruction>
    <composition_type>Minimalist Giant Word</composition_type>
    <visual_hierarchy>
        <primary>The WORD filling the canvas edge-to-edge</primary>
        <secondary>Tiny definition text tucked in a corner</secondary>
        <tertiary>One small geometric accent shape</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_word>Massive typography spanning full width</zone_word>
        <zone_definition>Micro text in corner</zone_definition>
        <zone_accent>Minimal geometric element</zone_accent>
    </zoning_guide>
    <style_modifiers>
        <texture>Smooth vector matte, Swiss design</texture>
        <lighting>Flat design, no shadows</lighting>
        <palette>High contrast B&W or single bright color background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Clutter, gradients, photos, skeuomorphism</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. MAPA - Concept Mind Map
export const DEFINICION_MAPA_PROMPT = `
<structural_instruction>
    <composition_type>Concept Mind Map</composition_type>
    <visual_hierarchy>
        <primary>Central node with the WORD as hub</primary>
        <secondary>Branching lines connecting to related keywords</secondary>
        <tertiary>Definition text on the side or in a panel</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hub>Central word node</zone_hub>
        <zone_branches>Radiating related concepts</zone_branches>
        <zone_definition>Definition panel or sidebar</zone_definition>
    </zoning_guide>
    <style_modifiers>
        <texture>Whiteboard marker, digital diagram, flow chart</texture>
        <lighting>Clean even screen lighting</lighting>
        <palette>Tech colors (blue, grey, white)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy handwriting, tangled spaghetti lines</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. ENCICLOPEDIA - Academic Layout
export const DEFINICION_ENCICLOPEDIA_PROMPT = `
<structural_instruction>
    <composition_type>Encyclopedia Layout</composition_type>
    <visual_hierarchy>
        <primary>Two-column text layout like a reference book</primary>
        <secondary>Vintage engraving or scientific illustration of concept</secondary>
        <tertiary>Caption text under the illustration</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_illustration>Vintage or technical diagram</zone_illustration>
        <zone_text>Column layout text block</zone_text>
        <zone_caption>Figure caption and credits</zone_caption>
    </zoning_guide>
    <style_modifiers>
        <texture>Vintage book, academic journal pages</texture>
        <lighting>Library reading atmosphere</lighting>
        <palette>Sepia, muted tones, scholarly feel</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cartoons, web 2.0 gloss, modern stock photos</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. URBANO - Street Sticker Style
export const DEFINICION_URBANO_PROMPT = `
<structural_instruction>
    <composition_type>Urban Dictionary Sticker</composition_type>
    <visual_hierarchy>
        <primary>WORD designed as a die-cut sticker graphic</primary>
        <secondary>Graffiti tag background or concrete wall</secondary>
        <tertiary>Definition on taped paper note or speech bubble</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_sticker>Bold word as sticker art</zone_sticker>
        <zone_wall>Urban texture background</zone_wall>
        <zone_note>Definition on note or bubble</zone_note>
    </zoning_guide>
    <style_modifiers>
        <texture>Street wear aesthetic, concrete, sticker gloss</texture>
        <lighting>Hard flash photography</lighting>
        <palette>Neon green, hot pink, black asphalt</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Elegant serif fonts, corporate feel, pastels</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. TECH - Code Block Style
export const DEFINICION_TECH_PROMPT = `
<structural_instruction>
    <composition_type>Code Definition Block</composition_type>
    <visual_hierarchy>
        <primary>IDE or code editor window frame</primary>
        <secondary>The WORD defined as a const or variable assignment</secondary>
        <tertiary>Syntax highlighting colors</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_editor>Code editor window chrome</zone_editor>
        <zone_code>Code block with syntax highlighting</zone_code>
        <zone_comment>Definition as code comment</zone_comment>
    </zoning_guide>
    <style_modifiers>
        <texture>Dark mode UI, monospaced font</texture>
        <lighting>Screen glow effect</lighting>
        <palette>Dark grey background, pastel code colors (Dracula theme)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>White backgrounds, variable width fonts, no code feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. NEON - Glowing Typography
export const DEFINICION_NEON_PROMPT = `
<structural_instruction>
    <composition_type>Neon Sign Typography</composition_type>
    <visual_hierarchy>
        <primary>WORD rendered as glowing neon sign tubes</primary>
        <secondary>Dark brick or night background</secondary>
        <tertiary>Definition in subtle painted text below</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_neon>Glowing neon word as hero</zone_neon>
        <zone_background>Dark atmospheric backdrop</zone_background>
        <zone_definition>Painted or chalk definition text</zone_definition>
    </zoning_guide>
    <style_modifiers>
        <texture>Glass neon tubes, glow effects, reflections</texture>
        <lighting>Self-luminous neon, ambient light spill</lighting>
        <palette>Neon colors (pink, blue, green) against dark</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Daylight, flat graphics, no glow</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. TARJETA - Flash Card Style
export const DEFINICION_TARJETA_PROMPT = `
<structural_instruction>
    <composition_type>Study Flash Card</composition_type>
    <visual_hierarchy>
        <primary>Clean card shape with WORD on "front"</primary>
        <secondary>Definition visible as if peeking from "back"</secondary>
        <tertiary>Category or subject tag in corner</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_front>Card face with word</zone_front>
        <zone_back>Definition content visible</zone_back>
        <zone_category>Subject or topic tag</zone_category>
    </zoning_guide>
    <style_modifiers>
        <texture>Index card paper, clean study aesthetic</texture>
        <lighting>Soft, even, readable</lighting>
        <palette>White cards with colored accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Complex design, hard to read, cluttered</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. ILUSTRADO - Visual Metaphor
export const DEFINICION_ILUSTRADO_PROMPT = `
<structural_instruction>
    <composition_type>Illustrated Definition</composition_type>
    <visual_hierarchy>
        <primary>Visual metaphor illustration representing the concept</primary>
        <secondary>WORD as typographic element integrated with illustration</secondary>
        <tertiary>Brief definition text as caption</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_illustration>Visual representation of concept</zone_illustration>
        <zone_word>Integrated typography with visual</zone_word>
        <zone_caption>Definition caption below</zone_caption>
    </zoning_guide>
    <style_modifiers>
        <texture>Editorial illustration, conceptual art</texture>
        <lighting>Artistic, mood-appropriate</lighting>
        <palette>Concept-appropriate color choices</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Abstract only, text-only, no visual metaphor</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. VERSUS - Compare Terms
export const DEFINICION_VERSUS_PROMPT = `
<structural_instruction>
    <composition_type>Term Comparison Split</composition_type>
    <visual_hierarchy>
        <primary>Two related/confused terms side by side</primary>
        <secondary>Their respective definitions below each</secondary>
        <tertiary>"VS" or "≠" separator between them</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_term_a>First term and its definition</zone_term_a>
        <zone_term_b>Second term and its definition</zone_term_b>
        <zone_divider>Visual separator clarifying difference</zone_divider>
    </zoning_guide>
    <style_modifiers>
        <texture>Educational infographic, clear comparison</texture>
        <lighting>Even, balanced across both</lighting>
        <palette>Distinct colors for each term</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear which is which, biased presentation</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. EMOJI - Modern Visual Dictionary
export const DEFINICION_EMOJI_PROMPT = `
<structural_instruction>
    <composition_type>Visual Emoji Dictionary</composition_type>
    <visual_hierarchy>
        <primary>Large emoji or icon representing the concept</primary>
        <secondary>WORD below the emoji as label</secondary>
        <tertiary>Brief modern definition in casual tone</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_emoji>Large central emoji or icon</zone_emoji>
        <zone_word>Word label below emoji</zone_word>
        <zone_definition>Casual definition text</zone_definition>
    </zoning_guide>
    <style_modifiers>
        <texture>Gen-Z aesthetic, Apple emoji style</texture>
        <lighting>Flat, clean, digital-native</lighting>
        <palette>Bright, friendly, accessible colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Formal academic tone, old-fashioned feel</avoid>
    </negative_constraints>
</structural_instruction>
`

export const DEFINICION_DESCRIPTION = 'Definiciones y términos estilo diccionario. 11 composiciones educativas.'
