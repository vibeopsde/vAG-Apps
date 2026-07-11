#!/usr/bin/env node
// ============================================================
// vAG-Apps — build apps/index.json from all single-HTML app manifests
// ============================================================

import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseManifest } from './lib/manifest.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APPS_DIR = join(__dirname, '..', 'apps');
const OUTPUT_PATH = join(APPS_DIR, 'index.json');

const entries = [];

async function buildIndex() {
  const categories = await readdir(APPS_DIR).catch(() => []);
  for (const category of categories) {
    const categoryPath = join(APPS_DIR, category);
    const categoryStat = await stat(categoryPath).catch(() => null);
    if (!categoryStat?.isDirectory()) continue;

    const appIds = await readdir(categoryPath).catch(() => []);
    for (const appId of appIds) {
      const appPath = join(categoryPath, appId);
      const appStat = await stat(appPath).catch(() => null);
      if (!appStat?.isDirectory()) continue;

      const htmlPath = join(appPath, 'index.html');
      const htmlStat = await stat(htmlPath).catch(() => null);
      if (!htmlStat) continue;

      try {
        const raw = await readFile(htmlPath, 'utf8');
        const parsed = parseManifest(raw);
        if (parsed.error || !parsed.manifest) {
          console.error(`❌ ${htmlPath}: ${parsed.error}`);
          continue;
        }
        const manifest = parsed.manifest;
        entries.push({
          id: manifest.id ?? appId,
          name: manifest.name ?? appId,
          version: manifest.version ?? '0.0.0',
          author: manifest.author ?? '',
          category: manifest.category ?? category,
          description: manifest.description ?? '',
          icon: typeof manifest.icon === 'string' ? manifest.icon : null,
          entry: 'index.html',
          path: `${category}/${appId}`,
          minVibeAgentGo: manifest.minVibeAgentGo ?? null,
          license: manifest.license ?? null,
          permissions: manifest.permissions ?? [],
        });
      } catch (e) {
        console.error(`❌ Failed to read ${htmlPath}: ${e.message}`);
      }
    }
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  const index = {
    generatedAt: new Date().toISOString(),
    count: entries.length,
    apps: entries,
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(index, null, 2) + '\n', 'utf8');
  console.log(`✅ Built ${OUTPUT_PATH} with ${entries.length} app(s).`);
}

await buildIndex();
