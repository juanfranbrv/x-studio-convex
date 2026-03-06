'use server';

import sharp from 'sharp';
import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

function parseDataUrl(value: string): { mimeType: string; buffer: Buffer } {
    const match = value.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
        throw new Error('Formato de data URL no valido.');
    }
    const mimeType = match[1] || 'image/jpeg';
    const base64 = match[2] || '';
    return {
        mimeType,
        buffer: Buffer.from(base64, 'base64'),
    };
}

async function loadSourceBuffer(imageUrl: string): Promise<Buffer> {
    const clean = (imageUrl || '').trim();
    if (!clean) throw new Error('El preset no tiene imagen para optimizar.');

    if (clean.startsWith('data:')) {
        return parseDataUrl(clean).buffer;
    }

    const response = await fetch(clean);
    if (!response.ok) {
        throw new Error(`No se pudo descargar la imagen original (${response.status}).`);
    }

    const bytes = await response.arrayBuffer();
    return Buffer.from(bytes);
}

export async function optimizeStylePresetImage(
    adminEmail: string,
    presetId: string,
): Promise<{ success: boolean; url?: string; thumbnailUrl?: string; error?: string }> {
    try {
        if (!adminEmail?.trim()) {
            return { success: false, error: 'Admin email requerido.' };
        }
        if (!presetId?.trim()) {
            return { success: false, error: 'ID de preset requerido.' };
        }

        const rawPreset = await fetchQuery(api.stylePresets.getRawImageByIdForAdmin, {
            admin_email: adminEmail,
            id: presetId as Id<'style_presets'>,
        });

        const sourceBuffer = await loadSourceBuffer(String(rawPreset?.image_url || ''));
        const optimizedBuffer = await sharp(sourceBuffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer();
        const thumbnailBuffer = await sharp(sourceBuffer)
            .resize({ width: 320, withoutEnlargement: true })
            .webp({ quality: 66 })
            .toBuffer();

        const uploadUrl = await fetchMutation(api.assets.generateUploadUrl, {});
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: new Blob([new Uint8Array(optimizedBuffer)], { type: 'image/webp' }),
            headers: { 'Content-Type': 'image/webp' },
        });

        if (!uploadResponse.ok) {
            throw new Error(`Error al subir imagen optimizada (${uploadResponse.status}).`);
        }

        const { storageId } = await uploadResponse.json();
        const finalUrl = await fetchQuery(api.assets.getImageUrl, { storageId });
        if (!finalUrl) throw new Error('No se pudo obtener URL final de imagen optimizada.');

        const thumbnailUploadUrl = await fetchMutation(api.assets.generateUploadUrl, {});
        const thumbnailUploadResponse = await fetch(thumbnailUploadUrl, {
            method: 'POST',
            body: new Blob([new Uint8Array(thumbnailBuffer)], { type: 'image/webp' }),
            headers: { 'Content-Type': 'image/webp' },
        });
        if (!thumbnailUploadResponse.ok) {
            throw new Error(`Error al subir miniatura (${thumbnailUploadResponse.status}).`);
        }
        const { storageId: thumbnailStorageId } = await thumbnailUploadResponse.json();
        const thumbnailUrl = await fetchQuery(api.assets.getImageUrl, { storageId: thumbnailStorageId });
        if (!thumbnailUrl) throw new Error('No se pudo obtener URL final de miniatura.');

        await fetchMutation(api.stylePresets.update, {
            admin_email: adminEmail,
            id: presetId as Id<'style_presets'>,
            image_url: finalUrl,
            thumbnail_url: thumbnailUrl,
        });

        return { success: true, url: finalUrl, thumbnailUrl };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido optimizando preset.';
        console.error('[STYLE PRESET] optimizeStylePresetImage error:', message);
        return { success: false, error: message };
    }
}


