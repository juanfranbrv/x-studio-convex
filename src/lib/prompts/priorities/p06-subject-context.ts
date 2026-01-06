/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - SUBJECT & CONTEXT (P6)
 * 
 * Visual context from reference images or AI-generated descriptions.
 * 
 * @priority 6
 * @section Subject & Visual Context
 */

export const PRIORITY_HEADER = `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 6 - SUBJECT & VISUAL CONTEXT                        ║
╚═════════════════════════════════════════════════════════════════╝`

export const AI_GENERATED_REFERENCE_HEADER = `AI-GENERATED REFERENCE:`

export const AI_GENERATED_REFERENCE_INSTRUCTION = (description: string) =>
    `Include in final composition: ${description}`
