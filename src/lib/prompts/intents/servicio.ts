import type { LayoutOption } from '@/lib/creation-flow-types'

export const SERVICIO_DESCRIPTION = 'Promociona servicios intangibles con claridad y profesionalismo.'
export const SERVICIO_EXTENDED_DESCRIPTION = 'Presenta servicios, características, precios y propuestas de valor de forma clara y atractiva.'

export const SERVICIO_REQUIRED_FIELDS = ['headline', 'service_list', 'cta']

// =============================================================================
// LAYOUTS DE SERVICIO - Composiciones estructurales (sin color, solo distribución)
// =============================================================================

export const SERVICIO_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE - Sin restricciones
    {
        id: 'servicio-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },

    // 1. BENTO GRID - Modular
    {
        id: 'servicio-grid',
        name: 'BentoGrid',
        description: 'Modular',
        svgIcon: 'Grid3x3',
        textZone: 'center',
        promptInstruction: 'Modern bento grid layout with varied cell sizes.',
        structuralPrompt: `
## Composición: Bento Grid Modular

**Estructura:** Grid asimétrico tipo Bento con celdas de tamaños variados (1x1, 2x1, 1x2).

### Jerarquía visual:
1. **Protagonista:** La celda más grande (esquina superior izquierda o centro) contiene la propuesta de valor principal
2. **Secundario:** Elementos 3D flotantes o iconos de cristal anclados en celdas específicas
3. **Detalle:** Malla de fondo sutil conectando los módulos

### Distribución:
- Grid asimétrico siguiendo división de Rectángulo Áureo
- Módulos con brillo interior suave
- Iluminación de estudio difusa

### Evitar:
Aspecto de hoja de cálculo, simetría rígida, desorden visual.
`,
    },

    // 2. BENEFICIO HERO - Split asimétrico
    {
        id: 'servicio-benefit',
        name: 'Beneficio',
        description: 'Split Hero',
        svgIcon: 'SeparatorHorizontal',
        textZone: 'left',
        promptInstruction: 'Asymmetrical split screen with benefit hero.',
        structuralPrompt: `
## Composición: Split Asimétrico de Beneficio

**Estructura:** Pantalla dividida asimétrica 60/40.

### Jerarquía visual:
1. **Protagonista:** Metáfora visual del beneficio clave ocupando el 60% del canvas
2. **Secundario:** Tipografía bold en el 40% restante (espacio negativo limpio)
3. **Detalle:** Líneas direccionales sutiles apuntando del texto al visual

### Distribución:
- Visual: sector derecho o inferior-derecho (peso visual pesado)
- Texto: sector izquierdo o superior-izquierdo (espacio negativo limpio)
- Flujo diagonal del ojo: Headline → Detalle Visual

### Evitar:
División aburrida 50/50, ilustración plana 2D, texto superpuesto sobre fondos ocupados.
`,
    },

    // 3. PRECIOS - Tríptíco central
    {
        id: 'servicio-pricing',
        name: 'Precios',
        description: 'Comparativa',
        svgIcon: 'DollarSign',
        textZone: 'center',
        promptInstruction: 'Central pricing triptych with emphasis on best value.',
        structuralPrompt: `
## Composición: Tríptico de Precios

**Estructura:** Tres columnas con énfasis central.

### Jerarquía visual:
1. **Protagonista:** Tarjeta central elevada, escala 1.2x, iluminación más brillante
2. **Secundario:** Tarjetas laterales (Básico/Enterprise) retrocedidas en profundidad Z
3. **Detalle:** Corona o cinta distinguiendo el "Mejor Valor" central

### Distribución:
- Primer plano: columna central, enfoque nítido, alto contraste
- Plano medio: columnas laterales, contraste ligeramente menor
- Fondo: señales abstractas de profundidad para mostrar separación

### Evitar:
Alineación plana, peso igual para todas las opciones, grids rígidos.
`,
    },

    // 4. PROCESO - Flujo Z-Pattern
    {
        id: 'servicio-process',
        name: 'Proceso',
        description: 'Z-Pattern',
        svgIcon: 'ArrowRight',
        textZone: 'center',
        promptInstruction: 'Z-pattern process flow with connected steps.',
        structuralPrompt: `
## Composición: Flujo de Proceso en Z

**Estructura:** Camino fluido conectando pasos en patrón Z.

### Jerarquía visual:
1. **Protagonista:** Pipeline o camino claro conectando Paso 1 → Paso 2 → Paso 3
2. **Secundario:** Hitos flotantes (esferas, cubos o iconos) en los giros clave del camino
3. **Detalle:** Líneas de movimiento o partículas indicando momentum hacia adelante

### Distribución:
- Flujo visual comenzando arriba-izquierda, pasando por centro, terminando abajo-derecha
- Puntos de paso distribuidos uniformemente a lo largo de la curva Z
- Iluminación volumétrica, energía dinámica

### Evitar:
Lista vertical estática, islas flotantes desconectadas, dirección confusa.
`,
    },

    // 5. LISTA - Ritmo vertical
    {
        id: 'servicio-list',
        name: 'Lista',
        description: 'Vertical',
        svgIcon: 'List',
        textZone: 'left',
        promptInstruction: 'Rhythmic vertical service list with icons.',
        structuralPrompt: `
## Composición: Lista Vertical de Servicios

**Estructura:** Diseño tipo app premium con mucho espacio en blanco y tipografía limpia.

### Jerarquía visual:
1. **Protagonista:** Iconos de alta calidad alineados a la izquierda, actuando como anclas visuales
2. **Secundario:** Bloques de texto claros y legibles junto a cada icono
3. **Detalle:** Líneas divisorias sutiles o planos alternados para separar elementos

### Distribución:
- Espaciado vertical consistente, creando un ritmo visual armonioso
- Margen izquierdo generoso para la iconografía
- Luz difusa y ambiental, sin sombras duras

### Evitar:
Muros de texto, espaciado desordenado, estilos de iconos inconsistentes.
`,
    },

    // 6. GARANTÍA - Foco radial
    {
        id: 'servicio-trust',
        name: 'Garantía',
        description: 'Sello Trust',
        svgIcon: 'ShieldCheck',
        textZone: 'center',
        promptInstruction: 'Radial trust seal with authority elements.',
        structuralPrompt: `
## Composición: Sello de Garantía Radial

**Estructura:** Foco central con anillos concéntricos.

### Jerarquía visual:
1. **Protagonista:** Sello de confianza o escudo masivo y detallado centrado en el frame
2. **Secundario:** Anillos concéntricos de luz, laureles o partículas radiando hacia afuera
3. **Detalle:** Elementos contextuales difuminados en el fondo profundo (oficina, apretón de manos)

### Distribución:
- Centro: el "Bullseye" con detalle y enfoque extremo
- Periferia: caída rápida de enfoque (efecto profundidad de campo)
- Texturas metálicas, causticas de vidrio, detalles en relieve

### Evitar:
Insignia caricaturesca, aspecto de sticker plano, fondo desordenado.
`,
    },

    // 7. ECOSISTEMA - Hub & Spoke
    {
        id: 'servicio-ecosystem',
        name: 'Ecosistema',
        description: 'Hub Spoke',
        svgIcon: 'Network',
        textZone: 'center',
        promptInstruction: 'Hub and spoke connectivity diagram.',
        structuralPrompt: `
## Composición: Ecosistema Hub & Spoke

**Estructura:** Núcleo central con satélites orbitando.

### Jerarquía visual:
1. **Protagonista:** Esfera central representando la plataforma principal
2. **Secundario:** Nodos satélite orbitando conectados por filamentos de datos brillantes
3. **Detalle:** Flujo de datos a través de las conexiones (partículas/pulsos de luz)

### Distribución:
- Centro del canvas: mayor densidad y brillo
- Órbita: disposición circular de iconos de características alrededor del núcleo
- Proyecciones holográficas, wireframes, estética cibernética

### Evitar:
Telaraña desordenada, puntos desconectados, gráfico de red 2D plano.
`,
    },

    // 8. ESTADÍSTICA - Tipografía Hero
    {
        id: 'servicio-stat',
        name: 'Estadística',
        description: 'Dato Hero',
        svgIcon: 'BarChart3',
        textZone: 'center',
        promptInstruction: 'Typography hero with massive key statistic.',
        structuralPrompt: `
## Composición: Estadística Tipográfica Hero

**Estructura:** Número gigante como protagonista arquitectónico.

### Jerarquía visual:
1. **Protagonista:** Tipografía 3D masiva y arquitectónica para el dato clave (ej: "99%")
2. **Secundario:** Línea de tendencia o gráfico de crecimiento entrelazado con los números 3D
3. **Detalle:** Texto de caption pequeño "sentado" en el borde de los números gigantes

### Distribución:
- Hero: ocupa 80% del espacio vertical, centrado o ligeramente a la izquierda
- Contexto: espacio negativo restante para explicación
- Iluminación arquitectónica de alto contraste (sombras largas)

### Evitar:
Fuentes finas ilegibles, gráficos estándar de Excel, aspecto de documento aburrido.
`,
    },

    // 9. MINIMAL - Pedestal de estudio
    {
        id: 'servicio-minimal',
        name: 'Minimal',
        description: 'Pedestal',
        svgIcon: 'Box',
        textZone: 'center',
        promptInstruction: 'Minimal studio pedestal with single object.',
        structuralPrompt: `
## Composición: Pedestal Minimal de Estudio

**Estructura:** Objeto único sobre podio en espacio vacío.

### Jerarquía visual:
1. **Protagonista:** Un solo objeto abstracto prístino simbolizando el servicio, sobre un podio
2. **Secundario:** Reflejo suave en el suelo/superficie
3. **Detalle:** Niebla o bruma atmosférica (extremadamente sutil)

### Distribución:
- Sujeto: exactamente centrado, flotando ligeramente sobre el pedestal
- Espacio negativo: vasto espacio vacío alrededor del sujeto para elegancia
- Texturas: porcelana, cerámica pulida o goma super-mate
- Iluminación de museo minimalista desde arriba

### Evitar:
Fondo ocupado, múltiples objetos, texto superpuesto sobre el objeto.
`,
    },

    // 10. CONEXIÓN - Interacción humana
    {
        id: 'servicio-interaction',
        name: 'Conexión',
        description: 'Humano',
        svgIcon: 'Users',
        textZone: 'bottom',
        promptInstruction: 'Human interaction moment with professional context.',
        structuralPrompt: `
## Composición: Conexión Humana

**Estructura:** Plano over-the-shoulder o two-shot.

### Jerarquía visual:
1. **Protagonista:** Momento de interacción humana auténtica (consulta, apretón de manos, explicación)
2. **Secundario:** Contexto de entorno profesional desenfocado en el fondo (profundidad de campo)
3. **Detalle:** Props sutiles indicando la industria específica (documentos, tablet, herramientas)

### Distribución:
- Foco: el punto de conexión (ojos, manos o pantalla compartida) en la Intersección Áurea
- Primer plano: hombro o elemento desenfocado enmarcando al sujeto (perspectiva voyeurística)
- Líneas de mirada dirigiendo atención entre proveedor de servicio y cliente

### Evitar:
Apretón de manos de stock photo rígido, sonrisas forzadas, mirar directamente a cámara, iluminación plana.
`,
    },

    // 11. TALLER - Knolling workspace
    {
        id: 'servicio-workshop',
        name: 'Taller',
        description: 'Knolling',
        svgIcon: 'Wrench',
        textZone: 'center',
        promptInstruction: 'Organized knolling workspace layout.',
        structuralPrompt: `
## Composición: Taller Knolling

**Estructura:** Vista cenital de herramientas organizadas con precisión obsesiva.

### Jerarquía visual:
1. **Protagonista:** Herramientas profesionales clave dispuestas con precisión obsesiva
2. **Secundario:** Manos del experto interactuando con la herramienta o material central
3. **Detalle:** Superficie de trabajo texturizada (madera, cutting mat, mármol, plano técnico)

### Distribución:
- Grid: alineación geométrica estricta de objetos (ángulos de 90 grados)
- Centro: la "Herramienta Hero" o resultado terminado exactamente en el centro
- Espacio negativo: espaciado limpio entre objetos para que el ojo descanse
- Iluminación flat lay desde arriba, sombras mínimas, alta claridad

### Evitar:
Desorden caótico, ángulos aleatorios, distorsión de perspectiva, herramientas sucias (a menos que sea artístico).
`,
    },
]
