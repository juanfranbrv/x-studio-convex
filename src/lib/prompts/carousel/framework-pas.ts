import { CarouselComposition } from '../../carousel-structures'

export const FRAMEWORK_PAS_COMPOSITIONS: CarouselComposition[] = [
    // 1. THE ABYSS (EL ABISMO)
    {
        id: 'framework-pas::abyss',
        name: 'The Abyss',
        description: 'Peso opresivo superior, liberacion inferior.',
        layoutPrompt: `--- ARCHITECTURE: TOP-HEAVY COMPRESSION ---
1. CANVAS GRID: 3:4 canvas divided horizontally. Top 70% occupied by heavy visual mass, bottom 30% open.
2. TEXT ZONING: Solid, clean negative space in the bottom 30% for headline and body; logo bottom-right.
3. VISUAL FRAMING: High-angle shot looking down into a void or massive structure looming above.
4. ATMOSPHERE STRUCTURE: Oppressive shadows at the top, transitioning to clarity at the bottom. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Large black block pressing down on a small white strip, monochrome.'
    },
    // 2. THE THORN (LA ESPINA)
    {
        id: 'framework-pas::thorn',
        name: 'The Thorn',
        description: 'Elemento agudo que rompe el espacio.',
        layoutPrompt: `--- ARCHITECTURE: ACUTE INTERVAL ---
1. CANVAS GRID: Sharp triangular wedge piercing from left to right, occupying 40% of the center.
2. TEXT ZONING: Clean negative space surrounding the wedge top and bottom; logo top-right.
3. VISUAL FRAMING: Macro focus on a sharp, piercing element (thorn, shard, needle).
4. ATMOSPHERE STRUCTURE: High contrast around the sharp point, diffuse background. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Sharp triangle piercing a circle, monochrome style.'
    },
    // 3. THE HORIZON (EL HORIZONTE)
    {
        id: 'framework-pas::horizon',
        name: 'The Horizon',
        description: 'Claridad vasta y despejada.',
        layoutPrompt: `--- ARCHITECTURE: LOW HORIZON ---
1. CANVAS GRID: Low horizon line at the bottom 15%. Top 85% is vast open space.
2. TEXT ZONING: Massive negative space in the sky area (centered) for large typography; logo top-center.
3. VISUAL FRAMING: Extreme wide shot, emphasizing scale and emptiness above.
4. ATMOSPHERE STRUCTURE: Gradient sky, clearing from storm to calm. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Flat horizontal line with a small sun rising, minimalist monochrome.'
    },
    // 4. THE ANCHOR (EL ANCLA)
    {
        id: 'framework-pas::anchor',
        name: 'The Anchor',
        description: 'Base sólida con foco ascendente.',
        layoutPrompt: `--- ARCHITECTURE: PYRAMIDAL WEIGHT ---
1. CANVAS GRID: Heavy weighted base at the bottom 35%, tapering upward to a single focal point at the top third.
2. TEXT ZONING: Primary headline text in the upper 40% negative space; supporting text near the base; logo bottom-right.
3. VISUAL FRAMING: Grounded perspective looking up at a solid structure or figure with presence and authority.
4. ATMOSPHERE STRUCTURE: Warm light from above, stable heavy ground below. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Triangle with wide base pointing down and apex up, monochrome anchor shape.'
    },
    // 5. THE CRUSH (LA PRESION)
    {
        id: 'framework-pas::crush',
        name: 'The Crush',
        description: 'Bloques laterales comprimiendo el centro.',
        layoutPrompt: `--- ARCHITECTURE: VERTICAL COMPRESSION ---
1. CANVAS GRID: Two heavy vertical columns (left and right), leaving a narrow 30% channel in the center.
2. TEXT ZONING: Vertical text stack in the central negative space channel; logo bottom-center.
3. VISUAL FRAMING: Perspective looking through a narrow gap between two massive walls.
4. ATMOSPHERE STRUCTURE: Dark walls, light streaming through the gap. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Two vertical bars squeezing a thin line, monochrome.'
    },
    // 6. THE ASCENT (EL ASCENSO)
    {
        id: 'framework-pas::ascent',
        name: 'The Ascent',
        description: 'Progreso escalonado diagonal.',
        layoutPrompt: `--- ARCHITECTURE: DIAGONAL STEPS ---
1. CANVAS GRID: Stepped geometry rising from bottom-left to top-right.
2. TEXT ZONING: Clean negative space on the "steps" or in the upper-left void; logo top-right.
3. VISUAL FRAMING: Low angle shot looking up a staircase or climbing structure.
4. ATMOSPHERE STRUCTURE: Light source at the top-right peak, casting long shadows. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Three steps rising diagonally, monochrome style.'
    },
    // 7. THE BREACH (LA BRECHA)
    {
        id: 'framework-pas::breach',
        name: 'The Breach',
        description: 'Ruptura central de luz.',
        layoutPrompt: `--- ARCHITECTURE: CENTER SPLIT ---
1. CANVAS GRID: Solid mass split vertically down the center by a jagged rift.
2. TEXT ZONING: Text aligned inside the rift or to one side of the split; logo bottom-right.
3. VISUAL FRAMING: Close-up of a surface cracking open to reveal light.
4. ATMOSPHERE STRUCTURE: Backlighting bursting through the crack. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Vertical line breaking a solid square, monochrome.'
    },
    // 8. THE ORBIT (LA ORBITA)
    {
        id: 'framework-pas::orbit',
        name: 'The Orbit',
        description: 'Flujo circular alrededor del nucleo.',
        layoutPrompt: `--- ARCHITECTURE: ORBITAL FLOW ---
1. CANVAS GRID: Circular elements orbiting a central point.
2. TEXT ZONING: Center circle is solid negative space for headline; orbital paths for details; logo bottom-center.
3. VISUAL FRAMING: Top-down motion blur of rotating elements.
4. ATMOSPHERE STRUCTURE: Glowing core, motion trails in shadow. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Central dot with two orbital rings, monochrome.'
    },
    // 9. THE FRAGMENT (EL FRAGMENTO)
    {
        id: 'framework-pas::fragment',
        name: 'The Fragment',
        description: 'Caos disperso vs orden.',
        layoutPrompt: `--- ARCHITECTURE: SCATTERED FIELD ---
1. CANVAS GRID: 70% of canvas filled with floating shards/debris, 30% clear corner (top-left).
2. TEXT ZONING: The clear top-left corner is solid negative space; logo top-left.
3. VISUAL FRAMING: Frozen motion of an explosion or shattering object.
4. ATMOSPHERE STRUCTURE: Sharp highlights on shards, deep void background. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Cluster of small triangles and dots, monochrome.'
    },
    // 10. THE FILTER (EL FILTRO)
    {
        id: 'framework-pas::filter',
        name: 'The Filter',
        description: 'Purificacion de ruido a claridad.',
        layoutPrompt: `--- ARCHITECTURE: LATERAL FLOW ---
1. CANVAS GRID: Gradient of density from left (noisy) to right (clean).
2. TEXT ZONING: Right side (clean zone) is solid negative space for text; logo bottom-right.
3. VISUAL FRAMING: Abstract flow of particles passing through a barrier.
4. ATMOSPHERE STRUCTURE: Hazy/foggy left, crystal clear right. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Dots on left becoming lines on right, monochrome.'
    },
    // 11. THE INTERSECTION (LA CRUZ)
    {
        id: 'framework-pas::intersection',
        name: 'The Intersection',
        description: 'Punto de decision crucial.',
        layoutPrompt: `--- ARCHITECTURE: QUADRANT CROSS ---
1. CANVAS GRID: Large X or Plus shape dividing canvas into 4 quadrants.
2. TEXT ZONING: One quadrant (top-right) is solid negative space; logo bottom-right.
3. VISUAL FRAMING: Overhead view of crossing paths or structural beams.
4. ATMOSPHERE STRUCTURE: Spotlight on the intersection point. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Cross shape with one quadrant filled, monochrome.'
    },
    // 12. THE ECLIPSE (EL ECLIPSE)
    {
        id: 'framework-pas::eclipse',
        name: 'The Eclipse',
        description: 'Sombra transitoria revelando luz.',
        layoutPrompt: `--- ARCHITECTURE: PARTIAL OCCLUSION ---
1. CANVAS GRID: Large circle partially obstructing a light source/background.
2. TEXT ZONING: The obstructing circle is solid negative space for text; logo centered.
3. VISUAL FRAMING: silhouette against a bright rim light (corona effect).
4. ATMOSPHERE STRUCTURE: Deep silhouette contrast against blinding backlight. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Circle partially covering another, monochrome.'
    }
]