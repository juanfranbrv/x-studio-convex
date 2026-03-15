'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useCreationFlow } from '@/hooks/useCreationFlow'
import { LayoutSelector } from './creation-flow/LayoutSelector'
import { SocialFormatSelector } from './creation-flow/SocialFormatSelector'
import { BrandingConfigurator } from './creation-flow/BrandingConfigurator'
import { ContentImageCard } from './creation-flow/ContentImageCard'
import { StyleImageCard } from './creation-flow/StyleImageCard'
import { AuxiliaryLogosCard } from './creation-flow/AuxiliaryLogosCard'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Palette, Layout, Layers, ImagePlus, Wand2, Fingerprint, RotateCcw, History, Plus, Save, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HexColorPicker } from 'react-colorful'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useUI } from '@/contexts/UIContext'
import { useTranslation } from 'react-i18next'
import { useStylePresetImages } from '@/hooks/useStylePresetImages'
import {
    IntentCategory,
    INTENT_CATALOG,
    MERGED_LAYOUTS_BY_INTENT,
    type VisionAnalysis,
    type TextAsset,
} from '@/lib/creation-flow-types'
import { FloatingAssistance } from './creation-flow/FloatingAssistance'
import { cn } from '@/lib/utils'
import { SectionHeader } from '@/components/studio/shared/SectionHeader'
import {
    STUDIO_CONTROLS_SHELL_CLASS,
    STUDIO_PANEL_CARD_PADDED_CLASS,
    STUDIO_PANEL_CARD_PADDED_LG_CLASS,
} from '@/components/studio/shared/panelStyles'
import { SuggestionsList } from '@/components/studio/shared/SuggestionsList'
import {
    clearLegacyLayoutRatingStorage,
    getLayoutRatingStats,
    hasLayoutRatingsMigrationRun,
    markLayoutRatingsMigrationAsDone,
    readLegacyLayoutMarks,
    readLegacyLayoutRatings,
    type LayoutRatingStoreEntry,
} from '@/lib/layout-ratings'
import type { CompositionSummary } from '@/lib/admin-compositions-actions'

const RESET_USES4_FLAG = 'admin_layout_ratings_reset_uses4_done_v1'

type BrandColorRole = 'Texto' | 'Fondo' | 'Acento'
type DraggedBrandColor = { role: BrandColorRole; color: string } | null

function normalizeHexColor(color: string): string {
    const base = (color || '').trim().toLowerCase()
    if (!base) return '#000000'
    const withHash = base.startsWith('#') ? base : `#${base}`
    return /^#[0-9a-f]{6}$/i.test(withHash) ? withHash : '#000000'
}

function RoleColorSwatch({
    color,
    onCommit,
    applyLabel,
    draggable = false,
    onDragStart,
    onDragEnd,
    sizeClass = "w-12 h-12 rounded-full",
}: {
    color: string
    onCommit: (nextColor: string) => void
    applyLabel: string
    draggable?: boolean
    onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void
    onDragEnd?: (event: React.DragEvent<HTMLButtonElement>) => void
    sizeClass?: string
}) {
    const initial = normalizeHexColor(color)
    const [draft, setDraft] = useState(initial)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setDraft(initial)
    }, [initial])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(sizeClass, "border border-border/70 shadow-sm")}
                    style={{ backgroundColor: initial }}
                    title={initial}
                    draggable={draggable}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3 space-y-3 bg-card border border-border/80 shadow-xl z-[140]" align="start">
                <HexColorPicker
                    color={draft}
                    onChange={(next) => setDraft(normalizeHexColor(next))}
                    className="!w-full !h-28"
                />
                <Input
                    value={draft.toUpperCase()}
                    onChange={(e) => setDraft(normalizeHexColor(e.target.value))}
                    className="h-8 text-xs font-mono"
                />
                <Button
                    type="button"
                    size="sm"
                    className="w-full h-8 text-xs"
                    onClick={() => {
                        onCommit(draft)
                        setOpen(false)
                    }}
                >
                    {applyLabel}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

function AddAccentSwatch({
    disabled,
    onAdd,
    label,
}: {
    disabled?: boolean
    onAdd: (nextColor: string) => void
    label: string
}) {
    const [open, setOpen] = useState(false)
    const [draft, setDraft] = useState('#4f46e5')
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "w-12 h-12 rounded-full border border-dashed border-border/80 flex items-center justify-center text-muted-foreground",
                        "hover:text-primary hover:border-primary/60 transition-colors",
                        disabled && "opacity-40 cursor-not-allowed"
                    )}
                    title={label}
                >
                    <Plus className="w-5 h-5" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3 space-y-3 bg-card border border-border/80 shadow-xl z-[140]" align="start">
                <HexColorPicker
                    color={draft}
                    onChange={(next) => setDraft(normalizeHexColor(next))}
                    className="!w-full !h-28"
                />
                <Input
                    value={draft.toUpperCase()}
                    onChange={(e) => setDraft(normalizeHexColor(e.target.value))}
                    className="h-8 text-xs font-mono"
                />
                <Button
                    type="button"
                    size="sm"
                    className="w-full h-8 text-xs"
                    onClick={() => {
                        onAdd(draft)
                        setOpen(false)
                    }}
                >
                    {label}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

interface ControlsPanelProps {
    creationFlow: ReturnType<typeof useCreationFlow>
    highlightedFields?: Set<string>
    aspectRatio?: string
    hidePromptArea?: boolean
    promptValue: string
    onPromptChange: (value: string) => void
    isMagicParsing: boolean
    isGenerating: boolean
    canGenerate: boolean
    onUnifiedAction: () => void
    onAnalyze: () => Promise<any>
    onCancelAnalyze?: () => void
    isAdmin?: boolean
    adminEmail?: string
    compositionMode?: 'basic' | 'advanced'
    onCompositionModeChange?: (mode: 'basic' | 'advanced') => void
    layoutOverrides?: CompositionSummary[]
    sessions?: Array<{
        id: string
        title: string
        updatedAt: string
        active?: boolean
    }>
    selectedSessionId?: string
    onSelectSession?: (id: string) => void
    onCreateSession?: () => void
    onRenameSession?: () => void
    onDeleteSession?: () => void
    onClearSessions?: () => void
    onSaveSessionNow?: () => void
    isCreatingSession?: boolean
    isSavingSession?: boolean
    sessionSavedAt?: string | null
    sessionSaveError?: string | null
    hasUnsavedChanges?: boolean
    isCancelingAnalyze?: boolean
}

