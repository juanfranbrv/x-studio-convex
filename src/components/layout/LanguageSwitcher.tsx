'use client'

import { IconGlobe } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { setAppLocale } from '@/lib/i18n'
import { AppLocale, LOCALE_LABELS, SUPPORTED_LOCALES } from '@/locales/config'
import { Button } from '@/components/ui/button'
import {
    HEADER_DROPDOWN_CONTENT_CLASS,
    HEADER_DROPDOWN_ITEM_CLASS,
    HEADER_DROPDOWN_META_CLASS,
} from './headerDropdownStyles'
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
                    size="default"
                    className={compact ? 'h-10 gap-2 rounded-xl px-3 text-[1rem] text-foreground' : 'h-10 gap-2 rounded-full px-3 text-[1rem] text-foreground'}
                >
                    <IconGlobe className="h-4 w-4" />
                    <span className="text-[1rem] font-semibold uppercase tracking-[0.12em]">
                        {activeLocale.slice(0, 2)}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className={`min-w-48 ${HEADER_DROPDOWN_CONTENT_CLASS}`}>
                {SUPPORTED_LOCALES.map((locale) => (
                    <DropdownMenuItem
                        key={locale}
                        className={`${HEADER_DROPDOWN_ITEM_CLASS} cursor-pointer justify-between`}
                        onClick={() => void setAppLocale(locale)}
                    >
                        <span className="text-[clamp(1rem,0.96rem+0.2vw,1.08rem)] font-medium leading-tight">
                            {t(`language.${locale}`)}
                        </span>
                        {locale === activeLocale ? (
                            <span className={`${HEADER_DROPDOWN_META_CLASS} text-muted-foreground`}>
                                {LOCALE_LABELS[locale]}
                            </span>
                        ) : null}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
