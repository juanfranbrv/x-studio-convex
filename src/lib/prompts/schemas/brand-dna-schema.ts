import { z } from 'zod';

export const BrandDNASchema = z.object({
    brand_name: z.string().describe('Nombre comercial de la marca'),
    tagline: z.string().describe('Un eslogan corto y potente en el idioma original de la web'),
    business_overview: z.string().describe('Descripción de 2-3 frases sobre qué hacen'),
    brand_values: z.array(z.string()).length(5).describe('Lista de 5 valores clave (ej: "Sostenibilidad", "Tradición")'),
    tone_of_voice: z.array(z.string()).length(3).describe('3 adjetivos que describan cómo hablan (ej: "Profesional", "Cercano")'),
    visual_aesthetic: z.array(z.string()).length(3).describe('3 adjetivos que describan su look (ej: "Rústico", "Minimalista")'),
    target_audience: z.array(z.string()).length(3).describe('3 perfiles de clientes ideales o segmentos de público a los que se dirige'),
    colors: z.array(z.string()).length(5).describe('Array de 5 códigos Hexadecimales de la lista proporcionada'),
    fonts: z.array(z.string()).length(2).describe('Dos fuentes de Google Fonts: una Serif/Display para títulos y una Sans para cuerpo'),
    text_assets: z.object({
        marketing_hooks: z.array(z.string()).length(5).describe('Titulares cortos para banners de publicidad (Hooks)'),
        visual_keywords: z.array(z.string()).length(5).describe('Palabras clave para generación de imágenes (Prompting)'),
        ctas: z.array(z.string()).length(3).describe('Llamadas a la acción (CTAs) potentes'),
        brand_context: z.string().describe('Contexto de negocio profundo para el generador de anuncios IA'),
    }).describe('Activos de texto extraídos del contenido'),
});
