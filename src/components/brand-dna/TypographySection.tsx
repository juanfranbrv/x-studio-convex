'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button'; // Ensure Button is imported if used, otherwise remove

import { Type, Search, Plus, Trash2, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypographySectionProps {
    fonts: { family: string; role?: 'heading' | 'body' }[];
    tagline?: string;
    onAddFont: (font: string) => void;
    onRemoveFont: (index: number) => void;
    onUpdateRole: (index: number, role?: 'heading' | 'body') => void;
}

export function TypographySection({
    fonts,
    tagline,
    onAddFont,
    onRemoveFont,
    onUpdateRole
}: TypographySectionProps) {
    const [fontSearch, setFontSearch] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [allFonts, setAllFonts] = useState<string[]>([]);
    const [loadingFonts, setLoadingFonts] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    // Ciclar roles: heading -> body -> undefined
    const handleToggleRole = (index: number) => {
        const currentRole = fonts[index].role;
        let nextRole: 'heading' | 'body' | undefined;

        if (!currentRole) nextRole = 'heading';
        else if (currentRole === 'heading') nextRole = 'body';
        else nextRole = undefined;

        onUpdateRole(index, nextRole);
    };

    // Fetch Google Fonts
    const fetchGoogleFonts = async () => {
        if (hasFetched || loadingFonts) return;

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
        if (!apiKey) {
            console.warn("Google Fonts API Key missing");
            return;
        }

        setLoadingFonts(true);
        try {
            const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`);
            const data = await res.json();
            const fontNames = data.items?.map((f: { family: string }) => f.family) || [];
            setAllFonts(fontNames);
            setHasFetched(true);
        } catch (error) {
            console.error('Failed to load Google Fonts:', error);
        } finally {
            setLoadingFonts(false);
        }
    };

    // Filter fonts based on search
    useEffect(() => {
        if (!fontSearch) {
            setSearchResults([]);
            return;
        }

        // Trigger fetch if not done yet
        if (!hasFetched && !loadingFonts) {
            fetchGoogleFonts();
        }

        if (allFonts.length > 0) {
            const canAddFamily = (family: string) =>
                fonts.filter(ef => ef.family === family).length < 2;

            const filtered = allFonts.filter(f =>
                f.toLowerCase().includes(fontSearch.toLowerCase()) && canAddFamily(f)
            ).slice(0, 50);
            setSearchResults(filtered);
        } else if (hasFetched && allFonts.length === 0) {
            // Fallback or empty if fetch failed/returned nothing
            setSearchResults([]);
        }
    }, [fontSearch, allFonts, fonts, hasFetched, loadingFonts]);

    // Helper to inject font link
    const loadGoogleFont = (fontName: string) => {
        if (!fontName) return;
        const id = `font-${fontName.replace(/\s+/g, '-')}`;
        if (document.getElementById(id)) return;

        const link = document.createElement('link');
        link.id = id;
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    };

    // Load existing fonts
    useEffect(() => {
        fonts.forEach(f => loadGoogleFont(f.family));
    }, [fonts]);

    // Load result fonts for preview
    useEffect(() => {
        searchResults.forEach(loadGoogleFont);
    }, [searchResults]);

    return (
        <Card className="glass-panel border-0 shadow-none overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Type className="w-5 h-5 text-primary" />
                    Tipografía
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {fonts.map((fontObj, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleToggleRole(idx)}
                            className={cn(
                                "group relative p-4 border rounded-xl transition-all cursor-pointer",
                                fontObj.role === 'heading' ? "bg-primary/5 border-primary/30" :
                                    fontObj.role === 'body' ? "bg-accent/5 border-accent/20" :
                                        "bg-muted/20 border-border hover:border-primary/20"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                        fontObj.role === 'heading' ? "bg-primary text-primary-foreground border-primary shadow-sm" :
                                            fontObj.role === 'body' ? "bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm" :
                                                "bg-muted/50 text-muted-foreground border-border"
                                    )}>
                                        {fontObj.role === 'heading' ? 'Titulares' :
                                            fontObj.role === 'body' ? 'Párrafos' :
                                                'Sin asignar'}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFont(idx);
                                    }}
                                    className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1 font-mono">{fontObj.family}</p>
                                    <p
                                        className={cn(
                                            "leading-tight transition-all",
                                            fontObj.role === 'heading' ? "text-2xl md:text-3xl font-bold" : "text-lg md:text-xl"
                                        )}
                                        style={{ fontFamily: fontObj.family }}
                                    >
                                        {tagline || (fontObj.role === 'heading' ? 'Un titular impactante' : 'El texto de párrafo fluye con naturalidad.')}
                                    </p>
                                </div>
                                <span className="text-2xl opacity-10" style={{ fontFamily: fontObj.family }}>Aa</span>
                            </div>
                        </div>
                    ))}

                    {/* Buscador de fuentes */}
                    {fonts.length < 5 && (
                        <div className="flex flex-col gap-3 p-4 border-2 border-dashed border-border rounded-xl bg-muted/50 transition-colors focus-within:border-primary/50 focus-within:bg-muted">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                                <Input
                                    placeholder="Buscar en Google Fonts..."
                                    className="pl-10 h-9 bg-transparent border-border text-sm focus-visible:ring-primary"
                                    value={fontSearch}
                                    onFocus={() => fetchGoogleFonts()}
                                    onChange={(e) => setFontSearch(e.target.value)}
                                />
                                {loadingFonts && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                                    </div>
                                )}
                            </div>

                            {searchResults.length > 0 && (
                                <ScrollArea className="h-[180px] rounded-lg border border-border bg-muted p-2 shadow-inner">
                                    <div className="space-y-1">
                                        {searchResults.map((font) => (
                                            <button
                                                key={font}
                                                onClick={() => {
                                                    onAddFont(font);
                                                    setFontSearch('');
                                                    setSearchResults([]);
                                                }}
                                                className="w-full flex items-center justify-between p-2 px-3 rounded hover:bg-[var(--accent)]/10 text-sm transition-all group text-left"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-[var(--text-secondary)]">{font}</span>
                                                    <span className="text-lg" style={{ fontFamily: font }}>Aa Bb Cc</span>
                                                </div>
                                                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[var(--accent)]" />
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}

                            {fontSearch && searchResults.length === 0 && !loadingFonts && (
                                <div className="text-center py-4 text-[var(--text-secondary)] text-xs italic">
                                    No se encontraron fuentes matching "{fontSearch}"
                                </div>
                            )}

                            {!fontSearch && (
                                <div className="flex items-center gap-2 justify-center py-2 text-[var(--text-secondary)]">
                                    <Info className="w-3.5 h-3.5 opacity-50" />
                                    <span className="text-[10px]">Escribe para buscar entre +1400 fuentes</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
