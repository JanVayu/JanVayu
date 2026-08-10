// Netlify Function: YouTube air-quality video feed
//
// This used to serve only from a Blobs key that a since-retired "Agent-Reach"
// GitHub Action was supposed to fill. Nothing filled it, so the function
// returned zero videos and no error — silently empty for however long.
//
// It now fetches for itself, by two routes:
//
//   1. Channel RSS — https://www.youtube.com/feeds/videos.xml?channel_id=…
//      Public, no API key, no quota. Returns each channel's ~15 most recent
//      videos, which we filter down to the ones actually about air. Verified
//      working against all eight channels below.
//
//   2. The YouTube Data API — only if a YOUTUBE_API_KEY is set in the
//      environment. This is the better route because it *searches* rather than
//      filtering a recent-videos list, so it finds coverage from channels we
//      never listed. The free tier is 10,000 units a day and a search costs
//      100, so 100 searches a day cost nothing. Without a key the function
//      simply skips this and uses route 1.
//
// The honest limit of route 1 alone: outside pollution season a general news
// channel publishes nothing about air for weeks, so the feed is legitimately
// empty in, say, August and full in November. Empty is reported as empty, with
// the search links offered instead — not dressed up.

const { getBlobStore } = require('./blob-store');

// Resolved from each channel's page and checked: all eight return a feed.
const CHANNELS = [
  { name: 'Down To Earth', id: 'UCvvFJ4VAsUSemwS_sr4CU_w' },
  { name: 'NDTV', id: 'UCZFMm1mMw0F81Z37aaEzTUA' },
  { name: 'India Today', id: 'UCYPvAwZP8pZhSMW8qs7cVCw' },
  { name: 'The Quint', id: 'UCSaf-7p3J_N-02p7jHzm5tA' },
  { name: 'WION', id: 'UCWEIPvoxRwn6llPOIn555rQ' },
  { name: 'Aaj Tak', id: 'UCt4t-jeY85JegMlZ-E5UWtA' },
  { name: 'Scroll.in', id: 'UCl8zB2LZOiLLV0jYUMpTEgA' },
  { name: 'The Hindu', id: 'UC3njZ48-FDxLleBYaP0SZIg' },
];

const SEARCH_QUERIES = [
  'Delhi air quality AQI',
  'India air pollution',
  'stubble burning Punjab',
];

const YOUTUBE_SEARCH_LINKS = [
  { query: 'Delhi Air Quality', url: 'https://www.youtube.com/results?search_query=delhi+air+quality' },
  { query: 'India Air Pollution', url: 'https://www.youtube.com/results?search_query=india+air+pollution+AQI' },
  { query: 'Delhi Smog', url: 'https://www.youtube.com/results?search_query=delhi+smog+pollution' },
  { query: 'Clean Air India', url: 'https://www.youtube.com/results?search_query=clean+air+india+NCAP' },
];

