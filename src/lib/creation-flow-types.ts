// ============================================================================
// CREATION FLOW TYPES - Cascade Interface for X Imagen
// ============================================================================

// -----------------------------------------------------------------------------
// INTENT CATEGORIES (20 Master Templates)
// -----------------------------------------------------------------------------

import { LucideIcon } from 'lucide-react'
// import { OFERTA_IMPACTO_PROMPT, OFERTA_IMPACTO_DESCRIPTION } from './prompts/layouts/oferta-impacto'
// import { PROMO_MOVIL_PROMPT, PROMO_MOVIL_DESCRIPTION } from './prompts/layouts/promo-movil'
import {
    OFERTA_IMPACTO_PROMPT,
    OFERTA_FLASH_PROMPT,
    OFERTA_ELEGANTE_PROMPT,
    OFERTA_BUNDLE_PROMPT,
    OFERTA_COUNTDOWN_PROMPT,
    OFERTA_ESTACIONAL_PROMPT,
} from './prompts/intents/oferta'
import {
    CITA_EXTENDED_DESCRIPTION,
    CITA_REQUIRED_FIELDS,
    CITA_MINIMAL_PROMPT,
    CITA_RETRATO_PROMPT,
    CITA_TIPOGRAFIA_PROMPT,
    CITA_MARCO_PROMPT,
    CITA_TEXTURA_PROMPT,
    CITA_DIVIDIDO_PROMPT,
    CITA_DESCRIPTION,
} from './prompts/intents/cita'
import {
    EQUIPO_EXTENDED_DESCRIPTION,
    EQUIPO_REQUIRED_FIELDS,
    EQUIPO_RETRATO_PROMPT,
    EQUIPO_GRUPO_PROMPT,
    EQUIPO_MOSAICO_PROMPT,
    EQUIPO_TESTIMONIO_PROMPT,
    EQUIPO_ACCION_PROMPT,
    EQUIPO_TARJETA_PROMPT,
    EQUIPO_DESCRIPTION,
} from './prompts/intents/equipo'
import {
    LOGRO_EXTENDED_DESCRIPTION,
    LOGRO_REQUIRED_FIELDS,
    LOGRO_NUMERO_PROMPT,
    LOGRO_TROFEO_PROMPT,
    LOGRO_CONFETI_PROMPT,
    LOGRO_EQUIPO_PROMPT,
    LOGRO_SELLO_PROMPT,
    LOGRO_CAMINO_PROMPT,
    LOGRO_DESCRIPTION,
} from './prompts/intents/logro'
import {
    LANZAMIENTO_EXTENDED_DESCRIPTION,
    LANZAMIENTO_REQUIRED_FIELDS,
    LANZAMIENTO_COUNTDOWN_PROMPT,
    LANZAMIENTO_CORTINA_PROMPT,
    LANZAMIENTO_SILUETA_PROMPT,
    LANZAMIENTO_GLITCH_PROMPT,
    LANZAMIENTO_RASGADO_PROMPT,
    LANZAMIENTO_CALENDARIO_PROMPT,
    LANZAMIENTO_APERTURA_PROMPT,
    LANZAMIENTO_BLUR_PROMPT,
    LANZAMIENTO_FRAGMENTADO_PROMPT,
    LANZAMIENTO_ESPIRAL_PROMPT,
    LANZAMIENTO_MISTERIO_PROMPT,
    LANZAMIENTO_DESCRIPTION,
} from './prompts/intents/lanzamiento'
import {
    RETO_EXTENDED_DESCRIPTION,
    RETO_REQUIRED_FIELDS,
    RETO_VERSUS_PROMPT,
    RETO_SORTEO_PROMPT,
    RETO_BRACKET_PROMPT,
    RETO_ATREVETE_PROMPT,
    RETO_PODIO_PROMPT,
    RETO_REGLAS_PROMPT,
    RETO_DESCRIPTION,
} from './prompts/intents/reto'
import {
    SERVICIO_EXTENDED_DESCRIPTION,
    SERVICIO_REQUIRED_FIELDS,
    SERVICIO_GRID_PROMPT,
    SERVICIO_BENEFIT_PROMPT,
    SERVICIO_PRICING_PROMPT,
    SERVICIO_PROCESS_PROMPT,
    SERVICIO_LIST_PROMPT,
    SERVICIO_TRUST_PROMPT,
    SERVICIO_ECOSYSTEM_PROMPT,
    SERVICIO_STAT_PROMPT,
    SERVICIO_MINIMAL_PROMPT,
    SERVICIO_INTERACTION_PROMPT,
    SERVICIO_WORKSHOP_PROMPT,
    SERVICIO_DESCRIPTION,
} from './prompts/intents/servicio'
import {
    TALENTO_EXTENDED_DESCRIPTION,
    TALENTO_REQUIRED_FIELDS,
    TALENTO_CONTRATANDO_PROMPT,
    TALENTO_CULTURA_PROMPT,
    TALENTO_VALORES_PROMPT,
    TALENTO_BENEFICIOS_PROMPT,
    TALENTO_SPOTLIGHT_PROMPT,
    TALENTO_OFICINA_PROMPT,
    TALENTO_EQUIPO_PROMPT,
    TALENTO_REMOTO_PROMPT,
    TALENTO_CRECIMIENTO_PROMPT,
    TALENTO_VACANTE_PROMPT,
    TALENTO_DIVERSIDAD_PROMPT,
    TALENTO_DESCRIPTION,
} from './prompts/intents/talento'
import {
    DEFINICION_EXTENDED_DESCRIPTION,
    DEFINICION_REQUIRED_FIELDS,
    DEFINICION_CLASICO_PROMPT,
    DEFINICION_MINIMALISTA_PROMPT,
    DEFINICION_MAPA_PROMPT,
    DEFINICION_ENCICLOPEDIA_PROMPT,
    DEFINICION_URBANO_PROMPT,
    DEFINICION_TECH_PROMPT,
    DEFINICION_NEON_PROMPT,
    DEFINICION_TARJETA_PROMPT,
    DEFINICION_ILUSTRADO_PROMPT,
    DEFINICION_VERSUS_PROMPT,
    DEFINICION_EMOJI_PROMPT,
    DEFINICION_DESCRIPTION,
} from './prompts/intents/definicion'
import {
    EFEMERIDE_EXTENDED_DESCRIPTION,
    EFEMERIDE_REQUIRED_FIELDS,
    EFEMERIDE_CALENDARIO_PROMPT,
    EFEMERIDE_TIPOGRAFIA_PROMPT,
    EFEMERIDE_FIESTA_PROMPT,
    EFEMERIDE_HISTORICO_PROMPT,
    EFEMERIDE_NEON_PROMPT,
    EFEMERIDE_ESTACIONAL_PROMPT,
    EFEMERIDE_BANDERA_PROMPT,
    EFEMERIDE_RELIGIOSO_PROMPT,
    EFEMERIDE_COUNTDOWN_PROMPT,
    EFEMERIDE_COLLAGE_PROMPT,
    EFEMERIDE_MENSAJE_PROMPT,
    EFEMERIDE_DESCRIPTION,
} from './prompts/intents/efemeride'
import {
    PASOS_EXTENDED_DESCRIPTION,
    PASOS_REQUIRED_FIELDS,
    PASOS_ZIGZAG_PROMPT,
    PASOS_TARJETAS_PROMPT,
    PASOS_DIVIDIDO_PROMPT,
    PASOS_FLOTANTE_PROMPT,
    PASOS_PLANO_PROMPT,
    PASOS_VERTICAL_PROMPT,
    PASOS_DESCRIPTION,
} from './prompts/intents/pasos'
import {
    BTS_EXTENDED_DESCRIPTION,
    BTS_REQUIRED_FIELDS,
    BTS_PROCESO_PROMPT,
    BTS_ESCRITORIO_PROMPT,
    BTS_MOODBOARD_PROMPT,
    BTS_BOCETO_PROMPT,
    BTS_EVOLUCION_PROMPT,
    BTS_PALETA_PROMPT,
    BTS_DESCRIPTION,
} from './prompts/intents/bts'
import {
    CATALOGO_EXTENDED_DESCRIPTION,
    CATALOGO_REQUIRED_FIELDS,
    CATALOGO_REJILLA_PROMPT,
    CATALOGO_EDITORIAL_PROMPT,
    CATALOGO_MOSAICO_PROMPT,
    CATALOGO_ESTANTERIA_PROMPT,
    CATALOGO_COLORES_PROMPT,
    CATALOGO_DETALLE_PROMPT,
    CATALOGO_FLATLAY_PROMPT,
    CATALOGO_COMPARATIVO_PROMPT,
    CATALOGO_CARRUSEL_PROMPT,
    CATALOGO_LIFESTYLE_PROMPT,
    CATALOGO_HERO_PROMPT,
    CATALOGO_DESCRIPTION,
} from './prompts/intents/catalogo'

// Debug Modal Data
export interface DebugPromptData {
    finalPrompt: string
    logoUrl?: string
    referenceImageUrl?: string
    selectedStyles: string[]
    headline?: string
    cta?: string
    platform?: string
    format?: string
    intent?: string
}

// Intent-specific prompts
import {
    ESCAPARATE_EXTENDED_DESCRIPTION,
    ESCAPARATE_REQUIRED_FIELDS,
    ESCAPARATE_ESTUDIO_PROMPT,
    ESCAPARATE_PODIO_PROMPT,
    ESCAPARATE_FLOTANTE_PROMPT,
    ESCAPARATE_CONTEXTO_PROMPT,
    ESCAPARATE_MACRO_PROMPT,
    ESCAPARATE_SPLASH_PROMPT,
    ESCAPARATE_ESPEJO_PROMPT,
    ESCAPARATE_CAPAS_PROMPT,
    ESCAPARATE_FLAT_PROMPT,
    ESCAPARATE_SILUETA_PROMPT,
    ESCAPARATE_PACK_PROMPT,
    ESCAPARATE_DESCRIPTION,
} from './prompts/intents/escaparate'
import {
    COMUNICADO_EXTENDED_DESCRIPTION,
    COMUNICADO_REQUIRED_FIELDS,
    COMUNICADO_OFICIAL_PROMPT,
    COMUNICADO_URGENTE_PROMPT,
    COMUNICADO_MODERNO_PROMPT,
    COMUNICADO_EDITORIAL_PROMPT,
    COMUNICADO_COMUNIDAD_PROMPT,
    COMUNICADO_MINIMAL_PROMPT,
    COMUNICADO_DESCRIPTION,
} from './prompts/intents/comunicado'
import {
    EVENTO_EXTENDED_DESCRIPTION,
    EVENTO_REQUIRED_FIELDS,
    EVENTO_CONFERENCIA_PROMPT,
    EVENTO_FIESTA_PROMPT,
    EVENTO_TALLER_PROMPT,
    EVENTO_FESTIVAL_PROMPT,
    EVENTO_NETWORKING_PROMPT,
    EVENTO_RESERVA_PROMPT,
    EVENTO_DESCRIPTION,
} from './prompts/intents/evento'
import {
    COMPARATIVA_EXTENDED_DESCRIPTION,
    COMPARATIVA_REQUIRED_FIELDS,
    COMPARATIVA_DIVIDIDO_PROMPT,
    COMPARATIVA_VERSUS_PROMPT,
    COMPARATIVA_TRANSFORMACION_PROMPT,
    COMPARATIVA_CHECKLIST_PROMPT,
    COMPARATIVA_SLIDER_PROMPT,
    COMPARATIVA_EVOLUCION_PROMPT,
    COMPARATIVA_MITO_PROMPT,
    COMPARATIVA_EXPECTATIVA_PROMPT,
    COMPARATIVA_PRECIO_PROMPT,
    COMPARATIVA_HORIZONTAL_PROMPT,
    COMPARATIVA_ZOOM_PROMPT,
    COMPARATIVA_DESCRIPTION,
} from './prompts/intents/comparativa'
import {
    LISTA_EXTENDED_DESCRIPTION,
    LISTA_REQUIRED_FIELDS,
    LISTA_CHECKLIST_PROMPT,
    LISTA_RANKING_PROMPT,
    LISTA_PASOS_PROMPT,
    LISTA_REJILLA_PROMPT,
    LISTA_TIMELINE_PROMPT,
    LISTA_NOTA_PROMPT,
    LISTA_BULLETS_PROMPT,
    LISTA_ICONOS_PROMPT,
    LISTA_CAROUSEL_PROMPT,
    LISTA_NUMERADO_PROMPT,
    LISTA_PROS_CONS_PROMPT,
    LISTA_DESCRIPTION,
} from './prompts/intents/lista'

