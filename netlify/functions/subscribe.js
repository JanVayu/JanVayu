// Netlify Function: Email subscription management
// Stores subscriber emails in Netlify Blobs for AQI alert digests

const { getBlobStore } = require('./blob-store');

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST only' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, cities, action } = body;
    const pm25Threshold = Math.max(10, Math.min(500, parseInt(body.pm25_threshold, 10) || 90));

    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
    }

    const store = getBlobStore("janvayu-subscribers");
    const key = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '');

    if (action === 'unsubscribe') {
      await store.delete(key);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ ok: true, message: 'Unsubscribed successfully' }),
      };
    }

    // Subscribe
    await store.setJSON(key, {
      email: email.toLowerCase(),
      cities: cities || ['delhi'],
      pm25_threshold: pm25Threshold,
      subscribed_at: new Date().toISOString(),
      active: true,
    });

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        ok: true,
        message: `Subscribed! You'll get daily AQI digests for ${(cities || ['delhi']).join(', ')} when PM2.5 exceeds ${pm25Threshold} µg/m³.`,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
