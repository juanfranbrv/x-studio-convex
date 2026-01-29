'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CanvasPanel } from '@/components/studio/CanvasPanel'
import { ControlsPanel } from '@/components/studio/ControlsPanel'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PromptCard } from '@/components/studio/PromptCard'
import { CaptionCard } from '@/components/studio/CaptionCard'
import { ThumbnailHistory } from '@/components/studio/ThumbnailHistory'
import { useCreationFlow, UseCreationFlowOptions } from '@/hooks/useCreationFlow'
import { uploadBrandImage } from '@/app/actions/upload-image'
import { SOCIAL_FORMATS, type DebugPromptData } from '@/lib/creation-flow-types'
import { Loader2, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PromptDebugModal } from '@/components/studio/modals/PromptDebugModal'
import { buildEditPrompt } from '@/lib/prompts/image-edit'
import { parseLazyIntentAction } from '@/app/actions/parse-intent'
import { IntentCategory, TextAsset } from '@/lib/creation-flow-types'
import { useUI } from '@/contexts/UIContext'
import { hexToHslString } from '@/lib/color-utils'

// Admin email for debug modal access
const ADMIN_EMAIL = 'juanfranbrv@gmail.com'

interface Generation {
    id: string
    image_url: string
    created_at: string
}

export type ContextType = 'color' | 'logo' | 'template' | 'image' | 'font' | 'text' | 'link' | 'contact'

export interface ContextElement {
    id: string
    type: ContextType
    value: string
    label?: string
}



