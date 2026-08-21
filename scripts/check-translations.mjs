#!/usr/bin/env node
/**
 * check-translations.mjs
 *
 * Checks docs-{hi,bn,mr,ta}/ directories for stale English terms
 * that should have been replaced with their translated equivalents.
 *
 * Exit code 1 if stale terms found, 0 if clean.
 * Uses only Node.js builtins.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

// Stale English terms that were replaced during renaming.
// "Hyperlocal" is checked only when it appears as a panel/section name,
// not in technical/descriptive contexts.
const STALE_TERMS = [
  'Research Library',
  'Policy Effectiveness',
  'Zotero Research Library',
];

// Hyperlocal as a standalone panel name (not embedded in longer technical phrases).
// We match it when it appears as a label, heading, or nav item.
const HYPERLOCAL_PATTERN = /(?:^|[>\s"'])Hyperlocal(?:\s*(?:Panel|Data|View|Map))?(?:[<\s"',;.!?]|$)/;

const LANG_DIRS = ['docs-hi', 'docs-bn', 'docs-mr', 'docs-ta'];

/**
 * Recursively collect all files in a directory.
 */
function walkDir(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

let found = 0;

for (const langDir of LANG_DIRS) {
  const dirPath = join(ROOT, langDir);
  if (!existsSync(dirPath)) {
    console.log(`  [skip] ${langDir}/ does not exist`);
    continue;
  }

  const files = walkDir(dirPath);

  for (const filePath of files) {
    // Only check text-like files
    if (!/\.(md|html|json|yml|yaml|txt)$/i.test(filePath)) continue;

    let content;
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    const relPath = filePath.slice(ROOT.length + 1);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check plain stale terms
      for (const term of STALE_TERMS) {
        if (line.includes(term)) {
          found++;
          console.log(`  STALE  ${relPath}:${i + 1}  "${term}"`);
        }
      }

      // Check Hyperlocal as a panel name (not in technical contexts)
      if (HYPERLOCAL_PATTERN.test(line)) {
        found++;
        console.log(`  STALE  ${relPath}:${i + 1}  "Hyperlocal" (panel name)`);
      }
    }
  }
}

if (found > 0) {
  console.log(`\n${found} stale translation(s) found. Please update these to the correct translated term.`);
  console.log('See scripts/translations.json for canonical translations.');
  process.exit(1);
} else {
  console.log('All translation directories are clean — no stale English terms found.');
  process.exit(0);
}
