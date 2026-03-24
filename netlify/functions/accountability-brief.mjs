// Netlify Function: Ward-Level Accountability Brief
// Generates structured briefs for ward councillors, journalists, and resident groups

const WAQI_TOKEN = "1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3";

const CITIES = {
  delhi: { name: "Delhi", lat: 28.6139, lon: 77.2090 },
  mumbai: { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  kolkata: { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  chennai: { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  bangalore: { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  hyderabad: { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  gurgaon: { name: "Gurgaon", lat: 28.4595, lon: 77.0266 },
  noida: { name: "Noida", lat: 28.5355, lon: 77.3910 },
  faridabad: { name: "Faridabad", lat: 28.4089, lon: 77.3178 },
  ghaziabad: { name: "Ghaziabad", lat: 28.6692, lon: 77.4538 },
  lucknow: { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  kanpur: { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
  patna: { name: "Patna", lat: 25.5941, lon: 85.1376 },
  jaipur: { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  ahmedabad: { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  pune: { name: "Pune", lat: 18.5204, lon: 73.8567 },
  chandigarh: { name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  varanasi: { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
  agra: { name: "Agra", lat: 27.1767, lon: 78.0081 },
  bhopal: { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
  indore: { name: "Indore", lat: 22.7196, lon: 75.8577 },
  nagpur: { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
  kochi: { name: "Kochi", lat: 9.9312, lon: 76.2673 },
  visakhapatnam: { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
  thiruvananthapuram: { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
  coimbatore: { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
  muzaffarpur: { name: "Muzaffarpur", lat: 26.1197, lon: 85.3910 },
  gaya: { name: "Gaya", lat: 24.7914, lon: 85.0002 },
  raipur: { name: "Raipur", lat: 21.2514, lon: 81.6296 },
  jodhpur: { name: "Jodhpur", lat: 26.2389, lon: 73.0243 },
  guwahati: { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
  dehradun: { name: "Dehradun", lat: 30.3165, lon: 78.0322 },
  amritsar: { name: "Amritsar", lat: 31.6340, lon: 74.8723 },
};

// Seasonal baselines (µg/m³) from CREA/IQAir data
function getSeasonalBaseline(cityKey) {
  const month = new Date().getMonth(); // 0-11
  const isWinter = month >= 9 || month <= 2; // Oct-Mar
  const baselines = {
    delhi: isWinter ? 95 : 55,
    gurgaon: isWinter ? 95 : 55,
    noida: isWinter ? 95 : 55,
    faridabad: isWinter ? 95 : 55,
    ghaziabad: isWinter ? 95 : 55,
    mumbai: 45,
    kolkata: isWinter ? 80 : 35,
  };
  return baselines[cityKey] || 60;
}

async function fetchCityAQI(cityKey) {
  const city = CITIES[cityKey];
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
        aqi: data.data.aqi,
        pm25: data.data.iaqi?.pm25?.v || null,
        pm10: data.data.iaqi?.pm10?.v || null,
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
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), { status: 405, headers });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
  }

  const { city, area, period } = body;
  if (!city || !area) {
    return new Response(JSON.stringify({ error: "city and area are required" }), { status: 400, headers });
  }

  const safePeriod = period || "today";
  const cityKey = city.toLowerCase().replace(/\s+/g, "");
  const aqiResult = await fetchCityAQI(cityKey);

  if (!aqiResult) {
    return new Response(JSON.stringify({
      brief: `Live data unavailable for ${city} right now. Try another city or check back in 10 minutes.`,
      anomalyDetected: false,
      pm25: null,
      baseline: null,
      stationName: null,
    }), { status: 200, headers });
  }

  const pm25 = aqiResult.pm25 ?? 0;
  const baseline = getSeasonalBaseline(cityKey);
  const anomalyDetected = pm25 > baseline * 1.5;
  const whoMultiple = (pm25 / 5).toFixed(1);
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const dataContext = `Area: ${area}, City: ${aqiResult.city}, Period: ${safePeriod}, Current PM2.5: ${pm25} µg/m³ (${whoMultiple} times WHO safe limit of 5 µg/m³), AQI: ${aqiResult.aqi}, PM10: ${aqiResult.pm10 ?? "N/A"} µg/m³, Station: ${aqiResult.station}, Seasonal baseline for ${aqiResult.city}: ${baseline} µg/m³, Anomalous: ${anomalyDetected ? "Yes — current reading is " + (pm25 / baseline).toFixed(1) + "x seasonal baseline" : "No"}, Timestamp: ${timestamp}.`;

  const systemPrompt = `You are generating a ward-level air quality accountability brief for JanVayu, India's citizen air quality platform. Write in plain language that a ward councillor, local journalist, or resident association leader can act on. Structure your brief exactly as:

AREA: [area name], [city]
PERIOD: [period]
CURRENT PM2.5: [value] µg/m³ ([x times] WHO safe limit of 5 µg/m³)
STATUS: [Normal / Elevated / Anomalous — one sentence explanation]

WHAT THE DATA SHOWS:
[2-3 sentences: practical meaning for this neighbourhood, reference the seasonal baseline, note if worse or better than typical]

LIKELY SOURCES:
[1-2 sentences: specific to this city and season — stubble burning, construction, vehicular, industrial, weather inversion]

WHAT LOCAL ACTORS CAN DO:
[2-3 specific actions a ward councillor or resident group could take now. Reference actual powers — GRAP, RTI, MCD complaint lines.]

DATA CAVEAT:
This brief is based on [station name] data. It reflects area-level air quality, not hyperlocal ward data. For ward-specific data, additional monitoring is needed.

Generated by JanVayu | janvayu.in | [timestamp]`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: dataContext }
        ],
        max_tokens: 400,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const groqData = await groqRes.json();
    const text = groqData.choices?.[0]?.message?.content || "No response generated.";
    return new Response(JSON.stringify({
      brief: text,
      anomalyDetected,
      pm25,
      baseline,
      stationName: aqiResult.station,
    }), { status: 200, headers });
  } catch (e) {
    console.log("Groq error:", e.message);
    const fallbackBrief = `AREA: ${area}, ${aqiResult.city}\nPERIOD: ${safePeriod}\nCURRENT PM2.5: ${pm25} µg/m³ (${whoMultiple}x WHO safe limit of 5 µg/m³)\nSTATUS: ${anomalyDetected ? "Anomalous" : pm25 > baseline ? "Elevated" : "Normal"}\n\nAI analysis unavailable. Raw data: PM2.5 ${pm25} µg/m³, AQI ${aqiResult.aqi}.\nSeasonal baseline: ${baseline} µg/m³.\nStation: ${aqiResult.station}\n\nGenerated by JanVayu | janvayu.in | ${timestamp}`;
    return new Response(JSON.stringify({
      brief: fallbackBrief,
      anomalyDetected,
      pm25,
      baseline,
      stationName: aqiResult.station,
    }), { status: 200, headers });
  }
}
