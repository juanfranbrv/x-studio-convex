'use client'

import { IconGlobe } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { setAppLocale } from '@/lib/i18n'
import { AppLocale, LOCALE_LABELS, SUPPORTED_LOCALES } from '@/locales/config'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageSwitcherProps {
    compact?: boolean
    align?: 'start' | 'center' | 'end'
}

export function LanguageSwitcher({ compact = false, align = 'end' }: LanguageSwitcherProps) {
    const { i18n, t } = useTranslation('common')
    const activeLocale = (i18n.language || 'es-ES') as AppLocale

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={compact ? 'h-9 gap-2 rounded-xl px-3' : 'h-9 gap-2 rounded-full px-3'}
                >
                    <IconGlobe className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                        {activeLocale.slice(0, 2)}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="min-w-40">
                {SUPPORTED_LOCALES.map((locale) => (
                    <DropdownMenuItem
                        key={locale}
                        className="cursor-pointer justify-between"
                        onClick={() => void setAppLocale(locale)}
                    >
                        <span>{t(`language.${locale}`)}</span>
                        {locale === activeLocale ? (
                            <span className="text-xs text-muted-foreground">{LOCALE_LABELS[locale]}</span>
                        ) : null}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
