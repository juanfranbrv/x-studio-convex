/**
 * EQUIPO - El Equipo (Personas y Cultura)
 * Grupo: Conectar
 * 
 * Diseño para humanizar la marca mostrando a las personas detrás.
 * Ideal para presentar nuevos miembros, cultura de empresa o aniversarios.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const EQUIPO_EXTENDED_DESCRIPTION = `
Diseño para humanizar la marca mostrando a las personas detrás. 
Ideal para presentar nuevos miembros, mostrar cultura de empresa 
o celebrar aniversarios de empleados.
`.trim()

export const EQUIPO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'member_name',
        label: 'Nombre(s)',
        placeholder: 'Ej: Ana y Carlos',
        type: 'text',
        required: true,
        aiContext: 'Names of team members'
    },
    {
        id: 'role',
        label: 'Rol / Cargo',
        placeholder: 'Ej: Equipo de Diseño',
        type: 'text',
        required: true,
        aiContext: 'Role or department'
    },
    {
        id: 'context',
        label: 'Contexto (Opcional)',
        placeholder: 'Ej: Bienvenidos',
        type: 'text',
        required: false,
        aiContext: 'Reason for the post (Welcome, Anniversary)'
    }
]

// 1. RETRATO - Professional Hero
export const EQUIPO_RETRATO_PROMPT = `
<structural_instruction>
    <composition_type>Professional Hero Portrait</composition_type>
    <visual_hierarchy>
        <primary>Large high-quality portrait of the person (left or center dominant)</primary>
        <secondary>Name and role aligned to clear space (right or bottom)</secondary>
        <tertiary>Brand accent element (thin line, geometric shape, logo)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_portrait>Dominant area for professional headshot</zone_portrait>
        <zone_info>Clear space for name, title, credentials</zone_info>
        <zone_brand>Subtle brand element or accent</zone_brand>
    </zoning_guide>
    <style_modifiers>
        <texture>Magazine profile, editorial portrait quality</texture>
        <lighting>Professional studio portrait lighting</lighting>
        <palette>Clean, trustworthy, brand-aligned colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Casual selfies, cluttered backgrounds, hidden faces</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. GRUPO - Team Group Shot
export const EQUIPO_GRUPO_PROMPT = `
<structural_instruction>
    <composition_type>Dynamic Group Shot</composition_type>
    <visual_hierarchy>
        <primary>Wide group photo of team members interacting or smiling</primary>
        <secondary>Gradient overlay at bottom for text legibility</secondary>
        <tertiary>"Meet the Team" or department name text overlay</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_photo>Full-width group photograph</zone_photo>
        <zone_overlay>Bottom gradient for text contrast</zone_overlay>
        <zone_title>Team identifier text at bottom center</zone_title>
    </zoning_guide>
    <style_modifiers>
        <texture>Candid group photography, authentic moments</texture>
        <lighting>Natural or event photography lighting</lighting>
        <palette>Warm community colors, inclusive feel</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Posed stiff photos, missing faces, poor lighting</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. MOSAICO - Portrait Grid
export const EQUIPO_MOSAICO_PROMPT = `
<structural_instruction>
    <composition_type>Portrait Grid Collage</composition_type>
    <visual_hierarchy>
        <primary>2x2 or 3x3 grid of individual portrait photos</primary>
        <secondary>Consistent treatment across all photos (colors, borders)</secondary>
        <tertiary>Unifying title "Our Experts" or "Dream Team" at top</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Evenly distributed portrait matrix</zone_grid>
        <zone_names>Optional name tags over or below each photo</zone_names>
        <zone_header>Team title spanning top of grid</zone_header>
    </zoning_guide>
    <style_modifiers>
        <texture>Diverse faces, consistent photo treatment</texture>
        <lighting>Matching lighting setup across all portraits</lighting>
        <palette>Unified color scheme, brand-consistent borders</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Inconsistent photo styles, varying sizes, missing unity</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. TESTIMONIO - Employee Quote
export const EQUIPO_TESTIMONIO_PROMPT = `
<structural_instruction>
    <composition_type>Employee Spotlight with Quote</composition_type>
    <visual_hierarchy>
        <primary>Portrait of employee (circular avatar or cutout) on one side</primary>
        <secondary>Large pull-quote about their work, passion, or philosophy</secondary>
        <tertiary>Name and role footer beneath the quote</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_photo>Employee portrait in contained shape</zone_photo>
        <zone_quote>Featured quote with quotation marks</zone_quote>
        <zone_credits>Name, title, tenure information</zone_credits>
    </zoning_guide>
    <style_modifiers>
        <texture>Interview style, insight piece, personal connection</texture>
        <lighting>Warm, approachable portrait lighting</lighting>
        <palette>Editorial colors, sophisticated but human</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Generic quotes, disconnected photo and text, cold feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. ACCIÓN - Candid Work Shot
export const EQUIPO_ACCION_PROMPT = `
<structural_instruction>
    <composition_type>Candid Action Shot</composition_type>
    <visual_hierarchy>
        <primary>Person actively working, presenting, or creating (in motion)</primary>
        <secondary>Slight blur or darkening on one side for text area</secondary>
        <tertiary>Caption describing the activity or achievement</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_action>Dynamic action photograph of work in progress</zone_action>
        <zone_overlay>Area prepared for text without obscuring action</zone_overlay>
        <zone_caption>Brief context about what's happening</zone_caption>
    </zoning_guide>
    <style_modifiers>
        <texture>Behind the scenes, authentic work moments</texture>
        <lighting>Natural workplace or event lighting</lighting>
        <palette>Real environment colors, documentary feel</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Posed photos, static situations, unclear activity</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. TARJETA - Digital Business Card
export const EQUIPO_TARJETA_PROMPT = `
<structural_instruction>
    <composition_type>Minimalist Profile Card</composition_type>
    <visual_hierarchy>
        <primary>Solid brand color or neutral card background</primary>
        <secondary>Circular avatar photo centered or offset</secondary>
        <tertiary>Name, role, and contact/social details in clean list</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_card>Clean card surface as canvas</zone_card>
        <zone_avatar>Profile picture in contained shape</zone_avatar>
        <zone_details>Name, title, contact information</zone_details>
    </zoning_guide>
    <style_modifiers>
        <texture>Digital business card, ID badge, clean minimal</texture>
        <lighting>Flat, no dramatic shadows</lighting>
        <palette>Brand colors, high legibility contrast</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cluttered info, inconsistent alignment, unclear hierarchy</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. BIENVENIDA - Welcome New Member
export const EQUIPO_BIENVENIDA_PROMPT = `
<structural_instruction>
    <composition_type>New Team Member Welcome</composition_type>
    <visual_hierarchy>
        <primary>"Welcome" or "Bienvenido/a" headline prominently displayed</primary>
        <secondary>New member's photo with warm framing or confetti</secondary>
        <tertiary>Brief intro text about their role and background</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_welcome>Large welcome message at top</zone_welcome>
        <zone_photo>New member portrait with celebratory framing</zone_photo>
        <zone_intro>Brief bio or fun facts about the newcomer</zone_intro>
    </zoning_guide>
    <style_modifiers>
        <texture>Celebratory but professional, first-day excitement</texture>
        <lighting>Warm, inviting, optimistic</lighting>
        <palette>Brand colors with celebration accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cold corporate feel, missing celebration, buried name</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. ANIVERSARIO - Work Anniversary
export const EQUIPO_ANIVERSARIO_PROMPT = `
<structural_instruction>
    <composition_type>Work Anniversary Celebration</composition_type>
    <visual_hierarchy>
        <primary>Years badge (5, 10, 15) with celebratory styling</primary>
        <secondary>Employee photo with milestone context</secondary>
        <tertiary>Thank you message and tenure timeline</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_years>Prominent anniversary number with decoration</zone_years>
        <zone_photo>Celebrant's portrait</zone_photo>
        <zone_thanks>Gratitude message and career highlights</zone_thanks>
    </zoning_guide>
    <style_modifiers>
        <texture>Milestone celebration, career achievement</texture>
        <lighting>Warm, appreciative, golden touches</lighting>
        <palette>Gold/silver anniversary colors with brand</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Generic graphics, missing years count, impersonal</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. DEPARTAMENTO - Team Section
export const EQUIPO_DEPARTAMENTO_PROMPT = `
<structural_instruction>
    <composition_type>Department Team Section</composition_type>
    <visual_hierarchy>
        <primary>Department name or function as headline ("Engineering Team")</primary>
        <secondary>Row or grid of team member avatars</secondary>
        <tertiary>Brief department mission or what they do</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_title>Department name with icon or illustration</zone_title>
        <zone_faces>Horizontal row or small grid of team photos</zone_faces>
        <zone_mission>Brief tagline about team's purpose</zone_mission>
    </zoning_guide>
    <style_modifiers>
        <texture>Org chart, team directory, section overview</texture>
        <lighting>Consistent across all member photos</lighting>
        <palette>Department color coding or brand consistent</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Too many faces crowded, unclear department, missing context</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. LIDERAZGO - Executive Profile
export const EQUIPO_LIDERAZGO_PROMPT = `
<structural_instruction>
    <composition_type>Executive Leadership Profile</composition_type>
    <visual_hierarchy>
        <primary>Professional executive portrait with authority framing</primary>
        <secondary>Name and C-suite/Director title prominently displayed</secondary>
        <tertiary>Brief vision statement or leadership philosophy quote</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_portrait>Executive headshot with premium composition</zone_portrait>
        <zone_title>Name and executive title with gravitas</zone_title>
        <zone_vision>Optional leadership quote or mission statement</zone_vision>
    </zoning_guide>
    <style_modifiers>
        <texture>Annual report, corporate leadership page quality</texture>
        <lighting>Executive portrait lighting, confident and trustworthy</lighting>
        <palette>Sophisticated, authority-projecting colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Casual photos, hidden titles, lacking gravitas</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. CULTURA - Culture Snapshot
export const EQUIPO_CULTURA_PROMPT = `
<structural_instruction>
    <composition_type>Company Culture Snapshot</composition_type>
    <visual_hierarchy>
        <primary>Candid office moment: celebration, collaboration, fun activity</primary>
        <secondary>Culture-related text overlay ("This is how we roll")</secondary>
        <tertiary>Company values or culture pillars subtly referenced</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_moment>Authentic culture moment photograph</zone_moment>
        <zone_message>Personality-driven text overlay</zone_message>
        <zone_values>Subtle reference to company values</zone_values>
    </zoning_guide>
    <style_modifiers>
        <texture>Instagram-worthy, authentic, human moments</texture>
        <lighting>Natural office or event lighting</lighting>
        <palette>Genuine environment colors, brand accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Staged stock photos, sterile office imagery, impersonal feel</avoid>
    </negative_constraints>
</structural_instruction>
`

export const EQUIPO_DESCRIPTION = 'Diseño para mostrar el lado humano del equipo. 11 composiciones desde retratos hasta cultura.'
