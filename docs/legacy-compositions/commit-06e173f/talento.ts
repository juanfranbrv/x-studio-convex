/**
 * TALENTO - El Talento (Hiring & Employer Branding)
 * Grupo: Conectar
 * 
 * Para atraer talento, mostrar cultura de empresa y employer branding.
 * Anuncios de empleo y spotlight de empleados.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const TALENTO_EXTENDED_DESCRIPTION = `
Diseño para atraer talento, mostrar cultura de empresa y employer branding.
Anuncios de empleo atractivos y spotlight de empleados.
`.trim()

export const TALENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'headline',
        label: 'Título Principal',
        placeholder: 'Ej: ¡Únete a nuestro equipo!',
        type: 'text',
        required: true,
        aiContext: 'Main hiring message or headline'
    },
    {
        id: 'role_title',
        label: 'Puesto',
        placeholder: 'Ej: Diseñador Senior',
        type: 'text',
        required: false,
        aiContext: 'Job title or role being offered'
    },
    {
        id: 'cta',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: Aplica ahora',
        type: 'text',
        required: false,
        aiContext: 'Call to action for applicants'
    }
]

export const TALENTO_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'talento-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. CONTRATANDO - Classic Hiring Poster
    {
        id: 'talento-hiring',
        name: 'Contratando',
        description: 'Póster',
        svgIcon: 'Megaphone',
        textZone: 'center',
        promptInstruction: 'Bold hiring announcement poster.',
        structuralPrompt: `
## Composición: Hiring Announcement Poster

**Estructura:** Póster de Contratación.

### Jerarquía Visual
1. **Principal:** Texto destacado "WE ARE HIRING" o "ÚNETE" como héroe
2. **Secundario:** Fondo de oficina dinámica o patrones geométricos abstractos
3. **Terciario:** Título del puesto y llamada a la acción "Aplica Ahora"

### Distribución
- Tag "Oportunidad de Carrera" arriba
- Mensaje de contratación principal en el centro
- Detalles del rol y CTA abajo

### Estilo
- **Textura:** Patrones geométricos corporativos limpios, diseño Memphis
- **Iluminación:** Iluminación brillante, optimista, clave alta
- **Paleta:** Colores de marca energéticos, colores primarios

### Evitar
Fotos de apretón de manos aburridas de stock, vibras oscuras y tristes.
`.trim(),
    },
    // 2. CULTURA - Life at Company Grid
    {
        id: 'talento-culture',
        name: 'Cultura',
        description: 'Grid Fotos',
        svgIcon: 'LayoutGrid',
        textZone: 'center',
        promptInstruction: 'Masonry grid of team culture photos.',
        structuralPrompt: `
## Composición: Team Culture Photo Grid

**Estructura:** Mosaico de Cultura de Equipo.

### Jerarquía Visual
1. **Principal:** Mosaico (masonry) de fotos espontáneas del equipo
2. **Secundario:** Insignia de texto superpuesta "Life at [Company]"
3. **Terciario:** Bordes coloridos, cinta adhesiva o elementos de marco separando imágenes

### Distribución
- Múltiples fotos espontáneas del equipo en rejilla
- Superposición de texto central
- Elementos decorativos de marco

### Estilo
- **Textura:** Marcos Polaroid, cinta washi, estética de álbum de recortes
- **Iluminación:** Luz solar natural, filtros cálidos
- **Paleta:** Multicolor, vibrante, divertida, auténtica

### Evitar
Fotos corporativas rígidas, alineación perfecta rígida.
`.trim(),
    },
    // 3. VALORES - Core Value Statement
    {
        id: 'talento-values',
        name: 'Valores',
        description: 'Tipografía',
        svgIcon: 'Type',
        textZone: 'center',
        promptInstruction: 'Giant core value typography.',
        structuralPrompt: `
## Composición: Core Value Typography

**Estructura:** Tipografía de Valor Central.

### Jerarquía Visual
1. **Principal:** Una palabra poderosa (INTEGRIDAD, INNOVACIÓN) en tipografía gigante
2. **Secundario:** Fondo abstracto representando el concepto visualmente
3. **Terciario:** Pequeña definición o texto de explicación abajo

### Distribución
- Palabra de valor masiva como héroe
- Imágenes de fondo conceptuales
- Texto de definición

### Estilo
- **Textura:** Letras 3D, materiales arquitectónicos (hormigón, vidrio)
- **Iluminación:** Iluminación lateral dramática, sombras largas
- **Paleta:** Monocromo con un color de acento fuerte

### Evitar
Texto desordenado, fuentes débiles, interpretaciones literales.
`.trim(),
    },
    // 4. BENEFICIOS - Perks Icons Display
    {
        id: 'talento-benefits',
        name: 'Beneficios',
        description: 'Iconos 3D',
        svgIcon: 'Gift',
        textZone: 'center',
        promptInstruction: '3D icons representing company perks.',
        structuralPrompt: `
## Composición: Benefits Icon Display

**Estructura:** Visualización de Iconos de Beneficios.

### Jerarquía Visual
1. **Principal:** 3-4 iconos 3D representando beneficios (Remoto, Salud, Equity)
2. **Secundario:** Plataformas flotantes o burbujas sosteniendo los iconos
3. **Terciario:** Encabezado "¿Por qué unirte?"

### Distribución
- Encabezado de beneficios
- Fila o cuadrícula de iconos de beneficios
- Etiquetas de texto para cada beneficio

### Estilo
- **Textura:** Arcilla 3D suave, colores pastel, formas redondeadas
- **Iluminación:** Iluminación suave y juguetona
- **Paleta:** Colores pastel, amigables, accesibles

### Evitar
Bordes afilados, colores agresivos, iconos de línea planos.
`.trim(),
    },
    // 5. SPOTLIGHT - Employee Story
    {
        id: 'talento-spotlight',
        name: 'Spotlight',
        description: 'Historia',
        svgIcon: 'User',
        textZone: 'right',
        promptInstruction: 'Employee portrait with quote.',
        structuralPrompt: `
## Composición: Employee Spotlight Feature

**Estructura:** Spotlight de Empleado.

### Jerarquía Visual
1. **Principal:** Retrato grande del empleado en un lado
2. **Secundario:** Gran marca de cita y su texto de historia personal
3. **Terciario:** Etiqueta de identificación de nombre y rol

### Distribución
- Retrato de empleado (50% ancho)
- Cita de historia personal (50% ancho)
- Crédito: Nombre, rol, antigüedad

### Estilo
- **Textura:** Diseño de revista editorial, fuentes serif elegantes
- **Iluminación:** Iluminación de retrato de estudio profesional
- **Paleta:** Elegante, sofisticada, colores de marca

### Evitar
Fondo ocupado, texto pequeño, fotos de baja calidad.
`.trim(),
    },
    // 6. OFICINA - Workspace Vibes
    {
        id: 'talento-office',
        name: 'Oficina',
        description: 'Espacio',
        svgIcon: 'Building',
        textZone: 'center',
        promptInstruction: 'Atmospheric office space shot.',
        structuralPrompt: `
## Composición: Workspace Environment Shot

**Estructura:** Ambiente de Oficina.

### Jerarquía Visual
1. **Principal:** toma atmosférica de espacio de trabajo moderno o configuración de escritorio
2. **Secundario:** Profundidad de campo bokeh en el fondo
3. **Terciario:** Texto superpuesto "Tu nuevo escritorio te espera"

### Distribución
- Ambiente interior como imagen principal
- Foco nítido en área de escritorio atractiva
- Superposición de texto sutil centrada

### Estilo
- **Textura:** Fotografía de diseño de interiores, líneas limpias, plantas
- **Iluminación:** Luz de ventana natural, brillo interior cálido
- **Paleta:** Tonos neutros, madera, vegetación

### Evitar
Cables desordenados, habitaciones oscuras vacías, vibras de hospital estériles.
`.trim(),
    },
    // 7. EQUIPO - Team Group Shot
    {
        id: 'talento-team',
        name: 'Equipo',
        description: 'Foto Grupal',
        svgIcon: 'Users',
        textZone: 'bottom',
        promptInstruction: 'Wide angle team group photo.',
        structuralPrompt: `
## Composición: Team Group Photo

**Estructura:** Foto Grupal de Equipo.

### Jerarquía Visual
1. **Principal:** Toma grupal dinámica de miembros diversos del equipo
2. **Secundario:** Texto "Únete a nuestro equipo" o identificador de equipo
3. **Terciario:** Logo de marca y URL de página de carreras

### Distribución
- Fotografía grupal de ancho completo
- Superposición de texto con degradado para legibilidad
- Enlace de carreras o botón de aplicar

### Estilo
- **Textura:** Fotografía grupal espontánea, momentos auténticos
- **Iluminación:** Iluminación natural o de oficina
- **Paleta:** Colores de entorno real, acentos de marca

### Evitar
Fotos posadas rígidas, falta de diversidad, sonrisas falsas.
`.trim(),
    },
    // 8. REMOTO - Remote Work
    {
        id: 'talento-remote',
        name: 'Remoto',
        description: 'Lifestyle',
        svgIcon: 'Laptop',
        textZone: 'center',
        promptInstruction: 'Remote work lifestyle setting.',
        structuralPrompt: `
## Composición: Remote Work Lifestyle

**Estructura:** Estilo de Vida Remoto.

### Jerarquía Visual
1. **Principal:** Configuración de trabajo remoto aspiracional (oficina en casa, cafetería)
2. **Secundario:** Mensaje "Trabaja desde cualquier lugar"
3. **Terciario:** Indicadores de flexibilidad de ubicación (globo, pines, mapa)

### Distribución
- Imagen de entorno de trabajo remoto
- Mensaje de flexibilidad
- Iconos de ubicación o elementos de mapa

### Estilo
- **Textura:** Fotografía lifestyle, espacios aspiracionales
- **Iluminación:** Luz natural, cálida y acogedora
- **Paleta:** Relajado, cálido, colores de bienvenida

### Evitar
Espacios pequeños claustrofóbicos, caos desordenado.
`.trim(),
    },
    // 9. CRECIMIENTO - Career Growth
    {
        id: 'talento-growth',
        name: 'Crecimiento',
        description: 'Escalera',
        svgIcon: 'TrendingUp',
        textZone: 'center',
        promptInstruction: 'Growth metaphor like stairs or mountain.',
        structuralPrompt: `
## Composición: Career Growth Path

**Estructura:** Camino de Crecimiento Profesional.

### Jerarquía Visual
1. **Principal:** Metáfora visual de crecimiento (escaleras, cima de montaña, camino)
2. **Secundario:** Mensaje "Crece con nosotros" o avance de carrera
3. **Terciario:** Indicadores de hitos de carrera

### Distribución
- Visual de metáfora de crecimiento como héroe
- Texto de promesa de avance
- Indicadores de etapa de carrera

### Estilo
- **Textura:** Imágenes inspiradoras, aspiracionales
- **Iluminación:** Iluminación ascendente, optimista
- **Paleta:** Colores progresivos, energía creciente

### Evitar
Callejones sin salida, techos, imágenes estancadas.
`.trim(),
    },
    // 10. VACANTE - Job Listing Card
    {
        id: 'talento-job-card',
        name: 'Vacante',
        description: 'Ficha',
        svgIcon: 'FileText',
        textZone: 'center',
        promptInstruction: 'Job details card layout.',
        structuralPrompt: `
## Composición: Job Listing Card

**Estructura:** Ficha de Oferta de Trabajo.

### Jerarquía Visual
1. **Principal:** Título del rol mostrado prominentemente
2. **Secundario:** Viñetas de requisitos clave (ubicación, experiencia, tipo)
3. **Terciario:** Botón "Aplica Ahora" y fecha límite

### Distribución
- Título del trabajo como encabezado
- Viñetas de información rápida
- CTA de aplicación

### Estilo
- **Textura:** UI de tarjeta limpia, estética de bolsa de trabajo
- **Iluminación:** Plana, clara, profesional
- **Paleta:** Colores de marca, profesional, confiable

### Evitar
Muro de texto, información clave faltante, difícil de escanear.
`.trim(),
    },
    // 11. DIVERSIDAD - Inclusion Focus
    {
        id: 'talento-diversity',
        name: 'Diversidad',
        description: 'Inclusión',
        svgIcon: 'Heart',
        textZone: 'center',
        promptInstruction: 'Inclusive diverse team representation.',
        structuralPrompt: `
## Composición: Diversity & Inclusion Feature

**Estructura:** Diversidad e Inclusión.

### Jerarquía Visual
1. **Principal:** Representación diversa de miembros del equipo
2. **Secundario:** Mensaje "Todos pertenecen aquí" o inclusión
3. **Terciario:** Logos de ERG o insignias de compromiso DEI

### Distribución
- Rostros y representaciones diversas
- Declaración de inclusión
- Insignias o certificaciones DEI

### Estilo
- **Textura:** Fotografía cálida, auténtica
- **Iluminación:** Inclusiva, acogedora, iluminación uniforme
- **Paleta:** Inclusión arcoíris, tonos cálidos de bienvenida

### Evitar
Tokenismo, diversidad escenificada, imágenes excluyentes.
`.trim(),
    },
]

export const TALENTO_DESCRIPTION = 'Employer branding y atracción de talento. 11 composiciones para RRHH.'
