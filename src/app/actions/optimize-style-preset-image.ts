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
): Promise<{ success: boolean; url?: string; error?: string }> {
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

        await fetchMutation(api.stylePresets.update, {
            admin_email: adminEmail,
            id: presetId as Id<'style_presets'>,
            image_url: finalUrl,
        });

        return { success: true, url: finalUrl };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido optimizando preset.';
        console.error('[STYLE PRESET] optimizeStylePresetImage error:', message);
        return { success: false, error: message };
    }
}


