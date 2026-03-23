// Netlify Function: Personalised Health Advisory
// Accepts user profile + city, fetches live AQI, sends to Groq (Llama) for advisory

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

function getRiskLevel(pm25, conditions) {
  const hasSensitive = conditions && conditions.some(c => c !== "none");
  if (pm25 <= 12) return "low";
  if (pm25 <= 35) return hasSensitive ? "moderate" : "low";
  if (pm25 <= 55) return hasSensitive ? "high" : "moderate";
  if (pm25 <= 150) return hasSensitive ? "severe" : "high";
  return "severe";
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

async function callGroq(systemPrompt, userMessage) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
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

  const { city, age, conditions, hoursOutdoor } = body;
  if (!city || !age) {
    return new Response(JSON.stringify({ error: "city and age are required" }), { status: 400, headers });
  }

  const cityKey = city.toLowerCase().replace(/\s+/g, "");
  const aqiResult = await fetchCityAQI(cityKey);

  if (!aqiResult) {
    return new Response(JSON.stringify({
      advisory: `Live data unavailable for ${city} right now. Try another city or check back in 10 minutes.`,
      riskLevel: "moderate",
      pm25: null,
      aqiRaw: null,
    }), { status: 200, headers });
  }

  const pm25 = aqiResult.pm25 ?? 0;
  const safeConditions = Array.isArray(conditions) ? conditions : ["none"];
  const riskLevel = getRiskLevel(pm25, safeConditions);

  const profileContext = `Person: age ${age}, conditions: ${safeConditions.join(", ")}, hours outdoors daily: ${hoursOutdoor || 0}. City: ${aqiResult.city}, AQI: ${aqiResult.aqi}, PM2.5: ${pm25} µg/m³, PM10: ${aqiResult.pm10 ?? "N/A"} µg/m³, Station: ${aqiResult.station}, Updated: ${aqiResult.time}. WHO PM2.5 guideline: 5 µg/m³.`;

  try {
    const text = await callGroq(
      "You are a public health advisor specialising in air pollution exposure in India. Given a person's profile and current air quality data, generate a specific, actionable advisory. Be concrete: say 'stay indoors until 2pm' not 'limit outdoor exposure'. Reference the actual PM2.5 value. If the person has a health condition, address it directly. Do not hedge — give a clear recommendation. 3-4 sentences maximum. Respond in English.",
      profileContext
    );
    return new Response(JSON.stringify({
      advisory: text,
      riskLevel,
      pm25,
      aqiRaw: aqiResult.aqi,
    }), { status: 200, headers });
  } catch (e) {
    console.log("Groq error:", e.message);
    const fallback = `AI analysis unavailable. Raw data: ${pm25} µg/m³ PM2.5 (AQI ${aqiResult.aqi}).`;
    return new Response(JSON.stringify({
      advisory: fallback,
      riskLevel,
      pm25,
      aqiRaw: aqiResult.aqi,
    }), { status: 200, headers });
  }
}
