'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconUsers, IconCrosshair, IconTarget } from '@/components/ui/icons';
import { useTranslation } from 'react-i18next';

interface TargetAudienceCardProps {
    audience?: string[];
}

export function TargetAudienceCard({ audience = [] }: TargetAudienceCardProps) {
    const { t } = useTranslation('brandKit');

    if (audience.length === 0) return null;

    return (
        <Card className="glass-panel overflow-hidden border-0">
            <CardHeader className="border-b border-border/50 bg-muted/5 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <IconTarget className="h-5 w-5 text-primary" />
                    {t('audience.title', { defaultValue: 'Target audience' })}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {audience.map((profile, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10"
                            >
                                <IconUsers className="h-4 w-4 text-primary" />
                                {profile}
                            </div>
                        ))}
                    </div>

                    <p className="flex items-start gap-1.5 px-1 text-xs italic text-muted-foreground">
                        <IconCrosshair className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {t('audience.helper', { defaultValue: 'These profiles were identified by AI after analyzing the brand language, offer, and positioning on the website.' })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
