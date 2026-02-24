'use client'

import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useBrandKit } from '@/contexts/BrandKitContext'

export default function StudioPage() {
    const router = useRouter()
    const { activeBrandKit, brandKits, setActiveBrandKit, deleteBrandKitById } = useBrandKit()

    const handleNewBrandKit = () => {
        router.push('/brand-kit/new')
    }

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
            onBrandDelete={deleteBrandKitById}
            onNewBrandKit={handleNewBrandKit}
        >
            <div className="flex h-full">
                <section className="flex-1 min-h-0 border-r border-border/40" />
                <aside className="w-full md:w-[27%] min-h-0" />
            </div>
        </DashboardLayout>
    )
}

