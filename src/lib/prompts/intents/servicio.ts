export const SERVICIO_DESCRIPTION = 'Features, benefits, pricing tables, and service lists.'
export const SERVICIO_EXTENDED_DESCRIPTION = 'Showcase services, features, pricing options, and value propositions clearly.'

export const SERVICIO_REQUIRED_FIELDS = ['headline', 'service_list', 'cta']

// 1. FEATURE GRID - Modern Bento Layout
export const SERVICIO_GRID_PROMPT = `
<structural_instruction>
    <composition_type>Modular Bento Grid</composition_type>
    <visual_hierarchy>
        <primary>A structured [BENTO_GRID] layout with varied cell sizes (1x1, 2x1, 1x2)</primary>
        <secondary>Floating 3D micro-elements or glass icons anchored within specific cells</secondary>
        <tertiary>Unified subtle background mesh connecting the modules</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Asymmetrical grid layout following a loose Golden Rectangle division</zone_grid>
        <zone_focal>Largest module (top-left or center) holds the key value proposition</zone_focal>
    </zoning_guide>
    <style_modifiers>
        <texture>Frosted glass, soft inner glow, premium acrylic borders</texture>
        <lighting>Softbox studio lighting, diffused global illumination</lighting>
        <palette>Monochromatic brand base with one vibrant accent color for active elements</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Traditional spreadsheet look, rigid symmetry, visual clutter</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. BENEFIT HERO - Asymmetrical Split
export const SERVICIO_BENEFIT_PROMPT = `
<structural_instruction>
    <composition_type>Asymmetrical Split Screen</composition_type>
    <visual_hierarchy>
        <primary>High-fidelity visual metaphor of the [KEY_BENEFIT] occupying 60% of the canvas</primary>
        <secondary>Bold typography occupying the remaining 40% negative space</secondary>
        <tertiary>Subtle directional lines pointing from text to visual</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_visual>Right or Bottom-Right sector (heavy visual weight)</zone_visual>
        <zone_text>Left or Top-Left sector (clean negative space for copy)</zone_text>
        <vector_flow>Diagonal eye movement intended from Headline -> Visual Detail</vector_flow>
    </zoning_guide>
    <style_modifiers>
        <texture>Smooth 3D render, subsurface scattering on hero objects</texture>
        <lighting>Golden hour warm rim light vs cool fill light (complementary contrast)</lighting>
        <palette>Rich, optimistic hues (greens, oranges, or brand warmth)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>50/50 boring split, flat 2D illustration, overlapping text on busy backgrounds</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. PRICING TABLE - Central Hierarchy
export const SERVICIO_PRICING_PROMPT = `
<structural_instruction>
    <composition_type>Central Triptych Focus</composition_type>
    <visual_hierarchy>
        <primary>Central [PRICING_CARD] elevated, 1.2x scale, brightest illumination</primary>
        <secondary>Flanking cards (Basic/Enterprise) pushed slightly back in Z-depth</secondary>
        <tertiary>crown or ribbon element distinguishing the "Best Value" center</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_foreground>Center column, sharp focus, high contrast</zone_foreground>
        <zone_midground>Side columns, slightly lower contrast</zone_midground>
        <zone_background>Abstract depth cues to show separation</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean UI layers, subtle drop shadows, cards floating in space</texture>
        <lighting>Top-down spotlight highlighting the center, ambient fill for sides</lighting>
        <palette>Desaturated sides, fully saturated brand primary color for center</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Flat alignment, equal weight for all options, hard grids</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. STEP FLOW - Z-Pattern Journey
export const SERVICIO_PROCESS_PROMPT = `
<structural_instruction>
    <composition_type>Z-Pattern Process Flow</composition_type>
    <visual_hierarchy>
        <primary>A clear fluid path or "pipeline" connecting steps [STEP_1] -> [STEP_2] -> [STEP_3]</primary>
        <secondary>Floating milestones (spheres, cubes, or icons) at key turns of the path</secondary>
        <tertiary>Motion lines or particles indicating forward momentum</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <vector_path>Visual flow starting Top-Left, moving through center, ending Bottom-Right</vector_path>
        <zone_steps>Evenly distributed waypoints along the Z-curve</zone_steps>
    </zoning_guide>
    <style_modifiers>
        <texture>Matte 3D shapes, smooth gradients on flow lines</texture>
        <lighting>Volumetric lighting shafts, dynamic energy</lighting>
        <palette>Progressive color shift (e.g., Blue to Purple to Pink)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static vertical list, disconnected floating islands, confusing direction</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. SERVICE LIST - Vertical Rhythm (PRUEBA: Versión Markdown vs XML)
export const SERVICIO_LIST_PROMPT = `
## Composición: Lista Vertical de Servicios

**Estilo general:** Diseño tipo app premium con mucho espacio en blanco y tipografía limpia.

### Jerarquía visual:
1. **Protagonista:** Iconos de alta calidad alineados a la izquierda, actuando como anclas visuales
2. **Secundario:** Bloques de texto claros y legibles junto a cada icono
3. **Detalle:** Líneas divisorias sutiles o planos alternados para separar elementos

### Composición:
- Espaciado vertical consistente, creando un ritmo visual armonioso
- Margen izquierdo generoso para la iconografía
- Luz difusa y ambiental, sin sombras duras

### Paleta:
Colores profesionales y de confianza. Alto contraste del texto sobre fondo claro.

### Evitar:
Muros de texto, espaciado desordenado, estilos de iconos inconsistentes.
`

