'use client'

import { ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n, { getInitialLocale, setAppLocale } from '@/lib/i18n'

interface I18nProviderProps {
    children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        void setAppLocale(getInitialLocale())
    }, [mounted])

    // Avoid hydration mismatch
    if (!mounted) {
        return <>{children}</>
    }

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
