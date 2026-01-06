'use client'

import React, { useState } from 'react'
import {
    Sparkles, Wand2, Eraser, Type, Fingerprint,
    Heart, MessageSquareText, Globe, AtSign, Mail, Phone, MapPin
} from 'lucide-react'
import { IntentRequiredField, LayoutTextField } from '@/lib/creation-flow-types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { NO_TEXT_TOKEN } from '@/hooks/useCreationFlow'
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

interface UnifiedContentSectionProps {
    intentRequiredFields: IntentRequiredField[]
    fieldsToRender: LayoutTextField[]
    customTexts: Record<string, any>
    headline: string
    cta: string
    onHeadlineChange: (value: string) => void
    onCtaChange: (value: string) => void
    onCustomTextChange: (id: string, value: string) => void
    onToggleNoText: (id: string) => void
    onGenerateAICopy: (field: LayoutTextField) => Promise<void>
    onGenerateCustomFieldCopy?: (fieldId: string) => void
    highlightedFields?: Set<string>
}

export function UnifiedContentSection({
    intentRequiredFields,
    fieldsToRender,
    customTexts,
    headline,
    cta,
    onHeadlineChange,
    onCtaChange,
    onCustomTextChange,
    onToggleNoText,
    onGenerateAICopy,
    onGenerateCustomFieldCopy,
    highlightedFields = new Set()
}: UnifiedContentSectionProps) {
    const [showOptionalFields, setShowOptionalFields] = useState(false)
    const [generatingFields, setGeneratingFields] = useState<Record<string, boolean>>({})
    const { activeBrandKit } = useBrandKit()

    // Derived DNA Resources for quick fill
    const dnaResources = [
        {
            category: 'Valores y Tono',
            items: [
                ...(activeBrandKit?.brand_values?.map(v => ({ icon: Heart, value: v })) || []),
                ...(activeBrandKit?.tone_of_voice?.map(t => ({ icon: MessageSquareText, value: t })) || [])
            ]
        },
        {
            category: 'Contacto y RRSS',
            items: [
                ...(activeBrandKit?.url ? [{ icon: Globe, value: activeBrandKit.url }] : []),
                ...(activeBrandKit?.social_links?.map(s => ({ icon: AtSign, value: s.username || s.url })) || []),
                ...(activeBrandKit?.emails?.map(e => ({ icon: Mail, value: e })) || []),
                ...(activeBrandKit?.phones?.map(p => ({ icon: Phone, value: p })) || []),
                ...(activeBrandKit?.addresses?.map(a => ({ icon: MapPin, value: a })) || []),
            ]
        }
    ].filter(cat => cat.items.length > 0)

    const handleGenerate = async (field: LayoutTextField) => {
        setGeneratingFields(prev => ({ ...prev, [field.id]: true }))
        try {
            await onGenerateAICopy(field)
        } finally {
            setGeneratingFields(prev => ({ ...prev, [field.id]: false }))
        }
    }

    const handleValueUpdate = (id: string, value: string) => {
        if (id === 'headline') onHeadlineChange(value)
        else if (id === 'cta') onCtaChange(value)
        else onCustomTextChange(id, value)
    }

    // Filter fields to render (exclude those mapped to global layout fields like headline/cta)
    const intentFields = intentRequiredFields.filter(f => !f.mapsTo)
    const adHocFields = Object.entries(customTexts).filter(([id]) => !intentRequiredFields.find(f => f.id === id))

    return (
        <div className="space-y-6 bg-primary/5 p-4 rounded-xl border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-300">

            {/* 1. Global Text Fields (Headline / CTA) */}
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" />
                    Textos de la publicación
                </label>

                {fieldsToRender.map((field) => {
                    const isCustom = field.id !== 'headline' && field.id !== 'cta'
                    const value = isCustom ? (customTexts[field.id] || '') : (field.id === 'headline' ? headline : cta)
                    const isNoText = value === NO_TEXT_TOKEN
                    const isGenerating = generatingFields[field.id]
                    const isHighlighted = highlightedFields.has(field.id)

                    const mappedField = intentRequiredFields.find(f => f.mapsTo === field.id)
                    const label = mappedField ? mappedField.label : field.label

                    return (
                        <div key={field.id} className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
                                    <Type className="w-3 h-3 text-muted-foreground" />
                                    {label}
                                </label>

                                <div className="flex items-center gap-1">
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
                                    onChange={(e) => handleValueUpdate(field.id, e.target.value)}
                                    placeholder={isNoText ? "Elemento eliminado de la pieza" : field.placeholder}
                                    className={cn(
                                        "h-9 text-sm transition-all pr-20 bg-background border-border/40",
                                        isHighlighted ? "animate-flash-highlight" : "",
                                        isNoText && "bg-red-500/5 border-red-500/20 text-red-500 italic placeholder:text-red-300/50"
                                    )}
                                />

                                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pr-1">
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
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 2. Key Details (Intent specific) */}
            {(intentFields.length > 0 || adHocFields.length > 0) && (
                <div className="space-y-3 pt-4 border-t border-primary/10">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Detalles del Contenido
                        </label>

                        {intentFields.some(f => f.optional) && (
                            <button
                                onClick={() => setShowOptionalFields(!showOptionalFields)}
                                className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1"
                            >
                                {showOptionalFields ? '- Menos detalles' : '+ Más detalles'}
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {intentFields.map((field) => {
                            const value = customTexts[field.id] || ''
                            const isOptionalEmpty = field.optional && !value
                            if (isOptionalEmpty && !showOptionalFields) return null

                            const isHighlighted = highlightedFields.has(field.id)

                            return (
                                <div key={field.id} className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
                                            {field.label}
                                            {field.required && <span className="text-red-500">*</span>}
                                            {field.optional && <span className="text-[9px] text-muted-foreground/60 font-normal ml-auto">(opcional)</span>}
                                        </label>

                                        {onGenerateCustomFieldCopy && (
                                            <button
                                                onClick={() => onGenerateCustomFieldCopy(field.id)}
                                                className="p-1 rounded-md text-primary hover:bg-primary/10 transition-colors"
                                                title={`Regenerar ${field.label}`}
                                            >
                                                <Wand2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={value}
                                            onChange={(e) => onCustomTextChange(field.id, e.target.value)}
                                            placeholder={field.placeholder}
                                            className={cn(
                                                "w-full h-20 bg-background border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none",
                                                isHighlighted && "animate-flash-highlight"
                                            )}
                                        />
                                    ) : (
                                        <Input
                                            value={value}
                                            onChange={(e) => onCustomTextChange(field.id, e.target.value)}
                                            placeholder={field.placeholder}
                                            className={cn(
                                                "bg-background border-border/50 h-9",
                                                isHighlighted && "animate-flash-highlight"
                                            )}
                                        />
                                    )}
                                </div>
                            )
                        })}

                        {/* Ad-hoc fields */}
                        {adHocFields.map(([id, value]) => (
                            <div key={id} className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-semibold text-primary/80 flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3" />
                                        {id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </label>
                                    <button
                                        onClick={() => onCustomTextChange(id, '')}
                                        className="p-1 text-muted-foreground hover:text-red-500"
                                    >
                                        <Eraser className="w-3 h-3" />
                                    </button>
                                </div>
                                {(String(value).length > 50 || String(value).includes('\n')) ? (
                                    <Textarea
                                        value={value as string}
                                        onChange={(e) => onCustomTextChange(id, e.target.value)}
                                        className="bg-primary/5 border-primary/10 min-h-[80px] text-sm py-2 italic scrollbar-hide"
                                    />
                                ) : (
                                    <Input
                                        value={value as string}
                                        onChange={(e) => onCustomTextChange(id, e.target.value)}
                                        className="bg-primary/5 border-primary/10 h-9 italic"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
