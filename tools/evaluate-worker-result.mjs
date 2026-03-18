#!/usr/bin/env node

import fs from 'node:fs';

const resultPath = process.argv[2];

if (!resultPath) {
  console.error('Usage: node tools/evaluate-worker-result.mjs <result-file>');
  process.exit(1);
}

const raw = fs.readFileSync(resultPath, 'utf8');
const responseMarker = '## Response';
const markerIndex = raw.indexOf(responseMarker);
const response = (markerIndex >= 0 ? raw.slice(markerIndex + responseMarker.length) : raw).trim();

const codeBlockRegex = /```(edit|create):([^\n]+)\n([\s\S]*?)```/g;
const blocks = [];

for (const match of response.matchAll(codeBlockRegex)) {
  const [, type, path, body] = match;
  const normalizedBody = body.trim();
  const isValid =
    type === 'create'
      ? normalizedBody.length > 0
      : normalizedBody.includes('<<<< SEARCH') &&
        normalizedBody.includes('====') &&
        normalizedBody.includes('>>>> END');

  blocks.push({
    type,
    path: path.trim(),
    isValid,
  });
}

const responseWithoutBlocks = response.replace(codeBlockRegex, '').trim();
const hasUnclear = /^UNCLEAR:/m.test(response);
const validBlocks = blocks.filter((block) => block.isValid);
const invalidBlocks = blocks.filter((block) => !block.isValid);
const hasExtraneousText = responseWithoutBlocks.length > 0;

let followedFormat = 'NO';

if (hasUnclear) {
  followedFormat = 'UNCLEAR';
} else if (validBlocks.length > 0 && !hasExtraneousText && invalidBlocks.length === 0) {
  followedFormat = 'YES';
} else if (validBlocks.length > 0) {
  followedFormat = 'PARTIAL';
}

const payload = {
  followed_format: followedFormat,
  valid_blocks: validBlocks.length,
  invalid_blocks: invalidBlocks.length,
  has_extraneous_text: hasExtraneousText ? 'YES' : 'NO',
  block_paths: validBlocks.map((block) => block.path),
};

process.stdout.write(JSON.stringify(payload));
