'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useUser } from '@clerk/nextjs'

type PanelPosition = 'left' | 'right'

interface UIContextType {
    panelPosition: PanelPosition
    setPanelPosition: (position: PanelPosition) => void
    assistanceEnabled: boolean
    setAssistanceEnabled: (enabled: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser()
    const [panelPosition, setPanelPositionState] = useState<PanelPosition>('right')
    const [assistanceEnabled, setAssistanceEnabledState] = useState<boolean>(false)
    const assistanceStorageKey = useMemo(() => {
        const baseKey = 'x-studio-assistance-enabled'
        return user?.id ? `${baseKey}:${user.id}` : baseKey
    }, [user?.id])

    // Load from localStorage on mount
    useEffect(() => {
        const savedPosition = localStorage.getItem('x-studio-panel-position') as PanelPosition
        if (savedPosition && (savedPosition === 'left' || savedPosition === 'right')) {
            setPanelPositionState(savedPosition)
        }

        if (!isLoaded) return

        const legacyKey = 'x-studio-assistance-enabled'
        const savedAssistance = localStorage.getItem(assistanceStorageKey)

        if (savedAssistance !== null) {
            setAssistanceEnabledState(savedAssistance === 'true')
            return
        }

        const legacyAssistance = localStorage.getItem(legacyKey)
        if (legacyAssistance !== null && user?.id) {
            localStorage.setItem(assistanceStorageKey, legacyAssistance)
            localStorage.removeItem(legacyKey)
            setAssistanceEnabledState(legacyAssistance === 'true')
            return
        }

        if (legacyAssistance !== null && !user?.id) {
            setAssistanceEnabledState(legacyAssistance === 'true')
            return
        }

        setAssistanceEnabledState(false)
    }, [assistanceStorageKey, isLoaded, user?.id])

    const setPanelPosition = (position: PanelPosition) => {
        setPanelPositionState(position)
        localStorage.setItem('x-studio-panel-position', position)
    }

    const setAssistanceEnabled = (enabled: boolean) => {
        setAssistanceEnabledState(enabled)
        localStorage.setItem(assistanceStorageKey, String(enabled))
    }

    return (
        <UIContext.Provider value={{ panelPosition, setPanelPosition, assistanceEnabled, setAssistanceEnabled }}>
            {children}
        </UIContext.Provider>
    )
}

export function useUI() {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider')
    }
    return context
}
