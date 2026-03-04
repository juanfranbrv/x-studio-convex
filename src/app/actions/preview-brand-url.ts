'use server'

type PreviewBrandUrlSuccess = {
  success: true
  data: {
    url: string
    title?: string
    screenshotUrl?: string
  }
}

type PreviewBrandUrlError = {
  success: false
  error: string
}

export type PreviewBrandUrlResponse = PreviewBrandUrlSuccess | PreviewBrandUrlError

function normalizeUrl(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null
  if (value.toLowerCase().startsWith('manual-')) return null

  try {
    const withProtocol =
      value.startsWith('http://') || value.startsWith('https://')
        ? value
        : `https://${value}`
    return new URL(withProtocol).toString()
  } catch {
    return null
  }
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match?.[1]?.replace(/\s+/g, ' ').trim() || undefined
}

function extractOgImage(html: string, baseUrl: string): string | undefined {
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i)
  const raw = match?.[1]?.trim()
  if (!raw) return undefined
  try {
    return new URL(raw, baseUrl).toString()
  } catch {
    return undefined
  }
}

export async function previewBrandUrl(rawUrl: string): Promise<PreviewBrandUrlResponse> {
  const normalizedUrl = normalizeUrl(rawUrl)
  if (!normalizedUrl) {
    return { success: false, error: 'URL no válida.' }
  }

  const fallbackTitle = new URL(normalizedUrl).hostname.replace(/^www\./, '')
  let detectedTitle = fallbackTitle
  let ogImage: string | undefined
  let microlinkScreenshot: string | undefined

  try {
    const pageResponse = await fetch(normalizedUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(12000),
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (pageResponse.ok) {
      const html = await pageResponse.text()
      detectedTitle = extractTitle(html) || fallbackTitle
      ogImage = extractOgImage(html, normalizedUrl)
    }
  } catch {
    // Seguimos aunque falle la lectura del HTML.
  }

  const maxRetries = 3
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const microlinkUrl = new URL('https://api.microlink.io')
      microlinkUrl.searchParams.set('url', normalizedUrl)
      microlinkUrl.searchParams.set('screenshot', 'true')
      microlinkUrl.searchParams.set('meta', 'true')
      microlinkUrl.searchParams.set('screenshot.fullPage', 'false')
      microlinkUrl.searchParams.set('ttl', '0')

      const microlinkResponse = await fetch(microlinkUrl.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(20000),
        cache: 'no-store',
      })

      if (!microlinkResponse.ok) {
        continue
      }

      const payload = await microlinkResponse.json()
      const data = payload?.data || {}
      microlinkScreenshot = data?.screenshot?.url || data?.image?.url
      detectedTitle = data?.title || detectedTitle

      if (microlinkScreenshot) break
    } catch {
      // Reintentamos.
    }

    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 900))
    }
  }

  // No usamos mShots para evitar placeholders tipo "Generating Preview".
  const screenshotUrl = microlinkScreenshot || ogImage

  return {
    success: true,
    data: {
      url: normalizedUrl,
      title: detectedTitle,
      screenshotUrl,
    },
  }
}

