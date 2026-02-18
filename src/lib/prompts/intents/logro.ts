/**
 * LOGRO - El Logro (Milestone, celebración)
 * Grupo: Conectar
 * 
 * Para celebrar hitos importantes: aniversarios, seguidores alcanzados, 
 * premios o reconocimientos. Diseño festivo que transmite gratitud y orgullo.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const LOGRO_EXTENDED_DESCRIPTION = `
Para celebrar hitos importantes: aniversarios, seguidores alcanzados, 
premios o reconocimientos. Diseño festivo que transmite gratitud y 
orgullo sin perder la identidad de marca.
`.trim()

export const LOGRO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'milestone_number',
        label: 'Cifra o Logro Principal',
        placeholder: 'Ej: 10.000 seguidores / 5 años',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main milestone number or achievement'
    },
    {
        id: 'gratitude_message',
        label: 'Mensaje de Agradecimiento',
        placeholder: 'Ej: ¡Gracias por formar parte de esto!',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Thank you message to the community'
    },
    {
        id: 'celebration_context',
        label: 'Contexto Adicional',
        placeholder: 'Ej: Desde 2019 creciendo juntos',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Additional context about the achievement'
    }
]

export const LOGRO_DESCRIPTION = 'Diseño celebratorio con cifra/logro protagonista. 11 composiciones desde festivas hasta elegantes.'

export const LOGRO_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'logro-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'help_center',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. NÚMERO
    {
        id: 'logro-number',
        name: 'Cifra',
        description: 'Dato Gigante',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Huge centralized metric or number.',
        structuralPrompt: `
## Composición: Héroe Numérico

**Estructura:** El dato o cifra es el protagonista absoluto.

### Jerarquía Visual
1. **Principal:** Número masivo ocupando el 70% del lienzo
2. **Secundario:** Etiqueta ("Seguidores", "Años") justo debajo
3. **Terciario:** Mensaje de agradecimiento en texto de soporte

### Distribución
- Número dominante centrado
- Etiqueta explicativa vinculada a la cifra
- Área inferior para gratitud

### Evitar
Números pequeños, diseño desordenado, métricas ocultas.
`.trim(),
    },
    // 2. TROFEO
    {
        id: 'logro-trophy',
        name: 'Trofeo',
        description: 'Premio 3D',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="38" cy="40" r="22" fill="currentColor" fill-opacity="0.6" /><rect x="70" y="18" width="34" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="52" width="24" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Trophy or medal in spotlight.',
        structuralPrompt: `
## Composición: Trofeo al Mérito

**Estructura:** Objeto de premio en spotlight dramático.

### Jerarquía Visual
1. **Principal:** Trofeo, medalla o placa 3D en el centro
2. **Secundario:** Texto de logro grabado o superpuesto
3. **Terciario:** Reflejos y efectos de iluminación premium

### Distribución
- Objeto heroico central
- Texto integrado o cercano al objeto
- Iluminación radiante

### Evitar
Aspecto de plástico barato, iluminación plana, gráficos genéricos.
`.trim(),
    },
    // 3. CONFETI
    {
        id: 'logro-confetti',
        name: 'Fiesta',
        description: 'Confetti',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Festive explosion with confetti.',
        structuralPrompt: `
## Composición: Explosión Festiva

**Estructura:** Celebración dinámica llena de energía.

### Jerarquía Visual
1. **Principal:** Confeti, serpentinas y partículas llenando el espacio
2. **Secundario:** Zona central limpia para "¡Gracias!"
3. **Terciario:** Movimiento radiante desde el centro

### Distribución
- Elementos de celebración a sangre (full bleed)
- Área central protegida para texto
- Energía expansiva

### Evitar
Ambiente sombrío, composición estática, sensación corporativa aburrida.
`.trim(),
    },
    // 4. EQUIPO
    {
        id: 'logro-team',
        name: 'Grupo',
        description: 'Celebración',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="104" height="64" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="18" y="18" width="84" height="44" rx="8" fill="currentColor" fill-opacity="0.15" /><rect x="24" y="24" width="60" height="14" rx="7" fill="currentColor" fill-opacity="0.55" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Team celebrating success.',
        structuralPrompt: `
## Composición: Celebración de Equipo

**Estructura:** El equipo celebrando el éxito colectivo.

### Jerarquía Visual
1. **Principal:** Imagen de grupo en celebración (chocar manos, abrazos)
2. **Secundario:** Texto "¡LO LOGRAMOS!" o similar superpuesto
3. **Terciario:** Mensaje de créditos en el pie

### Distribución
- Fondo de celebración humana (puede tener blur)
- Área semitransparente para texto legible
- Franja inferior para agradecimientos

### Evitar
Focos individuales, estética fría, gráficos impersonales.
`.trim(),
    },
    // 5. SELLO
    {
        id: 'logro-premium',
        name: 'Certificado',
        description: 'Sello Lujo',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Luxury seal or certificate style.',
        structuralPrompt: `
## Composición: Sello de Excelencia

**Estructura:** Insignia o sello de certificación premium.

### Jerarquía Visual
1. **Principal:** Sello, badge o marca de certificación central
2. **Secundario:** "Certificado" o nombre del premio
3. **Terciario:** Borde elegante y marco oficial

### Distribución
- Emblema central con autoridad
- Título del logro integrado
- Marco ornamental o elegante

### Evitar
Estética casual, layouts informales, vibras de fiesta desordenada.
`.trim(),
    },
    // 6. CAMINO
    {
        id: 'logro-journey',
        name: 'Hito',
        description: 'Timeline',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="12" y="18" width="96" height="8" rx="4" fill="currentColor" fill-opacity="0.3" /><rect x="12" y="38" width="64" height="8" rx="4" fill="currentColor" fill-opacity="0.3" /><rect x="12" y="58" width="48" height="8" rx="4" fill="currentColor" fill-opacity="0.3" /><circle cx="100" cy="22" r="7" fill="currentColor" fill-opacity="0.6" /><circle cx="86" cy="42" r="7" fill="currentColor" fill-opacity="0.5" /><circle cx="72" cy="62" r="7" fill="currentColor" fill-opacity="0.45" /><rect x="8" y="10" width="26" height="60" rx="8" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'left',
        promptInstruction: 'Milestone on a path or timeline.',
        structuralPrompt: `
## Composición: Timeline de Progreso

**Estructura:** Visualización del camino recorrido hasta el hito.

### Jerarquía Visual
1. **Principal:** Camino o línea de tiempo mostrando avance
2. **Secundario:** Bandera o marcador en la posición actual
3. **Terciario:** Hitos anteriores como puntos menores

### Distribución
- Visualización de journey (curva o línea)
- Marcador prominente del logro actual
- Indicadores de historia pasados

### Evitar
Momento estático aislado, falta de contexto de viaje.
`.trim(),
    },
    // 7. ESTRELLA
    {
        id: 'logro-star',
        name: 'Estrella',
        description: 'Destacado',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="10" width="50" height="60" rx="10" fill="currentColor" fill-opacity="0.4" /><rect x="62" y="10" width="50" height="60" rx="10" fill="currentColor" fill-opacity="0.7" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Star performer spotlight.',
        structuralPrompt: `
## Composición: Calificación 5 Estrellas

**Estructura:** Celebración de rating o excelencia.

### Jerarquía Visual
1. **Principal:** Cinco estrellas brillantes o gráfico estelar
2. **Secundario:** Puntuación o número de reviews destacado
3. **Terciario:** Cita de testimonio o contador

### Distribución
- Despliegue horizontal de estrellas
- Calificación numérica visible
- Prueba social (quote/contador)

### Evitar
Estrellas apagadas, ratings poco claros, falta de prueba social.
`.trim(),
    },
    // 8. PODIO
    {
        id: 'logro-podium',
        name: 'Podio',
        description: 'Ganadores',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Winners podium celebration.',
        structuralPrompt: `
## Composición: Podio de Victoria

**Estructura:** Celebración del primer puesto.

### Jerarquía Visual
1. **Principal:** Podio estilo olímpico con el #1 elevado e iluminado
2. **Secundario:** Logo o texto del logro en el pedestal ganador
3. **Terciario:** Medalla, trofeo o corona adornando el puesto

### Distribución
- Estructura de tres niveles (podio)
- Primer lugar maximizado visualmente
- Elementos de gloria alrededor

### Evitar
Mismo énfasis en todas las posiciones, perder foco en la victoria.
`.trim(),
    },
    // 9. GLOBOS
    {
        id: 'logro-balloons',
        name: 'Globos',
        description: 'Celebración',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="14" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="30" y="20" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Festive balloons celebration.',
        structuralPrompt: `
## Composición: Globos Festivos

**Estructura:** Globos flotando llevando el mensaje.

### Jerarquía Visual
1. **Principal:** Globos coloridos flotando hacia arriba
2. **Secundario:** Cifra o texto atado a las cuerdas
3. **Terciario:** Atmósfera de fiesta con fondo degradado suave

### Distribución
- Cluster de globos en zona superior
- Mensaje colgado o en las cuerdas
- Fondo tipo cielo o ambiente abierto

### Evitar
Aspecto desinflado, elementos en el suelo, entorno cerrado opresivo.
`.trim(),
    },
    // 10. SOCIAL
    {
        id: 'logro-social',
        name: 'Social',
        description: 'Likes/Fans',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="48" width="16" height="22" rx="6" fill="currentColor" fill-opacity="0.45" /><rect x="38" y="40" width="16" height="30" rx="6" fill="currentColor" fill-opacity="0.55" /><rect x="60" y="30" width="16" height="40" rx="6" fill="currentColor" fill-opacity="0.65" /><rect x="82" y="22" width="16" height="48" rx="6" fill="currentColor" fill-opacity="0.75" /><rect x="16" y="18" width="64" height="8" rx="4" fill="currentColor" fill-opacity="0.3" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Social media milestone celebration.',
        structuralPrompt: `
## Composición: Hito Social Media

**Estructura:** Celebración nativa de métricas sociales.

### Jerarquía Visual
1. **Principal:** Icono de plataforma (corazón, like) en escala masiva
2. **Secundario:** Contador de seguidores/likes en display numérico
3. **Terciario:** Elementos de UI de la plataforma como decoración

### Distribución
- Icono gigante de interacción
- Número masivo del hito
- Branding sutil de la plataforma

### Evitar
Gráficos genéricos, estética offline, representar mal la plataforma.
`.trim(),
    },
    // 11. ANIVERSARIO
    {
        id: 'logro-anniversary',
        name: 'Aniversario',
        description: 'Años',
        svgIcon: 'Calendar',
        textZone: 'center',
        promptInstruction: 'Company or milestone anniversary.',
        structuralPrompt: `
## Composición: Badge de Aniversario

**Estructura:** Insignia conmemorativa de años.

### Jerarquía Visual
1. **Principal:** Número de años (5, 10, 25) con estilo ornamental
2. **Secundario:** Imágenes de historia o evolución del logo
3. **Terciario:** "Desde [AÑO]" o elemento de historia fundacional

### Distribución
- Número central con tratamiento decorativo
- Línea de tiempo o evolución en bordes
- Fecha de origen

### Evitar
Tratamiento genérico del número, falta de contexto histórico, modernismo frío.
`.trim(),
    }
]
