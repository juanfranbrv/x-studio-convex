/**
 * Prompt Template for Image Editing
 * 
 * This prompt instructs the model to edit an existing image based on user instructions.
 * The current image should be passed as context along with this prompt.
 */

export const IMAGE_EDIT_PROMPT_TEMPLATE = `Modifica la imagen adjunta según estas instrucciones: {{editPrompt}}

REGLAS DE EDICIÓN:
- Mantén el estilo visual general de la imagen original
- Aplica los cambios solicitados de forma natural y coherente
- Preserva los elementos que no se mencionan en las instrucciones
- Mantén la calidad y resolución de la imagen original`

/**
 * Builds the full edit prompt with user instructions
 */
export function buildEditPrompt(editPrompt: string): string {
    return IMAGE_EDIT_PROMPT_TEMPLATE.replace('{{editPrompt}}', editPrompt)
}
