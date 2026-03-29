// Netlify Function: Returns feed status and last update timestamps
// Used by client to show "Data last updated: X" with server-side truth

const { getBlobStore } = require('./blob-store');

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const store = getBlobStore("janvayu-feeds");
    const [lastTime, log, emailLog, agentReachLog, twitterAgent, youtube] = await Promise.all([
      store.get("last-fetch-time").catch(() => null),
      store.get("last-fetch-log", { type: "json" }).catch(() => null),
      store.get("last-email-log", { type: "json" }).catch(() => null),
      store.get("last-agent-reach-ingest", { type: "json" }).catch(() => null),
      store.get("twitter-agent", { type: "json" }).catch(() => null),
      store.get("youtube", { type: "json" }).catch(() => null),
    ]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        last_updated: lastTime || null,
        schedule: 'Netlify feeds every 4 hours, Agent-Reach every 2 hours, email digest daily at 8 AM IST',
        log: log || null,
        email_log: emailLog || null,
        agent_reach: {
          last_ingest: agentReachLog || null,
          twitter_agent: twitterAgent ? { count: twitterAgent.count, fetched_at: twitterAgent.fetched_at } : null,
          youtube: youtube ? { count: youtube.count, fetched_at: youtube.fetched_at } : null,
        },
        server_time: new Date().toISOString(),
      }),
    };
  } catch (e) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        last_updated: null,
        schedule: 'Every 4 hours',
        error: e.message,
        server_time: new Date().toISOString(),
      }),
    };
  }
};
