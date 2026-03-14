// Netlify Function: Returns feed status and last update timestamps
// Used by client to show "Data last updated: X" with server-side truth

const { getStore } = require('@netlify/blobs');

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
    const store = getStore({ name: "janvayu-feeds", consistency: "strong" });
    const [lastTime, log, emailLog] = await Promise.all([
      store.get("last-fetch-time").catch(() => null),
      store.get("last-fetch-log", { type: "json" }).catch(() => null),
      store.get("last-email-log", { type: "json" }).catch(() => null),
    ]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        last_updated: lastTime || null,
        schedule: 'Feeds every 4 hours, email digest daily at 8 AM IST',
        log: log || null,
        email_log: emailLog || null,
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
