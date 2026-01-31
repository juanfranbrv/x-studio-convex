'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { fabric } from 'fabric'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Eraser, Type, ImagePlus, Undo2, Trash2, Check, X } from 'lucide-react'

export type AnnotationTool = 'erase' | 'text' | 'image' | null

export interface AnnotationData {
    type: 'stroke' | 'text' | 'image'
    data: any
}

interface AnnotationCanvasProps {
    imageUrl: string
    width: number
    height: number
    onApply: (annotatedImageBase64: string, annotations: AnnotationData[]) => void
    onCancel: () => void
    className?: string
}

export function AnnotationCanvas({
    imageUrl,
    width,
    height,
    onApply,
    onCancel,
    className
}: AnnotationCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricRef = useRef<fabric.Canvas | null>(null)
    const [activeTool, setActiveTool] = useState<AnnotationTool>('erase')
    const [canUndo, setCanUndo] = useState(false)
    const historyRef = useRef<string[]>([])
    const isDrawingRef = useRef(false)

    // Initialize fabric canvas
    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = new fabric.Canvas(canvasRef.current, {
            width,
            height,
            isDrawingMode: false,
            selection: true,
            preserveObjectStacking: true
        })

        fabricRef.current = canvas

        // Load background image
        fabric.Image.fromURL(imageUrl, (img) => {
            img.scaleToWidth(width)
            img.scaleToHeight(height)
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                originX: 'left',
                originY: 'top'
            })
        }, { crossOrigin: 'anonymous' })

        // Save initial state
        historyRef.current = [JSON.stringify(canvas.toJSON())]

        return () => {
            canvas.dispose()
            fabricRef.current = null
        }
    }, [imageUrl, width, height])

    // Handle tool changes
    useEffect(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        if (activeTool === 'erase') {
            canvas.isDrawingMode = true
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
            canvas.freeDrawingBrush.color = '#FF0000'
            canvas.freeDrawingBrush.width = 8
            canvas.selection = false
        } else {
            canvas.isDrawingMode = false
            canvas.selection = true
        }
    }, [activeTool])

    // Track drawing for history
    useEffect(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        const saveState = () => {
            const state = JSON.stringify(canvas.toJSON())
            historyRef.current.push(state)
            setCanUndo(historyRef.current.length > 1)
        }

        canvas.on('object:added', saveState)
        canvas.on('object:modified', saveState)
        canvas.on('object:removed', saveState)

        return () => {
            canvas.off('object:added', saveState)
            canvas.off('object:modified', saveState)
            canvas.off('object:removed', saveState)
        }
    }, [])

    // Handle text tool click
    useEffect(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        const handleCanvasClick = (e: fabric.IEvent) => {
            if (activeTool !== 'text') return
            if (e.target) return // Clicked on existing object

            const pointer = canvas.getPointer(e.e)
            const text = new fabric.IText('Escribe aquí...', {
                left: pointer.x,
                top: pointer.y,
                fontSize: 24,
                fontFamily: 'Arial',
                fill: '#FFFFFF',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: 8,
                editable: true,
                selectable: true
            })

            canvas.add(text)
            canvas.setActiveObject(text)
            text.enterEditing()
            text.selectAll()
        }

        canvas.on('mouse:down', handleCanvasClick)
        return () => {
            canvas.off('mouse:down', handleCanvasClick)
        }
    }, [activeTool])

    // Handle image upload
    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !fabricRef.current) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            fabric.Image.fromURL(dataUrl, (img) => {
                // Scale image to reasonable size
                const maxSize = Math.min(width, height) * 0.3
                const scale = Math.min(maxSize / (img.width || 100), maxSize / (img.height || 100))
                img.scale(scale)
                img.set({
                    left: width / 2 - (img.width || 0) * scale / 2,
                    top: height / 2 - (img.height || 0) * scale / 2,
                    selectable: true,
                    hasControls: true,
                    hasBorders: true
                })
                fabricRef.current?.add(img)
                fabricRef.current?.setActiveObject(img)
                fabricRef.current?.renderAll()
            })
        }
        reader.readAsDataURL(file)
        e.target.value = '' // Reset input
    }, [width, height])

    // Undo
    const handleUndo = useCallback(() => {
        if (historyRef.current.length <= 1) return

        historyRef.current.pop() // Remove current state
        const previousState = historyRef.current[historyRef.current.length - 1]

        const canvas = fabricRef.current
        if (!canvas || !previousState) return

        canvas.loadFromJSON(previousState, () => {
            canvas.renderAll()
            setCanUndo(historyRef.current.length > 1)
        })
    }, [])

    // Clear all
    const handleClear = useCallback(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        // Keep only background
        const objects = canvas.getObjects()
        objects.forEach(obj => canvas.remove(obj))
        canvas.renderAll()
    }, [])

    // Apply annotations
    const handleApply = useCallback(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        // Collect annotation data
        const annotations: AnnotationData[] = canvas.getObjects().map(obj => {
            if (obj.type === 'path') {
                return { type: 'stroke' as const, data: obj.toObject() }
            } else if (obj.type === 'i-text' || obj.type === 'text') {
                return { type: 'text' as const, data: { text: (obj as fabric.IText).text, left: obj.left, top: obj.top } }
            } else if (obj.type === 'image') {
                return { type: 'image' as const, data: { left: obj.left, top: obj.top, width: obj.width, height: obj.height } }
            }
            return { type: 'stroke' as const, data: obj.toObject() }
        })

        // Export as base64
        const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1
        })

        onApply(dataUrl, annotations)
    }, [onApply])

    return (
        <div className={cn("relative", className)}>
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 glass-panel rounded-full px-2 py-1.5 shadow-xl">
                {/* Tool Buttons */}
                <Button
                    variant={activeTool === 'erase' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTool('erase')}
                    className={cn("h-8 gap-1.5", activeTool === 'erase' && "bg-red-500 hover:bg-red-600")}
                    title="Borrar elementos (dibuja sobre lo que quieres eliminar)"
                >
                    <Eraser className="w-4 h-4" />
                    <span className="text-xs">Borrar</span>
                </Button>

                <Button
                    variant={activeTool === 'text' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTool('text')}
                    className={cn("h-8 gap-1.5", activeTool === 'text' && "bg-blue-500 hover:bg-blue-600")}
                    title="Añadir texto (haz clic donde quieras colocarlo)"
                >
                    <Type className="w-4 h-4" />
                    <span className="text-xs">Texto</span>
                </Button>

                <label className="cursor-pointer">
                    <Button
                        variant={activeTool === 'image' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('image')}
                        className={cn("h-8 gap-1.5", activeTool === 'image' && "bg-green-500 hover:bg-green-600")}
                        title="Insertar imagen"
                        asChild
                    >
                        <span>
                            <ImagePlus className="w-4 h-4" />
                            <span className="text-xs">Imagen</span>
                        </span>
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>

                <div className="w-px h-6 bg-white/20 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="h-8 w-8"
                    title="Deshacer"
                >
                    <Undo2 className="w-4 h-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    title="Limpiar todo"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-white/20 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                    className="h-8 w-8"
                    title="Cancelar"
                >
                    <X className="w-4 h-4" />
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    onClick={handleApply}
                    className="h-8 gap-1.5 bg-primary"
                    title="Aplicar cambios"
                >
                    <Check className="w-4 h-4" />
                    <span className="text-xs">Aplicar</span>
                </Button>
            </div>

            {/* Canvas */}
            <canvas ref={canvasRef} className="rounded-lg" />

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-lg px-4 py-2 text-xs text-center max-w-md">
                {activeTool === 'erase' && (
                    <span>🖌️ <strong>Borrar:</strong> Dibuja sobre los elementos que quieres eliminar</span>
                )}
                {activeTool === 'text' && (
                    <span>✏️ <strong>Texto:</strong> Haz clic donde quieras añadir texto</span>
                )}
                {activeTool === 'image' && (
                    <span>🖼️ <strong>Imagen:</strong> Selecciona una imagen para insertarla</span>
                )}
            </div>
        </div>
    )
}
