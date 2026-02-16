import { fetchQuery } from 'convex/nextjs'
import { api } from '../../convex/_generated/api'
import { generateTextUnified } from './gemini'
import materialIcons from './icons/material-icons.json'

/**
 * Suggests a Google Material Symbol name based on a composition's title and prompt.
 */
export async function suggestCompositionIcon(
    title: string,
    promptInstruction: string = ''
): Promise<string | null> {
    try {
        // 1. Get the intelligence model from settings
        // Note: For now we default to a safe one if not found
        const modelIntelligence = await fetchQuery(api.admin.getSetting, { key: 'model_intelligence' }) as string || 'wisdom/gemini-2.5-flash'

        // 2. Prepare the icons list (just names and some tags to keep it manageable but relevant)
        // We'll take a sample or just describe the format to the AI
        // Actually, many popular icons are well known. But providing a list helps accuracy.
        // Let's summarize the icons file into a string of just names and categories if possible.
        const iconNames = materialIcons.slice(0, 1000).map(i => i.name).join(', ')

        const systemPrompt = `Eres un experto en diseño UX/UI y diseño iconográfico. 
Tu tarea es sugerir el nombre de un icono de "Google Material Symbols" que mejor represente una composición de diseño.

REGLAS:
- Responde ÚNICAMENTE con un objeto JSON: {"icon": "nombre_del_icono"}.
- El nombre del icono debe estar en snake_case (ej: "dashboard", "smart_display", "auto_awesome").
- Si no encuentras uno perfecto, elige el que más se aproxime semánticamente.

Contexto del catálogo (algunos ejemplos populares):
${iconNames}... y miles más del catálogo estándar de Material Symbols.`

        const userPrompt = `Sugiere un icono para la composición:
Titulo: "${title}"
Contexto Visual/Instrucción: "${promptInstruction}"`


        const response = await generateTextUnified(
            { name: 'System', brand_dna: {} as any },
            userPrompt,
            modelIntelligence,
            [],
            systemPrompt
        )

        let suggestedIcon = ''
        try {
            const parsed = JSON.parse(response)
            suggestedIcon = (parsed.icon || '').trim().replace(/['"`]/g, '').toLowerCase()
        } catch (e) {
            // Fallback to extraction if not valid JSON
            suggestedIcon = response.trim().replace(/['"`]/g, '').toLowerCase().split('\n')[0]
        }

        // Basic validation: check if it exists in our json
        const exists = materialIcons.some(i => i.name === suggestedIcon)

        if (exists) {
            return suggestedIcon
        }

        // If it doesn't exist but looks like a valid icon name, we might still return it 
        // as Google Material Symbols is vast and our json might be a subset
        return suggestedIcon
    } catch (error) {
        console.error('Error suggesting composition icon:', error)
        return null
    }
}
