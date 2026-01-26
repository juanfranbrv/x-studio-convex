'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import {
    CarouselControlsPanel,
    CarouselSettings
} from '@/components/studio/carousel/CarouselControlsPanel'
import { CarouselCanvasPanel } from '@/components/studio/carousel/CarouselCanvasPanel'
import {
    generateCarouselAction,
    analyzeCarouselAction,
    regenerateSlideAction,
    CarouselSlide,
    SlideContent
} from '@/app/actions/generate-carousel'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function CarouselPage() {
    const router = useRouter()
    const { activeBrandKit, brandKits, setActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const { toast } = useToast()
    const aiConfig = useQuery(api.settings.getAIConfig)

    const handleNewBrandKit = () => {
        router.push('/brand-kit/new')
    }


    const [isGenerating, setIsGenerating] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [generatedCount, setGeneratedCount] = useState(0)
    const [slides, setSlides] = useState<CarouselSlide[]>([])
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5'>('1:1')
    const [carouselSettings, setCarouselSettings] = useState<CarouselSettings | null>(null)
    const [scriptSlides, setScriptSlides] = useState<SlideContent[] | null>(null)
    const [scriptPrompt, setScriptPrompt] = useState('')
    const [scriptSlideCount, setScriptSlideCount] = useState<number | null>(null)

    const [isRegenerating, setIsRegenerating] = useState(false)
    const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

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
                selectedLogoUrl: settings.selectedLogoUrl
            })

            if (result.success) {
                setScriptSlides(result.slides)
                setScriptPrompt(settings.prompt)
                setScriptSlideCount(settings.slideCount)
                setSlides(result.slides.map(s => ({
                    index: s.index,
                    title: s.title,
                    description: s.description,
                    status: 'pending' as const
                })))
                toast({
                    title: 'Guion listo',
                    description: 'Revisa la vista previa antes de generar.'
                })
            } else {
                throw new Error(result.error || 'Error desconocido')
            }
        } catch (error) {
            console.error('Carousel analysis error:', error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'No se pudo analizar el carrusel.',
                variant: 'destructive'
            })
        } finally {
            setIsAnalyzing(false)
        }
    }, [activeBrandKit, aiConfig?.intelligenceModel, toast])

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
                intelligenceModel: aiConfig?.intelligenceModel,
                imageModel: aiConfig?.imageModel,
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
                carouselSettings.selectedColors
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

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
            onBrandDelete={deleteBrandKitById}
            onNewBrandKit={handleNewBrandKit}
        >
            <div className="flex h-full">
                {/* Canvas Panel (Preview) */}
                <CarouselCanvasPanel
                    slides={slides}
                    currentIndex={currentSlideIndex}
                    onSelectSlide={setCurrentSlideIndex}
                    onRegenerateSlide={handleRegenerateSlide}
                    isRegenerating={isRegenerating}
                    regeneratingIndex={regeneratingIndex}
                    aspectRatio={aspectRatio}
                />

                {/* Controls Panel (Right Side) */}
                <CarouselControlsPanel
                    onAnalyze={handleAnalyze}
                    onGenerate={handleGenerate}
                    isAnalyzing={isAnalyzing}
                    isGenerating={isGenerating}
                    currentSlideIndex={currentSlideIndex}
                    generatedCount={generatedCount}
                    totalSlides={slides.length || 5}
                    brandKit={activeBrandKit}
                />
            </div>
        </DashboardLayout>
    )
}
