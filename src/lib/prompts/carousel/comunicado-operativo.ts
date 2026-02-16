import { CarouselComposition } from '../../carousel-structures'

export const COMUNICADO_OPERATIVO_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'comunicado-operativo::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptacion.',
        layoutPrompt: [
            '--- ARCHITECTURE: OPERATIONAL FREEFORM ---',
            '1. CANVAS GRID: Structured grid-first layout optimized for clarity and scanability.',
            '2. TEXT SAFETY ZONE: Clean matte surface occupying the top 40% for headline + key change.',
            '3. VISUAL FRAMING: Straight-on, document-like framing to emphasize official clarity.',
            '4. LOGO ANCHOR: Top-right corner with a 5-8% margin.',
            '5. ATMOSPHERE STRUCTURE: Neutral, informational lighting; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. ALERT BANNER
    {
        id: 'comunicado-operativo::alert-bar',
        name: 'Alerta',
        description: 'Franja de aviso destacada.',
        layoutPrompt: [
            '--- ARCHITECTURE: ALERT BANNER ---',
            '1. CANVAS GRID: Horizontal band across the upper third with supporting content below.',
            '2. TEXT SAFETY ZONE: The alert band is a clean, textureless strip for the main message.',
            '3. VISUAL FRAMING: Wide, flat framing to keep hierarchy strict and readable.',
            '4. LOGO ANCHOR: Top-left or top-right corner outside the alert band.',
            '5. ATMOSPHERE STRUCTURE: High-contrast clarity, newsroom energy; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Horizontal alert banner with a small exclamation mark.'
    },
    // 3. NOTICE BOARD
    {
        id: 'comunicado-operativo::notice-board',
        name: 'Tablon',
        description: 'Aviso tipo cartelera.',
        layoutPrompt: [
            '--- ARCHITECTURE: NOTICE BOARD ---',
            '1. CANVAS GRID: Central card on a larger background with clear margins.',
            '2. TEXT SAFETY ZONE: Central card is a clean matte surface for the full announcement.',
            '3. VISUAL FRAMING: Straight-on, centered framing; minimal perspective.',
            '4. LOGO ANCHOR: Top-right corner of the canvas, outside the card.',
            '5. ATMOSPHERE STRUCTURE: Subtle depth separation, calm official tone; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Pinned notice card icon.'
    },
    // 4. SCHEDULE SHIFT
    {
        id: 'comunicado-operativo::schedule-shift',
        name: 'Cambio de horario',
        description: 'Calendario con ajuste.',
        layoutPrompt: [
            '--- ARCHITECTURE: SCHEDULE SHIFT ---',
            '1. CANVAS GRID: Split layout with calendar block on left and text on right.',
            '2. TEXT SAFETY ZONE: Right 45% is a clean, textureless panel for details.',
            '3. VISUAL FRAMING: Eye-level framing; calendar tiles are the focal object.',
            '4. LOGO ANCHOR: Top-right corner inside the text panel.',
            '5. ATMOSPHERE STRUCTURE: Structured, orderly, administrative; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Calendar with a shift arrow.'
    },
    // 5. LOCATION CHANGE
    {
        id: 'comunicado-operativo::location-change',
        name: 'Cambio de ubicacion',
        description: 'Traslado de sede o punto.',
        layoutPrompt: [
            '--- ARCHITECTURE: LOCATION CHANGE ---',
            '1. CANVAS GRID: Two equal blocks connected by a directional cue.',
            '2. TEXT SAFETY ZONE: Upper band reserved as a clean matte header.',
            '3. VISUAL FRAMING: Top-down schematic framing; icons represent locations.',
            '4. LOGO ANCHOR: Top-right corner in the header band.',
            '5. ATMOSPHERE STRUCTURE: Clear wayfinding energy; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Map pin with arrow.'
    },
    // 6. MAINTENANCE WINDOW
    {
        id: 'comunicado-operativo::maintenance-window',
        name: 'Mantenimiento',
        description: 'Ventana de mantenimiento.',
        layoutPrompt: [
            '--- ARCHITECTURE: MAINTENANCE WINDOW ---',
            '1. CANVAS GRID: Top header band with a large central info panel below.',
            '2. TEXT SAFETY ZONE: Central panel is a clean matte surface for timing and impact.',
            '3. VISUAL FRAMING: Straight-on, dashboard-like framing for clarity.',
            '4. LOGO ANCHOR: Top-right corner in header band.',
            '5. ATMOSPHERE STRUCTURE: Calm, controlled operational tone; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Wrench with a small clock.'
    },
    // 7. SERVICE IMPACT
    {
        id: 'comunicado-operativo::service-impact',
        name: 'Estado del servicio',
        description: 'Semaforo de estado.',
        layoutPrompt: [
            '--- ARCHITECTURE: STATUS SIGNAL ---',
            '1. CANVAS GRID: Vertical stack with a status indicator column and text panel.',
            '2. TEXT SAFETY ZONE: Right 50% is a clean, textureless panel for explanation.',
            '3. VISUAL FRAMING: Flat infographic framing; status lights guide attention.',
            '4. LOGO ANCHOR: Top-right corner inside the text panel.',
            '5. ATMOSPHERE STRUCTURE: Informational, high clarity; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Vertical traffic light icon.'
    },
    // 8. ACTION CHECKLIST
    {
        id: 'comunicado-operativo::action-checklist',
        name: 'Acciones',
        description: 'Lista de pasos a seguir.',
        layoutPrompt: [
            '--- ARCHITECTURE: ACTION CHECKLIST ---',
            '1. CANVAS GRID: Left column for checklist, right column for short explanation.',
            '2. TEXT SAFETY ZONE: Left column is a clean, textureless list panel.',
            '3. VISUAL FRAMING: Straight-on, document-like framing for quick scanning.',
            '4. LOGO ANCHOR: Top-right corner above both columns.',
            '5. ATMOSPHERE STRUCTURE: Orderly, procedural rhythm; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Checklist board with three checks.'
    },
    // 9. TIMELINE PINS
    {
        id: 'comunicado-operativo::timeline-pins',
        name: 'Fechas clave',
        description: 'Linea temporal operativa.',
        layoutPrompt: [
            '--- ARCHITECTURE: PINNED TIMELINE ---',
            '1. CANVAS GRID: Vertical timeline on the left, text blocks on the right.',
            '2. TEXT SAFETY ZONE: Right 55% reserved as clean panels for each milestone.',
            '3. VISUAL FRAMING: Minimal infographic framing with strong vertical alignment.',
            '4. LOGO ANCHOR: Top-right corner of the text area.',
            '5. ATMOSPHERE STRUCTURE: Calm progression, ordered flow; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Vertical line with three pins.'
    },
    // 10. INFO STACK
    {
        id: 'comunicado-operativo::info-stack',
        name: 'Panel informativo',
        description: 'Bloques de informacion.',
        layoutPrompt: [
            '--- ARCHITECTURE: INFORMATION STACK ---',
            '1. CANVAS GRID: Three stacked panels with consistent spacing and margins.',
            '2. TEXT SAFETY ZONE: Each panel is a clean, matte surface for short text.',
            '3. VISUAL FRAMING: Straight-on, modular framing; no perspective distortion.',
            '4. LOGO ANCHOR: Top-right corner above the stack.',
            '5. ATMOSPHERE STRUCTURE: High clarity, modular rhythm; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Three stacked cards.'
    },
    // 11. CONTACT HUB
    {
        id: 'comunicado-operativo::contact-hub',
        name: 'Contacto',
        description: 'Canales de soporte.',
        layoutPrompt: [
            '--- ARCHITECTURE: CONTACT HUB ---',
            '1. CANVAS GRID: Split layout with a large contact card and a small info column.',
            '2. TEXT SAFETY ZONE: Contact card is a clean, textureless surface for CTA.',
            '3. VISUAL FRAMING: Centered card with supporting icons aligned left.',
            '4. LOGO ANCHOR: Top-right corner of the canvas.',
            '5. ATMOSPHERE STRUCTURE: Clear, supportive tone; mood: {DYNAMIC_MOOD}.'
        ].join('\n'),
        iconPrompt: 'Headset or phone with a message bubble.'
    }
]
