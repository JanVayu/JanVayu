#!/usr/bin/env python3
"""Regenerate gallery/gallery.json from the gallery panel, which is the real record.

gallery.json was written by hand when the gallery held 24 photographs. The
gallery reached 31 and the file was never updated, so it sat in the repo seven
photographs short, describing itself as the manifest of a gallery it no longer
matched. Nothing reads it, which is why nothing broke and why nobody noticed.

That is worse than useless rather than merely untidy: it is a plausible-looking
source of truth. A contributor regenerating the gallery from it would silently
delete g25 to g31, and the count check would not catch it, because
check-site-figures counts <figure> elements in the panel rather than entries
here.

So the manifest is now derived. panels/gallery.html is the single source; this
reads the data- attributes off each figure and writes them out. Run it after
adding a photograph, or let CI tell you it drifted.

Run:    python3 scripts/build-gallery-manifest.py [--check]
Writes: gallery/gallery.json
"""

import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PANEL = ROOT / 'panels/gallery.html'
OUT = ROOT / 'gallery/gallery.json'

FIG = re.compile(r'<figure class="gal-item".*?</figure>', re.S)
ATTR = lambda name, blob: (re.search(rf'{name}="([^"]*)"', blob) or [None, None])[1]

def unescape(s):
    if s is None:
        return None
    for a, b in (('&#x27;', "'"), ('&amp;', '&'), ('&quot;', '"'), ('&lt;', '<'), ('&gt;', '>'),
                 ('&rsquo;', '’'), ('&mdash;', '—'), ('&nbsp;', ' ')):
        s = s.replace(a, b)
    return s

def build():
    html = PANEL.read_text()
    out = []
    for blob in FIG.findall(html):
        img = re.search(r'<img[^>]*>', blob).group(0)
        out.append({
            'src': ATTR('data-full', blob),
            'w': int(ATTR('width', img) or 0),
            'h': int(ATTR('height', img) or 0),
            'alt': unescape(ATTR('data-alt', blob)),
            'credit': unescape(ATTR('data-credit', blob)),
            'license': ATTR('data-license', blob),
            'licenseUrl': ATTR('data-licenseurl', blob),
            'source': ATTR('data-source', blob),
        })
    return out

def main():
    got = build()
    text = json.dumps(got, ensure_ascii=False, indent=1) + '\n'
    if '--check' in sys.argv:
        have = OUT.read_text() if OUT.exists() else ''
        if have.strip() != text.strip():
            n_have = len(json.loads(have)) if have.strip() else 0
            sys.exit(f'FAIL: gallery.json is stale ({n_have} entries; the panel has {len(got)}). '
                     f'Run: python3 scripts/build-gallery-manifest.py')
        print(f'PASS: gallery.json matches the panel ({len(got)} photographs).')
        return
    missing = [e['src'] for e in got if not (ROOT / e['src'].lstrip('/')).exists()]
    if missing:
        sys.exit(f'FAIL: the panel references files that do not exist: {missing}')
    unlicensed = [e['src'] for e in got if not e['credit'] or not e['license']]
    if unlicensed:
        sys.exit(f'FAIL: every photograph needs a credit and a licence; missing for {unlicensed}')
    OUT.write_text(text)
    print(f'wrote {OUT.relative_to(ROOT)} with {len(got)} photographs')

if __name__ == '__main__':
    main()
