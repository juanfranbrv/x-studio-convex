'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Bot, Home, Palette, Type, Image, Settings, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
    className?: string
}

const navItems = [
    { icon: Home, label: 'nav.home', href: '/' },
    { icon: FileSpreadsheet, label: 'Brand Kit', href: '/brand-kit' },
    { icon: Palette, label: 'nav.studio', href: '/studio' },
    { icon: Type, label: 'brandDNA.typography', href: '/studio' },
    { icon: Image, label: 'canvas.title', href: '/studio' },
]

export function Sidebar({ className }: SidebarProps) {
    const { t } = useTranslation()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                'flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300',
                collapsed ? 'w-20' : 'w-20',
                className
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
                <Bot className="w-8 h-8 text-primary" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col items-center gap-6 py-4">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-0.5 group w-full">
                        <Button
                            variant="ghost"
                            className="w-14 h-14 p-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <item.icon className="size-7" strokeWidth={2} />
                        </Button>
                        <span className="text-xs text-sidebar-foreground group-hover:text-primary font-semibold text-center leading-none w-full px-1">
                            {item.label.includes('.') ? t(item.label) : item.label}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Settings at bottom */}
            <div className="flex flex-col items-center gap-0.5 py-4 border-t border-sidebar-border">
                <Button variant="ghost" className="w-14 h-14 p-0 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Settings className="size-7" strokeWidth={2} />
                </Button>
                <span className="text-xs text-sidebar-foreground font-semibold text-center leading-none">
                    {t('nav.settings')}
                </span>
            </div>
        </aside>
    )
}
