'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCreationFlow } from '@/hooks/useCreationFlow'
import { LayoutSelector } from './creation-flow/LayoutSelector'
import { SocialFormatSelector } from './creation-flow/SocialFormatSelector'
import { BrandingConfigurator } from './creation-flow/BrandingConfigurator'
import { ImageReferenceSelector } from './creation-flow/ImageReferenceSelector'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Palette, Layout, Sparkles, Layers, ImagePlus, Wand2, Loader2, Star, Fingerprint, Bookmark as BookmarkIcon, SquarePlus, RotateCcw } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PresetsCarousel } from './creation-flow/PresetsCarousel'
import { SavePresetDialog } from './creation-flow/SavePresetDialog'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useUI } from '@/contexts/UIContext'
import {
    GenerationState,
    IntentCategory,
    ALL_IMAGE_LAYOUTS,
    BASIC_MODE_LAYOUT_IDS,
    LayoutOption,
} from '@/lib/creation-flow-types'
import { FloatingAssistance } from './creation-flow/FloatingAssistance'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { getRecommendedAdvancedLayouts } from '@/lib/layout-recommendation'

const STEP_ASSISTANCE: Record<number, { title: string; description: string }> = {
    1: { title: "Tu Idea", description: "Escribe tu idea y pulsa el boton para crear la publicación" },
    2: { title: "Composición", description: "En modo básico la composición se elige automáticamente con variación segura." },
    3: { title: "Formato", description: "Selecciona las dimensiones según la red social." },
    4: { title: "Imagen", description: "Sube una referencia o usa una del Brand Kit." },
    6: { title: "Marca", description: "Elige la variante del logo y ajusta la paleta cromática." }
}

