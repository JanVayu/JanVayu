// Netlify Function: Natural Language Query Interface for JanVayu
// Accepts a question + city, fetches live AQI, sends to Groq for analysis.
//
// v26.6.12 — User-feedback fixes:
//  1. Station-count queries now fetch the WAQI bounds endpoint to return
//     a real station list for the user's city, plus a CPCB CAAQMS national
//     reference figure.
//  2. System prompt requires explicit source citations on every claim.
//  3. Delhi/Mandir-Marg bias reduced — topical queries (EVs, sensors,
//     national schemes) are framed for India broadly, not defaulted to
//     Delhi context.

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

// v26.6.12 — Fetch the list of WAQI-indexed stations inside a 0.5° box
// around the city centroid. Used when the user asks "how many stations"
// so we can give a real count and a station-name sample rather than a
// generic guess.
async function fetchCityStations(cityKey) {
  const city = CITIES[cityKey];
  if (!city) return null;
  const d = 0.25;
  const bounds = `${city.lat - d},${city.lon - d},${city.lat + d},${city.lon + d}`;
  try {
    const res = await fetch(
      `https://api.waqi.info/map/bounds/?latlng=${bounds}&token=${WAQI_TOKEN}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    if (data.status === "ok" && Array.isArray(data.data)) {
      return data.data
        .map(s => ({ name: s.station?.name || `uid:${s.uid}`, aqi: s.aqi }))
        .filter(s => s.name && s.name !== "uid:undefined");
    }
  } catch (e) {
    console.log(`Failed to fetch station list for ${cityKey}:`, e.message);
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

  let diwaliNote = "";
  if (month === 10 && day >= 1 && day <= 15) {
    diwaliNote = " DIWALI PERIOD: Firecracker emissions cause extreme PM2.5 spikes (often 500+ µg/m³ in Delhi) lasting 2-3 days.";
  }

  return { dateStr, season: season + diwaliNote };
}

const NCAP_CITY_DATA = {
  delhi: { ncapTarget: "40% PM10 reduction by 2026", budget: "₹300 Cr pollution budget (43% utilised)", note: "Most polluted capital globally (IQAir 2025). 0 days met WHO limit in 2026." },
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

// v26.6.12 — Topical reference cards. Added to system prompt so the LLM
// has concrete, sourced facts for common non-AQI-data questions instead
// of falling back to generic Delhi-tinted training-data answers.
const TOPICAL_REFERENCE = `
MONITORING NETWORK (national):
- CPCB CAAQMS (Continuous Ambient Air Quality Monitoring Stations): ~533 stations across ~250 Indian cities as of 2025 (CPCB Annual Report).
- WAQI / aqicn.org: surfaces a subset of CAAQMS + community sensors. Geo lookups return the nearest single station.
- Sensor.Community: ~3,000+ CC0 low-cost community sensors across India (the "Hyperlocal" panel on JanVayu blends these with CPCB/WAQI data).
- CAG April 2025 audit: 88% of monitoring stations had data-quality issues at least once in 2023-24.

LOW-COST SENSORS:
- Sensor.Community (Open Knowledge Foundation, CC0): community-deployed PM2.5/PM10 sensors. Free data; lower accuracy than CPCB-grade but excellent spatial density.
- IQAir AirVisual (commercial, $300+): retail-grade laser scattering sensors; data licensed.
- Aerogram, OpenAQ, BreatheLife: aggregator platforms.

EVs & TRANSPORT POLICY (India-wide):
- BS-VI emission standards: nationwide since April 2020 (India skipped BS-V — went BS-IV → BS-VI direct).
- PM-eBus Sewa: ₹20,000 Cr scheme for 10,000 e-buses across 169 cities by 2026 (WRI India estimates ~$2.4B).
- FAME-II: ₹10,000 Cr EV adoption subsidy scheme; replaced by E-DRIVE (₹500 Cr) in 2024.
- Delhi e-bus fleet: 4,286 operational as of 9 Feb 2026 (largest in India). Target 7,500 by end 2026.
- 8,849 EV charging stations across India as of Dec 2025.

RECENT POLICY/COURT ACTIONS (Apr-May 2026):
- CAQM: invoked GRAP Stage-I off-season on 19 May 2026 (first-ever off-season invocation at AQI 208) — signals year-round enforcement.
- NGT: directed 6 south-Indian states (TN/KL/KA/AP/TS/PY) to file sector-wise PM10/PM2.5 reduction roadmaps tied to state budgets (Apr 2026).
- NGT: nationwide notices to all SPCBs/PCCs on diesel-generator retrofit non-compliance (9 Apr 2026; next hearing 21 Jul 2026).
- NCAP March 2026 deadline elapsed: 23/100 cities (CREA Jan 2026) or 37/131 (CSE Apr 2026 5-year review) met the target.
- 15th Finance Commission grants (₹16,539 Cr for 49 cities) expired 31 March 2026; 16th FC report expected Oct 2026.
`;

const LANG_NAMES = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  ta: "Tamil (Tamil script)",
  bn: "Bengali (Bengali script)",
  mr: "Marathi (Devanagari script)",
};

// v26.6.12 — Detect when the user is asking a NATIONAL/TOPICAL question
// vs a city-specific one. If national, we instruct the LLM to NOT default
// to Delhi context.
function isNationalQuery(question) {
  const q = question.toLowerCase();
  // Topical keywords that imply India-wide framing
  return /\b(india(n)?|nationwide|national|across cities|across india|bs-?vi|bs vi|e-?buses?|electric (bus|vehicle|car)|ev policy|charging station|sensor|low.?cost|community sensor|fame|pm-?ebus|caaqms|cpcb|stations? in india|monitoring (network|stations? )?|how many (stations|sensors|monitors|e-?buses?)|number of (stations|sensors|monitors|e-?buses?))\b/i.test(q);
}

function isStationCountQuery(question) {
  return /\b(how many (caaqms|monitoring |air quality |cpcb |waqi )?stations?|number of (monitoring |caaqms |cpcb )?stations?|number of caaqms|how many caaqms|station count|how many sensors|how many monitors|station list)\b/i.test(question);
}

function buildSystemPrompt(seasonal, lang, nationalQuery) {
  const langName = LANG_NAMES[lang] || null;
  const langOverride = langName
    ? `\nCRITICAL — RESPONSE LANGUAGE: The user has selected ${langName} as their interface language. You MUST respond entirely in ${langName}. Use the native script throughout (Devanagari, Tamil, Bengali as appropriate). Do not mix languages. Acronyms like NCAP, RTI, WHO, AQI, GRAP, PM2.5, PM10 may stay in Roman letters as they are widely recognised that way in Indian discourse. Numerals can be Indo-Arabic (1, 2, 3).\n`
    : "";

  const instruction9 = langName
    ? `9. Respond entirely in ${langName} (see CRITICAL note above).`
    : `9. Respond in the same language the question is asked in — Hindi in Devanagari, Tamil in Tamil script, Bengali in Bengali script, Marathi in Devanagari script.`;

  const nationalFraming = nationalQuery
    ? `\nIMPORTANT — NATIONAL/TOPICAL QUERY: The user's question is about an India-wide topic (monitoring network, low-cost sensors, EVs, BS-VI, NCAP, court orders, etc.) and NOT about their selected city's live air quality. Frame your answer for India broadly. Do NOT default to Delhi-specific or single-station (e.g. Mandir Marg) context. Use the TOPICAL REFERENCE block below for concrete facts.\n`
    : "";

  return `You are JanVayu, India's citizen-led air quality assistant. You are NOT a generic chatbot — you have access to LIVE pollution data and deep knowledge of India's air quality context.

TODAY: ${seasonal.dateStr}
SEASONAL CONTEXT: ${seasonal.season}

${ACTIVITY_THRESHOLDS}

${TOPICAL_REFERENCE}

KEY REFERENCE DATA (India-wide, not Delhi-specific):
- WHO annual PM2.5 guideline: 5 µg/m³. India's NAAQS: 40 µg/m³ (8× WHO).
- India average PM2.5: 48.9 µg/m³ (~10× WHO limit) — IQAir 2025.
- 1.72 million Indians die annually from air pollution — Lancet Countdown 2025 (~70% of global PM2.5 mortality).
- Economic cost: $339.4 billion/year, ~9.5% of GDP — Lancet Countdown 2025.
- NCAP target: 40% PM10 reduction across 131 non-attainment cities by 31 March 2026. Deadline elapsed: 23/100 cities (CREA) or 37/131 (CSE Apr 2026) met target.
- Average Indian loses 3.5 years of life expectancy to pollution — AQLI 2025. Indo-Gangetic Plain residents lose 7-8 years.
- 1 SD increase in PM2.5 → 5 percentage point increase in child stunting (Krishna et al. 2024).
- Most polluted city globally: Loni, India (112.5 µg/m³ annual) — IQAir 2025, the 2025 edition covering 2024 data.
${langOverride}${nationalFraming}
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
10. Keep responses under 200 words. Be direct, specific, and actionable.
11. ALWAYS cite the source for any specific number or claim. Use the formats: "per CREA Jan 2026", "IQAir 2025", "Lancet Countdown 2025", "CPCB CAAQMS", "Sensor.Community", "CAG April 2025 audit", "CSE April 2026", "NGT order Apr 2026", etc. If you cite a number without a source, you have failed.
12. For NATIONAL/TOPICAL questions (EVs, low-cost sensors, BS-VI, monitoring network, court orders, NCAP): use the TOPICAL REFERENCE block. Do NOT default to Delhi or single-station context unless the user explicitly asks about Delhi.
13. For station-count questions: cite both the CPCB national figure (~533 CAAQMS) and the live count for the user's city if provided in the DATA CONTEXT.`;
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

  // v26.6.12 — If the user asked about station counts, fetch the WAQI
  // bounds endpoint so we can return a real number rather than make one up.
  let stationList = null;
  if (isStationCountQuery(question)) {
    stationList = await fetchCityStations(cityKey);
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

  let dataContext = `PRIMARY CITY — ${aqiResult.city}: AQI ${aqiResult.aqi}, PM2.5 ${aqiResult.pm25 ?? "N/A"} µg/m³, PM10 ${aqiResult.pm10 ?? "N/A"} µg/m³, Nearest WAQI station: ${aqiResult.station}, Updated: ${aqiResult.time}.`;

  if (compareResult) {
    dataContext += `\nCOMPARISON CITY — ${compareResult.city}: AQI ${compareResult.aqi}, PM2.5 ${compareResult.pm25 ?? "N/A"} µg/m³, PM10 ${compareResult.pm10 ?? "N/A"} µg/m³, Station: ${compareResult.station}.`;
  }

  if (stationList && stationList.length > 0) {
    const sample = stationList.slice(0, 8).map(s => `${s.name} (AQI ${s.aqi})`).join("; ");
    dataContext += `\nWAQI STATIONS WITHIN ~25 km of ${aqiResult.city} CENTROID: ${stationList.length} indexed station(s). Sample: ${sample}.`;
    dataContext += `\nNOTE: This is the WAQI-indexed subset only. CPCB CAAQMS national total is ~533 stations across ~250 Indian cities (CPCB Annual Report). Sensor.Community adds ~3,000+ low-cost community sensors nationwide.`;
  } else if (isStationCountQuery(question)) {
    dataContext += `\nSTATION COUNT NOTE: WAQI bounds query returned no list for ${aqiResult.city}. CPCB CAAQMS national total is ~533 stations across ~250 Indian cities (CPCB Annual Report). Sensor.Community runs ~3,000+ low-cost community sensors nationwide.`;
  }

  // Add NCAP city data if available
  const ncap = NCAP_CITY_DATA[cityKey];
  if (ncap) {
    dataContext += `\nNCAP DATA — ${ncap.ncapTarget}. Budget: ${ncap.budget}. Note: ${ncap.note}`;
  }

  const seasonal = getSeasonalContext();
  const nationalQuery = isNationalQuery(question);

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: buildSystemPrompt(seasonal, requestedLang, nationalQuery) },
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
