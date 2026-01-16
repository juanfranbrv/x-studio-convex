import { useState, useCallback, useMemo, useEffect } from 'react'
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
    TextAsset,
} from '@/lib/creation-flow-types'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { resizeImage } from '@/lib/image-utils'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

// Priority-based prompt construction imports
import * as P12 from '@/lib/prompts/priorities/p12-preferred-language'
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
    onReset?: () => void
}

export function useCreationFlow(options?: UseCreationFlowOptions) {
    const { activeBrandKit } = useBrandKit()
    const saveGeneration = useMutation(api.generations.saveGeneration)
    const [state, setState] = useState<GenerationState>(INITIAL_GENERATION_STATE)

    // -------------------------------------------------------------------------
    // COMPUTED VALUES (Moved to top for callback access)
    // -------------------------------------------------------------------------

    const currentIntent = useMemo(() => {
        return INTENT_CATALOG.find(i => i.id === state.selectedIntent)
    }, [state.selectedIntent])

    const requiresImage = currentIntent?.requiresImage ?? false

    // Initialize defaults from Brand Kit
    useEffect(() => {
        // Initialize with default colors if brand kit is available
        if (activeBrandKit?.colors && state.selectedBrandColors.length === 0) {
            const defaultColors = (activeBrandKit.colors as any[]).map(c => ({
                color: c.color || c.hex || (typeof c === 'string' ? c : ''),
                role: (c.role as ColorRole) || 'Principal'
            })).filter(c => c.color)

            if (defaultColors.length > 0) {
                setState(prev => ({ ...prev, selectedBrandColors: defaultColors }))
            }
        }

        // Initialize text assets from Brand Kit (CTA, Tagline, URL)
        if (activeBrandKit && state.selectedTextAssets.length === 0) {
            const defaultTextAssets: TextAsset[] = []

            // Add CTA if available
            const cta = (activeBrandKit.text_assets as any)?.ctas?.[0] || ''
            if (cta) {
                defaultTextAssets.push({ id: 'cta', type: 'cta', label: 'CTA', value: cta })
            }

            // Add Tagline if available
            if (activeBrandKit.tagline) {
                defaultTextAssets.push({ id: 'tagline', type: 'tagline', label: 'Tagline', value: activeBrandKit.tagline })
            }

            // Add URL if available
            if (activeBrandKit.url) {
                defaultTextAssets.push({ id: 'url', type: 'url', label: 'URL', value: activeBrandKit.url })
            }

            if (defaultTextAssets.length > 0) {
                setState(prev => ({ ...prev, selectedTextAssets: defaultTextAssets }))
            }
        }
    }, [activeBrandKit])

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

    const setUploadedImage = useCallback((url: string | null) => {
        setState(prev => ({ ...prev, uploadedImage: url }))
    }, [])

    const uploadImage = useCallback(async (file: File) => {
        setState(prev => ({ ...prev, isAnalyzing: true, error: null }))

        try {
            // Resize and compress image on client side to avoid 10MB payload limit
            const base64 = await resizeImage(file, {
                maxWidth: 1536,
                maxHeight: 1536,
                quality: 0.8,
                format: 'image/jpeg'
            })

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

            // Resize and compress fetched image
            const base64 = await resizeImage(file, {
                maxWidth: 1536,
                maxHeight: 1536,
                quality: 0.8,
                format: 'image/jpeg'
            })

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
            const newState = { ...prev, headline: headline || '' }
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
            const newState = { ...prev, cta: cta || '' }
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

    const setCaption = useCallback((caption: string) => {
        setState(prev => ({ ...prev, caption: caption || '' }))
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
        setState(prev => {
            const newState = {
                ...prev,
                customTexts: { ...prev.customTexts, [id]: value || '' }
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
            if (id === 'caption') return { ...prev, caption: isNoText ? '' : NO_TEXT_TOKEN } // NEW: Handle caption

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
                else if (field.id === 'caption') setCaption(result.text) // NEW: Handle caption
                else setCustomText(field.id, result.text)
            }
        } catch (error) {
            console.error('Error in generateFieldCopy:', error)
        }
    }, [activeBrandKit, state.selectedIntent, state.visionAnalysis, state.rawMessage, setHeadline, setCta, setCaption, setCustomText])

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
    // TEXT ASSETS MANAGEMENT
    // -------------------------------------------------------------------------

    const setSelectedTextAssets = useCallback((assets: TextAsset[]) => {
        setState(prev => ({ ...prev, selectedTextAssets: assets }))
    }, [])

    const addTextAsset = useCallback((asset: TextAsset) => {
        setState(prev => {
            const exists = prev.selectedTextAssets.some(a => a.id === asset.id)
            if (exists) return prev
            return { ...prev, selectedTextAssets: [...prev.selectedTextAssets, asset] }
        })
    }, [])

    const removeTextAsset = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            selectedTextAssets: prev.selectedTextAssets.filter(a => a.id !== id)
        }))
    }, [])

    const updateTextAsset = useCallback((id: string, value: string) => {
        setState(prev => ({
            ...prev,
            selectedTextAssets: prev.selectedTextAssets.map(a =>
                a.id === id ? { ...a, value } : a
            )
        }))
    }, [])

    const generateTextForField = useCallback(async (fieldType: string): Promise<string> => {
        if (!state.rawMessage) return ''

        const brandContext = activeBrandKit ? `
Marca: ${activeBrandKit.brand_name || 'Sin nombre'}
Tagline: ${activeBrandKit.tagline || 'No definido'}
Tono de voz: ${activeBrandKit.tone_of_voice?.join(', ') || 'Profesional'}
URL: ${activeBrandKit.url || 'No disponible'}
` : ''

        const fieldPrompts: Record<string, string> = {
            'cta': 'Genera un Call-to-Action (CTA) corto, persuasivo y directo (máximo 4-5 palabras). Debe incitar a la acción inmediata.',
            'tagline': 'Genera un tagline memorable y conciso (máximo 6-8 palabras) que capture la esencia de la propuesta.',
            'url': 'Sugiere un texto descriptivo corto para acompañar la URL (ej: "Visita nuestra web", "Descubre más").',
            'headline': 'Genera un titular impactante y atractivo (máximo 8-10 palabras).',
            'caption': 'Genera un pie de foto o descripción corta para redes sociales (máximo 20 palabras).', // NEW: Caption prompt
            'custom': 'Genera un texto de marketing corto y relevante (máximo 10 palabras).',
        }

        const prompt = `
Eres un experto en copywriting y marketing digital.

CONTEXTO DE LA MARCA:
${brandContext}

INTENCIÓN DEL USUARIO:
"${state.rawMessage}"

TAREA:
${fieldPrompts[fieldType] || fieldPrompts['custom']}

RESPONDE ÚNICAMENTE con el texto generado, sin comillas ni explicaciones adicionales.
`

        try {
            const response = await fetch('/api/generate-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            })

            if (!response.ok) {
                console.error('Error generating text:', response.statusText)
                return ''
            }

            const data = await response.json()
            return data.text?.trim() || ''
        } catch (error) {
            console.error('Error generating text:', error)
            return ''
        }
    }, [activeBrandKit, state.rawMessage])

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

    const buildGenerationPrompt = useCallback((): string => {
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
        // PRIORITY 12 - PREFERRED LANGUAGE ENFORCEMENT
        // ═══════════════════════════════════════════════════════════════
        const preferredLanguage = activeBrandKit?.preferred_language || 'es'
        sections.push(
            P12.PRIORITY_HEADER,
            ``,
            P12.LANGUAGE_ENFORCEMENT_INSTRUCTION(preferredLanguage),
            ``
        )

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 10 - ABSOLUTE OVERRIDE (Logo Integrity)
        // ═══════════════════════════════════════════════════════════════
        if (state.selectedLogoId && activeBrandKit?.logos) {
            const logo = activeBrandKit.logos.find((l, idx) =>
                (l as any)._id === state.selectedLogoId || `logo-${idx}` === state.selectedLogoId
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

        // Add selected text assets from Brand DNA Panel
        state.selectedTextAssets.forEach(asset => {
            if (asset.value?.trim()) {
                textParts.push(`• ${asset.label.toUpperCase()}: "${asset.value.trim()}"`)
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
        // PRIORITY 7 - COMPOSITION & LAYOUT (Dynamic from selected layout)
        // ═══════════════════════════════════════════════════════════════
        if (state.selectedLayout && state.selectedIntent) {
            // Find selected layout definition
            const intentLayouts = LAYOUTS_BY_INTENT[state.selectedIntent]
            const layoutDef = intentLayouts?.find(l => l.id === state.selectedLayout)

            if (layoutDef?.structuralPrompt) {
                sections.push(
                    `╔═════════════════════════════════════════════════════════════════╗`,
                    `║  PRIORITY 7 - COMPOSITION & LAYOUT                            ║`,
                    `╚═════════════════════════════════════════════════════════════════╝`,
                    ``,
                    layoutDef.structuralPrompt,
                    ``
                )
            }
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

            // Prioritize AI Description if we are explicitly in 'generate' mode
            const useAiDescription = state.imageSourceMode === 'generate' && state.aiImageDescription.trim()

            if (useAiDescription) {
                subjectParts.push(
                    P06.AI_GENERATED_REFERENCE_HEADER,
                    P06.AI_GENERATED_REFERENCE_INSTRUCTION(state.aiImageDescription.trim()),
                    ``
                )
            }
            // Fallback to vision analysis (from upload or brand kit) if available
            else if (state.visionAnalysis) {
                subjectParts.push(`SUBJECT: ${state.visionAnalysis.subjectLabel}`)
                if (state.visionAnalysis.keywords.length > 0) {
                    subjectParts.push(`KEYWORDS: ${state.visionAnalysis.keywords.join(', ')}`)
                }
                subjectParts.push(`LIGHTING: ${state.visionAnalysis.lighting}`, ``)
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
            // Default to brand kit colors if nothing explicitly selected in Imagen
            // Map legacy brand colors to SelectedColor format
            colorsToUse = (activeBrandKit.colors as any[]).map(c => ({
                color: c.color || c.hex || (typeof c === 'string' ? c : ''),
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
        // PRIORITY 7 - COMPOSITION & LAYOUT (Dynamic from selected layout)
        // ═══════════════════════════════════════════════════════════════
        if (state.selectedLayout && state.selectedIntent) {
            // Find selected layout definition
            const intentLayouts = LAYOUTS_BY_INTENT[state.selectedIntent]
            const layoutDef = intentLayouts?.find(l => l.id === state.selectedLayout)

            if (layoutDef?.structuralPrompt) {
                sections.push(
                    `╔═════════════════════════════════════════════════════════════════╗`,
                    `║  PRIORITY 7 - COMPOSITION & LAYOUT                            ║`,
                    `╚═════════════════════════════════════════════════════════════════╝`,
                    ``,
                    layoutDef.structuralPrompt,
                    ``
                )
            }
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
        sections.push(
            P02.PRIORITY_HEADER,
            ``,
            P02.COMPOSITION_RULES,
            ``
        )

        if (state.selectedFormat) {
            const format = SOCIAL_FORMATS.find(f => f.id === state.selectedFormat)
            if (format) {
                sections.push(
                    `FORMAT: ${format.name}`,
                    `ASPECT RATIO: ${format.aspectRatio}`,
                    ``
                )
            }
        }

        return sections.join('\n')
    }, [state, currentIntent, availableStyles, selectedLayoutMeta, activeBrandKit])

    const canGenerate = useMemo(() => {
        // Basic requirement: must have an intent
        if (!state.selectedIntent) return false;
        // Must have some form of image source or a detailed description
        const hasImageSource = !!state.uploadedImage || !!state.selectedBrandKitImageId;
        const hasEnoughVisualInfo = hasImageSource || (state.aiImageDescription && state.aiImageDescription.length > 10);
        return !!hasEnoughVisualInfo;
    }, [state.selectedIntent, state.uploadedImage, state.selectedBrandKitImageId, state.aiImageDescription])

    // -------------------------------------------------------------------------
    // GENERATION (stub for now)
    // -------------------------------------------------------------------------

    const generate = useCallback(async () => {
        setState(prev => ({ ...prev, isGenerating: true, error: null }))

        try {
            const prompt = buildGenerationPrompt()
            console.log('[CREATION FLOW] Final Prompt:\n', prompt)

            // TODO: Call actual generation API
            // For now, just log the prompt
            await new Promise(resolve => setTimeout(resolve, 1000))

            setState(prev => ({
                ...prev,
                isGenerating: false,
            }))

            // Save Generation to History (Recents)
            if (activeBrandKit?.id) {
                // Create a complete snapshot of the state (excluding File objects and transient flags)
                const stateSnapshot = {
                    // Platform & Format
                    selectedPlatform: state.selectedPlatform,
                    selectedFormat: state.selectedFormat,
                    // Intent
                    selectedGroup: state.selectedGroup,
                    selectedIntent: state.selectedIntent,
                    selectedSubMode: state.selectedSubMode,
                    // Image/Input
                    uploadedImage: state.uploadedImage, // Base64/URL string only
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

                // Persistence is handled at the page/component level (e.g. ImagePage.tsx)
                // after the actual generation is complete and we have the final URL.
                // This prevents double-saves and document size conflicts.
            }

            return prompt
        } catch (error) {
            setState(prev => ({
                ...prev,
                isGenerating: false,
                error: error instanceof Error ? error.message : 'Generation failed',
            }))
            return null
        }
    }, [buildGenerationPrompt])

    // -------------------------------------------------------------------------
    // RESET
    // -------------------------------------------------------------------------

    const setGeneratedImage = useCallback((url: string | null) => {
        setState(prev => ({ ...prev, generatedImage: url }))
    }, [])

    const reset = useCallback(() => {
        setState({ ...INITIAL_GENERATION_STATE, caption: '' }) // NEW: Reset caption
        options?.onReset?.()
    }, [options])

    // -------------------------------------------------------------------------
    // PRESETS
    // -------------------------------------------------------------------------

    const loadPreset = useCallback((presetState: Partial<GenerationState>) => {
        setState(prev => ({
            ...INITIAL_GENERATION_STATE,
            caption: '', // NEW: Ensure caption is reset for presets
            ...presetState,
            // Ensure clean technical state
            isGenerating: false,
            isAnalyzing: false,
            error: null,
            uploadedImageFile: null,
            visionAnalysis: null, // Reset analysis
        }))
    }, [])

    // -------------------------------------------------------------------------
    // RETURN
    // -------------------------------------------------------------------------

    const getStateSnapshot = useCallback(() => {
        const snapshot = {
            selectedPlatform: state.selectedPlatform,
            selectedFormat: state.selectedFormat,
            selectedGroup: state.selectedGroup,
            selectedIntent: state.selectedIntent,
            selectedSubMode: state.selectedSubMode,
            uploadedImage: state.uploadedImage,
            selectedTheme: state.selectedTheme,
            imageSourceMode: state.imageSourceMode,
            selectedBrandKitImageId: state.selectedBrandKitImageId,
            aiImageDescription: state.aiImageDescription,
            selectedStyles: state.selectedStyles,
            selectedLayout: state.selectedLayout,
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
            generatedImage: state.generatedImage,
        }

        // Safety: Strip large base64 strings (over ~50KB) to avoid Convex 1MB limit.
        // These snapshots are for restoring state; we want URLs here, not blobs.
        const stripIfLargeBase64 = (val: any) => {
            if (typeof val === 'string' && val.startsWith('data:') && val.length > 50000) {
                return null
            }
            return val
        }

        snapshot.uploadedImage = stripIfLargeBase64(snapshot.uploadedImage)
        snapshot.generatedImage = stripIfLargeBase64(snapshot.generatedImage)

        return snapshot
    }, [state])

    return {
        // State
        state,
        getStateSnapshot,
        // Computed
        currentIntent,
        requiresImage,
        availableStyles,
        availableLayouts,
        selectedLayoutMeta,
        canGenerate,
        // Actions
        selectGroup,
        setGeneratedImage,
        selectIntent,
        selectSubMode,
        uploadImage,
        setUploadedImage,
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
        setCaption, // NEW
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
        setSelectedTextAssets,
        addTextAsset,
        removeTextAsset,
        updateTextAsset,
        generateTextForField,
        buildGenerationPrompt,
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
