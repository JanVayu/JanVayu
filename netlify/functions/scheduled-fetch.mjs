// Netlify Scheduled Function: Fetches all social/news feeds every 4 hours
// Stores results in Netlify Blobs so API functions serve cached data instantly
import { getBlobStore } from "./lib/blob.mjs";


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
// This job is what fills the Blobs cache the reddit-feed function serves. It
// had been calling search.json, which Reddit refuses from datacentre IPs, so
// every run failed silently, the cache stayed empty, and every visitor fell
// through to reddit-feed's live path — five requests per page view, from one
// shared Netlify IP, which is what was earning the 429s. Reading the Atom feed
// here, on a 4-hourly schedule, is both the fix and the point: the live path
// goes back to being a fallback nobody normally reaches.
function decodeEntities(s) {
  return String(s || '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function parseRedditAtom(xml, sub) {
  const out = [];
  for (const e of xml.split('<entry>').slice(1)) {
    const pick = (tag) => {
      const m = e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? decodeEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim()) : '';
    };
    const title = pick('title');
    if (!title) continue;
    const linkM = e.match(/<link[^>]*href="([^"]+)"/);
    out.push({
      platform: 'reddit', sub,
      title,
      author: pick('name') || null,
      url: linkM ? linkM[1] : null,
      created: Date.parse(pick('updated') || pick('published')) || Date.now(),
      // The Atom feed carries no score, comment count or thumbnail. They are
      // null rather than invented.
      score: null, comments: null, thumbnail: null,
      text: decodeEntities(pick('content')).replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ').trim().substring(0, 200),
    });
  }
  return out;
}

// Kept in step with the same expression in reddit-feed.js — Reddit's search
// ORs its terms, so "air pollution OR AQI" matches on the word "air" and lets
// through things like "Air India names new CEO". The title has to say it.
const ABOUT_AIR = /\b(air quality|air pollution|aqi|smog|smoggy|pm ?2\.?5|pm ?10|stubble burn\w*|particulate|clean air|ncap|grap|polluted|pollution)\b/i;

async function fetchReddit() {
  const allPosts = [];
  const errors = [];
  // Sequential with a gap: Reddit rate-limits per IP, and five simultaneous
  // requests from one Netlify region look like one impatient client.
  for (let i = 0; i < SUBREDDITS.length; i++) {
    const { sub, query } = SUBREDDITS[i];
    if (i) await new Promise(r => setTimeout(r, 500));
    const url = `https://www.reddit.com/r/${sub}/search.rss?q=${encodeURIComponent(query)}` +
                `&sort=new&restrict_sr=on&limit=25&t=month`;
    try {
      const res = await fetchWithTimeout(url, {
        headers: {
          'User-Agent': 'JanVayu:AirQualityMonitor:v26.6 (+https://janvayu.in)',
          'Accept': 'application/atom+xml, application/xml',
        },
      });
      allPosts.push(...parseRedditAtom(await res.text(), sub).filter(p => ABOUT_AIR.test(p.title || '')));
    } catch (e) {
      errors.push(`${sub}: ${e.message}`);
    }
  }
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
          headers: { 'User-Agent': 'JanVayu/v26.6 AirQualityMonitor (+https://janvayu.in)' },
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
            headers: { 'User-Agent': 'JanVayu/v26.6 AirQualityMonitor (+https://janvayu.in)' },
          }, 5000);
          allItems.push(...parseRSSItems(await res.text()));
        } catch { /* skip */ }
      }
      for (const q of SEARCH_QUERIES) {
        try {
          const res = await fetchWithTimeout(`https://${instance}/search/rss?f=tweets&q=${q}`, {
            headers: { 'User-Agent': 'JanVayu/v26.6 AirQualityMonitor (+https://janvayu.in)' },
          }, 5000);
          allItems.push(...parseRSSItems(await res.text()));
        } catch { /* skip */ }
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
        headers: { 'User-Agent': 'JanVayu/v26.6 AirQualityMonitor (+https://janvayu.in)' },
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

// RSS-Bridge reports its own failures as ordinary feed items — an Instagram
// block comes back as posts titled "Bridge returned error 401!". instagram-feed.js
// has dropped those since 10 Aug 2026, but this writer had no such filter, so every
// four hours it refilled the cache with them and the API served them straight
// back out. Same predicate, applied at the only other place items are ingested.
function isBridgeError(item) {
  const t = (item.title || '') + ' ' + (item.content_text || item.content_html || '');
  return /bridge returned error|HttpException|\bError\b\s*\d{3}\b|Type:\s*\w*Exception/i.test(t);
}

// One shape for all three ingest points below (hashtag, extra hashtags, accounts)
// so a filter can never again be applied to some of them and not the others.
function normalizeIgItems(items) {
  return (items || []).filter(i => !isBridgeError(i)).map(i => ({
    title: (i.title || '').replace(/<[^>]+>/g, '').trim(),
    content: (i.content_html || i.content_text || '').replace(/<[^>]+>/g, '').trim().slice(0, 300),
    link: i.url || i.id || '',
    date: i.date_published || i.date_modified || '',
    author: i.author ? i.author.name : '',
    image: i.image || (i.attachments?.[0]?.url || ''),
    source: 'instagram',
  }));
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
        const items = normalizeIgItems(data.items);
        allItems.push(...items);
        if (items.length > 0) {
          for (const t of INSTAGRAM_HASHTAGS.slice(2)) {
            try {
              const p = new URLSearchParams({ action: 'display', bridge: 'InstagramBridge', context: 'Hashtag', h: t, format: 'Json' });
              const r = await fetchWithTimeout(`https://${instance}/?${p}`);
              const d = await r.json();
              allItems.push(...normalizeIgItems(d.items));
            } catch { /* skip */ }
          }
          for (const acct of INSTAGRAM_ACCOUNTS) {
            try {
              const p = new URLSearchParams({ action: 'display', bridge: 'InstagramBridge', context: 'Username', u: acct, format: 'Json' });
              const r = await fetchWithTimeout(`https://${instance}/?${p}`);
              const d = await r.json();
              allItems.push(...normalizeIgItems(d.items));
            } catch { /* skip */ }
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
          headers: { 'Accept': 'text/plain', 'User-Agent': 'JanVayu/v26.6 AirQualityMonitor (+https://janvayu.in)' },
        }, 8000);
        const text = await res.text();
        return { ...article, snippet_enhanced: text.slice(0, 500).trim(), enhanced: true };
      } catch {
        return article;
      }
    })
  );
  const top = enriched.map(r => r.status === 'fulfilled' ? r.value : articles[0]);
  return [...top, ...articles.slice(5)];
}

// ── Main scheduled handler ──
export default async () => {
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
