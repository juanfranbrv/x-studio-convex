import { useBrandKit } from '@/contexts/BrandKitContext'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Check, Sparkles, Wand2, Type, Eraser } from 'lucide-react'
import { type LayoutOption, type LayoutTextField } from '@/lib/creation-flow-types'
import { NO_TEXT_TOKEN } from '@/hooks/useCreationFlow'
import { useState } from 'react'

interface BrandingConfiguratorProps {
    selectedLayout: LayoutOption | null
    customTexts: Record<string, string>
    selectedLogoId: string | null
    headline: string
    cta: string
    selectedBrandColors: string[]
    additionalInstructions: string
    onSelectLogo: (logoId: string | null) => void
    onHeadlineChange: (headline: string) => void
    onCtaChange: (cta: string) => void
    onAdditionalInstructionsChange: (instructions: string) => void
    onCustomTextChange: (id: string, value: string) => void
    onToggleNoText: (id: string) => void
    onToggleBrandColor: (color: string) => void
    onGenerateAICopy: (field: LayoutTextField) => Promise<void>
    showLogo?: boolean
    showColors?: boolean
    showTexts?: boolean
    showInstructions?: boolean
}

export function BrandingConfigurator({
    selectedLayout,
    customTexts,
    selectedLogoId,
    headline,
    cta,
    selectedBrandColors,
    additionalInstructions,
    onSelectLogo,
    onHeadlineChange,
    onCtaChange,
    onAdditionalInstructionsChange,
    onCustomTextChange,
    onToggleNoText,
    onToggleBrandColor,
    onGenerateAICopy,
    showLogo = true,
    showColors = true,
    showTexts = true,
    showInstructions = true,
}: BrandingConfiguratorProps) {
    const { activeBrandKit } = useBrandKit()
    const [generatingFields, setGeneratingFields] = useState<Record<string, boolean>>({})

    const logos = activeBrandKit?.logos || []
    const colors = activeBrandKit?.colors?.filter(c => c.selected !== false) || []

    // Helper to handle AI generation with local loading state
    const handleGenerate = async (field: LayoutTextField) => {
        setGeneratingFields(prev => ({ ...prev, [field.id]: true }))
        try {
            await onGenerateAICopy(field)
        } finally {
            setGeneratingFields(prev => ({ ...prev, [field.id]: false }))
        }
    }

    // Default fields if no layout specific ones are defined
    const defaultFields: LayoutTextField[] = [
        { id: 'headline', label: 'Titular Principal', placeholder: 'Promo...', defaultValue: '', aiContext: 'Main headline' },
        { id: 'cta', label: 'Botón / CTA', placeholder: 'Comprar ahora', defaultValue: '', aiContext: 'Call to action' },
    ]

    const fieldsToRender = selectedLayout?.textFields || defaultFields

    return (
        <div className="space-y-4">
            {/* Logo Selector */}
            {showLogo && logos.length > 0 && (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        {/* No logo option */}
                        <button
                            onClick={() => onSelectLogo(null)}
                            className={cn(
                                "w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all",
                                "text-[10px] text-muted-foreground leading-none px-1 text-center",
                                selectedLogoId === null
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50 bg-muted/30"
                            )}
                        >
                            Sin Logo
                        </button>

                        {/* Logo options */}
                        {logos.map((logo, idx) => {
                            const logoId = `logo-${idx}`
                            const isSelected = selectedLogoId === logoId
                            const logoUrl = typeof logo === 'string' ? logo : (logo as any).url

                            return (
                                <button
                                    key={logoId}
                                    onClick={() => onSelectLogo(logoId)}
                                    className={cn(
                                        "relative w-12 h-12 rounded-lg border-2 overflow-hidden transition-all",
                                        "bg-white dark:bg-black/20",
                                        isSelected
                                            ? "border-primary ring-2 ring-primary/30"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <img
                                        src={logoUrl}
                                        alt={`Logo ${idx + 1}`}
                                        className="w-full h-full object-contain p-1"
                                    />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Brand Colors */}
            {showColors && colors.length > 0 && (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {colors.map((colorObj, idx) => {
                            const color = colorObj.color
                            const isSelected = selectedBrandColors.includes(color)

                            return (
                                <button
                                    key={idx}
                                    onClick={() => onToggleBrandColor(color)}
                                    className={cn(
                                        "relative w-8 h-8 rounded-lg border-2 transition-all shadow-sm",
                                        isSelected
                                            ? "border-primary ring-2 ring-primary/30 scale-110"
                                            : "border-border hover:scale-105"
                                    )}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                >
                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Dynamic Text Fields */}
            {showTexts && (
                <div className="space-y-4">


                    {fieldsToRender.map((field) => {
                        const isCustom = field.id !== 'headline' && field.id !== 'cta'
                        const value = isCustom ? (customTexts[field.id] || '') : (field.id === 'headline' ? headline : cta)
                        const isNoText = value === NO_TEXT_TOKEN
                        const isGenerating = generatingFields[field.id]

                        return (
                            <div key={field.id} className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
                                        <Type className="w-3 h-3 text-muted-foreground" />
                                        {field.label}
                                    </label>

                                    <div className="flex items-center gap-1">
                                        {/* Magic Pencil Button */}
                                        <button
                                            onClick={() => handleGenerate(field)}
                                            disabled={isGenerating || isNoText}
                                            className={cn(
                                                "p-1.5 rounded-md transition-all hover:bg-primary/10 group relative",
                                                isGenerating ? "animate-pulse" : "",
                                                isNoText ? "opacity-30 cursor-not-allowed" : "text-primary"
                                            )}
                                            title="Sugerencia mágica"
                                        >
                                            <Wand2 className={cn("w-3.5 h-3.5", isGenerating ? "animate-spin" : "")} />
                                        </button>

                                        {/* No Text Toggle */}
                                        <button
                                            onClick={() => onToggleNoText(field.id)}
                                            className={cn(
                                                "p-1.5 rounded-md transition-all group relative",
                                                isNoText
                                                    ? "bg-red-500/10 text-red-500 ring-1 ring-red-500/20"
                                                    : "text-muted-foreground hover:bg-muted/50"
                                            )}
                                            title={isNoText ? "Incluir texto" : "Sin este texto"}
                                        >
                                            <Eraser className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <Input
                                        value={isNoText ? '' : value}
                                        disabled={isNoText}
                                        onChange={(e) => {
                                            if (field.id === 'headline') onHeadlineChange(e.target.value)
                                            else if (field.id === 'cta') onCtaChange(e.target.value)
                                            else onCustomTextChange(field.id, e.target.value)
                                        }}
                                        placeholder={isNoText ? "Elemento eliminado de la plantilla" : field.placeholder}
                                        className={cn(
                                            "h-9 text-sm transition-all pr-12",
                                            isNoText
                                                ? "bg-red-500/5 border-red-500/20 text-red-500 italic placeholder:text-red-300/50"
                                                : "bg-muted/30 border-border/50 focus:border-primary/50"
                                        )}
                                    />
                                    {isNoText && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none">
                                            <span className="text-[10px] font-bold uppercase tracking-tighter text-red-400 opacity-60">
                                                Omitido
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Special Instructions */}
            {showInstructions && (
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        Instrucciones del Director
                    </label>
                    <textarea
                        value={additionalInstructions}
                        onChange={(e) => onAdditionalInstructionsChange(e.target.value)}
                        placeholder="Ej: Solo usar luz cenital, que el producto esté flotando sobre agua..."
                        className="w-full h-24 bg-muted/30 border-border/50 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none placeholder:italic"
                    />
                </div>
            )}
        </div>
    )
}
