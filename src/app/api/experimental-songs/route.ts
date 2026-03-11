import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

const SONGS_DIR = path.join(process.cwd(), 'songs')
const ALLOWED_EXTENSIONS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg'])

function getMimeType(extension: string) {
    switch (extension) {
        case '.mp3':
            return 'audio/mpeg'
        case '.wav':
            return 'audio/wav'
        case '.m4a':
            return 'audio/mp4'
        case '.aac':
            return 'audio/aac'
        case '.ogg':
            return 'audio/ogg'
        default:
            return 'application/octet-stream'
    }
}

function formatSongLabel(fileName: string) {
    return fileName
        .replace(path.extname(fileName), '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export async function GET(request: NextRequest) {
    const requestedName = request.nextUrl.searchParams.get('name')

    try {
        const availableFiles = (await fs.readdir(SONGS_DIR))
            .filter((file) => ALLOWED_EXTENSIONS.has(path.extname(file).toLowerCase()))
            .sort((a, b) => a.localeCompare(b))

        if (!requestedName) {
            return NextResponse.json({
                songs: availableFiles.map((fileName) => ({
                    name: fileName,
                    label: formatSongLabel(fileName),
                    url: `/api/experimental-songs?name=${encodeURIComponent(fileName)}`
                }))
            })
        }

        const safeName = path.basename(requestedName)
        if (!availableFiles.includes(safeName)) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 })
        }

        const filePath = path.join(SONGS_DIR, safeName)
        const extension = path.extname(safeName).toLowerCase()
        const fileBuffer = await fs.readFile(filePath)

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': getMimeType(extension),
                'Cache-Control': 'no-store, max-age=0',
                'Content-Disposition': `inline; filename="${safeName}"`,
            }
        })
    } catch (error) {
        console.error('experimental songs route failed:', error)
        return NextResponse.json({ error: 'Unable to read songs' }, { status: 500 })
    }
}
