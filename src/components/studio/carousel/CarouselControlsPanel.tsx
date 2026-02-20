'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Minus, Sparkles, Loader2, Palette, Wand2, Layout, Layers, ImagePlus, Fingerprint, GalleryHorizontal, Star, Bookmark as BookmarkIcon, SquarePlus, Square, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BrandDNA } from '@/lib/brand-types'
import type { CarouselSuggestion } from '@/app/actions/generate-carousel'
import { ImageReferenceSelector } from '@/components/studio/creation-flow/ImageReferenceSelector'
import { resizeImage } from '@/lib/image-utils'
import { getAutomaticBasicComposition } from '@/lib/carousel-selection'
import { CarouselCompositionSelector } from '@/components/studio/carousel/CarouselCompositionSelector'
import { BrandingConfigurator } from '@/components/studio/creation-flow/BrandingConfigurator'
import type { SelectedColor } from '@/lib/creation-flow-types'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { PresetsCarousel } from '@/components/studio/creation-flow/PresetsCarousel'
import { SavePresetDialog } from '@/components/studio/creation-flow/SavePresetDialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
    // Brand Kit Context
    selectedLogoUrl?: string
    selectedColors: { color: string; role: string }[]
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
    mode: 'basic' | 'advanced'
    order: number
}

interface CarouselControlsPanelProps {
    onAnalyze: (settings: CarouselSettings) => Promise<void>
    onGenerate: (settings: CarouselSettings) => void
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
    onUndoSuggestion?: () => void
    hasOriginalSuggestion?: boolean
}

