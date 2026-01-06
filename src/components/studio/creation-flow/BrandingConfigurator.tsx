import { useState, useCallback } from 'react'
import {
    Fingerprint,
    Globe,
    AtSign,
    Mail,
    Phone,
    MapPin,
    Check,
    Sparkles,
    Wand2,
    Type,
    Eraser,
    Quote,
    Megaphone,
    MousePointerClick,
    MessageSquareText
} from 'lucide-react'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type LayoutOption, type LayoutTextField, type IntentRequiredField } from '@/lib/creation-flow-types'
import { NO_TEXT_TOKEN } from '@/hooks/useCreationFlow'

interface BrandingConfiguratorProps {
    selectedLayout: LayoutOption | null
    customTexts: Record<string, string>
    selectedLogoId: string | null
    headline: string
    cta: string
    selectedBrandColors: string[]
    additionalInstructions: string
    rawMessage: string
    onSelectLogo: (logoId: string | null) => void
    onHeadlineChange: (headline: string) => void
    onCtaChange: (cta: string) => void
    onAdditionalInstructionsChange: (instructions: string) => void
    onRawMessageChange: (message: string) => void
    onCustomTextChange: (id: string, value: string) => void
    onToggleNoText: (id: string) => void
    onToggleBrandColor: (color: string) => void
    onGenerateAICopy: (field: LayoutTextField) => Promise<void>
    showLogo?: boolean
    showColors?: boolean
    showTexts?: boolean
    showInstructions?: boolean
    intentRequiredFields?: IntentRequiredField[]
    highlightedFields?: Set<string>
}

