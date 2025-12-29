'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { I18nProvider } from '@/components/providers/I18nProvider'

import { BrandKitSummary, BrandDNA } from '@/lib/brand-types'

interface DashboardLayoutProps {
    children: ReactNode
    brands?: BrandKitSummary[]
    currentBrand?: BrandDNA | BrandKitSummary | null
    onBrandChange?: (brandId: string) => void
    onBrandDelete?: (brandId: string) => void
    onNewBrandKit?: () => void
}

export function DashboardLayout({
    children,
    brands = [],
    currentBrand,
    onBrandChange,
    onBrandDelete,
    onNewBrandKit
}: DashboardLayoutProps) {
    return (
        <I18nProvider>
            <div className="flex h-screen bg-background text-foreground overflow-hidden">
                {/* Lateral Navigation (Fixed) */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top Bar (Fixed) */}
                    <Header
                        brands={brands}
                        currentBrand={currentBrand}
                        onBrandChange={onBrandChange}
                        onBrandDelete={onBrandDelete}
                        onNewBrandKit={onNewBrandKit}
                    />

                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                        {children}
                    </div>
                </div>
            </div>
        </I18nProvider>
    )
}
