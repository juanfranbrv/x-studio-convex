'use server';

import sharp from 'sharp';
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export async function uploadBrandImage(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No se ha proporcionado ningun archivo.' };
        }

        // Validaciones basicas
        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'El archivo debe ser una imagen.' };
        }

        if (file.size > 3 * 1024 * 1024) { // 3MB limit
            return { success: false, error: 'La imagen no debe superar los 3MB.' };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const shouldGenerateThumbnail = String(formData.get('generateThumbnail') || '').toLowerCase() === 'true'

        // Optimizar con Sharp (resize y convertir a webp)
        const optimizedBuffer = await sharp(buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();

        // Convert Buffer to Blob for fetch
        // Note: fetch in Node environment needs a standard Blob implementation.
        // Node 18+ has native Blob.
        const blob = new Blob([new Uint8Array(optimizedBuffer)], { type: 'image/webp' });

        // 1. Get Upload URL
        const uploadUrl = await fetchMutation(api.assets.generateUploadUrl, {});

        // 2. Upload File
        const result = await fetch(uploadUrl, {
            method: "POST",
            body: blob,
            headers: { "Content-Type": "image/webp" },
        });

        if (!result.ok) {
            throw new Error(`Upload failed: ${result.statusText}`);
        }

        const { storageId } = await result.json();

        // 3. Get signed URL for the image
        const url = await fetchQuery(api.assets.getImageUrl, { storageId });

        if (!url) {
            // Fallback if URL is null (shouldn't happen for valid storageId)
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
            method: "POST",
            body: new Blob([new Uint8Array(thumbnailBuffer)], { type: 'image/webp' }),
            headers: { "Content-Type": "image/webp" },
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
        const message = error instanceof Error ? error.message : 'Error inesperado al subir la imagen.'
        console.error('Error en uploadBrandImage:', error);
        return { success: false, error: message || 'Ocurrio un error inesperado al subir la imagen.' };
    }
}

