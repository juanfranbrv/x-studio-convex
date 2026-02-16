import { CarouselComposition } from '../../carousel-structures'

export const PREGUNTAS_RESPUESTAS_COMPOSITIONS: CarouselComposition[] = [
    {
        id: 'preguntas-respuestas::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptacion.',
        layoutPrompt: 'Freeform: Adapt the layout to a ping-pong Q and A flow with clear question and answer blocks.',
        iconPrompt: 'Monochromatic schematic icon with thick rounded shapes: a Q bubble and an A bubble.'
    },
    {
        id: 'preguntas-respuestas::split-qa',
        name: 'Split Q / A',
        description: 'Pregunta arriba, respuesta abajo.',
        layoutPrompt: `--- ARCHITECTURE: SPLIT Q A ---
1. CANVAS GRID: Horizontal split 40/60 with question on top and answer on bottom.
2. TEXT SAFETY ZONE: Top 40% is a clean matte surface for the question block.
3. VISUAL FRAMING: Large Q marker in the top block; bold A marker in the lower block.
4. LOGO ANCHOR: Top-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Strong separation and clarity. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: two stacked rectangles labeled Q and A.'
    },
    {
        id: 'preguntas-respuestas::ping-pong',
        name: 'Ping-Pong',
        description: 'Alternancia izquierda/derecha.',
        layoutPrompt: `--- ARCHITECTURE: PING PONG THREAD ---
1. CANVAS GRID: Zig-zag alignment across a vertical stack, alternating left and right blocks.
2. TEXT SAFETY ZONE: Top 18% reserved as clean negative space for the topic.
3. VISUAL FRAMING: Alternating rounded blocks for questions and answers.
4. LOGO ANCHOR: Bottom-right corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Rhythmic flow and conversational tempo. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: two offset bubbles in a zig-zag.'
    },
    {
        id: 'preguntas-respuestas::chat-thread',
        name: 'Chat Thread',
        description: 'Estilo conversacion.',
        layoutPrompt: `--- ARCHITECTURE: CHAT THREAD ---
1. CANVAS GRID: Single column with stacked bubbles and a small avatar column on the left.
2. TEXT SAFETY ZONE: Top 16% reserved as clean matte header for the topic question.
3. VISUAL FRAMING: Alternating bubble sizes; Q bubbles slightly larger than A.
4. LOGO ANCHOR: Top-left corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Casual and friendly messaging feel. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: two chat bubbles with a small dot avatar.'
    },
    {
        id: 'preguntas-respuestas::accordion',
        name: 'Accordion FAQ',
        description: 'Preguntas plegables.',
        layoutPrompt: `--- ARCHITECTURE: FAQ ACCORDION ---
1. CANVAS GRID: Vertical stack of 4-5 accordion rows with a highlighted open row.
2. TEXT SAFETY ZONE: Top 18% reserved as clean matte space for the headline.
3. VISUAL FRAMING: Rows with a bold plus/minus marker; open row shows the answer.
4. LOGO ANCHOR: Bottom-left corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Ordered UI clarity and quick scanning. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: stacked bars with a plus icon.'
    },
    {
        id: 'preguntas-respuestas::cards',
        name: 'Q/A Cards',
        description: 'Tarjetas alternas.',
        layoutPrompt: `--- ARCHITECTURE: Q A CARDS ---
1. CANVAS GRID: Two-column grid of cards with alternating Q and A labels.
2. TEXT SAFETY ZONE: Top 18% reserved as a clean matte band for the topic.
3. VISUAL FRAMING: Card grid with bold corner labels Q and A.
4. LOGO ANCHOR: Top-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Structured blocks and clear scanning. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a 2x2 grid of cards with Q/A corners.'
    },
    {
        id: 'preguntas-respuestas::hotline',
        name: 'Hotline',
        description: 'Soporte y respuesta directa.',
        layoutPrompt: `--- ARCHITECTURE: HOTLINE ANSWER ---
1. CANVAS GRID: Left column for a large question block, right column for a single bold answer.
2. TEXT SAFETY ZONE: Top 16% reserved as clean matte space for the title.
3. VISUAL FRAMING: Oversized Q on the left, oversized A on the right with short text lines.
4. LOGO ANCHOR: Bottom-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Direct and authoritative resolution. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: large Q and A side by side.'
    },
    {
        id: 'preguntas-respuestas::faq-grid',
        name: 'FAQ Grid',
        description: 'Mosaico de dudas.',
        layoutPrompt: `--- ARCHITECTURE: FAQ TILE GRID ---
1. CANVAS GRID: 2x3 grid of tiles with question titles and short answers.
2. TEXT SAFETY ZONE: Top 18% reserved as clean negative space for the headline.
3. VISUAL FRAMING: Tiles with subtle hierarchy; one tile highlighted for emphasis.
4. LOGO ANCHOR: Top-left corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Balanced grid for quick lookup. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a grid of six squares.'
    },
    {
        id: 'preguntas-respuestas::speech-bubbles',
        name: 'Speech Bubbles',
        description: 'Dialogo visual.',
        layoutPrompt: `--- ARCHITECTURE: SPEECH BUBBLE DIALOG ---
1. CANVAS GRID: Central diagonal flow of two large bubbles with smaller support bubbles.
2. TEXT SAFETY ZONE: Top 20% reserved as clean matte surface for the topic label.
3. VISUAL FRAMING: Two dominant bubbles (Q then A) with subtle connectors.
4. LOGO ANCHOR: Top-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Conversational rhythm and playful clarity. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: two overlapping speech bubbles.'
    },
    {
        id: 'preguntas-respuestas::timeline',
        name: 'Q to A Timeline',
        description: 'De duda a respuesta.',
        layoutPrompt: `--- ARCHITECTURE: Q TO A TIMELINE ---
1. CANVAS GRID: Vertical timeline with three nodes: question, clarification, answer.
2. TEXT SAFETY ZONE: Top 16% reserved as clean matte space for headline.
3. VISUAL FRAMING: Thick line with round nodes and short text blocks.
4. LOGO ANCHOR: Bottom-left corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Sequential clarity and resolution. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a vertical line with three round nodes.'
    },
    {
        id: 'preguntas-respuestas::tagged-qa',
        name: 'Tagged Q/A',
        description: 'Etiquetas Q y A destacadas.',
        layoutPrompt: `--- ARCHITECTURE: TAGGED Q A ---
1. CANVAS GRID: Two stacked blocks with bold tag chips on the left edge.
2. TEXT SAFETY ZONE: Top 18% reserved as clean matte space for the topic.
3. VISUAL FRAMING: Thick tag shapes (Q/A) anchoring each block.
4. LOGO ANCHOR: Top-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Clear labeling and quick readability. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: two stacked tags labeled Q and A.'
    },
    {
        id: 'preguntas-respuestas::reply-thread',
        name: 'Reply Thread',
        description: 'Respuesta anidada.',
        layoutPrompt: `--- ARCHITECTURE: REPLY THREAD ---
1. CANVAS GRID: Vertical stack with an indented answer block beneath each question.
2. TEXT SAFETY ZONE: Top 16% reserved as clean negative space for the header.
3. VISUAL FRAMING: Bold question block followed by a smaller, indented answer block.
4. LOGO ANCHOR: Bottom-left corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Clear nesting and conversational flow. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a large block with a smaller indented block beneath.'
    }
]
