'use client'

import React, { useState } from 'react'
import { Sparkles, Wand2, Eraser } from 'lucide-react'
import { IntentRequiredField } from '@/lib/creation-flow-types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface KeyDetailsSectionProps {
    intentRequiredFields: IntentRequiredField[]
    customTexts: Record<string, any>
    onCustomTextChange: (id: string, value: string) => void
    onGenerateCustomFieldCopy?: (fieldId: string) => void
}

export function KeyDetailsSection({
    intentRequiredFields,
    customTexts,
    onCustomTextChange,
    onGenerateCustomFieldCopy
}: KeyDetailsSectionProps) {
    const [showOptionalFields, setShowOptionalFields] = useState(false)

    if (intentRequiredFields.length === 0 && Object.keys(customTexts).length === 0) {
        return null
    }

    // Filter fields to render (exclude those mapped to global layout fields like headline/cta)
    const fieldsToRender = intentRequiredFields.filter(f => !f.mapsTo)
    const adHocFields = Object.entries(customTexts).filter(([id]) => !intentRequiredFields.find(f => f.id === id))

    if (fieldsToRender.length === 0 && adHocFields.length === 0) {
        return null
    }

    return (
        <div className="space-y-3 bg-primary/5 p-3 rounded-lg border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Detalles Clave
                </label>

                {fieldsToRender.some(f => f.optional) && (
                    <button
                        onClick={() => setShowOptionalFields(!showOptionalFields)}
                        className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                        {showOptionalFields ? '- Menos detalles' : '+ Más detalles'}
                    </button>
                )}
            </div>

            <div className="space-y-4 mt-2">
                {fieldsToRender.map((field) => {
                    const value = customTexts[field.id] || ''
                    const isOptionalEmpty = field.optional && !value
                    if (isOptionalEmpty && !showOptionalFields) return null

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
                                    className="w-full h-20 bg-background border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                                />
                            ) : (
                                <Input
                                    value={value}
                                    onChange={(e) => onCustomTextChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="bg-background border-border/50 h-9"
                                />
                            )}
                        </div>
                    )
                })}

                {/* Ad-hoc fields (from AI grep) */}
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
    )
}
