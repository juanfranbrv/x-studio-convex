'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Bot, Home, Image, GalleryHorizontal, Play, Settings, FileSpreadsheet, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    className?: string
}

const navItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: FileSpreadsheet, label: 'Brand Kit', href: '/brand-kit' },
    { icon: Image, label: 'Imagen', href: '/image' },
    { icon: GalleryHorizontal, label: 'Carrusel', href: '/carousel' },
    { icon: Play, label: 'Video', href: '/video' },
]

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { user } = useUser()

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
                                    ? 'bg-brand-gradient text-white shadow-lg'
                                    : 'hover:bg-white/60 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <item.icon className={cn(
                                'h-6 w-6 shrink-0',
                                isActive ? 'text-white' : 'text-primary'
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
                            ? 'bg-brand-gradient text-white shadow-lg'
                            : 'hover:bg-white/60 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground'
                    )}
                >
                    <Settings className={cn(
                        'h-6 w-6 shrink-0',
                        pathname === '/settings' ? 'text-white' : 'text-primary'
                    )} />
                    <span className="text-xs font-medium">Ajustes</span>
                </Link>

                {/* User Profile - Avatar Only */}
                <div className="h-10 w-10 shrink-0 rounded-full border-2 border-brand-secondary overflow-hidden shadow-sm bg-muted cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
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
                </div>
            </div>
        </aside>
    )
}


