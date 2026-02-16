'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import InstagramIcon from '@mui/icons-material/Instagram'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import YouTubeIcon from '@mui/icons-material/YouTube'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CircularProgress from '@mui/material/CircularProgress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'linkedin'

interface CampaignBriefPanelProps {
    onGenerate?: (data: {
        platform: Platform
        headline: string
        cta: string
        prompt: string
    }) => Promise<void>
    isGenerating?: boolean
}

const platforms: { id: Platform; icon: React.ComponentType<{ className?: string; fontSize?: 'small' | 'medium' | 'large' }>; color: string }[] = [
    { id: 'instagram', icon: InstagramIcon, color: 'platform-instagram' },
    { id: 'tiktok', icon: MusicNoteIcon, color: 'platform-tiktok' },
    { id: 'youtube', icon: YouTubeIcon, color: 'platform-youtube' },
    { id: 'linkedin', icon: LinkedInIcon, color: 'platform-linkedin' },
]

export function CampaignBriefPanel({ onGenerate, isGenerating = false }: CampaignBriefPanelProps) {
    const { t } = useTranslation()
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram')
    const [headline, setHeadline] = useState('')
    const [cta, setCta] = useState('')
    const [prompt, setPrompt] = useState('')

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        await onGenerate?.({
            platform: selectedPlatform,
            headline,
            cta,
            prompt,
        })
    }

    return (
        <div className="w-[320px] h-full bg-card border-l border-border p-4 flex flex-col gap-4 overflow-y-auto">
            {/* Header */}
            <h2 className="text-lg font-semibold font-heading">{t('campaign.title')}</h2>

            {/* Platform Selector */}
            <div className="flex gap-2">
                {platforms.map(({ id, icon: Icon, color }) => (
                    <button
                        key={id}
                        onClick={() => setSelectedPlatform(id)}
                        className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
                            selectedPlatform === id
                                ? `${color} text-white shadow-lg scale-110`
                                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        )}
                    >
                        <Icon fontSize="small" />
                    </button>
                ))}
            </div>

            {/* Generation Controls */}
            <Card className="bg-muted/30 border-0">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                        {t('campaign.generationControls')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Headline */}
                    <div className="space-y-2">
                        <Label htmlFor="headline" className="text-xs text-muted-foreground">
                            {t('campaign.headlineText')}
                        </Label>
                        <Input
                            id="headline"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder={t('campaign.headlinePlaceholder')}
                            className="bg-input/50"
                        />
                    </div>

                    {/* CTA */}
                    <div className="space-y-2">
                        <Label htmlFor="cta" className="text-xs text-muted-foreground">
                            {t('campaign.cta')}
                        </Label>
                        <Input
                            id="cta"
                            value={cta}
                            onChange={(e) => setCta(e.target.value)}
                            placeholder={t('campaign.ctaPlaceholder')}
                            className="bg-input/50"
                        />
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt" className="text-xs text-muted-foreground">
                            {t('campaign.prompt')}
                        </Label>
                        <Textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('campaign.promptPlaceholder')}
                            className="bg-input/50 min-h-[100px] resize-none"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
