'use client'

import { useCreationFlow } from '@/hooks/useCreationFlow'
import { IntentSelector } from './IntentSelector'
import { SmartImageDropzone } from './SmartImageDropzone'
import { ThemeSelector } from './ThemeSelector'
import { StyleChipsSelector } from './StyleChipsSelector'
import { LayoutSelector } from './LayoutSelector'
import { BrandingConfigurator } from './BrandingConfigurator'
import { SocialFormatSelector } from './SocialFormatSelector'
import { GenerateButton } from './GenerateButton'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
                    <p className="text-[10px] text-muted-foreground leading-relaxed ml-7">
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
        availableLayouts,
        selectGroup,
        selectIntent,
        uploadImage,
        clearImage,
        selectTheme,
        toggleStyle,
        selectLayout,
        selectLogo,
        setHeadline,
        setCta,
        setAdditionalInstructions,
        setCustomStyle,
        setCustomText,
        toggleBrandColor,
        selectPlatform,
        selectFormat,
        constructFinalPrompt,
        reset,
    } = creationFlow

    const handleGenerate = async () => {
        const prompt = constructFinalPrompt()
        console.log('[CREATION FLOW] Final Prompt:\n', prompt)

        if (onGenerate) {
            await onGenerate(prompt)
        }
    }

    // Determine what level is visible based on state
    const showLevel1 = state.selectedPlatform !== null && state.selectedFormat !== null
    const showLevel2 = showLevel1 && state.selectedIntent !== null
    const showLevel3 = showLevel2 && (state.visionAnalysis !== null || state.selectedTheme !== null)
    const hasStyle = state.selectedStyles.length > 0 || state.customStyle.trim() !== ''
    const showLevel4 = showLevel3 && hasStyle
    const showLevel5 = showLevel4

    const hasBranding = state.headline || state.cta || state.selectedLogoId || state.selectedBrandColors.length > 0 || state.additionalInstructions.trim() !== ''
    const canGenerate = showLevel3 && (hasStyle || hasBranding)

    return (
        <div className="w-[360px] h-full bg-card border-l border-border flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/10">
                <div className="space-y-0.5">
                    <h2 className="text-lg font-bold font-heading tracking-tight">Centro de Creación</h2>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Estudio de Generación AI</p>
                </div>
                {state.selectedIntent && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={reset}
                        className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Reiniciar"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
                <div className="px-6 pt-2 pb-8 flex flex-col">
                    {/* Level 1: Platform & Format */}
                    <StepSection number={1} title="PLATAFORMA Y FORMATO">
                        <SocialFormatSelector
                            selectedPlatform={state.selectedPlatform}
                            selectedFormat={state.selectedFormat}
                            onSelectPlatform={selectPlatform}
                            onSelectFormat={selectFormat}
                        />
                    </StepSection>

                    {showLevel1 && <hr className="border-t-2 border-border/50 mt-6 mb-2 -mx-6" />}

                    {/* Level 3: Intent Selector */}
                    <StepSection
                        number={2}
                        title="INTENCIÓN"
                        description="¿Qué quieres conseguir con esta pieza?"
                        show={showLevel1}
                    >
                        <IntentSelector
                            selectedGroup={state.selectedGroup}
                            selectedIntent={state.selectedIntent}
                            onSelectGroup={selectGroup}
                            onSelectIntent={selectIntent}
                        />
                    </StepSection>

                    {showLevel2 && <hr className="border-t-2 border-border/50 mt-6 mb-2 -mx-6" />}

                    {/* Level 4: Smart Input (Image or Theme) */}
                    <StepSection
                        number={3}
                        title="IMAGEN DE REFERENCIA"
                        description="Sube una imagen o elige un tema para guiar la IA"
                        show={showLevel2}
                    >
                        {requiresImage ? (
                            <SmartImageDropzone
                                uploadedImage={state.uploadedImage}
                                visionAnalysis={state.visionAnalysis}
                                isAnalyzing={state.isAnalyzing}
                                error={state.error}
                                onUpload={uploadImage}
                                onClear={clearImage}
                            />
                        ) : (
                            <ThemeSelector
                                selectedTheme={state.selectedTheme}
                                onSelectTheme={selectTheme}
                            />
                        )}
                    </StepSection>

                    {showLevel3 && <hr className="border-t-2 border-border/50 mt-6 mb-2 -mx-6" />}

                    {/* Step 4: Visual Style */}
                    <StepSection
                        number={4}
                        title="ESTILO VISUAL"
                        description="Elige la dirección estética de tu imagen"
                        show={showLevel3}
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

                    {showLevel3 && <hr className="border-t-2 border-border/50 mt-6 mb-2 -mx-6" />}

                    {/* Step 5: Branding Identity */}
                    <StepSection
                        number={5}
                        title="IDENTIDAD DE MARCA"
                        description="Integra tus logos y colores corporativos"
                        show={showLevel3}
                    >
                        <BrandingConfigurator
                            selectedLayout={creationFlow.selectedLayoutMeta || null}
                            customTexts={state.customTexts}
                            selectedLogoId={state.selectedLogoId}
                            headline={state.headline}
                            cta={state.cta}
                            selectedBrandColors={state.selectedBrandColors}
                            additionalInstructions={state.additionalInstructions}
                            onSelectLogo={selectLogo}
                            onHeadlineChange={setHeadline}
                            onCtaChange={setCta}
                            onAdditionalInstructionsChange={setAdditionalInstructions}
                            onCustomTextChange={setCustomText}
                            onToggleNoText={creationFlow.toggleNoText}
                            onToggleBrandColor={toggleBrandColor}
                            onGenerateAICopy={creationFlow.generateFieldCopy}
                            showLogo={true}
                            showColors={true}
                            showTexts={false}
                            showInstructions={false}
                        />
                    </StepSection>

                    {showLevel3 && <hr className="border-t-2 border-border/50 mt-6 mb-2 -mx-6" />}

                    {/* Step 6: Content & Texts */}
                    <StepSection
                        number={6}
                        title="CONTENIDO Y TEXTOS"
                        description="Personaliza los mensajes de tu pieza"
                        show={showLevel3}
                    >
                        <BrandingConfigurator
                            selectedLayout={creationFlow.selectedLayoutMeta || null}
                            customTexts={state.customTexts}
                            selectedLogoId={state.selectedLogoId}
                            headline={state.headline}
                            cta={state.cta}
                            selectedBrandColors={state.selectedBrandColors}
                            additionalInstructions={state.additionalInstructions}
                            onSelectLogo={selectLogo}
                            onHeadlineChange={setHeadline}
                            onCtaChange={setCta}
                            onAdditionalInstructionsChange={setAdditionalInstructions}
                            onCustomTextChange={setCustomText}
                            onToggleNoText={creationFlow.toggleNoText}
                            onToggleBrandColor={toggleBrandColor}
                            onGenerateAICopy={creationFlow.generateFieldCopy}
                            showLogo={false}
                            showColors={false}
                            showTexts={true}
                            showInstructions={false}
                        />
                    </StepSection>

                    {showLevel3 && <hr className="border-t-2 border-border/50 my-6 -mx-6" />}

                    {/* Step 7: Director Instructions */}
                    <StepSection
                        number={7}
                        title="INSTRUCCIONES DEL DIRECTOR"
                        description="Indicaciones finales para la IA"
                        show={showLevel3}
                    >
                        <BrandingConfigurator
                            selectedLayout={creationFlow.selectedLayoutMeta || null}
                            customTexts={state.customTexts}
                            selectedLogoId={state.selectedLogoId}
                            headline={state.headline}
                            cta={state.cta}
                            selectedBrandColors={state.selectedBrandColors}
                            additionalInstructions={state.additionalInstructions}
                            onSelectLogo={selectLogo}
                            onHeadlineChange={setHeadline}
                            onCtaChange={setCta}
                            onAdditionalInstructionsChange={setAdditionalInstructions}
                            onCustomTextChange={setCustomText}
                            onToggleNoText={creationFlow.toggleNoText}
                            onToggleBrandColor={toggleBrandColor}
                            onGenerateAICopy={creationFlow.generateFieldCopy}
                            showLogo={false}
                            showColors={false}
                            showTexts={false}
                            showInstructions={true}
                        />
                    </StepSection>
                </div>
            </div>

            {/* Footer: Generate Button */}
            <div className="p-6 border-t border-border bg-muted/5">
                <GenerateButton
                    isGenerating={isGenerating || state.isGenerating}
                    isDisabled={!canGenerate}
                    onClick={handleGenerate}
                />

                {/* Progress indicator */}
                <div className="flex justify-center gap-2 mt-4">
                    {[1, 2, 3, 4].map((step) => {
                        const isActive =
                            (step === 1 && state.selectedFormat) ||
                            (step === 2 && state.selectedIntent) ||
                            (step === 3 && showLevel3) ||
                            (step === 4 && canGenerate)

                        return (
                            <div
                                key={step}
                                className={`h-1 rounded-full transition-all duration-500 shadow-sm ${isActive
                                    ? 'w-8 bg-primary translate-y-0 opacity-100'
                                    : 'w-4 bg-muted translate-y-0.5 opacity-50'
                                    }`}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
