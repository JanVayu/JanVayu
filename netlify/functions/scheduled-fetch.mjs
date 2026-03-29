// Netlify Scheduled Function: Fetches all social/news feeds every 4 hours
// Stores results in Netlify Blobs so API functions serve cached data instantly
import { getStore } from "@netlify/blobs";

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

// ── Reddit config ──
const SUBREDDITS = [
  { sub: 'india', query: 'air pollution OR AQI OR smog OR PM2.5' },
  { sub: 'delhi', query: 'pollution OR AQI OR smog OR air quality' },
  { sub: 'indianews', query: 'air pollution OR NCAP OR AQI' },
  { sub: 'environment', query: 'India air pollution' },
  { sub: 'worldnews', query: 'India air pollution' },
];

// ── Twitter/Nitter config ──
const NITTER_INSTANCES = [
  'nitter.privacydev.net',
  'nitter.poast.org',
  'nitter.woodland.cafe',
  'nitter.esmailelbob.xyz',
  'nitter.tux.pizza',
];
const HASHTAGS = [
  'DelhiAirQuality', 'DelhiPollution', 'DelhiSmog',
  'AirQualityIndex', 'DelhiAir', 'StubbleBurning', 'CleanAirIndia',
];
const SEARCH_QUERIES = ['delhi+air+quality', 'delhi+pollution+AQI', 'india+air+quality'];

// ── News config ──
const NEWS_FEEDS = [
  { name: 'Delhi Air Quality', url: 'https://news.google.com/rss/search?q=delhi+air+quality&hl=en-IN&gl=IN&ceid=IN:en' },
  { name: 'India Pollution', url: 'https://news.google.com/rss/search?q=india+pollution+AQI&hl=en-IN&gl=IN&ceid=IN:en' },
  { name: 'CPCB Air Quality', url: 'https://news.google.com/rss/search?q=CPCB+air+quality&hl=en-IN&gl=IN&ceid=IN:en' },
  { name: 'Stubble Burning', url: 'https://news.google.com/rss/search?q=stubble+burning+pollution&hl=en-IN&gl=IN&ceid=IN:en' },
  { name: 'Clean Air India', url: 'https://news.google.com/rss/search?q=clean+air+india+NCAP&hl=en-IN&gl=IN&ceid=IN:en' },
];

// ── Instagram config ──
const RSSBRIDGE_INSTANCES = [
  'rss-bridge.org/bridge01', 'rss-bridge.org/bridge02',
  'rss-bridge.org/bridge03', 'wtf.roflcopter.fr/rss-bridge',
];
const INSTAGRAM_HASHTAGS = [
  'delhiairquality', 'delhipollution', 'delhismog',
  'airqualityindia', 'cleanairindia', 'stubbleburning',
];
const INSTAGRAM_ACCOUNTS = ['caborneq', 'cleanairfund'];

