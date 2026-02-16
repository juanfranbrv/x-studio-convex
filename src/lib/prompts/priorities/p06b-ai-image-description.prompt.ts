/**
 * P06b - AI image description prompt templates.
 * Keep this file free of logic so prompts can be reviewed/edited easily.
 */

export const PRIORITY_HEADER = `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 6B - AI IMAGE DESCRIPTION                             ║
╚═════════════════════════════════════════════════════════════════╝`

export const AI_IMAGE_DESCRIPTION_TEMPLATE = `AI IMAGE DESCRIPTION (TEXT-ONLY REFERENCE): {{description}}
THIS IS THE PRIMARY SOURCE OF TRUTH for the scene, subject, composition, and overall visual concept. You MUST honor it.
If there is any conflict about the scene/subject/composition between this description and other inputs, FOLLOW THIS DESCRIPTION.
Only mandatory text, logo integrity, and brand colors may constrain styling — but do NOT dilute or ignore the core visual idea here.
Translate it into concrete visual decisions (subject, scene, mood, composition, lighting, and style) and make it the dominant visual basis.`
