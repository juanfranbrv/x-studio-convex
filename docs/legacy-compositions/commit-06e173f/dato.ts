/**
 * DATO - El Dato (Estadística, infografía)
 * Grupo: Educar
 * 
 * Para compartir estadísticas, datos curiosos o información numérica
 * relevante. El número es protagonista con contexto visual de apoyo.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const DATO_EXTENDED_DESCRIPTION = `
Para compartir estadísticas, datos curiosos o información numérica 
relevante para tu audiencia. El número es protagonista, acompañado 
de contexto visual que refuerza el mensaje.
`.trim()

export const DATO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'main_stat',
        label: 'Dato Principal',
        placeholder: 'Ej: 73%',
        type: 'text',
        required: true,
        aiContext: 'The main statistic or number to highlight'
    },
    {
        id: 'stat_context',
        label: 'Contexto del Dato',
        placeholder: 'Ej: de los consumidores prefieren marcas sostenibles',
        type: 'text',
        required: true,
        aiContext: 'What the statistic means or refers to'
    },
    {
        id: 'source',
        label: 'Fuente (opcional)',
        placeholder: 'Ej: Estudio Nielsen 2024',
        type: 'text',
        required: false,
        aiContext: 'Source or reference for the data'
    }
]

export const DATO_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'dato-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. HÉROE - Big Stat Hero
    {
        id: 'dato-big',
        name: 'Dato',
        description: 'Número Gigante',
        svgIcon: 'Hash',
        textZone: 'center',
        promptInstruction: 'Layout focusing on a single massive number.',
        structuralPrompt: `
## Composición: Big Number Hero

**Estructura:** Héroe de número grande.

### Jerarquía Visual
1. **Principal:** Figura estadística masiva [STATISTIC] dominando el 60%+ del lienzo
2. **Secundario:** Texto de contexto explicativo anclado debajo o al lado
3. **Terciario:** Cita de fuente en posición discreta al pie

### Distribución
- Figura estadística dominando el centro
- Texto explicativo en posición de soporte
- Atribución de fuente pequeña al final

### Estilo
- **Textura:** Audaz, autoritaria, impacto directo
- **Iluminación:** Foco de alto contraste sobre el número
- **Paleta:** Fondo limpio, acento de marca en el número

### Evitar
Números pequeños, estadísticas ocultas, datos enterrados.
`.trim(),
    },
    // 2. COMPARACIÓN - Side by Side
    {
        id: 'dato-comparison',
        name: 'Comparativa',
        description: 'Barras / VS',
        svgIcon: 'BarChart2',
        textZone: 'center',
        promptInstruction: 'Comparison layout with charts or side-by-side.',
        structuralPrompt: `
## Composición: Comparative Data Visualization

**Estructura:** Visualización de datos comparativa.

### Jerarquía Visual
1. **Principal:** Comparación lado a lado o apilada de dos puntos de datos
2. **Secundario:** Diferencia visual de tamaño (altura de barra, tamaño de círculo) mostrando relación
3. **Terciario:** Etiquetas claras identificando lo que representa cada valor

### Distribución
- Primer punto de datos con su visualización
- Segundo punto de datos para comparación
- Etiquetado claro para cada entidad

### Estilo
- **Textura:** Analítica, precisa, calidad infográfica
- **Iluminación:** Uniforme, informativa, sin drama
- **Paleta:** Colores distintos para cada serie de datos

### Evitar
Comparación poco clara, tamaño igual cuando los valores difieren, visuales engañosos.
`.trim(),
    },
    // 3. PROCESO - Sequential Flow
    {
        id: 'dato-process',
        name: 'Proceso',
        description: 'Pasos 1-2-3',
        svgIcon: 'ListOrdered',
        textZone: 'left',
        promptInstruction: 'Step-by-step process flow layout.',
        structuralPrompt: `
## Composición: Sequential Process Flow

**Estructura:** Flujo de proceso secuencial.

### Jerarquía Visual
1. **Principal:** Progresión lineal de 3-4 puntos de datos o pasos
2. **Secundario:** Flechas, líneas o indicadores de flujo conectando
3. **Terciario:** Iconos o números marcando cada etapa

### Distribución
- Progresión de izquierda a derecha o de arriba a abajo
- Zonas de paso o punto de datos individual
- Conectores visuales entre etapas

### Estilo
- **Textura:** Instruccional, lógica, orientada al proceso
- **Iluminación:** Clara, iluminación educativa uniforme
- **Paleta:** Esquema de color progresivo o jerarquía numerada

### Evitar
Dirección de flujo poco clara, conexiones faltantes, diseño caótico.
`.trim(),
    },
    // 4. REJILLA - Multi-Stat Grid
    {
        id: 'dato-infographic',
        name: 'Info',
        description: 'Grid de Datos',
        svgIcon: 'LayoutGrid',
        textZone: 'center',
        promptInstruction: 'Structured grid infographic layout.',
        structuralPrompt: `
## Composición: Multi-Statistic Grid

**Estructura:** Cuadrícula multi-estadística.

### Jerarquía Visual
1. **Principal:** Cuadrícula de 2x2 o 3x2 de puntos de datos clave
2. **Secundario:** Iconos acompañando cada estadística
3. **Terciario:** Título de resumen abarcando la parte superior de la composición

### Distribución
- Título de resumen o tema general
- Cuadrícula organizada de celdas estadísticas
- Icono junto a cada punto de datos

### Estilo
- **Textura:** Rica, informativa, densidad de tablero
- **Iluminación:** Distribución uniforme, sin punto focal único
- **Paleta:** Sistema de color consistente en todas las celdas

### Evitar
Celdas apretadas, tamaño inconsistente, contexto faltante.
`.trim(),
    },
    // 5. CONTADOR - Metric (Mapped to 'dato-metric' in types)
    {
        id: 'dato-metric',
        name: 'Métrica',
        description: 'Dashboard Card',
        svgIcon: 'Activity',
        textZone: 'center',
        promptInstruction: 'UI Card style for key performance metric.',
        structuralPrompt: `
## Composición: Live Counter Display

**Estructura:** Pantalla de contador en vivo.

### Jerarquía Visual
1. **Principal:** Pantalla de número digital o estilo ticker
2. **Secundario:** Sensación animada con segmentos de número o pantalla flip
3. **Terciario:** Etiqueta de contexto explicando lo que se cuenta

### Distribución
- Pantalla de número de contador central
- Segmentos de dígitos individuales o paneles flip
- Etiqueta de métrica debajo del contador

### Estilo
- **Textura:** Pantalla LED, reloj flip, estética de marcador
- **Iluminación:** Dígitos auto-luminosos, paneles retroiluminados
- **Paleta:** Colores de pantalla digital (LED rojo, verde, ámbar)

### Evitar
Sensación estática, tipografía no de contador, sin sugerencia de animación.
`.trim(),
    },
    // 6. CIRCULAR - Pie/Donut Chart
    {
        id: 'dato-pie',
        name: 'Circular',
        description: 'Porcentajes',
        svgIcon: 'PieChart',
        textZone: 'center',
        promptInstruction: 'Circular chart or ring visualization.',
        structuralPrompt: `
## Composición: Circular Data Visualization

**Estructura:** Visualización de datos circular.

### Jerarquía Visual
1. **Principal:** Gráfico de dona, pastel o anillo grande como gráfico central
2. **Secundario:** Porcentaje clave o total mostrado en el centro del anillo
3. **Terciario:** Etiquetas de leyenda flotantes apuntando a segmentos

### Distribución
- Gráfico circular dominando el centro
- Estadística de resumen dentro de la dona
- Leyendas de segmento alrededor del gráfico

### Estilo
- **Textura:** Geométrica, moderna, arte de datos abstracto
- **Iluminación:** Clara, uniforme, claridad infográfica
- **Paleta:** Colores de segmento distintos, esquema armonioso

### Evitar
Demasiados segmentos, porcentajes poco claros, centro desordenado.
`.trim(),
    },
    // 7. DASHBOARD - Tech Metrics
    {
        id: 'dato-dashboard',
        name: 'Dashboard',
        description: 'UI',
        svgIcon: 'Layout',
        textZone: 'center',
        promptInstruction: 'Analytics dashboard view.',
        structuralPrompt: `
## Composición: Performance Dashboard Card

**Estructura:** Tarjeta de tablero de rendimiento.

### Jerarquía Visual
1. **Principal:** Datos mostrados dentro de elemento de tarjeta UI estilizada
2. **Secundario:** Indicadores de tendencia (flecha arriba, minigráfico de crecimiento)
3. **Terciario:** Contexto de período ("vs mes pasado") y marca de agua de marca

### Distribución
- Tarjeta flotante conteniendo la métrica
- Indicador visual de crecimiento o declive
- Referencia de período de tiempo o comparación

### Estilo
- **Textura:** SaaS, analítica, estética de tablero tech
- **Iluminación:** Brillo de pantalla, sensación de interfaz digital
- **Paleta:** Colores UI limpios, verde para crecimiento, rojo para declive

### Evitar
Diseños solo de impresión, sin contexto de tendencia, presentación estática.
`.trim(),
    },
    // 8. BARRA - Bar Chart Style
    {
        id: 'dato-bar',
        name: 'Barras',
        description: 'Gráfico',
        svgIcon: 'BarChart',
        textZone: 'center',
        promptInstruction: 'Bar chart visualization.',
        structuralPrompt: `
## Composición: Bar Chart Visualization

**Estructura:** Visualización de gráfico de barras.

### Jerarquía Visual
1. **Principal:** Barras horizontales o verticales mostrando valores comparativos
2. **Secundario:** Etiquetas de valor al final de cada barra
3. **Terciario:** Etiquetas de categoría identificando cada barra

### Distribución
- Área principal para visualización de gráfico de barras
- Etiquetas de número en o cerca de las barras
- Etiquetas de eje para categorías

### Estilo
- **Textura:** Gráficos de carta limpios, visualización de datos profesional
- **Iluminación:** Uniforme, legible, sin efectos artísticos
- **Paleta:** Colores de barra distintos o degradado dentro de categoría

### Evitar
Proporciones engañosas, etiquetas faltantes, barras abarrotadas.
`.trim(),
    },
    // 9. ICONO - Icon-Led Stats
    {
        id: 'dato-icon',
        name: 'Icono',
        description: 'Símbolo',
        svgIcon: 'Hexagon',
        textZone: 'center',
        promptInstruction: 'Large icon with data point.',
        structuralPrompt: `
## Composición: Icon-Driven Statistic

**Estructura:** Estadística impulsada por icono.

### Jerarquía Visual
1. **Principal:** Icono representativo grande como ancla visual (💰, 📈, 🌍)
2. **Secundario:** Número estadístico posicionado prominentemente cerca del icono
3. **Terciario:** Texto de contexto explicando lo que significa el icono+número

### Distribución
- Icono o ilustración grande como centro visual
- Número mostrado en relación al icono
- Breve contexto debajo o al lado

### Estilo
- **Textura:** Ilustración audaz, iconografía clara
- **Iluminación:** Limpia, presentación centrada en icono
- **Paleta:** Colores de icono integrados con paleta de marca

### Evitar
Iconos pequeños, número e icono desconectados, símbolos confusos.
`.trim(),
    },
    // 10. TIMELINE - Historical Data
    {
        id: 'dato-timeline',
        name: 'Timeline',
        description: 'Histórico',
        svgIcon: 'Clock',
        textZone: 'left',
        promptInstruction: 'Data timeline evolution.',
        structuralPrompt: `
## Composición: Historical Timeline Data

**Estructura:** Datos de línea de tiempo histórica.

### Jerarquía Visual
1. **Principal:** Línea de tiempo horizontal con puntos de datos en fechas clave
2. **Secundario:** Marcadores visuales mostrando progresión o cambio a lo largo del tiempo
3. **Terciario:** Etiquetas de fecha y valores de hito

### Distribución
- Columna vertebral central de línea de tiempo
- Marcadores de datos en fechas específicas
- Anotaciones de fecha y valor

### Estilo
- **Textura:** Progresión histórica, visualización de historia de crecimiento
- **Iluminación:** Uniforme, claridad documental
- **Paleta:** Esquema de color progresivo o cronológico

### Evitar
Flujo de tiempo confuso, puntos abarrotados, progresión poco clara.
`.trim(),
    },
    // 11. MAPA - Geographic Data
    {
        id: 'dato-map',
        name: 'Mapa',
        description: 'Geográfico',
        svgIcon: 'Map',
        textZone: 'center',
        promptInstruction: 'Data map visualization.',
        structuralPrompt: `
## Composición: Geographic Data Map

**Estructura:** Mapa de datos geográficos.

### Jerarquía Visual
1. **Principal:** Contorno de mapa con regiones resaltadas o ubicaciones marcadas
2. **Secundario:** Llamadas de datos o intensidad de calor mostrando valores regionales
3. **Terciario:** Leyenda explicando los significados de color/marca

### Distribución
- Mapa geográfico como visual principal
- Regiones coloreadas o pines de ubicación
- Leyenda de color/símbolo para interpretación

### Estilo
- **Textura:** Cartográfica, visualización de datos geográficos
- **Iluminación:** Plana, apropiada para mapa, sin efectos 3D
- **Paleta:** Degradados de mapa de calor o colores de región categóricos

### Evitar
Mapas desordenados, leyenda faltante, etiquetas ilegibles.
`.trim(),
    },
]

export const DATO_DESCRIPTION = 'Infografía para destacar números, estadísticas o procesos. 11 composiciones de visualización de datos.'
