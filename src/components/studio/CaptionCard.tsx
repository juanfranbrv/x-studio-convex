'use client'

import { useState } from 'react'
import { Copy, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CaptionCardProps {
    caption: string
    onChange: (value: string) => void
    onRegenerate?: () => void
    isRegenerating?: boolean
}

export function CaptionCard({
    caption,
    onChange,
    onRegenerate,
    isRegenerating = false,
}: CaptionCardProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(caption)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Caption para redes
                </p>
                <div className="flex items-center gap-1">
                    {onRegenerate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={onRegenerate}
                            disabled={isRegenerating}
                            title="Regenerar caption"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={handleCopy}
                        title="Copiar"
                    >
                        {copied ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                            <Copy className="w-3.5 h-3.5" />
                        )}
                    </Button>
                </div>
            </div>
            <textarea
                value={caption}
                onChange={(e) => onChange(e.target.value)}
                placeholder="El caption aparecerá aquí después de generar..."
                className="w-full min-h-[80px] text-sm p-3 rounded-lg border border-white/10 bg-white/5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60"
                rows={3}
            />
        </div>
    )
}
