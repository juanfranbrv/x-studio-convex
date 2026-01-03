import { useState, useCallback, useMemo } from 'react'
import { generateFieldCopy as getAICopy } from '@/app/actions/generate-copy'
import {
    type IntentGroup,
    type IntentCategory,
    type SeasonalTheme,
    type VisionAnalysis,
    type GenerationState,
    type LayoutOption,
    type LayoutTextField,
    INITIAL_GENERATION_STATE,
    INTENT_CATALOG,
    STYLE_CHIPS_BY_SUBJECT,
    ARTISTIC_STYLE_CATALOG,
    ARTISTIC_STYLE_GROUPS,
    LAYOUTS_BY_INTENT,
    DEFAULT_LAYOUTS,
    THEME_CATALOG,
    SOCIAL_FORMATS,
    SocialPlatform,
} from '@/lib/creation-flow-types'
import { useBrandKit } from '@/contexts/BrandKitContext'

export const NO_TEXT_TOKEN = '[NO_TEXT]'

export interface UseCreationFlowOptions {
    onImageUploaded?: (file: File) => void
}

export function useCreationFlow(options?: UseCreationFlowOptions) {
    const { activeBrandKit } = useBrandKit()
    const [state, setState] = useState<GenerationState>(INITIAL_GENERATION_STATE)

    // -------------------------------------------------------------------------
    // STEP 0: Platform and Format Selection
    // -------------------------------------------------------------------------

    const selectPlatform = useCallback((platform: SocialPlatform) => {
        // When platform changes, auto-select the first available format for that platform
        const firstFormat = SOCIAL_FORMATS.find(f => f.platform === platform)
        setState(prev => ({
            ...prev,
            selectedPlatform: platform,
            selectedFormat: firstFormat?.id || null
        }))
    }, [])

    const selectFormat = useCallback((formatId: string) => {
        setState(prev => ({ ...prev, selectedFormat: formatId }))
    }, [])

    // -------------------------------------------------------------------------
    // STEP 1: Intent Selection
    // -------------------------------------------------------------------------

    const selectGroup = useCallback((group: IntentGroup) => {
        setState(prev => ({
            ...INITIAL_GENERATION_STATE,
            selectedGroup: group,
        }))
    }, [])

    const selectIntent = useCallback((intent: IntentCategory) => {
        const intentMeta = INTENT_CATALOG.find(i => i.id === intent)
        setState(prev => ({
            ...prev,
            selectedIntent: intent,
            selectedSubMode: null,
            // Pre-fill defaults from intent metadata
            headline: intentMeta?.defaultHeadline || '',
            cta: intentMeta?.defaultCta || '',
            // Reset downstream selections
            uploadedImage: null,
            uploadedImageFile: null,
            selectedTheme: null,
            visionAnalysis: null,
            selectedStyles: [],
            selectedLayout: null,
        }))
    }, [])

    const selectSubMode = useCallback((subMode: string) => {
        setState(prev => ({ ...prev, selectedSubMode: subMode }))
    }, [])

    // -------------------------------------------------------------------------
    // STEP 2: Image Upload or Theme Selection
    // -------------------------------------------------------------------------

    const uploadImage = useCallback(async (file: File) => {
        setState(prev => ({ ...prev, isAnalyzing: true, error: null }))

        try {
            // Convert to base64
            const base64 = await fileToBase64(file)

            setState(prev => ({
                ...prev,
                uploadedImage: base64,
                uploadedImageFile: file,
            }))

            if (options?.onImageUploaded) {
                options.onImageUploaded(file)
            }

            // Call Vision API
            const response = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: base64,
                    mimeType: file.type,
                }),
            })

            const result = await response.json()

            if (result.success && result.data) {
                setState(prev => ({
                    ...prev,
                    visionAnalysis: result.data,
                    isAnalyzing: false,
                }))
            } else {
                throw new Error(result.error || 'Vision analysis failed')
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isAnalyzing: false,
                error: error instanceof Error ? error.message : 'Error analyzing image',
            }))
        }
    }, [])

    const selectTheme = useCallback((theme: SeasonalTheme) => {
        const themeMeta = THEME_CATALOG.find(t => t.id === theme)
        setState(prev => ({
            ...prev,
            selectedTheme: theme,
            // Create a pseudo VisionAnalysis from theme
            visionAnalysis: themeMeta ? {
                subject: 'abstract',
                subjectLabel: themeMeta.name,
                lighting: 'studio',
                colorPalette: themeMeta.colors,
                keywords: themeMeta.keywords,
                confidence: 1,
            } : null,
        }))
    }, [])

    const setImageFromUrl = useCallback(async (url: string) => {
        setState(prev => ({ ...prev, isAnalyzing: true, error: null }))
        try {
            // Fetch image and convert to blob then to base64
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], 'image_from_kit.png', { type: blob.type })
            const base64 = await fileToBase64(file)

            setState(prev => ({
                ...prev,
                uploadedImage: base64,
                uploadedImageFile: file,
            }))

            // Call Vision API
            const visionResponse = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: base64,
                    mimeType: blob.type,
                }),
            })

            const result = await visionResponse.json()

            if (result.success && result.data) {
                setState(prev => ({
                    ...prev,
                    visionAnalysis: result.data,
                    isAnalyzing: false,
                }))
            } else {
                throw new Error(result.error || 'Vision analysis failed')
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isAnalyzing: false,
                error: error instanceof Error ? error.message : 'Error processing image from kit',
            }))
        }
    }, [])

    const clearImage = useCallback(() => {
        setState(prev => ({
            ...prev,
            uploadedImage: null,
            uploadedImageFile: null,
            visionAnalysis: null,
            selectedStyles: [],
            selectedLayout: null,
        }))
    }, [])

    // -------------------------------------------------------------------------
    // STEP 3: Style Selection
    // -------------------------------------------------------------------------

    const toggleStyle = useCallback((styleId: string) => {
        setState(prev => {
            const isSelected = prev.selectedStyles.includes(styleId)
            return {
                ...prev,
                selectedStyles: isSelected
                    ? prev.selectedStyles.filter(s => s !== styleId)
                    : [...prev.selectedStyles, styleId],
            }
        })
    }, [])

    // -------------------------------------------------------------------------
    // STEP 4: Layout Selection
    // -------------------------------------------------------------------------

    const selectLayout = useCallback((layoutId: string) => {
        setState(prev => ({ ...prev, selectedLayout: layoutId }))
    }, [])

    // -------------------------------------------------------------------------
    // STEP 5: Final Format Selection
    // -------------------------------------------------------------------------

    // (Moved to Step 0)

    // -------------------------------------------------------------------------
    // STEP 5: Branding Configuration
    // -------------------------------------------------------------------------

    const selectLogo = useCallback((logoId: string | null) => {
        setState(prev => ({ ...prev, selectedLogoId: logoId }))
    }, [])

    const setHeadline = useCallback((headline: string) => {
        setState(prev => ({ ...prev, headline }))
    }, [])

    const setCta = useCallback((cta: string) => {
        setState(prev => ({ ...prev, cta }))
    }, [])

    const setAdditionalInstructions = useCallback((instructions: string) => {
        setState(prev => ({ ...prev, additionalInstructions: instructions }))
    }, [])

    const setCustomStyle = useCallback((style: string) => {
        setState(prev => ({ ...prev, customStyle: style }))
    }, [])

    const setCustomText = useCallback((id: string, value: string) => {
        setState(prev => ({
            ...prev,
            customTexts: { ...prev.customTexts, [id]: value }
        }))
    }, [])

    const toggleNoText = useCallback((id: string) => {
        setState(prev => {
            const current = id === 'headline' ? prev.headline : (id === 'cta' ? prev.cta : prev.customTexts[id])
            const isNoText = current === NO_TEXT_TOKEN

            if (id === 'headline') return { ...prev, headline: isNoText ? '' : NO_TEXT_TOKEN }
            if (id === 'cta') return { ...prev, cta: isNoText ? '' : NO_TEXT_TOKEN }

            return {
                ...prev,
                customTexts: {
                    ...prev.customTexts,
                    [id]: isNoText ? '' : NO_TEXT_TOKEN
                }
            }
        })
    }, [])

    const generateFieldCopy = useCallback(async (field: LayoutTextField) => {
        if (!activeBrandKit || !state.selectedIntent) return

        try {
            const result = await getAICopy({
                brandName: activeBrandKit.brand_name,
                brandDNA: activeBrandKit,
                intent: state.selectedIntent,
                visionAnalysis: state.visionAnalysis,
                fieldLabel: field.label,
                fieldDescription: field.aiContext
            })

            if (result.success && result.text) {
                // Determine if it's a standard or custom field
                if (field.id === 'headline') setHeadline(result.text)
                else if (field.id === 'cta') setCta(result.text)
                else setCustomText(field.id, result.text)
            }
        } catch (error) {
            console.error('Error in generateFieldCopy:', error)
        }
    }, [activeBrandKit, state.selectedIntent, state.visionAnalysis, setHeadline, setCta, setCustomText])

    const toggleBrandColor = useCallback((color: string) => {
        setState(prev => {
            const isSelected = prev.selectedBrandColors.includes(color)
            return {
                ...prev,
                selectedBrandColors: isSelected
                    ? prev.selectedBrandColors.filter(c => c !== color)
                    : [...prev.selectedBrandColors, color],
            }
        })
    }, [])

    // -------------------------------------------------------------------------
    // COMPUTED VALUES
    // -------------------------------------------------------------------------

    const currentIntent = INTENT_CATALOG.find(i => i.id === state.selectedIntent)
    const requiresImage = currentIntent?.requiresImage ?? false

    const availableStyles = useMemo(() => {
        const suggested = state.visionAnalysis
            ? STYLE_CHIPS_BY_SUBJECT[state.visionAnalysis.subject] || STYLE_CHIPS_BY_SUBJECT.unknown
            : []

        // Mark suggested styles with the 'suggested' category for the UI
        const suggestedWithCategory = suggested.map(s => ({ ...s, category: 'suggested' }))

        // Combine suggested with the global artistic catalog
        // We filter out duplicates if a style exists in both (using ID)
        const catalogIds = new Set(suggested.map(s => s.id))
        const catalogFiltered = ARTISTIC_STYLE_CATALOG.filter(s => !catalogIds.has(s.id))

        return [...suggestedWithCategory, ...catalogFiltered]
    }, [state.visionAnalysis])

    const availableLayouts: LayoutOption[] = state.selectedIntent
        ? (LAYOUTS_BY_INTENT[state.selectedIntent] || DEFAULT_LAYOUTS)
        : DEFAULT_LAYOUTS

    const selectedLayoutMeta = availableLayouts.find(l => l.id === state.selectedLayout)

    // -------------------------------------------------------------------------
    // PROMPT CONSTRUCTION
    // -------------------------------------------------------------------------

    const constructFinalPrompt = useCallback((): string => {
        const parts: string[] = []

        // BRAND DNA (Tone & Personality)
        const toneCount = activeBrandKit?.tone_of_voice?.length ?? 0
        const aestheticCount = activeBrandKit?.visual_aesthetic?.length ?? 0

        if (toneCount > 0 || aestheticCount > 0) {
            parts.push(`BRAND DNA & PERSONALITY (ESSENTIAL):`)
            if (toneCount > 0) {
                parts.push(`- BRAND TONE: Use a tone that is ${activeBrandKit!.tone_of_voice.join(', ')}`)
            }
            if (aestheticCount > 0) {
                parts.push(`- VISUAL VIBE: Incorporate elements of ${activeBrandKit!.visual_aesthetic.join(', ')}`)
            }
            parts.push(`- Ensure the final image FEELS like it belongs to this brand's universe.`)
            parts.push(``)
        }

        // Intent Type
        if (currentIntent) {
            parts.push(`TYPE: ${currentIntent.name} (${currentIntent.description})`)
        }

        // Subject from Vision Analysis
        if (state.visionAnalysis) {
            parts.push(`SUBJECT: ${state.visionAnalysis.subjectLabel}`)
            if (state.visionAnalysis.keywords.length > 0) {
                parts.push(`VISUAL KEYWORDS: ${state.visionAnalysis.keywords.join(', ')}`)
            }
            parts.push(`LIGHTING: ${state.visionAnalysis.lighting}`)
        }

        // Selected Style Chips
        if (state.selectedStyles.length > 0 || state.customStyle) {
            const selectedChips = availableStyles.filter(s => state.selectedStyles.includes(s.id))
            const styleKeywords = selectedChips.flatMap(c => c.keywords)
            const allStyles = [...styleKeywords]
            if (state.customStyle) allStyles.push(state.customStyle)

            parts.push(`STYLE & AESTHETIC DIRECTION:`)
            parts.push(`- You MUST strictly embody these visual styles: ${allStyles.join(', ')}`)
            parts.push(`- Ensure every pixel of the composition reflects this aesthetic mood.`)
        }

        // Layout & Structure
        if (selectedLayoutMeta) {
            if (selectedLayoutMeta.referenceImage) {
                parts.push(`REFERENCE: This generation is strictly guided by the template/wireframe image marked as [REF_PLANTILLA].`)
            }

            if (selectedLayoutMeta.structuralPrompt) {
                parts.push(`--- STRUCTURAL DNA ---\n${selectedLayoutMeta.structuralPrompt.trim()}\n--- END STRUCTURE ---`)
            } else {
                parts.push(`COMPOSITION: ${selectedLayoutMeta.promptInstruction}`)
            }
        } else {
            // FALLBACK: AI-driven composition
            parts.push(`COMPOSITION (AI CREATIVE CONTROL): You have full creative control over the layout. Create a professional, aesthetically pleasing, and commercially effective composition that prioritizes legibility of any provided text and highlights the main subject. Optimize the placement of text and brand elements based on the intent and visual balance. Avoid clutter and ensure a premium visual feel.`)
        }

        // ADDITIONAL INSTRUCTIONS (Director's Cut)
        if (state.additionalInstructions) {
            parts.push(`DIRECTOR'S CUSTOM INSTRUCTIONS (TOP PRIORITY):`)
            parts.push(`"${state.additionalInstructions}"`)
            parts.push(`Note: If these instructions contradict previous layout rules, prioritise these custom instructions.`)
        }

        // Brand Colors
        const brandColors = state.selectedBrandColors.length > 0
            ? state.selectedBrandColors
            : activeBrandKit?.colors?.filter(c => c.selected).map(c => c.color) || []

        if (brandColors.length > 0) {
            parts.push(`BRAND COLORS: ${brandColors.join(', ')}`)
        }

        // Text Content Section (Only include what is present)
        const textParts: string[] = []

        const headlineValue = state.headline?.trim()
        if (headlineValue && headlineValue !== NO_TEXT_TOKEN) {
            textParts.push(`- HEADLINE TEXT: "${headlineValue}"`)
        }

        const ctaValue = state.cta?.trim()
        if (ctaValue && ctaValue !== NO_TEXT_TOKEN) {
            textParts.push(`- CTA TEXT: "${ctaValue}"`)
        }

        // Custom Layout Fields
        Object.entries(state.customTexts).forEach(([id, val]) => {
            const cleanVal = val?.trim()
            if (cleanVal && cleanVal !== NO_TEXT_TOKEN) {
                textParts.push(`- ${id.toUpperCase()}: "${cleanVal}"`)
            }
        })

        if (textParts.length > 0) {
            parts.push(`LISTA DE TEXTOS OBLIGATORIOS (SI NO ESTÁ AQUÍ, NO LO PONGAS):`)
            parts.push(...textParts)
        } else {
            parts.push(`AVISO: No se ha proporcionado ningún texto. La imagen DEBE estar totalmente limpia de letras, números o palabras.`)
        }

        // Selected Logo
        if (state.selectedLogoId && activeBrandKit?.logos) {
            const logo = activeBrandKit.logos.find((l, idx) =>
                (l as any).id === state.selectedLogoId || `logo-${idx}` === state.selectedLogoId
            )
            if (logo) {
                parts.push(`LOGO: Include brand logo subtly in corner`)
            }
        }

        // Final Format
        if (state.selectedFormat) {
            const format = SOCIAL_FORMATS.find(f => f.id === state.selectedFormat)
            if (format) {
                parts.push(`FORMAT: ${format.name} (${format.aspectRatio})`)
                parts.push(`ASPECT RATIO: ${format.aspectRatio}`)
            }
        }

        return parts.join('\n')
    }, [state, currentIntent, availableStyles, selectedLayoutMeta, activeBrandKit])

    // -------------------------------------------------------------------------
    // GENERATION (stub for now)
    // -------------------------------------------------------------------------

    const generate = useCallback(async () => {
        setState(prev => ({ ...prev, isGenerating: true, error: null }))

        try {
            const prompt = constructFinalPrompt()
            console.log('[CREATION FLOW] Final Prompt:\n', prompt)

            // TODO: Call actual generation API
            // For now, just log the prompt
            await new Promise(resolve => setTimeout(resolve, 1000))

            setState(prev => ({
                ...prev,
                isGenerating: false,
            }))

            return prompt
        } catch (error) {
            setState(prev => ({
                ...prev,
                isGenerating: false,
                error: error instanceof Error ? error.message : 'Generation failed',
            }))
            return null
        }
    }, [constructFinalPrompt])

    // -------------------------------------------------------------------------
    // RESET
    // -------------------------------------------------------------------------

    const reset = useCallback(() => {
        setState(INITIAL_GENERATION_STATE)
    }, [])

    // -------------------------------------------------------------------------
    // RETURN
    // -------------------------------------------------------------------------

    return {
        // State
        state,
        // Computed
        currentIntent,
        requiresImage,
        availableStyles,
        availableLayouts,
        selectedLayoutMeta,
        // Actions
        selectGroup,
        selectIntent,
        selectSubMode,
        uploadImage,
        setImageFromUrl,
        clearImage,
        selectTheme,
        toggleStyle,
        selectLayout,
        selectPlatform,
        selectFormat,
        selectLogo,
        setHeadline,
        setCta,
        setAdditionalInstructions,
        setCustomStyle,
        setCustomText,
        generateFieldCopy,
        toggleBrandColor,
        constructFinalPrompt,
        generate,
        reset,
        toggleNoText,
        // Constants
        styleGroups: ARTISTIC_STYLE_GROUPS,
    }
}

// -------------------------------------------------------------------------
// HELPERS
// -------------------------------------------------------------------------

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}
