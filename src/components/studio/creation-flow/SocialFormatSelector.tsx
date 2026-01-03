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
    RectangleVertical
} from 'lucide-react'
import { motion } from 'framer-motion'

interface SocialFormatSelectorProps {
    selectedPlatform: SocialPlatform | null
    selectedFormat: string | null
    onSelectPlatform: (platform: SocialPlatform) => void
    onSelectFormat: (formatId: string) => void
}

const PLATFORM_CONFIG: Record<SocialPlatform, { icon: any; label: string; color: string }> = {
    instagram: { icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
    facebook: { icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
    tiktok: { icon: Video, label: 'TikTok', color: 'text-zinc-900 dark:text-white' },
    linkedin: { icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700' },
    whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
    youtube: { icon: Youtube, label: 'YouTube', color: 'text-red-600' }
}

export const SocialFormatSelector: React.FC<SocialFormatSelectorProps> = ({
    selectedPlatform,
    selectedFormat,
    onSelectPlatform,
    onSelectFormat
}) => {
    const availableFormats = SOCIAL_FORMATS.filter(f => f.platform === selectedPlatform)

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="grid grid-cols-6 gap-1.5">
                    {(Object.entries(PLATFORM_CONFIG) as [SocialPlatform, any][]).map(([id, config]) => {
                        const Icon = config.icon
                        const isSelected = selectedPlatform === id
                        return (
                            <button
                                key={id}
                                onClick={() => onSelectPlatform(id)}
                                title={config.label}
                                className={cn(
                                    "flex items-center justify-center p-2 rounded-lg border-2 transition-all",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-muted bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                            </button>
                        )
                    })}
                </div>
            </div>

            {selectedPlatform && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-2">
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
                                        "relative flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left",
                                        isSelected
                                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                            : "border-muted bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
                                    )}
                                >
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <div className={cn(
                                            "p-1.5 rounded-lg transition-colors",
                                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                            <FormatIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-bold px-1.5 py-0.5 rounded-md border",
                                            isSelected ? "border-primary/30 bg-primary/10 text-primary" : "border-muted-foreground/20 bg-muted/50 text-muted-foreground"
                                        )}>
                                            {format.aspectRatio}
                                        </span>
                                    </div>

                                    <div className="space-y-0.5">
                                        <p className={cn(
                                            "text-xs font-bold leading-none",
                                            isSelected ? "text-primary" : "text-foreground"
                                        )}>
                                            {format.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground leading-tight">
                                            {format.description}
                                        </p>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>
            )}

        </div>
    )
}
