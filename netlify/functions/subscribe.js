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
    const { email, cities, threshold, action } = body;

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
      threshold: threshold || 200,
      subscribed_at: new Date().toISOString(),
      active: true,
    });

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        ok: true,
        message: `Subscribed! You'll get daily AQI digests for ${(cities || ['delhi']).join(', ')} when AQI exceeds ${threshold || 200}.`,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
