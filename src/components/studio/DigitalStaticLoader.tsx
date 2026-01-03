'use client'

import { motion } from 'framer-motion'
import { memo, useEffect, useRef } from 'react'

export const DigitalStaticLoader = memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }

        window.addEventListener('resize', resize)
        resize()

        let lastUpdateTime = 0
        const frameInterval = 150 // Adjust this for "much slower" - higher is slower

        const render = (time: number) => {
            if (time - lastUpdateTime < frameInterval) {
                animationFrameId = requestAnimationFrame(render)
                return
            }
            lastUpdateTime = time

            const imageData = ctx.createImageData(canvas.width, canvas.height)
            const data = imageData.data

            // Double randomness for "denser" look (clumpier/more contrast)
            for (let i = 0; i < data.length; i += 4) {
                const rand = Math.random()
                const value = rand > 0.5 ? 255 * Math.random() : 0
                data[i] = value     // R
                data[i + 1] = value // G
                data[i + 2] = value // B
                data[i + 3] = 255   // A
            }

            ctx.putImageData(imageData, 0, 0)
            animationFrameId = requestAnimationFrame(render)
        }

        animationFrameId = requestAnimationFrame(render)

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
            {/* The "Latent Space" Focusing Image */}
            <motion.div
                initial={{ filter: 'blur(60px)', scale: 1.2, opacity: 0 }}
                animate={{
                    filter: [
                        'blur(60px)',
                        'blur(30px)',
                        'blur(45px)',
                        'blur(20px)',
                        'blur(35px)',
                    ],
                    scale: [1.2, 1.05, 1.15, 1.02, 1.1],
                    opacity: [0.3, 0.6, 0.4, 0.7, 0.5],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 z-0"
            >
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
                    className="w-full h-full object-cover saturate-[0.5] contrast-[1.2]"
                    alt="Latent Reconstruction"
                />
            </motion.div>

            {/* CRT & Digital Effects Layer */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {/* Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />

                {/* Moving Scanning Line */}
                <motion.div
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-[2px] bg-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-20"
                />

                {/* Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />

                {/* Digital Noise Overlay (Softer) */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            </div>

            {/* OSD (On-Screen Display) UI */}
            <div className="relative z-30 flex flex-col items-center gap-6">
                <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500" />
                        <span className="text-cyan-400 font-mono text-xs tracking-[0.6em] uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                            Reconstruyendo Imagen
                        </span>
                        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500" />
                    </div>

                    {/* Progress Bar (Visual Only) */}
                    <div className="w-48 h-1 bg-cyan-900/30 rounded-full overflow-hidden border border-cyan-500/20">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                        />
                    </div>
                </motion.div>

                {/* Status Codes */}
                <div className="flex gap-8 font-mono text-[8px] text-cyan-500/40 uppercase tracking-widest">
                    <div className="flex flex-col gap-1">
                        <span>Paso: Difusión Latente</span>
                        <span>Seed: 4829103841</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span>Res: 1024x1024</span>
                        <span>VRAM: 12GB/16GB</span>
                    </div>
                </div>
            </div>

            {/* Overall Screen Flicker (Very Subtle) */}
            <motion.div
                animate={{ opacity: [0, 0.02, 0] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay z-40"
            />
        </div>
    )
})

DigitalStaticLoader.displayName = 'DigitalStaticLoader'
