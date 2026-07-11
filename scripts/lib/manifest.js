// ============================================================
// vAG-Apps — Manifest parser for single-HTML app format
// ============================================================

import { readFile } from 'node:fs/promises';

export const CATEGORIES = new Set(['Productivity', 'Utilities', 'Development', 'Creative', 'Games', 'System']);
export const VALID_PERMISSIONS = new Set([
  'readFile', 'writeFile', 'readFileBinary', 'writeFileBinary', 'deleteFile',
  'listFiles', 'getMemory', 'getConfig', 'sendMessage'
]);

export function parseManifest(html) {
  const match = html.match(/<script\s+type="application\/vnd\.vag\+json"[^\u003e]*>([\s\S]*?)\u003c\/script\u003e/i);
  if (!match) return { error: 'No <script type="application/vnd.vag+json"> manifest block found.' };
  try {
    return { manifest: JSON.parse(match[1].trim()) };
  } catch (e) {
    return { error: `Invalid JSON manifest: ${e.message}` };
  }
}

export async function readManifestFromHtml(htmlPath) {
  const html = await readFile(htmlPath, 'utf8');
  return parseManifest(html);
}

export function validateManifest(manifest, appId) {
  const errors = [];

  const required = ['id', 'name', 'version', 'author', 'category'];
  for (const field of required) {
    if (!manifest[field] || typeof manifest[field] !== 'string') {
      errors.push(`missing or invalid field: ${field}`);
    }
  }

  if (manifest.id && manifest.id !== appId) {
    errors.push(`manifest id "${manifest.id}" does not match directory name "${appId}"`);
  }

  if (manifest.category && !CATEGORIES.has(manifest.category)) {
    errors.push(`invalid category "${manifest.category}"`);
  }

  if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push(`invalid semver version "${manifest.version}"`);
  }

  if (manifest.permissions) {
    if (!Array.isArray(manifest.permissions)) {
      errors.push('permissions must be an array');
    } else {
      for (const perm of manifest.permissions) {
        if (!VALID_PERMISSIONS.has(perm)) errors.push(`invalid permission: ${perm}`);
      }
    }
  }

  return errors;
}
