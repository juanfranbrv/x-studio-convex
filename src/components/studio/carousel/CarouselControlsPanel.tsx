'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Minus, Sparkles, Loader2, Palette, Wand2, Layout, Layers, ImagePlus, Fingerprint, GalleryHorizontal, RotateCcw, History, Trash2, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BrandDNA } from '@/lib/brand-types'
import type { CarouselSuggestion, CarouselSlide, SlideContent } from '@/app/actions/generate-carousel'
import { ContentImageCard } from '@/components/studio/creation-flow/ContentImageCard'
import { StyleImageCard } from '@/components/studio/creation-flow/StyleImageCard'
import { AuxiliaryLogosCard } from '@/components/studio/creation-flow/AuxiliaryLogosCard'
import { resizeImage } from '@/lib/image-utils'
import { getAutomaticBasicComposition } from '@/lib/carousel-selection'
import { CarouselCompositionSelector } from '@/components/studio/carousel/CarouselCompositionSelector'
import { BrandingConfigurator } from '@/components/studio/creation-flow/BrandingConfigurator'
import type { ReferenceImageRole, SelectedColor, VisionAnalysis } from '@/lib/creation-flow-types'
import { buildPriority5StyleBlockFromAnalysis, mergeCustomStyleIntoStyleDirectives } from '@/lib/prompts/vision/style-priority-block'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { log } from '@/lib/logger'
import { SectionHeader } from '@/components/studio/shared/SectionHeader'
import {
    STUDIO_CONTROLS_SHELL_CLASS,
    STUDIO_PANEL_CARD_PADDED_CLASS,
    STUDIO_PANEL_CARD_PADDED_LG_CLASS,
} from '@/components/studio/shared/panelStyles'
import { SuggestionsList } from '@/components/studio/shared/SuggestionsList'

export interface SlideConfig {
    index: number
    customText?: string
}

export interface CarouselSettings {
    prompt: string
    slideCount: number
    aspectRatio: '1:1' | '4:5' | '3:4'
    style: string
    slides: SlideConfig[]
    compositionId: string
    structureId: string
    imageSourceMode: 'upload' | 'brandkit' | 'generate'
    aiImageDescription?: string
    aiStyleDirectives?: string
    customStyleText?: string
    // Brand Kit Context
    selectedLogoUrl?: string
    selectedColors: { color: string; role: string }[]
    selectedReferenceImages: Array<{ url: string; role: ReferenceImageRole }>
    selectedImageUrls: string[]
    includeLogoOnSlides: boolean
}

type CompositionMode = 'basic' | 'advanced'

type DbStructure = {
    structure_id: string
    name: string
    summary: string
    order: number
}

type DbComposition = {
    composition_id: string
    structure_id?: string
    scope: string
    mode: string
    name: string
    description: string
    layoutPrompt: string
    icon?: string
    iconPrompt?: string
    order: number
}

type UiStructure = {
    id: string
    name: string
    summary: string
    order: number
}

type UiComposition = {
    id: string
    name: string
    description: string
    layoutPrompt: string
    icon?: string
    iconPrompt?: string
    scope: 'global' | 'narrative'
    mode: 'basic' | 'advanced'
    order: number
}

type SessionDecisionButton = {
    id: string
    label: string
    variant?: 'default' | 'outline' | 'destructive'
}

type SessionDecisionModalState = {
    open: boolean
    title: string
    description: string
    buttons: SessionDecisionButton[]
}

interface CarouselControlsPanelProps {
    onAnalyze: (settings: CarouselSettings) => Promise<void>
    onGenerate: (settings: CarouselSettings) => void
    onPreviewCompositionChange?: (state: { structureId: string; compositionId: string }) => void
    onCancelAnalyze?: () => void
    onCancelGenerate?: () => void
    isCancelingAnalyze?: boolean
    isCancelingGenerate?: boolean
    onAspectRatioChange?: (ratio: '1:1' | '4:5' | '3:4') => void
    onReferenceImagesChange?: (images: Array<{ url: string; source: 'upload' | 'brandkit' }>) => void
    onSelectedLogoChange?: (logoId: string | null, logoUrl?: string) => void
    onReset?: () => void
    userId?: string
    isAnalyzing: boolean
    isGenerating: boolean
    currentSlideIndex: number
    generatedCount: number
    totalSlides: number
    // Brand Kit Data
    brandKit: BrandDNA | null
    analysisHook?: string
    analysisStructure?: { id?: string; name?: string }
    analysisIntent?: string
    analysisIntentLabel?: string
    isAdmin?: boolean
    slideCountOverride?: number | null
    onSlideCountOverrideApplied?: () => void
    suggestions?: CarouselSuggestion[]
    onApplySuggestion?: (index: number) => void
    onApplySlideVariant?: (slideIndex: number, sourceId: string) => void
    onUndoSuggestion?: () => void
    hasOriginalSuggestion?: boolean
    slideVariantSelection?: string[]
    suggestedImagePrompts?: string[]
    analysisReady?: boolean
    onInvalidatePreview?: () => void
    onReferencePreviewStateChange?: (state: {
        uploadedImages: string[]
        selectedBrandKitImageIds: string[]
        referenceImageRoles: Record<string, ReferenceImageRole>
        imageSourceMode: 'upload' | 'brandkit' | 'generate'
        selectedStylePresetId: string | null
        selectedStylePresetImageUrl: string | null
    }) => void
    previewSlides?: CarouselSlide[]
    previewScriptSlides?: SlideContent[] | null
    originalScriptSlides?: SlideContent[] | null
    previewCaption?: string
    previewCurrentIndex?: number
    previewSessionHistory?: Array<{
        id: string
        createdAt: string
        slides: CarouselSlide[]
        caption?: string
    }>
    onRestorePreviewState?: (state: {
        slides: CarouselSlide[]
        scriptSlides?: SlideContent[]
        caption?: string
        currentIndex?: number
        sessionHistory?: Array<{
            id: string
            createdAt: string
            slides: CarouselSlide[]
            caption?: string
        }>
    }) => void
    getAuditFlowId?: () => string | undefined
}

type CarouselWorkspaceSnapshot = {
    version: number
    module: 'carousel'
    prompt: string
    slideCount: number
    aspectRatio: '1:1' | '4:5' | '3:4'
    style: string
    structureId: string
    compositionId: string
    compositionMode: CompositionMode
    basicSelectedCompositionId: string | null
    imageSourceMode: 'upload' | 'brandkit' | 'generate'
    aiImageDescription: string
    aiStyleDirectives: string
    customStyle: string
    selectedStylePresetId: string | null
    selectedStylePresetName: string | null
    selectedLogoId: string | null
    selectedColors: SelectedColor[]
    selectedBrandKitImageIds: string[]
    referenceImageRoles: Record<string, ReferenceImageRole>
    uploadedImages: string[]
    includeLogoOnSlides: boolean
    previewState: {
        slides: CarouselSlide[]
        scriptSlides?: SlideContent[]
        caption?: string
        currentIndex?: number
        sessionHistory?: Array<{
            id: string
            createdAt: string
            slides: CarouselSlide[]
            caption?: string
        }>
    }
}

const STYLE_OPTIONS = [
    { id: 'minimal', label: 'Minimalista' },
    { id: 'gradient', label: 'Gradientes' },
    { id: 'photo', label: 'Fotográfico' },
    { id: 'illustration', label: 'Ilustración' },
    { id: 'bold', label: 'Bold & Tipográfico' },
    { id: 'elegant', label: 'Elegante' },
]

function pickCompositionId(
    compositions: UiComposition[],
    mode: CompositionMode,
    selectedId: string | undefined,
    seed: string
): string {
    if (!compositions.length) return 'free'

    if (mode === 'basic') {
        const picked = getAutomaticBasicComposition(compositions, seed, {
            prompt: seed.split('|')[1] || '',
            slideCount: Number(seed.split('|')[2] || 0) || 5
        })
        return picked?.id || compositions[0]?.id || 'free'
    }

    if (selectedId && compositions.some((composition) => composition.id === selectedId)) {
        return selectedId
    }
    return compositions[0]?.id || 'free'
}

