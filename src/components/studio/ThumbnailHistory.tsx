'use client'

interface Generation {
    id: string
    image_url: string
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

export function ThumbnailHistory({
    generations,
    currentImageUrl,
    onSelectGeneration,
}: ThumbnailHistoryProps) {
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
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Historial de sesión
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {generations.map((gen) => {
                    const isSelected = currentImageUrl === gen.image_url
                    const skillLabel = getSkillLabel(gen)
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
                                <img
                                    src={gen.image_url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
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
