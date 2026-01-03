'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { memo, useState, useEffect } from 'react'

const GENERATION_MESSAGES = [
    "Analizando composición...",
    "Mezclando estilos...",
    "Ajustando paleta cromática...",
    "Sintetizando píxeles...",
    "Refinando detalles...",
    "Aplicando magia ✨",
    "Componiendo elementos...",
    "Calibrando luz y sombras...",
    "Fusionando conceptos...",
    "Materializando visión...",
    "Procesando ADN de marca...",
    "Horneando creatividad...",
    "Destilando inspiración...",
    "Tejiendo narrativa visual...",
]

export const DigitalStaticLoader = memo(() => {
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % GENERATION_MESSAGES.length)
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative w-full h-full overflow-hidden bg-background flex items-center justify-center">
            {/* Clean Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />

            {/* Moving Scanning Line - Main Visual */}
            <motion.div
                animate={{ top: ['-5%', '105%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_hsl(var(--primary)/0.4)] z-20"
            />

            {/* Secondary Scanner (offset) */}
            <motion.div
                animate={{ top: ['105%', '-5%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-20"
            />

            {/* OSD (On-Screen Display) UI */}
            <div className="relative z-30 flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-3">
                    {/* Rotating Message */}
                    {/* Rotating Message */}
                    <div className="h-6 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={messageIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="text-muted-foreground font-mono text-sm tracking-widest uppercase"
                            >
                                {GENERATION_MESSAGES[messageIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Subtle corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-border" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-border" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-border" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-border" />
        </div>
    )
})

DigitalStaticLoader.displayName = 'DigitalStaticLoader'


