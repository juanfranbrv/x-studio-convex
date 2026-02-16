import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
let apiKey = ''
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    const match = content.match(/WISDOM_API_KEY=(.+)/)
    if (match) apiKey = match[1].trim()
}

const BASE_URL = 'https://wisdom-gate.juheapi.com'
const MODEL = 'qwen-image'

async function run() {
    if (!apiKey) { console.error('No API Key'); return }
    console.log(`\n🧪 Testing [${MODEL}] via Google Native Endpoint...`)

    const url = `${BASE_URL}/v1beta/models/${MODEL}:generateContent`
    const body = {
        contents: [{
            parts: [{ text: "A futuristic city" }]
        }],
        generationConfig: {
            responseModalities: ["IMAGE"],
            imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1024x1024" // or just '1024x1024' or leave logic to Wisdom
            }
        }
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-goog-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const text = await response.text()
        console.log(`Status: ${response.status}`)
        if (response.ok) {
            console.log(`✅ SUCCESS!`)
            // Don't log full base64
            console.log(`Data (first 100 chars): ${text.substring(0, 100)}...`)
        } else {
            console.log(`❌ FAILED: ${text.substring(0, 300)}`)
        }
    } catch (e) {
        console.error(`Exception:`, e)
    }
}

run()
