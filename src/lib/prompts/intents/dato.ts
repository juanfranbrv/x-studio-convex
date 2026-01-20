/**
 * DATO - El Dato (Estadística, infografía)
 * Grupo: Educar
 * 
 * Para compartir estadísticas, datos curiosos o información numérica
 * relevante. El número es protagonista con contexto visual de apoyo.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const DATO_EXTENDED_DESCRIPTION = `
Para compartir estadísticas, datos curiosos o información numérica 
relevante para tu audiencia. El número es protagonista, acompañado 
de contexto visual que refuerza el mensaje.
`.trim()

export const DATO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'main_stat',
        label: 'Dato Principal',
        placeholder: 'Ej: 73%',
        type: 'text',
        required: true,
        aiContext: 'The main statistic or number to highlight'
    },
    {
        id: 'stat_context',
        label: 'Contexto del Dato',
        placeholder: 'Ej: de los consumidores prefieren marcas sostenibles',
        type: 'text',
        required: true,
        aiContext: 'What the statistic means or refers to'
    },
    {
        id: 'source',
        label: 'Fuente (opcional)',
        placeholder: 'Ej: Estudio Nielsen 2024',
        type: 'text',
        required: false,
        aiContext: 'Source or reference for the data'
    }
]

// 1. HÉROE - Big Stat Hero
export const DATO_HEROE_PROMPT = `
<structural_instruction>
    <composition_type>Big Number Hero</composition_type>
    <visual_hierarchy>
        <primary>Massive [STATISTIC] number dominating 60%+ of canvas</primary>
        <secondary>Context explanation text anchored below or beside</secondary>
        <tertiary>Source citation in discrete footer position</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_number>Center-dominating statistical figure</zone_number>
        <zone_context>Explanatory text in supporting position</zone_context>
        <zone_source>Small source attribution at bottom</zone_source>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold, authoritative, direct impact</texture>
        <lighting>High contrast spotlight on the number</lighting>
        <palette>Clean background, brand accent on number</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small numbers, hidden statistics, buried data</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. COMPARACIÓN - Side by Side
export const DATO_COMPARACION_PROMPT = `
<structural_instruction>
    <composition_type>Comparative Data Visualization</composition_type>
    <visual_hierarchy>
        <primary>Side-by-side or stacked comparison of two data points</primary>
        <secondary>Visual size difference (bar height, circle size) showing relationship</secondary>
        <tertiary>Clear labels identifying what each value represents</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_a>First data point with its visualization</zone_a>
        <zone_b>Second data point for comparison</zone_b>
        <zone_labels>Clear labeling for each entity</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>Analytical, precise, infographic quality</texture>
        <lighting>Even, informational, no drama</lighting>
        <palette>Distinct colors for each data series</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear comparison, equal sizing when values differ, misleading visuals</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. PROCESO - Sequential Flow
export const DATO_PROCESO_PROMPT = `
<structural_instruction>
    <composition_type>Sequential Process Flow</composition_type>
    <visual_hierarchy>
        <primary>Linear progression of 3-4 data points or steps</primary>
        <secondary>Connecting arrows, lines, or flow indicators</secondary>
        <tertiary>Icons or numbers marking each stage</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_flow>Left-to-right or top-to-bottom progression</zone_flow>
        <zone_steps>Individual step or data point zones</zone_steps>
        <zone_connections>Visual connectors between stages</zone_connections>
    </zoning_guide>
    <style_modifiers>
        <texture>Instructional, logical, process-oriented</texture>
        <lighting>Clear, even educational lighting</lighting>
        <palette>Progressive color scheme or numbered hierarchy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear flow direction, missing connections, chaotic layout</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. REJILLA - Multi-Stat Grid
export const DATO_REJILLA_PROMPT = `
<structural_instruction>
    <composition_type>Multi-Statistic Grid</composition_type>
    <visual_hierarchy>
        <primary>2x2 or 3x2 grid of key data points</primary>
        <secondary>Icons accompanying each statistic</secondary>
        <tertiary>Summary title spanning the composition top</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>Overall topic or summary title</zone_header>
        <zone_grid>Organized grid of stat cells</zone_grid>
        <zone_icons>Icon alongside each data point</zone_icons>
    </zoning_guide>
    <style_modifiers>
        <texture>Rich, informative, dashboard density</texture>
        <lighting>Even distribution, no single focal point</lighting>
        <palette>Consistent color system across all cells</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cramped cells, inconsistent sizing, missing context</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. DASHBOARD - Tech Metrics
export const DATO_DASHBOARD_PROMPT = `
<structural_instruction>
    <composition_type>Performance Dashboard Card</composition_type>
    <visual_hierarchy>
        <primary>Data displayed within stylized UI card element</primary>
        <secondary>Trend indicators (up arrow, growth sparkline)</secondary>
        <tertiary>Period context ("vs last month") and brand watermark</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_card>Floating card containing the metric</zone_card>
        <zone_trend>Visual growth or decline indicator</zone_trend>
        <zone_context>Time period or comparison reference</zone_context>
    </zoning_guide>
    <style_modifiers>
        <texture>SaaS, analytics, tech dashboard aesthetic</texture>
        <lighting>Screen glow, digital interface feel</lighting>
        <palette>Clean UI colors, green for growth, red for decline</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Print-only layouts, no trend context, static presentation</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. CIRCULAR - Pie/Donut Chart
export const DATO_CIRCULAR_PROMPT = `
<structural_instruction>
    <composition_type>Circular Data Visualization</composition_type>
    <visual_hierarchy>
        <primary>Large donut, pie, or ring chart as central graphic</primary>
        <secondary>Key percentage or total displayed in ring center</secondary>
        <tertiary>Floating legend labels pointing to segments</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_ring>Circular chart dominating center</zone_ring>
        <zone_center>Summary stat inside the donut</zone_center>
        <zone_labels>Segment legends around the chart</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>Geometric, modern, abstract data art</texture>
        <lighting>Clean, even, infographic clarity</lighting>
        <palette>Distinct segment colors, harmonious scheme</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Too many segments, unclear percentages, cluttered center</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. BARRA - Bar Chart Style
export const DATO_BARRA_PROMPT = `
<structural_instruction>
    <composition_type>Bar Chart Visualization</composition_type>
    <visual_hierarchy>
        <primary>Horizontal or vertical bars showing comparative values</primary>
        <secondary>Value labels at end of each bar</secondary>
        <tertiary>Category labels identifying each bar</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_bars>Main area for bar chart display</zone_bars>
        <zone_values>Number labels on or near bars</zone_values>
        <zone_categories>Axis labels for categories</zone_categories>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean chart graphics, professional data viz</texture>
        <lighting>Even, readable, no artistic effects</lighting>
        <palette>Distinct bar colors or gradient within category</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Misleading proportions, missing labels, crowded bars</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. ICONO - Icon-Led Stats
export const DATO_ICONO_PROMPT = `
<structural_instruction>
    <composition_type>Icon-Driven Statistic</composition_type>
    <visual_hierarchy>
        <primary>Large representative icon as visual anchor (💰, 📈, 🌍)</primary>
        <secondary>Statistic number positioned prominently near icon</secondary>
        <tertiary>Context text explaining what the icon+number means</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_icon>Large icon or illustration as visual center</zone_icon>
        <zone_stat>Number displayed in relation to icon</zone_stat>
        <zone_explain>Brief context beneath or beside</zone_explain>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold illustration, clear iconography</texture>
        <lighting>Clean, icon-focused presentation</lighting>
        <palette>Icon colors integrated with brand palette</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small icons, disconnected number and icon, confusing symbols</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. TIMELINE - Historical Data
export const DATO_TIMELINE_PROMPT = `
<structural_instruction>
    <composition_type>Historical Timeline Data</composition_type>
    <visual_hierarchy>
        <primary>Horizontal timeline with data points at key dates</primary>
        <secondary>Visual markers showing progression or change over time</secondary>
        <tertiary>Date labels and milestone values</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_line>Central timeline spine</zone_line>
        <zone_points>Data markers at specific dates</zone_points>
        <zone_labels>Date and value annotations</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>Historical progression, growth story visualization</texture>
        <lighting>Even, documentary clarity</lighting>
        <palette>Progressive or chronological color scheme</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Confusing time flow, crowded points, unclear progression</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. MAPA - Geographic Data
export const DATO_MAPA_PROMPT = `
<structural_instruction>
    <composition_type>Geographic Data Map</composition_type>
    <visual_hierarchy>
        <primary>Map outline with highlighted regions or marked locations</primary>
        <secondary>Data callouts or heat intensity showing regional values</secondary>
        <tertiary>Legend explaining the color/mark meanings</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_map>Geographic map as main visual</zone_map>
        <zone_highlights>Colored regions or location pins</zone_highlights>
        <zone_legend>Color/symbol legend for interpretation</zone_legend>
    </zoning_guide>
    <style_modifiers>
        <texture>Cartographic, geographic data visualization</texture>
        <lighting>Flat, map-appropriate, no 3D effects</lighting>
        <palette>Heat map gradients or categorical region colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cluttered maps, missing legend, unreada ble labels</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. CONTADOR - Counter/Ticker
export const DATO_CONTADOR_PROMPT = `
<structural_instruction>
    <composition_type>Live Counter Display</composition_type>
    <visual_hierarchy>
        <primary>Digital counter or ticker-style number display</primary>
        <secondary>Animated feel with number segments or flip display</secondary>
        <tertiary>Context label explaining what's being counted</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_counter>Central counter number display</zone_counter>
        <zone_digits>Individual digit segments or flip panels</zone_digits>
        <zone_label>Metric label below counter</zone_label>
    </zoning_guide>
    <style_modifiers>
        <texture>LED display, flip clock, scoreboard aesthetic</texture>
        <lighting>Self-luminous digits, backlit panels</lighting>
        <palette>Digital display colors (red LED, green, amber)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static feel, non-counter typography, no animation suggestion</avoid>
    </negative_constraints>
</structural_instruction>
`

export const DATO_DESCRIPTION = 'Infografía para destacar números, estadísticas o procesos. 11 composiciones de visualización de datos.'
