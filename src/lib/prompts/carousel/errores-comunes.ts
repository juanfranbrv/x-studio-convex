import { CarouselComposition } from '../../carousel-structures'

export const ERRORES_COMUNES_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'errores-comunes::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to highlight a warning or mistake and its correction. Use alert colors/symbols.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. WARNING SIGN
    {
        id: 'errores-comunes::warning',
        name: 'Warning Sign',
        description: 'Señal de alerta.',
        layoutPrompt: 'Triangle Alert: Prominent warning triangle icon or aesthetic. The distinct visual cue of "Caution" framing the mistake.',
        iconPrompt: 'Triangle with exclamation mark.'
    },
    // 3. RED ZONE
    {
        id: 'errores-comunes::red-zone',
        name: 'Red Zone',
        description: 'Zona de peligro.',
        layoutPrompt: 'Color Blocking: A specific zone (corner or side) is tinted red/dark to signify the "Error". The rest is neutral.',
        iconPrompt: 'Square with one corner shaded dark.'
    },
    // 4. STOP HAND
    {
        id: 'errores-comunes::stop',
        name: 'Stop Hault',
        description: 'Alto al error.',
        layoutPrompt: 'Stop Gesture: Visual of a hand or stop sign halting the viewer. "Stop doing this".',
        iconPrompt: 'Octagon shape (Stop sign).'
    },
    // 5. SLIPPERY SLOPE
    {
        id: 'errores-comunes::slope',
        name: 'Slippery Slope',
        description: 'Caída por error.',
        layoutPrompt: 'Downward Diagonal: Visual composition sliding down-right, implying negative consequence or decline.',
        iconPrompt: 'Line trending downwards.'
    },
    // 6. TRAP DOOR
    {
        id: 'errores-comunes::trap',
        name: 'The Trap',
        description: 'No caigas en la trampa.',
        layoutPrompt: 'Trap Metaphor: Visual of a mousetrap or hole in the ground. The "Mistake" is the bait.',
        iconPrompt: 'U-shape or trap icon.'
    },
    // 7. BROKEN CHAIN
    {
        id: 'errores-comunes::chain',
        name: 'Broken Chain',
        description: 'Eslabón débil.',
        layoutPrompt: 'Link Break: A taut chain with one link snapping (The Mistake). Visualizes failure point.',
        iconPrompt: 'Chain with a gap.'
    },
    // 8. CORRECTION PEN
    {
        id: 'errores-comunes::pen',
        name: 'Red Pen',
        description: 'Corrección manual.',
        layoutPrompt: 'Editor Style: Text or visual with red scribble/correction marks over the "Mistake".',
        iconPrompt: 'Pencil with a scribble line.'
    },
    // 9. REWIND
    {
        id: 'errores-comunes::rewind',
        name: 'Rewind',
        description: 'Volver atrás.',
        layoutPrompt: 'Reverse Arrow: Circular rewind arrow. Implies "Go back and fix this".',
        iconPrompt: 'Circular rewind arrow.'
    },
    // 10. DETOUR
    {
        id: 'errores-comunes::detour',
        name: 'Detour',
        description: 'Desvío del camino.',
        layoutPrompt: 'Road Sign: A detour sign pointing away from a blocked road (The Mistake) towards the clear path.',
        iconPrompt: 'Curved directional arrow.'
    },
    // 11. ALARM BELL
    {
        id: 'errores-comunes::alarm',
        name: 'Alarm',
        description: 'Alarma sonando.',
        layoutPrompt: 'Vibration/Ring: Visual ripples or "shake" lines around an element to suggest a ringing alarm.',
        iconPrompt: 'Bell shape with vibration lines.'
    },
    // 12. DOMINO FALL
    {
        id: 'errores-comunes::domino',
        name: 'Domino Effect',
        description: 'Efecto dominó.',
        layoutPrompt: 'Chain Reaction: Dominoes falling over. The first domino is labeled as the "Common Mistake".',
        iconPrompt: 'Three rectangles falling.'
    }
]
