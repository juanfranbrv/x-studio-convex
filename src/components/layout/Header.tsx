'use client'

import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import { Bot, Bell, ChevronDown, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [brandToDelete, setBrandToDelete] = useState<BrandKitSummary | BrandDNA | null>(null)

    const getBrandInitial = (name?: string) => {
        return name?.charAt(0).toUpperCase() || '?'
    }

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
            <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold font-heading">X Studio</h1>

                    {brands.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 w-72 justify-between">
                                    {('brand_name' in (currentBrand || {})) ? (currentBrand as any).brand_name : t('common.switchBrand')}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-72">
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
                                        <span className="flex-1">{brand.brand_name}</span>
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
                                <DropdownMenuItem className="text-primary">
                                    + {t('common.newBrand')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {onNewBrandKit && (
                        <Button variant="outline" size="sm" onClick={onNewBrandKit} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Brand Kit
                        </Button>
                    )}
                </div>

                {/* Right: Theme Toggle, Notifications and User */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                    </Button>

                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            baseTheme: resolvedTheme === 'dark' ? dark : undefined,
                            elements: {
                                avatarBox: 'w-8 h-8',
                            },
                        }}
                    />
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
                                Se perderán permanentemente todos los datos de este Brand Kit:
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
                            Eliminar Brand Kit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
