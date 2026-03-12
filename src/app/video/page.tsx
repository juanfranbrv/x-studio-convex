'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { VideoControlsPanel, VideoSettings } from '@/components/studio/video/VideoControlsPanel'
import { VideoCanvasPanel } from '@/components/studio/video/VideoCanvasPanel'

const VIDEO_MODULE_ENABLED = false

export default function VideoPage() {
    const { t } = useTranslation('video')
    const router = useRouter()
    const { activeBrandKit, brandKits, setActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const { toast } = useToast()

    const [isGenerating, setIsGenerating] = useState(false)
    const [isCancelingGenerate, setIsCancelingGenerate] = useState(false)
    const [progress, setProgress] = useState('')
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9')

    const handleNewBrandKit = () => {
        router.push('/brand-kit/new')
    }

    const handleGenerate = useCallback(async (settings: VideoSettings) => {
        if (!VIDEO_MODULE_ENABLED) {
            setAspectRatio(settings.aspectRatio)
            toast({
                title: t('maintenanceToastTitle'),
                description: t('maintenanceToastBody'),
            })
            return
        }

        if (!settings.prompt.trim()) {
            toast({
                title: t('missingPromptTitle'),
                description: t('missingPromptBody'),
                variant: 'destructive',
            })
            return
        }

        setIsCancelingGenerate(false)
        setIsGenerating(true)
        setProgress(t('starting'))
        setAspectRatio(settings.aspectRatio)
        setVideoUrl(null)

        try {
            setProgress(t('processing'))
            throw new Error(t('temporarilyUnavailable'))
        } catch (error) {
            console.error('Video generation error:', error)
            toast({
                title: t('missingPromptTitle'),
                description: error instanceof Error ? error.message : t('generationError'),
                variant: 'destructive',
            })
        } finally {
            setIsGenerating(false)
            setProgress('')
        }
    }, [t, toast])

    const handleCancelGenerate = useCallback(() => {
        setIsCancelingGenerate(true)
        setIsGenerating(false)
        setProgress('')
        window.setTimeout(() => setIsCancelingGenerate(false), 900)
    }, [])

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
            onBrandDelete={deleteBrandKitById}
            onNewBrandKit={handleNewBrandKit}
        >
            <div className="flex h-full flex-col md:flex-row">
                <VideoCanvasPanel
                    videoUrl={videoUrl}
                    isGenerating={isGenerating}
                    progress={progress}
                    aspectRatio={aspectRatio}
                    maintenanceMode={!VIDEO_MODULE_ENABLED}
                />

                <VideoControlsPanel
                    onGenerate={handleGenerate}
                    onCancelGenerate={handleCancelGenerate}
                    isGenerating={isGenerating}
                    isCancelingGenerate={isCancelingGenerate}
                    progress={progress}
                    maintenanceMode={!VIDEO_MODULE_ENABLED}
                />
            </div>
        </DashboardLayout>
    )
}
