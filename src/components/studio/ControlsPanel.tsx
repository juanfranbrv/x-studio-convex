'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCreationFlow } from '@/hooks/useCreationFlow'
import { LayoutSelector } from './creation-flow/LayoutSelector'
import { SocialFormatSelector } from './creation-flow/SocialFormatSelector'
import { BrandingConfigurator } from './creation-flow/BrandingConfigurator'
import { ContentImageCard } from './creation-flow/ContentImageCard'
import { StyleImageCard } from './creation-flow/StyleImageCard'
import { AuxiliaryLogosCard } from './creation-flow/AuxiliaryLogosCard'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Palette, Layout, Layers, ImagePlus, Wand2, Loader2, Fingerprint, RotateCcw, History, Plus, Trash2, Save, CheckCircle2, AlertCircle, X } from 'lucide-react'
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
import {
    IntentCategory,
    INTENT_CATALOG,
    MERGED_LAYOUTS_BY_INTENT,
    type VisionAnalysis,
    type TextAsset,
} from '@/lib/creation-flow-types'
import { FloatingAssistance } from './creation-flow/FloatingAssistance'
import { cn } from '@/lib/utils'
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

const STEP_ASSISTANCE: Record<number, { title: string; description: string }> = {
    1: { title: "Tu Idea", description: "Escribe tu idea y pulsa el boton para crear la publicación" },
    2: { title: "Diseño", description: "Elige una plantilla por intent detectado o fuerza manualmente otro intent." },
    3: { title: "Formato", description: "Selecciona las dimensiones según la red social." },
    4: { title: "Imagen", description: "Sube una referencia o usa una del Kit de marca." },
    6: { title: "Marca", description: "Elige la variante del logo y ajusta la paleta cromática." }
}

const PANEL_CARD_CLASS = "rounded-2xl border border-border/70 bg-card/90 backdrop-blur-xl shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)] transition-all duration-200 hover:border-primary/30"
const PANEL_CARD_PADDED_CLASS = `${PANEL_CARD_CLASS} p-4`
const PANEL_CARD_PADDED_LG_CLASS = `${PANEL_CARD_CLASS} p-5`

// Section header component
const SectionHeader = ({
    icon: Icon,
    title,
    extra,
    className,
}: {
    icon: React.ElementType
    title: string
    extra?: React.ReactNode
    className?: string
}) => (
    <div className={cn("flex items-center justify-between mb-3", className)}>
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-[11px] font-semibold text-foreground/95 uppercase tracking-[0.12em]">{title}</h3>
        </div>
        {extra}
    </div>
)

type BrandColorRole = 'Texto' | 'Fondo' | 'Acento'

function normalizeHexColor(color: string): string {
    const base = (color || '').trim().toLowerCase()
    if (!base) return '#000000'
    const withHash = base.startsWith('#') ? base : `#${base}`
    return /^#[0-9a-f]{6}$/i.test(withHash) ? withHash : '#000000'
}

function RoleColorSwatch({
    color,
    onCommit,
    sizeClass = "w-12 h-12 rounded-full",
}: {
    color: string
    onCommit: (nextColor: string) => void
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
                    Aplicar color
                </Button>
            </PopoverContent>
        </Popover>
    )
}