export function BrandingConfigurator({
    selectedLayout,
    customTexts,
    selectedLogoId,
    headline,
    cta,
    selectedBrandColors,
    additionalInstructions,
    rawMessage,
    onSelectLogo,
    onHeadlineChange,
    onCtaChange,
    onAdditionalInstructionsChange,
    onRawMessageChange,
    onCustomTextChange,
    onToggleNoText,
    onToggleBrandColor,
    onGenerateAICopy,
    showLogo = true,
    showColors = true,
    showTexts = true,
    showInstructions = true,
    intentRequiredFields = [],
    highlightedFields = new Set(),
}: BrandingConfiguratorProps) {
    const { activeBrandKit } = useBrandKit()
    const [generatingFields, setGeneratingFields] = useState<Record<string, boolean>>({})

    const logos = activeBrandKit?.logos || []
    const colors = activeBrandKit?.colors?.filter(c => c.selected !== false) || []

    // Ensure first logo is selected by default if none is selected and logos exist
    useState(() => {
        if (selectedLogoId === undefined && logos.length > 0) {
            onSelectLogo('logo-0')
        }
    })

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

    // Extract all DNA resources for quick-fill
    const generalItems = [
        activeBrandKit?.url ? { label: 'Sitio Web', value: activeBrandKit.url, icon: Globe } : null,
        activeBrandKit?.tagline ? { label: 'Tagline', value: activeBrandKit.tagline, icon: Quote } : null,
    ].filter((item): item is NonNullable<typeof item> => item !== null)

    const contactItems = [
        ...(activeBrandKit?.emails || []).map(e => ({ label: 'Email', value: e, icon: Mail })),
        ...(activeBrandKit?.phones || []).map(p => ({ label: 'Teléfono', value: p, icon: Phone })),
        ...(activeBrandKit?.addresses || []).map(a => ({ label: 'Dirección', value: a, icon: MapPin })),
    ]

    const socialItems = [
        ...(activeBrandKit?.social_links || []).map(s => ({
            label: s.platform,
            value: s.url,
            icon: AtSign
        }))
    ]

    // Text assets from brand kit (for direct insertion)
    const titularItems = [
        ...(activeBrandKit?.text_assets?.marketing_hooks || []).map(h => ({ label: 'Titular', value: h, icon: Megaphone })),
    ]

    const ctaItems = [
        ...(activeBrandKit?.text_assets?.ctas || []).map(c => ({ label: 'CTA', value: c, icon: MousePointerClick })),
    ]

    const dnaResources = [
        titularItems.length > 0 ? { category: 'Titulares', items: titularItems } : null,
        ctaItems.length > 0 ? { category: 'CTAs', items: ctaItems } : null,
        generalItems.length > 0 ? { category: 'General', items: generalItems } : null,
        contactItems.length > 0 ? { category: 'Contacto', items: contactItems } : null,
        socialItems.length > 0 ? { category: 'Social', items: socialItems } : null,
    ].filter((cat): cat is NonNullable<typeof cat> => cat !== null)

    const handleValueUpdate = (fieldId: string, newValue: string) => {
        if (fieldId === 'headline') onHeadlineChange(newValue)
        else if (fieldId === 'cta') onCtaChange(newValue)
        else onCustomTextChange(fieldId, newValue)
    }

    const handleDrop = useCallback((e: React.DragEvent, fieldId: string) => {
        e.preventDefault()
        const jsonData = e.dataTransfer.getData('application/x-studio-context')
        if (jsonData) {
            try {
                const element = JSON.parse(jsonData)
                if (element.value) {
                    handleValueUpdate(fieldId, element.value)
                }
            } catch (err) {
                console.error("Error parsing drop data", err)
            }
        } else {
            const text = e.dataTransfer.getData('text/plain')
            if (text) {
                handleValueUpdate(fieldId, text)
            }
        }
    }, [onHeadlineChange, onCtaChange, onCustomTextChange])

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    return (
        <div className="space-y-4">
            {/* Logo Selector */}
            {showLogo && logos.length > 0 && (
                <div className="space-y-2">
                    <div className="flex gap-2">
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

            {/* Raw Message Input */}
            {showTexts && (
                <div className="space-y-4">
                    {/* Intent Required Fields (NEW) */}
                    {intentRequiredFields.length > 0 && (
                        <div className="space-y-3 bg-primary/5 p-3 rounded-lg border border-primary/10">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                Detalles Clave
                            </label>

                            {intentRequiredFields.map((field) => (
                                <div key={field.id} className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
                                        {field.label}
                                        {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={customTexts[field.id] || ''}
                                            onChange={(e) => onCustomTextChange(field.id, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full h-20 bg-background border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                                        />
                                    ) : (
                                        <Input
                                            value={customTexts[field.id] || ''}
                                            onChange={(e) => onCustomTextChange(field.id, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="bg-background border-border/50 h-9"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <MessageSquareText className="w-3 h-3 text-primary" />
                            Tu Mensaje (opcional)
                        </label>
                        <textarea
                            value={rawMessage}
                            onChange={(e) => onRawMessageChange(e.target.value)}
                            placeholder="Escribe aquí tu idea, oferta o mensaje. La IA usará esto + tu ADN de marca para generar titulares y CTAs..."
                            className="w-full h-20 bg-muted/30 border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none placeholder:italic placeholder:text-muted-foreground/50"
                        />
                        {rawMessage && (
                            <p className="text-[10px] text-muted-foreground/60 italic">
                                ✨ La IA usará este texto como base para generar contenido
                            </p>
                        )}
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

                        // Check if this field was just highlighted
                        const isHighlighted = highlightedFields.has(field.id)

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

                                <div
                                    className="relative group"
                                    onDrop={(e) => handleDrop(e, field.id)}
                                    onDragOver={handleDragOver}
                                >
                                    <Input
                                        value={isNoText ? '' : value}
                                        disabled={isNoText}
                                        onChange={(e) => handleValueUpdate(field.id, e.target.value)}
                                        placeholder={isNoText ? "Elemento eliminado de la plantilla" : field.placeholder}
                                        className={cn(
                                            "h-9 text-sm transition-all pr-20", // Increased padding for 2 buttons
                                            isHighlighted ? "animate-flash-highlight" : "", // Apply flash highlight
                                            isNoText
                                                ? "bg-red-500/5 border-red-500/20 text-red-500 italic placeholder:text-red-300/50"
                                                : "bg-muted/30 border-border/50 focus:border-primary/50 group-hover:border-primary/30"
                                        )}
                                    />

                                    {/* Action Buttons Container */}
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pr-1">
                                        {/* DNA Quick Fill */}
                                        {!isNoText && dnaResources.length > 0 && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-1.5 rounded-md text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors">
                                                        <Fingerprint className="w-3.5 h-3.5" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-0 border-border/50">
                                                    <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                                                        <Fingerprint className="w-3 h-3 text-primary" />
                                                        ADN de Marca
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <ScrollArea className="h-[280px]">
                                                        {dnaResources.map((cat, idx) => (
                                                            <DropdownMenuGroup key={idx}>
                                                                <div className="px-3 py-1.5 text-[9px] font-bold text-primary/70 uppercase bg-primary/5">
                                                                    {cat.category}
                                                                </div>
                                                                {cat.items.map((item, iIdx) => (
                                                                    <DropdownMenuItem
                                                                        key={iIdx}
                                                                        onClick={() => handleValueUpdate(field.id, item.value)}
                                                                        className="flex items-center gap-2 px-3 py-2 text-xs truncate cursor-pointer hover:bg-primary/5 focus:bg-primary/5"
                                                                    >
                                                                        <item.icon className="w-3 h-3 text-muted-foreground shrink-0" />
                                                                        <span className="truncate">{item.value}</span>
                                                                    </DropdownMenuItem>
                                                                ))}
                                                                {idx < dnaResources.length - 1 && <DropdownMenuSeparator />}
                                                            </DropdownMenuGroup>
                                                        ))}
                                                    </ScrollArea>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}

                                        {isNoText && (
                                            <div className="overflow-hidden pointer-events-none pr-2">
                                                <span className="text-[10px] font-bold uppercase tracking-tighter text-red-400 opacity-60">
                                                    Omitido
                                                </span>
                                            </div>
                                        )}
                                    </div>
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
