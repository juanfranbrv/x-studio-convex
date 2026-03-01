'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Generation {
    id: string
    image_url: string
    image_storage_id?: string
    created_at: string
    prompt_used?: string
    request_payload?: Record<string, unknown>
    error_title?: string
    error_fallback?: string
}

interface ThumbnailHistoryProps {
    generations: Generation[]
    currentImageUrl?: string | null
    onSelectGeneration: (gen: Generation) => void
}

const ITEMS_PER_PAGE = 20

export function ThumbnailHistory({
    generations,
    currentImageUrl,
    onSelectGeneration,
}: ThumbnailHistoryProps) {
    const [page, setPage] = useState(1)

    const totalPages = Math.max(1, Math.ceil(generations.length / ITEMS_PER_PAGE))
    const safePage = Math.max(1, Math.min(page, totalPages))

    const paginatedGenerations = useMemo(() => {
        const start = (safePage - 1) * ITEMS_PER_PAGE
        return generations.slice(start, start + ITEMS_PER_PAGE)
    }, [generations, safePage])

    if (generations.length === 0) return null

    const getSkillLabel = (gen: Generation) => {
        const payload = gen.request_payload || {}
        const skill = payload.compositionSkill as
            | { name?: string; version?: string }
            | undefined
        if (skill?.version) {
            return `${skill.name || 'skill'} v${skill.version}`
        }
        const layoutSkillVersion = payload.layoutSkillVersion as string | undefined
        if (layoutSkillVersion) {
            return `composiciones v${layoutSkillVersion}`
        }
        return null
    }

    return (
        <div className="glass-card p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Historial de sesion
                </p>
                {totalPages > 1 ? (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="inline-flex h-6 w-6 items-center justify-center rounded border border-border/70 text-muted-foreground transition hover:bg-muted disabled:opacity-40"
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={safePage <= 1}
                            aria-label="Pagina anterior"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-1 text-[10px] text-muted-foreground">
                            {safePage}/{totalPages}
                        </span>
                        <button
                            type="button"
                            className="inline-flex h-6 w-6 items-center justify-center rounded border border-border/70 text-muted-foreground transition hover:bg-muted disabled:opacity-40"
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={safePage >= totalPages}
                            aria-label="Pagina siguiente"
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ) : null}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {paginatedGenerations.map((gen) => {
                    const isSelected = currentImageUrl === gen.image_url
                    const skillLabel = getSkillLabel(gen)
                    const imageUrl = typeof gen.image_url === 'string' ? gen.image_url.trim() : ''
                    return (
                        <button
                            key={gen.id}
                            onClick={() => onSelectGeneration(gen)}
                            className={`relative flex-shrink-0 transition-all duration-150 rounded-lg overflow-hidden ${isSelected
                                ? 'ring-2 ring-primary scale-105'
                                : 'opacity-70 hover:opacity-100 hover:scale-102'
                                }`}
                        >
                            <div className="w-14 h-14 bg-muted">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-muted" />
                                )}
                            </div>
                            {skillLabel ? (
                                <span className="absolute left-1 right-1 bottom-1 rounded bg-black/75 px-1 py-0.5 text-[8px] font-medium leading-none text-white truncate">
                                    {skillLabel}
                                </span>
                            ) : null}
                            {isSelected && (
                                <div className="absolute inset-0 bg-primary/10" />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
