'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { I18nProvider } from '@/components/providers/I18nProvider'

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
    return (
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
        </I18nProvider>
    )
}
