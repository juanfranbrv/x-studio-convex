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
            // Preserve Platform and Format selection
            selectedPlatform: prev.selectedPlatform,
            selectedFormat: prev.selectedFormat,
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
    // Image Source Mode Selection
    // -------------------------------------------------------------------------

    const setImageSourceMode = useCallback((mode: 'upload' | 'brandkit' | 'generate') => {
        setState(prev => ({ ...prev, imageSourceMode: mode }))
    }, [])

    const selectBrandKitImage = useCallback(async (imageUrl: string) => {
        setState(prev => ({ ...prev, selectedBrandKitImageId: imageUrl }))

        // Use the image URL directly
        await setImageFromUrl(imageUrl)
    }, [setImageFromUrl])

    const setAiImageDescription = useCallback((description: string) => {
        setState(prev => ({ ...prev, aiImageDescription: description }))
    }, [])

    // -------------------------------------------------------------------------
    // STEP 3: Style Selection
    // -------------------------------------------------------------------------

    const toggleStyle = useCallback((styleId: string) => {
        setState(prev => {
            const isSelected = prev.selectedStyles.includes(styleId)
            // Mutually exclusive: If selecting a new one, clear previous ones.
            // If deselecting the current one, just clear.
            return {
                ...prev,
                selectedStyles: isSelected ? [] : [styleId],
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

    const setRawMessage = useCallback((message: string) => {
        setState(prev => ({ ...prev, rawMessage: message }))
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
                fieldDescription: field.aiContext,
                rawMessage: state.rawMessage || undefined  // User's raw input as context
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
    }, [activeBrandKit, state.selectedIntent, state.visionAnalysis, state.rawMessage, setHeadline, setCta, setCustomText])

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
        // BRAND KIT STYLES - First priority (unified from visual_aesthetic + visual_keywords)
        const brandStyles: Array<{ id: string; label: string; icon: string; keywords: string[]; category: string }> = []

        if (activeBrandKit) {
            // Add visual_aesthetic entries
            const aesthetics = activeBrandKit.visual_aesthetic || []
            aesthetics.forEach((style, i) => {
                brandStyles.push({
                    id: `brand_aesthetic_${i}`,
                    label: style,
                    icon: '🎨',
                    keywords: [style.toLowerCase()],
                    category: 'brand'
                })
            })

            // START MODIFICATION: Exclude visual_keywords from Style Selector to keep it strictly artistic
            const visualKeywords = activeBrandKit.text_assets?.visual_keywords || []
            visualKeywords.forEach((kw, i) => {
                // Avoid duplicates with aesthetics
                if (!aesthetics.some(a => a.toLowerCase() === kw.toLowerCase())) {
                    brandStyles.push({
                        id: `brand_keyword_${i}`,
                        label: kw,
                        icon: '✨',
                        keywords: [kw.toLowerCase()],
                        category: 'brand'
                    })
                }
            })
            // END MODIFICATION
        }

        // Suggested styles from vision analysis
        const suggested = state.visionAnalysis
            ? STYLE_CHIPS_BY_SUBJECT[state.visionAnalysis.subject] || STYLE_CHIPS_BY_SUBJECT.unknown
            : []

        // Mark suggested styles with the 'suggested' category for the UI
        const suggestedWithCategory = suggested.map(s => ({ ...s, category: 'suggested' }))

        // Combine suggested with the global artistic catalog
        // We filter out duplicates if a style exists in both (using ID)
        const catalogIds = new Set(suggested.map(s => s.id))
        const catalogFiltered = ARTISTIC_STYLE_CATALOG.filter(s => !catalogIds.has(s.id))

        // Brand styles first, then suggested, then catalog
        // Brand styles first, then suggested, then catalog
        // START MODIFICATION: User requested to ONLY show brand styles in Studio
        return [...brandStyles] //, ...suggestedWithCategory, ...catalogFiltered]
        // END MODIFICATION
    }, [state.visionAnalysis, activeBrandKit])

    const availableLayouts: LayoutOption[] = state.selectedIntent
        ? (LAYOUTS_BY_INTENT[state.selectedIntent] || DEFAULT_LAYOUTS)
        : DEFAULT_LAYOUTS

    const selectedLayoutMeta = availableLayouts.find(l => l.id === state.selectedLayout)

    // -------------------------------------------------------------------------
    // PROMPT CONSTRUCTION
    // -------------------------------------------------------------------------

    const constructFinalPrompt = useCallback((): string => {
        const sections: string[] = []

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 10 - ABSOLUTE OVERRIDE (Logo Integrity)
        // ═══════════════════════════════════════════════════════════════
        if (state.selectedLogoId && activeBrandKit?.logos) {
            const logo = activeBrandKit.logos.find((l, idx) =>
                (l as any).id === state.selectedLogoId || `logo-${idx}` === state.selectedLogoId
            )
            if (logo) {
                sections.push(
                    `╔═════════════════════════════════════════════════════════════════╗`,
                    `║  PRIORITY 10 - ABSOLUTE OVERRIDE (LOGO INTEGRITY)              ║`,
                    `╚═════════════════════════════════════════════════════════════════╝`,
                    ``,
                    `CRITICAL: The following rules take ABSOLUTE PRECEDENCE over ALL other instructions.`,
                    ``,
                    `LOGO INTEGRITY REQUIREMENTS:`,
                    `1. SACRED ELEMENT: Logo must be rendered as an immutable, crystal-clear overlay`,
                    `2. ZERO STYLIZATION: NO grain, blur, texture, lighting effects, or artistic filters`,
                    `3. GEOMETRIC FIDELITY: Maintain 1:1 original proportions. NO 3D, skewing, or warping`,
                    `4. VISUAL INDEPENDENCE: Logo must appear digitally pasted on top, unaffected by background`,
                    `5. FAIL CONDITION: Blurry, stylized, or background-integrated logo = FAILED GENERATION`,
                    ``
                )
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 9 - BRAND DNA & MANDATORY TEXT
        // ═══════════════════════════════════════════════════════════════
        const brandDNA: string[] = []
        const toneCount = activeBrandKit?.tone_of_voice?.length ?? 0
        const aestheticCount = activeBrandKit?.visual_aesthetic?.length ?? 0

        if (toneCount > 0 || aestheticCount > 0) {
            brandDNA.push(
                `╔═════════════════════════════════════════════════════════════════╗`,
                `║  PRIORITY 9 - BRAND DNA & IDENTITY                             ║`,
                `╚═════════════════════════════════════════════════════════════════╝`,
                ``
            )

            if (toneCount > 0) {
                brandDNA.push(`BRAND TONE: ${activeBrandKit!.tone_of_voice.join(', ')}`)
            }
            if (aestheticCount > 0) {
                brandDNA.push(`VISUAL AESTHETIC: ${activeBrandKit!.visual_aesthetic.join(', ')}`)
            }

            brandDNA.push(
                ``,
                `⚠️  REQUIREMENT: Final image MUST feel authentically aligned with this brand universe.`,
                ``
            )
        }

        // TEXT CONTENT (Part of P9 - Mandatory)
        const textParts: string[] = []
        const headlineValue = state.headline?.trim()
        if (headlineValue && headlineValue !== NO_TEXT_TOKEN) {
            textParts.push(`• HEADLINE: "${headlineValue}"`)
        }

        const ctaValue = state.cta?.trim()
        if (ctaValue && ctaValue !== NO_TEXT_TOKEN) {
            textParts.push(`• CTA: "${ctaValue}"`)
        }

        Object.entries(state.customTexts).forEach(([id, val]) => {
            if (typeof val === 'string') {
                const cleanVal = val.trim()
                if (cleanVal && cleanVal !== NO_TEXT_TOKEN) {
                    textParts.push(`• ${id.toUpperCase()}: "${cleanVal}"`)
                }
            }
        })

        if (textParts.length > 0) {
            brandDNA.push(`MANDATORY TEXT CONTENT (NOTHING ELSE):`, ...textParts, ``)
        } else {
            brandDNA.push(`⚠️  NO TEXT PROVIDED: Image must be completely text-free.`, ``)
        }

        if (brandDNA.length > 0) {
            sections.push(...brandDNA)
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 8 - CUSTOM DIRECTOR INSTRUCTIONS
        // ═══════════════════════════════════════════════════════════════
        if (state.additionalInstructions) {
            sections.push(
                `╔═════════════════════════════════════════════════════════════════╗`,
                `║  PRIORITY 8 - DIRECTOR'S CUSTOM INSTRUCTIONS                   ║`,
                `╚═════════════════════════════════════════════════════════════════╝`,
                ``,
                `"${state.additionalInstructions}"`,
                ``,
                `⚠️  NOTE: If these contradict prior rules, these custom instructions WIN.`,
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 7 - LAYOUT & COMPOSITIONAL STRUCTURE
        // ═══════════════════════════════════════════════════════════════
        const layoutParts: string[] = [
            `╔═════════════════════════════════════════════════════════════════╗`,
            `║  PRIORITY 7 - LAYOUT & COMPOSITIONAL STRUCTURE                 ║`,
            `╚═════════════════════════════════════════════════════════════════╝`,
            ``
        ]

        if (selectedLayoutMeta) {
            if (selectedLayoutMeta.referenceImage) {
                layoutParts.push(`🖼️  REFERENCE TEMPLATE: Follow wireframe marked [REF_PLANTILLA]`)
            }

            if (selectedLayoutMeta.structuralPrompt) {
                layoutParts.push(
                    ``,
                    `--- STRUCTURAL DNA ---`,
                    selectedLayoutMeta.structuralPrompt.trim(),
                    `--- END STRUCTURAL DNA ---`,
                    ``
                )
            } else {
                layoutParts.push(`COMPOSITION: ${selectedLayoutMeta.promptInstruction}`, ``)
            }
        } else {
            layoutParts.push(
                `AI CREATIVE CONTROL: Design a professional, aesthetically pleasing composition.`,
                `• Prioritize text legibility and subject prominence`,
                `• Optimize element placement for visual balance`,
                `• Ensure premium, clutter-free aesthetic`,
                ``
            )
        }

        sections.push(...layoutParts)

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 6 - SUBJECT & VISUAL CONTEXT
        // ═══════════════════════════════════════════════════════════════
        const subjectParts: string[] = []

        if (state.visionAnalysis || (state.imageSourceMode === 'generate' && state.aiImageDescription.trim())) {
            subjectParts.push(
                `╔═════════════════════════════════════════════════════════════════╗`,
                `║  PRIORITY 6 - SUBJECT & VISUAL CONTEXT                        ║`,
                `╚═════════════════════════════════════════════════════════════════╝`,
                ``
            )

            if (state.visionAnalysis) {
                subjectParts.push(`SUBJECT: ${state.visionAnalysis.subjectLabel}`)
                if (state.visionAnalysis.keywords.length > 0) {
                    subjectParts.push(`KEYWORDS: ${state.visionAnalysis.keywords.join(', ')}`)
                }
                subjectParts.push(`LIGHTING: ${state.visionAnalysis.lighting}`, ``)
            } else if (state.imageSourceMode === 'generate' && state.aiImageDescription.trim()) {
                subjectParts.push(
                    `AI-GENERATED REFERENCE:`,
                    `Include in final composition: ${state.aiImageDescription.trim()}`,
                    ``
                )
            }
        }

        if (subjectParts.length > 0) {
            sections.push(...subjectParts)
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 5 - VISUAL STYLE & AESTHETIC
        // ═══════════════════════════════════════════════════════════════
        if (state.selectedStyles.length > 0 || state.customStyle) {
            const selectedChips = availableStyles.filter(s => state.selectedStyles.includes(s.id))
            const styleKeywords = selectedChips.flatMap(c => c.keywords)
            const allStyles = [...styleKeywords]
            if (state.customStyle) allStyles.push(state.customStyle)

            sections.push(
                `╔═════════════════════════════════════════════════════════════════╗`,
                `║  PRIORITY 5 - VISUAL STYLE & AESTHETIC                        ║`,
                `╚═════════════════════════════════════════════════════════════════╝`,
                ``,
                `STYLE DIRECTIVES: ${allStyles.join(', ')}`,
                ``,
                `⚠️  Every pixel must embody this aesthetic mood.`,
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 4 - BRAND COLORS
        // ═══════════════════════════════════════════════════════════════
        const brandColors = state.selectedBrandColors.length > 0
            ? state.selectedBrandColors
            : activeBrandKit?.colors?.filter(c => c.selected).map(c => c.color) || []

        if (brandColors.length > 0) {
            sections.push(
                `╔═════════════════════════════════════════════════════════════════╗`,
                `║  PRIORITY 4 - BRAND COLOR PALETTE                             ║`,
                `╚═════════════════════════════════════════════════════════════════╝`,
                ``,
                `COLORS: ${brandColors.join(', ')}`,
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 3 - CONTENT TYPE & INTENT
        // ═══════════════════════════════════════════════════════════════
        if (currentIntent) {
            sections.push(
                `╔═════════════════════════════════════════════════════════════════╗`,
                `║  PRIORITY 3 - CONTENT TYPE & MARKETING INTENT                 ║`,
                `╚═════════════════════════════════════════════════════════════════╝`,
                ``,
                `TYPE: ${currentIntent.name}`,
                `DESCRIPTION: ${currentIntent.description}`,
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 2 - TECHNICAL SPECIFICATIONS
        // ═══════════════════════════════════════════════════════════════
        if (state.selectedFormat) {
            const format = SOCIAL_FORMATS.find(f => f.id === state.selectedFormat)
            if (format) {
                sections.push(
                    `╔═════════════════════════════════════════════════════════════════╗`,
                    `║  PRIORITY 2 - TECHNICAL SPECIFICATIONS                        ║`,
                    `╚═════════════════════════════════════════════════════════════════╝`,
                    ``,
                    `FORMAT: ${format.name}`,
                    `ASPECT RATIO: ${format.aspectRatio}`,
                    ``
                )
            }
        }

        return sections.join('\n')
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
    // PRESETS
    // -------------------------------------------------------------------------

    const loadPreset = useCallback((presetState: Partial<GenerationState>) => {
        setState(prev => ({
            ...INITIAL_GENERATION_STATE,
            ...presetState,
            // Ensure clean technical state
            isGenerating: false,
            isAnalyzing: false,
            error: null,
            uploadedImage: null, // Presets won't carry actual image data usually, or if they do we need to handle it.
            uploadedImageFile: null,
            visionAnalysis: null, // Reset analysis
        }))
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
        setImageSourceMode,
        selectBrandKitImage,
        setAiImageDescription,
        selectTheme,
        toggleStyle,
        selectLayout,
        selectPlatform,
        selectFormat,
        selectLogo,
        setHeadline,
        setCta,
        setAdditionalInstructions,
        setRawMessage,
        setCustomStyle,
        setCustomText,
        toggleNoText,
        generateFieldCopy,
        toggleBrandColor,
        constructFinalPrompt,
        generate,
        reset,
        loadPreset,
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
