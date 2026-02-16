import { CarouselComposition } from '../../carousel-structures'

export const ESTUDIO_CASO_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'estudio-caso::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to tell a client success story. Problem -> Process -> Result.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. BEFORE AFTER PRO
    {
        id: 'estudio-caso::before-after',
        name: 'Pro Transformation',
        description: 'Transformación profesional.',
        layoutPrompt: 'Split: "Situation A" (Grey/Messy) vs "Situation B" (Clean/Pro) with specific metrics overlaid.',
        iconPrompt: 'Rectangle split with arrow.'
    },
    // 3. QUOTE HERO
    {
        id: 'estudio-caso::quote',
        name: 'Hero Quote',
        description: 'Cita del cliente.',
        layoutPrompt: 'Testimonial: Large quotation marks. The client\'s headshot and their key success phrase are the heroes.',
        iconPrompt: 'Quote bubble user.'
    },
    // 4. METRIC CARD
    {
        id: 'estudio-caso::metric',
        name: 'Key Metric',
        description: 'La métrica clave.',
        layoutPrompt: 'Data Focus: Giant "300% ROI" or similar number. The background is the client brand/context.',
        iconPrompt: 'Percentage symbol.'
    },
    // 5. PROFILE CARD
    {
        id: 'estudio-caso::profile',
        name: 'Client Profile',
        description: 'Ficha del cliente.',
        layoutPrompt: 'ID Card: Layout looks like a structured profile card. "Name", "Industry", "Challenge", "Solution".',
        iconPrompt: 'ID badge icon.'
    },
    // 6. STEPS TO SUCCESS
    {
        id: 'estudio-caso::steps',
        name: 'Success Steps',
        description: 'Pasos al éxito.',
        layoutPrompt: 'Process Flow: 3-step visualization. 1. Challenge, 2. Strategy, 3. Victory.',
        iconPrompt: '1-2-3 steps icon.'
    },
    // 7. DOCUMENT SHOT
    {
        id: 'estudio-caso::document',
        name: 'The Report',
        description: 'El informe oficial.',
        layoutPrompt: 'Paper: Visual of a stamped "Case Study" or "Confidential" file folder snippet.',
        iconPrompt: 'Folder document icon.'
    },
    // 8. GRAPHIC UPWARD
    {
        id: 'estudio-caso::graph',
        name: 'Growth Graph',
        description: 'Gráfica ascendente.',
        layoutPrompt: 'Chart: Line graph going up and to the right. Green color code. Triumphant.',
        iconPrompt: 'Upward trend graph.'
    },
    // 9. LOGO WALL
    {
        id: 'estudio-caso::logo',
        name: 'Brand Hero',
        description: 'Marca protagonista.',
        layoutPrompt: 'Brand Focus: The client\'s logo is central and elevated, surrounded by success keywords.',
        iconPrompt: 'Shield/Badge logo.'
    },
    // 10. SPLIT STORY
    {
        id: 'estudio-caso::story',
        name: 'Story Split',
        description: 'Narrativa dividida.',
        layoutPrompt: 'Editorial: Left column text (The Story), Right column bold image (The Result). Magazine style.',
        iconPrompt: 'Page layout text+image.'
    },
    // 11. HEADSHOT BUBBLE
    {
        id: 'estudio-caso::headshot',
        name: 'Face Focus',
        description: 'Rostro satisfecho.',
        layoutPrompt: 'Portrait: Circular cutout of the happy client, overlapping a solid color panel with the result.',
        iconPrompt: 'Circle user portrait.'
    },
    // 12. STAR BADGE
    {
        id: 'estudio-caso::badge',
        name: 'Certified Success',
        description: 'Éxito certificado.',
        layoutPrompt: 'Seal of Approval: Visual of a wax seal or ribbon badge saying "Success" or "Verified".',
        iconPrompt: 'Ribbon badge.'
    }
]
