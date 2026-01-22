'use client'

import { useCreationFlow } from '@/hooks/useCreationFlow'
import { LayoutSelector } from './creation-flow/LayoutSelector'
import { StyleChipsSelector } from './creation-flow/StyleChipsSelector'
import { SocialFormatSelector } from './creation-flow/SocialFormatSelector'
import { BrandingConfigurator } from './creation-flow/BrandingConfigurator'
import { ImageReferenceSelector } from './creation-flow/ImageReferenceSelector'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Palette, Layout, Sparkles, Type, Image, Layers, ImagePlus, Wand2, Loader2, MessageSquare, Bookmark, Star } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PresetsCarousel } from './creation-flow/PresetsCarousel'
import { SavePresetDialog } from './creation-flow/SavePresetDialog'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { GenerationState, INTENT_CATALOG } from '@/lib/creation-flow-types'

// Section header component (simpler than StepSection - no numbers)
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
    // Hide prompt area (when using external PromptCard)
    hidePromptArea?: boolean
    promptValue: string
    onPromptChange: (value: string) => void
    isMagicParsing: boolean
    isGenerating: boolean
    canGenerate: boolean
    onUnifiedAction: () => void
    onAnalyze: () => Promise<any>
    // Presets
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
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [isSavingPreset, setIsSavingPreset] = useState(false)
    const createPreset = useMutation(api.presets.create)
    const { activeBrandKit } = useBrandKit()

    // Check if there are any presets for this user/brand
    const presetsData = useQuery(api.presets.list, userId ? {
        userId,
        brandId: activeBrandKit?.id as any
    } : 'skip')
    const hasPresets = (presetsData?.user?.length ?? 0) > 0

    const {
        state,
        availableStyles,
        availableLayouts,
        styleGroups,
        selectLayout,
        toggleStyle,
        selectLogo,
        setHeadline,
        setCta,
        setCtaUrl,
        setCustomStyle,
        toggleBrandColor,
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
        reset,
        loadPreset,
    } = creationFlow

    // Función para añadir color personalizado
    const handleAddCustomColor = (color: string) => {
        toggleBrandColor(color)
    }

    // Brand kit images for selector - use URL as ID for consistent matching
    const brandKitImages = (activeBrandKit?.images || []).map((img, idx) => {
        const imageUrl = typeof img === 'string' ? img : img.url
        return {
            id: imageUrl, // Use URL as ID for consistent matching across components
            url: imageUrl,
            name: `Imagen ${idx + 1}`
        }
    })

    // Maximum number of presets allowed
    const MAX_PRESETS = 6
    const currentPresetCount = presetsData?.user?.length ?? 0

    // Handle save preset
    const handleSavePreset = async (name: string) => {
        if (!userId || !state.selectedIntent) {
            toast({ title: "Error", description: "Faltan datos para guardar el preset.", variant: "destructive" })
            return
        }
        // Check limit
        if (currentPresetCount >= MAX_PRESETS) {
            toast({ title: "Límite alcanzado", description: `Solo puedes guardar ${MAX_PRESETS} presets. Elimina uno para añadir más.`, variant: "destructive" })
            return
        }
        setIsSavingPreset(true)
        try {
            await createPreset({
                userId,
                brandId: activeBrandKit?.id as any,
                name,
                state: {
                    // Full state persistence for "Panel Derecho"
                    selectedGroup: state.selectedGroup || undefined,
                    selectedIntent: state.selectedIntent,
                    selectedSubMode: state.selectedSubMode || undefined, // Added
                    selectedLayout: state.selectedLayout || undefined,
                    selectedPlatform: state.selectedPlatform,
                    selectedFormat: state.selectedFormat,
                    selectedLogoId: state.selectedLogoId || undefined,
                    selectedStyles: state.selectedStyles,
                    customStyle: state.customStyle || undefined,
                    selectedBrandColors: state.selectedBrandColors,

                    // Text & Content - Full Persistence
                    headline: state.headline || undefined,
                    cta: state.cta || undefined,
                    ctaUrl: state.ctaUrl || undefined, // Added (Critical)
                    caption: state.caption || undefined, // Added
                    customTexts: state.customTexts, // Added full object
                    selectedTextAssets: state.selectedTextAssets, // Added

                    // Image & Prompt Source
                    rawMessage: state.rawMessage || undefined, // "Lazy Prompt"
                    imageSourceMode: state.imageSourceMode,
                    aiImageDescription: state.aiImageDescription || undefined,
                    selectedBrandKitImageIds: state.selectedBrandKitImageIds.length > 0 ? state.selectedBrandKitImageIds : undefined,
                    additionalInstructions: state.additionalInstructions || undefined, // Added
                },
                icon: 'Star'
            })
            toast({ title: "Guardado", description: "Tu configuración se ha guardado." })
            setIsSaveDialogOpen(false)
        } catch (error) {
            console.error('Error saving preset:', error)
            toast({ title: "Error", description: "No se pudo guardar el preset.", variant: "destructive" })
        } finally {
            setIsSavingPreset(false)
        }
    }

    return (
        <div className="w-full md:w-[27%] h-full controls-panel flex flex-col shrink-0">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto thin-scrollbar">
                <div className="p-4 space-y-6">

                    {/* SECTION: Presets (Quick Start) - Only show if user has presets */}
                    {hasPresets && (
                        <div className="glass-card p-4">
                            <div className="flex items-center justify-between mb-2">
                                <SectionHeader icon={Star} title="Favoritos" />
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={reset}
                                        className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground gap-1"
                                    >
                                        Nueva generación
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsSaveDialogOpen(true)}
                                        disabled={!state.selectedIntent}
                                        className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                                    >
                                        <Bookmark className="w-3 h-3" />
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                            <PresetsCarousel
                                onSelectPreset={loadPreset}
                                onReset={reset}
                                userId={userId}
                            />
                        </div>
                    )}

                    {/* SECTION: Lazy Prompt Input */}
                    <div className="glass-card p-4 space-y-3 relative overflow-hidden group">
                        {/* Status Indicator Gradient */}
                        {(isMagicParsing || isGenerating) && (
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-shimmer" />
                        )}

                        <SectionHeader icon={Wand2} title="¿Qué quieres crear?" />

                        <div className="relative">
                            <Textarea
                                value={promptValue}
                                onChange={(e) => onPromptChange(e.target.value)}
                                placeholder="Describe tu diseño (ej: 'Oferta de verano para Instagram con colores vibrantes')..."
                                className="min-h-[100px] text-sm resize-none bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary pb-12 pr-2 transition-all placeholder:text-muted-foreground/50"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        onUnifiedAction()
                                    }
                                }}
                            />

                            <div className="absolute right-2 bottom-2 flex items-center gap-2">
                                {isMagicParsing && (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                )}
                                <Button
                                    size="sm"
                                    onClick={onAnalyze}
                                    disabled={isMagicParsing || !promptValue.trim()}
                                    className="h-8 px-4 text-xs uppercase font-bold tracking-wider shadow-lg hover:shadow-primary/20 transition-all bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                                >
                                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                                    Magia
                                </Button>
                            </div>
                        </div>
                    </div>


                    {/* === OTHER SECTIONS: Only visible after lazy prompt is processed === */}
                    {state.selectedIntent && (
                        <>
                            {/* SECTION: Layout/Composición - shown when intent detected or defaults available */}
                            {availableLayouts.length > 0 && (
                                <div className="glass-card p-4">
                                    <SectionHeader
                                        icon={Layout}
                                        title="Composición"
                                        extra={state.selectedIntent && (
                                            <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                                                {INTENT_CATALOG.find(i => i.id === state.selectedIntent)?.name || state.selectedIntent}
                                            </span>
                                        )}
                                    />
                                    <LayoutSelector
                                        availableLayouts={availableLayouts}
                                        selectedLayout={state.selectedLayout}
                                        onSelectLayout={selectLayout}
                                    />
                                </div>
                            )}

                            {/* SECTION: Formato */}
                            <div className="glass-card p-4">
                                <SectionHeader icon={Layers} title="Formato" />
                                <SocialFormatSelector
                                    selectedPlatform={state.selectedPlatform}
                                    selectedFormat={state.selectedFormat}
                                    onSelectPlatform={selectPlatform}
                                    onSelectFormat={selectFormat}
                                />
                            </div>

                            {/* SECTION: Imagen de Referencia */}
                            <div className="glass-card p-4">
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
                                    aiImageDescription={state.aiImageDescription}
                                    onAiDescriptionChange={setAiImageDescription}
                                    mode={state.imageSourceMode}
                                    onModeChange={setImageSourceMode}
                                />
                            </div>

                            {/* SECTION: Estilo */}
                            <div className="glass-card p-4">
                                <SectionHeader icon={Sparkles} title="Estilo" />
                                <StyleChipsSelector
                                    availableStyles={availableStyles}
                                    styleGroups={styleGroups}
                                    selectedStyles={state.selectedStyles}
                                    customStyle={state.customStyle}
                                    onToggleStyle={toggleStyle}
                                    onCustomStyleChange={setCustomStyle}
                                />
                            </div>

                            {/* SECTION: Texto */}
                            <div className="glass-card p-4">
                                <SectionHeader icon={Type} title="Texto" />
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
                                            Headline
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Título principal"
                                            value={state.headline || ''}
                                            onChange={(e) => setHeadline(e.target.value)}
                                            className={`w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 ${highlightedFields.has('headline') ? 'animate-flash-highlight' : ''
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
                                            CTA
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Llamada a la acción"
                                            value={state.cta || ''}
                                            onChange={(e) => setCta(e.target.value)}
                                            className={`w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 ${highlightedFields.has('cta') ? 'animate-flash-highlight' : ''
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
                                            URL del CTA
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            value={state.ctaUrl || ''}
                                            onChange={(e) => setCtaUrl(e.target.value)}
                                            className={`w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 ${highlightedFields.has('ctaUrl') ? 'animate-flash-highlight' : ''
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: Brand Kit (Logo + Colors) */}
                            <div className="glass-card p-4">
                                <SectionHeader icon={Image} title="Brand Kit" />
                                <BrandingConfigurator
                                    selectedLayout={selectedLayoutMeta || null}
                                    selectedLogoId={state.selectedLogoId}
                                    selectedBrandColors={state.selectedBrandColors}
                                    onSelectLogo={selectLogo}
                                    onToggleBrandColor={toggleBrandColor}
                                    onAddCustomColor={handleAddCustomColor}
                                    showLogo={true}
                                    showColors={true}
                                />
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* Save Preset Dialog */}
            <SavePresetDialog
                open={isSaveDialogOpen}
                onOpenChange={setIsSaveDialogOpen}
                onSave={handleSavePreset}
                isSaving={isSavingPreset}
            />
        </div>
    )
}
