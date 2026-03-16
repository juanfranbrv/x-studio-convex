import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

function normalizeHttpCandidate(value) {
  if (!value) return null;
  if (value.startsWith('ws://') || value.startsWith('wss://')) return value;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return null;
}

function devToolsActivePortCandidates() {
  const candidates = [];

  if (process.env.LOCALAPPDATA) {
    candidates.push(path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data', 'DevToolsActivePort'));
    candidates.push(path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome SxS', 'User Data', 'DevToolsActivePort'));
  }

  candidates.push(path.resolve(process.cwd(), '.tmp', 'chrome-debug', 'DevToolsActivePort'));
  return candidates;
}

export function resolveChromeCdpEndpoint() {
  const explicitWs =
    normalizeHttpCandidate(process.env.PLAYWRIGHT_CDP_WS_ENDPOINT) ||
    normalizeHttpCandidate(process.env.CHROME_CDP_WS_ENDPOINT);

  if (explicitWs?.startsWith('ws://') || explicitWs?.startsWith('wss://')) {
    return explicitWs;
  }

  const explicitHttp =
    normalizeHttpCandidate(process.env.PLAYWRIGHT_CDP_URL) ||
    normalizeHttpCandidate(process.env.CHROME_CDP_URL);

  if (explicitHttp) {
    return explicitHttp;
  }

  for (const candidate of devToolsActivePortCandidates()) {
    if (!fs.existsSync(candidate)) continue;

    const [port, browserPath] = fs.readFileSync(candidate, 'utf8').trim().split(/\r?\n/);
    if (!port || !browserPath) continue;
    return `ws://127.0.0.1:${port}${browserPath}`;
  }

  return 'http://127.0.0.1:9222';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.stdout.write(`${resolveChromeCdpEndpoint()}\n`);
}
