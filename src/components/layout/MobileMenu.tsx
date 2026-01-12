'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Home, Image, FileSpreadsheet, Settings, Menu, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react'

export function MobileMenu() {
    const { t } = useTranslation()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const navItems = [
        { icon: Home, label: 'nav.home', href: '/' },
        { icon: FileSpreadsheet, label: 'Kit de Marca', href: '/brand-kit' },
        { icon: Image, label: 'nav.studio', href: '/image' },
        { icon: Settings, label: 'nav.settings', href: '/settings' },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0">
                <SheetHeader className="p-6 border-b border-border bg-muted/20">
                    <SheetTitle className="flex items-center gap-2">
                        <Bot className="w-6 h-6 text-primary" />
                        <span>X Studio</span>
                    </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-4 gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label.includes('.') ? t(item.label) : item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
