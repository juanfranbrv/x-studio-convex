'use client'

import { useState } from 'react'
import {
    ShoppingBag,
    Info,
    Users,
    GraduationCap,
    MessageCircle,
    ChevronRight,
    Percent,
    Package,
    Grid3x3,
    Rocket,
    Briefcase,
    FileText,
    Calendar,
    ListChecks,
    ArrowLeftRight,
    Sparkles,
    Quote,
    UserPlus,
    Trophy,
    Clapperboard,
    BarChart3,
    ListOrdered,
    BookOpen,
    HelpCircle,
    Gamepad2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    type IntentGroup,
    type IntentCategory,
    INTENT_GROUPS,
    INTENT_CATALOG,
} from '@/lib/creation-flow-types'

// Icon mapping for dynamic rendering
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    ShoppingBag, Info, Users, GraduationCap, MessageCircle,
    Percent, Package, Grid3x3, Rocket, Briefcase,
    FileText, Calendar, ListChecks, ArrowLeftRight, Sparkles,
    Quote, UserPlus, Trophy, Clapperboard, BarChart3,
    ListOrdered, BookOpen, HelpCircle, Gamepad2,
}

interface IntentSelectorProps {
    selectedGroup: IntentGroup | null
    selectedIntent: IntentCategory | null
    onSelectGroup: (group: IntentGroup) => void
    onSelectIntent: (intent: IntentCategory) => void
}

export function IntentSelector({
    selectedGroup,
    selectedIntent,
    onSelectGroup,
    onSelectIntent,
}: IntentSelectorProps) {
    const [expandedGroup, setExpandedGroup] = useState<IntentGroup | null>(selectedGroup)

    const handleGroupClick = (group: IntentGroup) => {
        if (expandedGroup === group) {
            setExpandedGroup(null)
        } else {
            setExpandedGroup(group)
            onSelectGroup(group)
        }
    }

    const handleIntentClick = (intentId: IntentCategory) => {
        onSelectIntent(intentId)
        setExpandedGroup(null) // Collapse after selection
    }

    const groupEntries = Object.entries(INTENT_GROUPS) as [IntentGroup, typeof INTENT_GROUPS[IntentGroup]][]

    // Determine if we should only show the active group
    // We show only the active group if an intent is selected AND the user hasn't explicitly clicked to see all
    const activeGroupId = selectedIntent ? INTENT_CATALOG.find(i => i.id === selectedIntent)?.group : null
    const [showAll, setShowAll] = useState(false)

    const visibleGroups = (selectedIntent && !showAll)
        ? groupEntries.filter(([id]) => id === activeGroupId)
        : groupEntries

    return (
        <div className="space-y-2">
            <div className="space-y-1">
                {visibleGroups.map(([groupId, group]) => {
                    const GroupIcon = ICONS[group.icon] || ShoppingBag
                    const isExpanded = expandedGroup === groupId
                    const intentsInGroup = INTENT_CATALOG.filter(i => i.group === groupId)
                    const isChosen = selectedIntent && intentsInGroup.some(i => i.id === selectedIntent)

                    return (
                        <div key={groupId} className={cn(
                            "rounded-xl overflow-hidden transition-all duration-300 border-2",
                            isChosen ? "border-primary/40 bg-primary/5" : "border-transparent bg-transparent"
                        )}>
                            {/* Group Header */}
                            <button
                                onClick={() => {
                                    if (isChosen && !showAll) {
                                        setShowAll(true)
                                        setExpandedGroup(groupId)
                                    } else {
                                        handleGroupClick(groupId)
                                    }
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left",
                                    "hover:bg-muted/50",
                                    isExpanded && !isChosen && "bg-primary/5 text-primary",
                                    isChosen && "text-primary"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                    isExpanded || isChosen ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted"
                                )}>
                                    <GroupIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className={cn("text-sm font-semibold", isChosen && "text-primary tracking-tight")}>{group.name}</p>
                                    <p className="text-[10px] text-muted-foreground line-clamp-1">{group.description}</p>
                                </div>
                                {!isChosen || showAll ? (
                                    <ChevronRight className={cn(
                                        "w-4 h-4 text-muted-foreground transition-transform",
                                        isExpanded && "rotate-90"
                                    )} />
                                ) : (
                                    <div className="p-1 rounded-full bg-primary/10">
                                        <ChevronRight className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                )}
                            </button>

                            {/* Subcategories */}
                            {isExpanded ? (
                                <div className="bg-background/50 border-l-2 border-primary/30 ml-4 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {intentsInGroup.map(intent => {
                                        const IntentIcon = ICONS[intent.icon] || Package
                                        const isSelected = selectedIntent === intent.id

                                        return (
                                            <button
                                                key={intent.id}
                                                onClick={() => {
                                                    handleIntentClick(intent.id)
                                                    setShowAll(false)
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left group",
                                                    "hover:bg-primary/5",
                                                    isSelected && "bg-primary/15 text-primary ring-1 ring-inset ring-primary/20"
                                                )}
                                            >
                                                <IntentIcon className={cn(
                                                    "w-4 h-4",
                                                    isSelected ? "text-primary" : "text-muted-foreground"
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium">{intent.name}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">
                                                        {intent.description}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            ) : (
                                // Partial Collapse View: Show only the selected intent if this group is the selected one
                                !isExpanded && isChosen && (
                                    <div className="bg-primary/10 border-l-2 border-primary ml-4 py-1.5 animate-in fade-in zoom-in-95 duration-300">
                                        {intentsInGroup.filter(i => i.id === selectedIntent).map(intent => {
                                            const IntentIcon = ICONS[intent.icon] || Package
                                            return (
                                                <div key={`collapsed-${intent.id}`}>
                                                    <button
                                                        onClick={() => {
                                                            setShowAll(true)
                                                            setExpandedGroup(groupId)
                                                        }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-1.5 text-primary font-bold hover:bg-primary/5 transition-colors text-left"
                                                    >
                                                        <div className="p-1 rounded bg-primary/20 text-primary">
                                                            <IntentIcon className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[11px] leading-tight">{intent.name}</p>
                                                        </div>
                                                        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                                    </button>
                                                    {/* Extended Description - 3 lines */}
                                                    {intent.extendedDescription && (
                                                        <div className="px-3 py-2 text-[10px] text-muted-foreground leading-relaxed bg-muted/30 border-t border-primary/10">
                                                            {intent.extendedDescription}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
