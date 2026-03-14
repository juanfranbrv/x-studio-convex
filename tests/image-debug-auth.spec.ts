import { test, expect, chromium, type Browser, type Page } from '@playwright/test'

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'
const cdpUrl = process.env.PLAYWRIGHT_CDP_URL || 'http://127.0.0.1:9222'

async function openDebugPage(route: string): Promise<{ browser: Browser; page: Page }> {
  const browser = await chromium.connectOverCDP(cdpUrl)
  const [context] = browser.contexts()

  if (!context) {
    await browser.close()
    throw new Error(`No se encontro un contexto compartido en ${cdpUrl}.`)
  }

  const page =
    context.pages().find((candidate) => candidate.url().startsWith(baseUrl)) ||
    (await context.newPage())

  await page.goto(new URL(route, `${baseUrl}/`).toString(), { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle').catch(() => {})

  if (page.url().includes('/sign-in')) {
    await browser.close()
    throw new Error('La sesion del navegador debug no esta autenticada para esta ruta.')
  }

  return { browser, page }
}

test.describe.configure({ mode: 'serial' })

test('image carga autenticado en el navegador debug compartido', async () => {
  const { browser, page } = await openDebugPage('/image')

  try {
    await expect(page.locator('body')).toContainText(/historial/i)
    await expect(page.getByRole('button', { name: /^analizar$/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /^generar imagen$/i })).toBeVisible()
    await expect(page.locator('text=Continuar con Google')).toHaveCount(0)
  } finally {
    await browser.close()
  }
})

test('image lanza una generacion real desde el navegador debug', async () => {
  test.skip(!process.env.RUN_REAL_IMAGE_GENERATION, 'Activa RUN_REAL_IMAGE_GENERATION=1 para lanzar una generacion real.')
  test.setTimeout(240_000)

  const { browser, page } = await openDebugPage('/image')

  try {
    await page.getByRole('button', { name: /^analizar$/i }).click()

    await expect
      .poll(
        async () => {
          const bodyText = await page.locator('body').innerText()
          return bodyText.includes('ANALIZANDO') || bodyText.includes('DETENER')
        },
        { timeout: 45_000, intervals: [1_000, 2_000, 3_000] }
      )
      .toBeFalsy()

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/generate') && response.request().method() === 'POST',
      { timeout: 180_000 }
    )

    await page.getByRole('button', { name: /^generar imagen$/i }).click()
    const response = await responsePromise
    const body = await response.text()

    expect(body.length).toBeGreaterThan(0)

    if (response.ok()) {
      await expect(page.getByRole('button', { name: /descargar imagen/i })).toBeVisible({ timeout: 20_000 })
      return
    }

    expect([429, 500, 503, 504]).toContain(response.status())
    expect(body.toLowerCase()).toMatch(/error|timeout|saturado|imagen|provider_timeout/)
  } finally {
    await browser.close()
  }
})
