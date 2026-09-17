#!/usr/bin/env python3
"""Keep CSS uppercasing away from the micro sign.

`text-transform: uppercase` is a display rule, not a text edit, except that for
one character it changes the meaning. CSS maps U+00B5 MICRO SIGN to U+039C
GREEK CAPITAL LETTER MU, so a label reading **µg/m³** inside an uppercased
element renders as **ΜG/M³**, which a reader parses as milligrams per cubic
metre. That is a factor of a thousand on the unit of the number printed
directly beside it, and nothing about the markup looks wrong: the source still
says µ, the page still renders, no console error appears, and a diff shows
nothing.

Found on 2026-09-17 while building the station-vs-satellite comparison, whose
own stat tile read "MEASURED MEAN, MG/M³" over the figure 53.8. Four live
instances already existed, on the homepage and in the AQI explainer.

**The selectors are read from `styles.css`, not hardcoded**, so a new
uppercasing class is covered the day it is written. They are also resolved
properly: `.data-table th` uppercases the `th`, not everything inside the
table, and an earlier version of this script that ignored that reported two
`<td>` cells as failures when they render correctly. A guard that cries wolf
gets switched off.

    python3 scripts/check-uppercase-units.py

The fix is never to drop the unit. Wrap it:
    <span style="text-transform:none;">µg/m³</span>
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS = ROOT / 'styles.css'

SKIP_DIRS = {'node_modules', 'Backups', '.git', 'tests'}
MICRO = re.compile(r'µ|μ|&micro;|&#181;|&#xb5;', re.I)
EXEMPT_NONE = re.compile(r'<span[^>]*text-transform\s*:\s*none[^>]*>.*?</span>', re.S | re.I)


def uppercasing_targets():
    """(class_targets, (ancestor_class, tag) pairs) from styles.css."""
    css = CSS.read_text(encoding='utf-8')
    classes, nested = set(), set()
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
        if not re.search(r'text-transform\s*:\s*uppercase', m.group(2), re.I):
            continue
        for sel in m.group(1).split(','):
            parts = sel.strip().split()
            if not parts:
                continue
            last = parts[-1]
            # The rule applies to the LAST simple selector in the compound.
            cls = re.findall(r'\.([a-zA-Z0-9_-]+)', last)
            if cls:
                classes.update(cls)
            elif re.fullmatch(r'[a-z][a-z0-9]*', last):
                anc = [c for p in parts[:-1] for c in re.findall(r'\.([a-zA-Z0-9_-]+)', p)]
                for a in anc:
                    nested.add((a, last))
    return classes, nested


def offenders(text, inner, where):
    if not MICRO.search(inner):
        return False
    return bool(MICRO.search(EXEMPT_NONE.sub('', inner)))


def main():
    classes, nested = uppercasing_targets()
    if not classes and not nested:
        print('FAIL - no uppercasing selectors found in styles.css; has it moved?')
        return 1

    cls_pat = re.compile(
        r'<([a-z]+)[^>]*\bclass="[^"]*\b(?:' + '|'.join(sorted(map(re.escape, classes))) + r')\b[^"]*"[^>]*>(.*?)</\1>',
        re.S | re.I) if classes else None

    hits = []
    for f in sorted(ROOT.rglob('*.html')):
        if any(part in SKIP_DIRS for part in f.parts):
            continue
        text = f.read_text(encoding='utf-8', errors='replace')

        if cls_pat:
            for m in cls_pat.finditer(text):
                if offenders(text, m.group(2), f):
                    hits.append((f.relative_to(ROOT), text.count('\n', 0, m.start()) + 1, m.group(2)))

        # `.ancestor tag` — check the tag, inside the ancestor, not the whole subtree.
        for anc, tag in sorted(nested):
            anc_pat = re.compile(r'<([a-z]+)[^>]*\bclass="[^"]*\b' + re.escape(anc) + r'\b[^"]*"[^>]*>(.*?)</\1>',
                                 re.S | re.I)
            tag_pat = re.compile(r'<' + tag + r'[^>]*>(.*?)</' + tag + r'>', re.S | re.I)
            for a in anc_pat.finditer(text):
                for t in tag_pat.finditer(a.group(2)):
                    if offenders(text, t.group(1), f):
                        pos = a.start(2) + t.start()
                        hits.append((f.relative_to(ROOT), text.count('\n', 0, pos) + 1, t.group(1)))

    seen, uniq = set(), []
    for rel, line, inner in hits:
        if (rel, line) in seen:
            continue
        seen.add((rel, line))
        uniq.append((rel, line, re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', inner)).strip()[:72]))

    if uniq:
        print(f'FAIL - {len(uniq)} uppercased element(s) containing a micro sign.')
        print('       CSS renders these as Greek capital Mu, so the unit reads as milligrams:\n')
        for rel, line, shown in uniq:
            print(f'  {rel}:{line}')
            print(f'    {shown}')
        print('\n  Wrap the unit: <span style="text-transform:none;">µg/m³</span>')
        return 1

    print(f'PASS - no micro sign inside any of the {len(classes)} uppercasing classes '
          f'or {len(nested)} nested uppercasing rules, so no unit renders as milligrams.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