function AddAccentSwatch({
    disabled,
    onAdd,
}: {
    disabled?: boolean
    onAdd: (nextColor: string) => void
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
                    title="Añadir acento"
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
                    Añadir acento
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
    onDeleteSession?: () => void
    onClearSessions?: () => void
    onSaveSessionNow?: () => void
    isSavingSession?: boolean
    sessionSavedAt?: string | null
    sessionSaveError?: string | null
    hasUnsavedChanges?: boolean
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
    isAdmin = false,
    adminEmail,
    compositionMode,
    onCompositionModeChange,
    layoutOverrides,
    sessions = [],
    selectedSessionId = '',
    onSelectSession,
    onCreateSession,
    onDeleteSession,
    onClearSessions,
    onSaveSessionNow,
    isSavingSession = false,
    sessionSavedAt = null,
    sessionSaveError = null,
    hasUnsavedChanges = false,
}: ControlsPanelProps) {
    const { toast } = useToast()
    const { panelPosition, assistanceEnabled } = useUI()
    const [showLabCatalog, setShowLabCatalog] = useState(compositionMode === 'advanced')
    const [layoutIntentOverride, setLayoutIntentOverride] = useState<'auto' | IntentCategory>('auto')
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
    const stylePresets = useQuery(api.stylePresets.listActive, {}) as Array<{
        _id: string
        name: string
        description?: string
        image_url: string
        analysis: VisionAnalysis
    }> | undefined

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



    const brandKitImages = (activeBrandKit?.images || []).reduce((acc: Array<{ id: string; url: string; name?: string }>, img, idx) => {
        const imageUrl = typeof img === 'string' ? img : img.url
        if (imageUrl && !acc.find(i => i.url === imageUrl)) {
            acc.push({ id: imageUrl, url: imageUrl, name: `Imagen ${idx + 1}` })
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
                        title: 'Ratings migrados a Convex',
                        description: 'Se importaron votos y marcas previas de diseños.',
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
                            title: 'Ratings corregidos',
                            description: `Se pusieron a 0 ${result.updated} diseños con 4 usos.`,
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
    const effectiveSessionId = selectedSessionId || sessions.find((session) => session.active)?.id || ''
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
                title: 'Ya votada',
                description: 'Esta generación ya tiene voto para este diseño.',
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
                    title: 'Ya votada',
                    description: 'Esta generación ya tenía voto registrado.',
                })
                return
            }
            toast({
                title: 'Voto registrado',
                description: `${score}/5 · media ${nextStats.average.toFixed(2)} · usos ${nextStats.uses}`,
            })
        } catch (error: any) {
            toast({
                title: 'Error al guardar voto',
                description: error?.message || 'No se pudo registrar la votación.',
                variant: 'destructive',
            })
        }
    }

    return (
        <div className="w-full md:w-[27%] h-full controls-panel flex flex-col shrink-0 relative group/panel border-l border-border/40 bg-gradient-to-b from-background via-background to-muted/20">
            <div className="flex-1 overflow-y-auto thin-scrollbar [scrollbar-gutter:stable] p-4 space-y-5">
                {/* SECTION: Sessions */}
                <div className={`${PANEL_CARD_PADDED_LG_CLASS} space-y-4`}>
                    <SectionHeader
                        icon={History}
                        title="Historial"
                        className="mb-2"
                        extra={
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                                    {isSavingSession ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : sessionSaveError ? (
                                        <>
                                            <AlertCircle className="w-3 h-3" />
                                            Error
                                        </>
                                    ) : hasUnsavedChanges ? (
                                        'Hay cambios por guardar'
                                    ) : sessionSavedAt ? (
                                        <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            {`Guardado ${new Date(sessionSavedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                                        </>
                                    ) : 'Sin cambios'}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={onSaveSessionNow}
                                    disabled={isSavingSession}
                                    title="Guardar historial ahora"
                                >
                                    {isSavingSession ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Save
                                            className={cn(
                                                "w-3.5 h-3.5 transition-colors",
                                                hasUnsavedChanges
                                                    ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.45)]"
                                                    : "text-muted-foreground/55"
                                            )}
                                        />
                                    )}
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
                            {effectiveSessionId ? null : <option value="">Sin sesiones</option>}
                            {sessions.map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.title} {session.active ? '(Activa)' : ''} - {new Date(session.updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px] gap-1"
                            onClick={onCreateSession}
                        >
                            <Plus className="w-3 h-3" />
                            Nueva
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={onDeleteSession}
                            title="Borrar sesion"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px]"
                            onClick={onClearSessions}
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>

                {/* STEP 1: Intent Input */}
                <div ref={step1Ref} className={`${PANEL_CARD_PADDED_CLASS} space-y-3 relative group`}>
                    {(isMagicParsing || isGenerating) && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-shimmer" />
                    )}
                    <SectionHeader
                        icon={Wand2}
                        title="¿Qué quieres crear?"
                    />
                    <div className="relative">
                        <Textarea
                            value={promptValue}
                            onChange={(e) => onPromptChange(e.target.value)}
                            placeholder="Ej: En mi sector se usa mucho la palabra 'lead' pero los clientes no saben qué es. Quiero un post que sea como un diccionario explicando qué significa exactamente."
                            className="min-h-[100px] text-sm resize-none bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary pb-12 pr-2 transition-all"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    if (!isMagicParsing && promptValue.trim()) {
                                        onAnalyze()
                                    }
                                }
                            }}
                        />
                        <div className="absolute left-2 right-2 bottom-2 flex flex-wrap items-center gap-2">
                            {isMagicParsing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                            <Button
                                size="sm"
                                onClick={onAnalyze}
                                disabled={isMagicParsing || !promptValue.trim()}
                                className="ml-auto h-8 px-3 sm:px-4 text-[11px] sm:text-xs uppercase font-bold tracking-wider bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 whitespace-nowrap"
                            >
                                Analizar
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
                                title: "Sugerencia aplicada",
                                description: "Se han actualizado los textos.",
                            })
                        }}
                        onUndo={() => {
                            creationFlow.undoSuggestion()
                            toast({
                                title: "Cambios revertidos",
                                description: "Se ha vuelto al contenido original.",
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
                            <div ref={step2Ref} className={`relative ${PANEL_CARD_PADDED_CLASS}`}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 2 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[2]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step2Ref} />
                                <SectionHeader
                                    icon={Layout}
                                    title="Diseño"
                                    extra={
                                        <div className="flex items-center gap-2">
                                            <span className={cn('text-[10px] font-medium', showLabCatalog ? 'text-primary' : 'text-muted-foreground')}>
                                                Modo avanzado
                                            </span>
                                            <Switch
                                                checked={showLabCatalog}
                                                onCheckedChange={setShowLabCatalog}
                                                aria-label="Activar modo avanzado de diseño"
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
                                                        <SelectValue placeholder="Selecciona intent" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="auto">
                                                            {`Auto (detectado: ${selectedIntentMeta?.name || state.selectedIntent})`}
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
                                                Modo básico activo: el diseño se selecciona automáticamente según lo que escribas. Activa el modo avanzado si quieres más control.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {showLabCatalog && state.currentStep === 2 && state.selectedLayout && (
                                    <div className="flex justify-end mt-3">
                                        <Button size="sm" variant="secondary" onClick={() => creationFlow.setStep(3)} className="h-7 text-xs">Siguiente, Formato</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: FORMAT */}
                        <div ref={step3Ref} className={`relative ${PANEL_CARD_PADDED_CLASS}`}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 3 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[3]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step3Ref} />
                                <SectionHeader icon={Layers} title="Formato" />
                                <SocialFormatSelector
                                    selectedPlatform={state.selectedPlatform}
                                    selectedFormat={state.selectedFormat}
                                    onSelectPlatform={selectPlatform}
                                    onSelectFormat={selectFormat}
                                />
                                {!state.selectedFormat && (
                                    <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                                        Selecciona la plataforma y un formato para continuar.
                                    </p>
                                )}
                        </div>

                        {/* STEP 4A: CONTENT */}
                        <div ref={step4Ref} className={`relative ${PANEL_CARD_PADDED_CLASS}`}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 4 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[4]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step4Ref} />
                                <SectionHeader
                                    icon={ImagePlus}
                                    title={state.imageSourceMode === 'generate' ? 'Contenido generado por IA' : 'Contenido del usuario'}
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
                        <div className={`relative ${PANEL_CARD_PADDED_CLASS}`}>
                                <SectionHeader icon={Palette} title="Estilo" />
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
                                    selectedStylePresetId={state.selectedStylePresetId || null}
                                    selectedStylePresetName={state.selectedStylePresetName || null}
                                    onSelectStylePreset={(preset) => {
                                        if (!preset) {
                                            setStylePreset(null)
                                            return
                                        }
                                        setStylePreset({
                                            id: preset.id,
                                            name: preset.name,
                                            analysis: preset.analysis as VisionAnalysis,
                                        })
                                    }}
                                    isAnalyzing={state.isAnalyzing || false}
                                    error={state.error}
                                />
                        </div>

                        {/* STEP 4C: AUXILIARY LOGOS */}
                        <div className={`relative ${PANEL_CARD_PADDED_CLASS}`}>
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
                        <div ref={step6Ref} className={`relative ${PANEL_CARD_PADDED_CLASS} space-y-6`}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep >= 5 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[6]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step6Ref} />
                                <SectionHeader icon={Fingerprint} title="Kit de marca" />

                                <div className="space-y-3">
                                    <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">Logo</p>
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
                                        <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">Colores</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                refreshBrandColorsFromKit()
                                                toast({
                                                    title: 'Colores recargados',
                                                    description: 'Se volvieron a importar los colores del Kit de marca.',
                                                })
                                            }}
                                            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            Recargar
                                        </Button>
                                    </div>

                                    <div className="flex items-end gap-3 flex-wrap pb-1">
                                        <div className="flex flex-col items-center gap-1">
                                            {brandColorsByRole.Texto[0] ? (
                                                <RoleColorSwatch
                                                    color={brandColorsByRole.Texto[0]}
                                                    onCommit={(nextColor) => replaceRoleColor('Texto', nextColor, brandColorsByRole.Texto[0])}
                                                />
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 px-2 text-[10px]"
                                                    onClick={() => replaceRoleColor('Texto', '#111111')}
                                                >
                                                    Añadir
                                                </Button>
                                            )}
                                            <span className="text-[10px] text-muted-foreground">Texto</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-1">
                                            {brandColorsByRole.Fondo[0] ? (
                                                <RoleColorSwatch
                                                    color={brandColorsByRole.Fondo[0]}
                                                    onCommit={(nextColor) => replaceRoleColor('Fondo', nextColor, brandColorsByRole.Fondo[0])}
                                                />
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 px-2 text-[10px]"
                                                    onClick={() => replaceRoleColor('Fondo', '#ffffff')}
                                                >
                                                    Añadir
                                                </Button>
                                            )}
                                            <span className="text-[10px] text-muted-foreground">Fondo</span>
                                        </div>

                                        <div className="flex flex-col gap-1 min-w-0 pl-3 ml-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {brandColorsByRole.Acento.map((accentColor) => (
                                                    <div key={accentColor} className="relative inline-flex items-center group/accent">
                                                        <RoleColorSwatch
                                                            color={accentColor}
                                                            onCommit={(nextColor) => replaceRoleColor('Acento', nextColor, accentColor)}
                                                            sizeClass="w-12 h-12 rounded-full"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border border-border/70 text-muted-foreground hover:text-destructive hover:border-destructive/50 inline-flex items-center justify-center shadow-sm opacity-0 group-hover/accent:opacity-100 group-focus-within/accent:opacity-100 transition-opacity"
                                                            onClick={() => removeBrandColor(accentColor)}
                                                            title="Quitar acento"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <AddAccentSwatch
                                                    onAdd={addAccentColor}
                                                    disabled={brandColorsByRole.Acento.length >= 5}
                                                />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground w-12 text-center">Acentos</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-border/60 pt-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">Enlace</p>
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
                                            Activa el enlace si quieres mostrar una URL en la publicación.
                                        </p>
                                    )}
                                </div>

                                {(primaryEmail || phoneValues.length > 0 || addressValues.length > 0) ? (
                                    <div className="space-y-3 pt-1">
                                        <div className="space-y-3">
                                            {primaryEmail ? (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">Email</p>
                                                        <Switch
                                                            checked={Boolean(getContactAssetById('contact-email-main'))}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    toggleContactAsset({
                                                                        id: 'contact-email-main',
                                                                        type: 'custom',
                                                                        label: 'Email',
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
                                                            <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">Teléfono {idx + 1}</p>
                                                            <Switch
                                                                checked={Boolean(selectedPhoneAsset)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        toggleContactAsset({
                                                                            id: assetId,
                                                                            type: 'custom',
                                                                            label: `Teléfono ${idx + 1}`,
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
                                                            <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">Dirección {idx + 1}</p>
                                                            <Switch
                                                                checked={Boolean(selectedAddressAsset)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        toggleContactAsset({
                                                                            id: assetId,
                                                                            type: 'custom',
                                                                            label: `Dirección ${idx + 1}`,
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

function SuggestionsList({
    suggestions,
    onApply,
    onUndo,
    hasOriginalState
}: {
    suggestions?: any[],
    onApply: (index: number) => void,
    onUndo: () => void,
    hasOriginalState: boolean
}) {
    if (!suggestions || suggestions.length === 0) return null

    return (
        <TooltipProvider delayDuration={300}>
            <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
                        Opciones alternativas
                    </p>
                    {hasOriginalState ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onUndo}
                            className="h-5 px-1.5 text-[9px] text-muted-foreground hover:text-primary gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <RotateCcw className="w-2.5 h-2.5" />
                            VOLVER AL ORIGINAL
                        </Button>
                    ) : <span />}
                </div>
                {suggestions.map((suggestion, idx) => (
                    <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => onApply(idx)}
                                className="group relative w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-purple-100/50 bg-purple-50/50 hover:bg-white hover:border-purple-200 hover:shadow-sm transition-all duration-200 overflow-hidden text-left"
                            >
                                {/* Title */}
                                <span className="text-[11px] font-bold text-gray-900 shrink-0">
                                    {suggestion.title}
                                </span>

                                {/* Separator - Vertical Line */}
                                <div className="h-3 w-[1px] bg-purple-200 shrink-0" />

                                {/* Description - Truncated */}
                                <span className="text-[11px] text-gray-500 truncate font-medium group-hover:text-purple-700 transition-colors">
                                    {suggestion.subtitle}
                                </span>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start" className="max-w-[260px] text-xs bg-muted text-foreground border border-border shadow-md">
                            <p className="font-semibold text-foreground mb-1">{suggestion.title}</p>
                            <p className="text-muted-foreground">{suggestion.subtitle}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}
