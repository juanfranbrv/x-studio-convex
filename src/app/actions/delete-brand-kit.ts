'use server';

import { supabase } from '@/lib/supabase';

/**
 * Elimina un Brand Kit por su ID
 */
export async function deleteBrandKit(brandKitId: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const { error } = await supabase
            .from('brand_dna')
            .delete()
            .eq('id', brandKitId);

        if (error) {
            console.error('Error deleting brand kit:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Unexpected error in deleteBrandKit:', err);
        return { success: false, error: 'Error inesperado al eliminar el Brand Kit' };
    }
}
