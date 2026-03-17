#!/usr/bin/env node

import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const bundledSkillScript = path.resolve(projectRoot, '.agents', 'skills', 'chrome-cdp', 'scripts', 'cdp.mjs');

if (!existsSync(bundledSkillScript)) {
  console.error(`[CDP][ERROR] No se encontro el CLI de chrome-cdp en ${bundledSkillScript}`);
  process.exit(1);
}

const child = spawn(process.execPath, [bundledSkillScript, ...process.argv.slice(2)], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('[CDP][ERROR] No se pudo ejecutar el wrapper de chrome-cdp.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
