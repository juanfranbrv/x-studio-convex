'use client'

import { cn } from '@/lib/utils'
import {
    Zap, Smartphone, AlertCircle, Hash, BarChart3, Box, Sparkles, Grid, Heart, CreditCard, List, ShieldCheck,
    Clock, Users, User, Award, TrendingUp, Gift, Briefcase, Book, BookOpen, Tag, Medal, Target, Mic, Music, Palette, Activity,
    Columns2, Rows2, ArrowRight, AlignCenter, ArrowDownToLine, Frame, Star, Type, Square, Grid2x2, Image, Calendar,
    RectangleVertical, PartyPopper, Trophy, Layout, Maximize, MessageSquare, FileText, RectangleHorizontal, LayoutTemplate,
    MessageSquareQuote, Split, SplitSquareHorizontal
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
            <div className="grid grid-cols-5 gap-2">
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
                                "w-5 h-5",
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
