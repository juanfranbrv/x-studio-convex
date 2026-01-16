'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CanvasPanel } from '@/components/studio/CanvasPanel'
import { ControlsPanel } from '@/components/studio/ControlsPanel'
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
import { IntentCategory } from '@/lib/creation-flow-types'

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
            if (!activeBrandKit) return
            try {
                const formData = new FormData()
                formData.append('file', file)
                const result = await uploadBrandImage(formData)
                if (result.success && result.url) {
                    creationFlow.setUploadedImage(result.url)
                    const updatedImages = [...(activeBrandKit.images || []), { url: result.url, selected: true }]
                    await updateActiveBrandKit({
                        images: updatedImages
                    })
                    toast({
                        title: "Imagen guardada",
                        description: "La imagen se ha añadido a tu Brand Kit automáticamente.",
                    })
                }
            } catch (error) {
                console.error('Error saving flow image to kit:', error)
            }
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
    const handleSmartAnalyze = async () => {
        if (!promptValue.trim()) return

        setIsMagicParsing(true)
        setHighlightedFields(new Set())

        try {
            creationFlow.setRawMessage(promptValue)

            const result = await parseLazyIntentAction(
                promptValue,
                activeBrandKit?.brand_name || "My Brand",
                creationFlow.currentIntent || undefined,
                creationFlow.selectedLayoutMeta || undefined
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
            if (result.caption) {
                creationFlow.setCaption(result.caption)
                newHighlights.add('caption')
            }

            setHighlightedFields(newHighlights)
            setTimeout(() => setHighlightedFields(new Set()), 2500)

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

            if (creationFlow.state.uploadedImage) {
                const hasProduct = finalContext.some(c => c.type === 'image' && c.label === 'Producto')
                if (!hasProduct) {
                    finalContext.push({
                        id: 'flow-product',
                        type: 'image',
                        value: creationFlow.state.uploadedImage,
                        label: 'Producto'
                    })
                }
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
                    model: data.model || creationFlow.state.selectedImageModel || "wisdom/gemini-3-pro-image-preview",
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
    // Button should be enabled if there's an intent OR any content configured
    const { state } = creationFlow
    const canGenerate = Boolean(
        state.selectedIntent !== null ||
        state.selectedStyles.length > 0 ||
        state.customStyle.trim() !== '' ||
        state.headline ||
        state.cta ||
        state.uploadedImage
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
        if (creationFlow.state.generatedImage && editPrompt.trim()) {
            await handleEditImage(editPrompt)
            setEditPrompt('')
        } else {
            const prompt = creationFlow.buildGenerationPrompt()
            await handleGenerateWithDebug({ prompt })
        }
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
                <div className="flex-1 flex flex-col overflow-hidden bg-mesh">
                    {/* TOP AREA: 2 Columns */}
                    < div className="flex-1 flex flex-row overflow-hidden min-h-0" >
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
                                    onCustomTextChange={creationFlow.setCustomText}
                                    onAddTextAsset={() => {
                                        const newId = `custom-${Date.now()}`
                                        creationFlow.addTextAsset({ id: newId, type: 'custom', label: 'Texto', value: '' })
                                    }}
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
                            onPromptChange={setPromptValue}
                            isMagicParsing={isMagicParsing}
                            isGenerating={isGenerating}
                            canGenerate={Boolean(canGenerate)}
                            onUnifiedAction={handleUnifiedAction}
                            userId={user?.id}
                        />
                    </div>

                    {/* BOTTOM BAR: Local Edits & Generate */}
                    <div className="flex-none flex flex-row border-t border-white/10 bg-background/50 backdrop-blur-md min-h-[80px]">
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
                        <div className="w-full md:w-[27%] p-4 flex flex-col justify-end border-l border-white/5">
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
