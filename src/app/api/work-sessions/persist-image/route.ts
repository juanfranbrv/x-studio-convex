import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/../convex/_generated/api'
import { log } from '@/lib/logger'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null

function dataUrlToBlob(dataUrl: string): Blob {
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/)
    if (!match) {
        throw new Error('Formato data URL invalido')
    }

    const mimeType = match[1] || 'image/png'
    const base64Data = match[2] || ''
    const buffer = Buffer.from(base64Data, 'base64')
    return new Blob([new Uint8Array(buffer)], { type: mimeType })
}

async function httpUrlToBlob(url: string): Promise<Blob> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`No se pudo descargar la imagen (${response.status})`)
    }
    const contentType = response.headers.get('content-type') || 'image/png'
    const bytes = new Uint8Array(await response.arrayBuffer())
    return new Blob([bytes], { type: contentType })
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (!convex) {
            return NextResponse.json({ error: 'Convex URL no configurada' }, { status: 500 })
        }

        const { imageUrl } = await request.json() as { imageUrl?: string }
        const normalized = String(imageUrl || '').trim()
        if (!normalized) {
            return NextResponse.json({ error: 'imageUrl requerida' }, { status: 400 })
        }

        const blob = normalized.startsWith('data:')
            ? dataUrlToBlob(normalized)
            : await httpUrlToBlob(normalized)

        const uploadUrl = await convex.mutation(api.assets.generateUploadUrl, {})
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': blob.type || 'image/png' },
            body: blob,
        })

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            throw new Error(`Upload Convex fallido (${uploadResponse.status}): ${errorText}`)
        }

        const { storageId } = await uploadResponse.json() as { storageId?: string }
        if (!storageId) {
            throw new Error('Convex no devolvio storageId')
        }

        const resolvedUrl = await convex.query(api.assets.getImageUrl, { storageId })
        if (!resolvedUrl) {
            throw new Error('No se pudo resolver URL de storage')
        }

        log.success('SESSION', 'Imagen de sesion persistida', { user: userId, storageId })
        return NextResponse.json({ success: true, storageId, imageUrl: resolvedUrl })
    } catch (error) {
        log.error('SESSION', 'Error persistiendo imagen de sesion', error)
        const message = error instanceof Error ? error.message : 'Error desconocido'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
