/**
 * CITA - Frase / Testimonio / Cita Célebre
 * Grupo: Conectar / Educar
 * 
 * Intent para citas inspiradoras, testimonios de clientes o frases célebres.
 * Maximiza la legibilidad y el impacto tipográfico.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const CITA_EXTENDED_DESCRIPTION = `
Diseño centrado en el texto para citas inspiradoras, testimonios de clientes
o frases célebres. Maximiza la legibilidad y el impacto tipográfico.
`.trim()

export const CITA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'quote',
        label: 'Frase o Cita',
        placeholder: 'Ej: La creatividad es la inteligencia divirtiéndose.',
        type: 'textarea',
        required: true,
        aiContext: 'The main quote text'
    },
    {
        id: 'author',
        label: 'Autor (Opcional)',
        placeholder: 'Ej: Albert Einstein',
        type: 'text',
        required: false,
        aiContext: 'Author of the quote'
    }
]

// 1. MINIMAL - Pure Text Focus
export const CITA_MINIMAL_PROMPT = `
<structural_instruction>
    <composition_type>Ultra-Minimalist Text Focus</composition_type>
    <visual_hierarchy>
        <primary>The [QUOTE] as sole visual element, perfectly centered</primary>
        <secondary>Generous breathing room and padding on all sides</secondary>
        <tertiary>Tiny accent symbol (quotation marks or thin line) as only decoration</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_text>Center-aligned quote with maximum whitespace (40% padding)</zone_text>
        <zone_author>Small, elegant author attribution below</zone_author>
        <zone_accent>Minimal decorative element above or below quote</zone_accent>
    </zoning_guide>
    <style_modifiers>
        <texture>Subtle grain texture, solid color, or soft gradient background</texture>
        <lighting>Even, gallery-like, museum atmosphere</lighting>
        <palette>Monochrome or single accent color, sophisticated restraint</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Busy backgrounds, multiple decorations, cramped text</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. RETRATO - Testimonial with Person
export const CITA_RETRATO_PROMPT = `
<structural_instruction>
    <composition_type>Testimonial Portrait Layout</composition_type>
    <visual_hierarchy>
        <primary>Photo of the person (circular avatar or professional headshot)</primary>
        <secondary>Quote text in speech bubble style or adjacent area</secondary>
        <tertiary>Name, title, and credentials near the photo</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_photo>Person's image on left or bottom third of composition</zone_photo>
        <zone_quote>Quote flowing from or near the person</zone_quote>
        <zone_credentials>Name tag and title positioned near the photo</zone_credentials>
    </zoning_guide>
    <style_modifiers>
        <texture>Professional photography quality, trustworthy atmosphere</texture>
        <lighting>Soft portrait lighting on the person</lighting>
        <palette>Clean, professional, neutral with brand accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear attribution, anonymous feel, disconnected photo and quote</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. TIPOGRAFÍA - Type as Image
export const CITA_TIPOGRAFIA_PROMPT = `
<structural_instruction>
    <composition_type>Typography as Visual Art</composition_type>
    <visual_hierarchy>
        <primary>Giant letters filling the entire canvas, quote as graphic element</primary>
        <secondary>High contrast color treatment (Black/White or Neon/Dark)</secondary>
        <tertiary>Dynamic word stacking or creative text justification</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_text>Quote fills 90% of canvas as visual texture</zone_text>
        <zone_emphasis>Key words enlarged or highlighted</zone_emphasis>
        <zone_attribution>Minimal corner space for author</zone_attribution>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold poster aesthetic, display typography impact</texture>
        <lighting>High contrast, no gradients, stark visibility</lighting>
        <palette>Two-color maximum, maximum impact combinations</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small type, gentle treatment, conventional layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. MARCO - Framed Quote
export const CITA_MARCO_PROMPT = `
<structural_instruction>
    <composition_type>Classic Framed Quote</composition_type>
    <visual_hierarchy>
        <primary>Ornamental or geometric border framing the entire composition</primary>
        <secondary>Clean central space for the quote text</secondary>
        <tertiary>Elegant author attribution at bottom within frame</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_frame>Border treatment around the edge (8-12% of canvas)</zone_frame>
        <zone_center>Protected inner space for quote text</zone_center>
        <zone_footer>Author name positioned at bottom of inner space</zone_footer>
    </zoning_guide>
    <style_modifiers>
        <texture>Art gallery, certificate, or classical poster feel</texture>
        <lighting>Even, formal, museum quality</lighting>
        <palette>Traditional color combinations, gold accents optional</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Modern aesthetics, broken frames, asymmetric layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. TEXTURA - Organic Background
export const CITA_TEXTURA_PROMPT = `
<structural_instruction>
    <composition_type>Textured Organic Background</composition_type>
    <visual_hierarchy>
        <primary>Rich textured background (paper, watercolor, concrete, fabric)</primary>
        <secondary>Quote overlay with subtle shadow or ink-blend effect</secondary>
        <tertiary>Slightly off-center organic text placement</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_background>Full-bleed tactile texture</zone_background>
        <zone_text>Quote overlaid with natural integration into texture</zone_text>
        <zone_organic>Slightly asymmetric, human-feeling alignment</zone_organic>
    </zoning_guide>
    <style_modifiers>
        <texture>Crumpled paper, watercolor washes, raw materials</texture>
        <lighting>Natural, handmade feeling, tactile warmth</lighting>
        <palette>Earth tones, muted colors, artisanal aesthetic</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Digital perfection, sterile backgrounds, clinical feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. DIVIDIDO - Split Composition
export const CITA_DIVIDIDO_PROMPT = `
<structural_instruction>
    <composition_type>Split Image and Quote</composition_type>
    <visual_hierarchy>
        <primary>Half atmospheric photography, half clean text area</primary>
        <secondary>Clear dividing line (vertical, horizontal, or diagonal)</secondary>
        <tertiary>Brand element bridging both sides</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_image>50% with atmospheric, mood-setting photography</zone_image>
        <zone_text>50% clean solid color with quote</zone_text>
        <zone_bridge>Divider line or element connecting both halves</zone_bridge>
    </zoning_guide>
    <style_modifiers>
        <texture>Magazine spread, editorial photography quality</texture>
        <lighting>Atmospheric in photo side, clean in text side</lighting>
        <palette>Image colors informing the text side accent</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unbalanced halves, competing visuals, unclear focus</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. BOCADILLO - Speech Bubble
export const CITA_BOCADILLO_PROMPT = `
<structural_instruction>
    <composition_type>Speech Bubble Quote</composition_type>
    <visual_hierarchy>
        <primary>Large speech bubble or thought cloud containing the quote</primary>
        <secondary>Visual source of the quote (person, character, or logo)</secondary>
        <tertiary>Tail of bubble pointing to the speaker</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_bubble>Central or upper bubble shape (60-70% of canvas)</zone_bubble>
        <zone_speaker>Corner area showing who's speaking</zone_speaker>
        <zone_tail>Connecting element from bubble to speaker</zone_tail>
    </zoning_guide>
    <style_modifiers>
        <texture>Comic book, pop art, or modern flat design</texture>
        <lighting>Bold, graphic, illustrative style</lighting>
        <palette>Bright, engaging, conversation-friendly colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear speaker, disconnected bubble, cramped text</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. CARRUSEL - Multi-Quote Layout
export const CITA_CARRUSEL_PROMPT = `
<structural_instruction>
    <composition_type>Multi-Quote Carousel Preview</composition_type>
    <visual_hierarchy>
        <primary>Main quote centered and prominent</primary>
        <secondary>Hints of additional quotes fading at edges (carousel feel)</secondary>
        <tertiary>Pagination dots or swipe indicators</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_main>Central quote in full visibility</zone_main>
        <zone_preview>Edge peeking of previous/next quotes (faded)</zone_preview>
        <zone_nav>Bottom pagination or navigation indicators</zone_nav>
    </zoning_guide>
    <style_modifiers>
        <texture>Card-based design, swipeable feel</texture>
        <lighting>Spotlight on center, gradient fade to edges</lighting>
        <palette>Consistent color system across implied cards</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static feel, equal visibility of all quotes, no carousel suggestion</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. NEON - Glowing Text
export const CITA_NEON_PROMPT = `
<structural_instruction>
    <composition_type>Neon Glow Typography</composition_type>
    <visual_hierarchy>
        <primary>Quote rendered as glowing neon sign effect</primary>
        <secondary>Dark or moody background contrasting the glow</secondary>
        <tertiary>Subtle warm ambient elements (brick wall, window, urban setting)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_neon>Central glowing text treatment</zone_neon>
        <zone_glow>Radiating light effect around text</zone_glow>
        <zone_atmosphere>Moody background setting the scene</zone_atmosphere>
    </zoning_guide>
    <style_modifiers>
        <texture>Neon tube aesthetic, glass tubing feel</texture>
        <lighting>Self-luminous text, atmospheric glow bleeding</lighting>
        <palette>Neon colors (pink, blue, yellow, green) on dark bases</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Flat lighting, bright backgrounds, weak glow effect</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. MANUSCRITO - Handwritten Feel
export const CITA_MANUSCRITO_PROMPT = `
<structural_instruction>
    <composition_type>Handwritten Personal Style</composition_type>
    <visual_hierarchy>
        <primary>Quote in script, cursive, or handwritten-style typography</primary>
        <secondary>Notebook, letter, or journal page aesthetic</secondary>
        <tertiary>Personal touches (underlines, arrows, doodles)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_text>Flowing handwritten text as main element</zone_text>
        <zone_margin>Notebook margins or letter borders</zone_margin>
        <zone_personal>Space for signatures, initials, or small drawings</zone_personal>
    </zoning_guide>
    <style_modifiers>
        <texture>Paper grain, ink bleed, pencil smudges</texture>
        <lighting>Soft, intimate, personal feeling</lighting>
        <palette>Ink colors (black, blue, brown) on paper tones</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Perfect typography, digital cleanliness, impersonal feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. FLOTANTE - Floating Words
export const CITA_FLOTANTE_PROMPT = `
<structural_instruction>
    <composition_type>Floating Scattered Words</composition_type>
    <visual_hierarchy>
        <primary>Key words from the quote floating at different sizes/angles</primary>
        <secondary>Atmospheric gradient or image background</secondary>
        <tertiary>Visual flow guiding reading order despite scattered layout</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_words>Words scattered across canvas with intentional hierarchy</zone_words>
        <zone_key>Largest treatment on most important words</zone_key>
        <zone_flow>Visual path connecting words in reading order</zone_flow>
    </zoning_guide>
    <style_modifiers>
        <texture>Dreamy, ethereal, floating sensation</texture>
        <lighting>Soft focus, gradient transitions between elements</lighting>
        <palette>Dreamy gradients, soft transitions, ethereal colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unreadable scatter, lost hierarchy, chaotic placement</avoid>
    </negative_constraints>
</structural_instruction>
`

export const CITA_DESCRIPTION = 'Diseño para frases, citas célebres o testimonios. 11 composiciones desde minimalista hasta artístico.'
