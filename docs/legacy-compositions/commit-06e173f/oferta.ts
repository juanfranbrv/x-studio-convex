/**
 * OFERTA - Promoción o Descuento (Flash Sales)
 * Grupo: Vender
 * 
 * Intent para promociones de alto impacto. Diseñado para generar urgencia
 * y destacar descuentos, rebajas y ofertas especiales.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const OFERTA_EXTENDED_DESCRIPTION = `
Diseño de alto impacto visual enfocado en generar urgencia y destacar descuentos.
Prioriza la tipografía grande para porcentajes (%) o precios tachados.
Ideal para Rebajas, Black Friday o Promociones Flash.
`.trim()

export const OFERTA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'offer_title',
        label: 'Título de la Oferta',
        placeholder: 'Ej: REBAJAS DE VERANO',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main headline of the sale event'
    },
    {
        id: 'discount_value',
        label: 'Valor del Descuento',
        placeholder: 'Ej: -50%, 2x1, Desde 19€',
        type: 'text',
        required: true,
        aiContext: 'The numerical value or main deal hook (BIG TEXT)'
    },
    {
        id: 'urgency_text',
        label: 'Texto de Urgencia',
        placeholder: 'Ej: Solo 24 horas',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Secondary text creating urgency or valid dates'
    }
]

export const OFERTA_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'oferta-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. IMPACTO - Retail Classic
    {
        id: 'retail-classic',
        name: 'Impacto',
        description: 'Oferta estándar, texto gigante',
        svgIcon: 'Tag',
        textZone: 'center',
        promptInstruction: 'Classic high-impact retail sale poster. Huge text.',
        structuralPrompt: `
## Composición: Bold Central Impact

**Estructura:** Impacto central con tipografía gigante.

### Jerarquía Visual
1. **Principal:** Tipografía masiva [DISCOUNT_VALUE] dominando el 60% del lienzo
2. **Secundario:** Formas dinámicas, estallidos o gráficos de explosión radiando desde el descuento
3. **Terciario:** Imágenes de producto de soporte integradas alrededor del texto central

### Distribución
- Descuento en el centro exacto, números a escala arquitectónica
- Área superior para nombre del evento
- Tira inferior o insignia para mensaje de urgencia

### Estilo
- **Textura:** Tipografía 3D extruida audaz, rellenos metálicos o degradados
- **Iluminación:** Efecto de foco de alto contraste sobre los números
- **Paleta:** Colores de alta energía o acento de marca a máxima saturación

### Evitar
Enfoque sutil, descuentos ocultos, puntos focales que compiten.
`.trim(),
    },
    // 2. FLASH - Speed/Zap
    {
        id: 'flash-sale',
        name: 'Flash',
        description: 'Energía y velocidad alta',
        svgIcon: 'Zap',
        textZone: 'center',
        promptInstruction: 'Dynamic diagonal composition with lightning or speed lines.',
        structuralPrompt: `
## Composición: Kinetic Speed Layout

**Estructura:** Diseño cinético de velocidad.

### Jerarquía Visual
1. **Principal:** Motivos de rayos o líneas de velocidad convergiendo en [DISCOUNT]
2. **Secundario:** Productos que parecen volar o cruzar el lienzo
3. **Terciario:** Temporizador o elemento visual de cuenta regresiva creando urgencia

### Distribución
- Líneas de movimiento diagonal de esquina a esquina
- Intersección central donde se encuentran las líneas de velocidad
- Insignia o tira en esquina para mensaje de "TIEMPO LIMITADO"

### Estilo
- **Textura:** Desenfoque de movimiento en bordes, enfoque nítido en valor del descuento
- **Iluminación:** Brillo de neón, chispas eléctricas, iluminación de alta energía
- **Paleta:** Colores de urgencia digital vibrantes

### Evitar
Diseños estáticos, estética calmada, composición pasiva.
`.trim(),
    },
    // 3. ELEGANTE - Minimal/Lux
    {
        id: 'minimal-lux',
        name: 'Minimal',
        description: 'Sofisticado y limpio',
        svgIcon: 'Sparkles',
        textZone: 'bottom',
        promptInstruction: 'Elegant, ample whitespace, small dignified typography.',
        structuralPrompt: `
## Composición: Minimalist Luxury Discount

**Estructura:** Descuento de lujo minimalista.

### Jerarquía Visual
1. **Principal:** Tipografía refinada para [DISCOUNT] con espaciado elegante
2. **Secundario:** Producto héroe único en pedestal o flotando con iluminación premium
3. **Terciario:** Acentos decorativos sutiles (líneas finas, formas geométricas)

### Distribución
- 70% dedicado a espacio negativo limpio y aireado
- Producto colocado artísticamente en posición de proporción áurea
- Ubicación discreta en esquina o inferior para detalles de precios

### Estilo
- **Textura:** Sombras suaves, superficies tipo seda, sensación de materiales premium
- **Iluminación:** Iluminación de galería, degradados suaves, ambiente sofisticado
- **Paleta:** Base monocromática con un único acento

### Evitar
Gráficos ruidosos, mensajes abarrotados, estética de tienda de descuentos.
`.trim(),
    },
    // 4. BUNDLE - Pack/Grid
    {
        id: 'bundle-grid',
        name: 'Pack',
        description: 'Colección o 2x1',
        svgIcon: 'Grid2x2',
        textZone: 'center',
        promptInstruction: 'Grid layout showing multiple products or a bundle.',
        structuralPrompt: `
## Composición: Bundle Collection Display

**Estructura:** Exhibición de colección o paquete.

### Jerarquía Visual
1. **Principal:** Múltiples productos dispuestos en cuadrícula atractiva o formación agrupada
2. **Secundario:** Insignia prominente de "PACK" o "BUNDLE" superpuesta al arreglo structure
3. **Terciario:** Visuales de comparación de precios (original vs. precio del paquete)

### Distribución
- Cuadrícula 2x2 o 3x3, o grupo orgánico al 70% del lienzo
- Insignia circular o cinta en punto de intersección
- Tira inferior mostrando valor total vs. precio del paquete

### Estilo
- **Textura:** Estilo de fotografía de producto consistente
- **Iluminación:** Dirección de iluminación unificada para sensación de colección cohesiva
- **Paleta:** Colores de productos coordinados o arreglo complementario

### Evitar
Ubicación caótica de productos, composición de paquete poco clara, proposición de valor faltante.
`.trim(),
    },
    // 5. URGENCY - Countdown
    {
        id: 'urgency-time',
        name: 'Urgencia',
        description: 'Cuenta atrás, alerta',
        svgIcon: 'Clock',
        textZone: 'bottom',
        promptInstruction: 'Alarming urgency, red tones, time-sensitive graphics.',
        structuralPrompt: `
## Composición: Countdown Timer Focus

**Estructura:** Foco en temporizador de cuenta regresiva.

### Jerarquía Visual
1. **Principal:** Pantalla de temporizador digital (HH:MM:SS) como elemento héroe
2. **Secundario:** Producto o valor de descuento en posición de soporte
3. **Terciario:** Elementos con sensación animada sugiriendo paso del tiempo (relojes de arena, arena)

### Distribución
- Posición central o superior dominante para cuenta regresiva
- Debajo del temporizador, el descuento o revelación del producto
- Ubicación clara de botón de llamada a la acción en la parte inferior

### Estilo
- **Textura:** Estética de pantalla LED, segmentos digitales, interfaz tecnológica
- **Iluminación:** Brillo de pantalla, números retroiluminados, iluminación de urgencia
- **Paleta:** Fondos oscuros con dígitos de temporizador brillantes

### Evitar
Temporizador oculto, sin sensación de urgencia, fecha límite poco clara.
`.trim(),
    },
    // 6. SEASONAL - Thematic
    {
        id: 'seasonal-deco',
        name: 'Temático',
        description: 'Decoración de temporada',
        svgIcon: 'Flower2',
        textZone: 'overlay',
        promptInstruction: 'Seasonal decorations framing the product.',
        structuralPrompt: `
## Composición: Seasonal Atmospheric Sale

**Estructura:** Venta atmosférica estacional.

### Jerarquía Visual
1. **Principal:** Elementos decorativos estacionales enmarcando el [DISCOUNT] (hojas, copos de nieve, flores, sol)
2. **Secundario:** Productos integrados naturalmente en la escena estacional
3. **Terciario:** Tipografía temática coincidiendo con el estado de ánimo de la estación

### Distribución
- Decoraciones de borde y esquina estableciendo la estación
- Espacio central claro para mensaje de descuento
- Ubicación de producto integrada dentro del entorno temático

### Estilo
- **Textura:** Texturas estacionales orgánicas (grano de madera, escarcha, pétalos, arena)
- **Iluminación:** Apropiada para la estación: brillo cálido de verano, luz fría de invierno
- **Paleta:** Psicología del color estacional: pasteles primavera, cálidos verano, tierra otoño, fríos invierno

### Evitar
Gráficos genéricos, elementos estacionales que no coinciden, temas conflictivos.
`.trim(),
    },
    // 7. PRICE - Only Price
    {
        id: 'oferta-price',
        name: 'Precio',
        description: 'Solo Precio',
        svgIcon: 'DollarSign',
        textZone: 'center',
        promptInstruction: 'Focus purely on the price tag.',
        structuralPrompt: `
## Composición: Crossed-Out Price Hero

**Estructura:** Precio tachado como héroe.

### Jerarquía Visual
1. **Principal:** Precio original grande con gráfico de tachado dramático, precio nuevo destacado
2. **Secundario:** Imagen del producto adyacente a la comparación de precios
3. **Terciario:** Llamada de ahorro ("¡Ahorras X€!" o porcentaje ahorrado)

### Distribución
- Comparación de precios lado a lado o apilada en el centro visual
- Toma de producto héroe mostrando lo que obtienes
- Insignia o llamada enfatizando el valor del trato

### Estilo
- **Textura:** Tipografía limpia con gráfico de tachado impactante
- **Iluminación:** Foco en precio nuevo, atenuado en precio antiguo
- **Paleta:** Precio antiguo en color apagado, precio nuevo en resaltado vibrante

### Evitar
Comparación de precios poco clara, ahorros ocultos, proposición de valor confusa.
`.trim(),
    },
    // 8. BANNER - Horizontal
    {
        id: 'oferta-banner',
        name: 'Banner',
        description: 'Horizontal',
        svgIcon: 'CreditCard',
        textZone: 'center',
        promptInstruction: 'Horizontal promotional banner.',
        structuralPrompt: `
## Composición: Dynamic Sales Banner

**Estructura:** Banner de ventas dinámico.

### Jerarquía Visual
1. **Principal:** Diseño de tira horizontal optimizado
2. **Secundario:** Producto en un extremo, descuento en el otro, creando flujo visual
3. **Terciario:** Elementos listos para animación (flechas, destellos, indicadores de movimiento)

### Distribución
- Producto o logotipo anclando un lado
- Mensaje de venta principal y descuento abarcando el medio
- CTA o flecha dirigiendo a la acción

### Estilo
- **Textura:** Degradados horizontales limpios, gráficos optimizados para banner
- **Iluminación:** Iluminación uniforme a través del banner, sin sombras pesadas
- **Paleta:** Alto contraste para visibilidad del banner

### Evitar
Diseños enfocados en vertical, composiciones cuadradas centradas.
`.trim(),
    },
    // 9. EXPLOSION - Boom
    {
        id: 'oferta-explosion',
        name: 'Explosión',
        description: 'Boom',
        svgIcon: 'Zap',
        textZone: 'center',
        promptInstruction: 'Explosive sale energy.',
        structuralPrompt: `
## Composición: Explosive Burst Layout

**Estructura:** Diseño de estallido explosivo.

### Jerarquía Visual
1. **Principal:** Gráfico de estallido estelar o explosión central conteniendo el [DISCOUNT]
2. **Secundario:** Productos radiando hacia afuera desde el centro del estallido
3. **Terciario:** Partículas voladoras, confeti o elementos de fuegos artificiales

### Distribución
- Patrón radial central emanando del valor del descuento
- Productos y elementos distribuidos en patrón de explosión
- Área inferior de anclaje para marca o CTA

### Estilo
- **Textura:** Arte pop de cómic, líneas de acción, puntos de semitono
- **Iluminación:** Destello brillante desde el centro, sombras dramáticas radiando hacia afuera
- **Paleta:** Primarios de arte pop, colores audaces de cómic

### Evitar
Diseños estáticos calmados, gráficos sutiles, enfoque discreto.
`.trim(),
    },
    // 10. COMPARATIVA - Vs
    {
        id: 'oferta-compare',
        name: 'Comparativa',
        description: 'Antes/Ahora',
        svgIcon: 'ArrowRight',
        textZone: 'center',
        promptInstruction: 'Price comparison layout.',
        structuralPrompt: `
## Composición: Split Comparison Layout

**Estructura:** Diseño de comparación dividida.

### Jerarquía Visual
1. **Principal:** Pantalla dividida o lado a lado comparando "Antes" vs "Después" o "Sin" vs "Con" oferta
2. **Secundario:** Línea divisoria visual o transición de degradado entre lados
3. **Terciario:** Etiquetas identificando claramente cada lado de la comparación

### Distribución
- Sección izquierda o superior mostrando escenario original (precio más alto)
- Derecha o inferior mostrando la ventaja de la oferta (precio más bajo)
- Línea central o degradado creando la división

### Estilo
- **Textura:** Contraste limpio entre las dos mitades
- **Iluminación:** Más tenue en lado "antes", foco más brillante en lado "oferta"
- **Paleta:** Tonos apagados para antes, vibrantes para lado oferta/después

### Evitar
Comparación confusa, ventaja poco clara, peso visual igual en ambos lados.
`.trim(),
    },
    // 11. EXCLUSIVO - VIP
    {
        id: 'oferta-exclusive',
        name: 'Exclusivo',
        description: 'VIP',
        svgIcon: 'Crown',
        textZone: 'center',
        promptInstruction: 'Premium exclusive offer layout.',
        structuralPrompt: `
## Composición: VIP Exclusive Access Layout

**Estructura:** Acceso exclusivo VIP.

### Jerarquía Visual
1. **Principal:** Insignia, sello o etiqueta "EXCLUSIVO" premium como símbolo de estatus
2. **Secundario:** El descuento especial o detalles de la oferta en presentación refinada
3. **Terciario:** Cuerda de terciopelo, acentos dorados o elementos de enmarcado de lujo

### Distribución
- Sello VIP o exclusivo prominente en parte superior o esquina
- Presentación elegante central del trato especial
- Área inferior para requisitos de membresía o acceso

### Estilo
- **Textura:** Lámina dorada, efectos en relieve, materiales premium
- **Iluminación:** Foco de lujo, brillo champagne, ambiente exclusivo
- **Paleta:** Negro y dorado, púrpura profundo y plata, combinaciones premium

### Evitar
Estética de mercado masivo, vibras de tienda de descuentos, sensación de promoción genérica.
`.trim(),
    },
]

export const OFERTA_DESCRIPTION = 'Diseño de alto impacto para promociones, rebajas y descuentos. 11 composiciones desde urgencia flash hasta elegancia luxe.'
