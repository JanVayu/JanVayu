#!/usr/bin/env node
/**
 * check-inline-js.mjs: every inline <script> in every HTML file must parse.
 *
 * A script block that throws SyntaxError is not partly run. Nothing in it
 * executes, the markup renders exactly as designed, and the only evidence is
 * one line in the browser console. On 2026-10-06 the slogan edit put
 * "everyone's" inside a single-quoted string in walkthrough/full.html, which
 * emptied the whole 41-slide tour for every visitor. The page loaded, the
 * title was right, and CI was green, because nothing here read JavaScript.
 *
 * Each block is cut where the HTML parser would cut it (the first "</script")
 * and handed to `node --check`. Module scripts are checked as modules. JSON
 * and other data blocks (ld+json, importmap, text/template) are skipped.
 *
 * Needs node only. Exit 1 on any failure.
 */
import { readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'data', 'Backups']);

function* walk(dir) {
    for (const name of readdirSync(dir)) {
        if (SKIP_DIRS.has(name)) continue;
        const p = join(dir, name);
        const st = statSync(p);
        if (st.isDirectory()) yield* walk(p);
        else if (name.endsWith('.html')) yield p;
    }
}

const tmp = mkdtempSync(join(tmpdir(), 'inline-js-'));
const failures = [];
let checked = 0;

for (const file of walk(ROOT)) {
    const html = readFileSync(file, 'utf8');
    const open = /<script\b([^>]*)>/gi;
    let m;
    while ((m = open.exec(html))) {
        const attrs = m[1];
        const bodyStart = open.lastIndex;
        const end = html.toLowerCase().indexOf('</script', bodyStart);
        const body = html.slice(bodyStart, end === -1 ? html.length : end);
        open.lastIndex = end === -1 ? html.length : end;
        if (/\bsrc\s*=/i.test(attrs) || !body.trim()) continue;
        const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
        if (type && !/^(module|text\/javascript|application\/javascript)$/i.test(type)) continue;
        const isModule = type === 'module';
        const f = join(tmp, isModule ? 'x.mjs' : 'x.js');
        writeFileSync(f, body);
        checked++;
        try {
            execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
        } catch (e) {
            const line = html.slice(0, bodyStart).split('\n').length;
            const msg = String(e.stderr || e.message).split('\n').filter(l => /Error/.test(l))[0] || 'SyntaxError';
            failures.push(`${relative(ROOT, file)} (script starting line ${line}): ${msg.trim()}`);
        }
    }
}
rmSync(tmp, { recursive: true, force: true });

if (failures.length) {
    console.error(`FAIL: ${failures.length} inline script(s) do not parse:`);
    for (const f of failures) console.error('  ' + f);
    process.exit(1);
}
console.log(`PASS: ${checked} inline scripts parse`);
