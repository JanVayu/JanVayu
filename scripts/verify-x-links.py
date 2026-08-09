#!/usr/bin/env python3
"""Verify X links without an API key.

publish.twitter.com/oembed is the public embed endpoint: it answers 200 with the
post's real author and text for a post that exists, and 404 for one that does
not. Snowflake IDs carry their own creation time, so the date comes off the URL
itself. Between them, nothing gets published that was not checked.
"""
import json, re, ssl, os, sys, time, datetime, urllib.request, urllib.parse

EPOCH = 1288834974657
proxy = os.environ.get('HTTPS_PROXY')
h = []
if proxy: h.append(urllib.request.ProxyHandler({'https': proxy, 'http': proxy}))
ca = os.environ.get('SSL_CERT_FILE')
if ca: h.append(urllib.request.HTTPSHandler(context=ssl.create_default_context(cafile=ca)))
op = urllib.request.build_opener(*h)

def posted_at(url):
    m = re.search(r'/status/(\d+)', url)
    if not m: return None
    return datetime.datetime.fromtimestamp(((int(m.group(1)) >> 22) + EPOCH) / 1000, datetime.timezone.utc)

def verify(url):
    canon = url.replace('https://x.com/', 'https://twitter.com/').split('?')[0]
    api = 'https://publish.twitter.com/oembed?url=' + urllib.parse.quote(canon, safe='') + '&omit_script=1&dnt=true'
    try:
        with op.open(urllib.request.Request(api, headers={'User-Agent': 'JanVayu/26.6 (+https://janvayu.in)'}), timeout=25) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        return {'url': url, 'ok': False, 'why': f'HTTP {e.code}'}
    except Exception as e:
        return {'url': url, 'ok': False, 'why': str(e)[:60]}
    html_ = d.get('html', '')
    m = re.search(r'<p[^>]*>(.*?)</p>', html_, re.S)
    text = re.sub(r'<[^>]+>', '', m.group(1)) if m else ''
    text = (text.replace('&amp;', '&').replace('&#39;', "'").replace('&quot;', '"')
                .replace('&gt;', '>').replace('&lt;', '<')).strip()
    when = posted_at(url)
    return {'url': d.get('url', url), 'ok': True, 'author': d.get('author_name'),
            'handle': (d.get('author_url') or '').rsplit('/', 1)[-1],
            'date': when.strftime('%Y-%m-%d') if when else '', 'text': re.sub(r'\s+', ' ', text)}

if __name__ == '__main__':
    urls = [l.strip() for l in sys.stdin if l.strip()]
    out = []
    for i, u in enumerate(urls):
        if i: time.sleep(1)
        r = verify(u)
        out.append(r)
        if r['ok']:
            print(f"OK   {r['date']}  @{r['handle']:16s} {r['text'][:88]}")
        else:
            print(f"FAIL {r['why']:10s} {u}")
    json.dump([r for r in out if r['ok']], open('/tmp/xverified.json', 'w'), indent=1, ensure_ascii=False)
