import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ARTISTIC_STYLE_CATALOG, ARTISTIC_STYLE_GROUPS } from '@/lib/creation-flow-types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

import { IconDelete, IconPlus, IconSparkles, IconTextFont, IconMessage, IconQuote, IconLanguages } from '@/components/ui/icons';

const LANGUAGE_OPTIONS = [
    { value: 'es', label: '🇪🇸 Español' },
    { value: 'en', label: '🇬🇧 English' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'pt', label: '🇵🇹 Português' },
    { value: 'it', label: '🇮🇹 Italiano' },
    { value: 'ca', label: 'Català' },
];

interface BrandAssetsProps {
    tagline: string;
    values: string[];
    aesthetic: string[];
    tone: string[];
    preferredLanguage?: string;
    onUpdateTagline: (val: string) => void;
    onUpdateValue: (index: number, val: string) => void;
    onAddValue: () => void;
    onRemoveValue: (index: number) => void;
    onUpdateAesthetic: (index: number, val: string) => void;
    onAddAesthetic: () => void;
    onRemoveAesthetic: (index: number) => void;
    onUpdateTone: (index: number, val: string) => void;
    onAddTone: () => void;
    onRemoveTone: (index: number) => void;
    onUpdateLanguage?: (val: string) => void;
}

export function BrandAssets({
    tagline,
    values,
    aesthetic,
    tone,
    preferredLanguage,
    onUpdateTagline,
    onUpdateValue,
    onAddValue,
    onRemoveValue,
    onUpdateAesthetic,
    onAddAesthetic,
    onRemoveAesthetic,
    onUpdateTone,
    onAddTone,
    onRemoveTone,
    onUpdateLanguage,
}: BrandAssetsProps) {
    const { t } = useTranslation('brandKit');
    const [openSuggestionIndex, setOpenSuggestionIndex] = useState<number | null>(null);

    const groupedSuggestions = useMemo(() => {
        return ARTISTIC_STYLE_GROUPS.reduce((acc, group) => {
            const stylesInGroup = ARTISTIC_STYLE_CATALOG.filter((s) => s.category === group.id);
            if (stylesInGroup.length > 0) {
                acc[group.id] = {
                    label: group.label,
                    styles: stylesInGroup,
                };
            }
            return acc;
        }, {} as Record<string, { label: string; styles: typeof ARTISTIC_STYLE_CATALOG }>);
    }, []);

    const DirectRow = ({
        value,
        onChange,
        onDelete,
        placeholder,
        right,
    }: {
        value: string;
        onChange: (v: string) => void;
        onDelete: () => void;
        placeholder: string;
        right?: React.ReactNode;
    }) => (
        <div className="group relative flex items-center gap-2 py-1.5">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-10 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
            />
            {right}
            <button
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 md:h-8 md:w-8 md:opacity-0 md:group-hover:opacity-100"
                onClick={onDelete}
                type="button"
                aria-label={t('assets.deleteAria', { defaultValue: 'Delete' })}
            >
                <IconDelete className="w-3.5 h-3.5" />
            </button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-white border border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <IconQuote className="w-5 h-5 text-primary" />
                        {t('assets.taglineTitle', { defaultValue: 'Tagline' })}
                    </CardTitle>
                </CardHeader>
            <CardContent>
                    <div className="py-1">
                        <Input
                            value={tagline}
                            onChange={(e) => onUpdateTagline(e.target.value)}
                            className="h-10 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                            placeholder={t('assets.taglinePlaceholder', { defaultValue: 'Write the brand tagline' })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-white border border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <IconLanguages className="w-5 h-5 text-primary" />
                        {t('assets.preferredLanguageTitle', { defaultValue: 'Preferred language' })}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{t('assets.preferredLanguageDescription', { defaultValue: 'Language used for AI-generated content for this brand.' })}</p>
                </CardHeader>
                <CardContent>
                    <div className="py-1">
                        <Select
                            value={preferredLanguage || 'es'}
                            onValueChange={(val) => onUpdateLanguage?.(val)}
                        >
                            <SelectTrigger className="h-10 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus:ring-0 focus:border-primary shadow-none w-full max-w-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <IconSparkles className="w-5 h-5 text-primary" />
                        {t('assets.valuesTitle', { defaultValue: 'Values' })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    {values.map((v, i) => (
                        <DirectRow
                            key={`value-${i}`}
                            value={v}
                            onChange={(val) => onUpdateValue(i, val)}
                            onDelete={() => onRemoveValue(i)}
                            placeholder={t('assets.valuePlaceholder', { defaultValue: 'Brand value' })}
                        />
                    ))}
                    <Button variant="outline" size="sm" className="h-10 w-full border-dashed border-border text-sm hover:border-primary hover:bg-primary/5" onClick={onAddValue} type="button">
                        <IconPlus className="w-4 h-4 mr-1" />
                        {t('assets.addValue', { defaultValue: 'Add value' })}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-white border border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <IconTextFont className="w-5 h-5 text-primary" />
                        {t('assets.visualStylesTitle', { defaultValue: 'Visual styles' })}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{t('assets.visualStylesDescription', { defaultValue: 'Used for image generation in the Image module.' })}</p>
                </CardHeader>
                <CardContent className="space-y-1">
                    {aesthetic.map((v, i) => (
                        <DirectRow
                            key={`aesthetic-${i}`}
                            value={v}
                            onChange={(val) => onUpdateAesthetic(i, val)}
                            onDelete={() => onRemoveAesthetic(i)}
                            placeholder={t('assets.visualStylePlaceholder', { defaultValue: 'Visual style' })}
                            right={
                                <Popover open={openSuggestionIndex === i} onOpenChange={(open) => setOpenSuggestionIndex(open ? i : null)}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-9 w-9 p-0 hover:bg-primary/10"
                                            type="button"
                                            title={t('assets.styleSuggestionsTitle', { defaultValue: 'Style suggestions' })}
                                        >
                                            <IconSparkles className="w-3.5 h-3.5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-[350px] shadow-xl border-border max-h-[300px] overflow-hidden flex flex-col bg-card" align="start" sideOffset={5}>
                                        <div className="overflow-y-auto flex-1">
                                            {Object.entries(groupedSuggestions).map(([groupId, group]) => (
                                                <div key={groupId}>
                                                    <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-muted/50 text-muted-foreground sticky top-0 backdrop-blur-sm z-10">
                                                        {group.label}
                                                    </div>
                                                    {group.styles.map((style) => (
                                                        <button
                                                            key={style.id}
                                                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-3 transition-colors border-b border-border/40 last:border-0"
                                                            onClick={() => {
                                                                onUpdateAesthetic(i, style.label);
                                                                setOpenSuggestionIndex(null);
                                                            }}
                                                            type="button"
                                                        >
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="font-medium text-foreground">{style.label}</span>
                                                                <span className="text-xs text-muted-foreground line-clamp-1">{style.keywords.slice(0, 3).join(', ')}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            }
                        />
                    ))}
                    <Button variant="outline" size="sm" className="h-10 w-full border-dashed border-border text-sm hover:border-primary hover:bg-primary/5" onClick={onAddAesthetic} type="button">
                        <IconPlus className="w-4 h-4 mr-1" />
                        {t('assets.addStyle', { defaultValue: 'Add style' })}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-white border border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <IconMessage className="w-5 h-5 text-primary" />
                        {t('assets.toneTitle', { defaultValue: 'Tone of voice' })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    {tone.map((v, i) => (
                        <DirectRow
                            key={`tone-${i}`}
                            value={v}
                            onChange={(val) => onUpdateTone(i, val)}
                            onDelete={() => onRemoveTone(i)}
                            placeholder={t('assets.tonePlaceholder', { defaultValue: 'Tone of voice' })}
                        />
                    ))}
                    <Button variant="outline" size="sm" className="h-10 w-full border-dashed border-border text-sm hover:border-primary hover:bg-primary/5" onClick={onAddTone} type="button">
                        <IconPlus className="w-4 h-4 mr-1" />
                        {t('assets.addTone', { defaultValue: 'Add tone' })}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
