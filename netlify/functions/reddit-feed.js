// Netlify Function: Reddit proxy for air quality subreddits
// Serves pre-fetched data from Blobs (updated every 4h by scheduled-fetch)
// Falls back to live fetch if Blobs empty

const { getBlobStore } = require('./blob-store');

const SUBREDDITS = [
  { sub: 'india', query: 'air pollution OR AQI OR smog OR PM2.5' },
  { sub: 'delhi', query: 'pollution OR AQI OR smog OR air quality' },
  { sub: 'indianews', query: 'air pollution OR NCAP OR AQI' },
  { sub: 'environment', query: 'India air pollution' },
  { sub: 'worldnews', query: 'India air pollution' },
];

// Reddit's search.json returns 403 to datacentre IPs — every Netlify region is
// one, so this function returned zero posts with five 403s while the site
// claimed to carry a live feed. The Atom feed at the same path is served
// normally (verified 200 with 25 entries), so we read that instead. It carries
// less than the JSON did: no score, no comment count, no selftext. Those fields
// are dropped rather than faked.
function decodeEntities(s) {
  return String(s || '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function parseAtom(xml, sub) {
  const out = [];
  const entries = xml.split('<entry>').slice(1);
  for (const e of entries) {
    const pick = (tag) => {
      const m = e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? decodeEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim()) : '';
    };
    const linkM = e.match(/<link[^>]*href="([^"]+)"/);
    const title = pick('title');
    if (!title) continue;
    // The content block is escaped HTML; strip it to a short plain-text lead.
    const text = decodeEntities(pick('content')).replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ').trim().substring(0, 200);
    out.push({
      platform: 'reddit', sub,
      title,
      author: pick('name') || null,
      url: linkM ? linkM[1] : null,
      created: Date.parse(pick('updated') || pick('published')) || Date.now(),
      text,
      score: null, comments: null, thumbnail: null,
    });
  }
  return out;
}

async function fetchSubreddit(sub, query, limit = 10) {
  const url = `https://www.reddit.com/r/${sub}/search.rss?q=${encodeURIComponent(query)}` +
              `&sort=new&restrict_sr=on&limit=${limit}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'JanVayu:AirQualityMonitor:v26.6 (+https://janvayu.in)',
        'Accept': 'application/atom+xml, application/xml',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseAtom(await res.text(), sub).slice(0, limit);
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=600',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Try Blobs cache first
  try {
    const store = getBlobStore("janvayu-feeds");
    const cached = await store.get("reddit", { type: "json" });
    if (cached && cached.posts && cached.posts.length > 0) {
      const params = event.queryStringParameters || {};
      const filter = params.filter || 'all';
      let posts = cached.posts;
      if (filter !== 'all') {
        posts = posts.filter(p => p.sub === filter);
      }
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          ...cached,
          posts,
          count: posts.length,
          served_from: 'cache',
        }),
      };
    }
  } catch (e) {
    console.log('Blob read failed, falling back to live fetch:', e.message);
  }

  // Fallback: live fetch
  const params = event.queryStringParameters || {};
  const filter = params.filter || 'all';
  const subsToFetch = filter === 'all' ? SUBREDDITS : SUBREDDITS.filter(s => s.sub === filter);

  const allPosts = [];
  const errors = [];
  const results = await Promise.allSettled(subsToFetch.map(s => fetchSubreddit(s.sub, s.query)));
  results.forEach(r => {
    if (r.status === 'fulfilled') allPosts.push(...r.value);
    else errors.push(r.reason.message);
  });

  const seen = new Set();
  const unique = allPosts.filter(p => {
    const key = p.title.substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => b.created - a.created);

  return {
    statusCode: 200, headers,
    body: JSON.stringify({
      posts: unique.slice(0, 40),
      count: unique.length,
      source: 'reddit-proxy',
      served_from: 'live',
      errors: errors.length > 0 ? errors : undefined,
      fetched_at: new Date().toISOString(),
    }),
  };
};
