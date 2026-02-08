'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Download, Share2, Film, AlertTriangle, Wrench } from 'lucide-react'
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
    maintenanceMode = false
}: VideoCanvasPanelProps) {
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
        if (!videoUrl || maintenanceMode) return

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Video generado con Veo 3.1',
                    url: videoUrl
                })
            } catch {
                console.log('Share cancelled')
            }
        }
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950">
            {maintenanceMode && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl mb-4 rounded-xl border border-amber-300/60 bg-amber-50/90 dark:bg-amber-900/20 dark:border-amber-500/40 px-4 py-3"
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                            <Wrench className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Modulo de video en construccion
                            </p>
                            <p className="text-xs text-amber-800/90 dark:text-amber-100/80 mt-1">
                                La generacion de video esta temporalmente desactivada y aun no es operativa.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div
                className={cn(
                    'relative rounded-2xl overflow-hidden shadow-2xl bg-black',
                    aspectRatio === '16:9' ? 'w-full max-w-4xl aspect-video' : 'h-[70vh] aspect-[9/16]'
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
                                <div className="absolute inset-0 blur-2xl bg-violet-500/30 rounded-full animate-pulse" />
                                <Loader2 className="w-16 h-16 text-white animate-spin relative z-10" />
                            </div>
                            <p className="mt-6 text-lg font-medium text-white/90">
                                {progress || 'Generando video con Veo 3.1...'}
                            </p>
                            <p className="mt-2 text-sm text-white/60">
                                Esto puede tardar unos minutos
                            </p>
                        </motion.div>
                    ) : videoUrl ? (
                        <motion.div
                            key="video"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                        >
                            <video
                                src={videoUrl}
                                controls
                                autoPlay
                                loop
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                                <Film className="w-12 h-12 text-violet-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white/80">
                                {maintenanceMode ? 'Modulo temporalmente desactivado' : 'Tu video aparecera aqui'}
                            </h3>
                            <p className="mt-2 text-sm text-white/50 text-center max-w-sm">
                                {maintenanceMode
                                    ? 'Estamos trabajando en esta funcionalidad. Volvera a estar operativa pronto.'
                                    : 'Describe tu video y presiona "Generar" para crear contenido con IA'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {videoUrl && !isGenerating && !maintenanceMode && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 mt-6"
                >
                    <Button variant="outline" size="lg" onClick={handleDownload} className="gap-2">
                        <Download className="w-5 h-5" />
                        Descargar
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleShare} className="gap-2">
                        <Share2 className="w-5 h-5" />
                        Compartir
                    </Button>
                </motion.div>
            )}
        </div>
    )
}

