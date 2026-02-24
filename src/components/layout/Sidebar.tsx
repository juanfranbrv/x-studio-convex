'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { Bot, Home, Image, GalleryHorizontal, Play, Settings, FileSpreadsheet, LogOut, User, Loader2, PanelsTopLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SidebarProps {
    className?: string
}

const navItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: FileSpreadsheet, label: 'Kit de Marca', href: '/brand-kit' },
    { icon: Image, label: 'Imagen', href: '/image' },
    { icon: PanelsTopLeft, label: 'Estudio', href: '/studio' },
    { icon: GalleryHorizontal, label: 'Carrusel', href: '/carousel' },
    { icon: Play, label: 'Video', href: '/video' },
]

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { user } = useUser()
    const { signOut } = useClerk()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await signOut({ redirectUrl: '/' })
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            setIsLoggingOut(false)
        }
    }

    return (
        <aside
            className={cn(
                'h-screen transition-all duration-300 ease-in-out border-r border-white/20 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl flex flex-col shrink-0 w-[90px]',
                className
            )}
        >
            {/* 1. Header / Logo */}
            <div className="p-4 flex flex-col items-center gap-2 border-b border-white/10">
                <Bot className="h-8 w-8 text-primary" />
            </div>

            {/* 2. Main Navigation */}
            <nav className="flex-1 px-2 py-4 flex flex-col gap-3 overflow-y-auto scrollbar-none">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group gap-1.5',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'hover:bg-white/60 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <item.icon className={cn(
                                'h-6 w-6 shrink-0',
                                isActive ? 'text-primary-foreground' : 'text-primary'
                            )} />
                            <span className="text-xs font-medium leading-tight text-center">
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            {/* 3. Bottom Section (Settings + Profile) */}
            <div className="p-2 border-t border-white/20 flex flex-col gap-3 items-center pb-6">
                {/* Settings */}
                <Link
                    href="/settings"
                    className={cn(
                        'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group gap-1.5 w-full',
                        pathname === '/settings'
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'hover:bg-white/60 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground'
                    )}
                >
                    <Settings className={cn(
                        'h-6 w-6 shrink-0',
                        pathname === '/settings' ? 'text-primary-foreground' : 'text-primary'
                    )} />
                    <span className="text-xs font-medium">Ajustes</span>
                </Link>

                {/* User Profile - Avatar with Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="h-10 w-10 shrink-0 rounded-full border-2 border-brand-secondary overflow-hidden shadow-sm bg-muted cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50">
                            {user?.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt={user.firstName || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                                    {user?.firstName?.[0] || 'U'}
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.fullName || user?.firstName || 'Usuario'}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.primaryEmailAddress?.emailAddress || ''}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Mi cuenta</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Cerrando...</span>
                                </>
                            ) : (
                                <>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}
