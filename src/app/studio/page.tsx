'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { BrandDNAPanel } from '@/components/studio/BrandDNAPanel'
import { CanvasPanel } from '@/components/studio/CanvasPanel'
import { CampaignBriefPanel } from '@/components/studio/CampaignBriefPanel'
import type { BrandDNA } from '@/lib/brand-types'
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
    const { activeBrandKit, brandKits, loading, setActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const [isGenerating, setIsGenerating] = useState(false)
    const { toast } = useToast()
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [generations, setGenerations] = useState<Generation[]>([])
    const [selectedContext, setSelectedContext] = useState<ContextElement[]>([])
    const [draggedElement, setDraggedElement] = useState<ContextElement | null>(null)
    const [isAnnotating, setIsAnnotating] = useState(false)
    const [logoInclusion, setLogoInclusion] = useState(true)

    const handleNewBrandKit = () => {
        router.push('/brand-kit?action=new')
    }



    const handleGenerate = async (data: {
        platform?: string
        headline?: string
        cta?: string
        prompt: string
    }) => {
        if (!activeBrandKit) return

        setIsGenerating(true)
        try {
            // Selected images from kit
            const selectedImages = (activeBrandKit.images || [])
                .filter(img => (img as any).selected !== false)
                .map(img => (img as any).url || img);

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
            }
        } catch (error) {
            console.error('Generation failed:', error)
            toast({
                title: "Error de generación",
                description: "No se pudo generar la imagen. Inténtalo de nuevo en unos momentos.",
                variant: "destructive",
            })
        } finally {
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
        >
            {activeBrandKit ? (
                <div className="flex-1 flex overflow-hidden h-full">
                    {/* Left: Brand DNA Panel */}
                    <BrandDNAPanel
                        brandDNA={activeBrandKit}
                        logoInclusion={logoInclusion}
                        onLogoInclusionChange={setLogoInclusion}
                        selectedContext={selectedContext}
                        onAddContext={(element) => setSelectedContext(prev => [...prev, element])}
                        onRemoveContext={(id) => setSelectedContext(prev => prev.filter(c => c.id !== id))}
                        onSetDraggedElement={setDraggedElement}
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
                        onGenerate={(prompt) => handleGenerate({ prompt })}
                        isGenerating={isGenerating}
                    />

                    {/* Right: Campaign Brief */}
                    <CampaignBriefPanel
                        onGenerate={handleGenerate}
                        isGenerating={isGenerating}
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
