import { useState, useCallback, useEffect, useRef } from 'react'
import {
    Check,
    Plus,
    Palette,
    Pipette,
    X,
    Type,
    Sparkles,
    Fingerprint,
    Loader2,
} from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { type LayoutOption, type SelectedColor, type TextAsset } from '@/lib/creation-flow-types'

interface BrandingConfiguratorProps {
    selectedLayout: LayoutOption | null
    selectedLogoId: string | null
    selectedBrandColors: SelectedColor[]
    onSelectLogo: (logoId: string | null) => void
    onToggleBrandColor: (color: string) => void
    onRemoveBrandColor?: (color: string) => void
    onAddCustomColor: (color: string) => void
    showLogo?: boolean
    showColors?: boolean
    // Text Assets
    textAssets?: TextAsset[]
    onAddTextAsset?: (asset: TextAsset) => void
    onRemoveTextAsset?: (id: string) => void
    onUpdateTextAsset?: (id: string, value: string) => void
    // AI Generation
    rawMessage?: string
    onGenerateText?: (fieldType: string) => Promise<string>
}

function CustomColorPicker({ onAdd }: { onAdd: (color: string) => void }) {
    const [value, setValue] = useState('#')
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = () => {
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            onAdd(value)
            setValue('#')
            setIsOpen(false)
        }
    }

    const handleEyedropper = async () => {
        if ('EyeDropper' in window) {
            try {
                // @ts-ignore
                const eyeDropper = new window.EyeDropper()
                const result = await eyeDropper.open()
                if (result?.sRGBHex) {
                    setValue(result.sRGBHex.toUpperCase())
                }
            } catch (error) {
                console.log('Eyedropper cancelled or failed', error)
            }
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="w-9 h-9 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center text-muted-foreground hover:text-primary group"
                    title="Añadir color personalizado"
                >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 shadow-xl border-border/50 bg-background/95 backdrop-blur-sm z-[100]" align="start" sideOffset={8}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Color Personalizado</p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="custom-picker-wrapper space-y-4">
                        <div className="relative rounded-lg overflow-hidden border border-border/50">
                            <HexColorPicker
                                color={value.startsWith('#') && value.length === 7 ? value : '#000000'}
                                onChange={(color) => setValue(color.toUpperCase())}
                                className="!w-full !h-32"
                            />
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleEyedropper}
                            className="w-full h-9 gap-2 text-xs font-semibold bg-background hover:bg-accent border-border/50 shadow-sm"
                        >
                            <Pipette className="w-3.5 h-3.5 text-primary" />
                            Capturar
                        </Button>

                        <div className="flex gap-2 pt-1">
                            <div
                                className="w-9 h-9 rounded-lg border border-border/50 shadow-inner shrink-0"
                                style={{ backgroundColor: value.startsWith('#') && value.length === 7 ? value : 'transparent' }}
                            />
                            <Input
                                value={value}
                                onChange={(e) => setValue(e.target.value.toUpperCase())}
                                placeholder="#000000"
                                className="h-9 text-xs font-mono bg-muted/30 border-border/40 focus:border-primary/50"
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                            <Button
                                className="h-9 w-12 p-0 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                                onClick={handleSubmit}
                                disabled={!/^#[0-9A-F]{6}$/i.test(value)}
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

// Separate component for text asset row to properly use hooks
interface TextAssetRowProps {
    asset: { id: string; type: string; label: string; value: string }
    textResources: { label: string; value: string }[]
    rawMessage: string
    onUpdate: (id: string, value: string) => void
    onRemove: (id: string) => void
    onGenerateText?: (fieldType: string) => Promise<string>
}

function TextAssetRow({ asset, textResources, rawMessage, onUpdate, onRemove, onGenerateText }: TextAssetRowProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        if (!onGenerateText || isGenerating) return
        setIsGenerating(true)
        try {
            const generated = await onGenerateText(asset.type)
            if (generated) {
                onUpdate(asset.id, generated)
            }
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex items-center gap-1.5 group">
            <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-5 shrink-0 min-w-[50px] justify-center">
                {asset.label}
            </Badge>

            {/* Input with Fingerprint dropdown inside */}
            <div className="relative flex-1">
                <Input
                    value={asset.value}
                    onChange={(e) => onUpdate(asset.id, e.target.value)}
                    className="h-7 text-xs pr-7"
                    placeholder={`Valor para ${asset.label}...`}
                />
                {/* Fingerprint - Brand Kit Presets */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:text-primary transition-colors text-muted-foreground/50 hover:text-muted-foreground"
                            title="Usar texto del Brand Kit"
                        >
                            <Fingerprint className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 max-h-60 overflow-y-auto">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Textos del Brand Kit
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {textResources.length === 0 ? (
                            <DropdownMenuItem disabled className="text-xs text-muted-foreground italic">
                                Sin textos disponibles
                            </DropdownMenuItem>
                        ) : (
                            textResources.map((resource, idx) => (
                                <DropdownMenuItem
                                    key={idx}
                                    onClick={() => onUpdate(asset.id, resource.value)}
                                    className="text-xs"
                                >
                                    <span className="text-muted-foreground mr-2">[{resource.label}]</span>
                                    <span className="truncate">{resource.value}</span>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Sparkles - AI Generation */}
            <button
                onClick={handleGenerate}
                disabled={isGenerating || !rawMessage}
                className={cn(
                    "p-1 rounded transition-all",
                    rawMessage
                        ? "hover:text-primary hover:bg-primary/10 text-muted-foreground"
                        : "text-muted-foreground/30 cursor-not-allowed"
                )}
                title={rawMessage ? "Generar con IA" : "Introduce primero tu intención"}
            >
                {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4" />
                )}
            </button>

            {/* Delete button */}
            <button
                onClick={() => onRemove(asset.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
                title="Eliminar"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}

export function BrandingConfigurator({
    selectedLayout,
    selectedLogoId,
    selectedBrandColors,
    onSelectLogo,
    onToggleBrandColor,
    onRemoveBrandColor,
    onAddCustomColor,
    showLogo = true,
    showColors = true,
    textAssets = [],
    onAddTextAsset,
    onRemoveTextAsset,
    onUpdateTextAsset,
    rawMessage = '',
    onGenerateText,
}: BrandingConfiguratorProps) {
    const { activeBrandKit } = useBrandKit()

    const logos = activeBrandKit?.logos || []
    const brandKitColors = activeBrandKit?.colors?.filter(c => c.selected !== false) || []

    // Combine Brand Kit colors with any custom selected colors that are NOT in the brand kit
    const colors = [
        ...brandKitColors,
        ...selectedBrandColors
            .filter((sc: SelectedColor) => !brandKitColors.some(bc => bc.color.toLowerCase() === sc.color.toLowerCase()))
            .map((sc: SelectedColor) => ({ color: sc.color }))
    ]

    // Ensure first logo is selected by default if none is selected and logos exist
    // Ensure first logo is selected by default if none is selected and logos exist
    const hasAutoSelected = useRef(false)
    useEffect(() => {
        if (!hasAutoSelected.current && logos.length > 0 && !selectedLogoId) {
            onSelectLogo('logo-0')
            hasAutoSelected.current = true
        }
    }, [logos, selectedLogoId, onSelectLogo])

    return (
        <div className="space-y-4">
            {/* Logo Selector */}
            {showLogo && logos.length > 0 && (
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        Logos
                    </label>
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

            {/* Text Assets Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Type className="w-3 h-3 text-primary" />
                        Textos para Prompt
                    </label>
                    <button
                        onClick={() => {
                            const newId = `custom-${Date.now()}`
                            onAddTextAsset?.({ id: newId, type: 'custom', label: 'Texto', value: '' })
                        }}
                        className="p-0.5 hover:text-primary transition-colors"
                        title="Añadir texto"
                    >
                        <Plus className="w-3 h-3 text-muted-foreground" />
                    </button>
                </div>
                <div className="space-y-2">
                    {textAssets.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground/60 italic text-center py-2">
                            No hay textos configurados
                        </p>
                    ) : (
                        textAssets.map((asset) => {
                            // Compute textResources inside the parent scope, not in map
                            const textResources = [
                                ...(activeBrandKit?.text_assets?.ctas || []).map((t: string) => ({ label: 'CTA', value: t })),
                                ...(activeBrandKit?.text_assets?.marketing_hooks || []).map((t: string) => ({ label: 'Hook', value: t })),
                                activeBrandKit?.tagline ? { label: 'Tagline', value: activeBrandKit.tagline } : null,
                                activeBrandKit?.url ? { label: 'URL', value: activeBrandKit.url } : null,
                            ].filter(Boolean) as { label: string; value: string }[]

                            return (
                                <TextAssetRow
                                    key={asset.id}
                                    asset={asset}
                                    textResources={textResources}
                                    rawMessage={rawMessage}
                                    onUpdate={onUpdateTextAsset || (() => { })}
                                    onRemove={onRemoveTextAsset || (() => { })}
                                    onGenerateText={onGenerateText}
                                />
                            )
                        })
                    )}
                </div>
            </div>

            {/* Brand Colors */}
            {showColors && (
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Palette className="w-3 h-3 text-primary" />
                        Paleta Cromática
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {colors.map((colorObj, idx) => {
                            const color = colorObj.color
                            const selection = selectedBrandColors.find(s => s.color === color)
                            const isSelected = !!selection
                            const role = selection?.role || (colorObj as any).role || 'Neutral'

                            // Helper for contrast
                            const getContrastColor = (hex: string) => {
                                const r = parseInt(hex.slice(1, 3), 16)
                                const g = parseInt(hex.slice(3, 5), 16)
                                const b = parseInt(hex.slice(5, 7), 16)
                                const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
                                return yiq >= 128 ? 'text-black' : 'text-white'
                            }

                            return (
                                <div
                                    key={idx}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onToggleBrandColor(color)}
                                    className={cn(
                                        "relative aspect-video rounded-lg border-2 transition-all shadow-sm flex items-center justify-center group/swatch cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                                        isSelected
                                            ? "border-primary ring-2 ring-primary/30 scale-105"
                                            : "border-border hover:border-primary/50"
                                    )}
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: isSelected ? `0 0 12px ${color}40` : 'inset 0 1px 1px rgba(255,255,255,0.1)'
                                    }}
                                    title={`${color}${role ? ` - Rol: ${role}` : ''}`}
                                >
                                    {/* Light color visibility assurance */}
                                    <div className="absolute inset-0 rounded-md border border-black/5 pointer-events-none" />

                                    {/* Role Label */}
                                    <span
                                        className={cn(
                                            "text-[10px] font-bold uppercase tracking-wide select-none transition-colors duration-200 z-10",
                                            getContrastColor(color)
                                        )}
                                    >
                                        {role}
                                    </span>

                                    {isSelected && (
                                        <div className="absolute top-1 left-1">
                                            <div className={cn("rounded-full p-0.5 bg-white/20 backdrop-blur-sm", getContrastColor(color))}>
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Remove Button */}
                                    {isSelected && onRemoveBrandColor && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onRemoveBrandColor(color)
                                            }}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-all hover:scale-110 z-20"
                                            title="Eliminar color"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            )
                        })}

                        {/* Custom Color Adder */}
                        <CustomColorPicker onAdd={onAddCustomColor} />
                    </div>
                </div>
            )}


        </div>
    )
}
