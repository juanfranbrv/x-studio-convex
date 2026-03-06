import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/../convex/_generated/api'
import { log } from '@/lib/logger'
import sharp from 'sharp'
import crypto from 'crypto'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string } {
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/)
    if (!match) {
        throw new Error('Formato data URL invalido')
    }

    const mimeType = match[1] || 'image/png'
    const base64Data = match[2] || ''
    const buffer = Buffer.from(base64Data, 'base64')
    return { buffer, mimeType }
}

async function httpUrlToBuffer(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`No se pudo descargar la imagen (${response.status})`)
    }
    const mimeType = response.headers.get('content-type') || 'image/png'
    const buffer = Buffer.from(await response.arrayBuffer())
    return { buffer, mimeType }
}

function extractStorageIdFromUrl(url: string): string | null {
    const value = String(url || '').trim()
    if (!value) return null
    if (/^[a-z0-9]{20,}$/i.test(value)) return value

    const directStorageMatch = value.match(/\/_storage\/([^/?#]+)/i)
    if (directStorageMatch?.[1]) return directStorageMatch[1]

    const convexStorageMatch = value.match(/\/api\/storage\/([^/?#]+)/i)
    if (convexStorageMatch?.[1]) return convexStorageMatch[1]

    return null
}

type PersistResponse = {
    success: true
    reused?: boolean
    storageId: string
    imageUrl: string
    originalStorageId: string
    originalImageUrl: string
    previewStorageId: string
    previewImageUrl: string
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

        const existingStorageId = extractStorageIdFromUrl(normalized)
        if (existingStorageId) {
            const existing = await convex.query(api.sessionImages.getByUserOriginalStorage, {
                user_id: userId,
                original_storage_id: existingStorageId,
            })
            if (existing?.original_storage_id && existing?.preview_storage_id) {
                await convex.mutation(api.sessionImages.touch, { id: existing._id })
                const payload: PersistResponse = {
                    success: true,
                    reused: true,
                    storageId: existing.original_storage_id,
                    imageUrl: existing.preview_url,
                    originalStorageId: existing.original_storage_id,
                    originalImageUrl: existing.original_url,
                    previewStorageId: existing.preview_storage_id,
                    previewImageUrl: existing.preview_url,
                }
                return NextResponse.json(payload)
            }
        }

        const source = normalized.startsWith('data:')
            ? dataUrlToBuffer(normalized)
            : await httpUrlToBuffer(normalized)

        const sourceHash = crypto.createHash('sha256').update(source.buffer).digest('hex')
        const byHash = await convex.query(api.sessionImages.getByUserHash, {
            user_id: userId,
            source_hash: sourceHash,
        })
        if (byHash?.original_storage_id && byHash?.preview_storage_id) {
            await convex.mutation(api.sessionImages.touch, { id: byHash._id })
            const payload: PersistResponse = {
                success: true,
                reused: true,
                storageId: byHash.original_storage_id,
                imageUrl: byHash.preview_url,
                originalStorageId: byHash.original_storage_id,
                originalImageUrl: byHash.original_url,
                previewStorageId: byHash.preview_storage_id,
                previewImageUrl: byHash.preview_url,
            }
            return NextResponse.json(payload)
        }

        let originalStorageId = existingStorageId || ''
        let originalUrl = ''

        if (originalStorageId) {
            const resolvedOriginal = await convex.query(api.assets.getImageUrl, { storageId: originalStorageId })
            if (resolvedOriginal) {
                originalUrl = resolvedOriginal
            }
        }

        if (!originalStorageId || !originalUrl) {
            const originalUploadUrl = await convex.mutation(api.assets.generateUploadUrl, {})
            const originalUploadResponse = await fetch(originalUploadUrl, {
                method: 'POST',
                headers: { 'Content-Type': source.mimeType || 'image/png' },
                body: new Blob([new Uint8Array(source.buffer)], { type: source.mimeType || 'image/png' }),
            })

            if (!originalUploadResponse.ok) {
                const errorText = await originalUploadResponse.text()
                throw new Error(`Upload Convex fallido (${originalUploadResponse.status}): ${errorText}`)
            }

            const originalUploadData = await originalUploadResponse.json() as { storageId?: string }
            if (!originalUploadData.storageId) {
                throw new Error('Convex no devolvio storageId')
            }
            originalStorageId = originalUploadData.storageId
            const resolvedOriginal = await convex.query(api.assets.getImageUrl, { storageId: originalStorageId })
            if (!resolvedOriginal) {
                throw new Error('No se pudo resolver URL original')
            }
            originalUrl = resolvedOriginal
        }

        const previewBuffer = await sharp(source.buffer)
            .rotate()
            .resize({ width: 480, withoutEnlargement: true })
            .webp({ quality: 67 })
            .toBuffer()

        const previewUploadUrl = await convex.mutation(api.assets.generateUploadUrl, {})
        const previewUploadResponse = await fetch(previewUploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'image/webp' },
            body: new Blob([new Uint8Array(previewBuffer)], { type: 'image/webp' }),
        })
        if (!previewUploadResponse.ok) {
            const errorText = await previewUploadResponse.text()
            throw new Error(`Upload preview fallido (${previewUploadResponse.status}): ${errorText}`)
        }

        const previewUploadData = await previewUploadResponse.json() as { storageId?: string }
        if (!previewUploadData.storageId) {
            throw new Error('Convex no devolvio preview storageId')
        }
        const previewStorageId = previewUploadData.storageId
        const previewUrl = await convex.query(api.assets.getImageUrl, { storageId: previewStorageId })
        if (!previewUrl) {
            throw new Error('No se pudo resolver URL preview')
        }

        await convex.mutation(api.sessionImages.upsert, {
            user_id: userId,
            source_hash: sourceHash,
            original_storage_id: originalStorageId,
            original_url: originalUrl,
            preview_storage_id: previewStorageId,
            preview_url: previewUrl,
            mime_type: source.mimeType,
            size_bytes: source.buffer.byteLength,
        })

        log.success('SESSION', 'Imagen de sesion persistida', { user: userId, originalStorageId, previewStorageId })
        const payload: PersistResponse = {
            success: true,
            storageId: originalStorageId,
            imageUrl: previewUrl,
            originalStorageId,
            originalImageUrl: originalUrl,
            previewStorageId,
            previewImageUrl: previewUrl,
        }
        return NextResponse.json(payload)
    } catch (error) {
        log.error('SESSION', 'Error persistiendo imagen de sesion', error)
        const message = error instanceof Error ? error.message : 'Error desconocido'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

