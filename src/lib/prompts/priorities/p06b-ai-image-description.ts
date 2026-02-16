/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - AI IMAGE DESCRIPTION (P6b)
 *
 * Adds the text-only image description provided by the user.
 *
 * @priority 6b
 * @section AI Image Description
 */

import { AI_IMAGE_DESCRIPTION_TEMPLATE, PRIORITY_HEADER } from './p06b-ai-image-description.prompt'

export const P06B = {
    PRIORITY_HEADER,
    AI_IMAGE_DESCRIPTION_INSTRUCTION: (description: string) =>
        AI_IMAGE_DESCRIPTION_TEMPLATE.replaceAll('{{description}}', description),
}
