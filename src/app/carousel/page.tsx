'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useUser } from '@clerk/nextjs'
import {
    CarouselControlsPanel,
    CarouselSettings
} from '@/components/studio/carousel/CarouselControlsPanel'
import { CarouselCanvasPanel } from '@/components/studio/carousel/CarouselCanvasPanel'
import {
    generateCarouselAction,
    analyzeCarouselAction,
    regenerateSlideAction,
    regenerateCarouselCaptionAction,
    CarouselSlide,
    SlideContent
} from '@/app/actions/generate-carousel'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { INTENT_CATALOG } from '@/lib/creation-flow-types'
import { PromptDebugModal } from '@/components/studio/modals/PromptDebugModal'
import type { DebugPromptData } from '@/lib/creation-flow-types'
import { buildCarouselImagePrompt } from '@/lib/prompts/carousel-image'
import { buildCarouselBrandContext } from '@/lib/carousel-brand-context'
import { getNarrativeComposition } from '@/lib/carousel-structures'
import { extractLogoPosition } from '@/lib/prompts/carousel/builder/final-prompt'

export default function CarouselPage() {
    const router = useRouter()
    const { user } = useUser()
    const { activeBrandKit, brandKits, setActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const { toast } = useToast()
    const aiConfig = useQuery(api.settings.getAIConfig)

    useEffect(() => {
        document.title = 'X Carrusel | Motor de Diseño Inteligente'
    }, [])

    const handleNewBrandKit = () => {
        router.push('/brand-kit/new')
    }


    const [isGenerating, setIsGenerating] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [generatedCount, setGeneratedCount] = useState(0)
    const [slides, setSlides] = useState<CarouselSlide[]>([])
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '3:4'>('3:4')
    const [carouselSettings, setCarouselSettings] = useState<CarouselSettings | null>(null)
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
    const [selectedLogoUrl, setSelectedLogoUrl] = useState<string | undefined>(undefined)
    const [showDebugModal, setShowDebugModal] = useState(false)
    const [debugPromptData, setDebugPromptData] = useState<DebugPromptData | null>(null)
    const [pendingGenerateSettings, setPendingGenerateSettings] = useState<CarouselSettings | null>(null)

    const isAdmin = user?.emailAddresses?.some(
        email => email.emailAddress === 'juanfranbrv@gmail.com'
    ) ?? false

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

    const handleUpdateSlideScript = useCallback((index: number, updates: { title?: string; description?: string }) => {
        setSlides(prev => prev.map(s => s.index === index ? { ...s, ...updates } : s))
        setScriptSlides(prev => prev ? prev.map(s => s.index === index ? { ...s, ...updates } : s) : prev)
    }, [])

    const performAnalyze = useCallback(async (settings: CarouselSettings, silent = false) => {
        if (!settings.prompt.trim() || !activeBrandKit || !aiConfig?.intelligenceModel) {
            if (!silent) {
                toast({
                    title: 'Falta configuracion de IA',
                    description: 'No hay un modelo de inteligencia configurado en el panel de Admin.',
                    variant: 'destructive'
                })
            }
            return null
        }

        setIsAnalyzing(true)
        setGeneratedCount(0)
        setCurrentSlideIndex(0)
        setAspectRatio(settings.aspectRatio)
        setCarouselSettings(settings)

        try {
            const result = await analyzeCarouselAction({
                prompt: settings.prompt,
                slideCount: settings.slideCount,
                brandDNA: activeBrandKit,
                intelligenceModel: aiConfig.intelligenceModel,
                selectedColors: settings.selectedColors,
                includeLogoOnSlides: settings.includeLogoOnSlides,
                selectedLogoUrl: settings.selectedLogoUrl,
                aiImageDescription: settings.aiImageDescription
            })
            if (!result.success) {
                throw new Error(result.error || 'Error desconocido')
            }

            const requestedCount = Math.max(1, Math.min(15, settings.slideCount || 5))
            if (result.slides.length !== requestedCount) {
                throw new Error(`Guion incompleto: esperado ${requestedCount} slides, recibido ${result.slides.length}`)
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
            setSlides(result.slides.map(s => ({
                index: s.index,
                title: s.title,
                description: s.description,
                status: 'pending' as const
            })))

            if (!silent) {
                toast({
                    title: 'Guion listo',
                    description: 'Revisa la vista previa antes de generar.'
                })
            }

            return result.slides
        } catch (error) {
            console.error('Carousel analysis error:', error)
            if (!silent) {
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'No se pudo analizar el carrusel.',
                    variant: 'destructive'
                })
            }
            return null
        } finally {
            setIsAnalyzing(false)
        }
    }, [activeBrandKit, aiConfig?.intelligenceModel, isCaptionLocked, toast])

    const handleAnalyze = useCallback(async (settings: CarouselSettings) => {
        if (!settings.prompt.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, introduce un tema para el carrusel.',
                variant: 'destructive'
            })
            return
        }

        if (!activeBrandKit) {
            toast({
                title: 'Error',
                description: 'Selecciona un Brand Kit primero.',
                variant: 'destructive'
            })
            return
        }

        if (!aiConfig?.intelligenceModel) {
            toast({
                title: 'Falta configuracion de IA',
                description: 'No hay un modelo de inteligencia configurado en el panel de Admin.',
                variant: 'destructive'
            })
            return
        }
        await performAnalyze(settings)
    }, [activeBrandKit, aiConfig?.intelligenceModel, performAnalyze, toast])

    const handleRegenerateCaption = useCallback(async () => {
        if (!carouselSettings || !activeBrandKit) return
        if (isCaptionLocked) return
        if (!aiConfig?.intelligenceModel) {
            toast({
                title: 'Falta configuracion de IA',
                description: 'No hay un modelo de inteligencia configurado en el panel de Admin.',
                variant: 'destructive'
            })
            return
        }

        setIsCaptionGenerating(true)
        try {
            const result = await regenerateCarouselCaptionAction({
                prompt: carouselSettings.prompt,
                slideCount: carouselSettings.slideCount,
                brandDNA: activeBrandKit,
                intelligenceModel: aiConfig.intelligenceModel,
                selectedColors: carouselSettings.selectedColors,
                includeLogoOnSlides: carouselSettings.includeLogoOnSlides,
                selectedLogoUrl: carouselSettings.selectedLogoUrl
            })

            if (result.success && result.caption) {
                setCaption(result.caption)
            } else {
                throw new Error(result.error || 'No se pudo regenerar el caption.')
            }
        } catch (error) {
            console.error('Caption regeneration error:', error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'No se pudo regenerar el caption.',
                variant: 'destructive'
            })
        } finally {
            setIsCaptionGenerating(false)
        }
    }, [activeBrandKit, aiConfig?.intelligenceModel, carouselSettings, isCaptionLocked, toast])

    const executeGenerate = useCallback(async (settings: CarouselSettings) => {
        if (!settings.prompt.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, introduce un tema para el carrusel.',
                variant: 'destructive'
            })
            return
        }

        if (!activeBrandKit) {
            toast({
                title: 'Error',
                description: 'Selecciona un Brand Kit primero.',
                variant: 'destructive'
            })
            return
        }

        if (!aiConfig?.imageModel) {
            toast({
                title: 'Falta configuracion de IA',
                description: 'No hay un modelo de imagen configurado en el panel de Admin.',
                variant: 'destructive'
            })
            return
        }

        const shouldUseScript = scriptSlides && scriptPrompt === settings.prompt && scriptSlideCount === settings.slideCount
        if (!shouldUseScript && !aiConfig?.intelligenceModel) {
            toast({
                title: 'Falta configuracion de IA',
                description: 'No hay un modelo de inteligencia configurado en el panel de Admin.',
                variant: 'destructive'
            })
            return
        }

        setIsGenerating(true)
        setGeneratedCount(0)
        setCurrentSlideIndex(0)
        setAspectRatio(settings.aspectRatio)
        setCarouselSettings(settings)

        // Initialize slides as pending
        const initialSlides: CarouselSlide[] = Array.from({ length: settings.slideCount }, (_, i) => ({
            index: i,
            title: '',
            description: '',
            status: 'pending' as const
        }))
        setSlides(initialSlides)

        try {
            // Build slide overrides from settings
            const slideOverrides = settings.slides
                .filter(s => s.customText)
                .map(s => ({ index: s.index, text: s.customText! }))

            const result = await generateCarouselAction({
                prompt: settings.prompt,
                slideCount: settings.slideCount,
                aspectRatio: settings.aspectRatio,
                style: settings.style,
                compositionId: settings.compositionId,
                structureId: settings.structureId,
                intelligenceModel: aiConfig?.intelligenceModel,
                imageModel: aiConfig?.imageModel,
                aiImageDescription: settings.aiImageDescription,
                // Full Brand Kit Context
                brandDNA: activeBrandKit,
                slideOverrides,
                slideScript: shouldUseScript ? scriptSlides : undefined,
                // Brand Kit Selections from UI
                selectedLogoUrl: settings.selectedLogoUrl,
                selectedColors: settings.selectedColors,
                selectedImageUrls: settings.selectedImageUrls,
                includeLogoOnSlides: settings.includeLogoOnSlides
            })

            if (result.success) {
                setSlides(result.slides)
                setGeneratedCount(result.slides.filter(s => s.status === 'done').length)
                toast({
                    title: '✅ Carrusel generado',
                    description: `${result.slides.filter(s => s.status === 'done').length} slides listos.`
                })
            } else {
                throw new Error(result.error || 'Error desconocido')
            }

        } catch (error) {
            console.error('Carousel generation error:', error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'No se pudo generar el carrusel.',
                variant: 'destructive'
            })
        } finally {
            setIsGenerating(false)
        }
    }, [activeBrandKit, aiConfig?.imageModel, aiConfig?.intelligenceModel, scriptSlides, scriptPrompt, scriptSlideCount, toast])

    const handleGenerate = useCallback(async (settings: CarouselSettings) => {
        if (!settings.prompt.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, introduce un tema para el carrusel.',
                variant: 'destructive'
            })
            return
        }

        if (!activeBrandKit) {
            toast({
                title: 'Error',
                description: 'Selecciona un Brand Kit primero.',
                variant: 'destructive'
            })
            return
        }

        if (!aiConfig?.imageModel) {
            toast({
                title: 'Falta configuracion de IA',
                description: 'No hay un modelo de imagen configurado en el panel de Admin.',
                variant: 'destructive'
            })
            return
        }

        if (!isAdmin) {
            await executeGenerate(settings)
            return
        }

        const shouldUseScript = scriptSlides && scriptPrompt === settings.prompt && scriptSlideCount === settings.slideCount
        let slidesForPrompt = shouldUseScript ? scriptSlides : null

        if (!slidesForPrompt) {
            slidesForPrompt = await performAnalyze(settings, true)
        }

        if (!slidesForPrompt) {
            toast({
                title: 'Error',
                description: 'No se pudo preparar el guion para el preview del prompt.',
                variant: 'destructive'
            })
            return
        }

        // Import buildFinalPrompt and getMoodForSlide for accurate debug
        const { buildFinalPrompt, generateCarouselSeed } = await import('@/lib/prompts/carousel/builder/final-prompt')
        const { getMoodForSlide } = await import('@/lib/prompts/carousel/mood')

        const compositionPreset = settings.structureId
            ? getNarrativeComposition(settings.structureId, settings.compositionId)
            : undefined

        // Extract brand colors for injection with role-based helper
        const findColor = (role: string, fallback: string) => {
            const match = settings.selectedColors?.find(c => (c as any).role === role)
            return (match as any)?.color || fallback
        }

        const brandColors = {
            background: findColor('Fondo', '#141210'),
            accent: findColor('Acento', '#F0E500')
        }

        const seed = generateCarouselSeed()
        const slideCount = slidesForPrompt.length

        // Build per-slide debug info
        const slideDebug = slidesForPrompt.map((slide, idx) => {
            const currentMood = getMoodForSlide(idx, slideCount)
            const prompt = buildFinalPrompt({
                composition: compositionPreset as any,
                brandColors,
                slideData: slide,
                currentMood,
                currentSlide: idx + 1,
                totalSlides: slideCount,
                logoPosition: extractLogoPosition(compositionPreset?.layoutPrompt || ''),
                includeLogo: Boolean(settings.selectedLogoUrl),
                isSequentialSlide: idx > 0,
                visualAnalysis: settings?.aiImageDescription
            })

            // Build references array
            const references: Array<{ type: string; label: string; weight: number; url: string }> = []
            if (settings.selectedImageUrls?.[0]) {
                references.push({
                    type: 'image',
                    label: 'Master Layout Structure',
                    weight: 0.8,
                    url: settings.selectedImageUrls[0].length > 50
                        ? settings.selectedImageUrls[0].substring(0, 50) + '...'
                        : settings.selectedImageUrls[0]
                })
            }
            if (idx > 0) {
                references.push({
                    type: 'image',
                    label: 'Slide 1 Style Reference',
                    weight: 0.4,
                    url: '(Generated from Slide 1)'
                })
            }
            if (settings.selectedLogoUrl) {
                references.push({
                    type: 'logo',
                    label: 'Brand Logo',
                    weight: 1.0,
                    url: settings.selectedLogoUrl.length > 50
                        ? settings.selectedLogoUrl.substring(0, 50) + '...'
                        : settings.selectedLogoUrl
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

        setDebugPromptData({
            finalPrompt,
            logoUrl: settings.selectedLogoUrl,
            attachedImages: settings.selectedImageUrls,
            selectedStyles: [settings.style],
            platform: 'Instagram Carousel',
            format: settings.aspectRatio,
            intent: analysisIntentLabel || analysisIntent || undefined,
            seed,
            model: aiConfig?.imageModel,
            aspectRatio: settings.aspectRatio,
            slideDebug
        })
        setPendingGenerateSettings(settings)
        setShowDebugModal(true)
    }, [
        activeBrandKit,
        aiConfig?.imageModel,
        analysisIntent,
        analysisIntentLabel,
        executeGenerate,
        isAdmin,
        performAnalyze,
        scriptPrompt,
        scriptSlideCount,
        scriptSlides,
        toast
    ])

    const handleRegenerateSlide = useCallback(async (index: number) => {
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
                visualPrompt: slide.description
            }

            if (!aiConfig?.imageModel) {
                throw new Error('Missing image model configuration')
            }

            const result = await regenerateSlideAction(
                index,
                slideContent,
                slides.length,
                carouselSettings.style,
                carouselSettings.aspectRatio,
                activeBrandKit,
                aiConfig.imageModel,
                carouselSettings.selectedLogoUrl,
                carouselSettings.selectedColors,
                carouselSettings.compositionId,
                carouselSettings.structureId
            )

            if (result.success && result.imageUrl) {
                const newSlides = [...slides]
                newSlides[index] = {
                    ...newSlides[index],
                    imageUrl: result.imageUrl,
                    status: 'done'
                }
                setSlides(newSlides)
                toast({
                    title: '✅ Slide regenerado',
                    description: `Slide ${index + 1} actualizado.`
                })
            } else {
                throw new Error(result.error || 'Error desconocido')
            }

        } catch (error) {
            console.error('Slide regeneration error:', error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'No se pudo regenerar el slide.',
                variant: 'destructive'
            })
        } finally {
            setIsRegenerating(false)
            setRegeneratingIndex(null)
        }
    }, [slides, carouselSettings, activeBrandKit, aiConfig?.imageModel, toast])

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
            <div className="flex h-full">
                {/* Canvas + Caption */}
                <div className="flex-1 flex flex-col min-h-0">
                    <CarouselCanvasPanel
                        slides={slides}
                        currentIndex={currentSlideIndex}
                        onSelectSlide={setCurrentSlideIndex}
                        onRegenerateSlide={handleRegenerateSlide}
                        onUpdateSlideScript={handleUpdateSlideScript}
                        isRegenerating={isRegenerating}
                        regeneratingIndex={regeneratingIndex}
                        aspectRatio={aspectRatio}
                        caption={caption}
                        onCaptionChange={setCaption}
                        onRegenerateCaption={handleRegenerateCaption}
                        isCaptionGenerating={isCaptionGenerating}
                        isCaptionLocked={isCaptionLocked}
                        onToggleCaptionLock={() => setIsCaptionLocked(!isCaptionLocked)}
                        referenceImages={referenceImages}
                        brandKitTexts={brandKitTexts}
                        brandName={activeBrandKit?.brand_name}
                        hook={analysisHook}
                        selectedLogoUrl={selectedLogoUrl}
                    />
                </div>

                {/* Controls Panel (Right Side) */}
                <CarouselControlsPanel
                    onAnalyze={handleAnalyze}
                    onGenerate={handleGenerate}
                    onAspectRatioChange={setAspectRatio}
                    onReferenceImagesChange={setReferenceImages}
                    onSelectedLogoChange={(_, logoUrl) => setSelectedLogoUrl(logoUrl)}
                    userId={user?.id}
                    isAnalyzing={isAnalyzing}
                    isGenerating={isGenerating}
                    currentSlideIndex={currentSlideIndex}
                    generatedCount={generatedCount}
                    totalSlides={slides.length || 5}
                    brandKit={activeBrandKit}
                    analysisHook={analysisHook}
                    analysisStructure={analysisStructure}
                    analysisIntent={analysisIntent}
                    analysisIntentLabel={analysisIntentLabel}
                    isAdmin={isAdmin}
                />
            </div>

            <PromptDebugModal
                open={showDebugModal}
                onClose={cancelGeneration}
                onConfirm={confirmGeneration}
                promptData={debugPromptData}
            />
        </DashboardLayout>
    )
}
