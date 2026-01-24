'use client'

import { useCreationFlow } from '@/hooks/useCreationFlow'
import { LayoutSelector } from './creation-flow/LayoutSelector'
import { StyleChipsSelector } from './creation-flow/StyleChipsSelector'
import { SocialFormatSelector } from './creation-flow/SocialFormatSelector'
import { BrandingConfigurator } from './creation-flow/BrandingConfigurator'
import { ImageReferenceSelector } from './creation-flow/ImageReferenceSelector'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Palette, Layout, Sparkles, Type, Layers, ImagePlus, Wand2, Loader2, Star, Fingerprint, Bookmark as BookmarkIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PresetsCarousel } from './creation-flow/PresetsCarousel'
import { SavePresetDialog } from './creation-flow/SavePresetDialog'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef } from 'react'
import { useUI } from '@/contexts/UIContext'
import { GenerationState, INTENT_CATALOG, IntentCategory } from '@/lib/creation-flow-types'
import { FloatingAssistance } from './creation-flow/FloatingAssistance'
import { cn } from '@/lib/utils'

const STEP_ASSISTANCE: Record<number, { title: string; description: string }> = {
    1: { title: "Tu Idea", description: "Describe lo que quieres crear o usa la varita mágica para analizar tu intención." },
    2: { title: "Composición", description: "Elige la estructura base para tu diseño." },
    3: { title: "Formato", description: "Selecciona las dimensiones según la red social." },
    4: { title: "Imagen", description: "Sube una referencia o usa una del Brand Kit." },
    5: { title: "Estilo", description: "Define la estética visual." },
    6: { title: "Logo", description: "Selecciona qué variante del logo usar." },
    7: { title: "Colores", description: "Ajusta la paleta cromática." }
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
    const { panelPosition } = useUI()
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [isSavingPreset, setIsSavingPreset] = useState(false)
    const createPreset = useMutation(api.presets.create)
    const { activeBrandKit } = useBrandKit()

    // REFS FOR STEPS (To anchor the Floating Assistance via Portals)
    const step1Ref = useRef<HTMLDivElement>(null)
    const step2Ref = useRef<HTMLDivElement>(null)
    const step3Ref = useRef<HTMLDivElement>(null)
    const step4Ref = useRef<HTMLDivElement>(null)
    const step5Ref = useRef<HTMLDivElement>(null)
    const step6Ref = useRef<HTMLDivElement>(null)
    const step7Ref = useRef<HTMLDivElement>(null)
    const step8Ref = useRef<HTMLDivElement>(null)

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
        addTextAsset,
        removeTextAsset,
        updateTextAsset,
    } = creationFlow

    const handleAddCustomColor = (color: string) => {
        toggleBrandColor(color)
    }

    const brandKitImages = (activeBrandKit?.images || []).reduce((acc: Array<{ id: string; url: string; name?: string }>, img, idx) => {
        const imageUrl = typeof img === 'string' ? img : img.url
        if (imageUrl && !acc.find(i => i.url === imageUrl)) {
            acc.push({ id: imageUrl, url: imageUrl, name: `Imagen ${idx + 1}` })
        }
        return acc
    }, [])

    const handleSavePreset = async (name: string) => {
        if (!userId || !state.selectedIntent) {
            toast({ title: "Error", description: "Faltan datos para guardar el preset.", variant: "destructive" })
            return
        }
        setIsSavingPreset(true)
        try {
            await createPreset({
                userId,
                brandId: activeBrandKit?.id as any,
                name,
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
                    rawMessage: state.rawMessage || undefined,
                    imageSourceMode: state.imageSourceMode,
                    aiImageDescription: state.aiImageDescription || undefined,
                    selectedBrandKitImageIds: state.selectedBrandKitImageIds.length > 0 ? state.selectedBrandKitImageIds : undefined,
                    additionalInstructions: state.additionalInstructions || undefined,
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
        <div className="w-full md:w-[27%] h-full controls-panel flex flex-col shrink-0 relative group/panel">
            <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-6">

                {/* SECTION: Presets */}
                {hasPresets && (
                    <div className="glass-card p-4">
                        <div className="flex items-center justify-between mb-2">
                            <SectionHeader icon={Star} title="Favoritos" />
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={reset} className="h-6 px-2 text-[10px] uppercase font-bold tracking-tight">Reiniciar</Button>
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
                        <PresetsCarousel onSelectPreset={loadPreset} onReset={reset} userId={userId} />
                    </div>
                )}

                {/* STEP 1: Intent Input */}
                <div ref={step1Ref} className="glass-card p-4 space-y-3 relative group">
                    {(isMagicParsing || isGenerating) && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-shimmer" />
                    )}
                    <SectionHeader icon={Wand2} title="¿Qué quieres crear?" />
                    <div className="relative">
                        <Textarea
                            value={promptValue}
                            onChange={(e) => onPromptChange(e.target.value)}
                            placeholder="Describe tu diseño..."
                            className="min-h-[100px] text-sm resize-none bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary pb-12 pr-2 transition-all"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    onUnifiedAction()
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
                                Magia
                            </Button>
                        </div>
                    </div>
                    <FloatingAssistance
                        isVisible={state.currentStep === 1 && !state.generatedImage && !isGenerating}
                        {...STEP_ASSISTANCE[1]}
                        side={panelPosition === 'right' ? 'left' : 'right'}
                        anchorRef={step1Ref}
                    />
                </div>

                {state.selectedIntent && (
                    <>
                        {/* STEP 2: LAYOUT */}
                        {(state.currentStep >= 2 || state.generatedImage) && availableLayouts.length > 0 && (
                            <div ref={step2Ref} className={cn("relative", state.currentStep === 2 ? "glass-card p-4" : "glass-card p-4 opacity-70 hover:opacity-100 transition-opacity")}>
                                <FloatingAssistance isVisible={state.currentStep === 2 && !state.generatedImage && !isGenerating} {...STEP_ASSISTANCE[2]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step2Ref} />
                                <SectionHeader
                                    icon={Layout}
                                    title="Composición"
                                    extra={<span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">{INTENT_CATALOG.find(i => i.id === state.selectedIntent)?.name || state.selectedIntent}</span>}
                                />
                                <LayoutSelector availableLayouts={availableLayouts} selectedLayout={state.selectedLayout} onSelectLayout={selectLayout} intent={state.selectedIntent as IntentCategory} />
                                {state.currentStep === 2 && state.selectedLayout && (
                                    <div className="flex justify-end mt-3">
                                        <Button size="sm" variant="secondary" onClick={() => creationFlow.setStep(3)} className="h-7 text-xs">Siguiente</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: FORMAT */}
                        {(state.currentStep >= 3 || state.generatedImage) && (
                            <div ref={step3Ref} className={cn("relative", state.currentStep === 3 ? "glass-card p-4" : "glass-card p-4 opacity-70 hover:opacity-100 transition-opacity")}>
                                <FloatingAssistance isVisible={state.currentStep === 3 && !state.generatedImage && !isGenerating} {...STEP_ASSISTANCE[3]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step3Ref} />
                                <SectionHeader icon={Layers} title="Formato" />
                                <SocialFormatSelector selectedPlatform={state.selectedPlatform} selectedFormat={state.selectedFormat} onSelectPlatform={selectPlatform} onSelectFormat={selectFormat} />
                                {state.currentStep === 3 && state.selectedFormat && (
                                    <div className="flex justify-end mt-3">
                                        <Button size="sm" variant="secondary" onClick={() => creationFlow.setStep(4)} className="h-7 text-xs">Siguiente</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 4: IMAGE */}
                        {(state.currentStep >= 4 || state.generatedImage) && (
                            <div ref={step4Ref} className={cn("relative", state.currentStep === 4 ? "glass-card p-4" : "glass-card p-4 opacity-70 hover:opacity-100 transition-opacity")}>
                                <FloatingAssistance isVisible={state.currentStep === 4 && !state.generatedImage && !isGenerating} {...STEP_ASSISTANCE[4]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step4Ref} />
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
                                {state.currentStep === 4 && (
                                    <div className="flex justify-end mt-3">
                                        <Button size="sm" variant="secondary" onClick={() => creationFlow.setStep(5)} className="h-7 text-xs">Confirmar Imagen</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 5: STYLE */}
                        {(state.currentStep >= 5 || state.generatedImage) && (
                            <div ref={step5Ref} className={cn("relative", state.currentStep === 5 ? "glass-card p-4" : "glass-card p-4 opacity-70 hover:opacity-100 transition-opacity")}>
                                <FloatingAssistance isVisible={state.currentStep === 5 && !state.generatedImage && !isGenerating} {...STEP_ASSISTANCE[5]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step5Ref} />
                                <SectionHeader icon={Sparkles} title="Estilo" />
                                <StyleChipsSelector
                                    availableStyles={availableStyles}
                                    styleGroups={styleGroups}
                                    selectedStyles={state.selectedStyles}
                                    customStyle={state.customStyle}
                                    onToggleStyle={toggleStyle}
                                    onCustomStyleChange={setCustomStyle}
                                />
                                {state.currentStep === 5 && (state.selectedStyles.length > 0 || state.customStyle) && (
                                    <div className="flex justify-end mt-3">
                                        <Button size="sm" variant="secondary" onClick={() => creationFlow.setStep(6)} className="h-7 text-xs">Revisar Marca</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 6: LOGO & COLORS - Appear together */}
                        {(state.currentStep >= 6 || state.generatedImage) && (
                            <>
                                <div ref={step6Ref} className="relative glass-card p-4">
                                    <FloatingAssistance isVisible={state.currentStep === 6 && !state.generatedImage && !isGenerating} {...STEP_ASSISTANCE[6]} side={panelPosition === 'right' ? 'left' : 'right'} anchorRef={step6Ref} />
                                    <SectionHeader icon={Fingerprint} title="Logo" />
                                    <BrandingConfigurator
                                        selectedLayout={selectedLayoutMeta || null}
                                        selectedLogoId={state.selectedLogoId}
                                        selectedBrandColors={state.selectedBrandColors}
                                        onSelectLogo={selectLogo}
                                        onToggleBrandColor={toggleBrandColor}
                                        onAddCustomColor={handleAddCustomColor}
                                        showLogo={true} showColors={false} showTypography={false} showBrandTexts={false}
                                        rawMessage={promptValue}
                                    />
                                </div>

                                <div ref={step7Ref} className="relative glass-card p-4">
                                    <SectionHeader icon={Palette} title="Colores" />
                                    <BrandingConfigurator
                                        selectedLayout={selectedLayoutMeta || null}
                                        selectedLogoId={state.selectedLogoId}
                                        selectedBrandColors={state.selectedBrandColors}
                                        onSelectLogo={selectLogo}
                                        onToggleBrandColor={toggleBrandColor}
                                        onAddCustomColor={handleAddCustomColor}
                                        showLogo={false} showColors={true} showTypography={false} showBrandTexts={false}
                                        rawMessage={promptValue}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <SavePresetDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen} onSave={handleSavePreset} isSaving={isSavingPreset} />
        </div>
    )
}
