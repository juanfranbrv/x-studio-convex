/**
 * TALENTO - El Talento (Hiring & Employer Branding)
 * Grupo: Conectar
 * 
 * Para atraer talento, mostrar cultura de empresa y employer branding.
 * Anuncios de empleo y spotlight de empleados.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const TALENTO_EXTENDED_DESCRIPTION = `
Para atraer talento, mostrar cultura de empresa y employer branding.
Anuncios de empleo y spotlight de empleados.
`.trim()

export const TALENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'headline',
        label: 'Título Principal',
        placeholder: 'Ej: ¡Únete a nuestro equipo!',
        type: 'text',
        required: true,
        aiContext: 'Main hiring message or headline'
    },
    {
        id: 'role_title',
        label: 'Puesto',
        placeholder: 'Ej: Diseñador Senior',
        type: 'text',
        required: false,
        aiContext: 'Job title or role being offered'
    },
    {
        id: 'cta',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: Aplica ahora',
        type: 'text',
        required: false,
        aiContext: 'Call to action for applicants'
    }
]

// 1. CONTRATANDO - Classic Hiring Poster
export const TALENTO_CONTRATANDO_PROMPT = `
<structural_instruction>
    <composition_type>Hiring Announcement Poster</composition_type>
    <visual_hierarchy>
        <primary>Bold "WE ARE HIRING" or "JOIN US" headline text</primary>
        <secondary>Dynamic office background or abstract geometric patterns</secondary>
        <tertiary>Role title and "Apply Now" call to action</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_eyebrow>"Career Opportunity" tag at top</zone_eyebrow>
        <zone_headline>Main hiring message as hero</zone_headline>
        <zone_details>Role and CTA at bottom</zone_details>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean corporate geometric patterns, Memphis design</texture>
        <lighting>Bright, optimistic high-key lighting</lighting>
        <palette>Energetic brand colors, primary colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Boring stock handshake photos, dark gloomy vibes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. CULTURA - Life at Company Grid
export const TALENTO_CULTURA_PROMPT = `
<structural_instruction>
    <composition_type>Team Culture Photo Grid</composition_type>
    <visual_hierarchy>
        <primary>Masonry grid of candid team photos</primary>
        <secondary>Overlay text badge "Life at [Company]"</secondary>
        <tertiary>Colorful borders, tape, or frame elements separating images</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Multiple candid team photos</zone_grid>
        <zone_badge>Central text overlay</zone_badge>
        <zone_style>Decorative frame elements</zone_style>
    </zoning_guide>
    <style_modifiers>
        <texture>Polaroid frames, washi tape, scrapbook aesthetic</texture>
        <lighting>Natural sunlight, warm filters</lighting>
        <palette>Multicolor, vibrant, fun, authentic</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Stiff corporate headshots, rigid perfect alignment</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. VALORES - Core Value Statement
export const TALENTO_VALORES_PROMPT = `
<structural_instruction>
    <composition_type>Core Value Typography</composition_type>
    <visual_hierarchy>
        <primary>One powerful word (INTEGRITY, INNOVATION) in giant typography</primary>
        <secondary>Abstract background representing the concept visually</secondary>
        <tertiary>Small definition or explanation text below</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_word>Massive value word as hero</zone_word>
        <zone_visual>Conceptual background imagery</zone_visual>
        <zone_explanation>Definition text</zone_explanation>
    </zoning_guide>
    <style_modifiers>
        <texture>3D lettering, architectural materials (concrete, glass)</texture>
        <lighting>Dramatic side lighting, long shadows</lighting>
        <palette>Monochrome with one strong accent color</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cluttered text, weak fonts, literal interpretations</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. BENEFICIOS - Perks Icons Display
export const TALENTO_BENEFICIOS_PROMPT = `
<structural_instruction>
    <composition_type>Benefits Icon Display</composition_type>
    <visual_hierarchy>
        <primary>3-4 3D icons representing benefits (Remote, Health, Equity)</primary>
        <secondary>Floating platforms or bubbles holding the icons</secondary>
        <tertiary>"Why Join Us?" header</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>Question or benefits headline</zone_header>
        <zone_icons>Row or grid of benefit icons</zone_icons>
        <zone_labels>Text labels for each benefit</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>Soft clay 3D, pastel colors, rounded shapes</texture>
        <lighting>Soft playful lighting</lighting>
        <palette>Pastels, friendly, accessible colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Sharp edges, aggressive colors, flat line icons</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. SPOTLIGHT - Employee Story
export const TALENTO_SPOTLIGHT_PROMPT = `
<structural_instruction>
    <composition_type>Employee Spotlight Feature</composition_type>
    <visual_hierarchy>
        <primary>Large portrait of employee on one side</primary>
        <secondary>Large quote mark and their personal story text</secondary>
        <tertiary>Name and role identification tag</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_photo>Employee portrait (50% width)</zone_photo>
        <zone_quote>Personal story quote (50% width)</zone_quote>
        <zone_credit>Name, role, tenure</zone_credit>
    </zoning_guide>
    <style_modifiers>
        <texture>Editorial magazine layout, elegant serif fonts</texture>
        <lighting>Professional studio portrait lighting</lighting>
        <palette>Elegant, sophisticated, brand colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Busy background, small text, low quality photos</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. OFICINA - Workspace Vibes
export const TALENTO_OFICINA_PROMPT = `
<structural_instruction>
    <composition_type>Workspace Environment Shot</composition_type>
    <visual_hierarchy>
        <primary>Atmospheric shot of modern workspace or desk setup</primary>
        <secondary>Bokeh depth of field on background</secondary>
        <tertiary>"Your new desk awaits" overlay text</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_workspace>Interior environment as main image</zone_workspace>
        <zone_focus>Sharp focus on inviting desk area</zone_focus>
        <zone_text>Subtle centered text overlay</zone_text>
    </zoning_guide>
    <style_modifiers>
        <texture>Interior design photography, clean lines, plants</texture>
        <lighting>Natural window light, warm interior glow</lighting>
        <palette>Neutral tones, wood, greenery</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy cables, empty dark rooms, sterile hospital vibes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. EQUIPO - Team Group Shot
export const TALENTO_EQUIPO_PROMPT = `
<structural_instruction>
    <composition_type>Team Group Photo</composition_type>
    <visual_hierarchy>
        <primary>Dynamic group shot of diverse team members</primary>
        <secondary>"Join our team" or team identifier text</secondary>
        <tertiary>Brand logo and careers page URL</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_team>Full-width group photograph</zone_team>
        <zone_overlay>Text overlay with gradient for legibility</zone_overlay>
        <zone_cta>Careers link or apply button</zone_cta>
    </zoning_guide>
    <style_modifiers>
        <texture>Candid group photography, authentic moments</texture>
        <lighting>Natural or office lighting</lighting>
        <palette>Real environment colors, brand accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Stiff posed photos, missing diversity, fake smiles</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. REMOTO - Remote Work
export const TALENTO_REMOTO_PROMPT = `
<structural_instruction>
    <composition_type>Remote Work Lifestyle</composition_type>
    <visual_hierarchy>
        <primary>Aspirational remote work setup (home office, coffee shop, beach)</primary>
        <secondary>"Work from anywhere" messaging</secondary>
        <tertiary>Location flexibility indicators (globe, pins, map)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_lifestyle>Remote work environment image</zone_lifestyle>
        <zone_message>Flexibility messaging</zone_message>
        <zone_flexibility>Location icons or map elements</zone_flexibility>
    </zoning_guide>
    <style_modifiers>
        <texture>Lifestyle photography, aspirational spaces</texture>
        <lighting>Natural light, warm and inviting</lighting>
        <palette>Relaxed, warm, welcoming colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Claustrophobic small spaces, messy chaos</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. CRECIMIENTO - Career Growth
export const TALENTO_CRECIMIENTO_PROMPT = `
<structural_instruction>
    <composition_type>Career Growth Path</composition_type>
    <visual_hierarchy>
        <primary>Visual metaphor for growth (stairs, ladder, mountain, path)</primary>
        <secondary>"Grow with us" or career advancement messaging</secondary>
        <tertiary>Career milestone indicators</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_metaphor>Growth visual as hero</zone_metaphor>
        <zone_message>Advancement promise text</zone_message>
        <zone_milestones>Career stage indicators</zone_milestones>
    </zoning_guide>
    <style_modifiers>
        <texture>Inspirational, aspirational imagery</texture>
        <lighting>Upward, optimistic lighting</lighting>
        <palette>Progressive colors, rising energy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Dead ends, ceilings, stagnant imagery</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. VACANTE - Job Listing Card
export const TALENTO_VACANTE_PROMPT = `
<structural_instruction>
    <composition_type>Job Listing Card</composition_type>
    <visual_hierarchy>
        <primary>Role title prominently displayed</primary>
        <secondary>Key requirements bullets (location, experience, type)</secondary>
        <tertiary>"Apply Now" button and deadline if applicable</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_title>Job title as headline</zone_title>
        <zone_details>Quick info bullets</zone_details>
        <zone_action>Application CTA</zone_action>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean card UI, job board aesthetic</texture>
        <lighting>Flat, clear, professional</lighting>
        <palette>Brand colors, professional, trustworthy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Wall of text, missing key info, hard to scan</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. DIVERSIDAD - Inclusion Focus
export const TALENTO_DIVERSIDAD_PROMPT = `
<structural_instruction>
    <composition_type>Diversity & Inclusion Feature</composition_type>
    <visual_hierarchy>
        <primary>Diverse representation of team members</primary>
        <secondary>"Everyone belongs here" or inclusion messaging</secondary>
        <tertiary>ERG logos or DEI commitment badges</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_diversity>Diverse faces and representations</zone_diversity>
        <zone_message>Inclusion statement</zone_message>
        <zone_commitment>DEI badges or certifications</zone_commitment>
    </zoning_guide>
    <style_modifiers>
        <texture>Warm, authentic photography</texture>
        <lighting>Inclusive, welcoming, even lighting</lighting>
        <palette>Rainbow inclusion, warm welcoming tones</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Tokenism, staged diversity, exclusionary imagery</avoid>
    </negative_constraints>
</structural_instruction>
`

export const TALENTO_DESCRIPTION = 'Employer branding y atracción de talento. 11 composiciones para RRHH.'
