import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if system presets already exist
        const existing = await ctx.db
            .query("presets")
            .withIndex("by_system", (q) => q.eq("isSystem", true))
            .collect();

        if (existing.length > 0) {
            console.log("System presets already exist. Skipping seed.");
            return;
        }

        const presets = [
            {
                name: "Promo Flash Instagram",
                description: "Ideal para ofertas limitadas en Stories",
                isSystem: true,
                icon: "Zap", // Lucide icon name
                state: {
                    platform: "instagram",
                    format: "story",
                    intent: "sales",
                    layout: "impact-offer",
                    styles: ["bold", "modern", "high-contrast"],
                    customTexts: {
                        title: "OFERTA FLASH",
                        highlight: "50% OFF",
                        cta: "Compra Ahora",
                    },
                },
                usageCount: 0,
                created_at: new Date().toISOString(),
            },
            {
                name: "Cita Inspiradora",
                description: "Frase minimalista para feed",
                isSystem: true,
                icon: "Quote",
                state: {
                    platform: "instagram",
                    format: "post",
                    intent: "quote",
                    layout: "minimal-quote",
                    styles: ["minimalist", "elegant", "serif"],
                    customTexts: {
                        quote: "El único modo de hacer un gran trabajo es amar lo que haces.",
                        author: "Steve Jobs"
                    },
                },
                usageCount: 0,
                created_at: new Date().toISOString(),
            },
            {
                name: "Anuncio Corporativo",
                description: "Noticia formal para LinkedIn",
                isSystem: true,
                icon: "Briefcase",
                state: {
                    platform: "linkedin",
                    format: "post",
                    intent: "announcement",
                    layout: "corporate-news",
                    styles: ["professional", "clean", "blue-tones"],
                    customTexts: {
                        title: "Nueva Alianza Estratégica",
                        subtitle: "Expandiendo horizontes en 2024",
                        body: "Estamos emocionados de anunciar nuestra colaboración..."
                    },
                },
                usageCount: 0,
                created_at: new Date().toISOString(),
            },
            {
                name: "Meme Viral",
                description: "Contenido de humor para Twitter/X",
                isSystem: true,
                icon: "Smile",
                state: {
                    platform: "twitter",
                    format: "post",
                    intent: "meme",
                    layout: "classic-meme",
                    styles: ["playful", "bold-text"],
                    customTexts: {
                        topText: "CUANDO EL CÓDIGO COMPILA",
                        bottomText: "A LA PRIMERA",
                    },
                },
                usageCount: 0,
                created_at: new Date().toISOString(),
            },
        ];

        for (const preset of presets) {
            await ctx.db.insert("presets", preset);
        }

        console.log(`Seeded ${presets.length} system presets.`);
    },
});
