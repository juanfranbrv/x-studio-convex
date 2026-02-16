'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { I18nProvider } from '@/components/providers/I18nProvider'
import { ProtectedRoute } from '@/components/providers/ProtectedRoute'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import { useBrandKit } from '@/contexts/BrandKitContext'

import { BrandKitSummary, BrandDNA } from '@/lib/brand-types'

interface DashboardLayoutProps {
    children: ReactNode
    brands?: BrandKitSummary[]
    currentBrand?: BrandDNA | BrandKitSummary | null
    onBrandChange?: (brandId: string) => void
    onBrandDelete?: (brandId: string) => void
    onNewBrandKit?: () => void
    isFixed?: boolean
}

export function DashboardLayout({
    children,
    brands = [],
    currentBrand,
    onBrandChange,
    onBrandDelete,
    onNewBrandKit,
    isFixed = false
}: DashboardLayoutProps) {
    const { user } = useUser()
    const { brandKits, loading: brandKitsLoading } = useBrandKit()
    const userRecord = useQuery(api.users.getUser, user?.id ? { clerk_id: user.id } : "skip")
    const completeOnboarding = useMutation(api.users.completeOnboarding)

    const [showOnboarding, setShowOnboarding] = useState(false)

    // Detectar si debemos mostrar el modal de onboarding
    useEffect(() => {
        if (
            user?.id &&
            userRecord !== undefined &&
            !brandKitsLoading &&
            // Usuario no ha completado onboarding
            !userRecord?.onboarding_completed &&
            // Usuario no tiene Brand Kits
            brandKits.length === 0
        ) {
            setShowOnboarding(true)
        }
    }, [user?.id, userRecord, brandKitsLoading, brandKits.length])

    const handleOnboardingComplete = async () => {
        if (user?.id) {
            try {
                await completeOnboarding({ clerk_id: user.id })
            } catch (error) {
                console.error('Error completing onboarding:', error)
            }
        }
    }

    return (
        <ProtectedRoute>
            <I18nProvider>
                <div className="flex h-screen bg-mesh text-foreground overflow-hidden">
                    {/* Lateral Navigation (Desktop Only) */}
                    <Sidebar className="hidden md:flex" />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                        {/* Top Bar (Fixed) */}
                        <Header
                            brands={brands}
                            currentBrand={currentBrand}
                            onBrandChange={onBrandChange}
                            onBrandDelete={onBrandDelete}
                            onNewBrandKit={onNewBrandKit}
                        />

                        {/* Scrollable Content Container */}
                        <div className={cn(
                            "flex-1 min-w-0 overflow-x-hidden scrollbar-hide flex flex-col min-h-0 md:pb-0",
                            isFixed ? "overflow-hidden" : "overflow-y-auto"
                        )}>
                            {children}
                        </div>

                        {/* Mobile Navigation (Bottom Fixed) - Deprecated, moved to Header Menu */}
                    </div>
                </div>

                {/* Onboarding Modal */}
                <OnboardingModal
                    isOpen={showOnboarding}
                    onClose={() => setShowOnboarding(false)}
                    onComplete={handleOnboardingComplete}
                />
            </I18nProvider>
        </ProtectedRoute>
    )
}
