#!/usr/bin/env python3
"""Every standalone page loads styles.css, and none of them redefines its tokens.

Until 2026-09-22, index.html was the only document on this site that loaded
styles.css. The other eighteen each carried a private <style> block that
redefined the same token names -- --bg, --text, --accent, --border -- with
fixed light-theme literals. Two consequences, both invisible from inside any
one file:

  * A change to a token reached one page. The contrast remediation that moved
    --text-3 to meet AA on dark surfaces fixed index.html and left ask/ on the
    old value, which that file's own comment had already flagged as failing.
  * None of them followed the theme control. The ones that had a dark mode at
    all keyed it on prefers-color-scheme, so they followed the operating
    system: choose light on janvayu.in with a dark desktop and half the site
    stayed dark.

Nothing failed while that was true. Each page rendered, and rendered
plausibly, which is why it lasted. So this checks the two things that cannot
be seen by looking at a page on its own:

  1. Every standalone document (anything with a <!DOCTYPE>) loads styles.css.
  2. No page redefines a token that styles.css already defines per theme.
     Aliasing is fine and is the intended pattern -- `--muted: var(--text-3)`
     passes, `--muted: #9aa3b2` passes (styles.css has no --muted), and
     `--text-3: #94A3B8` fails, because that name flips per theme and a
     literal cannot.

    python3 scripts/check-design-system.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {'node_modules', '.git', 'Backups', 'tests', 'scripts'}

# Pages that legitimately do not load the stylesheet go here with a reason.
# A stale exemption fails too: if an exempted page starts loading styles.css,
# this reports it, so the list cannot quietly rot into a blindfold.
EXEMPT_STYLESHEET = {
    # (none today -- all nineteen load it)
}

# Token names styles.css defines on BOTH sides of the theme. Redefining one of
# these with a literal is the defect; these are collected from the file rather
# than listed, so a token added there is covered the day it is added.
def themed_tokens():
    css = (ROOT / 'styles.css').read_text(encoding='utf-8')
    light = set(re.findall(r'^\s*(--[\w-]+)\s*:', css[:css.index('[data-theme="dark"]')], re.M))
    dark = set(re.findall(r'^\s*(--[\w-]+)\s*:', css[css.index('[data-theme="dark"]'):], re.M))
    return light & dark



def _theme_segments(block):
    """Split a <style> body into (text, is_dark) runs.

    A run is dark if it sits inside a rule whose selector mentions
    [data-theme="dark"] or inside a prefers-color-scheme: dark media query.
    Crude but sufficient: it only has to tell 'this declaration is the dark
    half of a pair' from 'this is the only declaration there is'.
    """
    out, pos = [], 0
    pattern = re.compile(r'(@media[^{]*prefers-color-scheme\s*:\s*dark[^{]*\{|'
                         r'[^{}]*\[data-theme\s*=\s*"dark"\][^{]*\{)')
    for m in pattern.finditer(block):
        out.append((block[pos:m.start()], False))
        depth, i = 1, m.end()
        while i < len(block) and depth:
            if block[i] == '{':
                depth += 1
            elif block[i] == '}':
                depth -= 1
            i += 1
        out.append((block[m.end():i], True))
        pos = i
    out.append((block[pos:], False))
    return out


def standalone_pages():
    for f in sorted(ROOT.rglob('*.html')):
        if any(p in SKIP_DIRS for p in f.relative_to(ROOT).parts):
            continue
        head = f.read_text(encoding='utf-8', errors='ignore')[:200]
        if re.search(r'<!doctype\s+html', head, re.I):
            yield f


def main():
    tokens = themed_tokens()
    if not tokens:
        print('FAIL - could not read any themed tokens from styles.css.')
        return 1

    bad = []
    checked = 0
    for f in standalone_pages():
        rel = str(f.relative_to(ROOT))
        text = f.read_text(encoding='utf-8')
        checked += 1

        loads = 'styles.css?v=' in text
        if rel in EXEMPT_STYLESHEET and loads:
            bad.append(f'  {rel}  is exempt from loading styles.css but loads it '
                       f'(reason on file: {EXEMPT_STYLESHEET[rel]}) - drop the exemption')
        elif not loads and rel not in EXEMPT_STYLESHEET:
            bad.append(f'  {rel}  does not load styles.css')

        # Only inside <style> blocks; an author writing --bg in prose or in a
        # comment is not redefining anything.
        #
        # What fails is a token pinned to ONE side. index.html's inline block
        # is the critical-CSS subset and declares both themes, which is the
        # point of it (check-critical-css.py keeps it in step with the real
        # file), so every token it sets on the light side it also sets under
        # [data-theme="dark"] and it passes. A page that sets --green-700 once,
        # with a literal, does not: text using it keeps a mid-tone green on the
        # near-black page, which is how these pages failed in the first place.
        light_lits, dark_names = {}, set()
        for block in re.findall(r'<style[^>]*>(.*?)</style>', text, re.S | re.I):
            block = re.sub(r'/\*.*?\*/', '', block, flags=re.S)
            for seg, is_dark in _theme_segments(block):
                for m in re.finditer(r'(--[\w-]+)\s*:\s*([^;}]+)', seg):
                    name, value = m.group(1), m.group(2).strip()
                    if name not in tokens:
                        continue
                    if is_dark:
                        dark_names.add(name)
                    elif not value.startswith('var('):
                        light_lits.setdefault(name, value)

        for name, value in light_lits.items():
            if name in dark_names:
                continue
            line = text[:text.index(f'{name}:')].count('\n') + 1 if f'{name}:' in text else 0
            bad.append(f'  {rel}:{line}  {name}: {value}  '
                       f'(styles.css defines {name} per theme, and this page sets it '
                       f'for one side only)')

    if bad:
        print(f'FAIL - {len(bad)} design-system problem(s) across {checked} pages:\n')
        print('\n'.join(bad))
        print('\nLoad /styles.css and alias onto its tokens (--muted: var(--text-3))')
        print('instead of redefining them with a literal.')
        return 1

    print(f'PASS - all {checked} standalone pages load styles.css and none '
          f'redefines any of its {len(tokens)} themed tokens.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
