#!/usr/bin/env python3
"""Fail if a WAQI token is written into any tracked file.

The same token sat in app.js, js/try-home.js and eight Netlify functions, and
every visitor's browser held it, so anyone could spend JanVayu's WAQI quota. It
is now the WAQI_TOKEN setting in Netlify, read by netlify/functions/lib/
waqi-token.mjs, and the browser reaches WAQI only through waqi-proxy.

Two shapes are refused, in every tracked text file:

  1. a request to api.waqi.info that carries a token of 20 or more letters and
     digits, whether as `token=<hex>` or built up from a literal;
  2. an assignment of a long hex literal to a name containing WAQI and TOKEN.

A third catches the token that was removed: every 40-character hex string in a
tracked file is hashed and compared with RETIRED. The hash is stored, not the
token, so this file does not put the token back. It finds the old value in prose,
a comment, a documentation table or a translation, where the two patterns above
would not.

Placeholders such as `YOUR_TOKEN` and `${WAQI_TOKEN}` are not matched. The check
cannot say whether a token was *rotated*: a token already in git history stays
there, and only issuing a new one closes it. This stops a new copy appearing.

    python3 scripts/check-no-waqi-token.py
"""
import hashlib
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
URL_WITH_TOKEN = re.compile(r'api\.waqi\.info[^\n"\'`]*?token=[A-Za-z0-9]{20,}')
ASSIGNED = re.compile(r'''WAQI\w*TOKEN\w*\s*[:=]\s*["'][0-9a-fA-F]{20,}["']''')
HEX40 = re.compile(r'(?<![0-9A-Za-z])[0-9a-fA-F]{40}(?![0-9A-Za-z])')
# SHA-256 of tokens that were committed and must not come back. Add a token's
# hash here when it is replaced; never add the token.
RETIRED = {
    'b6708f10cb603f1f7a7be0ef907f931af65cf5053bc35501cddc5e24b390575e':
        'the WAQI token that was in app.js and the functions until 27 October 2026',
}
# The test fixture is a made-up value, and this file describes the patterns.
SKIP = {'test/waqi-proxy.test.mjs', 'scripts/check-no-waqi-token.py'}


def tracked():
    out = subprocess.run(['git', 'ls-files', '-z'], cwd=ROOT, capture_output=True, check=True).stdout
    return [p for p in out.decode().split('\0') if p]


def main():
    bad = []
    for rel in tracked():
        if rel in SKIP:
            continue
        p = ROOT / rel
        try:
            text = p.read_text(encoding='utf-8')
        except (UnicodeDecodeError, OSError):
            continue                      # binary, or a path git lists but the tree lacks
        for n, line in enumerate(text.splitlines(), 1):
            if URL_WITH_TOKEN.search(line) or ASSIGNED.search(line):
                bad.append(f'{rel}:{n}')
                continue
            for m in HEX40.finditer(line):
                h = hashlib.sha256(m.group(0).lower().encode()).hexdigest()
                if h in RETIRED:
                    bad.append(f'{rel}:{n}  ({RETIRED[h]})')
    if bad:
        print('FAIL - a WAQI token is written into tracked files:')
        for b in bad[:30]:
            print('   ' + b)
        print('Read it from the WAQI_TOKEN environment variable (netlify/functions/lib/waqi-token.mjs)')
        print('and reach WAQI from the browser through /.netlify/functions/waqi-proxy.')
        return 1
    print('PASS - no WAQI token is written into any tracked file.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
