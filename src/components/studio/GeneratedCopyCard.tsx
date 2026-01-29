import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Copy, RefreshCw, Share2, Lock, Unlock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrandKit } from '@/contexts/BrandKitContext'

interface GeneratedCopyCardProps {
    copy?: string | null
    hashtags?: string[]
    onCopy?: (text: string) => void
    onCopyChange?: (text: string) => void // New prop for syncing edits
    onRegenerate?: () => void
    className?: string
    isLoading?: boolean
    isLocked?: boolean
    onToggleLock?: () => void
}

export const GeneratedCopyCard: React.FC<GeneratedCopyCardProps> = ({
    copy,
    hashtags = [],
    onCopy,
    onRegenerate,
    className,
    isLoading = false,
    isLocked = false,
    onToggleLock,
    onCopyChange
}) => {
    const { activeBrandKit: brand } = useBrandKit()
    const [editedCopy, setEditedCopy] = React.useState(copy || '')
    const [isCopied, setIsCopied] = React.useState(false)
    const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    // Update local state when prop changes
    React.useEffect(() => {
        setEditedCopy(copy || '')
    }, [copy])

    React.useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current)
            }
        }
    }, [])

    const handleCopy = () => {
        const fullText = `${editedCopy}\n\n${hashtags.join(' ')}`
        navigator.clipboard.writeText(fullText)
        onCopy?.(fullText)
        setIsCopied(true)
        if (copyTimeoutRef.current) {
            clearTimeout(copyTimeoutRef.current)
        }
        copyTimeoutRef.current = setTimeout(() => {
            setIsCopied(false)
        }, 1600)
    }

    return (
        <Card className={cn("w-full border-muted bg-card/50 backdrop-blur-sm rounded-sm", className)}>
            <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2 space-y-0">
                <Avatar className="h-8 w-8 border">
                    <AvatarImage src={brand?.favicon_url || brand?.logo_url || undefined} alt={brand?.brand_name || 'Brand'} />
                    <AvatarFallback>{brand?.brand_name?.[0] || 'B'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{brand?.brand_name || 'Tu Marca'}</span>
                    <span className="text-[10px] text-muted-foreground">Generado hace un momento</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
                {isLoading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                ) : (
                    <Textarea
                        value={editedCopy}
                        onChange={(e) => {
                            setEditedCopy(e.target.value)
                            onCopyChange?.(e.target.value)
                        }}
                        className="min-h-[80px] border-none bg-transparent p-0 resize-none focus-visible:ring-0 text-sm leading-relaxed"
                        placeholder="Tu copy generado aparecerá aquí..."
                    />
                )}

                <div className="flex flex-wrap gap-1.5">
                    {isLoading ? (
                        <>
                            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-5 w-14 bg-muted rounded animate-pulse" />
                        </>
                    ) : (
                        hashtags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal text-muted-foreground">
                                {tag}
                            </Badge>
                        ))
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-2 border-t bg-muted/20 flex justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerate}
                    disabled={isLoading}
                    className="h-7 text-xs text-muted-foreground hover:text-primary"
                >
                    <RefreshCw className={cn("mr-1.5 h-3 w-3", isLoading && "animate-spin")} />
                    {isLoading ? 'Generando...' : 'Regenerar'}
                </Button>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleLock}
                        className={cn("h-7 text-xs", isLocked ? "text-primary bg-primary/10" : "text-muted-foreground")}
                        title={isLocked ? "Desbloquear copy" : "Congelar copy para mantenerlo al generar nueva imagen"}
                    >
                        {isLocked ? <Lock className="mr-1.5 h-3 w-3" /> : <Unlock className="mr-1.5 h-3 w-3" />}
                        {isLocked ? 'Congelado' : 'Congelar'}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className={cn("h-7 text-xs transition-all", isCopied && "text-primary bg-primary/10")}
                        title={isCopied ? "Copiado" : "Copiar"}
                    >
                        {isCopied ? <Check className="mr-1.5 h-3 w-3" /> : <Copy className="mr-1.5 h-3 w-3" />}
                        {isCopied ? 'Copiado' : 'Copiar'}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
