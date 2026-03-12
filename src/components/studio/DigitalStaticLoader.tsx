'use client'

import { Loader2 } from '@/components/ui/spinner'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const makeRng = (seed: number) => {
    let t = seed + 0x6D2B79F5
    return () => {
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

type DigitalStaticLoaderProps = {
    variant?: number
    mode?: 'classic' | 'spectacle'
    seed?: number
}

export const DigitalStaticLoader = memo(({ variant = 0, mode = 'classic', seed }: DigitalStaticLoaderProps) => {
    const { t } = useTranslation('common')
    const [messageIndex, setMessageIndex] = useState(0)
    const variantIndex = Math.abs(variant) % 4
    const shouldReduceMotion = useReducedMotion()
    const resolvedSeed = useMemo(() => (Number.isFinite(seed) ? (seed as number) : Date.now()), [seed])

    const generationMessages = useMemo(() => ([
        t('loader.messages.analyzingComposition', { defaultValue: 'Analyzing composition...' }),
        t('loader.messages.mixingStyles', { defaultValue: 'Mixing styles...' }),
        t('loader.messages.adjustingPalette', { defaultValue: 'Adjusting color palette...' }),
        t('loader.messages.synthesizingPixels', { defaultValue: 'Synthesizing pixels...' }),
        t('loader.messages.refiningDetails', { defaultValue: 'Refining details...' }),
        t('loader.messages.composingElements', { defaultValue: 'Composing elements...' }),
        t('loader.messages.calibratingLight', { defaultValue: 'Calibrating light and shadows...' }),
        t('loader.messages.fusingConcepts', { defaultValue: 'Fusing concepts...' }),
        t('loader.messages.materializingVision', { defaultValue: 'Materializing vision...' }),
        t('loader.messages.processingBrandDna', { defaultValue: 'Processing brand DNA...' }),
        t('loader.messages.bakingCreativity', { defaultValue: 'Baking creativity...' }),
        t('loader.messages.distillingInspiration', { defaultValue: 'Distilling inspiration...' }),
        t('loader.messages.weavingNarrative', { defaultValue: 'Weaving visual narrative...' }),
    ]), [t])

    const phaseLabels = useMemo(() => ([
        t('loader.phases.preparingScene', { defaultValue: 'Preparing scene' }),
        t('loader.phases.buildingLayers', { defaultValue: 'Building layers' }),
        t('loader.phases.synthesizingSlides', { defaultValue: 'Synthesizing slides' }),
        t('loader.phases.finalPolish', { defaultValue: 'Final polish' }),
    ]), [t])

    const messageOrder = useMemo(() => {
        const rng = makeRng(resolvedSeed + 101)
        const copy = [...generationMessages]
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1))
            ;[copy[i], copy[j]] = [copy[j], copy[i]]
        }
        return copy
    }, [generationMessages, resolvedSeed])

    const initialPhase = useMemo(() => {
        const rng = makeRng(resolvedSeed)
        return Math.floor(rng() * phaseLabels.length)
    }, [phaseLabels, resolvedSeed])

    const [phaseIndex, setPhaseIndex] = useState(initialPhase)

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % generationMessages.length)
        }, 2200)
        return () => clearInterval(interval)
    }, [generationMessages.length])

    useEffect(() => {
        setPhaseIndex(initialPhase)
    }, [initialPhase])

    useEffect(() => {
        const interval = setInterval(() => {
            setPhaseIndex(prev => (prev + 1) % phaseLabels.length)
        }, 6000)
        return () => clearInterval(interval)
    }, [phaseLabels.length])

    const orbits = useMemo(() => {
        const rng = makeRng(resolvedSeed + 51)
        return Array.from({ length: 4 }).map((_, idx) => ({
            id: `orbit-${idx}`,
            inset: 28 + idx * 20 + rng() * 8,
            duration: 9 + rng() * 8,
            direction: rng() > 0.5 ? 1 : -1,
            opacity: 0.2 + rng() * 0.25
        }))
    }, [resolvedSeed])

    const arcs = useMemo(() => {
        const rng = makeRng(resolvedSeed + 77)
        return Array.from({ length: 3 }).map((_, idx) => ({
            id: `arc-${idx}`,
            inset: 46 + idx * 24 + rng() * 8,
            duration: 7 + rng() * 6,
            direction: rng() > 0.5 ? 1 : -1,
            opacity: 0.14 + rng() * 0.2
        }))
    }, [resolvedSeed])

    const loop = (duration: number, delay = 0) => (
        shouldReduceMotion ? { duration: 0 } : { duration, delay, repeat: Infinity }
    )

    const renderClassicLayers = () => (
        <>
            <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
            <motion.div
                animate={{ top: ['-5%', '105%'] }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-20"
            />
            <motion.div
                animate={{ top: ['105%', '-5%'] }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-20"
            />
        </>
    )

    const renderSpectacleBase = () => (
        <>
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-muted/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,hsl(var(--primary)/0.16),transparent_55%)]" />
            {orbits.map(orbit => (
                <motion.div
                    key={orbit.id}
                    className="absolute rounded-full border border-primary/30"
                    style={{ inset: `${orbit.inset}px`, opacity: orbit.opacity }}
                    animate={{ rotate: 360 * orbit.direction }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
                />
            ))}
            {arcs.map(arc => (
                <motion.div
                    key={arc.id}
                    className="absolute rounded-full border border-primary/20 border-dashed"
                    style={{ inset: `${arc.inset}px`, opacity: arc.opacity }}
                    animate={{ rotate: 360 * arc.direction }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: arc.duration, repeat: Infinity, ease: 'linear' }}
                />
            ))}
        </>
    )

    const renderVariantLayers = () => {
        switch (variantIndex) {
            case 1:
                return (
                    <>
                        {renderSpectacleBase()}
                        <motion.div
                            className="absolute inset-10 rounded-3xl border border-primary/25"
                            animate={{ opacity: [0.15, 0.45, 0.15] }}
                            transition={loop(3.2)}
                        />
                    </>
                )
            case 2:
                return (
                    <>
                        {renderSpectacleBase()}
                        <motion.div
                            className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,hsl(var(--primary)/0.22),transparent)]"
                            animate={{ rotate: 360 }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 10, repeat: Infinity, ease: 'linear' }}
                        />
                    </>
                )
            case 3:
                return (
                    <>
                        {renderSpectacleBase()}
                        <motion.div
                            className="absolute inset-6 rounded-xl border border-primary/20 border-dashed"
                            animate={{ rotate: -360 }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 16, repeat: Infinity, ease: 'linear' }}
                        />
                    </>
                )
            case 0:
            default:
                return (
                    <>
                        {renderSpectacleBase()}
                        <motion.div
                            animate={{ top: ['-5%', '105%'] }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-20"
                        />
                        <motion.div
                            animate={{ top: ['105%', '-5%'] }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-20"
                        />
                    </>
                )
        }
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-background flex items-center justify-center">
            {mode === 'classic' ? renderClassicLayers() : renderVariantLayers()}

            <div className="relative z-30 flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-6 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={messageIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
                                className="text-foreground/80 font-mono text-sm tracking-widest uppercase"
                            >
                                {messageOrder[messageIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    {mode === 'spectacle' && (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-10 w-10 text-primary/90" />
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.4, 0.9, 0.4] }}
                                    transition={loop(1.8)}
                                    className="h-2 w-2 rounded-full bg-primary/70"
                                />
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/80">
                                    {t('loader.generating', { defaultValue: 'Generating' })}
                                </span>
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
                                    transition={loop(1.8, 0.3)}
                                    className="h-2 w-2 rounded-full bg-primary/70"
                                />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/60">
                                    {phaseLabels[phaseIndex]}
                                </span>
                                <div className="h-1.5 w-40 rounded-full bg-white/10 overflow-hidden">
                                    <motion.div
                                        className="h-full w-full bg-primary/60 origin-left"
                                        animate={{ scaleX: [0, 1, 0] }}
                                        transition={loop(4.5)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 border-primary/40" />
            <div className="absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 border-primary/40" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 border-primary/40" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-primary/40" />
        </div>
    )
})

DigitalStaticLoader.displayName = 'DigitalStaticLoader'
