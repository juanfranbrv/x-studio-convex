'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageCardProps {
    selectedLanguage?: string;
    onLanguageChange: (language: string) => void;
}

const LANGUAGES = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ca', name: 'Català', flag: '🏴' },
];

export function LanguageCard({ selectedLanguage = 'es', onLanguageChange }: LanguageCardProps) {
    return (
        <Card className="glass-panel border-0 shadow-aero">
            <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Globe className="w-5 h-5 text-primary" />
                    Idioma preferido
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onLanguageChange(lang.code)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200",
                                "border hover:scale-[1.02] active:scale-[0.98]",
                                selectedLanguage === lang.code
                                    ? "bg-primary text-primary-foreground border-transparent shadow-aero-glow"
                                    : "bg-background/50 border-border hover:border-primary/50 hover:bg-primary/5"
                            )}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span className={cn(
                                "text-sm font-medium",
                                selectedLanguage === lang.code ? "text-white" : "text-foreground"
                            )}>
                                {lang.name}
                            </span>
                        </button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">
                    Este idioma se usará para generar contenido y sugerencias de marca
                </p>
            </CardContent>
        </Card>
    );
}
