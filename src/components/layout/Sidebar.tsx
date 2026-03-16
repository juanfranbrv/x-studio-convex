'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import {
    IconHome,
    IconBrandKit,
    IconImage,
    IconStudio,
    IconCarousel,
    IconVideo,
    IconSettings,
    IconUser,
    IconLogout,
} from '@/components/ui/icons'
import { AppLogo } from '@/components/ui/AppLogo'
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

export function Sidebar({ className }: SidebarProps) {
    const { t } = useTranslation('common')
    const pathname = usePathname()
    const { user } = useUser()
    const { signOut } = useClerk()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const navItems = [
        { icon: IconHome, label: t('nav.home'), href: '/' },
        { icon: IconBrandKit, label: t('nav.brandKit'), href: '/brand-kit' },
        { icon: IconImage, label: t('nav.image'), href: '/image' },
        { icon: IconStudio, label: t('nav.studioWorkspace'), href: '/studio' },
        { icon: IconCarousel, label: t('nav.carousel'), href: '/carousel' },
        { icon: IconVideo, label: t('nav.video'), href: '/video' },
    ]

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await signOut({ redirectUrl: '/' })
        } catch (error) {
            console.error('Error closing session:', error)
            setIsLoggingOut(false)
        }
    }

    return (
        <aside
            className={cn(
                'flex h-screen w-[90px] shrink-0 flex-col border-r border-border/60 bg-surface transition-colors duration-300 ease-in-out',
                className
            )}
        >
            <div className="flex flex-col items-center gap-2 border-b border-border/60 p-4">
                <Link href="/" aria-label="Post laboratory">
                    <AppLogo className="h-11 w-14" />
                </Link>
            </div>

            <nav className="scrollbar-none flex flex-1 flex-col gap-3 overflow-y-auto px-2 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 transition-colors duration-200',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                            )}
                        >
                            <item.icon className={cn('h-8 w-8 shrink-0', isActive ? 'text-primary-foreground' : 'text-primary')} />
                            <span className="text-center text-[13px] font-semibold leading-tight">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="flex flex-col items-center gap-3 border-t border-border/60 p-2 pb-6">
                <Link
                    href="/settings"
                    className={cn(
                        'group flex w-full flex-col items-center justify-center gap-1.5 rounded-xl p-2 transition-colors duration-200',
                        pathname === '/settings'
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                    )}
                >
                    <IconSettings className={cn('h-8 w-8 shrink-0', pathname === '/settings' ? 'text-primary-foreground' : 'text-primary')} />
                    <span className="text-[13px] font-semibold">{t('nav.settings')}</span>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-brand-secondary bg-muted shadow-sm transition-colors transition-shadow duration-200 hover:ring-2 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50">
                            {user?.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt={user.firstName || t('labels.user')}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                                    {user?.firstName?.[0] || 'U'}
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.fullName || user?.firstName || t('labels.user')}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || ''}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="cursor-pointer">
                                <IconUser className="mr-2 h-4 w-4" />
                                <span>{t('labels.myAccount')}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4" />
                                    <span>{t('actions.loggingOut')}</span>
                                </>
                            ) : (
                                <>
                                    <IconLogout className="mr-2 h-4 w-4" />
                                    <span>{t('actions.logout')}</span>
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}


