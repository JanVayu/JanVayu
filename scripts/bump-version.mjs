#!/usr/bin/env node
// bump-version.mjs — single-source version sync for JanVayu
//
// Usage:
//   node scripts/bump-version.mjs          # sync all files from package.json version
//   node scripts/bump-version.mjs 26.7.1   # bump package.json to 26.7.1, then sync

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function readFile(rel) {
  return readFileSync(join(ROOT, rel), 'utf8');
}

function writeFile(rel, content) {
  writeFileSync(join(ROOT, rel), content, 'utf8');
}

// --- 1. Determine version --------------------------------------------------

const newVersion = process.argv[2]; // optional CLI arg

let pkgRaw = readFile('package.json');
let pkg = JSON.parse(pkgRaw);

if (newVersion) {
  const old = pkg.version;
  pkg.version = newVersion;
  const updatedPkg = JSON.stringify(pkg, null, 2) + '\n';
  writeFile('package.json', updatedPkg);
  pkgRaw = updatedPkg;
  console.log(`package.json: "${old}" -> "${newVersion}"`);
}

const version = pkg.version;

// Parse version parts: "26.6.43" -> year=26, month=6, patch=43.
// NOTE: the third component is a PATCH number, NOT a calendar day — it can
// exceed 31 (e.g. 26.6.43). So we do NOT build a calendar date from it (that
// produced invalid dates like "2026-06-43"). Instead the version yields only an
// opaque, monotonic cache-busting stamp; the human-readable release date comes
// from the real clock.
const vParts = version.split('.');
const major = vParts[0];
const month = vParts[1];
const patch = vParts[2];

// Opaque cache-buster (monotonic across releases): version "26.6.43" -> "20260643".
const yyyy = `20${major}`;
const mm = month.padStart(2, '0');
const pp = patch.padStart(2, '0');
const dateStamp = `${yyyy}${mm}${pp}`;

// Real release date for CITATION.cff — a valid ISO date, unlike dateStamp.
const _now = new Date();
const isoDate = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;

console.log(`Version: ${version}  Date: ${isoDate}  Stamp: ${dateStamp}`);

// --- 2. Patch CITATION.cff -------------------------------------------------

{
  const file = 'CITATION.cff';
  let content = readFile(file);
  let changed = false;

  const newVersion_ = content.replace(
    /^version:\s*".*"/m,
    `version: "${version}"`
  );
  if (newVersion_ !== content) { content = newVersion_; changed = true; }

  const newDate = content.replace(
    /^date-released:\s*".*"/m,
    `date-released: "${isoDate}"`
  );
  if (newDate !== content) { content = newDate; changed = true; }

  if (changed) {
    writeFile(file, content);
    console.log(`${file}: version="${version}", date-released="${isoDate}"`);
  } else {
    console.log(`${file}: already up to date`);
  }
}

// --- 3. Patch ask/sw.js (CACHE_NAME) ----------------------------------------

{
  const file = 'ask/sw.js';
  let content = readFile(file);

  const updated = content.replace(
    /const CACHE_NAME\s*=\s*'ask-janvayu-[^']*'/,
    `const CACHE_NAME = 'ask-janvayu-${dateStamp}-v${patch}'`
  );

  if (updated !== content) {
    writeFile(file, updated);
    console.log(`${file}: CACHE_NAME = 'ask-janvayu-${dateStamp}-v${patch}'`);
  } else {
    console.log(`${file}: already up to date`);
  }
}

// --- 4. Patch sw.js (CACHE_VERSION) -----------------------------------------

{
  const file = 'sw.js';
  let content = readFile(file);

  let updated = content.replace(
    /const CACHE_VERSION\s*=\s*'janvayu-[^']*'/,
    `const CACHE_VERSION = 'janvayu-${dateStamp}'`
  );
  // Keep the precached shell URLs version-stamped so they match the versioned
  // <link>/<script> requests from index.html (cache-busting; see section 5).
  updated = updated
    .replace(/'\/styles\.css(?:\?v=\d+)?'/, `'/styles.css?v=${dateStamp}'`)
    .replace(/'\/app\.js(?:\?v=\d+)?'/, `'/app.js?v=${dateStamp}'`);

  if (updated !== content) {
    writeFile(file, updated);
    console.log(`${file}: CACHE_VERSION = 'janvayu-${dateStamp}' + stamped shell assets`);
  } else {
    console.log(`${file}: already up to date`);
  }
}

// --- 5. Version-stamp the CSS/JS URLs in index.html ------------------------
// The service worker serves same-origin CSS/JS cache-first, so an unversioned
// /styles.css would keep being served from the old cache after a deploy. Adding
// ?v=<stamp> makes every release request a *new* URL that cannot hit a stale
// cache entry — index.html itself is network-first, so the new HTML (with the
// new stamp) always reaches the browser, and the fresh assets follow.
{
  const file = 'index.html';
  let content = readFile(file);
  const updated = content
    .replace(/href="\/styles\.css(?:\?v=\d+)?"/, `href="/styles.css?v=${dateStamp}"`)
    .replace(/src="\/app\.js(?:\?v=\d+)?"/, `src="/app.js?v=${dateStamp}"`);
  if (updated !== content) {
    writeFile(file, updated);
    console.log(`${file}: styles.css + app.js stamped ?v=${dateStamp}`);
  } else {
    console.log(`${file}: already up to date`);
  }
}

console.log('Done.');
