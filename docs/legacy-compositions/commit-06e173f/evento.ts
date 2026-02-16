/**
 * EVENTO - El Evento (Fecha y Lugar)
 * Grupo: Informar
 * 
 * Intent tipo cartel o flyer digital con jerarquía visual clara
 * para fecha, hora y lugar. Perfecto para webinars, inauguraciones, fiestas.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const EVENTO_EXTENDED_DESCRIPTION = `
Diseño tipo cartel o flyer digital. Jerarquía visual clara para fecha, 
hora y lugar. Perfecto para webinars, inauguraciones, directos o 
fiestas.
`.trim()

export const EVENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'event_name',
        label: 'Nombre del Evento',
        placeholder: 'Ej: Webinar de SEO',
        type: 'text',
        required: true,
        aiContext: 'Name of the event'
    },
    {
        id: 'date_time',
        label: 'Fecha y Hora',
        placeholder: 'Ej: 24 Oct, 18:00h',
        type: 'text',
        required: true,
        aiContext: 'Date and time details'
    },
    {
        id: 'location',
        label: 'Lugar / Link',
        placeholder: 'Ej: Zoom / Madrid',
        type: 'text',
        required: false,
        aiContext: 'Location or platform'
    }
]

export const EVENTO_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'evento-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. CONFERENCIA - Professional Speaker
    {
        id: 'evento-conference',
        name: 'Speaker',
        description: 'Profesional / Speaker',
        svgIcon: 'Mic',
        textZone: 'right',
        promptInstruction: 'Professional conference layout with speaker focus.',
        structuralPrompt: `
## Composición: Professional Conference Poster

**Estructura:** Cartel de conferencia profesional.

### Jerarquía Visual
1. **Principal:** Retrato grande de orador o marca del evento como visual héroe
2. **Secundario:** Bloque de información claramente apilado (Quién, Dónde, Cuándo)
3. **Terciario:** Pie con logos de patrocinadores, URL de registro o redes sociales

### Distribución
- Visual héroe de orador/marca en el 50% superior
- Información de texto estructurada en el 35% medio
- Patrocinadores/registro en el 15% inferior

### Estilo
- **Textura:** Fotografía profesional, elegancia corporativa
- **Iluminación:** Iluminación de estudio, fondos limpios
- **Paleta:** Azules corporativos, grises, blancos o primario de marca

### Evitar
Estética casual, diseños desestructurados, vibras de fiesta.
`.trim(),
    },
    // 2. FIESTA - Nightlife Energy
    {
        id: 'evento-party',
        name: 'Fiesta',
        description: 'Noche y Energía',
        svgIcon: 'Music',
        textZone: 'center',
        promptInstruction: 'High energy nightlife or concert flyer.',
        structuralPrompt: `
## Composición: Nightlife Party Flyer

**Estructura:** Flyer de fiesta nocturna.

### Jerarquía Visual
1. **Principal:** Nombre del evento en tipografía estilizada masiva con efectos de brillo
2. **Secundario:** Visuales dinámicos: luces, siluetas de multitud, cabina de DJ, energía abstracta
3. **Terciario:** Fecha y lineup anclados en esquinas o bordes

### Distribución
- Nombre de evento dominante en el centro
- Imaginería de fiesta atmosférica a sangre completa
- Fecha, DJs e info de lugar en bordes

### Estilo
- **Textura:** Eléctrica, neón, fotografía de club brillante
- **Iluminación:** Efectos estroboscópicos, rayos láser, ambiente de club nocturno
- **Paleta:** Base oscura con acentos neón (rosa, azul, morado, lima)

### Evitar
Sensación corporativa, estética diurna, diseños planos.
`.trim(),
    },
    // 3. TALLER - Workshop Learning
    {
        id: 'evento-workshop',
        name: 'Taller',
        description: 'Educativo / Curso',
        svgIcon: 'BookOpen',
        textZone: 'left',
        promptInstruction: 'Structured educational workshop layout.',
        structuralPrompt: `
## Composición: Educational Workshop Invitation

**Estructura:** Invitación a taller educativo.

### Jerarquía Visual
1. **Principal:** Título invitante con ilustración amigable o foto de la actividad
2. **Secundario:** Pistas visuales claras de "Lo que aprenderás" o viñetas
3. **Terciario:** Área enmarcada o resaltada para logística de fecha/hora/lugar

### Distribución
- Título de bienvenida y gráfico del tema
- Resultados de aprendizaje o vista previa del taller
- Caja resaltada para detalles prácticos

### Estilo
- **Textura:** Limpia, brillante, sensación de materiales educativos
- **Iluminación:** Brillante, optimista, amigable para el aula
- **Paleta:** Colores accesibles, pasteles con toques de energía

### Evitar
Diseños intimidantes, pesadez corporativa, estética de fiesta.
`.trim(),
    },
    // 4. FESTIVAL - Artistic Cultural
    {
        id: 'evento-festival',
        name: 'Festival',
        description: 'Artístico / Cultural',
        svgIcon: 'Palette',
        textZone: 'center',
        promptInstruction: 'Expressive artistic festival poster.',
        structuralPrompt: `
## Composición: Artistic Festival Poster

**Estructura:** Cartel de festival artístico.

### Jerarquía Visual
1. **Principal:** Fondo artístico completo (collage, pintura o arte abstracto)
2. **Secundario:** Nombre del evento integrado en el arte, siguiendo formas
3. **Terciario:** Logo del evento prominente y fechas clave como anclas

### Distribución
- Tratamiento de lienzo artístico a sangre completa
- Tipografía tejida en la composición visual
- Ubicación en esquina o borde para logo/fechas

### Estilo
- **Textura:** Bohemia, artística, rica en textura, sensación hecha a mano
- **Iluminación:** Iluminación interpretativa artística, no fotográfica
- **Paleta:** Colorida, ecléctica, mezcla de colores expresiva

### Evitar
Diseños corporativos, fotografía de stock, composiciones predecibles.
`.trim(),
    },
    // 5. NETWORKING - Connection Focus
    {
        id: 'evento-networking',
        name: 'Networking',
        description: 'Tech / Meetup',
        svgIcon: 'Network',
        textZone: 'center',
        promptInstruction: 'Modern networking event with connection themes.',
        structuralPrompt: `
## Composición: Community Networking Meetup

**Estructura:** Meetup de networking comunitario.

### Jerarquía Visual
1. **Principal:** Metáfora visual de conexión (líneas de red, puntos, avatares, círculos superpuestos)
2. **Secundario:** Hub central con título del evento como nodo conector
3. **Terciario:** Palabras clave de tema o tipos de participantes en la periferia

### Distribución
- Patrón de conexión abstracto abarcando el lienzo
- Título de evento central como punto focal
- Áreas de tema/especialidad distribuidas alrededor de los bordes

### Estilo
- **Textura:** Tech, digital, estética moderna de startup
- **Iluminación:** Brillo tipo pantalla, ambiente digital
- **Paleta:** Colores amigables con tech, azules, turquesas, acentos degradados

### Evitar
Imaginería aislada, elementos no conectados, estética de vieja escuela.
`.trim(),
    },
    // 6. RESERVA - Save the Date Elegance (Map to 'evento-minimal' ID from types)
    {
        id: 'evento-minimal',
        name: 'Fecha',
        description: 'Minimalista',
        svgIcon: 'Calendar',
        textZone: 'center',
        promptInstruction: 'Elegant minimal save the date layout.',
        structuralPrompt: `
## Composición: Elegant Save the Date

**Estructura:** Save the Date elegante.

### Jerarquía Visual
1. **Principal:** Fecha masiva o elemento visual icónico único como héroe
2. **Secundario:** Vasto espacio negativo creando sensación de exclusividad
3. **Terciario:** Texto de soporte pequeño y refinado equilibrado por espacio en blanco

### Distribución
- Fecha centralizada o elemento icónico
- 70%+ dedicado a espacio para respirar
- Pie minimalista para información de soporte

### Estilo
- **Textura:** Papel premium, acentos de foil, elegancia de invitación
- **Iluminación:** Suave, lujosa, calidad de galería
- **Paleta:** Crema, oro, negro o un solo acento sofisticado

### Evitar
Detalles desordenados, estética casual, diseños abarrotados.
`.trim(),
    },
    // 7. VIRTUAL - Online Event
    {
        id: 'evento-virtual',
        name: 'Virtual',
        description: 'Online',
        svgIcon: 'Wifi',
        textZone: 'center',
        promptInstruction: 'Virtual online event layout.',
        structuralPrompt: `
## Composición: Virtual/Online Event Banner

**Estructura:** Banner de evento virtual/online.

### Jerarquía Visual
1. **Principal:** Indicador de plataforma digital (Zoom, Teams, gráfico de Live Stream)
2. **Secundario:** Caras de oradores o maqueta de interfaz de pantalla
3. **Terciario:** Info de conexión, enlace de registro, botón de añadir calendario

### Distribución
- Marca de plataforma o visual de interfaz de video
- Cuadrícula o presentación de orador destacado
- Llamada a la acción prominente de "Unirse" o registro

### Estilo
- **Textura:** UI digital, basada en pantalla, sensación de interfaz tech
- **Iluminación:** Brillo de pantalla, iluminación amigable para webcam
- **Paleta:** Colores de plataforma integrados con marca, modo oscuro o claro

### Evitar
Imaginería de lugar físico, entornos al aire libre, diseños solo para impresión.
`.trim(),
    },
    // 8. DEPORTIVO - Sports/Athletic Event
    {
        id: 'evento-sport',
        name: 'Deporte',
        description: 'Acción',
        svgIcon: 'Activity',
        textZone: 'center',
        promptInstruction: 'Sports match or event poster.',
        structuralPrompt: `
## Composición: Athletic Sports Event Poster

**Estructura:** Cartel de evento deportivo.

### Jerarquía Visual
1. **Principal:** Toma de acción dinámica o atleta en movimiento, alta energía
2. **Secundario:** Título de evento audaz e impactante en tipografía atlética
3. **Terciario:** Detalles de fecha, lugar y competición

### Distribución
- Imaginería deportiva dinámica dominando la composición
- Tratamiento de título audaz sobre o al lado de la acción
- Tira de información clara para logística

### Estilo
- **Textura:** Fotografía de acción, desenfoque de movimiento, intensidad atlética
- **Iluminación:** Iluminación dramática de estadio o exterior
- **Paleta:** Colores de alta energía, colores de equipo, vibras competitivas

### Evitar
Poses estáticas, estética suave, diseños corporativos.
`.trim(),
    },
    // 9. INAUGURACIÓN - Grand Opening
    {
        id: 'evento-grand',
        name: 'Inauguración',
        description: 'Opening',
        svgIcon: 'Scissors',
        textZone: 'center',
        promptInstruction: 'Grand opening ribbon cutting style.',
        structuralPrompt: `
## Composición: Grand Opening Celebration

**Estructura:** Celebración de gran inauguración.

### Jerarquía Visual
1. **Principal:** Visual de corte de cinta, tijeras doradas o gráfico de ceremonia de apertura
2. **Secundario:** Nueva ubicación/exterior de lugar o vista previa interior
3. **Terciario:** Ofertas exclusivas de apertura o detalles de acceso VIP

### Distribución
- Cinta central o gráfico de apertura
- Imágenes de vista previa del nuevo espacio
- Banner para especiales de apertura o invitaciones

### Estilo
- **Textura:** Celebratoria, premium, festiva con elegancia
- **Iluminación:** Brillante, acogedora, iluminación de gran revelación
- **Paleta:** Oro, rojo, colores de marca en modo celebración

### Evitar
Diseños de negocios regulares, enfoque discreto, vibras casuales.
`.trim(),
    },
    // 10. CONCIERTO - Music Performance
    {
        id: 'evento-concert',
        name: 'Concierto',
        description: 'Música',
        svgIcon: 'Music',
        textZone: 'center',
        promptInstruction: 'Music concert poster.',
        structuralPrompt: `
## Composición: Concert Music Event Poster

**Estructura:** Cartel de evento de concierto musical.

### Jerarquía Visual
1. **Principal:** Imagen de artista/banda o visual musical icónico (instrumentos, escenario)
2. **Secundario:** Nombre de artista masivo o título de show en tipografía personalizada
3. **Terciario:** Fechas de gira, lugar, info de entradas en jerarquía organizada

### Distribución
- Imaginería de artista/banda dominante
- Tratamiento de tipografía audaz para el acto
- Sección de información de gira/lugar organizada

### Estilo
- **Textura:** Estética de póster de concierto, estilo apropiado al género (rock/pop)
- **Iluminación:** Iluminación de escenario, ambiente de concierto, drama de foco
- **Paleta:** Apropiada al género: oscura para rock, neón para electrónica, vintage para retro

### Evitar
Presentaciones corporativas, estética tranquila, diseños cargados de texto.
`.trim(),
    },
    // 11. AGENDA - Multi-Event Schedule
    {
        id: 'evento-agenda',
        name: 'Agenda',
        description: 'Itinerario',
        svgIcon: 'List',
        textZone: 'left',
        promptInstruction: 'Event agenda or schedule.',
        structuralPrompt: `
## Composición: Multi-Event Schedule Layout

**Estructura:** Diseño de horario multi-evento.

### Jerarquía Visual
1. **Principal:** Vista de línea de tiempo o calendario mostrando múltiples eventos programados
2. **Secundario:** Categorías de eventos codificadas por color o identificadas por icono
3. **Terciario:** Detalles de evento individual en tarjetas o filas organizadas

### Distribución
- Progresión de evento vertical u horizontal
- Tarjetas de evento individual con formato consistente
- Indicadores de categoría o elementos de navegación

### Estilo
- **Textura:** Infografía limpia, visualización de datos organizada
- **Iluminación:** Uniforme, informativa, centrada en claridad
- **Paleta:** Sistema codificado por color, jerarquía visual clara

### Evitar
Enfoque en evento único, tiempo caótico, horario poco claro.
`.trim(),
    },
]

export const EVENTO_DESCRIPTION = 'Diseño tipo cartel/flyer con jerarquía para destacar fecha, hora y lugar. 11 composiciones desde conferencia hasta festival.'
