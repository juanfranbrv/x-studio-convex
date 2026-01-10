'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { BrandDNAPanel } from '@/components/studio/BrandDNAPanel'
import { CanvasPanel } from '@/components/studio/CanvasPanel'
import { CampaignBriefPanel } from '@/components/studio/CampaignBriefPanel'
import { CreationCommandPanel } from '@/components/studio/creation-flow'
import { useCreationFlow, UseCreationFlowOptions } from '@/hooks/useCreationFlow'
import { uploadBrandImage } from '@/app/actions/upload-image'
import type { BrandDNA } from '@/lib/brand-types'
import { SOCIAL_FORMATS, type DebugPromptData } from '@/lib/creation-flow-types'
import { Loader2, Plus, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PromptDebugModal } from '@/components/studio/modals/PromptDebugModal'
import { buildEditPrompt } from '@/lib/prompts/image-edit'

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
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [generations, setGenerations] = useState<Generation[]>([])
    const [selectedContext, setSelectedContext] = useState<ContextElement[]>([])
    const [draggedElement, setDraggedElement] = useState<ContextElement | null>(null)
    const [isAnnotating, setIsAnnotating] = useState(false)
    const [logoInclusion, setLogoInclusion] = useState(true)
    const [selectedModel, setSelectedModel] = useState('wisdom/gemini-3-pro-image-preview')
    const [selectedTextModel, setSelectedTextModel] = useState('wisdom/gemini-2.5-flash')
    const [isBrandDrawerOpen, setIsBrandDrawerOpen] = useState(false)

    // Debug Modal States
    const [showDebugModal, setShowDebugModal] = useState(false)
    const [debugPromptData, setDebugPromptData] = useState<DebugPromptData | null>(null)
    const [pendingGenerationData, setPendingGenerationData] = useState<any>(null)

    const creationFlow = useCreationFlow({
        onImageUploaded: async (file: File) => {
            if (!activeBrandKit) return
            try {
                const formData = new FormData()
                formData.append('file', file)
                const result = await uploadBrandImage(formData)
                if (result.success && result.url) {
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
            setCurrentImage(null)
            setGenerations([])
            setIsAnnotating(false)
            setDebugPromptData(null)
            setSelectedContext([])
        }
    } as UseCreationFlowOptions)

    // Reset Studio when Brand Kit changes
    useEffect(() => {
        if (activeBrandKit?.id) {
            setCurrentImage(null)
            setSelectedContext([])
            setGenerations([])
            creationFlow.reset()
            // Optional: Reset other states if needed
            setIsAnnotating(false)
            setDebugPromptData(null)
        }
    }, [activeBrandKit?.id])

    const handleNewBrandKit = () => {
        router.push('/brand-kit?action=new')
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
            // Selected images from kit
            const selectedImages = (activeBrandKit.images || [])
                .filter(img => (img as any).selected !== false)
                .map(img => (img as any).url || img);

            // MERGE: Combine elements from the "Mesa" with elements from the "Creation Flow"
            const finalContext: ContextElement[] = [...selectedContext]

            // 1. Add uploaded product image from flow (if exists and not already in context)
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

            // 2. Add selected logo from flow (if logoInclusion is true and not already in context)
            if (logoInclusion && creationFlow.state.selectedLogoId) {
                const logo = activeBrandKit.logos?.find((l, idx) =>
                    (l as any).id === creationFlow.state.selectedLogoId || `logo-${idx}` === creationFlow.state.selectedLogoId
                )
                const logoUrl = logo ? ((logo as any).url || logo) : null
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

            // 3. Add current image as edit reference if it exists
            if (currentImage) {
                const hasReference = finalContext.some(c => c.id === 'edit-reference')
                if (!hasReference) {
                    finalContext.push({
                        id: 'edit-reference',
                        type: 'image',
                        value: currentImage,
                        label: 'Imagen actual'
                    })
                }
            }

            const effectivePrompt = currentImage ? buildEditPrompt(data.prompt) : data.prompt

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
                    model: data.model || selectedModel,
                    layoutReference: creationFlow.selectedLayoutMeta?.referenceImage,
                    aspectRatio: SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio
                }),
            })

            if (response.ok) {
                const result = await response.json()
                const newGeneration: Generation = {
                    id: Math.random().toString(36).substring(7),
                    image_url: result.imageUrl,
                    created_at: new Date().toISOString()
                }
                setCurrentImage(result.imageUrl)
                setGenerations(prev => [newGeneration, ...prev])
            } else {
                // Handle API error with user-friendly message
                const errorData = await response.json().catch(() => ({ error: 'Error al generar la imagen' }))
                const errorMessage = errorData.error || 'Error al generar la imagen'

                console.error('API Error:', errorMessage)
                console.log('Calling toast with error message:', errorMessage)

                toast({
                    title: "Error de generación",
                    description: errorMessage,
                    variant: "destructive",
                })
            }
        } catch (error: any) {
            console.error('Generation failed:', error)

            // Display user-friendly error message
            const errorMessage = error.message || 'No se pudo generar la imagen. Inténtalo de nuevo en unos momentos.'

            toast({
                title: "Error de generación",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            console.log('Resetting isGenerating to false')
            setIsGenerating(false)
        }
    }

    // Handle editing the current image with a prompt
    const handleEditImage = async (editPrompt: string) => {
        if (!activeBrandKit || !currentImage) return

        setIsGenerating(true)
        try {
            // Build context with current image as reference
            const editContext = [
                {
                    id: 'edit-reference',
                    type: 'image' as const,
                    value: currentImage,
                    label: 'Imagen a editar'
                }
            ]

            // Build edit prompt from template
            const fullPrompt = buildEditPrompt(editPrompt)

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    brandDNA: activeBrandKit,
                    context: editContext,
                    model: selectedModel,
                    aspectRatio: SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio
                }),
            })

            if (response.ok) {
                const result = await response.json()
                const newGeneration: Generation = {
                    id: Math.random().toString(36).substring(7),
                    image_url: result.imageUrl,
                    created_at: new Date().toISOString()
                }
                setCurrentImage(result.imageUrl)
                setGenerations(prev => [newGeneration, ...prev])
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

    // Wrapped handleGenerate with debug modal intercept (admin only)
    const handleGenerateWithDebug = async (data: {
        platform?: string
        headline?: string
        cta?: string
        prompt: string
        model?: string
    }) => {
        // If not admin, skip debug modal and generate directly
        if (!isAdmin) {
            await handleGenerate(data)
            return
        }

        // Build debug data (admin only)
        const selectedLogo = logoInclusion && creationFlow.state.selectedLogoId
            ? activeBrandKit?.logos?.find((l, idx) =>
                (l as any).id === creationFlow.state.selectedLogoId || `logo-${idx}` === creationFlow.state.selectedLogoId
            )
            : null

        const debugData: DebugPromptData = {
            finalPrompt: data.prompt,
            logoUrl: selectedLogo ? ((selectedLogo as any).url || selectedLogo) : undefined,
            referenceImageUrl: creationFlow.state.uploadedImage || undefined,
            selectedStyles: creationFlow.state.selectedStyles,
            headline: data.headline,
            cta: data.cta,
            platform: data.platform,
            format: SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.name,
            intent: creationFlow.state.selectedIntent || undefined
        }

        // Show modal and store pending data
        setDebugPromptData(debugData)
        setPendingGenerationData(data)
        setShowDebugModal(true)
    }

    // Actual generation after modal confirmation
    const confirmGeneration = async () => {
        setShowDebugModal(false)
        if (pendingGenerationData) {
            await handleGenerate(pendingGenerationData)
            setPendingGenerationData(null)
        }
    }

    // Cancel generation
    const cancelGeneration = () => {
        setShowDebugModal(false)
        setPendingGenerationData(null)
        setDebugPromptData(null)
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
                <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden min-h-0">
                    {/* Left: Creation Command Panel (Cascade Interface) */}
                    <CreationCommandPanel
                        onGenerate={async (prompt) => handleGenerateWithDebug({ prompt })}
                        isGenerating={isGenerating}
                        creationFlow={creationFlow}
                        currentImage={currentImage}
                        aspectRatio={SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio}
                        generations={generations}
                        onSelectGeneration={(gen) => setCurrentImage(gen.image_url)}
                        onEditImage={handleEditImage}
                    />

                    {/* Center: Canvas */}
                    <div className={cn(
                        "md:flex-1 h-auto md:h-auto min-h-0 order-2 md:order-2 flex-col relative z-0",
                        (!currentImage && !isGenerating) ? "hidden md:flex" : "flex"
                    )}>
                        <CanvasPanel
                            currentImage={currentImage}
                            isAnnotating={isAnnotating}
                            onAnnotate={() => setIsAnnotating(!isAnnotating)}
                            generations={generations}
                            onSelectGeneration={(gen) => setCurrentImage(gen.image_url)}
                            selectedContext={selectedContext}
                            onRemoveContext={(id) => setSelectedContext(prev => prev.filter(c => c.id !== id))}
                            onAddContext={(element) => setSelectedContext(prev => [...prev, element])}
                            draggedElement={draggedElement}
                            onGenerate={(prompt, model) => handleGenerateWithDebug({ prompt, model })}
                            isGenerating={isGenerating}
                            selectedModel={selectedModel}
                            onModelChange={setSelectedModel}
                            selectedTextModel={selectedTextModel}
                            onTextModelChange={setSelectedTextModel}
                            aspectRatio={SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio}
                            creationState={creationFlow.state}
                        />
                    </div>

                    {/* Brand Drawer Toggle - Fixed on Right Edge */}
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setIsBrandDrawerOpen(!isBrandDrawerOpen)}
                        title={isBrandDrawerOpen ? "Cerrar Brand Kit" : "Abrir Brand Kit"}
                        className={cn(
                            "fixed z-50 top-[400px] rounded-l-xl rounded-r-none border-r-0 border-2 shadow-2xl transition-all duration-300",
                            // Smaller on mobile, larger on desktop
                            "h-8 w-6 md:h-12 md:w-10",
                            isBrandDrawerOpen
                                ? "right-[85vw] sm:right-[360px] bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                                : "right-0 bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                        )}
                    >
                        {isBrandDrawerOpen ? <PanelRightClose className="w-3 h-3 md:w-5 md:h-5" /> : <PanelRightOpen className="w-3 h-3 md:w-5 md:h-5" />}
                    </Button>

                    {/* Right: Brand DNA Panel (Drawer) */}
                    <div className={cn(
                        "fixed inset-y-0 right-0 w-[85vw] sm:w-[360px] z-40 transition-transform duration-300 ease-out shadow-2xl",
                        isBrandDrawerOpen ? "translate-x-0" : "translate-x-full"
                    )}>
                        <BrandDNAPanel
                            brandDNA={activeBrandKit}
                            logoInclusion={logoInclusion}
                            onLogoInclusionChange={setLogoInclusion}
                            selectedContext={selectedContext}
                            onAddContext={(element) => setSelectedContext(prev => [...prev, element])}
                            onRemoveContext={(id) => setSelectedContext(prev => prev.filter(c => c.id !== id))}
                            onSetDraggedElement={setDraggedElement}
                            onImageClick={(url) => creationFlow.setImageFromUrl(url)}
                            textAssets={creationFlow.state.selectedTextAssets}
                            onAddTextAsset={creationFlow.addTextAsset}
                            onRemoveTextAsset={creationFlow.removeTextAsset}
                            onUpdateTextAsset={creationFlow.updateTextAsset}
                        />
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

            {/* Debug Modal */}
            <PromptDebugModal
                open={showDebugModal}
                onClose={cancelGeneration}
                onConfirm={confirmGeneration}
                promptData={debugPromptData}
            />
        </DashboardLayout>
    )
}