// Section header component
const SectionHeader = ({
    icon: Icon,
    title,
    extra,
}: {
    icon: React.ElementType
    title: string
    extra?: React.ReactNode
}) => (
    <div className="flex items-center justify-between mb-3">
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
    userId?: string
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
    userId,
}: ControlsPanelProps) {
    const { toast } = useToast()
    const { panelPosition, assistanceEnabled } = useUI()
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [isSavingPreset, setIsSavingPreset] = useState(false)
    const [layoutMode, setLayoutMode] = useState<'basic' | 'advanced'>('basic')
    const createPreset = useMutation(api.presets.create)
    const { activeBrandKit } = useBrandKit()

    // REFS FOR STEPS (To anchor the Floating Assistance via Portals)
    const step1Ref = useRef<HTMLDivElement>(null)
    const step2Ref = useRef<HTMLDivElement>(null)
    const step3Ref = useRef<HTMLDivElement>(null)
    const step4Ref = useRef<HTMLDivElement>(null)
    const step6Ref = useRef<HTMLDivElement>(null)

    const presetsData = useQuery(api.presets.list, userId ? {
        userId,
        brandId: activeBrandKit?.id as any
    } : 'skip')
    const hasPresets = (presetsData?.user?.length ?? 0) > 0

    const {
        state,
        availableLayouts,
        selectLayout,
        selectLogo,
        setHeadline,
        setCta,
        setCtaUrl,
        setCustomStyle,
        toggleBrandColor,
        removeBrandColor,
        addCustomColor,
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
        loadPreset,
        addTextAsset,
        removeTextAsset,
        updateTextAsset,
    } = creationFlow

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

    const handleSelectPreset = (presetState: Partial<GenerationState>) => {
        loadPreset(presetState)
        onPromptChange(typeof presetState.rawMessage === 'string' ? presetState.rawMessage : '')
    }

    const basicModeIds = new Set(BASIC_MODE_LAYOUT_IDS)
    const recommendationContext = useMemo(() => {
        const chunks = [
            promptValue,
            state.rawMessage,
            state.headline,
            state.cta,
            state.caption,
            ...Object.values(state.customTexts || {}),
        ]
            .map((v) => (typeof v === 'string' ? v.trim() : ''))
            .filter(Boolean)
        return chunks.join('\n')
    }, [promptValue, state.rawMessage, state.headline, state.cta, state.caption, state.customTexts])

    const recommendedAdvancedLayouts: LayoutOption[] = useMemo(() => {
        if (!state.selectedIntent) return []
        return getRecommendedAdvancedLayouts(ALL_IMAGE_LAYOUTS, {
            selectedIntent: state.selectedIntent,
            rawContext: recommendationContext,
        }, 6)
    }, [recommendationContext, state.selectedIntent])

    const allAdvancedLayouts: LayoutOption[] = (() => {
        const recommendedIds = new Set(recommendedAdvancedLayouts.map((l) => l.id))
        const rest = ALL_IMAGE_LAYOUTS.filter((l) => {
            if (recommendedIds.has(l.id)) return false
            const id = l.id.toLowerCase()
            const name = l.name.toLowerCase()
            if (id.endsWith('-free') || id.includes('default-free')) return false
            if (name.includes('libre')) return false
            return true
        })
        const dedup = new Map<string, LayoutOption>()
        rest.forEach((layout) => {
            if (!dedup.has(layout.id)) dedup.set(layout.id, layout)
        })
        return Array.from(dedup.values())
    })()

    const pickRandomBasicLayout = useCallback((currentLayoutId: string | null) => {
        if (BASIC_MODE_LAYOUT_IDS.length === 0) return null
        const candidates = BASIC_MODE_LAYOUT_IDS.filter((id) => id !== currentLayoutId)
        const pool = candidates.length > 0 ? candidates : BASIC_MODE_LAYOUT_IDS
        const idx = Math.floor(Math.random() * pool.length)
        return pool[idx] ?? BASIC_MODE_LAYOUT_IDS[0]
    }, [])

    const handleLayoutModeSwitch = useCallback((checked: boolean) => {
        const nextMode: 'basic' | 'advanced' = checked ? 'advanced' : 'basic'
        setLayoutMode(nextMode)

        if (nextMode === 'basic') {
            const nextBasicLayoutId = pickRandomBasicLayout(state.selectedLayout)
            if (nextBasicLayoutId) {
                selectLayout(nextBasicLayoutId)
                creationFlow.setStep(2)
            }
        }
    }, [creationFlow, pickRandomBasicLayout, selectLayout, state.selectedLayout])

    useEffect(() => {
        if (layoutMode !== 'basic') return
        if (state.currentStep !== 2) return
        if (!state.selectedLayout) return
        const timer = window.setTimeout(() => {
            creationFlow.setStep(3)
        }, 320)
        return () => window.clearTimeout(timer)
    }, [creationFlow, layoutMode, state.currentStep, state.selectedLayout])

    const handleSavePreset = async (name: string) => {
        if (!userId || !state.selectedIntent) {
            toast({ title: "Error", description: "Faltan datos para guardar el preset.", variant: "destructive" })
            return
        }
        setIsSavingPreset(true)
        try {
            const intentLabel = state.selectedIntent || undefined
            const rawMessage = promptValue.trim() || state.rawMessage || undefined
            const persistedReferenceRoles = Object.fromEntries(
                Object.entries(state.referenceImageRoles || {}).filter(([key]) => !key.startsWith('data:'))
            )

            await createPreset({
                userId,
                brandId: activeBrandKit?.id as any,
                name,
                description: intentLabel,
                state: {
                    selectedGroup: state.selectedGroup || undefined,
                    selectedIntent: state.selectedIntent,
                    selectedSubMode: state.selectedSubMode || undefined,
                    selectedLayout: state.selectedLayout || undefined,
                    selectedPlatform: state.selectedPlatform,
                    selectedFormat: state.selectedFormat,
                    selectedLogoId: state.selectedLogoId || undefined,
                    selectedStyles: state.selectedStyles,
                    customStyle: state.customStyle || undefined,
                    selectedBrandColors: state.selectedBrandColors,
                    headline: state.headline || undefined,
                    cta: state.cta || undefined,
                    ctaUrl: state.ctaUrl || undefined,
                    caption: state.caption || undefined,
                    customTexts: state.customTexts,
                    selectedTextAssets: state.selectedTextAssets,
                    rawMessage,
                    imageSourceMode: state.imageSourceMode,
                    aiImageDescription: state.aiImageDescription || undefined,
                    selectedBrandKitImageIds: state.selectedBrandKitImageIds.length > 0 ? state.selectedBrandKitImageIds : undefined,
                    referenceImageRoles: Object.keys(persistedReferenceRoles).length > 0 ? persistedReferenceRoles : undefined,
                    additionalInstructions: state.additionalInstructions || undefined,
                    typography: state.typography,
                    presetType: 'image',
                },
                icon: 'Star'
            })
            toast({ title: "Guardado", description: "Tu configuraciÃ³n se ha guardado." })
            setIsSaveDialogOpen(false)
        } catch (error) {
            console.error('Error saving preset:', error)
            toast({ title: "Error", description: "No se pudo guardar el preset.", variant: "destructive" })
        } finally {
            setIsSavingPreset(false)
        }
    }

    return (
        <div className="w-full md:w-[27%] h-full controls-panel flex flex-col shrink-0 relative group/panel">
            <div className="flex-1 overflow-y-auto thin-scrollbar [scrollbar-gutter:stable] p-4 space-y-6">

                {/* SECTION: Presets */}
                <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <SectionHeader icon={Star} title="Favoritos" />
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsSaveDialogOpen(true)}
                                disabled={!state.selectedIntent}
                                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                            >
                                <BookmarkIcon className="w-3 h-3" />
                                Guardar
                            </Button>
                        </div>
                    </div>
                    {hasPresets ? (
                        <>
                            <PresetsCarousel onSelectPreset={handleSelectPreset} onReset={reset} userId={userId} />
                            <p className="text-xs text-muted-foreground mt-2">
                                Guarda y reutiliza tus configuraciones favoritas.
                            </p>
                        </>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-4 text-center">
                            <p className="text-[11px] text-muted-foreground">
                                Aún no hay presets guardados para esta marca. Guarda el primero con "Guardar".
                            </p>
                        </div>
                    )}
                </div>

                {/* STEP 1: Intent Input */}
                <div ref={step1Ref} className="glass-card p-4 space-y-3 relative group">
                    {(isMagicParsing || isGenerating) && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-shimmer" />
                    )}
                    <SectionHeader
                        icon={Wand2}
                        title="¿Qué quieres crear?"
                        extra={
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={reset}
                                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                            >
                                <SquarePlus className="w-3 h-3" />
                                Nuevo
                            </Button>
                        }
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
                        <div className="absolute right-2 bottom-2 flex items-center gap-2">
                            {isMagicParsing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                            <Button
                                size="sm"
                                onClick={onAnalyze}
                                disabled={isMagicParsing || !promptValue.trim()}
                                className="h-8 px-4 text-xs uppercase font-bold tracking-wider bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
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
                        {(state.currentStep >= 2 || state.hasGeneratedImage) && availableLayouts.length > 0 && (
                            <div ref={step2Ref} className={cn("relative", state.currentStep === 2 ? "glass-card p-4" : "glass-card p-4 opacity-70 hover:opacity-100 transition-opacity")}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 2 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[2]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step2Ref} />
                                <SectionHeader
                                    icon={Layout}
                                    title="Composición"
                                    extra={
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn("text-[10px] font-medium", layoutMode === 'advanced' ? "text-primary" : "text-muted-foreground")}>
                                                Avanzado
                                            </span>
                                            <Switch
                                                checked={layoutMode === 'advanced'}
                                                onCheckedChange={handleLayoutModeSwitch}
                                                aria-label="Activar modo avanzado de composición"
                                            />
                                        </div>
                                    }
                                />
                                {layoutMode === 'advanced' ? (
                                    <div className="space-y-2">
                                        <div className="max-h-[420px] overflow-y-auto thin-scrollbar pr-1">
                                            <LayoutSelector
                                                availableLayouts={availableLayouts}
                                                recommendedLayouts={recommendedAdvancedLayouts}
                                                allLayouts={allAdvancedLayouts}
                                                selectedLayout={state.selectedLayout}
                                                onSelectLayout={selectLayout}
                                                intent={state.selectedIntent as IntentCategory}
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            Modo avanzado: selección manual con priorización por intención.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
                                        <p className="text-[11px] text-primary font-medium leading-relaxed">
                                            Modo básico activo. La composición se elige automáticamente con variación segura.
                                        </p>
                                    </div>
                                )}
                                {state.currentStep === 2 && state.selectedLayout && (
                                    <div className="flex justify-end mt-3">
                                        <Button size="sm" variant="secondary" onClick={() => creationFlow.setStep(3)} className="h-7 text-xs">Siguiente, Formato</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: FORMAT */}
                        {(state.currentStep >= 3 || state.hasGeneratedImage) && (
                            <div ref={step3Ref} className={cn("relative", state.currentStep === 3 ? "glass-card p-4" : "glass-card p-4 opacity-70 hover:opacity-100 transition-opacity")}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 3 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[3]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step3Ref} />
                                <SectionHeader icon={Layers} title="Formato" />
                                <SocialFormatSelector selectedPlatform={state.selectedPlatform} selectedFormat={state.selectedFormat} onSelectPlatform={selectPlatform} onSelectFormat={selectFormat} />
                                {state.currentStep === 3 && state.selectedFormat && (
                                    <div className="flex justify-end mt-3">
                                        <Button size="sm" variant="secondary" onClick={() => creationFlow.setStep(4)} className="h-7 text-xs">Siguiente, Imagen</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 4: IMAGE */}
                        {(state.currentStep >= 4 || state.hasGeneratedImage) && (
                            <div ref={step4Ref} className={cn("relative", state.currentStep === 4 ? "glass-card p-4" : "glass-card p-4 opacity-70 hover:opacity-100 transition-opacity")}>
                                <FloatingAssistance isVisible={assistanceEnabled && state.currentStep === 4 && !state.hasGeneratedImage && !isGenerating} {...STEP_ASSISTANCE[4]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step4Ref} />
                                <SectionHeader icon={ImagePlus} title="Imagen de Referencia" />
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
                                {state.currentStep === 4 && (
                                    <div className="flex justify-end mt-3">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => creationFlow.setStep(6)}
                                            className="h-7 text-xs"
                                            disabled={state.imageSourceMode === 'generate' && !state.aiImageDescription?.trim()}
                                        >
                                            Siguiente, Marca
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 6: LOGO & COLORS - Unified */}
                        {(state.currentStep >= 5 || state.hasGeneratedImage) && (
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
                                    <SectionHeader icon={Palette} title="Colores" />
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
                            </div>
                        )}
                    </>
                )}
            </div>

            <SavePresetDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen} onSave={handleSavePreset} isSaving={isSavingPreset} />
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
                {hasOriginalState && (
                    <div className="flex justify-end pr-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onUndo}
                            className="h-5 px-1.5 text-[9px] text-muted-foreground hover:text-primary gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <RotateCcw className="w-2.5 h-2.5" />
                            VOLVER AL ORIGINAL
                        </Button>
                    </div>
                )}
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