// The same rule the Reddit feed uses, for the same reason: a title has to name
// air quality to count. Kept in step with ABOUT_AIR in reddit-feed.js.
const ABOUT_AIR = /\b(air quality|air pollution|aqi|smog|smoggy|pm ?2\.?5|pm ?10|stubble burn\w*|particulate|clean air|ncap|grap|polluted|pollution)\b/i;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function decodeEntities(s) {
  return String(s || '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

async function getText(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'JanVayu:AirQualityMonitor:v26.6 (+https://janvayu.in)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function parseChannelFeed(xml, channelName) {
  const out = [];
  for (const entry of xml.split('<entry>').slice(1)) {
    const pick = (tag) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? decodeEntities(m[1].trim()) : '';
    };
    const title = pick('title');
    if (!title || !ABOUT_AIR.test(title)) continue;
    const id = pick('yt:videoId');
    out.push({
      platform: 'youtube',
      title,
      channel: channelName,
      videoId: id,
      url: id ? `https://www.youtube.com/watch?v=${id}` : '',
      thumbnail: id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null,
      published: pick('published') || pick('updated'),
      text: pick('media:description').slice(0, 200),
    });
  }
  return out;
}

// Route 1: channel feeds, one at a time. YouTube does not rate-limit these
// anywhere near as hard as Reddit does, but a budget still guards the function
// timeout — a partial feed beats a 502.
async function fromChannels(budgetMs = 7000) {
  const videos = [], errors = [];
  const deadline = Date.now() + budgetMs;
  for (let i = 0; i < CHANNELS.length; i++) {
    if (Date.now() > deadline) {
      errors.push(`skipped ${CHANNELS.length - i} channel(s): out of time`);
      break;
    }
    if (i) await sleep(120);
    const ch = CHANNELS[i];
    try {
      const xml = await getText(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`);
      videos.push(...parseChannelFeed(xml, ch.name));
    } catch (e) {
      errors.push(`${ch.name}: ${e.message}`);
    }
  }
  return { videos, errors };
}

// Search reaches the whole of YouTube, which is the point of having it and
// also its problem. Ordered by date it returned, top of the feed, an
// AI-generated speculation from a channel called "AI GENETATOR" — the title
// filter checks the subject, not whether anyone made anything. Two changes:
//
//   order=relevance inside a recent window, rather than order=date over
//   everything. Pure recency ranks whatever was uploaded most recently, and
//   generated video is uploaded constantly. Relevance within the last 90 days
//   still gives a current feed without handing it to whoever posts most.
//
//   A floor on how established the source is, applied only to search results.
//   A view floor alone was tried first and was wrong: it cut the feed from 23
//   to 8 and took The Tribune on a Punjab farmer who ended stubble burning,
//   News18 Punjab, ABPLIVE and Adda247 Tamil with it. Views measure how much
//   attention a video got, and Punjabi and Tamil coverage of a regional story
//   gets less of it than an English explainer — so the floor was quietly
//   biasing an Indian civic feed towards English and towards size.
//
//   Subscribers are the better signal. A newsroom with a million subscribers
//   is a newsroom on a video with four hundred views; a generated-content
//   channel is small however often it posts. So a result is kept if EITHER
//   its channel is established OR the video itself was widely watched, which
//   also leaves room for the genuinely viral clip from nobody in particular.
//   channels.list costs 1 unit, same as videos.list — both together are 2
//   against search's 100.
const RECENT_DAYS = 90;
const MIN_VIEWS = 20000;      // a video that travelled on its own
const MIN_SUBSCRIBERS = 5000; // or a channel that is somebody

// Bump when the rules above change, so cached results chosen under the old
// ones are discarded rather than served for another four hours.
const FEED_VERSION = 3;

async function fromSearchApi(key, budgetMs = 6000) {
  const videos = [], errors = [];
  const deadline = Date.now() + budgetMs;
  const since = new Date(Date.now() - RECENT_DAYS * 864e5).toISOString().replace(/\.\d+/, '');
  for (const q of SEARCH_QUERIES) {
    if (Date.now() > deadline) break;
    const url = 'https://www.googleapis.com/youtube/v3/search'
      + `?part=snippet&type=video&order=relevance&maxResults=10&regionCode=IN`
      + `&publishedAfter=${encodeURIComponent(since)}`
      + `&q=${encodeURIComponent(q)}&key=${encodeURIComponent(key)}`;
    try {
      const data = JSON.parse(await getText(url));
      for (const it of (data.items || [])) {
        const title = decodeEntities(it.snippet?.title || '');
        if (!title || !ABOUT_AIR.test(title)) continue;
        videos.push({
          platform: 'youtube',
          title,
          channel: it.snippet?.channelTitle || '',
          videoId: it.id?.videoId || '',
          channelId: it.snippet?.channelId || '',
          url: it.id?.videoId ? `https://www.youtube.com/watch?v=${it.id.videoId}` : '',
          thumbnail: it.snippet?.thumbnails?.high?.url || null,
          published: it.snippet?.publishedAt || '',
          text: decodeEntities(it.snippet?.description || '').slice(0, 200),
        });
      }
    } catch (e) {
      errors.push(`search "${q}": ${e.message}`);
    }
  }

  // Two list calls for the whole batch, 1 unit each, up to 50 ids apiece.
  const ids = videos.map(v => v.videoId).filter(Boolean).slice(0, 50);
  if (ids.length) {
    try {
      const [vidStats, chStats] = await Promise.all([
        getText('https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id='
                + ids.join(',') + '&key=' + encodeURIComponent(key)).then(JSON.parse),
        (async () => {
          const chIds = [...new Set(videos.map(v => v.channelId).filter(Boolean))].slice(0, 50);
          if (!chIds.length) return { items: [] };
          return JSON.parse(await getText(
            'https://www.googleapis.com/youtube/v3/channels?part=statistics&id='
            + chIds.join(',') + '&key=' + encodeURIComponent(key)));
        })(),
      ]);

      const views = {}, subs = {};
      for (const v of (vidStats.items || [])) views[v.id] = Number(v.statistics?.viewCount || 0);
      for (const c of (chStats.items || [])) subs[c.id] = Number(c.statistics?.subscriberCount || 0);

      const before = videos.length;
      // Kept if the channel is established OR the video travelled on its own.
      // Missing data counts as a pass either way: absent statistics are not
      // evidence of slop, and dropping on them would thin the feed silently.
      const kept = videos.filter(v => {
        const s = v.channelId in subs ? subs[v.channelId] : null;
        const w = v.videoId in views ? views[v.videoId] : null;
        if (s === null && w === null) return true;
        return (s !== null && s >= MIN_SUBSCRIBERS) || (w !== null && w >= MIN_VIEWS);
      });
      kept.forEach(v => { v.views = views[v.videoId]; v.channelSubscribers = subs[v.channelId]; });
      videos.length = 0;
      videos.push(...kept);
      if (before - kept.length) {
        console.log(`youtube: dropped ${before - kept.length} of ${before} search result(s) — `
          + `channel under ${MIN_SUBSCRIBERS} subscribers and video under ${MIN_VIEWS} views`);
      }
    } catch (e) {
      // If the statistics fail, keep the unfiltered search results rather than
      // returning nothing — the title filter has already done the topic work.
      errors.push(`statistics: ${e.message}`);
    }
  }
  return { videos, errors };
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

  // Serve from cache when it holds anything, applying the relevance rule on the
  // way out as well: a cache written by an older deploy should not be able to
  // put an unrelated video on the page.
  //
  // The version stamp is how a change to the selection rules takes effect
  // without anyone emptying the cache by hand. Tightening the rules is
  // pointless if four hours of cached results written under the old ones keep
  // being served — so a cache stamped with a different version is ignored and
  // refetched. Bump FEED_VERSION whenever what belongs in this feed changes.
  try {
    const store = getBlobStore('janvayu-feeds');
    const cached = await store.get('youtube', { type: 'json' });
    const fresh = cached && cached.feed_version === FEED_VERSION;
    const kept = (fresh && cached.videos || []).filter(v => ABOUT_AIR.test(v.title || ''));
    if (!fresh && cached) console.log('youtube: cache written under older rules, refetching');
    if (kept.length > 0) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ ...cached, videos: kept, count: kept.length, served_from: 'cache' }),
      };
    }
  } catch (e) {
    console.log('YouTube blob read failed, fetching live:', e.message);
  }

  const key = process.env.YOUTUBE_API_KEY;
  const channelRun = await fromChannels();
  const searchRun = key ? await fromSearchApi(key) : { videos: [], errors: [] };
  const errors = [...channelRun.errors, ...searchRun.errors];

  const seen = new Set();
  const videos = [...searchRun.videos, ...channelRun.videos].filter(v => {
    if (!v.videoId || seen.has(v.videoId)) return false;
    seen.add(v.videoId);
    return true;
  });
  videos.sort((a, b) => new Date(b.published) - new Date(a.published));

  // Nothing found is a real answer, not a failure to hide. Outside pollution
  // season the news channels genuinely publish nothing about air for weeks.
  if (videos.length === 0) {
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        videos: [], count: 0, fallback: true,
        search_links: YOUTUBE_SEARCH_LINKS,
        source: key ? 'channel-rss + data-api' : 'channel-rss',
        message: 'No air-quality videos in these channels’ recent uploads. Browse YouTube directly:',
        errors: errors.length ? errors : undefined,
        fetched_at: new Date().toISOString(),
      }),
    };
  }

  // Seed the cache so the next visitor is not another eight requests.
  try {
    const store = getBlobStore('janvayu-feeds');
    await store.setJSON('youtube', {
      feed_version: FEED_VERSION,
      videos: videos.slice(0, 30), count: videos.length,
      source: key ? 'channel-rss + data-api' : 'channel-rss',
      fetched_at: new Date().toISOString(), seeded_by: 'live-fetch',
    });
  } catch (e) {
    console.log('Could not seed the youtube cache:', e.message);
  }

  return {
    statusCode: 200, headers,
    body: JSON.stringify({
      videos: videos.slice(0, 30),
      count: videos.length,
      source: key ? 'channel-rss + data-api' : 'channel-rss',
      served_from: 'live',
      errors: errors.length ? errors : undefined,
      fetched_at: new Date().toISOString(),
    }),
  };
};
