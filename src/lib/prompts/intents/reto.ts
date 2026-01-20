/**
 * RETO - El Reto (Challenges, concursos, sorteos)
 * Grupo: Engagement
 * 
 * Para retos virales, concursos, sorteos y competiciones.
 * Diseño que genera participación y viralidad.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const RETO_EXTENDED_DESCRIPTION = `
Diseño para retos virales, concursos, sorteos y competiciones.
Genera participación activa de la audiencia con mecánicas claras.
`.trim()

export const RETO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'headline',
        label: 'Título del Reto',
        placeholder: 'Ej: ¡Participa y Gana!',
        type: 'text',
        required: true,
        aiContext: 'Main challenge or contest title'
    },
    {
        id: 'prize',
        label: 'Premio',
        placeholder: 'Ej: iPhone 15 Pro',
        type: 'text',
        required: false,
        aiContext: 'What can be won'
    },
    {
        id: 'cta',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: Comenta para participar',
        type: 'text',
        required: false,
        aiContext: 'How to participate'
    }
]

// 1. VERSUS - Battle Split
export const RETO_VERSUS_PROMPT = `
<structural_instruction>
    <composition_type>Versus Battle Layout</composition_type>
    <visual_hierarchy>
        <primary>Dynamic diagonal split dividing two opponents or options</primary>
        <secondary>Large "VS" badge or lightning bolt at center intersection</secondary>
        <tertiary>Voting UI elements or poll bars at bottom</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>Contender A (cool tones: blue, teal)</zone_left>
        <zone_right>Contender B (warm tones: red, orange)</zone_right>
        <zone_center>Explosive "VS" typography</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Grunge, halftone, comic book energy</texture>
        <lighting>Clashing colored rim lights per side</lighting>
        <palette>High contrast complementary colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Peaceful static layout, monochrome, small VS text</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. SORTEO - Giveaway Prize
export const RETO_SORTEO_PROMPT = `
<structural_instruction>
    <composition_type>Giveaway Prize Hero</composition_type>
    <visual_hierarchy>
        <primary>The [PRIZE] floating in center with magical glow effect</primary>
        <secondary>"SORTEO" or "GIVEAWAY" bold 3D typography around it</secondary>
        <tertiary>Sparkles, gift box icons, and confetti as atmosphere</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_prize>Central floating prize object as hero</zone_prize>
        <zone_text>Orbiting announcement text</zone_text>
        <zone_particles>Celebration elements surrounding</zone_particles>
    </zoning_guide>
    <style_modifiers>
        <texture>Glossy, gold foil, celebration luxury</texture>
        <lighting>Jewelry lighting with starburst highlights</lighting>
        <palette>Gold, purple, celebratory luxury tones</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Dark gloomy atmosphere, hidden prize, cheap feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. BRACKET - Tournament Tree
export const RETO_BRACKET_PROMPT = `
<structural_instruction>
    <composition_type>Tournament Bracket Structure</composition_type>
    <visual_hierarchy>
        <primary>Stylized bracket/tournament tree with connecting lines</primary>
        <secondary>Empty or filled slots for participant names/avatars</secondary>
        <tertiary>Trophy icon at the final convergence point</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_structure>Branching bracket connection lines</zone_structure>
        <zone_slots>Card placeholders for participants</zone_slots>
        <zone_winner>Final winner spot with trophy</zone_winner>
    </zoning_guide>
    <style_modifiers>
        <texture>Tech grid, sports broadcast, esports graphics</texture>
        <lighting>Stadium or broadcast lighting aesthetic</lighting>
        <palette>Sports league colors, clean on dark</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Chaotic random placement, thin unreadable lines</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. RETO - Bold Dare Typography
export const RETO_ATREVETE_PROMPT = `
<structural_instruction>
    <composition_type>Bold Challenge Dare</composition_type>
    <visual_hierarchy>
        <primary>Aggressive screen-filling typography with the challenge</primary>
        <secondary>Gritty textures, distress marks, street art elements</secondary>
        <tertiary>"Accept Challenge" button or badge graphic</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_typography>Full canvas bold challenge text</zone_typography>
        <zone_texture>Street art, graffiti overlays</zone_texture>
        <zone_cta>Challenge acceptance button</zone_cta>
    </zoning_guide>
    <style_modifiers>
        <texture>Street art, torn poster, concrete, urban</texture>
        <lighting>Hard flash, vigilante mood</lighting>
        <palette>Black, white, neon warning colors (yellow, orange)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Elegant soft fonts, floral patterns, gentle feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. PODIO - Winners Display
export const RETO_PODIO_PROMPT = `
<structural_instruction>
    <composition_type>Winner Podium Layout</composition_type>
    <visual_hierarchy>
        <primary>Three-tiered victory podium structure (1st, 2nd, 3rd)</primary>
        <secondary>Spotlights beaming down on the #1 position</secondary>
        <tertiary>Confetti and celebration elements raining down</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_podium>Classic podium blocks (1, 2, 3 heights)</zone_podium>
        <zone_winners>Space for winner avatars/names on each tier</zone_winners>
        <zone_celebration>Confetti and spotlights from above</zone_celebration>
    </zoning_guide>
    <style_modifiers>
        <texture>Marble, gold plating, velvet carpet luxury</texture>
        <lighting>Stage lighting, volumetric fog</lighting>
        <palette>Gold #1, Silver #2, Bronze #3 medals</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Flat 2D graphics, boring grey boxes, no excitement</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. REGLAS - Contest Rules
export const RETO_REGLAS_PROMPT = `
<structural_instruction>
    <composition_type>Contest Rules Checklist</composition_type>
    <visual_hierarchy>
        <primary>Numbered steps 1-2-3 with large decorative numerals</primary>
        <secondary>Icons for each action (Like, Share, Tag, Comment)</secondary>
        <tertiary>Dotted lines or arrows connecting the steps</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>"How to Win" or "Cómo Participar" title</zone_header>
        <zone_steps>Vertical or horizontal flow of participation steps</zone_steps>
        <zone_icons>Action icons per step</zone_icons>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean vector, soft shadows, rounded UI cards</texture>
        <lighting>Soft, even, friendly illumination</lighting>
        <palette>Friendly, trustworthy, inviting colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Wall of text, confusing path, hard to follow</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. COUNTDOWN - Time Limited
export const RETO_COUNTDOWN_PROMPT = `
<structural_instruction>
    <composition_type>Countdown Timer Urgency</composition_type>
    <visual_hierarchy>
        <primary>Large countdown timer display (days/hours/minutes)</primary>
        <secondary>Challenge or prize visible behind/around timer</secondary>
        <tertiary>"Time is running out" urgency messaging</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_timer>Central countdown clock display</zone_timer>
        <zone_context>Challenge or prize context around timer</zone_context>
        <zone_urgency>Urgency message at bottom</zone_urgency>
    </zoning_guide>
    <style_modifiers>
        <texture>Digital display, flip clock, LED countdown</texture>
        <lighting>Self-luminous timer, urgent glow</lighting>
        <palette>High energy urgency colors (red, orange)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static feel, no urgency, missing deadline context</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. VIRAL - Social Challenge
export const RETO_VIRAL_PROMPT = `
<structural_instruction>
    <composition_type>Viral Social Challenge</composition_type>
    <visual_hierarchy>
        <primary>Hashtag prominently displayed as main graphic element</primary>
        <secondary>Example participation visual (person doing the challenge)</secondary>
        <tertiary>Social platform icons and "Join the challenge" CTA</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hashtag>Large # trend tag as hero</zone_hashtag>
        <zone_example>Visual showing participation example</zone_example>
        <zone_social>Platform icons and call to action</zone_social>
    </zoning_guide>
    <style_modifiers>
        <texture>TikTok/Instagram native, trend aesthetic</texture>
        <lighting>Ring light, creator lighting</lighting>
        <palette>Platform colors, trendy color schemes</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Dated aesthetics, unclear participation, missing hashtag</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. QUIZ - Trivia Challenge
export const RETO_QUIZ_PROMPT = `
<structural_instruction>
    <composition_type>Quiz Trivia Challenge</composition_type>
    <visual_hierarchy>
        <primary>Quiz question prominently displayed</primary>
        <secondary>Multiple choice answer options (A, B, C, D)</secondary>
        <tertiary>"Test your knowledge" or prize indication</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_question>Main quiz question at top</zone_question>
        <zone_options>Grid or list of answer choices</zone_options>
        <zone_cta>Participation or prize information</zone_cta>
    </zoning_guide>
    <style_modifiers>
        <texture>Game show, trivia night, knowledge competition</texture>
        <lighting>Bright game show lighting</lighting>
        <palette>Question show colors, distinct option colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Boring presentation, unclear options, missing game element</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. GANADOR - Winner Announcement
export const RETO_GANADOR_PROMPT = `
<structural_instruction>
    <composition_type>Winner Announcement</composition_type>
    <visual_hierarchy>
        <primary>Winner's name or avatar with spotlight/crown treatment</primary>
        <secondary>"CONGRATULATIONS" or "WINNER" headline</secondary>
        <tertiary>Prize image and celebration elements</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_winner>Spotlit winner identification (name/photo)</zone_winner>
        <zone_celebration>Congratulations headline and confetti</zone_celebration>
        <zone_prize>What they won displayed below</zone_prize>
    </zoning_guide>
    <style_modifiers>
        <texture>Award ceremony, lottery winner, celebration glory</texture>
        <lighting>Winner spotlight, golden glow</lighting>
        <palette>Gold, celebration colors, victory themes</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear winner, missing celebration, low energy</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. PARTICIPANTES - Entries Showcase
export const RETO_PARTICIPANTES_PROMPT = `
<structural_instruction>
    <composition_type>Participant Entries Showcase</composition_type>
    <visual_hierarchy>
        <primary>Grid or mosaic of participant entries/submissions</primary>
        <secondary>Counter or stats (X participants, X entries)</secondary>
        <tertiary>"Join the movement" or participation encouragement</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Mosaic of participant content</zone_grid>
        <zone_stats>Participation count or progress</zone_stats>
        <zone_cta>Encouragement to join</zone_cta>
    </zoning_guide>
    <style_modifiers>
        <texture>Community collage, UGC showcase</texture>
        <lighting>Varied (from participants) unified with overlay</lighting>
        <palette>Diverse entries with brand accent unification</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Empty grid, missing community feel, solo focus</avoid>
    </negative_constraints>
</structural_instruction>
`

export const RETO_DESCRIPTION = 'Diseño para retos, concursos y sorteos. 11 composiciones gamificadas para engagement.'
