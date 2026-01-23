'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { VideoControlsPanel, VideoSettings } from '@/components/studio/video/VideoControlsPanel'
import { VideoCanvasPanel } from '@/components/studio/video/VideoCanvasPanel'
import { generateVideoAction } from '@/app/actions/generate-video'

export default function VideoPage() {
    const router = useRouter()
    const { user } = useUser()
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
        if (!settings.prompt.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, introduce un prompt para generar el video.',
                variant: 'destructive'
            })
            return
        }

        setIsGenerating(true)
        setProgress('Iniciando generación...')
        setAspectRatio(settings.aspectRatio)
        setVideoUrl(null)

        try {
            setProgress('Procesando con Veo 3.1...')

            const result = await generateVideoAction({
                prompt: settings.prompt,
                startFrame: settings.startFrame,
                endFrame: settings.endFrame,
                aspectRatio: settings.aspectRatio,
                resolution: settings.resolution,
                durationSeconds: settings.durationSeconds
            })

            if (result.success && result.videoUrl) {
                setVideoUrl(result.videoUrl)
                toast({
                    title: '✅ Video generado',
                    description: 'Tu video está listo para ver y descargar.'
                })
            } else {
                throw new Error(result.error || 'Error desconocido')
            }

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
                {/* Canvas Panel (Preview) */}
                <VideoCanvasPanel
                    videoUrl={videoUrl}
                    isGenerating={isGenerating}
                    progress={progress}
                    aspectRatio={aspectRatio}
                />

                {/* Controls Panel (Right Side) */}
                <VideoControlsPanel
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    progress={progress}
                />
            </div>
        </DashboardLayout>
    )
}
