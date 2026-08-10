#!/usr/bin/env python3
"""Generate the homepage's blog data from the blog itself.

`data/stories.json` was hand-maintained, so it drifted: nine posts, the newest
from 30 July, while six had been published in August. The homepage's "story of
the week" was rotating through a rotation that no longer contained this week.

The blog's own index table in `blog/README.md` already carries the date, title,
path and topic of every post. This reads it, pulls a blurb from the first real
paragraph of each post, and writes the file the homepage reads — so publishing
a post is enough to put it on the front page.

    python3 scripts/build-blog-index.py            # write data/stories.json
    python3 scripts/build-blog-index.py --check    # fail if it is out of date
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'blog' / 'README.md'
OUT = ROOT / 'data' / 'stories.json'

ROW = re.compile(r'^\|\s*(\d{1,2}\s+\w+\s+\d{4})\s*\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]*?)\s*\|', re.M)
MONTHS = {m: i for i, m in enumerate(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 1)}


def sort_key(date_text):
    """'9 Aug 2026' -> (2026, 8, 9), so the newest sorts first."""
    m = re.match(r'(\d{1,2})\s+(\w{3})\w*\s+(\d{4})', date_text)
    if not m:
        return (0, 0, 0)
    return (int(m.group(3)), MONTHS.get(m.group(2)[:3], 0), int(m.group(1)))


def blurb_for(rel_path):
    """The first paragraph that is prose, not a heading, byline, rule or figure."""
    p = ROOT / 'blog' / rel_path
    if not p.exists():
        return ''
    for raw in p.read_text(encoding='utf-8').split('\n\n'):
        line = raw.strip()
        if (not line or line.startswith(('#', '---', '<', '|', '!', '>', '*Published'))
                or line.startswith('**Published:')):
            continue
        text = re.sub(r'<[^>]+>', '', line)
        text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)      # links -> their text
        text = re.sub(r'[*_`]', '', text).replace('\n', ' ').strip()
        if len(text) < 40:
            continue
        # One sentence is enough for a card; two if the first is very short.
        parts = re.split(r'(?<=[.!?])\s+', text)
        out = parts[0]
        if len(out) < 90 and len(parts) > 1:
            out += ' ' + parts[1]
        return out if len(out) <= 240 else out[:237].rsplit(' ', 1)[0] + '…'
    return ''


def build():
    rows = ROW.findall(INDEX.read_text(encoding='utf-8'))
    if not rows:
        raise SystemExit('No post rows found in blog/README.md — has the table format changed?')
    stories = []
    for date_text, title, path, topic in rows:
        slug = path.replace('posts/', '').replace('.md', '')
        stories.append({
            'tag': topic.strip() or 'Blog',
            'title': title.strip(),
            'date': date_text.strip(),
            'blurb': blurb_for(path),
            'url': f'/blog/#/posts/{slug}',
        })
    stories.sort(key=lambda s: sort_key(s['date']), reverse=True)
    return {'stories': stories}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true', help='exit 1 if the file is out of date')
    args = ap.parse_args()

    data = build()
    text = json.dumps(data, ensure_ascii=False, indent=1) + '\n'

    if args.check:
        current = OUT.read_text(encoding='utf-8') if OUT.exists() else ''
        if current != text:
            print(f'{OUT.relative_to(ROOT)} is out of date — run scripts/build-blog-index.py')
            return 1
        print(f'{OUT.relative_to(ROOT)} matches the blog index ({len(data["stories"])} posts).')
        return 0

    OUT.write_text(text, encoding='utf-8')
    print(f'{len(data["stories"])} posts -> {OUT.relative_to(ROOT)}')
    for s in data['stories'][:3]:
        print(f'  {s["date"]:>12s}  {s["tag"]:14s} {s["title"][:52]}')
    missing = [s['title'] for s in data['stories'] if not s['blurb']]
    if missing:
        print(f'  no blurb found for {len(missing)}: {", ".join(missing[:3])}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
