'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useUser } from '@clerk/nextjs'
import { useUI } from '@/contexts/UIContext'
import {
    CarouselControlsPanel,
    CarouselSettings
} from '@/components/studio/carousel/CarouselControlsPanel'
import { CarouselCanvasPanel } from '@/components/studio/carousel/CarouselCanvasPanel'
import {
    analyzeCarouselAction,
    regenerateSlideAction,
    regenerateCarouselCaptionAction,
    CarouselSlide,
    SlideContent,
    CarouselSuggestion
} from '@/app/actions/generate-carousel'
import { parseLazyIntentAction } from '@/app/actions/parse-intent'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { INTENT_CATALOG } from '@/lib/creation-flow-types'
import { PromptDebugModal } from '@/components/studio/modals/PromptDebugModal'
import type { DebugPromptData, ReferenceImageRole, VisionAnalysis } from '@/lib/creation-flow-types'
import { buildCarouselImagePrompt } from '@/lib/prompts/carousel-image'
import { buildCarouselBrandContext } from '@/lib/carousel-brand-context'
import { extractLogoPosition } from '@/lib/prompts/carousel/builder/final-prompt'
import { resolveCarouselCompositionIcon } from '@/lib/carousel-composition-icon'
import { buildPriority5StyleBlockFromAnalysis, mergeCustomStyleIntoStyleDirectives } from '@/lib/prompts/vision/style-priority-block'
import { detectLanguageFromParts } from '@/lib/language-detection'
import { log } from '@/lib/logger'
import { FeedbackButton } from '@/components/studio/FeedbackButton'
import { cn } from '@/lib/utils'
import { Id } from '../../../convex/_generated/dataModel'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCarouselCompositionRecommendation } from '@/lib/carousel-composition-governance'
import { Sparkles, Layers3, Loader2, Power, Wand2 } from 'lucide-react'

