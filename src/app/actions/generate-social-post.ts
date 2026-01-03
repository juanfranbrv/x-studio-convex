'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { BrandDNA } from '@/lib/brand-types'
import { flashModel } from '@/lib/gemini'

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function generateSocialPost(params: {
    brand: BrandDNA
    imageBase64?: string
    topic?: string
}) {
    const { brand, imageBase64, topic } = params

    console.log('--- generateSocialPost call ---')
    console.log('Brand:', brand.brand_name)
    console.log('Start generation...')

    try {
        const parts: any[] = []

        // 1. System/Context Prompt
        const prompt = `ACTÚA COMO: Social Media Manager experto para la marca "${brand.brand_name}".

CONTEXTO DE MARCA:
- Valores: ${brand.brand_values?.join(', ') || 'No definidos'}
- Tono de voz: ${brand.tone_of_voice?.join(', ') || 'Profesional'}
- Público objetivo: ${brand.target_audience || 'General'}

${topic ? `TEMA/INTENCIÓN DEL POST: "${topic}"` : ''}

TU TAREA:
Analiza la imagen proporcionada (si la hay) y escribe un post para redes sociales (Instagram/LinkedIn/Twitter) que sea perfecto para esta marca.

REQUISITOS DEL OUTPUT (Formato JSON estricto):
Debes devolver UNICAMENTE un objeto JSON con esta estructura:
{
  "copy": "El texto del post aquí, usando emojis si encaja con el tono.",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}

REGLAS DE COPYWRITING:
1. Conecta visualmente: Menciona o alude a lo que se ve en la imagen.
2. Mantén el tono: Si es "Divertido", sé chistoso. Si es "Serio", sé formal.
3. Longitud: Entre 150 y 300 caracteres (conciso pero impactante).
4. Llamada a la acción (CTA): Incluye una pregunta o invitación sutil al final.
`
        parts.push({ text: prompt })

        // 2. Add Image if available
        if (imageBase64) {
            // Remove data:image/xxx;base64, prefix if present for the API, 
            // but usually the API expects inlineData
            const base64Data = imageBase64.split(',')[1] || imageBase64
            parts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/png' // Assuming PNG for now, or detect from string
                }
            })
        }

        // 3. Generate
        const result = await flashModel.generateContent({
            contents: [{ role: 'user', parts }],
            generationConfig: { responseMimeType: "application/json" }
        })

        const text = result.response.text()
        console.log('AI Response:', text)

        try {
            const json = JSON.parse(text)
            return {
                success: true,
                data: {
                    copy: json.copy || text,
                    hashtags: json.hashtags || []
                }
            }
        } catch (e) {
            console.error('Failed to parse parsable JSON', e)
            return { success: false, error: 'Formato de respuesta inválido' }
        }

    } catch (error) {
        console.error('Error generating social post:', error)
        return { success: false, error: 'Error al generar el post' }
    }
}
