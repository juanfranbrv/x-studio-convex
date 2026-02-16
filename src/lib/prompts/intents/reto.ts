/**
 * RETO - El Reto (Challenges, concursos, sorteos)
 * Grupo: Engagement
 * 
 * Para retos virales, concursos, sorteos y competiciones.
 * Diseño que genera participación y viralidad.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const RETO_EXTENDED_DESCRIPTION = `
Diseño para retos virales, concursos, sorteos y competiciones.
Genera participación activa de la audiencia con mecánicas claras.
`.trim()

export const RETO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'headline',
        label: 'Título del Reto',
        placeholder: 'Ej: ¡Participa y Gana!',
        type: 'text',
        required: true,
        aiContext: 'Main challenge or contest title'
    },
    {
        id: 'prize',
        label: 'Premio',
        placeholder: 'Ej: iPhone 15 Pro',
        type: 'text',
        required: false,
        aiContext: 'What can be won'
    },
    {
        id: 'cta',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: Comenta para participar',
        type: 'text',
        required: false,
        aiContext: 'How to participate'
    }
]

export const RETO_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'reto-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. VERSUS - Battle Split
    {
        id: 'reto-vs',
        name: 'Versus',
        description: 'Batalla',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="10" width="38" height="60" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="50" y="10" width="62" height="60" rx="10" fill="currentColor" fill-opacity="0.7" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Diagonal split screen battle.',
        structuralPrompt: `
## Composición: Versus Battle Layout

**Estructura:** Batalla Versus Diagonal.

### Jerarquía Visual
1. **Principal:** División diagonal dinámica separando dos oponentes u opciones
2. **Secundario:** Insignia grande "VS" o rayo en la intersección central
3. **Terciario:** Elementos de votación o barras de encuesta abajo

### Distribución
- **Zona Izquierda:** Contendiente A (tonos fríos: azul, turquesa)
- **Zona Derecha:** Contendiente B (tonos cálidos: rojo, naranja)
- **Centro:** Tipografía explosiva "VS"

### Estilo
- **Textura:** Grunge, semitono, energía de cómic
- **Iluminación:** Luces de borde coloreadas chocando por lado
- **Paleta:** Colores complementarios de alto contraste

### Evitar
Diseño estático pacífico, monocromo, texto VS pequeño.
`.trim(),
    },
    // 2. SORTEO - Giveaway Prize
    {
        id: 'reto-giveaway',
        name: 'Sorteo',
        description: 'Premio 3D',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Floating 3D prize hero shot.',
        structuralPrompt: `
## Composición: Giveaway Prize Hero

**Estructura:** Héroe de Sorteo.

### Jerarquía Visual
1. **Principal:** El [PREMIO] flotando en el centro con efecto de brillo mágico
2. **Secundario:** Tipografía 3D audaz "SORTEO" o "GIVEAWAY" alrededor
3. **Terciario:** Destellos, iconos de cajas de regalo y confeti como atmósfera

### Distribución
- Objeto de premio central flotante como héroe
- Texto de anuncio orbitando
- Elementos de celebración rodeando

### Estilo
- **Textura:** Brillante, lámina de oro, lujo de celebración
- **Iluminación:** Iluminación de joyería con brillos estelares
- **Paleta:** Oro, morado, tonos de lujo celebratorio

### Evitar
Atmósfera oscura y triste, premio oculto, sensación barata.
`.trim(),
    },
    // 3. BRACKET - Tournament Tree
    {
        id: 'reto-bracket',
        name: 'Torneo',
        description: 'Bracket Tree',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="10" width="50" height="60" rx="10" fill="currentColor" fill-opacity="0.4" /><rect x="62" y="10" width="50" height="60" rx="10" fill="currentColor" fill-opacity="0.7" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Tournament bracket structure.',
        structuralPrompt: `
## Composición: Tournament Bracket Structure

**Estructura:** Estructura de torneo (Bracket).

### Jerarquía Visual
1. **Principal:** Árbol de torneo/bracket estilizado con líneas conectoras
2. **Secundario:** Espacios vacíos o llenos para nombres/avatares de participantes
3. **Terciario:** Icono de trofeo en el punto de convergencia final

### Distribución
- Líneas de conexión de bracket ramificadas
- Marcadores de posición tipo tarjeta para participantes
- Punto ganador final con trofeo

### Estilo
- **Textura:** Rejilla tecnológica, transmisión deportiva, gráficos esports
- **Iluminación:** Estética de iluminación de estadio o broadcast
- **Paleta:** Colores de liga deportiva, limpio sobre oscuro

### Evitar
Colocación aleatoria caótica, líneas finas ilegibles.
`.trim(),
    },
    // 4. RETO - Bold Dare
    {
        id: 'reto-dare',
        name: 'Reto',
        description: 'Tipografía Bold',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="10" width="56" height="60" rx="10" fill="currentColor" fill-opacity="0.6" /><rect x="68" y="10" width="44" height="60" rx="10" fill="currentColor" fill-opacity="0.4" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Aggressive dare typography.',
        structuralPrompt: `
## Composición: Bold Challenge Dare

**Estructura:** Reto Tipográfico Audaz.

### Jerarquía Visual
1. **Principal:** Tipografía agresiva llenando la pantalla con el reto
2. **Secundario:** Texturas granulosas, marcas de desgaste, elementos de arte callejero
3. **Terciario:** Botón o insignia gráfica "Accept Challenge"

### Distribución
- Texto de reto audaz en todo el lienzo
- Superposiciones de graffiti o arte callejero
- Botón de aceptación del reto

### Estilo
- **Textura:** Arte callejero, póster rasgado, hormigón, urbano
- **Iluminación:** Flash duro, humor justiciero
- **Paleta:** Negro, blanco, colores de advertencia neón (amarillo, naranja)

### Evitar
Fuentes suaves elegantes, patrones florales, sensación suave.
`.trim(),
    },
    // 5. PODIO - Winners Display
    {
        id: 'reto-podium',
        name: 'Ganadores',
        description: 'Podio 1-2-3',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="48" width="16" height="22" rx="6" fill="currentColor" fill-opacity="0.45" /><rect x="38" y="40" width="16" height="30" rx="6" fill="currentColor" fill-opacity="0.55" /><rect x="60" y="30" width="16" height="40" rx="6" fill="currentColor" fill-opacity="0.65" /><rect x="82" y="22" width="16" height="48" rx="6" fill="currentColor" fill-opacity="0.75" /><rect x="16" y="18" width="64" height="8" rx="4" fill="currentColor" fill-opacity="0.3" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Three-tiered winner podium.',
        structuralPrompt: `
## Composición: Winner Podium Layout

**Estructura:** Podio de Ganadores.

### Jerarquía Visual
1. **Principal:** Estructura de podio de victoria de tres niveles (1º, 2º, 3º)
2. **Secundario:** Focos iluminando la posición #1
3. **Terciario:** Confeti y elementos de celebración lloviendo

### Distribución
- Bloques de podio clásicos (alturas 1, 2, 3)
- Espacio para avatares/nombres de ganadores en cada nivel
- Confeti y focos desde arriba

### Estilo
- **Textura:** Mármol, chapado en oro, lujo de alfombra de terciopelo
- **Iluminación:** Iluminación de escenario, niebla volumétrica
- **Paleta:** Oro #1, Plata #2, Bronce #3 medallas

### Evitar
Gráficos 2D planos, cajas grises aburridas, sin emoción.
`.trim(),
    },
    // 6. REGLAS - Steps
    {
        id: 'reto-rules',
        name: 'Reglas',
        description: 'Pasos 1-2-3',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="8" y="10" width="26" height="60" rx="8" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'left',
        promptInstruction: 'Step-by-step contest rules.',
        structuralPrompt: `
## Composición: Contest Rules Checklist

**Estructura:** Reglas del Concurso.

### Jerarquía Visual
1. **Principal:** Pasos numerados 1-2-3 con numerales decorativos grandes
2. **Secundario:** Iconos para cada acción (Like, Share, Tag, Comment)
3. **Terciario:** Líneas punteadas o flechas conectando los pasos

### Distribución
- Título "Cómo Ganar" o "Cómo Participar"
- Flujo vertical u horizontal de pasos de participación
- Iconos de acción por paso

### Estilo
- **Textura:** Vector limpio, sombras suaves, tarjetas UI redondeadas
- **Iluminación:** Iluminación suave, uniforme y amigable
- **Paleta:** Colores amigables, confiables y atractivos

### Evitar
Muro de texto, camino confuso, difícil de seguir.
`.trim(),
    },
    // 7. COUNTDOWN - Time Limited
    {
        id: 'reto-countdown',
        name: 'Limitado',
        description: 'Tiempo Límite',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Countdown timer urgency.',
        structuralPrompt: `
## Composición: Countdown Timer Urgency

**Estructura:** Urgencia de Cuenta Regresiva.

### Jerarquía Visual
1. **Principal:** Gran visualización de cuenta regresiva (días/horas/minutos)
2. **Secundario:** Reto o premio visible detrás/alrededor del temporizador
3. **Terciario:** Mensaje de urgencia "El tiempo se acaba"

### Distribución
- Reloj de cuenta regresiva central
- Contexto de reto o premio alrededor
- Mensaje de urgencia abajo

### Estilo
- **Textura:** Pantalla digital, reloj flip, cuenta atrás LED
- **Iluminación:** Temporizador auto-luminoso, brillo urgente
- **Paleta:** Colores de urgencia de alta energía (rojo, naranja)

### Evitar
Sensación estática, sin urgencia, contexto de fecha límite faltante.
`.trim(),
    },
    // 8. VIRAL - Social
    {
        id: 'reto-viral',
        name: 'Viral',
        description: 'Trend #',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Viral hashtag challenge visual.',
        structuralPrompt: `
## Composición: Viral Social Challenge

**Estructura:** Reto Social Viral.

### Jerarquía Visual
1. **Principal:** Hashtag mostrado prominentemente como elemento gráfico principal
2. **Secundario:** Visual de ejemplo de participación (persona haciendo el reto)
3. **Terciario:** Iconos de plataforma social y CTA "Únete al reto"

### Distribución
- Tag de tendencia # grande como héroe
- Visual mostrando ejemplo de participación
- Iconos de plataforma y llamada a la acción

### Estilo
- **Textura:** Nativo de TikTok/Instagram, estética de tendencia
- **Iluminación:** Anillo de luz, iluminación de creador
- **Paleta:** Colores de plataforma, esquemas de color de moda

### Evitar
Estética anticuada, participación poco clara, falta de hashtag.
`.trim(),
    },
    // 9. QUIZ - Trivia
    {
        id: 'reto-quiz',
        name: 'Quiz',
        description: 'Trivia',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="48" width="16" height="22" rx="6" fill="currentColor" fill-opacity="0.45" /><rect x="38" y="40" width="16" height="30" rx="6" fill="currentColor" fill-opacity="0.55" /><rect x="60" y="30" width="16" height="40" rx="6" fill="currentColor" fill-opacity="0.65" /><rect x="82" y="22" width="16" height="48" rx="6" fill="currentColor" fill-opacity="0.75" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Quiz question card.',
        structuralPrompt: `
## Composición: Quiz Trivia Challenge

**Estructura:** Desafío de Trivia Quiz.

### Jerarquía Visual
1. **Principal:** Pregunta del quiz mostrada prominentemente
2. **Secundario:** Opciones de respuesta de opción múltiple (A, B, C, D)
3. **Terciario:** "Pon a prueba tu conocimiento" o indicación de premio

### Distribución
- Pregunta principal de quiz arriba
- Cuadrícula o lista de opciones de respuesta
- Información de participación o premio

### Estilo
- **Textura:** Concurso de televisión, noche de trivia, competición de conocimiento
- **Iluminación:** Iluminación brillante de concurso
- **Paleta:** Colores de show de preguntas, colores de opción distintos

### Evitar
Presentación aburrida, opciones poco claras, falta de elemento de juego.
`.trim(),
    },
    // 10. GANADOR - Winner Announcement
    {
        id: 'reto-winner',
        name: 'Ganador',
        description: 'Anuncio',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Winner spotlight announcement.',
        structuralPrompt: `
## Composición: Winner Announcement

**Estructura:** Anuncio de Ganador.

### Jerarquía Visual
1. **Principal:** Nombre o avatar del ganador con tratamiento de foco/corona
2. **Secundario:** Titular "FELICIDADES" o "GANADOR"
3. **Terciario:** Imagen del premio y elementos de celebración

### Distribución
- Identificación de ganador iluminada (nombre/foto)
- Titular de felicitaciones y confeti
- Lo que ganaron mostrado abajo

### Estilo
- **Textura:** Ceremonia de premios, ganador de lotería, gloria de celebración
- **Iluminación:** Foco de ganador, brillo dorado
- **Paleta:** Oro, colores de celebración, temas de victoria

### Evitar
Ganador poco claro, falta de celebración, baja energía.
`.trim(),
    },
    // 11. PARTICIPANTES - Entries
    {
        id: 'reto-participants',
        name: 'Participantes',
        description: 'Mosaico',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="18" width="100" height="20" rx="10" fill="currentColor" fill-opacity="0.7" /><rect x="20" y="44" width="80" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Grid of participant entries.',
        structuralPrompt: `
## Composición: Participant Entries Showcase

**Estructura:** Exhibición de Entradas de Participantes.

### Jerarquía Visual
1. **Principal:** Cuadrícula o mosaico de entradas/envíos de participantes
2. **Secundario:** Contador o estadísticas (X participantes, X entradas)
3. **Terciario:** "Únete al movimiento" o estímulo de participación

### Distribución
- Mosaico de contenido de participantes
- Conteo de participación o progreso
- Estímulo para unirse

### Estilo
- **Textura:** Collage comunitario, exhibición UGC
- **Iluminación:** Variada (de participantes) unificada con superposición
- **Paleta:** Entradas diversas con unificación de acento de marca

### Evitar
Cuadrícula vacía, falta de sentimiento comunitario, foco solitario.
`.trim(),
    },
]

export const RETO_DESCRIPTION = 'Retos virales, sorteos y juegos. 11 composiciones para maximizar participación.'