// 6. TRUST / GUARANTEE - Radial Authority
export const SERVICIO_TRUST_PROMPT = `
<structural_instruction>
    <composition_type>Radial Central Focus</composition_type>
    <visual_hierarchy>
        <primary>Massive, detailed [TRUST_SEAL] or Shield centered in the frame</primary>
        <secondary>Concentric rings of light, laurels, or particles radiating outward</secondary>
        <tertiary>Blurred contextual office or handshake elements in deep background</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>The "Bullseye" - extreme detail and focus</zone_center>
        <zone_periphery>Rapid fall-off in focus (Depth of Field effect) to frame the center</zone_periphery>
    </zoning_guide>
    <style_modifiers>
        <texture>Metallics (Gold/Silver/Platinum), glass caustics, embossed details</texture>
        <lighting>Cinematic rim lighting, starburst reflections</lighting>
        <palette>Precious metals, deep royal background colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cartoonish badge, flat sticker look, cluttered background</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. ECOSYSTEM - Hub & Spoke Connectivity
export const SERVICIO_ECOSYSTEM_PROMPT = `
<structural_instruction>
    <composition_type>Radial Hub & Spoke</composition_type>
    <visual_hierarchy>
        <primary>Central Core Sphere representing the [MAIN_PLATFORM]</primary>
        <secondary>Orbiting satellites or nodes connected by glowing data filaments</secondary>
        <tertiary>Data flowing through the connections (particles/light pulses)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_nucleus>Center of canvas, highest density and brightness</zone_nucleus>
        <zone_orbit>Circular arrangement of feature icons around the nucleus</zone_orbit>
    </zoning_guide>
    <style_modifiers>
        <texture>Holographic projections, wireframes, cybernetic slickness</texture>
        <lighting>Internal glow, dark void background with neon highlights</lighting>
        <palette>Cyberpunk neons (Cyan, Magenta) on deep void blacks</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy spiderweb, disconnected dots, flat 2D network chart</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. DATA STAT - Typography Hero
export const SERVICIO_STAT_PROMPT = `
<structural_instruction>
    <composition_type>Typographic Hero</composition_type>
    <visual_hierarchy>
        <primary>Massive, architectural 3D Typography for the [KEY_STAT] (e.g. "99%")</primary>
        <secondary>A trend line or growth graph weaving through the 3D text numbers</secondary>
        <tertiary>Small caption text sitting on the "ledge" of the giant numbers</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hero>Fills 80% of the vertical space, centered or slightly left-heavy</zone_hero>
        <zone_context>Remaining negative space for explanation</zone_context>
    </zoning_guide>
    <style_modifiers>
        <texture>Concrete, matte plastic, or monumental stone</texture>
        <lighting>High-contrast architectural lighting (long shadows)</lighting>
        <palette>Bold monochrome or high-contrast duotone</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Thin unreadable fonts, standard Excel charts, boring white paper look</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. MINIMAL HERO - Productization
export const SERVICIO_MINIMAL_PROMPT = `
<structural_instruction>
    <composition_type>Studio Pedestal</composition_type>
    <visual_hierarchy>
        <primary>A single, pristine abstract object symbolizing the service on a podium</primary>
        <secondary>Soft reflection on the floor/surface</secondary>
        <tertiary>Atmospheric fog or mist (extremely subtle)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_subject>Dead center, floating slightly above the pedestal</zone_subject>
        <zone_negative>Vast empty space around the subject for elegance</zone_negative>
    </zoning_guide>
    <style_modifiers>
        <texture>Porcelain, polished ceramic, or super-matte rubber</texture>
        <lighting>Softbox top-down, minimalist museum lighting</lighting>
        <palette>Pastels, white-on-white, or single punchy color pop</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Busy background, multiple objects, text overlay on the object</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. INTERACTION - Human Connection
export const SERVICIO_INTERACTION_PROMPT = `
<structural_instruction>
    <composition_type>Over-the-Shoulder / Two-Shot</composition_type>
    <visual_hierarchy>
        <primary>Authentic human interaction moment (consultation, handshake, explanation) [SERVICE_ACTION]</primary>
        <secondary>Professional environment context blurred in the background (depth of field)</secondary>
        <tertiary>Subtle props indicating the specific industry (documents, tablet, tools)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_focus>The point of connection (eyes, hands, or shared screen) at the Golden Intersection</zone_focus>
        <zone_foreground>Blurred shoulder or element framing the subject (Voyeuristic perspective)</zone_foreground>
        <vector_lines>Sight lines directing attention between the service provider and client</vector_lines>
    </zoning_guide>
    <style_modifiers>
        <texture>Natural skin tones, soft fabric textures, premium office materials</texture>
        <lighting>Window natural light + warm practical lamps (Rembrandt style)</lighting>
        <palette>Professional neutrals (Navy, Grey) with warm skin tone accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Stiff stock photo handshake, forced smiles, looking directly at camera, flat lighting</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. WORKSHOP - Tools & Process
export const SERVICIO_WORKSHOP_PROMPT = `
<structural_instruction>
    <composition_type>Knolling / Organized Workspace</composition_type>
    <visual_hierarchy>
        <primary>Key professional tools arranged with obsessive precision [SERVICE_TOOLS]</primary>
        <secondary>Hands of the expert interacting with the central tool or material</secondary>
        <tertiary>Textured work surface (wood, cutting mat, marble, blueprint)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Strict geometric alignment of objects (90-degree angles)</zone_grid>
        <zone_center>The "Hero Tool" or finished result in the exact center</zone_center>
        <zone_negative>Clean spacing between objects to allow the eye to rest</zone_negative>
    </zoning_guide>
    <style_modifiers>
        <texture>Tactile materials, metallic reflections, worn leather, matte plastic</texture>
        <lighting>Top-down flat lay lighting, minimal shadows, high clarity</lighting>
        <palette>Material-truth colors (wood is wood, metal is metal) + Brand Color background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy clutter, random angles, perspective distortion, dirty tools (unless artistic)</avoid>
    </negative_constraints>
</structural_instruction>
`
