'use client'

import { createElement, type ComponentType } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

const ICON_NAME_ALIASES: Record<string, keyof typeof LucideIcons> = {
    Grid2X2: 'Grid2x2',
    Grid3X3: 'Grid3x3',
}

function resolveLucideIconName(iconName: string): keyof typeof LucideIcons | null {
    const trimmed = iconName.trim()
    if (!trimmed) return null

    const direct = ICON_NAME_ALIASES[trimmed] || trimmed
    if (direct in LucideIcons) {
        return direct as keyof typeof LucideIcons
    }

    const lower = trimmed.toLowerCase()
    const matched = Object.keys(LucideIcons).find((key) => key.toLowerCase() === lower)
    return matched ? (matched as keyof typeof LucideIcons) : null
}

export function getLucideLayoutIcon(iconName: string) {
    const resolved = resolveLucideIconName(iconName)
    if (!resolved) return null

    const Icon = LucideIcons[resolved]
    return typeof Icon === 'function' ? (Icon as ComponentType<LucideProps>) : null
}

export function renderLucideLayoutIcon(
    iconName: string,
    props?: LucideProps
) {
    const Icon = getLucideLayoutIcon(iconName)
    if (!Icon) return null
    return createElement(Icon, props)
}
