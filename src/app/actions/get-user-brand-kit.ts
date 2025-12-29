'use server';

import { supabase } from '@/lib/supabase';
import type { BrandDNA, BrandKitSummary } from '@/lib/brand-types';

/**
 * Normaliza el array de imágenes para asegurar que siempre sea un array de objetos con url y selected.
 */
function normalizeImages(images: any[]): { url: string; selected?: boolean }[] {
    if (!images) return [];

    const extractUrl = (item: any): { url: string; selected: boolean } => {
        if (!item) return { url: '', selected: true };

        // If it's a string, try to parse it (it might be double-stringified JSON)
        if (typeof item === 'string') {
            if (item.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(item);
                    return extractUrl(parsed);
                } catch (e) {
                    return { url: item, selected: true };
                }
            }
            return { url: item, selected: true };
        }

        // If it's an object
        if (typeof item === 'object') {
            // Recursively extract URL from the 'url' property in case it's also stringified JSON
            const nested = extractUrl(item.url);
            return {
                url: nested.url,
                selected: item.selected !== undefined ? !!item.selected : nested.selected
            };
        }

        return { url: String(item), selected: true };
    };

    return images.map(img => extractUrl(img));
}

/**
 * Obtiene TODOS los Brand Kits de un usuario (resumidos para el switcher)
 */
export async function getAllUserBrandKits(clerkUserId: string): Promise<{
    success: boolean;
    data?: BrandKitSummary[];
    error?: string;
}> {
    try {
        const { data, error } = await supabase
            .from('brand_dna')
            .select('id, brand_name, url, logo_url, favicon_url, screenshot_url, updated_at')
            .eq('clerk_user_id', clerkUserId)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching user brand kits:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (err) {
        console.error('Unexpected error in getAllUserBrandKits:', err);
        return { success: false, error: 'Error inesperado' };
    }
}

/**
 * Obtiene un Brand Kit específico por su ID
 */
export async function getUserBrandKitById(brandKitId: string): Promise<{
    success: boolean;
    data?: BrandDNA;
    error?: string;
}> {
    try {
        const { data, error } = await supabase
            .from('brand_dna')
            .select('*')
            .eq('id', brandKitId)
            .single();

        if (error) {
            console.error('Error fetching brand kit by ID:', error);
            return { success: false, error: error.message };
        }

        if (!data) {
            return { success: false, error: 'Brand Kit no encontrado' };
        }

        const brandDNA: BrandDNA = {
            id: data.id,
            url: data.url || '',
            brand_name: data.brand_name || '',
            tagline: data.tagline || '',
            business_overview: data.business_overview || '',
            brand_values: data.brand_values || [],
            tone_of_voice: data.tone_of_voice || [],
            visual_aesthetic: data.brand_aesthetic || [],
            colors: data.colors || [],
            fonts: data.fonts || [],
            logo_url: data.logo_url || '',
            logos: normalizeImages(data.logos),
            favicon_url: data.favicon_url || '',
            screenshot_url: data.screenshot_url || '',
            images: normalizeImages(data.images),
            text_assets: data.text_assets || undefined,
            debug: data.debug || undefined,
            created_at: data.created_at,
        };

        return { success: true, data: brandDNA };
    } catch (err) {
        console.error('Unexpected error in getUserBrandKitById:', err);
        return { success: false, error: 'Error inesperado' };
    }
}

/**
 * Obtiene el Brand Kit más reciente del usuario (mantiene compatibilidad)
 */
export async function getUserBrandKit(clerkUserId: string): Promise<{
    success: boolean;
    data?: BrandDNA;
    exists: boolean;
    error?: string;
}> {
    try {
        const { data, error } = await supabase
            .from('brand_dna')
            .select('*')
            .eq('clerk_user_id', clerkUserId)
            .order('updated_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching user brand kit:', error);
            return { success: false, exists: false, error: error.message };
        }

        if (!data || data.length === 0) {
            return { success: true, exists: false };
        }

        const record = data[0];

        const brandDNA: BrandDNA = {
            id: record.id,
            url: record.url || '',
            brand_name: record.brand_name || '',
            tagline: record.tagline || '',
            business_overview: record.business_overview || '',
            brand_values: record.brand_values || [],
            tone_of_voice: record.tone_of_voice || [],
            visual_aesthetic: record.brand_aesthetic || [],
            colors: record.colors || [],
            fonts: record.fonts || [],
            logo_url: record.logo_url || '',
            logos: normalizeImages(record.logos),
            favicon_url: record.favicon_url || '',
            screenshot_url: record.screenshot_url || '',
            images: normalizeImages(record.images),
            text_assets: record.text_assets || undefined,
            debug: record.debug || undefined,
            created_at: record.created_at,
        };

        return { success: true, data: brandDNA, exists: true };
    } catch (err) {
        console.error('Unexpected error in getUserBrandKit:', err);
        return { success: false, exists: false, error: 'Error inesperado' };
    }
}
