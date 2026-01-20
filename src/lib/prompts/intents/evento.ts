/**
 * EVENTO - El Evento (Fecha y Lugar)
 * Grupo: Informar
 * 
 * Intent tipo cartel o flyer digital con jerarquía visual clara
 * para fecha, hora y lugar. Perfecto para webinars, inauguraciones, fiestas.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const EVENTO_EXTENDED_DESCRIPTION = `
Diseño tipo cartel o flyer digital. Jerarquía visual clara para fecha, 
hora y lugar. Perfecto para webinars, inauguraciones, directos o 
fiestas.
`.trim()

export const EVENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'event_name',
        label: 'Nombre del Evento',
        placeholder: 'Ej: Webinar de SEO',
        type: 'text',
        required: true,
        aiContext: 'Name of the event'
    },
    {
        id: 'date_time',
        label: 'Fecha y Hora',
        placeholder: 'Ej: 24 Oct, 18:00h',
        type: 'text',
        required: true,
        aiContext: 'Date and time details'
    },
    {
        id: 'location',
        label: 'Lugar / Link',
        placeholder: 'Ej: Zoom / Madrid',
        type: 'text',
        required: false,
        aiContext: 'Location or platform'
    }
]

// 1. CONFERENCIA - Professional Speaker
export const EVENTO_CONFERENCIA_PROMPT = `
<structural_instruction>
    <composition_type>Professional Conference Poster</composition_type>
    <visual_hierarchy>
        <primary>Large speaker portrait or event branding as hero visual</primary>
        <secondary>Cleanly stacked info block (Who, Where, When) with clear hierarchy</secondary>
        <tertiary>Footer with sponsor logos, registration URL, or social handles</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hero>Top 50% for speaker/branding visual</zone_hero>
        <zone_info>Middle 35% for structured text information</zone_info>
        <zone_footer>Bottom 15% for sponsors/registration</zone_footer>
    </zoning_guide>
    <style_modifiers>
        <texture>Professional photography, corporate elegance</texture>
        <lighting>Studio portrait lighting, clean backgrounds</lighting>
        <palette>Corporate blues, grays, whites, or brand primary</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Casual aesthetics, unstructured layouts, party vibes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. FIESTA - Nightlife Energy
export const EVENTO_FIESTA_PROMPT = `
<structural_instruction>
    <composition_type>Nightlife Party Flyer</composition_type>
    <visual_hierarchy>
        <primary>Event name in massive stylized typography with glow effects</primary>
        <secondary>Dynamic visuals: lights, crowd silhouettes, DJ booth, abstract energy</secondary>
        <tertiary>Date and lineup anchored in corners or edge banners</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_title>Center-dominant oversized event name</zone_title>
        <zone_visuals>Full-bleed atmospheric party imagery</zone_visuals>
        <zone_details>Corners/edges for date, DJs, venue info</zone_details>
    </zoning_guide>
    <style_modifiers>
        <texture>Electric, neon, glossy club photography</texture>
        <lighting>Strobe effects, laser beams, nightclub ambiance</lighting>
        <palette>Dark base with neon accents (pink, blue, purple, lime)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Corporate feel, daytime aesthetics, plain layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. TALLER - Workshop Learning
export const EVENTO_TALLER_PROMPT = `
<structural_instruction>
    <composition_type>Educational Workshop Invitation</composition_type>
    <visual_hierarchy>
        <primary>Inviting title with friendly illustration or photo of activity</primary>
        <secondary>Clear "What you'll learn" visual cues or bullet points</secondary>
        <tertiary>Boxed or highlighted area for date/time/location logistics</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>Welcoming title and topic graphic</zone_header>
        <zone_content>Learning outcomes or workshop preview</zone_content>
        <zone_logistics>Highlighted box for practical details</zone_logistics>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean, bright, educational materials feel</texture>
        <lighting>Bright, optimistic, classroom-friendly</lighting>
        <palette>Approachable colors, pastels with pops of energy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Intimidating layouts, corporate heaviness, party aesthetics</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. FESTIVAL - Artistic Cultural
export const EVENTO_FESTIVAL_PROMPT = `
<structural_instruction>
    <composition_type>Artistic Festival Poster</composition_type>
    <visual_hierarchy>
        <primary>Full artistic background (collage, painting, or abstract art)</primary>
        <secondary>Event name integrated into the artwork, following shapes</secondary>
        <tertiary>Prominent event logo and key dates as anchors</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_art>Full-bleed artistic canvas treatment</zone_art>
        <zone_text>Typography woven into visual composition</zone_text>
        <zone_identity>Corner or edge placement for logo/dates</zone_identity>
    </zoning_guide>
    <style_modifiers>
        <texture>Bohemian, artistic, texture-rich, handmade feel</texture>
        <lighting>Artistic interpretive lighting, not photographic</lighting>
        <palette>Colorful, eclectic, expressive color mixing</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Corporate layouts, stock photography, predictable compositions</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. NETWORKING - Connection Focus
export const EVENTO_NETWORKING_PROMPT = `
<structural_instruction>
    <composition_type>Community Networking Meetup</composition_type>
    <visual_hierarchy>
        <primary>Visual metaphor of connection (network lines, dots, avatars, overlapping circles)</primary>
        <secondary>Central hub with event title as the connecting node</secondary>
        <tertiary>Topic keywords or participant types at the periphery</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_network>Abstract connection pattern spanning canvas</zone_network>
        <zone_hub>Central event title as focal point</zone_hub>
        <zone_nodes>Distributed topic/specialty areas around edges</zone_nodes>
    </zoning_guide>
    <style_modifiers>
        <texture>Tech, digital, modern startup aesthetic</texture>
        <lighting>Screen-like glow, digital ambiance</lighting>
        <palette>Tech-friendly colors, blues, teals, gradient accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Isolated imagery, non-connected elements, old-school aesthetics</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. RESERVA - Save the Date Elegance
export const EVENTO_RESERVA_PROMPT = `
<structural_instruction>
    <composition_type>Elegant Save the Date</composition_type>
    <visual_hierarchy>
        <primary>Massive date or single iconic visual element as hero</primary>
        <secondary>Vast negative space creating exclusivity feel</secondary>
        <tertiary>Small, refined supporting text balanced by whitespace</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hero>Centralized date or iconic element</zone_hero>
        <zone_negative>70%+ dedicated to breathing room</zone_negative>
        <zone_details>Minimal footer for supporting info</zone_details>
    </zoning_guide>
    <style_modifiers>
        <texture>Premium paper, foil accents, invitation elegance</texture>
        <lighting>Soft, luxurious, gallery quality</lighting>
        <palette>Cream, gold, black, or sophisticated single accent</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cluttered details, casual aesthetics, crowded layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. VIRTUAL - Online Event
export const EVENTO_VIRTUAL_PROMPT = `
<structural_instruction>
    <composition_type>Virtual/Online Event Banner</composition_type>
    <visual_hierarchy>
        <primary>Digital platform indicator (Zoom, Teams, Live Stream graphic)</primary>
        <secondary>Speaker faces or screen interface mockup</secondary>
        <tertiary>Connection info, registration link, calendar add button</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_platform>Platform branding or video interface visual</zone_platform>
        <zone_speakers>Grid or featured speaker presentation</zone_speakers>
        <zone_join>Prominent "Join" or registration call-to-action</zone_join>
    </zoning_guide>
    <style_modifiers>
        <texture>Digital UI, screen-based, tech interface feel</texture>
        <lighting>Screen glow, webcam-friendly lighting</lighting>
        <palette>Platform colors integrated with brand, dark or light mode</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Physical venue imagery, outdoor settings, print-only layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. DEPORTIVO - Sports/Athletic Event
export const EVENTO_DEPORTIVO_PROMPT = `
<structural_instruction>
    <composition_type>Athletic Sports Event Poster</composition_type>
    <visual_hierarchy>
        <primary>Dynamic action shot or athlete in motion, high energy</primary>
        <secondary>Bold, impactful event title in athletic typeface</secondary>
        <tertiary>Date, location, and competition details</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_action>Dynamic sports imagery dominating composition</zone_action>
        <zone_title>Bold title treatment over or beside action</zone_title>
        <zone_info>Clear information strip for logistics</zone_info>
    </zoning_guide>
    <style_modifiers>
        <texture>Action photography, motion blur, athletic intensity</texture>
        <lighting>Dramatic stadium or outdoor lighting</lighting>
        <palette>High energy colors, team colors, competitive vibes</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static poses, gentle aesthetics, corporate layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. INAUGURACIÓN - Grand Opening
export const EVENTO_INAUGURACION_PROMPT = `
<structural_instruction>
    <composition_type>Grand Opening Celebration</composition_type>
    <visual_hierarchy>
        <primary>Ribbon cutting visual, golden scissors, or opening ceremony graphic</primary>
        <secondary>New location/venue exterior or interior preview</secondary>
        <tertiary>Exclusive opening offers or VIP access details</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_ceremony>Central ribbon or opening graphic</zone_ceremony>
        <zone_venue>Preview images of the new space</zone_venue>
        <zone_special>Banner for opening specials or invitations</zone_special>
    </zoning_guide>
    <style_modifiers>
        <texture>Celebratory, premium, festive with elegance</texture>
        <lighting>Bright, welcoming, grand reveal lighting</lighting>
        <palette>Gold, red, brand colors in celebration mode</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Regular business layouts, understated approach, casual vibes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. CONCIERTO - Music Performance
export const EVENTO_CONCIERTO_PROMPT = `
<structural_instruction>
    <composition_type>Concert Music Event Poster</composition_type>
    <visual_hierarchy>
        <primary>Artist/band image or iconic music visual (instruments, stage)</primary>
        <secondary>Massive artist name or show title in custom typography</secondary>
        <tertiary>Tour dates, venue, ticket info in organized hierarchy</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_artist>Dominant artist/band imagery</zone_artist>
        <zone_name>Bold typography treatment for the act</zone_name>
        <zone_dates>Organized tour/venue information section</zone_dates>
    </zoning_guide>
    <style_modifiers>
        <texture>Gig poster aesthetic, rock/pop/genre-appropriate style</texture>
        <lighting>Stage lighting, concert ambiance, spotlight drama</lighting>
        <palette>Genre-appropriate: dark for rock, neon for electronic, vintage for retro</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Corporate presentations, quiet aesthetics, text-heavy layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. AGENDA - Multi-Event Schedule
export const EVENTO_AGENDA_PROMPT = `
<structural_instruction>
    <composition_type>Multi-Event Schedule Layout</composition_type>
    <visual_hierarchy>
        <primary>Timeline or calendar view showing multiple scheduled events</primary>
        <secondary>Color-coded or icon-identified event categories</secondary>
        <tertiary>Individual event details in organized cards or rows</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_timeline>Vertical or horizontal event progression</zone_timeline>
        <zone_events>Individual event cards with consistent format</zone_events>
        <zone_legend>Category indicators or navigation elements</zone_legend>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean infographic, organized data visualization</texture>
        <lighting>Even, informational, clarity-focused</lighting>
        <palette>Color-coded system, clear visual hierarchy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Single event focus, chaotic timing, unclear schedule</avoid>
    </negative_constraints>
</structural_instruction>
`

export const EVENTO_DESCRIPTION = 'Diseño tipo cartel/flyer con jerarquía para destacar fecha, hora y lugar. 11 composiciones desde conferencia hasta festival.'