export function CarouselControlsPanel({
    onAnalyze,
    onGenerate,
    onPreviewCompositionChange,
    onCancelAnalyze,
    onCancelGenerate,
    isCancelingAnalyze = false,
    isCancelingGenerate = false,
    isAnalyzing,
    isGenerating,
    onAspectRatioChange,
    onReferenceImagesChange,
    onSelectedLogoChange,
    onReset,
    userId,
    currentSlideIndex,
    generatedCount,
    totalSlides,
    brandKit,
    analysisHook,
    analysisStructure,
    analysisIntent,
    analysisIntentLabel,
    isAdmin = false,
    slideCountOverride,
    onSlideCountOverrideApplied,
    suggestions,
    onApplySuggestion,
    onApplySlideVariant,
    onUndoSuggestion,
    hasOriginalSuggestion = false,
    slideVariantSelection = [],
    suggestedImagePrompts = [],
    analysisReady = false,
    onInvalidatePreview,
    onReferencePreviewStateChange,
    previewSlides = [],
    previewScriptSlides = null,
    originalScriptSlides = null,
    previewCaption,
    previewCurrentIndex = 0,
    previewSessionHistory = [],
    onRestorePreviewState,
    getAuditFlowId
}: CarouselControlsPanelProps) {
    const createWorkSession = useMutation(api.work_sessions.createSession)
    const upsertWorkSession = useMutation(api.work_sessions.upsertActiveSession)
    const activateWorkSession = useMutation(api.work_sessions.activateSession)
    const deleteWorkSession = useMutation(api.work_sessions.deleteSession)
    const clearWorkSessions = useMutation(api.work_sessions.clearSessions)
    const scopedBrandId = (brandKit?.id || (brandKit as any)?._id) as Id<'brand_dna'> | undefined
    const activeWorkSession = useQuery(
        api.work_sessions.getActiveSession,
        userId && scopedBrandId
            ? { user_id: userId, module: 'carousel', brand_id: scopedBrandId }
            : 'skip'
    )
    const workSessions = useQuery(
        api.work_sessions.listSessions,
        userId && scopedBrandId
            ? { user_id: userId, module: 'carousel', brand_id: scopedBrandId, limit: 50 }
            : 'skip'
    )
    const structuresData = useQuery(api.carousel.listStructures, { includeInactive: false }) as DbStructure[] | undefined
    const stylePresetResults = useQuery(api.stylePresets.listActiveImages, {})
    const stylePresets = (stylePresetResults || []) as Array<{
        _id: string
        name?: string
        image_url: string
    }>
    const stylePresetsStatus: 'Exhausted' = 'Exhausted'
    const structures: UiStructure[] = (structuresData || [])
        .map((s) => ({ id: s.structure_id, name: s.name, summary: s.summary, order: s.order }))
        .sort((a, b) => a.order - b.order)
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [selectedSessionToLoad, setSelectedSessionToLoad] = useState<string>('')
    const [hasHydratedSession, setHasHydratedSession] = useState(false)
    const [isHydratingSession, setIsHydratingSession] = useState(false)
    const [isSavingSession, setIsSavingSession] = useState(false)
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const lastSavedSnapshotSignatureRef = useRef<string | null>(null)
    const hydrationScopeRef = useRef<string>('')
    const hasHydratedScopeRef = useRef(false)
    const persistedSlideImageCacheRef = useRef<Map<string, {
        storageId: string
        imageUrl: string
        originalStorageId: string
        originalImageUrl: string
        previewStorageId: string
        previewImageUrl: string
    }>>(new Map())
    const persistSlideImageInFlightRef = useRef<Map<string, Promise<{
        storageId: string
        imageUrl: string
        originalStorageId: string
        originalImageUrl: string
        previewStorageId: string
        previewImageUrl: string
    } | null>>>(new Map())
    const sessionDecisionResolverRef = useRef<((decision: string | null) => void) | null>(null)
    const [sessionDecisionModal, setSessionDecisionModal] = useState<SessionDecisionModalState>({
        open: false,
        title: '',
        description: '',
        buttons: [],
    })
    const openSessionDecisionModal = useCallback((config: Omit<SessionDecisionModalState, 'open'>) => {
        return new Promise<string | null>((resolve) => {
            sessionDecisionResolverRef.current = resolve
            setSessionDecisionModal({
                open: true,
                ...config,
            })
        })
    }, [])
    const closeSessionDecisionModal = useCallback((decision: string | null) => {
        sessionDecisionResolverRef.current?.(decision)
        sessionDecisionResolverRef.current = null
        setSessionDecisionModal((prev) => ({ ...prev, open: false }))
    }, [])
    const confirmDiscardUnsavedChanges = useCallback(async (action: string) => {
        if (!hasUnsavedChanges) return true
        const decision = await openSessionDecisionModal({
            title: 'Hay cambios sin guardar',
            description: `Si continúas para ${action}, perderás los cambios de esta sesión. ¿Qué quieres hacer?`,
            buttons: [
                { id: 'cancel', label: 'Seguir aquí', variant: 'outline' },
                { id: 'discard', label: 'Descartar cambios', variant: 'destructive' },
            ],
        })
        return decision === 'discard'
    }, [hasUnsavedChanges, openSessionDecisionModal])
    const [prompt, setPrompt] = useState('')
    const [slideCount, setSlideCount] = useState(0)
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '3:4'>('4:5')
    const [style, setStyle] = useState('minimal')
    const [slides, setSlides] = useState<SlideConfig[]>([])
    const [structureId, setStructureId] = useState<string>(analysisStructure?.id || structures[0]?.id || 'problema-solucion')
    const [compositionMode, setCompositionMode] = useState<CompositionMode>('basic')
    const [basicSelectedCompositionId, setBasicSelectedCompositionId] = useState<string | null>(null)
    const [hasUserSelectedStructure, setHasUserSelectedStructure] = useState(false)
    const [lastAnalysisStructureId, setLastAnalysisStructureId] = useState<string | null>(analysisStructure?.id || null)
    const compositionsData = useQuery(api.carousel.listCompositions, {
        structureId,
        includeInactive: false,
        includeGlobals: true
    }) as DbComposition[] | undefined
    const compositions: UiComposition[] = (compositionsData || [])
        .map((c) => ({
            id: c.composition_id,
            name: c.name,
            description: c.description,
            layoutPrompt: c.layoutPrompt,
            icon: c.icon,
            iconPrompt: c.iconPrompt,
            scope: (c.scope as 'global' | 'narrative') || 'narrative',
            mode: (c.mode as 'basic' | 'advanced') || 'basic',
            order: c.order
        }))
        .sort((a, b) => a.order - b.order)

    const [compositionId, setCompositionId] = useState(
        pickCompositionId(
            compositions,
            'basic',
            compositions[0]?.id,
            `${structureId}|0`
        )
    )
    const [editingSlide, setEditingSlide] = useState<number | null>(null)
    const [editText, setEditText] = useState('')

    // Brand Kit Selections
    const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null)
    const [selectedColors, setSelectedColors] = useState<SelectedColor[]>([])
    const [selectedBrandKitImageIds, setSelectedBrandKitImageIds] = useState<string[]>([])
    const [referenceImageRoles, setReferenceImageRoles] = useState<Record<string, ReferenceImageRole>>({})
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'brandkit' | 'generate'>('upload')
    const [aiImageDescription, setAiImageDescription] = useState('')
    const [styleAnalysisDescription, setStyleAnalysisDescription] = useState('')
    const [customStyle, setCustomStyle] = useState('')
    const [selectedStylePresetId, setSelectedStylePresetId] = useState<string | null>(null)
    const [selectedStylePresetName, setSelectedStylePresetName] = useState<string | null>(null)
    const [isImageAnalyzing, setIsImageAnalyzing] = useState(false)
    const [imageError, setImageError] = useState<string | null>(null)
    const selectedStylePresetDetails = useQuery(
        api.stylePresets.getActiveById,
        selectedStylePresetId
            ? { id: selectedStylePresetId as Id<'style_presets'> }
            : 'skip'
    )
    const styleAnalysisCacheRef = useRef<Record<string, string>>({})
    const lastAutoStyleRef = useRef<string | null>(null)
    const pendingStylePresetSelectionRef = useRef<string | null>(null)
    const [includeLogoOnSlides, setIncludeLogoOnSlides] = useState(false)
    const [isAdvancedCompositionOpen, setIsAdvancedCompositionOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1)
    const [needsReanalysis, setNeedsReanalysis] = useState(false)
    const [lastAnalyzedSignature, setLastAnalyzedSignature] = useState('')
    const showAllSteps = analysisReady || generatedCount > 0
    const stepRefs = useRef<Array<HTMLDivElement | null>>([])
    const shouldReduceMotion = useReducedMotion()
    const selectedImageCount = uploadedImages.length + selectedBrandKitImageIds.length
    const hasReferenceSelection = selectedImageCount > 0 || (imageSourceMode === 'generate' && aiImageDescription.trim().length > 0)
    const canGenerate = prompt.trim().length > 0
        && slideCount > 0
        && !isGenerating
        && !isAnalyzing
        && !isImageAnalyzing
        && brandKit !== null
        && analysisReady
        && !needsReanalysis
    const canAnalyze = prompt.trim().length > 0 && slideCount > 0 && !isAnalyzing && !isImageAnalyzing && !isGenerating && brandKit !== null
    const isPriority5StyleBlock = (value?: string) =>
        typeof value === 'string' && /STYLE DIRECTIVES:/i.test(value)
    const isStepVisible = (step: number) => showAllSteps || currentStep >= step
    const basicCompositions = compositions.filter((composition) => composition.mode === 'basic')
    const advancedCompositions = compositions
    const buildSessionTitle = useCallback((value?: string | null) => {
        const cleaned = (value || '').replace(/\s+/g, ' ').trim()
        if (!cleaned) return 'Sesion nueva'
        if (cleaned.length <= 48) return cleaned
        return `${cleaned.slice(0, 48)}...`
    }, [])
    const buildEmptyWorkspaceSnapshot = useCallback((defaultStructureId: string): CarouselWorkspaceSnapshot => {
        const defaultCompositionId = pickCompositionId(
            compositions,
            'basic',
            compositions[0]?.id,
            `${defaultStructureId}|0`
        )

        return {
            version: 1,
            module: 'carousel',
            prompt: '',
            slideCount: 0,
            aspectRatio: '4:5',
            style: 'minimal',
            structureId: defaultStructureId,
            compositionId: defaultCompositionId,
            compositionMode: 'basic',
            basicSelectedCompositionId: null,
            imageSourceMode: 'upload',
            aiImageDescription: '',
            aiStyleDirectives: '',
            customStyle: '',
            selectedStylePresetId: null,
            selectedStylePresetName: null,
            selectedLogoId: null,
            selectedColors: [],
            selectedBrandKitImageIds: [],
            referenceImageRoles: {},
            uploadedImages: [],
            includeLogoOnSlides: false,
            previewState: {
                slides: [],
                scriptSlides: undefined,
                caption: undefined,
                currentIndex: 0,
                sessionHistory: [],
            }
        }
    }, [compositions])
    const resetWorkspace = useCallback(() => {
        setPrompt('')
        setSlideCount(0)
        setAspectRatio('4:5')
        setStyle('minimal')
        setSlides([])
        const defaultStructureId = analysisStructure?.id || structures[0]?.id || 'problema-solucion'
        const defaultCompositionId = pickCompositionId(
            compositions,
            'basic',
            compositions[0]?.id,
            `${defaultStructureId}|0`
        )
        setStructureId(defaultStructureId)
        setCompositionMode('basic')
        setCompositionId(defaultCompositionId)
        setBasicSelectedCompositionId(null)
        setSelectedLogoId(null)
        setSelectedColors([])
        setSelectedBrandKitImageIds([])
        setReferenceImageRoles({})
        setUploadedImages([])
        setImageSourceMode('upload')
        setAiImageDescription('')
        setStyleAnalysisDescription('')
        setCustomStyle('')
        setSelectedStylePresetId(null)
        setSelectedStylePresetName(null)
        setIncludeLogoOnSlides(false)
        setNeedsReanalysis(false)
        setLastAnalyzedSignature('')
        setCurrentStep(1)
        onReset?.()
    }, [analysisStructure?.id, structures, compositions, onReset])

    const buildWorkspaceSnapshot = useCallback((
        previewSlidesOverride?: CarouselSlide[],
        sessionHistoryOverride?: Array<{
            id: string
            createdAt: string
            slides: CarouselSlide[]
            caption?: string
        }>
    ): CarouselWorkspaceSnapshot => {
        const sourceSlides = Array.isArray(previewSlidesOverride) ? previewSlidesOverride : (previewSlides || [])
        const sourceHistory = Array.isArray(sessionHistoryOverride) ? sessionHistoryOverride : (previewSessionHistory || [])
        return {
            version: 1,
            module: 'carousel',
            prompt,
            slideCount,
            aspectRatio,
            style,
            structureId,
            compositionId,
            compositionMode,
            basicSelectedCompositionId,
            imageSourceMode,
            aiImageDescription,
            aiStyleDirectives: styleAnalysisDescription,
            customStyle,
            selectedStylePresetId,
            selectedStylePresetName,
            selectedLogoId,
            selectedColors,
            selectedBrandKitImageIds,
            referenceImageRoles,
            uploadedImages,
            includeLogoOnSlides,
            previewState: {
                slides: sourceSlides.map((slide) => ({
                    index: slide.index,
                    title: slide.title,
                    description: slide.description,
                    status: slide.status,
                    imageUrl: slide.imageUrl,
                    image_storage_id: slide.image_storage_id,
                    imagePreviewUrl: slide.imagePreviewUrl,
                    image_preview_storage_id: slide.image_preview_storage_id,
                    imageOriginalUrl: slide.imageOriginalUrl,
                    image_original_storage_id: slide.image_original_storage_id,
                    error: slide.error
                })),
                scriptSlides: Array.isArray(previewScriptSlides) ? previewScriptSlides : undefined,
                caption: previewCaption || undefined,
                currentIndex: previewCurrentIndex,
                sessionHistory: sourceHistory.map((item) => ({
                        id: item.id,
                        createdAt: item.createdAt,
                        caption: item.caption,
                        slides: Array.isArray(item.slides)
                            ? item.slides.map((slide) => ({
                                index: slide.index,
                                title: slide.title,
                                description: slide.description,
                                status: slide.status,
                                imageUrl: slide.imageUrl,
                                image_storage_id: slide.image_storage_id,
                                imagePreviewUrl: slide.imagePreviewUrl,
                                image_preview_storage_id: slide.image_preview_storage_id,
                                imageOriginalUrl: slide.imageOriginalUrl,
                                image_original_storage_id: slide.image_original_storage_id,
                                error: slide.error
                            }))
                            : []
                    }))
            }
        }
    }, [
        prompt,
        slideCount,
        aspectRatio,
        style,
        structureId,
        compositionId,
        compositionMode,
        basicSelectedCompositionId,
        imageSourceMode,
        aiImageDescription,
        styleAnalysisDescription,
        customStyle,
        selectedStylePresetId,
        selectedStylePresetName,
        selectedLogoId,
        selectedColors,
        selectedBrandKitImageIds,
        referenceImageRoles,
        uploadedImages,
        includeLogoOnSlides,
        previewSlides,
        previewScriptSlides,
        previewCaption,
        previewCurrentIndex,
        previewSessionHistory
    ])

    const buildSlidePersistKey = useCallback((slide: CarouselSlide, imageUrl: string) => {
        const compactUrl = imageUrl.length > 160 ? `${imageUrl.slice(0, 160)}::${imageUrl.length}` : imageUrl
        return `${slide.index}::${compactUrl}`
    }, [])

    const persistPreviewSlideImage = useCallback(async (slide: CarouselSlide) => {
        const originalUrl = typeof slide.imageOriginalUrl === 'string' ? slide.imageOriginalUrl.trim() : ''
        const previewUrl = typeof slide.imagePreviewUrl === 'string' ? slide.imagePreviewUrl.trim() : ''
        const currentUrl = typeof slide.imageUrl === 'string' ? slide.imageUrl.trim() : ''
        const originalStorageId = typeof slide.image_original_storage_id === 'string' ? slide.image_original_storage_id.trim() : ''
        const legacyStorageId = typeof slide.image_storage_id === 'string' ? slide.image_storage_id.trim() : ''
        const previewStorageId = typeof slide.image_preview_storage_id === 'string' ? slide.image_preview_storage_id.trim() : ''

        if ((originalStorageId || legacyStorageId) && previewStorageId) return null

        const imageUrl = originalUrl || currentUrl || previewUrl || originalStorageId || legacyStorageId
        if (!imageUrl) return null

        const needsPersistence =
            imageUrl.startsWith('data:') ||
            imageUrl.startsWith('http://') ||
            imageUrl.startsWith('https://') ||
            /^[a-z0-9]{20,}$/i.test(imageUrl)
        if (!needsPersistence) return null

        const key = buildSlidePersistKey(slide, imageUrl)
        const cached = persistedSlideImageCacheRef.current.get(key)
        if (cached) return cached

        const inFlight = persistSlideImageInFlightRef.current.get(key)
        if (inFlight) return await inFlight

        const task = (async () => {
            const response = await fetch('/api/work-sessions/persist-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'No se pudo persistir imagen de slide' }))
                throw new Error(errorData.error || 'No se pudo persistir imagen de slide')
            }

            const data = await response.json() as {
                storageId?: string
                imageUrl?: string
                originalStorageId?: string
                originalImageUrl?: string
                previewStorageId?: string
                previewImageUrl?: string
            }
            if (!data.storageId || !data.imageUrl || !data.originalStorageId || !data.originalImageUrl || !data.previewStorageId || !data.previewImageUrl) {
                throw new Error('Persistencia de slide incompleta')
            }
            const persisted = {
                storageId: data.storageId,
                imageUrl: data.imageUrl,
                originalStorageId: data.originalStorageId,
                originalImageUrl: data.originalImageUrl,
                previewStorageId: data.previewStorageId,
                previewImageUrl: data.previewImageUrl,
            }
            persistedSlideImageCacheRef.current.set(key, persisted)
            return persisted
        })()

        persistSlideImageInFlightRef.current.set(key, task)
        try {
            return await task
        } finally {
            persistSlideImageInFlightRef.current.delete(key)
        }
    }, [buildSlidePersistKey])

    const materializePreviewSlidesForSnapshot = useCallback(async (inputSlides: CarouselSlide[]) => {
        if (!Array.isArray(inputSlides) || inputSlides.length === 0) return inputSlides

        const materialized = await Promise.all(inputSlides.map(async (slide) => {
            try {
                const persisted = await persistPreviewSlideImage(slide)
                if (!persisted) return slide
                return {
                    ...slide,
                    image_storage_id: persisted.originalStorageId,
                    imageUrl: persisted.previewImageUrl,
                    image_preview_storage_id: persisted.previewStorageId,
                    imagePreviewUrl: persisted.previewImageUrl,
                    image_original_storage_id: persisted.originalStorageId,
                    imageOriginalUrl: persisted.originalImageUrl,
                }
            } catch {
                return slide
            }
        }))

        return materialized
    }, [persistPreviewSlideImage])

    const materializeSessionHistoryForSnapshot = useCallback(async (
        history: Array<{
            id: string
            createdAt: string
            slides: CarouselSlide[]
            caption?: string
        }>
    ) => {
        if (!Array.isArray(history) || history.length === 0) return history

        const materialized = await Promise.all(history.map(async (entry) => {
            const slides = Array.isArray(entry.slides) ? entry.slides : []
            if (slides.length === 0) return entry

            const persistedSlides = await Promise.all(slides.map(async (slide) => {
                try {
                    const persisted = await persistPreviewSlideImage(slide)
                    if (!persisted) return slide
                    return {
                        ...slide,
                        image_storage_id: persisted.originalStorageId,
                        imageUrl: persisted.previewImageUrl,
                        image_preview_storage_id: persisted.previewStorageId,
                        imagePreviewUrl: persisted.previewImageUrl,
                        image_original_storage_id: persisted.originalStorageId,
                        imageOriginalUrl: persisted.originalImageUrl,
                    }
                } catch {
                    return slide
                }
            }))

            return {
                ...entry,
                slides: persistedSlides,
            }
        }))

        return materialized
    }, [persistPreviewSlideImage])

    const restoreWorkspaceFromSnapshot = useCallback((snapshot: CarouselWorkspaceSnapshot) => {
        setIsHydratingSession(true)
        try {
            setPrompt(snapshot.prompt || '')
            setSlideCount(Math.max(0, Math.min(15, snapshot.slideCount || 0)))
            setAspectRatio(snapshot.aspectRatio || '4:5')
            setStyle(snapshot.style || 'minimal')
            setStructureId(snapshot.structureId || 'problema-solucion')
            setCompositionId(snapshot.compositionId || 'free')
            setCompositionMode(snapshot.compositionMode === 'advanced' ? 'advanced' : 'basic')
            setBasicSelectedCompositionId(snapshot.basicSelectedCompositionId || null)
            setImageSourceMode(snapshot.imageSourceMode || 'upload')
            setAiImageDescription(snapshot.aiImageDescription || '')
            setStyleAnalysisDescription(snapshot.aiStyleDirectives || '')
            setCustomStyle(snapshot.customStyle || '')
            setSelectedStylePresetId(snapshot.selectedStylePresetId || null)
            setSelectedStylePresetName(snapshot.selectedStylePresetName || null)
            setSelectedLogoId(snapshot.selectedLogoId || null)
            setSelectedColors(Array.isArray(snapshot.selectedColors) ? snapshot.selectedColors : [])
            setSelectedBrandKitImageIds(Array.isArray(snapshot.selectedBrandKitImageIds) ? snapshot.selectedBrandKitImageIds : [])
            setReferenceImageRoles(snapshot.referenceImageRoles || {})
            setUploadedImages(Array.isArray(snapshot.uploadedImages) ? snapshot.uploadedImages : [])
            setIncludeLogoOnSlides(Boolean(snapshot.includeLogoOnSlides))
            const savedPreview = snapshot.previewState
            if (savedPreview && onRestorePreviewState) {
                onRestorePreviewState({
                    slides: Array.isArray(savedPreview.slides) ? savedPreview.slides : [],
                    scriptSlides: Array.isArray(savedPreview.scriptSlides) ? savedPreview.scriptSlides : undefined,
                    caption: typeof savedPreview.caption === 'string' ? savedPreview.caption : undefined,
                    currentIndex: Number.isFinite(savedPreview.currentIndex) ? savedPreview.currentIndex : 0,
                    sessionHistory: Array.isArray(savedPreview.sessionHistory) ? savedPreview.sessionHistory : undefined
                })
            }
            setCurrentStep(7)
            setNeedsReanalysis(false)
            setLastAnalyzedSignature('')
        } finally {
            window.setTimeout(() => setIsHydratingSession(false), 0)
        }
    }, [onRestorePreviewState])

    const createNewCarouselSession = useCallback(async (
        silent = false,
        options?: { skipUnsavedConfirm?: boolean }
    ) => {
        if (!userId || !scopedBrandId) return null
        if (!options?.skipUnsavedConfirm && !await confirmDiscardUnsavedChanges('crear una sesión nueva')) return null

        const defaultStructureId = analysisStructure?.id || structures[0]?.id || 'problema-solucion'
        const emptySnapshot = buildEmptyWorkspaceSnapshot(defaultStructureId)
        resetWorkspace()

        const created = await createWorkSession({
            user_id: userId,
            module: 'carousel',
            brand_id: scopedBrandId,
            title: buildSessionTitle(''),
            snapshot: emptySnapshot,
        })

        const id = String(created.session_id)
        setCurrentSessionId(id)
        setSelectedSessionToLoad(id)
        lastSavedSnapshotSignatureRef.current = JSON.stringify(emptySnapshot)
        setHasUnsavedChanges(false)

        if (!silent) {
            window.setTimeout(() => {
                // keep lightweight, no toast dependency on this path
            }, 0)
        }
        return id
    }, [userId, scopedBrandId, confirmDiscardUnsavedChanges, analysisStructure?.id, structures, buildEmptyWorkspaceSnapshot, createWorkSession, buildSessionTitle, resetWorkspace])

    const handleLoadSession = useCallback(async (
        sessionId: string,
        options?: { skipUnsavedConfirm?: boolean }
    ) => {
        if (!sessionId || !userId) return false
        if (!options?.skipUnsavedConfirm && !await confirmDiscardUnsavedChanges('cambiar de sesión')) return false
        const activated = await activateWorkSession({
            user_id: userId,
            session_id: sessionId as Id<'work_sessions'>,
        })
        if (activated?.snapshot) {
            restoreWorkspaceFromSnapshot(activated.snapshot as CarouselWorkspaceSnapshot)
            log.success('SESSION', 'Sesion de carrusel restaurada', {
                session_id: String(activated._id || sessionId),
                module: 'carousel',
            })
        }
        setCurrentSessionId(String(activated?._id || sessionId))
        setSelectedSessionToLoad(String(activated?._id || sessionId))
        setHasUnsavedChanges(false)
        return true
    }, [userId, activateWorkSession, restoreWorkspaceFromSnapshot, confirmDiscardUnsavedChanges])

    const handleDeleteCurrentSession = useCallback(async () => {
        if (!userId || !currentSessionId) return
        const decision = await openSessionDecisionModal({
            title: 'Borrar esta sesión',
            description: 'Eliminarás esta sesión de carrusel. El contenido guardado de esta sesión dejará de estar disponible.',
            buttons: [
                { id: 'cancel', label: 'Cancelar', variant: 'outline' },
                { id: 'delete', label: 'Borrar sesión', variant: 'destructive' },
            ],
        })
        if (decision !== 'delete') return

        const result = await deleteWorkSession({
            user_id: userId,
            session_id: currentSessionId as Id<'work_sessions'>,
        })

        if (result?.next_session_id) {
            await handleLoadSession(String(result.next_session_id), { skipUnsavedConfirm: true })
        } else {
            await createNewCarouselSession(true, { skipUnsavedConfirm: true })
        }
    }, [userId, currentSessionId, openSessionDecisionModal, deleteWorkSession, handleLoadSession, createNewCarouselSession])

    const handleClearAllSessions = useCallback(async () => {
        if (!userId || !scopedBrandId) return
        const decision = await openSessionDecisionModal({
            title: 'Borrar todas las sesiones',
            description: 'Se eliminará todo el historial de sesiones de carrusel de este kit de marca. Esta acción no se puede deshacer.',
            buttons: [
                { id: 'cancel', label: 'Cancelar', variant: 'outline' },
                { id: 'clear', label: 'Borrar todo', variant: 'destructive' },
            ],
        })
        if (decision !== 'clear') return
        await clearWorkSessions({
            user_id: userId,
            module: 'carousel',
            brand_id: scopedBrandId,
        })
        await createNewCarouselSession(true, { skipUnsavedConfirm: true })
    }, [userId, scopedBrandId, openSessionDecisionModal, clearWorkSessions, createNewCarouselSession])

    useEffect(() => {
        const scopeKey = `${userId || 'anon'}::carousel::${scopedBrandId || 'no-brand'}`
        if (hydrationScopeRef.current !== scopeKey) {
            hydrationScopeRef.current = scopeKey
            hasHydratedScopeRef.current = false
            lastSavedSnapshotSignatureRef.current = null
            setHasHydratedSession(false)
            setCurrentSessionId(null)
            setSelectedSessionToLoad('')
            setLastSavedAt(null)
            setSaveError(null)
            setHasUnsavedChanges(false)
        }

        if (!userId || !scopedBrandId) return
        if (activeWorkSession === undefined) return
        if (workSessions === undefined) return
        if (hasHydratedScopeRef.current) return

        if (activeWorkSession?.snapshot) {
            restoreWorkspaceFromSnapshot(activeWorkSession.snapshot as CarouselWorkspaceSnapshot)
            setCurrentSessionId(String(activeWorkSession._id))
            setSelectedSessionToLoad(String(activeWorkSession._id))
            lastSavedSnapshotSignatureRef.current = JSON.stringify(activeWorkSession.snapshot)
            setHasUnsavedChanges(false)
            setHasHydratedSession(true)
            hasHydratedScopeRef.current = true
            return
        }

        const latestExisting = Array.isArray(workSessions) && workSessions.length > 0
            ? workSessions[0]
            : null

        if (latestExisting?._id) {
            hasHydratedScopeRef.current = true
            void handleLoadSession(String(latestExisting._id)).catch(() => {
                hasHydratedScopeRef.current = false
                setHasHydratedSession(false)
                log.warn('SESSION', 'Fallo cargando la sesion mas reciente de carrusel')
            }).finally(() => {
                setHasHydratedSession(true)
            })
            return
        }

        hasHydratedScopeRef.current = true
        setHasHydratedSession(true)
        void createWorkSession({
            user_id: userId,
            module: 'carousel',
            brand_id: scopedBrandId,
            title: 'Sesion nueva',
            snapshot: buildWorkspaceSnapshot(),
        }).then((created) => {
            const id = String(created.session_id)
            setCurrentSessionId(id)
            setSelectedSessionToLoad(id)
            setHasUnsavedChanges(false)
        }).catch(() => {
            hasHydratedScopeRef.current = false
            setHasHydratedSession(false)
            log.warn('SESSION', 'No se pudo crear sesion inicial de carrusel')
        })
    }, [
        userId,
        scopedBrandId,
        activeWorkSession,
        workSessions,
        createWorkSession,
        buildWorkspaceSnapshot,
        restoreWorkspaceFromSnapshot,
        handleLoadSession
    ])

    const persistWorkspaceSnapshot = useCallback(async (options?: {
        silent?: boolean
        markSavedAt?: boolean
        force?: boolean
    }) => {
        if (!userId || !scopedBrandId) return
        const isSilent = options?.silent === true
        const shouldMarkSavedAt = options?.markSavedAt !== false
        const forcePersist = options?.force === true
        if (!isSilent) {
            setIsSavingSession(true)
            setSaveError(null)
        }
        try {
            const persistedSlides = await materializePreviewSlidesForSnapshot(previewSlides || [])
            const persistedHistory = await materializeSessionHistoryForSnapshot(previewSessionHistory || [])
            const snapshot = buildWorkspaceSnapshot(persistedSlides, persistedHistory)
            const snapshotSignature = JSON.stringify(snapshot)
            if (!forcePersist && lastSavedSnapshotSignatureRef.current === snapshotSignature) {
                if (shouldMarkSavedAt) {
                    setLastSavedAt(new Date().toISOString())
                }
                return
            }

            const result = await upsertWorkSession({
                user_id: userId,
                module: 'carousel',
                brand_id: scopedBrandId,
                session_id: currentSessionId ? (currentSessionId as Id<'work_sessions'>) : undefined,
                title: buildSessionTitle(snapshot.prompt || 'Sesion de carrusel'),
                snapshot,
            })
            const id = String(result.session_id)
            if (!currentSessionId) {
                setCurrentSessionId(id)
                setSelectedSessionToLoad(id)
            }
            lastSavedSnapshotSignatureRef.current = snapshotSignature
            setHasUnsavedChanges(false)
            if (shouldMarkSavedAt) {
                setLastSavedAt(new Date().toISOString())
            }
        } catch (error) {
            if (!isSilent) {
                setSaveError(error instanceof Error ? error.message : 'No se pudo guardar')
            }
            throw error
        } finally {
            if (!isSilent) {
                setIsSavingSession(false)
            }
        }
    }, [
        userId,
        scopedBrandId,
        previewSlides,
        previewSessionHistory,
        materializePreviewSlidesForSnapshot,
        materializeSessionHistoryForSnapshot,
        buildWorkspaceSnapshot,
        upsertWorkSession,
        currentSessionId,
        buildSessionTitle
    ])

    const handleSaveNow = useCallback(async () => {
        if (!userId || !scopedBrandId || isHydratingSession) return
        try {
            await persistWorkspaceSnapshot({
                silent: false,
                markSavedAt: true,
                force: true,
            })
            log.success('SESSION', 'Guardado manual de sesion de carrusel completado')
        } catch {
            log.warn('SESSION', 'Guardado manual de sesion de carrusel fallido')
        }
    }, [userId, scopedBrandId, isHydratingSession, persistWorkspaceSnapshot])

    const workspaceSignature = useMemo(() => {
        return JSON.stringify(buildWorkspaceSnapshot(previewSlides || [], previewSessionHistory || []))
    }, [buildWorkspaceSnapshot, previewSlides, previewSessionHistory])

    const wasHydratingRef = useRef(false)
    useEffect(() => {
        const wasHydrating = wasHydratingRef.current
        wasHydratingRef.current = isHydratingSession

        if (!wasHydrating || isHydratingSession || !hasHydratedSession) return

        // Establish the restored session as the current saved baseline after
        // any hydration-time normalization or auto-selection has settled.
        lastSavedSnapshotSignatureRef.current = workspaceSignature
        setHasUnsavedChanges(false)
    }, [isHydratingSession, hasHydratedSession, workspaceSignature])

    useEffect(() => {
        if (!hasHydratedSession || isHydratingSession) return
        const lastSaved = lastSavedSnapshotSignatureRef.current
        if (!lastSaved) {
            setHasUnsavedChanges(true)
            return
        }
        setHasUnsavedChanges(lastSaved !== workspaceSignature)
    }, [workspaceSignature, hasHydratedSession, isHydratingSession])

    useEffect(() => {
        if (!hasUnsavedChanges) return
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            event.returnValue = ''
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [hasUnsavedChanges])

    const buildStructuralSignature = useCallback((
        partial?: Partial<{
            prompt: string
            slideCount: number
            structureId: string
        }>
    ) => {
        const value = {
            prompt: partial?.prompt ?? prompt,
            slideCount: partial?.slideCount ?? slideCount,
            structureId: partial?.structureId ?? structureId,
        }
        return JSON.stringify(value)
    }, [prompt, slideCount, structureId])

    const markStructuralReanalysisNeeded = useCallback(() => {
        setNeedsReanalysis(true)
    }, [])

    // Get brand logos
    const brandLogos = brandKit?.logos || []
    const resolveBrandLogoUrl = useCallback((logo: (typeof brandLogos)[number] | undefined) => {
        if (!logo) return undefined
        return typeof logo === 'string' ? logo : logo?.url
    }, [])

    const primaryLogoIndex = useMemo(() => {
        if (!Array.isArray(brandLogos) || brandLogos.length === 0) return null

        const explicitPrimaryUrl = (brandKit?.logo_url || '').trim()
        if (explicitPrimaryUrl) {
            const explicitMatchIndex = brandLogos.findIndex((logo) => resolveBrandLogoUrl(logo) === explicitPrimaryUrl)
            if (explicitMatchIndex >= 0) return explicitMatchIndex
        }

        const selectedMatchIndex = brandLogos.findIndex((logo) => {
            if (typeof logo === 'string') return false
            return logo?.selected !== false
        })
        if (selectedMatchIndex >= 0) return selectedMatchIndex

        return 0
    }, [brandKit?.logo_url, brandLogos, resolveBrandLogoUrl])

    const primaryLogo = useMemo(() => {
        if (primaryLogoIndex !== null) {
            return resolveBrandLogoUrl(brandLogos[primaryLogoIndex]) || brandKit?.logo_url
        }
        return brandKit?.logo_url
    }, [brandKit?.logo_url, brandLogos, primaryLogoIndex, resolveBrandLogoUrl])

    const slideVariantSources = useMemo(() => {
        const originalSlides = Array.isArray(originalScriptSlides) && originalScriptSlides.length > 0
            ? originalScriptSlides
            : (Array.isArray(previewScriptSlides) ? previewScriptSlides : [])
        if (originalSlides.length === 0) return []

        return [
            {
                id: 'original',
                label: 'Original',
                tone: 'Base actual',
                slides: originalSlides,
            },
            ...(Array.isArray(suggestions) ? suggestions : []).map((suggestion, index) => ({
                id: `suggestion-${index}`,
                label: suggestion.title,
                tone: suggestion.subtitle,
                slides: Array.isArray(suggestion.slides) ? suggestion.slides : [],
            }))
        ].filter((source) => source.slides.length > 0)
    }, [originalScriptSlides, previewScriptSlides, suggestions])

    // Get brand colors
    const brandColors = (brandKit?.colors || []).filter(c => c.color)

    // Get brand images
    const brandImages = (brandKit?.images || []).filter(img => img.url)
    const normalizedBrandImages = brandImages.map((img, idx) => ({
        id: img.url,
        url: img.url,
        name: `Imagen ${idx + 1}`
    }))
    const normalizedBrandLogos = brandLogos
        .map((logo, idx) => {
            const url = typeof logo === 'string' ? logo : logo?.url
            if (!url) return null
            return {
                id: `logo-${idx}`,
                url,
                name: typeof logo === 'string' ? `Logo ${idx + 1}` : logo.name || `Logo ${idx + 1}`
            }
        })
        .filter((logo): logo is { id: string; url: string; name?: string } => Boolean(logo))

    const handleSlideCountChange = (delta: number) => {
        const newCount = Math.max(0, Math.min(15, slideCount + delta))
        setSlideCount(newCount)
        setCurrentStep(2)
        if (prompt.trim()) {
            markStructuralReanalysisNeeded()
        } else {
            setCurrentStep(2)
        }
    }

    const refreshBrandColorsFromKit = () => {
        const fallback = (brandKit?.colors || [])
            .filter((c) => c.color)
            .map((c) => {
                const rawRole = ((c.role as string) || 'Acento').trim().toUpperCase()
                let role: 'Texto' | 'Fondo' | 'Acento' = 'Acento'
                if (rawRole.includes('TEXT')) role = 'Texto'
                else if (rawRole.includes('FOND')) role = 'Fondo'
                else if (rawRole.includes('ACENT')) role = 'Acento'
                return {
                    color: c.color.toLowerCase(),
                    role
                }
            })
        setSelectedColors(fallback)
    }

    const handleSelectLogo = (logoId: string | null) => {
        setSelectedLogoId(logoId)
    }

    const handleAiDescriptionChange = (description: string) => {
        setAiImageDescription(description)
    }

    const handleStylePresetChange = useCallback((preset: { id: string; name?: string } | null) => {
        if (!preset) {
            pendingStylePresetSelectionRef.current = null
            setSelectedStylePresetId(null)
            setSelectedStylePresetName(null)
            return
        }

        const previousStyleIds = [...uploadedImages, ...selectedBrandKitImageIds].filter(
            (id) => hasStyleRole(referenceImageRoles[id])
        )
        if (previousStyleIds.length > 0) {
            setUploadedImages((prev) => prev.filter((id) => !previousStyleIds.includes(id)))
            setSelectedBrandKitImageIds((prev) => prev.filter((id) => !previousStyleIds.includes(id)))
        }

        pendingStylePresetSelectionRef.current = preset.id
        setReferenceImageRoles((prev) => {
            const next = { ...prev }
            previousStyleIds.forEach((id) => delete next[id])
            return next
        })
        lastAutoStyleRef.current = null
        setSelectedStylePresetId(preset.id)
        setSelectedStylePresetName(preset.name || 'Estilo')
        setImageError(null)
    }, [referenceImageRoles, selectedBrandKitImageIds, uploadedImages])

    const hasStyleRole = (role?: ReferenceImageRole) => role === 'style' || role === 'style_content'
    const findActiveStyleReference = (
        uploadedIds: string[],
        brandKitIds: string[],
        roles: Record<string, ReferenceImageRole>
    ) => [...uploadedIds, ...brandKitIds].find((id) => hasStyleRole(roles[id]))

    const analyzeStyleReference = async (imageRef: string) => {
        if (!imageRef || pendingStylePresetSelectionRef.current) return
        const cached = styleAnalysisCacheRef.current[imageRef]
        if (cached) {
            setStyleAnalysisDescription(cached)
            return
        }

        setIsImageAnalyzing(true)
        setImageError(null)
        try {
            const auditFlowId = getAuditFlowId?.()
            const payload = imageRef.startsWith('data:image/')
                ? { imageBase64: imageRef, auditFlowId }
                : { imageUrl: imageRef, auditFlowId }
            const response = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const result = await response.json()
            if (!result?.success || !result?.data) {
                throw new Error(result?.error || 'No se pudo analizar la referencia de estilo.')
            }
            const analysis = result.data as VisionAnalysis
            const priority5Block = buildPriority5StyleBlockFromAnalysis(analysis)
            if (!priority5Block) return
            styleAnalysisCacheRef.current[imageRef] = priority5Block
            setStyleAnalysisDescription(priority5Block)
        } catch (error) {
            setImageError(error instanceof Error ? error.message : 'Error analizando referencia de estilo')
        } finally {
            setIsImageAnalyzing(false)
        }
    }

    const getDefaultRoleForNewImage = (): ReferenceImageRole => 'content'

    const handleImageSourceModeChange = (mode: 'upload' | 'brandkit' | 'generate') => {
        setImageSourceMode(mode)
    }

    // TRACK last initialized brand kit for colors
    const [lastInitBrandId, setLastInitBrandId] = useState<string | null>(null)

    // INITIALIZE default colors from brand kit
    useEffect(() => {
        const currentBrandId = brandKit?.id || (brandKit as any)?._id
        if (!brandKit || !currentBrandId) return

        // Only run if the Brand Kit ID has changed
        if (currentBrandId === lastInitBrandId) return
        // Avoid overwriting state while a persisted session for this scope is being restored.
        if (activeWorkSession?.snapshot && !hasHydratedSession) return

        console.log(`[CarouselControlsPanel] Initializing colors for Brand Kit: ${currentBrandId}`)

        // Reset reference/style analysis state to avoid leaking prompt/style data between Brand Kits
        setSelectedBrandKitImageIds([])
        setUploadedImages([])
        setReferenceImageRoles({})
        setImageSourceMode('upload')
        setAiImageDescription('')
        setStyleAnalysisDescription('')
        setCustomStyle('')
        setSelectedStylePresetId(null)
        setSelectedStylePresetName(null)
        setImageError(null)
        styleAnalysisCacheRef.current = {}
        lastAutoStyleRef.current = null

        if (brandKit.colors && brandKit.colors.length > 0) {
            const defaultColors: SelectedColor[] = brandKit.colors
                .map(c => {
                    const rawRole = ((c.role as string) || 'Acento').trim().toUpperCase()
                    let role: 'Texto' | 'Fondo' | 'Acento' = 'Acento'
                    if (rawRole.includes('TEXT')) role = 'Texto'
                    else if (rawRole.includes('FOND')) role = 'Fondo'
                    else if (rawRole.includes('ACENT')) role = 'Acento'

                    return {
                        color: (c.color || (typeof c === 'string' ? c : '')).toLowerCase(),
                        role
                    }
                })
                .filter(c => c.color)

            console.log(`[CarouselControlsPanel] Setting ${defaultColors.length} default colors`)
            setSelectedColors(defaultColors)
        } else {
            console.log('[CarouselControlsPanel] No colors found in Brand Kit, starting empty')
            setSelectedColors([])
        }

        // 2. Initialize Logo - Follow the primary logo defined in Brand Kit
        if (brandKit.logos && brandKit.logos.length > 0) {
            setSelectedLogoId(primaryLogoIndex !== null ? `logo-${primaryLogoIndex}` : null)
        }

        setLastInitBrandId(currentBrandId)
    }, [brandKit, lastInitBrandId, activeWorkSession, hasHydratedSession, primaryLogoIndex])

    useEffect(() => {
        if (!onReferenceImagesChange) return
        const uploaded = uploadedImages.map(url => ({ url, source: 'upload' as const }))
        const brandkit = selectedBrandKitImageIds.map(url => ({ url, source: 'brandkit' as const }))
        onReferenceImagesChange([...uploaded, ...brandkit])
    }, [uploadedImages, selectedBrandKitImageIds, onReferenceImagesChange])

    useEffect(() => {
        if (!selectedStylePresetDetails?.analysis) return
        if (!selectedStylePresetId) return

        const priority5Block = buildPriority5StyleBlockFromAnalysis(selectedStylePresetDetails.analysis as VisionAnalysis)
        if (!priority5Block) return

        pendingStylePresetSelectionRef.current = null
        lastAutoStyleRef.current = null
        setStyleAnalysisDescription(priority5Block)
        setImageError(null)
    }, [selectedStylePresetDetails, selectedStylePresetId])

    useEffect(() => {
        if (selectedStylePresetId || pendingStylePresetSelectionRef.current) return
        const activeStyleRef = findActiveStyleReference(
            uploadedImages,
            selectedBrandKitImageIds,
            referenceImageRoles
        )

        if (!activeStyleRef) {
            lastAutoStyleRef.current = null
            setStyleAnalysisDescription('')
            return
        }

        if (lastAutoStyleRef.current === activeStyleRef && styleAnalysisCacheRef.current[activeStyleRef]) {
            return
        }

        lastAutoStyleRef.current = activeStyleRef
        void analyzeStyleReference(activeStyleRef)
    }, [uploadedImages, selectedBrandKitImageIds, referenceImageRoles, selectedStylePresetId])

    useEffect(() => {
        const selectedPresetPreview =
            (selectedStylePresetId
                ? stylePresets.find((preset) => preset._id === selectedStylePresetId)?.image_url
                : null)
            || selectedStylePresetDetails?.image_url
            || null

        onReferencePreviewStateChange?.({
            uploadedImages,
            selectedBrandKitImageIds,
            referenceImageRoles,
            imageSourceMode,
            selectedStylePresetId,
            selectedStylePresetImageUrl: selectedPresetPreview
        })
    }, [
        uploadedImages,
        selectedBrandKitImageIds,
        referenceImageRoles,
        imageSourceMode,
        selectedStylePresetId,
        selectedStylePresetDetails,
        stylePresets,
        onReferencePreviewStateChange
    ])

    useEffect(() => {
        const nextId = analysisStructure?.id || null
        if (nextId && nextId !== lastAnalysisStructureId) {
            setLastAnalysisStructureId(nextId)
            setHasUserSelectedStructure(false)
        }
    }, [analysisStructure, lastAnalysisStructureId])

    useEffect(() => {
        if (!structures.length) return
        if (hasUserSelectedStructure) return
        if (!structureId || !structures.some((s) => s.id === structureId)) {
            const next = analysisStructure?.id && structures.some((s) => s.id === analysisStructure.id)
                ? analysisStructure.id
                : structures[0]?.id
            if (next) setStructureId(next)
        }
    }, [structures, analysisStructure, hasUserSelectedStructure, structureId])

    useEffect(() => {
        if (compositions.length === 0) return
        setCompositionId(
            pickCompositionId(
                compositions,
                compositionMode,
                compositionId,
                `${structureId}|${prompt.trim()}|${slideCount}`
            )
        )
    }, [structureId, compositionMode, compositionId, prompt, slideCount, compositions])

    useEffect(() => {
        if (!basicSelectedCompositionId) return
        if (basicCompositions.some((composition) => composition.id === basicSelectedCompositionId)) return
        setBasicSelectedCompositionId(null)
    }, [basicSelectedCompositionId, basicCompositions])

    useEffect(() => {
        if (compositionMode !== 'basic') return
        const autoId = pickCompositionId(
            compositions,
            'basic',
            compositionId,
            `${structureId}|${prompt.trim()}|${slideCount}`
        )
        if (autoId !== compositionId) {
            setCompositionId(autoId)
        }
    }, [compositionMode, structureId, compositionId, prompt, slideCount, compositions])

    useEffect(() => {
        if (!structureId || !compositionId) return
        onPreviewCompositionChange?.({ structureId, compositionId })
    }, [structureId, compositionId, onPreviewCompositionChange])

    useEffect(() => {
        if (showAllSteps) {
            setCurrentStep(7)
        }
    }, [showAllSteps])

    useEffect(() => {
        if (!analysisReady) return
        setNeedsReanalysis(false)
        setCurrentStep(7)
        setLastAnalyzedSignature(buildStructuralSignature())
    }, [analysisReady, analysisHook, buildStructuralSignature])

    useEffect(() => {
        if (!lastAnalyzedSignature) return
        const currentSignature = buildStructuralSignature()
        if (currentSignature !== lastAnalyzedSignature) {
            markStructuralReanalysisNeeded()
        }
    }, [lastAnalyzedSignature, buildStructuralSignature, markStructuralReanalysisNeeded])

    useEffect(() => {
        if (showAllSteps) return
        if (compositionMode !== 'basic') return
        if (currentStep < 3) return
        setCurrentStep(prev => (prev < 4 ? 4 : prev))
    }, [compositionMode, currentStep, showAllSteps])

    useEffect(() => {
        if (!showAllSteps && hasReferenceSelection) {
            setCurrentStep(prev => (prev < 6 ? 6 : prev))
        }
    }, [hasReferenceSelection, showAllSteps])

    useEffect(() => {
        if (!slideCountOverride) return
        if (slideCountOverride === slideCount) {
            onSlideCountOverrideApplied?.()
            return
        }
        const newCount = Math.max(1, Math.min(15, slideCountOverride))
        setSlideCount(newCount)
        if (prompt.trim()) {
            setNeedsReanalysis(true)
            setCurrentStep(2)
        } else {
            setCurrentStep(2)
        }
        onSlideCountOverrideApplied?.()
    }, [
        slideCountOverride,
        slideCount,
        prompt,
        onSlideCountOverrideApplied
    ])

    useEffect(() => {
        if (showAllSteps) return
        const target = stepRefs.current[currentStep]
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [currentStep, showAllSteps])

    const handleAspectRatioSelect = (ratio: '1:1' | '4:5' | '3:4') => {
        setAspectRatio(ratio)
        onAspectRatioChange?.(ratio)
        setCurrentStep(prev => (prev < 5 ? 5 : prev))
    }

    const toggleColor = (color: string) => {
        setSelectedColors(prev => {
            // Sequence: Acento -> Texto -> Fondo -> Deseleccionar
            const roles: Array<'Acento' | 'Texto' | 'Fondo'> = ['Acento', 'Texto', 'Fondo']
            const index = prev.findIndex(c => c.color.toLowerCase() === color.toLowerCase())

            if (index === -1) {
                // First click: Add with brand kit role or default to Acento
                const brandColor = brandKit?.colors?.find(c => c.color.toLowerCase() === color.toLowerCase())
                const role = (brandColor?.role || 'Acento') as 'Texto' | 'Fondo' | 'Acento'
                return [...prev, { color, role }]
            } else {
                const roles: Array<'Acento' | 'Texto' | 'Fondo'> = ['Acento', 'Texto', 'Fondo']
                const currentRole = prev[index].role
                const roleIndex = roles.indexOf(currentRole)

                // Sequence: Non-standard -> Acento (0) -> Texto (1) -> Fondo (2) -> Back to Acento (0)
                // The only way to remove is via handleRemoveBrandColor (X button)
                if (roleIndex === -1 || roleIndex === roles.length - 1) {
                    const nextRole = roles[0]
                    const newColors = [...prev]
                    newColors[index] = { ...newColors[index], role: nextRole }
                    console.log(`[Carousel] Role cycle: ${currentRole} -> ${nextRole}`)
                    return newColors
                } else {
                    // Cycle to next role
                    const newRole = roles[roleIndex + 1]
                    const newColors = [...prev]
                    newColors[index] = { ...newColors[index], role: newRole }
                    console.log(`[Carousel] Role cycle: ${currentRole} -> ${newRole}`)
                    return newColors
                }
            }
        })
    }

    const handleAddCustomColor = (color: string) => {
        console.log('[Carousel] handleAddCustomColor request:', color)
        const role: 'Texto' | 'Fondo' | 'Acento' = 'Acento'
        setSelectedColors(prev => {
            const exists = prev.some(c => c.color.toLowerCase() === color.toLowerCase())
            if (exists) {
                console.log('[Carousel] Color already exists, skipping add')
                return prev
            }
            const newColors = [...prev, { color, role }]
            console.log('[Carousel] New selectedColors after ADD:', newColors.map(c => c.color))
            return newColors
        })
    }

    const handleRemoveBrandColor = (color: string) => {
        console.log('[Carousel] handleRemoveBrandColor attempt:', color)
        setSelectedColors(prev => {
            const before = prev.length
            const newColors = prev.filter(c => c.color.toLowerCase() !== color.toLowerCase())
            const after = newColors.length
            console.log(`[Carousel] Color removed: ${color}. List size ${before} -> ${after}`)
            if (before === after) {
                console.warn('[Carousel] NO COLOR WAS REMOVED! Mismatch?', color, 'vs', prev.map(c => c.color))
            }
            return newColors
        })
    }

    const toggleBrandKitImage = (id: string, roleHint: ReferenceImageRole = 'content') => {
        setSelectedBrandKitImageIds((prev) => {
            if (prev.includes(id)) {
                setReferenceImageRoles((prevRoles) => {
                    const next = { ...prevRoles }
                    delete next[id]
                    return next
                })
                return prev.filter((u) => u !== id)
            }

            const nextBrandKit = [...prev, id]
            setReferenceImageRoles((prevRoles) => {
                const next = { ...prevRoles }
                next[id] = roleHint
                return next
            })
            return nextBrandKit
        })
    }

    const handleUploadImage = async (file: File, roleHint?: ReferenceImageRole) => {
        const maxTotal = 10
        const totalSelected = uploadedImages.length + selectedBrandKitImageIds.length
        if (totalSelected >= maxTotal) return

        setIsImageAnalyzing(true)
        setImageError(null)
        try {
            const base64 = await resizeImage(file, {
                maxWidth: 1536,
                maxHeight: 1536,
                quality: 0.8,
                format: 'image/jpeg'
            })
            setUploadedImages((prev) => {
                const nextUploaded = [...prev, base64]
                setReferenceImageRoles((prevRoles) => {
                    const next = { ...prevRoles }
                    next[base64] = roleHint || getDefaultRoleForNewImage()
                    return next
                })
                return nextUploaded
            })
        } catch (error) {
            setImageError(error instanceof Error ? error.message : 'Error al subir imagen')
        } finally {
            setIsImageAnalyzing(false)
        }
    }

    const removeUploadedImage = (url: string) => {
        setUploadedImages(prev => prev.filter(u => u !== url))
        setReferenceImageRoles(prev => {
            const next = { ...prev }
            delete next[url]
            return next
        })
    }

    const clearUploadedImages = () => {
        setReferenceImageRoles((prev) => {
            const next = { ...prev }
            uploadedImages.forEach((id) => delete next[id])
            return next
        })
        setUploadedImages([])
    }
    const clearBrandKitImages = () => {
        setReferenceImageRoles((prev) => {
            const next = { ...prev }
            selectedBrandKitImageIds.forEach((id) => delete next[id])
            return next
        })
        setSelectedBrandKitImageIds([])
    }

    const setReferenceImageRole = (imageId: string, role: ReferenceImageRole) => {
        const isStyleSelection = role === 'style' || role === 'style_content'
        const normalizedRole: ReferenceImageRole = isStyleSelection ? 'style' : role

        if (isStyleSelection) {
            const previousStyleIds = [...uploadedImages, ...selectedBrandKitImageIds].filter(
                (id) => id !== imageId && hasStyleRole(referenceImageRoles[id])
            )

            if (previousStyleIds.length > 0) {
                setUploadedImages((prev) => prev.filter((id) => !previousStyleIds.includes(id)))
                setSelectedBrandKitImageIds((prev) => prev.filter((id) => !previousStyleIds.includes(id)))
            }
        }

        setReferenceImageRoles((prev) => {
            const next = { ...prev }

            if (isStyleSelection) {
                Object.keys(next).forEach((id) => {
                    if (id === imageId) return
                    if (hasStyleRole(next[id])) {
                        delete next[id]
                    }
                })
            }

            next[imageId] = normalizedRole
            return next
        })

        if (isStyleSelection) {
            pendingStylePresetSelectionRef.current = null
            setSelectedStylePresetId(null)
            setSelectedStylePresetName(null)
        }
    }

    const handleContentUpload = (file: File) => {
        return handleUploadImage(file, 'content')
    }

    const handleStyleUpload = (file: File) => {
        return handleUploadImage(file, 'style')
    }

    const handleAuxLogoUpload = (file: File) => {
        return handleUploadImage(file, 'logo')
    }

    const toggleBrandKitContentImage = (id: string) => {
        toggleBrandKitImage(id, 'content')
    }

    const toggleBrandKitStyleImage = (id: string) => {
        const isSelected = selectedBrandKitImageIds.includes(id)
        if (!isSelected) {
            const previousStyleIds = [...uploadedImages, ...selectedBrandKitImageIds].filter(
                (currentId) => hasStyleRole(referenceImageRoles[currentId])
            )
            if (previousStyleIds.length > 0) {
                setUploadedImages((prev) => prev.filter((currentId) => !previousStyleIds.includes(currentId)))
                setSelectedBrandKitImageIds((prev) => prev.filter((currentId) => !previousStyleIds.includes(currentId)))
                setReferenceImageRoles((prev) => {
                    const next = { ...prev }
                    previousStyleIds.forEach((currentId) => delete next[currentId])
                    return next
                })
            }
        }
        toggleBrandKitImage(id, 'style')
    }

    const toggleBrandKitAuxLogo = (id: string) => {
        toggleBrandKitImage(id, 'logo')
    }

    const handleEditSlide = (index: number) => {
        setEditingSlide(index)
        setEditText(slides[index]?.customText || '')
    }

    const handleSaveSlideEdit = () => {
        if (editingSlide !== null) {
            const newSlides = [...slides]
            if (!newSlides[editingSlide]) {
                newSlides[editingSlide] = { index: editingSlide }
            }
            newSlides[editingSlide].customText = editText || undefined
            setSlides(newSlides)
            setEditingSlide(null)
            setEditText('')
        }
    }

    const resolveSelectedLogoUrl = () => {
        if (!selectedLogoId) return primaryLogo
        const match = selectedLogoId.match(/^logo-(\d+)$/)
        if (match) {
            const idx = Number(match[1])
            const entry = brandLogos[idx]
            if (!entry) return primaryLogo
            return typeof entry === 'string' ? entry : entry?.url || primaryLogo
        }
        return primaryLogo
    }

    useEffect(() => {
        if (!onSelectedLogoChange) return
        onSelectedLogoChange(selectedLogoId, resolveSelectedLogoUrl())
    }, [selectedLogoId, brandLogos, primaryLogo, onSelectedLogoChange])

    const buildSettings = (overrides: Partial<CarouselSettings> = {}) => {
        const promptValue = overrides.prompt ?? prompt
        const slideCountValue = overrides.slideCount ?? slideCount
        const structureIdValue = overrides.structureId ?? structureId
        const resolvedCompositionId = pickCompositionId(
            compositions,
            compositionMode,
            overrides.compositionId ?? compositionId,
            `${structureIdValue}|${promptValue.trim()}|${slideCountValue}`
        )

        const finalSlides = slides.length === slideCountValue
            ? slides
            : Array.from({ length: slideCountValue }, (_, i) => slides[i] || { index: i })

        const allReferenceImageIds = [...uploadedImages, ...selectedBrandKitImageIds]
        const selectedReferenceImages = allReferenceImageIds
            .map((url) => ({
                url,
                role: referenceImageRoles[url] || 'content' as ReferenceImageRole
            }))
            .filter((item) => {
                if (imageSourceMode === 'generate' && item.role === 'content') return false
                return true
            })
            .sort((a, b) => {
                const priority: Record<ReferenceImageRole, number> = {
                    style: 0,
                    style_content: 1,
                    logo: 2,
                    content: 3
                }
                return priority[a.role] - priority[b.role]
            })

        const mergedStyleDirectives = mergeCustomStyleIntoStyleDirectives(
            styleAnalysisDescription,
            customStyle
        )

        const baseSettings = {
            prompt: promptValue,
            slideCount: slideCountValue,
            aspectRatio: overrides.aspectRatio ?? aspectRatio,
            style: STYLE_OPTIONS.find(s => s.id === style)?.label || 'Minimalista',
            slides: finalSlides,
            compositionId: resolvedCompositionId,
            structureId: structureIdValue,
            imageSourceMode: overrides.imageSourceMode ?? imageSourceMode,
            aiImageDescription: (overrides.aiImageDescription ?? aiImageDescription).trim() || undefined,
            aiStyleDirectives: mergedStyleDirectives || undefined,
            customStyleText: (customStyle || '').trim() || undefined,
            selectedLogoUrl: resolveSelectedLogoUrl(),
            selectedColors: selectedColors.length > 0 ? selectedColors : brandColors.slice(0, 3).map(c => ({
                color: c.color,
                role: (c.role || 'Acento') as any
            })),
            selectedReferenceImages,
            selectedImageUrls: selectedReferenceImages.map((item) => item.url),
            includeLogoOnSlides
        }
        return { ...baseSettings, ...overrides }
    }

    const handleGenerate = () => {
        if (!prompt.trim() || slideCount < 1) return
        onGenerate(buildSettings())
    }

    const handleAnalyze = async () => {
        if (!prompt.trim() || slideCount < 1) return
        if (generatedCount > 0) {
            onInvalidatePreview?.()
        }
        await onAnalyze(buildSettings())
        setNeedsReanalysis(false)
        setLastAnalyzedSignature(buildStructuralSignature())
    }

    const hasStructuralAnalysis = Boolean(lastAnalyzedSignature)
    const primaryActionRequiresReanalysis = needsReanalysis && hasStructuralAnalysis
    const primaryActionDisabled = primaryActionRequiresReanalysis ? !canAnalyze : !canGenerate
    const handlePrimaryAction = () => {
        if (primaryActionRequiresReanalysis) {
            void handleAnalyze()
            return
        }
        handleGenerate()
    }

    return (
        <div className={STUDIO_CONTROLS_SHELL_CLASS}>
            <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-5">
                                {/* SECTION: Sessions */}
                <div className={`${STUDIO_PANEL_CARD_PADDED_LG_CLASS} space-y-4`}>
                    <SectionHeader
                        icon={History}
                        title="Historial"
                        className="mb-2"
                        extra={
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                                    {isSavingSession ? (
                                        <>
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : saveError ? (
                                        <>
                                            <AlertCircle className="h-3 w-3" />
                                            Error
                                        </>
                                    ) : hasUnsavedChanges ? (
                                        'Hay cambios por guardar'
                                    ) : lastSavedAt ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3" />
                                            {`Guardado ${new Date(lastSavedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                                        </>
                                    ) : 'Sin cambios'}
                                </span>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => void handleSaveNow()}
                                    disabled={!userId || !scopedBrandId || isHydratingSession || isSavingSession}
                                    title="Guardar sesion ahora"
                                >
                                    {isSavingSession ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Save
                                            className={cn(
                                                "h-3.5 w-3.5 transition-colors",
                                                hasUnsavedChanges
                                                    ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.45)]"
                                                    : "text-muted-foreground/55"
                                            )}
                                        />
                                    )}
                                </Button>
                            </div>
                        }
                    />
                    <div className="space-y-3 pt-1.5">
                        <select
                            className="h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-xs"
                            value={selectedSessionToLoad || currentSessionId || ''}
                            onChange={(event) => {
                                const id = event.target.value
                                setSelectedSessionToLoad(id)
                                if (id && id !== currentSessionId) {
                                    void handleLoadSession(id).then((loaded) => {
                                        if (!loaded) {
                                            setSelectedSessionToLoad(currentSessionId || '')
                                        }
                                    })
                                }
                            }}
                        >
                            {(workSessions || []).length === 0 ? (
                                <option value="">Sin sesiones</option>
                            ) : null}
                            {(workSessions || []).map((session) => (
                                <option key={String(session._id)} value={String(session._id)}>
                                    {buildSessionTitle(session.title || 'Sesion sin titulo')} {session.active ? '(Activa)' : ''} - {new Date(session.updated_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px] gap-1"
                            onClick={() => void createNewCarouselSession()}
                        >
                            <Plus className="w-3 h-3" />
                            Nueva
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => void handleDeleteCurrentSession()}
                            title="Borrar sesion"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px]"
                            onClick={() => void handleClearAllSessions()}
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>

                {/* Slide Count */}
                {isStepVisible(1) && (
                <div ref={(el) => { stepRefs.current[1] = el }} className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-3`}>
                    <SectionHeader icon={GalleryHorizontal} title="Numero de diapositivas" />
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => handleSlideCountChange(-1)} disabled={slideCount <= 0}>
                            <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                            <span className="text-3xl font-bold">{slideCount}</span>
                            <span className="text-sm text-muted-foreground ml-2">slides</span>
                        </div>
                        <Button variant="outline" size="icon" onClick={() => handleSlideCountChange(1)} disabled={slideCount >= 15}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Entre 1 y 15 diapositivas.</p>
                </div>
                )}

                {/* Prompt */}
                {isStepVisible(2) && (
                <div ref={(el) => { stepRefs.current[2] = el }} className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-3`}>
                    <SectionHeader
                        icon={Wand2}
                        title="¿Qué quieres crear?"
                    />
                    <div className="relative">
                        <Textarea
                            placeholder="Ej: Quiero dar valor real. Sácame los 5 errores típicos que cometemos los españoles al hablar inglés y cómo corregirlos. Algo que la gente quiera guardar para repasar luego."
                            value={prompt}
                            onChange={(e) => {
                                const nextPrompt = e.target.value
                                setPrompt(nextPrompt)
                                markStructuralReanalysisNeeded()
                                setCurrentStep(2)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    if (canAnalyze) {
                                        handleAnalyze()
                                    }
                                }
                            }}
                            className="min-h-[100px] text-sm resize-none bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary pb-12 pr-2 transition-all"
                        />
                        <div className="absolute left-2 right-2 bottom-2 flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                                {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                                {isAnalyzing && onCancelAnalyze && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="link"
                                            onClick={onCancelAnalyze}
                                            className="h-6 px-1 text-[11px]"
                                        >
                                            Detener
                                        </Button>
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: isCancelingAnalyze ? 1 : 0 }}
                                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                                            className="text-[10px] uppercase tracking-wider text-muted-foreground"
                                        >
                                            Cancelando...
                                        </motion.span>
                                    </div>
                                )}
                            </div>
                            <Button
                                size="sm"
                                onClick={handleAnalyze}
                                disabled={!canAnalyze}
                                className="group feedback-action ml-auto h-8 px-3 sm:px-4 text-[11px] sm:text-xs uppercase font-bold tracking-wider bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 whitespace-nowrap"
                            >
                                {primaryActionRequiresReanalysis ? 'Reanalizar' : 'Analizar'}
                            </Button>
                        </div>
                    </div>
                    <SuggestionsList
                        suggestions={suggestions}
                        hasOriginalState={hasOriginalSuggestion}
                        onApply={(index) => onApplySuggestion?.(index)}
                        onUndo={() => onUndoSuggestion?.()}
                    />
                    {previewScriptSlides && previewScriptSlides.length > 0 && slideVariantSources.length > 1 && (
                        <>
                            <motion.div
                                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                                transition={shouldReduceMotion ? undefined : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className="rounded-2xl border border-border/70 bg-gradient-to-br from-background via-background to-primary/5 p-3 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                            <Layers className="h-3 w-3" />
                                            Composición avanzada
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Mezcla lo mejor de cada propuesta
                                        </p>
                                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                                            Abre un editor amplio para elegir la mejor versión de cada diapositiva sin pelearte con el panel lateral.
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => setIsAdvancedCompositionOpen(true)}
                                        className="h-8 rounded-full px-3 text-[11px]"
                                    >
                                        Abrir editor
                                    </Button>
                                </div>
                            </motion.div>

                            <Dialog open={isAdvancedCompositionOpen} onOpenChange={setIsAdvancedCompositionOpen}>
                                <DialogContent className="grid h-[92vh] w-[calc(100vw-3rem)] max-w-[1600px] grid-rows-[auto,minmax(0,1fr),auto] overflow-hidden p-0 sm:!max-w-[1600px]">
                                    <DialogHeader className="shrink-0 border-b border-border/70 bg-gradient-to-r from-background to-primary/5 px-6 py-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                                    <Layers className="h-3.5 w-3.5" />
                                                    Composición avanzada
                                                </div>
                                                <DialogTitle className="text-xl font-semibold">
                                                    Monta el carrusel slide a slide
                                                </DialogTitle>
                                                <DialogDescription className="max-w-3xl text-sm leading-relaxed">
                                                    Cada fila representa una diapositiva. En horizontal ves la opción original y todas las variantes disponibles para esa posición.
                                                </DialogDescription>
                                            </div>
                                            {hasOriginalSuggestion && onUndoSuggestion && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={onUndoSuggestion}
                                                    className="h-9 rounded-full px-4 text-[11px]"
                                                >
                                                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                                    Volver al original
                                                </Button>
                                            )}
                                        </div>
                                    </DialogHeader>

                                    <div className="min-h-0 overflow-y-auto px-8 py-6">
                                        <div className="space-y-4">
                                            {previewScriptSlides.map((slide, slideIndex) => {
                                                const selectedSource = slideVariantSelection[slideIndex] || 'original'
                                                return (
                                                    <div
                                                        key={`variant-row-modal-${slideIndex}`}
                                                        className="rounded-2xl border border-border/60 bg-background/80 p-4"
                                                    >
                                                        <div className="mb-3 flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/12 px-2 text-sm font-bold text-primary">
                                                                    {slideIndex + 1}
                                                                </span>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-foreground">
                                                                        {slide.role === 'hook' ? 'Hook' : slide.role === 'cta' ? 'Cierre / CTA' : `Slide ${slideIndex + 1}`}
                                                                    </p>
                                                                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                                                        Activa: {slideVariantSources.find((source) => source.id === selectedSource)?.label || 'Original'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                                                {slideVariantSources.length} variantes
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                                                                {slideVariantSources.map((source) => {
                                                                    const candidate = source.slides[slideIndex]
                                                                    if (!candidate) return null
                                                                    const isSelected = selectedSource === source.id
                                                                    return (
                                                                        <button
                                                                            key={`${source.id}-${slideIndex}`}
                                                                            type="button"
                                                                            onClick={() => onApplySlideVariant?.(slideIndex, source.id)}
                                                                            className={cn(
                                                                                "group min-h-[220px] w-full rounded-2xl border p-4 text-left transition-all duration-200",
                                                                                isSelected
                                                                                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20"
                                                                                    : "border-border/70 bg-muted/30 hover:border-primary/40 hover:bg-primary/5"
                                                                            )}
                                                                        >
                                                                            <div className="flex items-start justify-between gap-2">
                                                                                <div>
                                                                                    <p className="text-xs font-semibold text-foreground">
                                                                                        {source.label}
                                                                                    </p>
                                                                                    <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                                                                                        {source.tone}
                                                                                    </p>
                                                                                </div>
                                                                                {isSelected && (
                                                                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                                                                        ✓
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <div className="mt-3 space-y-2">
                                                                                <p className="line-clamp-2 text-base font-semibold leading-tight text-foreground">
                                                                                    {candidate.title || 'Sin título'}
                                                                                </p>
                                                                                <p className="line-clamp-5 text-[12px] leading-relaxed text-muted-foreground">
                                                                                    {candidate.description || 'Sin descripción'}
                                                                                </p>
                                                                            </div>
                                                                        </button>
                                                                    )
                                                                })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/70 bg-background/95 px-6 py-4">
                                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                                            Los cambios se aplican al instante mientras eliges variantes.
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsAdvancedCompositionOpen(false)}
                                                className="h-9 rounded-full px-4 text-[11px]"
                                            >
                                                Seguir editando después
                                            </Button>
                                            <Button
                                                onClick={() => setIsAdvancedCompositionOpen(false)}
                                                className="h-9 rounded-full px-4 text-[11px]"
                                            >
                                                Usar esta composición
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
                )}

                {/* Composition */}
                {isStepVisible(3) && (
                <div ref={(el) => { stepRefs.current[3] = el }} className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-3`}>
                    <SectionHeader
                        icon={Layout}
                        title="Diseño"
                        extra={
                            <div className="flex items-center gap-2">
                                <span className={cn("text-[10px] font-medium", compositionMode === 'advanced' ? "text-primary" : "text-muted-foreground")}>
                                    Avanzado
                                </span>
                                <Switch
                                    checked={compositionMode === 'advanced'}
                                    onCheckedChange={(checked) => {
                                        const nextMode: CompositionMode = checked ? 'advanced' : 'basic'
                                        setCompositionMode(nextMode)
                                        setCompositionId(
                                            pickCompositionId(
                                                compositions,
                                                nextMode,
                                                compositionId,
                                                `${structureId}|${prompt.trim()}|${slideCount}`
                                            )
                                        )
                                    }}
                                    aria-label="Activar modo avanzado de diseño"
                                />
                            </div>
                        }
                    />
                    <Select
                        value={structureId}
                        onValueChange={(value) => {
                            setHasUserSelectedStructure(true)
                            setStructureId(value)
                            markStructuralReanalysisNeeded()
                        }}
                    >
                        <SelectTrigger
                            size="sm"
                            className="h-6 px-2 text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full shadow-none"
                        >
                            <SelectValue placeholder="Estructura" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            {structures.map((structure) => (
                                <SelectItem key={structure.id} value={structure.id}>
                                    <span className="flex items-center justify-between w-full gap-2">
                                        <span>{structure.name}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                            {structure.id}
                                        </span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {compositionMode === 'advanced' ? (
                        <>
                            <CarouselCompositionSelector
                                key={`${structureId}-advanced`}
                                compositions={advancedCompositions}
                                selectedId={compositionId}
                                onSelect={(id) => {
                                    setCompositionId(id)
                                    setCurrentStep(prev => (prev < 4 ? 4 : prev))
                                }}
                            />
                            <p className="text-[11px] text-muted-foreground leading-snug">
                                Modo avanzado: eliges manualmente el diseño.
                            </p>
                        </>
                    ) : (
                        <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
                            <p className="text-[11px] text-primary font-medium leading-relaxed">
                                Modo básico activo: el diseño se selecciona automáticamente según lo que escribas. Activa el modo avanzado si quieres más control.
                            </p>
                        </div>
                    )}
                </div>
                )}

                {/* Format */}
                {isStepVisible(4) && (
                <div ref={(el) => { stepRefs.current[4] = el }} className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-3`}>
                    <SectionHeader icon={Layers} title="Formato" />
                    <div className="space-y-2">
                        <button
                            onClick={() => handleAspectRatioSelect('4:5')}
                            className={cn(
                                "feedback-action flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
                                aspectRatio === '4:5' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-8 h-10 rounded bg-muted border border-border" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">Vertical Estándar (Retrato)</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">4:5</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    1080x1350 · el estándar más seguro para evitar recortes en dispositivos antiguos o Meta Ads.
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleAspectRatioSelect('3:4')}
                            className={cn(
                                "feedback-action flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
                                aspectRatio === '3:4' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-8 h-10 rounded bg-muted border border-border" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">Tall / Vertical Extendido (Tendencia 2026)</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">3:4</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    1080x1440 · +6.6% pantalla · domina el feed y encaja con la nueva cuadrícula vertical.
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleAspectRatioSelect('1:1')}
                            className={cn(
                                "feedback-action flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
                                aspectRatio === '1:1' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-10 h-10 rounded bg-muted border border-border" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">Cuadrado (Tradicional)</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">1:1</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    1080x1080 · formato original y clásico para diseños equilibrados.
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
                )}

                {/* Image */}
                {isStepVisible(5) && (
                    <>
                        <div ref={(el) => { stepRefs.current[5] = el }} className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-3`}>
                            <SectionHeader
                                icon={ImagePlus}
                                title={imageSourceMode === 'generate' ? 'Contenido generado por IA' : 'Contenido del usuario'}
                                extra={(
                                    <Switch
                                        checked={imageSourceMode === 'generate'}
                                        onCheckedChange={(checked) => handleImageSourceModeChange(checked ? 'generate' : 'upload')}
                                    />
                                )}
                            />
                            <ContentImageCard
                                mode={imageSourceMode}
                                onModeChange={handleImageSourceModeChange}
                                uploadedImages={uploadedImages}
                                onUpload={handleContentUpload}
                                onRemoveUploadedImage={removeUploadedImage}
                                onClearUploadedImages={clearUploadedImages}
                                brandKitImages={normalizedBrandImages}
                                selectedBrandKitImageIds={selectedBrandKitImageIds}
                                onToggleBrandKitImage={toggleBrandKitContentImage}
                                onClearBrandKitImages={clearBrandKitImages}
                                referenceImageRoles={referenceImageRoles}
                                onReferenceRoleChange={setReferenceImageRole}
                                aiImageDescription={aiImageDescription}
                                onAiDescriptionChange={handleAiDescriptionChange}
                                suggestedImagePrompts={suggestedImagePrompts}
                                isAnalyzing={isImageAnalyzing}
                                error={imageError}
                                visionAnalysis={null}
                            />
                        </div>

                        <div className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-3`}>
                            <SectionHeader icon={Palette} title="Estilo" />
                            <StyleImageCard
                                uploadedImages={uploadedImages}
                                onUpload={handleStyleUpload}
                                onRemoveUploadedImage={removeUploadedImage}
                                brandKitImages={normalizedBrandImages}
                                selectedBrandKitImageIds={selectedBrandKitImageIds}
                                onToggleBrandKitImage={toggleBrandKitStyleImage}
                                referenceImageRoles={referenceImageRoles}
                                onReferenceRoleChange={setReferenceImageRole}
                                stylePresets={stylePresets}
                                stylePresetsStatus={stylePresetsStatus}
                                selectedStylePresetId={selectedStylePresetId}
                                selectedStylePresetName={selectedStylePresetName}
                                onSelectStylePreset={handleStylePresetChange}
                                isAnalyzing={isImageAnalyzing}
                                error={imageError}
                            />
                        </div>

                        <div className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-3`}>
                            <AuxiliaryLogosCard
                                uploadedImages={uploadedImages}
                                onUpload={handleAuxLogoUpload}
                                onRemoveUploadedImage={removeUploadedImage}
                                brandKitImages={normalizedBrandImages}
                                brandKitLogos={normalizedBrandLogos}
                                selectedBrandKitImageIds={selectedBrandKitImageIds}
                                onToggleBrandKitImage={toggleBrandKitAuxLogo}
                                referenceImageRoles={referenceImageRoles}
                                onReferenceRoleChange={setReferenceImageRole}
                            />
                        </div>

                        <div className={`${STUDIO_PANEL_CARD_PADDED_CLASS} space-y-6`}>
                            <SectionHeader icon={Fingerprint} title="Kit de marca" />

                            <div className="space-y-3">
                                <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">Logo</p>
                                <BrandingConfigurator
                                    selectedLayout={null}
                                    selectedLogoId={selectedLogoId}
                                    selectedBrandColors={[]}
                                    onSelectLogo={handleSelectLogo}
                                    onToggleBrandColor={() => { }}
                                    onAddCustomColor={() => { }}
                                    showLogo={true}
                                    showColors={false}
                                    showTypography={false}
                                    showBrandTexts={false}
                                    rawMessage={prompt}
                                    debugLabel="Carousel-Logo"
                                />
                                {(brandLogos.length > 0 || primaryLogo) && (
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium">Aplicar logo en todas</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIncludeLogoOnSlides(!includeLogoOnSlides)
                                            }}
                                            className={cn(
                                                'w-10 h-6 rounded-full transition-colors',
                                                includeLogoOnSlides ? 'bg-primary' : 'bg-muted'
                                            )}
                                        >
                                            <div className={cn(
                                                'w-4 h-4 rounded-full bg-white transition-transform mx-1',
                                                includeLogoOnSlides ? 'translate-x-4' : 'translate-x-0'
                                            )} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 border-t border-border/60 pt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[11px] font-semibold text-foreground/90 uppercase tracking-[0.08em]">Colores</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={refreshBrandColorsFromKit}
                                        className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Recargar
                                    </Button>
                                </div>
                                <BrandingConfigurator
                                    selectedLayout={null}
                                    selectedLogoId={null}
                                    selectedBrandColors={selectedColors}
                                    onSelectLogo={() => { }}
                                    onToggleBrandColor={toggleColor}
                                    onRemoveBrandColor={handleRemoveBrandColor}
                                    onAddCustomColor={handleAddCustomColor}
                                    showLogo={false}
                                    showColors={true}
                                    showTypography={false}
                                    showBrandTexts={false}
                                    rawMessage={prompt}
                                    debugLabel="Carousel-Colors"
                                    onlyShowSelectedColors={true}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Generate */}
            <div className="p-6 border-t border-border/40">
                {primaryActionRequiresReanalysis && (
                    <div className="mb-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                            Hay cambios estructurales pendientes. La vista previa actual puede estar basada en un análisis anterior.
                            Reanaliza antes de generar para reconstruir la narrativa con el prompt, la narrativa y el número de diapositivas actuales.
                        </p>
                    </div>
                )}
                <Button
                    onClick={handlePrimaryAction}
                    disabled={primaryActionDisabled}
                    className="group feedback-action w-full h-12 text-base font-semibold disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {primaryActionRequiresReanalysis ? 'Reanalizando...' : 'Analizando...'}
                        </>
                    ) : isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generando {generatedCount}/{totalSlides}...
                        </>
                    ) : primaryActionRequiresReanalysis ? (
                        <>
                            <RotateCcw className="w-5 h-5 mr-2 motion-safe:transition-transform motion-safe:duration-200 group-hover:-rotate-45" />
                            REANALIZAR CARRUSEL
                        </>
                    ) : generatedCount > 0 ? (
                        <>
                            <RotateCcw className="w-5 h-5 mr-2 motion-safe:transition-transform motion-safe:duration-200 group-hover:-rotate-45" />
                            Generar otro carrusel con mismos ajustes
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2 motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-110 group-hover:rotate-6" />
                            GENERAR CARRUSEL
                        </>
                    )}
                </Button>

                {isGenerating && onCancelGenerate && (
                    <div className="mt-2 flex items-center justify-between">
                        <Button
                            onClick={onCancelGenerate}
                            variant="link"
                            size="sm"
                            className="h-7 px-0 text-[11px] text-muted-foreground hover:text-destructive"
                            title="Detener generación"
                        >
                            Detener generación
                        </Button>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isCancelingGenerate ? 1 : 0 }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                            className="text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                            Cancelando...
                        </motion.span>
                    </div>
                )}

                {!brandKit && (
                    <p className="text-xs text-destructive text-center mt-2">
                        Selecciona un Brand Kit para continuar
                    </p>
                )}
            </div>
            <Dialog
                open={sessionDecisionModal.open}
                onOpenChange={(open) => {
                    if (!open) {
                        closeSessionDecisionModal(null)
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{sessionDecisionModal.title}</DialogTitle>
                        <DialogDescription>{sessionDecisionModal.description}</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-wrap justify-end gap-2">
                        {sessionDecisionModal.buttons.map((button) => (
                            <Button
                                key={button.id}
                                variant={button.variant || 'default'}
                                onClick={() => closeSessionDecisionModal(button.id)}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}



