import { useState, useCallback } from 'react'
import {
    Check,
    Plus,
    Palette,
    Pipette,
    X,
} from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { type LayoutOption, type SelectedColor } from '@/lib/creation-flow-types'

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
    useState(() => {
        if (selectedLogoId === undefined && logos.length > 0) {
            onSelectLogo('logo-0')
        }
    })

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
            {showColors && (
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Palette className="w-3 h-3 text-primary" />
                        Paleta Cromática
                    </label>
                    <div className="flex flex-wrap gap-2 items-center">
                        {colors.map((colorObj, idx) => {
                            const color = colorObj.color
                            const selection = selectedBrandColors.find(s => s.color === color)
                            const isSelected = !!selection
                            const role = selection?.role

                            // Mini label for role
                            const roleInitial = role ? role.charAt(0).toUpperCase() : ''

                            return (
                                <div
                                    key={idx}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onToggleBrandColor(color)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            onToggleBrandColor(color)
                                        }
                                    }}
                                    onContextMenu={(e) => {
                                        if (onRemoveBrandColor) {
                                            e.preventDefault()
                                            onRemoveBrandColor(color)
                                        }
                                    }}
                                    className={cn(
                                        "relative w-9 h-9 rounded-lg border-2 transition-all shadow-sm flex items-center justify-center group/swatch cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                                        isSelected
                                            ? "border-primary ring-2 ring-primary/30 scale-105"
                                            : "border-border hover:border-primary/50"
                                    )}
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: isSelected ? `0 0 12px ${color}40` : 'inset 0 1px 1px rgba(255,255,255,0.1)'
                                    }}
                                    title={`${color}${role ? ` - Rol: ${role}` : ''}${onRemoveBrandColor ? ' (Click derecho para eliminar)' : ''}`}
                                >
                                    {/* Light color visibility assurance */}
                                    <div className="absolute inset-0 rounded-md border border-black/5 pointer-events-none" />

                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-md">
                                            <span className="text-[14px] font-black text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] select-none">
                                                {roleInitial}
                                            </span>
                                        </div>
                                    )}

                                    {/* Quick Remove Button */}
                                    {isSelected && onRemoveBrandColor && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onRemoveBrandColor(color)
                                            }}
                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-all hover:scale-125 z-10"
                                            title="Eliminar color"
                                        >
                                            <X className="w-2.5 h-2.5 stroke-[3]" />
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
