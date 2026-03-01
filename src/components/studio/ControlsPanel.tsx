'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCreationFlow } from '@/hooks/useCreationFlow'
import { LayoutSelector } from './creation-flow/LayoutSelector'
import { SocialFormatSelector } from './creation-flow/SocialFormatSelector'
import { BrandingConfigurator } from './creation-flow/BrandingConfigurator'
import { ImageReferenceSelector } from './creation-flow/ImageReferenceSelector'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Palette, Layout, Sparkles, Layers, ImagePlus, Wand2, Loader2, Fingerprint, RotateCcw, Link2, History, Plus, Trash2, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useUI } from '@/contexts/UIContext'
import {
    IntentCategory,
    INTENT_CATALOG,
    MERGED_LAYOUTS_BY_INTENT,
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
    2: { title: "Composición", description: "Elige una plantilla por intent detectado o fuerza manualmente otro intent." },
    3: { title: "Formato", description: "Selecciona las dimensiones según la red social." },
    4: { title: "Imagen", description: "Sube una referencia o usa una del Brand Kit." },
    6: { title: "Marca", description: "Elige la variante del logo y ajusta la paleta cromática." }
}

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
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h3>
        </div>
        {extra}
    </div>
)

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
}: ControlsPanelProps) {
    const { toast } = useToast()
    const { panelPosition, assistanceEnabled } = useUI()
    const [showLabCatalog, setShowLabCatalog] = useState(compositionMode === 'advanced')
    const [layoutIntentOverride, setLayoutIntentOverride] = useState<'auto' | IntentCategory>('auto')
    const upsertLayoutVote = useMutation(api.layoutRatings.upsertLayoutVote)
    const migrateLegacyRatings = useMutation(api.layoutRatings.migrateLegacyRatings)
    const resetLayoutRatings = useMutation(api.layoutRatings.resetLayoutRatings)
    const { activeBrandKit, updateActiveBrandKit } = useBrandKit()
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
                        description: 'Se importaron votos y marcas previas de composiciones.',
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
                            description: `Se pusieron a 0 ${result.updated} composiciones con 4 usos.`,
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
                description: 'Esta generación ya tiene voto para esta composición.',
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
        <div className="w-full md:w-[27%] h-full controls-panel flex flex-col shrink-0 relative group/panel">
            <div className="flex-1 overflow-y-auto thin-scrollbar [scrollbar-gutter:stable] p-4 space-y-6">

                {/* SECTION: Sessions */}
                <div className="glass-card p-5 space-y-4">
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
                                    ) : sessionSavedAt ? (
                                        <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            {`Guardado ${new Date(sessionSavedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                                        </>
                                    ) : 'Sin guardar'}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={onSaveSessionNow}
                                    disabled={isSavingSession}
                                    title="Guardar historial ahora"
                                >
                                    {isSavingSession ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
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
                <div ref={step1Ref} className="glass-card p-4 space-y-3 relative group">
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
                                <Sparkles className="w-3.5 h-3.5 mr-2" />
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

                {state.selectedIntent && (
                    <>
                        {/* STEP 2: LAYOUT */}
                        {availableLayouts.length > 0 && (
                            <div ref={step2Ref} className="relative glass-card p-4">
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 2 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[2]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step2Ref} />
                                <SectionHeader
                                    icon={Layout}
                                    title="Composición"
                                    extra={
                                        <div className="flex items-center gap-2">
                                            <span className={cn('text-[10px] font-medium', showLabCatalog ? 'text-primary' : 'text-muted-foreground')}>
                                                Modo avanzado
                                            </span>
                                            <Switch
                                                checked={showLabCatalog}
                                                onCheckedChange={setShowLabCatalog}
                                                aria-label="Activar modo avanzado de composicion"
                                            />
                                        </div>
                                    }
                                />
                                <div className="space-y-3">
                                    {showLabCatalog ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                                                    Catálogo de composiciones
                                                </p>
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
                        <div ref={step3Ref} className="relative glass-card p-4">
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

                        {/* STEP 4: IMAGE */}
                        <div ref={step4Ref} className="relative glass-card p-4">
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 4 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[4]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step4Ref} />
                                <SectionHeader icon={ImagePlus} title="Imagenes" />
                                <ImageReferenceSelector
                                    uploadedImages={state.uploadedImages}
                                    visionAnalysis={state.visionAnalysis ?? null}
                                    isAnalyzing={state.isAnalyzing || false}
                                    error={null}
                                    onUpload={uploadImage}
                                    onRemoveUploadedImage={removeUploadedImage}
                                    onClearUploadedImages={clearUploadedImages}
                                    isOptional={true}
                                    brandKitImages={brandKitImages}
                                    selectedBrandKitImageIds={state.selectedBrandKitImageIds}
                                    onToggleBrandKitImage={toggleBrandKitImage}
                                    onClearBrandKitImages={clearBrandKitImages}
                                    referenceImageRoles={state.referenceImageRoles}
                                    onReferenceRoleChange={setReferenceImageRole}
                                    aiImageDescription={state.aiImageDescription}
                                    onAiDescriptionChange={setAiImageDescription}
                                    suggestedImagePrompts={state.imagePromptSuggestions}
                                    customStyle={state.customStyle}
                                    onCustomStyleChange={setCustomStyle}
                                    mode={state.imageSourceMode}
                                    onModeChange={setImageSourceMode}
                                />
                                <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                                    Sube una referencia o usa una del Brand Kit.
                                </p>
                        </div>

                        {/* STEP 6: LOGO & COLORS - Unified */}
                        <div ref={step6Ref} className="relative glass-card p-4 space-y-6">
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep >= 5 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[6]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step6Ref} />
                                <div className="space-y-3">
                                    <SectionHeader icon={Fingerprint} title="Logo" />
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
                                    <SectionHeader
                                        icon={Palette}
                                        title="Colores"
                                        extra={(
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={refreshBrandColorsFromKit}
                                                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                Recargar
                                            </Button>
                                        )}
                                    />
                                    <BrandingConfigurator
                                        selectedLayout={selectedLayoutMeta || null}
                                        selectedLogoId={state.selectedLogoId}
                                        selectedBrandColors={state.selectedBrandColors}
                                        onSelectLogo={selectLogo}
                                        onToggleBrandColor={toggleBrandColor}
                                        onRemoveBrandColor={removeBrandColor}

                                        onAddCustomColor={addCustomColor}
                                        showLogo={false} showColors={true} showTypography={false} showBrandTexts={false}
                                        rawMessage={promptValue}
                                        debugLabel="Studio-Colors"
                                        onlyShowSelectedColors={true}
                                    />
                                </div>

                                <div className="space-y-3 border-t border-border/60 pt-4">
                                    <SectionHeader
                                        icon={Link2}
                                        title="Enlace"
                                        extra={(
                                            <Switch
                                                checked={state.ctaUrlEnabled}
                                                onCheckedChange={(checked) => {
                                                    setCtaUrlEnabled(checked, { useKitIfEmpty: true })
                                                    updateActiveBrandKit?.({ cta_url_enabled: checked })
                                                }}
                                            />
                                        )}
                                    />
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
