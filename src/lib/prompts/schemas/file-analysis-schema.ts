import { z } from 'zod';

export const FileAnalysisSchema = z.object({
    brand_name: z.string().describe('Nombre comercial de la marca'),
    tagline: z.string().describe('Eslogan corto y potente'),
    business_overview: z.string().describe('Descripción breve del negocio'),
    brand_values: z.array(z.string()).describe('Valores clave de la marca'),
    tone_of_voice: z.array(z.string()).describe('Adjetivos que describan la comunicación'),
    visual_aesthetic: z.array(z.string()).describe('Estilos estéticos/artísticos'),
    target_audience: z.array(z.string()).describe('Público objetivo'),
    preferred_language: z.string().optional().describe('Idioma detectado (ej: "es", "en")'),

    // Datos de contacto
    emails: z.array(z.string().email()).optional().describe('Emails de contacto'),
    phones: z.array(z.string()).optional().describe('Teléfonos de contacto'),
    addresses: z.array(z.string()).optional().describe('Direcciones físicas'),
    social_links: z.array(z.object({
        platform: z.string().describe('Nombre de la plataforma (ej: "Instagram")'),
        url: z.string().url().describe('URL completa del perfil')
    })).optional().describe('Redes sociales detectadas'),

    text_assets: z.object({
        marketing_hooks: z.array(z.string()).describe('Titulares de marketing (Hooks)'),
        ctas: z.array(z.string()).describe('Llamadas a la acción (CTAs)'),
        brand_context: z.string().describe('Contexto operativo y técnico denso del negocio'),
    }),
});
