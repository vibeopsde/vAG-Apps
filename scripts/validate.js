#!/usr/bin/env node
// ============================================================
// vAG-Apps — validate all submitted apps
// ============================================================

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APPS_DIR = join(__dirname, '..', 'apps');
const CATEGORIES = new Set(['Productivity', 'Utilities', 'Development', 'Creative', 'Games', 'System']);
const VALID_PERMISSIONS = new Set([
  'readFile', 'writeFile', 'readFileBinary', 'writeFileBinary', 'deleteFile',
  'listFiles', 'getMemory', 'getConfig', 'sendMessage'
]);

const errors = [];
const warnings = [];

function addError(path, message) {
  errors.push(`${path}: ${message}`);
}

function addWarning(path, message) {
  warnings.push(`${path}: ${message}`);
}

function isValidSemver(version) {
  return typeof version === 'string' && /^\d+\.\d+\.\d+/.test(version);
}

async function validateApp(categoryPath, appId) {
  const appPath = join(categoryPath, appId);
  const manifestPath = join(appPath, 'vAG-app.json');
  const manifestStat = await stat(manifestPath).catch(() => null);

  if (!manifestStat) {
    addError(appPath, 'missing vAG-app.json');
    return;
  }

  let manifest;
  try {
    const raw = await readFile(manifestPath, 'utf8');
    manifest = JSON.parse(raw);
  } catch (e) {
    addError(manifestPath, `invalid JSON: ${e.message}`);
    return;
  }

  const requiredFields = ['id', 'name', 'version', 'author', 'category', 'entry'];
  for (const field of requiredFields) {
    if (!manifest[field] || typeof manifest[field] !== 'string') {
      addError(manifestPath, `missing or invalid field: ${field}`);
    }
  }

  if (manifest.id && manifest.id !== appId) {
    addError(manifestPath, `manifest id "${manifest.id}" does not match directory name "${appId}"`);
  }

  if (manifest.category && !CATEGORIES.has(manifest.category)) {
    addError(manifestPath, `invalid category "${manifest.category}"`);
  }

  if (manifest.version && !isValidSemver(manifest.version)) {
    addError(manifestPath, `invalid semver version "${manifest.version}"`);
  }

  if (manifest.entry) {
    const entryPath = join(appPath, manifest.entry);
    const entryStat = await stat(entryPath).catch(() => null);
    if (!entryStat) {
      addError(manifestPath, `entry file not found: ${manifest.entry}`);
    }
  }

  if (manifest.icon) {
    const iconPath = join(appPath, manifest.icon);
    const iconStat = await stat(iconPath).catch(() => null);
    if (!iconStat) {
      addWarning(manifestPath, `icon file not found: ${manifest.icon}`);
    }
  }

  if (manifest.permissions) {
    if (!Array.isArray(manifest.permissions)) {
      addError(manifestPath, 'permissions must be an array');
    } else {
      for (const perm of manifest.permissions) {
        if (!VALID_PERMISSIONS.has(perm)) {
          addError(manifestPath, `invalid permission: ${perm}`);
        }
      }
    }
  }
}

async function validateAll() {
  const categories = await readdir(APPS_DIR).catch(() => []);
  for (const category of categories) {
    const categoryPath = join(APPS_DIR, category);
    const categoryStat = await stat(categoryPath);
    if (!categoryStat.isDirectory()) continue;

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