import {
    DATO_EXTENDED_DESCRIPTION,
    DATO_REQUIRED_FIELDS,
    DATO_HEROE_PROMPT,
    DATO_COMPARACION_PROMPT,
    DATO_PROCESO_PROMPT,
    DATO_REJILLA_PROMPT,
    DATO_CONTADOR_PROMPT,
    DATO_CIRCULAR_PROMPT,
    DATO_DESCRIPTION,
} from './prompts/intents/dato'
import {
    PREGUNTA_EXTENDED_DESCRIPTION,
    PREGUNTA_REQUIRED_FIELDS,
    PREGUNTA_IMPACTO_PROMPT,
    PREGUNTA_ENCUESTA_PROMPT,
    PREGUNTA_CHAT_PROMPT,
    PREGUNTA_QUIZ_PROMPT,
    PREGUNTA_DEBATE_PROMPT,
    PREGUNTA_PENSAMIENTO_PROMPT,
    PREGUNTA_DESCRIPTION,
} from './prompts/intents/pregunta'

export type IntentGroup = 'vender' | 'informar' | 'conectar' | 'educar' | 'engagement'

export type ColorRole = 'Principal' | 'Secundario' | 'Texto' | 'Fondo' | 'Acento' | 'Neutral'

export interface SelectedColor {
    color: string
    role: ColorRole
}

export type TextAssetType = 'cta' | 'tagline' | 'url' | 'custom'

export interface TextAsset {
    id: string
    type: TextAssetType
    label: string
    value: string
}

export type IntentCategory =
    // Grupo A: Venta y Producto (Hard Sell)
    | 'oferta'           // La Oferta (Discount)
    | 'escaparate'       // El Escaparate (Product Hero)
    | 'catalogo'         // El Catálogo (Grid/Collection)
    | 'lanzamiento'      // El Lanzamiento (New Arrival)
    | 'servicio'         // El Servicio (Abstract)
    // Grupo B: Información y Avisos (Utility)
    | 'comunicado'       // El Comunicado (Notice)
    | 'evento'           // El Evento (Save the Date)
    | 'lista'            // La Lista (Checklist)
    | 'comparativa'      // La Comparativa (Versus/Split)
    | 'efemeride'        // La Efeméride (Seasonal)
    // Grupo C: Marca y Personas (Connection)
    | 'equipo'           // El Equipo (Meet the Team)
    | 'cita'             // La Cita (Quote)
    | 'talento'          // El Talento (Hiring)
    | 'logro'            // El Logro (Milestone)
    | 'bts'              // Behind the Scenes (Storytelling)
    // Grupo D: Educación y Valor (Content)
    | 'dato'             // El Dato (Stat/Infographic)
    | 'pasos'            // El Paso a Paso (How-To)
    | 'definicion'       // La Definición
    // Grupo E: Engagement (Interaction)
    | 'pregunta'         // La Pregunta (Q&A)
    | 'reto'             // El Reto/Juego

export type LayoutId =
    | 'oferta-impacto'
    | 'promo-movil'
    | 'comunicado-ai-freedom'

export interface LayoutMeta {
    id: LayoutId
    name: string
    description: string
    prompt: string
    icon: LucideIcon
    intent: IntentCategory
}



// -----------------------------------------------------------------------------
// INTENT METADATA
// -----------------------------------------------------------------------------

export interface IntentRequiredField {
    id: string
    label: string
    placeholder: string
    type: 'text' | 'textarea' | 'url' | 'phone' | 'address'
    required: boolean
    optional?: boolean
    mapsTo?: 'headline' | 'cta' // Map to layout-level fields
    aiContext?: string
}

export interface IntentMeta {
    id: IntentCategory
    name: string
    description: string
    extendedDescription?: string  // 3 líneas explicando uso tras seleccionar
    group: IntentGroup
    icon: string  // Lucide icon name
    requiresImage: boolean
    requiredFields?: IntentRequiredField[]  // Campos específicos de esta intención
    subModes?: string[]  // e.g., Escaparate: ['studio', 'lifestyle', 'servicio']
    defaultHeadline?: string
    defaultCta?: string
}

export const INTENT_GROUPS: Record<IntentGroup, { name: string; icon: string; description: string }> = {
    vender: { name: 'Vender', icon: 'ShoppingBag', description: 'Productos y ofertas' },
    informar: { name: 'Informar', icon: 'Info', description: 'Avisos y eventos' },
    conectar: { name: 'Conectar', icon: 'Users', description: 'Marca y personas' },
    educar: { name: 'Educar', icon: 'GraduationCap', description: 'Contenido de valor' },
    engagement: { name: 'Engagement', icon: 'MessageCircle', description: 'Interacción' },
}

export const INTENT_CATALOG: IntentMeta[] = [
    // Grupo A: Vender
    { id: 'oferta', name: 'La Oferta', description: 'Descuento, precio destacado', extendedDescription: 'Promociones con precio o descuento destacado. Ideal para ofertas flash, rebajas y Black Friday. Requiere imagen del producto a promocionar.', group: 'vender', icon: 'Percent', requiresImage: true, defaultHeadline: '30% OFF', defaultCta: 'Comprar Ahora' },
    { id: 'escaparate', name: 'El Escaparate', description: 'Producto protagonista', extendedDescription: ESCAPARATE_EXTENDED_DESCRIPTION, group: 'vender', icon: 'Package', requiresImage: true, requiredFields: ESCAPARATE_REQUIRED_FIELDS, subModes: ['studio', 'lifestyle', 'mockup'] },
    { id: 'catalogo', name: 'El Catálogo', description: 'Colección de productos', extendedDescription: 'Muestra varios productos en una cuadrícula elegante. Perfecto para lanzar colecciones o destacar la variedad de tu catálogo.', group: 'vender', icon: 'Grid3x3', requiresImage: true },
    { id: 'lanzamiento', name: 'El Lanzamiento', description: 'Coming Soon, novedad', extendedDescription: 'Genera expectativa para un producto o servicio próximo. Diseño misterioso que invita a estar atentos sin revelar demasiado.', group: 'vender', icon: 'Rocket', requiresImage: false, defaultHeadline: 'Próximamente' },
    { id: 'servicio', name: 'El Servicio', description: 'Servicios intangibles', extendedDescription: 'Para promocionar servicios que no se pueden fotografiar. Usa iconografía y textos claros para comunicar el valor.', group: 'vender', icon: 'Briefcase', requiresImage: false },

    // Grupo B: Informar
    { id: 'comunicado', name: 'El Comunicado', description: 'Aviso, información densa', extendedDescription: COMUNICADO_EXTENDED_DESCRIPTION, group: 'informar', icon: 'FileText', requiresImage: false, requiredFields: COMUNICADO_REQUIRED_FIELDS },
    { id: 'evento', name: 'El Evento', description: 'Fecha, hora, lugar', extendedDescription: 'Save the Date para eventos, talleres o webinars. Fecha y hora prominentes con información esencial del evento.', group: 'informar', icon: 'Calendar', requiresImage: false, defaultHeadline: 'Save the Date' },
    { id: 'lista', name: 'La Lista', description: 'Pasos, checklist', extendedDescription: 'Información estructurada en formato lista. Ideal para tips, pasos a seguir o requisitos. Fácil de escanear y recordar.', group: 'informar', icon: 'ListChecks', requiresImage: false },
    { id: 'comparativa', name: 'La Comparativa', description: 'Antes/Después, Versus', extendedDescription: 'Comparación visual entre dos estados o opciones. Perfecto para transformaciones, diferencias de producto o decisiones.', group: 'informar', icon: 'ArrowLeftRight', requiresImage: true },
    { id: 'efemeride', name: 'La Efeméride', description: 'Navidad, Verano, fechas especiales', extendedDescription: 'Contenido para fechas señaladas: festividades, días mundiales o temporadas. Conecta con el momento cultural actual.', group: 'informar', icon: 'Sparkles', requiresImage: false },

    // Grupo C: Conectar
    { id: 'equipo', name: 'El Equipo', description: 'Meet the Team', extendedDescription: 'Presenta a las personas detrás de la marca. Humaniza tu negocio mostrando rostros, nombres y roles del equipo.', group: 'conectar', icon: 'Users', requiresImage: true },
    { id: 'cita', name: 'La Cita', description: 'Quote, frase inspiracional', extendedDescription: 'Citas memorables, testimonios o frases de marca. Diseño tipográfico protagonista que transmite personalidad.', group: 'conectar', icon: 'Quote', requiresImage: false },
    { id: 'talento', name: 'El Talento', description: 'Hiring, buscamos personal', extendedDescription: 'Atrae candidatos con ofertas de empleo atractivas. Muestra cultura de empresa y requisitos del puesto de forma visual.', group: 'conectar', icon: 'UserPlus', requiresImage: false, defaultHeadline: 'Te Buscamos' },
    { id: 'logro', name: 'El Logro', description: 'Milestone, celebración', extendedDescription: LOGRO_EXTENDED_DESCRIPTION, group: 'conectar', icon: 'Trophy', requiresImage: false, requiredFields: LOGRO_REQUIRED_FIELDS, defaultHeadline: '¡Gracias!' },
    { id: 'bts', name: 'Behind the Scenes', description: 'Proceso, storytelling', extendedDescription: 'Muestra el proceso creativo o día a día del negocio. Contenido auténtico que genera confianza y cercanía.', group: 'conectar', icon: 'Clapperboard', requiresImage: true },

    // Grupo D: Educar
    { id: 'dato', name: 'El Dato', description: 'Estadística, infografía', extendedDescription: DATO_EXTENDED_DESCRIPTION, group: 'educar', icon: 'BarChart3', requiresImage: false, requiredFields: DATO_REQUIRED_FIELDS },
    { id: 'pasos', name: 'El Paso a Paso', description: 'How-To, tutorial', extendedDescription: 'Tutoriales y guías paso a paso. Enseña a tu audiencia algo útil relacionado con tu expertise o producto.', group: 'educar', icon: 'ListOrdered', requiresImage: false },
    { id: 'definicion', name: 'La Definición', description: 'Palabra + significado', extendedDescription: 'Explica términos de tu industria. Posiciónate como experto educando sobre conceptos importantes para tu audiencia.', group: 'educar', icon: 'BookOpen', requiresImage: false },

    // Grupo E: Engagement
    { id: 'pregunta', name: 'La Pregunta', description: 'Q&A, genera comentarios', extendedDescription: PREGUNTA_EXTENDED_DESCRIPTION, group: 'engagement', icon: 'HelpCircle', requiresImage: false, requiredFields: PREGUNTA_REQUIRED_FIELDS, defaultHeadline: '¿Qué opinas?' },
    { id: 'reto', name: 'El Reto', description: 'Quiz, juego visual', extendedDescription: 'Contenido interactivo: quizzes, encuentra las diferencias o retos visuales. Maximiza el engagement y tiempo en publicación.', group: 'engagement', icon: 'Gamepad2', requiresImage: false },
]

// -----------------------------------------------------------------------------
// THEMES (for non-image intents)
// -----------------------------------------------------------------------------

export type SeasonalTheme =
    | 'navidad'
    | 'verano'
    | 'halloween'
    | 'sanvalentin'
    | 'blackfriday'
    | 'corporativo'
    | 'minimalista'
    | 'vibrante'

export interface ThemeMeta {
    id: SeasonalTheme
    name: string
    icon: string
    colors: string[]  // Suggested palette
    keywords: string[]
}

export const THEME_CATALOG: ThemeMeta[] = [
    { id: 'navidad', name: 'Navidad', icon: '🎄', colors: ['#C41E3A', '#165B33', '#FFD700'], keywords: ['festive', 'cozy', 'snow', 'gifts'] },
    { id: 'verano', name: 'Verano', icon: '☀️', colors: ['#FFB347', '#00CED1', '#FF6B6B'], keywords: ['beach', 'tropical', 'bright', 'fresh'] },
    { id: 'halloween', name: 'Halloween', icon: '🎃', colors: ['#FF6600', '#1A1A2E', '#8B008B'], keywords: ['spooky', 'dark', 'mysterious'] },
    { id: 'sanvalentin', name: 'San Valentín', icon: '💕', colors: ['#FF69B4', '#FFB6C1', '#DC143C'], keywords: ['romantic', 'love', 'hearts'] },
    { id: 'blackfriday', name: 'Black Friday', icon: '🏷️', colors: ['#000000', '#FFD700', '#FF0000'], keywords: ['sale', 'bold', 'urgent'] },
    { id: 'corporativo', name: 'Corporativo', icon: '🏢', colors: ['#2C3E50', '#3498DB', '#ECF0F1'], keywords: ['professional', 'clean', 'modern'] },
    { id: 'minimalista', name: 'Minimalista', icon: '◻️', colors: ['#FFFFFF', '#000000', '#F5F5F5'], keywords: ['simple', 'elegant', 'whitespace'] },
    { id: 'vibrante', name: 'Vibrante', icon: '🌈', colors: ['#FF006E', '#8338EC', '#3A86FF'], keywords: ['energetic', 'bold', 'colorful'] },
]

