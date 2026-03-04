'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

interface BrandContextCardProps {
    context: string;
    onUpdate: (value: string) => void;
}

export function BrandContextCard({ context, onUpdate }: BrandContextCardProps) {
    return (
        <Card className="glass-panel border-0 shadow-none">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <FileText className="w-5 h-5 text-primary" />
                    Visión y Contexto de Marca
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative p-3 bg-muted/20 border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-h-[120px]">
                    <textarea
                        value={context}
                        onChange={(e) => onUpdate(e.target.value)}
                        className={cn(
                            'w-full min-h-[120px] p-2 text-sm rounded-lg resize-y',
                            'bg-background border border-border text-foreground leading-relaxed',
                            'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                        )}
                        placeholder="Describe la visión y el contexto de tu marca..."
                    />
                </div>
            </CardContent>
        </Card>
    );
}