export default function ImagePage() {
    const router = useRouter()
    const { user } = useUser()
    const { activeBrandKit, brandKits, loading, setActiveBrandKit, updateActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const { panelPosition } = useUI()
    const [isGenerating, setIsGenerating] = useState(false)
    const { toast } = useToast()
    const [selectedContext, setSelectedContext] = useState<ContextElement[]>([])
    const [isAnnotating, setIsAnnotating] = useState(false)
    const [logoInclusion, setLogoInclusion] = useState(true)

    const [promptValue, setPromptValue] = useState('')
    const [editPrompt, setEditPrompt] = useState('')
    const [isMobile, setIsMobile] = useState(false)
    const [isMagicParsing, setIsMagicParsing] = useState(false)
    const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set())

    // AI Configuration
    const aiConfig = useQuery(api.settings.getAIConfig)

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Debug Modal States
    const [showDebugModal, setShowDebugModal] = useState(false)
    const [debugPromptData, setDebugPromptData] = useState<DebugPromptData | null>(null)
    const [pendingGenerationData, setPendingGenerationData] = useState<any>(null)

    // Local session history
    const [sessionGenerations, setSessionGenerations] = useState<any[]>([])

    // Sync history
    const displayGenerations = useMemo(() => {
        return sessionGenerations
    }, [sessionGenerations])

    const creationFlow = useCreationFlow({
        onImageUploaded: async (file: File) => {
            // Reference images are only used for the current session/generation
            // and should not be persisted in the permanent Brand Kit image storage.
            console.log('Image uploaded for current flow:', file.name)
        },
        onReset: () => {
            creationFlow.setGeneratedImage(null)
            setIsAnnotating(false)
            setDebugPromptData(null)
            setSelectedContext([])
            setPromptValue('')
        }
    } as UseCreationFlowOptions)

    // Reset Studio when Brand Kit changes
    useEffect(() => {
        if (activeBrandKit?.id) {
            setSelectedContext([])
            creationFlow.reset()
            setIsAnnotating(false)
            setDebugPromptData(null)
            setPromptValue('')
        }
    }, [activeBrandKit?.id])

    const handleNewBrandKit = () => {
        router.push('/brand-kit?action=new')
    }

    // Smart analyze prompt
    const handleSmartAnalyze = async (autoModel?: string) => {
        if (!promptValue.trim()) return null

        setIsMagicParsing(true)
        setHighlightedFields(new Set())

        try {
            const modelToUse = autoModel || aiConfig?.intelligenceModel
            if (!modelToUse) {
                toast({
                    title: "Falta configuracion de IA",
                    description: "No hay un modelo de inteligencia configurado en el panel de Admin.",
                    variant: "destructive"
                })
                return null
            }

            creationFlow.setRawMessage(promptValue)

            const result = await parseLazyIntentAction({
                userText: promptValue,
                brandDNA: activeBrandKit,
                brandWebsite: activeBrandKit?.url,
                intelligenceModel: modelToUse,
                intentId: creationFlow.currentIntent?.id,
                layoutId: creationFlow.selectedLayoutMeta?.id
            })

            if (result.error) {
                toast({
                    title: "Error analyzing prompt",
                    description: "Could not parse intent. Please fill manually.",
                    variant: "destructive"
                })
                return null
            }

            const newHighlights = new Set<string>()

            // Auto-detect intent
            if (result.detectedIntent && !creationFlow.state.selectedIntent) {
                creationFlow.selectIntent(result.detectedIntent as IntentCategory)
                toast({
                    title: "✨ Intención detectada",
                    description: `Detectamos que quieres crear: ${result.detectedIntent}`,
                })
            }

            // Populate fields
            if (result.headline) {
                creationFlow.setHeadline(result.headline)
                newHighlights.add('headline')
            }
            if (result.cta) {
                creationFlow.setCta(result.cta)
                newHighlights.add('cta')
            }
            if (result.ctaUrl) {
                creationFlow.setCtaUrl(result.ctaUrl)
                newHighlights.add('ctaUrl')
            }
            if (result.caption) {
                creationFlow.setCaption(result.caption)
                newHighlights.add('caption')
            }

            // Process imageTexts (secondary text layers for preview)
            const aiAssets: TextAsset[] = []
            const seenValues = new Set<string>()

            const addAsset = (label: string, value: string, type?: TextAsset['type']) => {
                const cleanValue = value.trim()
                if (!cleanValue) return
                if (seenValues.has(cleanValue.toLowerCase())) return
                seenValues.add(cleanValue.toLowerCase())
                aiAssets.push({
                    id: `ai-${Date.now()}-${aiAssets.length}`,
                    type: type || 'custom',
                    label: label.trim() || 'Texto',
                    value: cleanValue
                })
            }

            if (Array.isArray(result.imageTexts)) {
                result.imageTexts.forEach((item) => {
                    if (!item || typeof item !== 'object') return
                    const label = typeof item.label === 'string' ? item.label : 'Texto'
                    const value = typeof item.value === 'string' ? item.value : ''
                    const type = item.type === 'tagline' || item.type === 'hook' ? item.type : 'custom'
                    addAsset(label, value, type)
                })
            } else if (result.imageTexts && typeof result.imageTexts === 'object') {
                Object.entries(result.imageTexts).forEach(([key, value]) => {
                    if (typeof value === 'string') {
                        addAsset(key, value, 'custom')
                    }
                })
            }

            if (result.customTexts) {
                Object.entries(result.customTexts).forEach(([key, value]) => {
                    if (value && typeof value === 'string' && value.trim()) {
                        addAsset(key.replace(/_/g, ' '), value, 'custom')
                    }
                })
            }

            creationFlow.setSelectedTextAssets(aiAssets)

            setHighlightedFields(newHighlights)
            setTimeout(() => setHighlightedFields(new Set()), 2500)

            toast({
                title: "Magic Applied! ✨",
                description: "Your fields have been auto-filled based on your description.",
            })

            return result

        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Something went wrong with the magic analysis.",
                variant: "destructive"
            })
            return null
        } finally {
            setIsMagicParsing(false)
        }
    }

    const handleGenerate = async (data: {
        platform?: string
        headline?: string
        cta?: string
        prompt: string
        model?: string
    }) => {
        if (!activeBrandKit) return

        setIsGenerating(true)
        try {
            const selectedImages = (activeBrandKit.images || [])
                .filter(img => img.selected !== false)
                .map(img => img.url)

            const finalContext: ContextElement[] = [...selectedContext]

            // Add uploaded images as product references
            if (creationFlow.state.uploadedImages.length > 0) {
                creationFlow.state.uploadedImages.forEach((imgUrl, idx) => {
                    const hasImg = finalContext.some(c => c.id === `flow-upload-${idx}`)
                    if (!hasImg) {
                        finalContext.push({
                            id: `flow-upload-${idx}`,
                            type: 'image',
                            value: imgUrl,
                            label: idx === 0 ? 'Producto' : `Referencia ${idx + 1}`
                        })
                    }
                })
            }

            // Add brand kit selected images as references
            if (creationFlow.state.selectedBrandKitImageIds.length > 0) {
                creationFlow.state.selectedBrandKitImageIds.forEach((imgUrl, idx) => {
                    const hasImg = finalContext.some(c => c.id === `flow-brandkit-${idx}`)
                    if (!hasImg) {
                        finalContext.push({
                            id: `flow-brandkit-${idx}`,
                            type: 'image',
                            value: imgUrl,
                            label: `Imagen BrandKit ${idx + 1}`
                        })
                    }
                })
            }

            if (logoInclusion && creationFlow.state.selectedLogoId) {
                const logo = activeBrandKit.logos?.find((l, idx) =>
                    (l as any).id === creationFlow.state.selectedLogoId || `logo-${idx}` === creationFlow.state.selectedLogoId
                )
                const logoUrl = logo?.url || null
                if (logoUrl) {
                    const hasLogo = finalContext.some(c => c.type === 'logo')
                    if (!hasLogo) {
                        finalContext.push({
                            id: 'flow-logo',
                            type: 'logo',
                            value: logoUrl,
                            label: 'Logo'
                        })
                    }
                }
            }

            if (creationFlow.state.generatedImage) {
                const hasReference = finalContext.some(c => c.id === 'edit-reference')
                if (!hasReference) {
                    finalContext.push({
                        id: 'edit-reference',
                        type: 'image',
                        value: creationFlow.state.generatedImage,
                        label: 'Imagen actual'
                    })
                }
            }

            const effectivePrompt = creationFlow.state.generatedImage ? buildEditPrompt(data.prompt) : data.prompt

            console.log('[Client] Generating with State Model:', creationFlow.state.selectedImageModel)

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    prompt: effectivePrompt,
                    brandDNA: {
                        ...activeBrandKit,
                        images: selectedImages
                    },
                    logoInclusion,
                    context: finalContext,
                    model: data.model || creationFlow.state.selectedImageModel, // Removed hardcoded fallback to test state
                    layoutReference: creationFlow.selectedLayoutMeta?.referenceImage,
                    aspectRatio: SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio
                }),
            })

            if (response.ok) {
                const result = await response.json()
                creationFlow.setGeneratedImage(result.imageUrl)

                setSessionGenerations(prev => [{
                    id: Date.now().toString(),
                    image_url: result.imageUrl,
                    created_at: new Date().toISOString()
                }, ...prev])
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Error al generar la imagen' }))
                toast({
                    title: "Error de generación",
                    description: errorData.error || 'Error al generar la imagen',
                    variant: "destructive",
                })
            }
        } catch (error: any) {
            console.error('Generation failed:', error)
            toast({
                title: "Error de generación",
                description: error.message || 'No se pudo generar la imagen.',
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleEditImage = async (editPrompt: string) => {
        if (!activeBrandKit || !creationFlow.state.generatedImage) return

        setIsGenerating(true)
        try {
            const editContext = [{
                id: 'edit-reference',
                type: 'image' as const,
                value: creationFlow.state.generatedImage,
                label: 'Imagen a editar'
            }]

            const fullPrompt = buildEditPrompt(editPrompt)

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    brandDNA: activeBrandKit,
                    context: editContext,
                    model: creationFlow.state.selectedImageModel || "wisdom/gemini-3-pro-image-preview",
                    aspectRatio: SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio
                }),
            })

            if (response.ok) {
                const result = await response.json()
                creationFlow.setGeneratedImage(result.imageUrl)

                setSessionGenerations(prev => [{
                    id: Date.now().toString(),
                    image_url: result.imageUrl,
                    created_at: new Date().toISOString()
                }, ...prev])
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Error al editar la imagen' }))
                toast({
                    title: "Error de edición",
                    description: errorData.error || 'Error al editar la imagen',
                    variant: "destructive",
                })
            }
        } catch (error: any) {
            console.error('Edit failed:', error)
            toast({
                title: "Error de edición",
                description: error.message || 'No se pudo editar la imagen.',
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    // Check if current user is admin
    const isAdmin = user?.emailAddresses?.some(
        email => email.emailAddress === ADMIN_EMAIL
    ) ?? false

    // Simplified canGenerate logic for the new 2-column layout
    // Button should be enabled only after the Colors card is visible
    const { state } = creationFlow
    const hasReachedColorsStep = state.currentStep >= 6 || state.hasGeneratedImage
    const canGenerate = Boolean(
        hasReachedColorsStep && (
            state.selectedIntent !== null ||
            state.selectedStyles.length > 0 ||
            state.customStyle.trim() !== '' ||
            state.headline ||
            state.cta ||
            state.uploadedImages.length > 0
        )
    )

    // Wrapped handleGenerate with debug modal intercept (admin only)
    const handleGenerateWithDebug = async (data: {
        platform?: string
        headline?: string
        cta?: string
        prompt: string
        model?: string
    }) => {
        if (!isAdmin) {
            await handleGenerate(data)
            return
        }

        setDebugPromptData({
            finalPrompt: data.prompt,
            logoUrl: activeBrandKit?.logos?.[0]?.url,
            // Combine uploaded images and brand kit images
            attachedImages: [
                ...state.uploadedImages,
                ...state.selectedBrandKitImageIds // Assuming these are URLs as per handleGenerate usage
            ],
            selectedStyles: state.selectedStyles,
            headline: state.headline,
            cta: state.cta,
            platform: state.selectedPlatform || undefined,
            format: state.selectedFormat || undefined,
            intent: state.selectedIntent || undefined,
        })
        setPendingGenerationData(data)
        setShowDebugModal(true)
    }

    const confirmGeneration = async () => {
        setShowDebugModal(false)
        if (pendingGenerationData) {
            await handleGenerate(pendingGenerationData)
            setPendingGenerationData(null)
        }
    }

    const cancelGeneration = () => {
        setShowDebugModal(false)
        setPendingGenerationData(null)
        setDebugPromptData(null)
    }

    const handleUnifiedAction = async () => {
        // Mode 1: Edit existing image
        if (creationFlow.state.generatedImage && editPrompt.trim()) {
            await handleEditImage(editPrompt)
            setEditPrompt('')
            return
        }

        // Mode 2: Generate new image
        const prompt = creationFlow.buildGenerationPrompt()
        await handleGenerateWithDebug({ prompt })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-lg font-medium">Cargando Imagen...</span>
            </div>
        )
    }

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
            onBrandDelete={deleteBrandKitById}
            onNewBrandKit={handleNewBrandKit}
            isFixed={true}
        >
            {activeBrandKit ? (
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* TOP AREA: 2 Columns */}
                    <div className={cn(
                        "flex-1 flex overflow-hidden min-h-0",
                        panelPosition === 'right' ? "flex-row" : "flex-row-reverse"
                    )}>
                        {/* LEFT COLUMN (Main Canvas) */}
                        < div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto overflow-x-hidden min-w-0" >
                            {/* Canvas Preview */}
                            < div className="flex-1 min-h-[500px] flex flex-col overflow-x-hidden" >
                                <CanvasPanel
                                    currentImage={creationFlow.state.generatedImage}
                                    isAnnotating={isAnnotating}
                                    onAnnotate={() => setIsAnnotating(!isAnnotating)}
                                    generations={[]}
                                    onSelectGeneration={() => { }}
                                    selectedContext={selectedContext}
                                    onRemoveContext={(id) => setSelectedContext(prev => prev.filter(c => c.id !== id))}
                                    onAddContext={(element) => setSelectedContext(prev => [...prev, element])}
                                    draggedElement={null}
                                    isGenerating={isGenerating}
                                    aspectRatio={SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio || "1:1"}
                                    creationState={creationFlow.state}
                                    editPrompt=""
                                    onEditPromptChange={() => { }}
                                    canGenerate={Boolean(canGenerate)}
                                    onUnifiedAction={handleUnifiedAction}
                                    onCaptionChange={creationFlow.setCaption}
                                    onHeadlineChange={creationFlow.setHeadline}
                                    onCtaChange={creationFlow.setCta}
                                    onCtaUrlChange={creationFlow.setCtaUrl}
                                    onCustomTextChange={creationFlow.setCustomText}
                                    onAddTextAsset={(asset) => creationFlow.addTextAsset(asset)}
                                    onRemoveTextAsset={creationFlow.removeTextAsset}
                                    onUpdateTextAsset={creationFlow.updateTextAsset}
                                    hidePromptArea={true}
                                    onSelectLogo={creationFlow.selectLogo}
                                    onClearUploadedImage={creationFlow.clearImage}
                                />
                            </div>

                            {/* Thumbnail History (Moved below Canvas) */}
                            <div className="flex-shrink-0">
                                <ThumbnailHistory
                                    generations={displayGenerations}
                                    currentImageUrl={creationFlow.state.generatedImage}
                                    onSelectGeneration={(gen) => creationFlow.setGeneratedImage(gen.image_url)}
                                />
                            </div>
                        </div >

                        {/* RIGHT COLUMN - Controls Panel */}
                            <ControlsPanel
                                creationFlow={creationFlow}
                                highlightedFields={highlightedFields}
                                promptValue={promptValue}
                                onPromptChange={(val) => {
                                    setPromptValue(val)
                                    creationFlow.setRawMessage(val)
                                }}
                                isMagicParsing={isMagicParsing}
                                isGenerating={isGenerating}
                                canGenerate={Boolean(canGenerate)}
                                onUnifiedAction={handleUnifiedAction}
                                onAnalyze={() => handleSmartAnalyze()}
                            userId={user?.id}
                        />
                    </div>

                    {/* BOTTOM BAR: Local Edits & Generate */}
                    <div className={cn(
                        "flex-none flex border-t border-white/10 bg-background/50 backdrop-blur-md min-h-[80px]",
                        panelPosition === 'right' ? "flex-row" : "flex-row-reverse"
                    )}>
                        {/* Left: Text Area (Matches Canvas width) */}
                        <div className="flex-1 p-4 flex items-end">
                            <Textarea
                                placeholder={creationFlow.state.generatedImage ? "Describe los cambios para editar la imagen..." : "Configura tu imagen en el panel derecho..."}
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                disabled={!creationFlow.state.generatedImage}
                                className="w-full min-h-[44px] max-h-[120px] resize-none bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-100 disabled:cursor-not-allowed transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleUnifiedAction()
                                    }
                                }}
                            />
                        </div>

                        {/* Right: Generate Button (Matches ControlsPanel width) */}
                        <div className={cn(
                            "w-full md:w-[27%] p-4 flex flex-col justify-end",
                            panelPosition === 'right' ? "border-l border-white/5" : "border-r border-white/5"
                        )}>
                            <Button
                                onClick={handleUnifiedAction}
                                disabled={isGenerating || (!canGenerate && !creationFlow.state.generatedImage)}
                                className="w-full h-[44px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all font-semibold"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        {creationFlow.state.generatedImage ? 'Refinar Imagen' : 'Generar Imagen'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="max-w-md space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold">Selecciona un Brand Kit</h2>
                        <p className="text-muted-foreground">
                            Para empezar a diseñar en el panel de Imagen, necesitas seleccionar un Brand Kit.
                            Si aún no tienes uno, créalo en la sección "Brand Kit".
                        </p>
                    </div>
                </div>
            )}


            <PromptDebugModal
                open={showDebugModal}
                onClose={cancelGeneration}
                onConfirm={confirmGeneration}
                promptData={debugPromptData}
            />
        </DashboardLayout >
    )
}
