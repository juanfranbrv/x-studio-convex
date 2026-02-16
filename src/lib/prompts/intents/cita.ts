/**
 * CITA - Frase / Testimonio / Cita Célebre
 * Grupo: Conectar / Educar
 * 
 * Intent para citas inspiradoras, testimonios de clientes o frases célebres.
 * Maximiza la legibilidad y el impacto tipográfico.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const CITA_EXTENDED_DESCRIPTION = `
Diseño centrado en el texto para citas inspiradoras, testimonios de clientes
o frases célebres. Maximiza la legibilidad y el impacto tipográfico.
`.trim()

export const CITA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'quote',
        label: 'Frase o Cita',
        placeholder: 'Ej: La creatividad es la inteligencia divirtiéndose.',
        type: 'textarea',
        required: true,
        aiContext: 'The main quote text'
    },
    {
        id: 'author',
        label: 'Autor (Opcional)',
        placeholder: 'Ej: Albert Einstein',
        type: 'text',
        required: false,
        aiContext: 'Author of the quote'
    }
]

export const CITA_DESCRIPTION = 'Diseño para frases, citas célebres o testimonios. 11 composiciones desde minimalista hasta artístico.'

// ============================================================================
// PROMPTS (MARKDOWN FORMAT)
// ============================================================================

const CITA_MINIMAL_PROMPT = `
## Composición: Enfoque Ultra-Minimalista

**Estructura:** Diseño extremadamente limpio donde el texto es el único protagonista.

### Jerarquía Visual
1. **Principal:** La cita centrada perfectamente, sin distracciones
2. **Secundario:** Espacio negativo generoso (padding del 40%)
3. **Terciario:** Pequeño acento (comillas o línea fina) como única decoración

### Distribución
- Texto centrado con máximos márgenes
- Autor pequeño y elegante debajo
- Elemento decorativo mínimo arriba o abajo

### Evitar
Fondos recargados, múltiples decoraciones, texto apretado.
`

const CITA_RETRATO_PROMPT = `
## Composición: Retrato Testimonial

**Estructura:** Layout clásico de testimonio con foto y texto.

### Jerarquía Visual
1. **Principal:** Foto de la persona (avatar circular o retrato profesional)
2. **Secundario:** Cita en estilo bocadillo o área adyacente
3. **Terciario:** Nombre, cargo y credenciales cerca de la foto

### Distribución
- Foto en el tercio izquierdo o inferior
- Cita fluyendo desde o cerca de la persona
- Credenciales alineadas con la foto

### Evitar
Atribución poco clara, sensación anónima, desconexión entre foto y texto.
`

const CITA_TIPOGRAFIA_PROMPT = `
## Composición: Tipografía como Arte

**Estructura:** Las letras llenan el lienzo como elemento gráfico principal.

### Jerarquía Visual
1. **Principal:** Letras gigantes llenando todo el canvas
2. **Secundario:** Alto contraste (Blanco/Negro o Neón/Oscuro)
3. **Terciario:** Apilado dinámico de palabras o justificación creativa

### Distribución
- La cita ocupa el 90% del espacio como textura visual
- Palabras clave agrandadas o destacadas
- Autor en un espacio mínimo en esquina

### Evitar
Tipografía pequeña, tratamiento suave, layouts convencionales.
`

const CITA_POP_STICKER_PROMPT = `
## Composición: Pop Sticker Art
**Estructura:** Diseño vibrante y lúdico estilo "sticker bomb" con elementos gráficos dispersos y bordes gruesos.

### Jerarquía Visual
1. **Principal:** La cita con tipografía display "bubble" o "bold heavy" con contornos negros muy marcados y sombra paralela sólida (block shadow).
2. **Secundario:** Iconos tipo doodle (café, reloj, corazones, estrellas, flores) rodeando el texto como si fueran pegatinas.
3. **Terciario:** Fondo con degradado suave pastel o color sólido vibrante que haga resaltar los bordes blancos de los "stickers".

### Distribución
- Texto centralizado o apilado dinámicamente.
- Elementos decorativos (doodles) en los márgenes y huecos entre palabras.
- Cada elemento (texto e iconos) tiene un borde blanco exterior (die-cut effect) y un contorno negro interior.

### Evitar
Estética seria, líneas finas, falta de contornos, composiciones vacías o minimalistas.
`

const CITA_TEXTURA_PROMPT = `
## Composición: Fondo Orgánico Texturizado

**Estructura:** Texto integrado sobre un fondo rico en materialidad.

### Jerarquía Visual
1. **Principal:** Fondo con textura rica (papel, acuarela, concreto)
2. **Secundario:** Cita superpuesta con sombra sutil o efecto de tinta
3. **Terciario:** Alineación ligeramente descentrada u orgánica

### Distribución
- Textura sangrada cubriendo todo el fondo
- Texto integrado naturalmente en la textura
- Alineación "humana", no mecánicamente perfecta

### Evitar
Perfección digital, fondos estériles, sensación clínica.
`

const CITA_DIVIDIDO_PROMPT = `
## Composición: Pantalla Dividida

**Estructura:** Mitad imagen atmosférica, mitad área de texto limpia.

### Jerarquía Visual
1. **Principal:** 50% fotografía atmosférica, 50% color sólido
2. **Secundario:** Línea divisoria clara (vertical, horizontal o diagonal)
3. **Terciario:** Elemento de marca uniendo ambos lados

### Distribución
- Imagen en una mitad estableciendo el tono
- Texto en la otra mitad sobre fondo limpio
- Elemento puente conectando las mitades

### Evitar
Mitades desbalanceadas, visuales compitiendo, foco difuso.
`

const CITA_BOCADILLO_PROMPT = `
## Composición: Bocadillo de Cómic

**Estructura:** Cita contenida en una forma de diálogo o pensamiento.

### Jerarquía Visual
1. **Principal:** Gran globo de texto conteniendo la cita
2. **Secundario:** Fuente visual (persona, personaje o logo)
3. **Terciario:** Cola del globo apuntando al emisor

### Distribución
- Globo central o superior (60-70% del canvas)
- Emisor en una esquina
- Conector visual claro entre ambos

### Evitar
Emisor poco claro, globo desconectado, texto ilegible.
`

const CITA_CARRUSEL_PROMPT = `
## Composición: Estilo Carrusel

**Estructura:** Sugerencia de secuencia o cartas múltiples.

### Jerarquía Visual
1. **Principal:** Cita principal centrada y prominente
2. **Secundario:** Indicios de otras citas desvaneciéndose en los bordes
3. **Terciario:** Puntos de paginación o indicadores de swipe

### Distribución
- Tarjeta central en foco total
- Bordes mostrando "lo anterior" y "lo siguiente"
- Indicadores de navegación abajo

### Evitar
Sensación estática, visibilidad igualitaria de todo, falta de profundidad.
`

const CITA_NEON_PROMPT = `
## Composición: Tipografía Neón

**Estructura:** Texto brillando como letrero luminoso en la oscuridad.

### Jerarquía Visual
1. **Principal:** Cita renderizada como tubos de neón brillantes
2. **Secundario:** Fondo oscuro o moody para contraste
3. **Terciario:** Elementos ambientales sutiles (ladrillo, reflejos)

### Distribución
- Texto central brillante
- Resplandor irradiando alrededor
- Entorno oscuro en segundo plano

### Evitar
Iluminación plana, fondos claros, efecto de brillo débil.
`

const CITA_MANUSCRITO_PROMPT = `
## Composición: Estilo Manuscrito

**Estructura:** Simulación de escritura a mano sobre soporte físico.

### Jerarquía Visual
1. **Principal:** Cita en cursiva o script manual
2. **Secundario:** Estética de libreta, carta o diario
3. **Terciario:** Toques personales (subrayados, garabatos)

### Distribución
- Texto fluido como elemento central
- Márgenes de papel o bordes de carta visibles
- Espacio para firma o iniciales

### Evitar
Tipografía perfecta, limpieza digital, sensación impersonal.
`

const CITA_FLOTANTE_PROMPT = `
## Composición: Palabras Flotantes 3D

**Estructura:** Palabras clave suspendidas en el espacio a diferentes profundidades.

### Jerarquía Visual
1. **Principal:** Palabras clave de la cita en diferentes tamaños/ángulos
2. **Secundario:** Fondo atmosférico degradado
3. **Terciario:** Flujo visual guiando la lectura

### Distribución
- Palabras dispersas con jerarquía intencional
- Palabras clave más grandes y cercanas
- Camino visual conectando el orden de lectura

### Evitar
Dispersión ilegible, pérdida de jerarquía, caos sin flujo.
`

// ============================================================================
// EXPORTED LAYOUTS
// ============================================================================

export const CITA_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'cita-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. MINIMAL
    {
        id: 'cita-minimal',
        name: 'Minimalista',
        description: 'Texto Limpio',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Ultra-minimal layout with centered text.',
        structuralPrompt: CITA_MINIMAL_PROMPT,
    },
    // 2. RETRATO
    {
        id: 'cita-portrait',
        name: 'Testimonio',
        description: 'Foto + Cita',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="38" cy="40" r="22" fill="currentColor" fill-opacity="0.6" /><rect x="70" y="18" width="34" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="52" width="24" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="86" y="10" width="26" height="60" rx="8" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'right',
        promptInstruction: 'Quote with author portrait.',
        structuralPrompt: CITA_RETRATO_PROMPT,
    },
    // 3. TIPOGRAFIA
    {
        id: 'cita-typo',
        name: 'Tipografía',
        description: 'Letras Grandes',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><circle cx="28" cy="52" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Typography as the main visual element.',
        structuralPrompt: CITA_TIPOGRAFIA_PROMPT,
    },
    // 4. POP STICKER (Anterior Marco)
    {
        id: 'cita-frame',
        name: 'Pop Sticker',
        description: 'Doodles & Contornos',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Playful sticker-bomb layout with bold outlined typography and doodles.',
        structuralPrompt: CITA_POP_STICKER_PROMPT,
    },
    // 5. TEXTURA
    {
        id: 'cita-texture',
        name: 'Textura',
        description: 'Orgánico',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><circle cx="28" cy="52" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Quote on textured background.',
        structuralPrompt: CITA_TEXTURA_PROMPT,
    },
    // 6. DIVIDIDO
    {
        id: 'cita-split',
        name: 'Split',
        description: 'Imagen/Texto',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="10" width="104" height="26" rx="10" fill="currentColor" fill-opacity="0.55" /><rect x="8" y="42" width="104" height="28" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="86" y="10" width="26" height="60" rx="8" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'right',
        promptInstruction: 'Half image, half quote text.',
        structuralPrompt: CITA_DIVIDIDO_PROMPT,
    },
    // 7. BOCADILLO
    {
        id: 'cita-bocadillo',
        name: 'Bocadillo',
        description: 'Cómic/Chat',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Speech bubble style layout.',
        structuralPrompt: CITA_BOCADILLO_PROMPT,
    },
    // 8. CARRUSEL
    {
        id: 'cita-carousel',
        name: 'Carrusel',
        description: 'Swipe',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Carousel style quote layout.',
        structuralPrompt: CITA_CARRUSEL_PROMPT,
    },
    // 9. NEON
    {
        id: 'cita-neon',
        name: 'Neón',
        description: 'Luminoso',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Neon sign style quote.',
        structuralPrompt: CITA_NEON_PROMPT,
    },
    // 10. MANUSCRITO
    {
        id: 'cita-manuscript',
        name: 'Manuscrito',
        description: 'Handwritten',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Handwritten style quote.',
        structuralPrompt: CITA_MANUSCRITO_PROMPT,
    },
    // 11. FLOTANTE
    {
        id: 'cita-float',
        name: 'Flotante',
        description: '3D Text',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="42" cy="34" r="18" fill="currentColor" fill-opacity="0.55" /><rect x="64" y="20" width="38" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><circle cx="28" cy="52" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Floating 3D quote text.',
        structuralPrompt: CITA_FLOTANTE_PROMPT,
    },
]
