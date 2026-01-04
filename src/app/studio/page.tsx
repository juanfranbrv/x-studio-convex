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
import { SOCIAL_FORMATS } from '@/lib/creation-flow-types'
import { Loader2, Plus } from 'lucide-react'

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
    const [selectedModel, setSelectedModel] = useState('wisdom/gemini-3.0-pro-image-01-preview')
    const [selectedTextModel, setSelectedTextModel] = useState('wisdom/gemini-2.5-flash')

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
                        onGenerate={async (prompt) => handleGenerate({ prompt })}
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
                        onGenerate={(prompt, model) => handleGenerate({ prompt, model })}
                        isGenerating={isGenerating}
                        selectedModel={selectedModel}
                        onModelChange={setSelectedModel}
                        selectedTextModel={selectedTextModel}
                        onTextModelChange={setSelectedTextModel}
                        aspectRatio={SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio}
                    />

                    {/* Right: Brand DNA Panel */}
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
        </DashboardLayout>
    )
}
