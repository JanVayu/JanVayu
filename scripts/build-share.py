#!/usr/bin/env python3
"""Make every page on the site share as itself.

Before October 2026 a link to anything but the homepage previewed badly or not
at all. Eight standalone pages had no Open Graph image, only the homepage had a
Twitter card, and the ones that had an image all used the homepage's, so a
link to /pm25/ or /delhi/ showed the homepage card in WhatsApp. The blog was
worse: Docsify builds a post in the browser from a hash route
(/blog/#/posts/<file>), and a fragment never reaches a server or a link
previewer, so every one of the 48 posts shared as the blog's front page and no
search engine could index a single post.

This script does three things, all from files already in the repository:

  1. Writes the canonical, Open Graph and Twitter tags of each standalone page
     between `<!-- share-meta:start -->` and `<!-- share-meta:end -->`, and
     removes any such tag outside that block, so a page cannot carry two
     og:image tags that disagree.
  2. Writes one static page per blog post at /blog/<slug>/, rendered from the
     post's Markdown, with its own title, description, card and JSON-LD.
     These are the URLs to share and the URLs a search engine can index; the
     Docsify reader at /blog/ is unchanged.
  3. Writes data/share-cards.json, the text of every preview card. The cards
     themselves are JPEGs drawn by scripts/build-og-cards.mjs, which needs a
     browser and is therefore run by hand, not in CI.

    python3 scripts/build-share.py            # write
    python3 scripts/build-share.py --check    # fail if anything is out of date

Needs the `markdown` package (pip install markdown==3.7).
"""
import argparse
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

import markdown

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://www.janvayu.in'
POSTS = ROOT / 'blog' / 'posts'
INDEX = ROOT / 'blog' / 'README.md'
CARDS_JSON = ROOT / 'data' / 'share-cards.json'

START, END = '<!-- share-meta:start -->', '<!-- share-meta:end -->'

# Each standalone page: its file, its URL, what a preview says, and its card.
# The card text carries no live figure on purpose: a PNG is cached by every
# platform that has seen the link, so a number on it would go stale and stay
# stale where nobody can correct it.
POLLUTANTS = [
    ('pm25', 'PM2.5', 'Fine particles that reach deep into the lungs and the bloodstream.'),
    ('pm10', 'PM10', 'Dust, pollen and construction debris that reach the upper airways.'),
    ('co', 'CO', 'A gas from incomplete burning that cuts the blood’s oxygen supply.'),
    ('no2', 'NO₂', 'A gas from high-temperature combustion, and a marker of traffic.'),
    ('so2', 'SO₂', 'A gas from burning sulphur-bearing fuel, mainly coal.'),
    ('o3', 'O₃', 'A gas that forms in sunlight from NO₂ and volatile compounds.'),
]

PAGES = []
for slug, name, line in POLLUTANTS:
    PAGES.append({
        'file': f'{slug}/index.html', 'url': f'/{slug}/', 'type': 'article',
        'title': f'{name} in India | JanVayu',
        'description': f'{line} Where {name} comes from, what it does to health, and how India’s standard compares with the WHO guideline.',
        'card': {'name': slug, 'kicker': 'Pollutant guide', 'title': f'{name} in India',
                 'sub': 'Sources, health effects, and India’s standard against the WHO guideline'},
    })
