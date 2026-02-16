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
// Models to test
const MODELS = ['seedream-4.0', 'qwen-image']

async function testEndpoint(model: string, name: string, url: string, body: any, results: any[]) {
    console.log(`\n🧪 Testing [${model}] via ${name}...`)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const text = await response.text()
        console.log(`Status: ${response.status}`)

        let json = null
        try { json = JSON.parse(text) } catch (e) { }

        results.push({
            model,
            endpoint: name,
            status: response.status,
            bodySent: body,
            responseRaw: text,
            responseJson: json,
            success: response.ok
        })

    } catch (e: any) {
        console.error(`Exception:`, e)
        results.push({
            model,
            endpoint: name,
            error: e.message || String(e)
        })
    }
}

async function run() {
    if (!apiKey) { console.error('No API Key'); return }
    console.log('Starting Diagnostic Tests (Robust)...')
    const results: any[] = []

    for (const model of MODELS) {
        if (model === 'qwen-image') {
            // TEST 4: OpenAI Chat (Stream)
            await testEndpoint(model, 'v1/chat/completions (stream)', `${BASE_URL}/v1/chat/completions`, {
                model: model,
                messages: [{ role: 'user', content: 'Generate an image of a futuristic city' }],
                stream: true
            }, results)
        }

        // TEST 1: OpenAI Image (Standard - URL)
        await testEndpoint(model, 'v1/images/generations (url)', `${BASE_URL}/v1/images/generations`, {
            model: model,
            prompt: 'A futuristic city',
            n: 1,
            size: '1024x1024'
        }, results)

        // TEST 2: OpenAI Chat (Draw prompt)
        await testEndpoint(model, 'v1/chat/completions (draw)', `${BASE_URL}/v1/chat/completions`, {
            model: model,
            messages: [{ role: 'user', content: 'Draw a futuristic city' }],
            stream: false
        }, results)

        // TEST 3: OpenAI Chat (Generate prompt)
        await testEndpoint(model, 'v1/chat/completions (generate)', `${BASE_URL}/v1/chat/completions`, {
            model: model,
            messages: [{ role: 'user', content: 'Generate an image of a futuristic city' }],
            stream: false
        }, results)
    }

    fs.writeFileSync('test_results_2.json', JSON.stringify(results, null, 2), 'utf-8')
    console.log('📝 Wrote results to test_results_2.json')
}

run()
