'use client'

import { useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import { Bot, Bell, ChevronDown, Trash2, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CreditsBadge } from './CreditsBadge'
import { MobileMenu } from './MobileMenu'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { BrandKitSummary, BrandDNA } from '@/lib/brand-types'

interface HeaderProps {
    brands?: BrandKitSummary[]
    currentBrand?: BrandDNA | BrandKitSummary | null
    onBrandChange?: (brandId: string) => void
    onBrandDelete?: (brandId: string) => void
    onNewBrandKit?: () => void
}

export function Header({ brands = [], currentBrand, onBrandChange, onBrandDelete, onNewBrandKit }: HeaderProps) {
    const { t } = useTranslation()
    const { resolvedTheme } = useTheme()
    const { user } = useUser()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [brandToDelete, setBrandToDelete] = useState<BrandKitSummary | BrandDNA | null>(null)

    // Admin check
    const ADMIN_EMAILS = ['juanfranbrv@gmail.com']
    const isAdmin = user?.emailAddresses?.some(e => ADMIN_EMAILS.includes(e.emailAddress.toLowerCase()))

    const getBrandInitial = (name?: string) => {
        return name?.charAt(0).toUpperCase() || '?'
    }

    const currentBrandName = ('brand_name' in (currentBrand || {}))
        ? (currentBrand as any).brand_name
        : t('common.switchBrand')
    const currentBrandFavicon = (currentBrand as any)?.favicon_url as string | undefined

    const handleDeleteClick = (brand: BrandKitSummary | BrandDNA, e: React.MouseEvent) => {
        e.stopPropagation()
        setBrandToDelete(brand)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (brandToDelete && onBrandDelete) {
            onBrandDelete(brandToDelete.id!)
        }
        setDeleteDialogOpen(false)
        setBrandToDelete(null)
    }

    return (
        <>
            <header className="h-16 border-b border-white/20 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Mobile Menu Trigger */}
                    <MobileMenu />

                    {/* Logo / Robot Icon */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold font-heading text-primary hidden md:block">X Studio</h1>
                    </div>

                    {brands.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 w-[140px] md:w-72 justify-between px-2 md:px-4 bg-white/50 dark:bg-white/10 border-white/30 hover:bg-white/80 hover:border-primary/50 rounded-xl">
                                    <span className="flex items-center gap-2 min-w-0">
                                        <span className="w-6 h-6 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {currentBrandFavicon ? (
                                                <img
                                                    src={currentBrandFavicon}
                                                    alt={currentBrandName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-semibold text-muted-foreground">
                                                    {getBrandInitial(currentBrandName)}
                                                </span>
                                            )}
                                        </span>
                                        <span className="truncate block text-left">{currentBrandName}</span>
                                    </span>
                                    <ChevronDown className="h-4 w-4 shrink-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[200px] md:w-72 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-white/30 shadow-aero-lg rounded-xl">
                                {brands.map((brand) => (
                                    <DropdownMenuItem
                                        key={brand.id}
                                        onClick={() => onBrandChange?.(brand.id)}
                                        className={`gap-3 group ${brand.id === currentBrand?.id ? 'bg-accent' : ''}`}
                                    >
                                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {brand.favicon_url ? (
                                                <img
                                                    src={brand.favicon_url}
                                                    alt={brand.brand_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-muted-foreground">
                                                    {getBrandInitial(brand.brand_name)}
                                                </span>
                                            )}
                                        </div>
                                        <span className="flex-1 truncate">{brand.brand_name}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                            onClick={(e) => handleDeleteClick(brand, e)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                    className="text-primary cursor-pointer"
                                    onClick={onNewBrandKit}
                                >
                                    + {t('common.newBrand')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {onNewBrandKit && (
                        <Button variant="outline" size="sm" onClick={onNewBrandKit} className="gap-2 hidden md:flex bg-white/50 dark:bg-white/10 border-white/30 hover:bg-white/80 hover:border-primary/50 rounded-xl">
                            <Plus className="h-4 w-4" />
                            Nuevo Kit de Marca
                        </Button>
                    )}
                </div>

                {/* Right: Credits, Theme Toggle, Notifications */}
                <div className="flex items-center gap-2">
                    <div className="scale-90 md:scale-100 origin-right mr-2">
                        <CreditsBadge />
                    </div>

                    {isAdmin && (
                        <Link href="/admin" target="_blank" rel="noreferrer">
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Panel Admin"
                                className="hidden md:flex rounded-full w-9 h-9 hover:bg-white/60 dark:hover:bg-white/10"
                            >
                                <Settings className="h-4.5 w-4.5" />
                            </Button>
                        </Link>
                    )}

                    <ThemeToggle className="rounded-full w-9 h-9 hover:bg-white/60 dark:hover:bg-white/10" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative hidden md:flex rounded-full w-9 h-9 hover:bg-white/60 dark:hover:bg-white/10"
                    >
                        <Bell className="h-4.5 w-4.5" />
                        <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-brand-secondary rounded-full border border-white dark:border-zinc-900 animate-pulse" />
                    </Button>
                </div>
            </header>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="w-5 h-5" />
                            ¿Eliminar "{(brandToDelete as any)?.brand_name}"?
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="text-muted-foreground">
                                Se perderán permanentemente todos los datos de este Kit de Marca:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Colores y paletas</li>
                                    <li>Tipografías</li>
                                    <li>Assets visuales (logos, imágenes)</li>
                                    <li>Valores y tono de voz</li>
                                </ul>
                                <p className="mt-3 font-semibold">Esta acción no se puede deshacer.</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar Kit de Marca
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
