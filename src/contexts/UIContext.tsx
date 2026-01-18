'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type PanelPosition = 'left' | 'right'

interface UIContextType {
    panelPosition: PanelPosition
    setPanelPosition: (position: PanelPosition) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [panelPosition, setPanelPositionState] = useState<PanelPosition>('right')

    // Load from localStorage on mount
    useEffect(() => {
        const savedPosition = localStorage.getItem('x-studio-panel-position') as PanelPosition
        if (savedPosition && (savedPosition === 'left' || savedPosition === 'right')) {
            setPanelPositionState(savedPosition)
        }
    }, [])

    const setPanelPosition = (position: PanelPosition) => {
        setPanelPositionState(position)
        localStorage.setItem('x-studio-panel-position', position)
    }

    return (
        <UIContext.Provider value={{ panelPosition, setPanelPosition }}>
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
