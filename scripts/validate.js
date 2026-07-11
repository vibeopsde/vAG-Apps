#!/usr/bin/env node
// ============================================================
// vAG-Apps — validate all submitted single-HTML apps
// ============================================================

import { readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readManifestFromHtml, validateManifest } from './lib/manifest.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APPS_DIR = join(__dirname, '..', 'apps');

const errors = [];
const warnings = [];

function addError(path, message) {
  errors.push(`${path}: ${message}`);
}

function addWarning(path, message) {
  warnings.push(`${path}: ${message}`);
}

async function validateApp(categoryPath, appId) {
  const appPath = join(categoryPath, appId);
  const htmlPath = join(appPath, 'index.html');
  const htmlStat = await stat(htmlPath).catch(() => null);

  if (!htmlStat) {
    addError(appPath, 'missing index.html');
    return;
  }

  const parsed = await readManifestFromHtml(htmlPath).catch((e) => ({ error: e.message }));
  if (parsed.error) {
    addError(htmlPath, parsed.error);
    return;
  }

  const manifest = parsed.manifest;
  const fieldErrors = validateManifest(manifest, appId);
  for (const msg of fieldErrors) {
    addError(htmlPath, msg);
  }

  if (manifest.icon && typeof manifest.icon !== 'string') {
    addError(htmlPath, 'icon must be a string (emoji)');
  }
}

async function validateAll() {
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
      await validateApp(categoryPath, appId);
    }
  }
}

await validateAll();

for (const warning of warnings) {
  console.warn(`⚠️ ${warning}`);
}
for (const error of errors) {
  console.error(`❌ ${error}`);
}

if (errors.length || warnings.length) {
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
}

if (errors.length) {
  process.exit(1);
} else {
  console.log('✅ All apps validated successfully.');
}
