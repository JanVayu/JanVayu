// Netlify Function: YouTube AQI content feed
// Serves pre-fetched YouTube data from Blobs (populated by Agent-Reach GitHub Action)
// Falls back to curated search links if no cached data

const { getBlobStore } = require('./blob-store');

const YOUTUBE_SEARCH_LINKS = [
  { query: 'Delhi Air Quality', url: 'https://www.youtube.com/results?search_query=delhi+air+quality+2026' },
  { query: 'India Air Pollution', url: 'https://www.youtube.com/results?search_query=india+air+pollution+AQI' },
  { query: 'Delhi Smog', url: 'https://www.youtube.com/results?search_query=delhi+smog+pollution' },
  { query: 'Clean Air India', url: 'https://www.youtube.com/results?search_query=clean+air+india+NCAP' },
];

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

  // Try Blobs cache (populated by Agent-Reach GitHub Action)
  try {
    const store = getBlobStore("janvayu-feeds");
    const cached = await store.get("youtube", { type: "json" });
    if (cached && cached.videos && cached.videos.length > 0) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          ...cached,
          served_from: 'cache',
        }),
      };
    }
  } catch (e) {
    console.log('YouTube blob read failed:', e.message);
  }

  // Fallback: return curated search links
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      videos: [],
      fallback: true,
      search_links: YOUTUBE_SEARCH_LINKS,
      count: 0,
      source: 'agent-reach-ytdlp',
      message: 'No cached videos available. Browse YouTube directly:',
    }),
  };
};
