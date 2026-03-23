// Netlify Function: Anomaly Detection
// Checks major cities for PM2.5 spikes, optionally explains via Gemini

import { GoogleGenerativeAI } from "@google/generative-ai";

const WAQI_TOKEN = "1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3";

const MONITOR_CITIES = {
  delhi: { name: "Delhi", lat: 28.6139, lon: 77.2090 },
  mumbai: { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  kolkata: { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  chennai: { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  bangalore: { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
};

// Seasonal baselines (µg/m³) from CREA/IQAir data
function getSeasonalBaseline(cityKey) {
  const month = new Date().getMonth();
  const isWinter = month >= 9 || month <= 2;
  const baselines = {
    delhi: isWinter ? 95 : 55,
    mumbai: 45,
    kolkata: isWinter ? 80 : 35,
    chennai: 40,
    bangalore: 40,
  };
  return baselines[cityKey] || 60;
}

async function fetchCityAQI(cityKey) {
  const city = MONITOR_CITIES[cityKey];
  if (!city) return null;
  try {
    const res = await fetch(
      `https://api.waqi.info/feed/geo:${city.lat};${city.lon}/?token=${WAQI_TOKEN}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    if (data.status === "ok" && data.data) {
      return {
        city: city.name,
        key: cityKey,
        aqi: data.data.aqi,
        pm25: data.data.iaqi?.pm25?.v || null,
        station: data.data.city?.name || city.name,
        time: data.data.time?.s || new Date().toISOString(),
      };
    }
  } catch (e) {
    console.log(`Failed to fetch AQI for ${cityKey}:`, e.message);
  }
  return null;
}

export default async function handler(req) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=600",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  const results = await Promise.allSettled(
    Object.keys(MONITOR_CITIES).map(c => fetchCityAQI(c))
  );

  const spikes = [];
  const spikeData = [];

  results.forEach(r => {
    if (r.status !== "fulfilled" || !r.value) return;
    const d = r.value;
    if (!d.pm25) return;
    const baseline = getSeasonalBaseline(d.key);
    const ratio = d.pm25 / baseline;
    if (ratio > 2) {
      spikes.push(d);
      spikeData.push({ city: d.city, pm25: d.pm25, baseline, ratio: parseFloat(ratio.toFixed(1)) });
    }
  });

  // If spikes found, try to explain via Gemini
  if (spikes.length > 0) {
    const now = new Date();
    const month = now.toLocaleString("en-IN", { month: "long", timeZone: "Asia/Kolkata" });
    const hour = now.toLocaleString("en-IN", { hour: "numeric", hour12: true, timeZone: "Asia/Kolkata" });

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const explanations = await Promise.allSettled(
        spikeData.map(async s => {
          const prompt = `In one sentence, explain why PM2.5 in ${s.city} might be ${s.pm25} µg/m³ right now — ${month}, ${hour}. Give the most likely cause. Be specific to the Indian context.`;
          const result = await model.generateContent(prompt);
          return { city: s.city, explanation: result.response.text() };
        })
      );

      explanations.forEach(r => {
        if (r.status === "fulfilled") {
          const match = spikeData.find(s => s.city === r.value.city);
          if (match) match.explanation = r.value.explanation;
        }
      });
    } catch (e) {
      console.log("Gemini error:", e.message);
    }
  }

  // Fill missing explanations
  spikeData.forEach(s => {
    if (!s.explanation) {
      s.explanation = `PM2.5 is ${s.ratio}x above seasonal baseline.`;
    }
  });

  return new Response(JSON.stringify({
    spikes: spikeData,
    checkedAt: new Date().toISOString(),
  }), { status: 200, headers });
}
