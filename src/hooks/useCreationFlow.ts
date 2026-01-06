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
    ColorRole,
    SelectedColor,
} from '@/lib/creation-flow-types'
import { useBrandKit } from '@/contexts/BrandKitContext'

// Priority-based prompt construction imports
import * as P11 from '@/lib/prompts/priorities/p11-system-persona'
import * as P10 from '@/lib/prompts/priorities/p10-logo-integrity'
import * as P09 from '@/lib/prompts/priorities/p09-brand-dna'
import * as P08 from '@/lib/prompts/priorities/p08-custom-instructions'
import * as P07 from '@/lib/prompts/priorities/p07-layout-structure'
import * as P06 from '@/lib/prompts/priorities/p06-subject-context'
import * as P05 from '@/lib/prompts/priorities/p05-visual-style'
import * as P04 from '@/lib/prompts/priorities/p04-brand-colors'
import * as P03 from '@/lib/prompts/priorities/p03-content-type'
import * as P02 from '@/lib/prompts/priorities/p02-technical-specs'

// Intent prompts
import * as IntentPrompts from '@/lib/prompts/intents'

export const NO_TEXT_TOKEN = '[NO_TEXT]'

export interface UseCreationFlowOptions {
    onImageUploaded?: (file: File) => void
}

export function useCreationFlow(options?: UseCreationFlowOptions) {
    const { activeBrandKit } = useBrandKit()
    const [state, setState] = useState<GenerationState>(INITIAL_GENERATION_STATE)

    // -------------------------------------------------------------------------
    // COMPUTED VALUES (Moved to top for callback access)
    // -------------------------------------------------------------------------

    const currentIntent = useMemo(() => {
        return INTENT_CATALOG.find(i => i.id === state.selectedIntent)
    }, [state.selectedIntent])

    const requiresImage = currentIntent?.requiresImage ?? false

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
            // Pre-fill mapped fields in customTexts
            customTexts: intentMeta?.requiredFields?.reduce((acc, field) => {
                if (field.mapsTo === 'headline') acc[field.id] = intentMeta.defaultHeadline || ''
                if (field.mapsTo === 'cta') acc[field.id] = intentMeta.defaultCta || ''
                return acc
            }, {} as Record<string, string>) || {},
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
        setState(prev => {
            const newState = { ...prev, headline }
            // Sync with mapped intent fields
            if (currentIntent?.requiredFields) {
                const mappedField = currentIntent.requiredFields.find(f => f.mapsTo === 'headline')
                if (mappedField) {
                    newState.customTexts = { ...newState.customTexts, [mappedField.id]: headline }
                }
            }
            return newState
        })
    }, [currentIntent])

    const setCta = useCallback((cta: string) => {
        setState(prev => {
            const newState = { ...prev, cta }
            // Sync with mapped intent fields
            if (currentIntent?.requiredFields) {
                const mappedField = currentIntent.requiredFields.find(f => f.mapsTo === 'cta')
                if (mappedField) {
                    newState.customTexts = { ...newState.customTexts, [mappedField.id]: cta }
                }
            }
            return newState
        })
    }, [currentIntent])

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
        setState(prev => {
            const newState = {
                ...prev,
                customTexts: { ...prev.customTexts, [id]: value }
            }

            // Sync back to global headline/cta if mapped
            if (currentIntent?.requiredFields) {
                const field = currentIntent.requiredFields.find(f => f.id === id)
                if (field?.mapsTo === 'headline') newState.headline = value
                if (field?.mapsTo === 'cta') newState.cta = value
            }

            return newState
        })
    }, [currentIntent])

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

    const generateCustomFieldCopy = useCallback(async (fieldId: string) => {
        if (!activeBrandKit || !state.selectedIntent || !currentIntent?.requiredFields) return

        const field = currentIntent.requiredFields.find(f => f.id === fieldId)
        if (!field) return

        try {
            const result = await getAICopy({
                brandName: activeBrandKit.brand_name,
                brandDNA: activeBrandKit,
                intent: state.selectedIntent,
                visionAnalysis: state.visionAnalysis,
                fieldLabel: field.label,
                fieldDescription: field.aiContext,
                rawMessage: state.rawMessage || undefined
            })

            if (result.success && result.text) {
                setCustomText(fieldId, result.text)
            }
        } catch (error) {
            console.error('Error in generateCustomFieldCopy:', error)
        }
    }, [activeBrandKit, state.selectedIntent, currentIntent, state.visionAnalysis, state.rawMessage, setCustomText])

    const toggleBrandColor = useCallback((color: string) => {
        setState(prev => {
            const index = prev.selectedBrandColors.findIndex(c => c.color.toLowerCase() === color.toLowerCase())
            const roles: ColorRole[] = ['Principal', 'Secundario', 'Texto', 'Fondo', 'Acento', 'Neutral']

            if (index === -1) {
                // Not selected: add with default role (Principal)
                return {
                    ...prev,
                    selectedBrandColors: [...prev.selectedBrandColors, { color, role: 'Principal' }]
                }
            } else {
                // Already selected: cycle roles or remove if it was neutral
                const currentRole = prev.selectedBrandColors[index].role
                const roleIndex = roles.indexOf(currentRole)

                if (roleIndex === roles.length - 1) {
                    // It was neutral, remove it
                    return {
                        ...prev,
                        selectedBrandColors: prev.selectedBrandColors.filter(c => c.color.toLowerCase() !== color.toLowerCase())
                    }
                } else {
                    // Cycle to next role
                    const newColors = [...prev.selectedBrandColors]
                    newColors[index] = { ...newColors[index], role: roles[roleIndex + 1] }
                    return {
                        ...prev,
                        selectedBrandColors: newColors
                    }
                }
            }
        })
    }, [])

    const removeBrandColor = useCallback((color: string) => {
        setState(prev => ({
            ...prev,
            selectedBrandColors: prev.selectedBrandColors.filter(c => c.color.toLowerCase() !== color.toLowerCase())
        }))
    }, [])

    const addCustomColor = useCallback((color: string) => {
        // Basic hex validation
        if (!/^#[0-9A-F]{6}$/i.test(color)) return

        setState(prev => {
            const exists = prev.selectedBrandColors.some(c => c.color.toLowerCase() === color.toLowerCase())
            if (exists) return prev
            return {
                ...prev,
                selectedBrandColors: [...prev.selectedBrandColors, { color, role: 'Principal' }]
            }
        })
    }, [])

    // -------------------------------------------------------------------------
    // COMPUTED VALUES
    // -------------------------------------------------------------------------


    const availableStyles = useMemo(() => {
        const combinedStyles: Array<{ id: string; label: string; icon: string; keywords: string[]; category: string }> = []

        // 1. BRAND KIT STYLES (Priority)
        if (activeBrandKit) {
            // Add visual_aesthetic entries
            const aesthetics = activeBrandKit.visual_aesthetic || []
            aesthetics.forEach((style, i) => {
                combinedStyles.push({
                    id: `brand_aesthetic_${i}`,
                    label: style,
                    icon: '💼', // Briefcase for Brand
                    keywords: [style.toLowerCase()],
                    category: 'brand'
                })
            })

            // EXCLUDED: visual_keywords (to keep the list focused on aesthetics)
        }

        // 2. DYNAMIC SUGGESTIONS FROM VISION ANALYSIS (Top 4 Keywords)
        if (state.visionAnalysis && state.visionAnalysis.keywords) {
            // Take up to 4 keywords from the analysis
            const topKeywords = state.visionAnalysis.keywords.slice(0, 4)

            topKeywords.forEach((keyword, i) => {
                // Ensure we don't duplicate if it's already in brand styles
                if (!combinedStyles.some(s => s.label.toLowerCase() === keyword.toLowerCase())) {
                    combinedStyles.push({
                        id: `suggested_vision_${i}`,
                        label: keyword.charAt(0).toUpperCase() + keyword.slice(1), // Capitalize
                        icon: '✨', // Sparkles for AI
                        keywords: [keyword.toLowerCase()],
                        category: 'suggested'
                    })
                }
            })
        }

        // 3. FALLBACK: If no analysis, show general defaults is NOT desired by user.
        // User strictly wants Brand + Analysis.

        return combinedStyles
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
        // PRIORITY 11 - SYSTEM PERSONA
        // ═══════════════════════════════════════════════════════════════
        sections.push(
            P11.PRIORITY_HEADER,
            ``,
            P11.SYSTEM_PERSONA_INSTRUCTION,
            ``
        )

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 10 - ABSOLUTE OVERRIDE (Logo Integrity)
        // ═══════════════════════════════════════════════════════════════
        if (state.selectedLogoId && activeBrandKit?.logos) {
            const logo = activeBrandKit.logos.find((l, idx) =>
                (l as any).id === state.selectedLogoId || `logo-${idx}` === state.selectedLogoId
            )
            if (logo) {
                sections.push(
                    P10.PRIORITY_HEADER,
                    ``,
                    P10.LOGO_INTEGRITY_INTRO,
                    ``,
                    P10.LOGO_INTEGRITY_RULES,
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

        if (toneCount > 0) {
            brandDNA.push(
                P09.PRIORITY_HEADER,
                ``
            )

            brandDNA.push(`BRAND TONE: ${activeBrandKit!.tone_of_voice.join(', ')}`)

            brandDNA.push(
                ``,
                P09.BRAND_DNA_REQUIREMENT,
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
            // Support strings or arrays (greedy parser sometimes returns arrays)
            const stringVal = Array.isArray(val) ? val.join(', ') : String(val ?? '')
            const cleanVal = stringVal.trim()

            if (cleanVal && cleanVal !== 'undefined' && cleanVal !== 'null') {
                // Filter out what is already mapped to headline/cta
                const fieldMeta = currentIntent?.requiredFields?.find(f => f.id === id)
                if (fieldMeta?.mapsTo) return

                const displayLabel = fieldMeta?.label || id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                textParts.push(`• ${displayLabel}: "${cleanVal}"`)
            }
        })

        if (textParts.length > 0) {
            brandDNA.push(P09.MANDATORY_TEXT_HEADER, ...textParts, ``)
        } else if (state.rawMessage) {
            brandDNA.push(P09.MANDATORY_TEXT_HEADER, `(No explícitos, extraer de la INTENCIÓN ORIGINAL)`, ``)
        } else {
            brandDNA.push(P09.NO_TEXT_WARNING, ``)
        }

        if (state.rawMessage) {
            brandDNA.push(`USER ORIGINAL INTENTION / RAW CONTEXT:`, `"${state.rawMessage}"`, ``)
        }

        if (brandDNA.length > 0) {
            sections.push(...brandDNA)
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 8 - CUSTOM DIRECTOR INSTRUCTIONS
        // ═══════════════════════════════════════════════════════════════
        if (state.additionalInstructions) {
            sections.push(
                P08.PRIORITY_HEADER,
                ``,
                `"${state.additionalInstructions}"`,
                ``,
                P08.OVERRIDE_NOTE,
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 7 - LAYOUT & COMPOSITIONAL STRUCTURE (TEMPORARILY DISABLED)
        // ═══════════════════════════════════════════════════════════════
        // COMMENTED OUT TO TEST INTENT PROMPTS EXCLUSIVELY
        /*
        const layoutParts: string[] = [
            P07.PRIORITY_HEADER,
            ``
        ]

        if (selectedLayoutMeta) {
            // If there's a reference template image for this layout, mention it
            if (selectedLayoutMeta.referenceImage) {
                layoutParts.push(P07.REFERENCE_TEMPLATE_NOTE)
            }

            if (selectedLayoutMeta.structuralPrompt) {
                layoutParts.push(
                    ``,
                    P07.STRUCTURAL_DNA_START,
                    selectedLayoutMeta.structuralPrompt.trim(),
                    P07.STRUCTURAL_DNA_END,
                    ``
                )
            } else {
                // Layouts without a prompt still exist to track the reference image
            }
        } else {
            layoutParts.push(
                P07.AI_CREATIVE_CONTROL,
                ``
            )
        }

        sections.push(...layoutParts)
        */

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 6 - SUBJECT & VISUAL CONTEXT
        // ═══════════════════════════════════════════════════════════════
        const subjectParts: string[] = []

        if (state.visionAnalysis || (state.imageSourceMode === 'generate' && state.aiImageDescription.trim())) {
            subjectParts.push(
                P06.PRIORITY_HEADER,
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
                    P06.AI_GENERATED_REFERENCE_HEADER,
                    P06.AI_GENERATED_REFERENCE_INSTRUCTION(state.aiImageDescription.trim()),
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
                P05.PRIORITY_HEADER,
                ``,
                `STYLE DIRECTIVES: ${allStyles.join(', ')}`,
                ``,
                P05.STYLE_REQUIREMENT,
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 4 - BRAND COLOR PALETTE (with explicit roles)
        // ═══════════════════════════════════════════════════════════════
        const hasSelectedColors = state.selectedBrandColors.length > 0

        let colorsToUse: SelectedColor[] = []

        if (hasSelectedColors) {
            colorsToUse = state.selectedBrandColors
        } else if (activeBrandKit?.colors) {
            // Default to brand kit colors if nothing explicitly selected in Studio
            // Map legacy brand colors to SelectedColor format
            colorsToUse = (activeBrandKit.colors as any[]).map(c => ({
                color: c.hex || (typeof c === 'string' ? c : ''),
                role: (c.role as ColorRole) || 'Principal'
            })).filter(c => c.color)
        }

        if (colorsToUse.length > 0) {
            sections.push(P04.PRIORITY_HEADER) // P31 is alias for P4 in this file? Wait, check imports.
            sections.push(`Below is the STRICT color palette for this generation. Use these specific values and respect their assigned semantic roles:`)
            sections.push(``)

            // Group by role for better AI clarity
            const roles: ColorRole[] = ['Principal', 'Secundario', 'Texto', 'Fondo', 'Acento', 'Neutral']
            roles.forEach(role => {
                const group = colorsToUse.filter(c => c.role === role)
                if (group.length > 0) {
                    const label = (P04.ROLE_LABELS as any)[role] || role.toUpperCase()
                    sections.push(`### ${label}`)
                    group.forEach(c => {
                        sections.push(`- ${c.color}`)
                    })
                    sections.push(``)
                }
            })

            sections.push(P04.COLOR_USAGE_GUIDELINES)
            sections.push(``)
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 3 - CONTENT TYPE & MARKETING INTENT
        // ═══════════════════════════════════════════════════════════════
        if (currentIntent) {
            const intentPromptKey = `${currentIntent.id.toUpperCase()}_PROMPT`
            const intentPrompt = (IntentPrompts as any)[intentPromptKey]

            sections.push(
                P03.PRIORITY_HEADER,
                ``,
                `TYPE: ${currentIntent.name}`,
                `DESCRIPTION: ${currentIntent.description}`,
                ``
            )

            if (intentPrompt) {
                sections.push(
                    `--- INTENT COMPOSITION GUIDELINES ---`,
                    intentPrompt,
                    `--- END INTENT GUIDELINES ---`,
                    ``
                )
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 2 - TECHNICAL SPECIFICATIONS
        // ═══════════════════════════════════════════════════════════════
        if (state.selectedFormat) {
            const format = SOCIAL_FORMATS.find(f => f.id === state.selectedFormat)
            if (format) {
                sections.push(
                    P02.PRIORITY_HEADER,
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
        onGenerateCustomFieldCopy: generateCustomFieldCopy,
        toggleBrandColor,
        removeBrandColor,
        addCustomColor,
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
