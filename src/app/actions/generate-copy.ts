'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { BrandDNA } from '@/lib/brand-types'
import { VisionAnalysis, IntentCategory } from '@/lib/creation-flow-types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

export async function generateFieldCopy(params: {
    brandName: string
    brandDNA: BrandDNA
    intent: IntentCategory
    visionAnalysis?: VisionAnalysis | null
    fieldLabel: string
    fieldDescription?: string
    currentValue?: string
    rawMessage?: string
}) {
    const { brandName, brandDNA, intent, visionAnalysis, fieldLabel, fieldDescription, rawMessage } = params

    // DEBUG LOGGING
    console.log('--- generateFieldCopy call ---')
    console.log('Params:', { fieldLabel, rawMessage, intent })

    const systemPrompt = `ACTÚA COMO: Copywriter Senior para la marca "${brandName}".

=== CONTEXTO OBLIGATORIO (TIENES QUE HABLAR DE ESTO) ===
1. LO QUE SE VE EN LA IMAGEN (Vision Context):
${visionAnalysis ? `   - DESCRIPCIÓN: ${visionAnalysis.subjectLabel}
   - ESTILO: ${visionAnalysis.keywords.join(', ')}` : '   - (No hay imagen, céntrate solo en la marca)'}

2. QUÉ HACE LA MARCA (Brand Context):
   - Valores/ADN: ${brandDNA.brand_values?.join(', ') || 'Calidad y servicio'}
   - Tono: ${brandDNA.tone_of_voice?.join(', ') || 'Profesional'}
   - Público: ${brandDNA.target_audience || 'General'}

=== INPUT DEL USUARIO (LA ORDEN PRINCIPAL) ===
"${rawMessage || 'Genera un texto atractivo'}"
================================================

TU TAREA:
Escribir el contenido para el campo: "${fieldLabel}"
(${fieldDescription || 'Texto visible en la creatividad'})

REGLAS DE ORO PARA EL CONTENIDO:
1. RELEVANCIA TOTAL: El texto generado DEBE tener sentido con lo que se ve en la imagen y lo que hace la marca.
   - Si la imagen es una mesa de billar, NO hables de postres. Habla de juegos, diversión, relax, amigos.
   - Si la imagen es un paisaje nevado, habla de frío, acogedor, invierno.
   
2. INTERPRETA LA ORDEN DEL USUARIO:
   - Si dice "pregunta simpática", haz una pregunta simpática SOBRE EL CONTEXTO VISUAL/DE MARCA.
   - Ejemplo: Si ves una mesa de billar y te piden pregunta simpática -> "¿Quién es el rey de la carambola en tu grupo? 🎱"

3. ESTILO:
   - Cero clichés. Nada de "¿Qué opinas?".
   - Usa el tono de la marca.
   - Usa emojis si encaja.

DAME SOLO EL TEXTO FINAL.`

    console.log('Generated System Prompt:', systemPrompt)

    try {
        const result = await model.generateContent(systemPrompt)
        const text = result.response.text().trim().replace(/^["']|["']$/g, '') // Remove quotes if any
        console.log('AI Response:', text)
        return { success: true, text }
    } catch (error) {
        console.error('Error generating copy:', error)
        return { success: false, error: 'No se pudo generar el texto' }
    }
}
