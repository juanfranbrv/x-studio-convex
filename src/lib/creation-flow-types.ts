// ============================================================================
// CREATION FLOW TYPES - Cascade Interface for X Studio
// ============================================================================

// -----------------------------------------------------------------------------
// INTENT CATEGORIES (20 Master Templates)
// -----------------------------------------------------------------------------

import { LucideIcon } from 'lucide-react'
import { OFERTA_IMPACTO_PROMPT, OFERTA_IMPACTO_DESCRIPTION } from './prompts/layouts/oferta-impacto'
import { PROMO_MOVIL_PROMPT, PROMO_MOVIL_DESCRIPTION } from './prompts/layouts/promo-movil'

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
    ESCAPARATE_DESCRIPTION,
} from './prompts/intents/escaparate'
import {
    COMUNICADO_EXTENDED_DESCRIPTION,
    COMUNICADO_REQUIRED_FIELDS,
    COMUNICADO_PROMPT,
    COMUNICADO_DESCRIPTION,
} from './prompts/intents/comunicado'
import {
    LOGRO_EXTENDED_DESCRIPTION,
    LOGRO_REQUIRED_FIELDS,
    LOGRO_PROMPT,
    LOGRO_DESCRIPTION,
} from './prompts/intents/logro'
import {
    DATO_EXTENDED_DESCRIPTION,
    DATO_REQUIRED_FIELDS,
    DATO_PROMPT,
    DATO_DESCRIPTION,
} from './prompts/intents/dato'
import {
    PREGUNTA_EXTENDED_DESCRIPTION,
    PREGUNTA_REQUIRED_FIELDS,
    PREGUNTA_PROMPT,
    PREGUNTA_DESCRIPTION,
} from './prompts/intents/pregunta'

export type IntentGroup = 'vender' | 'informar' | 'conectar' | 'educar' | 'engagement'

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

// -----------------------------------------------------------------------------
// INTENT METADATA
// -----------------------------------------------------------------------------

