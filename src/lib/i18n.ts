import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Spanish translations (base language)
const resources = {
    'es-ES': {
        translation: {
            // Navigation
            nav: {
                home: 'Inicio',
                studio: 'Imagen',
                brands: 'Marcas',
                settings: 'Config',
            },
            // Brand DNA Panel
            brandDNA: {
                title: 'Brand DNA',
                brandKit: 'Kit de Marca',
                colorPalette: 'Paleta de colores',
                typography: 'Tipografía',
                logoInclusion: 'Inclusión de logo',
                tone: 'Tono',
                tones: {
                    professional: 'Profesional',
                    casual: 'Casual',
                    bold: 'Audaz',
                    elegant: 'Elegante',
                    playful: 'Divertido',
                },
            },
            // Canvas
            canvas: {
                title: 'El Canvas',
                versionHistory: 'Historial de versiones',
                noImage: 'Genera tu primera imagen',
                download: 'Descargar',
                share: 'Compartir',
            },
            // Campaign Brief
            campaign: {
                title: 'Brief de Campaña',
                generationControls: 'Controles de Generación',
                headlineText: 'Texto del Titular',
                headlinePlaceholder: 'Ej: Eleva tu carrera',
                cta: 'CTA',
                ctaPlaceholder: 'Ej: Comprar ahora',
                prompt: 'Prompt',
                promptPlaceholder: 'Describe la imagen que deseas crear...',
                generate: 'Generar',
                generating: 'Generando...',
            },
            // Platforms
            platforms: {
                instagram: 'Instagram',
                tiktok: 'TikTok',
                youtube: 'YouTube',
                linkedin: 'LinkedIn',
            },
            // Onboarding
            onboarding: {
                title: 'Configura tu marca',
                step1: 'Información básica',
                step2: 'Extracción automática',
                step3: 'Personalización',
                brandName: 'Nombre de la marca',
                websiteUrl: 'URL del sitio web',
                extracting: 'Extrayendo identidad de marca...',
                continue: 'Continuar',
                finish: 'Finalizar',
            },
            // Common
            common: {
                loading: 'Cargando...',
                error: 'Error',
                success: 'Éxito',
                save: 'Guardar',
                cancel: 'Cancelar',
                delete: 'Eliminar',
                edit: 'Editar',
                create: 'Crear',
                switchBrand: 'Cambiar marca',
                newBrand: 'Nuevo kit de marca',
            },
        },
    },
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'es-ES',
    fallbackLng: 'es-ES',
    interpolation: {
        escapeValue: false,
    },
})

export default i18n
