'use client'

import { useState } from 'react'
import { Search, X, Layout, Check } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface Template {
    id: string
    name: string
    category: string
    thumbnail: string
}

// Mock data for templates
// Mock data for templates
const MOCK_TEMPLATES: Template[] = [
    { id: 'plantilla1', name: 'Plantilla de Producto 1', category: 'Producto', thumbnail: '/plantillas/plantilla1.png' },
    { id: 'plantilla2', name: 'Plantilla de Producto 2', category: 'Producto', thumbnail: '/plantillas/plantilla2.png' },
    { id: 'plantilla3', name: 'Plantilla de Producto 3', category: 'Producto', thumbnail: '/plantillas/plantilla3.png' },
    { id: '1', name: 'Minimal Editorial', category: 'Modern', thumbnail: 'https://placehold.co/400x300/222/white?text=Minimal+Editorial' },
    { id: '2', name: 'Bold Retail', category: 'Retail', thumbnail: 'https://placehold.co/400x300/333/white?text=Bold+Retail' },
    { id: '5', name: 'Dark Mode Hero', category: 'Modern', thumbnail: 'https://placehold.co/400x300/111/white?text=Dark+Mode+Hero' },
]

const CATEGORIES = ['All', 'Producto', 'Modern', 'Retail']

interface TemplateSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (template: Template) => void
    selectedTemplateId?: string
}

export function TemplateSelectorModal({
    isOpen,
    onClose,
    onSelect,
    selectedTemplateId
}: TemplateSelectorModalProps) {
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    const filteredTemplates = MOCK_TEMPLATES.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50">
                <DialogHeader className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Layout className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-heading">Biblioteca de Plantillas</DialogTitle>
                            <DialogDescription>
                                Elige una estructura visual para tu próxima generación.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6 flex-1 overflow-hidden flex flex-col">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar estilos, categorías..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-muted/30 border-border/50 rounded-xl"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0">
                            {CATEGORIES.map(cat => (
                                <Badge
                                    key={cat}
                                    variant={selectedCategory === cat ? 'default' : 'outline'}
                                    className="cursor-pointer px-3 py-1 rounded-lg transition-all"
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <ScrollArea className="flex-1 -mx-2 px-2">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                            {filteredTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedTemplateId === template.id
                                        ? 'border-primary ring-4 ring-primary/10 scale-[0.98]'
                                        : 'border-transparent hover:border-primary/30 hover:shadow-xl hover:-translate-y-1'
                                        }`}
                                    onClick={() => {
                                        onSelect(template)
                                        onClose()
                                    }}
                                >
                                    <img
                                        src={template.thumbnail}
                                        alt={template.name}
                                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-medium text-sm">{template.name}</p>
                                        <p className="text-white/60 text-xs">{template.category}</p>
                                    </div>

                                    {selectedTemplateId === template.id && (
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}
