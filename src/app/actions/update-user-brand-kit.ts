'use server';

import { fetchMutation } from 'convex/nextjs';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { BrandDNA } from '@/lib/brand-types';
import { revalidatePath } from 'next/cache';

export async function updateUserBrandKit(brandKitId: string, brandData: BrandDNA) {
    try {
        console.log(`💾 Guardando Brand Kit ID: ${brandKitId}`);

        await fetchMutation(api.brands.updateBrandDNADoc, {
            id: brandKitId as Id<"brand_dna">,
            updates: {
                brand_name: brandData.brand_name,
                tagline: brandData.tagline,
                business_overview: brandData.business_overview,
                brand_values: brandData.brand_values,
                tone_of_voice: brandData.tone_of_voice,
                visual_aesthetic: brandData.visual_aesthetic,
                colors: brandData.colors,
                fonts: brandData.fonts,
                logo_url: brandData.logo_url,
                logos: brandData.logos,
                favicon_url: brandData.favicon_url,
                screenshot_url: brandData.screenshot_url,
                images: brandData.images,
                target_audience: brandData.target_audience,
                social_links: brandData.social_links,
                emails: brandData.emails,
                phones: brandData.phones,
                text_assets: brandData.text_assets,
                updated_at: new Date().toISOString(),
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/brand-kit');
        return { success: true };
    } catch (error: any) {
        console.error('Error inesperado al actualizar brand kit:', error);
        return { success: false, error: error.message || 'Error desconocido' };
    }
}
