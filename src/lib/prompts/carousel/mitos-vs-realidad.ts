import { CarouselComposition } from '../../carousel-structures'

export const MITOS_VS_REALIDAD_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'mitos-vs-realidad::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to contrast fiction vs fact. Visual tension between "False" and "True".',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. SPLIT X-CHECK
    {
        id: 'mitos-vs-realidad::split-x-check',
        name: 'X vs Check',
        description: 'Cruz roja vs Check verde.',
        layoutPrompt: 'Split Screen: Left side "Myth" (darker, crossed out or X icon), Right side "Reality" (brighter, checkmark or O icon). High contrast.',
        iconPrompt: 'Square split with X and Checkmark.'
    },
    // 3. BUSTED STAMP
    {
        id: 'mitos-vs-realidad::busted',
        name: 'Myth Busted',
        description: 'Sello de "Desmentido".',
        layoutPrompt: 'Stamp Overlay: The "Myth" visual is background, overlaid with a large, angled "BUSTED" or "REALITY CHECK" stamp graphic.',
        iconPrompt: 'Rectangle with a diagonal stamp shape.'
    },
    // 4. PEELING LABEL
    {
        id: 'mitos-vs-realidad::peel',
        name: 'Peeling Label',
        description: 'Revelando la verdad.',
        layoutPrompt: 'Layer Reveal: A "Myth" label or surface is being peeled back or torn to reveal the gleaming "Reality" underneath.',
        iconPrompt: 'Square with corner peeling.'
    },
    // 5. TWO MASKS
    {
        id: 'mitos-vs-realidad::masks',
        name: 'Two Masks',
        description: 'Falsedad vs Verdad.',
        layoutPrompt: 'Theatrical: Visual metaphor of a mask (Myth) falling off to show the true face (Reality). Duality.',
        iconPrompt: 'Two faces/masks side by side.'
    },
    // 6. CLOUD VS SUN
    {
        id: 'mitos-vs-realidad::cloud-sun',
        name: 'Cloud vs Sun',
        description: 'Claridad tras la niebla.',
        layoutPrompt: 'Weather Metaphor: "Myth" is cloudy/foggy/obscured. "Reality" is a beam of clear light/sun breaking through.',
        iconPrompt: 'Cloud partially covering a sun.'
    },
    // 7. ICEBERG
    {
        id: 'mitos-vs-realidad::iceberg',
        name: 'Iceberg',
        description: 'Lo visible vs la verdad.',
        layoutPrompt: 'Iceberg: "Myth" is the small tip above water (what people think). "Reality" is the massive mass below (the truth).',
        iconPrompt: 'Triangle shape partially submerged in line.'
    },
    // 8. BROKEN MIRROR
    {
        id: 'mitos-vs-realidad::broken-mirror',
        name: 'Shattered Myth',
        description: 'Rompiendo el mito.',
        layoutPrompt: 'Shatter Effect: The visual of the "Myth" is cracking or shattering like glass, revealing the stable "Reality" behind.',
        iconPrompt: 'Cracked square.'
    },
    // 9. FILTER OFF
    {
        id: 'mitos-vs-realidad::filter',
        name: 'Filter Off',
        description: 'Sin filtros.',
        layoutPrompt: 'Instagram vs Reality: Side-by-side. "Myth" is heavily filtered/fake. "Reality" is raw, authentic, high-definition.',
        iconPrompt: 'Two rectangles, one sparkling, one plain.'
    },
    // 10. LIGHTBULB MOMENT
    {
        id: 'mitos-vs-realidad::lightbulb',
        name: 'Lightbulb',
        description: 'La idea correcta.',
        layoutPrompt: 'Idea Spark: A dim/broken lightbulb (Myth) next to a brightly shining lightbulb (Reality/Fact).',
        iconPrompt: 'Lightbulb icon.'
    },
    // 11. SHADOW PLAY
    {
        id: 'mitos-vs-realidad::shadow',
        name: 'Shadow Truth',
        description: 'Sombra distorsionada.',
        layoutPrompt: 'Shadow Cast: An object (Reality) casts a scary or distorted shadow (Myth). Perspective trick.',
        iconPrompt: 'Object with a distorted shadow.'
    },
    // 12. ERASER
    {
        id: 'mitos-vs-realidad::eraser',
        name: 'Erasing Lies',
        description: 'Borrando lo falso.',
        layoutPrompt: 'Eraser Motion: An eraser tool wiping away a chalk/sketchy "Myth" to show a clean photo "Reality".',
        iconPrompt: 'Rectangle with eraser marks.'
    }
]
