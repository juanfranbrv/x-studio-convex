'use client'

import { Loader2 } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { IconArrowUp02, IconRotate } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

type StudioEditPromptBarProps = {
    editPrompt: string
    onEditPromptChange: (value: string) => void
    onApply: () => void
    isApplying: boolean
    isEnabled: boolean
    hasGeneratedImage: boolean
    editPlaceholder: string
    applyLabel: string
}

type StudioGenerateBarProps = {
    onGenerate: () => void
    onRetry: () => void
    onCancelGenerate: () => void
    isGenerating: boolean
    isCancelingGenerate: boolean
    canGenerate: boolean
    hasGeneratedImage: boolean
    generatingLabel: string
    generateLabel: string
    retryLabel: string
    stopLabel: string
    cancelingLabel: string
}

export function StudioEditPromptBar({
    editPrompt,
    onEditPromptChange,
    onApply,
    isApplying,
    isEnabled,
    hasGeneratedImage,
    editPlaceholder,
    applyLabel,
}: StudioEditPromptBarProps) {
    return (
        <div className="w-full">
            <div className="relative w-full">
                <Textarea
                    placeholder={editPlaceholder}
                    value={editPrompt}
                    onChange={(e) => onEditPromptChange(e.target.value)}
                    disabled={!isEnabled}
                    className={cn(
                        "w-full min-h-[48px] max-h-[140px] resize-none rounded-[1.2rem] border-border/55 bg-background !text-[14px] leading-6 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] placeholder:!text-[14px] placeholder:leading-6 placeholder:text-muted-foreground focus:border-primary/45 focus:ring-1 focus:ring-primary/40 disabled:cursor-not-allowed disabled:bg-background disabled:text-muted-foreground transition-all pr-14",
                    )}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            if (hasGeneratedImage && editPrompt.trim()) {
                                onApply()
                            }
                        }
                    }}
                />
                <Button
                    onClick={onApply}
                    disabled={isApplying || !hasGeneratedImage || !editPrompt.trim()}
                    size="icon"
                    className={cn(
                        "absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-[1rem] transition-all",
                        hasGeneratedImage
                            ? "bg-primary text-primary-foreground shadow-[0_16px_34px_-18px_rgba(59,130,246,0.68)] hover:bg-primary/90"
                            : "bg-muted text-muted-foreground opacity-70"
                    )}
                    aria-label={applyLabel}
                    title={applyLabel}
                >
                    <IconArrowUp02 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    )
}

export function StudioGenerateBar({
    onGenerate,
    onRetry,
    onCancelGenerate,
    isGenerating,
    isCancelingGenerate,
    canGenerate,
    hasGeneratedImage,
    generatingLabel,
    generateLabel,
    retryLabel,
    stopLabel,
    cancelingLabel,
}: StudioGenerateBarProps) {
    return (
        <div className="relative w-full">
            <Button
                onClick={hasGeneratedImage ? onRetry : onGenerate}
                disabled={isGenerating || !canGenerate}
                className={cn(
                    'group feedback-action h-[46px] w-full rounded-[1rem] bg-primary text-[clamp(0.98rem,0.94rem+0.12vw,1.04rem)] font-semibold text-primary-foreground shadow-[0_18px_40px_-24px_rgba(59,130,246,0.65)] transition-all hover:bg-primary/90 hover:shadow-primary/25',
                    isGenerating && 'pr-28'
                )}
            >
                <span className="inline-flex min-w-0 items-center justify-center gap-2">
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-5 w-5" />
                            <span className="truncate">{generatingLabel}</span>
                        </>
                    ) : hasGeneratedImage ? (
                        <>
                            <IconRotate className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 group-hover:-rotate-45" />
                            <span className="truncate">{retryLabel}</span>
                        </>
                    ) : (
                        <>
                            <span className="truncate">{generateLabel}</span>
                        </>
                    )}
                </span>
            </Button>
            {isGenerating ? (
                <button
                    type="button"
                    onClick={onCancelGenerate}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[clamp(0.82rem,0.78rem+0.1vw,0.88rem)] font-semibold text-primary-foreground transition-colors hover:text-primary-foreground"
                >
                    {isCancelingGenerate ? cancelingLabel : stopLabel}
                </button>
            ) : null}
        </div>
    )
}