export function ControlsPanel({
    creationFlow,
    highlightedFields = new Set(),
    aspectRatio,
    hidePromptArea = false,
    promptValue,
    onPromptChange,
    isMagicParsing,
    isGenerating,
    canGenerate,
    onUnifiedAction,
    onAnalyze,
    onCancelAnalyze,
    isAdmin = false,
    adminEmail,
    compositionMode,
    onCompositionModeChange,
    layoutOverrides,
    sessions = [],
    selectedSessionId,
    onSelectSession,
    onCreateSession,
    onRenameSession,
    onDeleteSession,
    onClearSessions,
    onSaveSessionNow,
    isCreatingSession = false,
    isSavingSession = false,
    sessionSavedAt = null,
    sessionSaveError = null,
    hasUnsavedChanges = false,
    isCancelingAnalyze = false,
}: ControlsPanelProps) {
    const { t, i18n } = useTranslation('image')
    const { toast } = useToast()
    const { panelPosition, assistanceEnabled } = useUI()
    const [isMobile, setIsMobile] = useState(false)
    const [showLabCatalog, setShowLabCatalog] = useState(compositionMode === 'advanced')
    const [layoutIntentOverride, setLayoutIntentOverride] = useState<'auto' | IntentCategory>('auto')
    const [draggedBrandColor, setDraggedBrandColor] = useState<DraggedBrandColor>(null)
    const [isInspiring, setIsInspiring] = useState(false)
    const STEP_ASSISTANCE: Record<number, { title: string; description: string }> = {
        1: { title: t('ui.ideaTitle'), description: t('ui.ideaDescription') },
        2: { title: t('ui.designTitle'), description: t('ui.designDescription') },
        3: { title: t('ui.formatTitle'), description: t('ui.formatDescription') },
        4: { title: t('ui.imageTitle'), description: t('ui.imageDescription') },
        6: { title: t('ui.brandTitle'), description: t('ui.brandDescription') }
    }
    const upsertLayoutVote = useMutation(api.layoutRatings.upsertLayoutVote)
    const migrateLegacyRatings = useMutation(api.layoutRatings.migrateLegacyRatings)
    const resetLayoutRatings = useMutation(api.layoutRatings.resetLayoutRatings)
    const { activeBrandKit, updateActiveBrandKit, setActiveBrandKit, reloadBrandKits } = useBrandKit()
    const layoutRatingsRows = useQuery(
        api.layoutRatings.listLayoutRatings,
        isAdmin && adminEmail ? { admin_email: adminEmail, layoutIdPrefix: 'lab-v6-' } : 'skip'
    )

    // REFS FOR STEPS (To anchor the Floating Assistance via Portals)
    const step1Ref = useRef<HTMLDivElement>(null)
    const step2Ref = useRef<HTMLDivElement>(null)
    const step3Ref = useRef<HTMLDivElement>(null)
    const step4Ref = useRef<HTMLDivElement>(null)
    const step6Ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateViewport = () => setIsMobile(window.innerWidth < 768)
        updateViewport()
        window.addEventListener('resize', updateViewport)
        return () => window.removeEventListener('resize', updateViewport)
    }, [])

    const {
        state,
        availableLayouts,
        selectLayout,
        selectLogo,
        setHeadline,
        setCta,
        setCtaUrl,
        setCtaUrlEnabled,
        setCustomStyle,
        setApplyStyleToTypography,
        toggleBrandColor,
        removeBrandColor,
        addCustomColor,
        refreshBrandColorsFromKit,
        selectPlatform,
        selectFormat,
        selectedLayoutMeta,
        uploadImage,
        removeUploadedImage,
        clearUploadedImages,
        setImageSourceMode,
        setAiImageDescription,
        toggleBrandKitImage,
        clearBrandKitImages,
        setReferenceImageRole,
        setStylePreset,
        reset,
        addTextAsset,
        removeTextAsset,
        updateTextAsset,
    } = creationFlow
    const currentGenerationKey = (state.generatedImage || '').trim()
    const hasVotedCurrentGeneration = useQuery(
        api.layoutRatings.hasLayoutVoteForGeneration,
        isAdmin && adminEmail && state.selectedLayout && currentGenerationKey
            ? {
                admin_email: adminEmail,
                layoutId: state.selectedLayout,
                generationKey: currentGenerationKey,
            }
            : 'skip'
    )
    const { stylePresets } = useStylePresetImages()
    const stylePresetsStatus: 'Exhausted' = 'Exhausted'

    const lastInitBrandId = useRef<string | null>(null)

    useEffect(() => {
        const brandId = activeBrandKit?.id || (activeBrandKit as any)?._id
        if (!activeBrandKit || !brandId) return

        const hasSelectedColors = state.selectedBrandColors.length > 0
        if (hasSelectedColors && lastInitBrandId.current === brandId) return

        if (!hasSelectedColors && activeBrandKit.colors && activeBrandKit.colors.length > 0) {
            console.log(`[ControlsPanel] Initializing colors for Brand Kit: ${brandId}`)
            activeBrandKit.colors.forEach((c) => {
                const rawRole = ((c.role as string) || 'Acento').trim().toUpperCase()
                let role: 'Texto' | 'Fondo' | 'Acento' = 'Acento'
                if (rawRole.includes('TEXT')) role = 'Texto'
                else if (rawRole.includes('FOND')) role = 'Fondo'
                else if (rawRole.includes('ACENT')) role = 'Acento'

                const color = (c.color || (c as any).hex || (typeof c === 'string' ? c : '')).toLowerCase()
                if (color) toggleBrandColor(color, role)
            })
        }

        lastInitBrandId.current = brandId
    }, [activeBrandKit, state.selectedBrandColors.length, toggleBrandColor])



    const handleInspire = async () => {
        const brandKitId = (activeBrandKit?.id || (activeBrandKit as any)?._id) as string | undefined
        if (!brandKitId || isInspiring) return
        setIsInspiring(true)
        try {
            const res = await fetch('/api/generate-user-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ module: 'image', brandKitId }),
            })
            const data = await res.json()
            if (data.success && data.text) {
                onPromptChange(data.text)
            }
        } catch (err) {
            console.error('Failed to generate prompt inspiration:', err)
        } finally {
            setIsInspiring(false)
        }
    }

    const brandKitImages = (activeBrandKit?.images || []).reduce((acc: Array<{ id: string; url: string; name?: string }>, img, idx) => {
        const imageUrl = typeof img === 'string' ? img : img.url
        if (imageUrl && !acc.find(i => i.url === imageUrl)) {
            acc.push({
                id: imageUrl,
                url: imageUrl,
                name: t('ui.brandKitImageLabel', { defaultValue: 'Image {{index}}', index: idx + 1 })
            })
        }
        return acc
    }, [])
    const brandKitLogos = (activeBrandKit?.logos || []).reduce((acc: Array<{ id: string; url: string; name?: string }>, logo, idx) => {
        const logoUrl = typeof logo === 'string' ? logo : logo.url
        if (logoUrl && !acc.find((item) => item.url === logoUrl)) {
            acc.push({ id: logoUrl, url: logoUrl, name: `Logo ${idx + 1}` })
        }
        return acc
    }, [])

    const refreshActiveBrandKitContent = async () => {
        const currentId = activeBrandKit?.id || (activeBrandKit as any)?._id
        if (!currentId) return
        await setActiveBrandKit(String(currentId), false, false)
        await reloadBrandKits(true)
    }

    const layoutRatingStore: Record<string, LayoutRatingStoreEntry> = (layoutRatingsRows || []).reduce(
        (acc: Record<string, LayoutRatingStoreEntry>, row: { layoutId: string; totalPoints: number; uses: number; votes: number }) => {
            acc[row.layoutId] = {
                totalPoints: row.totalPoints,
                uses: row.uses,
                votes: row.votes,
            }
            return acc
        },
        {}
    )

    useEffect(() => {
        if (!isAdmin || !adminEmail || hasLayoutRatingsMigrationRun()) return

        const legacyMarks = readLegacyLayoutMarks()
        const legacyRatings = readLegacyLayoutRatings()
        const hasMarks = Object.keys(legacyMarks).length > 0
        const hasRatings = Object.keys(legacyRatings).length > 0

        if (!hasMarks && !hasRatings) {
            markLayoutRatingsMigrationAsDone()
            return
        }

        let cancelled = false

        const runMigration = async () => {
            try {
                await migrateLegacyRatings({
                    admin_email: adminEmail,
                    marks: hasMarks ? legacyMarks : undefined,
                    ratings: hasRatings ? legacyRatings : undefined,
                })
                if (!cancelled) {
                    clearLegacyLayoutRatingStorage()
                    markLayoutRatingsMigrationAsDone()
                    toast({
                        title: t('ui.layoutVotesImportedTitle', {
                            defaultValue: 'Ratings migrated to Convex',
                        }),
                        description: t('ui.layoutVotesImportedDescription', {
                            defaultValue: 'Previous layout votes and marks were imported.',
                        }),
                    })
                }
            } catch (error) {
                console.error('Layout ratings migration failed:', error)
            }
        }

        runMigration()
        return () => {
            cancelled = true
        }
    }, [adminEmail, isAdmin, migrateLegacyRatings, toast])

    useEffect(() => {
        if (!isAdmin || !adminEmail || typeof window === 'undefined') return
        if (window.localStorage.getItem(RESET_USES4_FLAG) === '1') return

        let cancelled = false
        const runReset = async () => {
            try {
                const result = await resetLayoutRatings({
                    admin_email: adminEmail,
                    layoutIdPrefix: 'lab-v6-',
                    exactUses: 4,
                })
                if (!cancelled) {
                    window.localStorage.setItem(RESET_USES4_FLAG, '1')
                    if (result?.updated > 0) {
                        toast({
                            title: t('ui.layoutRatingsResetTitle', {
                                defaultValue: 'Ratings corrected',
                            }),
                            description: t('ui.layoutRatingsResetDescription', {
                                defaultValue: '{{count}} layouts with 4 uses were reset to 0.',
                                count: result.updated,
                            }),
                        })
                    }
                }
            } catch (error) {
                console.error('resetLayoutRatings failed:', error)
            }
        }

        runReset()
        return () => {
            cancelled = true
        }
    }, [adminEmail, isAdmin, resetLayoutRatings, toast])

    const selectedLayoutRatingStats = state.selectedLayout
        ? getLayoutRatingStats(state.selectedLayout, layoutRatingStore)
        : null
    const primaryEmail = useMemo(() => {
        const emails = (activeBrandKit as any)?.emails
        if (!Array.isArray(emails)) return ''
        return String(emails.find((value: unknown) => typeof value === 'string' && value.trim()) || '').trim()
    }, [activeBrandKit])
    const phoneValues = useMemo(() => {
        const phones = (activeBrandKit as any)?.phones
        if (!Array.isArray(phones)) return [] as string[]
        return phones
            .map((value: unknown) => String(value || '').trim())
            .filter(Boolean)
    }, [activeBrandKit])
    const addressValues = useMemo(() => {
        const addresses = (activeBrandKit as any)?.addresses
        if (!Array.isArray(addresses)) return [] as string[]
        return addresses
            .map((value: unknown) => String(value || '').trim())
            .filter(Boolean)
    }, [activeBrandKit])

    const getContactAssetById = (assetId: string) =>
        state.selectedTextAssets.find((asset) => asset.id === assetId) || null

    const toggleContactAsset = (asset: TextAsset) => {
        const exists = getContactAssetById(asset.id)
        if (exists) {
            removeTextAsset(asset.id)
            return
        }
        addTextAsset(asset)
    }

    const updateContactAssetValue = (assetId: string, value: string) => {
        updateTextAsset(assetId, value)
    }
    const brandColorsByRole = useMemo(() => {
        const grouped: Record<BrandColorRole, string[]> = {
            Texto: [],
            Fondo: [],
            Acento: [],
        }

        state.selectedBrandColors.forEach((item) => {
            const normalized = normalizeHexColor(item.color)
            const role = item.role === 'Texto' || item.role === 'Fondo' ? item.role : 'Acento'
            if (!grouped[role].includes(normalized)) {
                grouped[role].push(normalized)
            }
        })

        return grouped
    }, [state.selectedBrandColors])

    const replaceRoleColor = (role: BrandColorRole, nextColorRaw: string, previousColor?: string) => {
        const nextColor = normalizeHexColor(nextColorRaw)
        const prevColor = previousColor ? normalizeHexColor(previousColor) : null

        if (prevColor && prevColor !== nextColor) {
            removeBrandColor(prevColor)
        }

        if (role !== 'Acento') {
            brandColorsByRole[role].forEach((existing) => {
                if (!prevColor || existing !== prevColor) {
                    removeBrandColor(existing)
                }
            })
        }

        toggleBrandColor(nextColor, role)
    }

    const addAccentColor = (nextColorRaw: string) => {
        const nextColor = normalizeHexColor(nextColorRaw)
        if (brandColorsByRole.Acento.length >= 5) return
        toggleBrandColor(nextColor, 'Acento')
    }

    const setColorRole = (colorRaw: string, role: BrandColorRole) => {
        const color = normalizeHexColor(colorRaw)
        removeBrandColor(color)
        toggleBrandColor(color, role)
    }

    const swapBrandColorRoles = (
        source: { role: BrandColorRole; color: string },
        targetRole: BrandColorRole,
        explicitTargetColor?: string
    ) => {
        const sourceColor = normalizeHexColor(source.color)
        const sourceRole = source.role
        const targetColor = explicitTargetColor
            ? normalizeHexColor(explicitTargetColor)
            : (targetRole === 'Acento' ? undefined : brandColorsByRole[targetRole][0])

        if (sourceRole === targetRole && (!targetColor || targetColor === sourceColor)) return

        setColorRole(sourceColor, targetRole)

        if (targetColor && targetColor !== sourceColor) {
            const returnRole: BrandColorRole = sourceRole === 'Acento' ? 'Acento' : sourceRole
            setColorRole(targetColor, returnRole)
        }
    }
    const effectiveSessionId = selectedSessionId !== undefined
        ? selectedSessionId
        : (sessions.find((session) => session.active)?.id || '')
    const selectedIntentMeta = INTENT_CATALOG.find((intent) => intent.id === state.selectedIntent)
    const effectiveLayoutIntent: IntentCategory = (
        layoutIntentOverride === 'auto'
            ? (state.selectedIntent as IntentCategory)
            : layoutIntentOverride
    )

    const compositionCatalogLayouts = useMemo(() => {
        const base = MERGED_LAYOUTS_BY_INTENT[effectiveLayoutIntent] || availableLayouts
        if (!layoutOverrides || layoutOverrides.length === 0) return base

        return base.map(layout => {
            const override = layoutOverrides.find(o => o.id === layout.id)
            if (override && override.svgIcon && override.svgIcon !== 'Layout') {
                return { ...layout, svgIcon: override.svgIcon }
            }
            return layout
        })
    }, [effectiveLayoutIntent, availableLayouts, layoutOverrides])

    useEffect(() => {
        if (!compositionMode) return
        setShowLabCatalog(compositionMode === 'advanced')
    }, [compositionMode])

    useEffect(() => {
        onCompositionModeChange?.(showLabCatalog ? 'advanced' : 'basic')
    }, [showLabCatalog, onCompositionModeChange])

    useEffect(() => {
        if (!showLabCatalog && state.currentStep === 2) {
            creationFlow.setStep(3)
        }
    }, [showLabCatalog, state.currentStep, creationFlow])

    const handleAdminLayoutVote = async (score: number) => {
        if (!isAdmin || !adminEmail || !state.selectedLayout || !currentGenerationKey) return
        if (hasVotedCurrentGeneration) {
            toast({
                title: t('ui.voteAlreadyRecordedTitle', { defaultValue: 'Already rated' }),
                description: t('ui.voteAlreadyRecordedCurrentDescription', {
                    defaultValue: 'This generation already has a vote for this layout.',
                }),
            })
            return
        }
        try {
            const nextStats = await upsertLayoutVote({
                admin_email: adminEmail,
                layoutId: state.selectedLayout,
                score,
                generationKey: currentGenerationKey,
            })
            if (nextStats.alreadyVoted) {
                toast({
                    title: t('ui.voteAlreadyRecordedTitle', { defaultValue: 'Already rated' }),
                    description: t('ui.voteAlreadyRecordedDescription', {
                        defaultValue: 'This generation already had a registered vote.',
                    }),
                })
                return
            }
            toast({
                title: t('ui.voteRegisteredTitle', { defaultValue: 'Vote saved' }),
                description: t('ui.voteRegisteredDescription', {
                    defaultValue: '{{score}}/5 · avg {{average}} · uses {{uses}}',
                    score,
                    average: nextStats.average.toFixed(2),
                    uses: nextStats.uses,
                }),
            })
        } catch (error: any) {
            toast({
                title: t('ui.voteSaveErrorTitle', { defaultValue: 'Error saving vote' }),
                description: error?.message || t('ui.voteSaveErrorDescription', {
                    defaultValue: 'The vote could not be recorded.',
                }),
                variant: 'destructive',
            })
        }
    }

    return (
        <div className={STUDIO_CONTROLS_SHELL_CLASS}>
            <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-5">
                {/* SECTION: Sessions */}
                <div className={`${STUDIO_PANEL_CARD_PADDED_LG_CLASS} space-y-4`}>
                    <SectionHeader
                        icon={History}
                        title={t('ui.history')}
                        className="mb-2"
                        extra={
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                                    {isSavingSession ? (
                                        <>
                                            <Loader2 className="w-3 h-3" />
                                            {t('ui.saving')}
                                        </>
                                    ) : sessionSaveError ? (
                                        <>
                                            <AlertCircle className="w-3 h-3" />
                                            {t('ui.errorShort')}
                                        </>
                                    ) : hasUnsavedChanges ? (
                                        t('ui.unsavedChanges')
                                    ) : sessionSavedAt ? (
                                        <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            {t('ui.savedAt', {
                                                time: new Date(sessionSavedAt).toLocaleTimeString(i18n.language || t('ui.locale'), { hour: '2-digit', minute: '2-digit' })
                                            })}
                                        </>
                                    ) : t('ui.noChanges')}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={onSaveSessionNow}
                                    disabled={isSavingSession || !hasUnsavedChanges}
                                    title={t('ui.saveHistoryNow')}
                                >
                                    <Save
                                        className={cn(
                                            "w-3.5 h-3.5 transition-colors",
                                            isSavingSession
                                                ? "text-muted-foreground/40"
                                                : hasUnsavedChanges
                                                    ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.45)]"
                                                    : "text-muted-foreground/55"
                                        )}
                                    />
                                </Button>
                            </div>
                        }
                    />
                    <div className="space-y-3 pt-1.5">
                        <select
                            className="h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-xs"
                            value={effectiveSessionId}
                            onChange={(event) => {
                                const value = event.target.value
                                if (value) onSelectSession?.(value)
                            }}
                        >
                            {effectiveSessionId ? null : <option value="">{t('ui.noSessions')}</option>}
                            {sessions.map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.title} {session.active ? `(${t('ui.activeSession')})` : ''} - {new Date(session.updatedAt).toLocaleTimeString(i18n.language || t('ui.locale'), { hour: '2-digit', minute: '2-digit' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                            variant="default"
                            size="sm"
                            className="h-7 px-2 text-[10px] gap-1"
                            onClick={onCreateSession}
                            disabled={isCreatingSession}
                        >
                            <Plus className="w-3 h-3" />
                            {t('ui.newSession')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px]"
                            onClick={onRenameSession}
                            disabled={!effectiveSessionId}
                        >
                            {t('ui.renameSession')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px]"
                            onClick={onDeleteSession}
                            disabled={!effectiveSessionId}
                        >
                            {t('ui.deleteSession')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px]"
                            onClick={onClearSessions}
                        >
                            {t('ui.deleteHistory')}
                        </Button>
                    </div>
                </div>

                {/* STEP 1: Intent Input */}
                <div ref={step1Ref} className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-3 relative group`}>
                    {(isMagicParsing || isGenerating) && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-shimmer" />
                    )}
                    <SectionHeader
                        icon={Wand2}
                        title={t('ui.whatToCreate')}
                    />
                    <div className="relative">
                        <Textarea
                            value={promptValue}
                            onChange={(e) => onPromptChange(e.target.value)}
                            placeholder={t('ui.ideaPlaceholder')}
                            className={cn(
                                'min-h-[100px] text-sm resize-none bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary transition-all',
                                isMobile ? 'pb-3 pr-2' : 'pb-12 pr-2'
                            )}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    if (!isMagicParsing && promptValue.trim()) {
                                        onAnalyze()
                                    }
                                }
                            }}
                        />
                        {!promptValue.trim() && activeBrandKit && (
                            <button
                                type="button"
                                onClick={handleInspire}
                                disabled={isInspiring}
                                className="absolute right-3 top-3 z-10 text-primary/70 hover:text-primary transition-colors disabled:opacity-50"
                                title="Generate a prompt idea for me"
                            >
                                {isInspiring ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4" />
                                )}
                            </button>
                        )}
                        <div className={cn(
                            isMobile
                                ? 'mt-3 flex items-center justify-end gap-2'
                                : 'absolute left-2 right-2 bottom-2 flex flex-wrap items-center gap-2'
                        )}>
                            {isMagicParsing && onCancelAnalyze ? (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={onCancelAnalyze}
                                    className={cn(
                                        'h-8 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground',
                                        isMobile ? 'w-auto' : ''
                                    )}
                                >
                                    {t('ui.stop')}
                                </Button>
                            ) : null}
                            {isCancelingAnalyze ? (
                                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                    {t('ui.canceling')}
                                </span>
                            ) : null}
                            <Button
                                size="sm"
                                onClick={onAnalyze}
                                disabled={isMagicParsing || !promptValue.trim()}
                                className={cn(
                                    'group feedback-action h-8 px-3 sm:px-4 text-[11px] sm:text-xs uppercase font-bold tracking-wider bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 whitespace-nowrap',
                                    isMobile ? 'w-full justify-center' : 'ml-auto'
                                )}
                            >
                                {isMagicParsing ? (
                                    <>
                                        <Loader2 className="mr-2 h-3.5 w-3.5" />
                                        {t('ui.analyzing', { defaultValue: 'Analizando' })}
                                    </>
                                ) : (
                                    t('ui.analyze')
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Suggestions List */}
                    <SuggestionsList
                        suggestions={state.suggestions}
                        hasOriginalState={!!state.originalState}
                        onApply={(index) => {
                            creationFlow.applySuggestion(index)
                            toast({
                                title: t('ui.suggestionAppliedTitle'),
                                description: t('ui.suggestionAppliedDescription'),
                            })
                        }}
                        onUndo={() => {
                            creationFlow.undoSuggestion()
                            toast({
                                title: t('ui.changesRevertedTitle'),
                                description: t('ui.changesRevertedDescription'),
                            })
                        }}
                    />
                    <FloatingAssistance
                        isVisible={assistanceEnabled && state.currentStep === 1 && !state.hasGeneratedImage && !isGenerating}
                        {...STEP_ASSISTANCE[1]}
                        side={panelPosition === 'right' ? 'left' : 'right'}
                        anchorRef={step1Ref}
                    />
                </div>

                {(state.selectedIntent || state.currentStep >= 2) && (
                    <>
                        {/* STEP 2: LAYOUT */}
                        {availableLayouts.length > 0 && (
                            <div ref={step2Ref} className={`relative ${STUDIO_PANEL_CARD_PADDED_CLASS}`}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 2 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[2]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step2Ref} />
                                <SectionHeader
                                    icon={Layout}
                                    title={t('ui.designTitle')}
                                    extra={
                                        <div className="flex items-center gap-2">
                                            <span className={cn('text-[10px] font-medium', showLabCatalog ? 'text-primary' : 'text-muted-foreground')}>
                                                {t('ui.designAdvancedAria')}
                                            </span>
                                            <Switch
                                                checked={showLabCatalog}
                                                onCheckedChange={setShowLabCatalog}
                                                aria-label={t('ui.designAdvancedAria')}
                                            />
                                        </div>
                                    }
                                />
                                <div className="space-y-3">
                                    {showLabCatalog ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <Select
                                                    value={layoutIntentOverride}
                                                    onValueChange={(value) => setLayoutIntentOverride(value as 'auto' | IntentCategory)}
                                                >
                                                    <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue placeholder={t('ui.selectIntent')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="auto">
                                                            {t('ui.autoDetectedIntent', {
                                                                defaultValue: 'Auto (detected: {{intent}})',
                                                                intent: selectedIntentMeta?.name || state.selectedIntent,
                                                            })}
                                                        </SelectItem>
                                                        {INTENT_CATALOG.map((intent) => (
                                                            <SelectItem key={intent.id} value={intent.id}>
                                                                {intent.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-full">
                                                <LayoutSelector
                                                    availableLayouts={compositionCatalogLayouts}
                                                    selectedLayout={state.selectedLayout}
                                                    onSelectLayout={selectLayout}
                                                    intent={effectiveLayoutIntent}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="rounded-xl border border-border/70 bg-muted/25 px-3 py-2">
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                {t('ui.basicModeDescription')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: FORMAT */}
                        <div ref={step3Ref} className={`relative ${STUDIO_PANEL_CARD_PADDED_CLASS}`}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 3 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[3]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step3Ref} />
                                <SectionHeader icon={Layers} title={t('ui.formatTitle')} />
                                <SocialFormatSelector
                                    selectedPlatform={state.selectedPlatform}
                                    selectedFormat={state.selectedFormat}
                                    onSelectPlatform={selectPlatform}
                                    onSelectFormat={selectFormat}
                                />
                                {!state.selectedFormat && (
                                    <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                                        {t('ui.selectPlatformDescription')}
                                    </p>
                                )}
                        </div>

                        {/* STEP 4A: CONTENT */}
                        <div ref={step4Ref} className={`relative ${STUDIO_PANEL_CARD_PADDED_CLASS}`}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 4 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[4]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step4Ref} />
                                <SectionHeader
                                    icon={ImagePlus}
                                    title={state.imageSourceMode === 'generate' ? t('ui.generatedContentTitle') : t('ui.userContentTitle')}
                                    extra={(
                                        <Switch
                                            checked={state.imageSourceMode === 'generate'}
                                            onCheckedChange={(checked) => setImageSourceMode(checked ? 'generate' : 'upload')}
                                        />
                                    )}
                                />
                                <ContentImageCard
                                    mode={state.imageSourceMode}
                                    onModeChange={setImageSourceMode}
                                    uploadedImages={state.uploadedImages}
                                    onUpload={uploadImage}
                                    onRemoveUploadedImage={removeUploadedImage}
                                    onClearUploadedImages={clearUploadedImages}
                                    brandKitImages={brandKitImages}
                                    selectedBrandKitImageIds={state.selectedBrandKitImageIds}
                                    onToggleBrandKitImage={toggleBrandKitImage}
                                    onClearBrandKitImages={clearBrandKitImages}
                                    referenceImageRoles={state.referenceImageRoles}
                                    onReferenceRoleChange={setReferenceImageRole}
                                    aiImageDescription={state.aiImageDescription}
                                    onAiDescriptionChange={setAiImageDescription}
                                    suggestedImagePrompts={state.imagePromptSuggestions}
                                    isAnalyzing={state.isAnalyzing || false}
                                    error={null}
                                    visionAnalysis={state.visionAnalysis ?? null}
                                />
                        </div>

                        {/* STEP 4B: STYLE */}
                        <div className={`relative ${STUDIO_PANEL_CARD_PADDED_CLASS}`}>
                                <SectionHeader icon={Palette} title={t('ui.styleTitle', { defaultValue: 'Estilo' })} />
                                <StyleImageCard
                                    uploadedImages={state.uploadedImages}
                                    onUpload={uploadImage}
                                    onRemoveUploadedImage={removeUploadedImage}
                                    brandKitImages={brandKitImages}
                                    selectedBrandKitImageIds={state.selectedBrandKitImageIds}
                                    onToggleBrandKitImage={toggleBrandKitImage}
                                    referenceImageRoles={state.referenceImageRoles}
                                    onReferenceRoleChange={setReferenceImageRole}
                                    stylePresets={stylePresets || []}
                                    stylePresetsStatus={stylePresetsStatus}
                                    selectedStylePresetId={state.selectedStylePresetId || null}
                                    selectedStylePresetName={state.selectedStylePresetName || null}
                                    onSelectStylePreset={(preset) => {
                                        if (!preset) {
                                            setStylePreset(null)
                                            return
                                        }
                                        setStylePreset({
                                            id: preset.id,
                                            name: preset.name || t('ui.styleFallbackName', { defaultValue: 'Style' }),
                                        })
                                    }}
                                    isAnalyzing={state.isAnalyzing || false}
                                    error={state.error}
                                />
                                <div className="mt-4 rounded-xl border border-border/70 bg-background/65 px-3 py-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <p className="text-[12px] font-medium leading-none">{t('ui.styleTypographyTitle')}</p>
                                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                                                {t('ui.styleTypographyDescription')}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={Boolean(state.applyStyleToTypography)}
                                            onCheckedChange={setApplyStyleToTypography}
                                            aria-label={t('ui.styleTypographyAria')}
                                        />
                                    </div>
                                </div>
                        </div>

                        {/* STEP 4C: AUXILIARY LOGOS */}
                        <div className={`relative ${STUDIO_PANEL_CARD_PADDED_CLASS}`}>
                                <AuxiliaryLogosCard
                                    uploadedImages={state.uploadedImages}
                                    onUpload={uploadImage}
                                    onRemoveUploadedImage={removeUploadedImage}
                                    brandKitImages={brandKitImages}
                                    brandKitLogos={brandKitLogos}
                                    onRefreshBrandKitContent={refreshActiveBrandKitContent}
                                    selectedBrandKitImageIds={state.selectedBrandKitImageIds}
                                    onToggleBrandKitImage={toggleBrandKitImage}
                                    referenceImageRoles={state.referenceImageRoles}
                                    onReferenceRoleChange={setReferenceImageRole}
                                />
                        </div>

                        {/* STEP 6: KIT DE MARCA */}
                        <div ref={step6Ref} className={`relative ${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-6`}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep >= 5 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[6]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step6Ref} />
                                <SectionHeader icon={Fingerprint} title={t('ui.brandKitSection')} />

                                <div className="space-y-3">
                                    <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">{t('ui.logo')}</p>
                                    <BrandingConfigurator
                                        selectedLayout={selectedLayoutMeta || null}
                                        selectedLogoId={state.selectedLogoId}
                                        selectedBrandColors={state.selectedBrandColors}
                                        onSelectLogo={selectLogo}
                                        onToggleBrandColor={toggleBrandColor}
                                        onAddCustomColor={addCustomColor}
                                        showLogo={true} showColors={false} showTypography={false} showBrandTexts={false}
                                        rawMessage={promptValue}
                                    />
                                </div>

                                <div className="space-y-3 border-t border-border/60 pt-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">{t('ui.colors')}</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                refreshBrandColorsFromKit()
                                                toast({
                                                    title: t('ui.colorsReloadedTitle'),
                                                    description: t('ui.colorsReloadedDescription'),
                                                })
                                            }}
                                            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            {t('ui.reload')}
                                        </Button>
                                    </div>

                                    <div className="flex items-end gap-3 flex-wrap pb-1">
                                        <div
                                            className={cn(
                                                "flex flex-col items-center gap-1 rounded-xl p-1 transition-colors",
                                                draggedBrandColor && draggedBrandColor.role !== 'Texto' && "bg-primary/5 border border-primary/20"
                                            )}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={(event) => {
                                                event.preventDefault()
                                                if (!draggedBrandColor) return
                                                swapBrandColorRoles(
                                                    draggedBrandColor,
                                                    'Texto',
                                                    brandColorsByRole.Texto[0]
                                                )
                                                setDraggedBrandColor(null)
                                            }}
                                        >
                                            {brandColorsByRole.Texto[0] ? (
                                                <RoleColorSwatch
                                                    color={brandColorsByRole.Texto[0]}
                                                    onCommit={(nextColor) => replaceRoleColor('Texto', nextColor, brandColorsByRole.Texto[0])}
                                                    applyLabel={t('ui.applyColor')}
                                                    draggable
                                                    onDragStart={() => setDraggedBrandColor({ role: 'Texto', color: brandColorsByRole.Texto[0] })}
                                                    onDragEnd={() => setDraggedBrandColor(null)}
                                                />
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 px-2 text-[10px]"
                                                    onClick={() => replaceRoleColor('Texto', '#111111')}
                                                >
                                                    {t('ui.add')}
                                                </Button>
                                            )}
                                            <span className="text-[10px] text-muted-foreground">{t('ui.text')}</span>
                                        </div>

                                        <div
                                            className={cn(
                                                "flex flex-col items-center gap-1 rounded-xl p-1 transition-colors",
                                                draggedBrandColor && draggedBrandColor.role !== 'Fondo' && "bg-primary/5 border border-primary/20"
                                            )}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={(event) => {
                                                event.preventDefault()
                                                if (!draggedBrandColor) return
                                                swapBrandColorRoles(
                                                    draggedBrandColor,
                                                    'Fondo',
                                                    brandColorsByRole.Fondo[0]
                                                )
                                                setDraggedBrandColor(null)
                                            }}
                                        >
                                            {brandColorsByRole.Fondo[0] ? (
                                                <RoleColorSwatch
                                                    color={brandColorsByRole.Fondo[0]}
                                                    onCommit={(nextColor) => replaceRoleColor('Fondo', nextColor, brandColorsByRole.Fondo[0])}
                                                    applyLabel={t('ui.applyColor')}
                                                    draggable
                                                    onDragStart={() => setDraggedBrandColor({ role: 'Fondo', color: brandColorsByRole.Fondo[0] })}
                                                    onDragEnd={() => setDraggedBrandColor(null)}
                                                />
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 px-2 text-[10px]"
                                                    onClick={() => replaceRoleColor('Fondo', '#ffffff')}
                                                >
                                                    {t('ui.add')}
                                                </Button>
                                            )}
                                            <span className="text-[10px] text-muted-foreground">{t('ui.background')}</span>
                                        </div>

                                        <div
                                            className="flex flex-col gap-1 min-w-0 pl-3 ml-2 rounded-xl p-1"
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={(event) => {
                                                event.preventDefault()
                                                if (!draggedBrandColor) return
                                                swapBrandColorRoles(draggedBrandColor, 'Acento')
                                                setDraggedBrandColor(null)
                                            }}
                                        >
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {brandColorsByRole.Acento.map((accentColor) => (
                                                    <div
                                                        key={accentColor}
                                                        className={cn(
                                                            "relative inline-flex items-center group/accent rounded-full",
                                                            draggedBrandColor && draggedBrandColor.color !== accentColor && "ring-2 ring-primary/30 ring-offset-1 ring-offset-background"
                                                        )}
                                                        onDragOver={(event) => event.preventDefault()}
                                                        onDrop={(event) => {
                                                            event.preventDefault()
                                                            if (!draggedBrandColor) return
                                                            swapBrandColorRoles(
                                                                draggedBrandColor,
                                                                'Acento',
                                                                accentColor
                                                            )
                                                            setDraggedBrandColor(null)
                                                        }}
                                                    >
                                                        <RoleColorSwatch
                                                            color={accentColor}
                                                            onCommit={(nextColor) => replaceRoleColor('Acento', nextColor, accentColor)}
                                                            applyLabel={t('ui.applyColor')}
                                                            sizeClass="w-12 h-12 rounded-full"
                                                            draggable
                                                            onDragStart={() => setDraggedBrandColor({ role: 'Acento', color: accentColor })}
                                                            onDragEnd={() => setDraggedBrandColor(null)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border border-border/70 text-muted-foreground hover:text-destructive hover:border-destructive/50 inline-flex items-center justify-center shadow-sm opacity-0 group-hover/accent:opacity-100 group-focus-within/accent:opacity-100 transition-opacity"
                                                            onClick={() => removeBrandColor(accentColor)}
                                                            title={t('ui.removeAccent')}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <AddAccentSwatch
                                                    onAdd={addAccentColor}
                                                    disabled={brandColorsByRole.Acento.length >= 5}
                                                    label={t('ui.addAccent')}
                                                />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground w-12 text-center">{t('ui.accents')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-border/60 pt-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">{t('ui.link')}</p>
                                        <Switch
                                            checked={state.ctaUrlEnabled}
                                            onCheckedChange={(checked) => {
                                                setCtaUrlEnabled(checked, { useKitIfEmpty: true })
                                                updateActiveBrandKit?.({ cta_url_enabled: checked })
                                            }}
                                        />
                                    </div>
                                    {state.ctaUrlEnabled ? (
                                        <Input
                                            value={state.ctaUrl}
                                            onChange={(e) => setCtaUrl(e.target.value)}
                                            placeholder={activeBrandKit?.url?.trim() || 'tuweb.com'}
                                            className="h-9 text-xs"
                                        />
                                    ) : (
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {t('ui.linkDescription')}
                                        </p>
                                    )}
                                </div>

                                {(primaryEmail || phoneValues.length > 0 || addressValues.length > 0) ? (
                                    <div className="space-y-3 pt-1">
                                        <div className="space-y-3">
                                            {primaryEmail ? (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">{t('ui.email')}</p>
                                                        <Switch
                                                            checked={Boolean(getContactAssetById('contact-email-main'))}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    toggleContactAsset({
                                                                        id: 'contact-email-main',
                                                                        type: 'custom',
                                                                        label: t('ui.email'),
                                                                        value: primaryEmail,
                                                                    })
                                                                } else {
                                                                    removeTextAsset('contact-email-main')
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    {getContactAssetById('contact-email-main') ? (
                                                        <Input
                                                            value={getContactAssetById('contact-email-main')?.value || ''}
                                                            onChange={(e) => updateContactAssetValue('contact-email-main', e.target.value)}
                                                            placeholder={primaryEmail}
                                                            className="h-9 text-xs"
                                                        />
                                                    ) : (
                                                        <p className="text-[11px] text-muted-foreground truncate">{primaryEmail}</p>
                                                    )}
                                                </div>
                                            ) : null}

                                            {phoneValues.map((phone, idx) => {
                                                const assetId = `contact-phone-${idx}`
                                                const selectedPhoneAsset = getContactAssetById(assetId)
                                                return (
                                                    <div key={assetId} className="space-y-1.5">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">{t('ui.phone', { index: idx + 1 })}</p>
                                                            <Switch
                                                                checked={Boolean(selectedPhoneAsset)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        toggleContactAsset({
                                                                            id: assetId,
                                                                            type: 'custom',
                                                                            label: t('ui.phone', { index: idx + 1 }),
                                                                            value: phone,
                                                                        })
                                                                    } else {
                                                                    removeTextAsset(assetId)
                                                                }
                                                            }}
                                                        />
                                                        </div>
                                                        {selectedPhoneAsset ? (
                                                            <Input
                                                                value={selectedPhoneAsset.value || ''}
                                                                onChange={(e) => updateContactAssetValue(assetId, e.target.value)}
                                                                placeholder={phone}
                                                                className="h-9 text-xs"
                                                            />
                                                        ) : (
                                                            <p className="text-[11px] text-muted-foreground truncate">{phone}</p>
                                                        )}
                                                    </div>
                                                )
                                            })}

                                            {addressValues.map((address, idx) => {
                                                const assetId = `contact-address-${idx}`
                                                const selectedAddressAsset = getContactAssetById(assetId)
                                                return (
                                                    <div key={assetId} className="space-y-1.5">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">{t('ui.address', { index: idx + 1 })}</p>
                                                            <Switch
                                                                checked={Boolean(selectedAddressAsset)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        toggleContactAsset({
                                                                            id: assetId,
                                                                            type: 'custom',
                                                                            label: t('ui.address', { index: idx + 1 }),
                                                                            value: address,
                                                                        })
                                                                    } else {
                                                                    removeTextAsset(assetId)
                                                                }
                                                            }}
                                                        />
                                                        </div>
                                                        {selectedAddressAsset ? (
                                                            <Input
                                                                value={selectedAddressAsset.value || ''}
                                                                onChange={(e) => updateContactAssetValue(assetId, e.target.value)}
                                                                placeholder={address}
                                                                className="h-9 text-xs"
                                                            />
                                                        ) : (
                                                            <p className="text-[11px] text-muted-foreground break-words">{address}</p>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                        </div>
                    </>
                )}
            </div>

        </div>
    )
}


