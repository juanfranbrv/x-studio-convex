'use client'

import { useCreationFlow } from '@/hooks/useCreationFlow'
import { IntentSelector } from './IntentSelector'
import { ImageReferenceSelector } from './ImageReferenceSelector'
import { StyleChipsSelector } from './StyleChipsSelector'
import { LayoutSelector } from './LayoutSelector'
import { BrandingConfigurator } from './BrandingConfigurator'
import { SocialFormatSelector } from './SocialFormatSelector'

import { PresetsCarousel } from './PresetsCarousel'
import { LazyPromptInput } from './LazyPromptInput'
// import { UnifiedContentSection } from './UnifiedContentSection' 
import { IntentCategory } from '@/lib/creation-flow-types'
import { SavePresetDialog } from './SavePresetDialog'
import { GenerateButton } from './GenerateButton'
import { BookmarkPlus, RotateCcw, Sparkles, Download, Share2, Pencil, ChevronDown, ChevronRight, Check, X, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DigitalStaticLoader } from '@/components/studio/DigitalStaticLoader'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { parseLazyIntentAction } from '@/app/actions/parse-intent'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useBrandKit } from '@/contexts/BrandKitContext'

interface Generation {
    id: string
    image_url: string
    created_at: string
}

interface CreationCommandPanelProps {
    onGenerate?: (prompt: string) => Promise<void>
    isGenerating?: boolean
    creationFlow: ReturnType<typeof useCreationFlow>
    // Mobile-only preview props
    currentImage?: string | null
    aspectRatio?: string
    // Mobile history props
    generations?: Generation[]
    onSelectGeneration?: (gen: Generation) => void
    // Edit image handler
    onEditImage?: (editPrompt: string) => Promise<void>
    // Unified button - controlled edit prompt from CanvasPanel
    editPrompt?: string
    onEditPromptChange?: (prompt: string) => void
}

