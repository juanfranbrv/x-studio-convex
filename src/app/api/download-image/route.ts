import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { url } = (await request.json()) as { url?: string }
        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'Missing image url' }, { status: 400 })
        }

        const upstream = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'image/*,*/*;q=0.8',
            },
            redirect: 'follow',
        })

        if (!upstream.ok) {
            return NextResponse.json({ error: 'Unable to fetch image' }, { status: 502 })
        }

        const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
        if (!contentType.toLowerCase().startsWith('image/')) {
            return NextResponse.json({ error: 'Resource is not an image' }, { status: 415 })
        }

        const buffer = await upstream.arrayBuffer()
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store',
            },
        })
    } catch (error) {
        console.error('download-image route failed:', error)
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
    }
}

