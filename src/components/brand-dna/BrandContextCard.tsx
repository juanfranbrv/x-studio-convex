'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Pencil, Check, X, Sparkles } from 'lucide-react';

interface BrandContextCardProps {
    context: string;
    onUpdate: (value: string) => void;
}

export function BrandContextCard({ context, onUpdate }: BrandContextCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(context);

    const handleSave = () => {
        onUpdate(editValue);
        setIsEditing(false);
    };

    return (
        <Card className="glass-panel border-0 shadow-none">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <FileText className="w-5 h-5 text-primary" />
                    Visión y Contexto de Marca
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        "group relative p-3 bg-muted/20 border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-h-[120px] cursor-pointer",
                        isEditing && "cursor-default"
                    )}
                    onClick={() => {
                        if (!isEditing) {
                            setEditValue(context);
                            setIsEditing(true);
                        }
                    }}
                >
                    {isEditing ? (
                        <div
                            className="space-y-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={cn(
                                    "w-full min-h-[120px] p-2 text-sm rounded-lg resize-y",
                                    "bg-background border border-border text-foreground leading-relaxed",
                                    "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                )}
                                autoFocus
                                placeholder="Describe la visión y el contexto de tu marca..."
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditValue(context);
                                        setIsEditing(false);
                                    }}
                                >
                                    <X className="w-4 h-4 mr-1 text-red-500" />
                                    Cancelar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleSave}
                                >
                                    <Check className="w-4 h-4 mr-1 text-green-500" />
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-foreground/90 leading-relaxed pr-8 whitespace-pre-wrap">
                                {context || 'No hay descripción disponible. Añade el contexto para que la IA entienda mejor tu marca.'}
                            </p>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    className="p-1 rounded hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                                    onClick={() => {
                                        setEditValue(context);
                                        setIsEditing(true);
                                    }}
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
