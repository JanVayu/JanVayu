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

// Parse version parts: "26.6.20" -> year=26, month=6, day=20
const vParts = version.split('.');
const major = vParts[0];
const month = vParts[1];
const day = vParts[2];

// Build YYYYMMDD date string: version "26.6.20" -> "20260620"
const yyyy = `20${major}`;
const mm = month.padStart(2, '0');
const dd = day.padStart(2, '0');
const dateStamp = `${yyyy}${mm}${dd}`;
const isoDate = `${yyyy}-${mm}-${dd}`;

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
    `const CACHE_NAME = 'ask-janvayu-${dateStamp}-v${major}'`
  );

  if (updated !== content) {
    writeFile(file, updated);
    console.log(`${file}: CACHE_NAME = 'ask-janvayu-${dateStamp}-v${major}'`);
  } else {
    console.log(`${file}: already up to date`);
  }
}

// --- 4. Patch sw.js (CACHE_VERSION) -----------------------------------------

{
  const file = 'sw.js';
  let content = readFile(file);

  const updated = content.replace(
    /const CACHE_VERSION\s*=\s*'janvayu-[^']*'/,
    `const CACHE_VERSION = 'janvayu-${dateStamp}'`
  );

  if (updated !== content) {
    writeFile(file, updated);
    console.log(`${file}: CACHE_VERSION = 'janvayu-${dateStamp}'`);
  } else {
    console.log(`${file}: already up to date`);
  }
}

console.log('Done.');
