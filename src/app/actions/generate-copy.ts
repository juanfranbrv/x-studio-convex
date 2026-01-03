'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { BrandDNA } from '@/lib/brand-types'
import { VisionAnalysis, IntentCategory } from '@/lib/creation-flow-types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function generateFieldCopy(params: {
    brandName: string
    brandDNA: BrandDNA
    intent: IntentCategory
    visionAnalysis?: VisionAnalysis | null
    fieldLabel: string
    fieldDescription?: string
    currentValue?: string
}) {
    const { brandName, brandDNA, intent, visionAnalysis, fieldLabel, fieldDescription } = params

    const systemPrompt = `Eres un redactor creativo experto para la marca "${brandName}".
    
DATOS DE LA MARCA:
- Tono: ${brandDNA.tone_of_voice?.join(', ') || 'Profesional'}
- Público: ${brandDNA.target_audience || 'General'}

CONTEXTO VISUAL:
${visionAnalysis ? `- Sujeto Detectado: ${visionAnalysis.subjectLabel}\n- Estilo visual esperado: ${visionAnalysis.keywords.join(', ')}` : 'No hay imagen de referencia todavía.'}

OBJETIVO:
El usuario está creando una pieza para: "${intent}".
Necesitas generar el texto para el campo: "${fieldLabel}" (${fieldDescription || ''}).

REGLAS:
1. El texto debe ser breve, impactante y coherente con el tono de marca.
2. Si es una oferta, debe sonar urgente.
3. Responde ÚNICAMENTE con la sugerencia de texto, sin explicaciones ni comillas.
4. Responde en Español.`

    try {
        const result = await model.generateContent(systemPrompt)
        const text = result.response.text().trim()
        return { success: true, text }
    } catch (error) {
        console.error('Error generating copy:', error)
        return { success: false, error: 'No se pudo generar el texto' }
    }
}
