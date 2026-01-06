'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function StudioPage() {
    const router = useRouter()
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
        }
    } as UseCreationFlowOptions)

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

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
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

    // Wrapped handleGenerate with debug modal intercept
    const handleGenerateWithDebug = async (data: {
        platform?: string
        headline?: string
        cta?: string
        prompt: string
        model?: string
    }) => {
        // Build debug data
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
                <span className="ml-3 text-lg font-medium">Cargando Studio...</span>
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
                <div className="flex-1 flex overflow-hidden min-h-0">
                    {/* Left: Creation Command Panel (Cascade Interface) */}
                    <CreationCommandPanel
                        onGenerate={async (prompt) => handleGenerateWithDebug({ prompt })}
                        isGenerating={isGenerating}
                        creationFlow={creationFlow}
                    />

                    {/* Center: Canvas */}
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

                    {/* Brand Drawer Toggle - Fixed on Right Edge */}
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setIsBrandDrawerOpen(!isBrandDrawerOpen)}
                        title={isBrandDrawerOpen ? "Cerrar Brand Kit" : "Abrir Brand Kit"}
                        className={cn(
                            "fixed z-50 top-[400px] h-12 w-10 rounded-l-xl rounded-r-none border-r-0 border-2 shadow-2xl transition-all duration-300",
                            isBrandDrawerOpen
                                ? "right-[360px] bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                                : "right-0 bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                        )}
                    >
                        {isBrandDrawerOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
                    </Button>

                    {/* Right: Brand DNA Panel (Drawer) */}
                    <div className={cn(
                        "fixed inset-y-0 right-0 w-[360px] z-40 transition-transform duration-300 ease-out shadow-2xl",
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
                            Para empezar a diseñar en el Studio, necesitas seleccionar un Brand Kit.
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
