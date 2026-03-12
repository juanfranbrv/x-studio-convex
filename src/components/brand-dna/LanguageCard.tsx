'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LanguageCardProps {
    selectedLanguage?: string;
    onLanguageChange: (language: string) => void;
}

const LANGUAGES = [
    { code: 'es', flag: '🇪🇸' },
    { code: 'en', flag: '🇬🇧' },
    { code: 'fr', flag: '🇫🇷' },
    { code: 'de', flag: '🇩🇪' },
    { code: 'pt', flag: '🇵🇹' },
    { code: 'it', flag: '🇮🇹' },
    { code: 'ca', flag: '🏴' },
];

export function LanguageCard({ selectedLanguage = 'es', onLanguageChange }: LanguageCardProps) {
    const { t } = useTranslation('brandKit');

    return (
        <Card className="glass-panel border-0 shadow-aero">
            <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Globe className="w-5 h-5 text-primary" />
                    {t('language.title', { defaultValue: 'Preferred language' })}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onLanguageChange(lang.code)}
                            className={cn(
                                'flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                                selectedLanguage === lang.code
                                    ? 'border-transparent bg-primary text-primary-foreground shadow-aero-glow'
                                    : 'border-border bg-background/50 hover:border-primary/50 hover:bg-primary/5'
                            )}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span className={cn(
                                'text-sm font-medium',
                                selectedLanguage === lang.code ? 'text-white' : 'text-foreground'
                            )}>
                                {t(`language.options.${lang.code}`, {
                                    defaultValue: lang.code.toUpperCase(),
                                })}
                            </span>
                        </button>
                    ))}
                </div>
                <p className="mt-3 text-xs italic text-muted-foreground">
                    {t('language.helper', { defaultValue: 'This language will be used to generate content and brand suggestions.' })}
                </p>
            </CardContent>
        </Card>
    );
}
