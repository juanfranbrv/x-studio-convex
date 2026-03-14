import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const browserUrl = process.env.PLAYWRIGHT_CDP_URL || 'http://127.0.0.1:9222';
const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const outputPath = path.resolve(process.cwd(), 'playwright', '.auth', 'user.json');

async function findOrCreateAppPage(context) {
  const normalizedBaseUrl = new URL(baseUrl).origin;
  const existingPage = context.pages().find((page) => {
    try {
      return new URL(page.url()).origin === normalizedBaseUrl;
    } catch {
      return false;
    }
  });

  if (existingPage) {
    await existingPage.bringToFront();
    return existingPage;
  }

  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  return page;
}

async function main() {
  const browser = await chromium.connectOverCDP(browserUrl);

  try {
    const [context] = browser.contexts();

    if (!context) {
      throw new Error('No se encontro ningun contexto en el navegador debug.');
    }

    const page = await findOrCreateAppPage(context);
    await page.waitForLoadState('networkidle').catch(() => {});

    const localStorageEntries = await page.evaluate(() =>
      Object.entries(localStorage).map(([name, value]) => ({ name, value }))
    );
    const storageState = await context.storageState();
    const pageOrigin = new URL(page.url()).origin;
    const nextOrigins = storageState.origins.filter((origin) => origin.origin !== pageOrigin);
    nextOrigins.push({
      origin: pageOrigin,
      localStorage: localStorageEntries,
    });

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(
      outputPath,
      JSON.stringify(
        {
          ...storageState,
          origins: nextOrigins,
        },
        null,
        2
      ),
      'utf8'
    );

    console.log(`[FLOW][SUCCESS] Storage state guardado en ${outputPath}`);
    console.log(`[FLOW][INFO] URL base usada: ${baseUrl}`);
    console.log(`[FLOW][INFO] Pagina capturada: ${page.url()}`);
    console.log(`[FLOW][INFO] LocalStorage capturado: ${localStorageEntries.length} claves`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('[FLOW][ERROR] No se pudo guardar el storage state para Playwright.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
