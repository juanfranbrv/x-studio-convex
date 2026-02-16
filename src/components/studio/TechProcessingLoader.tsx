'use client'

import { motion } from 'framer-motion'

export function TechProcessingLoader() {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950">

            {/* Minimal Ambient Light (Subtle Gradient) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 opacity-40" />

            {/* Central Entity: Abstract "Thinking" Particles */}
            <div className="relative flex items-center justify-center gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-16 rounded-full bg-gradient-to-b from-transparent via-white/80 to-transparent"
                        initial={{ opacity: 0.2, scaleY: 0.5 }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scaleY: [0.5, 1.2, 0.5],
                            filter: ['blur(0px)', 'blur(2px)', 'blur(0px)']
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Floating Sparkles (Subtle Detail) */}
            <div className="absolute">
                <motion.div
                    className="absolute w-[100px] h-[100px] border border-white/5 rounded-full"
                    animate={{ rotate: 360, scale: [0.95, 1.05, 0.95], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-[180px] h-[180px] border border-white/5 rounded-full"
                    animate={{ rotate: -360, scale: [1.05, 0.95, 1.05], opacity: [0.05, 0.2, 0.05] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Typography: Clean, Mono, Small */}
            <div className="mt-12 text-center z-10">
                <motion.p
                    className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-500"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    Processing
                </motion.p>
            </div>
        </div>
    )
}
