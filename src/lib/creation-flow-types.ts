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
    OFERTA_PROMPT,
    OFERTA_FLASH_PROMPT,
    OFERTA_ELEGANT_PROMPT,
    OFERTA_BUNDLE_PROMPT,
    OFERTA_URGENCY_PROMPT,
    OFERTA_SEASONAL_PROMPT,
} from './prompts/intents/oferta'
import {
    CITA_EXTENDED_DESCRIPTION,
    CITA_REQUIRED_FIELDS,
    CITA_MINIMAL_PROMPT,
    CITA_PORTRAIT_PROMPT,
    CITA_TYPO_PROMPT,
    CITA_FRAME_PROMPT,
    CITA_TEXTURE_PROMPT,
    CITA_SPLIT_PROMPT,
    CITA_DESCRIPTION,
} from './prompts/intents/cita'
import {
    EQUIPO_EXTENDED_DESCRIPTION,
    EQUIPO_REQUIRED_FIELDS,
    EQUIPO_PORTRAIT_PROMPT,
    EQUIPO_GROUP_PROMPT,
    EQUIPO_COLLAGE_PROMPT,
    EQUIPO_QUOTE_PROMPT,
    EQUIPO_ACTION_PROMPT,
    EQUIPO_MINIMAL_PROMPT,
    EQUIPO_DESCRIPTION,
} from './prompts/intents/equipo'
import {
    LOGRO_EXTENDED_DESCRIPTION,
    LOGRO_REQUIRED_FIELDS,
    LOGRO_NUMBER_PROMPT,
    LOGRO_TROPHY_PROMPT,
    LOGRO_CONFETTI_PROMPT,
    LOGRO_TEAM_PROMPT,
    LOGRO_PREMIUM_PROMPT,
    LOGRO_JOURNEY_PROMPT,
    LOGRO_DESCRIPTION,
} from './prompts/intents/logro'
import {
    LANZAMIENTO_EXTENDED_DESCRIPTION,
    LANZAMIENTO_REQUIRED_FIELDS,
    LANZAMIENTO_COUNTDOWN_PROMPT,
    LANZAMIENTO_REVEAL_PROMPT,
    LANZAMIENTO_SILHOUETTE_PROMPT,
    LANZAMIENTO_GLITCH_PROMPT,
    LANZAMIENTO_TORN_PROMPT,
    LANZAMIENTO_CALENDAR_PROMPT,
    LANZAMIENTO_DESCRIPTION,
} from './prompts/intents/lanzamiento'
import {
    RETO_EXTENDED_DESCRIPTION,
    RETO_REQUIRED_FIELDS,
    RETO_VS_PROMPT,
    RETO_GIVEAWAY_PROMPT,
    RETO_BRACKET_PROMPT,
    RETO_DARE_PROMPT,
    RETO_PODIUM_PROMPT,
    RETO_RULES_PROMPT,
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
    SERVICIO_DESCRIPTION,
} from './prompts/intents/servicio'
import {
    TALENTO_EXTENDED_DESCRIPTION,
    TALENTO_REQUIRED_FIELDS,
    TALENTO_HIRING_PROMPT,
    TALENTO_CULTURE_PROMPT,
    TALENTO_VALUE_PROMPT,
    TALENTO_PERKS_PROMPT,
    TALENTO_SPOTLIGHT_PROMPT,
    TALENTO_OFFICE_PROMPT,
    TALENTO_DESCRIPTION,
} from './prompts/intents/talento'
import {
    DEFINICION_EXTENDED_DESCRIPTION,
    DEFINICION_REQUIRED_FIELDS,
    DEFINICION_CLASSIC_PROMPT,
    DEFINICION_MINIMAL_PROMPT,
    DEFINICION_MAP_PROMPT,
    DEFINICION_ENCYCLOPEDIA_PROMPT,
    DEFINICION_URBAN_PROMPT,
    DEFINICION_TECH_PROMPT,
    DEFINICION_DESCRIPTION,
} from './prompts/intents/definicion'
import {
    EFEMERIDE_EXTENDED_DESCRIPTION,
    EFEMERIDE_REQUIRED_FIELDS,
    EFEMERIDE_CALENDAR_PROMPT,
    EFEMERIDE_HERO_DATE_PROMPT,
    EFEMERIDE_PARTY_PROMPT,
    EFEMERIDE_HISTORY_PROMPT,
    EFEMERIDE_NEON_PROMPT,
    EFEMERIDE_SEASONAL_PROMPT,
    EFEMERIDE_DESCRIPTION,
} from './prompts/intents/efemeride'
import {
    PASOS_EXTENDED_DESCRIPTION,
    PASOS_REQUIRED_FIELDS,
    PASOS_ZIGZAG_PROMPT,
    PASOS_CAROUSEL_PROMPT,
    PASOS_SPLIT_PROMPT,
    PASOS_FLOATING_PROMPT,
    PASOS_BLUEPRINT_PROMPT,
    PASOS_TIMELINE_PROMPT,
    PASOS_DESCRIPTION,
} from './prompts/intents/pasos'
import {
    BTS_EXTENDED_DESCRIPTION,
    BTS_REQUIRED_FIELDS,
    BTS_WIP_PROMPT,
    BTS_DESK_PROMPT,
    BTS_MOODBOARD_PROMPT,
    BTS_SKETCH_REAL_PROMPT,
    BTS_BEFORE_AFTER_PROMPT,
    BTS_PALETTE_PROMPT,
    BTS_DESCRIPTION,
} from './prompts/intents/bts'
import {
    CATALOGO_EXTENDED_DESCRIPTION,
    CATALOGO_REQUIRED_FIELDS,
    CATALOGO_GRID_PROMPT,
    CATALOGO_LOOKBOOK_PROMPT,
    CATALOGO_MASONRY_PROMPT,
    CATALOGO_SHELF_PROMPT,
    CATALOGO_VARIANTS_PROMPT,
    CATALOGO_DETAIL_PROMPT,
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
    ESCAPARATE_PROMPT,
    ESCAPARATE_LIFESTYLE_PROMPT,
    ESCAPARATE_MINIMAL_PROMPT,
    ESCAPARATE_DYNAMIC_PROMPT,
    ESCAPARATE_DETAIL_PROMPT,
    ESCAPARATE_THEMED_PROMPT,
    ESCAPARATE_DESCRIPTION,
} from './prompts/intents/escaparate'
import {
    COMUNICADO_EXTENDED_DESCRIPTION,
    COMUNICADO_REQUIRED_FIELDS,
    COMUNICADO_OFFICIAL_PROMPT,
    COMUNICADO_URGENT_PROMPT,
    COMUNICADO_MODERN_PROMPT,
    COMUNICADO_EDITORIAL_PROMPT,
    COMUNICADO_COMMUNITY_PROMPT,
    COMUNICADO_MINIMAL_PROMPT,
    COMUNICADO_DESCRIPTION,
} from './prompts/intents/comunicado'
import {
    EVENTO_EXTENDED_DESCRIPTION,
    EVENTO_REQUIRED_FIELDS,
    EVENTO_CONFERENCE_PROMPT,
    EVENTO_PARTY_PROMPT,
    EVENTO_WORKSHOP_PROMPT,
    EVENTO_FESTIVAL_PROMPT,
    EVENTO_NETWORKING_PROMPT,
    EVENTO_MINIMAL_PROMPT,
    EVENTO_DESCRIPTION,
} from './prompts/intents/evento'
import {
    COMPARATIVA_EXTENDED_DESCRIPTION,
    COMPARATIVA_REQUIRED_FIELDS,
    COMPARATIVA_SPLIT_PROMPT,
    COMPARATIVA_VS_PROMPT,
    COMPARATIVA_BEFORE_AFTER_PROMPT,
    COMPARATIVA_GRID_PROMPT,
    COMPARATIVA_SLIDER_PROMPT,
    COMPARATIVA_EVOLUTION_PROMPT,
    COMPARATIVA_DESCRIPTION,
} from './prompts/intents/comparativa'
import {
    LISTA_EXTENDED_DESCRIPTION,
    LISTA_REQUIRED_FIELDS,
    LISTA_CHECKLIST_PROMPT,
    LISTA_RANKING_PROMPT,
    LISTA_STEPS_PROMPT,
    LISTA_GRID_KEY_PROMPT,
    LISTA_TIMELINE_PROMPT,
    LISTA_NOTE_PROMPT,
    LISTA_DESCRIPTION,
} from './prompts/intents/lista'

