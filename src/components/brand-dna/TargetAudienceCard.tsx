'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Crosshair, Target } from 'lucide-react';

interface TargetAudienceCardProps {
    audience?: string[];
}

export function TargetAudienceCard({ audience = [] }: TargetAudienceCardProps) {
    if (audience.length === 0) return null;

    return (
        <Card className="glass-panel border-0 overflow-hidden">
            <CardHeader className="pb-2 border-b border-border/50 bg-muted/5">
                <CardTitle className="flex items-center gap-2 text-base text-foreground font-semibold">
                    <Target className="w-5 h-5 text-primary" />
                    Público Objetivo
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {audience.map((profile, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
                            >
                                <Users className="w-4 h-4 text-primary" />
                                {profile}
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-muted-foreground italic flex items-start gap-1.5 px-1">
                        <Crosshair className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        Estos perfiles han sido identificados por IA analizando el lenguaje, oferta y posicionamiento de la marca en su sitio web.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
