const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(process.cwd(), 'docs', 'legacy-compositions', 'commit-06e173f');
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

const BASIC_FILE = path.join(DATA_DIR, 'legacy-basic-layouts.json');
const ADV_FILE = path.join(DATA_DIR, 'legacy-promoted-layouts.json');
const CUSTOM_FILE = path.join(DATA_DIR, 'legacy-custom-layouts.json');
const OVERRIDES_FILE = path.join(DATA_DIR, 'legacy-layout-overrides.json');
const REMOVED_FILE = path.join(DATA_DIR, 'legacy-removed-layout-ids.json');

const INTENTS = [
  'oferta','escaparate','catalogo','lanzamiento','servicio','comunicado','evento','lista','comparativa','efemeride','equipo','cita','talento','logro','bts','dato','pasos','definicion','pregunta','reto'
];

const clean = (v) => (v || '').trim();

const unquote = (value) => {
  if (!value) return '';
  const trimmed = value.trim();
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('`') && trimmed.endsWith('`'))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const extractBlocks = (fileContent) => {
  const blockRegex = /\{\s*id:\s*'[^']+'[\s\S]*?\n\s*\},/g;
  const matches = fileContent.match(blockRegex) || [];
  return matches.filter((block) => block.includes('promptInstruction:'));
};

const parseBlock = (block, file) => {
  const idMatch = block.match(/id:\s*'([^']+)'/);
  const nameMatch = block.match(/name:\s*'([^']+)'/);
  const descriptionMatch = block.match(/description:\s*'([^']+)'/);
  const svgIconMatch = block.match(/svgIcon:\s*'([^']+)'/);
  const textZoneMatch = block.match(/textZone:\s*'([^']+)'/);
  const promptMatch = block.match(/promptInstruction:\s*('(?:[^'\\]|\\.)*'|`[\s\S]*?`)/);
  const structuralMatch = block.match(/structuralPrompt:\s*('(?:[^'\\]|\\.)*'|`[\s\S]*?`)/);

  if (!idMatch || !nameMatch || !descriptionMatch || !promptMatch) return null;

  return {
    id: clean(idMatch[1]),
    name: clean(nameMatch[1]),
    description: clean(descriptionMatch[1]),
    file,
    svgIcon: clean(svgIconMatch?.[1] || 'Layout'),
    textZone: clean(textZoneMatch?.[1] || 'center'),
    promptInstruction: clean(unquote(promptMatch[1])),
    structuralPrompt: clean(structuralMatch ? unquote(structuralMatch[1]) : ''),
    skillVersion: 'legacy',
  };
};

const loadJson = (filePath, fallback) => {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const getLegacyCompositions = () => {
  const removedIds = new Set(loadJson(REMOVED_FILE, []));
  const customLayouts = loadJson(CUSTOM_FILE, []);
  const overrides = loadJson(OVERRIDES_FILE, {});

  const all = new Map();

  if (fs.existsSync(SNAPSHOT_DIR)) {
    const files = fs.readdirSync(SNAPSHOT_DIR)
      .filter((name) => name.endsWith('.ts') && name !== 'creation-flow-types.ts');

    for (const file of files) {
      const filePath = path.join(SNAPSHOT_DIR, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const blocks = extractBlocks(raw);
      for (const block of blocks) {
        const parsed = parseBlock(block, file);
        if (parsed) all.set(parsed.id, parsed);
      }
    }
  }

  for (const custom of customLayouts) {
    if (!custom?.id) continue;
    all.set(custom.id, {
      id: clean(custom.id),
      name: clean(custom.name) || custom.id,
      description: clean(custom.description) || 'Composicion sin descripcion',
      file: 'custom',
      svgIcon: clean(custom.svgIcon || 'Layout'),
      textZone: clean(custom.textZone || 'center'),
      promptInstruction: clean(custom.promptInstruction || ''),
      structuralPrompt: clean(custom.structuralPrompt || ''),
      skillVersion: clean(custom.skillVersion || 'legacy') || 'legacy',
    });
  }

  for (const [id, override] of Object.entries(overrides || {})) {
    const current = all.get(id);
    if (!override?.id) continue;
    const overrideParsed = {
      id: clean(override.id),
      name: clean(override.name) || override.id,
      description: clean(override.description) || 'Composicion sin descripcion',
      file: current?.file || 'snapshot',
      svgIcon: clean(override.svgIcon || 'Layout'),
      textZone: clean(override.textZone || 'center'),
      promptInstruction: clean(override.promptInstruction || ''),
      structuralPrompt: clean(override.structuralPrompt || ''),
      skillVersion: clean(override.skillVersion || 'legacy') || 'legacy',
    };
    all.set(id, { ...(current || overrideParsed), ...overrideParsed });
  }

  return Array.from(all.values())
    .filter((entry) => !removedIds.has(entry.id))
    .sort((a, b) => a.id.localeCompare(b.id, 'es', { sensitivity: 'base' }));
};

const inferIntent = (id) => {
  if (!id) return null;
  const prefix = id.split('-')[0];
  if (INTENTS.includes(prefix)) return prefix;
  return null;
};

const main = () => {
  const all = getLegacyCompositions();
  const basic = loadJson(BASIC_FILE, []);
  const advanced = loadJson(ADV_FILE, []);

  const byId = new Map(all.map((l) => [l.id, l]));
  const basicIds = new Set(basic.map((l) => l.id));

  const byIntent = new Map(INTENTS.map((i) => [i, []]));
  for (const item of all) {
    const intent = inferIntent(item.id);
    if (intent) byIntent.get(intent).push(item);
  }

  for (const intent of INTENTS) {
    const list = byIntent.get(intent) || [];
    const picks = list.slice(0, 3);
    for (const pick of picks) {
      if (!basicIds.has(pick.id)) {
        basic.push(pick);
        basicIds.add(pick.id);
      }
    }
  }

  // Normalize basic list against canonical layouts
  const normalizedBasic = basic
    .map((entry) => byId.get(entry.id) || entry)
    .filter((entry) => entry && typeof entry.id === 'string')
    .sort((a, b) => a.id.localeCompare(b.id, 'es', { sensitivity: 'base' }));

  fs.writeFileSync(BASIC_FILE, JSON.stringify(normalizedBasic, null, 2), 'utf8');

  console.log(`Updated basic layouts: ${normalizedBasic.length}`);
  console.log(`Advanced layouts untouched: ${advanced.length}`);
};

main();
