'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Type, Search, Plus, Trash2, Info, Loader2, Check, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

const FONT_FEELINGS: Array<{ id: string; families: string[] }> = [
  { id: 'business', families: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Work Sans', 'Noto Sans'] },
  { id: 'calm', families: ['Nunito', 'Quicksand', 'Karla', 'Merriweather Sans', 'Manrope', 'Poppins'] },
  { id: 'playful', families: ['Baloo 2', 'Fredoka', 'Bungee', 'Comfortaa', 'Rubik', 'Cabin Sketch'] },
  { id: 'fancy', families: ['Playfair Display', 'Cormorant Garamond', 'Cinzel', 'Prata', 'Marcellus'] },
  { id: 'cute', families: ['Pacifico', 'Amatic SC', 'Chewy', 'Coming Soon', 'Patrick Hand', 'Short Stack'] },
  { id: 'artistic', families: ['Abril Fatface', 'DM Serif Display', 'Bodoni Moda', 'Archivo Black', 'Syne'] },
  { id: 'vintage', families: ['Lora', 'Libre Baskerville', 'Old Standard TT', 'Vollkorn', 'EB Garamond'] },
  { id: 'futuristic', families: ['Orbitron', 'Exo 2', 'Space Grotesk', 'Rajdhani', 'Audiowide'] },
];

function shuffleArray<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function weightedPickFeelingId(): string {
  const weighted: Array<{ id: string; weight: number }> = [
    { id: 'business', weight: 38 },
    { id: 'calm', weight: 30 },
    { id: 'playful', weight: 8 },
    { id: 'fancy', weight: 7 },
    { id: 'artistic', weight: 6 },
    { id: 'vintage', weight: 5 },
    { id: 'futuristic', weight: 4 },
    { id: 'cute', weight: 2 },
  ];
  const total = weighted.reduce((acc, item) => acc + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.id;
  }
  return 'business';
}

function buildAutoFeelingMix(): string[] {
  const primary = weightedPickFeelingId();
  const secondary = weightedPickFeelingId();
  return Array.from(new Set(['business', 'calm', primary, secondary]));
}

interface TypographySectionProps {
  fonts: { family: string; role?: 'heading' | 'body' }[];
  tagline?: string;
  onAddFont: (font: string) => void;
  onRemoveFont: (index: number) => void;
  onUpdateRole: (index: number, role?: 'heading' | 'body') => void;
  guidedMode?: boolean;
  onSelectFontForRole?: (family: string, role: 'heading' | 'body') => void;
}

export function TypographySection({
  fonts,
  tagline,
  onAddFont,
  onRemoveFont,
  onUpdateRole,
  guidedMode = false,
  onSelectFontForRole,
}: TypographySectionProps) {
  const [fontSearch, setFontSearch] = useState('');
  const [allFonts, setAllFonts] = useState<string[]>([]);
  const [loadingFonts, setLoadingFonts] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const [guidedRole, setGuidedRole] = useState<'heading' | 'body'>('heading');
  const [editingRole, setEditingRole] = useState<'heading' | 'body' | null>(null);
  const [autoFeelingMix] = useState<string[]>(buildAutoFeelingMix);

  const headingIndex = fonts.findIndex((f) => f.role === 'heading');
  const bodyIndex = fonts.findIndex((f) => f.role === 'body');
  const headingFont = headingIndex >= 0 ? fonts[headingIndex] : undefined;
  const bodyFont = bodyIndex >= 0 ? fonts[bodyIndex] : undefined;
  const bothRolesDefined = Boolean(headingFont && bodyFont);

  const roleToChoose: 'heading' | 'body' = editingRole || (!headingFont ? 'heading' : !bodyFont ? 'body' : guidedRole);
  const showExplorer = !guidedMode || !bothRolesDefined || Boolean(editingRole);
  const currentRoleFamily = roleToChoose === 'heading' ? headingFont?.family : bodyFont?.family;

  const fetchGoogleFonts = async () => {
    if (hasFetched || loadingFonts) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
    if (!apiKey) return;

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

  const canAddFamily = (family: string) => fonts.filter((f) => f.family === family).length < 2;

  const filteredFonts = useMemo(() => {
    const query = fontSearch.trim().toLowerCase();
    const base = allFonts.filter((family) => canAddFamily(family));
    if (query) return base.filter((family) => family.toLowerCase().includes(query));

    const selectedFeelingFamilies = FONT_FEELINGS
      .filter((item) => autoFeelingMix.includes(item.id))
      .flatMap((item) => item.families);
    const feelingSet = new Set(selectedFeelingFamilies.map((family) => family.toLowerCase()));
    const prioritized = base.filter((family) => feelingSet.has(family.toLowerCase()));
    const rest = base.filter((family) => !feelingSet.has(family.toLowerCase()));
    return [...shuffleArray(prioritized), ...shuffleArray(rest)];
  }, [allFonts, fontSearch, autoFeelingMix, fonts]);

  const visibleFonts = useMemo(() => filteredFonts.slice(0, visibleCount), [filteredFonts, visibleCount]);

  useEffect(() => {
    setVisibleCount(24);
  }, [fontSearch]);

  useEffect(() => {
    if (!guidedMode) return;
    if (!headingFont) {
      setGuidedRole('heading');
      return;
    }
    if (!bodyFont) setGuidedRole('body');
  }, [guidedMode, headingFont, bodyFont]);

  useEffect(() => {
    if (!guidedMode) return;
    if (!bothRolesDefined) setEditingRole(null);
  }, [guidedMode, bothRolesDefined]);

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

  useEffect(() => {
    fonts.forEach((f) => loadGoogleFont(f.family));
  }, [fonts]);

  useEffect(() => {
    visibleFonts.forEach(loadGoogleFont);
  }, [visibleFonts]);

  const handleToggleRole = (index: number) => {
    const currentRole = fonts[index]?.role;
    let nextRole: 'heading' | 'body' | undefined;
    if (!currentRole) nextRole = 'heading';
    else if (currentRole === 'heading') nextRole = 'body';
    else nextRole = undefined;
    onUpdateRole(index, nextRole);
  };

  const renderExplorer = () => (
    <div className="flex flex-col gap-3 p-4 border-2 border-dashed border-border rounded-xl bg-muted/50 transition-colors focus-within:border-primary/50 focus-within:bg-muted">
      {guidedMode && (
        <div className="rounded-lg border border-border/60 bg-background/60 p-3 space-y-2">
          <p className="text-xs font-medium text-foreground">
            {roleToChoose === 'heading' ? 'Elige tipografia para Titulares' : 'Elige tipografia para Parrafos'}
          </p>
          {editingRole && (
            <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingRole(null)}>
              Cancelar cambio
            </Button>
          )}
        </div>
      )}

      <div className="rounded-lg border border-border/60 bg-background/60 p-3">
        <p className="text-xs font-medium text-foreground">Explora fuentes con vista previa</p>
        <p className="text-xs text-muted-foreground mt-1">No necesitas saber nombres. Mira ejemplos y anade la que te guste.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
        <Input
          placeholder="Filtrar fuentes (opcional)..."
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

      {visibleFonts.length > 0 && (
        <ScrollArea className="h-[260px] rounded-lg border border-border bg-muted p-2 shadow-inner">
          <div className="space-y-1">
            {visibleFonts.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => {
                  if (guidedMode && onSelectFontForRole) {
                    onSelectFontForRole(font, roleToChoose);
                    if (editingRole) setEditingRole(null);
                    else if (roleToChoose === 'heading') setGuidedRole('body');
                  } else {
                    onAddFont(font);
                  }
                }}
                className={cn(
                  'w-full flex items-center justify-between p-2 px-3 rounded text-sm transition-all group text-left border',
                  guidedMode && currentRoleFamily === font
                    ? 'bg-primary/10 border-primary/40'
                    : 'border-transparent hover:border-border/70 hover:bg-[var(--accent)]/10'
                )}
              >
                <div className="flex flex-col">
                  <span className="text-xs text-[var(--text-secondary)]">{font}</span>
                  <span className="text-lg leading-tight" style={{ fontFamily: font }}>
                    Tu marca, tu estilo visual
                  </span>
                </div>
                {guidedMode && currentRoleFamily === font ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[var(--accent)]" />
                )}
              </button>
            ))}
            {visibleCount < filteredFonts.length && (
              <Button type="button" variant="outline" className="w-full h-8 text-xs mt-1" onClick={() => setVisibleCount((prev) => prev + 24)}>
                Cargar mas fuentes
              </Button>
            )}
          </div>
        </ScrollArea>
      )}

      {fontSearch && visibleFonts.length === 0 && !loadingFonts && (
        <div className="text-center py-4 text-[var(--text-secondary)] text-xs italic">No se encontraron fuentes para "{fontSearch}"</div>
      )}

      {!fontSearch && visibleFonts.length > 0 && (
        <div className="flex items-center gap-2 justify-center py-2 text-[var(--text-secondary)]">
          <Info className="w-3.5 h-3.5 opacity-50" />
          <span className="text-[10px]">Mostrando fuentes populares con vista previa</span>
        </div>
      )}
    </div>
  );

  return (
    <Card className="glass-panel border-0 shadow-none overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <Type className="w-5 h-5 text-primary" />
          Tipografia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {(guidedMode ? fonts.filter((f) => f.role === 'heading' || f.role === 'body') : fonts).map((fontObj, idx) => (
            <div key={`${fontObj.family}-${idx}`} className="space-y-4">
              <div
                onClick={() => {
                  if (guidedMode) return;
                  const realIndex = fonts.findIndex((f, i) => i >= idx && f.family === fontObj.family && f.role === fontObj.role);
                  handleToggleRole(realIndex >= 0 ? realIndex : idx);
                }}
                className={cn(
                  'group relative p-4 border rounded-xl transition-all cursor-pointer',
                  fontObj.role === 'heading'
                    ? 'bg-primary/5 border-primary/30'
                    : fontObj.role === 'body'
                      ? 'bg-accent/5 border-accent/20'
                      : 'bg-muted/20 border-border hover:border-primary/20'
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border',
                        fontObj.role === 'heading'
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : fontObj.role === 'body'
                            ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm'
                            : 'bg-muted/50 text-muted-foreground border-border'
                      )}
                    >
                      {fontObj.role === 'heading' ? 'Titulares' : fontObj.role === 'body' ? 'Parrafos' : 'Sin asignar'}
                    </span>
                  </div>
                  {guidedMode && (fontObj.role === 'heading' || fontObj.role === 'body') ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        const targetRole = fontObj.role as 'heading' | 'body';
                        setEditingRole(targetRole);
                        setGuidedRole(targetRole);
                        void fetchGoogleFonts();
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      Cambiar
                    </Button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const roleMatchIndex = fonts.findIndex((f) => f.family === fontObj.family && f.role === fontObj.role);
                        onRemoveFont(roleMatchIndex >= 0 ? roleMatchIndex : idx);
                      }}
                      className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-mono">{fontObj.family}</p>
                    <p
                      className={cn('leading-tight transition-all', fontObj.role === 'heading' ? 'text-2xl md:text-3xl font-bold' : 'text-lg md:text-xl')}
                      style={{ fontFamily: fontObj.family }}
                    >
                      {tagline || (fontObj.role === 'heading' ? 'Un titular impactante' : 'El texto de parrafo fluye con naturalidad.')}
                    </p>
                  </div>
                  <span className="text-2xl opacity-10" style={{ fontFamily: fontObj.family }}>
                    Aa
                  </span>
                </div>
              </div>
              {guidedMode && editingRole && fontObj.role === editingRole && renderExplorer()}
            </div>
          ))}

          {fonts.length < 5 && showExplorer && !(guidedMode && editingRole) && renderExplorer()}
        </div>
      </CardContent>
    </Card>
  );
}
