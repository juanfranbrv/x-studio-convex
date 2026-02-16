'use server';

import sharp from 'sharp';
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export async function uploadBrandImage(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No se ha proporcionado ningún archivo.' };
        }

        // Validaciones básicas
        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'El archivo debe ser una imagen.' };
        }

        if (file.size > 3 * 1024 * 1024) { // 3MB limit
            return { success: false, error: 'La imagen no debe superar los 3MB.' };
        }

        const buffer = Buffer.from(await file.arrayBuffer());

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

        return { success: true, url };

    } catch (error: any) {
        console.error('Error en uploadBrandImage:', error);
        return { success: false, error: error.message || 'Ocurrió un error inesperado al subir la imagen.' };
    }
}