PAGES += [
    {'file': 'delhi/index.html', 'url': '/delhi/', 'type': 'article',
     'title': 'Delhi this winter: the plans, the dates and the money | JanVayu',
     'description': 'Promises, dates and money for Delhi’s 2026-27 winter in one place, and what the public record does not yet show.',
     'card': {'name': 'delhi', 'kicker': 'Delhi', 'title': 'Delhi this winter',
              'sub': 'The plans, the dates and the money, with the source for each'}},
    {'file': 'ask/index.html', 'url': '/ask/', 'type': 'website',
     'title': 'Ask JanVayu',
     'description': 'Ask any question about air quality in India. Live readings, health advice, and the record behind each answer.',
     'card': {'name': 'ask', 'kicker': 'Ask JanVayu', 'title': 'Ask a question about India’s air',
              'sub': 'Live readings, health advice, and the source behind each answer'}},
    {'file': 'blog/index.html', 'url': '/blog/', 'type': 'website',
     'title': 'JanVayu Blog',
     'description': 'Evidence-based analysis of India’s air quality: data, research, policy and accountability, with the source for every figure.',
     'card': {'name': 'blog', 'kicker': 'JanVayu blog', 'title': 'Analysis of India’s air, with sources',
              'sub': 'Data, research, policy and accountability'}},
    {'file': 'downloads/index.html', 'url': '/downloads/', 'type': 'website',
     'title': 'Downloads | JanVayu',
     'description': 'Reports, briefs and presentations on India’s air quality from JanVayu, free to download.',
     'card': {'name': 'downloads', 'kicker': 'Downloads', 'title': 'Reports, briefs and presentations',
              'sub': 'On India’s air quality, free to download'}},
    {'file': 'status/index.html', 'url': '/status/', 'type': 'website',
     'title': 'JanVayu system status',
     'description': 'Live operational status of the Ask JanVayu chatbot, the live AQI data and the other air-quality services.',
     'card': {'name': 'status', 'kicker': 'System status', 'title': 'Is JanVayu working right now?',
              'sub': 'Ask JanVayu, the live AQI feed and the other services'}},
    {'file': 'walkthrough/index.html', 'url': '/walkthrough/', 'type': 'website',
     'title': 'JanVayu walkthrough: a guided tour of the platform',
     'description': 'A guided tour of India’s citizen air-quality platform in two lengths, a short overview and a section-by-section deck.',
     'card': {'name': 'walkthrough', 'kicker': 'Walkthrough', 'title': 'A guided tour of JanVayu',
              'sub': 'A short overview and a full deck'}},
    {'file': 'walkthrough/deck.html', 'url': '/walkthrough/deck.html', 'type': 'website',
     'title': 'JanVayu walkthrough deck',
     'description': 'A short walkthrough of JanVayu, India’s citizen air-quality platform.',
     'card': {'name': 'walkthrough'}},
    {'file': 'walkthrough/full.html', 'url': '/walkthrough/full.html', 'type': 'website',
     'title': 'JanVayu full walkthrough deck',
     'description': 'The full walkthrough of JanVayu, with a slide for every section of the platform.',
     'card': {'name': 'walkthrough'}},
]

STRAY = re.compile(
    r'[ \t]*<(?:meta\s+(?:property|name)="(?:og:[^"]+|twitter:[^"]+)"[^>]*'
    r'|link\s+rel="canonical"[^>]*)>[ \t]*\n?', re.I)


def esc(s):
    return html.escape(s, quote=True)


def card_url(name):
    return f'{SITE}/og/{name}.jpg'


def meta_block(url, title, description, image, alt, kind, extra=''):
    full = SITE + url
    lines = [
        START,
        f'<link rel="canonical" href="{full}">',
        '<meta property="og:site_name" content="JanVayu">',
        '<meta property="og:locale" content="en_IN">',
        f'<meta property="og:type" content="{kind}">',
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(description)}">',
        f'<meta property="og:url" content="{full}">',
        f'<meta property="og:image" content="{image}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{esc(alt)}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(title)}">',
        f'<meta name="twitter:description" content="{esc(description)}">',
        f'<meta name="twitter:image" content="{image}">',
        f'<meta name="twitter:image:alt" content="{esc(alt)}">',
    ]
    if extra:
        lines.append(extra)
    lines.append(END)
    return '\n'.join(lines)


def apply_block(text, block):
    if START in text:
        a = text.index(START)
        b = text.index(END) + len(END)
        text = text[:a] + '\x00' + text[b:]
    else:
        # First run: put the block where the old tags were, or after <title>.
        m = STRAY.search(text)
        pos = m.start() if m else text.index('</title>') + len('</title>\n')
        text = text[:pos] + '\x00\n' + text[pos:]
    head_end = text.index('</head>')
    head = STRAY.sub('', text[:head_end])
    text = head + text[head_end:]
    return text.replace('\x00', block)


# --- Blog posts -------------------------------------------------------------

def post_topics():
    rows = re.findall(r'^\|\s*[^|]+\|\s*\[[^\]]+\]\(posts/([^)]+)\.md\)\s*\|\s*([^|]*?)\s*\|',
                      INDEX.read_text(encoding='utf-8'), re.M)
    return {slug: topic for slug, topic in rows}


MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December']


def post_date(slug, text):
    m = re.search(r'\*\*Published:\*\*\s*(\d{1,2})\s+(\w+)\s+(\d{4})', text)
    if m:
        mon = next((i for i, n in enumerate(MONTHS, 1) if n.startswith(m.group(2)[:3])), None)
        if mon:
            return f'{m.group(3)}-{mon:02d}-{int(m.group(1)):02d}'
    return slug[:10]


def human_date(iso):
    y, m, d = iso.split('-')
    return f'{int(d)} {MONTHS[int(m) - 1]} {y}'


