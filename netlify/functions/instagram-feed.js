// Netlify Function: Instagram feed proxy via RSS Bridge instances
// Serves pre-fetched data from Blobs (updated every 4h by scheduled-fetch)
// Falls back to live RSS Bridge fetch if Blobs empty

const { getBlobStore } = require('./blob-store');

const RSSBRIDGE_INSTANCES = [
  'rss-bridge.org/bridge01',
  'rss-bridge.org/bridge02',
  'rss-bridge.org/bridge03',
  'wtf.roflcopter.fr/rss-bridge',
];

const INSTAGRAM_HASHTAGS = [
  'delhiairquality',
  'delhipollution',
  'delhismog',
  'airqualityindia',
  'cleanairindia',
  'stubbleburning',
];

const INSTAGRAM_ACCOUNTS = [
  'caborneq',       // CPCB related
  'cleanairfund',   // Clean Air Fund
];

async function fetchFromBridge(instance, params) {
  const query = new URLSearchParams(params).toString();
  const url = `https://${instance}/?${query}&format=Json`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'JanVayu/1.0 AirQualityMonitor' },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

function normalizeItems(data) {
  if (!data || !data.items) return [];
  return data.items.map(item => ({
    title: (item.title || '').replace(/<[^>]+>/g, '').trim(),
    content: (item.content_html || item.content_text || '')
      .replace(/<[^>]+>/g, '')
      .trim()
      .slice(0, 300),
    link: item.url || item.id || '',
    date: item.date_published || item.date_modified || '',
    author: item.author ? item.author.name : '',
    image: item.image || (item.attachments && item.attachments[0] ? item.attachments[0].url : ''),
    source: 'instagram',
  }));
}

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=1800',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Try Blobs cache first
  try {
    const store = getBlobStore("janvayu-feeds");
    const cached = await store.get("instagram", { type: "json" });
    if (cached && cached.posts && cached.posts.length > 0) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ ...cached, served_from: 'cache' }),
      };
    }
  } catch (e) {
    console.log('Blob read failed, falling back to live fetch:', e.message);
  }

  // Fallback: live RSS Bridge fetch
  const allItems = [];
  const errors = [];

  // Try each RSS Bridge instance
  for (const instance of RSSBRIDGE_INSTANCES) {
    if (allItems.length >= 10) break;

    // Try hashtag search
    for (const tag of INSTAGRAM_HASHTAGS.slice(0, 2)) {
      try {
        const data = await fetchFromBridge(instance, {
          action: 'display',
          bridge: 'InstagramBridge',
          context: 'Hashtag',
          h: tag,
        });
        const items = normalizeItems(data);
        allItems.push(...items);
        if (items.length > 0) {
          // This instance works - fetch remaining
          for (const t of INSTAGRAM_HASHTAGS.slice(2)) {
            try {
              const d = await fetchFromBridge(instance, {
                action: 'display',
                bridge: 'InstagramBridge',
                context: 'Hashtag',
                h: t,
              });
              allItems.push(...normalizeItems(d));
            } catch (e) { /* skip */ }
          }
          // Try account feeds
          for (const acct of INSTAGRAM_ACCOUNTS) {
            try {
              const d = await fetchFromBridge(instance, {
                action: 'display',
                bridge: 'InstagramBridge',
                context: 'Username',
                u: acct,
              });
              allItems.push(...normalizeItems(d));
            } catch (e) { /* skip */ }
          }
          break;
        }
      } catch (e) {
        errors.push(`${instance}/#${tag}: ${e.message}`);
      }
    }

    if (allItems.length > 0) break;
  }

  // Deduplicate
  const seen = new Set();
  const unique = allItems.filter(item => {
    const key = item.link || item.title.slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  // If no RSS bridge results, return curated links as fallback
  if (unique.length === 0) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        posts: [],
        fallback: true,
        curated_links: INSTAGRAM_HASHTAGS.map(tag => ({
          hashtag: `#${tag}`,
          url: `https://www.instagram.com/explore/tags/${tag}/`,
        })),
        count: 0,
        source: 'rss-bridge',
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      posts: unique.slice(0, 30),
      count: unique.length,
      source: 'rss-bridge',
      served_from: 'live',
      fetched_at: new Date().toISOString(),
    }),
  };
};
