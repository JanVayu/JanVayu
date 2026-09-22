#!/usr/bin/env python3
"""No ad-hoc colour tint as a background in markup.

The new design carries emphasis on a rule against a token surface. The old one
carried it on a wash: `background: rgba(239,68,68,0.08)` and 201 others like it,
written inline, one at a time, by whoever needed a box to look important. That
is what made a panel opened from the Index read as the old site next to a
homepage built from hairlines.

A literal rgba also cannot know which theme it landed in. A 6% red on cream is
a pale pink; the same declaration on the dark page is a muddy maroon that the
surrounding ink was never chosen against. The --ink-* tokens flip; an rgba
literal does not, which is the same defect class that put 164 contrast failures
on the site in v26.6.226.

So: an inline style may not set a COLOUR background at low alpha. Greys, whites
and blacks are fine, because those are scrims and overlays on dark bands rather
than emphasis blocks, and a high alpha is a solid fill rather than a tint.
Declarations inside a <style> block are fine too: those are reviewed CSS, and
the badge pills there legitimately carry a tint.

Instead of a tint, use the surface and a rule:

    background: var(--bg-section); border-left: 3px solid var(--ink-red);

Run:  python3 scripts/check-theme-surfaces.py
"""
import re, sys, glob, os, colorsys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ['index.html'] + sorted(
    os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, 'panels', '*.html')))

TINT = re.compile(r'background:\s*rgba\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\)')
STYLE_BLOCK = re.compile(r'<style\b.*?</style>', re.S | re.I)
MAX_TINT_ALPHA = 0.25
MIN_SATURATION = 0.12


def main():
    findings = []
    for rel in FILES:
        path = os.path.join(ROOT, rel)
        if not os.path.exists(path):
            continue
        with open(path, encoding='utf-8', errors='replace') as fh:
            src = fh.read()
        blocks = [(m.start(), m.end()) for m in STYLE_BLOCK.finditer(src)]
        for m in TINT.finditer(src):
            if any(a <= m.start() < b for a, b in blocks):
                continue
            r, g, b, alpha = (int(m.group(1)), int(m.group(2)),
                              int(m.group(3)), float(m.group(4)))
            if alpha > MAX_TINT_ALPHA:
                continue
            _, _, sat = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if sat < MIN_SATURATION:
                continue
            line = src.count('\n', 0, m.start()) + 1
            findings.append((rel, line, m.group(0)))

    if findings:
        print('FAIL - %d inline colour tint(s) used as a background:\n' % len(findings))
        for rel, line, decl in findings[:40]:
            print('  %s:%d  %s' % (rel, line, decl))
        if len(findings) > 40:
            print('  ... and %d more' % (len(findings) - 40))
        print('\nA literal rgba cannot know which theme it landed in, and a wash')
        print('reads as a tinted card against a page built from hairlines. Use the')
        print('surface and a rule instead:')
        print('\n    background: var(--bg-section); border-left: 3px solid var(--ink-red);\n')
        print('--ink-red/-orange/-amber/-green/-teal/-blue/-violet/-pink/-slate all')
        print('flip with the theme. Greys and scrims are exempt, as is anything')
        print('inside a <style> block.')
        return 1

    print('PASS - no inline colour tints; emphasis comes from rules on token surfaces.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
