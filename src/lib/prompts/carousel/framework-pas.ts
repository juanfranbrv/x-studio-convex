import { CarouselComposition } from '../../carousel-structures'

export const FRAMEWORK_PAS_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'framework-pas::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to the Problem-Agitation-Solution arc. Emotional journey from dark to light.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. TRIPTYCH VERTICAL
    {
        id: 'framework-pas::triptych',
        name: 'PAS Triptych',
        description: 'Tríptico vertical P-A-S.',
        layoutPrompt: '3-Panel Vertical split: Panel 1 (Problem/Dark), Panel 2 (Agitation/Red/Intense), Panel 3 (Solution/Light/Blue). Distinct emotional zoning.',
        iconPrompt: 'Square divided into 3 vertical columns.'
    },
    // 3. TARGET BULLSEYE
    {
        id: 'framework-pas::bullseye',
        name: 'Target Pain',
        description: 'Dardo en el dolor.',
        layoutPrompt: 'Bullseye: The "Agitation" is the center of the target. We zoom in on the pain point before zooming out to solution.',
        iconPrompt: 'Target/Bullseye circles.'
    },
    // 4. STORM TO CALM
    {
        id: 'framework-pas::storm',
        name: 'Storm to Calm',
        description: 'Tormenta a calma.',
        layoutPrompt: 'Atmospheric: Left side is chaotic/stormy (P+A), transitioning smoothly to a calm/sunny Right side (S).',
        iconPrompt: 'Cloud with lightning transitioning to sun.'
    },
    // 5. KNOT UNTIED
    {
        id: 'framework-pas::knot',
        name: 'Untying Knot',
        description: 'Desatanudos.',
        layoutPrompt: 'Visual Metaphor: A tight, messy knot (Problem/Agitation) being loosened or fully straightforward string (Solution).',
        iconPrompt: 'Icon of a looped knot.'
    },
    // 6. AMPLIFIER
    {
        id: 'framework-pas::amp',
        name: 'Volume Up',
        description: 'Amplificando el problema.',
        layoutPrompt: 'Volume Knob: Visualizing "Agitation" as turning up the volume/intensity dial on the Problem, then Muting it for Solution.',
        iconPrompt: 'Speaker volume icon.'
    },
    // 7. MAGNIFYING BURN
    {
        id: 'framework-pas::burn',
        name: 'Sunburn Focus',
        description: 'Lupa quemando (Agitación).',
        layoutPrompt: 'Focus Point: A magnifying glass focusing sunlight to "burn" (agitate) a specific spot, creating smoke/urgency.',
        iconPrompt: 'Magnify glass with a ray/spark.'
    },
    // 8. TEETER TOTTER
    {
        id: 'framework-pas::scale',
        name: 'Tipping Scale',
        description: 'Balanza desequilibrada.',
        layoutPrompt: 'Balance Scale: Heavy weight of "Problem" tipping the scale down. "Solution" feather balances or corrects it.',
        iconPrompt: 'Balance scale icon.'
    },
    // 9. PRESSURE COOKER
    {
        id: 'framework-pas::pressure',
        name: 'Pressure Gauge',
        description: 'Medidor de presión.',
        layoutPrompt: 'Gauge Needle: Dial in the Red Zone (Agitation/Danger), then resetting to Green Zone (Solution/Safe).',
        iconPrompt: 'Gauge meter icon.'
    },
    // 10. CRACK SPREADING
    {
        id: 'framework-pas::crack',
        name: 'Cracked Glass',
        description: 'Grieta expandiéndose.',
        layoutPrompt: 'Progression: A small crack (Problem) -> Spreading spiderweb crack (Agitation) -> Brand new glass (Solution).',
        iconPrompt: 'Cracked surface icon.'
    },
    // 11. EQUATION SOLVED
    {
        id: 'framework-pas::math',
        name: 'Equation',
        description: 'Resolviendo la incógnita.',
        layoutPrompt: 'Blackboard Math: "X + Y = ?" (Problem). "X + Y = CHAOS" (Agitation). "X + Y = SOLUTION" (Answer).',
        iconPrompt: 'X + Y symbols.'
    },
    // 12. PUZZLE FIT
    {
        id: 'framework-pas::puzzle',
        name: 'Missing Piece',
        description: 'La pieza que falta.',
        layoutPrompt: 'Jigsaw: A completed puzzle with one glaring hole (Problem). The hole glowing/throbbing (Agitation). The piece clicking in (Solution).',
        iconPrompt: 'Puzzle piece.'
    }
]
