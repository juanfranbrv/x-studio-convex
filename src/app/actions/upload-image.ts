'use server';

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Utilizar Service Role Key para uploads seguros desde el servidor si está disponible, 
// o Anon Key si las políticas RLS lo permiten.
// Dado que es una action de servidor, lo ideal es usar credenciales con permisos.
// Por consistencia con analyze-brand-dna, usaremos la misma configuración implícita 
// o crearemos un cliente admin específico si es necesario.
// IMPORTANTE: En analyze-brand-dna.ts se usa 'supabase' importado de lib/supabase que usa anon key.
// Asumiremos que el bucket 'brand-assets' tiene políticas RLS correctas o públicas para escritura autenticada.
// Para asegurar escritura, usaremos service role key si existe en variables de entorno, sino fallback a anon.

// Usamos la anon key para uploads ya que el bucket 'brand-assets' tiene políticas públicas de INSERT/UPDATE.
// Esto evita el error con la SERVICE_ROLE_KEY si no está configurada correctamente en .env.local.
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

        const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

        const { error: uploadError } = await supabase.storage
            .from('brand-assets')
            .upload(fileName, optimizedBuffer, {
                contentType: 'image/webp',
                upsert: true,
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return { success: false, error: 'Error al subir la imagen a Supabase.' };
        }

        const { data: publicUrlData } = supabase.storage
            .from('brand-assets')
            .getPublicUrl(fileName);

        return { success: true, url: publicUrlData.publicUrl };

    } catch (error) {
        console.error('Error en uploadBrandImage:', error);
        return { success: false, error: 'Ocurrió un error inesperado al subir la imagen.' };
    }
}
