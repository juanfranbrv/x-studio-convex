'use client'

import { Loader2 } from '@/components/ui/spinner'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Download, Film, Share2, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VideoCanvasPanelProps {
    videoUrl?: string | null
    isGenerating: boolean
    progress?: string
    aspectRatio: '16:9' | '9:16'
    maintenanceMode?: boolean
}

export function VideoCanvasPanel({
    videoUrl,
    isGenerating,
    progress,
    aspectRatio,
    maintenanceMode = false,
}: VideoCanvasPanelProps) {
    const { t } = useTranslation('video')

    const handleDownload = () => {
        if (!videoUrl || maintenanceMode) return
        const link = document.createElement('a')
        link.href = videoUrl
        link.download = `veo-video-${Date.now()}.mp4`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleShare = async () => {
        if (!videoUrl || maintenanceMode || !navigator.share) return
        try {
            await navigator.share({
                title: t('canvas.shareTitle'),
                url: videoUrl,
            })
        } catch {
            console.log('Share cancelled')
        }
    }

    return (
        <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-zinc-900 dark:to-zinc-950 md:p-8">
            {maintenanceMode ? (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 w-full max-w-4xl rounded-xl border border-amber-300/60 bg-amber-50/90 px-4 py-3 dark:border-amber-500/40 dark:bg-amber-900/20"
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                            <Wrench className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                        </div>
                        <div>
                            <p className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
                                <AlertTriangle className="h-4 w-4" />
                                {t('canvas.bannerTitle')}
                            </p>
                            <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-100/80">{t('canvas.bannerBody')}</p>
                        </div>
                    </div>
                </motion.div>
            ) : null}

            <div
                className={cn(
                    'relative overflow-hidden rounded-2xl bg-black shadow-2xl',
                    aspectRatio === '16:9' ? 'aspect-video w-full max-w-4xl' : 'aspect-[9/16] w-full max-w-sm md:h-[70vh] md:w-auto'
                )}
            >
                <AnimatePresence mode="wait">
                    {isGenerating ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/90 to-purple-900/90 backdrop-blur-sm"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 animate-pulse rounded-full bg-violet-500/30 blur-2xl" />
                                <Loader2 className="relative z-10 h-16 w-16 text-white" />
                            </div>
                            <p className="mt-6 text-lg font-medium text-white/90">{progress || t('canvas.generating')}</p>
                            <p className="mt-2 text-sm text-white/60">{t('canvas.longWait')}</p>
                        </motion.div>
                    ) : videoUrl ? (
                        <motion.div
                            key="video"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="h-full w-full"
                        >
                            <video src={videoUrl} controls autoPlay loop className="h-full w-full object-contain" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"
                        >
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                                <Film className="h-12 w-12 text-violet-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white/80">
                                {maintenanceMode ? t('canvas.emptyTitleMaintenance') : t('canvas.emptyTitleReady')}
                            </h3>
                            <p className="mt-2 max-w-sm text-center text-sm text-white/50">
                                {maintenanceMode ? t('canvas.emptyBodyMaintenance') : t('canvas.emptyBodyReady')}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {videoUrl && !isGenerating && !maintenanceMode ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3">
                    <Button variant="outline" size="lg" onClick={handleDownload} className="gap-2">
                        <Download className="h-5 w-5" />
                        {t('canvas.download')}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleShare} className="gap-2">
                        <Share2 className="h-5 w-5" />
                        {t('canvas.share')}
                    </Button>
                </motion.div>
            ) : null}
        </div>
    )
}


