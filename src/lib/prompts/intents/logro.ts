/**
 * LOGRO - El Logro (Milestone, celebración)
 * Grupo: Conectar
 * 
 * Para celebrar hitos importantes: aniversarios, seguidores alcanzados, 
 * premios o reconocimientos. Diseño festivo que transmite gratitud y orgullo.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const LOGRO_EXTENDED_DESCRIPTION = `
Para celebrar hitos importantes: aniversarios, seguidores alcanzados, 
premios o reconocimientos. Diseño festivo que transmite gratitud y 
orgullo sin perder la identidad de marca.
`.trim()

export const LOGRO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'milestone_number',
        label: 'Cifra o Logro Principal',
        placeholder: 'Ej: 10.000 seguidores / 5 años',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main milestone number or achievement'
    },
    {
        id: 'gratitude_message',
        label: 'Mensaje de Agradecimiento',
        placeholder: 'Ej: ¡Gracias por formar parte de esto!',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Thank you message to the community'
    },
    {
        id: 'celebration_context',
        label: 'Contexto Adicional',
        placeholder: 'Ej: Desde 2019 creciendo juntos',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Additional context about the achievement'
    }
]

// 1. NÚMERO - Big Data Hero
export const LOGRO_NUMERO_PROMPT = `
<structural_instruction>
    <composition_type>Big Number Hero</composition_type>
    <visual_hierarchy>
        <primary>Massive [MILESTONE_NUMBER] dominating 70% of the canvas</primary>
        <secondary>Metric label ("Followers", "Years", "Sales") positioned below</secondary>
        <tertiary>Thank you message or context in smaller supporting text</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_number>Center-dominant massive numerical display</zone_number>
        <zone_label>Directly below number explaining what it represents</zone_label>
        <zone_thanks>Bottom area for gratitude message</zone_thanks>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold, impactful, statistical pride aesthetic</texture>
        <lighting>High contrast spotlight on the number</lighting>
        <palette>Brand colors at maximum impact, clean background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small numbers, cluttered layouts, buried metrics</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. TROFEO - Achievement Object
export const LOGRO_TROFEO_PROMPT = `
<structural_instruction>
    <composition_type>Trophy/Award Object Display</composition_type>
    <visual_hierarchy>
        <primary>3D trophy, medal, plaque, or award object in dramatic center spotlight</primary>
        <secondary>Engraved or overlaid achievement text on or near the object</secondary>
        <tertiary>Golden/silver reflections and premium lighting effects</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_trophy>Central hero object with dramatic presentation</zone_trophy>
        <zone_inscription>Text integrated with or near the award</zone_inscription>
        <zone_glow>Radiating prestige lighting around edges</zone_glow>
    </zoning_guide>
    <style_modifiers>
        <texture>Metallic surfaces, polished finishes, premium materials</texture>
        <lighting>Dramatic rim lighting, golden reflections, cinematic</lighting>
        <palette>Gold, silver, bronze, or brand luxury colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cheap plastic look, flat lighting, generic graphics</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. CONFETI - Festive Explosion
export const LOGRO_CONFETI_PROMPT = `
<structural_instruction>
    <composition_type>Festive Celebration Explosion</composition_type>
    <visual_hierarchy>
        <primary>Falling confetti, streamers, and celebration particles filling the space</primary>
        <secondary>Clear central zone for "Thank You" or "We Did It" message</secondary>
        <tertiary>Dynamic movement and energy radiating from center</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_particles>Full-bleed celebration elements</zone_particles>
        <zone_message>Protected central area for clear text</zone_message>
        <zone_energy>Motion radiating outward from center</zone_energy>
    </zoning_guide>
    <style_modifiers>
        <texture>Paper confetti, metallic streamers, party materials</texture>
        <lighting>Joyful bright lighting, sparkles, camera flash feel</lighting>
        <palette>Brand colors mixed with gold/silver celebration accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Somber mood, static compositions, corporate feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. EQUIPO - Collective Success
export const LOGRO_EQUIPO_PROMPT = `
<structural_instruction>
    <composition_type>Team Celebration Layout</composition_type>
    <visual_hierarchy>
        <primary>Group celebration image (hands raised, team huddle, cheering)</primary>
        <secondary>Bold overlay text "TEAMWORK" or "GOAL REACHED"</secondary>
        <tertiary>"Thanks to everyone" or credits message at footer</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_people>Background human celebration imagery (can be blurred/filtered)</zone_people>
        <zone_overlay>Semi-transparent area for readable text</zone_overlay>
        <zone_credits>Bottom strip for acknowledgments</zone_credits>
    </zoning_guide>
    <style_modifiers>
        <texture>Human warmth, authentic celebration moments</texture>
        <lighting>Natural or event photography lighting</lighting>
        <palette>Warm, inclusive, emotionally connected colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Individual spotlight, cold aesthetics, impersonal graphics</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. SELLO - Luxury Certification
export const LOGRO_SELLO_PROMPT = `
<structural_instruction>
    <composition_type>Premium Certification Badge</composition_type>
    <visual_hierarchy>
        <primary>Elegant seal, badge, or certification mark as central element</primary>
        <secondary>"Certified", "Winner", or achievement designation text</secondary>
        <tertiary>Premium border treatment and official-feeling frame</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_seal>Central official-looking badge or emblem</zone_seal>
        <zone_title>Achievement title integrated with seal</zone_title>
        <zone_frame>Ornate or elegant border treatment</zone_frame>
    </zoning_guide>
    <style_modifiers>
        <texture>Embossed effects, foil stamping, certificate paper</texture>
        <lighting>Even, official, high-trust ambiance</lighting>
        <palette>Gold, navy, cream - official document colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Casual aesthetics, informal layouts, party vibes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. CAMINO - Timeline Milestone
export const LOGRO_CAMINO_PROMPT = `
<structural_instruction>
    <composition_type>Journey Progress Timeline</composition_type>
    <visual_hierarchy>
        <primary>Visual path, road, or timeline showing progress toward this milestone</primary>
        <secondary>Flag, marker, or waypoint at current achievement position</secondary>
        <tertiary>Previous milestones shown as smaller dots in the history</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_path>Curved or linear journey visualization</zone_path>
        <zone_current>Prominent marker for the achieved milestone</zone_current>
        <zone_history>Smaller indicators of past achievements</zone_history>
    </zoning_guide>
    <style_modifiers>
        <texture>Roadmap, growth chart, progress visualization</texture>
        <lighting>Bright spotlight on current milestone</lighting>
        <palette>Progressive color scheme showing journey advancement</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static single moment, no journey context, isolated achievement</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. ESTRELLA - Star Rating Achievement
export const LOGRO_ESTRELLA_PROMPT = `
<structural_instruction>
    <composition_type>Star Rating Celebration</composition_type>
    <visual_hierarchy>
        <primary>Five glowing stars or star-based achievement graphic</primary>
        <secondary>Rating score or review count prominently displayed</secondary>
        <tertiary>Customer/user testimonial or review quote</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_stars>Horizontal star display in hero position</zone_stars>
        <zone_score>Numerical rating beside or below stars</zone_score>
        <zone_proof>Quote or review count as social proof</zone_proof>
    </zoning_guide>
    <style_modifiers>
        <texture>Glowing, premium, review platform aesthetic</texture>
        <lighting>Golden star glow, backlit brilliance</lighting>
        <palette>Gold stars on dark or branded background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Dim stars, unclear ratings, missing social proof</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. PODIO - Winner's Platform
export const LOGRO_PODIO_PROMPT = `
<structural_instruction>
    <composition_type>Victory Podium Display</composition_type>
    <visual_hierarchy>
        <primary>Olympic-style podium with #1 position elevated and spotlit</primary>
        <secondary>Brand logo or achievement text on the winning pedestal</secondary>
        <tertiary>Medal, trophy, or crown adorning the winner's spot</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_podium>Classic three-tier podium structure</zone_podium>
        <zone_winner>First place (#1) with maximum visual emphasis</zone_winner>
        <zone_glory>Celebration elements around the winner spot</zone_glory>
    </zoning_guide>
    <style_modifiers>
        <texture>Marble, metal, or premium podium materials</texture>
        <lighting>Dramatic spotlight from above on first place</lighting>
        <palette>Gold for first, silver and bronze contextual</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Equal emphasis on all positions, losing focus on victory</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. GLOBOS - Party Balloons
export const LOGRO_GLOBOS_PROMPT = `
<structural_instruction>
    <composition_type>Balloon Celebration Float</composition_type>
    <visual_hierarchy>
        <primary>Colorful balloons floating upward carrying the achievement message</primary>
        <secondary>Milestone number or text tied to balloon strings</secondary>
        <tertiary>Party atmosphere with soft gradient sky background</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_balloons>Upper area with floating balloon cluster</zone_balloons>
        <zone_message>Hanging or attached text from balloon strings</zone_message>
        <zone_atmosphere>Sky-like gradient background</zone_atmosphere>
    </zoning_guide>
    <style_modifiers>
        <texture>Glossy balloon surfaces, helium-filled realism</texture>
        <lighting>Soft daylight, outdoor party feel</lighting>
        <palette>Mix of brand colors and party metallics</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Deflated look, grounded elements, indoor setting</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. SOCIAL - Platform Metrics
export const LOGRO_SOCIAL_PROMPT = `
<structural_instruction>
    <composition_type>Social Media Metric Celebration</composition_type>
    <visual_hierarchy>
        <primary>Platform-specific icons (heart, follower, like) in massive scale</primary>
        <secondary>Follower/Like count in prominent numerical display</secondary>
        <tertiary>Platform colors and UI elements as decoration</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_icon>Giant social platform icon or engagement graphic</zone_icon>
        <zone_count>Massive number showing the milestone</zone_count>
        <zone_platform>Subtle platform branding elements</zone_platform>
    </zoning_guide>
    <style_modifiers>
        <texture>Digital, social media native, UI-inspired</texture>
        <lighting>Screen glow, digital ambiance</lighting>
        <palette>Platform colors (Instagram gradient, Twitter blue, etc.)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Generic graphics, offline aesthetics, platform misrepresentation</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. ANIVERSARIO - Anniversary Badge
export const LOGRO_ANIVERSARIO_PROMPT = `
<structural_instruction>
    <composition_type>Anniversary Celebration Badge</composition_type>
    <visual_hierarchy>
        <primary>Years badge (5, 10, 25) with ornate anniversary styling</primary>
        <secondary>Company/brand history imagery or logo evolution</secondary>
        <tertiary>"Since [YEAR]" or founding story element</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_badge>Central anniversary number with decorative treatment</zone_badge>
        <zone_history>Timeline or evolution imagery around edges</zone_history>
        <zone_founding>Origin date or story element placement</zone_founding>
    </zoning_guide>
    <style_modifiers>
        <texture>Vintage meets modern, heritage celebration</texture>
        <lighting>Warm nostalgic with modern clarity</lighting>
        <palette>Brand colors with heritage gold/silver accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Generic number treatment, no history context, cold modernism</avoid>
    </negative_constraints>
</structural_instruction>
`

export const LOGRO_DESCRIPTION = 'Diseño celebratorio con cifra/logro protagonista. 11 composiciones desde festivas hasta elegantes.'
