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

    // 3. SPOTLIGHT - Servicio protagonista con foco de atención
    {
        id: 'servicio-pricing',
        name: 'Spotlight',
        description: 'Foco Central',
        svgIcon: 'Lightbulb',
        textZone: 'center',
        promptInstruction: 'Single service spotlight with dramatic central focus.',
        structuralPrompt: `
## Composición: Spotlight de Servicio

**Estructura:** Un solo servicio como protagonista absoluto bajo un foco de luz central.

### Concepto Visual:
Imagina un escenario donde TU SERVICIO es la estrella. Un foco de luz dramático 
ilumina el centro, todo lo demás queda en penumbra atmosférica.

### Jerarquía visual:
1. **Protagonista:** Representación visual abstracta del servicio en el centro exacto, bañada en luz
2. **Secundario:** Halo de luz o resplandor suave radiando desde el centro hacia los bordes
3. **Detalle:** Elementos contextuales sutiles en la penumbra (herramientas, iconos, símbolos del sector)

### Distribución:
- **Centro:** El "objeto héroe" que simboliza el servicio (70% del peso visual)
- **Periferia:** Gradiente de luz a oscuridad (efecto viñeta invertida)
- **Fondo:** Profundidad atmosférica con partículas de polvo en el haz de luz
- Headline impactante en zona superior, tipografía bold
- CTA flotando debajo del objeto central

### Iluminación:
- Luz cenital dramática tipo teatro/estudio
- Sombra suave proyectada hacia abajo
- Bordes del servicio con rim light sutil

### Evitar:
Múltiples servicios compitiendo, fondos planos sin atmósfera, iluminación uniforme aburrida.
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

    // 6. TALLER - Knolling workspace (Recuperado)
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

    // 9. INMERSIÓN - Experiencia POV Memorable
    {
        id: 'servicio-minimal',
        name: 'Inmersión',
        description: 'POV Experience',
        svgIcon: 'Eye',
        textZone: 'center',
        promptInstruction: 'Hyper-immersive First-Person POV shot. Leading lines drawing the eye inward. Cinematic depth.',
        structuralPrompt: `
## Composición: Inmersión POV (Punto de Fuga Central)

**Concepto:** El espectador NO observa, *participa*. Es el protagonista absoluto.
Usa **Líneas de Guía** y **Encuadre Natural** para crear un efecto túnel irresistible.

### Estructura y Geometría:
1. **Punto de Fuga:** Convergencia fuerte en el centro exacto de la imagen.
2. **Líneas de Guía:** Elementos arquitectónicos o herramientas del servicio formando líneas diagonales que apuntan al centro.
3. **Encuadre (Framing):** El primer plano (manos, bordes de mesa, herramientas) crea un "marco interno" que da profundidad y contexto.

### Jerarquía Visual (Profundidad):
- **Capa 1 (Primerísimo Plano - Borroso):** Elementos que tocan al espectador (manos propias, herramientas en uso). Bokeh desenfocado.
- **Capa 2 (Plano Medio - Nítido):** La acción principal del servicio ocurriendo justo delante. Foco crítico.
- **Capa 3 (Fondo - Atmosférico):** El entorno se desvanece en una luz ambiental suave.

### Iluminación y Atmósfera:
- **Luz Guía:** Una fuente de luz al final del punto de fuga invita a "entrar".
- **Textura Táctil:** Iluminación rasante suave para resaltar texturas materiales en el primer plano.
- **Sensación:** Intimidad, concentración y expertise.

### Evitar:
Planos planos de 90 grados, vistas objetivas lejanas, composiciones estáticas sin diagonales.
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

    // 11. EXPLOSIÓN - Perspectiva Explosiva Multi-Dimensional
    {
        id: 'servicio-explosion',
        name: 'Explosión',
        description: 'Radial Explosivo',
        svgIcon: 'Zap',
        textZone: 'center',
        promptInstruction: 'Explosive radial composition with extreme depth and energy burst.',
        structuralPrompt: `
## Composición: Explosión Radial Multi-Dimensional

**Concepto Visual:** Una detonación controlada de energía visual. El servicio NO se muestra, se SIENTE como una fuerza imparable emanando desde el centro hacia el espectador.

### Estructura Geométrica (Perspectiva + Equilibrio Radial):
1. **Punto de Fuga Ultra-Profundo:** El centro exacto del canvas actúa como epicentro de una explosión tridimensional.
2. **Líneas de Fuerza:** 8-12 rayos diagonales principales irradian desde el centro hacia los bordes, creando un efecto starburst.
3. **Capas en Profundidad:** Elementos se dispersan en 3 planos distintos (cercano-medio-lejano) con escala decreciente hacia el centro.

### Jerarquía Visual (Del Centro a los Bordes):
- **Epicentro (5% central):** Núcleo brillante y abstracto representando la esencia del servicio. Máxima luminosidad.
- **Radio Medio (30% del área):** Fragmentos geométricos 3D (cubos, esferas, prismas) flotando y rotando en trayectorias radiales. Enfoque nítido.
- **Periferia Explosiva (65% del área):** Partículas, estelas de luz y elementos secundarios desenfocados por el movimiento. Efecto de motion blur radial.

### Distribución y Movimiento:
- **Simetría Radial Imperfecta:** Balance visual alrededor del centro, pero con variaciones orgánicas para evitar rigidez absoluta.
- **Escala Variable:** Los elementos más cercanos al borde son 3-5x más grandes que los del núcleo, creando ilusión de profundidad extrema.
- **Rotación Implícita:** Los objetos siguen trayectorias curvas (no líneas rectas), sugiriendo un vórtice en expansión.

### Iluminación y Atmósfera:
- **Fuente Central:** El epicentro emite luz volumétrica que baña todos los elementos flotantes.
- **Rim Lighting:** Cada fragmento tiene un halo de luz en sus bordes traseros, separándolos del fondo.
- **Caustics y God Rays:** Rayos de luz atravesando el espacio tridimensional, creando haces visibles como si hubiera polvo atmosférico.
- **Profundidad de Campo Cinematográfica:** El núcleo está en foco crítico, mientras que primer plano y fondo extremo muestran bokeh hexagonal dramático.

### Psicología del Color y Textura:
- **Centro:** Blancos puros, azules eléctricos o violetas vibrantes (alta energía).
- **Transición:** Degradado hacia tonos cálidos (naranjas, magentas) a medida que los elementos se alejan.
- **Bordes:** Oscurecimiento atmosférico (viñeta invertida), con destellos ocasionales de partículas brillantes.
- **Materiales:** Cristal facetado, metales pulidos, hologramas semi-transparentes, energía pura.

### Elementos de Marca y Texto:
- **Headline:** Tipografía bold colocada en el tercio superior, siguiendo una trayectoria arqueada que respeta el flujo radial.
- **CTA:** Flotando en el tercio inferior, con un rectángulo de cristal translúcido como fondo para legibilidad.
- **Detalles del Servicio:** Iconos o palabras clave integrados en algunos de los fragmentos flotantes (como si fueran datos holográficos).

### Evitar Absolutamente:
- Fondos planos sin profundidad
- Dispersión aleatoria sin punto focal claro
- Exceso de simetría que parezca un caleidoscopio genérico
- Colores apagados o iluminación uniforme
- Elementos estáticos sin sensación de movimiento congelado
`,
    },
]
