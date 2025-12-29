import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize Google AI provider with the API key
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Export the Gemini model to use for brand DNA analysis
export const model = google('gemini-flash-latest');
