
const fs = require('fs');
const path = require('path');
const https = require('https');

// Hardcoded API key from successful test run setup
const API_KEY = "sk-8wg3THOhDtRTh7Rm6nkSX5kKvRRR9yFEEZGGWL1b6mpwcjua";
const BASE_URL = 'https://wisdom-gate.juheapi.com';
const MODEL = 'gemini-2.5-flash';

if (!API_KEY) {
    console.error("❌ Error: No API Key found.");
    process.exit(1);
}

async function testGenerateText() {
    console.log(`Testing Wisdom Gate Text Generation with model: ${MODEL}`);
    console.log(`Using API Key ending in: ...${API_KEY.slice(-5)}`);

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: "Hello, explain how AI works in 2 sentences."
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7
        }
    };

    const url = `${BASE_URL}/v1beta/models/${MODEL}:generateContent`;

    try {
        console.log(`Fetching from: ${url}`);

        if (typeof fetch === 'undefined') {
            throw new Error("fetch global not found");
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`❌ HTTP Error ${response.status}: ${text}`);
            process.exit(1);
        }

        const data = await response.json();
        console.log("✅ Success! Response:");
        console.log(JSON.stringify(data, null, 2));

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
            console.log("\nExtracted Text:");
            console.log(text);
        } else {
            console.error("❌ Failed to extract text from response.");
        }

    } catch (err) {
        console.error("❌ Unexpected Error:", err);
        process.exit(1);
    }
}

testGenerateText();
