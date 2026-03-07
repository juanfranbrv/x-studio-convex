'use server';

import sharp from 'sharp';
import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { api } from '../../../convex/_generated/api';

const MAX_UPLOAD_SIZE_BYTES = 12 * 1024 * 1024; // 12MB
const DEFAULT_MAX_WIDTH = 1600;
const LOGO_MAX_WIDTH = 1800;

type OutputFormat = 'image/webp' | 'image/png' | 'image/jpeg';
type AssetKind = 'logo' | 'image' | 'style_preset' | 'generic';

function resolveAssetKind(formData: FormData): AssetKind {
    const value = String(formData.get('assetKind') || '').trim().toLowerCase();
    if (value === 'logo' || value === 'image' || value === 'style_preset') return value;
    return 'generic';
}

async function optimizeUploadedImage(
    buffer: Buffer,
    inputMimeType: string,
    kind: AssetKind
): Promise<{ optimizedBuffer: Buffer; outputMimeType: OutputFormat }> {
    const inputMime = inputMimeType.toLowerCase();
    const metadata = await sharp(buffer, { failOn: 'none' }).metadata();
    const hasAlpha = metadata.hasAlpha === true;
    const maxWidth = kind === 'logo' ? LOGO_MAX_WIDTH : DEFAULT_MAX_WIDTH;

    const pipeline = sharp(buffer, { failOn: 'none' })
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true });

    // Logos: optimizacion conservadora para no romper fidelidad.
    if (kind === 'logo') {
        if (inputMime.includes('png') || hasAlpha) {
            return {
                optimizedBuffer: await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer(),
                outputMimeType: 'image/png',
            };
        }
        if (inputMime.includes('webp')) {
            return {
                optimizedBuffer: await pipeline.webp({ quality: 88 }).toBuffer(),
                outputMimeType: 'image/webp',
            };
        }
        return {
            optimizedBuffer: await pipeline.jpeg({ quality: 88, mozjpeg: true }).toBuffer(),
            outputMimeType: 'image/jpeg',
        };
    }

    // Resto: priorizamos ahorro para ancho de banda/storage.
    return {
        optimizedBuffer: await pipeline.webp({ quality: hasAlpha ? 82 : 78 }).toBuffer(),
        outputMimeType: 'image/webp',
    };
}

export async function uploadBrandImage(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No se ha proporcionado ningun archivo.' };
        }

        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'El archivo debe ser una imagen.' };
        }

        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
            return { success: false, error: 'La imagen no debe superar los 12MB.' };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const assetKind = resolveAssetKind(formData);
        const shouldGenerateThumbnail = String(formData.get('generateThumbnail') || '').toLowerCase() === 'true';

        const { optimizedBuffer, outputMimeType } = await optimizeUploadedImage(buffer, file.type, assetKind);
        const blob = new Blob([new Uint8Array(optimizedBuffer)], { type: outputMimeType });

        const uploadUrl = await fetchMutation(api.assets.generateUploadUrl, {});

        const result = await fetch(uploadUrl, {
            method: 'POST',
            body: blob,
            headers: { 'Content-Type': outputMimeType },
        });

        if (!result.ok) {
            throw new Error(`Upload failed: ${result.statusText}`);
        }

        const { storageId } = await result.json();
        const url = await fetchQuery(api.assets.getImageUrl, { storageId });

        if (!url) {
            return { success: false, error: 'Error al obtener URL de la imagen.' };
        }

        if (!shouldGenerateThumbnail) {
            return { success: true, url };
        }

        const thumbnailBuffer = await sharp(buffer)
            .resize({ width: 320, withoutEnlargement: true })
            .webp({ quality: 66 })
            .toBuffer();

        const thumbnailUploadUrl = await fetchMutation(api.assets.generateUploadUrl, {});
        const thumbnailResult = await fetch(thumbnailUploadUrl, {
            method: 'POST',
            body: new Blob([new Uint8Array(thumbnailBuffer)], { type: 'image/webp' }),
            headers: { 'Content-Type': 'image/webp' },
        });

        if (!thumbnailResult.ok) {
            throw new Error(`Thumbnail upload failed: ${thumbnailResult.statusText}`);
        }

        const { storageId: thumbnailStorageId } = await thumbnailResult.json();
        const thumbnailUrl = await fetchQuery(api.assets.getImageUrl, { storageId: thumbnailStorageId });
        if (!thumbnailUrl) {
            throw new Error('Error al obtener URL de la miniatura.');
        }

        return { success: true, url, thumbnailUrl };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado al subir la imagen.';
        console.error('Error en uploadBrandImage:', error);
        return { success: false, error: message || 'Ocurrio un error inesperado al subir la imagen.' };
    }
}
