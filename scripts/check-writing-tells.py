#!/usr/bin/env python3
"""Report the habits that make prose read as machine-written.

JanVayu is written for citizens, in plain explanatory prose, the way a good
teacher would explain it. This script finds the words and shapes that work
against that, so a writer can fix them. It reads reader-facing text only:
HTML with scripts, styles and tags removed, and Markdown with code removed.

    python3 scripts/check-writing-tells.py                 # summary by file
    python3 scripts/check-writing-tells.py --show FILE     # every hit in one file
    python3 scripts/check-writing-tells.py --fail-above N  # exit 1 if total hits exceed N

It reports and does not gate by default. A word on the list is not always wrong
(a "robust" regression is a statistical term), so a person decides. The point is
to make the habit visible and to stop it growing: set --fail-above to the current
total once the site is clean.
"""
import argparse, html, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCAN = ['index.html', 'README.md', 'delhi', 'panels', 'blog/posts',
        'docs/about', 'docs/user-guide', 'docs/data-sources', 'docs/README.md',
        'workshops', 'walkthrough', 'ask', 'status', 'try.html', 'pm25', 'pm10', 'co', 'no2', 'so2', 'o3']

WORDS = r"""delv\w*|certainly|utilis\w*|utiliz\w*|leverag\w*|robust\w*|streamlin\w*|harness\w*|foster\w*|
underscor\w*|enhanc\w*|testament|pivotal|intricate|intricacies|crucial\w*|transformative|groundbreaking|
tapestry|landscape|paradigm|synerg\w*|architecture|liminal|palpable|ineffable|visceral|ledger|showcas\w*|
meticulous\w*|notabl[ye]|noteworthy|commendable|versatil\w*|seamless\w*|multifaceted|nuanced?|holistic\w*|
invaluable|unparalleled|garner\w*|bolster\w*|elucidat\w*|interplay|underpin\w*|solidif\w*|vibrant|bustling|
nestled|picturesque|breathtaking|stunning|boasts?|renowned|indelible|poignant|captivating|evocative|embark\w*|
navigat\w*|unlock\w*|unleash\w*|empower\w*|elevat\w*|amplif\w*|resonat\w*|evok\w*|captivat\w*|facilitat\w*|
spearhead\w*|realm|myriad|plethora|sphere|genuine\w*|honestly|truly|arguably|moreover|furthermore|
additionally|consequently"""
PHRASES = [
    r"it'?s important to (?:note|remember)", r"it is important to (?:note|remember)", r"worth noting",
    r"needless to say", r"plays? a (?:vital|key|significant) role", r"leaves? a lasting impact",
    r"in today'?s (?:fast-paced )?world", r"in the digital age", r"in an era of", r"ever-evolving",
    r"at the intersection of", r"when it comes to", r"shed(?:s|ding)? light on", r"pave(?:s|d)? the way",
    r"navigate the complexit", r"at the forefront of", r"stark reminder", r"here'?s the (?:kicker|thing|deal)",
    r"let'?s (?:break|unpack|dive)", r"think of it as", r"imagine a world", r"in conclusion", r"to sum up",
    r"at the end of the day", r"all in all", r"great question", r"i hope this helps", r"look no further",
]
SHAPES = {
    'em dash': r"—|&mdash;|&#8212;",
    'not X but Y': r"\bnot only\b[^.]{0,80}\bbut (?:also|\w+)|\bit'?s not [^.,;]{2,60}[,;] it'?s\b|\bnot just [^.,;]{2,50}[,;] (?:but )?\w+|\bless about [^.]{2,50} and more about\b",
    'emoji': "[\U0001F300-\U0001FAFF☀-➿⭐✅❌]",
}
WORD_RE = re.compile(r"\b(?:%s)\b" % re.sub(r"\s+", "", WORDS), re.I)
PHRASE_RE = re.compile("|".join(PHRASES), re.I)
SHAPE_RE = {k: re.compile(v, re.I) for k, v in SHAPES.items()}
BOLD_BULLET = re.compile(r"^\s*(?:[-*]|\d+\.)\s+\*\*[^*]+\*\*", re.M)

def text_of(path):
    s = path.read_text(encoding='utf-8', errors='ignore')
    if path.suffix == '.html':
        s = re.sub(r'(?is)<(script|style)\b.*?</\1>', ' ', s)
        s = re.sub(r'(?is)<!--.*?-->', ' ', s)
        keep = re.findall(r'(?:data-simple|aria-label|title|alt)="([^"]*)"', s)
        s = re.sub(r'(?s)<[^>]+>', ' ', s) + ' ' + ' '.join(keep)
        s = html.unescape(s) if '&mdash;' not in s else html.unescape(s.replace('&mdash;', '—'))
    else:
        s = re.sub(r'(?s)```.*?```', ' ', s)
    return s

def files():
    for item in SCAN:
        p = ROOT / item
        if p.is_file():
            yield p
        elif p.is_dir():
            for q in sorted(p.rglob('*')):
                if q.suffix in ('.md', '.html') and q.is_file():
                    yield q

def hits(path):
    s = text_of(path)
    out = []
    for m in WORD_RE.finditer(s): out.append(('word', m.group(0), m.start()))
    for m in PHRASE_RE.finditer(s): out.append(('phrase', m.group(0), m.start()))
    for k, r in SHAPE_RE.items():
        for m in r.finditer(s): out.append((k, m.group(0)[:40], m.start()))
    if path.suffix == '.md':
        for m in BOLD_BULLET.finditer(s): out.append(('bold-first bullet', m.group(0).strip()[:40], m.start()))
    return s, out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--show'); ap.add_argument('--fail-above', type=int)
    a = ap.parse_args()
    if a.show:
        p = ROOT / a.show
        s, hs = hits(p)
        for kind, hit, pos in sorted(hs, key=lambda h: h[2]):
            print(f"{kind:18} {hit!r:44} ...{s[max(0,pos-50):pos+60].strip()!r}")
        print(len(hs), 'hits'); return
    total, rows = 0, []
    for p in files():
        _, hs = hits(p)
        if hs: rows.append((len(hs), p.relative_to(ROOT)))
        total += len(hs)
    for n, p in sorted(rows, reverse=True): print(f"{n:5}  {p}")
    print(f"\n{total} hits in {len(rows)} files")
    if a.fail_above is not None and total > a.fail_above:
        print(f"FAIL: more than {a.fail_above}"); sys.exit(1)

main()
