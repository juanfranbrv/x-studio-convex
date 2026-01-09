'use client'

import { useCreationFlow } from '@/hooks/useCreationFlow'
import { IntentSelector } from './IntentSelector'
import { ImageReferenceSelector } from './ImageReferenceSelector'
import { StyleChipsSelector } from './StyleChipsSelector'
import { LayoutSelector } from './LayoutSelector'
import { BrandingConfigurator } from './BrandingConfigurator'
import { SocialFormatSelector } from './SocialFormatSelector'
import { GenerateButton } from './GenerateButton'
import { PresetsCarousel } from './PresetsCarousel'
import { LazyPromptInput } from './LazyPromptInput'
import { UnifiedContentSection } from './UnifiedContentSection'
import { IntentCategory } from '@/lib/creation-flow-types'
import { SavePresetDialog } from './SavePresetDialog'
import { BookmarkPlus, RotateCcw, Sparkles } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { parseLazyIntentAction } from '@/app/actions/parse-intent'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useBrandKit } from '@/contexts/BrandKitContext'

interface CreationCommandPanelProps {
    onGenerate?: (prompt: string) => Promise<void>
    isGenerating?: boolean
    creationFlow: ReturnType<typeof useCreationFlow>
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
            <div className="space-y-1 mb-2">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 shadow-sm">
                        {number}
                    </span>
                    <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">{title}</h3>
                </div>
                {description && (
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
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
        setAdditionalInstructions,
        setRawMessage,
        setCustomStyle,
        setCustomText,
        onGenerateCustomFieldCopy,
        toggleBrandColor,
        selectPlatform,
        selectFormat,
        constructFinalPrompt,
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

    const handleGenerate = async () => {
        const prompt = constructFinalPrompt()
        console.log('[CREATION FLOW] Final Prompt:\n', prompt)

        if (onGenerate) {
            await onGenerate(prompt)
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
    const showIntentAndLayout = true // Always show (step 2)
    const showPlatformSelector = state.selectedIntent !== null // Show after intent (step 3)
    const showImageAndContent = state.selectedPlatform !== null && state.selectedFormat !== null // Show after platform (step 4)
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
        <div className="w-[450px] h-full bg-card border-r border-border flex flex-col shadow-md relative z-10 hidden md:flex">
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
                <div className="pt-4 pb-12">

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
                            <div className="mt-4">
                                <UnifiedContentSection
                                    intentRequiredFields={currentIntent?.requiredFields || []}
                                    fieldsToRender={selectedLayoutMeta?.textFields || []}
                                    customTexts={state.customTexts}
                                    headline={state.headline}
                                    cta={state.cta}
                                    onHeadlineChange={setHeadline}
                                    onCtaChange={setCta}
                                    onCustomTextChange={setCustomText}
                                    onToggleNoText={creationFlow.toggleNoText}
                                    onGenerateAICopy={creationFlow.generateFieldCopy}
                                    onGenerateCustomFieldCopy={onGenerateCustomFieldCopy}
                                    highlightedFields={highlightedFields}
                                />
                            </div>
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
                </div>
            </div>

            {/* Footer: Generate Button */}
            <div className="p-3 pt-2 border-t-2 border-border bg-muted/20 z-20 flex gap-2 items-center">
                <Button
                    variant="outline"
                    className="h-[50px] w-[50px] rounded-xl p-0 flex-none border-primary/20 hover:bg-primary/5 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
                    onClick={() => setIsSaveDialogOpen(true)}
                    disabled={!canGenerate}
                    title="Guardar como Preset"
                >
                    <BookmarkPlus className="w-5 h-5" />
                </Button>

                <GenerateButton
                    isGenerating={isGenerating || state.isGenerating}
                    isDisabled={!canGenerate}
                    onClick={handleGenerate}
                    className="h-[50px]"
                />
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
