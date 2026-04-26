// Netlify Function: Natural Language Query Interface for JanVayu
// Accepts a question + city, fetches live AQI, sends to Groq for analysis

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
        dominentpol: data.data.dominentpol || null,
      };
    }
  } catch (e) {
    console.log(`Failed to fetch AQI for ${cityKey}:`, e.message);
  }
  return null;
}

function getSeasonalContext() {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  let season = "";
  if (month >= 9 && month <= 11) {
    season = "STUBBLE BURNING SEASON (Oct-Nov): Crop residue fires in Punjab/Haryana contribute 25-40% of Delhi-NCR PM2.5 during peak weeks. GRAP restrictions likely active in NCR.";
  } else if (month === 0 || month === 11) {
    season = "WINTER INVERSION PERIOD (Dec-Jan): Cold temperatures trap pollutants near ground level. This is typically the worst air quality period across north India. Fog + smog combination common.";
  } else if (month >= 1 && month <= 2) {
    season = "LATE WINTER (Feb-Mar): Air quality gradually improving in north India but still elevated. Dust storms possible in Rajasthan/western India.";
  } else if (month >= 6 && month <= 8) {
    season = "MONSOON SEASON (Jul-Sep): Rainfall washes out particulates. This is typically the BEST air quality period. PM2.5 levels may be 50-70% lower than winter peaks.";
  } else if (month >= 3 && month <= 5) {
    season = "PRE-MONSOON/SUMMER (Apr-Jun): Dust storms in north/west India. Construction activity high. Heat increases ozone formation. Moderate pollution levels.";
  }

  const diwaliMonth = 10; // Nov approx
  let diwaliNote = "";
  if (month === 10 && day >= 1 && day <= 15) {
    diwaliNote = " DIWALI PERIOD: Firecracker emissions cause extreme PM2.5 spikes (often 500+ µg/m³ in Delhi) lasting 2-3 days.";
  }

  return { dateStr, season: season + diwaliNote };
}

const NCAP_CITY_DATA = {
  delhi: { ncapTarget: "40% PM10 reduction by 2026", budget: "₹300 Cr pollution budget (43% utilised)", note: "Most polluted capital globally. 0 days met WHO limit in 2026." },
  mumbai: { ncapTarget: "40% PM10 reduction", budget: "NCAP city", note: "PM2.5 increased 38% since 2019 despite NCAP." },
  kolkata: { ncapTarget: "40% PM10 reduction", budget: "NCAP city", note: "Winter inversions + vehicle emissions. Limited monitoring coverage." },
  lucknow: { ncapTarget: "40% PM10 reduction", budget: "NCAP city", note: "Indo-Gangetic plain — trapped pollutants. Brick kilns major source." },
  patna: { ncapTarget: "40% PM10 reduction", budget: "NCAP city", note: "Among worst PM2.5 in India. Limited enforcement capacity." },
  varanasi: { ncapTarget: "40% PM10 reduction", budget: "NCAP success story", note: "PM2.5 fell 72% in 5 years — best NCAP performer." },
  jaipur: { ncapTarget: "40% PM10 reduction", budget: "NCAP city", note: "Desert dust + vehicle emissions. Seasonal variation high." },
  pune: { ncapTarget: "40% PM10 reduction", budget: "NCAP city", note: "Relatively better air quality than Delhi/Mumbai. Growing vehicle fleet a concern." },
  chennai: { ncapTarget: "Not in original NCAP 131", budget: "N/A", note: "Coastal city — sea breeze helps dispersion. Industrial corridor a concern." },
  bangalore: { ncapTarget: "Not in original NCAP 131", budget: "N/A", note: "Generally better air quality. Vehicle growth and construction are rising concerns." },
};

const ACTIVITY_THRESHOLDS = `
WHO activity guidance by PM2.5 level:
- 0-12 µg/m³ (Good): All activities safe for everyone including children, elderly, asthmatics.
- 12-35 µg/m³ (Moderate): Sensitive individuals (asthma, heart disease, children <5, elderly >65) should limit prolonged outdoor exertion.
- 35-55 µg/m³ (Unhealthy for sensitive): Children and elderly should avoid prolonged outdoor activity. No outdoor exercise for asthmatics. Masks recommended for sensitive groups.
- 55-150 µg/m³ (Unhealthy): Everyone should reduce prolonged outdoor exertion. No jogging/cycling. Children should play indoors. N95 mask recommended outdoors.
- 150-250 µg/m³ (Very Unhealthy): Avoid all outdoor physical activity. Keep windows closed. Run air purifier indoors if available. N95 mask essential outdoors.
- 250+ µg/m³ (Hazardous/Severe): Stay indoors. Schools should close. No outdoor work without protection. Medical emergency risk for vulnerable populations.

Transport exposure multipliers (vs ambient): Walking 1.0x, Cycling 2-3x (heavy breathing), Auto-rickshaw 1.5x (open vehicle), Car (AC, windows up) 0.3-0.5x, Metro 0.2-0.4x, Bus 0.8-1.0x.
`;

const LANG_NAMES = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  ta: "Tamil (Tamil script)",
  bn: "Bengali (Bengali script)",
  mr: "Marathi (Devanagari script)",
};

