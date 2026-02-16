
export interface CarouselComposition {
    id: string
    name: string
    description: string
    layoutPrompt: string
    iconPrompt: string
    mode?: 'basic' | 'advanced'
}

export interface NarrativeStructure {
    id: string
    name: string
    summary: string
    compositions: CarouselComposition[]
}

type NarrativeContext = {
    id: NarrativeStructure['id']
    name: string
    summary: string
    tension: string
    flow: string
    proof: string
    cta: string
}

type BasicCompositionTemplate = {
    baseId: string
    name: string
    description: string
    iconPrompt: string
    layoutPrompt: string
}

const BASIC_CAROUSEL_TEMPLATES: BasicCompositionTemplate[] = [
    {
        baseId: 'basic-orbit-hook',
        name: 'Orbita de Foco',
        description: 'Foco claro con zonas limpias para texto.',
        iconPrompt: 'Monochrome icon: central orbit circle and one satellite block.',
        layoutPrompt: `--- ARCHITECTURE: ORBITAL FOCUS FRAME ---
1. CANVAS GRID: Radial grid on 3:4 canvas with focal center at 58% vertical and 50% horizontal.
2. TEXT SAFETY ZONE: Top band from 0% to 30% height reserved for text; no structural blocks allowed.
3. VISUAL FRAMING: Focal block diameter 18-22% of canvas width, centered on the radial nucleus.
4. LOGO ANCHOR: Top-right corner with 6% inset from top and right edges.
5. ARCHITECTURAL CONSISTENCY: Keep focal center, text band and logo inset unchanged across all slides; final slide adds action lane from 78% to 100% height.`
    },
    {
        baseId: 'basic-split-stage',
        name: 'Escenario Split',
        description: 'Balance texto/visual con lectura inmediata.',
        iconPrompt: 'Monochrome icon: asymmetric split panels, one wide one narrow.',
        layoutPrompt: `--- ARCHITECTURE: ASYMMETRIC SPLIT STAGE ---
1. CANVAS GRID: Vertical split 62/38 (dominant pane left, support pane right) on 3:4 canvas.
2. TEXT SAFETY ZONE: Inside dominant pane, reserve inner text field from 6% to 94% pane height and 8% to 63% pane width.
3. VISUAL FRAMING: Support blocks stay fully inside the 38% pane; no overlap into dominant text field.
4. LOGO ANCHOR: Upper-left inside support pane with 6% inset from pane edges.
5. ARCHITECTURAL CONSISTENCY: Keep split ratio, inset system and text field geometry fixed; final slide reserves bottom strip 76-100% height in dominant pane for action elements.`
    },
    {
        baseId: 'basic-card-core',
        name: 'Tarjeta Nuclear',
        description: 'Centro sólido para mensajes densos.',
        iconPrompt: 'Monochrome icon: thick rounded card centered over background block.',
        layoutPrompt: `--- ARCHITECTURE: CENTERED CARD CORE ---
1. CANVAS GRID: Centered card system on 3:4 canvas; card width 74% and card height 78%.
2. TEXT SAFETY ZONE: Inside card, reserve top 34% for heading and middle 28% for support text.
3. VISUAL FRAMING: External support blocks can occupy only outer margins, never crossing card boundary.
4. LOGO ANCHOR: Top-center, 5% from top edge, aligned with card center axis.
5. ARCHITECTURAL CONSISTENCY: Keep card dimensions and internal lanes constant; final slide maps card bottom 72-100% to action lane.`
    },
    {
        baseId: 'basic-z-path',
        name: 'Ruta Z',
        description: 'Recorrido visual guiado para storytelling.',
        iconPrompt: 'Monochrome icon: thick Z path connecting three blocks.',
        layoutPrompt: `--- ARCHITECTURE: Z-FLOW GUIDED PATH ---
1. CANVAS GRID: Z scaffold with nodes at A(18%,22%), B(78%,22%), C(22%,72%) in normalized canvas coordinates.
2. TEXT SAFETY ZONE: Node A area and node B area reserve rectangular text blocks sized 28% width x 14% height each.
3. VISUAL FRAMING: Connector paths maintain fixed angles between nodes; support blocks attach only to node C region.
4. LOGO ANCHOR: Bottom-right corner with 7% inset.
5. ARCHITECTURAL CONSISTENCY: Keep node coordinates and connector geometry unchanged; final slide enlarges node C block to 34% width x 18% height for action emphasis.`
    },
    {
        baseId: 'basic-modular-grid',
        name: 'Grid Modular',
        description: 'Estructura robusta y versátil multi-bloque.',
        iconPrompt: 'Monochrome icon: 2x3 modular grid with one dominant tile.',
        layoutPrompt: `--- ARCHITECTURE: MODULAR GRID SYSTEM ---
1. CANVAS GRID: 2x3 modular grid with uniform gutters at 2.5% of canvas width.
2. TEXT SAFETY ZONE: Dominant tile spans two rows (left column); internal text padding fixed at 8%.
3. VISUAL FRAMING: Remaining four tiles stay secondary and preserve equal tile proportions.
4. LOGO ANCHOR: Top-left outer margin with 5% inset from canvas edges.
5. ARCHITECTURAL CONSISTENCY: Keep gutter, tile ratio and dominant span fixed; bottom-right tile becomes action container on final slide.`
    },
    {
        baseId: 'basic-pillar-rhythm',
        name: 'Ritmo de Columnas',
        description: 'Cadencia vertical limpia para ideas secuenciales.',
        iconPrompt: 'Monochrome icon: three thick vertical pillars with varied heights.',
        layoutPrompt: `--- ARCHITECTURE: VERTICAL PILLAR RHYTHM ---
1. CANVAS GRID: Three columns with equal width and gutters at 3%; column heights follow 52% / 68% / 84%.
2. TEXT SAFETY ZONE: Reserve top 30% of the center column for heading text.
3. VISUAL FRAMING: All column bases align to a shared baseline at 86% canvas height.
4. LOGO ANCHOR: Bottom-left corner with 6% inset and dedicated clear-space radius of 8%.
5. ARCHITECTURAL CONSISTENCY: Keep widths, gutters and baseline fixed; right column converts to action block on final slide.`
    },
    {
        baseId: 'basic-diagonal-pulse',
        name: 'Pulso Diagonal',
        description: 'Tensión controlada para mensajes con energía.',
        iconPrompt: 'Monochrome icon: diagonal band crossing a rectangular field.',
        layoutPrompt: `--- ARCHITECTURE: DIAGONAL PULSE AXIS ---
1. CANVAS GRID: Master diagonal from (6%,8%) to (92%,88%) across 3:4 canvas.
2. TEXT SAFETY ZONE: Upper-right triangle above diagonal reserved for text; no other blocks inside.
3. VISUAL FRAMING: Content blocks stay below diagonal with minimum 4% separation from axis.
4. LOGO ANCHOR: Upper-right corner with 5.5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep diagonal endpoints and angle fixed; final slide adds action strip from 80% to 100% height.`
    },
    {
        baseId: 'basic-timeline-ribbon',
        name: 'Ribbon Temporal',
        description: 'Ideal para progreso, procesos y pasos.',
        iconPrompt: 'Monochrome icon: vertical ribbon with three nodes.',
        layoutPrompt: `--- ARCHITECTURE: TIMELINE RIBBON ---
1. CANVAS GRID: Vertical ribbon spine anchored at 28% canvas width; right content field uses remaining 72%.
2. TEXT SAFETY ZONE: Right field reserves continuous text panel from 12% to 86% height.
3. VISUAL FRAMING: Three milestone nodes centered on ribbon at 20%, 46% and 72% height.
4. LOGO ANCHOR: Top-left in ribbon header with 5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep ribbon x-position and node spacing fixed; third node expands to action block on final slide.`
    },
    {
        baseId: 'basic-frame-focus',
        name: 'Marco de Enfoque',
        description: 'Enfatiza una idea principal con aire.',
        iconPrompt: 'Monochrome icon: thick outer frame with centered focus block.',
        layoutPrompt: `--- ARCHITECTURE: FRAMED FOCUS WINDOW ---
1. CANVAS GRID: Outer frame inset 6% from canvas edges; inner window inset additional 5%.
2. TEXT SAFETY ZONE: Top band of inner window from 0% to 32% reserved for text.
3. VISUAL FRAMING: Main content block occupies lower inner window from 38% to 86% height.
4. LOGO ANCHOR: Bottom-right inside outer frame with 6% inset.
5. ARCHITECTURAL CONSISTENCY: Keep frame insets and inner-window ratio fixed; expand bottom 20% of inner window for final action area.`
    },
    {
        baseId: 'basic-cta-stage',
        name: 'Escenario de Accion',
        description: 'Composición orientada a cierre y acción.',
        iconPrompt: 'Monochrome icon: stacked stage with bottom action bar.',
        layoutPrompt: `--- ARCHITECTURE: ACTION STAGE STACK ---
1. CANVAS GRID: Two-tier stack with top deck 72% height and bottom deck 28% height.
2. TEXT SAFETY ZONE: Top deck reserves header strip from 8% to 28% of deck height.
3. VISUAL FRAMING: Support blocks remain in top deck; bottom deck contains only action elements.
4. LOGO ANCHOR: Top-right in top deck with 6% inset.
5. ARCHITECTURAL CONSISTENCY: Keep 72/28 split and deck boundaries fixed; bottom deck serves as action zone in final slide.`
    },
    {
        baseId: 'basic-tercios-grid',
        name: 'Tercios Activos',
        description: 'Reticula de tercios con recorrido claro.',
        iconPrompt: 'Monochrome icon: rule-of-thirds grid with one dominant intersection block.',
        layoutPrompt: `--- ARCHITECTURE: ACTIVE RULE OF THIRDS ---
1. CANVAS GRID: 3x3 grid with equal cells; structural anchors allowed only on intersections.
2. TEXT SAFETY ZONE: Upper-left 2x1 cell span reserved as clean text surface with 8% inner padding.
3. VISUAL FRAMING: Primary subject anchor at lower-right intersection; secondary mass constrained to center column.
4. LOGO ANCHOR: Top-right corner with 5% inset from canvas edges.
5. ARCHITECTURAL CONSISTENCY: Keep third lines, text span and anchor mapping fixed; final slide reserves bottom-right cell for action emphasis.`
    },
    {
        baseId: 'basic-golden-spiral',
        name: 'Espiral Directriz',
        description: 'Recorrido progresivo hacia foco principal.',
        iconPrompt: 'Monochrome icon: square spiral with terminal focus block.',
        layoutPrompt: `--- ARCHITECTURE: GOLDEN SPIRAL GUIDE ---
1. CANVAS GRID: Fibonacci-like square partitions on 3:4 canvas with spiral center at right-middle zone.
2. TEXT SAFETY ZONE: Outer top-left spiral segment reserved for typography; maintain textureless field.
3. VISUAL FRAMING: Subject progression follows spiral path from outer arc into center focus node.
4. LOGO ANCHOR: Bottom-left corner with 6% inset and clear-space radius of 7%.
5. ARCHITECTURAL CONSISTENCY: Keep spiral origin, turn direction and segment ratios fixed; final slide converts terminal segment into action lane.`
    },
    {
        baseId: 'basic-u-frame',
        name: 'Marco U',
        description: 'Contenedor perimetral para foco central.',
        iconPrompt: 'Monochrome icon: U-shaped frame surrounding central content block.',
        layoutPrompt: `--- ARCHITECTURE: U FRAME CONTAINER ---
1. CANVAS GRID: U-shaped perimeter frame using left, right and bottom bands at 14% thickness.
2. TEXT SAFETY ZONE: Open top interior area from 4% to 28% height reserved for heading copy.
3. VISUAL FRAMING: Core subject sits inside inner window centered between side columns.
4. LOGO ANCHOR: Top-center with 5% inset from top edge.
5. ARCHITECTURAL CONSISTENCY: Keep frame thickness and inner-window dimensions fixed; final slide allocates bottom band to action elements.`
    },
    {
        baseId: 'basic-golden-triangle',
        name: 'Triangulo Director',
        description: 'Tension diagonal controlada con jerarquia.',
        iconPrompt: 'Monochrome icon: large diagonal triangle with two perpendicular support wedges.',
        layoutPrompt: `--- ARCHITECTURE: GOLDEN TRIANGLE FIELD ---
1. CANVAS GRID: Main diagonal from top-left to bottom-right with two perpendicular subdivisions from opposite corners.
2. TEXT SAFETY ZONE: Upper-right wedge reserved as flat text panel; no subject overlap allowed.
3. VISUAL FRAMING: Subject mass constrained to lower-left wedge; secondary detail follows perpendicular edge.
4. LOGO ANCHOR: Upper-right corner with 6% inset inside text wedge.
5. ARCHITECTURAL CONSISTENCY: Keep diagonal endpoints and wedge proportions fixed; final slide transforms lower-right wedge into action block.`
    },
    {
        baseId: 'basic-negative-chamber',
        name: 'Camara Negativa',
        description: 'Mucho aire para titulares de impacto.',
        iconPrompt: 'Monochrome icon: large empty chamber with small anchored subject block.',
        layoutPrompt: `--- ARCHITECTURE: NEGATIVE CHAMBER ---
1. CANVAS GRID: Single chamber layout where 68% of canvas remains open structural void.
2. TEXT SAFETY ZONE: Entire top half reserved for text with strict no-object rule.
3. VISUAL FRAMING: Subject footprint limited to lower-left quadrant with max 32% area occupancy.
4. LOGO ANCHOR: Top-right corner with 5% inset and protected clear-space.
5. ARCHITECTURAL CONSISTENCY: Keep chamber ratio and subject footprint limits fixed; final slide dedicates lower-right pocket to action content.`
    },
    {
        baseId: 'basic-symmetric-core',
        name: 'Eje Simetrico',
        description: 'Orden axial con lectura inmediata.',
        iconPrompt: 'Monochrome icon: mirrored columns around central axis with top text band.',
        layoutPrompt: `--- ARCHITECTURE: SYMMETRIC AXIS CORE ---
1. CANVAS GRID: Vertical center axis splits canvas into mirrored halves with equal margin rails.
2. TEXT SAFETY ZONE: Top band from 0% to 26% height spans full width for title and support text.
3. VISUAL FRAMING: Subject modules mirror across axis with controlled asymmetry under 12% area difference.
4. LOGO ANCHOR: Top-center aligned to axis, 5% inset from top edge.
5. ARCHITECTURAL CONSISTENCY: Keep axis, mirrored rails and top band fixed; final slide allocates bottom center strip to action elements.`
    },
    {
        baseId: 'basic-f-scan',
        name: 'Barrido F',
        description: 'Jerarquia para lectura rapida en bloques.',
        iconPrompt: 'Monochrome icon: F-shaped bars with descending horizontal modules.',
        layoutPrompt: `--- ARCHITECTURE: F SCAN LAYOUT ---
1. CANVAS GRID: Left spine at 22% width with three horizontal scan bars at 18%, 42% and 66% height.
2. TEXT SAFETY ZONE: Top bar and middle bar reserved for text; lower bar reserved for concise support copy.
3. VISUAL FRAMING: Visual subject occupies right field and aligns to bar endpoints.
4. LOGO ANCHOR: Top-left in the spine header with 5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep spine width and bar heights fixed; final slide converts lowest bar into action strip.`
    },
    {
        baseId: 'basic-z-scan',
        name: 'Barrido Z',
        description: 'Recorrido natural de izquierda a derecha.',
        iconPrompt: 'Monochrome icon: Z-shaped directional path linking three anchors.',
        layoutPrompt: `--- ARCHITECTURE: Z SCAN BRIDGE ---
1. CANVAS GRID: Three anchors at top-left, top-right and bottom-left linked by Z trajectory.
2. TEXT SAFETY ZONE: Top horizontal segment reserved for main text with 7% inset padding.
3. VISUAL FRAMING: Visual modules align to trajectory endpoints; diagonal connector remains unobstructed.
4. LOGO ANCHOR: Bottom-right corner with 6% inset.
5. ARCHITECTURAL CONSISTENCY: Keep anchor coordinates and connector angle fixed; final slide reserves bottom-right rectangle for action block.`
    },
    {
        baseId: 'basic-odd-cluster',
        name: 'Cluster Impar',
        description: 'Agrupacion 3-5 nodos con foco central.',
        iconPrompt: 'Monochrome icon: five uneven circles clustered around one dominant node.',
        layoutPrompt: `--- ARCHITECTURE: ODD CLUSTER SYSTEM ---
1. CANVAS GRID: Cluster map with one dominant node and four secondary nodes arranged in odd grouping.
2. TEXT SAFETY ZONE: Upper-left void between nodes reserved for heading and supporting copy.
3. VISUAL FRAMING: Dominant node occupies center-right; secondary nodes maintain minimum 4% spacing.
4. LOGO ANCHOR: Top-right edge with 5.5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep node count, spacing threshold and dominant-node size fixed; final slide repurposes lowest secondary node zone for action.`
    },
    {
        baseId: 'basic-leading-lines',
        name: 'Lineas Guia',
        description: 'Direccion visual hacia punto clave.',
        iconPrompt: 'Monochrome icon: converging guide lines ending in focal block.',
        layoutPrompt: `--- ARCHITECTURE: GUIDED LINES CONVERGENCE ---
1. CANVAS GRID: Four structural guide lines converge into a focal rectangle at 64% height and 62% width.
2. TEXT SAFETY ZONE: Opposite upper-left sector remains clean and flat for text overlay.
3. VISUAL FRAMING: Subject follows convergence endpoint; no modules may cross guide-line corridor.
4. LOGO ANCHOR: Top-right with 6% inset from both edges.
5. ARCHITECTURAL CONSISTENCY: Keep line origins, convergence point and corridor width fixed; final slide assigns focal rectangle to action emphasis.`
    },
    {
        baseId: 'basic-radial-hub',
        name: 'Hub Radial',
        description: 'Centro magnetico con orbitas secundarias.',
        iconPrompt: 'Monochrome icon: central hub with radial spokes and outer ring.',
        layoutPrompt: `--- ARCHITECTURE: RADIAL HUB MATRIX ---
1. CANVAS GRID: Central hub at 52% width / 54% height with five radial spokes to peripheral modules.
2. TEXT SAFETY ZONE: Upper arc from 0% to 26% height reserved as uninterrupted text lane.
3. VISUAL FRAMING: Peripheral modules align to spoke endpoints; hub remains dominant anchor.
4. LOGO ANCHOR: Top-left corner with 5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep hub coordinates, spoke angles and outer ring radius fixed; final slide converts lower spoke module to action zone.`
    },
    {
        baseId: 'basic-vanishing-run',
        name: 'Fuga Central',
        description: 'Profundidad estructural con eje de fuga.',
        iconPrompt: 'Monochrome icon: perspective rails converging to a vanishing point.',
        layoutPrompt: `--- ARCHITECTURE: VANISHING POINT RUNWAY ---
1. CANVAS GRID: Perspective rails converge to vanishing point at 50% width and 34% height.
2. TEXT SAFETY ZONE: Top band above vanishing point reserved for headline copy.
3. VISUAL FRAMING: Subject lane follows central runway from foreground to mid-plane.
4. LOGO ANCHOR: Bottom-right with 6% inset from edges.
5. ARCHITECTURAL CONSISTENCY: Keep vanishing point, rail spacing and runway width fixed; final slide reserves foreground apron for action.`
    },
    {
        baseId: 'basic-pyramid-stack',
        name: 'Piramide Modular',
        description: 'Jerarquia estable en tres niveles.',
        iconPrompt: 'Monochrome icon: three-tier pyramid blocks with broad base.',
        layoutPrompt: `--- ARCHITECTURE: PYRAMID STACK ---
1. CANVAS GRID: Three stacked tiers form pyramid silhouette with widths 40% / 64% / 82%.
2. TEXT SAFETY ZONE: Top tier and upper mid-tier reserved for text hierarchy.
3. VISUAL FRAMING: Subject support modules occupy base tier corners without crossing center axis.
4. LOGO ANCHOR: Top-right in outer margin with 5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep tier widths, heights and axis alignment fixed; final slide dedicates base tier center to action content.`
    },
    {
        baseId: 'basic-layered-depth',
        name: 'Capas Profundas',
        description: 'Tres planos para narrativa escalonada.',
        iconPrompt: 'Monochrome icon: overlapping front-mid-back panels with clear depth.',
        layoutPrompt: `--- ARCHITECTURE: LAYERED DEPTH STACK ---
1. CANVAS GRID: Three depth planes (foreground, midground, background) with offsets of 6% per plane.
2. TEXT SAFETY ZONE: Foreground top strip reserved for text, isolated from deep layers.
3. VISUAL FRAMING: Subject occupies midground frame; background plane remains low-detail support zone.
4. LOGO ANCHOR: Top-left with 5% inset on foreground plane.
5. ARCHITECTURAL CONSISTENCY: Keep plane offsets and overlap order fixed; final slide transforms foreground bottom strip into action area.`
    },
    {
        baseId: 'basic-twin-cards',
        name: 'Doble Tarjeta',
        description: 'Comparacion limpia con dos modulos.',
        iconPrompt: 'Monochrome icon: two staggered rounded cards with shared baseline.',
        layoutPrompt: `--- ARCHITECTURE: TWIN CARD STAGE ---
1. CANVAS GRID: Two primary cards split canvas at 54/46 with shared baseline at 84% height.
2. TEXT SAFETY ZONE: Left card top half reserved for heading/body stack.
3. VISUAL FRAMING: Right card hosts support visual; inter-card gutter fixed at 3.5% width.
4. LOGO ANCHOR: Top-right outer corner with 5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep card ratio, gutter and baseline fixed; final slide repurposes right-card lower band for action.`
    },
    {
        baseId: 'basic-crosshair-focus',
        name: 'Mira Central',
        description: 'Punto focal contundente con cruces.',
        iconPrompt: 'Monochrome icon: crosshair lines intersecting a central focus ring.',
        layoutPrompt: `--- ARCHITECTURE: CROSSHAIR FOCUS ---
1. CANVAS GRID: Horizontal and vertical axes intersect at 56% height and 50% width.
2. TEXT SAFETY ZONE: Upper-left quadrant reserved for text with no crossing modules.
3. VISUAL FRAMING: Central focus ring defines subject territory; secondary blocks align to axis endpoints.
4. LOGO ANCHOR: Top-right corner with 5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep axis intersection, ring diameter and quadrant reservations fixed; final slide allocates lower-right quadrant to action.`
    },
    {
        baseId: 'basic-ribbon-s',
        name: 'Ribbon S',
        description: 'Flujo sinuoso para historias secuenciales.',
        iconPrompt: 'Monochrome icon: thick S-curve ribbon connecting three checkpoints.',
        layoutPrompt: `--- ARCHITECTURE: S CURVE RIBBON ---
1. CANVAS GRID: S-curve backbone crosses canvas from top-left to bottom-right with three checkpoints.
2. TEXT SAFETY ZONE: Top checkpoint region expanded into flat text platform.
3. VISUAL FRAMING: Subject modules snap to curve checkpoints; no free-floating blocks.
4. LOGO ANCHOR: Bottom-right with 6% inset.
5. ARCHITECTURAL CONSISTENCY: Keep curve path, checkpoint coordinates and platform size fixed; final slide maps final checkpoint to action node.`
    },
    {
        baseId: 'basic-arc-stage',
        name: 'Arco Escenico',
        description: 'Escenario curvo con base de cierre.',
        iconPrompt: 'Monochrome icon: large arch over a grounded base platform.',
        layoutPrompt: `--- ARCHITECTURE: ARC STAGE ---
1. CANVAS GRID: Structural arch spans 18% to 82% width; grounded base occupies bottom 24% height.
2. TEXT SAFETY ZONE: Inner arch crown area reserved for title and supporting text.
3. VISUAL FRAMING: Main subject sits under arch center; side modules remain within arch legs.
4. LOGO ANCHOR: Top-left with 5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep arch radius, leg width and base height fixed; final slide dedicates base platform to action elements.`
    },
    {
        baseId: 'basic-window-strips',
        name: 'Ventanas en Tiras',
        description: 'Lectura por bandas con visual segmentado.',
        iconPrompt: 'Monochrome icon: horizontal strip windows with one dominant panel.',
        layoutPrompt: `--- ARCHITECTURE: STRIP WINDOW SYSTEM ---
1. CANVAS GRID: Four horizontal strips with heights 18% / 22% / 28% / 32%.
2. TEXT SAFETY ZONE: First and second strips reserved for textual hierarchy.
3. VISUAL FRAMING: Third strip hosts main visual anchor; fourth strip remains support platform.
4. LOGO ANCHOR: Top-right strip with 5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep strip heights and inter-strip gutters fixed; final slide converts fourth strip to action lane.`
    },
    {
        baseId: 'basic-offset-quadrants',
        name: 'Cuadrantes Desfasados',
        description: 'Bloques desfasados con balance asimetrico.',
        iconPrompt: 'Monochrome icon: offset quadrants with stepped alignment.',
        layoutPrompt: `--- ARCHITECTURE: OFFSET QUADRANTS ---
1. CANVAS GRID: Four quadrants with stepped offsets of 4% creating staggered seams.
2. TEXT SAFETY ZONE: Top-left offset quadrant reserved for text with 8% padding.
3. VISUAL FRAMING: Dominant visual block occupies lower-right quadrant; supporting blocks stay in opposite diagonal.
4. LOGO ANCHOR: Top-right corner with 5.5% inset.
5. ARCHITECTURAL CONSISTENCY: Keep offset magnitude, seam directions and dominant diagonal fixed; final slide assigns lower-left quadrant edge to action container.`
    }
]

