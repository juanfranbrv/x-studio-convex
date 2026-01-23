'use server'

import { generateVideoUnified, checkVideoOperationStatus, VideoGenerationOptions, VideoGenerationResult } from '@/lib/gemini'

export interface GenerateVideoActionInput {
    prompt: string
    negativePrompt?: string
    startFrame?: string
    endFrame?: string
    aspectRatio?: '16:9' | '9:16'
    resolution?: '720p' | '1080p'
    durationSeconds?: 4 | 6 | 8
}

export interface GenerateVideoActionResult {
    success: boolean
    videoUrl?: string
    operationName?: string
    error?: string
}

/**
 * Server Action to generate video using Veo 3.1
 */
export async function generateVideoAction(
    input: GenerateVideoActionInput
): Promise<GenerateVideoActionResult> {
    try {
        if (!input.prompt || input.prompt.trim().length === 0) {
            return { success: false, error: 'Prompt is required' }
        }

        const options: VideoGenerationOptions = {
            prompt: input.prompt,
            negativePrompt: input.negativePrompt,
            startFrame: input.startFrame,
            endFrame: input.endFrame,
            aspectRatio: input.aspectRatio || '16:9',
            resolution: input.resolution || '720p',
            durationSeconds: input.durationSeconds || 4,
        }

        const result = await generateVideoUnified(options)

        return {
            success: true,
            videoUrl: result.videoUrl,
            operationName: result.operationName
        }

    } catch (error) {
        console.error('Generate Video Action Error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

/**
 * Server Action to check video generation status
 */
export async function checkVideoStatusAction(
    operationName: string
): Promise<{
    done: boolean
    videoUrl?: string
    error?: string
    progress?: number
}> {
    return await checkVideoOperationStatus(operationName)
}
