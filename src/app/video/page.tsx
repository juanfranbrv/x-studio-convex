'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { VideoControlsPanel, VideoSettings } from '@/components/studio/video/VideoControlsPanel'
import { VideoCanvasPanel } from '@/components/studio/video/VideoCanvasPanel'

const VIDEO_MODULE_ENABLED = false

export default function VideoPage() {
    const router = useRouter()
    const { activeBrandKit, brandKits, setActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const { toast } = useToast()

    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState<string>('')
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9')

    const handleNewBrandKit = () => {
        router.push('/brand-kit/new')
    }

    const handleGenerate = useCallback(async (settings: VideoSettings) => {
        if (!VIDEO_MODULE_ENABLED) {
            setAspectRatio(settings.aspectRatio)
            toast({
                title: 'Modulo en construccion',
                description: 'El modulo de video aun no esta operativo. Estamos terminandolo.',
            })
            return
        }

        if (!settings.prompt.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, introduce un prompt para generar el video.',
                variant: 'destructive'
            })
            return
        }

        setIsGenerating(true)
        setProgress('Iniciando generacion...')
        setAspectRatio(settings.aspectRatio)
        setVideoUrl(null)

        try {
            setProgress('Procesando con Veo 3.1...')
            throw new Error('Modulo de video temporalmente no operativo.')
        } catch (error) {
            console.error('Video generation error:', error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'No se pudo generar el video.',
                variant: 'destructive'
            })
        } finally {
            setIsGenerating(false)
            setProgress('')
        }
    }, [toast])

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
            onBrandDelete={deleteBrandKitById}
            onNewBrandKit={handleNewBrandKit}
        >
            <div className="flex h-full">
                <VideoCanvasPanel
                    videoUrl={videoUrl}
                    isGenerating={isGenerating}
                    progress={progress}
                    aspectRatio={aspectRatio}
                    maintenanceMode={!VIDEO_MODULE_ENABLED}
                />

                <VideoControlsPanel
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    progress={progress}
                    maintenanceMode={!VIDEO_MODULE_ENABLED}
                />
            </div>
        </DashboardLayout>
    )
}