def blurb(text):
    for raw in text.split('\n\n'):
        line = raw.strip()
        if (not line or line.startswith(('#', '---', '<', '|', '!', '>', '*Published', '**Published:'))):
            continue
        t = re.sub(r'<[^>]+>', '', line)
        t = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', t)
        t = re.sub(r'[*_`]', '', t).replace('\n', ' ').strip()
        if len(t) < 40:
            continue
        return t if len(t) <= 200 else t[:197].rsplit(' ', 1)[0] + '…'
    return 'Evidence-based analysis of India’s air quality from JanVayu.'


def fix_links(body_md, slugs):
    def repl(m):
        target = m.group(2)
        t = target
        t = re.sub(r'^(?:/blog/)?#/posts/', '', t)
        t = re.sub(r'^(?:/blog/)?posts/', '', t)
        t = re.sub(r'\.md(#.*)?$', lambda x: x.group(1) or '', t)
        anchor = ''
        if '#' in t:
            t, anchor = t.split('#', 1)
            anchor = '#' + anchor
        if t in slugs:
            return f'{m.group(1)}(/blog/{t}/{anchor})'
        return m.group(0)
    return re.sub(r'(\[[^\]]*\])\(([^)\s]+)\)', repl, body_md)


def share_links(url, title):
    text = quote(f'{title}\n{url}')
    return (
        '<div class="jv-share" data-share-bar>\n'
        '  <span class="jv-share-label">Share</span>\n'
        f'  <a href="https://wa.me/?text={text}" target="_blank" rel="noopener">WhatsApp</a>\n'
        f'  <a href="https://twitter.com/intent/tweet?text={quote(title)}&amp;url={quote(url)}" target="_blank" rel="noopener">X</a>\n'
        f'  <a href="https://www.linkedin.com/sharing/share-offsite/?url={quote(url)}" target="_blank" rel="noopener">LinkedIn</a>\n'
        f'  <a href="https://t.me/share/url?url={quote(url)}&amp;text={quote(title)}" target="_blank" rel="noopener">Telegram</a>\n'
        f'  <a href="mailto:?subject={quote(title)}&amp;body={quote(url)}">Email</a>\n'
        '</div>'
    )


POST_CSS = """  .post-page { max-width: 760px; }
  .post-page .crumb { font-size: 0.85rem; margin: 20px 0 0; }
  .post-page .crumb a { color: var(--accent); }
  .post-page h1 { font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.6rem); line-height: 1.15; margin: 16px 0 12px; }
  .post-page h2 { font-family: var(--serif); font-size: 1.45rem; margin: 36px 0 12px; }
  .post-page h3 { font-size: 1.1rem; margin: 24px 0 8px; }
  .post-page p, .post-page li { line-height: 1.75; }
  .post-page p { margin: 0 0 1em; }
  .post-page a { color: var(--accent); }
  .post-page img { max-width: 100%; height: auto; }
  .post-page blockquote { margin: 16px 0; padding: 4px 16px; border-left: 3px solid var(--border); color: var(--text-2); }
  .post-page .tbl { overflow-x: auto; margin: 12px 0; }
  .post-page table { border-collapse: collapse; font-size: 0.9rem; width: 100%; }
  .post-page th, .post-page td { padding: 6px 10px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
  .post-page code { font-family: var(--mono); font-size: 0.9em; }
  .post-page pre { overflow-x: auto; padding: 12px; background: var(--bg-section); }
  .post-foot { padding: 28px 0; color: var(--text-3); font-size: 0.85rem; }
  .post-foot a { color: var(--accent); }"""


def stamp():
    v = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']
    major, month, patch = v.split('.')
    return f'20{major}{month.zfill(2)}{patch.zfill(2)}'


