import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

function readEnvValue(filePath, key) {
  if (!fs.existsSync(filePath)) return '';
  const content = fs.readFileSync(filePath, 'utf8');
  const line = content
    .split(/\r?\n/)
    .find((row) => row.trim().startsWith(`${key}=`));
  if (!line) return '';
  return line.split('=').slice(1).join('=').trim();
}

function resolveEnv(key, fallback = '') {
  if (process.env[key]) return String(process.env[key]).trim();
  const local = readEnvValue(path.resolve(process.cwd(), '.env.local'), key);
  if (local) return local;
  return fallback;
}

function parseDataUrl(value) {
  const match = value.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Data URL no valida');
  }
  const base64 = match[2] || '';
  return Buffer.from(base64, 'base64');
}

async function loadSourceBuffer(imageUrl) {
  const clean = String(imageUrl || '').trim();
  if (!clean) throw new Error('image_url vacio');

  if (clean.startsWith('data:')) {
    return parseDataUrl(clean);
  }

  const response = await fetch(clean);
  if (!response.ok) {
    throw new Error(`No se pudo descargar imagen (${response.status})`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function optimizeToWebpBuffer(inputBuffer) {
  return await sharp(inputBuffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

async function uploadWebpAndGetUrl(convex, optimizedBuffer) {
  const uploadUrl = await convex.mutation(api.assets.generateUploadUrl, {});
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'image/webp' },
    body: new Blob([new Uint8Array(optimizedBuffer)], { type: 'image/webp' }),
  });

  if (!uploadResponse.ok) {
    throw new Error(`Error subiendo imagen optimizada (${uploadResponse.status})`);
  }
  const { storageId } = await uploadResponse.json();
  const signedUrl = await convex.query(api.assets.getImageUrl, { storageId });
  if (!signedUrl) throw new Error('No se pudo resolver URL firmada');
  return signedUrl;
}

async function* paginateAllPresets(convex, adminEmail) {
  let cursor = null;
  while (true) {
    const pageResult = await convex.query(api.stylePresets.listAllPaginated, {
      admin_email: adminEmail,
      paginationOpts: { numItems: 40, cursor },
    });

    const rows = Array.isArray(pageResult?.page) ? pageResult.page : [];
    for (const row of rows) {
      yield row;
    }

    if (pageResult?.isDone) break;
    cursor = pageResult?.continueCursor ?? null;
    if (!cursor) break;
  }
}

async function run() {
  const convexUrl = resolveEnv('NEXT_PUBLIC_CONVEX_URL');
  const adminEmail = process.argv[2] || 'juanfranbrv@gmail.com';

  if (!convexUrl) {
    throw new Error('Falta NEXT_PUBLIC_CONVEX_URL en entorno/.env.local');
  }

  const convex = new ConvexHttpClient(convexUrl);
  let total = 0;
  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for await (const preset of paginateAllPresets(convex, adminEmail)) {
    total += 1;
    const presetId = String(preset._id);

    try {
      const raw = await convex.query(api.stylePresets.getRawImageByIdForAdmin, {
        admin_email: adminEmail,
        id: preset._id,
      });

      const rawUrl = String(raw?.image_url || '').trim();
      if (!rawUrl) {
        skipped += 1;
        console.log(`[SKIP] ${presetId} (${preset.name}) sin image_url`);
        continue;
      }

      const sourceBuffer = await loadSourceBuffer(rawUrl);
      const optimizedBuffer = await optimizeToWebpBuffer(sourceBuffer);
      const finalUrl = await uploadWebpAndGetUrl(convex, optimizedBuffer);

      await convex.mutation(api.stylePresets.update, {
        admin_email: adminEmail,
        id: preset._id,
        image_url: finalUrl,
      });

      ok += 1;
      console.log(`[OK] ${presetId} (${preset.name})`);
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`[FAIL] ${presetId} (${preset.name}) -> ${message}`);
    }
  }

  console.log('\n=== MIGRACION FINALIZADA ===');
  console.log(`Total: ${total}`);
  console.log(`OK: ${ok}`);
  console.log(`Skip: ${skipped}`);
  console.log(`Fail: ${failed}`);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[FATAL]', message);
  process.exit(1);
});