import {
    DATO_EXTENDED_DESCRIPTION,
    DATO_REQUIRED_FIELDS,
    DATO_BIG_STAT_PROMPT,
    DATO_COMPARISON_PROMPT,
    DATO_PROCESS_PROMPT,
    DATO_INFOGRAPHIC_PROMPT,
    DATO_KEY_METRIC_PROMPT,
    DATO_PIE_PROMPT,
    DATO_DESCRIPTION,
} from './prompts/intents/dato'
import {
    PREGUNTA_EXTENDED_DESCRIPTION,
    PREGUNTA_REQUIRED_FIELDS,
    PREGUNTA_BIG_TYPE_PROMPT,
    PREGUNTA_POLL_PROMPT,
    PREGUNTA_CONVERSATION_PROMPT,
    PREGUNTA_QUIZ_PROMPT,
    PREGUNTA_DEBATE_PROMPT,
    PREGUNTA_THOUGHT_PROMPT,
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
    { id: 'brand', label: '💼 Tu Marca', description: 'Estilos de tu Brand Kit' },
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
    comparativa: [
        {
            id: 'comp-split',
            name: 'Split Vertical',
            description: 'División Clásica',
            svgIcon: 'SplitVertical',
            textZone: 'center',
            promptInstruction: 'Vertical split screen comparison.',
            structuralPrompt: COMPARATIVA_SPLIT_PROMPT,
        },
        {
            id: 'comp-vs',
            name: 'Versus',
            description: 'Batalla',
            svgIcon: 'Zap',
            textZone: 'center',
            promptInstruction: 'High energy VS battle layout.',
            structuralPrompt: COMPARATIVA_VS_PROMPT,
        },
        {
            id: 'comp-before-after',
            name: 'Antes/Después',
            description: 'Transformación',
            svgIcon: 'ArrowRight',
            textZone: 'bottom',
            promptInstruction: 'Result focus with visual inset of origin.',
            structuralPrompt: COMPARATIVA_BEFORE_AFTER_PROMPT,
        },
        {
            id: 'comp-grid',
            name: 'Grid Features',
            description: 'Pros/Contras',
            svgIcon: 'CheckCircle',
            textZone: 'center',
            promptInstruction: 'Feature comparison grid with checkmarks.',
            structuralPrompt: COMPARATIVA_GRID_PROMPT,
        },
        {
            id: 'comp-slider',
            name: 'Slider Effect',
            description: 'Interactivo',
            svgIcon: 'MoveHorizontal',
            textZone: 'center',
            promptInstruction: 'Visual slider illusion centered.',
            structuralPrompt: COMPARATIVA_SLIDER_PROMPT,
        },
        {
            id: 'comp-evolution',
            name: 'Evolución',
            description: 'Línea Temporal',
            svgIcon: 'TrendingUp',
            textZone: 'bottom',
            promptInstruction: 'Evolution timeline from left to right.',
            structuralPrompt: COMPARATIVA_EVOLUTION_PROMPT,
        },
    ],
    lista: [
        {
            id: 'lista-checklist',
            name: 'Checklist',
            description: 'Tareas / Puntos',
            svgIcon: 'CheckSquare',
            textZone: 'left',
            promptInstruction: 'Checklist style with checkboxes.',
            structuralPrompt: LISTA_CHECKLIST_PROMPT,
        },
        {
            id: 'lista-ranking',
            name: 'Ranking',
            description: 'Top 1-2-3',
            svgIcon: 'Award',
            textZone: 'center',
            promptInstruction: 'Podium or leaderboard ranking layout.',
            structuralPrompt: LISTA_RANKING_PROMPT,
        },
        {
            id: 'lista-steps',
            name: 'Pasos',
            description: 'Roadmap',
            svgIcon: 'Map',
            textZone: 'center',
            promptInstruction: 'Winding path or step-by-step roadmap.',
            structuralPrompt: LISTA_STEPS_PROMPT,
        },
        {
            id: 'lista-grid',
            name: 'Colección',
            description: 'Grid Recursos',
            svgIcon: 'Grid',
            textZone: 'center',
            promptInstruction: 'Grid collection of resources or items.',
            structuralPrompt: LISTA_GRID_KEY_PROMPT,
        },
        {
            id: 'lista-timeline',
            name: 'Timeline',
            description: 'Cronología',
            svgIcon: 'Clock',
            textZone: 'left',
            promptInstruction: 'Vertical timeline with nodes.',
            structuralPrompt: LISTA_TIMELINE_PROMPT,
        },
        {
            id: 'lista-note',
            name: 'Nota',
            description: 'Papel / Sticky',
            svgIcon: 'FileText',
            textZone: 'center',
            promptInstruction: 'Handwritten note or sticky note aesthetic.',
            structuralPrompt: LISTA_NOTE_PROMPT,
        },
    ],
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
            structuralPrompt: CITA_PORTRAIT_PROMPT,
        },
        {
            id: 'cita-typo',
            name: 'Tipografía',
            description: 'Letras Grandes',
            svgIcon: 'Type',
            textZone: 'center',
            promptInstruction: 'Typography as the main visual element.',
            structuralPrompt: CITA_TYPO_PROMPT,
        },
        {
            id: 'cita-frame',
            name: 'Marco',
            description: 'Enmarcado',
            svgIcon: 'Frame', // Assuming Frame exists or similar
            textZone: 'center',
            promptInstruction: 'Quote inside an elegant border.',
            structuralPrompt: CITA_FRAME_PROMPT,
        },
        {
            id: 'cita-texture',
            name: 'Textura',
            description: 'Orgánico',
            svgIcon: 'Image',
            textZone: 'center',
            promptInstruction: 'Quote on textured background.',
            structuralPrompt: CITA_TEXTURE_PROMPT,
        },
        {
            id: 'cita-split',
            name: 'Split Mood',
            description: 'Imagen/Texto',
            svgIcon: 'SplitHorizontal',
            textZone: 'right',
            promptInstruction: 'Half image, half quote text.',
            structuralPrompt: CITA_SPLIT_PROMPT,
        },
    ],
    equipo: [
        {
            id: 'equipo-portrait',
            name: 'Retrato Hero',
            description: 'Perfil Profesional',
            svgIcon: 'User',
            textZone: 'bottom',
            promptInstruction: 'Professional hero portrait of team member.',
            structuralPrompt: EQUIPO_PORTRAIT_PROMPT,
        },
        {
            id: 'equipo-group',
            name: 'Grupo',
            description: 'Foto de Equipo',
            svgIcon: 'Users',
            textZone: 'bottom',
            promptInstruction: 'Wide group shot of the team.',
            structuralPrompt: EQUIPO_GROUP_PROMPT,
        },
        {
            id: 'equipo-collage',
            name: 'Collage',
            description: 'Grid Caras',
            svgIcon: 'Grid',
            textZone: 'center',
            promptInstruction: 'Collage grid of team members.',
            structuralPrompt: EQUIPO_COLLAGE_PROMPT,
        },
        {
            id: 'equipo-quote',
            name: 'Spotlight',
            description: 'Foto + Cita',
            svgIcon: 'MessageSquare',
            textZone: 'right',
            promptInstruction: 'Employee profile with a quote.',
            structuralPrompt: EQUIPO_QUOTE_PROMPT,
        },
        {
            id: 'equipo-action',
            name: 'En Acción',
            description: 'BTS Candid',
            svgIcon: 'Camera',
            textZone: 'bottom',
            promptInstruction: 'Candid action shot of working.',
            structuralPrompt: EQUIPO_ACTION_PROMPT,
        },
        {
            id: 'equipo-minimal',
            name: 'Tarjeta ID',
            description: 'Minimalista',
            svgIcon: 'CreditCard',
            textZone: 'center',
            promptInstruction: 'Clean ID card style profile.',
            structuralPrompt: EQUIPO_MINIMAL_PROMPT,
        },
    ],
    logro: [
        {
            id: 'logro-number',
            name: 'Cifra Hero',
            description: 'Dato Gigante',
            svgIcon: 'Hash',
            textZone: 'bottom',
            promptInstruction: 'Huge centralized metric or number.',
            structuralPrompt: LOGRO_NUMBER_PROMPT,
        },
        {
            id: 'logro-trophy',
            name: 'Trofeo',
            description: 'Premio 3D',
            svgIcon: 'Award',
            textZone: 'bottom',
            promptInstruction: 'Trophy or medal in spotlight.',
            structuralPrompt: LOGRO_TROPHY_PROMPT,
        },
        {
            id: 'logro-confetti',
            name: 'Fiesta',
            description: 'Confetti',
            svgIcon: 'Sparkles',
            textZone: 'center',
            promptInstruction: 'Festive explosion with confetti.',
            structuralPrompt: LOGRO_CONFETTI_PROMPT,
        },
        {
            id: 'logro-team',
            name: 'Éxito Equipo',
            description: 'Celebración',
            svgIcon: 'Users',
            textZone: 'bottom',
            promptInstruction: 'Team celebrating success.',
            structuralPrompt: LOGRO_TEAM_PROMPT,
        },
        {
            id: 'logro-premium',
            name: 'Certificado',
            description: 'Sello Lujo',
            svgIcon: 'Award', // Using Award again or similar
            textZone: 'center',
            promptInstruction: 'Luxury seal or certificate style.',
            structuralPrompt: LOGRO_PREMIUM_PROMPT,
        },
        {
            id: 'logro-journey',
            name: 'Hito Camino',
            description: 'Timeline',
            svgIcon: 'MapPin',
            textZone: 'left',
            promptInstruction: 'Milestone on a path or timeline.',
            structuralPrompt: LOGRO_JOURNEY_PROMPT,
        },
    ],
    lanzamiento: [
        {
            id: 'lanzamiento-countdown',
            name: 'Cuenta Atrás',
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
            structuralPrompt: LANZAMIENTO_REVEAL_PROMPT,
        },
        {
            id: 'lanzamiento-silhouette',
            name: 'Silueta',
            description: 'Misterio Backlit',
            svgIcon: 'Moon',
            textZone: 'center',
            promptInstruction: 'Backlit silhouette of the product.',
            structuralPrompt: LANZAMIENTO_SILHOUETTE_PROMPT,
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
            name: 'Papel Rasgado',
            description: 'Teaser',
            svgIcon: 'FileMinus',
            textZone: 'center',
            promptInstruction: 'Ripped paper revealing content inside.',
            structuralPrompt: LANZAMIENTO_TORN_PROMPT,
        },
        {
            id: 'lanzamiento-calendar',
            name: 'Save Date',
            description: 'Calendario 3D',
            svgIcon: 'Calendar',
            textZone: 'center',
            promptInstruction: 'Floating 3D calendar page.',
            structuralPrompt: LANZAMIENTO_CALENDAR_PROMPT,
        },
    ],
    reto: [
        {
            id: 'reto-vs',
            name: 'Versus / VS',
            description: 'Batalla',
            svgIcon: 'Swords',
            textZone: 'center',
            promptInstruction: 'Diagonal split screen battle.',
            structuralPrompt: RETO_VS_PROMPT,
        },
        {
            id: 'reto-giveaway',
            name: 'Sorteo',
            description: 'Premio 3D',
            svgIcon: 'Gift',
            textZone: 'center',
            promptInstruction: 'Floating 3D prize hero shot.',
            structuralPrompt: RETO_GIVEAWAY_PROMPT,
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
            structuralPrompt: RETO_DARE_PROMPT,
        },
        {
            id: 'reto-podium',
            name: 'Ganadores',
            description: 'Podio 1-2-3',
            svgIcon: 'Medal',
            textZone: 'bottom',
            promptInstruction: 'Three-tiered winner podium.',
            structuralPrompt: RETO_PODIUM_PROMPT,
        },
        {
            id: 'reto-rules',
            name: 'Reglas',
            description: 'Pasos 1-2-3',
            svgIcon: 'ListChecks',
            textZone: 'left',
            promptInstruction: 'Step-by-step contest rules.',
            structuralPrompt: RETO_RULES_PROMPT,
        },
    ],
    servicio: [
        {
            id: 'servicio-grid',
            name: 'Grid Features',
            description: 'Bento Cards',
            svgIcon: 'Grid',
            textZone: 'center',
            promptInstruction: 'Structured 2x2 grid of features.',
            structuralPrompt: SERVICIO_GRID_PROMPT,
        },
        {
            id: 'servicio-benefit',
            name: 'Beneficio',
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
            name: 'Lista Servicios',
            description: 'Catálogo',
            svgIcon: 'List',
            textZone: 'left',
            promptInstruction: 'Clean vertical list with icons.',
            structuralPrompt: SERVICIO_LIST_PROMPT,
        },
        {
            id: 'servicio-trust',
            name: 'Garantía',
            description: 'Sello Calidad',
            svgIcon: 'ShieldCheck',
            textZone: 'center',
            promptInstruction: 'Large 3D trust badge or guarantee.',
            structuralPrompt: SERVICIO_TRUST_PROMPT,
        },
    ],
    talento: [
        {
            id: 'talento-hiring',
            name: 'Hiring Hero',
            description: 'Post Reclutamiento',
            svgIcon: 'Briefcase',
            textZone: 'center',
            promptInstruction: 'Bold hiring announcement poster.',
            structuralPrompt: TALENTO_HIRING_PROMPT,
        },
        {
            id: 'talento-culture',
            name: 'Cultura',
            description: 'Grid Equipo',
            svgIcon: 'Smile',
            textZone: 'center',
            promptInstruction: 'Fun team culture photo grid.',
            structuralPrompt: TALENTO_CULTURE_PROMPT,
        },
        {
            id: 'talento-value',
            name: 'Valores',
            description: 'Palabra Clave',
            svgIcon: 'Award',
            textZone: 'center',
            promptInstruction: 'Single powerful core value word.',
            structuralPrompt: TALENTO_VALUE_PROMPT,
        },
        {
            id: 'talento-perks',
            name: 'Beneficios',
            description: 'Iconos Flotantes',
            svgIcon: 'Gift',
            textZone: 'top',
            promptInstruction: '3D icons representing perks.',
            structuralPrompt: TALENTO_PERKS_PROMPT,
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
            structuralPrompt: TALENTO_OFFICE_PROMPT,
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
            structuralPrompt: DEFINICION_CLASSIC_PROMPT,
        },
        {
            id: 'def-minimal',
            name: 'Minimal',
            description: 'Impacto Visual',
            svgIcon: 'Type',
            textZone: 'center',
            promptInstruction: 'Massive typography, minimal style.',
            structuralPrompt: DEFINICION_MINIMAL_PROMPT,
        },
        {
            id: 'def-map',
            name: 'Mapa Mental',
            description: 'Conexiones',
            svgIcon: 'GitBranch',
            textZone: 'center',
            promptInstruction: 'Mind map connecting concepts.',
            structuralPrompt: DEFINICION_MAP_PROMPT,
        },
        {
            id: 'def-encyclopedia',
            name: 'Enciclopedia',
            description: 'Académico',
            svgIcon: 'Library',
            textZone: 'right',
            promptInstruction: 'Vintage encyclopedia layout.',
            structuralPrompt: DEFINICION_ENCYCLOPEDIA_PROMPT,
        },
        {
            id: 'def-urban',
            name: 'Urbano',
            description: 'Sticker Style',
            svgIcon: 'Tag',
            textZone: 'center',
            promptInstruction: 'Street style sticker definition.',
            structuralPrompt: DEFINICION_URBAN_PROMPT,
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
    ],
    efemeride: [
        {
            id: 'efemeride-calendar',
            name: 'Calendario',
            description: 'Hoja Clásica',
            svgIcon: 'Calendar',
            textZone: 'center',
            promptInstruction: 'Classic tear-off calendar page.',
            structuralPrompt: EFEMERIDE_CALENDAR_PROMPT,
        },
        {
            id: 'efemeride-hero',
            name: 'Fecha',
            description: 'Tipografía',
            svgIcon: 'Hash',
            textZone: 'center',
            promptInstruction: 'Giant date numbers 3D typography.',
            structuralPrompt: EFEMERIDE_HERO_DATE_PROMPT,
        },
        {
            id: 'efemeride-party',
            name: 'Fiesta',
            description: 'Confetti',
            svgIcon: 'PartyPopper',
            textZone: 'center',
            promptInstruction: 'Explosion of confetti and balloons.',
            structuralPrompt: EFEMERIDE_PARTY_PROMPT,
        },
        {
            id: 'efemeride-history',
            name: 'Histórico',
            description: 'Vintage',
            svgIcon: 'Clock',
            textZone: 'bottom',
            promptInstruction: 'Antique frame with historical feel.',
            structuralPrompt: EFEMERIDE_HISTORY_PROMPT,
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
            name: 'Estacional',
            description: 'Naturaleza',
            svgIcon: 'Sun',
            textZone: 'center',
            promptInstruction: 'Floral or seasonal border frame.',
            structuralPrompt: EFEMERIDE_SEASONAL_PROMPT,
        },
    ],
    pasos: [
        {
            id: 'pasos-zigzag',
            name: 'Zig Zag',
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
            structuralPrompt: PASOS_CAROUSEL_PROMPT,
        },
        {
            id: 'pasos-split',
            name: 'Guía Visual',
            description: 'Foto + Lista',
            svgIcon: 'Layout',
            textZone: 'right',
            promptInstruction: 'Split screen: hero image and checklist.',
            structuralPrompt: PASOS_SPLIT_PROMPT,
        },
        {
            id: 'pasos-floating',
            name: 'Pasos 3D',
            description: 'Números 3D',
            svgIcon: 'Layers',
            textZone: 'center',
            promptInstruction: 'Giant floating 3D numbers.',
            structuralPrompt: PASOS_FLOATING_PROMPT,
        },
        {
            id: 'pasos-blueprint',
            name: 'Plano',
            description: 'Técnico',
            svgIcon: 'PenTool',
            textZone: 'center',
            promptInstruction: 'Technical blueprint schematic.',
            structuralPrompt: PASOS_BLUEPRINT_PROMPT,
        },
        {
            id: 'pasos-timeline',
            name: 'Cronología',
            description: 'Vertical',
            svgIcon: 'MoreVertical',
            textZone: 'left',
            promptInstruction: 'Vertical timeline progress.',
            structuralPrompt: PASOS_TIMELINE_PROMPT,
        },
    ],
    bts: [
        {
            id: 'bts-wip',
            name: 'En Proceso',
            description: 'Work in Progress',
            svgIcon: 'Tool',
            textZone: 'center',
            promptInstruction: 'Macro shot of tools and unfinished work.',
            structuralPrompt: BTS_WIP_PROMPT,
        },
        {
            id: 'bts-desk',
            name: 'Escritorio',
            description: 'Workspace',
            svgIcon: 'Coffee',
            textZone: 'center',
            promptInstruction: 'Creative desk setup with scattered items.',
            structuralPrompt: BTS_DESK_PROMPT,
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
            structuralPrompt: BTS_SKETCH_REAL_PROMPT,
        },
        {
            id: 'bts-before',
            name: 'Antes/Después',
            description: 'Evolución',
            svgIcon: 'RefreshCw',
            textZone: 'bottom',
            promptInstruction: 'Transformation before and after.',
            structuralPrompt: BTS_BEFORE_AFTER_PROMPT,
        },
        {
            id: 'bts-palette',
            name: 'Paleta',
            description: 'Colores',
            svgIcon: 'Droplet',
            textZone: 'bottom',
            promptInstruction: 'Image with extracted color swatches.',
            structuralPrompt: BTS_PALETTE_PROMPT,
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
            structuralPrompt: CATALOGO_GRID_PROMPT,
        },
        {
            id: 'catalogo-lookbook',
            name: 'Lookbook',
            description: 'Editorial',
            svgIcon: 'BookOpen',
            textZone: 'center',
            promptInstruction: 'Editorial lookbook spread.',
            structuralPrompt: CATALOGO_LOOKBOOK_PROMPT,
        },
        {
            id: 'catalogo-masonry',
            name: 'Mosaico',
            description: 'Collage',
            svgIcon: 'Layout',
            textZone: 'center',
            promptInstruction: 'Dynamic masonry collage.',
            structuralPrompt: CATALOGO_MASONRY_PROMPT,
        },
        {
            id: 'catalogo-shelf',
            name: 'Estantería',
            description: 'Retail',
            svgIcon: 'Package',
            textZone: 'center',
            promptInstruction: 'Products on floating shelves.',
            structuralPrompt: CATALOGO_SHELF_PROMPT,
        },
        {
            id: 'catalogo-variants',
            name: 'Colores',
            description: 'Variantes',
            svgIcon: 'Columns',
            textZone: 'center',
            promptInstruction: 'Same product in multiple colors.',
            structuralPrompt: CATALOGO_VARIANTS_PROMPT,
        },
        {
            id: 'catalogo-detail',
            name: 'Detalle',
            description: 'Zoom',
            svgIcon: 'ZoomIn',
            textZone: 'center',
            promptInstruction: 'Zoom bubbles showing texture.',
            structuralPrompt: CATALOGO_DETAIL_PROMPT,
        },
    ],
    oferta: [
        {
            id: 'retail-classic',
            name: 'Clásico Impacto',
            description: 'Oferta estándar, texto gigante',
            svgIcon: 'Tag',
            textZone: 'center',
            promptInstruction: 'Classic high-impact retail sale poster. Huge text.',
            structuralPrompt: OFERTA_PROMPT,
        },
        {
            id: 'flash-sale',
            name: 'Flash / Rayo',
            description: 'Energía y velocidad alta',
            svgIcon: 'Zap',
            textZone: 'center',
            promptInstruction: 'Dynamic diagonal composition with lightning or speed lines.',
            structuralPrompt: OFERTA_FLASH_PROMPT,
        },
        {
            id: 'minimal-lux',
            name: 'Minimal Lujo',
            description: 'Sofisticado y limpio',
            svgIcon: 'Sparkles',
            textZone: 'bottom',
            promptInstruction: 'Elegant, ample whitespace, small dignified typography.',
            structuralPrompt: OFERTA_ELEGANT_PROMPT,
        },
        {
            id: 'bundle-grid',
            name: 'Pack / Grid',
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
            structuralPrompt: OFERTA_URGENCY_PROMPT,
        },
        {
            id: 'seasonal-deco',
            name: 'Temático',
            description: 'Decoración de temporada',
            svgIcon: 'Flower2',
            textZone: 'overlay',
            promptInstruction: 'Seasonal decorations framing the product.',
            structuralPrompt: OFERTA_SEASONAL_PROMPT,
        },
    ],
    escaparate: [
        {
            id: 'hero-spotlight',
            name: 'Spotlight',
            description: 'Hero absoluto',
            svgIcon: 'Target',
            textZone: 'bottom',
            promptInstruction: 'Product is the absolute hero. Clean background, studio lighting.',
            structuralPrompt: ESCAPARATE_PROMPT,
        },
        {
            id: 'lifestyle-context',
            name: 'Lifestyle',
            description: 'En uso/contexto',
            svgIcon: 'Image',
            textZone: 'bottom-left',
            promptInstruction: 'Product in realistic environment. Organic and authentic.',
            structuralPrompt: ESCAPARATE_LIFESTYLE_PROMPT,
        },
        {
            id: 'minimal-gallery',
            name: 'Galería',
            description: 'Estilo Museo',
            svgIcon: 'Frame',
            textZone: 'bottom',
            promptInstruction: 'Museum aesthetic, negative space, high art.',
            structuralPrompt: ESCAPARATE_MINIMAL_PROMPT,
        },
        {
            id: 'dynamic-motion',
            name: 'Motion',
            description: 'En movimiento',
            svgIcon: 'Activity', // Or Zap
            textZone: 'overlay',
            promptInstruction: 'Kinetic energy, floating elements, motion blur.',
            structuralPrompt: ESCAPARATE_DYNAMIC_PROMPT,
        },
        {
            id: 'detail-macro',
            name: 'Detalle',
            description: 'Multi-ángulo',
            svgIcon: 'ZoomIn',
            textZone: 'right',
            promptInstruction: 'Main shot plus detail bubbles/insets.',
            structuralPrompt: ESCAPARATE_DETAIL_PROMPT,
        },
        {
            id: 'themed-podium',
            name: 'Podium',
            description: 'Escenario 3D',
            svgIcon: 'Box',
            textZone: 'bottom',
            promptInstruction: 'Product on a stylized podium with thematic props.',
            structuralPrompt: ESCAPARATE_THEMED_PROMPT,
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
            structuralPrompt: COMUNICADO_OFFICIAL_PROMPT,
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
            structuralPrompt: COMUNICADO_URGENT_PROMPT,
        },
        {
            id: 'comunicado-modern',
            name: 'Moderno',
            description: 'Asimétrico Tech',
            svgIcon: 'LayoutTemplate',
            textZone: 'right',
            promptInstruction: 'Asymmetric modern layout with geometric masks.',
            structuralPrompt: COMUNICADO_MODERN_PROMPT,
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
            structuralPrompt: COMUNICADO_COMMUNITY_PROMPT,
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
    ],
    pregunta: [
        {
            id: 'pregunta-big',
            name: 'Gran Texto',
            description: 'Impacto Puro',
            svgIcon: 'Type',
            textZone: 'center',
            promptInstruction: 'Huge typography question layout.',
            structuralPrompt: PREGUNTA_BIG_TYPE_PROMPT,
        },
        {
            id: 'pregunta-poll',
            name: 'Encuesta / VS',
            description: 'Comparativo',
            svgIcon: 'GitCompare',
            textZone: 'center',
            promptInstruction: 'Split screen vs layout for polling.',
            structuralPrompt: PREGUNTA_POLL_PROMPT,
        },
        {
            id: 'pregunta-conversation',
            name: 'Conversación',
            description: 'Chat / Social',
            svgIcon: 'MessageCircle',
            textZone: 'center',
            promptInstruction: 'Chat bubble style conversation layout.',
            structuralPrompt: PREGUNTA_CONVERSATION_PROMPT,
        },
        {
            id: 'pregunta-quiz',
            name: 'Quiz / Trivia',
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
            name: 'Reflexión',
            description: 'Abstracto',
            svgIcon: 'Cloud',
            textZone: 'center',
            promptInstruction: 'Abstract thought bubble layout.',
            structuralPrompt: PREGUNTA_THOUGHT_PROMPT,
        },
    ],
    dato: [
        {
            id: 'dato-big',
            name: 'Dato Hero',
            description: 'Número Gigante',
            svgIcon: 'Hash',
            textZone: 'center',
            promptInstruction: 'Layout focusing on a single massive number.',
            structuralPrompt: DATO_BIG_STAT_PROMPT,
        },
        {
            id: 'dato-comparison',
            name: 'Comparativa',
            description: 'Barras / VS',
            svgIcon: 'BarChart2',
            textZone: 'center',
            promptInstruction: 'Comparison layout with charts or side-by-side.',
            structuralPrompt: DATO_COMPARISON_PROMPT,
        },
        {
            id: 'dato-process',
            name: 'Proceso',
            description: 'Pasos 1-2-3',
            svgIcon: 'ListOrdered',
            textZone: 'left',
            promptInstruction: 'Step-by-step process flow layout.',
            structuralPrompt: DATO_PROCESS_PROMPT,
        },
        {
            id: 'dato-infographic',
            name: 'Infografía',
            description: 'Grid de Datos',
            svgIcon: 'LayoutGrid',
            textZone: 'center',
            promptInstruction: 'Structured grid infographic layout.',
            structuralPrompt: DATO_INFOGRAPHIC_PROMPT,
        },
        {
            id: 'dato-metric',
            name: 'Métrica UI',
            description: 'Dashboard Card',
            svgIcon: 'Activity',
            textZone: 'center',
            promptInstruction: 'UI Card style for key performance metric.',
            structuralPrompt: DATO_KEY_METRIC_PROMPT,
        },
        {
            id: 'dato-pie',
            name: 'Gráfico Circular',
            description: 'Porcentajes',
            svgIcon: 'PieChart',
            textZone: 'center',
            promptInstruction: 'Circular chart or ring visualization.',
            structuralPrompt: DATO_PIE_PROMPT,
        },
    ],
    evento: [
        {
            id: 'evento-conference',
            name: 'Conferencia',
            description: 'Profesional / Speaker',
            svgIcon: 'Mic',
            textZone: 'right',
            promptInstruction: 'Professional conference layout with speaker focus.',
            structuralPrompt: EVENTO_CONFERENCE_PROMPT,
        },
        {
            id: 'evento-party',
            name: 'Fiesta / Live',
            description: 'Noche y Energía',
            svgIcon: 'Music',
            textZone: 'center',
            promptInstruction: 'High energy nightlife or concert flyer.',
            structuralPrompt: EVENTO_PARTY_PROMPT,
        },
        {
            id: 'evento-workshop',
            name: 'Workshop',
            description: 'Educativo / Curso',
            svgIcon: 'BookOpen',
            textZone: 'left',
            promptInstruction: 'Structured educational workshop layout.',
            structuralPrompt: EVENTO_WORKSHOP_PROMPT,
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
            name: 'Save the Date',
            description: 'Minimalista',
            svgIcon: 'Calendar',
            textZone: 'center',
            promptInstruction: 'Elegant minimal save the date layout.',
            structuralPrompt: EVENTO_MINIMAL_PROMPT,
        },
    ],


}

// Default layouts for intents not in the map
export const DEFAULT_LAYOUTS: LayoutOption[] = [
    { id: 'clean', name: 'Limpio', description: 'Espacio para texto', svgIcon: 'Layout', textZone: 'bottom', promptInstruction: 'Clean composition with ample negative space at bottom 25% for text overlay.' },
    { id: 'full-bleed', name: 'Full Bleed', description: 'Imagen completa', svgIcon: 'Maximize', textZone: 'overlay', promptInstruction: 'Full bleed image with semi-transparent text overlay capability.' },
    { id: 'frame', name: 'Con Marco', description: 'Borde visual', svgIcon: 'Frame', textZone: 'overlay', promptInstruction: 'Image with decorative frame or border.' },
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

    // Step 3: Vision Analysis
    visionAnalysis: VisionAnalysis | null
    isAnalyzing: boolean

    // Step 4: Style
    selectedStyles: string[]  // StyleChip IDs

    // Step 5: Layout
    selectedLayout: string | null  // LayoutOption ID

    // Step 6: Branding
    selectedLogoId: string | null
    headline: string
    cta: string
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