const createAuditFlowId = (prefix: string) =>
    `flow_${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

const shouldApplyPrimaryLogoToSlide = (
    selectedLogoUrl: string | undefined,
    includeLogoOnSlides: boolean | undefined,
    slideIndex: number,
    totalSlides: number
) => {
    if (!selectedLogoUrl) return false
    if (includeLogoOnSlides !== false) return true
    return slideIndex === Math.max(0, totalSlides - 1)
}

const getDebugReferenceWeight = (
    role: ReferenceImageRole,
    hasLayoutConsistencyRef: boolean
) => {
    if (role === 'logo') return 0.75
    if (role === 'style' || role === 'style_content') {
        return hasLayoutConsistencyRef ? 0.2 : 0.55
    }
    return hasLayoutConsistencyRef ? 0.34 : 0.92
}

export default function CarouselPage() {
    const router = useRouter()
    const { user } = useUser()
    const isAdmin = user?.emailAddresses?.some(
        email => email.emailAddress === 'juanfranbrv@gmail.com'
    ) ?? false
    const { activeBrandKit, brandKits, loading: brandKitsLoading, setActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const { toast } = useToast()
    const { panelPosition } = useUI()
    const aiConfig = useQuery(api.settings.getAIConfig)
    const carouselStructures = useQuery(api.carousel.listStructures, { includeInactive: false })
    const ensureCarouselDefaults = useMutation(api.carouselSeed.ensureDefaultsIfEmpty)
    const updateCarouselComposition = useMutation(api.carouselAdmin.updateComposition)
    const hasTriggeredCarouselSeedRef = useRef(false)

    useEffect(() => {
        document.title = 'X Carrusel | Motor de Diseño Inteligente'
    }, [])

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (!Array.isArray(carouselStructures)) return
        if (carouselStructures.length > 0) return
        if (hasTriggeredCarouselSeedRef.current) return

        hasTriggeredCarouselSeedRef.current = true
        void ensureCarouselDefaults({}).catch((error) => {
            hasTriggeredCarouselSeedRef.current = false
            log.warn('CAROUSEL', 'Auto-seed on page load failed', error)
        })
    }, [carouselStructures, ensureCarouselDefaults])

    const handleNewBrandKit = () => {
        router.push('/brand-kit/new')
    }

    if (brandKitsLoading && !activeBrandKit) {
        return (
            <DashboardLayout
                brands={brandKits}
                currentBrand={activeBrandKit}
                onBrandChange={setActiveBrandKit}
                onBrandDelete={deleteBrandKitById}
                onNewBrandKit={handleNewBrandKit}
                isFixed={true}
            >
                <div className="flex h-full items-center justify-center">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-lg font-medium">Cargando Carrusel...</span>
                    </div>
                </div>
            </DashboardLayout>
        )
    }


    const [isGenerating, setIsGenerating] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [generatedCount, setGeneratedCount] = useState(0)
    const [slides, setSlides] = useState<CarouselSlide[]>([])
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '3:4'>('4:5')
    const [carouselSettings, setCarouselSettings] = useState<CarouselSettings | null>(null)
    const [previewCompositionState, setPreviewCompositionState] = useState<{
        structureId: string | null
        compositionId: string | null
    }>({
        structureId: null,
        compositionId: null
    })
    const compositionsForDebug = useQuery(
        api.carousel.listCompositions,
        (previewCompositionState.structureId || carouselSettings?.structureId)
            ? {
                structureId: previewCompositionState.structureId || carouselSettings?.structureId || '',
                includeInactive: Boolean(isAdmin),
                includeGlobals: true
            }
            : 'skip'
    ) as Array<{
        _id: Id<'carousel_compositions'>
        composition_id: string
        name: string
        description: string
        layoutPrompt: string
        icon?: string
        iconPrompt?: string
        scope: string
        mode: string
        structure_id?: string
        isActive: boolean
    }> | undefined
    const [scriptSlides, setScriptSlides] = useState<SlideContent[] | null>(null)
    const [scriptPrompt, setScriptPrompt] = useState('')
    const [scriptSlideCount, setScriptSlideCount] = useState<number | null>(null)
    const [analysisHook, setAnalysisHook] = useState<string | undefined>()
    const [analysisStructure, setAnalysisStructure] = useState<{ id?: string; name?: string } | undefined>()
    const [analysisIntent, setAnalysisIntent] = useState<string | undefined>()
    const [caption, setCaption] = useState('')
    const [isCaptionLocked, setIsCaptionLocked] = useState(false)
    const [isCaptionGenerating, setIsCaptionGenerating] = useState(false)
    const [referenceImages, setReferenceImages] = useState<Array<{ url: string; source: 'upload' | 'brandkit' }>>([])
    const [referencePreviewState, setReferencePreviewState] = useState<{
        uploadedImages: string[]
        selectedBrandKitImageIds: string[]
        referenceImageRoles: Record<string, ReferenceImageRole>
        imageSourceMode: 'upload' | 'brandkit' | 'generate'
        selectedStylePresetId: string | null
        selectedStylePresetImageUrl: string | null
    }>({
        uploadedImages: [],
        selectedBrandKitImageIds: [],
        referenceImageRoles: {},
        imageSourceMode: 'upload',
        selectedStylePresetId: null,
        selectedStylePresetImageUrl: null
    })
    const [selectedLogoUrl, setSelectedLogoUrl] = useState<string | undefined>(undefined)
    const [showDebugModal, setShowDebugModal] = useState(false)
    const [debugPromptData, setDebugPromptData] = useState<DebugPromptData | null>(null)
    const [pendingGenerateSettings, setPendingGenerateSettings] = useState<CarouselSettings | null>(null)
    const [suggestions, setSuggestions] = useState<CarouselSuggestion[]>([])
    const [slideVariantSelection, setSlideVariantSelection] = useState<string[]>([])
    const [imagePromptSuggestions, setImagePromptSuggestions] = useState<string[]>([])
    const [sessionHistory, setSessionHistory] = useState<Array<{
        id: string
        createdAt: string
        slides: CarouselSlide[]
        caption?: string
    }>>([])
    const [originalAnalysis, setOriginalAnalysis] = useState<{
        slides: CarouselSlide[]
        scriptSlides: SlideContent[]
        hook?: string
        structure?: { id?: string; name?: string }
        detectedIntent?: string
        caption?: string
    } | null>(null)
    const [isCancelingAnalyze, setIsCancelingAnalyze] = useState(false)
    const [isCancelingGenerate, setIsCancelingGenerate] = useState(false)
    const [errorModal, setErrorModal] = useState<{
        open: boolean
        title: string
        message: string
        suggestedSlideCount?: number
    }>({ open: false, title: '', message: '' })
    const [slideCountOverride, setSlideCountOverride] = useState<number | null>(null)
    const selectedStylePresetDetails = useQuery(
        api.stylePresets.getActiveById,
        referencePreviewState.selectedStylePresetId
            ? { id: referencePreviewState.selectedStylePresetId as Id<'style_presets'> }
            : 'skip'
    )
    const cancelGenerationRef = useRef(false)
    const cancelAnalyzeRef = useRef(false)
    const styleAnalysisCacheRef = useRef<Record<string, string>>({})
    const currentCreationFlowIdRef = useRef<string | undefined>(undefined)
    const getOrCreateCreationFlowId = useCallback(() => {
        if (!currentCreationFlowIdRef.current) {
            currentCreationFlowIdRef.current = createAuditFlowId('carousel_create')
        }
        return currentCreationFlowIdRef.current
    }, [])

    const analysisIntentLabel = useMemo(() => {
        if (!analysisIntent) return undefined
        const raw = analysisIntent.trim()
        const normalized = raw.toLowerCase()
        const direct = INTENT_CATALOG.find(i => i.id === normalized)
        if (direct) return `${direct.name} (${direct.id})`

        const codeMatch = raw.match(/^([a-e])\s*([0-9]+)$/i)
        if (codeMatch) {
            const group = codeMatch[1].toUpperCase()
            const index = Number(codeMatch[2]) - 1
            const groupMap: Record<string, string[]> = {
                A: ['escaparate', 'catalogo', 'lanzamiento', 'servicio', 'oferta'],
                B: ['comunicado', 'evento', 'lista', 'comparativa', 'efemeride'],
                C: ['logro', 'equipo', 'cita', 'talento', 'bts'],
                D: ['dato', 'pasos', 'definicion'],
                E: ['pregunta', 'reto']
            }
            const resolvedId = groupMap[group]?.[index]
            const resolved = INTENT_CATALOG.find(i => i.id === resolvedId)
            if (resolved) return `${resolved.name} (${resolved.id})`
            if (resolvedId) return resolvedId
        }

        return raw
    }, [analysisIntent])

    const extractSuggestedSlideCount = (message: string) => {
        const matches = message.match(/\b(\d+)\b/g) || []
        const numbers = matches.map(Number).filter(n => Number.isFinite(n) && n > 0)
        if (numbers.length === 0) return undefined
        return Math.max(...numbers)
    }

    const simplifyErrorMessage = (message: string, suggested?: number) => {
        const lower = message.toLowerCase()
        if (lower.includes('reto de 7') || lower.includes('slide por día') || lower.includes('n+2') || lower.includes('requested_slide_count')) {
            if (suggested) {
                return `Este tipo de carrusel requiere al menos ${suggested} diapositivas (gancho + contenido + CTA). Ajusta el número para continuar.`
            }
            return 'Este tipo de carrusel requiere más diapositivas de las seleccionadas. Ajusta el número para continuar.'
        }
        if (lower.includes('modelo de inteligencia') || lower.includes('modelo de imagen')) {
            return 'Falta configuración de IA. Revisa el panel de Admin.'
        }
        return 'No se pudo completar la acción. Revisa la configuración e inténtalo de nuevo.'
    }

    const buildAiImageSuggestions = useCallback((
        items?: SlideContent[] | null,
        alternativeScripts?: Array<SlideContent[] | undefined>
    ) => {
        if (!Array.isArray(items) || items.length === 0) return []

        const normalizeKey = (value: string) =>
            value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')

        const removeVisualStyleHints = (text: string) => {
            if (!text) return ''
            const blockedTokens = [
                'style', 'aesthetic', 'mood', 'vibe', 'look', 'visual',
                'estilo', 'estetica',
                'color', 'colors', 'palette', 'tone', 'contrast', 'saturation', 'hue',
                'colores', 'paleta', 'tono', 'contraste', 'saturacion', 'matiz',
                'lighting', 'light', 'shadow', 'cinematic',
                'iluminacion', 'luz', 'sombras', 'cinematografico',
                'realistic', 'photorealistic', 'illustration', 'illustrative',
                'realista', 'fotorrealista', 'fotografico', 'fotografia', 'ilustracion',
                'vector', 'comic', 'cartoon', 'watercolor', 'oil painting',
                'vectorial', 'caricatura', 'acuarela', 'oleo',
            ].map(normalizeKey)

            const clauses = text
                .split(/[.,;:]+/g)
                .map((c) => c.trim())
                .filter(Boolean)
                .filter((clause) => {
                    const normalizedClause = normalizeKey(clause)
                    return !blockedTokens.some((token) => normalizedClause.includes(token))
                })

            const cleaned = clauses.join(', ').trim()
            return (cleaned || text)
                .replace(/^(ilustracion|ilustraci?n|fotografia|fotograf?a|foto|render|imagen|vector|vectorial)\s+/i, '')
                .replace(/(con|en|usando|with|in|using)[^,.;]*(estilo|estetica|iluminacion|color|paleta|realista|fotografia|ilustracion|style|aesthetic|lighting|palette|realistic|illustration)[^,.;]*/gi, '')
                .replace(/\s+/g, ' ')
                .replace(/^[,.\s]+|[,.\s]+$/g, '')
                .trim()
        }

        const normalize = (value: string) =>
            removeVisualStyleHints(value)
                .replace(/\s+/g, ' ')
                .replace(/\.+/g, '.')
                .trim()

        const baseSlides = [...items]
        const alternativeSlides = (alternativeScripts || [])
            .flatMap((set) => (Array.isArray(set) ? set : []))
            .filter(Boolean)
        const slidePool = [...baseSlides, ...alternativeSlides]

        const fromSlides = slidePool
            .map((slide: SlideContent) => {
                const visual = typeof slide.visualPrompt === 'string' ? normalize(slide.visualPrompt) : ''
                if (visual) return visual
                return normalize(`${slide.title || ''}. ${slide.description || ''}`)
            })
            .filter((value) => Boolean(value) && value.length > 16)

        const hook = normalize(`${items[0]?.title || ''}. ${items[0]?.description || ''}`)
        const middle = normalize(`${items[Math.max(1, Math.floor(items.length / 2))]?.title || ''}. ${items[Math.max(1, Math.floor(items.length / 2))]?.description || ''}`)
        const close = normalize(`${items[items.length - 1]?.title || ''}. ${items[items.length - 1]?.description || ''}`)
        const deckSummary = normalize(
            items
                .map((slide) => `${slide.title || ''}. ${slide.description || ''}`)
                .join(' ')
                .slice(0, 500)
        )

        const synthetic = [
            normalize(`Persona principal resolviendo esta situaci?n concreta: ${hook}`),
            normalize(`Escena del problema o necesidad central en contexto real: ${middle}`),
            normalize(`Escena de soluci?n o resultado esperado vinculada al mensaje: ${close}`),
            normalize(`Situaci?n completa que represente el guion del carrusel: ${deckSummary}`),
            normalize(`Momento de acci?n con objeto clave del mensaje: ${hook}`),
            normalize(`Interacci?n humana relacionada con el tema principal: ${middle}`),
        ].filter(Boolean)

        const merged = Array.from(new Set([...fromSlides, ...synthetic])).filter((value) => value.length > 12)
        while (merged.length < 4) {
            merged.push(normalize(`Situaci?n concreta del guion del carrusel: ${deckSummary || hook || middle || close || 'narrativa principal'}`))
        }

        const randomized = [...merged]
        for (let i = randomized.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[randomized[i], randomized[j]] = [randomized[j], randomized[i]]
        }
        return randomized.slice(0, 4)
    }, [])

    const openErrorModal = (title: string, message: string) => {
        const suggestedSlideCount = extractSuggestedSlideCount(message)
        const simplified = simplifyErrorMessage(message, suggestedSlideCount)
        setErrorModal({
            open: true,
            title,
            message: simplified,
            suggestedSlideCount
        })
    }

    const brandKitTexts = useMemo(() => {
        if (!activeBrandKit) return []
        const options: Array<{ id: string; label: string; value: string }> = []

        if (activeBrandKit.tagline) {
            options.push({ id: 'bk-tagline', label: 'Tagline', value: activeBrandKit.tagline })
        }
        if (activeBrandKit.url) {
            options.push({ id: 'bk-url', label: 'URL', value: activeBrandKit.url })
        }
        const hooks = activeBrandKit.text_assets?.marketing_hooks || []
        hooks.forEach((hook, idx) => {
            if (hook) options.push({ id: `bk-hook-${idx}`, label: `Hook ${idx + 1}`, value: hook })
        })
        const ctas = activeBrandKit.text_assets?.ctas || []
        ctas.forEach((cta, idx) => {
            if (cta) options.push({ id: `bk-cta-${idx}`, label: `CTA ${idx + 1}`, value: cta })
        })
        if (activeBrandKit.text_assets?.brand_context) {
            options.push({ id: 'bk-context', label: 'Contexto', value: activeBrandKit.text_assets.brand_context })
        }

        return options
    }, [activeBrandKit])

    const [isRegenerating, setIsRegenerating] = useState(false)
    const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)
    const buildPreviewTextContext = useCallback((slides: SlideContent[]) => {
        return slides
            .map((slide) => {
                const title = (slide.title || '').trim()
                const body = (slide.description || '').trim()
                if (!title && !body) return ''
                return `SLIDE_${slide.index + 1}: ${title}${body ? ` | ${body}` : ''}`
            })
            .filter(Boolean)
            .join('\n')
    }, [])

    const fingerprintSlides = useCallback((items: SlideContent[] | CarouselSlide[]) => {
        return items
            .map((s: any) => `${s.index}|${(s.title || '').trim()}|${(s.description || '').trim()}`)
            .join('||')
            .toLowerCase()
    }, [])

    const handleUpdateSlideScript = useCallback((index: number, updates: { title?: string; description?: string; visualPrompt?: string; mustKeepFacts?: string[] }) => {
        setSlides(prev => prev.map(s => s.index === index ? { ...s, ...updates } : s))
        setScriptSlides(prev => prev ? prev.map(s => s.index === index ? { ...s, ...updates } : s) : prev)
    }, [])

    const performAnalyze = useCallback(async (settings: CarouselSettings, silent = false, auditFlowId?: string) => {
        cancelAnalyzeRef.current = false
        if (!settings.prompt.trim() || !activeBrandKit || !aiConfig?.intelligenceModel) {
            if (!silent) {
                openErrorModal(
                    'Falta configuración de IA',
                    'No hay un modelo de inteligencia configurado en el panel de Admin.'
                )
            }
            return null
        }

        setIsAnalyzing(true)
        setGeneratedCount(0)
        setCurrentSlideIndex(0)
        setAspectRatio(settings.aspectRatio)
        setCarouselSettings(settings)
        setSuggestions([])
        setSlideVariantSelection([])
        setOriginalAnalysis(null)

        try {
            const effectiveAuditFlowId = auditFlowId || currentCreationFlowIdRef.current || createAuditFlowId('carousel_create')
            currentCreationFlowIdRef.current = effectiveAuditFlowId
            const result = await analyzeCarouselAction({
                prompt: settings.prompt,
                slideCount: settings.slideCount,
                brandDNA: activeBrandKit,
                intelligenceModel: aiConfig.intelligenceModel,
                selectedColors: settings.selectedColors,
                includeLogoOnSlides: settings.includeLogoOnSlides,
                selectedLogoUrl: settings.selectedLogoUrl,
                aiImageDescription: settings.aiImageDescription,
                auditFlowId: effectiveAuditFlowId
            })
            if (cancelAnalyzeRef.current) {
                return null
            }

            if (!result.success) {
                throw new Error(result.error || 'Error desconocido')
            }

            const requestedCount = Math.max(1, Math.min(15, settings.slideCount || 5))
            if (result.slides.length !== requestedCount) {
                throw new Error(`Guion incompleto: esperado ${requestedCount} slides, recibido ${result.slides.length}`)
            }

            if (cancelAnalyzeRef.current) {
                return null
            }

            setScriptSlides(result.slides)
            setScriptPrompt(settings.prompt)
            setScriptSlideCount(requestedCount)
            setCarouselSettings(settings)
            setAnalysisHook(result.hook)
            setAnalysisStructure(result.structure)
            setAnalysisIntent(result.detectedIntent)
            if (!isCaptionLocked) {
                setCaption(result.caption || '')
            }
            const mappedSlides = result.slides.map(s => ({
                index: s.index,
                title: s.title,
                description: s.description,
                status: 'pending' as const
            }))
            setSlides(mappedSlides)
            setSlideVariantSelection(Array.from({ length: result.slides.length }, () => 'original'))
            const nextSuggestions = Array.isArray(result.suggestions) ? result.suggestions : []
            const originalSignature = fingerprintSlides(result.slides)
            const filteredSuggestions = nextSuggestions.filter((suggestion) => {
                if (!suggestion?.slides) return false
                return fingerprintSlides(suggestion.slides) !== originalSignature
            })
            let finalImagePrompts = buildAiImageSuggestions(
                result.slides,
                filteredSuggestions.map((suggestion) => suggestion.slides)
            )
            try {
                const parsedIntent = await parseLazyIntentAction({
                    userText: settings.prompt,
                    brandDNA: activeBrandKit,
                    brandWebsite: activeBrandKit?.url,
                    intelligenceModel: aiConfig.intelligenceModel,
                    intentId: result.detectedIntent,
                    variationSeed: Date.now(),
                    previewTextContext: buildPreviewTextContext(result.slides),
                    auditFlowId: effectiveAuditFlowId
                })
                if (Array.isArray(parsedIntent.imagePromptSuggestions) && parsedIntent.imagePromptSuggestions.length > 0) {
                    finalImagePrompts = parsedIntent.imagePromptSuggestions.slice(0, 4)
                }
            } catch (error) {
            log.warn('CAROUSEL', 'Lazy intent fallback to local suggestions', error)
            }
            setImagePromptSuggestions(finalImagePrompts)
            setSuggestions(nextSuggestions)
            setSuggestions(filteredSuggestions)
            if (filteredSuggestions.length > 0) {
                setOriginalAnalysis({
                    slides: mappedSlides,
                    scriptSlides: result.slides,
                    hook: result.hook,
                    structure: result.structure,
                    detectedIntent: result.detectedIntent,
                    caption: result.caption
                })
            }

            if (!silent) {
                toast({
                    title: 'Guion listo',
                    description: 'Revisa la vista previa antes de generar.'
                })
            }

            return result.slides
        } catch (error) {
            if (cancelAnalyzeRef.current) {
                return null
            }
            log.error('CAROUSEL', 'Analyze action failed', error)
            if (!silent) {
                openErrorModal(
                    'Error al analizar',
                    error instanceof Error ? error.message : 'No se pudo analizar el carrusel.'
                )
            }
            return null
        } finally {
            setIsAnalyzing(false)
            if (cancelAnalyzeRef.current) {
                setIsCancelingAnalyze(false)
            }
        }
    }, [activeBrandKit, aiConfig?.intelligenceModel, buildAiImageSuggestions, buildPreviewTextContext, isCaptionLocked, toast])

    const handleCancelAnalyze = useCallback(() => {
        cancelAnalyzeRef.current = true
        setIsAnalyzing(false)
        setIsCancelingAnalyze(true)
        toast({
            title: 'Análisis detenido',
            description: 'Se canceló el análisis del prompt.'
        })
        setTimeout(() => setIsCancelingAnalyze(false), 800)
    }, [toast])

    const resolveStyleReferenceImageUrl = useCallback((settings: CarouselSettings): string | undefined => {
        if (referencePreviewState.selectedStylePresetImageUrl) {
            return referencePreviewState.selectedStylePresetImageUrl
        }

        const allSelectedReferences = [
            ...(referencePreviewState.uploadedImages || []),
            ...(referencePreviewState.selectedBrandKitImageIds || []),
        ]

        if (allSelectedReferences.length > 0) {
            const selectedSet = new Set(allSelectedReferences)
            const styleCandidate = Object.entries(referencePreviewState.referenceImageRoles || {}).find(([url, role]) =>
                selectedSet.has(url) && (role === 'style' || role === 'style_content')
            )?.[0]
            if (styleCandidate) return styleCandidate
        }

        const fallbackFromSettings = settings.selectedReferenceImages?.find((item) =>
            item.role === 'style' || item.role === 'style_content'
        )?.url || (settings.selectedImageUrls || [])[0]
        return fallbackFromSettings
    }, [
        referencePreviewState.referenceImageRoles,
        referencePreviewState.selectedBrandKitImageIds,
        referencePreviewState.selectedStylePresetImageUrl,
        referencePreviewState.uploadedImages
    ])

    const ensureStyleAnalysisInSettings = useCallback(async (settings: CarouselSettings, auditFlowId?: string): Promise<CarouselSettings> => {
        if (referencePreviewState.selectedStylePresetId && selectedStylePresetDetails?.analysis) {
            const presetStyleBlock = buildPriority5StyleBlockFromAnalysis(selectedStylePresetDetails.analysis as VisionAnalysis)
            if (presetStyleBlock) {
                return {
                    ...settings,
                    aiStyleDirectives: mergeCustomStyleIntoStyleDirectives(
                        presetStyleBlock,
                        settings.customStyleText?.trim() || ''
                    ),
                }
            }
        }

        const styleReferenceUrl = resolveStyleReferenceImageUrl(settings)
        if (!styleReferenceUrl) {
            return settings
        }

        // If controls panel already provided a computed style block, avoid duplicate analysis calls.
        if ((settings.aiStyleDirectives || '').trim().length > 0) {
            return settings
        }

        const cached = styleAnalysisCacheRef.current[styleReferenceUrl]
        if (cached) {
            const mergedCached = mergeCustomStyleIntoStyleDirectives(
                cached,
                settings.customStyleText?.trim() || ''
            )
            return { ...settings, aiStyleDirectives: mergedCached }
        }

        try {
            const body = styleReferenceUrl.startsWith('data:image/')
                ? { imageBase64: styleReferenceUrl, auditFlowId }
                : { imageUrl: styleReferenceUrl, auditFlowId }
            const response = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const result = await response.json()
            const analysis: VisionAnalysis | null = result?.success ? (result.data as VisionAnalysis) : null
            const priority5Block = buildPriority5StyleBlockFromAnalysis(analysis)
            if (!priority5Block) {
                return settings
            }
            styleAnalysisCacheRef.current[styleReferenceUrl] = priority5Block
            const mergedStyle = mergeCustomStyleIntoStyleDirectives(
                priority5Block,
                settings.customStyleText?.trim() || ''
            )
            return { ...settings, aiStyleDirectives: mergedStyle }
        } catch (error) {
            log.warn('CAROUSEL', 'Style analysis fallback failed', error)
            return settings
        }
    }, [referencePreviewState.selectedStylePresetId, resolveStyleReferenceImageUrl, selectedStylePresetDetails])

    const previewReferenceImages = useMemo(() => {
        const baseImages = [...referenceImages]
        const presetUrl = referencePreviewState.selectedStylePresetImageUrl
        if (!presetUrl) return baseImages
        if (baseImages.some((item) => item.url === presetUrl)) return baseImages
        return [...baseImages, { url: presetUrl, source: 'preset' as const }]
    }, [referenceImages, referencePreviewState.selectedStylePresetImageUrl])

    const previewReferenceImageRoles = useMemo(() => {
        const nextRoles = { ...referencePreviewState.referenceImageRoles }
        const presetUrl = referencePreviewState.selectedStylePresetImageUrl
        if (referencePreviewState.selectedStylePresetId && presetUrl) {
            nextRoles[presetUrl] = 'style'
        }
        return nextRoles
    }, [
        referencePreviewState.referenceImageRoles,
        referencePreviewState.selectedStylePresetId,
        referencePreviewState.selectedStylePresetImageUrl
    ])

    const compositionGhostIcon = useMemo(() => {
        const activeCompositionId = previewCompositionState.compositionId || carouselSettings?.compositionId
        if (!activeCompositionId) return null

        const composition = compositionsForDebug?.find((item) => item.composition_id === activeCompositionId)
        if (composition) {
            return resolveCarouselCompositionIcon({
                id: composition.composition_id,
                name: composition.name,
                description: composition.description,
                layoutPrompt: composition.layoutPrompt,
                icon: composition.icon,
                iconPrompt: composition.iconPrompt,
            })
        }

        return resolveCarouselCompositionIcon({ id: activeCompositionId })
    }, [previewCompositionState.compositionId, carouselSettings?.compositionId, compositionsForDebug])

    const activeComposition = useMemo(() => {
        const activeCompositionId = previewCompositionState.compositionId || carouselSettings?.compositionId
        if (!activeCompositionId) return null
        return compositionsForDebug?.find((item) => item.composition_id === activeCompositionId) || null
    }, [previewCompositionState.compositionId, carouselSettings?.compositionId, compositionsForDebug])

    const activeCompositionRecommendation = useMemo(() => {
        if (!activeComposition) return null
        return getCarouselCompositionRecommendation(activeComposition)
    }, [activeComposition])

    const handleAdminCompositionPatch = useCallback(async (patch: {
        mode?: 'basic' | 'advanced'
        scope?: 'global' | 'narrative'
        isActive?: boolean
    }) => {
        if (!isAdmin || !activeComposition) return
        try {
            await updateCarouselComposition({
                admin_email: 'juanfranbrv@gmail.com',
                id: activeComposition._id,
                mode: patch.mode,
                scope: patch.scope,
                structure_id: patch.scope === 'global'
                    ? undefined
                    : (activeComposition.structure_id || carouselSettings?.structureId || undefined),
                isActive: patch.isActive
            })

            toast({
                title: 'Composición actualizada',
                description: `${activeComposition.name} se ha actualizado en el catálogo.`
            })
        } catch (error) {
            toast({
                title: 'No se pudo actualizar la composición',
                description: error instanceof Error ? error.message : 'Inténtalo de nuevo.',
                variant: 'destructive'
            })
        }
    }, [activeComposition, carouselSettings?.structureId, isAdmin, toast, updateCarouselComposition])

    const handleApplyAutomaticRecommendation = useCallback(async () => {
        if (!activeComposition || !activeCompositionRecommendation) return
        await handleAdminCompositionPatch({
            mode: activeCompositionRecommendation.suggestedMode,
            scope: activeCompositionRecommendation.suggestedScope
        })
    }, [activeComposition, activeCompositionRecommendation, handleAdminCompositionPatch])

    const handleAnalyze = useCallback(async (settings: CarouselSettings) => {
        if (!settings.prompt.trim()) {
            openErrorModal('Error', 'Por favor, introduce un tema para el carrusel.')
            return
        }

        if (!activeBrandKit) {
            openErrorModal('Error', 'Selecciona un Brand Kit primero.')
            return
        }

        if (!aiConfig?.intelligenceModel) {
            openErrorModal(
                'Falta configuración de IA',
                'No hay un modelo de inteligencia configurado en el panel de Admin.'
            )
            return
        }
        const analyzeAuditFlowId = getOrCreateCreationFlowId()
        const settingsWithStyle = await ensureStyleAnalysisInSettings(settings, analyzeAuditFlowId)
        await performAnalyze(settingsWithStyle, false, analyzeAuditFlowId)
    }, [activeBrandKit, aiConfig?.intelligenceModel, ensureStyleAnalysisInSettings, performAnalyze])

    const applySuggestion = useCallback((index: number) => {
        const suggestion = suggestions[index]
        if (!suggestion) return
        const mappedSlides = suggestion.slides.map(s => ({
            index: s.index,
            title: s.title,
            description: s.description,
            status: 'pending' as const
        }))
        setSlides(mappedSlides)
        setScriptSlides(suggestion.slides)
        setScriptSlideCount(suggestion.slides.length)
        setImagePromptSuggestions(buildAiImageSuggestions(suggestion.slides))
        setAnalysisHook(suggestion.hook)
        setAnalysisStructure(suggestion.structure)
        setAnalysisIntent(suggestion.detectedIntent)
        setSlideVariantSelection(Array.from({ length: suggestion.slides.length }, () => `suggestion-${index}`))
        if (!isCaptionLocked) {
            setCaption(suggestion.caption || '')
        }
        toast({
            title: 'Sugerencia aplicada',
            description: 'Se han actualizado los textos del carrusel.'
        })
    }, [buildAiImageSuggestions, suggestions, isCaptionLocked, toast])

    const undoSuggestion = useCallback(() => {
        if (!originalAnalysis) return
        setSlides(originalAnalysis.slides)
        setScriptSlides(originalAnalysis.scriptSlides)
        setScriptSlideCount(originalAnalysis.scriptSlides.length)
        setImagePromptSuggestions(buildAiImageSuggestions(originalAnalysis.scriptSlides))
        setAnalysisHook(originalAnalysis.hook)
        setAnalysisStructure(originalAnalysis.structure)
        setAnalysisIntent(originalAnalysis.detectedIntent)
        setSlideVariantSelection(Array.from({ length: originalAnalysis.scriptSlides.length }, () => 'original'))
        if (!isCaptionLocked) {
            setCaption(originalAnalysis.caption || '')
        }
        toast({
            title: 'Cambios revertidos',
            description: 'Se ha vuelto al contenido original.'
        })
    }, [buildAiImageSuggestions, originalAnalysis, isCaptionLocked, toast])

    const applySlideVariant = useCallback((slideIndex: number, sourceId: string) => {
        const baseSlides = originalAnalysis?.scriptSlides || scriptSlides
        if (!baseSlides || baseSlides.length === 0) return

        const getSourceSlides = (id: string) => {
            if (id === 'original') return originalAnalysis?.scriptSlides || baseSlides
            const match = id.match(/^suggestion-(\d+)$/)
            if (!match) return null
            const suggestion = suggestions[Number(match[1])]
            return suggestion?.slides || null
        }

        const nextSelection = Array.from({ length: baseSlides.length }, (_, index) =>
            index === slideIndex ? sourceId : (slideVariantSelection[index] || 'original')
        )

        const remixedSlides = baseSlides.map((fallbackSlide, index) => {
            const sourceSlides = getSourceSlides(nextSelection[index])
            const sourceSlide = sourceSlides?.[index]
            return sourceSlide ? { ...sourceSlide, index } : { ...fallbackSlide, index }
        })

        setSlideVariantSelection(nextSelection)
        setScriptSlides(remixedSlides)
        setSlides(remixedSlides.map((slide) => ({
            index: slide.index,
            title: slide.title,
            description: slide.description,
            status: 'pending' as const
        })))
        setScriptSlideCount(remixedSlides.length)
        setImagePromptSuggestions(buildAiImageSuggestions(remixedSlides, suggestions.map((suggestion) => suggestion.slides)))

        toast({
            title: 'Slide ensamblada',
            description: 'El carrusel se ha recompuesto con tu mezcla de variantes.'
        })
    }, [originalAnalysis, scriptSlides, suggestions, slideVariantSelection, buildAiImageSuggestions, toast])

    const handleRegenerateCaption = useCallback(async () => {
        if (!carouselSettings || !activeBrandKit) return
        if (isCaptionLocked) return
        if (!aiConfig?.intelligenceModel) {
            openErrorModal(
                'Falta configuración de IA',
                'No hay un modelo de inteligencia configurado en el panel de Admin.'
            )
            return
        }

        setIsCaptionGenerating(true)
        try {
            const captionAuditFlowId = createAuditFlowId('carousel_caption')
            const result = await regenerateCarouselCaptionAction({
                prompt: carouselSettings.prompt,
                slideCount: carouselSettings.slideCount,
                brandDNA: activeBrandKit,
                intelligenceModel: aiConfig.intelligenceModel,
                selectedColors: carouselSettings.selectedColors,
                includeLogoOnSlides: carouselSettings.includeLogoOnSlides,
                selectedLogoUrl: carouselSettings.selectedLogoUrl,
                auditFlowId: captionAuditFlowId,
            })

            if (result.success && result.caption) {
                setCaption(result.caption)
            } else {
                throw new Error(result.error || 'No se pudo regenerar el caption.')
            }
        } catch (error) {
            log.error('CAROUSEL', 'Caption regeneration failed', error)
            openErrorModal(
                'Error',
                error instanceof Error ? error.message : 'No se pudo regenerar el caption.'
            )
        } finally {
            setIsCaptionGenerating(false)
        }
    }, [activeBrandKit, aiConfig?.intelligenceModel, carouselSettings, isCaptionLocked, toast])

    const buildSlidesFromCurrentState = useCallback((targetCount: number): SlideContent[] | null => {
        if (!Array.isArray(slides) || slides.length === 0) return null
        const normalized = slides
            .slice(0, targetCount)
            .map((slide, idx) => ({
                index: Number.isFinite(slide.index) ? slide.index : idx,
                title: (slide.title || '').trim(),
                description: (slide.description || '').trim(),
                visualPrompt: (slide.description || '').trim(),
            }))
            .filter((slide) => slide.title || slide.description || slide.visualPrompt)
        if (normalized.length === 0) return null
        return normalized
    }, [slides])

    const executeGenerate = useCallback(async (settings: CarouselSettings) => {
        cancelGenerationRef.current = false
        if (!settings.prompt.trim()) {
            openErrorModal('Error', 'Por favor, introduce un tema para el carrusel.')
            return
        }

        if (!activeBrandKit) {
            openErrorModal('Error', 'Selecciona un Brand Kit primero.')
            return
        }

        if (!aiConfig?.imageModel) {
            openErrorModal(
                'Falta configuración de IA',
                'No hay un modelo de imagen configurado en el panel de Admin.'
            )
            return
        }

        setIsGenerating(true)
        setGeneratedCount(0)
        setCurrentSlideIndex(0)
        setAspectRatio(settings.aspectRatio)
        setCarouselSettings(settings)

        try {
            const generationAuditFlowId = currentCreationFlowIdRef.current || createAuditFlowId('carousel_create')
            currentCreationFlowIdRef.current = generationAuditFlowId
            const slidesForGeneration =
                (scriptSlides && scriptSlides.length > 0 ? scriptSlides.slice(0, settings.slideCount) : null)
                || buildSlidesFromCurrentState(settings.slideCount)

            if (!slidesForGeneration) {
                throw new Error('No hay slides preparadas para generar. Pulsa "Analizar" primero.')
            }

            const normalizedSlides = slidesForGeneration.map(s => ({ ...s }))
            const slideOverrides = settings.slides
                .filter(s => s.customText)
                .map(s => ({ index: s.index, text: s.customText! }))

            slideOverrides.forEach(override => {
                if (normalizedSlides[override.index]) {
                    normalizedSlides[override.index] = {
                        ...normalizedSlides[override.index],
                        description: override.text,
                        visualPrompt: override.text
                    }
                }
            })

            const totalSlides = normalizedSlides.length
            const initialSlides: CarouselSlide[] = normalizedSlides.map((s) => ({
                index: s.index,
                title: s.title,
                description: s.description,
                status: 'pending' as const
            }))
            setSlides(initialSlides)

            const generatedImageUrls: string[] = []
            let latestSlidesSnapshot: CarouselSlide[] = [...initialSlides]
            let doneCount = 0

            for (let i = 0; i < totalSlides; i++) {
                if (cancelGenerationRef.current) {
                    break
                }
                const slideContent = normalizedSlides[i]
                setSlides(prev => prev.map(s => s.index === slideContent.index ? { ...s, status: 'generating' as const } : s))

                const consistencyRefUrls: string[] = []
                if (i > 0 && generatedImageUrls[0]) {
                    consistencyRefUrls.push(generatedImageUrls[0])
                }
                if (i > 0 && generatedImageUrls[i - 1]) {
                    consistencyRefUrls.push(generatedImageUrls[i - 1])
                }
                const selectedLogoUrl = shouldApplyPrimaryLogoToSlide(
                    settings.selectedLogoUrl,
                    settings.includeLogoOnSlides,
                    i,
                    totalSlides
                )
                    ? settings.selectedLogoUrl
                    : undefined

                const result = await regenerateSlideAction(
                    i,
                    slideContent,
                    totalSlides,
                    settings.prompt,
                    settings.style,
                    settings.aspectRatio,
                    activeBrandKit,
                    aiConfig.imageModel,
                    selectedLogoUrl,
                    settings.selectedColors,
                    settings.compositionId,
                    settings.structureId,
                    settings.aiStyleDirectives,
                    settings.applyStyleToTypography,
                    settings.selectedReferenceImages,
                    settings.selectedImageUrls,
                    consistencyRefUrls.length > 0 ? consistencyRefUrls : undefined,
                    generationAuditFlowId
                )

                if (cancelGenerationRef.current) {
                    break
                }

                if (result.success && result.imageUrl) {
                    generatedImageUrls.push(result.imageUrl)
                    doneCount += 1
                    setSlides(prev => prev.map(s => s.index === slideContent.index
                        ? {
                            ...s,
                            imageUrl: result.imageUrl,
                            status: 'done' as const,
                            debugPrompt: result.debugPrompt,
                            debugReferences: result.debugReferences
                        }
                        : s
                    ))
                    latestSlidesSnapshot = latestSlidesSnapshot.map(s => s.index === slideContent.index
                        ? {
                            ...s,
                            imageUrl: result.imageUrl,
                            status: 'done' as const,
                            debugPrompt: result.debugPrompt,
                            debugReferences: result.debugReferences
                        }
                        : s
                    )
                    setGeneratedCount(doneCount)
                    setCurrentSlideIndex(slideContent.index)
                } else {
                    const errorMessage = result.error || 'Error desconocido'
                    setSlides(prev => prev.map(s => s.index === slideContent.index ? { ...s, status: 'error' as const, error: errorMessage } : s))
                    latestSlidesSnapshot = latestSlidesSnapshot.map(s => s.index === slideContent.index ? { ...s, status: 'error' as const, error: errorMessage } : s)
                }
            }

            if (cancelGenerationRef.current) {
                toast({
                    title: 'Generación detenida',
                    description: 'Se canceló la generación del carrusel.'
                })
            } else {
                if (doneCount > 0) {
                    setSessionHistory((prev) => [
                        {
                            id: `carousel-${Date.now()}`,
                            createdAt: new Date().toISOString(),
                            slides: latestSlidesSnapshot,
                            caption
                        },
                        ...prev
                    ])
                }
            }

        } catch (error) {
            if (cancelGenerationRef.current) {
                return
            }
            log.error('CAROUSEL', 'Generate action failed', error)
            openErrorModal(
                'Error al generar',
                error instanceof Error ? error.message : 'No se pudo generar el carrusel.'
            )
        } finally {
            setIsGenerating(false)
            currentCreationFlowIdRef.current = undefined
            if (cancelGenerationRef.current) {
                setIsCancelingGenerate(false)
            }
        }
    }, [activeBrandKit, aiConfig?.imageModel, buildSlidesFromCurrentState, scriptSlides, toast, caption])

    const handleCancelGenerate = useCallback(() => {
        cancelGenerationRef.current = true
        setIsGenerating(false)
        setSlides(prev => prev.map(s => s.status === 'generating' ? { ...s, status: 'pending' as const } : s))
        setIsCancelingGenerate(true)
        toast({
            title: 'Generación detenida',
            description: 'Se canceló la generación del carrusel.'
        })
        setTimeout(() => setIsCancelingGenerate(false), 800)
    }, [toast])

    const handleGenerate = useCallback(async (settings: CarouselSettings) => {
        if (!settings.prompt.trim()) {
            openErrorModal('Error', 'Por favor, introduce un tema para el carrusel.')
            return
        }

        if (!activeBrandKit) {
            openErrorModal('Error', 'Selecciona un Brand Kit primero.')
            return
        }

        if (!aiConfig?.imageModel) {
            openErrorModal(
                'Falta configuración de IA',
                'No hay un modelo de imagen configurado en el panel de Admin.'
            )
            return
        }

        const generateAuditFlowId = getOrCreateCreationFlowId()
        const settingsWithStyle = await ensureStyleAnalysisInSettings(settings, generateAuditFlowId)

        if (!isAdmin) {
            await executeGenerate(settingsWithStyle)
            return
        }

        const slidesForPrompt =
            (scriptSlides && scriptSlides.length > 0 ? scriptSlides.slice(0, settingsWithStyle.slideCount) : null)
            || buildSlidesFromCurrentState(settingsWithStyle.slideCount)

        if (!slidesForPrompt) {
            openErrorModal('Error', 'No hay slides preparadas para el preview. Pulsa "Analizar" primero.')
            return
        }

        // Import buildFinalPrompt and getMoodForSlide for accurate debug
        const { buildFinalPrompt, generateCarouselSeed } = await import('@/lib/prompts/carousel/builder/final-prompt')
        const { getMoodForSlide } = await import('@/lib/prompts/carousel/mood')

        const compositionPreset = settings.structureId
            ? compositionsForDebug?.find((c) => c.composition_id === settingsWithStyle.compositionId)
            : undefined
        const resolvedCompositionPreset = compositionPreset || {
            layoutPrompt: "Standard clean social media composition with clear text area.",
            name: "Free Layout"
        }

        // Extract brand colors for injection with role-based helper
        const findColors = (role: string, fallback: string) => {
            const fromRole = (settingsWithStyle.selectedColors || [])
                .filter((entry) => entry?.role === role)
                .map((entry) => (entry?.color || '').trim())
                .filter(Boolean)
            if (fromRole.length === 0) return [fallback]
            return Array.from(new Set(fromRole))
        }

        const brandColors = {
            background: findColors('Fondo', '#141210'),
            accent: findColors('Acento', '#F0E500'),
            text: findColors('Texto', '#FFFFFF')
        }

        const seed = generateCarouselSeed()
        const slideCount = slidesForPrompt.length

        // Build per-slide debug info
        const slideDebug = slidesForPrompt.map((slide, idx) => {
            const currentMood = getMoodForSlide(idx, slideCount)
            const isLastSlide = idx === slideCount - 1
            const hasLayoutConsistencyRef = idx > 0
            const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|es|org|net|io|co)[^\s]*)/i
            const urlMatch = slide.description?.match(urlPattern)
            const extractedUrl = urlMatch ? urlMatch[0] : undefined
            const brandUrl = activeBrandKit?.url?.trim()
            const finalUrl = brandUrl || extractedUrl
            const includePrimaryLogo = shouldApplyPrimaryLogoToSlide(
                settingsWithStyle.selectedLogoUrl,
                settingsWithStyle.includeLogoOnSlides,
                idx,
                slideCount
            )
            const auxiliaryLogoCount = (settingsWithStyle.selectedReferenceImages || [])
                .filter((item) => item.role === 'logo').length
            const prompt = buildFinalPrompt({
                composition: resolvedCompositionPreset as any,
                brandColors,
                slideData: slide,
                currentMood,
                currentSlide: idx + 1,
                totalSlides: slideCount,
                logoPosition: extractLogoPosition(resolvedCompositionPreset?.layoutPrompt || ''),
                includeLogo: includePrimaryLogo,
                includeAuxiliaryLogos: includePrimaryLogo && auxiliaryLogoCount > 0,
                auxiliaryLogoCount,
                isSequentialSlide: idx > 0,
                ctaText: isLastSlide ? (slide.title || 'Más info') : undefined,
                ctaUrl: isLastSlide ? finalUrl : undefined,
                visualAnalysis: settingsWithStyle?.aiStyleDirectives,
                language: detectLanguageFromParts(
                    [
                        settingsWithStyle.prompt,
                        slide.title,
                        slide.description,
                        slide.visualPrompt
                    ],
                    activeBrandKit?.preferred_language || 'es'
                ),
                fonts: activeBrandKit?.fonts as any,
                applyStyleToTypography: settingsWithStyle.applyStyleToTypography
            })

            // Build references array
            const references: Array<{ type: string; label: string; weight: number; url: string }> = []
            settingsWithStyle.selectedReferenceImages?.forEach((item, refIndex) => {
                if (item.role === 'logo' && !includePrimaryLogo) return
                const shortUrl = item.url.length > 50 ? `${item.url.substring(0, 50)}...` : item.url
                references.push({
                    type: item.role === 'logo' ? 'aux_logo' : 'image',
                    label:
                        item.role === 'style' || item.role === 'style_content'
                            ? 'Referencia de estilo'
                            : item.role === 'logo'
                                ? `Logo auxiliar ${refIndex + 1} (solo junto al principal)`
                                : `Referencia ${refIndex + 1}`,
                    weight: getDebugReferenceWeight(item.role, hasLayoutConsistencyRef),
                    url: shortUrl
                })
            })
            if (idx > 0) {
                references.push({
                    type: 'image',
                    label: 'Slide 1 Style Reference',
                    weight: 0.4,
                    url: '(Generated from Slide 1)'
                })
            }
            if (includePrimaryLogo && settingsWithStyle.selectedLogoUrl) {
                references.push({
                    type: 'logo',
                    label: 'Brand Logo',
                    weight: 1.0,
                    url: settingsWithStyle.selectedLogoUrl.length > 50
                        ? settingsWithStyle.selectedLogoUrl.substring(0, 50) + '...'
                        : settingsWithStyle.selectedLogoUrl
                })
            }

            return {
                slideNumber: idx + 1,
                prompt,
                mood: currentMood,
                references
            }
        })

        const finalPrompt = slideDebug
            .map((s) => `--- SLIDE ${s.slideNumber} ---\n${s.prompt}`)
            .join('\n\n')

        const showAuxiliaryLogosInDebug = Boolean(settingsWithStyle.selectedLogoUrl)
        const debugContextItems = [
            ...(settingsWithStyle.selectedReferenceImages || [])
                .filter((item) => item.role !== 'logo' || showAuxiliaryLogosInDebug)
                .map((item, idx) => ({
                id: `carousel-ref-${idx}`,
                type: item.role === 'logo' ? 'aux_logo' : 'image',
                label:
                    item.role === 'style' || item.role === 'style_content'
                        ? 'Referencia de estilo'
                        : item.role === 'logo'
                            ? `Logo auxiliar ${idx + 1} (solo junto al principal)`
                            : `Referencia ${idx + 1}`,
                url: item.url,
                source: 'unknown' as const,
                role: item.role,
            })),
            ...(settingsWithStyle.selectedLogoUrl ? [{
                id: 'carousel-logo',
                type: 'logo',
                label: 'Logo',
                url: settingsWithStyle.selectedLogoUrl,
                source: 'brandkit' as const,
                role: 'logo' as const,
            }] : []),
        ]

        const requestPayloadForDebug = {
            prompt: finalPrompt,
            model: aiConfig?.imageModel,
            aspectRatio: settingsWithStyle.aspectRatio,
            layoutId: settingsWithStyle.compositionId,
            layoutName: resolvedCompositionPreset.name,
            brandDNA: activeBrandKit,
            context: debugContextItems.map((item) => ({
                id: item.id,
                type: item.type,
                label: item.label,
                value: item.url
            })),
            slideDebug
        }

        setDebugPromptData({
            finalPrompt,
            logoUrl: settingsWithStyle.selectedLogoUrl,
            attachedImages: settingsWithStyle.selectedReferenceImages?.map((item) => item.url) || settingsWithStyle.selectedImageUrls,
            selectedStyles: [settingsWithStyle.style],
            platform: 'Instagram Carousel',
            format: settingsWithStyle.aspectRatio,
            intent: analysisIntentLabel || analysisIntent || undefined,
            seed,
            model: aiConfig?.imageModel,
            aspectRatio: settingsWithStyle.aspectRatio,
            layoutId: settingsWithStyle.compositionId,
            layoutName: resolvedCompositionPreset.name,
            contextItems: debugContextItems,
            requestPayload: requestPayloadForDebug,
            slideDebug
        })
        setPendingGenerateSettings(settingsWithStyle)
        setShowDebugModal(true)
    }, [
        activeBrandKit,
        aiConfig?.imageModel,
        analysisIntent,
        analysisIntentLabel,
        executeGenerate,
        isAdmin,
        buildSlidesFromCurrentState,
        ensureStyleAnalysisInSettings,
        openErrorModal,
        scriptSlides,
        toast
    ])

    const handleRegenerateSlide = useCallback(async (index: number, correctionPrompt?: string) => {
        if (!carouselSettings || !activeBrandKit) return

        const slide = slides[index]
        if (!slide) return

        setIsRegenerating(true)
        setRegeneratingIndex(index)

        try {
            const slideContent: SlideContent = {
                index: slide.index,
                title: slide.title,
                description: slide.description,
                visualPrompt: correctionPrompt?.trim()
                    ? `${slide.description}\n\nCorrección local solicitada: ${correctionPrompt.trim()}`
                    : slide.description
            }

            if (!aiConfig?.imageModel) {
                throw new Error('Missing image model configuration')
            }

            const selectedLogoUrl = shouldApplyPrimaryLogoToSlide(
                carouselSettings.selectedLogoUrl,
                carouselSettings.includeLogoOnSlides,
                index,
                slides.length
            )
                ? carouselSettings.selectedLogoUrl
                : undefined
            const consistencyRefUrls: string[] = []
            const firstSlideImageUrl = slides[0]?.imageUrl
            if (index > 0 && firstSlideImageUrl) {
                consistencyRefUrls.push(firstSlideImageUrl)
            }
            const previousSlideImageUrl = slides[index - 1]?.imageUrl
            if (index > 0 && previousSlideImageUrl) {
                consistencyRefUrls.push(previousSlideImageUrl)
            }

            const result = await regenerateSlideAction(
                index,
                slideContent,
                slides.length,
                carouselSettings.prompt,
                carouselSettings.style,
                carouselSettings.aspectRatio,
                activeBrandKit,
                aiConfig.imageModel,
                selectedLogoUrl,
                carouselSettings.selectedColors,
                carouselSettings.compositionId,
                carouselSettings.structureId,
                carouselSettings.aiStyleDirectives,
                carouselSettings.applyStyleToTypography,
                carouselSettings.selectedReferenceImages,
                carouselSettings.selectedImageUrls,
                consistencyRefUrls.length > 0 ? consistencyRefUrls : undefined,
                createAuditFlowId('carousel_regenerate')
            )

            if (result.success && result.imageUrl) {
                const newSlides = [...slides]
                newSlides[index] = {
                    ...newSlides[index],
                    imageUrl: result.imageUrl,
                    status: 'done',
                    debugPrompt: result.debugPrompt,
                    debugReferences: result.debugReferences
                }
                setSlides(newSlides)
                toast({
                    title: 'Slide regenerado',
                    description: `Slide ${index + 1} actualizado.`
                })
            } else {
                throw new Error(result.error || 'Error desconocido')
            }

        } catch (error) {
            log.error('CAROUSEL', 'Slide regeneration failed', error)
            openErrorModal(
                'Error',
                error instanceof Error ? error.message : 'No se pudo regenerar el slide.'
            )
        } finally {
            setIsRegenerating(false)
            setRegeneratingIndex(null)
        }
    }, [slides, carouselSettings, activeBrandKit, aiConfig?.imageModel, toast])

    const handleSelectSessionHistory = useCallback((id: string) => {
        const selected = sessionHistory.find((item) => item.id === id)
        if (!selected) return
        setSlides(selected.slides)
        setGeneratedCount(selected.slides.filter((s) => Boolean(s.imageUrl)).length)
        setCurrentSlideIndex(0)
        if (!isCaptionLocked) {
            setCaption(selected.caption || '')
        }
    }, [sessionHistory, isCaptionLocked])

    const handleRestorePreviewFromPreset = useCallback((state: {
        slides: CarouselSlide[]
        scriptSlides?: SlideContent[]
        caption?: string
        currentIndex?: number
        sessionHistory?: Array<{
            id: string
            createdAt: string
            slides: CarouselSlide[]
            caption?: string
        }>
    }) => {
        const restoredSlides = Array.isArray(state.slides) ? state.slides : []
        setSlides(restoredSlides)
        setGeneratedCount(restoredSlides.filter((s) => Boolean(s.imageUrl)).length)
        setCurrentSlideIndex(Math.max(0, Math.min((state.currentIndex ?? 0), Math.max(0, restoredSlides.length - 1))))

        const restoredScript = Array.isArray(state.scriptSlides)
            ? state.scriptSlides
            : restoredSlides.map((s) => ({
                index: s.index,
                title: s.title || '',
                description: s.description || '',
                visualPrompt: s.description || '',
                mustKeepFacts: 'mustKeepFacts' in s && Array.isArray(s.mustKeepFacts)
                    ? s.mustKeepFacts
                    : []
            }))
        setScriptSlides(restoredScript)
        setScriptSlideCount(restoredScript.length)

        if (!isCaptionLocked) {
            setCaption(state.caption || '')
        }

        if (Array.isArray(state.sessionHistory)) {
            setSessionHistory(state.sessionHistory)
        }
    }, [isCaptionLocked])

    const handleResetCarousel = useCallback(() => {
        setSlides([])
        setGeneratedCount(0)
        setCurrentSlideIndex(0)
        setCaption('')
        setIsCaptionLocked(false)
        setIsCaptionGenerating(false)
        setReferenceImages([])
        setCarouselSettings(null)
        setScriptSlides(null)
        setScriptPrompt('')
        setScriptSlideCount(null)
        setAnalysisHook(undefined)
        setAnalysisStructure(undefined)
        setAnalysisIntent(undefined)
        setImagePromptSuggestions([])
        setSessionHistory([])
        setPendingGenerateSettings(null)
        setDebugPromptData(null)
        setShowDebugModal(false)
    }, [])

    const invalidatePreview = useCallback(() => {
        const scriptSource = Array.isArray(scriptSlides) && scriptSlides.length > 0
            ? scriptSlides
            : null

        if (scriptSource) {
            const pendingSlides: CarouselSlide[] = scriptSource.map((slide, idx) => ({
                index: Number.isFinite(slide.index) ? slide.index : idx,
                title: slide.title || '',
                description: slide.description || '',
                status: 'pending' as const
            }))
            setSlides(pendingSlides)
        } else if (Array.isArray(slides) && slides.length > 0) {
            const pendingSlides: CarouselSlide[] = slides.map((slide, idx) => ({
                index: Number.isFinite(slide.index) ? slide.index : idx,
                title: slide.title || '',
                description: slide.description || '',
                status: 'pending' as const
            }))
            setSlides(pendingSlides)
        } else {
            setSlides([])
        }

        setGeneratedCount(0)
        setCurrentSlideIndex(0)
    }, [scriptSlides, slides])

    const confirmGeneration = useCallback(async () => {
        setShowDebugModal(false)
        if (pendingGenerateSettings) {
            await executeGenerate(pendingGenerateSettings)
            setPendingGenerateSettings(null)
            setDebugPromptData(null)
        }
    }, [executeGenerate, pendingGenerateSettings])

    const cancelGeneration = useCallback(() => {
        setShowDebugModal(false)
        setPendingGenerateSettings(null)
        setDebugPromptData(null)
    }, [])

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
            onBrandDelete={deleteBrandKitById}
            onNewBrandKit={handleNewBrandKit}
        >
            <div className={cn(
                "flex h-full flex-col lg:flex-row",
                panelPosition === 'right' ? "lg:flex-row" : "lg:flex-row-reverse"
            )}>
                {/* Canvas + Caption */}
                <div className="flex-1 flex flex-col min-h-0">
                    {isAdmin && activeComposition && activeCompositionRecommendation && (
                        <div className="shrink-0 px-4 pt-4 md:px-6">
                            <details className="rounded-2xl border border-border/70 bg-background/90 shadow-sm backdrop-blur-sm" open>
                                <summary className="cursor-pointer list-none p-3">
                                    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="outline" className="gap-1">
                                                    <Sparkles className="h-3 w-3" />
                                                    Admin composición
                                                </Badge>
                                                <Badge variant={activeComposition.isActive ? 'default' : 'destructive'}>
                                                    {activeComposition.isActive ? 'Activa' : 'Inactiva'}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">Mostrar / ocultar</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{activeComposition.name}</p>
                                                <p className="text-xs font-mono text-muted-foreground">{activeComposition.composition_id}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span>Ahora:</span>
                                                <Badge variant="secondary">{activeComposition.mode}</Badge>
                                                <Badge variant="outline">{activeComposition.scope}</Badge>
                                                <span className="text-muted-foreground/70">→</span>
                                                <span>Propuesta:</span>
                                                <Badge
                                                    variant={activeCompositionRecommendation.shouldChangeMode ? 'default' : 'secondary'}
                                                >
                                                    {activeCompositionRecommendation.suggestedMode}
                                                </Badge>
                                                <Badge
                                                    variant={activeCompositionRecommendation.shouldChangeScope ? 'default' : 'outline'}
                                                >
                                                    {activeCompositionRecommendation.suggestedScope}
                                                </Badge>
                                                {!activeCompositionRecommendation.shouldChangeAnything && (
                                                    <span>Sin cambio sugerido.</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-xs leading-relaxed text-muted-foreground xl:max-w-md">
                                            <p className="font-medium text-foreground">Qué estás viendo aquí</p>
                                            <p>
                                                Las etiquetas de `Ahora` son el estado guardado de la composición. Las de `Propuesta`
                                                son solo la recomendación automática. No cambia nada hasta que pulses un botón.
                                            </p>
                                        </div>
                                    </div>
                                </summary>

                                <div className="border-t border-border/70 px-3 pb-3 pt-3">
                                    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
                                        <div className="space-y-3">
                                            <div className="rounded-xl border border-border bg-muted/20 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                                    Estado actual
                                                </p>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Esta composición está guardada ahora mismo como
                                                    {' '}
                                                    <span className="font-medium text-foreground">{activeComposition.mode}</span>
                                                    {' + '}
                                                    <span className="font-medium text-foreground">{activeComposition.scope}</span>
                                                    .
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                    `basic` entra en autoselección. `advanced` solo aparece al trabajar en modo avanzado.
                                                    `global` puede reutilizarse en cualquier narrativa. `narrative` solo dentro de su narrativa.
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-border bg-muted/20 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                                    Propuesta automática
                                                </p>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    La heurística propone dejarla como
                                                    {' '}
                                                    <span className="font-medium text-foreground">{activeCompositionRecommendation.suggestedMode}</span>
                                                    {' + '}
                                                    <span className="font-medium text-foreground">{activeCompositionRecommendation.suggestedScope}</span>
                                                    .
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                    {activeCompositionRecommendation.reasoning.join(' ')}
                                                </p>
                                                <p className="mt-2 text-[11px] text-muted-foreground/80">
                                                    Score: basic {activeCompositionRecommendation.scores.basic}
                                                    {' · '}
                                                    advanced {activeCompositionRecommendation.scores.advanced}
                                                    {' · '}
                                                    global {activeCompositionRecommendation.scores.global}
                                                    {' · '}
                                                    narrative {activeCompositionRecommendation.scores.narrative}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="rounded-xl border border-border bg-muted/20 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                                    Cambios manuales
                                                </p>
                                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                                    Estos botones cambian directamente el estado guardado de la composición activa.
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant={activeComposition.mode === 'basic' ? 'default' : 'outline'}
                                                        onClick={() => void handleAdminCompositionPatch({ mode: 'basic' })}
                                                    >
                                                        Básico
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={activeComposition.mode === 'advanced' ? 'default' : 'outline'}
                                                        onClick={() => void handleAdminCompositionPatch({ mode: 'advanced' })}
                                                    >
                                                        Avanzado
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={activeComposition.scope === 'global' ? 'default' : 'outline'}
                                                        onClick={() => void handleAdminCompositionPatch({ scope: 'global' })}
                                                    >
                                                        <Layers3 className="mr-1 h-4 w-4" />
                                                        Global
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={activeComposition.scope === 'narrative' ? 'secondary' : 'outline'}
                                                        onClick={() => void handleAdminCompositionPatch({ scope: 'narrative' })}
                                                    >
                                                        Narrativa actual
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={activeComposition.isActive ? 'outline' : 'destructive'}
                                                        onClick={() => void handleAdminCompositionPatch({ isActive: !activeComposition.isActive })}
                                                    >
                                                        <Power className="mr-1 h-4 w-4" />
                                                        {activeComposition.isActive ? 'Desactivar' : 'Activar'}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-border bg-muted/20 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                                    Atajo automático
                                                </p>
                                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                                    Este botón aplica exactamente la propuesta automática sobre la composición activa.
                                                </p>
                                                <Button
                                                    size="sm"
                                                    className="mt-3 w-full"
                                                    disabled={!activeCompositionRecommendation.shouldChangeAnything}
                                                    onClick={() => void handleApplyAutomaticRecommendation()}
                                                >
                                                    <Wand2 className="mr-1 h-4 w-4" />
                                                    {activeCompositionRecommendation.shouldChangeAnything
                                                        ? 'Aplicar sugerencia automática'
                                                        : 'La composición ya coincide con la sugerencia'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    )}
                    <CarouselCanvasPanel
                        slides={slides}
                        scriptSlides={scriptSlides}
                        currentIndex={currentSlideIndex}
                        onSelectSlide={setCurrentSlideIndex}
                        onRegenerateSlide={handleRegenerateSlide}
                        sessionHistory={sessionHistory}
                        onSelectSessionHistory={handleSelectSessionHistory}
                        onUpdateSlideScript={handleUpdateSlideScript}
                        isGenerating={isGenerating}
                        isRegenerating={isRegenerating}
                        regeneratingIndex={regeneratingIndex}
                        aspectRatio={aspectRatio}
                        caption={caption}
                        onCaptionChange={setCaption}
                        onRegenerateCaption={handleRegenerateCaption}
                        isCaptionGenerating={isCaptionGenerating}
                        isCaptionLocked={isCaptionLocked}
                        onToggleCaptionLock={() => setIsCaptionLocked(!isCaptionLocked)}
                        referenceImages={previewReferenceImages}
                        referenceImageRoles={previewReferenceImageRoles}
                        referenceImageMode={referencePreviewState.imageSourceMode}
                        brandKitTexts={brandKitTexts}
                        brandName={activeBrandKit?.brand_name}
                        hook={analysisHook}
                        selectedLogoUrl={selectedLogoUrl}
                        showPrimaryLogoOnCurrentSlide={shouldApplyPrimaryLogoToSlide(
                            selectedLogoUrl,
                            carouselSettings?.includeLogoOnSlides,
                            currentSlideIndex,
                            Math.max(slides.length, 1)
                        )}
                        compositionGhostIcon={compositionGhostIcon || undefined}
                        isAdmin={Boolean(isAdmin)}
                    />
                </div>

                <FeedbackButton
                    show={slides.some(slide => Boolean(slide.imageUrl))}
                    brandId={activeBrandKit?.id as Id<"brand_dna"> | undefined}
                    intent={analysisIntent || undefined}
                    layout={carouselSettings?.compositionId}
                    className={cn(
                        "z-50 transition-all duration-300",
                        isMobile
                            ? "fixed bottom-24 right-4"
                            : cn(
                                "absolute top-[30%] -translate-y-1/2",
                                panelPosition === 'right' ? "right-[28%]" : "left-[28%]"
                            )
                    )}
                />

                {/* Controls Panel (Right Side) */}
                <CarouselControlsPanel
                    onAnalyze={handleAnalyze}
                    onGenerate={handleGenerate}
                    onPreviewCompositionChange={setPreviewCompositionState}
                    onCancelAnalyze={handleCancelAnalyze}
                    onCancelGenerate={handleCancelGenerate}
                    isCancelingAnalyze={isCancelingAnalyze}
                    isCancelingGenerate={isCancelingGenerate}
                    onAspectRatioChange={setAspectRatio}
                    onReferenceImagesChange={setReferenceImages}
                    onSelectedLogoChange={(_, logoUrl) => setSelectedLogoUrl(logoUrl)}
                    onReset={handleResetCarousel}
                    userId={user?.id}
                    isAnalyzing={isAnalyzing}
                    isGenerating={isGenerating}
                    currentSlideIndex={currentSlideIndex}
                    generatedCount={generatedCount}
                    totalSlides={slides.length || 5}
                    brandKit={activeBrandKit}
                    suggestions={suggestions}
                    onApplySuggestion={applySuggestion}
                    onApplySlideVariant={applySlideVariant}
                    onUndoSuggestion={undoSuggestion}
                    hasOriginalSuggestion={!!originalAnalysis}
                    slideVariantSelection={slideVariantSelection}
                    suggestedImagePrompts={imagePromptSuggestions}
                    analysisHook={analysisHook}
                    analysisStructure={analysisStructure}
                    analysisIntent={analysisIntent}
                    analysisIntentLabel={analysisIntentLabel}
                    isAdmin={isAdmin}
                    slideCountOverride={slideCountOverride}
                    onSlideCountOverrideApplied={() => setSlideCountOverride(null)}
                    analysisReady={Boolean(scriptSlides?.length)}
                    onInvalidatePreview={invalidatePreview}
                    onReferencePreviewStateChange={setReferencePreviewState}
                    previewSlides={slides}
                    previewScriptSlides={scriptSlides}
                    originalScriptSlides={originalAnalysis?.scriptSlides || scriptSlides}
                    previewCaption={caption}
                    previewCurrentIndex={currentSlideIndex}
                    previewSessionHistory={sessionHistory}
                    onRestorePreviewState={handleRestorePreviewFromPreset}
                    getAuditFlowId={getOrCreateCreationFlowId}
                />
            </div>

            <PromptDebugModal
                open={showDebugModal}
                onClose={cancelGeneration}
                onConfirm={confirmGeneration}
                promptData={debugPromptData}
            />

            <Dialog open={errorModal.open} onOpenChange={(open) => setErrorModal(prev => ({ ...prev, open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            {errorModal.title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground whitespace-pre-wrap">
                            {errorModal.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        {errorModal.suggestedSlideCount ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSlideCountOverride(errorModal.suggestedSlideCount || null)
                                    setErrorModal(prev => ({ ...prev, open: false }))
                                }}
                            >
                                Ajustar a {errorModal.suggestedSlideCount} diapositivas
                            </Button>
                        ) : null}
                        <Button onClick={() => setErrorModal(prev => ({ ...prev, open: false }))}>
                            Entendido
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}

