#!/usr/bin/env python3
"""index.html's inlined critical CSS must not disagree with styles.css.

`<style id="critical-css">` in index.html is a hand-maintained subset of
styles.css, inlined so the header and hero paint before the 125KB stylesheet
arrives. Its own comment says "keep in sync with styles.css". Nothing checked
that it was, and by 2026-09-18 it had drifted 77 properties across 30
selectors — the whole hero, the ticker and the section headers, frozen at the
pre-redesign look: 12px corner radii, drop shadows, centred stat cards, a
57.6px headline.

Two things followed, both reported repeatedly and neither diagnosed:

  * **The page appeared to flip between the old design and the new one on
    refresh.** It was doing exactly that. First paint used the stale inline
    copy; when styles.css arrived it repainted. Measured with styles.css held
    back four seconds: headline 57.6px -> 80px, card radius 12px -> 0,
    text-align centre -> left, shadow -> none. The service worker was
    investigated twice and was never the cause.

  * **The hero note was cut off mid-line.** styles.css loads second and wins
    on equal specificity, so `.hero-live-alert.clamped { max-height }` was
    7.2em, which at line-height 1.6 is four and a HALF lines: the fifth line
    was sliced through the middle of its letters. The inline copy said 6.4em
    and was correct, and never applied. Two fixes to the inline copy changed
    nothing visible, because the value being overridden was not the one being
    edited.

What this checks: for every selector declared in BOTH files, every property
declared in both must carry the same value. `var(--w-300)` and `#e5e5dc` count
as the same value — the critical copy has to spell colours as literals,
because the ladder those vars point at is defined in styles.css and is not
loaded yet at first paint — so the check resolves one level of ladder var
before comparing.

  python3 scripts/check-critical-css.py            # fail on any disagreement
  python3 scripts/check-critical-css.py --list     # print them and exit 0
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _strip_at_rules(css):
    """Drop @media/@supports blocks: a responsive override is not drift."""
    out, i = [], 0
    while i < len(css):
        if css[i] == '@':
            brace = css.find('{', i)
            if brace == -1:
                break
            depth, k = 1, brace + 1
            while k < len(css) and depth:
                if css[k] == '{':
                    depth += 1
                elif css[k] == '}':
                    depth -= 1
                k += 1
            i = k
        else:
            out.append(css[i])
            i += 1
    return ''.join(out)


def rules(css):
    css = _strip_at_rules(re.sub(r'/\*.*?\*/', '', css, flags=re.S))
    out = {}
    for sel, body in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
        decls = {}
        for decl in body.split(';'):
            if ':' in decl:
                prop, val = decl.split(':', 1)
                decls[prop.strip()] = ' '.join(val.split())
        for one in sel.split(','):
            one = ' '.join(one.split())
            if one:
                out.setdefault(one, {}).update(decls)
    return out


def load():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    m = re.search(r'<style id="critical-css">(.*?)</style>', html, re.S)
    if not m:
        print('FAIL - no <style id="critical-css"> block in index.html.')
        raise SystemExit(1)
    full_src = (ROOT / 'styles.css').read_text(encoding='utf-8')
    # Two scopes, because --edge (and every other token) has a different value
    # in each theme, and resolving a dark rule against the light table reports
    # a difference that is not one.
    def table(pattern):
        blk = re.search(pattern, full_src, re.S)
        return {k: v.strip() for k, v in
                re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', blk.group(1) if blk else '')}
    light = table(r':root\s*\{(.*?)\}')
    # the colour ladder itself lives in :root and is not re-declared per theme,
    # so a dark rule still resolves --d-950 through it: dark overrides light,
    # it does not replace it, exactly as the cascade does.
    scopes = {'light': light,
              'dark': {**light, **table(r'\[data-theme="dark"\]\s*\{(.*?)\}')}}
    return rules(m.group(1)), rules(full_src), scopes


def drift():
    crit, full, scopes = load()
    found = []
    for sel in sorted(set(crit) & set(full)):
        # a rule inside the dark theme resolves its tokens against the dark table
        table = scopes['dark'] if 'data-theme="dark"' in sel else scopes['light']

        def norm(v, depth=0):
            """Resolve var() down to a literal so the two spellings of one
            value compare equal. The critical copy must spell colours out:
            the tokens live in styles.css, which has not loaded yet at first
            paint."""
            while depth < 8 and 'var(' in v:
                nxt = re.sub(r'var\((--[\w-]+)(?:\s*,[^()]*)?\)',
                             lambda mo: table.get(mo.group(1), mo.group(0)), v)
                if nxt == v:
                    break
                v, depth = nxt, depth + 1
            return v.lower().replace(' ', '')

        for prop in sorted(set(crit[sel]) & set(full[sel])):
            a, b = crit[sel][prop], full[sel][prop]
            if norm(a) != norm(b):
                found.append((sel, prop, a, b))
    return found


def main():
    found = drift()
    listing = '--list' in sys.argv

    if not found:
        crit, full, _ = load()
        shared = len(set(crit) & set(full))
        print(f'PASS - critical CSS agrees with styles.css on all {shared} shared '
              f'selectors, so first paint and final paint draw the same page.')
        return 0

    print(f'{"" if listing else "FAIL - "}'
          f'{len(found)} propert{"y" if len(found) == 1 else "ies"} '
          f'{"differs" if len(found) == 1 else "differ"} between '
          f'index.html\'s critical CSS and styles.css, over '
          f'{len({f[0] for f in found})} selector(s):\n')
    for sel, prop, a, b in found:
        print(f'  {sel}')
        print(f'      {prop}: critical-css={a!r}  styles.css={b!r}')

    if listing:
        return 0
    print('\nstyles.css loads second, so on equal specificity ITS value is the one')
    print('that applies — and the inline copy is what the visitor sees until it')
    print('arrives. A disagreement is therefore a visible repaint on every load,')
    print('and an edit to the inline copy alone changes nothing. Fix styles.css')
    print('(the source of truth), then copy the value into the critical block.')
    return 1


if __name__ == '__main__':
    raise SystemExit(main())
