'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import iconsData from '@/lib/icons/material-icons.json'

interface IconMetadata {
    name: string
    tags: string[]
    categories: string[]
    version: number
    type: 'icon' | 'symbol'
    hasSymbol?: boolean
    hasIconVersion?: boolean
}

interface IconSelectorProps {
    onSelect: (svgString: string) => void
    onClose: () => void
}

export function IconSelector({ onSelect, onClose }: IconSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)

    const filteredIcons = useMemo(() => {
        if (!searchTerm.trim()) return (iconsData as IconMetadata[]).slice(0, 100)
        const term = searchTerm.toLowerCase()
        return (iconsData as IconMetadata[]).filter(icon =>
            icon.name.toLowerCase().includes(term) ||
            icon.tags.some(tag => tag.toLowerCase().includes(term))
        ).slice(0, 200)
    }, [searchTerm])

    const handleSelectIcon = async (icon: IconMetadata) => {
        setLoading(true)
        try {
            // Determine the base URL
            // Material Icons: https://fonts.gstatic.com/s/i/materialicons/{name}/v{version}/24px.svg
            // Material Symbols Outlined: https://fonts.gstatic.com/s/i/materialsymbolsoutlined/{name}/v{version}/24px.svg

            const isSymbol = icon.type === 'symbol'
            const family = isSymbol ? 'materialsymbolsoutlined' : 'materialicons'
            const url = `https://fonts.gstatic.com/s/i/${family}/${icon.name}/v${icon.version}/24px.svg`

            const response = await fetch(url)
            if (!response.ok) throw new Error('Failed to fetch SVG')

            let svgText = await response.text()

            // Standardize the SVG
            // Material Icons usually come with width/height 24 and viewbox 0 0 24 24
            // We should make sure it doesn't have fixed colors if possible, but currentColor is usually best.
            svgText = svgText
                .replace(/width="24"/g, '')
                .replace(/height="24"/g, '')
                .replace(/fill="none"/g, '') // Sometimes needed
                .replace(/fill="black"/g, 'fill="currentColor"')
                .replace(/<svg/, '<svg fill="currentColor" ')

            if (!svgText.includes('viewBox')) {
                svgText = svgText.replace('<svg', '<svg viewBox="0 0 24 24"')
            }

            onSelect(svgText)
            onClose()
        } catch (error) {
            console.error('Error selecting icon:', error)
            alert('Error al cargar el icono. Intenta con otro.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-xl border border-border bg-card shadow-2xl">
                <header className="flex items-center justify-between border-b border-border p-4">
                    <h2 className="text-lg font-semibold text-foreground">Seleccionar Icono Material</h2>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-muted transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o etiqueta (ej: settings, home, menu)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 thin-scrollbar">
                    {loading && (
                        <div className="flex h-full items-center justify-center">
                            <span className="text-sm text-muted-foreground">Cargando icono...</span>
                        </div>
                    )}

                    {!loading && (
                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
                            {filteredIcons.map((icon) => (
                                <button
                                    key={icon.name}
                                    onClick={() => handleSelectIcon(icon)}
                                    className="flex flex-col items-center gap-2 rounded-lg border border-transparent p-2 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                    title={icon.name}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted group-hover:bg-primary/10">
                                        <img
                                            src={`https://fonts.gstatic.com/s/i/${icon.type === 'symbol' ? 'materialsymbolsoutlined' : 'materialicons'}/${icon.name}/v${icon.version}/24px.svg`}
                                            alt={icon.name}
                                            className="h-6 w-6 opacity-70 group-hover:opacity-100"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PC9zdmc+'
                                            }}
                                        />
                                    </div>
                                    <div className="flex w-full items-center justify-center gap-1">
                                        <span className="truncate text-[10px] text-muted-foreground">{icon.name}</span>
                                        {icon.type === 'symbol' && <span className="text-[8px] opacity-40">S</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!loading && filteredIcons.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-8">No se encontraron iconos.</p>
                    )}
                </div>

                <footer className="border-t border-border p-3 text-right">
                    <p className="text-[10px] text-muted-foreground">Mostrando {filteredIcons.length} de {iconsData.length} iconos disponibles</p>
                </footer>
            </div>
        </div>
    )
}
