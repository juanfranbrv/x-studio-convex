/**
 * PREGUNTA - La Pregunta (Q&A, genera comentarios)
 * Grupo: Engagement
 * 
 * Diseñado para provocar interacción y comentarios. La pregunta domina
 * el diseño, invitando a la audiencia a participar.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const PREGUNTA_EXTENDED_DESCRIPTION = `
Diseñado para provocar interacción y comentarios. La pregunta domina 
el diseño, invitando a la audiencia a participar. Perfecto para 
encuestas informales, opiniones o conversación.
`.trim()

export const PREGUNTA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'question_text',
        label: 'La Pregunta',
        placeholder: 'Ej: ¿Qué prefieres: café o té?',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main question to ask the audience'
    },
    {
        id: 'options',
        label: 'Opciones de Respuesta',
        placeholder: 'Ej: A) Café  B) Té  C) Ambos',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Answer options if its a poll-style question'
    },
    {
        id: 'call_to_action',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: ¡Cuéntanos en comentarios!',
        type: 'text',
        required: false,
        optional: true,
        mapsTo: 'cta',
        aiContext: 'Instruction for how to respond'
    }
]

// 1. IMPACTO - Big Type Question
export const PREGUNTA_IMPACTO_PROMPT = `
<structural_instruction>
    <composition_type>Typographic Impact Question</composition_type>
    <visual_hierarchy>
        <primary>The [QUESTION] text as absolute visual dominant (70%+ of canvas)</primary>
        <secondary>Solid vibrant background color or subtle abstract pattern</secondary>
        <tertiary>Small anchored CTA "Reply below" or comment icon</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_question>Center-dominating massive question text</zone_question>
        <zone_background>Bold color field or gradient</zone_background>
        <zone_cta>Bottom corner call-to-action element</zone_cta>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold, clean, high impact typography</texture>
        <lighting>Even, no shadows, poster-like clarity</lighting>
        <palette>High contrast brand colors, impossible to ignore</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small question text, busy backgrounds, buried message</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. VERSUS - This vs That
export const PREGUNTA_VERSUS_PROMPT = `
<structural_instruction>
    <composition_type>Visual Comparison Poll</composition_type>
    <visual_hierarchy>
        <primary>Split screen with two distinct options (A vs B)</primary>
        <secondary>Central "VS" badge or dividing element</secondary>
        <tertiary>Clear labels for each option ("Coffee" vs "Tea")</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>Option A with its visual and label</zone_left>
        <zone_right>Option B with its visual and label</zone_right>
        <zone_center>"VS" or conflict indicator at the junction</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Gamified, competitive, high contrast between options</texture>
        <lighting>Equal dramatic lighting on both options</lighting>
        <palette>Contrasting colors for each option, clear differentiation</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear options, biased visuals, hidden second choice</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. CHAT - Conversation Bubble
export const PREGUNTA_CHAT_PROMPT = `
<structural_instruction>
    <composition_type>Digital Conversation Aesthetic</composition_type>
    <visual_hierarchy>
        <primary>Message bubble containing the question in chat interface style</primary>
        <secondary>Avatar or asker identity placeholder</secondary>
        <tertiary>Visual "text input field" or typing indicator suggesting response</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_bubble>Speech bubble with question text</zone_bubble>
        <zone_avatar>Small profile picture or icon of asker</zone_avatar>
        <zone_input>Bottom suggestion of "type your answer" interface</zone_input>
    </zoning_guide>
    <style_modifiers>
        <texture>Social media native, messaging app aesthetic</texture>
        <lighting>Screen-like glow, digital clarity</lighting>
        <palette>iOS/Android message colors or brand equivalent</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Old-school graphics, non-digital feel, static layout</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. QUIZ - Multiple Choice
export const PREGUNTA_QUIZ_PROMPT = `
<structural_instruction>
    <composition_type>Quiz Show Interface</composition_type>
    <visual_hierarchy>
        <primary>Question header prominently at top</primary>
        <secondary>Grid of 3-4 answer option cards or buttons</secondary>
        <tertiary>One option potentially highlighted (hover state) or all equal</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_question>Top header with quiz question</zone_question>
        <zone_options>Grid layout for answer choices (A, B, C, D)</zone_options>
        <zone_highlight>Visual emphasis on selectable nature</zone_highlight>
    </zoning_guide>
    <style_modifiers>
        <texture>Game show, trivia night, playful educational</texture>
        <lighting>Studio game lighting, bright and engaging</lighting>
        <palette>Colorful option differentiation, quiz show energy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cramped options, unclear reading order, boring presentation</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. DEBATE - Thought Provoking
export const PREGUNTA_DEBATE_PROMPT = `
<structural_instruction>
    <composition_type>Serious Discussion Layout</composition_type>
    <visual_hierarchy>
        <primary>Provocative or thematic imagery filling background</primary>
        <secondary>Semi-transparent overlay containing the question</secondary>
        <tertiary>"What do you think?" or "Share your opinion" prompt</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_image>Full-bleed atmospheric or controversial imagery</zone_image>
        <zone_overlay>Readable text area with contrast from image</zone_overlay>
        <zone_prompt>Footer invitation to share thoughts</zone_prompt>
    </zoning_guide>
    <style_modifiers>
        <texture>Editorial, opinion piece, magazine quality</texture>
        <lighting>Moody, thought-provoking ambiance</lighting>
        <palette>Deeper, sophisticated colors, intellectual feel</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Frivolous aesthetics, party vibes, lighthearted treatment</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. PENSAMIENTO - Introspective
export const PREGUNTA_PENSAMIENTO_PROMPT = `
<structural_instruction>
    <composition_type>Introspective Thought Layout</composition_type>
    <visual_hierarchy>
        <primary>Abstract "thinking" shapes: lightbulb, brain, thought cloud, head silhouette</primary>
        <secondary>Question text floating in open "thought space"</secondary>
        <tertiary>Subtle particles or connections suggesting mental activity</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_symbol>Abstract thinking icon or illustration</zone_symbol>
        <zone_space>Open canvas area for contemplation</zone_space>
        <zone_question>Question integrated into the ethereal space</zone_question>
    </zoning_guide>
    <style_modifiers>
        <texture>Abstract, soft, intellectual, philosophical</texture>
        <lighting>Soft diffused, dreamlike, cerebral</lighting>
        <palette>Soft colors, light airy tones, spacious feel</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Loud graphics, urgent aesthetics, action-oriented</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. ENCUESTA - Poll Bars
export const PREGUNTA_ENCUESTA_PROMPT = `
<structural_instruction>
    <composition_type>Poll Results Bar Layout</composition_type>
    <visual_hierarchy>
        <primary>Horizontal progress bars showing poll options</primary>
        <secondary>Question text at top establishing the poll</secondary>
        <tertiary>Percentage or vote count labels on each bar</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_question>Header area with the poll question</zone_question>
        <zone_bars>Stacked horizontal bars for each option</zone_bars>
        <zone_results>Percentage or count display per option</zone_zone>
    </zoning_guide>
    <style_modifiers>
        <texture>Data visualization, Instagram/Twitter poll aesthetic</texture>
        <lighting>Clean, UI-style, dashboard clarity</lighting>
        <palette>Gradient bars, result visualization colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>No visual hierarchy between options, confusing charts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. EMOJI - Reaction Scale
export const PREGUNTA_EMOJI_PROMPT = `
<structural_instruction>
    <composition_type>Emoji Reaction Scale</composition_type>
    <visual_hierarchy>
        <primary>Row of emoji faces representing scale (😢 to 🤩)</primary>
        <secondary>Question about rating or feeling at top</secondary>
        <tertiary>Labels or numbers below each emoji option</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_question>Top area with "How do you feel about..."</zone_question>
        <zone_emojis>Horizontal emoji scale from negative to positive</zone_emoji>
        <zone_labels>Scale indicators (1-5 or descriptive labels)</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>Playful, Gen-Z friendly, approachable</texture>
        <lighting>Bright, fun, social media native</lighting>
        <palette>Colorful emoji colors, fun gradient backgrounds</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Text-only scales, serious corporate feel, complex interface</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. RELLENO - Fill in the Blank
export const PREGUNTA_RELLENO_PROMPT = `
<structural_instruction>
    <composition_type>Fill in the Blank Game</composition_type>
    <visual_hierarchy>
        <primary>Statement with visible blank line or underscore for audience to complete</primary>
        <secondary>Visual cues suggesting writing/filling (pen, cursor)</secondary>
        <tertiary>Example answer or hint if appropriate</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_statement>Sentence with prominent blank space "_____"</zone_statement>
        <zone_blank>Highlighted empty field inviting completion</zone_blank>
        <zone_hint>Optional small hint or example answer</zone_hint>
    </zoning_guide>
    <style_modifiers>
        <texture>Worksheet, Mad Libs, interactive exercise feel</texture>
        <lighting>Clean, classroom-friendly brightness</lighting>
        <palette>Paper/pen colors or playful fills</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Completed answers visible, no blank space, closed question</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. SLIDER - Rate Scale
export const PREGUNTA_SLIDER_PROMPT = `
<structural_instruction>
    <composition_type>Slider Rating Interface</composition_type>
    <visual_hierarchy>
        <primary>Horizontal slider bar with draggable indicator</primary>
        <secondary>Scale endpoints with extreme labels ("Never" to "Always")</secondary>
        <tertiary>Question prompting the rating above the slider</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_question>Rating question at top of composition</zone_question>
        <zone_slider>Interactive-looking slider bar in center</zone_slider>
        <zone_labels>Extreme labels at each end of the scale</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>UI design, app interface, Stories slider aesthetic</texture>
        <lighting>Screen-like glow, interactive element highlight</lighting>
        <palette>Gradient slider tracks, branded thumb/indicator</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static appearance, non-interactive feel, confusing scale</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. CONTROVERSIAL - Hot Take
export const PREGUNTA_CONTROVERSIAL_PROMPT = `
<structural_instruction>
    <composition_type>Hot Take Controversial Statement</composition_type>
    <visual_hierarchy>
        <primary>Bold controversial statement or unpopular opinion as main text</primary>
        <secondary>Fire, hot, or heated visual elements suggesting controversy</secondary>
        <tertiary>"Agree or Disagree?" or "Fight me in comments" prompt</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_statement>Central bold statement meant to provoke</zone_statement>
        <zone_heat>Fire, flames, hot graphics around edges</zone_heat>
        <zone_challenge>Call to action challenging audience response</zone_challenge>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold, aggressive, attention-grabbing</texture>
        <lighting>Dramatic, high contrast, intense</lighting>
        <palette>Hot colors (red, orange), angry emoji vibes</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Mild statements, calm aesthetics, polite framing</avoid>
    </negative_constraints>
</structural_instruction>
`

export const PREGUNTA_DESCRIPTION = 'Diseño para fomentar la participación mediante preguntas, encuestas y debates. 11 composiciones interactivas.'
