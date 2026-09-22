#!/usr/bin/env python3
"""Every var(--x) the site uses must be a variable the site defines.

This exists because an undefined custom property fails silently in two
different ways, and both shipped.

With a fallback, the fallback wins in EVERY theme. `background: var(--bg-2,
#f9fafb)` painted three rows of the Migration Comparison table near-white in
dark mode too, so the dark ink landed on them at 1.18:1 and the table was
unreadable. --bg-2 was defined nowhere in the repo.

With no fallback, the declaration is simply dropped: the element renders with
no background or inherits an ink it was never meant to have. Seven more
`var(--bg-2)` cards had no visible surface at all, three legend dots that were
meant to be three different colours all rendered in body ink, and a status dot
disappeared.

Neither shows up as an error. Nothing is red. The page renders, wrongly.
check-theme-contrast.py cannot see it either, because it reads declared
values rather than resolved ones.

Run:  python3 scripts/check-css-vars.py
"""
import re, sys, glob, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Where variables are DEFINED. Both, because index.html carries an inline
# critical-CSS block with its own :root.
DEFINING = ['styles.css', 'index.html']
# Where they are USED. app.js and games.js build markup with inline styles.
USING = ['styles.css', 'index.html', 'app.js', 'games.js'] + sorted(
    os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, 'panels', '*.html')))

# A property set on an element by script, e.g. el.style.setProperty('--x', v),
# is a definition too.
DEF_RE = re.compile(r'(--[A-Za-z0-9_-]+)\s*:')
SETPROP_RE = re.compile(r"""setProperty\(\s*['"](--[A-Za-z0-9_-]+)['"]""")
USE_RE = re.compile(r'var\(\s*(--[A-Za-z0-9_-]+)')


def read(rel):
    p = os.path.join(ROOT, rel)
    if not os.path.exists(p):
        return ''
    with open(p, encoding='utf-8', errors='replace') as fh:
        return fh.read()


def main():
    defined = set()
    for rel in DEFINING + USING:
        src = read(rel)
        defined |= set(DEF_RE.findall(src))
        defined |= set(SETPROP_RE.findall(src))

    missing = {}
    for rel in USING:
        for m in USE_RE.finditer(read(rel)):
            name = m.group(1)
            if name not in defined:
                missing.setdefault(name, set()).add(rel)

    if missing:
        n = sum(len(v) for v in missing.values())
        print('FAIL - %d undefined custom propert%s used in %d file(s):\n'
              % (len(missing), 'y' if len(missing) == 1 else 'ies', n))
        for name in sorted(missing):
            print('  %-24s used in %s' % (name, ', '.join(sorted(missing[name]))))
        print('\nAn undefined property does not error. With a fallback the')
        print('fallback wins in every theme; with none the declaration is')
        print('dropped and the element inherits. Either way the page renders,')
        print('wrongly, and no other check can see it. Define it in :root and')
        print('in the [data-theme="dark"] block, or point the use at a')
        print('property that already exists.')
        return 1

    used = set()
    for rel in USING:
        used |= set(USE_RE.findall(read(rel)))
    print('PASS - all %d custom properties in use are defined.' % len(used))
    return 0


if __name__ == '__main__':
    sys.exit(main())
