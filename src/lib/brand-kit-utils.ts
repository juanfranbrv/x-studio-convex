import type { BrandDNA } from './brand-types'

export interface BrandKitCompleteness {
    percentage: number
    missing: string[]
    tips: string[]
    isComplete: boolean
}

interface FieldWeight {
    field: string
    label: string
    weight: number
    check: (brandKit: BrandDNA) => boolean
    tip: string
}

const FIELD_WEIGHTS: FieldWeight[] = [
    {
        field: 'brand_name',
        label: 'Nombre de marca',
        weight: 10,
        check: (bk) => !!bk.brand_name && bk.brand_name.trim().length > 0,
        tip: 'Añade el nombre de tu marca'
    },
    {
        field: 'tagline',
        label: 'Tagline',
        weight: 10,
        check: (bk) => !!bk.tagline && bk.tagline.trim().length > 0,
        tip: 'Define un eslogan o tagline memorable'
    },
    {
        field: 'business_overview',
        label: 'Descripción del negocio',
        weight: 10,
        check: (bk) => !!bk.business_overview && bk.business_overview.trim().length > 20,
        tip: 'Describe tu negocio en al menos una frase'
    },
    {
        field: 'colors',
        label: 'Colores (mínimo 3)',
        weight: 15,
        check: (bk) => Array.isArray(bk.colors) && bk.colors.length >= 3,
        tip: 'Añade al menos 3 colores de marca'
    },
    {
        field: 'logos',
        label: 'Logo',
        weight: 15,
        check: (bk) => (Array.isArray(bk.logos) && bk.logos.length >= 1) || !!bk.logo_url,
        tip: 'Sube el logo de tu marca'
    },
    {
        field: 'fonts',
        label: 'Tipografías',
        weight: 10,
        check: (bk) => Array.isArray(bk.fonts) && bk.fonts.length >= 1,
        tip: 'Define las tipografías de tu marca'
    },
    {
        field: 'images',
        label: 'Imágenes de referencia',
        weight: 10,
        check: (bk) => Array.isArray(bk.images) && bk.images.length >= 1,
        tip: 'Añade imágenes de referencia para tu marca'
    },
    {
        field: 'brand_values',
        label: 'Valores de marca',
        weight: 5,
        check: (bk) => Array.isArray(bk.brand_values) && bk.brand_values.length >= 1,
        tip: 'Define los valores que representa tu marca'
    },
    {
        field: 'tone_of_voice',
        label: 'Tono de voz',
        weight: 5,
        check: (bk) => Array.isArray(bk.tone_of_voice) && bk.tone_of_voice.length >= 1,
        tip: 'Define cómo comunica tu marca'
    },
    {
        field: 'text_assets',
        label: 'Textos de marketing',
        weight: 10,
        check: (bk) => {
            if (!bk.text_assets) return false
            const ta = bk.text_assets
            return (ta.marketing_hooks?.length > 0) ||
                (ta.ctas?.length > 0) ||
                (ta.brand_context?.length > 0)
        },
        tip: 'Añade hooks, CTAs o contexto de marca'
    },
]

/**
 * Calcula el porcentaje de completitud de un Brand Kit
 */
export function calculateBrandKitCompleteness(brandKit: BrandDNA | null): BrandKitCompleteness {
    if (!brandKit) {
        return {
            percentage: 0,
            missing: FIELD_WEIGHTS.map(f => f.label),
            tips: ['Crea tu primer Kit de Marca para empezar'],
            isComplete: false
        }
    }

    let totalWeight = 0
    let completedWeight = 0
    const missing: string[] = []
    const tips: string[] = []

    for (const field of FIELD_WEIGHTS) {
        totalWeight += field.weight
        if (field.check(brandKit)) {
            completedWeight += field.weight
        } else {
            missing.push(field.label)
            tips.push(field.tip)
        }
    }

    const percentage = Math.round((completedWeight / totalWeight) * 100)

    return {
        percentage,
        missing,
        tips: tips.slice(0, 3), // Solo los primeros 3 tips
        isComplete: percentage >= 100
    }
}

/**
 * Obtiene un mensaje motivacional según el porcentaje de completitud
 */
export function getCompletenessMessage(percentage: number): { emoji: string; message: string; color: string } {
    if (percentage >= 100) {
        return { emoji: '🎉', message: '¡Kit de Marca completo!', color: 'text-green-500' }
    }
    if (percentage >= 80) {
        return { emoji: '🔥', message: '¡Casi listo!', color: 'text-amber-500' }
    }
    if (percentage >= 50) {
        return { emoji: '💪', message: 'Buen progreso', color: 'text-blue-500' }
    }
    if (percentage >= 25) {
        return { emoji: '🚀', message: 'Sigue así', color: 'text-purple-500' }
    }
    return { emoji: '✨', message: 'Empezando...', color: 'text-muted-foreground' }
}
