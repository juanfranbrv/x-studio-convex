
const fs = require('fs');

const API_KEY = 'sk-8wg3THOhDtRTh7Rm6nkSX5kKvRRR9yFEEZGGWL1b6mpwcjua';
const BASE_URL = 'https://wisdom-gate.juheapi.com/v1';

async function testModel(model) {
    console.log(`\n--- Testing Model: ${model} ---`);
    console.log(`Requesting URL format with simple prompt...`);

    try {
        const response = await fetch(`${BASE_URL}/images/generations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                prompt: "A cute robot extracting wisdom form a gate, futuristic, 3d render",
                n: 1,
                size: "1024x1024",
                response_format: 'url'
            })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`Raw Response Body:`);
        console.log(text);

        if (!response.ok && text.includes("convert_request_failed")) {
            console.log("\n!!! Received 'convert_request_failed'. Retrying WITHOUT 'size' parameter...");
            const retryResponse = await fetch(`${BASE_URL}/images/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: model,
                    prompt: "A cute robot extracting wisdom form a gate, futuristic, 3d render",
                    n: 1,
                    // size removed
                    response_format: 'url'
                })
            });
            console.log(`Retry Status: ${retryResponse.status} ${retryResponse.statusText}`);
            console.log(`Retry Raw Response Body:`);
            console.log(await retryResponse.text());
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

async function run() {
    // await testModel('gemini-3-pro-image-preview'); 
    // await testModel('qwen-image');
    await testModel('seedream-4.0');
}

run();
