'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { BrandDNAPanel } from '@/components/studio/BrandDNAPanel'
import { CanvasPanel } from '@/components/studio/CanvasPanel'
import { CampaignBriefPanel } from '@/components/studio/CampaignBriefPanel'
import type { BrandDNA } from '@/lib/brand-types'
import { Loader2, Plus } from 'lucide-react'

export default function StudioPage() {
    const router = useRouter()
    const { activeBrandKit, brandKits, loading, setActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const [isGenerating, setIsGenerating] = useState(false)
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [isAnnotating, setIsAnnotating] = useState(false)
    const [logoInclusion, setLogoInclusion] = useState(true)

    const handleNewBrandKit = () => {
        router.push('/brand-kit?action=new')
    }



    const handleGenerate = async (data: {
        platform: string
        headline: string
        cta: string
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
                setCurrentImage(result.imageUrl)
            }
        } catch (error) {
            console.error('Generation failed:', error)
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
                    />

                    {/* Center: Canvas */}
                    <CanvasPanel
                        currentImage={currentImage}
                        isAnnotating={isAnnotating}
                        onAnnotate={() => setIsAnnotating(!isAnnotating)}
                        generations={[]}
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
