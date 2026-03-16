'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IconTextFont } from '@/components/ui/icons';
import { useTranslation } from 'react-i18next';

interface BrandContextCardProps {
    context: string;
    onUpdate: (value: string) => void;
    minHeightClassName?: string;
}

export function BrandContextCard({ context, onUpdate, minHeightClassName = 'min-h-[120px]' }: BrandContextCardProps) {
    const { t } = useTranslation('brandKit');
    return (
        <Card className="bg-white border border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <IconTextFont className="w-5 h-5 text-primary" />
                    {t('context.title', { defaultValue: 'Brand vision and context' })}
                </CardTitle>
            </CardHeader>
            <div className="px-4 pb-4">
                <textarea
                    value={context}
                    onChange={(e) => onUpdate(e.target.value)}
                    className={cn(
                        'w-full rounded-lg px-3 py-3 text-sm leading-relaxed resize-y',
                        minHeightClassName,
                        'bg-transparent border border-border/70 text-foreground',
                        'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    )}
                    placeholder={t('context.placeholder', { defaultValue: 'Describe your brand vision and context...' })}
                />
            </div>
        </Card>
    );
}
