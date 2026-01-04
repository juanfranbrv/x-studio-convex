import fs from 'fs';
import path from 'path';

// Using provided API key directly
const API_KEY = "sk-8wg3THOhDtRTh7Rm6nkSX5kKvRRR9yFEEZGGWL1b6mpwcjua";
const URL = "https://wisdom-gate.juheapi.com/v1beta/models/gemini-3-pro-image-preview:generateContent";

if (!API_KEY) {
    console.error("❌ Error: API Key is missing.");
    process.exit(1);
}

async function testGenerateImage() {
    console.log("🚀 Starting Wisdom Gate API Test...");
    console.log(`Using API Key: ${API_KEY.substring(0, 8)}...`);

    const payload = {
        contents: [{
            parts: [{
                text: "A futuristic digital art studio with glowing neon lights, cyberpunk style, high detail."
            }]
        }],
        generationConfig: {
            responseModalities: ["IMAGE"],
            imageConfig: {
                aspectRatio: "16:9",
                imageSize: "1K"
            }
        }
    };

    try {
        console.log("📡 Sending request to:", URL);
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "x-goog-api-key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error: ${response.status} ${response.statusText}`);
            console.error("Response body:", errorText);
            return;
        }

        const data = await response.json();
        console.log("✅ Response received!");

        const candidate = data.candidates?.[0];
        if (candidate) {
            for (const part of candidate.content?.parts || []) {
                if (part.inlineData) {
                    const imageData = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || "image/png";
                    const extension = mimeType.split("/")[1] || "png";
                    const filename = `wisdom-test.${extension}`;

                    const buffer = Buffer.from(imageData, 'base64');
                    fs.writeFileSync(filename, buffer);
                    console.log(`🖼️ Image saved to: ${path.resolve(filename)}`);
                    return;
                }
            }
        }

        console.warn("⚠️ No inlineData matching image found in response candidates.");
        console.log("Full Response:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("❌ Unexpected Error:", error);
    }
}

testGenerateImage();
