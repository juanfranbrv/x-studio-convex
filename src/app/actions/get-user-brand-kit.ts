'use server';

import { fetchQuery } from 'convex/nextjs';
import { api } from '../../../convex/_generated/api';
import type { BrandDNA, BrandKitSummary } from '@/lib/brand-types';
import { auth } from '@clerk/nextjs/server';

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
        const { userId } = await auth();
        if (!userId || userId !== clerkUserId) {
            return { success: false, error: 'No autorizado' };
        }

        // CONVEX MIGRATION: fetchQuery
        const brands = await fetchQuery(api.brands.getBrandDNAByClerkId, { clerk_user_id: userId });

        // Client-side sort by updated_at desc since we can't easily index sort in Convex yet
        const sortedBrands = (brands || []).sort((a: any, b: any) => {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return dateB - dateA;
        });

        // Map to summary
        const summaryData: BrandKitSummary[] = sortedBrands.map((b: any) => ({
            id: b._id,
            brand_name: b.brand_name,
            url: b.url,
            logo_url: b.logo_url || null,
            favicon_url: b.favicon_url || null,
            screenshot_url: b.screenshot_url || null,
            updated_at: b.updated_at
        }));

        return { success: true, data: summaryData };
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
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'No autorizado' };
        }

        // Robust path: resolve from the current user's own list to avoid
        // stale/legacy IDs and keep strict user isolation.
        const ownBrands = await fetchQuery(api.brands.getBrandDNAByClerkId, { clerk_user_id: userId });
        const data = (ownBrands || []).find((b: any) => String(b._id) === String(brandKitId));

        if (!data) {
            return { success: false, error: 'Brand Kit no encontrado' };
        }

        const brandDNA: BrandDNA = {
            id: data._id,
            url: data.url || '',
            brand_name: data.brand_name || '',
            cta_url_enabled: typeof data.cta_url_enabled === 'boolean' ? data.cta_url_enabled : false,
            tagline: data.tagline || '',
            business_overview: data.business_overview || '',
            brand_values: data.brand_values || [],
            tone_of_voice: data.tone_of_voice || [],
            visual_aesthetic: data.visual_aesthetic || [],
            colors: data.colors || [],
            fonts: data.fonts || [],
            logo_url: data.logo_url || '',
            logos: normalizeImages(data.logos),
            favicon_url: data.favicon_url || '',
            screenshot_url: data.screenshot_url || '',
            images: normalizeImages(data.images),
            social_links: data.social_links || [],
            emails: data.emails || [],
            phones: data.phones || [],
            addresses: data.addresses || [],
            preferred_language: data.preferred_language || undefined,
            api_trace: data.api_trace || [],
            text_assets: data.text_assets || undefined,
            debug: data.debug || undefined,
            created_at: data.updated_at || new Date().toISOString(), // Using updated_at as created_at doesn't exist
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
        const { userId } = await auth();
        if (!userId || userId !== clerkUserId) {
            return { success: false, exists: false, error: 'No autorizado' };
        }

        const brands = await fetchQuery(api.brands.getBrandDNAByClerkId, { clerk_user_id: userId });

        if (!brands || brands.length === 0) {
            return { success: true, exists: false };
        }

        // Sort desc
        brands.sort((a: any, b: any) => {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return dateB - dateA;
        });

        const record = brands[0];

        const brandDNA: BrandDNA = {
            id: record._id,
            url: record.url || '',
            brand_name: record.brand_name || '',
            cta_url_enabled: typeof record.cta_url_enabled === 'boolean' ? record.cta_url_enabled : false,
            tagline: record.tagline || '',
            business_overview: record.business_overview || '',
            brand_values: record.brand_values || [],
            tone_of_voice: record.tone_of_voice || [],
            visual_aesthetic: record.visual_aesthetic || [],
            colors: record.colors || [],
            fonts: record.fonts || [],
            logo_url: record.logo_url || '',
            logos: normalizeImages(record.logos),
            favicon_url: record.favicon_url || '',
            screenshot_url: record.screenshot_url || '',
            images: normalizeImages(record.images),
            social_links: record.social_links || [],
            emails: record.emails || [],
            phones: record.phones || [],
            addresses: record.addresses || [],
            preferred_language: record.preferred_language || undefined,
            api_trace: record.api_trace || [],
            text_assets: record.text_assets || undefined,
            debug: record.debug || undefined,
            created_at: record.updated_at || new Date().toISOString(), // Using updated_at as created_at doesn't exist
        };

        return { success: true, data: brandDNA, exists: true };
    } catch (err) {
        console.error('Unexpected error in getUserBrandKit:', err);
        return { success: false, exists: false, error: 'Error inesperado' };
    }
}
