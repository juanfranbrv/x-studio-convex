/**
 * BTS - Behind the Scenes (Proceso creativo)
 * Grupo: Conectar
 * 
 * Comparte el proceso auténtico detrás del trabajo.
 * Humaniza la marca mostrando el lado real de la creación.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const BTS_EXTENDED_DESCRIPTION = `
Comparte el proceso auténtico detrás del trabajo.
Humaniza la marca mostrando el lado real de la creación.
`.trim()

export const BTS_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'description',
        label: 'Descripción',
        placeholder: 'Ej: Preparando el nuevo lanzamiento',
        type: 'text',
        required: true,
        aiContext: 'What is being shown behind the scenes'
    },
    {
        id: 'context',
        label: 'Contexto',
        placeholder: 'Ej: En el estudio',
        type: 'text',
        required: false,
        aiContext: 'Setting or context for the behind the scenes'
    }
]

export const BTS_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'bts-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'help_center',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. PROCESO - Work in Progress Macro
    {
        id: 'bts-wip',
        name: 'Proceso',
        description: 'Work in Progress',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="18" y="12" width="84" height="56" rx="10" fill="currentColor" fill-opacity="0.2" /><circle cx="34" cy="28" r="9" fill="currentColor" fill-opacity="0.7" /><circle cx="60" cy="40" r="9" fill="currentColor" fill-opacity="0.55" /><circle cx="86" cy="52" r="9" fill="currentColor" fill-opacity="0.4" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Macro shot of tools and unfinished work.',
        structuralPrompt: `
## Composición: Work in Progress Close-up

**Estructura:** Primer plano de herramientas y trabajo en curso.

### Jerarquía Visual
1. **Principal:** Primer plano macro de manos trabajando o herramientas en acción (bolígrafo, pincel, teclado)
2. **Secundario:** El proyecto sin terminar visible en el encuadre
3. **Terciario:** Desenfoque de profundidad de campo ocultando el desorden del fondo

### Distribución
- Herramientas y acción en el centro
- Proyecto en curso visible
- Fondo desenfocado para centrar la atención

### Estilo
- **Textura:** Cruda, auténtica, grano de película
- **Iluminación:** Luz de lámpara de trabajo, cálida y focalizada
- **Paleta:** Materiales naturales, superficies sin terminar, colores reales

### Evitar
Producto final perfectamente pulido, sensación de foto de stock preparada.
`.trim(),
    },
    // 2. ESCRITORIO - Creative Workspace
    {
        id: 'bts-desk',
        name: 'Escritorio',
        description: 'Workspace',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="22" cy="24" r="8" fill="currentColor" fill-opacity="0.7" /><rect x="38" y="18" width="64" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><circle cx="22" cy="52" r="8" fill="currentColor" fill-opacity="0.7" /><rect x="38" y="46" width="56" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Creative desk setup with scattered items.',
        structuralPrompt: `
## Composición: Creative Desk Layout

**Estructura:** Configuración de escritorio creativo con elementos dispersos.

### Jerarquía Visual
1. **Principal:** Toma cenital o amplia de un escritorio creativo desordenado
2. **Secundario:** Bocetos dispersos, taza de café, herramientas, referencias
3. **Terciario:** Pantalla o cuaderno mostrando el proyecto principal

### Distribución
- Superficie completa del escritorio como lienzo
- Herramientas creativas y materiales dispersos
- Trabajo en curso visible en pantalla/papel

### Estilo
- **Textura:** Fotografía "knolling" o caos organizado
- **Iluminación:** Luz natural de ventana, ambiente cálido
- **Paleta:** Madera, papel, café, tinta - colores reales de espacio de trabajo

### Evitar
Escritorio vacío y limpio, oficina estéril, desorden falso.
`.trim(),
    },
    // 3. MOODBOARD - Inspiration Wall
    {
        id: 'bts-moodboard',
        name: 'Inspiración',
        description: 'Moodboard',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="14" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="30" y="20" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Wall covered in inspiration prints.',
        structuralPrompt: `
## Composición: Inspiration Wall Collage

**Estructura:** Pared cubierta con impresiones de inspiración.

### Jerarquía Visual
1. **Principal:** Pared cubierta de impresiones, bocetos e imágenes de referencia
2. **Secundario:** Cinta adhesiva, chinchetas, muestras de color como elementos decorativos
3. **Terciario:** Mano señalando o ajustando una pieza (opcional)

### Distribución
- Superficie cubierta con técnica mixta
- Cinta adhesiva, pines, notas visibles
- Elemento de interacción humana opcional

### Estilo
- **Textura:** Collage de papel, técnica mixta, materiales físicos
- **Iluminación:** Iluminación de galería o riel de estudio
- **Paleta:** Mezcla ecléctica reflejando la inspiración

### Evitar
Captura de pantalla digital, imagen única, captura de Pinterest.
`.trim(),
    },
    // 4. BOCETO - Sketch vs Final
    {
        id: 'bts-sketch',
        name: 'Boceto',
        description: 'Sketch/Real',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="18" width="100" height="20" rx="10" fill="currentColor" fill-opacity="0.7" /><rect x="20" y="44" width="80" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Split screen sketch vs final.',
        structuralPrompt: `
## Composición: Sketch to Final Comparison

**Estructura:** Pantalla dividida comparando boceto vs final.

### Jerarquía Visual
1. **Principal:** Comparación en pantalla dividida entre etapas
2. **Secundario:** Izquierda: Boceto a lápiz o wireframe
3. **Terciario:** Derecha: Render final pulido o resultado

### Distribución
- Lado izquierdo mostrando trabajo preliminar
- Lado derecho mostrando resultado pulido
- Línea vertical, rasgadura o mezcla entre ambos

### Estilo
- **Textura:** Lápiz de grafito vs píxel perfecto brillante
- **Iluminación:** Escaneado plano en boceto, iluminación 3D en final
- **Paleta:** Boceto blanco/negro vs final a todo color

### Evitar
Mala alineación entre mitades, evolución poco clara.
`.trim(),
    },
    // 5. EVOLUCIÓN - Before/After Progress
    {
        id: 'bts-before',
        name: 'Antes/Después',
        description: 'Evolución',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="10" width="100" height="60" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="18" y="20" width="84" height="40" rx="8" fill="currentColor" fill-opacity="0.2" /><rect x="18" y="14" width="50" height="6" rx="3" fill="currentColor" fill-opacity="0.6" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Transformation before and after.',
        structuralPrompt: `
## Composición: Project Evolution Timeline

**Estructura:** Transformación antes y después.

### Jerarquía Visual
1. **Principal:** Dos o más etapas del mismo proyecto
2. **Secundario:** Flechas de progreso o línea de tiempo conectando estados
3. **Terciario:** Etiquetas "Inicio" y "Ahora" o de etapa

### Distribución
- Etapa anterior del trabajo
- Etapa actual o final
- Indicador visual de progreso

### Estilo
- **Textura:** Documentación de proceso, historia de progreso
- **Iluminación:** Consistente para mostrar el cambio real
- **Paleta:** Etapa temprana desaturada vs final saturado

### Evitar
Línea de tiempo confusa, imágenes aleatorias sin relación.
`.trim(),
    },
    // 6. PALETA - Color Extraction
    {
        id: 'bts-palette',
        name: 'Paleta',
        description: 'Colores',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Image with extracted color swatches.',
        structuralPrompt: `
## Composición: Color Palette Extraction

**Estructura:** Imagen con muestras de color extraídas.

### Jerarquía Visual
1. **Principal:** Foto o diseño base hermoso como fuente
2. **Secundario:** Fila de 5 muestras de color extraídas de la imagen
3. **Terciario:** Códigos hexadecimales o nombres de colores como etiquetas

### Distribución
- Visual principal del cual se extraen los colores
- Tarjetas o barra flotante de muestras de color
- Texto de identificación de color

### Estilo
- **Textura:** Estética de interfaz de herramienta de diseño
- **Iluminación:** Presentación limpia y precisa en color
- **Paleta:** Colores extraídos armoniosos y combinables

### Evitar
Colores que chocan, muestras diminutas, falta de conexión con la fuente.
`.trim(),
    },
    // 7. EQUIPO - Team at Work
    {
        id: 'bts-team',
        name: 'Equipo',
        description: 'Colaboración',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="38" cy="40" r="22" fill="currentColor" fill-opacity="0.6" /><rect x="70" y="18" width="34" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="52" width="24" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Team collaborating behind scenes.',
        structuralPrompt: `
## Composición: Team Collaboration Candid

**Estructura:** Equipo colaborando detrás de escena.

### Jerarquía Visual
1. **Principal:** Miembros del equipo colaborando, haciendo lluvia de ideas o creando juntos
2. **Secundario:** Entorno de trabajo y herramientas visibles en el encuadre
3. **Terciario:** Superposición de texto sutil con contexto de equipo/proyecto

### Distribución
- Interacción del equipo como foco principal
- Entorno de trabajo auténtico
- Área de texto o leyenda opcional

### Estilo
- **Textura:** Documental cándido, momentos reales
- **Iluminación:** Luz natural de oficina o estudio
- **Paleta:** Colores de lugar de trabajo fieles a la realidad

### Evitar
Fotos de stock posadas, oficinas vacías, foco en una sola persona.
`.trim(),
    },
    // 8. HERRAMIENTAS - Tools of the Trade
    {
        id: 'bts-tools',
        name: 'Herramientas',
        description: 'Tools',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="104" height="64" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="18" y="18" width="84" height="44" rx="8" fill="currentColor" fill-opacity="0.15" /><rect x="24" y="24" width="60" height="14" rx="7" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Tools of the trade laydown.',
        structuralPrompt: `
## Composición: Tools Flat Lay

**Estructura:** Disposición plana de herramientas.

### Jerarquía Visual
1. **Principal:** Arreglo cenital de herramientas/equipo profesional
2. **Secundario:** Organización estilo "knolling" sobre superficie limpia
3. **Terciario:** Logotipo o insignia visible en la herramienta destacada

### Distribución
- Herramienta o kit central destacado
- Accesorios y artículos circundantes
- Superficie de fondo limpia

### Estilo
- **Textura:** Fotografía de producto, estética knolling
- **Iluminación:** Iluminación uniforme de softbox cenital
- **Paleta:** Colores de herramientas sobre fondo neutral

### Evitar
Arreglo desordenado al azar, herramientas sucias, artículos poco claros.
`.trim(),
    },
    // 9. ESTUDIO - Studio Space
    {
        id: 'bts-studio',
        name: 'Estudio',
        description: 'Ambiente',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="38" cy="40" r="22" fill="currentColor" fill-opacity="0.6" /><rect x="70" y="18" width="34" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="52" width="24" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Wide shot of creative estudio.',
        structuralPrompt: `
## Composición: Studio Environment Shot

**Estructura:** Toma amplia del estudio creativo.

### Jerarquía Visual
1. **Principal:** Toma amplia del estudio creativo o espacio de trabajo
2. **Secundario:** Equipo, materiales y proyectos en curso visibles
3. **Terciario:** Elementos de marca o señalización en el espacio

### Distribución
- Entorno completo del estudio
- Áreas de trabajo activas y proyectos
- Presencia de marca en el espacio

### Estilo
- **Textura:** Fotografía arquitectónica, diseño de interiores
- **Iluminación:** Mezcla de luz natural y artificial de estudio
- **Paleta:** Colores reales de estudio con acentos de marca

### Evitar
Armario estrecho, puramente residencial, sin sensación creativa.
`.trim(),
    },
    // 10. MAKING_OF - Production Shot
    {
        id: 'bts-makingof',
        name: 'Making Of',
        description: 'Rodaje',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="38" cy="40" r="22" fill="currentColor" fill-opacity="0.6" /><rect x="70" y="18" width="34" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="52" width="24" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Behind the camera view.',
        structuralPrompt: `
## Composición: Making-Of Production Shot

**Estructura:** Vista detrás de cámara.

### Jerarquía Visual
1. **Principal:** La configuración de producción visible (cámara, luces, set)
2. **Secundario:** El sujeto siendo fotografiado/filmado en contexto
3. **Terciario:** Siluetas de equipo o personal añadiendo escala

### Distribución
- La escena/sujeto siendo capturado
- Equipo de producción visible
- Elemento humano operando el equipo

### Estilo
- **Textura:** Detrás de cámara, documental de producción
- **Iluminación:** Mixta: iluminación del set visible más práctica
- **Paleta:** Tonos de producción más oscuros con contraste de iluminación del set

### Evitar
Solo resultado final, proceso oculto, sin equipo visible.
`.trim(),
    },
    // 11. DETALLE - Macro Detail Focus
    {
        id: 'bts-detail',
        name: 'Detalle',
        description: 'Zoom',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="14" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="30" y="20" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Close up detail of work.',
        structuralPrompt: `
## Composición: Extreme Detail Macro

**Estructura:** Primer plano extremo de detalle.

### Jerarquía Visual
1. **Principal:** Primer plano extremo de textura, material o artesanía
2. **Secundario:** Pistas de contexto sobre a qué pertenece el detalle
3. **Terciario:** Marca de agua o leyenda sutil de marca

### Distribución
- Detalle extremo llenando el encuadre
- Pistas del objeto más grande
- Presencia mínima de marca

### Estilo
- **Textura:** Fotografía macro, exploración de materiales
- **Iluminación:** Luz rasante para revelar textura
- **Paleta:** Colores de materiales naturales en detalle

### Evitar
Fotos completas del producto, detalle poco claro, enfoque borroso.
`.trim(),
    },
]

export const BTS_DESCRIPTION = 'Behind-the-scenes y proceso creativo. 11 composiciones para mostrar el lado auténtico.'
