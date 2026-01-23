'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
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
    regenerateSlideAction,
    CarouselSlide,
    SlideContent
} from '@/app/actions/generate-carousel'

export default function CarouselPage() {
    const router = useRouter()
    const { user } = useUser()
    const { activeBrandKit } = useBrandKit()
    const { toast } = useToast()

    const [isGenerating, setIsGenerating] = useState(false)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [generatedCount, setGeneratedCount] = useState(0)
    const [slides, setSlides] = useState<CarouselSlide[]>([])
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5'>('1:1')
    const [carouselSettings, setCarouselSettings] = useState<CarouselSettings | null>(null)

    const [isRegenerating, setIsRegenerating] = useState(false)
    const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

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
                brandName: activeBrandKit.brand_name || 'Brand',
                brandDNA: activeBrandKit,
                slideOverrides
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
    }, [activeBrandKit, toast])

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

            const result = await regenerateSlideAction(
                index,
                slideContent,
                slides.length,
                carouselSettings.style,
                carouselSettings.aspectRatio,
                activeBrandKit.brand_name || 'Brand',
                activeBrandKit
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
    }, [slides, carouselSettings, activeBrandKit, toast])

    return (
        <DashboardLayout>
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
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    currentSlideIndex={currentSlideIndex}
                    generatedCount={generatedCount}
                />
            </div>
        </DashboardLayout>
    )
}
