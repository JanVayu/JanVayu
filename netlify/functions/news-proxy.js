// Netlify Function: Google News RSS proxy for air quality news
// Google News RSS doesn't support CORS, so we proxy it here

const NEWS_FEEDS = [
  {
    name: 'Delhi Air Quality',
    url: 'https://news.google.com/rss/search?q=delhi+air+quality&hl=en-IN&gl=IN&ceid=IN:en',
  },
  {
    name: 'India Pollution',
    url: 'https://news.google.com/rss/search?q=india+pollution+AQI&hl=en-IN&gl=IN&ceid=IN:en',
  },
  {
    name: 'CPCB Air Quality',
    url: 'https://news.google.com/rss/search?q=CPCB+air+quality&hl=en-IN&gl=IN&ceid=IN:en',
  },
  {
    name: 'Stubble Burning',
    url: 'https://news.google.com/rss/search?q=stubble+burning+pollution&hl=en-IN&gl=IN&ceid=IN:en',
  },
  {
    name: 'Clean Air India',
    url: 'https://news.google.com/rss/search?q=clean+air+india+NCAP&hl=en-IN&gl=IN&ceid=IN:en',
  },
];

function parseNewsRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const title = (content.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (content.match(/<link\/>\s*([\s\S]*?)(?=\s*<)/) ||
                  content.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const pubDate = (content.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const source = (content.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';
    const description = (content.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';

    items.push({
      title: title.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(),
      link: link.trim(),
      date: pubDate,
      source: source.replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
      snippet: description
        .replace(/<!\[CDATA\[|\]\]>/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .trim()
        .slice(0, 200),
    });
  }
  return items;
}

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=900',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Allow filtering by category via query param
  const params = event.queryStringParameters || {};
  const category = params.category || 'all';

  const feedsToFetch = category === 'all'
    ? NEWS_FEEDS
    : NEWS_FEEDS.filter(f => f.name.toLowerCase().includes(category.toLowerCase()));

  const allItems = [];
  const errors = [];

  const results = await Promise.allSettled(
    feedsToFetch.map(async (feed) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(feed.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'JanVayu/1.0 AirQualityMonitor' },
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        return { feed: feed.name, items: parseNewsRSS(xml) };
      } catch (e) {
        clearTimeout(timeout);
        throw new Error(`${feed.name}: ${e.message}`);
      }
    })
  );

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      result.value.items.forEach(item => {
        item.category = result.value.feed;
        allItems.push(item);
      });
    } else {
      errors.push(result.reason.message);
    }
  });

  // Deduplicate by title similarity
  const seen = new Set();
  const unique = allItems.filter(item => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      articles: unique.slice(0, 50),
      count: unique.length,
      categories: NEWS_FEEDS.map(f => f.name),
      errors: errors.length > 0 ? errors : undefined,
      cached_until: new Date(Date.now() + 900000).toISOString(),
    }),
  };
};