export interface IntentRequiredField {
    id: string
    label: string
    placeholder: string
    type: 'text' | 'textarea' | 'url' | 'phone' | 'address'
    required: boolean
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
        { id: 'foodie', label: '🍔 Foodie', icon: 'UtensilsCrossed', keywords: ['appetizing', 'gourmet', 'delicious'] },
        { id: 'rustico', label: '🌿 Rústico', icon: 'Leaf', keywords: ['wooden table', 'natural light', 'organic'] },
        { id: 'carta', label: '🍽️ Carta Restaurante', icon: 'BookOpen', keywords: ['elegant plating', 'fine dining'] },
        { id: 'street', label: '🚚 Street Food', icon: 'Truck', keywords: ['casual', 'urban', 'vibrant'] },
        { id: 'gourmet', label: '🍷 Gourmet', icon: 'GlassWater', keywords: ['luxury dining', 'exquisite', 'refined'] },
        { id: 'flatlay', label: '📸 Flat Lay', icon: 'Camera', keywords: ['top-down view', 'composition', 'neat'] },
    ],
    tech: [
        { id: 'minimal', label: '💻 Minimal', icon: 'Monitor', keywords: ['clean', 'sleek', 'modern'] },
        { id: 'neon', label: '⚡ Neón', icon: 'Zap', keywords: ['cyberpunk', 'glowing', 'futuristic'] },
        { id: 'oficina', label: '🏢 Oficina', icon: 'Building', keywords: ['professional', 'workspace', 'corporate'] },
        { id: 'gaming', label: '🎮 Gaming', icon: 'Gamepad2', keywords: ['RGB', 'dynamic', 'high-tech'] },
        { id: 'brutalist', label: '🧱 Brutalista', icon: 'Box', keywords: ['raw', 'bold', 'unfiltered'] },
        { id: 'softui', label: '☁️ Soft UI', icon: 'Cloud', keywords: ['neumorphic', 'soft shadows', 'gentle'] },
    ],
    fashion: [
        { id: 'editorial', label: '📸 Editorial', icon: 'Camera', keywords: ['high fashion', 'runway', 'artistic'] },
        { id: 'streetwear', label: '🧢 Streetwear', icon: 'Shirt', keywords: ['urban', 'casual', 'trendy'] },
        { id: 'luxury', label: '✨ Lujo', icon: 'Gem', keywords: ['premium', 'elegant', 'sophisticated'] },
        { id: 'vintage', label: '🎞️ Vintage', icon: 'History', keywords: ['retro', 'nostalgic', 'classic'] },
        { id: 'avantgarde', label: '🎭 Avant-Garde', icon: 'Palette', keywords: ['experimental', 'bold', 'artistic'] },
        { id: 'minimalist-f', label: '⚪ Minimalista', icon: 'Square', keywords: ['clean lines', 'simple', 'chic'] },
    ],
    beauty: [
        { id: 'glam', label: '💄 Glam', icon: 'Sparkles', keywords: ['glamorous', 'shiny', 'bold'] },
        { id: 'natural', label: '🌸 Natural', icon: 'Flower2', keywords: ['soft', 'organic', 'fresh'] },
        { id: 'clinical', label: '🔬 Clinical', icon: 'FlaskConical', keywords: ['clean', 'scientific', 'pure'] },
        { id: 'ethereal', label: '☁️ Etéreo', icon: 'Wind', keywords: ['dreamy', 'soft glow', 'heavenly'] },
        { id: 'artdeco', label: '🎨 Art Deco', icon: 'Palette', keywords: ['geometric beauty', 'vintage glam', 'ornate'] },
        { id: 'vibrant-b', label: '🌈 Vibrante', icon: 'Zap', keywords: ['bold colors', 'energetic', 'makeup art'] },
    ],
    home: [
        { id: 'scandi', label: '🪴 Scandi', icon: 'Home', keywords: ['scandinavian', 'cozy', 'hygge'] },
        { id: 'industrial', label: '🏭 Industrial', icon: 'Factory', keywords: ['raw', 'exposed brick', 'metal'] },
        { id: 'boho', label: '🌾 Boho', icon: 'Sun', keywords: ['bohemian', 'eclectic', 'warm'] },
        { id: 'maximalist', label: '🏛️ Maximalista', icon: 'Palace', keywords: ['rich textures', 'bold patterns', 'ornate'] },
        { id: 'zen', label: '🧘 Zen Garden', icon: 'Leaf', keywords: ['peaceful', 'minimalist', 'japanese style'] },
        { id: 'modern-h', label: '🏢 Moderno', icon: 'Building2', keywords: ['contemporary', 'clean', 'functional'] },
    ],
    sports: [
        { id: 'action', label: '🏃 Acción', icon: 'Flame', keywords: ['dynamic', 'motion blur', 'energy'] },
        { id: 'fitness', label: '💪 Fitness', icon: 'Dumbbell', keywords: ['gym', 'workout', 'strength'] },
        { id: 'outdoor', label: '🏔️ Outdoor', icon: 'Mountain', keywords: ['nature', 'adventure', 'freedom'] },
        { id: 'retro-sport', label: '👟 Retro Sport', icon: 'History', keywords: ['90s vibe', 'vintage athletic', 'bold colors'] },
        { id: 'cinematic-s', label: '🎥 Cinemático', icon: 'Video', keywords: ['dramatic lighting', 'epic', 'heroic'] },
        { id: 'urban-s', label: '🏙️ Urbano', icon: 'MapPin', keywords: ['street sports', 'concrete', 'gritty'] },
    ],
    nature: [
        { id: 'zen', label: '🧘 Zen', icon: 'Leaf', keywords: ['peaceful', 'calm', 'meditation'] },
        { id: 'wild', label: '🌲 Salvaje', icon: 'TreePine', keywords: ['untamed', 'forest', 'wilderness'] },
        { id: 'tropical', label: '🌴 Tropical', icon: 'Palmtree', keywords: ['exotic', 'beach', 'paradise'] },
        { id: 'macro', label: '🔍 Macro', icon: 'Search', keywords: ['detailed', 'close-up', 'textures'] },
        { id: 'ethereal-n', label: '✨ Etéreo', icon: 'Sparkles', keywords: ['magical forest', 'soft light', 'dreamy'] },
        { id: 'aerial', label: '🚁 Drone / Aéreo', icon: 'Plane', keywords: ['vast', 'landscape', 'from above'] },
    ],
    people: [
        { id: 'portrait', label: '👤 Retrato', icon: 'User', keywords: ['close-up', 'expressive', 'personal'] },
        { id: 'lifestyle', label: '🌟 Lifestyle', icon: 'Heart', keywords: ['candid', 'authentic', 'everyday'] },
        { id: 'corporate', label: '👔 Corporativo', icon: 'Briefcase', keywords: ['professional', 'headshot', 'business'] },
        { id: 'blackwhite', label: '⚫ B&N', icon: 'Moon', keywords: ['monochrome', 'dramatic', 'timeless'] },
        { id: 'candid', label: '👣 Espontáneo', icon: 'Footprints', keywords: ['natural', 'unposed', 'authentic'] },
        { id: 'artistic-p', label: '🎨 Artístico', icon: 'Palette', keywords: ['creative lighting', 'conceptual', 'bold'] },
    ],
    abstract: [
        { id: 'geometric', label: '🔷 Geométrico', icon: 'Hexagon', keywords: ['shapes', 'patterns', 'mathematical'] },
        { id: 'fluid', label: '🌊 Fluido', icon: 'Waves', keywords: ['organic', 'flowing', 'gradient'] },
        { id: 'texture', label: '🧱 Textura', icon: 'Grip', keywords: ['tactile', 'surface', 'material'] },
        { id: 'glitch', label: '👾 Glitcheado', icon: 'Cpu', keywords: ['digital error', 'distorted', 'modern'] },
        { id: 'vaporwave', label: '🌅 Vaporwave', icon: 'Sun', keywords: ['80s digital', 'neon pink', 'surreal'] },
        { id: 'minimal-a', label: '⚪ Minimal', icon: 'Square', keywords: ['single shape', 'negative space', 'clean'] },
    ],
    product: [
        { id: 'studio', label: '📦 Studio', icon: 'Box', keywords: ['clean background', 'product focus', 'commercial'] },
        { id: 'contextual', label: '🏠 En Contexto', icon: 'Layout', keywords: ['lifestyle', 'in-use', 'environmental'] },
        { id: 'floating', label: '✨ Flotante', icon: 'Sparkles', keywords: ['levitating', 'dynamic', 'eye-catching'] },
        { id: 'macro-p', label: '🔍 Macro Detalle', icon: 'Search', keywords: ['extreme close-up', 'texture focus', 'premium'] },
        { id: 'minimal-hero', label: '👑 Hero Minimal', icon: 'Crown', keywords: ['centered', 'dramatic lighting', 'bold'] },
        { id: 'lifestyle-p', label: '🏔️ Exterior', icon: 'Mountain', keywords: ['product in nature', 'adventure', 'wild'] },
    ],
    unknown: [
        { id: 'modern', label: '🎨 Moderno', icon: 'Palette', keywords: ['contemporary', 'fresh', 'current'] },
        { id: 'classic', label: '🏛️ Clásico', icon: 'Landmark', keywords: ['timeless', 'elegant', 'traditional'] },
        { id: 'popart', label: '💥 Pop Art', icon: 'Zap', keywords: ['bold outlines', 'vibrant', 'comic style'] },
        { id: 'surreal', label: '🌀 Surrealista', icon: 'Wind', keywords: ['dream-like', 'unusual', 'creative'] },
        { id: 'minimalist-u', label: '⚪ Minimal', icon: 'Square', keywords: ['simple', 'clean', 'effective'] },
        { id: 'cyber', label: '🤖 Cyber', icon: 'Cpu', keywords: ['high tech', 'digital', 'futuristic'] },
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
        { id: 'split-v', name: 'Split Vertical', description: 'Dos columnas', svgIcon: 'SplitVertical', textZone: 'center', promptInstruction: 'Split composition with two vertical halves. Left side: before/problem. Right side: after/solution.' },
        { id: 'split-h', name: 'Split Horizontal', description: 'Dos filas', svgIcon: 'SplitHorizontal', textZone: 'center', promptInstruction: 'Split composition with two horizontal halves. Top: before/problem. Bottom: after/solution.' },
        { id: 'before-after', name: 'Antes/Después', description: 'Con flechas', svgIcon: 'ArrowRight', textZone: 'bottom', promptInstruction: 'Before and after comparison with arrow indicator between states.' },
    ],
    cita: [
        { id: 'text-center', name: 'Texto Centro', description: 'Quote prominente', svgIcon: 'AlignCenter', textZone: 'center', promptInstruction: 'Large centered text area with subtle background. Leave 60% center for text overlay.' },
        { id: 'text-footer', name: 'Texto Pie', description: 'Banda inferior', svgIcon: 'AlignBottom', textZone: 'bottom', promptInstruction: 'Visual background with text band at bottom 30% of image.' },
        { id: 'frame', name: 'Marco', description: 'Borde decorativo', svgIcon: 'Frame', textZone: 'center', promptInstruction: 'Decorative frame border with centered text area.' },
    ],
    pregunta: [
        { id: 'text-center', name: 'Texto Centro', description: 'Pregunta grande', svgIcon: 'AlignCenter', textZone: 'center', promptInstruction: 'Bold centered text area for question. Leave 70% center space for text.' },
        { id: 'speech-bubble', name: 'Bocadillo', description: 'Estilo cómic', svgIcon: 'MessageSquare', textZone: 'center', promptInstruction: 'Speech bubble design element for conversational feel.' },
    ],
    oferta: [
        {
            id: 'oferta-impacto',
            name: 'Impacto Comercial',
            description: 'Bloques inclinados y objeto hero',
            svgIcon: 'Zap',
            textZone: 'center',
            promptInstruction: 'Bold retail offer with slanted text blocks and hero product.',
            referenceImage: '/plantillas/plantilla1.png',
            referenceImageDescription: OFERTA_IMPACTO_DESCRIPTION,
            structuralPrompt: OFERTA_IMPACTO_PROMPT,
            textFields: [
                { id: 'eyebrow', label: 'Cejilla (Urgencia)', placeholder: 'Del 18 al 24 de marzo', defaultValue: 'OFERTA LIMITADA', aiContext: 'Small urgent date range or disclaimer' },
                { id: 'headline', label: 'Títular Principal', placeholder: 'GRAN OFERTA', defaultValue: 'GRAN OFERTA', aiContext: 'Main catchy headline' },
                { id: 'discount', label: 'Valor Destacado', placeholder: '40% OFF', defaultValue: '50% OFF', aiContext: 'The main value proposition or percentage' },
                { id: 'footer', label: 'Información Pie', placeholder: 'Calle Cualquiera 123...', defaultValue: 'Consulta condiciones en tienda', aiContext: 'Address, legal info, or small print' },
            ]
        },
        {
            id: 'promo-movil',
            name: 'Promo Móvil',
            description: 'Mano sosteniendo smartphone con oferta',
            svgIcon: 'Smartphone',
            textZone: 'center',
            promptInstruction: 'Product promotion inside a smartphone screen held by a hand.',
            referenceImage: '/templates/phantom-5.png',
            referenceImageDescription: PROMO_MOVIL_DESCRIPTION,
            structuralPrompt: PROMO_MOVIL_PROMPT,
            textFields: [
                { id: 'handle', label: 'Handle (@usuario)', placeholder: '@tu_marca', defaultValue: '@SITIOINCREIBLE', aiContext: 'Social media handle at the top' },
                { id: 'headline', label: 'Oferta Principal', placeholder: '30% OFF', defaultValue: '30% OFF', aiContext: 'Main offer text inside the screen' },
                { id: 'subheadline', label: 'Sub-título', placeholder: 'EN TODOS LOS PRODUCTOS', defaultValue: 'EN TODOS LOS PRODUCTOS', aiContext: 'Secondary text inside the screen' },
                { id: 'disclaimer', label: 'Legal / Pie', placeholder: 'Promoción válida...', defaultValue: 'Promoción válida solo de contado efectivo o transferencia.', aiContext: 'Legal text in the bottom banner' },
            ]
        },
        { id: 'burst', name: 'Burst Sticker', description: 'Globo explosivo', svgIcon: 'Star', textZone: 'top-right', promptInstruction: 'Product image with space for burst/starburst price sticker at top right corner.' },
        { id: 'band', name: 'Banda Inferior', description: 'Precio en banda', svgIcon: 'RectangleHorizontal', textZone: 'bottom', promptInstruction: 'Product hero with solid color band at bottom 25% for price/CTA text.' },
        { id: 'hero-text', name: 'Hero Text', description: 'Texto gigante', svgIcon: 'Type', textZone: 'overlay', promptInstruction: 'Large bold discount text overlaying product. Semi-transparent background for readability.' },
    ],
    escaparate: [
        {
            id: 'hero',
            name: 'Hero Producto',
            description: 'Producto centrado',
            svgIcon: 'Square',
            textZone: 'bottom',
            promptInstruction: 'Clean product photography with subject centered. Leave bottom 20% for text.',
            structuralPrompt: ESCAPARATE_PROMPT,
            referenceImageDescription: ESCAPARATE_DESCRIPTION,
            textFields: [
                { id: 'product_name', label: 'Nombre del Producto', placeholder: 'Ej: Zapatillas Air Max', defaultValue: '', aiContext: 'The main product name' },
                { id: 'price', label: 'Precio (opcional)', placeholder: '149€', defaultValue: '', aiContext: 'Product price' },
                { id: 'tagline', label: 'Tagline', placeholder: 'Comodidad sin límites', defaultValue: '', aiContext: 'Short product tagline' },
            ]
        },
        { id: 'grid-2x2', name: 'Grid 2x2', description: 'Cuatro productos', svgIcon: 'Grid2x2', textZone: 'bottom', promptInstruction: 'Four product grid layout with equal spacing.' },
        { id: 'lifestyle', name: 'Lifestyle', description: 'En contexto', svgIcon: 'Image', textZone: 'bottom-left', promptInstruction: 'Product in lifestyle context/environment. Text area at bottom left corner.' },
    ],
    comunicado: [
        {
            id: 'comunicado-oficial',
            name: 'Comunicado Oficial',
            description: 'Diseño formal con máxima legibilidad',
            svgIcon: 'FileText',
            textZone: 'center',
            promptInstruction: 'Official announcement layout with maximum readability.',
            structuralPrompt: COMUNICADO_PROMPT,
            referenceImageDescription: COMUNICADO_DESCRIPTION,
            textFields: [
                { id: 'announcement_title', label: 'Título del Comunicado', placeholder: 'Cambio de Horario', defaultValue: '', aiContext: 'Main announcement headline' },
                { id: 'announcement_body', label: 'Texto del Comunicado', placeholder: 'Detalla aquí el mensaje...', defaultValue: '', aiContext: 'Full announcement text' },
                { id: 'effective_date', label: 'Fecha Efectiva', placeholder: 'A partir del 15 de enero', defaultValue: '', aiContext: 'When it takes effect' },
            ]
        },
        { id: 'notice-banner', name: 'Banner Aviso', description: 'Horizontal llamativo', svgIcon: 'AlertCircle', textZone: 'center', promptInstruction: 'Horizontal notice banner with attention-grabbing design. Bold header, clear body text.' },
    ],
    evento: [
        { id: 'save-date', name: 'Save the Date', description: 'Fecha destacada', svgIcon: 'Calendar', textZone: 'center', promptInstruction: 'Event visual with large centered date. Leave 50% for text overlay.' },
        { id: 'poster-v', name: 'Cartel Vertical', description: 'Póster clásico', svgIcon: 'RectangleVertical', textZone: 'top', promptInstruction: 'Poster style with header text area at top 30%.' },
        { id: 'banner', name: 'Banner', description: 'Horizontal', svgIcon: 'RectangleHorizontal', textZone: 'right', promptInstruction: 'Wide banner with visual left, text right.' },
    ],
    logro: [
        {
            id: 'celebration',
            name: 'Celebración',
            description: 'Confetti/Estrellas',
            svgIcon: 'PartyPopper',
            textZone: 'center',
            promptInstruction: 'Celebratory design with confetti or stars.',
            structuralPrompt: LOGRO_PROMPT,
            referenceImageDescription: LOGRO_DESCRIPTION,
            textFields: [
                { id: 'milestone_number', label: 'Cifra o Logro', placeholder: '10.000 seguidores', defaultValue: '', aiContext: 'The main milestone' },
                { id: 'gratitude_message', label: 'Mensaje', placeholder: '¡Gracias!', defaultValue: '¡Gracias!', aiContext: 'Thank you message' },
            ]
        },
        { id: 'trophy', name: 'Trofeo', description: 'Icono destacado', svgIcon: 'Trophy', textZone: 'bottom', promptInstruction: 'Trophy or achievement icon at top, text at bottom.' },
    ],
    dato: [
        {
            id: 'dato-infografia',
            name: 'Infografía',
            description: 'Estadística protagonista',
            svgIcon: 'BarChart3',
            textZone: 'center',
            promptInstruction: 'Data-driven infographic with prominent statistic.',
            structuralPrompt: DATO_PROMPT,
            referenceImageDescription: DATO_DESCRIPTION,
            textFields: [
                { id: 'main_stat', label: 'Dato Principal', placeholder: '73%', defaultValue: '', aiContext: 'The main statistic' },
                { id: 'stat_context', label: 'Contexto', placeholder: 'de consumidores prefieren...', defaultValue: '', aiContext: 'What the stat means' },
                { id: 'source', label: 'Fuente', placeholder: 'Estudio Nielsen 2024', defaultValue: '', aiContext: 'Data source' },
            ]
        },
        { id: 'stat-simple', name: 'Número Grande', description: 'Solo la cifra', svgIcon: 'Hash', textZone: 'center', promptInstruction: 'Large number/statistic as the sole visual focus. Minimal decoration, maximum impact.' },
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
    selectedBrandColors: string[]
    rawMessage: string // User's raw message for AI to use as context
    additionalInstructions: string // Direct instructions from user
    customStyle: string // User defined custom visual style

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
    imageSourceMode: 'upload',
    selectedBrandKitImageId: null,
    aiImageDescription: '',
    isGenerating: false,
    generatedImage: null,
    error: null,
}
