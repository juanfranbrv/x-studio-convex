'use client'

import { cn } from '@/lib/utils'
import {
    Zap, Smartphone, AlertCircle, Hash, BarChart3, Box, Sparkles, Grid, Heart, CreditCard, List, ShieldCheck,
    Clock, Users, User, Award, TrendingUp, Gift, Briefcase, Book, BookOpen, Tag, Medal, Target, Mic, Music, Palette, Activity,
    Columns2, Rows2, ArrowRight, AlignCenter, ArrowDownToLine, Frame, Star, Type, Square, Grid2x2, Image, Calendar,
    RectangleVertical, PartyPopper, Trophy, Layout, Maximize, MessageSquare, FileText, RectangleHorizontal, LayoutTemplate,
    MessageSquareQuote, Split, SplitSquareHorizontal, Wrench
} from 'lucide-react'
import type { LayoutOption } from '@/lib/creation-flow-types'

interface LayoutSelectorProps {
    availableLayouts: LayoutOption[]
    selectedLayout: string | null
    onSelectLayout: (layoutId: string) => void
}

// Map layout keys to Lucide icons
const WireframeIcons: Record<string, React.FC<{ className?: string }>> = {
    // Structural/Alignment
    SplitVertical: ({ className }) => <Columns2 className={className} />,
    SplitHorizontal: ({ className }) => <Rows2 className={className} />,
    ArrowRight: ({ className }) => <ArrowRight className={className} />,
    AlignCenter: ({ className }) => <AlignCenter className={className} />,
    AlignBottom: ({ className }) => <ArrowDownToLine className={className} />,
    Frame: ({ className }) => <Frame className={className} />,
    Star: ({ className }) => <Star className={className} />,
    Type: ({ className }) => <Type className={className} />,
    Square: ({ className }) => <Square className={className} />,
    Grid2x2: ({ className }) => <Grid2x2 className={className} />,
    Image: ({ className }) => <Image className={className} />,
    Calendar: ({ className }) => <Calendar className={className} />,
    RectangleVertical: ({ className }) => <RectangleVertical className={className} />,

    // Abstract/Concepts
    PartyPopper: ({ className }) => <PartyPopper className={className} />,
    Trophy: ({ className }) => <Trophy className={className} />,
    Layout: ({ className }) => <Layout className={className} />,
    Maximize: ({ className }) => <Maximize className={className} />,
    MessageSquare: ({ className }) => <MessageSquare className={className} />,

    // Document/Content Types
    FileText: ({ className }) => <FileText className={className} />,
    RectangleHorizontal: ({ className }) => <RectangleHorizontal className={className} />,
    LayoutTemplate: ({ className }) => <LayoutTemplate className={className} />,
    MessageSquareQuote: ({ className }) => <MessageSquareQuote className={className} />,

    // Standard Lucide Wrappers (Direct Mapping)
    Sparkles: ({ className }) => <Sparkles className={className} />,
    Zap: ({ className }) => <Zap className={className} />,
    Smartphone: ({ className }) => <Smartphone className={className} />,
    AlertCircle: ({ className }) => <AlertCircle className={className} />,
    Hash: ({ className }) => <Hash className={className} />,
    BarChart3: ({ className }) => <BarChart3 className={className} />,
    Box: ({ className }) => <Box className={className} />,
    Grid: ({ className }) => <Grid className={className} />,
    Heart: ({ className }) => <Heart className={className} />,
    CreditCard: ({ className }) => <CreditCard className={className} />,
    List: ({ className }) => <List className={className} />,
    ShieldCheck: ({ className }) => <ShieldCheck className={className} />,
    Clock: ({ className }) => <Clock className={className} />,
    Users: ({ className }) => <Users className={className} />,
    User: ({ className }) => <User className={className} />,
    Award: ({ className }) => <Award className={className} />,
    TrendingUp: ({ className }) => <TrendingUp className={className} />,
    Gift: ({ className }) => <Gift className={className} />,
    Briefcase: ({ className }) => <Briefcase className={className} />,
    Book: ({ className }) => <Book className={className} />,
    BookOpen: ({ className }) => <BookOpen className={className} />,
    Tag: ({ className }) => <Tag className={className} />,
    Medal: ({ className }) => <Medal className={className} />,
    Target: ({ className }) => <Target className={className} />,
    Mic: ({ className }) => <Mic className={className} />,
    Music: ({ className }) => <Music className={className} />,
    Palette: ({ className }) => <Palette className={className} />,
    Activity: ({ className }) => <Activity className={className} />,
    Wrench: ({ className }) => <Wrench className={className} />,
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
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableLayouts.map(layout => {
                    const isSelected = selectedLayout === layout.id
                    const IconComponent = WireframeIcons[layout.svgIcon] || WireframeIcons.Layout

                    return (
                        <button
                            key={layout.id}
                            onClick={() => onSelectLayout(layout.id)}
                            className={cn(
                                "group relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300",
                                "border backdrop-blur-md overflow-hidden",
                                isSelected
                                    ? "border-primary/50 bg-primary/5 dark:bg-primary/10 dark:border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.15)]"
                                    : "border-slate-200 bg-white/50 hover:bg-white/80 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20 hover:-translate-y-0.5"
                            )}
                            title={layout.description}
                        >
                            {/* Glass Reflection Gradient */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/10 opacity-0 pointer-events-none transition-opacity duration-300",
                                isSelected ? "opacity-40" : "group-hover:opacity-100"
                            )} />

                            <IconComponent className={cn(
                                "w-6 h-6 z-10 transition-all duration-300",
                                isSelected
                                    ? "text-primary scale-110 drop-shadow-sm"
                                    : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 group-hover:scale-110"
                            )} />
                            <span className={cn(
                                "text-[11px] font-medium text-center z-10 transition-colors duration-200 tracking-wide",
                                isSelected
                                    ? "text-primary"
                                    : "text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200"
                            )}>
                                {layout.name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
