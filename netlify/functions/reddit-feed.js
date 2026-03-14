// Netlify Function: Reddit proxy for air quality subreddits
// Serves pre-fetched data from Blobs (updated every 4h by scheduled-fetch)
// Falls back to live fetch if Blobs empty

const { getStore } = require('@netlify/blobs');

const SUBREDDITS = [
  { sub: 'india', query: 'air pollution OR AQI OR smog OR PM2.5' },
  { sub: 'delhi', query: 'pollution OR AQI OR smog OR air quality' },
  { sub: 'indianews', query: 'air pollution OR NCAP OR AQI' },
  { sub: 'environment', query: 'India air pollution' },
  { sub: 'worldnews', query: 'India air pollution' },
];

async function fetchSubreddit(sub, query, limit = 10) {
  const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(query)}&sort=new&restrict_sr=on&limit=${limit}&t=month`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'JanVayu:AirQualityMonitor:v25.0 (by /u/janvayu)',
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.data?.children || []).map(c => ({
      platform: 'reddit', sub,
      title: c.data.title, author: c.data.author,
      url: `https://reddit.com${c.data.permalink}`,
      score: c.data.score, comments: c.data.num_comments,
      created: c.data.created_utc * 1000,
      text: (c.data.selftext || '').substring(0, 200),
      thumbnail: c.data.thumbnail?.startsWith('http') ? c.data.thumbnail : null,
    }));
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
    const store = getStore({ name: "janvayu-feeds", consistency: "strong" });
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
