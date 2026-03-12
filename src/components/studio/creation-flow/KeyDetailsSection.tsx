'use client'

import React, { useState } from 'react'
import { Sparkles, Wand2, Eraser } from 'lucide-react'
import { IntentRequiredField } from '@/lib/creation-flow-types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation('common')
    const [showOptionalFields, setShowOptionalFields] = useState(false)

    if (intentRequiredFields.length === 0 && Object.keys(customTexts).length === 0) {
        return null
    }

    const fieldsToRender = intentRequiredFields.filter(f => !f.mapsTo)
    const adHocFields = Object.entries(customTexts).filter(([id]) => !intentRequiredFields.find(f => f.id === id))

    if (fieldsToRender.length === 0 && adHocFields.length === 0) {
        return null
    }

    return (
        <div className="animate-in slide-in-from-top-2 space-y-3 rounded-lg border border-primary/10 bg-primary/5 p-3 fade-in duration-300">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <Sparkles className="h-3 w-3" />
                    {t('keyDetails.title', { defaultValue: 'Key details' })}
                </label>

                {fieldsToRender.some(f => f.optional) && (
                    <button
                        onClick={() => setShowOptionalFields(!showOptionalFields)}
                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary/60 transition-colors hover:text-primary"
                    >
                        {showOptionalFields
                            ? t('keyDetails.lessDetails', { defaultValue: '- Fewer details' })
                            : t('keyDetails.moreDetails', { defaultValue: '+ More details' })}
                    </button>
                )}
            </div>

            <div className="mt-2 space-y-4">
                {fieldsToRender.map((field) => {
                    const value = customTexts[field.id] || ''
                    const isOptionalEmpty = field.optional && !value
                    if (isOptionalEmpty && !showOptionalFields) return null

                    return (
                        <div key={field.id} className="animate-in slide-in-from-top-1 space-y-1.5 fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                                    {field.label}
                                    {field.required && <span className="text-red-500">*</span>}
                                    {field.optional && <span className="ml-auto text-[9px] font-normal text-muted-foreground/60">{t('keyDetails.optional', { defaultValue: '(optional)' })}</span>}
                                </label>

                                {onGenerateCustomFieldCopy && (
                                    <button
                                        onClick={() => onGenerateCustomFieldCopy(field.id)}
                                        className="rounded-md p-1 text-primary transition-colors hover:bg-primary/10"
                                        title={t('keyDetails.regenerateField', { field: field.label, defaultValue: 'Regenerate {{field}}' })}
                                    >
                                        <Wand2 className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={value}
                                    onChange={(e) => onCustomTextChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="h-20 w-full resize-none rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            ) : (
                                <Input
                                    value={value}
                                    onChange={(e) => onCustomTextChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="h-9 border-border/50 bg-background"
                                />
                            )}
                        </div>
                    )
                })}

                {adHocFields.map(([id, value]) => (
                    <div key={id} className="animate-in slide-in-from-top-1 space-y-1.5 fade-in duration-200">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-primary/80">
                                <Sparkles className="h-3 w-3" />
                                {id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </label>
                            <button
                                onClick={() => onCustomTextChange(id, '')}
                                className="text-muted-foreground hover:text-red-500"
                            >
                                <Eraser className="h-3 w-3" />
                            </button>
                        </div>
                        {(String(value).length > 50 || String(value).includes('\n')) ? (
                            <Textarea
                                value={value as string}
                                onChange={(e) => onCustomTextChange(id, e.target.value)}
                                className="min-h-[80px] border-primary/10 bg-primary/5 py-2 text-sm italic scrollbar-hide"
                            />
                        ) : (
                            <Input
                                value={value as string}
                                onChange={(e) => onCustomTextChange(id, e.target.value)}
                                className="h-9 border-primary/10 bg-primary/5 italic"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
