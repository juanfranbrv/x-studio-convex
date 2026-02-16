/**
 * PASOS - El Tutorial (How-to, recetas, instrucciones)
 * Grupo: Educar
 * 
 * Diseño para tutoriales, guías paso a paso, recetas e instrucciones.
 * Desglosa procesos complejos en pasos fáciles de seguir.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const PASOS_EXTENDED_DESCRIPTION = `
Para tutoriales, guías paso a paso, recetas e instrucciones.
Desglosa procesos complejos en pasos fáciles de seguir.
`.trim()

export const PASOS_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'title',
        label: 'Título del Tutorial',
        placeholder: 'Ej: Cómo preparar un café perfecto',
        type: 'text',
        required: true,
        aiContext: 'Title of the how-to guide'
    },
    {
        id: 'steps',
        label: 'Número de Pasos',
        placeholder: 'Ej: 5',
        type: 'text',
        required: false,
        aiContext: 'Number of steps in the process'
    },
    {
        id: 'duration',
        label: 'Duración (opcional)',
        placeholder: 'Ej: 10 minutos',
        type: 'text',
        required: false,
        aiContext: 'Time required to complete'
    }
]

export const PASOS_DESCRIPTION = 'Diseño para tutoriales, guías y procesos paso a paso. 11 composiciones instructivas.'

export const PASOS_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'pasos-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. ZIGZAG
    {
        id: 'pasos-zigzag',
        name: 'ZigZag',
        description: 'Camino Sinuoso',
        svgIcon: 'TrendingUp',
        textZone: 'center',
        promptInstruction: 'Winding path with numbered steps.',
        structuralPrompt: `
## Composición: Sendero en Zig-Zag

**Estructura:** Camino sinuoso en forma de S que conecta los pasos.

### Jerarquía Visual
1. **Principal:** Camino serpenteante conectando 3-4 puntos clave
2. **Secundario:** Números grandes (1, 2, 3) en cada curva
3. **Terciario:** Iconos o visuales pequeños en cada parada

### Distribución
- Camino en S o carretera sinuosa
- Números grandes en las intersecciones
- Visuales representativos en cada parada

### Evitar
Líneas confusas o enredadas, texto ilegible, dirección perdida.
`.trim(),
    },
    // 2. TARJETAS
    {
        id: 'pasos-carousel',
        name: 'Carrusel',
        description: 'Tarjetas Pasos',
        svgIcon: 'Copy',
        textZone: 'bottom',
        promptInstruction: 'Horizontal row of step cards.',
        structuralPrompt: `
## Composición: Carrusel de Tarjetas

**Estructura:** Secuencia horizontal de tarjetas estilo UI flotantes.

### Jerarquía Visual
1. **Principal:** Fila horizontal de tarjetas UI
2. **Secundario:** Cada tarjeta muestra número de paso e icono simple
3. **Terciario:** Flechas indicadoras o conectores entre tarjetas

### Distribución
- Secuencia horizontal de tarjetas
- Indicadores de flujo entre ellas
- Barra de progreso opcional abajo

### Evitar
Tarjetas apretadas, falta de flujo, listas verticales.
`.trim(),
    },
    // 3. DIVIDIDO
    {
        id: 'pasos-split',
        name: 'Guía',
        description: 'Foto + Lista',
        svgIcon: 'Layout',
        textZone: 'right',
        promptInstruction: 'Split screen: hero image and checklist.',
        structuralPrompt: `
## Composición: Guía Visual Dividida

**Estructura:** Pantalla dividida entre imagen final y pasos.

### Jerarquía Visual
1. **Principal:** Imagen "Hero" del resultado final (mitad izquierda o superior)
2. **Secundario:** Lista numerada de pasos (mitad derecha o inferior)
3. **Terciario:** Título "Cómo..." uniendo ambas secciones

### Distribución
- Imagen del resultado dominante
- Lista de pasos limpia y legible
- Título puenteando las secciones

### Evitar
Texto sobre imagen compleja, pasos ilegibles, división desequilibrada.
`.trim(),
    },
    // 4. FLOTANTE
    {
        id: 'pasos-floating',
        name: 'Pasos3D',
        description: 'Números 3D',
        svgIcon: 'Layers',
        textZone: 'center',
        promptInstruction: 'Giant floating 3D numbers.',
        structuralPrompt: `
## Composición: Números Flotantes 3D

**Estructura:** Números gigantes renderizados en 3D flotando en el espacio.

### Jerarquía Visual
1. **Principal:** Números 3D gigantes (1, 2, 3) flotando con profundidad
2. **Secundario:** Pequeños objetos o props asociados a cada número
3. **Terciario:** Líneas conectoras o flechas de progresión

### Distribución
- Números 3D en disposición espacial
- Objetos representativos cerca de cada número
- Flujo visual claro entre ellos

### Evitar
Texto plano 2D, formato de lista aburrido, falta de profundidad.
`.trim(),
    },
    // 5. PLANO
    {
        id: 'pasos-blueprint',
        name: 'Plano',
        description: 'Técnico',
        svgIcon: 'PenTool',
        textZone: 'center',
        promptInstruction: 'Technical blueprint schematic.',
        structuralPrompt: `
## Composición: Plano Técnico (Blueprint)

**Estructura:** Diagrama técnico de líneas o vista explosionada.

### Jerarquía Visual
1. **Principal:** Dibujo técnico central o diagrama de partes
2. **Secundario:** Anotaciones con líneas guía señalando pasos
3. **Terciario:** Retícula de fondo sugiriendo precisión

### Distribución
- Dibujo técnico central
- Etiquetas y callouts alrededor
- Patrón de cuadrícula de fondo

### Evitar
Elementos fotorrealistas, formas orgánicas, estilo casual.
`.trim(),
    },
    // 6. VERTICAL
    {
        id: 'pasos-timeline',
        name: 'Timeline',
        description: 'Vertical',
        svgIcon: 'MoreVertical',
        textZone: 'left',
        promptInstruction: 'Vertical timeline progress.',
        structuralPrompt: `
## Composición: Línea de Tiempo Vertical

**Estructura:** Eje vertical conectando nodos de progreso.

### Jerarquía Visual
1. **Principal:** Línea vertical central conectando nodos circulares
2. **Secundario:** Título del paso e icono en cada nodo
3. **Terciario:** Fondo degradado indicando progresión

### Distribución
- Eje vertical central
- Marcadores de paso a lo largo de la línea
- Bloques de contenido alternados izquierda/derecha

### Evitar
Confusión horizontal, elementos desconectados, flujo poco claro.
`.trim(),
    },
    // 7. RECETA
    {
        id: 'pasos-recipe',
        name: 'Receta',
        description: 'Ingredientes',
        svgIcon: 'Utensils',
        textZone: 'left',
        promptInstruction: 'Recipe style step-by-step.',
        structuralPrompt: `
## Composición: Tarjeta de Receta

**Estructura:** Formato clásico de libro de cocina o blog gastronómico.

### Jerarquía Visual
1. **Principal:** Foto apetitosa del plato terminado
2. **Secundario:** Lista de ingredientes y pasos numerados
3. **Terciario:** Indicadores de tiempo, porciones y dificultad

### Distribución
- Fotografía de comida dominante
- Lista de ingredientes con bullets
- Pasos de instrucción claros

### Evitar
Fotos poco apetitosas, texto apretado, falta de imagen principal.
`.trim(),
    },
    // 8. BEFORE_AFTER
    {
        id: 'pasos-beforeafter',
        name: 'Antes/Después',
        description: 'Cambio',
        svgIcon: 'RefreshCw',
        textZone: 'center',
        promptInstruction: 'Before and after steps.',
        structuralPrompt: `
## Composición: Transformación Antes/Después

**Estructura:** Comparativa dividida mostrando estado inicial y final.

### Jerarquía Visual
1. **Principal:** División mostrando estado ANTES y resultado DESPUÉS
2. **Secundario:** Flecha o indicador de proceso entre estados
3. **Terciario:** Contador de pasos o etiqueta "X Pasos Fáciles"

### Distribución
- Izq/Arriba: Estado inicial
- Der/Abajo: Resultado final
- Indicador de transformación en medio

### Evitar
Comparación confusa, orden invertido, transformación invisible.
`.trim(),
    },
    // 9. CÍRCULOS
    {
        id: 'pasos-circles',
        name: 'Círculos',
        description: 'Ciclo',
        svgIcon: 'RefreshCcw',
        textZone: 'center',
        promptInstruction: 'Circular process flow.',
        structuralPrompt: `
## Composición: Ciclo Circular

**Estructura:** Pasos dispuestos en formación circular o ciclo.

### Jerarquía Visual
1. **Principal:** Pasos organizados en círculo
2. **Secundario:** Flechas conectando cada paso al siguiente
3. **Terciario:** Centro con nombre del proceso o meta

### Distribución
- Anillo de nodos de pasos
- Indicadores de flujo en sentido horario
- Título o meta en el centro absoluto

### Evitar
Diseño lineal, ciclo confuso, centro abarrotado.
`.trim(),
    },
    // 10. MANOS
    {
        id: 'pasos-hands',
        name: 'Manos',
        description: 'Demo',
        svgIcon: 'Hand',
        textZone: 'center',
        promptInstruction: 'Hands demonstrating steps.',
        structuralPrompt: `
## Composición: Demostración Manos a la Obra

**Estructura:** Enfoque en la acción manual real.

### Jerarquía Visual
1. **Principal:** Manos realizando la acción como foco visual
2. **Secundario:** Número de paso superpuesto o junto a la acción
3. **Terciario:** Breves instrucciones de texto acompañando

### Distribución
- Primer plano de manos trabajando
- Indicadores de paso claros
- Etiquetas de instrucción breves

### Evitar
Gráficos abstractos sin elemento humano, acciones poco claras.
`.trim(),
    },
    // 11. RÁPIDO
    {
        id: 'pasos-quick',
        name: 'Rápido',
        description: 'Express',
        svgIcon: 'Zap',
        textZone: 'center',
        promptInstruction: 'Quick tips or steps layout.',
        structuralPrompt: `
## Composición: Tips Rápidos (Cheat Sheet)

**Estructura:** Formato condensado de referencia rápida.

### Jerarquía Visual
1. **Principal:** Números o iconos grandes para 3-5 tips rápidos
2. **Secundario:** Resúmenes de una línea para cada tip
3. **Terciario:** Indicador de "Guía Rápida" o tiempo ahorrado

### Distribución
- Título de guía rápida destacado
- Grid o lista compacta de tips esenciales
- Llamada a la acción al final

### Evitar
Pasos largos y detallados, información abrumadora, lectura lenta.
`.trim(),
    },
]
