import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
let apiKey = ''

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    const match = content.match(/WISDOM_API_KEY=(.+)/)
    if (match) {
        apiKey = match[1].trim()
    }
}

const WISDOM_BASE_URL = 'https://wisdom-gate.juheapi.com'

async function listModels() {
    if (!apiKey) {
        console.error('❌ WISDOM_API_KEY not found in .env.local')
        return
    }

    console.log(`🔍 Fetching models from ${WISDOM_BASE_URL}/v1/models...`)

    // Test both endpoints just in case
    const endpoints = [
        `${WISDOM_BASE_URL}/v1/models`,
        // `${WISDOM_BASE_URL}/v1/images/models` // speculative
    ]

    for (const url of endpoints) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                console.error(`Error fetching ${url}: ${response.status} ${response.statusText}`)
                console.error(await response.text())
                continue
            }

            const data = await response.json()
            console.log(`✅ Success from ${url}`)

            // Write to file directly to avoid encoding issues
            fs.writeFileSync('models_list.json', JSON.stringify(data, null, 2), 'utf-8')
            console.log('📝 Wrote models to models_list.json')

            const relevantModels = data.data?.filter((m: any) =>
                m.id.toLowerCase().includes('qwen') ||
                m.id.toLowerCase().includes('wanx') ||
                m.id.toLowerCase().includes('kolor') ||
                m.id.toLowerCase().includes('image')
            )

            console.log('--- RELEVANT MODELS ---')
            if (relevantModels) {
                relevantModels.forEach((m: any) => console.log(`- ${m.id} (${m.owned_by || 'unknown'})`))
            } else {
                console.log('No relevant models found.')
            }

            console.log('--- ALL MODELS (First 10) ---')
            data.data?.slice(0, 10).forEach((m: any) => console.log(m.id))

        } catch (error) {
            console.error(`❌ Failed to fetch from ${url}:`, error)
        }
    }
}

listModels()
