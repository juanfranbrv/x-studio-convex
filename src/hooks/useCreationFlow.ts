import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
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
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

// Priority-based prompt construction imports
import * as P12 from '@/lib/prompts/priorities/p12-preferred-language'
import { detectLanguage } from '@/lib/language-detection'
import * as P11 from '@/lib/prompts/priorities/p11-system-persona'
import * as P10 from '@/lib/prompts/priorities/p10-logo-integrity'
import { P10B } from '@/lib/prompts/priorities/p10b-secondary-logos'
import * as P09 from '@/lib/prompts/priorities/p09-brand-dna'
import { P09B } from '@/lib/prompts/priorities/p09b-cta-url-hierarchy'
import * as P08 from '@/lib/prompts/priorities/p08-custom-instructions'
import * as P07 from '@/lib/prompts/priorities/p07-layout-structure'
import * as P06 from '@/lib/prompts/priorities/p06-subject-context'
import { P06B } from '@/lib/prompts/priorities/p06b-ai-image-description'
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
    const aiConfig = useQuery(api.settings.getAIConfig)
    const [state, setState] = useState<GenerationState>(INITIAL_GENERATION_STATE)
    const optionsRef = useRef(options)

    // Keep options reference up to date to avoid stale closures in callbacks
    useEffect(() => {
        optionsRef.current = options
    }, [options])

    // -------------------------------------------------------------------------
    // COMPUTED VALUES (Moved to top for callback access)
    // -------------------------------------------------------------------------

    const currentIntent = useMemo(() => {
        return INTENT_CATALOG.find(i => i.id === state.selectedIntent)
    }, [state.selectedIntent])

    const requiresImage = currentIntent?.requiresImage ?? false

    // Initialize defaults from Brand Kit & AI Config
    useEffect(() => {
        if (aiConfig) {
            console.log('🔄 [CreationFlow] AI Config Loaded:', aiConfig)
            setState(prev => ({
                ...prev,
                selectedImageModel: aiConfig.imageModel,
                selectedIntelligenceModel: aiConfig.intelligenceModel
            }))
        }
    }, [aiConfig])

    // Track last initialized brand kit to allow re-syncing when it changes
    const [lastInitBrandId, setLastInitBrandId] = useState<string | null>(null)
    // Track if we've done the initial Brand Kit load in this component lifecycle
    const hasInitializedBrandKit = useRef(false)

    // Initialize defaults from Brand Kit (Colors and Text Assets)
    useEffect(() => {
        const brandId = activeBrandKit?.id || (activeBrandKit as any)?._id
        if (!activeBrandKit || !brandId) return

        // CONDITIONS TO RUN INITIALIZATION:
        // 1. First time for this brand ID (brandId !== lastInitBrandId)
        // 2. We haven't initialized yet (hasInitializedBrandKit.current === false)
        // 3. RETRY STRATEGY: If current selected colors are empty, but the brand kit HAS colors, 
        //    it likely means previous init failed or data wasn't ready. We should retry.
        //    (We check if state.selectedBrandColors is empty to avoid overwriting user edits, 
        //    but we prioritize showing *something* over showing nothing)

        const shouldInit =
            brandId !== lastInitBrandId ||
            !hasInitializedBrandKit.current ||
            (state.selectedBrandColors.length === 0 && activeBrandKit.colors && activeBrandKit.colors.length > 0)

        if (!shouldInit) return

        console.log(`[useCreationFlow] Initializing defaults for Brand Kit: ${brandId}`)
        const nextState: Partial<GenerationState> = {}
        let hasChanges = false

        // 1. Initialize Colors - Refresh whenever the brand kit changes or if we have none selected
        if (activeBrandKit.colors && activeBrandKit.colors.length > 0) {
            const defaultColors = (activeBrandKit.colors as any[]).map(c => {
                const rawRole = ((c.role as string) || 'Acento').trim().toUpperCase()
                let role: ColorRole = 'Acento'

                if (rawRole.includes('TEXT')) role = 'Texto'
                else if (rawRole.includes('FOND')) role = 'Fondo'
                else if (rawRole.includes('ACENT')) role = 'Acento'

                // Robust hex extraction
                const hex = (c.color || c.hex || (typeof c === 'string' ? c : '')).toLowerCase()

                return {
                    color: hex,
                    role
                }
            }).filter(c => c.color && c.color !== '#')

            if (defaultColors.length > 0) {
                // Determine if we should overwrite. 
                // If we are switching brands (brandId !== lastInitBrandId), ALWAYS overwrite.
                // If we are just retrying (state.selectedBrandColors.length === 0), overwrite.

                nextState.selectedBrandColors = defaultColors
                hasChanges = true
            }
        }

        // 2. Initialize Text Assets (Only if switching brands or specific retry)
        // We generally preserve text assets if just fixing colors, but to be safe/simple, we re-init if brand changes
        if (brandId !== lastInitBrandId || !hasInitializedBrandKit.current) {
            const defaultTextAssets: TextAsset[] = []
            if (activeBrandKit.tagline) {
                defaultTextAssets.push({ id: 'tagline', type: 'tagline', label: 'Tagline', value: activeBrandKit.tagline })
            }

            if (defaultTextAssets.length > 0) {
                nextState.selectedTextAssets = defaultTextAssets
                hasChanges = true
            }

            // 3. Initialize Logo - Always default to first logo when switching brands
            if (activeBrandKit.logos && (activeBrandKit.logos as any[]).length > 0) {
                nextState.selectedLogoId = 'logo-0'
                hasChanges = true
            }
        }

        if (hasChanges) {
            console.log('[useCreationFlow] Applying initial state changes:', Object.keys(nextState))
            setState(prev => ({ ...prev, ...nextState }))
        }

        setLastInitBrandId(brandId)
        hasInitializedBrandKit.current = true
    }, [activeBrandKit, lastInitBrandId, state.selectedBrandColors.length])

    // -------------------------------------------------------------------------
    // CRITICAL: SEQUENTIAL FLOW ENFORCER
    // -------------------------------------------------------------------------
    // This effect acts as a safety net to prevent "ghost" steps from appearing.
    // If the step count is high but the required selections for previous steps
    // are missing, it forcefully pulls the step count back.
    useEffect(() => {
        let correctedStep = state.currentStep

        // If at Step 3 (Format) or higher, we MUST have a Layout (Step 2)
        if (state.currentStep > 2 && !state.selectedLayout) {
            correctedStep = 2
        }
        // If at Step 4 (Image) or higher, we MUST have a Format (Step 3)
        // (Note: Format requires Platform, so checking Format is enough)
        else if (state.currentStep > 3 && (!state.selectedFormat || !state.selectedPlatform)) {
            correctedStep = 3
        }

        if (correctedStep !== state.currentStep) {
            console.warn(`[FlowEnforcer] Correcting invalid step: ${state.currentStep} -> ${correctedStep}`)
            setState(prev => ({ ...prev, currentStep: correctedStep }))
        }
    }, [state.currentStep, state.selectedLayout, state.selectedFormat, state.selectedPlatform])


    // -------------------------------------------------------------------------
    // STEP MANAGEMENT
    // -------------------------------------------------------------------------

    const setStep = useCallback((step: number) => {
        setState(prev => ({ ...prev, currentStep: step }))
    }, [])

    const nextStep = useCallback(() => {
        setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))
    }, [])

    const prevStep = useCallback(() => {
        setState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }))
    }, [])

    // -------------------------------------------------------------------------
    // STEP 0: Platform and Format Selection
    // -------------------------------------------------------------------------

    const selectPlatform = useCallback((platform: SocialPlatform) => {
        // When platform changes, auto-select the first available format for that platform
        const firstFormat = SOCIAL_FORMATS.find(f => f.platform === platform)
        setState(prev => ({
            ...prev,
            selectedPlatform: platform,
            selectedFormat: firstFormat?.id || null,
            generatedImage: null,
            currentStep: firstFormat ? 4 : prev.currentStep
        }))
    }, [])

    const selectFormat = useCallback((formatId: string) => {
        setState(prev => ({ ...prev, selectedFormat: formatId, generatedImage: null, currentStep: 4 })) // Auto-advance to Step 4 (Image Reference)
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
        // Auto-select the first layout (Libre) for this intent
        const intentLayouts = LAYOUTS_BY_INTENT[intent] || DEFAULT_LAYOUTS
        const defaultLayoutId = intentLayouts.length > 0 ? intentLayouts[0].id : null

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
            uploadedImages: [],
            uploadedImageFiles: [],
            selectedTheme: null,
            visionAnalysis: null,
            firstVisionAnalysis: null,
            firstReferenceId: null,
            firstReferenceSource: null,
            selectedStyles: [],
            selectedLayout: null, // FORCE USER TO SELECT LAYOUT. Do not auto-select.
            generatedImage: null,
            hasGeneratedImage: false,

            // CRITICAL: Clear all downstream step data to enforce sequential flow
            selectedFormat: null,
            selectedPlatform: null,

            currentStep: 2, // Auto-advance to Step 2 (Composition/Layout)
        }))
    }, [])

    const selectSubMode = useCallback((subMode: string) => {
        setState(prev => ({ ...prev, selectedSubMode: subMode, generatedImage: null }))
    }, [])

    // -------------------------------------------------------------------------
    // STEP 2: Image Upload or Theme Selection
    // -------------------------------------------------------------------------

    const MAX_REFERENCE_IMAGES = 10

    const pickFirstReference = (uploadedImages: string[], brandKitIds: string[]) => {
        if (uploadedImages.length > 0) {
            return { id: uploadedImages[0], source: 'upload' as const }
        }
        if (brandKitIds.length > 0) {
            return { id: brandKitIds[0], source: 'brandkit' as const }
        }
        return { id: null, source: null }
    }

    const analyzeImageBase64 = useCallback(async (base64: string, mimeType: string) => {
        try {
            const response = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: base64,
                    mimeType,
                }),
            })

            const result = await response.json()

            if (result.success && result.data) {
                setState(prev => ({
                    ...prev,
                    visionAnalysis: result.data,
                    firstVisionAnalysis: prev.firstVisionAnalysis || result.data,
                    isAnalyzing: false,
                }))
            } else {
                throw new Error(result.error || 'Vision analysis failed')
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isAnalyzing: false,
                error: error instanceof Error ? error.message : 'Vision analysis failed',
            }))
        }
    }, [])

    const analyzeImageFromUrl = useCallback(async (url: string) => {
        setState(prev => ({ ...prev, isAnalyzing: true, error: null, generatedImage: null }))
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], 'image_from_kit.png', { type: blob.type })

            const base64 = await resizeImage(file, {
                maxWidth: 1536,
                maxHeight: 1536,
                quality: 0.8,
                format: 'image/jpeg'
            })

            await analyzeImageBase64(base64, blob.type || 'image/jpeg')
        } catch (error) {
            setState(prev => ({
                ...prev,
                isAnalyzing: false,
                error: error instanceof Error ? error.message : 'Error processing image from kit',
            }))
        }
    }, [analyzeImageBase64])

    useEffect(() => {
        if (!state.firstReferenceId || state.firstVisionAnalysis || state.isAnalyzing) return

        if (state.firstReferenceSource === 'upload') {
            if (!state.firstReferenceId.startsWith('data:')) return
            setState(prev => ({ ...prev, isAnalyzing: true, error: null }))
            const match = /^data:([^;]+);base64,/.exec(state.firstReferenceId)
            const mimeType = match?.[1] || 'image/jpeg'
            analyzeImageBase64(state.firstReferenceId, mimeType)
            return
        }

        if (state.firstReferenceSource === 'brandkit') {
            setState(prev => ({ ...prev, isAnalyzing: true, error: null }))
            analyzeImageFromUrl(state.firstReferenceId)
        }
    }, [state.firstReferenceId, state.firstReferenceSource, state.firstVisionAnalysis, state.isAnalyzing, analyzeImageBase64, analyzeImageFromUrl])

    // Add an uploaded image (max 10 total across sources)
    const addUploadedImage = useCallback((url: string) => {
        setState(prev => {
            const totalImages = prev.uploadedImages.length + prev.selectedBrandKitImageIds.length
            if (totalImages >= MAX_REFERENCE_IMAGES) return prev
            if (prev.uploadedImages.includes(url)) return prev
            const shouldSetFirst = !prev.firstReferenceId
            return {
                ...prev,
                uploadedImages: [...prev.uploadedImages, url],
                currentStep: Math.max(prev.currentStep, 6),
                firstReferenceId: shouldSetFirst ? url : prev.firstReferenceId,
                firstReferenceSource: shouldSetFirst ? 'upload' : prev.firstReferenceSource,
                firstVisionAnalysis: shouldSetFirst ? null : prev.firstVisionAnalysis,
                visionAnalysis: shouldSetFirst ? null : prev.visionAnalysis
            }
        })
    }, [])

    // Remove an uploaded image by URL
    const removeUploadedImage = useCallback((url: string) => {
        setState(prev => {
            const nextUploadedImages = prev.uploadedImages.filter(u => u !== url)
            const nextUploadedFiles = prev.uploadedImageFiles.filter((_, i) => prev.uploadedImages[i] !== url)
            const removingFirst = prev.firstReferenceSource === 'upload' && prev.firstReferenceId === url

            let nextFirstId = prev.firstReferenceId
            let nextFirstSource = prev.firstReferenceSource

            if (removingFirst) {
                nextFirstId = null
                nextFirstSource = null
            }

            if (!nextFirstId) {
                const picked = pickFirstReference(nextUploadedImages, prev.selectedBrandKitImageIds)
                nextFirstId = picked.id
                nextFirstSource = picked.source
            }

            const resetAnalysis = removingFirst || nextFirstId !== prev.firstReferenceId

            return {
                ...prev,
                uploadedImages: nextUploadedImages,
                uploadedImageFiles: nextUploadedFiles,
                firstReferenceId: nextFirstId,
                firstReferenceSource: nextFirstSource,
                firstVisionAnalysis: resetAnalysis ? null : prev.firstVisionAnalysis,
                visionAnalysis: resetAnalysis ? null : prev.visionAnalysis
            }
        })
    }, [])

    // Clear all uploaded images
    const clearUploadedImages = useCallback(() => {
        setState(prev => {
            const nextUploadedImages: string[] = []
            const nextUploadedFiles: File[] = []
            let nextFirstId = prev.firstReferenceId
            let nextFirstSource = prev.firstReferenceSource

            if (prev.firstReferenceSource === 'upload') {
                nextFirstId = null
                nextFirstSource = null
            }

            if (!nextFirstId) {
                const picked = pickFirstReference(nextUploadedImages, prev.selectedBrandKitImageIds)
                nextFirstId = picked.id
                nextFirstSource = picked.source
            }

            const resetAnalysis = prev.firstReferenceSource === 'upload' || nextFirstId !== prev.firstReferenceId

            return {
                ...prev,
                uploadedImages: nextUploadedImages,
                uploadedImageFiles: nextUploadedFiles,
                visionAnalysis: resetAnalysis ? null : prev.visionAnalysis,
                firstVisionAnalysis: resetAnalysis ? null : prev.firstVisionAnalysis,
                firstReferenceId: nextFirstId,
                firstReferenceSource: nextFirstSource
            }
        })
    }, [])

    const uploadImage = useCallback(async (file: File) => {
        const currentTotal = state.uploadedImages.length + state.selectedBrandKitImageIds.length
        if (currentTotal >= MAX_REFERENCE_IMAGES) {
            console.warn('Max reference images reached')
            return
        }

        setState(prev => ({ ...prev, isAnalyzing: true, error: null, generatedImage: null }))

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
                uploadedImages: [...prev.uploadedImages, base64],
                uploadedImageFiles: [...prev.uploadedImageFiles, file],
                currentStep: 6, // Auto-advance to Step 6 (Brand) after upload
                firstReferenceId: prev.firstReferenceId || base64,
                firstReferenceSource: prev.firstReferenceSource || 'upload'
            }))

            if (optionsRef.current?.onImageUploaded) {
                optionsRef.current.onImageUploaded(file)
            }

            await analyzeImageBase64(base64, file.type || 'image/jpeg')
        } catch (error) {
            setState(prev => ({
                ...prev,
                isAnalyzing: false,
                error: error instanceof Error ? error.message : 'Error analyzing image',
            }))
        }
    }, [state.uploadedImages.length, state.selectedBrandKitImageIds.length, analyzeImageBase64]) // Added dependencies

    const selectTheme = useCallback((theme: SeasonalTheme) => {
        const themeMeta = THEME_CATALOG.find(t => t.id === theme)
        setState(prev => ({
            ...prev,
            selectedTheme: theme,
            generatedImage: null,
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
        setState(prev => ({ ...prev, isAnalyzing: true, error: null, generatedImage: null }))
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
                    firstVisionAnalysis: prev.firstVisionAnalysis || result.data,
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
            uploadedImages: [],
            uploadedImageFiles: [],
            visionAnalysis: null,
            firstVisionAnalysis: null,
            firstReferenceId: null,
            firstReferenceSource: null,
            selectedStyles: [],
            selectedLayout: null,
        }))
    }, [])



    // -------------------------------------------------------------------------
    // Image Source Mode Selection
    // -------------------------------------------------------------------------

    const setImageSourceMode = useCallback((mode: 'upload' | 'brandkit' | 'generate') => {
        setState(prev => ({ ...prev, imageSourceMode: mode, generatedImage: null }))
    }, [])

    // Toggle selection of a brand kit image (multi-select, max 10 total)
    const toggleBrandKitImage = useCallback((imageId: string) => {
        setState(prev => {
            const isSelected = prev.selectedBrandKitImageIds.includes(imageId)
            if (isSelected) {
                // Remove from selection
                const nextBrandKitIds = prev.selectedBrandKitImageIds.filter(id => id !== imageId)
                const removingFirst = prev.firstReferenceSource === 'brandkit' && prev.firstReferenceId === imageId

                let nextFirstId = prev.firstReferenceId
                let nextFirstSource = prev.firstReferenceSource

                if (removingFirst) {
                    nextFirstId = null
                    nextFirstSource = null
                }

                if (!nextFirstId) {
                    const picked = pickFirstReference(prev.uploadedImages, nextBrandKitIds)
                    nextFirstId = picked.id
                    nextFirstSource = picked.source
                }

                const resetAnalysis = removingFirst || nextFirstId !== prev.firstReferenceId

                return {
                    ...prev,
                    selectedBrandKitImageIds: nextBrandKitIds,
                    generatedImage: null,
                    firstReferenceId: nextFirstId,
                    firstReferenceSource: nextFirstSource,
                    firstVisionAnalysis: resetAnalysis ? null : prev.firstVisionAnalysis,
                    visionAnalysis: resetAnalysis ? null : prev.visionAnalysis
                }
            } else {
                // Add to selection (if under limit)
                const totalImages = prev.uploadedImages.length + prev.selectedBrandKitImageIds.length
                if (totalImages >= MAX_REFERENCE_IMAGES) return prev
                const shouldSetFirst = !prev.firstReferenceId
                return {
                    ...prev,
                    selectedBrandKitImageIds: [...prev.selectedBrandKitImageIds, imageId],
                    generatedImage: null,
                    currentStep: Math.max(prev.currentStep, 6),
                    firstReferenceId: shouldSetFirst ? imageId : prev.firstReferenceId,
                    firstReferenceSource: shouldSetFirst ? 'brandkit' : prev.firstReferenceSource,
                    firstVisionAnalysis: shouldSetFirst ? null : prev.firstVisionAnalysis,
                    visionAnalysis: shouldSetFirst ? null : prev.visionAnalysis
                }
            }
        })
    }, [])

    // Clear all brand kit image selections
    const clearBrandKitImages = useCallback(() => {
        setState(prev => {
            const nextBrandKitIds: string[] = []
            let nextFirstId = prev.firstReferenceId
            let nextFirstSource = prev.firstReferenceSource

            if (prev.firstReferenceSource === 'brandkit') {
                nextFirstId = null
                nextFirstSource = null
            }

            if (!nextFirstId) {
                const picked = pickFirstReference(prev.uploadedImages, nextBrandKitIds)
                nextFirstId = picked.id
                nextFirstSource = picked.source
            }

            const resetAnalysis = prev.firstReferenceSource === 'brandkit' || nextFirstId !== prev.firstReferenceId

            return {
                ...prev,
                selectedBrandKitImageIds: nextBrandKitIds,
                generatedImage: null,
                firstReferenceId: nextFirstId,
                firstReferenceSource: nextFirstSource,
                firstVisionAnalysis: resetAnalysis ? null : prev.firstVisionAnalysis,
                visionAnalysis: resetAnalysis ? null : prev.visionAnalysis
            }
        })
    }, [])

    const setAiImageDescription = useCallback((description: string) => {
        setState(prev => ({ ...prev, aiImageDescription: description, generatedImage: null }))
    }, [])

    // -------------------------------------------------------------------------
    // STEP 3: Style Selection
    // -------------------------------------------------------------------------

    const toggleStyle = useCallback((styleId: string) => {
        setState(prev => {
            const isSelected = prev.selectedStyles.includes(styleId)
            // Mutually exclusive: If selecting a new one, clear previous ones.
            // If deselecting the current one, just clear.
            const newStyles = isSelected ? [] : [styleId]

            return {
                ...prev,
                selectedStyles: newStyles,
                generatedImage: null, // Invalidate to force new generation
                currentStep: newStyles.length > 0 ? 6 : prev.currentStep // Auto-advance to Step 6 (Texts) if style selected
            }
        })
    }, [])

    // -------------------------------------------------------------------------
    // STEP 4: Layout Selection
    // -------------------------------------------------------------------------

    const selectLayout = useCallback((layoutId: string) => {
        setState(prev => ({ ...prev, selectedLayout: layoutId, generatedImage: null, currentStep: 3 })) // Auto-advance to Step 3 (Format)
    }, [])

    // -------------------------------------------------------------------------
    // STEP 5: Final Format Selection
    // -------------------------------------------------------------------------

    // (Moved to Step 0)

    // -------------------------------------------------------------------------
    // STEP 5: Branding Configuration
    // -------------------------------------------------------------------------

    const selectLogo = useCallback((logoId: string | null) => {
        setState(prev => ({ ...prev, selectedLogoId: logoId, generatedImage: null }))
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

    const setCtaUrl = useCallback((url: string) => {
        setState(prev => ({ ...prev, ctaUrl: url || '' }))
    }, [])

    const setAdditionalInstructions = useCallback((instructions: string) => {
        setState(prev => ({ ...prev, additionalInstructions: instructions }))
    }, [])

    const setRawMessage = useCallback((message: string) => {
        setState(prev => ({ ...prev, rawMessage: message }))
    }, [])

    const setCustomStyle = useCallback((style: string) => {
        setState(prev => ({
            ...prev,
            customStyle: style,
            generatedImage: null,
            currentStep: style.trim() ? Math.max(prev.currentStep, 6) : prev.currentStep
        }))
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
                },
                generatedImage: null,
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

    const toggleBrandColor = useCallback((color: string, forceRole?: ColorRole) => {
        console.log('[useCreationFlow] toggleBrandColor called with:', color)
        setState(prev => {
            const normalizedColor = color.startsWith('#') ? color.toLowerCase() : `#${color.toLowerCase()}`
            // Sequence: Acento -> Texto -> Fondo -> Deseleccionar
            const roles: ColorRole[] = ['Acento', 'Texto', 'Fondo']
            const index = prev.selectedBrandColors.findIndex(c => c.color.toLowerCase() === normalizedColor)

            if (index === -1) {
                // First click: Add as Acento (or forced role if provided)
                return {
                    ...prev,
                    selectedBrandColors: [...prev.selectedBrandColors, { color: normalizedColor, role: forceRole || 'Acento' }],
                    generatedImage: null
                }
            } else {
                // Already selected: cycle roles or remove
                const currentRole = prev.selectedBrandColors[index].role

                // If forceRole is provided and it's the same, it means we might want to deselect or just keep it.
                // But for now, let's keep the cycling logic if no forceRole is given.
                if (forceRole) {
                    const newColors = [...prev.selectedBrandColors]
                    newColors[index] = { ...newColors[index], role: forceRole }
                    return { ...prev, selectedBrandColors: newColors, generatedImage: null }
                }

                const roleIndex = roles.indexOf(currentRole)

                // Sequence: Non-standard -> Acento (0) -> Texto (1) -> Fondo (2) -> Back to Acento (0)
                // The only way to remove is via the "X" button (removeBrandColor)
                if (roleIndex === -1 || roleIndex === roles.length - 1) {
                    const nextRole = roles[0]
                    const newColors = [...prev.selectedBrandColors]
                    newColors[index] = { ...newColors[index], role: nextRole }
                    console.log(`[useCreationFlow] Role cycle: ${currentRole} -> ${nextRole}`)
                    return { ...prev, selectedBrandColors: newColors, generatedImage: null }
                } else {
                    // Cycle to next role
                    const newRole = roles[roleIndex + 1]
                    const newColors = [...prev.selectedBrandColors]
                    newColors[index] = { ...newColors[index], role: newRole }
                    console.log(`[useCreationFlow] Role cycle: ${currentRole} -> ${newRole}`)
                    return {
                        ...prev,
                        selectedBrandColors: newColors,
                        generatedImage: null
                    }
                }
            }
        })
    }, [])

    const removeBrandColor = useCallback((color: string) => {
        console.log('[useCreationFlow] removeBrandColor called with:', color)
        setState(prev => {
            const normalizedColor = color.startsWith('#') ? color.toLowerCase() : `#${color.toLowerCase()}`
            const before = prev.selectedBrandColors.length
            const newColors = prev.selectedBrandColors.filter(c => c.color.toLowerCase() !== normalizedColor)
            const after = newColors.length
            console.log(`[useCreationFlow] Color removal: ${normalizedColor}. Count before: ${before}, after: ${after}`)
            if (before === after) {
                console.warn('[useCreationFlow] NO COLOR WAS REMOVED! Check for string mismatch. Current colors:', prev.selectedBrandColors.map(c => c.color))
            }
            return {
                ...prev,
                selectedBrandColors: newColors,
                generatedImage: null
            }
        })
    }, [])

    const addCustomColor = useCallback((color: string) => {
        const normalizedColor = color.startsWith('#') ? color.toLowerCase() : `#${color.toLowerCase()}`
        // Basic hex validation
        if (!/^#[0-9a-f]{6}$/i.test(normalizedColor)) return

        setState(prev => {
            const exists = prev.selectedBrandColors.some(c => c.color.toLowerCase() === normalizedColor)
            if (exists) return prev
            return {
                ...prev,
                selectedBrandColors: [...prev.selectedBrandColors, { color: normalizedColor, role: 'Acento' }],
                generatedImage: null
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

    const buildGenerationPrompt = useCallback((overrides?: Partial<GenerationState>): string => {
        const activeState = overrides ? { ...state, ...overrides } : state
        const activeIntent = overrides?.selectedIntent
            ? INTENT_CATALOG.find(i => i.id === overrides.selectedIntent)
            : currentIntent

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
        const userLanguage = detectLanguage(
            activeState.rawMessage || activeState.headline || activeState.cta || ''
        ) || 'es'
        sections.push(
            P12.PRIORITY_HEADER,
            ``,
            P12.LANGUAGE_ENFORCEMENT_INSTRUCTION(userLanguage),
            ``
        )

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 10 - ABSOLUTE OVERRIDE (Logo Integrity)
        // ═══════════════════════════════════════════════════════════════
        if (activeState.selectedLogoId && activeBrandKit?.logos) {
            const logo = activeBrandKit.logos.find((l, idx) =>
                (l as any)._id === activeState.selectedLogoId || `logo-${idx}` === activeState.selectedLogoId
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
        // PRIORITY 10b - SECONDARY LOGOS HIERARCHY
        // ═══════════════════════════════════════════════════════════════
        // When reference images are provided (brand kit OR uploaded), instruct the model to detect
        // and properly hierarchy any logos found (collaborators, sponsors, institutions, etc.)
        const hasReferenceImages = activeState.selectedBrandKitImageIds.length > 0 || activeState.uploadedImages.length > 0
        if (hasReferenceImages) {
            sections.push(
                P10B.PRIORITY_HEADER,
                ``,
                P10B.ANALYSIS_INSTRUCTION,
                ``,
                P10B.HIERARCHY_RULES,
                ``,
                P10B.VISUAL_TREATMENT,
                ``,
                P10B.AVOID_INSTRUCTION,
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 9 - BRAND DNA & MANDATORY TEXT
        // ═══════════════════════════════════════════════════════════════
        const brandDNA: string[] = []
        const hasTone = (activeBrandKit?.tone_of_voice?.length ?? 0) > 0

        if (hasTone) {
            brandDNA.push(P09.PRIORITY_HEADER, ``)

            brandDNA.push(`BRAND TONE: ${activeBrandKit!.tone_of_voice.join(', ')}`)

            brandDNA.push(
                ``,
                P09.BRAND_DNA_REQUIREMENT,
                ``
            )
        }

        // TEXT CONTENT (Part of P9 - Mandatory)
        const textParts: string[] = []
        const headlineValue = activeState.headline?.trim()
        if (headlineValue && headlineValue !== NO_TEXT_TOKEN) {
            textParts.push(`• HEADLINE: "${headlineValue}"`)
        }

        const ctaValue = activeState.cta?.trim()
        const ctaUrl = activeState.ctaUrl?.trim()
        if (ctaValue && ctaValue !== NO_TEXT_TOKEN) {
            if (ctaUrl) {
                // URL is the HERO element, CTA label is secondary above it (from p09b-cta-url-hierarchy.ts)
                textParts.push(P09B.URL_HERO_INSTRUCTION(ctaUrl))
                textParts.push(P09B.CTA_SECONDARY_INSTRUCTION(ctaValue))
            } else {
                textParts.push(P09B.CTA_ONLY_INSTRUCTION(ctaValue))
            }
        }



        Object.entries(activeState.customTexts).forEach(([id, val]) => {
            // Support strings or arrays (greedy parser sometimes returns arrays)
            const stringVal = Array.isArray(val) ? val.join(', ') : String(val ?? '')
            const cleanVal = stringVal.trim()

            if (cleanVal && cleanVal !== 'undefined' && cleanVal !== 'null') {
                // Filter out what is already mapped to headline/cta
                const fieldMeta = activeIntent?.requiredFields?.find(f => f.id === id)
                if (fieldMeta?.mapsTo) return

                const displayLabel = fieldMeta?.label || id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                textParts.push(`• ${displayLabel}: "${cleanVal}"`)
            }
        })

        // Add selected text assets from Brand DNA Panel
        activeState.selectedTextAssets.forEach(asset => {
            if (asset.type === 'cta' || asset.type === 'url') return
            if (asset.value?.trim()) {
                textParts.push(`• ${asset.label.toUpperCase()}: "${asset.value.trim()}"`)
            }
        })

        if (textParts.length > 0) {
            brandDNA.push(P09.MANDATORY_TEXT_HEADER)
            if (activeState.ctaUrl?.trim()) {
                brandDNA.push(P09B.CRITICAL_HIERARCHY_INSTRUCTION(activeState.ctaUrl))
            }
            brandDNA.push(...textParts, ``)
        } else if (activeState.rawMessage) {
            brandDNA.push(P09.MANDATORY_TEXT_HEADER, `(No explícitos, extraer de la INTENCIÓN ORIGINAL)`, ``)
        } else {
            brandDNA.push(P09.NO_TEXT_WARNING, ``)
        }

        if (activeState.rawMessage) {
            brandDNA.push(`USER ORIGINAL INTENTION / RAW CONTEXT:`, `"${activeState.rawMessage}"`, ``)
        }

        if (brandDNA.length > 0) {
            sections.push(...brandDNA)
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 8 - CUSTOM DIRECTOR INSTRUCTIONS
        // ═══════════════════════════════════════════════════════════════
        if (activeState.additionalInstructions) {
            sections.push(
                P08.PRIORITY_HEADER,
                ``,
                `"${activeState.additionalInstructions}"`,
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
        const ENABLE_PRIORITY_6 = false // Suspended by request; set true to restore

        if (
            ENABLE_PRIORITY_6 &&
            (activeState.visionAnalysis || (activeState.imageSourceMode === 'generate' && activeState.aiImageDescription.trim()))
        ) {
            subjectParts.push(
                P06.PRIORITY_HEADER,
                ``
            )

            // Prioritize AI Description if we are explicitly in 'generate' mode
            const useAiDescription = activeState.imageSourceMode === 'generate' && activeState.aiImageDescription.trim()

            if (useAiDescription) {
                subjectParts.push(
                    P06.AI_GENERATED_REFERENCE_HEADER,
                    P06.AI_GENERATED_REFERENCE_INSTRUCTION(activeState.aiImageDescription.trim()),
                    ``
                )
            }
            // Fallback to vision analysis (from upload or brand kit) if available
            else if (activeState.visionAnalysis) {
                subjectParts.push(`SUBJECT: ${activeState.visionAnalysis.subjectLabel}`)
                if (activeState.visionAnalysis.keywords.length > 0) {
                    subjectParts.push(`KEYWORDS: ${activeState.visionAnalysis.keywords.join(', ')}`)
                }
                subjectParts.push(`LIGHTING: ${activeState.visionAnalysis.lighting}`, ``)
            }
        }

        if (subjectParts.length > 0) {
            sections.push(...subjectParts)
        }

        // ─────────────────────────────────────────────────────────────
        // PRIORITY 6B - AI IMAGE DESCRIPTION (TEXT-ONLY)
        // ─────────────────────────────────────────────────────────────
        const aiDescription = activeState.imageSourceMode === 'generate'
            ? activeState.aiImageDescription.trim()
            : ''

        if (aiDescription) {
            sections.push(
                P06B.PRIORITY_HEADER,
                ``,
                P06B.AI_IMAGE_DESCRIPTION_INSTRUCTION(aiDescription),
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 5 - VISUAL STYLE & AESTHETIC
        // ═══════════════════════════════════════════════════════════════
        const customStyle = activeState.customStyle?.trim()
        const styleDirectives: string[] = []

        if (customStyle) {
            styleDirectives.push(customStyle)
        }

        if (activeState.firstVisionAnalysis?.keywords?.length) {
            const combinedVisionStyle = activeState.firstVisionAnalysis.keywords.join(', ')
            if (combinedVisionStyle.trim()) {
                styleDirectives.push(combinedVisionStyle)
            }
        }

        if (styleDirectives.length > 0) {
            const uniqueStyles = Array.from(new Set(styleDirectives))
            sections.push(
                P05.PRIORITY_HEADER,
                ``,
                `STYLE DIRECTIVES: ${uniqueStyles.join(', ')}`,
                ``,
                P05.STYLE_REQUIREMENT,
                ``
            )
        }

        // ═══════════════════════════════════════════════════════════════
        // PRIORITY 4 - BRAND COLOR PALETTE (with explicit roles)
        // ═══════════════════════════════════════════════════════════════
        const hasSelectedColors = activeState.selectedBrandColors.length > 0

        let colorsToUse: SelectedColor[] = []

        if (hasSelectedColors) {
            colorsToUse = activeState.selectedBrandColors
        }

        if (colorsToUse.length > 0) {
            sections.push(P04.PRIORITY_HEADER)
            sections.push(`Below is the STRICT color palette for this generation. Use these specific values and respect their assigned semantic roles:`)
            sections.push(``)

            // Group by role for better AI clarity
            const coreRoles = ['Fondo', 'Texto', 'Acento'] as const
            const usedColors = new Set<string>()

            // 1. Group Core Roles (with smart mapping for Principal -> Fondo)
            coreRoles.forEach(role => {
                const group = colorsToUse.filter(c => {
                    const normalizedRole = (c.role as string) === 'Principal' ? 'Fondo' : c.role
                    return normalizedRole === role
                })

                if (group.length > 0) {
                    const label = (P04.ROLE_LABELS as any)[role] || role.toUpperCase()
                    sections.push(`### ${label}`)
                    group.forEach(c => {
                        sections.push(`- ${c.color}`)
                        usedColors.add(c.color.toLowerCase())
                    })
                    sections.push(``)
                }
            })

            // 2. Group Extras (any colors not yet listed)
            const extras = colorsToUse.filter(c => !usedColors.has(c.color.toLowerCase()))
            if (extras.length > 0) {
                sections.push(`### 🎨 EXTRA / SECONDARY COLORS`)
                extras.forEach(c => {
                    const displayRole = (P04.ROLE_LABELS as any)[c.role] || c.role || 'Acento'
                    sections.push(`- ${c.color} (${displayRole})`)
                })
                sections.push(``)
            }

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

        // ═══════════════════════════════════════════════════════════════
        // FINAL COMPOSITION CHECK - URL VISIBILITY
        // ═══════════════════════════════════════════════════════════════
        if (activeState.ctaUrl?.trim()) {
            sections.push(
                ``,
                P09B.FINAL_URL_VISIBILITY_INSTRUCTION(activeState.ctaUrl.trim()),
                ``
            )
        }

        return sections.join('\n')
    }, [state, currentIntent, selectedLayoutMeta, activeBrandKit])

    const canGenerate = useMemo(() => {
        // Basic requirement: must have an intent
        if (!state.selectedIntent) return false;
        // Must have some form of image source or a detailed description
        const hasImageSource = state.uploadedImages.length > 0 || state.selectedBrandKitImageIds.length > 0;
        const hasEnoughVisualInfo = hasImageSource || (state.aiImageDescription && state.aiImageDescription.length > 10);
        return !!hasEnoughVisualInfo;
    }, [state.selectedIntent, state.uploadedImages, state.selectedBrandKitImageIds, state.aiImageDescription])

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
                    uploadedImages: state.uploadedImages, // Base64/URL array
                    selectedTheme: state.selectedTheme,
                    imageSourceMode: state.imageSourceMode,
                    selectedBrandKitImageIds: state.selectedBrandKitImageIds,
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
        setState(prev => ({
            ...prev,
            generatedImage: url,
            hasGeneratedImage: url ? true : prev.hasGeneratedImage,
        }))
    }, [])

    const reset = useCallback(() => {
        setState({ ...INITIAL_GENERATION_STATE, caption: '' }) // NEW: Reset caption
        hasInitializedBrandKit.current = false // Reset Brand Kit initialization flag
        setLastInitBrandId(null) // Reset last initialized Brand Kit ID
        optionsRef.current?.onReset?.()
    }, [])

    // -------------------------------------------------------------------------
    // PRESETS
    // -------------------------------------------------------------------------

    const loadPreset = useCallback((presetState: Partial<GenerationState>) => {
        const computeStepFromPreset = (preset: Partial<GenerationState>) => {
            let step = 1
            if (preset.selectedIntent) step = 2
            if (preset.selectedLayout) step = 3
            if (preset.selectedFormat && preset.selectedPlatform) step = 4
            const hasImageRef = (preset.uploadedImages?.length || 0) > 0
                || (preset.selectedBrandKitImageIds?.length || 0) > 0
                || (preset.aiImageDescription?.trim()?.length || 0) > 0
            if (hasImageRef) step = Math.max(step, 5)
            const hasStyles = (preset.selectedStyles?.length || 0) > 0 || Boolean(preset.customStyle?.trim())
            if (hasStyles) step = Math.max(step, 6)
            const hasBranding = Boolean(preset.selectedLogoId) || (preset.selectedBrandColors?.length || 0) > 0
            if (hasBranding) step = Math.max(step, 6)
            return step
        }

        setState(prev => ({
            ...INITIAL_GENERATION_STATE,
            caption: '', // NEW: Ensure caption is reset for presets
            ...presetState,
            hasGeneratedImage: Boolean(presetState.generatedImage),
            currentStep: presetState.currentStep ?? computeStepFromPreset(presetState),
            // Ensure clean technical state
            isGenerating: false,
            isAnalyzing: false,
            error: null,
            uploadedImageFile: null,
            visionAnalysis: null, // Reset analysis
            firstVisionAnalysis: null,
            firstReferenceId: null,
            firstReferenceSource: null,
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
            uploadedImages: state.uploadedImages,
            selectedTheme: state.selectedTheme,
            imageSourceMode: state.imageSourceMode,
            selectedBrandKitImageIds: state.selectedBrandKitImageIds,
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
            hasGeneratedImage: state.hasGeneratedImage,
        }

        // Safety: Strip large base64 strings (over ~50KB) to avoid Convex 1MB limit.
        // These snapshots are for restoring state; we want URLs here, not blobs.
        const stripIfLargeBase64 = (val: any) => {
            if (typeof val === 'string' && val.startsWith('data:') && val.length > 50000) {
                return null
            }
            return val
        }

        snapshot.uploadedImages = snapshot.uploadedImages.map(stripIfLargeBase64).filter(Boolean) as string[]
        snapshot.generatedImage = stripIfLargeBase64(snapshot.generatedImage)

        return snapshot
    }, [state])

    const setSuggestions = useCallback((suggestions: GenerationState['suggestions']) => {
        setState(prev => ({ ...prev, suggestions }))
    }, [])

    const applySuggestion = useCallback((suggestionIndex: number) => {
        setState(prev => {
            if (!prev.suggestions || !prev.suggestions[suggestionIndex]) return prev

            // Save relevant state if not already saved, so we can undo
            const originalState = prev.originalState || {
                headline: prev.headline,
                cta: prev.cta,
                ctaUrl: prev.ctaUrl,
                caption: prev.caption,
                customTexts: { ...prev.customTexts },
                selectedTextAssets: [...prev.selectedTextAssets]
            }

            const modifications = { ...prev.suggestions[suggestionIndex].modifications } as any

            // If AI provided 'imageTexts', map them to 'selectedTextAssets' for our state
            if (modifications.imageTexts && Array.isArray(modifications.imageTexts)) {
                modifications.selectedTextAssets = modifications.imageTexts.map((item: any, idx: number) => ({
                    id: `ai-sugg-${Date.now()}-${idx}`,
                    type: item.type || 'custom',
                    label: item.label || 'Texto',
                    value: item.value || ''
                }))
                delete modifications.imageTexts
            }

            return {
                ...prev,
                originalState,
                ...modifications,
                generatedImage: null // Invalidate image as text changed
            }
        })
    }, [])

    const undoSuggestion = useCallback(() => {
        setState(prev => {
            if (!prev.originalState) return prev
            return {
                ...prev,
                ...prev.originalState,
                originalState: null,
                generatedImage: null
            }
        })
    }, [])

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
        setStep,
        nextStep,
        prevStep,
        uploadImage,
        addUploadedImage,
        removeUploadedImage,
        clearUploadedImages,
        setImageFromUrl,
        clearImage,
        setImageSourceMode,
        toggleBrandKitImage,
        clearBrandKitImages,
        setAiImageDescription,
        selectTheme,
        toggleStyle,
        selectLayout,
        selectPlatform,
        selectFormat,
        selectLogo,
        setHeadline,
        setCta,
        setCtaUrl,
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
        // Suggestions
        setSuggestions,
        applySuggestion,
        undoSuggestion,
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
