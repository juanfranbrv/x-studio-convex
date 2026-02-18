/**
 * LANZAMIENTO - El Lanzamiento (Countdown, teaser, reveal)
 * Grupo: Promociones
 * 
 * Para teasers, countdowns, reveals y product drops.
 * Genera anticipación y misterio antes del lanzamiento.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const LANZAMIENTO_EXTENDED_DESCRIPTION = `
Para teasers, countdowns, reveals y product drops.
Genera anticipación y misterio antes del lanzamiento.
`.trim()

export const LANZAMIENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'headline',
        label: 'Título',
        placeholder: 'Ej: Algo grande viene...',
        type: 'text',
        required: true,
        aiContext: 'Teaser headline or announcement'
    },
    {
        id: 'date',
        label: 'Fecha de Lanzamiento',
        placeholder: 'Ej: 15 de Enero',
        type: 'text',
        required: false,
        aiContext: 'Launch date'
    },
    {
        id: 'cta',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: Únete a la lista de espera',
        type: 'text',
        required: false,
        aiContext: 'Call to action'
    }
]

export const LANZAMIENTO_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'lanzamiento-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'help_center',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. COUNTDOWN - Timer Display
    {
        id: 'lanzamiento-countdown',
        name: 'Cuenta',
        description: 'Timer 03:00',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="48" width="16" height="22" rx="6" fill="currentColor" fill-opacity="0.45" /><rect x="38" y="40" width="16" height="30" rx="6" fill="currentColor" fill-opacity="0.55" /><rect x="60" y="30" width="16" height="40" rx="6" fill="currentColor" fill-opacity="0.65" /><rect x="82" y="22" width="16" height="48" rx="6" fill="currentColor" fill-opacity="0.75" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Massive countdown timer digits.',
        structuralPrompt: `
## Composición: Countdown Timer

**Estructura:** Temporizador de cuenta atrás.

### Jerarquía Visual
1. **Principal:** Números de cuenta regresiva masivos (03:00, 10 DIAS) dominando el centro
2. **Secundario:** Silueta de producto o vistazo teaser en fondo misterioso
3. **Terciario:** Fecha de lanzamiento y CTA "Notificarme" abajo

### Distribución
- Texto teaser "Próximamente" arriba
- LOS NÚMEROS como elemento héroe en el centro
- Fecha y botón de notificación abajo

### Estilo
- **Textura:** Glitch digital, brillo neón o render metálico 3D
- **Iluminación:** Contraluz cinemático, luz de borde en números
- **Paleta:** Modo oscuro con acentos neón (cian, magenta) u oro/negro

### Evitar
Fondo desordenado, números pequeños, producto totalmente visible.
`.trim(),
    },
    // 2. CORTINA - Reveal with Cloth/Smoke
    {
        id: 'lanzamiento-reveal',
        name: 'Revelación',
        description: 'Cortina/Humo',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="10" width="100" height="60" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="18" y="20" width="84" height="40" rx="8" fill="currentColor" fill-opacity="0.2" /><rect x="18" y="14" width="50" height="6" rx="3" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Product emerging from smoke or curtain.',
        structuralPrompt: `
## Composición: Product Reveal Curtain

**Estructura:** Cortina de revelación de producto.

### Jerarquía Visual
1. **Principal:** Objeto parcialmente cubierto por tela de seda o emergiendo de humo denso
2. **Secundario:** Rayo de luz dramático revelando un detalle específico
3. **Terciario:** Texto minimalista "Revelando..." flotando en espacio negativo

### Distribución
- Objeto misterioso cubierto en el centro
- Detalle de producto parcialmente visible
- Superposición de texto sutil

### Estilo
- **Textura:** Terciopelo, seda, humo, sombras
- **Iluminación:** Foco, claroscuro, drama de alto contraste
- **Paleta:** Monocromo con un color de acento, oscuros de lujo

### Evitar
Visibilidad total del producto, iluminación plana, colores alegres brillantes.
`.trim(),
    },
    // 3. SILUETA - Backlit Silhouette
    {
        id: 'lanzamiento-silhouette',
        name: 'Silueta',
        description: 'Misterio Backlit',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="104" height="64" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="18" y="18" width="84" height="44" rx="8" fill="currentColor" fill-opacity="0.15" /><rect x="24" y="24" width="60" height="14" rx="7" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Backlit silhouette of the product.',
        structuralPrompt: `
## Composición: Silhouette Teaser

**Estructura:** Teaser de silueta.

### Jerarquía Visual
1. **Principal:** Fuerte silueta a contraluz del nuevo producto/feature
2. **Secundario:** Luz de borde brillante definiendo la forma
3. **Terciario:** Título audaz superpuesto centrado

### Distribución
- Forma oscura central con borde brillante
- Tipografía entrelazada con la forma
- Luz atmosférica detrás

### Estilo
- **Textura:** Niebla atmosférica, degradados, misterio elegante
- **Iluminación:** Fuerte contraluz, rayos de luz volumétricos
- **Paleta:** Azules profundos, morados o blanco y negro crudo

### Evitar
Iluminación plana frontal, detalles visibles, fondo blanco liso.
`.trim(),
    },
    // 4. GLITCH - Tech Digital
    {
        id: 'lanzamiento-glitch',
        name: 'Glitch Tech',
        description: 'Distorsión Digital',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Cyberpunk glitch style reveal.',
        structuralPrompt: `
## Composición: Tech Glitch Reveal

**Estructura:** Revelación glitch tecnológico.

### Jerarquía Visual
1. **Principal:** Imagen de producto con efecto glitch digital o pixel sorting
2. **Secundario:** Elementos UI cyberpunk, barras de carga, flujos de datos
3. **Terciario:** Tipografía monoespaciada "LOADING..." o "Actualización Sistema"

### Distribución
- Campo visual con glitch
- Barra de carga o indicador de progreso
- Capa de texto tech clara

### Estilo
- **Textura:** Scanlines, píxeles, aberración cromática
- **Iluminación:** Pantallas neón, brillo HUD
- **Paleta:** Cyberpunk, verde matrix, colores digitales sintéticos

### Evitar
Formas orgánicas, estilo vintage, iluminación suave.
`.trim(),
    },
    // 5. RASGADO - Torn Paper Reveal
    {
        id: 'lanzamiento-torn',
        name: 'Rasgado',
        description: 'Teaser',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="38" width="88" height="6" rx="3" fill="currentColor" fill-opacity="0.35" /><circle cx="24" cy="41" r="8" fill="currentColor" fill-opacity="0.7" /><circle cx="60" cy="41" r="8" fill="currentColor" fill-opacity="0.55" /><circle cx="96" cy="41" r="8" fill="currentColor" fill-opacity="0.4" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Ripped paper revealing content inside.',
        structuralPrompt: `
## Composición: Torn Paper Reveal

**Estructura:** Revelación papel rasgado.

### Jerarquía Visual
1. **Principal:** Capa de papel/textura rasgada abierta en el centro
2. **Secundario:** Nuevo producto visible DENTRO de la rasgadura
3. **Terciario:** Texto "Secreto" o versión antigua en capa de papel exterior

### Distribución
- Superficie de papel texturizado como máscara
- Agujero rasgado
- La revelación dentro de la rasgadura

### Estilo
- **Textura:** Fibra de papel, cartón, sombras realistas en bordes
- **Iluminación:** Sombras duras de profundidad de borde de papel
- **Paleta:** Papel exterior neutral, revelación interior vibrante

### Evitar
Look digital plano, sombras falsas, sin profundidad.
`.trim(),
    },
    // 6. CALENDARIO - Save the Date
    {
        id: 'lanzamiento-calendar',
        name: 'Fecha',
        description: 'Calendario 3D',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="40" height="64" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="52" y="8" width="60" height="30" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="52" y="42" width="28" height="30" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="84" y="42" width="28" height="30" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Floating 3D calendar page.',
        structuralPrompt: `
## Composición: Save The Date Calendar

**Estructura:** Calendario Save The Date.

### Jerarquía Visual
1. **Principal:** Página de calendario 3D estilizada o bloque de fecha flotando
2. **Secundario:** Confeti o partículas congeladas alrededor
3. **Terciario:** Nombre de evento o título de producto debajo de la fecha

### Distribución
- Elemento de fecha flotante como héroe
- Partículas y atmósfera alrededor
- Nombre de evento o producto abajo

### Estilo
- **Textura:** Plástico mate, sombras suaves, sensación aireada
- **Iluminación:** Iluminación de estudio softbox, tonos pastel
- **Paleta:** Colores de marca, brillo high key

### Evitar
Calendario de cuadrícula tradicional, vibras de oficina, aburrido.
`.trim(),
    },
    // 7. APERTURA - Box Opening
    {
        id: 'lanzamiento-apertura',
        name: 'Apertura',
        description: 'Unboxing',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Box partially opening with inner glow.',
        structuralPrompt: `
## Composición: Mystery Box Opening

**Estructura:** Apertura de caja misteriosa.

### Jerarquía Visual
1. **Principal:** Caja parcialmente abierta con luz brillando desde dentro
2. **Secundario:** Manos levantando la tapa o caja en estado semi-abierto
3. **Terciario:** "¿Qué hay dentro?" o texto teaser de revelación

### Distribución
- Packaging premium, parcialmente abierto
- Fuente de luz emanando desde dentro
- Contenidos ocultos, aún no visibles

### Estilo
- **Textura:** Packaging premium, experiencia unboxing
- **Iluminación:** Brillo interior dramático, foco en caja
- **Paleta:** Fondo oscuro, luz dorada desde la caja

### Evitar
Contenidos visibles, packaging barato, iluminación plana.
`.trim(),
    },
    // 8. BLUR - Gradual Focus
    {
        id: 'lanzamiento-blur',
        name: 'Blur',
        description: 'Desenfocado',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="58" height="28" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="70" y="8" width="42" height="28" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="8" y="40" width="42" height="32" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="54" y="40" width="58" height="32" rx="8" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Heavily blurred object coming into focus.',
        structuralPrompt: `
## Composición: Blurred Mystery Reveal

**Estructura:** Revelación misteriosa desenfocada.

### Jerarquía Visual
1. **Principal:** Imagen de producto muy desenfocada sugiriendo forma pero ocultando detalle
2. **Secundario:** "Enfocando pronto" o metáfora de nitidez
3. **Terciario:** Fecha o cuenta atrás para claridad total

### Distribución
- Forma de producto desenfocada central
- Ligeras pistas de color o forma
- Fecha de cuando ocurre la claridad/revelación

### Estilo
- **Textura:** Desenfoque gaussiano pesado, efecto profundidad de campo
- **Iluminación:** Sugiere iluminación de estudio a través del desenfoque
- **Paleta:** Apagada por el desenfoque, pistas de colores de producto

### Evitar
Producto reconocible, demasiada claridad, sin misterio.
`.trim(),
    },
    // 9. FRAGMENTADO - Puzzle Pieces
    {
        id: 'lanzamiento-fragmentado',
        name: 'Puzzle',
        description: 'Piezas',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="10" width="50" height="60" rx="10" fill="currentColor" fill-opacity="0.4" /><rect x="62" y="10" width="50" height="60" rx="10" fill="currentColor" fill-opacity="0.7" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Object fragmented into flying pieces.',
        structuralPrompt: `
## Composición: Puzzle Piece Reveal

**Estructura:** Revelación pieza de puzzle.

### Jerarquía Visual
1. **Principal:** Imagen de producto fragmentada en piezas de rompecabezas o fragmentos rotos
2. **Secundario:** Algunas piezas ensambladas, otras flotando hacia su lugar
3. **Terciario:** "Pieza a pieza" o mensaje teaser de ensamblaje

### Distribución
- Secciones completadas parcialmente visibles
- Piezas faltantes moviéndose hacia el centro
- Texto teaser uniendo todo

### Estilo
- **Textura:** Piezas de puzzle 3D, fragmentos rotos
- **Iluminación:** Iluminación de estudio en secciones completas
- **Paleta:** Colores de producto emergiendo de fragmentos neutrales

### Evitar
Imagen completa visible, puzzle 2D plano, sin sensación de movimiento.
`.trim(),
    },
    // 10. ESPIRAL - Vortex Energy
    {
        id: 'lanzamiento-espiral',
        name: 'Vórtice',
        description: 'Energía',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Energy vortex spiraling around center.',
        structuralPrompt: `
## Composición: Energy Vortex Emergence

**Estructura:** Emergencia de vórtice de energía.

### Jerarquía Visual
1. **Principal:** Espiral o vórtice de energía convergiendo en el centro
2. **Secundario:** Producto o logo emergiendo del centro de energía
3. **Terciario:** Mensaje "Algo poderoso viene"

### Distribución
- Espiral de energía giratoria llenando el encuadre
- Punto de emergencia para producto/revelación
- Partículas y estelas de luz

### Estilo
- **Textura:** Efectos de partículas, corrientes de energía, cósmico
- **Iluminación:** Energía auto-luminosa, brillo central
- **Paleta:** Azules eléctricos, morados, colores de energía

### Evitar
Composición estática, sin sensación de movimiento, centro aburrido.
`.trim(),
    },
    // 11. MISTERIO - Question Mark Focus
    {
        id: 'lanzamiento-misterio',
        name: 'Misterio',
        description: 'Incógnita',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="12" y="14" width="96" height="52" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="18" y="18" width="84" height="44" rx="10" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Giant question mark as hero.',
        structuralPrompt: `
## Composición: Mystery Question

**Estructura:** Pregunta misteriosa.

### Jerarquía Visual
1. **Principal:** Gran signo de interrogación (?) estilizado como visual principal
2. **Secundario:** Texto teaser pistas sobre lo que viene
3. **Terciario:** Fecha o llamada a la acción "Descúbrelo pronto"

### Distribución
- Símbolo ? grande como héroe
- Pistas sutiles o texto teaser
- Fecha de revelación o CTA

### Estilo
- **Textura:** Signo ? 3D premium, o tipografía neón
- **Iluminación:** Foco dramático sobre el signo de interrogación
- **Paleta:** Fondo de misterio oscuro, pregunta brillante

### Evitar
Respuestas reveladas, demasiadas pistas, tipografía aburrida.
`.trim(),
    },
]

export const LANZAMIENTO_DESCRIPTION = 'Teasers, countdowns y reveals. 11 composiciones para generar anticipación.'