// -----------------------------------------------------------------------------
// VISION ANALYSIS (from Gemini Vision API)
// -----------------------------------------------------------------------------

export type DetectedSubject =
    | 'food'
    | 'tech'
    | 'fashion'
    | 'beauty'
    | 'home'
    | 'sports'
    | 'nature'
    | 'people'
    | 'abstract'
    | 'product'
    | 'unknown'

export interface VisionAnalysis {
    subject: DetectedSubject
    subjectLabel: string        // Human-readable: "Botella de aceite"
    lighting: 'bright' | 'dim' | 'natural' | 'studio' | 'golden_hour' | 'unknown'
    colorPalette: string[]      // Extracted hex colors
    keywords: string[]          // Visual descriptors
    confidence: number          // 0-1
}

// -----------------------------------------------------------------------------
// STYLE CHIPS (contextual based on vision/theme)
// -----------------------------------------------------------------------------

export interface StyleChip {
    id: string
    label: string
    icon: string
    keywords: string[]  // Added to prompt
    category?: string   // Optional category for grouping
}

export const STYLE_CHIPS_BY_SUBJECT: Record<DetectedSubject, StyleChip[]> = {
    food: [
        { id: 'editorial-gourmet', label: '🍷 Editorial Gourmet', icon: 'ChefHat', keywords: ['high-end restaurant photography', 'dark minimalist background', 'dramatic side lighting', 'michelin star plating'] },
        { id: 'casual-authentic', label: '🌿 Auténtico Casero', icon: 'Utensils', keywords: ['rustic wooden table', 'warm natural sunlight', 'homemade aesthetic', 'comfort food vibe'] },
    ],
    tech: [
        { id: 'minimal-tech', label: '⚪ Tech Minimal', icon: 'Monitor', keywords: ['apple design aesthetic', 'clean white background', 'soft shadows', 'premium product photography'] },
        { id: 'neon-cyber', label: '⚡ Neón Cyber', icon: 'Zap', keywords: ['cyberpunk aesthetic', 'dark mode', 'glowing neon accents', 'high contrast futuristic'] },
    ],
    fashion: [
        { id: 'studio-chic', label: '📸 Estudio Chic', icon: 'Camera', keywords: ['fashion editorial', 'clean studio backdrop', 'softbox lighting', 'elegant pose'] },
        { id: 'street-urban', label: '🏙️ Urbano Real', icon: 'Building2', keywords: ['street style photography', 'natural outdoor lighting', 'urban city background', 'dynamic candid'] },
    ],
    beauty: [
        { id: 'pure-clean', label: '🫧 Pureza', icon: 'Droplets', keywords: ['skincare commercial style', 'soft airy lighting', 'white and pastel tones', 'clean purity'] },
        { id: 'bold-glam', label: '💄 Glamour', icon: 'Sparkles', keywords: ['high fashion makeup', 'bold lighting', 'rich saturated colors', 'glossy textures'] },
    ],
    home: [
        { id: 'scandi-modern', label: '🛋️ Moderno Scandi', icon: 'Sofa', keywords: ['architectural digest style', 'bright airy room', 'natural wood details', 'minimalist geometry'] },
        { id: 'cozy-warm', label: '🧶 Acogedor', icon: 'Coffee', keywords: ['hygge aesthetic', 'warm ambient lighting', 'soft textures', 'lived-in comfort'] },
    ],
    sports: [
        { id: 'dynamic-action', label: '⚡ Acción Pura', icon: 'Activity', keywords: ['frozen motion', 'dynamic athlete pose', 'dramatic stadium lighting', 'high energy'] },
        { id: 'gym-focus', label: '💪 Estética Gym', icon: 'Dumbbell', keywords: ['fitness motivation', 'contrasty lighting', 'gym environment', 'focused determination'] },
    ],
    nature: [
        { id: 'cinematic-view', label: '🌄 Cinemático', icon: 'Mountain', keywords: ['national geographic style', 'golden hour', 'epic wide angle', 'dramatic landscape'] },
        { id: 'macro-detail', label: '🔍 Detalle Macro', icon: 'Flower2', keywords: ['macro photography', 'shallow depth of field', 'bokeh background', 'intricate nature details'] },
    ],
    people: [
        { id: 'pro-portrait', label: '👔 Profesional', icon: 'UserCircle', keywords: ['professional headshot', 'trustworthy lighting', 'clean office background', 'friendly corporate'] },
        { id: 'candid-moment', label: '😊 Espontáneo', icon: 'Smile', keywords: ['lifestyle photography', 'genuine laughter', 'sun flare', 'authentic moment'] },
    ],
    abstract: [
        { id: 'modern-geo', label: '🔷 Geométrico', icon: 'Shapes', keywords: ['abstract 3d shapes', 'clean corporate memphis', 'gradient colors', 'modern tech abstract'] },
        { id: 'artistic-fluid', label: '🎨 Fluido Arte', icon: 'Palette', keywords: ['alcohol ink texture', 'fluid gradients', 'dreamy abstract art', 'creative background'] },
    ],
    product: [
        { id: 'pro-studio', label: '📦 Estudio Pro', icon: 'Box', keywords: ['commercial product shot', 'infinite white background', 'perfect reflections', 'advertising standard'] },
        { id: 'lifestyle-context', label: '🏠 En Contexto', icon: 'Home', keywords: ['product in use', 'lifestyle setting', 'blurry background', 'realistic environment'] },
    ],
    unknown: [
        { id: 'clean-modern', label: '✨ Limpio Moderno', icon: 'Sparkles', keywords: ['high quality stock photography', 'well lit', 'clean composition', 'modern aesthetic'] },
        { id: 'bold-creative', label: '🎨 Creativo Bold', icon: 'Zap', keywords: ['creative studio lighting', 'vibrant color palette', 'bold artistic choice', 'unique perspective'] },
    ],
}

// -----------------------------------------------------------------------------
// ARTISTIC STYLE CATALOG (Global Expansion)
// -----------------------------------------------------------------------------

export const ARTISTIC_STYLE_GROUPS = [
    { id: 'brand', label: '💼 Tu Marca', description: 'Estilos de tu Kit de Marca' },
    { id: 'suggested', label: '⭐ Sugeridos', description: 'Basados en tu imagen' },
    { id: 'design', label: '🎨 Diseño & Mockups', description: 'Editorial y Comercial' },
    { id: 'artistic', label: '🎭 Arte & Retro', description: 'Estilos clásicos y vintage' },
    { id: 'digital', label: '🎮 Digital & Animación', description: 'Videojuegos y Series' },
    { id: 'cinematic', label: '🎥 Cine & Foto', description: 'Directores y atmósferas' },
    { id: 'technical', label: '📐 Técnico & Gráfico', description: 'Planos y vectores' },
    { id: 'cultural', label: '🌍 Cultural & Regional', description: 'Estilos del mundo' },
    { id: 'experimental', label: '🌀 Experimental', description: 'Glitch, Vaporwave y más' },
]

export const ARTISTIC_STYLE_CATALOG: StyleChip[] = [
    // 1. Diseño & Mockups
    { id: 'mockup-cotton', label: '👕 Mockups Textiles', icon: 'Shirt', category: 'design', keywords: ['cotton t-shirt mockup', 'natural folds', 'realistic shadows', 'studio lighting'] },
    { id: 'editorial-high', label: '📖 Editorial Premium', icon: 'BookOpen', category: 'design', keywords: ['editorial layout', 'clean finishing', 'dark background', 'sharp typography', 'minimalist'] },
    { id: 'ecommerce-lux', label: '🛍️ E-commerce Lujo', icon: 'ShoppingBag', category: 'design', keywords: ['high-end commercial photography', 'virtual models', 'optimized lighting', 'conversion focused'] },
    { id: 'infographic', label: '📊 Infográfico', icon: 'BarChart', category: 'design', keywords: ['structured diagrams', 'clean infographics', 'data visualization style', 'vector elements'] },

    // 2. Arte & Retro
    { id: 'graphic-novel', label: '🖋️ Novela Gráfica', icon: 'PenTool', category: 'artistic', keywords: ['graphic novel style', 'heavy ink lines', 'high contrast', 'sketch textures', 'noir'] },
    { id: 'vintage-film', label: '🎞️ Película Retro', icon: 'Film', category: 'artistic', keywords: ['vintage film aesthetic', 'bollywood style', 'film grain', 'saturated colors', 'harsh shadows'] },
    { id: 'pop-art', label: '💥 Pop Art', icon: 'Zap', category: 'artistic', keywords: ['andy warhol style', 'halftone patterns', 'bold colors', 'silkscreen print'] },
    { id: 'impressionist', label: '🎨 Impresionista', icon: 'Palette', category: 'artistic', keywords: ['monet style', 'loose brushstrokes', 'light and color focus', 'painterly texture'] },
    { id: 'cubism', label: '🧊 Cubismo', icon: 'Box', category: 'artistic', keywords: ['picasso style', 'geometric deconstruction', 'multiple viewpoints', 'abstracted forms'] },
    { id: 'surrealism', label: '🌀 Surrealismo', icon: 'Wind', category: 'artistic', keywords: ['salvador dali style', 'dream-like', 'unusual juxtapositions', 'melting forms'] },

    // 3. Digital & Animación
    { id: 'ghibli', label: '☁️ Studio Ghibli', icon: 'Cloud', category: 'digital', keywords: ['studio ghibli aesthetic', 'hand-painted backgrounds', 'soft lighting', 'nature focus', 'nostalgic'] },
    { id: 'ibanez', label: '🖊️ Francisco Ibáñez', icon: 'Smile', category: 'digital', keywords: ['mortadelo y filemon style', 'classic spanish comic', 'caricatured features', 'detailed chaotic backgrounds'] },
    { id: 'muppets', label: '🧸 Muppets', icon: 'Hand', category: 'digital', keywords: ['muppet puppet style', 'felt texture', 'jim henson aesthetic', 'distinctive puppet eyes'] },
    { id: 'dbz', label: '🐉 Dragon Ball Z', icon: 'Flame', category: 'digital', keywords: ['90s anime style', 'akira toriyama aesthetic', 'bold outlines', 'dynamic energy'] },
    { id: 'akira', label: '🏍️ Akira', icon: 'Zap', category: 'digital', keywords: ['katsuhiro otomo style', 'cyberpunk anime', 'detailed urban decay', 'gritty', 'cinematic'] },
    { id: 'simpsons', label: '🍩 Los Simpsons', icon: 'CircleDot', category: 'digital', keywords: ['matt groening style', 'yellow skin', 'overbite', 'springfield aesthetic'] },
    { id: 'pixar', label: '🎬 Pixar Style', icon: 'Video', category: 'digital', keywords: ['disney pixar aesthetic', '3d rendered', 'expressive characters', 'subsurface scattering'] },
    { id: 'one-piece', label: '☠️ One Piece', icon: 'Anchor', category: 'digital', keywords: ['eiichiro oda style', 'wild character designs', 'vibrant adventure', 'unique anatomy'] },
    { id: 'lego', label: '🧱 LEGO Style', icon: 'BoxSelect', category: 'digital', keywords: ['lego plastic bricks', 'minifigure aesthetic', 'shiny plastic surface', 'modular construction'] },
    { id: 'south-park', label: '🏔️ South Park', icon: 'UserCircle', category: 'digital', keywords: ['construction paper cutout', 'stop-motion look', 'simplistic design', 'big eyes'] },

    // 4. Cine & Foto
    { id: 'cinematic-gold', label: '🎥 Cinematic Gold', icon: 'Camera', category: 'cinematic', keywords: ['golden hour lighting', 'dramatic portraits', 'detailed skin textures', 'shallow depth of field'] },
    { id: 'wes-anderson', label: '🏰 Wes Anderson', icon: 'Palace', category: 'cinematic', keywords: ['symmetrical composition', 'pastel color palette', 'flat lay', 'quirky details', 'center framing'] },
    { id: 'tarantino', label: '🔫 Tarantino style', icon: 'Bomb', category: 'cinematic', keywords: ['intense colors', 'low angle shots', 'stylized violence aesthetic', 'retro 70s look'] },
    { id: 'a24', label: '🎬 A24 Aesthetic', icon: 'Framer', category: 'cinematic', keywords: ['poetic atmosphere', 'soft natural light', 'indie film look', 'grainy texture'] },
    { id: 'noir', label: '🌑 Cine Negro', icon: 'Moon', category: 'cinematic', keywords: ['film noir', 'chiaroscuro lighting', 'high contrast black and white', 'moody', 'shadowy'] },

    // 5. Técnico & Gráfico
    { id: 'blueprint', label: '📐 Blueprint', icon: 'Ruler', category: 'technical', keywords: ['technical drawing', 'cyanotype blue', 'white lines', 'architectural plan', 'grid background'] },
    { id: 'vector-flat', label: '🎨 Vector Flat', icon: 'Image', category: 'technical', keywords: ['flat design', 'clean vectors', 'no gradients', 'minimalist shapes'] },
    { id: 'woodcut', label: '🪵 Xilografía', icon: 'Scissors', category: 'technical', keywords: ['woodcut print', 'artisan texture', 'rough edges', 'hand-printed look'] },
    { id: 'watercolor-d', label: '💧 Acuarela Digital', icon: 'Droplets', category: 'technical', keywords: ['digital watercolor', 'soft bleeding edges', 'paper texture', 'translucent layers'] },

    // 6. Cultural & Regional
    { id: 'ukiyo-e', label: '🌊 Ukiyo-e', icon: 'Waves', category: 'cultural', keywords: ['japanese woodblock print', 'hokusai style', 'flat perspective', 'traditional patterns'] },
    { id: 'tribal-af', label: '🌍 Tribal Africano', icon: 'Globe', category: 'cultural', keywords: ['african tribal art patterns', 'earthy tones', 'hand-carved textures', 'symbolic motifs'] },
    { id: 'aztec', label: '🎭 Mexica / Azteca', icon: 'Sun', category: 'cultural', keywords: ['pre-columbian art', 'intricate stone carvings', 'indigenous motifs', 'vibrant historical colors'] },

    // 7. Experimental
    { id: 'glitch-art', label: '👾 Glitch Art', icon: 'Cpu', category: 'experimental', keywords: ['digital corruption', 'chromatic aberration', 'data moshing', 'modern tech error'] },
    { id: 'liminal', label: '🚪 Espacios Liminales', icon: 'DoorOpen', category: 'experimental', keywords: ['liminal space aesthetic', 'uncanny', 'empty nostalgic environments', 'dreamcore'] },
    { id: 'vaporwave-exp', label: '🌅 Vaporwave', icon: 'Sun', category: 'experimental', keywords: ['aesthetic 80s', 'glitched marble statues', 'neon pink and teal', 'digital surrealism'] },
    { id: 'brutalist-exp', label: '🧱 Brutalista', icon: 'Box', category: 'experimental', keywords: ['raw concrete', 'massive forms', 'functional aesthetic', 'unpolished'] },
]