function buildSystemPrompt(seasonal, lang) {
  const langName = LANG_NAMES[lang] || null;
  // If the UI passes a language code, hard-force the response language above
  // the numbered instructions. If no code, instruction 9 keeps the older
  // "match the user's question language" behaviour.
  const langOverride = langName
    ? `\nCRITICAL — RESPONSE LANGUAGE: The user has selected ${langName} as their interface language. You MUST respond entirely in ${langName}. Use the native script throughout (Devanagari, Tamil, Bengali as appropriate). Do not mix languages. Acronyms like NCAP, RTI, WHO, AQI, GRAP, PM2.5, PM10 may stay in Roman letters as they are widely recognised that way in Indian discourse. Numerals can be Indo-Arabic (1, 2, 3).\n`
    : "";

  const instruction9 = langName
    ? `9. Respond entirely in ${langName} (see CRITICAL note above).`
    : `9. Respond in the same language the question is asked in — Hindi in Devanagari, Tamil in Tamil script, Bengali in Bengali script, Marathi in Devanagari script.`;

  return `You are JanVayu, India's citizen-led air quality assistant. You are NOT a generic chatbot — you have access to LIVE pollution data and deep knowledge of India's air quality context.

TODAY: ${seasonal.dateStr}
SEASONAL CONTEXT: ${seasonal.season}

${ACTIVITY_THRESHOLDS}

KEY REFERENCE DATA:
- WHO annual PM2.5 guideline: 5 µg/m³. India's NAAQS: 40 µg/m³.
- India average PM2.5 (2025): 48.9 µg/m³ (~10x WHO limit)
- 1.72 million Indians die annually from air pollution (Lancet Countdown 2025)
- Economic cost: $339.4 billion/year (9.5% GDP)
- NCAP target: 40% PM10 reduction across 131 cities by 2025-26. Only 23 cities met this.
- Average Indian loses 3.5 years of life expectancy to pollution (AQLI)
- 1 SD increase in PM2.5 → 5 percentage point increase in child stunting
${langOverride}
INSTRUCTIONS:
1. Use the ACTUAL live data numbers provided — never give generic advice.
2. For "Should I..." questions: give a direct YES/NO first, then explain using the activity thresholds and the person's specific situation.
3. For health questions: be honest about risk using the data. Mention vulnerable groups (children <5, elderly >65, pregnant women, asthmatics).
4. For city comparisons: compare the actual current readings, explain the structural reasons for differences.
5. For policy/accountability questions: use NCAP data if available for the city.
6. For exposure estimates: use transport multipliers and the current PM2.5 level.
7. Include the seasonal context when it's relevant (e.g. stubble burning, monsoon).
8. If asked to draft an RTI: generate a proper RTI application format with department, subject, and specific questions.
${instruction9}
10. Keep responses under 200 words. Be direct, specific, and actionable.`;
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

  const { question, city, lang } = body;
  if (!question || !city) {
    return new Response(JSON.stringify({ error: "question and city are required" }), { status: 400, headers });
  }
  const requestedLang = LANG_NAMES[lang] ? lang : null;

  const cityKey = city.toLowerCase().replace(/\s+/g, "");
  const aqiResult = await fetchCityAQI(cityKey);

  if (!aqiResult) {
    return new Response(JSON.stringify({
      answer: `Live data unavailable for ${city} right now. Try another city or check back in 10 minutes.`,
      dataUsed: null,
    }), { status: 200, headers });
  }

  // Detect comparison queries and fetch second city if needed
  const compareMatch = question.match(/(?:compare|vs|versus|or)\s+(\w+)/i);
  let compareResult = null;
  if (compareMatch) {
    const secondCity = compareMatch[1].toLowerCase();
    if (CITIES[secondCity]) {
      compareResult = await fetchCityAQI(secondCity);
    }
  }

  let dataContext = `PRIMARY CITY — ${aqiResult.city}: AQI ${aqiResult.aqi}, PM2.5 ${aqiResult.pm25 ?? "N/A"} µg/m³, PM10 ${aqiResult.pm10 ?? "N/A"} µg/m³, Station: ${aqiResult.station}, Updated: ${aqiResult.time}.`;

  if (compareResult) {
    dataContext += `\nCOMPARISON CITY — ${compareResult.city}: AQI ${compareResult.aqi}, PM2.5 ${compareResult.pm25 ?? "N/A"} µg/m³, PM10 ${compareResult.pm10 ?? "N/A"} µg/m³, Station: ${compareResult.station}.`;
  }

  // Add NCAP city data if available
  const ncap = NCAP_CITY_DATA[cityKey];
  if (ncap) {
    dataContext += `\nNCAP DATA — ${ncap.ncapTarget}. Budget: ${ncap.budget}. Note: ${ncap.note}`;
  }

  const seasonal = getSeasonalContext();

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: buildSystemPrompt(seasonal, requestedLang) },
          { role: "user", content: `${dataContext}\n\nQuestion: ${question}` }
        ],
        max_tokens: 450,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const groqData = await groqRes.json();
    const text = groqData.choices?.[0]?.message?.content || "No response generated.";
    return new Response(JSON.stringify({ answer: text, dataUsed: aqiResult }), { status: 200, headers });
  } catch (e) {
    console.log("Groq error:", e.message);
    const fallback = `AI analysis unavailable right now. Raw PM2.5: ${aqiResult.pm25 ?? "N/A"} µg/m³ (${aqiResult.pm25 ? Math.round(aqiResult.pm25 / 5) + "x WHO guideline" : ""}).`;
    return new Response(JSON.stringify({ answer: fallback, dataUsed: aqiResult }), { status: 200, headers });
  }
}
