'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type PanelPosition = 'left' | 'right'

interface UIContextType {
    panelPosition: PanelPosition
    setPanelPosition: (position: PanelPosition) => void
    assistanceEnabled: boolean
    setAssistanceEnabled: (enabled: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [panelPosition, setPanelPositionState] = useState<PanelPosition>('right')
    const [assistanceEnabled, setAssistanceEnabledState] = useState<boolean>(true)

    // Load from localStorage on mount
    useEffect(() => {
        const savedPosition = localStorage.getItem('x-studio-panel-position') as PanelPosition
        if (savedPosition && (savedPosition === 'left' || savedPosition === 'right')) {
            setPanelPositionState(savedPosition)
        }

        const savedAssistance = localStorage.getItem('x-studio-assistance-enabled')
        if (savedAssistance !== null) {
            setAssistanceEnabledState(savedAssistance === 'true')
        }
    }, [])

    const setPanelPosition = (position: PanelPosition) => {
        setPanelPositionState(position)
        localStorage.setItem('x-studio-panel-position', position)
    }

    const setAssistanceEnabled = (enabled: boolean) => {
        setAssistanceEnabledState(enabled)
        localStorage.setItem('x-studio-assistance-enabled', String(enabled))
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
