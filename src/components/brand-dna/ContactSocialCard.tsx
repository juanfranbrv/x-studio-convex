'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Facebook, Instagram, Twitter, Linkedin, Youtube, Link as LinkIcon, Phone, Plus, Globe, Trash2, MapPin, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactSocialCardProps {
    socialLinks?: { platform: string; url: string; username?: string }[];
    emails?: string[];
    phones?: string[];
    addresses?: string[];
    onUpdate?: (data: { socialLinks: { platform: string; url: string; username?: string }[]; emails: string[]; phones: string[]; addresses: string[] }) => void;
}

const platformIcons: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    tiktok: Music,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    other: LinkIcon,
};

export function ContactSocialCard({ socialLinks = [], emails = [], phones = [], addresses = [], onUpdate }: ContactSocialCardProps) {
    const [localSocials, setLocalSocials] = useState(socialLinks);
    const [localEmails, setLocalEmails] = useState(emails);
    const [localPhones, setLocalPhones] = useState(phones);
    const [localAddresses, setLocalAddresses] = useState(addresses || []);

    useEffect(() => setLocalSocials(socialLinks || []), [socialLinks]);
    useEffect(() => setLocalEmails(emails || []), [emails]);
    useEffect(() => setLocalPhones(phones || []), [phones]);
    useEffect(() => setLocalAddresses(addresses || []), [addresses]);

    const pushUpdate = (
        newSocials = localSocials,
        newEmails = localEmails,
        newPhones = localPhones,
        newAddresses = localAddresses,
    ) => {
        onUpdate?.({ socialLinks: newSocials, emails: newEmails, phones: newPhones, addresses: newAddresses });
    };

    const updateEmailAt = (index: number, value: string) => {
        const next = [...localEmails];
        next[index] = value;
        setLocalEmails(next);
        pushUpdate(localSocials, next, localPhones, localAddresses);
    };

    const updatePhoneAt = (index: number, value: string) => {
        const next = [...localPhones];
        next[index] = value;
        setLocalPhones(next);
        pushUpdate(localSocials, localEmails, next, localAddresses);
    };

    const updateAddressAt = (index: number, value: string) => {
        const next = [...localAddresses];
        next[index] = value;
        setLocalAddresses(next);
        pushUpdate(localSocials, localEmails, localPhones, next);
    };

    const updateSocialAt = (index: number, patch: Partial<{ platform: string; url: string; username?: string }>) => {
        const next = [...localSocials];
        next[index] = { ...next[index], ...patch };
        setLocalSocials(next);
        pushUpdate(next, localEmails, localPhones, localAddresses);
    };

    const handleDelete = (type: 'email' | 'phone' | 'social' | 'address', index: number) => {
        if (type === 'email') {
            const updated = localEmails.filter((_, i) => i !== index);
            setLocalEmails(updated);
            pushUpdate(localSocials, updated, localPhones, localAddresses);
            return;
        }
        if (type === 'phone') {
            const updated = localPhones.filter((_, i) => i !== index);
            setLocalPhones(updated);
            pushUpdate(localSocials, localEmails, updated, localAddresses);
            return;
        }
        if (type === 'social') {
            const updated = localSocials.filter((_, i) => i !== index);
            setLocalSocials(updated);
            pushUpdate(updated, localEmails, localPhones, localAddresses);
            return;
        }
        const updated = localAddresses.filter((_, i) => i !== index);
        setLocalAddresses(updated);
        pushUpdate(localSocials, localEmails, localPhones, updated);
    };

    const handleAdd = (type: 'email' | 'phone' | 'social' | 'address') => {
        if (type === 'email') {
            const updated = [...localEmails, ''];
            setLocalEmails(updated);
            pushUpdate(localSocials, updated, localPhones, localAddresses);
            return;
        }
        if (type === 'phone') {
            const updated = [...localPhones, ''];
            setLocalPhones(updated);
            pushUpdate(localSocials, localEmails, updated, localAddresses);
            return;
        }
        if (type === 'social') {
            const updated = [...localSocials, { platform: 'instagram', url: '', username: '' }];
            setLocalSocials(updated);
            pushUpdate(updated, localEmails, localPhones, localAddresses);
            return;
        }
        const updated = [...localAddresses, ''];
        setLocalAddresses(updated);
        pushUpdate(localSocials, localEmails, localPhones, updated);
    };

    const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
        </div>
    );

    const FieldRow = ({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) => (
        <div className="group relative flex items-center gap-2 py-1">
            <div className="flex-1">{children}</div>
            <button
                className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                onClick={onDelete}
                aria-label="Eliminar"
                type="button"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );

    return (
        <Card className="glass-panel border-0 shadow-none relative overflow-visible">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-foreground font-bold">
                    <LinkIcon className="w-5 h-5 text-primary" />
                    Canales y Contacto Directo
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">Información de contacto oficial detectada en la web</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-2 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <SectionTitle icon={Mail} title="Correos Electrónicos" />
                        <div className="space-y-1">
                            {localEmails.map((email, idx) => (
                                <FieldRow key={`email-${idx}`} onDelete={() => handleDelete('email', idx)}>
                                    <Input
                                        value={email}
                                        onChange={(e) => updateEmailAt(idx, e.target.value)}
                                        placeholder="correo@empresa.com"
                                        className="h-9 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                                    />
                                </FieldRow>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-zinc-200 hover:border-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider h-9"
                                onClick={() => handleAdd('email')}
                                type="button"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Añadir Email
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SectionTitle icon={Phone} title="Teléfonos de Contacto" />
                        <div className="space-y-1">
                            {localPhones.map((phone, idx) => (
                                <FieldRow key={`phone-${idx}`} onDelete={() => handleDelete('phone', idx)}>
                                    <Input
                                        value={phone}
                                        onChange={(e) => updatePhoneAt(idx, e.target.value)}
                                        placeholder="+34 600 000 000"
                                        className="h-9 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                                    />
                                </FieldRow>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-zinc-200 hover:border-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider h-9"
                                onClick={() => handleAdd('phone')}
                                type="button"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Añadir Teléfono
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <SectionTitle icon={MapPin} title="Direcciones Físicas" />
                    <div className="space-y-1">
                        {localAddresses.map((address, idx) => (
                            <FieldRow key={`address-${idx}`} onDelete={() => handleDelete('address', idx)}>
                                <Input
                                    value={address}
                                    onChange={(e) => updateAddressAt(idx, e.target.value)}
                                    placeholder="Calle, número, ciudad, código postal"
                                    className="h-9 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                                />
                            </FieldRow>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed border-zinc-200 hover:border-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider h-9"
                            onClick={() => handleAdd('address')}
                            type="button"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Añadir Dirección
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <SectionTitle icon={Globe} title="Presencia en Redes Sociales" />
                    <div className="flex flex-col gap-1">
                        {localSocials.map((social, idx) => {
                            const Icon = platformIcons[(social.platform || 'other').toLowerCase()] || LinkIcon;
                            return (
                                <FieldRow key={`social-${idx}`} onDelete={() => handleDelete('social', idx)}>
                                    <div className="grid grid-cols-1 md:grid-cols-[130px_1fr_1fr] gap-2 items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted/40 border border-border/60 shrink-0">
                                                <Icon className="w-3.5 h-3.5 text-primary opacity-80" />
                                            </div>
                                            <Select
                                                value={social.platform || 'instagram'}
                                                onValueChange={(value) => updateSocialAt(idx, { platform: value })}
                                            >
                                                <SelectTrigger className="h-9 text-xs bg-transparent border-border/70 focus:ring-0 focus:border-primary">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="instagram">Instagram</SelectItem>
                                                    <SelectItem value="facebook">Facebook</SelectItem>
                                                    <SelectItem value="twitter">X / Twitter</SelectItem>
                                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                    <SelectItem value="youtube">YouTube</SelectItem>
                                                    <SelectItem value="tiktok">TikTok</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Input
                                            value={social.url || ''}
                                            onChange={(e) => updateSocialAt(idx, { url: e.target.value })}
                                            placeholder="https://..."
                                            className="h-9 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                                        />
                                        <Input
                                            value={social.username || ''}
                                            onChange={(e) => updateSocialAt(idx, { username: e.target.value })}
                                            placeholder="@usuario"
                                            className="h-9 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                                        />
                                    </div>
                                </FieldRow>
                            );
                        })}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed border-zinc-200 hover:border-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider h-10 mt-2"
                            onClick={() => handleAdd('social')}
                            type="button"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Añadir Red Social
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
