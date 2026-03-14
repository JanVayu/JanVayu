// Netlify Function: Twitter/X feed proxy via Nitter RSS instances
// Serves pre-fetched data from Blobs (updated every 4h by scheduled-fetch)
// Falls back to live Nitter fetch if Blobs empty

const { getBlobStore } = require('./blob-store');

const NITTER_INSTANCES = [
  'nitter.privacydev.net',
  'nitter.poast.org',
  'nitter.woodland.cafe',
  'nitter.esmailelbob.xyz',
  'nitter.tux.pizza',
];

const HASHTAGS = [
  'DelhiAirQuality',
  'DelhiPollution',
  'DelhiSmog',
  'AirQualityIndex',
  'DelhiAir',
  'StubbleBurning',
  'CleanAirIndia',
];

const SEARCH_QUERIES = [
  'delhi+air+quality',
  'delhi+pollution+AQI',
  'india+air+quality',
];

async function fetchFromNitter(instance, path) {
  const url = `https://${instance}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'JanVayu/1.0 AirQualityMonitor' },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

function parseRSSItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const title = (content.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                   content.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (content.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const pubDate = (content.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const description = (content.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                         content.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';
    const creator = (content.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/) || [])[1] || '';

    // Convert nitter link back to twitter
    const twitterLink = link.replace(/https?:\/\/[^/]+\//, 'https://x.com/');

    items.push({
      text: title.replace(/<[^>]+>/g, '').trim(),
      description: description.replace(/<[^>]+>/g, '').trim(),
      link: twitterLink,
      date: pubDate,
      author: creator.replace('@', ''),
      source: 'twitter',
    });
  }
  return items;
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
    const cached = await store.get("twitter", { type: "json" });
    if (cached && cached.posts && cached.posts.length > 0) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ ...cached, served_from: 'cache' }),
      };
    }
  } catch (e) {
    console.log('Blob read failed, falling back to live fetch:', e.message);
  }

  // Fallback: live Nitter fetch
  const allItems = [];
  const errors = [];

  // Try each Nitter instance until we get results
  for (const instance of NITTER_INSTANCES) {
    if (allItems.length >= 10) break;

    // Try hashtag feeds
    for (const tag of HASHTAGS.slice(0, 3)) {
      if (allItems.length >= 15) break;
      try {
        const xml = await fetchFromNitter(instance, `/search/rss?f=tweets&q=%23${tag}`);
        const items = parseRSSItems(xml);
        allItems.push(...items);
        if (items.length > 0) break; // This instance works, use it
      } catch (e) {
        errors.push(`${instance}/#${tag}: ${e.message}`);
      }
    }

    if (allItems.length > 0) {
      // This instance works - fetch remaining hashtags from it
      for (const tag of HASHTAGS.slice(3)) {
        try {
          const xml = await fetchFromNitter(instance, `/search/rss?f=tweets&q=%23${tag}`);
          allItems.push(...parseRSSItems(xml));
        } catch (e) { /* skip */ }
      }
      // Also try search queries
      for (const q of SEARCH_QUERIES) {
        try {
          const xml = await fetchFromNitter(instance, `/search/rss?f=tweets&q=${q}`);
          allItems.push(...parseRSSItems(xml));
        } catch (e) { /* skip */ }
      }
      break; // Don't try other instances
    }
  }

  // Deduplicate by link
  const seen = new Set();
  const unique = allItems.filter(item => {
    if (seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });

  // Sort by date, newest first
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      posts: unique.slice(0, 30),
      count: unique.length,
      source: 'nitter-rss',
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      served_from: 'live',
      fetched_at: new Date().toISOString(),
    }),
  };
};
