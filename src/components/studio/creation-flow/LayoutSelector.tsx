'use client'

import { cn } from '@/lib/utils'
import { Zap, Smartphone, AlertCircle, Hash, BarChart3, Box } from 'lucide-react'
import type { LayoutOption } from '@/lib/creation-flow-types'

interface LayoutSelectorProps {
    availableLayouts: LayoutOption[]
    selectedLayout: string | null
    onSelectLayout: (layoutId: string) => void
}

// SVG Wireframe Icons for each layout type
const WireframeIcons: Record<string, React.FC<{ className?: string }>> = {
    SplitVertical: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="16" height="26" rx="2" />
            <rect x="22" y="2" width="16" height="26" rx="2" />
        </svg>
    ),
    SplitHorizontal: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="12" rx="2" />
            <rect x="2" y="16" width="36" height="12" rx="2" />
        </svg>
    ),
    ArrowRight: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="14" height="26" rx="2" />
            <path d="M19 15 L24 15 M22 12 L24 15 L22 18" />
            <rect x="24" y="2" width="14" height="26" rx="2" />
        </svg>
    ),
    AlignCenter: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
            <rect x="8" y="10" width="24" height="4" rx="1" fill="currentColor" />
            <rect x="12" y="16" width="16" height="2" rx="1" fill="currentColor" fillOpacity="0.5" />
        </svg>
    ),
    AlignBottom: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="18" rx="2" fill="currentColor" fillOpacity="0.1" />
            <rect x="2" y="20" width="36" height="8" rx="1" fill="currentColor" fillOpacity="0.3" />
            <rect x="6" y="22" width="20" height="2" rx="1" fill="currentColor" />
        </svg>
    ),
    Frame: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" />
            <rect x="5" y="5" width="30" height="20" rx="1" strokeDasharray="2 2" />
            <rect x="10" y="11" width="20" height="4" rx="1" fill="currentColor" />
        </svg>
    ),
    Star: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
            <circle cx="32" cy="8" r="6" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
            <rect x="6" y="14" width="16" height="12" rx="1" />
        </svg>
    ),
    RectangleHorizontal: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="18" rx="2" fill="currentColor" fillOpacity="0.1" />
            <rect x="2" y="22" width="36" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
            <rect x="8" y="24" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
    ),
    Type: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
            <rect x="6" y="8" width="28" height="6" rx="1" fill="currentColor" />
            <rect x="10" y="18" width="20" height="3" rx="1" fill="currentColor" fillOpacity="0.5" />
        </svg>
    ),
    Square: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" />
            <rect x="12" y="4" width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.2" />
            <rect x="6" y="22" width="28" height="4" rx="1" fill="currentColor" fillOpacity="0.3" />
        </svg>
    ),
    Grid2x2: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="17" height="12" rx="1" />
            <rect x="21" y="2" width="17" height="12" rx="1" />
            <rect x="2" y="16" width="17" height="12" rx="1" />
            <rect x="21" y="16" width="17" height="12" rx="1" />
        </svg>
    ),
    Image: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
            <circle cx="12" cy="10" r="3" />
            <path d="M2 22 L14 14 L24 20 L32 14 L38 18" />
            <rect x="4" y="22" width="14" height="4" rx="1" fill="currentColor" fillOpacity="0.3" />
        </svg>
    ),
    Calendar: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
            <rect x="10" y="8" width="20" height="10" rx="1" fill="currentColor" fillOpacity="0.2" />
            <rect x="14" y="10" width="12" height="4" rx="1" fill="currentColor" />
            <rect x="6" y="22" width="28" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />
        </svg>
    ),
    RectangleVertical: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="8" y="2" width="24" height="26" rx="2" />
            <rect x="10" y="4" width="20" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
            <rect x="12" y="5" width="16" height="3" rx="1" fill="currentColor" />
        </svg>
    ),
    PartyPopper: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
            <circle cx="8" cy="6" r="2" fill="currentColor" fillOpacity="0.5" />
            <circle cx="32" cy="8" r="1.5" fill="currentColor" fillOpacity="0.5" />
            <circle cx="12" cy="24" r="1" fill="currentColor" fillOpacity="0.5" />
            <rect x="10" y="10" width="20" height="8" rx="1" fill="currentColor" />
        </svg>
    ),
    Trophy: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
            <path d="M16 6 L16 14 C16 16 18 18 20 18 C22 18 24 16 24 14 L24 6" fill="currentColor" fillOpacity="0.3" />
            <rect x="18" y="18" width="4" height="4" fill="currentColor" fillOpacity="0.3" />
            <rect x="14" y="22" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
    ),
    Layout: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" />
            <rect x="4" y="20" width="32" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
        </svg>
    ),
    Maximize: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.2" />
            <rect x="10" y="10" width="20" height="6" rx="1" fill="currentColor" fillOpacity="0.5" />
        </svg>
    ),
    MessageSquare: ({ className }) => (
        <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
            <path d="M8 8 L32 8 L32 18 L22 18 L18 24 L18 18 L8 18 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
        </svg>
    ),
    // Lucide Icon Wrappers
    Zap: ({ className }) => <Zap className={className} />,
    Smartphone: ({ className }) => <Smartphone className={className} />,
    AlertCircle: ({ className }) => <AlertCircle className={className} />,
    Hash: ({ className }) => <Hash className={className} />,
    BarChart3: ({ className }) => <BarChart3 className={className} />,
    Box: ({ className }) => <Box className={className} />,
}

export function LayoutSelector({
    availableLayouts,
    selectedLayout,
    onSelectLayout,
}: LayoutSelectorProps) {
    if (availableLayouts.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Composición
            </label>

            <div className="grid grid-cols-3 gap-2">
                {availableLayouts.map(layout => {
                    const isSelected = selectedLayout === layout.id
                    const IconComponent = WireframeIcons[layout.svgIcon] || WireframeIcons.Layout

                    return (
                        <button
                            key={layout.id}
                            onClick={() => onSelectLayout(layout.id)}
                            className={cn(
                                "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all",
                                "border-2",
                                isSelected
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50"
                            )}
                            title={layout.description}
                        >
                            <IconComponent className={cn(
                                "w-10 h-8",
                                isSelected ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className="text-[10px] font-medium text-center leading-tight">
                                {layout.name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
