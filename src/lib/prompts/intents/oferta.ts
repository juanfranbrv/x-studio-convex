/**
 * OFERTA - Promoción o Descuento (Flash Sales)
 * Grupo: Vender
 * 
 * Intent para promociones de alto impacto. Diseñado para generar urgencia
 * y destacar descuentos, rebajas y ofertas especiales.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const OFERTA_EXTENDED_DESCRIPTION = `
Diseño de alto impacto visual enfocado en generar urgencia y destacar descuentos.
Prioriza la tipografía grande para porcentajes (%) o precios tachados.
Ideal para Rebajas, Black Friday o Promociones Flash.
`.trim()

export const OFERTA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'offer_title',
        label: 'Título de la Oferta',
        placeholder: 'Ej: REBAJAS DE VERANO',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main headline of the sale event'
    },
    {
        id: 'discount_value',
        label: 'Valor del Descuento',
        placeholder: 'Ej: -50%, 2x1, Desde 19€',
        type: 'text',
        required: true,
        aiContext: 'The numerical value or main deal hook (BIG TEXT)'
    },
    {
        id: 'urgency_text',
        label: 'Texto de Urgencia',
        placeholder: 'Ej: Solo 24 horas',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Secondary text creating urgency or valid dates'
    }
]

// 1. IMPACTO - Bold Central Discount
export const OFERTA_IMPACTO_PROMPT = `
<structural_instruction>
    <composition_type>Bold Central Impact</composition_type>
    <visual_hierarchy>
        <primary>Massive [DISCOUNT_VALUE] typography dominating 60% of the canvas</primary>
        <secondary>Dynamic burst shapes, starbursts, or explosion graphics radiating from discount</secondary>
        <tertiary>Supporting product imagery integrated around the central type</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_discount>Dead center, architectural scale numbers commanding attention</zone_discount>
        <zone_title>Top banner area for sale event name</zone_title>
        <zone_urgency>Bottom strip or badge for time-limited messaging</zone_urgency>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold 3D extruded typography, metallic or gradient fills</texture>
        <lighting>High contrast spotlight effect on numbers</lighting>
        <palette>High energy colors (Red, Yellow, Orange) or brand accent at maximum saturation</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Subtle approaching, hidden discounts, competing focal points</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. FLASH - Speed and Urgency
export const OFERTA_FLASH_PROMPT = `
<structural_instruction>
    <composition_type>Kinetic Speed Layout</composition_type>
    <visual_hierarchy>
        <primary>Lightning bolt motifs or speed lines converging on the [DISCOUNT]</primary>
        <secondary>Products appearing to fly or zoom across the canvas</secondary>
        <tertiary>Timer or countdown visual element creating urgency</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_streak>Diagonal motion lines from corner to corner</zone_streak>
        <zone_focal>Central intersection where speed lines meet (discount placement)</zone_focal>
        <zone_time>Corner badge or strip for "LIMITED TIME" messaging</zone_time>
    </zoning_guide>
    <style_modifiers>
        <texture>Motion blur on edges, sharp focus on discount value</texture>
        <lighting>Neon glow, electric sparks, high energy lighting</lighting>
        <palette>Electric blue, hot pink, cyber yellow - digital urgency colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static layouts, calm aesthetics, passive composition</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. ELEGANTE - Luxury Sale
export const OFERTA_ELEGANTE_PROMPT = `
<structural_instruction>
    <composition_type>Minimalist Luxury Discount</composition_type>
    <visual_hierarchy>
        <primary>Refined typography for [DISCOUNT] with elegant spacing</primary>
        <secondary>Single hero product on pedestal or floating with premium lighting</secondary>
        <tertiary>Subtle decorative accents (thin lines, geometric shapes)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_negative>70% dedicated to clean, breathing negative space</zone_negative>
        <zone_product>Product artfully placed in golden ratio position</zone_product>
        <zone_offer>Discrete corner or bottom placement for pricing details</zone_offer>
    </zoning_guide>
    <style_modifiers>
        <texture>Soft shadows, silk-like surfaces, premium materials feel</texture>
        <lighting>Gallery lighting, soft gradients, sophisticated ambiance</lighting>
        <palette>Monochrome base (black, cream, gray) with single accent</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Loud graphics, cluttered messaging, discount-store aesthetic</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. BUNDLE - Multi-Product Collection
export const OFERTA_BUNDLE_PROMPT = `
<structural_instruction>
    <composition_type>Bundle Collection Display</composition_type>
    <visual_hierarchy>
        <primary>Multiple products arranged in attractive grid or cluster formation</primary>
        <secondary>Prominent "PACK" or "BUNDLE" badge overlapping the arrangement</secondary>
        <tertiary>Price comparison visuals (original vs. bundle price)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_products>2x2 or 3x3 grid, or organic cluster at 70% of canvas</zone_products>
        <zone_badge>Circular or ribbon badge at intersection point</zone_badge>
        <zone_savings>Bottom strip showing total value vs. bundle price</zone_savings>
    </zoning_guide>
    <style_modifiers>
        <texture>Consistent product photography style across all items</texture>
        <lighting>Unified lighting direction for cohesive collection feel</lighting>
        <palette>Coordinated product colors or complementary arrangement</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Chaotic product placement, unclear bundle composition, missing value proposition</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. COUNTDOWN - Timer-Focused
export const OFERTA_COUNTDOWN_PROMPT = `
<structural_instruction>
    <composition_type>Countdown Timer Focus</composition_type>
    <visual_hierarchy>
        <primary>Digital countdown timer display (HH:MM:SS or Days/Hours) as hero element</primary>
        <secondary>Product or discount value in supporting position</secondary>
        <tertiary>Animated-feel elements suggesting time passing (hourglasses, clocks, sand)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_timer>Central or top-dominant position for countdown</zone_timer>
        <zone_deal>Below timer, the discount or product reveal</zone_deal>
        <zone_action>Clear CTA button placement at bottom</zone_action>
    </zoning_guide>
    <style_modifiers>
        <texture>LED display aesthetic, digital segments, tech interface feel</texture>
        <lighting>Screen glow, backlit numbers, urgency illumination</lighting>
        <palette>Dark backgrounds with bright timer digits (red, orange, green)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Hidden timer, no sense of urgency, unclear deadline</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. ESTACIONAL - Seasonal Theme
export const OFERTA_ESTACIONAL_PROMPT = `
<structural_instruction>
    <composition_type>Seasonal Atmospheric Sale</composition_type>
    <visual_hierarchy>
        <primary>Seasonal decorative elements framing the [DISCOUNT] (leaves, snowflakes, flowers, sun)</primary>
        <secondary>Products naturally integrated into the seasonal scene</secondary>
        <tertiary>Themed typography matching the season's mood</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_atmosphere>Border and corner decorations establishing season</zone_atmosphere>
        <zone_center>Clear central space for discount messaging</zone_center>
        <zone_products>Integrated product placement within the themed environment</zone_products>
    </zoning_guide>
    <style_modifiers>
        <texture>Organic seasonal textures (wood grain, frost, petals, sand)</texture>
        <lighting>Season-appropriate: warm summer glow, cool winter light, golden autumn</lighting>
        <palette>Seasonal color psychology: pastels for spring, warm for summer, earth for autumn, cool for winter</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Generic graphics, mismatched seasonal elements, conflicting themes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. PRECIO - Price Slash Focus
export const OFERTA_PRECIO_PROMPT = `
<structural_instruction>
    <composition_type>Crossed-Out Price Hero</composition_type>
    <visual_hierarchy>
        <primary>Large original price with dramatic slash/strikethrough, new price highlighted</primary>
        <secondary>Product image adjacent to the price comparison</secondary>
        <tertiary>Savings callout ("¡Ahorras X€!" or percentage saved)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_prices>Side-by-side or stacked price comparison at visual center</zone_prices>
        <zone_product>Hero product shot showing what you get</zone_product>
        <zone_savings>Badge or callout emphasizing the deal value</zone_savings>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean typography with impactful strikethrough graphic</texture>
        <lighting>Spotlight on new price, dimmed on old price</lighting>
        <palette>Old price in muted color, new price in vibrant highlight</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear price comparison, hidden savings, confusing value proposition</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. BANNER - Horizontal Strip
export const OFERTA_BANNER_PROMPT = `
<structural_instruction>
    <composition_type>Dynamic Sales Banner</composition_type>
    <visual_hierarchy>
        <primary>Horizontal strip layout optimized for web headers or story formats</primary>
        <secondary>Product on one end, discount on the other, creating visual flow</secondary>
        <tertiary>Animated-ready elements (arrows, sparkles, motion indicators)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>Product or brand logo anchoring one side</zone_left>
        <zone_center>Main sale message and discount spanning the middle</zone_center>
        <zone_right>CTA or arrow directing to action</zone_right>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean horizontal gradients, banner-optimized graphics</texture>
        <lighting>Even lighting across the banner, no heavy shadows</lighting>
        <palette>High contrast for banner visibility on various backgrounds</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Vertical-focused layouts, centered square compositions</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. EXPLOSIÓN - Burst Graphics
export const OFERTA_EXPLOSION_PROMPT = `
<structural_instruction>
    <composition_type>Explosive Burst Layout</composition_type>
    <visual_hierarchy>
        <primary>Central starburst or explosion graphic containing the [DISCOUNT]</primary>
        <secondary>Products radiating outward from the burst center</secondary>
        <tertiary>Flying particles, confetti, or firework elements</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_burst>Central radial pattern emanating from discount value</zone_burst>
        <zone_scatter>Products and elements distributed in explosion pattern</zone_scatter>
        <zone_ground>Bottom anchoring area for brand or CTA</zone_ground>
    </zoning_guide>
    <style_modifiers>
        <texture>Comic book pop art, action lines, halftone dots</texture>
        <lighting>Bright flash from center, dramatic shadows radiating outward</lighting>
        <palette>Pop art primaries, comic book bold colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Calm static layouts, subtle graphics, understated approach</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. COMPARATIVA - Before/After Value
export const OFERTA_COMPARATIVA_PROMPT = `
<structural_instruction>
    <composition_type>Split Comparison Layout</composition_type>
    <visual_hierarchy>
        <primary>Side-by-side or split-screen comparing "Before" vs "After" or "Without" vs "With" deal</primary>
        <secondary>Visual divider line or gradient transition between sides</secondary>
        <tertiary>Labels clearly identifying each side of the comparison</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_before>Left or top section showing original scenario (higher price, no deal)</zone_before>
        <zone_after>Right or bottom showing the deal advantage (lower price, more value)</zone_after>
        <zone_divider>Central line or gradient creating the split</zone_divider>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean contrast between the two halves</texture>
        <lighting>Dimmer on "before" side, brighter spotlight on "deal" side</lighting>
        <palette>Muted tones for before, vibrant for after/deal side</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Confusing comparison, unclear advantage, equal visual weight both sides</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. EXCLUSIVO - VIP/Members Only
export const OFERTA_EXCLUSIVO_PROMPT = `
<structural_instruction>
    <composition_type>VIP Exclusive Access Layout</composition_type>
    <visual_hierarchy>
        <primary>Premium badge, seal, or "EXCLUSIVE" label as status symbol</primary>
        <secondary>The special discount or offer details in refined presentation</secondary>
        <tertiary>Velvet rope, gold accents, or luxury framing elements</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_badge>Prominent VIP or exclusive seal at top or corner</zone_badge>
        <zone_offer>Central elegant presentation of the special deal</zone_offer>
        <zone_access>Bottom area for membership or access requirements</zone_access>
    </zoning_guide>
    <style_modifiers>
        <texture>Gold foil, embossed effects, premium materials</texture>
        <lighting>Luxury spotlight, champagne glow, exclusive ambiance</lighting>
        <palette>Black and gold, deep purple and silver, premium color combinations</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Mass-market aesthetic, discount store vibes, generic promotion feel</avoid>
    </negative_constraints>
</structural_instruction>
`

export const OFERTA_DESCRIPTION = 'Diseño de alto impacto para promociones, rebajas y descuentos. 11 composiciones desde urgencia flash hasta elegancia luxe.'