const SectionHeader = ({
    icon: Icon,
    title,
    extra,
    className,
}: {
    icon: React.ElementType
    title: string
    extra?: React.ReactNode
    className?: string
}) => (
    <div className={cn("flex items-center justify-between mb-3", className)}>
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h3>
        </div>
        {extra}
    </div>
)

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
    onUndoSuggestion,
    hasOriginalSuggestion = false
}: CarouselControlsPanelProps) {
    const createPreset = useMutation(api.presets.create)
    const presetsData = useQuery(api.presets.list, userId ? {
        userId,
        brandId: brandKit?.id as any
    } : 'skip')
    const structuresData = useQuery(api.carousel.listStructures, { includeInactive: false }) as DbStructure[] | undefined
    const structures: UiStructure[] = (structuresData || [])
        .map((s) => ({ id: s.structure_id, name: s.name, summary: s.summary, order: s.order }))
        .sort((a, b) => a.order - b.order)
    const hasPresets = (presetsData?.user?.some((preset: any) => preset?.state?.presetType === 'carousel') ?? false)
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [isSavingPreset, setIsSavingPreset] = useState(false)
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
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'brandkit' | 'generate'>('upload')
    const [aiImageDescription, setAiImageDescription] = useState('')
    const [isImageAnalyzing, setIsImageAnalyzing] = useState(false)
    const [imageError, setImageError] = useState<string | null>(null)
    const [includeLogoOnSlides, setIncludeLogoOnSlides] = useState(true)
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1)
    const [needsReanalysis, setNeedsReanalysis] = useState(false)
    const [lastAnalyzedPrompt, setLastAnalyzedPrompt] = useState('')
    const showAllSteps = generatedCount > 0 && !needsReanalysis
    const stepRefs = useRef<Array<HTMLDivElement | null>>([])
    const shouldReduceMotion = useReducedMotion()
    const selectedImageCount = uploadedImages.length + selectedBrandKitImageIds.length
    const hasReferenceSelection = selectedImageCount > 0 || (imageSourceMode === 'generate' && aiImageDescription.trim().length > 0)
    const canGenerate = prompt.trim().length > 0 && slideCount > 0 && !isGenerating && brandKit !== null && currentStep >= 7 && !needsReanalysis
    const canAnalyze = prompt.trim().length > 0 && slideCount > 0 && !isAnalyzing && !isGenerating && brandKit !== null
    const canContinueFromImage = imageSourceMode !== 'generate' || Boolean(aiImageDescription.trim())
    const isStepVisible = (step: number) => showAllSteps || currentStep >= step
    const basicCompositions = compositions.filter((composition) => composition.mode === 'basic')
    const advancedCompositions = compositions

    // Get brand logos
    const brandLogos = brandKit?.logos || []
    const primaryLogo = (typeof brandLogos[0] === 'string' ? brandLogos[0] : brandLogos[0]?.url) || brandKit?.logo_url

    // Get brand colors
    const brandColors = (brandKit?.colors || []).filter(c => c.color)

    // Get brand images
    const brandImages = (brandKit?.images || []).filter(img => img.url)

    const handleSlideCountChange = (delta: number) => {
        const newCount = Math.max(0, Math.min(15, slideCount + delta))
        setSlideCount(newCount)
        setCurrentStep(2)
        if (prompt.trim()) {
            setNeedsReanalysis(true)
            setCurrentStep(2)
            setLastAnalyzedPrompt(prompt.trim())
            if (newCount > 0 && !isAnalyzing && !isGenerating) {
                onAnalyze(buildSettings({ slideCount: newCount }))
            }
        } else {
            setCurrentStep(2)
        }
    }

    // TRACK last initialized brand kit for colors
    const [lastInitBrandId, setLastInitBrandId] = useState<string | null>(null)

    // INITIALIZE default colors from brand kit
    useEffect(() => {
        const currentBrandId = brandKit?.id || (brandKit as any)?._id
        if (!brandKit || !currentBrandId) return

        // Only run if the Brand Kit ID has changed
        if (currentBrandId === lastInitBrandId) return

        console.log(`[CarouselControlsPanel] Initializing colors for Brand Kit: ${currentBrandId}`)
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

        // 2. Initialize Logo - Always default to first logo when switching brands
        if (brandKit.logos && brandKit.logos.length > 0) {
            setSelectedLogoId('logo-0')
        }

        setLastInitBrandId(currentBrandId)
    }, [brandKit, lastInitBrandId])

    useEffect(() => {
        if (!onReferenceImagesChange) return
        const uploaded = uploadedImages.map(url => ({ url, source: 'upload' as const }))
        const brandkit = selectedBrandKitImageIds.map(url => ({ url, source: 'brandkit' as const }))
        onReferenceImagesChange([...uploaded, ...brandkit])
    }, [uploadedImages, selectedBrandKitImageIds, onReferenceImagesChange])

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
        if (showAllSteps) {
            setCurrentStep(7)
        }
    }, [showAllSteps])

    useEffect(() => {
        if (!analysisStructure?.id) return
        if (lastAnalyzedPrompt && lastAnalyzedPrompt.trim() === prompt.trim()) {
            setNeedsReanalysis(false)
            setCurrentStep(prev => (prev < 3 ? 3 : prev))
        }
    }, [analysisStructure?.id, lastAnalyzedPrompt, prompt])

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
            setLastAnalyzedPrompt(prompt.trim())
            if (!isAnalyzing && !isGenerating) {
                onAnalyze(buildSettings({ slideCount: newCount }))
            }
        } else {
            setCurrentStep(2)
        }
        onSlideCountOverrideApplied?.()
    }, [
        slideCountOverride,
        slideCount,
        prompt,
        isAnalyzing,
        isGenerating,
        onAnalyze,
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

    const toggleBrandKitImage = (id: string) => {
        setSelectedBrandKitImageIds(prev =>
            prev.includes(id)
                ? prev.filter(u => u !== id)
                : [...prev, id]
        )
    }

    const handleUploadImage = async (file: File) => {
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
            setUploadedImages(prev => [...prev, base64])

            // Trigger visual analysis
            try {
                const response = await fetch('/api/analyze-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageBase64: base64,
                        mimeType: file.type || 'image/jpeg',
                    }),
                })
                const result = await response.json()
                if (result.success && result.data) {
                    const analysis = result.data
                    // Build style-only description to avoid color overrides
                    const desc = `Lighting: ${analysis.lighting}. Keywords: ${analysis.keywords?.join(', ')}.`
                    setAiImageDescription(desc)
                }
            } catch (err) {
                console.error('Auto-analysis failed:', err)
                // Non-blocking error
            }

        } catch (error) {
            setImageError(error instanceof Error ? error.message : 'Error al subir imagen')
        } finally {
            setIsImageAnalyzing(false)
        }
    }

    const removeUploadedImage = (url: string) => {
        setUploadedImages(prev => prev.filter(u => u !== url))
    }

    const clearUploadedImages = () => setUploadedImages([])
    const clearBrandKitImages = () => setSelectedBrandKitImageIds([])

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
        if (!includeLogoOnSlides) return undefined
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
    }, [selectedLogoId, includeLogoOnSlides, brandLogos, primaryLogo, onSelectedLogoChange])

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

        const selectedImageUrls =
            imageSourceMode === 'upload'
                ? uploadedImages
                : imageSourceMode === 'brandkit'
                    ? selectedBrandKitImageIds
                    : []

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
            selectedLogoUrl: resolveSelectedLogoUrl(),
            selectedColors: selectedColors.length > 0 ? selectedColors : brandColors.slice(0, 3).map(c => ({
                color: c.color,
                role: (c.role || 'Acento') as any
            })),
            selectedImageUrls,
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
        setNeedsReanalysis(true)
        setLastAnalyzedPrompt(prompt.trim())
        await onAnalyze(buildSettings())
    }

    const handleReset = () => {
        setPrompt('')
        setSlideCount(0)
        setAspectRatio('4:5')
        setStyle('minimal')
        setSlides([])
        const defaultStructureId = analysisStructure?.id || structures[0]?.id || 'problema-solucion'
        setStructureId(defaultStructureId)
        setCompositionMode('basic')
        setCompositionId('free')
        setBasicSelectedCompositionId(null)
        setSelectedLogoId(brandLogos.length > 0 ? 'logo-0' : null)
        setSelectedColors([])
        setSelectedBrandKitImageIds([])
        setUploadedImages([])
        setImageSourceMode('upload')
        setAiImageDescription('')
        setIncludeLogoOnSlides(true)
        setNeedsReanalysis(false)
        setLastAnalyzedPrompt('')
        setCurrentStep(1)
        onReset?.()
    }

    const handleSelectPreset = (state: any) => {
        if (!state || state.presetType !== 'carousel') return
        setPrompt(state.prompt || '')
        setSlideCount(state.slideCount ?? 5)
        setAspectRatio(state.aspectRatio || '4:5')
        setStyle(state.style || 'minimal')
        const nextMode: CompositionMode = state.compositionMode === 'advanced' ? 'advanced' : 'basic'
        setCompositionMode(nextMode)
        if (state.structureId) {
            const nextStructureId = state.structureId
            setStructureId(nextStructureId)
            setCompositionId(state.compositionId || 'free')
        } else if (state.compositionId) {
            setCompositionId(state.compositionId)
        }
        setBasicSelectedCompositionId(state.basicSelectedCompositionId ?? null)
        setImageSourceMode(state.imageSourceMode || 'upload')
        setAiImageDescription(state.aiImageDescription || '')
        setSelectedBrandKitImageIds(state.selectedBrandKitImageIds || [])
        setSelectedLogoId(state.selectedLogoId ?? (brandLogos.length > 0 ? 'logo-0' : null))
        setSelectedColors(state.selectedColors || [])
        setIncludeLogoOnSlides(state.includeLogoOnSlides !== false)
        setNeedsReanalysis(true)
        setLastAnalyzedPrompt(state.prompt || '')
        setCurrentStep(3)
        if (state.prompt && !isAnalyzing && !isGenerating) {
            onAnalyze(buildSettings({
                prompt: state.prompt,
                slideCount: state.slideCount ?? 5,
                aspectRatio: state.aspectRatio || '4:5',
                style: state.style || 'minimal',
                structureId: state.structureId || structureId,
                compositionId: state.compositionId || compositionId,
                imageSourceMode: state.imageSourceMode || 'upload',
                aiImageDescription: state.aiImageDescription || '',
                selectedLogoUrl: resolveSelectedLogoUrl(),
                selectedColors: state.selectedColors || [],
                selectedImageUrls: state.selectedBrandKitImageIds || [],
                includeLogoOnSlides: state.includeLogoOnSlides !== false
            }))
        }
    }

    const handleSavePreset = async (name: string) => {
        if (!userId || !brandKit) return
        if (!prompt.trim()) return
        setIsSavingPreset(true)
        try {
            await createPreset({
                userId,
                brandId: brandKit?.id as any,
                name,
                description: analysisIntentLabel || analysisIntent || structureId || undefined,
                icon: 'Star',
                state: {
                    presetType: 'carousel',
                    prompt: prompt.trim(),
                    slideCount,
                    aspectRatio,
                    style,
                    structureId,
                    compositionId,
                    compositionMode,
                    basicSelectedCompositionId,
                    imageSourceMode,
                    aiImageDescription: aiImageDescription || undefined,
                    selectedBrandKitImageIds,
                    selectedLogoId,
                    selectedColors,
                    includeLogoOnSlides
                }
            })
            setIsSaveDialogOpen(false)
        } finally {
            setIsSavingPreset(false)
        }
    }

    return (
        <div className="w-full md:w-[27%] h-full controls-panel flex flex-col shrink-0 relative group/panel">
            <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-6">
                {/* SECTION: Presets */}
                <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <SectionHeader icon={Star} title="Favoritos" className="mb-0" />
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsSaveDialogOpen(true)}
                                disabled={generatedCount === 0}
                                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                            >
                                <BookmarkIcon className="w-3 h-3" />
                                Guardar
                            </Button>
                        </div>
                    </div>
                    {hasPresets ? (
                        <>
                            <PresetsCarousel
                                onSelectPreset={handleSelectPreset as any}
                                onReset={handleReset}
                                userId={userId}
                                filterPreset={(preset) => preset?.state?.presetType === 'carousel'}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Guarda y reutiliza tus configuraciones favoritas.
                            </p>
                        </>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-4 text-center">
                            <p className="text-[11px] text-muted-foreground">
                                Los favoritos guardan tu configuración de carrusel para reutilizarla. Podrás guardar uno cuando termines de generar tu carrusel.
                            </p>
                        </div>
                    )}
                </div>

                {/* Slide Count */}
                {isStepVisible(1) && (
                <div ref={(el) => { stepRefs.current[1] = el }} className="glass-card p-4 space-y-3">
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
                <div ref={(el) => { stepRefs.current[2] = el }} className="glass-card p-4 space-y-3">
                    <SectionHeader
                        icon={Wand2}
                        title="Que quieres crear?"
                        extra={
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleReset}
                                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary gap-1"
                            >
                                <SquarePlus className="w-3 h-3" />
                                Nuevo
                            </Button>
                        }
                    />
                    <div className="relative">
                        <Textarea
                            placeholder="Ej: Quiero dar valor real. Sácame los 5 errores típicos que cometemos los españoles al hablar inglés y cómo corregirlos. Algo que la gente quiera guardar para repasar luego."
                            value={prompt}
                            onChange={(e) => {
                                const nextPrompt = e.target.value
                                setPrompt(nextPrompt)
                                setNeedsReanalysis(true)
                                setCurrentStep(2)
                                if (!nextPrompt.trim()) {
                                    setLastAnalyzedPrompt('')
                                }
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
                        <div className="absolute left-2 right-2 bottom-2 flex items-center gap-2">
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
                                className="ml-auto h-8 px-4 text-xs uppercase font-bold tracking-wider bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-2" />
                                Analizar
                            </Button>
                        </div>
                    </div>
                    <SuggestionsList
                        suggestions={suggestions}
                        hasOriginalState={hasOriginalSuggestion}
                        onApply={(index) => onApplySuggestion?.(index)}
                        onUndo={() => onUndoSuggestion?.()}
                    />
                </div>
                )}

                {/* Composition */}
                {isStepVisible(3) && (
                <div ref={(el) => { stepRefs.current[3] = el }} className="glass-card p-4 space-y-3">
                    <SectionHeader
                        icon={Layout}
                        title="Composicion"
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
                                    aria-label="Activar modo avanzado de composicion"
                                />
                            </div>
                        }
                    />
                    <Select
                        value={structureId}
                        onValueChange={(value) => {
                            setHasUserSelectedStructure(true)
                            setStructureId(value)
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
                                Modo avanzado: eliges manualmente la composicion.
                            </p>
                        </>
                    ) : (
                        <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 space-y-1.5">
                            <p className="text-[11px] text-primary font-medium leading-relaxed">
                                Modo basico activo. El sistema selecciona internamente la composicion mas adecuada segun tu prompt, con criterio determinista (no azar puro), sin mostrarla al usuario final.
                            </p>
                            <p className="text-[11px] text-primary/80 leading-relaxed">
                                La arquitectura se asigna en segundo plano y se mantiene consistente durante todo el carrusel.
                            </p>
                        </div>
                    )}
                </div>
                )}

                {/* Format */}
                {isStepVisible(4) && (
                <div ref={(el) => { stepRefs.current[4] = el }} className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Layers} title="Formato" />
                    <div className="space-y-2">
                        <button
                            onClick={() => handleAspectRatioSelect('4:5')}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
                                aspectRatio === '4:5' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-8 h-10 rounded bg-muted border border-border" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">Vertical EstÃ¡ndar (Retrato)</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">4:5</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    1080x1350 Â· el estÃ¡ndar mÃ¡s seguro para evitar recortes en dispositivos antiguos o Meta Ads.
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleAspectRatioSelect('3:4')}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
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
                                    1080x1440 Â· +6.6% pantalla Â· domina el feed y encaja con la nueva cuadrÃ­cula vertical.
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleAspectRatioSelect('1:1')}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
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
                                    1080x1080 Â· formato original y clÃ¡sico para composiciones equilibradas.
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
                )}

                {/* Image */}
                {isStepVisible(5) && (
                <div ref={(el) => { stepRefs.current[5] = el }} className="glass-card p-4 space-y-3">
                    <SectionHeader icon={ImagePlus} title="Imagen de Referencia" />
                    <ImageReferenceSelector
                        uploadedImages={uploadedImages}
                        visionAnalysis={null}
                        isAnalyzing={isImageAnalyzing}
                        error={imageError}
                        onUpload={handleUploadImage}
                        onRemoveUploadedImage={removeUploadedImage}
                        onClearUploadedImages={clearUploadedImages}
                        brandKitImages={brandImages.map((img, idx) => ({
                            id: img.url,
                            url: img.url,
                            name: `Imagen ${idx + 1}`
                        }))}
                        selectedBrandKitImageIds={selectedBrandKitImageIds}
                        onToggleBrandKitImage={toggleBrandKitImage}
                        onClearBrandKitImages={clearBrandKitImages}
                        aiImageDescription={aiImageDescription}
                        onAiDescriptionChange={setAiImageDescription}
                        mode={imageSourceMode}
                        onModeChange={setImageSourceMode}
                    />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Sube una referencia o usa una del Brand Kit.
                    </p>
                    {!showAllSteps && !hasReferenceSelection && (
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setCurrentStep(6)}
                                className="h-7 text-xs"
                                disabled={!canContinueFromImage}
                            >
                                Siguiente, Logo
                            </Button>
                        </div>
                    )}
                </div>
                )}

                {/* Logo */}
                {isStepVisible(6) && (
                <div ref={(el) => { stepRefs.current[6] = el }} className="glass-card p-4 space-y-4">
                    <SectionHeader icon={Fingerprint} title="Logo" />
                    {brandLogos.length > 0 || primaryLogo ? (
                        <>
                            <BrandingConfigurator
                                selectedLayout={null}
                                selectedLogoId={selectedLogoId}
                                selectedBrandColors={[]}
                                onSelectLogo={setSelectedLogoId}
                                onToggleBrandColor={() => { }}
                                onAddCustomColor={() => { }}
                                showLogo={true}
                                showColors={false}
                                showTypography={false}
                                showBrandTexts={false}
                                rawMessage={prompt}
                                debugLabel="Carousel-Logo"
                            />
                            <div className="flex items-center justify-between pt-1">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Aplicar logo en todas</p>
                                    <p className="text-xs text-muted-foreground">Misma posiciÃ³n y tamaÃ±o</p>
                                </div>
                                <button
                                    onClick={() => setIncludeLogoOnSlides(!includeLogoOnSlides)}
                                    className={cn(
                                        "w-10 h-6 rounded-full transition-colors",
                                        includeLogoOnSlides ? "bg-primary" : "bg-muted"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full bg-white transition-transform mx-1",
                                        includeLogoOnSlides ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-muted-foreground">No hay logo en tu Brand Kit.</p>
                    )}
                    {!showAllSteps && (
                        <div className="flex justify-end">
                            <Button size="sm" variant="secondary" onClick={() => setCurrentStep(7)} className="h-7 text-xs">
                                Siguiente, Colores
                            </Button>
                        </div>
                    )}
                </div>
                )}

                {isStepVisible(7) && (
                <div ref={(el) => { stepRefs.current[7] = el }} className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Palette} title="Colores" />
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
                )}
            </div>

            {/* Generate */}
            <div className="p-6 border-t border-border/40">
                <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="w-full h-12 text-base font-semibold disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generando {generatedCount}/{totalSlides}...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            GENERAR CARRUSEL
                        </>
                    )}
                </Button>

                {isGenerating && onCancelGenerate && (
                    <div className="mt-2 flex items-center justify-between">
                        <Button
                            onClick={onCancelGenerate}
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            title="Detener generaciÃ³n"
                        >
                            <Square className="w-4 h-4" />
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

            <SavePresetDialog
                open={isSaveDialogOpen}
                onOpenChange={setIsSaveDialogOpen}
                onSave={handleSavePreset}
                isSaving={isSavingPreset}
            />
        </div>
    )
}

