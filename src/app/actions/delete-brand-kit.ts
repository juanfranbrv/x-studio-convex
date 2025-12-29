'use server';

import { fetchMutation } from 'convex/nextjs';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

/**
 * Elimina un Brand Kit por su ID
 */
export async function deleteBrandKit(brandKitId: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        await fetchMutation(api.brands.deleteBrandDNA, { id: brandKitId as Id<"brand_dna"> });

        return { success: true };
    } catch (err) {
        console.error('Unexpected error in deleteBrandKit:', err);
        return { success: false, error: 'Error inesperado al eliminar el Brand Kit' };
    }
}
