import { CarouselComposition } from '../../carousel-structures'

export const TUTORIAL_HOW_TO_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'tutorial-how-to::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to valid instructional steps. Clean, clear, educational.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. RECIPE CARD
    {
        id: 'tutorial-how-to::recipe',
        name: 'Recipe Card',
        description: 'Ficha de receta.',
        layoutPrompt: 'Card: Looks like a kitchen recipe card. "Ingredients" list and "Method" body.',
        iconPrompt: 'List card icon.'
    },
    // 3. STEP BY STEP
    {
        id: 'tutorial-how-to::steps',
        name: 'Numbered Steps',
        description: 'Pasos numerados.',
        layoutPrompt: 'Sequence: Large, bold numbers (1, 2, 3) dominating the layout. Text is secondary.',
        iconPrompt: '1-2-3 square icons.'
    },
    // 4. HANDS ON
    {
        id: 'tutorial-how-to::hands',
        name: 'Hands On',
        description: 'Manos a la obra.',
        layoutPrompt: 'POV: First-person view of hands doing the task (typing, cooking, building).',
        iconPrompt: 'Hand icon.'
    },
    // 5. TOOLKIT
    {
        id: 'tutorial-how-to::tools',
        name: 'The Toolkit',
        description: 'Herramientas necesarias.',
        layoutPrompt: 'Flatlay: Knolling style arrangement of all tools/resources needed for the tutorial.',
        iconPrompt: 'Wrench and hammer icon.'
    },
    // 6. CHECKLIST
    {
        id: 'tutorial-how-to::check',
        name: 'Checklist',
        description: 'Lista de chequeo.',
        layoutPrompt: 'Tick Boxes: List with empty or checked boxes. Interactive feel.',
        iconPrompt: 'Checkbox list.'
    },
    // 7. VIDEO FRAME
    {
        id: 'tutorial-how-to::video',
        name: 'Video Player',
        description: 'Estilo reproductor.',
        layoutPrompt: 'UI Overlay: Looks like a paused YouTube or video player interface. Play button in center.',
        iconPrompt: 'Play button inside rectangle.'
    },
    // 8. FLOWCHART
    {
        id: 'tutorial-how-to::flow',
        name: 'Flowchart',
        description: 'Diagrama de flujo.',
        layoutPrompt: 'Diagram: Decision tree style. "If yes > go here", "If no > go there".',
        iconPrompt: 'Flowchart connectors.'
    },
    // 9. SPLIT INSTRUCT
    {
        id: 'tutorial-how-to::split',
        name: 'Show & Tell',
        description: 'Mostrar y contar.',
        layoutPrompt: 'Split: Top half Image (Show), Bottom half Text Instructions (Tell).',
        iconPrompt: 'Horizontal split image/text.'
    },
    // 10. ARROW GUIDE
    {
        id: 'tutorial-how-to::arrow',
        name: 'Arrow Guide',
        description: 'Guía de flechas.',
        layoutPrompt: 'Directional: Heavy use of arrows pointing specifically to buttons or parts of the object being explained.',
        iconPrompt: 'Multiple pointers/arrows.'
    },
    // 11. BLUEPRINT
    {
        id: 'tutorial-how-to::blueprint',
        name: 'Blueprint',
        description: 'Plano técnico.',
        layoutPrompt: 'Technical: White lines on blue grid background. Construction aesthetic.',
        iconPrompt: 'Grid paper icon.'
    },
    // 12. PROGRESS BAR
    {
        id: 'tutorial-how-to::progress',
        name: 'Progress',
        description: 'Progreso de tarea.',
        layoutPrompt: 'Status: "Step 2 of 5" status bar prominently displayed top or bottom.',
        iconPrompt: 'Loading bar.'
    }
]
