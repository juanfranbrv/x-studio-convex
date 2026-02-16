/**
 * EQUIPO - El Equipo (Personas y Cultura)
 * Grupo: Conectar
 * 
 * Diseño para humanizar la marca mostrando a las personas detrás.
 * Ideal para presentar nuevos miembros, cultura de empresa o aniversarios.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const EQUIPO_EXTENDED_DESCRIPTION = `
Diseño para humanizar la marca mostrando a las personas detrás. 
Ideal para presentar nuevos miembros, mostrar cultura de empresa 
o celebrar aniversarios de empleados.
`.trim()

export const EQUIPO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'member_name',
        label: 'Nombre(s)',
        placeholder: 'Ej: Ana y Carlos',
        type: 'text',
        required: true,
        aiContext: 'Names of team members'
    },
    {
        id: 'role',
        label: 'Rol / Cargo',
        placeholder: 'Ej: Equipo de Diseño',
        type: 'text',
        required: true,
        aiContext: 'Role or department'
    },
    {
        id: 'context',
        label: 'Contexto (Opcional)',
        placeholder: 'Ej: Bienvenidos',
        type: 'text',
        required: false,
        aiContext: 'Reason for the post (Welcome, Anniversary)'
    }
]

export const EQUIPO_DESCRIPTION = 'Diseño para mostrar el lado humano del equipo. 11 composiciones desde retratos hasta cultura.'

export const EQUIPO_LAYOUTS: Omit<LayoutOption, 'intent'>[] = [
    // 0. LIBRE
    {
        id: 'equipo-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    // 1. RETRATO
    {
        id: 'equipo-portrait',
        name: 'Retrato',
        description: 'Perfil Profesional',
        svgIcon: 'User',
        textZone: 'bottom',
        promptInstruction: 'Professional hero portrait of team member.',
        structuralPrompt: `
## Composición: Retrato Profesional

**Estructura:** Primer plano de alta calidad enfocado en la persona.

### Jerarquía Visual
1. **Principal:** Retrato del miembro del equipo ocupando la mayor parte (izquierda o centro)
2. **Secundario:** Nombre y cargo alineados en espacio libre (derecha o inferior)
3. **Terciario:** Acento de marca sutil (línea fina, forma geométrica)

### Distribución
- Área dominante para el retrato profesional
- Espacio limpio para textos (nombre, título)
- Fondo desenfocado o neutro

### Evitar
Selfies casuales, fondos desordenados, caras ocultas.
`.trim(),
    },
    // 2. GRUPO
    {
        id: 'equipo-group',
        name: 'Grupo',
        description: 'Foto de Equipo',
        svgIcon: 'Users',
        textZone: 'bottom',
        promptInstruction: 'Wide group shot of the team.',
        structuralPrompt: `
## Composición: Foto Grupal Dinámica

**Estructura:** Toma amplia del equipo interactuando o posando naturalmente.

### Jerarquía Visual
1. **Principal:** Foto amplia del grupo (interacción natural)
2. **Secundario:** Degradado suave inferior para legibilidad
3. **Terciario:** Título "Nuestro Equipo" o nombre del departamento superpuesto

### Distribución
- Fotografía de ancho completo
- Zona inferior oscurecida para contraste de texto
- Identificador de equipo centrado abajo

### Evitar
Poses rígidas, personas cortadas, mala iluminación, caras irreconocibles.
`.trim(),
    },
    // 3. MOSAICO
    {
        id: 'equipo-collage',
        name: 'Mosaico',
        description: 'Grid Caras',
        svgIcon: 'Grid',
        textZone: 'center',
        promptInstruction: 'Collage grid of team members.',
        structuralPrompt: `
## Composición: Grid de Retratos

**Estructura:** Matriz de 2x2 o 3x3 retratos individuales.

### Jerarquía Visual
1. **Principal:** Grid ordenado de fotos de perfil
2. **Secundario:** Tratamiento consistente en todas las fotos (filtros, marcos)
3. **Terciario:** Título unificador "Expertos" o "Dream Team" arriba o al centro

### Distribución
- Matriz distribuida uniformemente
- Etiquetas de nombre opcionales sobre o bajo cada foto
- Encabezado unificador

### Evitar
Estilos de foto inconsistentes, tamaños variados sin orden, falta de unidad.
`.trim(),
    },
    // 4. TESTIMONIO
    {
        id: 'equipo-quote',
        name: 'Testimonio',
        description: 'Foto + Cita',
        svgIcon: 'MessageSquare',
        textZone: 'right',
        promptInstruction: 'Employee profile with a quote.',
        structuralPrompt: `
## Composición: Foco en Empleado con Cita

**Estructura:** Retrato junto a una cita destacada.

### Jerarquía Visual
1. **Principal:** Retrato del empleado (avatar circular o recorte) a un lado
2. **Secundario:** Cita grande sobre su trabajo o filosofía
3. **Terciario:** Pie de foto con nombre y cargo

### Distribución
- Retrato contenido en forma geométrica
- Cita destacada con comillas
- Información de créditos clara

### Evitar
Citas genéricas, desconexión entre foto y texto, sensación fría.
`.trim(),
    },
    // 5. ACCIÓN
    {
        id: 'equipo-action',
        name: 'Acción',
        description: 'En Trabajo',
        svgIcon: 'Camera',
        textZone: 'bottom',
        promptInstruction: 'Candid action shot of working.',
        structuralPrompt: `
## Composición: Acción Espontánea

**Estructura:** Persona trabajando activamente, en movimiento o creando.

### Jerarquía Visual
1. **Principal:** Persona en acción (trabajando, presentando)
2. **Secundario:** Desvanecimiento o desenfoque lateral para área de texto
3. **Terciario:** Breve descripción de la actividad

### Distribución
- Foto de acción dinámica
- Área preparada para texto sin tapar la acción
- Contexto visual claro de la tarea

### Evitar
Fotos posadas estáticas, situaciones confusas, actividad poco clara.
`.trim(),
    },
    // 6. TARJETA
    {
        id: 'equipo-minimal',
        name: 'Tarjeta',
        description: 'Ficha Digital',
        svgIcon: 'CreditCard',
        textZone: 'center',
        promptInstruction: 'Clean ID card style profile.',
        structuralPrompt: `
## Composición: Tarjeta de Perfil Minimalista

**Estructura:** Diseño tipo tarjeta de presentación digital o identificación.

### Jerarquía Visual
1. **Principal:** Fondo sólido o neutro limpio
2. **Secundario:** Foto de avatar circular centrada o desplazada
3. **Terciario:** Lista limpia de nombre, rol y detalles de contacto

### Distribución
- Superficie de tarjeta limpia como lienzo
- Foto de perfil en forma contenida
- Bloque de información estructurada

### Evitar
Información desordenada, alineación inconsistente, jerarquía confusa.
`.trim(),
    },
    // 7. BIENVENIDA
    {
        id: 'equipo-welcome',
        name: 'Bienvenida',
        description: 'Onboarding',
        svgIcon: 'UserPlus',
        textZone: 'center',
        promptInstruction: 'Warm welcome to new team member.',
        structuralPrompt: `
## Composición: Bienvenida Nuevo Miembro

**Estructura:** Anuncio festivo y acogedor de nueva incorporación.

### Jerarquía Visual
1. **Principal:** Encabezado "Bienvenido/a" destacado
2. **Secundario:** Foto del nuevo miembro con marco amable
3. **Terciario:** Breve texto de introducción o rol

### Distribución
- Mensaje de bienvenida grande arriba
- Retrato con enmarcado especial
- Bio breve o datos curiosos

### Evitar
Sensación corporativa fría, falta de celebración, nombre poco visible.
`.trim(),
    },
    // 8. ANIVERSARIO
    {
        id: 'equipo-anniversary',
        name: 'Aniversario',
        description: 'Celebración',
        svgIcon: 'Award',
        textZone: 'center',
        promptInstruction: 'Work anniversary celebration.',
        structuralPrompt: `
## Composición: Aniversario Laboral

**Estructura:** Celebración de hito de tiempo (5, 10 años).

### Jerarquía Visual
1. **Principal:** Insignia o número de años destacado
2. **Secundario:** Foto del empleado con contexto festivo
3. **Terciario:** Mensaje de agradecimiento y línea de tiempo

### Distribución
- Número de aniversario prominente
- Retrato del homenajeado
- Mensaje de gratitud

### Evitar
Gráficos genéricos, falta del número de años, impersonalidad.
`.trim(),
    },
    // 9. DEPARTAMENTO
    {
        id: 'equipo-dept',
        name: 'Depto',
        description: 'Equipo',
        svgIcon: 'Briefcase',
        textZone: 'center',
        promptInstruction: 'Department or team group photo.',
        structuralPrompt: `
## Composición: Sección de Departamento

**Estructura:** Presentación de un equipo funcional específico.

### Jerarquía Visual
1. **Principal:** Nombre del departamento como titular
2. **Secundario:** Fila o grid de avatares de miembros
3. **Terciario:** Breve misión del equipo

### Distribución
- Título del departamento con icono
- Fila horizontal o grid pequeño de caras
- Tagline sobre el propósito del equipo

### Evitar
Demasiadas caras amontonadas, departamento no claro, falta de contexto.
`.trim(),
    },
    // 10. LIDERAZGO
    {
        id: 'equipo-lead',
        name: 'Líder',
        description: 'Ejecutivo',
        svgIcon: 'Star',
        textZone: 'right',
        promptInstruction: 'Leadership or executive portrait.',
        structuralPrompt: `
## Composición: Perfil Ejecutivo

**Estructura:** Retrato de autoridad y liderazgo.

### Jerarquía Visual
1. **Principal:** Retrato ejecutivo profesional y confiado
2. **Secundario:** Nombre y cargo directivo destacados
3. **Terciario:** Cita breve de visión o liderazgo

### Distribución
- Headshot ejecutivo con composición premium
- Título y nombre con peso visual
- Espacio para cita de visión

### Evitar
Fotos casuales, títulos ocultos, falta de seriedad/gravitas.
`.trim(),
    },
    // 11. CULTURA
    {
        id: 'equipo-culture',
        name: 'Cultura',
        description: 'Vida Oficina',
        svgIcon: 'Smile',
        textZone: 'center',
        promptInstruction: 'Candid office culture shot.',
        structuralPrompt: `
## Composición: Snapshot de Cultura

**Estructura:** Momento auténtico de la vida en la oficina.

### Jerarquía Visual
1. **Principal:** Momento cándido (celebración, colaboración)
2. **Secundario:** Texto superpuesto sobre cultura ("Así somos")
3. **Terciario:** Referencia sutil a valores de la empresa

### Distribución
- Fotografía de momento auténtico
- Mensaje con personalidad
- Referencia a valores

### Evitar
Fotos de stock posadas, oficina estéril, sensación impersonal.
`.trim(),
    }
]