// -----------------------------------------------------------------------------
// LAYOUT OPTIONS (Smart Layouts / Wireframes)
// -----------------------------------------------------------------------------

export interface LayoutOption {
    id: string
    name: string
    description: string
    svgIcon: string  // SVG path or component name
    textZone: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'overlay'
    promptInstruction: string  // Fixed instruction
    structuralPrompt?: string  // Advanced deconstruction DNA
    referenceImage?: string    // Path to a template image (Phantom Template)
    referenceImageDescription?: string // Reinforced textual description of the template
    textFields?: LayoutTextField[]
}

export interface LayoutTextField {
    id: string
    label: string
    placeholder: string
    defaultValue: string
    aiContext?: string // Hint for the text generator
}

export const LAYOUTS_BY_INTENT: Partial<Record<IntentCategory, LayoutOption[]>> = {

    cita: [
        {
            id: 'cita-minimal',
            name: 'Minimalista',
            description: 'Texto Limpio',
            svgIcon: 'AlignLeft',
            textZone: 'center',
            promptInstruction: 'Ultra-minimal layout with centered text.',
            structuralPrompt: CITA_MINIMAL_PROMPT,
        },
        {
            id: 'cita-portrait',
            name: 'Testimonio',
            description: 'Foto + Cita',
            svgIcon: 'User',
            textZone: 'right',
            promptInstruction: 'Quote with author portrait.',
            structuralPrompt: CITA_RETRATO_PROMPT,
        },
        {
            id: 'cita-typo',
            name: 'Tipografía',
            description: 'Letras Grandes',
            svgIcon: 'Type',
            textZone: 'center',
            promptInstruction: 'Typography as the main visual element.',
            structuralPrompt: CITA_TIPOGRAFIA_PROMPT,
        },
        {
            id: 'cita-frame',
            name: 'Marco',
            description: 'Enmarcado',
            svgIcon: 'Frame', // Assuming Frame exists or similar
            textZone: 'center',
            promptInstruction: 'Quote inside an elegant border.',
            structuralPrompt: CITA_MARCO_PROMPT,
        },
        {
            id: 'cita-texture',
            name: 'Textura',
            description: 'Orgánico',
            svgIcon: 'Image',
            textZone: 'center',
            promptInstruction: 'Quote on textured background.',
            structuralPrompt: CITA_TEXTURA_PROMPT,
        },
        {
            id: 'cita-split',
            name: 'Split',
            description: 'Imagen/Texto',
            svgIcon: 'SplitHorizontal',
            textZone: 'right',
            promptInstruction: 'Half image, half quote text.',
            structuralPrompt: CITA_DIVIDIDO_PROMPT,
        },
        {
            id: 'cita-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    equipo: [
        {
            id: 'equipo-portrait',
            name: 'Retrato',
            description: 'Perfil Profesional',
            svgIcon: 'User',
            textZone: 'bottom',
            promptInstruction: 'Professional hero portrait of team member.',
            structuralPrompt: EQUIPO_RETRATO_PROMPT,
        },
        {
            id: 'equipo-group',
            name: 'Grupo',
            description: 'Foto de Equipo',
            svgIcon: 'Users',
            textZone: 'bottom',
            promptInstruction: 'Wide group shot of the team.',
            structuralPrompt: EQUIPO_GRUPO_PROMPT,
        },
        {
            id: 'equipo-collage',
            name: 'Full',
            description: 'Grid Caras',
            svgIcon: 'Grid',
            textZone: 'center',
            promptInstruction: 'Collage grid of team members.',
            structuralPrompt: EQUIPO_MOSAICO_PROMPT,
        },
        {
            id: 'equipo-quote',
            name: 'Spotlight',
            description: 'Foto + Cita',
            svgIcon: 'MessageSquare',
            textZone: 'right',
            promptInstruction: 'Employee profile with a quote.',
            structuralPrompt: EQUIPO_TESTIMONIO_PROMPT,
        },
        {
            id: 'equipo-action',
            name: 'Acción',
            description: 'BTS Candid',
            svgIcon: 'Camera',
            textZone: 'bottom',
            promptInstruction: 'Candid action shot of working.',
            structuralPrompt: EQUIPO_ACCION_PROMPT,
        },
        {
            id: 'equipo-minimal',
            name: 'Ficha',
            description: 'Minimalista',
            svgIcon: 'CreditCard',
            textZone: 'center',
            promptInstruction: 'Clean ID card style profile.',
            structuralPrompt: EQUIPO_TARJETA_PROMPT,
        },
        {
            id: 'equipo-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    logro: [
        {
            id: 'logro-number',
            name: 'Cifra',
            description: 'Dato Gigante',
            svgIcon: 'Hash',
            textZone: 'bottom',
            promptInstruction: 'Huge centralized metric or number.',
            structuralPrompt: LOGRO_NUMERO_PROMPT,
        },
        {
            id: 'logro-trophy',
            name: 'Trofeo',
            description: 'Premio 3D',
            svgIcon: 'Award',
            textZone: 'bottom',
            promptInstruction: 'Trophy or medal in spotlight.',
            structuralPrompt: LOGRO_TROFEO_PROMPT,
        },
        {
            id: 'logro-confetti',
            name: 'Fiesta',
            description: 'Confetti',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Festive explosion with confetti.',
            structuralPrompt: LOGRO_CONFETI_PROMPT,
        },
        {
            id: 'logro-team',
            name: 'Grupo',
            description: 'Celebración',
            svgIcon: 'Users',
            textZone: 'bottom',
            promptInstruction: 'Team celebrating success.',
            structuralPrompt: LOGRO_EQUIPO_PROMPT,
        },
        {
            id: 'logro-premium',
            name: 'Certificado',
            description: 'Sello Lujo',
            svgIcon: 'Award', // Using Award again or similar
            textZone: 'center',
            promptInstruction: 'Luxury seal or certificate style.',
            structuralPrompt: LOGRO_SELLO_PROMPT,
        },
        {
            id: 'logro-journey',
            name: 'Hito',
            description: 'Timeline',
            svgIcon: 'MapPin',
            textZone: 'left',
            promptInstruction: 'Milestone on a path or timeline.',
            structuralPrompt: LOGRO_CAMINO_PROMPT,
        },
        {
            id: 'logro-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    lanzamiento: [
        {
            id: 'lanzamiento-countdown',
            name: 'Cuenta',
            description: 'Timer 03:00',
            svgIcon: 'Timer',
            textZone: 'center',
            promptInstruction: 'Massive countdown timer digits.',
            structuralPrompt: LANZAMIENTO_COUNTDOWN_PROMPT,
        },
        {
            id: 'lanzamiento-reveal',
            name: 'Revelación',
            description: 'Cortina/Humo',
            svgIcon: 'Eye',
            textZone: 'center',
            promptInstruction: 'Product emerging from smoke or curtain.',
            structuralPrompt: LANZAMIENTO_CORTINA_PROMPT,
        },
        {
            id: 'lanzamiento-silhouette',
            name: 'Silueta',
            description: 'Misterio Backlit',
            svgIcon: 'Moon',
            textZone: 'center',
            promptInstruction: 'Backlit silhouette of the product.',
            structuralPrompt: LANZAMIENTO_SILUETA_PROMPT,
        },
        {
            id: 'lanzamiento-glitch',
            name: 'Glitch Tech',
            description: 'Distorsión Digital',
            svgIcon: 'Activity',
            textZone: 'center',
            promptInstruction: 'Cyberpunk glitch style reveal.',
            structuralPrompt: LANZAMIENTO_GLITCH_PROMPT,
        },
        {
            id: 'lanzamiento-torn',
            name: 'Rasgado',
            description: 'Teaser',
            svgIcon: 'FileMinus',
            textZone: 'center',
            promptInstruction: 'Ripped paper revealing content inside.',
            structuralPrompt: LANZAMIENTO_RASGADO_PROMPT,
        },
        {
            id: 'lanzamiento-calendar',
            name: 'Fecha',
            description: 'Calendario 3D',
            svgIcon: 'Calendar',
            textZone: 'center',
            promptInstruction: 'Floating 3D calendar page.',
            structuralPrompt: LANZAMIENTO_CALENDARIO_PROMPT,
        },
        {
            id: 'lanzamiento-apertura',
            name: 'Apertura',
            description: 'Unboxing',
            svgIcon: 'PackageOpen',
            textZone: 'center',
            promptInstruction: 'Box partially opening with inner glow.',
            structuralPrompt: LANZAMIENTO_APERTURA_PROMPT,
        },
        {
            id: 'lanzamiento-blur',
            name: 'Blur',
            description: 'Desenfocado',
            svgIcon: 'Cloud',
            textZone: 'center',
            promptInstruction: 'Heavily blurred object coming into focus.',
            structuralPrompt: LANZAMIENTO_BLUR_PROMPT,
        },
        {
            id: 'lanzamiento-fragmentado',
            name: 'Puzzle',
            description: 'Piezas',
            svgIcon: 'Puzzle',
            textZone: 'center',
            promptInstruction: 'Object fragmented into flying pieces.',
            structuralPrompt: LANZAMIENTO_FRAGMENTADO_PROMPT,
        },
        {
            id: 'lanzamiento-espiral',
            name: 'Vórtice',
            description: 'Energía',
            svgIcon: 'Tornado',
            textZone: 'center',
            promptInstruction: 'Energy vortex spiraling around center.',
            structuralPrompt: LANZAMIENTO_ESPIRAL_PROMPT,
        },
        {
            id: 'lanzamiento-misterio',
            name: 'Misterio',
            description: 'Incógnita',
            svgIcon: 'HelpCircle',
            textZone: 'center',
            promptInstruction: 'Giant question mark as hero.',
            structuralPrompt: LANZAMIENTO_MISTERIO_PROMPT,
        },
        {
            id: 'lanzamiento-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    reto: [
        {
            id: 'reto-vs',
            name: 'Versus',
            description: 'Batalla',
            svgIcon: 'Swords',
            textZone: 'center',
            promptInstruction: 'Diagonal split screen battle.',
            structuralPrompt: RETO_VERSUS_PROMPT,
        },
        {
            id: 'reto-giveaway',
            name: 'Sorteo',
            description: 'Premio 3D',
            svgIcon: 'Gift',
            textZone: 'center',
            promptInstruction: 'Floating 3D prize hero shot.',
            structuralPrompt: RETO_SORTEO_PROMPT,
        },
        {
            id: 'reto-bracket',
            name: 'Torneo',
            description: 'Bracket Tree',
            svgIcon: 'Trophy',
            textZone: 'center',
            promptInstruction: 'Tournament bracket structure.',
            structuralPrompt: RETO_BRACKET_PROMPT,
        },
        {
            id: 'reto-dare',
            name: 'Reto',
            description: 'Tipografía Bold',
            svgIcon: 'AlertOctagon',
            textZone: 'center',
            promptInstruction: 'Aggressive dare typography.',
            structuralPrompt: RETO_ATREVETE_PROMPT,
        },
        {
            id: 'reto-podium',
            name: 'Ganadores',
            description: 'Podio 1-2-3',
            svgIcon: 'Medal',
            textZone: 'bottom',
            promptInstruction: 'Three-tiered winner podium.',
            structuralPrompt: RETO_PODIO_PROMPT,
        },
        {
            id: 'reto-rules',
            name: 'Reglas',
            description: 'Pasos 1-2-3',
            svgIcon: 'ListChecks',
            textZone: 'left',
            promptInstruction: 'Step-by-step contest rules.',
            structuralPrompt: RETO_REGLAS_PROMPT,
        },
        {
            id: 'reto-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    servicio: [
        {
            id: 'servicio-grid',
            name: 'Grid',
            description: 'Bento Cards',
            svgIcon: 'Grid',
            textZone: 'center',
            promptInstruction: 'Structured 2x2 grid of features.',
            structuralPrompt: SERVICIO_GRID_PROMPT,
        },
        {
            id: 'servicio-benefit',
            name: 'Foco',
            description: 'Hero Outcome',
            svgIcon: 'Heart',
            textZone: 'left',
            promptInstruction: 'Visual metaphor for the key benefit.',
            structuralPrompt: SERVICIO_BENEFIT_PROMPT,
        },
        {
            id: 'servicio-pricing',
            name: 'Precios',
            description: 'Tabla 3 Col',
            svgIcon: 'CreditCard',
            textZone: 'center',
            promptInstruction: 'Three column pricing table layout.',
            structuralPrompt: SERVICIO_PRICING_PROMPT,
        },
        {
            id: 'servicio-process',
            name: 'Proceso',
            description: 'Flow 1-2-3',
            svgIcon: 'ArrowRight',
            textZone: 'bottom',
            promptInstruction: 'Horizontal process step flow.',
            structuralPrompt: SERVICIO_PROCESS_PROMPT,
        },
        {
            id: 'servicio-list',
            name: 'Lista',
            description: 'Catálogo',
            svgIcon: 'List',
            textZone: 'left',
            promptInstruction: 'Clean vertical list with icons.',
            structuralPrompt: SERVICIO_LIST_PROMPT,
        },
        {
            id: 'servicio-trust',
            name: 'Sello',
            description: 'Sello Calidad',
            svgIcon: 'ShieldCheck',
            textZone: 'center',
            promptInstruction: 'Large 3D trust badge or guarantee.',
            structuralPrompt: SERVICIO_TRUST_PROMPT,
        },
        {
            id: 'servicio-ecosystem',
            name: 'Red',
            description: 'Hub & Spoke',
            svgIcon: 'Share2',
            textZone: 'center',
            promptInstruction: 'Central hub with connected spokes.',
            structuralPrompt: SERVICIO_ECOSYSTEM_PROMPT,
        },
        {
            id: 'servicio-stat',
            name: 'Dato',
            description: 'Cifra Gigante',
            svgIcon: 'BarChart2', // or PieChart
            textZone: 'center',
            promptInstruction: 'Massive typographic statistic display.',
            structuralPrompt: SERVICIO_STAT_PROMPT,
        },
        {
            id: 'servicio-minimal',
            name: 'Objeto',
            description: 'Pedestal',
            svgIcon: 'Box',
            textZone: 'center',
            promptInstruction: 'Abstract object on a clean pedestal.',
            structuralPrompt: SERVICIO_MINIMAL_PROMPT,
        },

        {
            id: 'servicio-interaction',
            name: 'Trato',
            description: 'Interacción Humana',
            svgIcon: 'Users',
            textZone: 'center',
            promptInstruction: 'Professional human interaction and consultation.',
            structuralPrompt: SERVICIO_INTERACTION_PROMPT,
        },
        {
            id: 'servicio-workshop',
            name: 'Taller',
            description: 'Knolling / Proceso',
            svgIcon: 'Wrench', // or Hammer, or PenTool
            textZone: 'center',
            promptInstruction: 'Organized tools and workspace focus.',
            structuralPrompt: SERVICIO_WORKSHOP_PROMPT,
        },
        {
            id: 'servicio-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    talento: [
        {
            id: 'talento-hiring',
            name: 'Hiring',
            description: 'Post Reclutamiento',
            svgIcon: 'Briefcase',
            textZone: 'center',
            promptInstruction: 'Bold hiring announcement poster.',
            structuralPrompt: TALENTO_CONTRATANDO_PROMPT,
        },
        {
            id: 'talento-culture',
            name: 'Cultura',
            description: 'Grid Equipo',
            svgIcon: 'Smile',
            textZone: 'center',
            promptInstruction: 'Fun team culture photo grid.',
            structuralPrompt: TALENTO_CULTURA_PROMPT,
        },
        {
            id: 'talento-value',
            name: 'Valores',
            description: 'Palabra Clave',
            svgIcon: 'Award',
            textZone: 'center',
            promptInstruction: 'Single powerful core value word.',
            structuralPrompt: TALENTO_VALORES_PROMPT,
        },
        {
            id: 'talento-perks',
            name: 'Beneficios',
            description: 'Iconos Flotantes',
            svgIcon: 'Gift',
            textZone: 'top',
            promptInstruction: '3D icons representing perks.',
            structuralPrompt: TALENTO_BENEFICIOS_PROMPT,
        },
        {
            id: 'talento-spotlight',
            name: 'Testimonio',
            description: 'Perfil Empleado',
            svgIcon: 'UserPlus',
            textZone: 'right',
            promptInstruction: 'Employee portrait with story text.',
            structuralPrompt: TALENTO_SPOTLIGHT_PROMPT,
        },
        {
            id: 'talento-office',
            name: 'Oficina',
            description: 'Espacio Trabajo',
            svgIcon: 'MapPin',
            textZone: 'overlay',
            promptInstruction: 'Atmospheric office space shot.',
            structuralPrompt: TALENTO_OFICINA_PROMPT,
        },
        {
            id: 'talento-equipo',
            name: 'Equipo',
            description: 'Foto Grupal',
            svgIcon: 'Users',
            textZone: 'bottom',
            promptInstruction: 'Wide angle team group photo.',
            structuralPrompt: TALENTO_EQUIPO_PROMPT,
        },
        {
            id: 'talento-remoto',
            name: 'Remoto',
            description: 'Lifestyle',
            svgIcon: 'Laptop',
            textZone: 'center',
            promptInstruction: 'Remote work lifestyle setting.',
            structuralPrompt: TALENTO_REMOTO_PROMPT,
        },
        {
            id: 'talento-crecimiento',
            name: 'Crecimiento',
            description: 'Escalera/Metáfora',
            svgIcon: 'TrendingUp',
            textZone: 'center',
            promptInstruction: 'Growth metaphor like stairs or mountain.',
            structuralPrompt: TALENTO_CRECIMIENTO_PROMPT,
        },
        {
            id: 'talento-vacante',
            name: 'Vacante',
            description: 'Ficha Puesto',
            svgIcon: 'FileText',
            textZone: 'center',
            promptInstruction: 'Job details card layout.',
            structuralPrompt: TALENTO_VACANTE_PROMPT,
        },
        {
            id: 'talento-diversidad',
            name: 'Diversidad',
            description: 'Inclusión',
            svgIcon: 'Heart',
            textZone: 'center',
            promptInstruction: 'Inclusive diverse team representation.',
            structuralPrompt: TALENTO_DIVERSIDAD_PROMPT,
        },
        {
            id: 'talento-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    definicion: [
        {
            id: 'def-classic',
            name: 'Diccionario',
            description: 'Clásico Serif',
            svgIcon: 'Book',
            textZone: 'top',
            promptInstruction: 'Classic elegant dictionary entry.',
            structuralPrompt: DEFINICION_CLASICO_PROMPT,
        },
        {
            id: 'def-minimal',
            name: 'Minimal',
            description: 'Impacto Visual',
            svgIcon: 'Type',
            textZone: 'center',
            promptInstruction: 'Massive typography, minimal style.',
            structuralPrompt: DEFINICION_MINIMALISTA_PROMPT,
        },
        {
            id: 'def-map',
            name: 'Mapa',
            description: 'Conexiones',
            svgIcon: 'GitBranch',
            textZone: 'center',
            promptInstruction: 'Mind map connecting concepts.',
            structuralPrompt: DEFINICION_MAPA_PROMPT,
        },
        {
            id: 'def-encyclopedia',
            name: 'Enciclopedia',
            description: 'Académico',
            svgIcon: 'Library',
            textZone: 'right',
            promptInstruction: 'Vintage encyclopedia layout.',
            structuralPrompt: DEFINICION_ENCICLOPEDIA_PROMPT,
        },
        {
            id: 'def-urban',
            name: 'Urbano',
            description: 'Sticker Style',
            svgIcon: 'Tag',
            textZone: 'center',
            promptInstruction: 'Street style sticker definition.',
            structuralPrompt: DEFINICION_URBANO_PROMPT,
        },
        {
            id: 'def-tech',
            name: 'Código',
            description: 'Tech/Dev',
            svgIcon: 'Code',
            textZone: 'center',
            promptInstruction: 'Code editor syntax definition.',
            structuralPrompt: DEFINICION_TECH_PROMPT,
        },
        {
            id: 'def-neon',
            name: 'Neon',
            description: 'Letrero',
            svgIcon: 'Zap',
            textZone: 'center',
            promptInstruction: 'Glowing neon sign typography.',
            structuralPrompt: DEFINICION_NEON_PROMPT,
        },
        {
            id: 'def-tarjeta',
            name: 'Tarjeta',
            description: 'Flashcard',
            svgIcon: 'Copy',
            textZone: 'center',
            promptInstruction: 'Study flashcard design.',
            structuralPrompt: DEFINICION_TARJETA_PROMPT,
        },
        {
            id: 'def-ilustrado',
            name: 'Ilustrado',
            description: 'Metáfora',
            svgIcon: 'PenTool',
            textZone: 'center',
            promptInstruction: 'Visual metaphor illustration.',
            structuralPrompt: DEFINICION_ILUSTRADO_PROMPT,
        },
        {
            id: 'def-versus',
            name: 'Versus',
            description: 'Comparativa',
            svgIcon: 'SplitHorizontal',
            textZone: 'center',
            promptInstruction: 'Term comparison split screen.',
            structuralPrompt: DEFINICION_VERSUS_PROMPT,
        },
        {
            id: 'def-emoji',
            name: 'Emoji',
            description: 'Icono Moderno',
            svgIcon: 'Smile',
            textZone: 'center',
            promptInstruction: 'Large emoji visual dictionary.',
            structuralPrompt: DEFINICION_EMOJI_PROMPT,
        },
        {
            id: 'definicion-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    efemeride: [
        {
            id: 'efemeride-calendar',
            name: 'Calendario',
            description: 'Hoja Clásica',
            svgIcon: 'Calendar',
            textZone: 'center',
            promptInstruction: 'Classic tear-off calendar page.',
            structuralPrompt: EFEMERIDE_CALENDARIO_PROMPT,
        },
        {
            id: 'efemeride-hero',
            name: 'Fecha',
            description: 'Tipografía',
            svgIcon: 'Hash',
            textZone: 'center',
            promptInstruction: 'Giant date numbers 3D typography.',
            structuralPrompt: EFEMERIDE_TIPOGRAFIA_PROMPT,
        },
        {
            id: 'efemeride-party',
            name: 'Fiesta',
            description: 'Confetti',
            svgIcon: 'PartyPopper',
            textZone: 'center',
            promptInstruction: 'Explosion of confetti and balloons.',
            structuralPrompt: EFEMERIDE_FIESTA_PROMPT,
        },
        {
            id: 'efemeride-history',
            name: 'Historia',
            description: 'Vintage',
            svgIcon: 'Clock',
            textZone: 'bottom',
            promptInstruction: 'Antique frame with historical feel.',
            structuralPrompt: EFEMERIDE_HISTORICO_PROMPT,
        },
        {
            id: 'efemeride-neon',
            name: 'Neon',
            description: 'Noche',
            svgIcon: 'Zap',
            textZone: 'center',
            promptInstruction: 'Glowing neon sign date.',
            structuralPrompt: EFEMERIDE_NEON_PROMPT,
        },
        {
            id: 'efemeride-seasonal',
            name: 'Estación',
            description: 'Naturaleza',
            svgIcon: 'Sun',
            textZone: 'center',
            promptInstruction: 'Floral or seasonal border frame.',
            structuralPrompt: EFEMERIDE_ESTACIONAL_PROMPT,
        },
        {
            id: 'efemeride-bandera',
            name: 'Bandera',
            description: 'Patriótico',
            svgIcon: 'Flag',
            textZone: 'center',
            promptInstruction: 'National flag waving background.',
            structuralPrompt: EFEMERIDE_BANDERA_PROMPT,
        },
        {
            id: 'efemeride-religioso',
            name: 'Religioso',
            description: 'Solemne',
            svgIcon: 'Moon', // Using Moon as proxy for religious symbol
            textZone: 'center',
            promptInstruction: 'Sacred or religious iconography.',
            structuralPrompt: EFEMERIDE_RELIGIOSO_PROMPT,
        },
        {
            id: 'efemeride-countdown',
            name: 'Cuenta',
            description: 'Días Para...',
            svgIcon: 'Timer',
            textZone: 'center',
            promptInstruction: 'Days remaining countdown.',
            structuralPrompt: EFEMERIDE_COUNTDOWN_PROMPT,
        },
        {
            id: 'efemeride-collage',
            name: 'Collage',
            description: 'Recuerdos',
            svgIcon: 'Layout',
            textZone: 'center',
            promptInstruction: 'Photo collage of past events.',
            structuralPrompt: EFEMERIDE_COLLAGE_PROMPT,
        },
        {
            id: 'efemeride-mensaje',
            name: 'Carta',
            description: 'Saludo',
            svgIcon: 'Mail',
            textZone: 'center',
            promptInstruction: 'Simple elegant greeting card.',
            structuralPrompt: EFEMERIDE_MENSAJE_PROMPT,
        },
        {
            id: 'efemeride-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    pasos: [
        {
            id: 'pasos-zigzag',
            name: 'ZigZag',
            description: 'Camino Sinuoso',
            svgIcon: 'TrendingUp',
            textZone: 'center',
            promptInstruction: 'Winding path with numbered steps.',
            structuralPrompt: PASOS_ZIGZAG_PROMPT,
        },
        {
            id: 'pasos-carousel',
            name: 'Carrusel',
            description: 'Tarjetas Pasos',
            svgIcon: 'Copy',
            textZone: 'bottom',
            promptInstruction: 'Horizontal row of step cards.',
            structuralPrompt: PASOS_TARJETAS_PROMPT,
        },
        {
            id: 'pasos-split',
            name: 'Guía',
            description: 'Foto + Lista',
            svgIcon: 'Layout',
            textZone: 'right',
            promptInstruction: 'Split screen: hero image and checklist.',
            structuralPrompt: PASOS_DIVIDIDO_PROMPT,
        },
        {
            id: 'pasos-floating',
            name: 'Pasos3D',
            description: 'Números 3D',
            svgIcon: 'Layers',
            textZone: 'center',
            promptInstruction: 'Giant floating 3D numbers.',
            structuralPrompt: PASOS_FLOTANTE_PROMPT,
        },
        {
            id: 'pasos-blueprint',
            name: 'Plano',
            description: 'Técnico',
            svgIcon: 'PenTool',
            textZone: 'center',
            promptInstruction: 'Technical blueprint schematic.',
            structuralPrompt: PASOS_PLANO_PROMPT,
        },
        {
            id: 'pasos-timeline',
            name: 'Timeline',
            description: 'Vertical',
            svgIcon: 'MoreVertical',
            textZone: 'left',
            promptInstruction: 'Vertical timeline progress.',
            structuralPrompt: PASOS_VERTICAL_PROMPT,
        },
        {
            id: 'pasos-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    bts: [
        {
            id: 'bts-wip',
            name: 'Proceso',
            description: 'Work in Progress',
            svgIcon: 'Tool',
            textZone: 'center',
            promptInstruction: 'Macro shot of tools and unfinished work.',
            structuralPrompt: BTS_PROCESO_PROMPT,
        },
        {
            id: 'bts-desk',
            name: 'Escritorio',
            description: 'Workspace',
            svgIcon: 'Coffee',
            textZone: 'center',
            promptInstruction: 'Creative desk setup with scattered items.',
            structuralPrompt: BTS_ESCRITORIO_PROMPT,
        },
        {
            id: 'bts-moodboard',
            name: 'Inspiración',
            description: 'Moodboard',
            svgIcon: 'Grid',
            textZone: 'center',
            promptInstruction: 'Wall covered in inspiration prints.',
            structuralPrompt: BTS_MOODBOARD_PROMPT,
        },
        {
            id: 'bts-sketch',
            name: 'Boceto',
            description: 'Sketch/Real',
            svgIcon: 'Edit2',
            textZone: 'center',
            promptInstruction: 'Split screen sketch vs final.',
            structuralPrompt: BTS_BOCETO_PROMPT,
        },
        {
            id: 'bts-before',
            name: 'Antes/Después',
            description: 'Evolución',
            svgIcon: 'RefreshCw',
            textZone: 'bottom',
            promptInstruction: 'Transformation before and after.',
            structuralPrompt: BTS_EVOLUCION_PROMPT,
        },
        {
            id: 'bts-palette',
            name: 'Paleta',
            description: 'Colores',
            svgIcon: 'Droplet',
            textZone: 'bottom',
            promptInstruction: 'Image with extracted color swatches.',
            structuralPrompt: BTS_PALETA_PROMPT,
        },
        {
            id: 'bts-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    catalogo: [
        {
            id: 'catalogo-grid',
            name: 'Grid',
            description: 'Producto 2x2',
            svgIcon: 'Grid2x2',
            textZone: 'bottom',
            promptInstruction: 'Structured 2x2 product grid.',
            structuralPrompt: CATALOGO_REJILLA_PROMPT,
        },
        {
            id: 'catalogo-lookbook',
            name: 'Lookbook',
            description: 'Editorial',
            svgIcon: 'BookOpen',
            textZone: 'center',
            promptInstruction: 'Editorial lookbook spread.',
            structuralPrompt: CATALOGO_EDITORIAL_PROMPT,
        },
        {
            id: 'catalogo-masonry',
            name: 'Mosaico',
            description: 'Collage',
            svgIcon: 'Layout',
            textZone: 'center',
            promptInstruction: 'Dynamic masonry collage.',
            structuralPrompt: CATALOGO_MOSAICO_PROMPT,
        },
        {
            id: 'catalogo-shelf',
            name: 'Estante',
            description: 'Retail',
            svgIcon: 'Package',
            textZone: 'center',
            promptInstruction: 'Products on floating shelves.',
            structuralPrompt: CATALOGO_ESTANTERIA_PROMPT,
        },
        {
            id: 'catalogo-variants',
            name: 'Colores',
            description: 'Variantes',
            svgIcon: 'Columns',
            textZone: 'center',
            promptInstruction: 'Same product in multiple colors.',
            structuralPrompt: CATALOGO_COLORES_PROMPT,
        },
        {
            id: 'catalogo-detail',
            name: 'Detalle',
            description: 'Zoom',
            svgIcon: 'ZoomIn',
            textZone: 'center',
            promptInstruction: 'Zoom bubbles showing texture.',
            structuralPrompt: CATALOGO_DETALLE_PROMPT,
        },
        {
            id: 'catalogo-flatlay',
            name: 'Flat Lay',
            description: 'Cenital',
            svgIcon: 'Layers',
            textZone: 'center',
            promptInstruction: 'Top-down organized arrangement.',
            structuralPrompt: CATALOGO_FLATLAY_PROMPT,
        },
        {
            id: 'catalogo-comparativo',
            name: 'Vs',
            description: 'Comparativo',
            svgIcon: 'ArrowLeftRight',
            textZone: 'center',
            promptInstruction: 'Side-by-side comparison.',
            structuralPrompt: CATALOGO_COMPARATIVO_PROMPT,
        },
        {
            id: 'catalogo-carrusel',
            name: 'Carrusel',
            description: 'Preview',
            svgIcon: 'Copy',
            textZone: 'center',
            promptInstruction: 'Swipeable carousel preview.',
            structuralPrompt: CATALOGO_CARRUSEL_PROMPT,
        },
        {
            id: 'catalogo-lifestyle',
            name: 'Uso',
            description: 'En Contexto',
            svgIcon: 'Image',
            textZone: 'center',
            promptInstruction: 'Products in real use context.',
            structuralPrompt: CATALOGO_LIFESTYLE_PROMPT,
        },
        {
            id: 'catalogo-hero',
            name: 'Hero',
            description: 'Destacado',
            svgIcon: 'Star',
            textZone: 'center',
            promptInstruction: 'Single hero product spotlight.',
            structuralPrompt: CATALOGO_HERO_PROMPT,
        },
        {
            id: 'catalogo-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    oferta: [
        {
            id: 'retail-classic',
            name: 'Impacto',
            description: 'Oferta estándar, texto gigante',
            svgIcon: 'Tag',
            textZone: 'center',
            promptInstruction: 'Classic high-impact retail sale poster. Huge text.',
            structuralPrompt: OFERTA_IMPACTO_PROMPT,
        },
        {
            id: 'flash-sale',
            name: 'Flash',
            description: 'Energía y velocidad alta',
            svgIcon: 'Zap',
            textZone: 'center',
            promptInstruction: 'Dynamic diagonal composition with lightning or speed lines.',
            structuralPrompt: OFERTA_FLASH_PROMPT,
        },
        {
            id: 'minimal-lux',
            name: 'Minimal',
            description: 'Sofisticado y limpio',
            svgIcon: 'Sparkles',
            textZone: 'bottom',
            promptInstruction: 'Elegant, ample whitespace, small dignified typography.',
            structuralPrompt: OFERTA_ELEGANTE_PROMPT,
        },
        {
            id: 'bundle-grid',
            name: 'Pack',
            description: 'Colección o 2x1',
            svgIcon: 'Grid2x2',
            textZone: 'center',
            promptInstruction: 'Grid layout showing multiple products or a bundle.',
            structuralPrompt: OFERTA_BUNDLE_PROMPT,
        },
        {
            id: 'urgency-time',
            name: 'Urgencia',
            description: 'Cuenta atrás, alerta',
            svgIcon: 'Clock',
            textZone: 'bottom',
            promptInstruction: 'Alarming urgency, red tones, time-sensitive graphics.',
            structuralPrompt: OFERTA_COUNTDOWN_PROMPT,
        },
        {
            id: 'seasonal-deco',
            name: 'Temático',
            description: 'Decoración de temporada',
            svgIcon: 'Flower2',
            textZone: 'overlay',
            promptInstruction: 'Seasonal decorations framing the product.',
            structuralPrompt: OFERTA_ESTACIONAL_PROMPT,
        },
        {
            id: 'oferta-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    escaparate: [
        {
            id: 'escaparate-estudio',
            name: 'Estudio',
            description: 'Fotografía clásica',
            svgIcon: 'Target',
            textZone: 'bottom',
            promptInstruction: 'Classic studio hero shot with infinite sweep background.',
            structuralPrompt: ESCAPARATE_ESTUDIO_PROMPT,
        },
        {
            id: 'escaparate-podio',
            name: 'Podio',
            description: 'Pedestal elegante',
            svgIcon: 'Box',
            textZone: 'bottom',
            promptInstruction: 'Product elevated on geometric podium with thematic props.',
            structuralPrompt: ESCAPARATE_PODIO_PROMPT,
        },
        {
            id: 'escaparate-flotante',
            name: 'Flotante',
            description: 'Levitación mágica',
            svgIcon: 'Sparkles',
            textZone: 'bottom',
            promptInstruction: 'Product levitating in mid-air with ethereal atmosphere.',
            structuralPrompt: ESCAPARATE_FLOTANTE_PROMPT,
        },
        {
            id: 'escaparate-contexto',
            name: 'Contexto',
            description: 'Lifestyle real',
            svgIcon: 'Image',
            textZone: 'bottom-left',
            promptInstruction: 'Product naturally integrated into real-world setting.',
            structuralPrompt: ESCAPARATE_CONTEXTO_PROMPT,
        },
        {
            id: 'escaparate-macro',
            name: 'Macro',
            description: 'Detalle extremo',
            svgIcon: 'Target',
            textZone: 'right',
            promptInstruction: 'Extreme close-up of product texture and craftsmanship.',
            structuralPrompt: ESCAPARATE_MACRO_PROMPT,
        },
        {
            id: 'escaparate-splash',
            name: 'Splash',
            description: 'Movimiento dinámico',
            svgIcon: 'Activity',
            textZone: 'overlay',
            promptInstruction: 'Dynamic motion freeze with splashes and particles.',
            structuralPrompt: ESCAPARATE_SPLASH_PROMPT,
        },
        {
            id: 'escaparate-espejo',
            name: 'Espejo',
            description: 'Reflejo dramático',
            svgIcon: 'Frame',
            textZone: 'bottom',
            promptInstruction: 'Mirror reflection composition on glossy surface.',
            structuralPrompt: ESCAPARATE_ESPEJO_PROMPT,
        },
        {
            id: 'escaparate-capas',
            name: 'Capas',
            description: 'Profundidad en capas',
            svgIcon: 'Rows2',
            textZone: 'center',
            promptInstruction: 'Layered depth arrangement with foreground and background blur.',
            structuralPrompt: ESCAPARATE_CAPAS_PROMPT,
        },
        {
            id: 'escaparate-flat',
            name: 'Flat',
            description: 'Vista cenital',
            svgIcon: 'Grid2x2',
            textZone: 'bottom',
            promptInstruction: 'Top-down flat lay with knolling organization.',
            structuralPrompt: ESCAPARATE_FLAT_PROMPT,
        },
        {
            id: 'escaparate-silueta',
            name: 'Silueta',
            description: 'Contraluz artístico',
            svgIcon: 'Star',
            textZone: 'overlay',
            promptInstruction: 'Dramatic backlit silhouette with rim lighting.',
            structuralPrompt: ESCAPARATE_SILUETA_PROMPT,
        },
        {
            id: 'escaparate-pack',
            name: 'Pack',
            description: 'Familia de productos',
            svgIcon: 'Layout',
            textZone: 'bottom',
            promptInstruction: 'Product family collection display with hierarchy.',
            structuralPrompt: ESCAPARATE_PACK_PROMPT,
        },
        {
            id: 'escaparate-libre',
            name: 'Libre',
            description: 'Sin restricciones',
            svgIcon: 'Zap',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    comunicado: [
        {
            id: 'comunicado-oficial',
            name: 'Oficial',
            description: 'Autoridad y Claridad',
            svgIcon: 'FileText',
            textZone: 'center',
            promptInstruction: 'Official announcement layout with maximum readability.',
            structuralPrompt: COMUNICADO_OFICIAL_PROMPT,
            referenceImageDescription: COMUNICADO_DESCRIPTION,
            textFields: [
                { id: 'announcement_title', label: 'Título', placeholder: 'Cambio de Horario', defaultValue: '', aiContext: 'Main announcement headline' },
                { id: 'announcement_body', label: 'Contenido', placeholder: 'Detalla aquí el mensaje...', defaultValue: '', aiContext: 'Full announcement text' },
                { id: 'effective_date', label: 'Fecha/Pie', placeholder: 'A partir del 15 de enero', defaultValue: '', aiContext: 'When it takes effect' },
            ]
        },
        {
            id: 'comunicado-urgent',
            name: 'Urgente / Alerta',
            description: 'Alta Visibilidad',
            svgIcon: 'AlertTriangle',
            textZone: 'center',
            promptInstruction: 'Horizontal or bold alert layout with high contrast.',
            structuralPrompt: COMUNICADO_URGENTE_PROMPT,
        },
        {
            id: 'comunicado-modern',
            name: 'Moderno',
            description: 'Asimétrico Tech',
            svgIcon: 'LayoutTemplate',
            textZone: 'right',
            promptInstruction: 'Asymmetric modern layout with geometric masks.',
            structuralPrompt: COMUNICADO_MODERNO_PROMPT,
        },
        {
            id: 'comunicado-editorial',
            name: 'Editorial',
            description: 'Foco Tipográfico',
            svgIcon: 'MessageSquareQuote',
            textZone: 'center',
            promptInstruction: 'Typography focused layout for short impactful messages.',
            structuralPrompt: COMUNICADO_EDITORIAL_PROMPT,
        },
        {
            id: 'comunicado-community',
            name: 'Comunidad',
            description: 'Cercano y Humano',
            svgIcon: 'Users',
            textZone: 'left',
            promptInstruction: 'Warm, human-centric layout with soft shapes.',
            structuralPrompt: COMUNICADO_COMUNIDAD_PROMPT,
        },
        {
            id: 'comunicado-minimal',
            name: 'Minimal',
            description: 'Puro Estilo Suizo',
            svgIcon: 'MinusSquare',
            textZone: 'center',
            promptInstruction: 'Stark, minimal layout with rigid grid.',
            structuralPrompt: COMUNICADO_MINIMAL_PROMPT,
        },
        {
            id: 'comunicado-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    pregunta: [
        {
            id: 'pregunta-big',
            name: 'Texto',
            description: 'Impacto Puro',
            svgIcon: 'Type',
            textZone: 'center',
            promptInstruction: 'Huge typography question layout.',
            structuralPrompt: PREGUNTA_IMPACTO_PROMPT,
        },
        {
            id: 'pregunta-poll',
            name: 'Encuesta',
            description: 'Comparativo',
            svgIcon: 'GitCompare',
            textZone: 'center',
            promptInstruction: 'Split screen vs layout for polling.',
            structuralPrompt: PREGUNTA_ENCUESTA_PROMPT,
        },
        {
            id: 'pregunta-conversation',
            name: 'Chat',
            description: 'Chat / Social',
            svgIcon: 'MessageCircle',
            textZone: 'center',
            promptInstruction: 'Chat bubble style conversation layout.',
            structuralPrompt: PREGUNTA_CHAT_PROMPT,
        },
        {
            id: 'pregunta-quiz',
            name: 'Quiz',
            description: 'Opciones GRID',
            svgIcon: 'Grid',
            textZone: 'center',
            promptInstruction: 'Grid layout for multiple choice quiz.',
            structuralPrompt: PREGUNTA_QUIZ_PROMPT,
        },
        {
            id: 'pregunta-debate',
            name: 'Debate',
            description: 'Opinión Seria',
            svgIcon: 'Users',
            textZone: 'left',
            promptInstruction: 'Editorial debate layout with controversy.',
            structuralPrompt: PREGUNTA_DEBATE_PROMPT,
        },
        {
            id: 'pregunta-thought',
            name: 'Idea',
            description: 'Abstracto',
            svgIcon: 'Cloud',
            textZone: 'center',
            promptInstruction: 'Abstract thought bubble layout.',
            structuralPrompt: PREGUNTA_PENSAMIENTO_PROMPT,
        },
        {
            id: 'pregunta-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    dato: [
        {
            id: 'dato-big',
            name: 'Dato',
            description: 'Número Gigante',
            svgIcon: 'Hash',
            textZone: 'center',
            promptInstruction: 'Layout focusing on a single massive number.',
            structuralPrompt: DATO_HEROE_PROMPT,
        },
        {
            id: 'dato-comparison',
            name: 'Comparativa',
            description: 'Barras / VS',
            svgIcon: 'BarChart2',
            textZone: 'center',
            promptInstruction: 'Comparison layout with charts or side-by-side.',
            structuralPrompt: DATO_COMPARACION_PROMPT,
        },
        {
            id: 'dato-process',
            name: 'Proceso',
            description: 'Pasos 1-2-3',
            svgIcon: 'ListOrdered',
            textZone: 'left',
            promptInstruction: 'Step-by-step process flow layout.',
            structuralPrompt: DATO_PROCESO_PROMPT,
        },
        {
            id: 'dato-infographic',
            name: 'Info',
            description: 'Grid de Datos',
            svgIcon: 'LayoutGrid',
            textZone: 'center',
            promptInstruction: 'Structured grid infographic layout.',
            structuralPrompt: DATO_REJILLA_PROMPT,
        },
        {
            id: 'dato-metric',
            name: 'Métrica',
            description: 'Dashboard Card',
            svgIcon: 'Activity',
            textZone: 'center',
            promptInstruction: 'UI Card style for key performance metric.',
            structuralPrompt: DATO_CONTADOR_PROMPT,
        },
        {
            id: 'dato-pie',
            name: 'Circular',
            description: 'Porcentajes',
            svgIcon: 'PieChart',
            textZone: 'center',
            promptInstruction: 'Circular chart or ring visualization.',
            structuralPrompt: DATO_CIRCULAR_PROMPT,
        },
        {
            id: 'dato-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    evento: [
        {
            id: 'evento-conference',
            name: 'Speaker',
            description: 'Profesional / Speaker',
            svgIcon: 'Mic',
            textZone: 'right',
            promptInstruction: 'Professional conference layout with speaker focus.',
            structuralPrompt: EVENTO_CONFERENCIA_PROMPT,
        },
        {
            id: 'evento-party',
            name: 'Fiesta',
            description: 'Noche y Energía',
            svgIcon: 'Music',
            textZone: 'center',
            promptInstruction: 'High energy nightlife or concert flyer.',
            structuralPrompt: EVENTO_FIESTA_PROMPT,
        },
        {
            id: 'evento-workshop',
            name: 'Taller',
            description: 'Educativo / Curso',
            svgIcon: 'BookOpen',
            textZone: 'left',
            promptInstruction: 'Structured educational workshop layout.',
            structuralPrompt: EVENTO_TALLER_PROMPT,
        },
        {
            id: 'evento-festival',
            name: 'Festival',
            description: 'Artístico / Cultural',
            svgIcon: 'Palette',
            textZone: 'center',
            promptInstruction: 'Expressive artistic festival poster.',
            structuralPrompt: EVENTO_FESTIVAL_PROMPT,
        },
        {
            id: 'evento-networking',
            name: 'Networking',
            description: 'Tech / Meetup',
            svgIcon: 'Network',
            textZone: 'center',
            promptInstruction: 'Modern networking event with connection themes.',
            structuralPrompt: EVENTO_NETWORKING_PROMPT,
        },
        {
            id: 'evento-minimal',
            name: 'Fecha',
            description: 'Minimalista',
            svgIcon: 'Calendar',
            textZone: 'center',
            promptInstruction: 'Elegant minimal save the date layout.',
            structuralPrompt: EVENTO_RESERVA_PROMPT,
        },
        {
            id: 'evento-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    comparativa: [
        {
            id: 'comp-split',
            name: 'Dividido',
            description: '50/50',
            svgIcon: 'Split', // or Columns
            textZone: 'center',
            promptInstruction: 'Classic vertical split screen comparison.',
            structuralPrompt: COMPARATIVA_DIVIDIDO_PROMPT,
        },
        {
            id: 'comp-versus',
            name: 'Versus',
            description: 'Batalla',
            svgIcon: 'Swords',
            textZone: 'center',
            promptInstruction: 'Aggressive versus battle layout.',
            structuralPrompt: COMPARATIVA_VERSUS_PROMPT,
        },
        {
            id: 'comp-transformation',
            name: 'Antes/Después',
            description: 'Transformación',
            svgIcon: 'RefreshCw',
            textZone: 'overlay',
            promptInstruction: 'Before and after transformation showcase.',
            structuralPrompt: COMPARATIVA_TRANSFORMACION_PROMPT,
        },
        {
            id: 'comp-checklist',
            name: 'Checklist',
            description: 'Grid Vs',
            svgIcon: 'ListChecks',
            textZone: 'top',
            promptInstruction: 'Side-by-side feature comparison checklist.',
            structuralPrompt: COMPARATIVA_CHECKLIST_PROMPT,
        },
        {
            id: 'comp-slider',
            name: 'Slider',
            description: 'Interactivo',
            svgIcon: 'MoveHorizontal',
            textZone: 'center',
            promptInstruction: 'Interactive slider comparison layout.',
            structuralPrompt: COMPARATIVA_SLIDER_PROMPT,
        },
        {
            id: 'comp-evolution',
            name: 'Evolución',
            description: 'Timeline',
            svgIcon: 'TrendingUp',
            textZone: 'bottom',
            promptInstruction: 'Evolution timeline from old to new.',
            structuralPrompt: COMPARATIVA_EVOLUCION_PROMPT,
        },
        {
            id: 'comp-myth',
            name: 'Mito',
            description: 'Mito vs Realidad',
            svgIcon: 'AlertTriangle',
            textZone: 'center',
            promptInstruction: 'Myth vs Reality debunking layout.',
            structuralPrompt: COMPARATIVA_MITO_PROMPT,
        },
        {
            id: 'comp-expect',
            name: 'Expectativa',
            description: 'Humor',
            svgIcon: 'Smile',
            textZone: 'bottom',
            promptInstruction: 'Expectation vs Reality humorous contrast.',
            structuralPrompt: COMPARATIVA_EXPECTATIVA_PROMPT,
        },
        {
            id: 'comp-pricing',
            name: 'Precios',
            description: 'Tiers',
            svgIcon: 'CreditCard',
            textZone: 'center',
            promptInstruction: 'Price tier comparison table.',
            structuralPrompt: COMPARATIVA_PRECIO_PROMPT,
        },
        {
            id: 'comp-horizontal',
            name: 'Horizontal',
            description: 'Arriba/Abajo',
            svgIcon: 'Rows2',
            textZone: 'center',
            promptInstruction: 'Horizontal top/bottom split comparison.',
            structuralPrompt: COMPARATIVA_HORIZONTAL_PROMPT,
        },
        {
            id: 'comp-zoom',
            name: 'Zoom',
            description: 'Detalle',
            svgIcon: 'ZoomIn',
            textZone: 'right',
            promptInstruction: 'Zoomed detail comparison side-by-side.',
            structuralPrompt: COMPARATIVA_ZOOM_PROMPT,
        },
        {
            id: 'comp-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],
    lista: [
        {
            id: 'lista-checklist',
            name: 'Checklist',
            description: 'Productividad',
            svgIcon: 'CheckSquare',
            textZone: 'left',
            promptInstruction: 'Interactive productivity checklist UI.',
            structuralPrompt: LISTA_CHECKLIST_PROMPT,
        },
        {
            id: 'lista-ranking',
            name: 'Ranking',
            description: 'Top 5',
            svgIcon: 'Trophy',
            textZone: 'center',
            promptInstruction: 'Top ranking leaderboard layout.',
            structuralPrompt: LISTA_RANKING_PROMPT,
        },
        {
            id: 'lista-pasos',
            name: 'Pasos',
            description: 'Camino',
            svgIcon: 'Map',
            textZone: 'center',
            promptInstruction: 'Step-by-step journey path.',
            structuralPrompt: LISTA_PASOS_PROMPT,
        },
        {
            id: 'lista-rejilla',
            name: 'Rejilla',
            description: 'Colección',
            svgIcon: 'Grid',
            textZone: 'bottom',
            promptInstruction: 'Grid card collection layout.',
            structuralPrompt: LISTA_REJILLA_PROMPT,
        },
        {
            id: 'lista-timeline',
            name: 'Timeline',
            description: 'Historia',
            svgIcon: 'Clock',
            textZone: 'left',
            promptInstruction: 'Vertical timeline history.',
            structuralPrompt: LISTA_TIMELINE_PROMPT,
        },
        {
            id: 'lista-nota',
            name: 'Nota',
            description: 'Manuscrito',
            svgIcon: 'Edit3',
            textZone: 'center',
            promptInstruction: 'Handwritten note style list.',
            structuralPrompt: LISTA_NOTA_PROMPT,
        },
        {
            id: 'lista-bullets',
            name: 'Puntos',
            description: 'Clásico',
            svgIcon: 'List',
            textZone: 'left',
            promptInstruction: 'Clean bullet point list.',
            structuralPrompt: LISTA_BULLETS_PROMPT,
        },
        {
            id: 'lista-iconos',
            name: 'Iconos',
            description: 'Visual',
            svgIcon: 'Smile', // or Star using generic
            textZone: 'center',
            promptInstruction: 'Icon-led visual list.',
            structuralPrompt: LISTA_ICONOS_PROMPT,
        },
        {
            id: 'lista-carousel',
            name: 'Carrusel',
            description: 'Swipe',
            svgIcon: 'Copy',
            textZone: 'bottom',
            promptInstruction: 'Swipeable carousel preview cards.',
            structuralPrompt: LISTA_CAROUSEL_PROMPT,
        },
        {
            id: 'lista-numerado',
            name: 'Numerado',
            description: 'Bold',
            svgIcon: 'ListOrdered',
            textZone: 'left',
            promptInstruction: 'Bold numbered list layout.',
            structuralPrompt: LISTA_NUMERADO_PROMPT,
        },
        {
            id: 'lista-proscons',
            name: 'Pros/Cons',
            description: 'Balance',
            svgIcon: 'Scale',
            textZone: 'center',
            promptInstruction: 'Pros and cons split list.',
            structuralPrompt: LISTA_PROS_CONS_PROMPT,
        },
        {
            id: 'lista-free',
            name: 'Libre',
            description: 'Sin indicación',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Natural composition without structural constraints.',
            structuralPrompt: '',
        },
    ],


}

// Default layouts for intents not in the map
export const DEFAULT_LAYOUTS: LayoutOption[] = [
    { id: 'clean', name: 'Limpio', description: 'Espacio para texto', svgIcon: 'Layout', textZone: 'bottom', promptInstruction: 'Clean composition with ample negative space at bottom 25% for text overlay.' },
    { id: 'full-bleed', name: 'Full Bleed', description: 'Imagen completa', svgIcon: 'Maximize', textZone: 'overlay', promptInstruction: 'Full bleed image with semi-transparent text overlay capability.' },
    { id: 'frame', name: 'Con Marco', description: 'Borde visual', svgIcon: 'Frame', textZone: 'overlay', promptInstruction: 'Image with decorative frame or border.' },
    {
        id: 'default-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
]

// -----------------------------------------------------------------------------
// SOCIAL MEDIA FORMATS
// -----------------------------------------------------------------------------

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'whatsapp' | 'youtube'

export interface SocialFormat {
    id: string
    platform: SocialPlatform
    name: string
    aspectRatio: string // e.g., "1:1", "4:5", "9:16"
    description: string
    icon: string
}

export const SOCIAL_FORMATS: SocialFormat[] = [
    // Instagram
    {
        id: 'ig-square',
        platform: 'instagram',
        name: 'Cuadrado',
        aspectRatio: '1:1',
        description: 'Post estándar (1080x1080)',
        icon: 'Instagram'
    },
    {
        id: 'ig-landscape',
        platform: 'instagram',
        name: 'Horizontal',
        aspectRatio: '1.91:1',
        description: 'Post horizontal (1080x608)',
        icon: 'Instagram'
    },
    {
        id: 'ig-portrait',
        platform: 'instagram',
        name: 'Vertical',
        aspectRatio: '4:5',
        description: 'Feed vertical (1080x1350)',
        icon: 'Instagram'
    },
    {
        id: 'ig-story',
        platform: 'instagram',
        name: 'Story / Reel',
        aspectRatio: '9:16',
        description: 'Pantalla completa vertical',
        icon: 'Instagram'
    },
    // Facebook
    {
        id: 'fb-post',
        platform: 'facebook',
        name: 'Post Estándar',
        aspectRatio: '1.91:1',
        description: 'Optimizado para Facebook',
        icon: 'Facebook'
    },
    // LinkedIn
    {
        id: 'li-post',
        platform: 'linkedin',
        name: 'Post Profesional',
        aspectRatio: '1.2:1',
        description: 'Feed de noticias LinkedIn',
        icon: 'Linkedin'
    },
    // TikTok
    {
        id: 'tt-video',
        platform: 'tiktok',
        name: 'Video / Ad',
        aspectRatio: '9:16',
        description: 'Formato inmersivo vertical',
        icon: 'Tiktok'
    },
    // WhatsApp
    {
        id: 'wa-status',
        platform: 'whatsapp',
        name: 'Estado',
        aspectRatio: '9:16',
        description: 'Estado de WhatsApp',
        icon: 'MessageCircle'
    },
    // YouTube
    {
        id: 'yt-shorts',
        platform: 'youtube',
        name: 'Shorts',
        aspectRatio: '9:16',
        description: 'YouTube Shorts (1080x1920)',
        icon: 'Youtube'
    },
    {
        id: 'yt-video',
        platform: 'youtube',
        name: 'Video',
        aspectRatio: '16:9',
        description: 'Video Estándar (1920x1080)',
        icon: 'Youtube'
    },
    {
        id: 'yt-thumb',
        platform: 'youtube',
        name: 'Miniatura',
        aspectRatio: '16:9',
        description: 'Thumbnail (1280x720)',
        icon: 'Youtube'
    }
]

// -----------------------------------------------------------------------------
// GENERATION STATE (Global Store)
// -----------------------------------------------------------------------------

export interface GenerationState {
    // Step 0: Platform and Format
    selectedPlatform: SocialPlatform | null
    selectedFormat: string | null // SocialFormat ID

    // Step 1: Intent
    selectedGroup: IntentGroup | null
    selectedIntent: IntentCategory | null
    selectedSubMode: string | null  // For intents with sub-modes

    // Step 2: Input
    uploadedImage: string | null  // Base64 or URL
    uploadedImageFile: File | null
    selectedTheme: SeasonalTheme | null

    // Step 3:    // AI Configuration
    selectedImageModel?: string
    selectedIntelligenceModel?: string

    // Analysis
    visionAnalysis?: VisionAnalysis | null
    isAnalyzing: boolean

    // Step 4: Style
    selectedStyles: string[]  // StyleChip IDs

    // Step 5: Layout
    selectedLayout: string | null  // LayoutOption ID

    // Step 6: Branding
    selectedLogoId: string | null
    headline: string
    cta: string
    ctaUrl: string // NEW: URL for the CTA
    caption: string // NEW: Social media caption
    customTexts: Record<string, string>
    selectedBrandColors: SelectedColor[]
    rawMessage: string // User's raw message for AI to use as context
    additionalInstructions: string // Direct instructions from user
    customStyle: string // User defined custom visual style
    selectedTextAssets: TextAsset[] // Text assets for prompt (CTA, Tagline, URL, custom)

    // Image Reference Options
    imageSourceMode: 'upload' | 'brandkit' | 'generate' // Which image source is active
    selectedBrandKitImageId: string | null // ID of selected brand kit image
    aiImageDescription: string // Description for AI to generate reference image

    // Step 7: Final Format
    // (Moved to Step 0)

    // Generation
    isGenerating: boolean
    generatedImage: string | null
    error: string | null
}

export const INITIAL_GENERATION_STATE: GenerationState = {
    selectedPlatform: null, // Changed: was 'instagram'
    selectedFormat: null,   // Changed: was 'ig-square'
    selectedGroup: null,
    selectedIntent: null,
    selectedSubMode: null,
    uploadedImage: null,
    uploadedImageFile: null,
    selectedTheme: null,
    visionAnalysis: null,
    isAnalyzing: false,
    selectedStyles: [],
    selectedLayout: null,
    selectedLogoId: null,
    headline: '',
    cta: '',
    ctaUrl: '', // NEW: Init ctaUrl
    caption: '', // NEW: Init caption
    customTexts: {},
    selectedBrandColors: [],
    rawMessage: '',
    additionalInstructions: '',
    customStyle: '',
    selectedTextAssets: [],
    imageSourceMode: 'upload',
    selectedBrandKitImageId: null,
    aiImageDescription: '',
    isGenerating: false,
    generatedImage: null,
    error: null,
}
