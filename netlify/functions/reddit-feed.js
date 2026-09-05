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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Firing all five subreddit requests at once got one through and four 429s:
// Reddit rate-limits per IP, and a Netlify region is one IP shared by everyone
// on it. So they go one at a time with a gap, and a 429 is retried once after
// a longer pause rather than counted as a failure. Whatever has not been
// fetched by the time budget is dropped — a partial feed beats a timeout.
const GAP_MS = 400;
const RETRY_MS = 1200;
const BUDGET_MS = 7000;

async function fetchSequential(subs) {
  const posts = [], errors = [];
  const deadline = Date.now() + BUDGET_MS;
  for (let i = 0; i < subs.length; i++) {
    if (Date.now() > deadline) {
      errors.push(`skipped ${subs.length - i} subreddit(s): out of time`);
      break;
    }
    if (i) await sleep(GAP_MS);
    const s = subs[i];
    try {
      posts.push(...await fetchSubreddit(s.sub, s.query));
    } catch (e) {
      if (/429/.test(e.message) && Date.now() + RETRY_MS < deadline) {
        await sleep(RETRY_MS);
        try { posts.push(...await fetchSubreddit(s.sub, s.query)); continue; }
        catch (e2) { errors.push(`${s.sub}: ${e2.message}`); continue; }
      }
      errors.push(`${s.sub}: ${e.message}`);
    }
  }
  return { posts, errors };
}

// Reddit's search treats the query as loose OR terms, so "air pollution OR AQI"
// matches on the word "air" and the feed filled up with things like "Air India
// names new CEO". Measured on r/india: of 25 posts the search returned, 6
// actually named air quality in the title. Matching on the body instead lets
// nearly everything through — a rant about leaving the country that mentions
// AQI once is a real sentiment but is not air-quality coverage, and shown under
// an unrelated headline it reads as a broken feed. So the title has to say it.
// The per-subreddit limit is raised to make up the difference: same one request.
const ABOUT_AIR = /\b(air quality|air pollution|aqi|smog|smoggy|pm ?2\.?5|pm ?10|stubble burn\w*|particulate|clean air|ncap|grap|polluted|pollution)\b/i;

function isAboutAir(post) {
  return ABOUT_AIR.test(post.title || '');
}

async function fetchSubreddit(sub, query, limit = 25) {
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
    return parseAtom(await res.text(), sub).filter(isAboutAir);
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
    // The cache can hold posts written before the relevance rule existed, or
    // by an older deploy. Applying the rule on the way out as well as on the
    // way in means a stale cache cannot put airline news on the page: the
    // serving path, not whatever happens to be stored, decides what belongs in
    // this feed. If nothing survives, fall through and fetch fresh.
    const kept = (cached && cached.posts || []).filter(isAboutAir);
    if (kept.length > 0) {
      const params = event.queryStringParameters || {};
      const filter = params.filter || 'all';
      let posts = kept;
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

  const { posts: allPosts, errors } = await fetchSequential(subsToFetch);

  const seen = new Set();
  const unique = allPosts.filter(p => {
    const key = p.title.substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => b.created - a.created);

  // Seed the cache with whatever the live path just managed to get. Without
  // this, every visitor who arrives before the next scheduled run repeats the
  // whole fan-out, and Reddit rate-limits the shared Netlify IP for all of
  // them. Only a full-feed fetch is stored — a filtered one would cache a
  // fraction of the feed as though it were the whole thing.
  if (filter === 'all' && unique.length) {
    try {
      const store = getBlobStore("janvayu-feeds");
      await store.setJSON("reddit", {
        posts: unique.slice(0, 40), count: unique.length,
        source: 'reddit-proxy', fetched_at: new Date().toISOString(),
        seeded_by: 'live-fallback',
      });
    } catch (e) {
      console.log('Could not seed the reddit cache:', e.message);
    }
  }

  // Nothing from the cache and nothing from the live fetch. Reddit rate-limits
  // datacentre IPs, so on Netlify that is the ordinary outcome rather than an
  // exceptional one. Say so, and hand back the live searches instead of an empty
  // list, the same way instagram-feed.js does. The client tries a direct browser
  // fetch before falling back to these, because a visitor's residential IP may
  // still be allowed where ours is not.
  if (unique.length === 0) {
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        posts: [],
        fallback: true,
        curated_links: SUBREDDITS.map(({ sub }) => ({
          sub,
          url: `https://www.reddit.com/r/${sub}/search/?q=${encodeURIComponent('air pollution OR AQI OR smog')}&restrict_sr=1&sort=new`,
        })),
        count: 0,
        source: 'reddit-proxy',
        served_from: 'live',
        errors: errors.length > 0 ? errors : undefined,
        fetched_at: new Date().toISOString(),
      }),
    };
  }

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
