import { CarouselComposition } from '../../carousel-structures'

export const ANTES_DESPUES_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'antes-despues::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to highlight transformation. Use strong visual contrast between initial and final states.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color. Represents versatility and randomness.'
    },
    // 2. SPLIT VERTICAL CLASSIC
    {
        id: 'antes-despues::split-v',
        name: 'Split Vertical',
        description: 'Comparación clásica lado a lado.',
        layoutPrompt: 'Vertical Split: Screen divided exactly in half vertically. Left side darker/desaturated (Before), Right side bright/saturated (After). Clear verifycal divider line.',
        iconPrompt: 'Simple square divided vertically in half, left side shaded.'
    },
    // 3. DIAGONAL REVEAL
    {
        id: 'antes-despues::diagonal',
        name: 'Diagonal Reveal',
        description: 'Corte dinámico en diagonal.',
        layoutPrompt: 'Diagonal Split: Dynamic slash from top-right to bottom-left. "After" image peeking through or dominating the upper triangular half.',
        iconPrompt: 'Square with a diagonal line from corner to corner, separating two tones.'
    },
    // 4. SPOTLIGHT CIRCLE
    {
        id: 'antes-despues::spotlight',
        name: 'Spotlight Focus',
        description: 'Foco circular en el cambio.',
        layoutPrompt: 'Central Focus: Large circular frame in center showing the "After" detail/result, set against a blurred or monochrome "Before" background.',
        iconPrompt: 'Square with a central circle distinct from the background.'
    },
    // 5. ARROW TRANSITION
    {
        id: 'antes-despues::arrow-trans',
        name: 'Arrow Flow',
        description: 'Transición guiada por flecha.',
        layoutPrompt: 'Flow Layout: Left image (Before) connects to Right image (After) via a prominent stylized arrow graphic in the center gutter.',
        iconPrompt: 'Horizontal rectangle with a central right-pointing arrow.'
    },
    // 6. OVERLAY SLIDER
    {
        id: 'antes-despues::slider',
        name: 'Slider Effect',
        description: 'Simulación de slider interactivo.',
        layoutPrompt: 'Slider Simulation: Full image of "After" with a "peeling" effect or slider handle revealing the "Before" layer underneath on one side.',
        iconPrompt: 'Square with a vertical line having a handle/dot in the middle.'
    },
    // 7. GRID CONTRAST
    {
        id: 'antes-despues::grid-contrast',
        name: 'Grid Contrast',
        description: 'Grilla de detalles comparados.',
        layoutPrompt: '2x2 Grid: Top row shows detailed close-ups of "Before", Bottom row shows corresponding "After" shots. High contrast between rows.',
        iconPrompt: 'Square divided into 4 quadrants (2x2 grid).'
    },
    // 8. TORN PAPER
    {
        id: 'antes-despues::torn',
        name: 'Torn Paper',
        description: 'Revelación por papel rasgado.',
        layoutPrompt: 'Torn Edge: "Before" image appears as a top layer of paper being torn away in the center to reveal the "After" image underneath.',
        iconPrompt: 'Shape with a jagged/tear line across the middle.'
    },
    // 9. MIRRORED REFLECTION
    {
        id: 'antes-despues::mirror',
        name: 'Mirrored',
        description: 'Reflejo transformado.',
        layoutPrompt: 'Reflection: "Before" on top, "After" below as a reflection in water or glass, but upgraded/cleaned up. Horizon line in center.',
        iconPrompt: 'Square divided horizontally, bottom half mirroring top half.'
    },
    // 10. FADE GRADIENT
    {
        id: 'antes-despues::fade',
        name: 'Soft Fade',
        description: 'Fusión suave entre estados.',
        layoutPrompt: 'Gradient Blend: Smooth horizontal gradient transition from left (Before) to right (After). No hard lines, dreamy metamorphosis.',
        iconPrompt: 'Square with a gradient fill from dark to light.'
    },
    // 11. INSET BOX
    {
        id: 'antes-despues::inset',
        name: 'Inset Detail',
        description: 'Detalle insertado.',
        layoutPrompt: 'Picture-in-Picture: Main background is the glorious "After" shot. Small inset box in corner shows the original "Before" state.',
        iconPrompt: 'Large rectangle with a smaller rectangle inside one corner.'
    },
    // 12. MAGNIFY
    {
        id: 'antes-despues::magnify',
        name: 'Magnifier',
        description: 'Lupa sobre el resultado.',
        layoutPrompt: 'Magnifying Glass: "Before" texture in background. Large magnifying glass graphics overlaid showing the polished "After" texture inside the lens.',
        iconPrompt: 'Icon of a magnifying glass over a square.'
    }
]