function buildBasicCompositions(structureId: string): CarouselComposition[] {
    return BASIC_CAROUSEL_TEMPLATES.map((template) => ({
        id: `${structureId}::${template.baseId}`,
        name: template.name,
        description: template.description,
        layoutPrompt: template.layoutPrompt,
        iconPrompt: template.iconPrompt,
        mode: 'basic'
    }))
}

const NARRATIVE_CONTEXTS: NarrativeContext[] = [
    { id: 'problema-solucion', name: 'Problem-Solution', summary: 'Expose a pain, then show the relief.', tension: 'pain vs remedy', flow: 'two-part reveal', proof: 'evidence of success', cta: 'try the fix' },
    { id: 'antes-despues', name: 'Before-After', summary: 'Contrast current state with desired state.', tension: 'before vs after', flow: 'contrast then uplift', proof: 'transformation metric', cta: 'move to the after' },
    { id: 'paso-a-paso', name: 'Step-by-Step', summary: 'Sequential guidance from start to finish.', tension: 'progression clarity', flow: 'ordered steps', proof: 'completion confidence', cta: 'start the sequence' },
    { id: 'lista-tips', name: 'Tips List', summary: 'Quick wins in a scannable list.', tension: 'problem and quick fixes', flow: 'bullet rhythm', proof: 'practicality', cta: 'apply a tip' },
    { id: 'top-ranking', name: 'Top / Ranking', summary: 'Ordered highlights from #1 downward.', tension: 'best vs rest', flow: 'descending importance', proof: 'rank criteria', cta: 'pick your top choice' },
    { id: 'mitos-vs-realidad', name: 'Myths vs Reality', summary: 'Debunk misconceptions with facts.', tension: 'myth vs fact', flow: 'paired contrast', proof: 'evidence links', cta: 'adopt the fact' },
    { id: 'errores-comunes', name: 'Common Mistakes', summary: 'Spot pitfalls and how to avoid them.', tension: 'mistake vs fix', flow: 'flag then correct', proof: 'avoidance benefit', cta: 'avoid the mistake' },
    { id: 'framework-pas', name: 'PAS Framework', summary: 'Problem–Agitation–Solution arc.', tension: 'pain amplified then solved', flow: 'P-A-S stages', proof: 'resolution', cta: 'apply PAS' },

    // Updated / Renamed Structures
    { id: 'comparativa-productos', name: 'Product Comparison', summary: 'Side-by-side alternatives.', tension: 'option A vs B', flow: 'parallel stacks', proof: 'criteria rows', cta: 'choose option' },
    { id: 'cronologia-historia', name: 'Timeline / History', summary: 'Storytelling through time.', tension: 'past vs present', flow: 'chronological arc', proof: 'milestones', cta: 'learn the history' },
    { id: 'estudio-caso', name: 'Case Study', summary: 'Story of a real result.', tension: 'challenge vs outcome', flow: 'context → action → result', proof: 'metrics', cta: 'replicate success' },
    { id: 'tutorial-how-to', name: 'Tutorial / How-To', summary: 'Practical hands-on guide.', tension: 'confusion vs skill', flow: 'instructional steps', proof: 'final outcome', cta: 'do it yourself' },
    { id: 'cifras-dato', name: 'Data / Stats', summary: 'Numbers-driven narrative.', tension: 'insight vs noise', flow: 'lead stat then context', proof: 'source cues', cta: 'use the insight' },
    { id: 'frase-celebre', name: 'Quote', summary: 'Inspirational or famous quote.', tension: 'thought vs action', flow: 'quote focus', proof: 'author authority', cta: 'share the quote' },
    { id: 'meme-humor', name: 'Meme / Humor', summary: 'Relatable humor and engagement.', tension: 'expectation vs reality', flow: 'punchline', proof: 'relatability', cta: 'laugh and share' },
    { id: 'promocion-oferta', name: 'Promotion / Offer', summary: 'Value proposition ending in action.', tension: 'value vs cost', flow: 'hook → proof → CTA', proof: 'benefit highlight', cta: 'claim the offer' },
    { id: 'checklist-diagnostico', name: 'Diagnostic Checklist', summary: 'Self-assessment with criteria.', tension: 'uncertainty vs clarity', flow: 'signals → score → outcome', proof: 'criteria match', cta: 'act on your result' },
    { id: 'preguntas-respuestas', name: 'Q&A', summary: 'Doubts resolved in Q and A.', tension: 'question → answer', flow: 'prompt → response', proof: 'clear response', cta: 'ask or act' },
    { id: 'comunicado-operativo', name: 'Operational Notice', summary: 'Clear operational updates and changes.', tension: 'disruption vs clarity', flow: 'context → change → action', proof: 'operational details', cta: 'follow the update' }
]

