"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { SOCIAL_FORMATS, SocialFormat, SocialPlatform } from '@/lib/creation-flow-types'
import {
    Instagram,
    Facebook,
    Linkedin,
    Video,
    Maximize,
    Layout,
    MessageCircle,
    Smartphone,
    Youtube,
    Square,
    RectangleHorizontal,
    RectangleVertical,
    Twitter
} from 'lucide-react'
import { motion } from 'framer-motion'

interface SocialFormatSelectorProps {
    selectedPlatform: SocialPlatform | null
    selectedFormat: string | null
    onSelectPlatform: (platform: SocialPlatform) => void
    onSelectFormat: (formatId: string) => void
    lockedPlatform?: SocialPlatform
}

const PLATFORM_CONFIG: Record<SocialPlatform, { icon: any; label: string; color: string }> = {
    instagram: { icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
    facebook: { icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
    tiktok: { icon: Video, label: 'TikTok', color: 'text-zinc-900 dark:text-white' },
    linkedin: { icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700' },
    whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
    x: { icon: Twitter, label: 'X (Twitter)', color: 'text-slate-900 dark:text-white' },
    youtube: { icon: Youtube, label: 'YouTube', color: 'text-red-600' }
}

export const SocialFormatSelector: React.FC<SocialFormatSelectorProps> = ({
    selectedPlatform,
    selectedFormat,
    onSelectPlatform,
    onSelectFormat,
    lockedPlatform
}) => {
    const effectivePlatform = lockedPlatform ?? selectedPlatform
    const availableFormats = SOCIAL_FORMATS.filter(f => f.platform === effectivePlatform)

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
                {(Object.entries(PLATFORM_CONFIG) as [SocialPlatform, any][]).map(([id, config]) => {
                    const Icon = config.icon
                    const isSelected = effectivePlatform === id
                    const isLocked = Boolean(lockedPlatform)
                    return (
                        <button
                            key={id}
                            onClick={() => {
                                if (isLocked) return
                                onSelectPlatform(id)
                            }}
                            title={config.label}
                            aria-disabled={isLocked}
                            className={cn(
                                "relative flex items-center justify-center p-3 rounded-full transition-all duration-300",
                                isSelected
                                    ? "bg-primary/10 shadow-[0_4px_12px_hsl(var(--primary)/0.2)] scale-110 ring-1 ring-primary/30 dark:bg-primary/20 dark:ring-primary/40"
                                    : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
                                isLocked && "cursor-default"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 transition-colors",
                                isSelected
                                    ? "text-primary transition-all duration-300"
                                    : "currentColor"
                            )} />
                        </button>
                    )
                })}
            </div>

            {effectivePlatform && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {availableFormats.map((format) => {
                        const isSelected = selectedFormat === format.id

                        // Determine icon based on aspect ratio
                        const [w, h] = format.aspectRatio.split(':').map(Number)
                        let FormatIcon = RectangleVertical
                        if (w > h) FormatIcon = RectangleHorizontal
                        else if (w === h) FormatIcon = Square

                        return (
                            <motion.button
                                key={format.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelectFormat(format.id)}
                                className={cn(
                                    "group relative flex flex-col items-start p-4 rounded-2xl transition-all duration-300 text-left overflow-hidden",
                                    "border backdrop-blur-md",
                                    isSelected
                                        ? "border-primary/50 bg-primary/5 dark:bg-primary/10 dark:border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.15)]"
                                        : "border-slate-200 bg-white/50 hover:bg-white/80 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20 hover:-translate-y-0.5"
                                )}
                            >
                                {/* Glass Reflection Gradient */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/10 opacity-0 pointer-events-none transition-opacity duration-300",
                                    isSelected ? "opacity-40" : "group-hover:opacity-100"
                                )} />

                                <div className="flex items-center justify-between w-full mb-3 z-10">
                                    <div className={cn(
                                        "p-2 rounded-xl transition-colors duration-300",
                                        isSelected
                                            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                                            : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700 dark:bg-white/5 dark:text-slate-400 dark:group-hover:text-slate-200"
                                    )}>
                                        <FormatIcon className="w-5 h-5" />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-1 rounded-full border transition-colors",
                                        isSelected
                                            ? "border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20 dark:text-primary"
                                            : "border-slate-200 bg-white/50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
                                    )}>
                                        {format.aspectRatio}
                                    </span>
                                </div>

                                <div className="space-y-1 z-10">
                                    <p className={cn(
                                        "text-sm font-semibold leading-none transition-colors",
                                        isSelected
                                            ? "text-primary dark:text-primary"
                                            : "text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white"
                                    )}>
                                        {format.name}
                                    </p>
                                    <p className={cn(
                                        "text-xs leading-tight transition-colors",
                                        isSelected
                                            ? "text-primary/80 dark:text-primary/80"
                                            : "text-slate-500 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400"
                                    )}>
                                        {format.description}
                                    </p>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
