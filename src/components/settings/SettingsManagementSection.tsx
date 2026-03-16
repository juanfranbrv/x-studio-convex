'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { IconSparkles } from '@/components/ui/icons'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

type Props = {
    t: (key: string, options?: Record<string, unknown>) => string
    panelPosition: 'left' | 'right'
    setPanelPosition: (value: 'left' | 'right') => void
    assistanceEnabled: boolean
    setAssistanceEnabled: (value: boolean) => void
}

export function SettingsManagementSection({
    t,
    panelPosition,
    setPanelPosition,
    assistanceEnabled,
    setAssistanceEnabled,
}: Props) {
    return (
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="px-6 py-6 md:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                    {t('sections.management.eyebrow')}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {t('sections.management.title')}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {t('sections.management.description')}
                </p>
            </div>

            <div className="grid gap-6 px-6 pb-8 md:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
                <div className="space-y-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {t('management.workspace.title')}
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <Label className="text-sm font-medium text-foreground">
                                    {t('interface.panelTitle')}
                                </Label>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {t('interface.panelDescription')}
                                </p>
                            </div>
                            <div className="rounded-lg border border-border/60 bg-muted/30 p-1">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant={panelPosition === 'right' ? 'secondary' : 'ghost'}
                                        className="rounded-md px-4"
                                        onClick={() => setPanelPosition('right')}
                                    >
                                        {t('interface.right')}
                                    </Button>
                                    <Button
                                        variant={panelPosition === 'left' ? 'secondary' : 'ghost'}
                                        className="rounded-md px-4"
                                        onClick={() => setPanelPosition('left')}
                                    >
                                        {t('interface.left')}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border/40" />

                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <Label className="text-sm font-medium text-foreground">
                                    {t('common:labels.language')}
                                </Label>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {t('management.notice.personalPrefs')}
                                </p>
                            </div>
                            <div className="rounded-lg border border-border/60 bg-muted/30 p-1">
                                <LanguageSwitcher compact align="end" />
                            </div>
                        </div>

                        <div className="border-t border-border/40" />

                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="guided-assistance" className="text-sm font-medium text-foreground">
                                    {t('interface.guidedTitle')}
                                </Label>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {t('interface.guidedDescription')}
                                </p>
                            </div>
                            <Switch
                                id="guided-assistance"
                                checked={assistanceEnabled}
                                onCheckedChange={setAssistanceEnabled}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <IconSparkles className="h-4 w-4 text-primary" />
                        {t('management.notice.title')}
                    </div>
                    <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                        <p>{t('management.notice.globalTheme')}</p>
                        <p>{t('management.notice.personalPrefs')}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
