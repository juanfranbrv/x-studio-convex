'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Facebook, Instagram, Twitter, Linkedin, Youtube, Link as LinkIcon, ExternalLink, Phone, Plus, X, Pencil, Check, Globe, Trash2, Info, MapPin, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContactSocialCardProps {
    socialLinks?: { platform: string; url: string; username?: string }[];
    emails?: string[];
    phones?: string[];
    addresses?: string[];
    onUpdate?: (data: { socialLinks: { platform: string; url: string; username?: string }[], emails: string[], phones: string[], addresses: string[] }) => void;
}

const platformIcons: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    tiktok: Music,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    other: LinkIcon
};

export function ContactSocialCard({ socialLinks = [], emails = [], phones = [], addresses = [], onUpdate }: ContactSocialCardProps) {
    const [localSocials, setLocalSocials] = useState(socialLinks);
    const [localEmails, setLocalEmails] = useState(emails);
    const [localPhones, setLocalPhones] = useState(phones);
    const [localAddresses, setLocalAddresses] = useState(addresses || []);

    const [editingItem, setEditingItem] = useState<{ type: 'email' | 'phone' | 'social' | 'address'; index: number } | null>(null);
    const [editValue, setEditValue] = useState('');
    const [editPlatform, setEditPlatform] = useState('');
    const [editUsername, setEditUsername] = useState('');

    const pushUpdate = (newSocials = localSocials, newEmails = localEmails, newPhones = localPhones, newAddresses = localAddresses) => {
        onUpdate?.({ socialLinks: newSocials, emails: newEmails, phones: newPhones, addresses: newAddresses });
    };

    const handleStartEdit = (type: 'email' | 'phone' | 'social' | 'address', index: number) => {
        setEditingItem({ type, index });
        if (type === 'social') {
            setEditValue(localSocials[index].url);
            setEditPlatform(localSocials[index].platform);
            setEditUsername(localSocials[index].username || '');
        } else if (type === 'email') {
            setEditValue(localEmails[index]);
        } else if (type === 'phone') {
            setEditValue(localPhones[index]);
        } else {
            setEditValue(localAddresses[index]);
        }
    };

    const handleSaveEdit = () => {
        if (!editingItem) return;
        const { type, index } = editingItem;
        let newSocials = [...localSocials];
        let newEmails = [...localEmails];
        let newPhones = [...localPhones];

        if (type === 'social') {
            newSocials[index] = { platform: editPlatform, url: editValue, username: editUsername };
            setLocalSocials(newSocials);
        } else if (type === 'email') {
            newEmails[index] = editValue;
            setLocalEmails(newEmails);
        } else if (type === 'phone') {
            newPhones[index] = editValue;
            setLocalPhones(newPhones);
        } else if (type === 'address') {
            let newAddresses = [...localAddresses];
            newAddresses[index] = editValue;
            setLocalAddresses(newAddresses);
            pushUpdate(newSocials, newEmails, newPhones, newAddresses);
            setEditingItem(null);
            setEditValue('');
            return;
        }

        pushUpdate(newSocials, newEmails, newPhones, localAddresses);
        setEditingItem(null);
        setEditValue('');
        setEditUsername('');
    };

    const handleDelete = (type: 'email' | 'phone' | 'social' | 'address', index: number) => {
        if (type === 'email') {
            const updated = localEmails.filter((_, i) => i !== index);
            setLocalEmails(updated);
            pushUpdate(localSocials, updated, localPhones);
        } else if (type === 'phone') {
            const updated = localPhones.filter((_, i) => i !== index);
            setLocalPhones(updated);
            pushUpdate(localSocials, localEmails, updated);
        } else if (type === 'social') {
            const updated = localSocials.filter((_, i) => i !== index);
            setLocalSocials(updated);
            pushUpdate(updated, localEmails, localPhones, localAddresses);
        } else if (type === 'address') {
            const updated = localAddresses.filter((_, i) => i !== index);
            setLocalAddresses(updated);
            pushUpdate(localSocials, localEmails, localPhones, updated);
        }
    };

    const handleAdd = (type: 'email' | 'phone' | 'social' | 'address') => {
        if (type === 'email') {
            const updated = [...localEmails, 'nuevo@email.com'];
            setLocalEmails(updated);
            pushUpdate(localSocials, updated, localPhones);
        } else if (type === 'phone') {
            const updated = [...localPhones, '+34 000 000 000'];
            setLocalPhones(updated);
            pushUpdate(localSocials, localEmails, updated);
        } else if (type === 'social') {
            const updated = [...localSocials, { platform: 'instagram', url: '' }];
            setLocalSocials(updated);
            pushUpdate(updated, localEmails, localPhones, localAddresses);
        } else if (type === 'address') {
            const updated = [...localAddresses, 'Nueva dirección física'];
            setLocalAddresses(updated);
            pushUpdate(localSocials, localEmails, localPhones, updated);
        }
    };

    const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
        </div>
    );

    const EditableItem = ({
        value,
        username,
        isEditing,
        onEdit,
        onSave,
        onCancel,
        onDelete,
        platform
    }: {
        value: string,
        username?: string,
        isEditing: boolean,
        onEdit: () => void,
        onSave: () => void,
        onCancel: () => void,
        onDelete: () => void,
        platform?: string
    }) => {
        const Icon = platform ? (platformIcons[platform.toLowerCase()] || LinkIcon) : null;

        return (
            <div className="group relative flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                {isEditing ? (
                    <div className="flex-1 flex flex-col gap-2">
                        {platform && (
                            <Select value={editPlatform} onValueChange={setEditPlatform}>
                                <SelectTrigger className="h-7 w-full text-xs px-2 bg-white">
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
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">URL</label>
                                <Input
                                    placeholder="https://..."
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="h-7 text-xs bg-white border-border focus-visible:ring-primary"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') onSave();
                                        if (e.key === 'Escape') onCancel();
                                    }}
                                />
                            </div>
                            {platform && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Usuario</label>
                                    <Input
                                        placeholder="@usuario"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        className="h-7 text-xs bg-white border-border focus-visible:ring-primary"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') onSave();
                                            if (e.key === 'Escape') onCancel();
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-1">
                            <Button size="sm" variant="ghost" className="h-6 px-2 hover:bg-red-500/10 text-red-500 text-[10px]" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 px-2 hover:bg-green-500/10 text-green-500 text-[10px]" onClick={onSave}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {Icon && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-border shrink-0">
                                <Icon className="w-4 h-4 text-primary opacity-80" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            {platform && (
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1 block">
                                    {platform}
                                </span>
                            )}
                            {platform ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-wide">URL</span>
                                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate">
                                            {value || 'Sin URL'}
                                        </a>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-wide">Usuario</span>
                                        {username ? (
                                            <span className="text-xs font-semibold text-foreground truncate">
                                                {username}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic truncate">
                                                Sin usuario
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-sm font-medium text-foreground truncate">
                                    {value}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1">
                            <button
                                className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                onClick={onEdit}
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                                onClick={onDelete}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <Card className="glass-panel border-0 shadow-none relative overflow-visible">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-foreground font-bold">
                    <LinkIcon className="w-5 h-5 text-primary" />
                    Canales y Contacto Directo
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                    Información de contacto oficial detectada en la web
                </p>
            </CardHeader>
            <CardContent className="space-y-8 pt-2 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Emails */}
                    <div className="space-y-4">
                        <SectionTitle icon={Mail} title="Correos Electrónicos" />
                        <div className="space-y-2">
                            {localEmails.map((email, idx) => (
                                <EditableItem
                                    key={`email-${idx}`}
                                    value={email}
                                    isEditing={editingItem?.type === 'email' && editingItem.index === idx}
                                    onEdit={() => handleStartEdit('email', idx)}
                                    onSave={handleSaveEdit}
                                    onCancel={() => setEditingItem(null)}
                                    onDelete={() => handleDelete('email', idx)}
                                />
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-zinc-200 hover:border-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider h-9"
                                onClick={() => handleAdd('email')}
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Añadir Email
                            </Button>
                        </div>
                    </div>

                    {/* Phones */}
                    <div className="space-y-4">
                        <SectionTitle icon={Phone} title="Teléfonos de Contacto" />
                        <div className="space-y-2">
                            {localPhones.map((phone, idx) => (
                                <EditableItem
                                    key={`phone-${idx}`}
                                    value={phone}
                                    isEditing={editingItem?.type === 'phone' && editingItem.index === idx}
                                    onEdit={() => handleStartEdit('phone', idx)}
                                    onSave={handleSaveEdit}
                                    onCancel={() => setEditingItem(null)}
                                    onDelete={() => handleDelete('phone', idx)}
                                />
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-zinc-200 hover:border-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider h-9"
                                onClick={() => handleAdd('phone')}
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Añadir Teléfono
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="space-y-4 pt-2">
                    <SectionTitle icon={MapPin} title="Direcciones Físicas" />
                    <div className="space-y-2">
                        {localAddresses.map((address, idx) => (
                            <EditableItem
                                key={`address-${idx}`}
                                value={address}
                                isEditing={editingItem?.type === 'address' && editingItem.index === idx}
                                onEdit={() => handleStartEdit('address', idx)}
                                onSave={handleSaveEdit}
                                onCancel={() => setEditingItem(null)}
                                onDelete={() => handleDelete('address', idx)}
                            />
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed border-zinc-200 hover:border-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider h-9"
                            onClick={() => handleAdd('address')}
                        >
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Añadir Dirección
                        </Button>
                    </div>
                </div>

                {/* Social Networks */}
                <div className="space-y-4 pt-2">
                    <SectionTitle icon={Globe} title="Presencia en Redes Sociales" />
                    <div className="flex flex-col gap-3">
                        {localSocials.map((social, idx) => (
                            <EditableItem
                                key={`social-${idx}`}
                                value={social.url}
                                username={social.username}
                                platform={social.platform}
                                isEditing={editingItem?.type === 'social' && editingItem.index === idx}
                                onEdit={() => handleStartEdit('social', idx)}
                                onSave={handleSaveEdit}
                                onCancel={() => setEditingItem(null)}
                                onDelete={() => handleDelete('social', idx)}
                            />
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed border-zinc-200 hover:border-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider h-10 mt-2"
                            onClick={() => handleAdd('social')}
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