// ── Helpers ──
async function fetchWithTimeout(url, opts = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

// ── Reddit fetcher ──
async function fetchReddit() {
  const allPosts = [];
  const errors = [];
  const results = await Promise.allSettled(
    SUBREDDITS.map(async ({ sub, query }) => {
      const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(query)}&sort=new&restrict_sr=on&limit=10&t=month`;
      const res = await fetchWithTimeout(url, {
        headers: {
          'User-Agent': 'JanVayu:AirQualityMonitor:v25.0 (by /u/janvayu)',
          'Accept': 'application/json',
        },
      });
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
    })
  );
  results.forEach(r => {
    if (r.status === 'fulfilled') allPosts.push(...r.value);
    else errors.push(r.reason.message);
  });
  // Deduplicate
  const seen = new Set();
  const unique = allPosts.filter(p => {
    const key = p.title.substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => b.created - a.created);
  return { posts: unique.slice(0, 40), count: unique.length, errors };
}

// ── Twitter/Nitter fetcher ──
function parseRSSItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const c = match[1];
    const title = (c.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || c.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (c.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const pubDate = (c.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const desc = (c.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || c.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';
    const creator = (c.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/) || [])[1] || '';
    items.push({
      text: title.replace(/<[^>]+>/g, '').trim(),
      description: desc.replace(/<[^>]+>/g, '').trim(),
      link: link.replace(/https?:\/\/[^/]+\//, 'https://x.com/'),
      date: pubDate, author: creator.replace('@', ''), source: 'twitter',
    });
  }
  return items;
}

async function fetchTwitter() {
  const allItems = [];
  const errors = [];
  for (const instance of NITTER_INSTANCES) {
    if (allItems.length >= 10) break;
    for (const tag of HASHTAGS.slice(0, 3)) {
      if (allItems.length >= 15) break;
      try {
        const res = await fetchWithTimeout(`https://${instance}/search/rss?f=tweets&q=%23${tag}`, {
          headers: { 'User-Agent': 'JanVayu/1.0 AirQualityMonitor' },
        }, 5000);
        const xml = await res.text();
        const items = parseRSSItems(xml);
        allItems.push(...items);
        if (items.length > 0) break;
      } catch (e) {
        errors.push(`${instance}/#${tag}: ${e.message}`);
      }
    }
    if (allItems.length > 0) {
      for (const tag of HASHTAGS.slice(3)) {
        try {
          const res = await fetchWithTimeout(`https://${instance}/search/rss?f=tweets&q=%23${tag}`, {
            headers: { 'User-Agent': 'JanVayu/1.0 AirQualityMonitor' },
          }, 5000);
          allItems.push(...parseRSSItems(await res.text()));
        } catch (e) { /* skip */ }
      }
      for (const q of SEARCH_QUERIES) {
        try {
          const res = await fetchWithTimeout(`https://${instance}/search/rss?f=tweets&q=${q}`, {
            headers: { 'User-Agent': 'JanVayu/1.0 AirQualityMonitor' },
          }, 5000);
          allItems.push(...parseRSSItems(await res.text()));
        } catch (e) { /* skip */ }
      }
      break;
    }
  }
  const seen = new Set();
  const unique = allItems.filter(item => {
    if (seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { posts: unique.slice(0, 30), count: unique.length, errors };
}

// ── News fetcher ──
function parseNewsRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const c = match[1];
    const title = (c.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (c.match(/<link\/>\s*([\s\S]*?)(?=\s*<)/) || c.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const pubDate = (c.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const source = (c.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';
    const desc = (c.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';
    items.push({
      title: title.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(),
      link: link.trim(), date: pubDate,
      source: source.replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
      snippet: desc.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim().slice(0, 200),
    });
  }
  return items;
}

async function fetchNews() {
  const allItems = [];
  const errors = [];
  const results = await Promise.allSettled(
    NEWS_FEEDS.map(async (feed) => {
      const res = await fetchWithTimeout(feed.url, {
        headers: { 'User-Agent': 'JanVayu/1.0 AirQualityMonitor' },
      });
      return { feed: feed.name, items: parseNewsRSS(await res.text()) };
    })
  );
  results.forEach(r => {
    if (r.status === 'fulfilled') {
      r.value.items.forEach(item => { item.category = r.value.feed; allItems.push(item); });
    } else errors.push(r.reason.message);
  });
  const seen = new Set();
  const unique = allItems.filter(item => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { articles: unique.slice(0, 50), count: unique.length, categories: NEWS_FEEDS.map(f => f.name), errors };
}

// ── Instagram fetcher ──
async function fetchInstagram() {
  const allItems = [];
  const errors = [];
  for (const instance of RSSBRIDGE_INSTANCES) {
    if (allItems.length >= 10) break;
    for (const tag of INSTAGRAM_HASHTAGS.slice(0, 2)) {
      try {
        const params = new URLSearchParams({ action: 'display', bridge: 'InstagramBridge', context: 'Hashtag', h: tag, format: 'Json' });
        const res = await fetchWithTimeout(`https://${instance}/?${params}`);
        const data = await res.json();
        const items = (data.items || []).map(item => ({
          title: (item.title || '').replace(/<[^>]+>/g, '').trim(),
          content: (item.content_html || item.content_text || '').replace(/<[^>]+>/g, '').trim().slice(0, 300),
          link: item.url || item.id || '', date: item.date_published || '',
          author: item.author ? item.author.name : '',
          image: item.image || (item.attachments?.[0]?.url || ''), source: 'instagram',
        }));
        allItems.push(...items);
        if (items.length > 0) {
          for (const t of INSTAGRAM_HASHTAGS.slice(2)) {
            try {
              const p = new URLSearchParams({ action: 'display', bridge: 'InstagramBridge', context: 'Hashtag', h: t, format: 'Json' });
              const r = await fetchWithTimeout(`https://${instance}/?${p}`);
              const d = await r.json();
              allItems.push(...(d.items || []).map(i => ({
                title: (i.title || '').replace(/<[^>]+>/g, '').trim(),
                content: (i.content_html || '').replace(/<[^>]+>/g, '').trim().slice(0, 300),
                link: i.url || '', date: i.date_published || '',
                author: i.author?.name || '', image: i.image || '', source: 'instagram',
              })));
            } catch (e) { /* skip */ }
          }
          for (const acct of INSTAGRAM_ACCOUNTS) {
            try {
              const p = new URLSearchParams({ action: 'display', bridge: 'InstagramBridge', context: 'Username', u: acct, format: 'Json' });
              const r = await fetchWithTimeout(`https://${instance}/?${p}`);
              const d = await r.json();
              allItems.push(...(d.items || []).map(i => ({
                title: (i.title || '').replace(/<[^>]+>/g, '').trim(),
                content: (i.content_html || '').replace(/<[^>]+>/g, '').trim().slice(0, 300),
                link: i.url || '', date: i.date_published || '',
                author: i.author?.name || '', image: i.image || '', source: 'instagram',
              })));
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
  const seen = new Set();
  const unique = allItems.filter(item => {
    const key = item.link || item.title.slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { posts: unique.slice(0, 30), count: unique.length, errors };
}

// ── Jina Reader news enrichment ──
async function enrichNewsWithJina(articles) {
  if (!articles || articles.length === 0) return articles;
  const JINA_BASE = 'https://r.jina.ai/';
  // Enrich top 5 articles with full-text snippets
  const enriched = await Promise.allSettled(
    articles.slice(0, 5).map(async (article) => {
      if (!article.link) return article;
      try {
        const res = await fetchWithTimeout(`${JINA_BASE}${article.link}`, {
          headers: { 'Accept': 'text/plain', 'User-Agent': 'JanVayu/1.0 AirQualityMonitor' },
        }, 8000);
        const text = await res.text();
        return { ...article, snippet_enhanced: text.slice(0, 500).trim(), enhanced: true };
      } catch (e) {
        return article;
      }
    })
  );
  const top = enriched.map(r => r.status === 'fulfilled' ? r.value : articles[0]);
  return [...top, ...articles.slice(5)];
}

// ── Main scheduled handler ──
export default async (req) => {
  const store = getBlobStore("janvayu-feeds");
  const timestamp = new Date().toISOString();
  const log = { started: timestamp, results: {} };

  // Fetch all feeds in parallel
  const [reddit, twitter, news, instagram] = await Promise.allSettled([
    fetchReddit(),
    fetchTwitter(),
    fetchNews(),
    fetchInstagram(),
  ]);

  // Store each result in Blobs
  if (reddit.status === 'fulfilled') {
    await store.setJSON("reddit", { ...reddit.value, fetched_at: timestamp, source: 'reddit-proxy' });
    log.results.reddit = { ok: true, count: reddit.value.count };
  } else {
    log.results.reddit = { ok: false, error: reddit.reason?.message };
  }

  if (twitter.status === 'fulfilled') {
    await store.setJSON("twitter", { ...twitter.value, fetched_at: timestamp, source: 'nitter-rss' });
    log.results.twitter = { ok: true, count: twitter.value.count };
  } else {
    log.results.twitter = { ok: false, error: twitter.reason?.message };
  }

  if (news.status === 'fulfilled') {
    await store.setJSON("news", { ...news.value, fetched_at: timestamp, source: 'google-news-rss' });
    log.results.news = { ok: true, count: news.value.count };
    // Enrich top articles with Jina Reader for better snippets
    try {
      const enrichedArticles = await enrichNewsWithJina(news.value.articles);
      await store.setJSON("news-enhanced", {
        articles: enrichedArticles,
        count: enrichedArticles.length,
        fetched_at: timestamp,
        source: 'google-news-rss+jina-reader',
      });
      log.results.news_enhanced = { ok: true, count: enrichedArticles.length };
    } catch (e) {
      log.results.news_enhanced = { ok: false, error: e.message };
    }
  } else {
    log.results.news = { ok: false, error: news.reason?.message };
  }

  if (instagram.status === 'fulfilled') {
    await store.setJSON("instagram", { ...instagram.value, fetched_at: timestamp, source: 'rss-bridge' });
    log.results.instagram = { ok: true, count: instagram.value.count };
  } else {
    log.results.instagram = { ok: false, error: instagram.reason?.message };
  }

  // Store fetch log
  log.completed = new Date().toISOString();
  await store.setJSON("last-fetch-log", log);
  await store.set("last-fetch-time", timestamp);

  console.log("Scheduled fetch complete:", JSON.stringify(log));
};

export const config = {
  schedule: "0 */4 * * *",  // Every 4 hours
};