const StepSection = ({
    number,
    title,
    description,
    children,
    show = true
}: {
    number: number;
    title: string;
    description?: string;
    children: React.ReactNode;
    show?: boolean;
}) => {
    if (!show) return null;
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-xl bg-brand-gradient text-white text-[10px] font-bold shadow-aero">
                        {number}
                    </span>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">{title}</h3>
                </div>
                {description && (
                    <p className="text-[10px] text-muted-foreground leading-relaxed ml-8">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
};

export function CreationCommandPanel({
    onGenerate,
    isGenerating = false,
    creationFlow,
    currentImage,
    aspectRatio = "1:1",
    generations = [],
    onSelectGeneration,
    onEditImage,
    editPrompt = '',
    onEditPromptChange,
}: CreationCommandPanelProps) {
    const {
        state,
        currentIntent,
        requiresImage,
        availableStyles,
        selectGroup,
        selectIntent,
        uploadImage,
        clearImage,
        toggleStyle,
        selectLogo,
        setHeadline,
        setCta,
        setCaption, // NEW
        setAdditionalInstructions,
        setRawMessage,
        setCustomStyle,
        setCustomText,
        onGenerateCustomFieldCopy,
        toggleBrandColor,
        selectPlatform,
        selectFormat,
        buildGenerationPrompt,
        reset,
        loadPreset,
        selectedLayoutMeta,
        availableLayouts,
        selectLayout,
    } = creationFlow

    const { user } = useUser()
    const { activeBrandKit } = useBrandKit()
    const { toast } = useToast()
    const [isMagicParsing, setIsMagicParsing] = useState(false)
    const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set())
    const [isMobile, setIsMobile] = useState(false)
    const [editPromptText, setEditPromptText] = useState('')

    // Animation states
    const [isRevealing, setIsRevealing] = useState(false)
    const [wasJustGenerated, setWasJustGenerated] = useState(false)

    useEffect(() => {
        if (isGenerating) {
            setWasJustGenerated(true)
            setIsRevealing(false)
        } else if (wasJustGenerated) {
            // Generation just finished, start reveal
            setIsRevealing(true)
            const timer = setTimeout(() => {
                setIsRevealing(false)
                setWasJustGenerated(false)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [isGenerating])

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Save Preset State
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [isSavingPreset, setIsSavingPreset] = useState(false)
    const createPreset = useMutation(api.presets.create)

    const handleSavePreset = async (name: string, description: string) => {
        if (!user?.id || !state.selectedPlatform || !state.selectedFormat || !state.selectedIntent) {
            toast({ title: "Error", description: "Faltan datos para guardar el preset.", variant: "destructive" })
            return
        }

        setIsSavingPreset(true)
        try {
            // Save complete state snapshot with correct field names
            await createPreset({
                userId: user.id,
                brandId: activeBrandKit?.id as any,
                name,
                description,
                state: {
                    // Platform & Format
                    selectedPlatform: state.selectedPlatform,
                    selectedFormat: state.selectedFormat,
                    // Intent
                    selectedGroup: state.selectedGroup,
                    selectedIntent: state.selectedIntent,
                    selectedSubMode: state.selectedSubMode,
                    // Image/Input
                    uploadedImage: state.uploadedImage,
                    selectedTheme: state.selectedTheme,
                    imageSourceMode: state.imageSourceMode,
                    selectedBrandKitImageId: state.selectedBrandKitImageId,
                    aiImageDescription: state.aiImageDescription,
                    // Styles & Layout
                    selectedStyles: state.selectedStyles,
                    selectedLayout: state.selectedLayout,
                    // Branding
                    selectedLogoId: state.selectedLogoId,
                    headline: state.headline,
                    cta: state.cta,
                    caption: state.caption, // NEW
                    customTexts: state.customTexts,
                    selectedBrandColors: state.selectedBrandColors,
                    rawMessage: state.rawMessage,
                    additionalInstructions: state.additionalInstructions,
                    customStyle: state.customStyle,
                    selectedTextAssets: state.selectedTextAssets,
                }
            })
            toast({ title: "Preset guardado", description: "Tu configuración se ha guardado en favoritos." })
            setIsSaveDialogOpen(false)
        } catch (e) {
            console.error(e)
            toast({ title: "Error", description: "No se pudo guardar el preset.", variant: "destructive" })
        } finally {
            setIsSavingPreset(false)
        }
    }



    const handleSmartAnalyze = async () => {
        if (!state.rawMessage.trim()) return // Only require message now

        setIsMagicParsing(true)
        setHighlightedFields(new Set()) // Reset highlights

        try {
            console.log("Analyzing lazy prompt:", state.rawMessage)

            // Call Server Action with new parameter order
            const result = await parseLazyIntentAction(
                state.rawMessage,
                activeBrandKit?.brand_name || "My Brand",
                currentIntent || undefined, // Optional - will auto-detect if not provided
                selectedLayoutMeta || undefined
            )

            if (result.error) {
                toast({
                    title: "Error analyzing prompt",
                    description: "Could not parse intent. Please fill manually.",
                    variant: "destructive"
                })
                return
            }

            const newHighlights = new Set<string>()

            // AUTO-DETECT MODE: Set the detected intent
            if (result.detectedIntent && !state.selectedIntent) {
                console.log(`[AUTO-DETECT] Intent detected: ${result.detectedIntent} (confidence: ${result.confidence})`)
                selectIntent(result.detectedIntent as IntentCategory)

                toast({
                    title: "✨ Intención detectada",
                    description: `Detectamos que quieres crear: ${result.detectedIntent}`,
                })
            }

            // Populate Fields
            if (result.headline) {
                setHeadline(result.headline)
                newHighlights.add('headline')
            }
            if (result.cta) {
                setCta(result.cta)
                newHighlights.add('cta')
            }

            if (result.customTexts) {
                Object.entries(result.customTexts).forEach(([key, value]) => {
                    setCustomText(key, value)
                    newHighlights.add(key)
                })
            }

            // NEW: Handle Caption
            if (result.caption) {
                setCaption(result.caption)
                newHighlights.add('caption')
            }

            // NEW: Handle Consolidated Image Texts (Overrides specific fields if present)
            if (result.imageTexts) {
                Object.entries(result.imageTexts).forEach(([key, value]) => {
                    if (key === 'headline') {
                        setHeadline(value)
                        newHighlights.add('headline')
                    } else if (key === 'cta') {
                        setCta(value)
                        newHighlights.add('cta')
                    } else {
                        // All other texts go to customTexts
                        setCustomText(key, value)
                        newHighlights.add(key)
                    }
                })
            }

            setHighlightedFields(newHighlights)

            // Remove highlights after animation duration (2s)
            setTimeout(() => {
                setHighlightedFields(new Set())
            }, 2500)

            toast({
                title: "Magic Applied! ✨",
                description: "Your fields have been auto-filled based on your description.",
            })

        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Something went wrong with the magic analysis.",
                variant: "destructive"
            })
        } finally {
            setIsMagicParsing(false)
        }
    }

    // Determine what level is visible based on NEW flow
    const showIntentAndLayout = state.selectedIntent !== null
    const showPlatformSelector = state.selectedIntent !== null && state.selectedLayout !== null
    const showImageAndContent = showPlatformSelector && state.selectedPlatform !== null && state.selectedFormat !== null
    const showVisuals = showImageAndContent && (
        state.visionAnalysis !== null ||
        (state.imageSourceMode === 'generate' && state.aiImageDescription?.trim() !== '') ||
        !requiresImage
    )

    const canGenerate = showVisuals && (
        state.selectedStyles.length > 0 ||
        state.customStyle.trim() !== '' ||
        state.headline ||
        state.cta
    )

    return (
        <div className="w-full md:w-80 h-auto md:h-full bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border-l border-white/20 flex flex-col shrink-0 relative z-10 order-1 md:order-1">
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto min-h-0 thin-scrollbar pb-24 md:pb-0">
                <div className="pt-4 pb-4">

                    {/* PHASE 0: PRESETS (Quick Start) */}
                    <div className="px-6 pb-4">
                        <PresetsCarousel
                            onSelectPreset={loadPreset}
                            onReset={reset}
                            userId={user?.id}
                        />
                    </div>

                    {/* STEP 1: LAZY PROMPT (Intent Auto-Detection) */}
                    <div className="border-t border-border/40"></div>
                    <div className="px-6 pt-4">
                        <StepSection
                            number={1}
                            title="DESCRIBE TU IDEA"
                            description="La IA detectará el tipo de publicación y extraerá los campos"
                        >
                            <LazyPromptInput
                                intent={state.selectedIntent}
                                rawMessage={state.rawMessage}
                                onMessageChange={setRawMessage}
                                onAnalyze={handleSmartAnalyze}
                                isAnalyzing={isMagicParsing}
                            />
                            {state.selectedIntent && (
                                <div className="mt-4">
                                    {/* UNIFIED CONTENT SECTION REMOVED - MOVED TO PREVIEW */}
                                </div>
                            )}
                        </StepSection>
                    </div>

                    {/* STEP 2: INTENT & LAYOUT */}
                    {showIntentAndLayout && (
                        <>
                            <div className="border-t border-border/40 mt-4"></div>
                            <div className="px-6 pt-4">
                                <StepSection
                                    number={2}
                                    title="INTENCIÓN Y COMPOSICIÓN"
                                    description="Define el objetivo y la estructura visual"
                                >
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                                Selecciona Intención
                                            </p>
                                            {/* 
                                            <IntentSelector
                                                selectedGroup={state.selectedGroup}
                                                selectedIntent={state.selectedIntent}
                                                onSelectGroup={selectGroup}
                                                onSelectIntent={selectIntent}
                                            />
                                            */}
                                            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                                                        Intención Detectada
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        {creationFlow.currentIntent?.name || 'Seleccionando...'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {state.selectedIntent && availableLayouts.length > 0 && (
                                            <div>
                                                <LayoutSelector
                                                    availableLayouts={availableLayouts}
                                                    selectedLayout={state.selectedLayout}
                                                    onSelectLayout={selectLayout}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </StepSection>
                            </div>
                        </>
                    )}

                    {/* STEP 3: PLATFORM & FORMAT */}
                    {showPlatformSelector && (
                        <>
                            <div className="border-t border-border/40 mt-4"></div>
                            <div className="px-6 pt-4">
                                <StepSection
                                    number={3}
                                    title="PLATAFORMA Y FORMATO"
                                    description="Selecciona dónde publicarás"
                                >
                                    <SocialFormatSelector
                                        selectedPlatform={state.selectedPlatform}
                                        selectedFormat={state.selectedFormat}
                                        onSelectPlatform={selectPlatform}
                                        onSelectFormat={selectFormat}
                                    />
                                </StepSection>
                            </div>
                        </>
                    )}

                    {/* STEP 4: IMAGE REFERENCE & CONTENT FIELDS */}
                    {showImageAndContent && (
                        <>
                            <div className="border-t border-border/40 mt-4"></div>
                            <div className="px-6 pt-4">
                                <StepSection
                                    number={4}
                                    title="REFERENCIA & CONTENIDO"
                                    description="Imagen de referencia y campos de texto"
                                >
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                Referencia Visual {requiresImage ? '(Obligatoria)' : '(Opcional)'}
                                            </p>
                                            <ImageReferenceSelector
                                                uploadedImage={state.uploadedImage}
                                                visionAnalysis={state.visionAnalysis}
                                                isAnalyzing={state.isAnalyzing}
                                                error={state.error}
                                                onUpload={uploadImage}
                                                onClear={clearImage}
                                                isOptional={!requiresImage}
                                                // Brand Kit images
                                                brandKitImages={activeBrandKit?.images?.map((img, idx) => ({
                                                    id: img.url,
                                                    url: img.url,
                                                    name: `Imagen ${idx + 1}`
                                                })) || []}
                                                selectedBrandKitImageId={state.selectedBrandKitImageId}
                                                onSelectBrandKitImage={creationFlow.selectBrandKitImage}
                                                // AI generation
                                                aiImageDescription={state.aiImageDescription}
                                                onAiDescriptionChange={creationFlow.setAiImageDescription}
                                                // Mode Control
                                                mode={state.imageSourceMode}
                                                onModeChange={creationFlow.setImageSourceMode}
                                            />
                                        </div>

                                        {/* Form Fields (Auto-filled by Lazy Prompt) */}
                                        {state.selectedIntent && (
                                            <BrandingConfigurator
                                                selectedLayout={creationFlow.selectedLayoutMeta || null}
                                                selectedLogoId={state.selectedLogoId}
                                                selectedBrandColors={state.selectedBrandColors}
                                                onSelectLogo={selectLogo}
                                                onToggleBrandColor={toggleBrandColor}
                                                onRemoveBrandColor={creationFlow.removeBrandColor}
                                                onAddCustomColor={creationFlow.addCustomColor}
                                                showLogo={true}
                                                showColors={true}
                                                textAssets={state.selectedTextAssets}
                                                onAddTextAsset={creationFlow.addTextAsset}
                                                onRemoveTextAsset={creationFlow.removeTextAsset}
                                                onUpdateTextAsset={creationFlow.updateTextAsset}
                                                rawMessage={state.rawMessage}
                                                onGenerateText={creationFlow.generateTextForField}
                                            />
                                        )}
                                    </div>
                                </StepSection>
                            </div>
                        </>
                    )}

                    {/* STEP 5: VISUAL STYLE */}
                    {showVisuals && (
                        <>
                            <div className="border-t border-border/40 mt-4"></div>
                            <div className="px-6 pt-4">
                                <StepSection
                                    number={5}
                                    title="ESTILO VISUAL"
                                    description="Define la estética final"
                                >
                                    <StyleChipsSelector
                                        availableStyles={availableStyles}
                                        styleGroups={creationFlow.styleGroups}
                                        selectedStyles={state.selectedStyles}
                                        customStyle={state.customStyle}
                                        onToggleStyle={toggleStyle}
                                        onCustomStyleChange={setCustomStyle}
                                    />
                                </StepSection>
                            </div>
                        </>
                    )}



                    {/* MOBILE-ONLY: Image Preview Section */}
                    {isMobile && currentImage && (
                        <>
                            <div className="border-t border-border/40 mt-4"></div>
                            <div className="px-4 pt-3 pb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 shadow-sm">
                                            ✓
                                        </span>
                                        <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">RESULTADO</h3>
                                    </div>
                                    {/* Action buttons - associated with image */}
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={() => {
                                                // TODO: Implement edit functionality
                                            }}
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={() => {
                                                const link = document.createElement('a')
                                                link.href = currentImage
                                                link.download = `x-image-${Date.now()}.png`
                                                document.body.appendChild(link)
                                                link.click()
                                                document.body.removeChild(link)
                                            }}
                                            title="Descargar"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: 'Mi diseño',
                                                        url: currentImage
                                                    })
                                                }
                                            }}
                                            title="Compartir"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                {/* Image Preview */}
                                <div
                                    className="w-full rounded-xl overflow-hidden shadow-lg ring-1 ring-black/10 bg-white relative"
                                    style={{
                                        aspectRatio: aspectRatio.replace(':', '/'),
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        {(isGenerating || isRevealing) && (
                                            <motion.div
                                                key="loader"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute inset-0 z-50 overflow-hidden rounded-lg bg-background/50 backdrop-blur-sm flex items-center justify-center"
                                            >
                                                <DigitalStaticLoader />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {currentImage ? (
                                        <motion.div
                                            key={currentImage}
                                            initial={wasJustGenerated ? { opacity: 0, filter: 'blur(20px)' } : { opacity: 1, filter: 'blur(0px)' }}
                                            animate={{
                                                opacity: 1,
                                                filter: 'blur(0px)',
                                            }}
                                            transition={wasJustGenerated ? {
                                                duration: 0.3,
                                                ease: "easeOut",
                                                filter: { duration: 0.4 },
                                                opacity: { duration: 0.2 }
                                            } : {
                                                duration: 0.15
                                            }}
                                            className="w-full h-full"
                                        >
                                            <img
                                                src={currentImage}
                                                alt="Generated design"
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-muted/20">
                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                                <span className="text-2xl opacity-50">🎨</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* History Row - Subtle style, no label */}
                                {generations.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-border/30">
                                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                            {generations.map((gen) => (
                                                <button
                                                    key={gen.id}
                                                    onClick={() => onSelectGeneration?.(gen)}
                                                    className={`relative flex-shrink-0 transition-all duration-150 ${currentImage === gen.image_url
                                                        ? 'ring-1 ring-primary'
                                                        : 'opacity-60 hover:opacity-100'
                                                        }`}
                                                >
                                                    <div className="w-11 h-11 rounded overflow-hidden bg-muted">
                                                        <img
                                                            src={gen.image_url}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Prompt Input for edits */}
                                <div className="mt-3 pt-3 border-t border-border/30 pb-20">
                                    <div className="relative">
                                        <textarea
                                            placeholder="Indica qué cambios quieres realizar: 'hazla más oscura', 'cambia el fondo', 'añade un objeto'..."
                                            className="w-full min-h-[56px] max-h-[120px] text-sm p-4 rounded-2xl border border-white/20 bg-background/80 backdrop-blur-xl shadow-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
                                            rows={2}
                                            value={editPrompt}
                                            onChange={(e) => onEditPromptChange?.(e.target.value)}
                                        />
                                        <div className="absolute right-3 bottom-3 pointer-events-none">
                                            <ArrowUp className="w-4 h-4 text-primary/70" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <SavePresetDialog
                open={isSaveDialogOpen}
                onOpenChange={setIsSaveDialogOpen}
                onSave={handleSavePreset}
                isSaving={isSavingPreset}
            />
        </div>
    )
}