export const CAROUSEL_STRUCTURES: NarrativeStructure[] = NARRATIVE_CONTEXTS.map((ctx) => ({
    id: ctx.id,
    name: ctx.name,
    summary: ctx.summary,
    compositions: buildBasicCompositions(ctx.id)
}))

export function getNarrativeStructure(id?: string): NarrativeStructure | undefined {
    if (!id) return undefined
    return CAROUSEL_STRUCTURES.find((structure) => structure.id === id)
}

export function getNarrativeComposition(structureId: string, compositionId: string): CarouselComposition | undefined {
    const structure = getNarrativeStructure(structureId)
    if (!structure) return undefined
    const direct = structure.compositions.find((comp) => comp.id === compositionId)
    if (direct) return direct
    const baseId = compositionId.includes('::') ? compositionId.split('::')[1] : compositionId
    return structure.compositions.find((comp) => comp.id.endsWith(`::${baseId}`))
}

function hashSeed(seed: string): number {
    let hash = 0
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
    }
    return hash
}

function normalizeForMatch(value: string): string {
    return (value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
}

function scoreBaseId(baseId: string, prompt: string, slideCount: number): number {
    const text = normalizeForMatch(prompt)
    const words = new Set(text.split(/[^a-z0-9]+/g).filter(Boolean))
    let score = 0

    const hasAny = (...tokens: string[]) => tokens.some((token) => words.has(token) || text.includes(token))

    if (hasAny('paso', 'pasos', 'proceso', 'guia', 'tutorial', 'metodo', 'roadmap', 'timeline')) {
        if (['basic-ribbon-s', 'basic-timeline-ribbon', 'basic-z-path', 'basic-z-scan', 'basic-f-scan'].includes(baseId)) score += 5
    }
    if (hasAny('comparativa', 'versus', 'vs', 'opcion', 'opciones', 'antes', 'despues', 'mejor')) {
        if (['basic-split-stage', 'basic-twin-cards', 'basic-offset-quadrants', 'basic-modular-grid'].includes(baseId)) score += 5
    }
    if (hasAny('dato', 'datos', 'estadistica', 'estadisticas', 'metricas', 'numeros', 'ranking')) {
        if (['basic-modular-grid', 'basic-tercios-grid', 'basic-pillar-rhythm', 'basic-window-strips'].includes(baseId)) score += 5
    }
    if (hasAny('oferta', 'promo', 'promocion', 'inscribete', 'reserva', 'cta', 'comprar', 'apuntate')) {
        if (['basic-cta-stage', 'basic-arc-stage', 'basic-window-strips', 'basic-crosshair-focus'].includes(baseId)) score += 5
    }
    if (hasAny('problema', 'dolor', 'error', 'reto', 'riesgo', 'alerta', 'urgente')) {
        if (['basic-diagonal-pulse', 'basic-golden-triangle', 'basic-leading-lines', 'basic-crosshair-focus'].includes(baseId)) score += 5
    }
    if (hasAny('marca', 'vision', 'historia', 'manifesto', 'inspiracion', 'valores')) {
        if (['basic-orbit-hook', 'basic-golden-spiral', 'basic-frame-focus', 'basic-radial-hub'].includes(baseId)) score += 4
    }

    if (slideCount <= 3 && ['basic-split-stage', 'basic-tercios-grid', 'basic-crosshair-focus', 'basic-negative-chamber'].includes(baseId)) {
        score += 2
    }
    if (slideCount >= 8 && ['basic-ribbon-s', 'basic-window-strips', 'basic-timeline-ribbon', 'basic-f-scan', 'basic-z-scan'].includes(baseId)) {
        score += 2
    }

    return score
}

export function getAutomaticBasicComposition(
    structureId: string,
    seed: string,
    context?: { prompt?: string; slideCount?: number }
): CarouselComposition | undefined {
    const structure = getNarrativeStructure(structureId)
    if (!structure) return undefined
    const basics = structure.compositions.filter((comp) => comp.mode === 'basic')
    if (basics.length === 0) return structure.compositions[0]

    const rawSeed = seed || structureId
    const parsedPrompt = context?.prompt ?? rawSeed.split('|')[1] ?? ''
    const parsedSlideCount = context?.slideCount ?? (Number(rawSeed.split('|')[2] || 0) || 5)
    const ranked = basics
        .map((comp) => {
            const baseId = comp.id.includes('::') ? comp.id.split('::')[1] : comp.id
            return { comp, score: scoreBaseId(baseId, parsedPrompt, parsedSlideCount) }
        })
        .sort((a, b) => b.score - a.score)

    const topScore = ranked[0]?.score ?? 0
    const tied = ranked.filter((entry) => entry.score === topScore)
    if (tied.length === 1) return tied[0].comp

    const tieIndex = hashSeed(rawSeed) % tied.length
    return tied[tieIndex].comp
}