function SuggestionsList({
    suggestions,
    onApply,
    onUndo,
    hasOriginalState
}: {
    suggestions?: CarouselSuggestion[],
    onApply: (index: number) => void,
    onUndo: () => void,
    hasOriginalState: boolean
}) {
    if (!suggestions || suggestions.length === 0) return null

    return (
        <TooltipProvider delayDuration={300}>
            <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
                        Opciones alternativas
                    </p>
                    {hasOriginalState ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onUndo}
                            className="h-5 px-1.5 text-[9px] text-muted-foreground hover:text-primary gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <RotateCcw className="w-2.5 h-2.5" />
                            VOLVER AL ORIGINAL
                        </Button>
                    ) : <span />}
                </div>
                {suggestions.map((suggestion, idx) => (
                    <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => onApply(idx)}
                                className="group relative w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-purple-100/50 bg-purple-50/50 hover:bg-white hover:border-purple-200 hover:shadow-sm transition-all duration-200 overflow-hidden text-left"
                            >
                                <span className="text-[11px] font-bold text-gray-900 shrink-0">
                                    {suggestion.title}
                                </span>
                                <div className="h-3 w-[1px] bg-purple-200 shrink-0" />
                                <span className="text-[11px] text-gray-500 truncate font-medium group-hover:text-purple-700 transition-colors">
                                    {suggestion.subtitle}
                                </span>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start" className="max-w-[260px] text-xs bg-muted text-foreground border border-border shadow-md">
                            <p className="font-semibold text-foreground mb-1">{suggestion.title}</p>
                            <p className="text-muted-foreground">{suggestion.subtitle}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}
