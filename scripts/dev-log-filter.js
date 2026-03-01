#!/usr/bin/env node

const source = (process.argv[2] || '').toLowerCase();

const convexNoise = [
  /- Preparing Convex functions\.\.\./i,
  /A minor update is available for Convex/i,
  /Changelog:\s*https?:\/\//i,
];

const nextNoise = [
  /^\s*✓ Starting\.\.\./i,
  /^\s*✓ Ready in\s+\d+ms/i,
  /^\s*○ Compiling/i,
  /^\s*✓ Compiled/i,
];

function isNoise(line) {
  if (!line) return false;
  if (source === 'convex') return convexNoise.some((re) => re.test(line));
  if (source === 'next') return nextNoise.some((re) => re.test(line));
  return false;
}

process.stdin.setEncoding('utf8');

let buffer = '';

process.stdin.on('data', (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || '';

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!isNoise(line)) {
      process.stdout.write(`${line}\n`);
    }
  }
});

process.stdin.on('end', () => {
  const line = buffer.trimEnd();
  if (line && !isNoise(line)) {
    process.stdout.write(`${line}\n`);
  }
});
