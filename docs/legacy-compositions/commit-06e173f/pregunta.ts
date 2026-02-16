/**
 * PREGUNTA - La Pregunta (Q&A, genera comentarios)
 * Grupo: Engagement
 * 
 * Diseñado para provocar interacción y comentarios. La pregunta domina
 * el diseño, invitando a la audiencia a participar.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const PREGUNTA_EXTENDED_DESCRIPTION = `
Diseñado para provocar interacción y comentarios. La pregunta domina 
el diseño, invitando a la audiencia a participar. Perfecto para 
encuestas informales, opiniones o conversación.
`.trim()

export const PREGUNTA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'question_text',
        label: 'La Pregunta',
        placeholder: 'Ej: ¿Qué prefieres: café o té?',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main question to ask the audience'
    },
    {
        id: 'options',
        label: 'Opciones de Respuesta',
        placeholder: 'Ej: A) Café  B) Té  C) Ambos',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Answer options if its a poll-style question'
    },
    {
        id: 'call_to_action',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: ¡Cuéntanos en comentarios!',
        type: 'text',
        required: false,
        optional: true,
        mapsTo: 'cta',
        aiContext: 'Instruction for how to respond'
    }
]

export const PREGUNTA_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'pregunta-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. IMPACTO - Big Type Question
    {
        id: 'pregunta-big',
        name: 'Texto',
        description: 'Impacto Puro',
        svgIcon: 'Type',
        textZone: 'center',
        promptInstruction: 'Typographic impact layout dominated by the question.',
        structuralPrompt: `
## Composición: Typographic Impact Question

**Estructura:** Pregunta de impacto tipográfico.

### Jerarquía Visual
1. **Principal:** El texto [QUESTION] como dominante visual absoluto (70%+ del lienzo)
2. **Secundario:** Color de fondo sólido vibrante o patrón abstracto sutil
3. **Terciario:** Pequeña llamada a la acción anclada "Responde abajo" o icono de comentario

### Distribución
- Texto de pregunta masivo dominando el centro
- Campo de color o degradado audaz de fondo
- Elemento de llamada a la acción en esquina inferior

### Estilo
- **Textura:** Tipografía audaz, limpia, de alto impacto
- **Iluminación:** Uniforme, sin sombras, claridad tipo póster
- **Paleta:** Colores de marca de alto contraste, imposibles de ignorar

### Evitar
Texto de pregunta pequeño, fondos recargados, mensaje oculto.
`.trim(),
    },
    // 2. VERSUS - This vs That (Originalmente #7 en types, #2 en prompt file)
    {
        id: 'pregunta-versus',
        name: 'Versus',
        description: 'Opciones',
        svgIcon: 'GitCompare',
        textZone: 'center',
        promptInstruction: 'Split screen comparison for two options.',
        structuralPrompt: `
## Composición: Visual Comparison Poll

**Estructura:** Encuesta de comparación visual.

### Jerarquía Visual
1. **Principal:** Pantalla dividida con dos opciones distintas (A vs B)
2. **Secundario:** Insignia central "VS" o elemento divisor
3. **Terciario:** Etiquetas claras para cada opción ("Café" vs "Té")

### Distribución
- Opción A con su visual y etiqueta a un lado
- Opción B con su visual y etiqueta al otro
- Indicador de "VS" o conflicto en la intersección central

### Estilo
- **Textura:** Gamificada, competitiva, alto contraste entre opciones
- **Iluminación:** Iluminación dramática igual en ambas opciones
- **Paleta:** Colores contrastantes para cada opción, diferenciación clara

### Evitar
Opciones poco claras, visuales sesgados, segunda opción oculta.
`.trim(),
    },
    // 3. CHAT - Conversation Bubble
    {
        id: 'pregunta-conversation',
        name: 'Chat',
        description: 'Chat / Social',
        svgIcon: 'MessageCircle',
        textZone: 'center',
        promptInstruction: 'Digital conversation bubble aesthetic.',
        structuralPrompt: `
## Composición: Digital Conversation Aesthetic

**Estructura:** Estética de conversación digital.

### Jerarquía Visual
1. **Principal:** Burbuja de mensaje conteniendo la pregunta en estilo de interfaz de chat
2. **Secundario:** Avatar o marcador de identidad del preguntador
3. **Terciario:** Visual de "campo de entrada de texto" o indicador de escritura sugiriendo respuesta

### Distribución
- Burbuja de diálogo con texto de pregunta
- Pequeña foto de perfil o icono del preguntador
- Sugerencia inferior de interfaz "escribe tu respuesta"

### Estilo
- **Textura:** Nativa de redes sociales, estética de app de mensajería
- **Iluminación:** Brillo tipo pantalla, claridad digital
- **Paleta:** Colores de mensajes iOS/Android o equivalente de marca

### Evitar
Gráficos de vieja escuela, sensación no digital, diseño estático.
`.trim(),
    },
    // 4. QUIZ - Multiple Choice
    {
        id: 'pregunta-quiz',
        name: 'Quiz',
        description: 'Opciones GRID',
        svgIcon: 'Grid',
        textZone: 'center',
        promptInstruction: 'Game show quiz interface with options.',
        structuralPrompt: `
## Composición: Quiz Show Interface

**Estructura:** Interfaz de concurso de preguntas.

### Jerarquía Visual
1. **Principal:** Encabezado de pregunta prominentemente en la parte superior
2. **Secundario:** Cuadrícula de 3-4 tarjetas o botones de opciones de respuesta
3. **Terciario:** Una opción potencialmente resaltada (estado hover) o todas iguales

### Distribución
- Encabezado superior con pregunta del quiz
- Diseño de cuadrícula para opciones de respuesta (A, B, C, D)
- Énfasis visual en la naturaleza seleccionable

### Estilo
- **Textura:** Concurso de juegos, noche de trivia, educativo lúdico
- **Iluminación:** Iluminación de estudio de juegos, brillante y atractiva
- **Paleta:** Diferenciación colorida de opciones, energía de concurso

### Evitar
Opciones apretadas, orden de lectura poco claro, presentación aburrida.
`.trim(),
    },
    // 5. DEBATE - Thought Provoking
    {
        id: 'pregunta-debate',
        name: 'Debate',
        description: 'Opinión Seria',
        svgIcon: 'Users',
        textZone: 'left',
        promptInstruction: 'Serious discussion overlay on evocative background.',
        structuralPrompt: `
## Composición: Serious Discussion Layout

**Estructura:** Diseño de discusión seria.

### Jerarquía Visual
1. **Principal:** Imágenes provocativas o temáticas llenando el fondo
2. **Secundario:** Superposición semitransparente conteniendo la pregunta
3. **Terciario:** Indicación "¿Qué opinas?" o "Comparte tu opinión"

### Distribución
- Imagen atmosférica o controversial a sangre completa
- Área de texto legible con contraste sobre la imagen
- Invitación al pie para compartir pensamientos

### Estilo
- **Textura:** Editorial, artículo de opinión, calidad de revista
- **Iluminación:** Ambiente temperamental, que invita a la reflexión
- **Paleta:** Colores más profundos y sofisticados, sensación intelectual

### Evitar
Estética frívola, vibras de fiesta, tratamiento ligero.
`.trim(),
    },
    // 6. PENSAMIENTO - Introspective
    {
        id: 'pregunta-thought',
        name: 'Idea',
        description: 'Abstracto',
        svgIcon: 'Cloud',
        textZone: 'center',
        promptInstruction: 'Abstract thinking shapes and ethereal space.',
        structuralPrompt: `
## Composición: Introspective Thought Layout

**Estructura:** Diseño de pensamiento introspectivo.

### Jerarquía Visual
1. **Principal:** Formas abstractas de "pensamiento": bombilla, cerebro, nube de ideas, silueta de cabeza
2. **Secundario:** Texto de pregunta flotando en "espacio de pensamiento" abierto
3. **Terciario:** Partículas sutiles o conexiones sugiriendo actividad mental

### Distribución
- Símbolo abstracto de pensamiento o ilustración
- Área de lienzo abierto para contemplación
- Pregunta integrada en el espacio etéreo

### Estilo
- **Textura:** Abstracta, suave, intelectual, filosófica
- **Iluminación:** Difusa suave, onírica, cerebral
- **Paleta:** Tonos suaves, colores aireados, sensación espaciosa

### Evitar
Gráficos ruidosos, estética urgente, orientada a la acción.
`.trim(),
    },
    // 7. ENCUESTA - Poll Bars (Originalmente #2 en types, #7 en prompt file)
    {
        id: 'pregunta-poll',
        name: 'Encuesta',
        description: 'Comparativo',
        svgIcon: 'BarChart2',
        textZone: 'top',
        promptInstruction: 'Visual representation of poll results.',
        structuralPrompt: `
## Composición: Poll Results Bar Layout

**Estructura:** Diseño de barras de resultados de encuesta.

### Jerarquía Visual
1. **Principal:** Barras de progreso horizontales mostrando opciones de encuesta
2. **Secundario:** Texto de pregunta en la parte superior estableciendo la encuesta
3. **Terciario:** Etiquetas de porcentaje o recuento de votos en cada barra

### Distribución
- Área de encabezado con la pregunta de la encuesta
- Barras horizontales apiladas para cada opción
- Visualización de porcentaje o recuento por opción

### Estilo
- **Textura:** Visualización de datos, estética de encuesta Instagram/Twitter
- **Iluminación:** Limpia, estilo UI, claridad de tablero
- **Paleta:** Barras de degradado, colores de visualización de resultados

### Evitar
Sin jerarquía visual entre opciones, gráficos confusos.
`.trim(),
    },
    // 8. EMOJI - Reaction Scale
    {
        id: 'pregunta-emoji',
        name: 'Emoji',
        description: 'Visual',
        svgIcon: 'Smile',
        textZone: 'center',
        promptInstruction: 'Scale of emojis from negative to positive.',
        structuralPrompt: `
## Composición: Emoji Reaction Scale

**Estructura:** Escala de reacción con emojis.

### Jerarquía Visual
1. **Principal:** Fila de caras emoji representando una escala (de triste a emocionado)
2. **Secundario:** Pregunta sobre calificación o sentimiento en la parte superior
3. **Terciario:** Etiquetas o números debajo de cada opción de emoji

### Distribución
- Área superior con "¿Cómo teientes sobre...?"
- Escala horizontal de emojis de negativo a positivo
- Indicadores de escala (1-5 o etiquetas descriptivas)

### Estilo
- **Textura:** Jueguetona, amigable para Gen-Z, accesible
- **Iluminación:** Brillante, divertida, nativa de redes sociales
- **Paleta:** Colores coloridos de emoji, fondos degradados divertidos

### Evitar
Escalas solo de texto, sensación corporativa seria, interfaz compleja.
`.trim(),
    },
    // 9. RELLENO - Fill in the Blank
    {
        id: 'pregunta-fill',
        name: 'Relleno',
        description: 'Completar',
        svgIcon: 'Edit3',
        textZone: 'center',
        promptInstruction: 'Sentence with a blank space to fill in.',
        structuralPrompt: `
## Composición: Fill in the Blank Game

**Estructura:** Juego de completar la frase.

### Jerarquía Visual
1. **Principal:** Declaración con línea en blanco visible o guion bajo para completar
2. **Secundario:** Pistas visuales sugiriendo escritura/rellenado (bolígrafo, cursor)
3. **Terciario:** Respuesta de ejemplo o pista si es apropiado

### Distribución
- Frase con espacio en blanco prominente "_____"
- Campo vacío resaltado invitando a completar
- Pequeña pista opcional o respuesta de ejemplo

### Estilo
- **Textura:** Hoja de trabajo, Mad Libs, sensación de ejercicio interactivo
- **Iluminación:** Limpia, brillo amigable de aula
- **Paleta:** Colores de papel/bolígrafo o rellenos lúdicos

### Evitar
Respuestas completas visibles, sin espacio en blanco, pregunta cerrada.
`.trim(),
    },
    // 10. SLIDER - Rate Scale
    {
        id: 'pregunta-slider',
        name: 'Slider',
        description: 'Rango',
        svgIcon: 'MoveHorizontal',
        textZone: 'center',
        promptInstruction: 'Interactive slider rating interface.',
        structuralPrompt: `
## Composición: Slider Rating Interface

**Estructura:** Interfaz de calificación por deslizador.

### Jerarquía Visual
1. **Principal:** Barra deslizante horizontal con indicador arrastrable
2. **Secundario:** Etiquetas de extremos de escala ("Nunca" a "Siempre")
3. **Terciario:** Pregunta solicitando la calificación sobre el deslizador

### Distribución
- Pregunta de calificación en la parte superior de la composición
- Barra deslizante de aspecto interactivo en el centro
- Etiquetas extremas en cada lado de la escala

### Estilo
- **Textura:** Diseño UI, interfaz de app, estética de deslizador de Stories
- **Iluminación:** Brillo tipo pantalla, resaltado de elemento interactivo
- **Paleta:** Pistas de deslizador degradadas, indicador de marca

### Evitar
Apariencia estática, sensación no interactiva, escala confusa.
`.trim(),
    },
    // 11. CONTROVERSIAL - Hot Take
    {
        id: 'pregunta-contro',
        name: 'Polémica',
        description: 'Debate Hot',
        svgIcon: 'Flame',
        textZone: 'center',
        promptInstruction: 'Bold controversial statement layout.',
        structuralPrompt: `
## Composición: Hot Take Controversial Statement

**Estructura:** Declaración controversial "Hot Take".

### Jerarquía Visual
1. **Principal:** Declaración controversial audaz u opinión impopular como texto principal
2. **Secundario:** Fuego, calor o elementos visuales calientes sugiriendo controversia
3. **Terciario:** Indicación "¿De acuerdo o en desacuerdo?" o "Pelea en comentarios"

### Distribución
- Declaración central audaz destinada a provocar
- Fuego, llamas, gráficos calientes alrededor de los bordes
- Llamada a la acción desafiando la respuesta de la audiencia

### Estilo
- **Textura:** Audaz, agresiva, que llama la atención
- **Iluminación:** Dramática, alto contraste, intensa
- **Paleta:** Colores calientes (rojo, naranja), vibras de emoji enojado

### Evitar
Declaraciones suaves, estética tranquila, encuadre cortés.
`.trim(),
    },
]

export const PREGUNTA_DESCRIPTION = 'Diseño para fomentar la participación mediante preguntas, encuestas y debates. 11 composiciones interactivas.'
