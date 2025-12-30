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
        <Card className="bg-card border-border relative overflow-hidden shadow-lg border-l-4 border-l-primary">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base text-foreground">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Visión y Contexto de Marca
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="group relative p-4 bg-muted/20 border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-h-[120px]">
                    {isEditing ? (
                        <div className="space-y-3">
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={cn(
                                    "w-full min-h-[150px] p-2 text-sm rounded-lg resize-y",
                                    "bg-background border border-border text-foreground leading-relaxed",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancelar
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="h-8 text-xs bg-primary hover:bg-primary/90"
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm md:text-base text-foreground/90 leading-relaxed pr-8 whitespace-pre-wrap">
                                {context || 'No hay descripción disponible. Añade el contexto para que la IA entienda mejor tu marca.'}
                            </p>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                                    onClick={() => {
                                        setEditValue(context);
                                        setIsEditing(true);
                                    }}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
