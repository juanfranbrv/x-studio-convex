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

async function checkImageReachable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(20000),
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    if (!response.ok) return false
    const contentType = response.headers.get('content-type') || ''
    // Algunos proveedores devuelven octet-stream para imágenes.
    return (
      contentType.toLowerCase().includes('image/') ||
      contentType.toLowerCase().includes('application/octet-stream')
    )
  } catch {
    return false
  }
}

async function fetchApiFlashScreenshot(url: string): Promise<string | undefined> {
  try {
    const accessKey =
      process.env.APIFLASH_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_APIFLASH_ACCESS_KEY ||
      '08b58bcb02284979b902d15e07439bd3'
    if (!accessKey) return undefined
    const apiFlashUrl = new URL('https://api.apiflash.com/v1/urltoimage')
    apiFlashUrl.searchParams.set('access_key', accessKey)
    apiFlashUrl.searchParams.set('url', url)
    apiFlashUrl.searchParams.set('wait_until', 'network_idle')
    apiFlashUrl.searchParams.set('delay', '2')
    apiFlashUrl.searchParams.set('format', 'jpeg')
    apiFlashUrl.searchParams.set('quality', '80')
    apiFlashUrl.searchParams.set('width', '1280')
    apiFlashUrl.searchParams.set('no_cookie_banners', 'true')
    return apiFlashUrl.toString()
  } catch {
    return undefined
  }
}

async function fetchScreenshotLayerScreenshot(url: string): Promise<string | undefined> {
  try {
    const accessKey =
      process.env.SCREENSHOTLAYER_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_SCREENSHOTLAYER_ACCESS_KEY ||
      'bd4c1e98fec507c04b302f23d5e07dea'
    if (!accessKey) return undefined
    const screenshotLayerUrl = new URL('https://api.screenshotlayer.com/api/capture')
    screenshotLayerUrl.searchParams.set('access_key', accessKey)
    screenshotLayerUrl.searchParams.set('url', url)
    screenshotLayerUrl.searchParams.set('fullpage', '0')
    screenshotLayerUrl.searchParams.set('viewport', '1280x720')
    screenshotLayerUrl.searchParams.set('delay', '2')
    screenshotLayerUrl.searchParams.set('force', '1')
    return screenshotLayerUrl.toString()
  } catch {
    return undefined
  }
}

function buildThumIoScreenshot(url: string): string {
  // Fallback sin API key: evita placeholders de render "generating preview".
  return `https://image.thum.io/get/width/1280/noanimate/wait/4/${url}`
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

  // 1) Intentamos proveedores de screenshot directos (más estables para preview).
  const providerCandidates: string[] = []

  // Microlink primero para mantener paridad con el pipeline principal.
  const maxMicrolinkRetries = 3
  for (let attempt = 0; attempt < maxMicrolinkRetries; attempt++) {
    try {
      const microlinkUrl = new URL('https://api.microlink.io')
      microlinkUrl.searchParams.set('url', normalizedUrl)
      microlinkUrl.searchParams.set('screenshot', 'true')
      microlinkUrl.searchParams.set('meta', 'true')
      microlinkUrl.searchParams.set('screenshot.fullPage', 'false')
      microlinkUrl.searchParams.set('screenshot.waitFor', attempt === 0 ? '4000' : attempt === 1 ? '7000' : '10000')
      microlinkUrl.searchParams.set('ttl', '0')

      const microlinkResponse = await fetch(microlinkUrl.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(25000),
        cache: 'no-store',
      })
      if (!microlinkResponse.ok) continue
      const payload = await microlinkResponse.json()
      const data = payload?.data || {}
      const candidate = data?.screenshot?.url || data?.image?.url
      detectedTitle = data?.title || detectedTitle
      if (!candidate) continue
      const ok = await checkImageReachable(candidate)
      if (ok) {
        providerCandidates.push(candidate)
        break
      }
    } catch {
      // continue retry
    }
    if (attempt < maxMicrolinkRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 800))
    }
  }

  const apiFlashCandidate = await fetchApiFlashScreenshot(normalizedUrl)
  if (apiFlashCandidate) providerCandidates.push(apiFlashCandidate)
  const screenshotLayerCandidate = await fetchScreenshotLayerScreenshot(normalizedUrl)
  if (screenshotLayerCandidate) providerCandidates.push(screenshotLayerCandidate)
  providerCandidates.push(buildThumIoScreenshot(normalizedUrl))

  for (const candidate of providerCandidates) {
    const ok = await checkImageReachable(candidate)
    if (ok) {
      return {
        success: true,
        data: {
          url: normalizedUrl,
          title: detectedTitle,
          screenshotUrl: candidate,
        },
      }
    }
  }

  // 2) Fallback visual desde metadatos si no hubo captura válida.

  // Último fallback visual: og:image si no hay captura real.
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

