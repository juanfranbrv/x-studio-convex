import { GenerationState } from '@/lib/creation-flow-types'
import { ImpactoComercial } from './layouts/ImpactoComercial'
import { PromoMovil } from './layouts/PromoMovil'
import { HeroProducto } from './layouts/HeroProducto'
import { DefaultWireframe } from './layouts/DefaultWireframe'
import { ComunicadoOficial } from './layouts/ComunicadoOficial'

interface WireframeRendererProps {
    state: GenerationState
    aspectRatio: number
}

export function WireframeRenderer({ state, aspectRatio }: WireframeRendererProps) {
    const { selectedLayout, selectedIntent } = state

    // If no intent is selected, show nothing or a generic "Select Intent" state
    if (!selectedIntent) return null

    // Helper to get text values
    const getText = (id: string, fallback: string = '') => {
        if (id === 'headline') return state.headline || fallback
        if (id === 'cta') return state.cta || fallback
        return state.customTexts[id] || fallback
    }

    // Common props for all layouts
    const props = {
        image: state.uploadedImage || null,
        brandColors: state.selectedBrandColors,
        logoId: state.selectedLogoId,
        texts: {
            headline: state.headline,
            cta: state.cta,
            ...state.customTexts
        },
        aspectRatio
    }

    // Layout Router
    switch (selectedLayout) {
        case 'oferta-impacto':
            return <ImpactoComercial {...props} />
        case 'promo-movil':
            return <PromoMovil {...props} />
        case 'hero':
            return <HeroProducto {...props} />
        case 'comunicado-oficial':
            return <ComunicadoOficial {...props} />
        default:
            return <DefaultWireframe {...props} intent={selectedIntent} />
    }
}