def post_page(slug, src, topic, slugs):
    lines = src.split('\n')
    title_line = next((l for l in lines if l.startswith('# ')), '# ' + slug)
    title = title_line[2:].strip()
    date = post_date(slug, src)
    desc = blurb(src)
    body_md = src.replace(title_line, '', 1)
    body_md = fix_links(body_md, slugs)
    body = markdown.markdown(body_md, extensions=['tables', 'fenced_code', 'sane_lists'],
                             output_format='html')
    body = body.replace('<table>', '<div class="tbl"><table>').replace('</table>', '</table></div>')
    url = f'{SITE}/blog/{slug}/'
    alt = f'JanVayu blog: {title}'
    ld = {
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        'headline': title, 'description': desc, 'datePublished': date,
        'author': {'@type': 'Organization', 'name': 'JanVayu'},
        'publisher': {'@type': 'Organization', 'name': 'JanVayu',
                      'logo': {'@type': 'ImageObject', 'url': f'{SITE}/og-image.png'}},
        'image': card_url(f'blog/{slug}'), 'mainEntityOfPage': url,
        'inLanguage': 'en-IN',
    }
    if topic:
        ld['articleSection'] = topic
    extra = (f'<meta property="article:published_time" content="{date}">\n'
             f'<script type="application/ld+json">\n{json.dumps(ld, ensure_ascii=False, indent=2)}\n</script>')
    block = meta_block(f'/blog/{slug}/', title, desc, card_url(f'blog/{slug}'), alt, 'article', extra)
    v = stamp()
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Generated by scripts/build-share.py from blog/posts/{slug}.md. Edit the Markdown, then re-run the script. -->
<title>{esc(title)} | JanVayu Blog</title>
<meta name="description" content="{esc(desc)}">
{block}
<link rel="icon" href="/favicon.svg">
<link rel="stylesheet" href="/styles.css?v={v}">
<script>try{{if(localStorage.getItem('janvayu-theme')==='dark')document.documentElement.setAttribute('data-theme','dark');}}catch(e){{}}</script>
<script src="/js/chrome.js?v={v}" defer></script>
<style>
{POST_CSS}
</style>
</head>
<body data-jv-chrome>
<main class="container post-page" id="main-content">
<p class="crumb"><a href="/blog/">JanVayu Blog</a>{(' &middot; ' + esc(topic)) if topic else ''}</p>
<h1>{esc(title)}</h1>
<article>
{body}
</article>
{share_links(url, title)}
<footer class="post-foot">
<p><a href="/blog/">All posts</a> &middot; <a href="/blog/#/posts/{slug}">Open in the blog reader</a> &middot; <a href="/">JanVayu dashboard</a></p>
<p>Published {human_date(date)}. Text licensed CC BY-NC-SA 4.0.</p>
<p lang="en">Website developed by Varna Sri Raman at <a href="https://www.pinpointventures.in" target="_blank" rel="noopener">Pinpoint Ventures</a>.</p>
</footer>
</main>
</body>
</html>
"""
    card = {'name': f'blog/{slug}', 'kicker': f'JanVayu blog · {human_date(date)}', 'title': title,
            'sub': topic or ''}
    return page, card, {'slug': slug, 'date': date, 'title': title}


# --- Build ------------------------------------------------------------------

def build():
    out = {}
    cards = {}
    for p in PAGES:
        path = ROOT / p['file']
        text = path.read_text(encoding='utf-8')
        name = p['card']['name']
        alt = f"JanVayu: {p['card'].get('title') or p['title']}"
        if 'title' not in p['card']:
            alt = f"JanVayu: {next(x for x in PAGES if x['card'].get('name') == name and 'title' in x['card'])['card']['title']}"
        block = meta_block(p['url'], p['title'], p['description'], card_url(name), alt, p['type'])
        out[path] = apply_block(text, block)
        if 'title' in p['card']:
            cards[name] = p['card']

    topics = post_topics()
    slugs = sorted(f.stem for f in POSTS.glob('*.md'))
    posts = []
    for slug in slugs:
        src = (POSTS / f'{slug}.md').read_text(encoding='utf-8')
        page, card, meta = post_page(slug, src, topics.get(slug, ''), set(slugs))
        out[ROOT / 'blog' / slug / 'index.html'] = page
        cards[card['name']] = card
        posts.append(meta)

    manifest = {
        '_note': 'Written by scripts/build-share.py. Cards are drawn from this by scripts/build-og-cards.mjs.',
        'cards': [cards[k] for k in sorted(cards)],
        'posts': sorted(posts, key=lambda x: (x['date'], x['slug']), reverse=True),
    }
    out[CARDS_JSON] = json.dumps(manifest, ensure_ascii=False, indent=2) + '\n'
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()
    out = build()
    stale = []
    for path, content in out.items():
        cur = path.read_text(encoding='utf-8') if path.exists() else None
        if cur != content:
            stale.append(path.relative_to(ROOT))
            if not args.check:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding='utf-8')
    # A post deleted from blog/posts must take its static page with it.
    live = {p.name for p in POSTS.glob('*.md')}
    for d in (ROOT / 'blog').iterdir():
        if d.is_dir() and re.match(r'\d{4}-\d{2}-\d{2}-', d.name) and f'{d.name}.md' not in live:
            stale.append(d.relative_to(ROOT))
            if not args.check:
                for f in d.iterdir():
                    f.unlink()
                d.rmdir()
    if args.check:
        if stale:
            print('Out of date (run python3 scripts/build-share.py):')
            for s in stale:
                print('  ', s)
            sys.exit(1)
        print(f'OK: {len(out) - 1} pages carry current share tags.')
    else:
        print(f'Wrote {len(stale)} of {len(out)} files.')


if __name__ == '__main__':
    main()
