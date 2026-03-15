'use client'

import { ReactNode, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Plus, Settings, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CreditsBadge } from './CreditsBadge'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
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
import { AppLogo } from '@/components/ui/AppLogo'

interface HeaderProps {
    brands?: BrandKitSummary[]
    currentBrand?: BrandDNA | BrandKitSummary | null
    onBrandChange?: (brandId: string) => void
    onBrandDelete?: (brandId: string) => void
    onNewBrandKit?: () => void
    afterBrandActions?: ReactNode
}

export function Header({ brands = [], currentBrand, onBrandChange, onBrandDelete, onNewBrandKit, afterBrandActions }: HeaderProps) {
    const { t } = useTranslation('common')
    const { user } = useUser()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [brandToDelete, setBrandToDelete] = useState<BrandKitSummary | BrandDNA | null>(null)

    const ADMIN_EMAILS = ['juanfranbrv@gmail.com']
    const isAdmin = user?.emailAddresses?.some((email) => ADMIN_EMAILS.includes(email.emailAddress.toLowerCase()))

    const getBrandInitial = (name?: string) => name?.charAt(0).toUpperCase() || '?'

    const getCompletenessStyle = (value?: number) => {
        const percentage = Number.isFinite(value) ? Number(value) : 0
        if (percentage >= 100) return 'text-emerald-700 bg-emerald-500/15 border-emerald-500/30'
        if (percentage < 70) return 'text-red-700 bg-red-500/15 border-red-500/30'
        return 'text-amber-700 bg-amber-500/15 border-amber-500/30'
    }

    const currentBrandName = ('brand_name' in (currentBrand || {}))
        ? (currentBrand as BrandDNA | BrandKitSummary).brand_name
        : t('labels.switchBrand')
    const currentBrandFavicon = (currentBrand as BrandDNA | BrandKitSummary | undefined)?.favicon_url as string | undefined

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
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur-sm md:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
                    <MobileMenu />

                    <div className="flex shrink-0 items-center gap-2">
                        <Link
                            href="/"
                            aria-label={t('header.homeAria')}
                            className="flex items-center gap-2"
                        >
                            <AppLogo className="h-7 w-7 shrink-0" />
                            <span className="font-heading text-lg font-semibold text-primary leading-none">
                                {t('app.name')}
                            </span>
                        </Link>
                    </div>

                    {brands.length > 0 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="w-[clamp(8.5rem,42vw,12rem)] min-w-0 justify-between gap-2 rounded-xl border-border/70 bg-card px-2 transition-colors hover:border-border hover:bg-accent/50 md:w-72 md:px-4">
                                    <span className="flex min-w-0 items-center gap-2">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                            {currentBrandFavicon ? (
                                                <img src={currentBrandFavicon} alt={currentBrandName} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-semibold text-muted-foreground">{getBrandInitial(currentBrandName)}</span>
                                            )}
                                        </span>
                                        <span className="block truncate text-left">{currentBrandName}</span>
                                    </span>
                                    <ChevronDown className="h-4 w-4 shrink-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[320px] rounded-xl border-border bg-popover shadow-lg md:w-[440px]">
                                {brands.map((brand) => (
                                    <DropdownMenuItem
                                        key={brand.id}
                                        onClick={() => onBrandChange?.(brand.id)}
                                        className={`group gap-3 ${brand.id === currentBrand?.id ? 'bg-accent' : ''}`}
                                    >
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                            {brand.favicon_url ? (
                                                <img src={brand.favicon_url} alt={brand.brand_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-semibold text-muted-foreground">{getBrandInitial(brand.brand_name)}</span>
                                            )}
                                        </div>
                                        <div className="flex min-w-0 flex-1 items-center gap-2">
                                            <span className="truncate">{brand.brand_name}</span>
                                            <span className={`whitespace-nowrap rounded-md border px-1.5 py-0.5 text-xs font-semibold ${getCompletenessStyle(brand.completeness)}`}>
                                                {Math.max(0, Math.min(100, Math.round(brand.completeness ?? 0)))}%
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                            onClick={(e) => handleDeleteClick(brand, e)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem className="cursor-pointer text-primary" onClick={onNewBrandKit}>
                                    + {t('labels.newBrand')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}

                    {onNewBrandKit ? (
                        <Button variant="outline" size="sm" onClick={onNewBrandKit} className="hidden gap-2 rounded-xl border-border/70 bg-card transition-colors hover:border-border hover:bg-accent/50 md:flex">
                            <Plus className="h-4 w-4" />
                            {t('actions.newBrandKit')}
                        </Button>
                    ) : null}

                    {afterBrandActions ? (
                        <div className="hidden min-w-0 items-center md:flex">
                            {afterBrandActions}
                        </div>
                    ) : null}
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1 md:gap-2">
                    <Link href="/settings#credits" className="origin-right scale-75 sm:scale-90 md:mr-2 md:scale-100">
                        <CreditsBadge />
                    </Link>

                    {isAdmin ? (
                        <Link href="/admin" target="_blank" rel="noreferrer">
                            <Button
                                variant="ghost"
                                size="icon"
                                title={t('labels.adminPanel')}
                                className="hidden h-9 w-9 rounded-full hover:bg-accent/60 md:flex"
                            >
                                <Settings className="h-4.5 w-4.5" />
                            </Button>
                        </Link>
                    ) : null}

                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>
                    <ThemeToggle className="hidden h-9 w-9 rounded-full hover:bg-accent/60 md:inline-flex" />
                </div>
            </header>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5" />
                            {t('brand.deleteTitle', { name: (brandToDelete as BrandDNA | BrandKitSummary | null)?.brand_name || '' })}
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="text-muted-foreground">
                                {t('brand.deleteIntro')}
                                <ul className="mt-2 list-inside list-disc space-y-1">
                                    <li>{t('brand.deleteItems.colors')}</li>
                                    <li>{t('brand.deleteItems.typography')}</li>
                                    <li>{t('brand.deleteItems.assets')}</li>
                                    <li>{t('brand.deleteItems.voice')}</li>
                                </ul>
                                <p className="mt-3 font-semibold">{t('brand.deleteWarning')}</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('brand.deleteConfirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
