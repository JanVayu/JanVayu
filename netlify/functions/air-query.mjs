import { readFileSync } from 'fs';
// Deterministic calculators live in a shared, unit-tested module (single source
// of truth; see test/calc.test.mjs). esbuild bundles this relative import.
import {
  calcCigarettes, calcMortalityRisk, calcLifeExpectancyLoss, calcMigrationBenefit,
  TRANSPORT_MULTIPLIERS, extractTransportFromQuestion, calcTransportExposure,
  calcPurifierCADR, extractRoomSizeFromQuestion, calcSchoolClosureRisk,
} from './lib/calc.mjs';

// Resolve the bundled data file relative to this module. We intentionally do
// NOT declare `__dirname`/`__filename` here: Netlify's esbuild bundler injects
// its own shims for those identifiers, and redeclaring them throws
// "Identifier '__dirname' has already been declared" at load time (502).
const REF_DATA = JSON.parse(
  readFileSync(new URL('./data/reference-data.json', import.meta.url), 'utf8')
);

// v26.6.27 — Ward Atlas data (10 cities, satellite-derived per-ward heat /
// green cover / built-up). Lets the chatbot answer "hottest/greenest/most
// built-up ward in <city>" and per-ward lookups. Per-ward AIR quality is
// live-interpolated on the map only, so it is intentionally NOT in here.
const WARD_DATA = JSON.parse(
  readFileSync(new URL('./data/ward-stats.json', import.meta.url), 'utf8')
);

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
//
// v26.6.18 — Chatbot accuracy & UI feedback improvements:
//  1. CPCB station reference data per city (CAAQMS vs manual bifurcation)
//     for accurate station-count answers (fixes Patna station count issue).
//  2. Generic AQI queries now auto-fetch multi-station data and present
//     city-wide AQI range instead of single nearest station (fixes Delhi
//     Mandir Marg single-station bias).
//  3. Low-cost sensor query detection expanded to catch "low cost sensors
//     in [city]" patterns.
//  4. System prompt updated with instructions for station bifurcation and
//     multi-station range presentation.

const WAQI_TOKEN = "1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3";

// v26.6.33 — Groq model, env-overridable. llama-3.3-70b-versatile retires on
// Groq 16 Aug 2026; default to the production replacement openai/gpt-oss-120b.
// Override via GROQ_MODEL env var without a code change.
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const GROQ_IS_REASONING = /gpt-oss|deepseek|qwen/.test(GROQ_MODEL);

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

// NCAP city data — loaded from data/reference-data.json
const NCAP_CITY_DATA = REF_DATA.ncap_cities;

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
// v26.6.13 — Methodology calibration block. The number-one differentiator
// from a generic chatbot is correctly explaining when two sources disagree
// (CPCB vs WAQI vs IQAir) and which to trust for what.
const METHODOLOGY_REFERENCE = `
METHODOLOGY — HOW TO RECONCILE DIFFERING NUMBERS:

1) CPCB Indian AQI vs US EPA AQI (used by WAQI / aqicn.org)
   - Same underlying PM2.5 µg/m³ — different scale/breakpoints/colours.
   - At PM2.5 = 60 µg/m³: CPCB AQI ≈ 150 (Moderate); US EPA AQI ≈ 154 (Unhealthy for sensitive groups). Close, but the COLOUR/CATEGORY differs.
   - At PM2.5 = 100 µg/m³: CPCB AQI ≈ 174 (Moderate); US EPA AQI ≈ 174 (Unhealthy). The Indian "Moderate" hides what US EPA flags as Unhealthy.
   - For health framing, ALWAYS lead with raw µg/m³ and the WHO 5 µg/m³ annual guideline. Quote AQI only with explicit scale name.

2) WAQI single station vs CPCB CAAQMS network
   - WAQI 'geo:' returns the nearest single station to a centroid. NOT the city average. NOT all stations.
   - CPCB CAAQMS has ~565 stations across ~250 cities (2025); a city often has 5-20 stations with substantial variance (e.g. Delhi: Anand Vihar can be 200 µg/m³ while Lodhi Road is 90 µg/m³ on the same day).
   - When user asks "what is Delhi AQI", clarify: live readings shown are the NEAREST station, not a city average.

3) CPCB annual vs IQAir World Air Quality Report
   - CPCB uses its own CAAQMS network; IQAir aggregates CPCB + commercial sensors + satellite. Methodologies differ.
   - IQAir 2025 ranked Loni at 112.5 µg/m³ annual (the 2025 edition was published March 2025 covering 2024 calendar-year data). CPCB's own Loni annual may be 5-15% different — both are valid; IQAir is more widely cited in international press, CPCB is the official Indian regulatory figure.
   - CAG April 2025 audit: 88% of CPCB monitoring stations had at least one data-quality issue in 2023-24. Treat any single-source claim with appropriate scepticism.

4) Mortality: Jaganathan et al. (1.5M, causal) vs Lancet Countdown 2025 (1.72M, synthesis)
   - 1.5M is from Jaganathan et al. 2024 (Lancet Planetary Health) — first India-wide causal estimate, a difference-in-differences design across 655 districts. Compares to WHO 5 µg/m³ scenario.
   - 1.72M is from Lancet Countdown 2025 (launched May 2026) — synthesis figure with revised exposure-response and household biomass re-attribution.
   - Both are valid. The 1.72M figure is the CURRENT canonical headline; the 1.5M is the original causal evidence base.

5) Low-cost sensors (Sensor.Community, IQAir AirVisual, Aerogram) vs regulatory-grade (CPCB CAAQMS)
   - Low-cost: ~20-50% accuracy degradation, but excellent spatial density (~3,000+ CC0 sensors). Best for HYPERLOCAL variation.
   - Regulatory: 5-10% accuracy, but sparse coverage (~2-3 stations per non-NCR city). Best for CITY-LEVEL averages and trend.
   - Surface BOTH when relevant; explain that disagreement is expected at small spatial scales.
`;

const TOPICAL_REFERENCE = `
MONITORING NETWORK (national):
- CPCB CAAQMS (Continuous Ambient Air Quality Monitoring Stations): ~565 stations across ~250 Indian cities as of 2025 (CPCB data via CREA 'Tracing the Hazy Air 2026', Jan 2026).
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

URBAN HEAT ISLAND & THE HEAT–AIR-QUALITY LINK (national topic, Delhi is just the data-rich example):
- Heat and air pollution are linked, not separate problems. On one summer day a thermal survey of Delhi recorded 52°C (Mubarakpur, dense/built-up) vs 34°C (Mehrauli, green) — up to 18°C apart under the same sun (India Today map).
- Artha Global white paper "Mapping Heat Inequality Across Neighbourhoods in Delhi" (Sircar et al., Jan 2026; survey of 2,368 households across all 70 Delhi assembly constituencies): raising built-up area 25%→55% adds +0.6°C experienced heat; raising tree cover 3%→11% removes −1°C. Conclusion: "trees cool more than concrete heats"; green cover is thermal infrastructure that CANNOT be retrofitted once a colony is built.
- Heat cooks ozone ("climate penalty"): ground-level ozone is photochemical (NOx + VOCs in sunlight) and forms faster as temperature rises — about +3 ppb O3 per °C (Bloomer et al. 2009, Geophysical Research Letters). Jacob & Winner 2009 (Atmospheric Environment): warming raises ozone, and a warmer climate is also more STAGNANT (traps pollutants on hot, still days).
- Cooling spiral: hotter areas run more AC → more coal-grid power (PM2.5/SO2), and AC waste heat itself raises night-time street temperature by >1°C (Salamanca et al. 2014, JGR-Atmospheres).
- Trees do double duty: canopy lowers temperature AND removes particulate + gaseous pollution (Nowak et al. 2014, Environmental Pollution).
- Co-exposure compounds harm: heat-wave deaths were 54% higher on high-ozone days (Analitis et al. 2014, Epidemiology); confirmed across 620 cities in 36 countries (Stafoggia et al. 2023, Environment International).
- JanVayu's "Urban Heat Island" panel (janvayu.in/#urban-heat) has the neighbourhood heat map, an interactive built-up-vs-tree-cover heat estimator, and a LIVE hourly ozone-vs-temperature chart for any Indian city (Open-Meteo/CAMS).
`;

const LANG_NAMES = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  ta: "Tamil (Tamil script)",
  bn: "Bengali (Bengali script)",
  mr: "Marathi (Devanagari script)",
  te: "Telugu (Telugu script)",
  gu: "Gujarati (Gujarati script)",
  kn: "Kannada (Kannada script)",
  ml: "Malayalam (Malayalam script)",
  pa: "Punjabi (Gurmukhi script)",
};

// v26.6.12 — Detect when the user is asking a NATIONAL/TOPICAL question
// vs a city-specific one. If national, we instruct the LLM to NOT default
// to Delhi context.
function isNationalQuery(question) {
  const q = question.toLowerCase();
  // Topical keywords that imply India-wide framing
  return /\b(india(n)?|nationwide|national|across cities|across india|bs-?vi|bs vi|e-?buses?|electric (bus|vehicle|car)|ev policy|charging station|sensor|low.?cost|community sensor|fame|pm-?ebus|caaqms|cpcb|stations? in india|monitoring (network|stations? )?|how many (stations|sensors|monitors|e-?buses?)|number of (stations|sensors|monitors|e-?buses?)|urban heat|heat island|heatwave|heat wave|tree cover|green cover|canopy|concrete (jungle|heat)|how does heat|ozone (and|vs) (heat|temperature)|hotter (neighbourhood|neighborhood|colony|area))\b/i.test(q);
}

function isStationCountQuery(question) {
  return /\b(how many (caaqms|monitoring |air quality |cpcb |waqi )?stations?|number of (monitoring |caaqms |cpcb )?stations?|number of caaqms|how many caaqms|station count|how many sensors|how many monitors|station list|installed\s+(?:in|at)|monitoring\s+(?:in|at|for))\b/i.test(question);
}

// v26.6.18 — CPCB station reference data per city. Sourced from CPCB
// Annual Report 2024-25 and ENVIS Centre. Includes CAAQMS (continuous,
// real-time) vs manual (gravimetric, 24-hr sampling, twice-weekly).
// Loaded from data/reference-data.json
const CPCB_STATION_DATA = REF_DATA.cpcb_stations;

// v26.6.13 — Phase A query-routing detectors. The LLM gets data
// from these endpoints when the user's question fits the pattern.
function isRankingQuery(question) {
  return /\b(rank(ing)?s?|top \d+|worst \d+|cleanest|most polluted|dirtiest|best (air|aqi)|leaderboard|which (cit(y|ies)|are) (most|worst|best|cleanest|dirtiest|polluted)|where is (the )?(worst|cleanest|best|dirtiest))\b/i.test(question);
}

function isTrendQuery(question) {
  return /\b(trend|history|historical|over time|past (year|month|5 year|decade)|since 20\d\d|getting (better|worse|cleaner|dirtier)|year ?over ?year|yoy|2019 vs|compared to (previous|last) year|annual average)\b/i.test(question);
}

function isHyperlocalQuery(question) {
  return /\b(my (area|locality|neighbourhood|neighborhood|colony|ward|society)|near (my|me)|hyperlocal|sensor near|community sensor|street level|within \d+ ?km|local (sensor|monitor)|sensor\.community|low.?cost sensor|low.?cost monitor)\b/i.test(question);
}

// v26.6.44 — Forecast intent. Matches "will it be bad tomorrow", "forecast",
// "next few days", "this weekend", etc.
function isForecastQuery(question) {
  return /\b(forecast|tomorrow|day after|next (few )?days?|coming days?|this (weekend|week)|next week|later (today|this week)|outlook|predict(ed|ion)?|expected|going to (be|get)|will .*(be|get) (bad|worse|better|clear|clean|safe))\b/i.test(question);
}

function isGenericAQIQuery(question) {
  return /\b(how is|what is|what'?s|current|today'?s?|right now|live)\b.{0,30}\b(air quality|aqi|air|pollution|pm2\.?5|pm10)\b/i.test(question);
}

// v26.6.13 — Base URL for HTTP-to-self calls to other Netlify Functions.
// In production, process.env.URL is the canonical site URL. Locally
// (netlify dev) it falls back to localhost. We tolerate failures —
// if a tool call fails the LLM still has the live AQI + topical refs.
const SELF_BASE_URL = process.env.URL || process.env.DEPLOY_URL || "https://www.janvayu.in";

async function fetchRankings(range = "live") {
  try {
    const res = await fetch(`${SELF_BASE_URL}/.netlify/functions/rankings?range=${encodeURIComponent(range)}`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.cities)) return null;
    return data; // {range, cities: [{city, key, aqi, pm25, ...}], generated}
  } catch (e) {
    console.log(`fetchRankings(${range}) failed:`, e.message);
    return null;
  }
}

async function fetchHistoricalTrend(cityKey, month) {
  try {
    const res = await fetch(
      `${SELF_BASE_URL}/.netlify/functions/historical-aqi?city=${encodeURIComponent(cityKey)}&month=${encodeURIComponent(month)}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.years) || data.years.length === 0) return null;
    return data; // {city, month, years: [{year, pm25}], source}
  } catch (e) {
    console.log(`fetchHistoricalTrend(${cityKey},${month}) failed:`, e.message);
    return null;
  }
}

// v26.6.44 — 5-day PM2.5/PM10 forecast from the free, key-less Open-Meteo
// Air Quality API (CAMS-based global model). Returns daily mean/peak PM2.5.
// Independent of the live WAQI reading, so the bot can answer "will it be bad
// tomorrow" with a model forecast rather than guessing from today's number.
async function fetchForecast(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,pm10&timezone=auto&forecast_days=5`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json();
    const times = data?.hourly?.time || [];
    const pm25 = data?.hourly?.pm2_5 || [];
    if (!times.length || !pm25.length) return null;
    const byDay = {};
    for (let i = 0; i < times.length; i++) {
      const day = times[i].slice(0, 10);
      if (!byDay[day]) byDay[day] = [];
      if (pm25[i] != null && !isNaN(pm25[i])) byDay[day].push(pm25[i]);
    }
    const days = Object.keys(byDay).sort().slice(0, 5).map(day => {
      const v = byDay[day];
      const mean = v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
      const max = v.length ? Math.round(Math.max(...v)) : null;
      return { date: day, pm25_mean: mean, pm25_max: max };
    }).filter(d => d.pm25_mean != null);
    if (!days.length) return null;
    return { days, source: "Open-Meteo Air Quality API (CAMS-based, 5-day forecast)" };
  } catch (e) {
    console.log(`fetchForecast(${lat},${lon}) failed:`, e.message);
    return null;
  }
}

async function fetchCommunitySensors(lat, lon, radiusKm = 25) {
  try {
    const res = await fetch(
      `${SELF_BASE_URL}/.netlify/functions/community-sensors?lat=${lat}&lon=${lon}&radius=${radiusKm}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.stations)) return null;
    return data; // {stations: [...]}
  } catch (e) {
    console.log(`fetchCommunitySensors failed:`, e.message);
    return null;
  }
}

// ════════════════════════════════════════════════════════════════════════
// v26.6.14 — Phase B deterministic calculators
// The chatbot now EXECUTES these (returns real numbers) instead of
// describing the formula and letting the LLM guess. Every calculator
// has a fixed primary-source citation that goes back to the LLM with
// the result so the answer can quote it.
// ════════════════════════════════════════════════════════════════════════

// The deterministic calculators (cigarettes, mortality, life-expectancy,
// migration, transport, purifier CADR, school-closure) now live in
// ./lib/calc.mjs — imported at the top of this file and unit-tested in
// test/calc.test.mjs. This keeps a single source of truth for the formulas.

// Detector for any "execute a calculator" intent.
function detectCalculatorIntent(question) {
  const q = question.toLowerCase();
  return {
    cigarettes: /\b(cigarette|smoke|smoking|cig\b|berkeley)\b/.test(q),
    mortality: /\b(mortality|risk|death|chance of dying|annual risk|relative risk|hazard)\b/.test(q),
    lifeExpectancy: /\b(life expectancy|aqli|years (of life|lost|gained)|how (much|many) years)\b/.test(q),
    migration: /\b(should i move|moving (from|to)|relocate|switch (city|cities)|migrate|migration)\b/.test(q),
    transport: /\b(commute|by (auto|car|cab|taxi|metro|bus|cycle|bicycle|scooter|motorcycle)|ride (a |an |the )?(auto|bus|metro|cycle)|how much do i breathe in)\b/.test(q) && /\d+\s*(?:hours?|hrs?|h\b)/.test(q),
    purifier: /\b(purifier|cadr|air cleaner|hepa|filter for room)\b/.test(q),
    schoolClosure: /\b(school closure|will schools? close|schools closed|grap.*school|child.*school)\b/.test(q),
  };
}

function extractCityFromQuestion(question, fallbackKey) {
  // Match any CITIES key (or known alias like "bangalore"/"bengaluru")
  const q = question.toLowerCase();
  for (const k of Object.keys(CITIES)) {
    if (new RegExp(`\\b${k}\\b`).test(q)) return k;
  }
  // Bengaluru alias
  if (/\bbengaluru\b/.test(q)) return "bangalore";
  return fallbackKey;
}

// Run every applicable calculator. Returns a formatted block to inject.
async function runCalculators(question, aqiResult, cityKey) {
  const intent = detectCalculatorIntent(question);
  const out = [];
  const pm25 = aqiResult.pm25;
  const aqi = aqiResult.aqi;
  const month = new Date().getMonth() + 1;

  if (intent.cigarettes && pm25) {
    const c = calcCigarettes(pm25);
    out.push(`CIGARETTE EQUIVALENCE (computed): At ${aqiResult.city}'s live PM2.5 of ${pm25} µg/m³, today's air ≈ ${c.perDay} cigarettes/day, ${c.perWeek}/week, ${c.perYear}/year. Source: ${c.source}.`);
  }
  if (intent.mortality && pm25) {
    const m = calcMortalityRisk(pm25);
    out.push(`MORTALITY RISK (computed): Live PM2.5 ${pm25} µg/m³ is ${m.aboveWHO} µg/m³ above the WHO 5 µg/m³ guideline → +${m.excessMortalityPct}% all-cause mortality risk vs WHO-compliance scenario. Source: ${m.source}.`);
  }
  if (intent.lifeExpectancy && pm25) {
    const l = calcLifeExpectancyLoss(pm25);
    out.push(`LIFE-EXPECTANCY LOSS (computed): At PM2.5 ${pm25} µg/m³ sustained annually, a resident loses ≈ ${l.yearsLost} years of life expectancy (vs WHO 5 µg/m³). Source: ${l.source}.`);
  }
  if (intent.migration) {
    // Extract destination city from question (current city = aqiResult)
    const destKey = extractCityFromQuestion(question, null);
    if (destKey && destKey !== cityKey) {
      const destAqi = await fetchCityAQI(destKey);
      if (destAqi && destAqi.pm25 && pm25) {
        const mig = calcMigrationBenefit(pm25, destAqi.pm25);
        if (mig) {
          out.push(`MIGRATION CALCULATION (computed): Moving from ${aqiResult.city} (live PM2.5 ${pm25} µg/m³) to ${destAqi.city} (live PM2.5 ${destAqi.pm25} µg/m³) → +${mig.yearsGained} years life expectancy (AQLI 2025), ${mig.cigsSavedPerYear > 0 ? "−" : "+"}${Math.abs(mig.cigsSavedPerYear)} cigarette-day equivalents per year. NOTE: this uses TODAY's snapshot, not annual averages; check IQAir 2025 annual figures for the two cities for a more robust comparison.`);
        }
      } else {
        out.push(`MIGRATION CALCULATION: Could not fetch live PM2.5 for destination ${destKey}; unable to compute.`);
      }
    }
  }
  if (intent.transport && pm25) {
    const tr = extractTransportFromQuestion(question);
    if (tr) {
      const t = calcTransportExposure(pm25, tr.mode, tr.hours);
      if (t) {
        out.push(`TRANSPORT EXPOSURE (computed): ${t.hours} hr/day of ${t.mode} at ambient PM2.5 ${pm25} µg/m³ → effective in-mode PM2.5 ${t.localPm25} µg/m³ (×${t.multiplier} ambient), which is ${t.pctOfDailyDose}% of a full 24-hour ambient dose. Cigarette equivalent of just this commute window: ${t.equivCigsForCommute} cigs/day. Source: ${t.source}.`);
      }
    }
  }
  if (intent.purifier) {
    const sqft = extractRoomSizeFromQuestion(question);
    if (sqft) {
      const p = calcPurifierCADR(sqft);
      out.push(`PURIFIER CADR (computed): For a ${sqft} sqft room with 9 ft ceiling at ${p.targetACH} air changes/hour, you need a purifier with CADR ≥ ${p.cadrCfm} CFM (${p.cadrM3h} m³/h). Indian winter PM2.5 typically needs ACH 5+. Source: ${p.source}.`);
    } else {
      out.push(`PURIFIER CADR: User asked about purifier sizing but did not specify room size. Ask them for room square footage (e.g. "300 sqft") then re-query; rule of thumb at 9 ft ceiling: CADR (CFM) ≈ room-sqft × 9 × 5 / 60 = sqft × 0.75.`);
    }
  }
  if (intent.schoolClosure) {
    const s = calcSchoolClosureRisk(aqi, month);
    if (s) {
      out.push(`SCHOOL CLOSURE FORECAST (computed): Live AQI ${aqi}, month ${month}. Risk: ${s.risk}. Trigger: ${s.trigger}. Source: ${s.source}.`);
    }
  }

  return out.length > 0 ? "\n\n" + out.join("\n") : "";
}

// ════════════════════════════════════════════════════════════════════════
// v26.6.15 — Phase C: source apportionment + RTI templates
// ════════════════════════════════════════════════════════════════════════

// Source apportionment from CEEW 2024 national synthesis +
// TERI/ARAI/IIT-Delhi DSS city-level studies. Percentages are
// annual averages; winter often shifts more heavily to combustion
// (residential + stubble) and dust drops as a share.
// Each entry includes a citation that goes back to the LLM.
const APPORTIONMENT = {
  delhi: {
    sources: [
      { name: "Vehicles (exhaust + non-exhaust)", pct: 25, note: "Diesel-heavy + tyre/brake wear; non-exhaust often matches tailpipe" },
      { name: "Industries + coal thermal power (300-km radius)", pct: 22 },
      { name: "Residential biomass + LPG-poor cooking", pct: 13 },
      { name: "Road dust + construction", pct: 18 },
      { name: "Open waste burning", pct: 8 },
      { name: "Stubble burning (Oct–Nov peak)", pct: 14, note: "Up to 40% during 2–3 peak winter weeks" },
    ],
    citation: "CAQM 27th Meeting (Feb 2026); IIT-Delhi DSS 2024; CEEW 2024",
    seasonal: "Winter inversion concentrates combustion sources. Summer: dust dominates PM10.",
  },
  mumbai: {
    sources: [
      { name: "Vehicles (incl. fleet diesel)", pct: 28, note: "Highest in metros after Delhi-NCR" },
      { name: "Industries (Mahul-Trombay cluster, refineries)", pct: 19 },
      { name: "Road & construction dust", pct: 15 },
      { name: "Residential cooking", pct: 11 },
      { name: "Open waste + landfill burning (Deonar, Mulund)", pct: 9 },
      { name: "Sea-salt + secondary aerosols", pct: 18 },
    ],
    citation: "TERI-Mumbai source apportionment 2021; CSIR-NEERI 2023",
    seasonal: "Better dispersion year-round; PM2.5 spikes during post-monsoon (Oct–Dec) inversion.",
  },
  bangalore: {
    sources: [
      { name: "Vehicles (worst growing source)", pct: 35, note: "Bengaluru's fleet doubled 2010-2023" },
      { name: "Industries (Peenya, electronics city)", pct: 14 },
      { name: "Construction dust", pct: 22, note: "Construction permits doubled 2018-2024" },
      { name: "Residential", pct: 9 },
      { name: "Lake-bed + waste burning", pct: 8 },
      { name: "Secondary aerosols + biomass", pct: 12 },
    ],
    citation: "CSIR-NEERI 2023; KSPCB studies 2022",
    seasonal: "Generally favourable meteorology; pre-monsoon (Apr–May) sees dust spikes.",
  },
  kolkata: {
    sources: [
      { name: "Vehicles (heavy commercial + auto)", pct: 26 },
      { name: "Coal/diesel small industries", pct: 23 },
      { name: "Residential biomass cooking", pct: 15 },
      { name: "Road dust", pct: 14 },
      { name: "Open burning + waste", pct: 11 },
      { name: "Brick kilns (peri-urban)", pct: 11 },
    ],
    citation: "Bose Institute 2022; Jadavpur Univ. source apportionment",
    seasonal: "Winter inversions + Gangetic delta humidity → severe PM2.5 episodes Dec–Jan.",
  },
  chennai: {
    sources: [
      { name: "Industries (Manali, Ennore — coal + petrochem)", pct: 28 },
      { name: "Vehicles", pct: 22 },
      { name: "Sea-salt + secondary aerosols", pct: 20 },
      { name: "Road dust + construction", pct: 14 },
      { name: "Residential biomass", pct: 8 },
      { name: "Open waste burning", pct: 8 },
    ],
    citation: "CPCB-Chennai 2023; IIT-Madras air quality studies",
    seasonal: "Sea breeze helps disperse; northeast monsoon (Oct–Dec) sees occasional inversion.",
  },
  lucknow: {
    sources: [
      { name: "Vehicles", pct: 24 },
      { name: "Brick kilns (UP-major)", pct: 21 },
      { name: "Residential biomass", pct: 18 },
      { name: "Road dust", pct: 16 },
      { name: "Industries", pct: 12 },
      { name: "Open burning", pct: 9 },
    ],
    citation: "TERI 2022; UP PCB studies",
    seasonal: "Indo-Gangetic Plain trapping; winter combustion peaks.",
  },
  patna: {
    sources: [
      { name: "Residential biomass + chulha", pct: 26, note: "Highest residential share among metros" },
      { name: "Vehicles + diesel gensets", pct: 21 },
      { name: "Brick kilns (Bihar cluster)", pct: 17 },
      { name: "Road dust", pct: 15 },
      { name: "Open burning", pct: 12 },
      { name: "Stubble (Punjab+Bihar)", pct: 9 },
    ],
    citation: "ICAR-RCER 2023; Bihar PCB studies; CEEW 2024",
    seasonal: "Trapped IGP geography → among India's worst annual PM2.5; biomass-heavy winter.",
  },
  pune: {
    sources: [
      { name: "Vehicles", pct: 30 },
      { name: "Construction + road dust", pct: 22 },
      { name: "Industries (Pimpri-Chinchwad)", pct: 18 },
      { name: "Residential", pct: 10 },
      { name: "Open burning + secondary", pct: 20 },
    ],
    citation: "IITM-Pune; CSIR-NEERI 2022",
    seasonal: "Hill-shielded relief; pre-monsoon (Apr–May) sees brief PM10 spikes.",
  },
  varanasi: {
    sources: [
      { name: "Road dust (NCAP-top performer reduced this 76%)", pct: 35 },
      { name: "Brick kilns + small industries", pct: 19 },
      { name: "Vehicles", pct: 16 },
      { name: "Residential biomass", pct: 14 },
      { name: "Open burning + stubble", pct: 16 },
    ],
    citation: "NCAP CREA 2024; BHU studies",
    seasonal: "Dust-dominated; combustion sources persist year-round.",
  },
  ahmedabad: {
    sources: [
      { name: "Industries (Naroda, Vatva)", pct: 25 },
      { name: "Vehicles", pct: 22 },
      { name: "Road & construction dust", pct: 20 },
      { name: "Brick kilns", pct: 13 },
      { name: "Residential biomass", pct: 11 },
      { name: "Open burning + secondary", pct: 9 },
    ],
    citation: "GPCB studies; IIT-Gandhinagar source apportionment",
    seasonal: "Dust storms in pre-monsoon; mild winter.",
  },
};

const NATIONAL_APPORTIONMENT = {
  sources: [
    { name: "Residential biomass cooking (LPG-poor households)", pct: 30, note: "Largest single contributor nationally — disproportionately women + children" },
    { name: "Industries (incl. brick kilns, small-scale)", pct: 25 },
    { name: "Vehicles (exhaust + non-exhaust)", pct: 18 },
    { name: "Road dust + construction", pct: 12 },
    { name: "Open waste + crop burning", pct: 10 },
    { name: "Power plants (esp. coal TPPs)", pct: 5 },
  ],
  citation: "CEEW 2024 'Source Apportionment of PM2.5 in India' — national synthesis",
  note: "These percentages vary substantially by city; see city-specific blocks for local breakdowns.",
};

function getApportionment(cityKey) {
  return APPORTIONMENT[cityKey] || null;
}

function isApportionmentQuery(question) {
  const q = question.toLowerCase();
  return /\b(source(s)? of pollution|where does (the )?(pollution|pm) come from|apportionment|what causes|main (source|contributor)|source mix|breakdown of (sources|emissions)|dominant source|biomass|stubble share|how much (is|from) (vehicles|industry|industries|biomass|dust|construction))\b/i.test(q);
}

// ── RTI template helper ────────────────────────────────────────────────
// JanVayu's existing RTI Assistant panel covers ~6 use-cases. The bot
// can now draft one inline. Each template comes with the correct
// department per CPCB-Act / EPA / RTI Act 2005.

const RTI_TEMPLATES = {
  station_data: {
    title: "Air quality monitoring station data",
    department: "Central Pollution Control Board (CPCB) Public Information Officer",
    address: "Parivesh Bhawan, East Arjun Nagar, Delhi 110032",
    questions: [
      "How many CAAQMS (Continuous Ambient Air Quality Monitoring Stations) are currently operational in [CITY]?",
      "What is the hourly PM2.5 and PM10 data for the past 90 days from each station, in CSV or PDF format?",
      "What is the data-uptime percentage for each station during the past 12 months?",
      "What is the calibration schedule for the PM2.5/PM10 analysers at each station?",
      "Provide copies of any data-quality audit reports for these stations.",
    ],
    statutory: "Right to Information Act, 2005 — Section 6(1)",
  },
  ncap_funds: {
    title: "NCAP fund utilisation",
    department: "Public Information Officer, [STATE] Pollution Control Board (cc: CPCB)",
    address: "(use the city-specific SPCB address)",
    questions: [
      "What is the total NCAP allocation released to [CITY] for FY 2024-25 and FY 2025-26, broken down by financial-year tranches?",
      "Provide a category-wise breakdown of NCAP funds utilised (road dust suppression, industrial control, transport, public awareness, etc.).",
      "What is the unutilised balance as of 31 March 2026 (the NCAP deadline)?",
      "Provide copies of all utilisation certificates (UCs) submitted to MoEFCC for these tranches.",
      "List the tenders awarded under NCAP for [CITY] with vendor names, amounts, and outcomes.",
    ],
    statutory: "Right to Information Act, 2005 — Section 6(1); National Clean Air Programme (2019)",
  },
  industry_compliance: {
    title: "Industry / brick-kiln / power-plant compliance",
    department: "Public Information Officer, [STATE] Pollution Control Board",
    address: "(use SPCB Regional Office for [DISTRICT])",
    questions: [
      "Provide a list of industries / brick kilns within [PINCODE] / [WARD] operating with valid Consent to Operate (CTO) and those operating without consent.",
      "Provide copies of the last 12 months of self-monitoring (CEMS) data submitted by these units, if any.",
      "What enforcement actions (closure notices, environmental compensation, criminal complaints) have been taken in this area in the past 24 months?",
      "Has any unit in this area been audited under the CPCB-mandated stack-emission protocol in the past 12 months? Provide reports.",
      "Provide a copy of the FGD (flue-gas desulphurisation) compliance status report for any coal thermal power plant within 100 km.",
    ],
    statutory: "Right to Information Act, 2005; Air (Prevention and Control of Pollution) Act, 1981; Environment (Protection) Act, 1986",
  },
  grap_enforcement: {
    title: "GRAP enforcement in Delhi-NCR",
    department: "Public Information Officer, Commission for Air Quality Management (CAQM)",
    address: "Vayu Bhawan, Plot No.4, Sector-21, Dwarka, Delhi 110077",
    questions: [
      "For each GRAP stage invocation in the period Oct 2025 – Mar 2026, provide the AQI trigger date, time of invocation, and the source of the AQI reading.",
      "Provide a list of construction sites in [CITY] that were issued show-cause notices during GRAP Stage III or IV.",
      "How many vehicles were impounded under the BS-III petrol / BS-IV diesel ban during GRAP Stage IV in this period?",
      "Provide a copy of the CAQM compliance audit for the [DATE] off-season GRAP invocation.",
      "What action has been taken against agencies that failed to implement GRAP measures within the prescribed 24-hour window?",
    ],
    statutory: "Right to Information Act, 2005; CAQM Act 2021; Air Act 1981",
  },
  school_closure: {
    title: "School closure records",
    department: "Public Information Officer, Directorate of Education, Government of [STATE]",
    address: "(state-specific)",
    questions: [
      "Provide the official school-closure order(s) issued during Winter 2025-26 (Nov 2025 – Feb 2026) by date and applicability.",
      "How many school days were lost in government schools in [CITY] due to GRAP-related closures during this period?",
      "What alternative arrangements (online classes, equipment distribution) were made for government-school students during these closures?",
      "Provide the gender-disaggregated enrolment-drop data for the affected period.",
      "What budget allocation has been made for the Winter 2026-27 pollution-season contingency?",
    ],
    statutory: "Right to Information Act, 2005; Right of Children to Free and Compulsory Education Act, 2009",
  },
  health_burden: {
    title: "Public-health burden from air pollution in [CITY]",
    department: "Public Information Officer, Department of Health & Family Welfare, Government of [STATE]",
    address: "(state-specific)",
    questions: [
      "Provide the year-wise (2019–2025) hospital admission counts for respiratory and cardiovascular conditions for [CITY], from district-level health surveillance.",
      "Provide the same data disaggregated by age group (under-5, 5-18, 18-60, 60+) and gender.",
      "What is the documented correlation analysis (if any) between PM2.5 levels and these admissions performed by the state health department?",
      "What public-health advisories were issued during GRAP Stage III/IV events in Winter 2025-26?",
      "What screening / N95 mask distribution programmes were implemented during this period?",
    ],
    statutory: "Right to Information Act, 2005",
  },
};

function detectRTIIntent(question) {
  const q = question.toLowerCase();
  // Explicit RTI trigger phrases
  if (!/\b(rti|right to information|draft (a |an )?(rti|application)|file (an? )?rti|request information|public information officer)\b/.test(q)) {
    return null;
  }
  if (/\b(station|monitor|caaqms|data|sensor)/.test(q)) return "station_data";
  if (/\b(ncap|fund|budget|utili[zs]ation|tender)/.test(q)) return "ncap_funds";
  if (/\b(industry|industries|brick kiln|kiln|factor(y|ies)|power plant|tpp|cems|fgd|consent)/.test(q)) return "industry_compliance";
  if (/\b(grap|caqm|enforcement|construction ban|vehicle impound)/.test(q)) return "grap_enforcement";
  if (/\b(school|closure|education|class)/.test(q)) return "school_closure";
  if (/\b(health|hospital|admission|patient|respiratory|cardiac|mortality)/.test(q)) return "health_burden";
  // Generic RTI ask — return station_data as the most common
  return "station_data";
}

function formatRTI(templateKey, cityName, today) {
  const t = RTI_TEMPLATES[templateKey];
  if (!t) return null;
  const dateStr = today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const cityUpper = (cityName || "[CITY]").toUpperCase();
  const questions = t.questions.map((q, i) => `${i + 1}. ${q.replace(/\[CITY\]/g, cityName || "[CITY]")}`).join("\n");
  return `RTI APPLICATION TEMPLATE (computed)

Subject: ${t.title} — ${cityUpper}
To: ${t.department.replace(/\[STATE\]/g, "[STATE]")}
Address: ${t.address}
Date: ${dateStr}

Sir/Madam,

Under Section 6 of the Right to Information Act, 2005, I request the following information:

${questions}

Method of obtaining information: Soft copy via email, or physical copy by post.
Fee: ₹10 application fee (cash / postal order / IPO / DD) — exempted for BPL applicants.

Statutory anchors: ${t.statutory}

Yours sincerely,
[Applicant name]
[Address]
[Email, phone]

NOTE: This is a deterministic JanVayu RTI template (key: "${templateKey}"). Replace bracketed fields with applicant details. CPCB / SPCB / CAQM are required to respond within 30 days. Appeal lies with the First Appellate Authority of the addressed department, then the Central / State Information Commission.`;
}

// ════════════════════════════════════════════════════════════════════════
// v26.6.16 — Phase D: multi-source spread + divergence flagging
// ════════════════════════════════════════════════════════════════════════

// IQAir 2025 annual PM2.5 data — loaded from data/reference-data.json
const IQAIR_2025_ANNUAL = REF_DATA.iqair_annual;

function isMultiSourceQuery(question) {
  const q = question.toLowerCase();
  return /\b(how reliable|reliable\??|which source|sources? (differ|disagree|agree|conflict)|cross.?check|cross.?reference|spread|spatial variation|stations differ|reading vs (reading|annual)|today vs (annual|baseline|usual)|is (this|today'?s?|the reading) (high|low|normal|unusual)|episode|anomaly|baseline|trustworthy|confidence|accuracy|how accurate|calibrat|methodology|data quality)\b/i.test(q);
}

function buildSpreadAnalysis(cityKey, cityName, waqiPm25, stationList, sensorList) {
  const annualRef = IQAIR_2025_ANNUAL[cityKey];
  const items = [];
  const snapshotPm25Values = [];
  if (waqiPm25 != null) snapshotPm25Values.push({ source: "WAQI nearest station", value: waqiPm25 });

  if (Array.isArray(stationList) && stationList.length >= 2) {
    const aqis = stationList.map(s => s.aqi).filter(v => typeof v === "number" && v > 0);
    if (aqis.length >= 2) {
      const min = Math.min(...aqis);
      const max = Math.max(...aqis);
      const ratio = max / min;
      items.push(`  • Intra-city WAQI station spread: ${stationList.length} stations, AQI ${min}-${max} (${ratio.toFixed(1)}× range). ${ratio > 2 ? "WIDE — significant spatial gradient; single-station readings are NOT representative of the city average." : "Moderate — typical Indian city variance."}`);
    }
  }

  if (Array.isArray(sensorList) && sensorList.length > 0) {
    const valid = sensorList.map(s => s.pm25).filter(v => typeof v === "number" && v > 0);
    if (valid.length > 0) {
      const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
      snapshotPm25Values.push({ source: `Community sensors (Sensor.Community, avg of ${valid.length} within 25 km)`, value: +avg.toFixed(1) });
    }
  }

  if (annualRef != null) {
    items.push(`  • IQAir 2025 annual reference: ${annualRef} µg/m³ (the 2025 edition published March 2025, covering 2024 data — JanVayu cached). This is the "is today normal?" baseline.`);
  }

  if (snapshotPm25Values.length >= 2) {
    const a = snapshotPm25Values[0].value;
    const b = snapshotPm25Values[1].value;
    const ratio = Math.max(a, b) / Math.min(a, b);
    const diffPct = Math.round(Math.abs(a - b) / ((a + b) / 2) * 100);
    items.push(`  • Snapshot agreement: ${snapshotPm25Values.map(x => `${x.source} ${x.value} µg/m³`).join(" vs ")} — ${diffPct}% difference. ${
      ratio > 1.5
        ? "⚠ WIDE SPREAD — sources disagree substantially. Low-cost community sensors are ±20-50% accuracy; difference may reflect calibration drift, micro-location effects, or genuine spatial gradient."
        : "Sources agree within methodology error (low-cost ±20-50%, regulatory ±5-10%). High-confidence snapshot."
    }`);
  } else if (snapshotPm25Values.length === 1) {
    items.push(`  • Snapshot: ${snapshotPm25Values[0].source} reports ${snapshotPm25Values[0].value} µg/m³ (only one source live this hour; cannot cross-check).`);
  }

  if (annualRef != null && waqiPm25 != null) {
    const ratio = waqiPm25 / annualRef;
    if (ratio > 1.5) {
      items.push(`  • ⚠ ANOMALY: today's live PM2.5 (${waqiPm25} µg/m³) is ${ratio.toFixed(1)}× the IQAir 2025 annual baseline (${annualRef} µg/m³). Above-average day — likely meteorology (inversion, low wind), seasonal event (Diwali, stubble burning), or specific source spike.`);
    } else if (ratio < 0.5) {
      items.push(`  • Today's live PM2.5 (${waqiPm25} µg/m³) is well BELOW the IQAir 2025 annual baseline (${annualRef} µg/m³) — likely monsoon washout or favourable dispersion meteorology.`);
    } else {
      items.push(`  • Today's reading is consistent with annual baseline (${(ratio * 100).toFixed(0)}% of IQAir 2025 annual). Typical day.`);
    }
  }

  if (items.length === 0) return "";
  return `\n\nMULTI-SOURCE SPREAD ANALYSIS for ${cityName.toUpperCase()} (computed):\n${items.join("\n")}\nCitation reminder: WAQI = aqicn.org; community sensors = Sensor.Community (CC0, ±20-50% accuracy); IQAir 2025 = the 2025 edition, March 2025, covering 2024 data; CPCB CAAQMS = official Indian regulatory (~565 stations, ±5-10% accuracy).`;
}

// v26.6.41 — prompt-trim (ported from PR #98): METHODOLOGY_REFERENCE (~1000
// tokens) and TOPICAL_REFERENCE (~600 tokens) are injected only when a query
// detector flags them relevant, trimming ~1,500 input tokens (~30%) on the
// common-case query and letting more requests fit inside the Groq rate limit.
function buildSystemPrompt(seasonal, lang, opts = {}) {
  const { nationalQuery = false, multiSource = false, topical = false, methodologyNeeded = false } = opts;
  const langName = LANG_NAMES[lang] || null;
  const langOverride = langName
    ? `\nCRITICAL — RESPONSE LANGUAGE: The user has selected ${langName} as their interface language. You MUST respond entirely in ${langName}. Use the native script throughout (Devanagari, Tamil, Bengali as appropriate). Do not mix languages. Acronyms like NCAP, RTI, WHO, AQI, GRAP, PM2.5, PM10 may stay in Roman letters as they are widely recognised that way in Indian discourse. Numerals can be Indo-Arabic (1, 2, 3).\n`
    : "";

  const instruction9 = langName
    ? `9. Respond entirely in ${langName} (see CRITICAL note above).`
    : `9. LANGUAGE — respond in ENGLISH by default. Use another Indian language ONLY when the user's question is itself written in that language (then reply in that language, native script). NEVER switch to Hindi or any other language because of the topic, the city, the emotional tone, or an assumption about the user. An English question ALWAYS gets an English answer.`;

  const nationalFraming = nationalQuery
    ? `\nIMPORTANT — NATIONAL/TOPICAL QUERY: The user's question is about an India-wide topic (monitoring network, low-cost sensors, EVs, BS-VI, NCAP, court orders, etc.) and NOT about their selected city's live air quality. Frame your answer for India broadly. Do NOT default to Delhi-specific or single-station (e.g. Mandir Marg) context. Use the TOPICAL REFERENCE block below for concrete facts.\n`
    : "";

  // Heavy reference blocks, gated by relevance (v26.6.41, ported from PR #98).
  const methodologyBlock = (multiSource || methodologyNeeded) ? `\n${METHODOLOGY_REFERENCE}\n` : "";
  const topicalBlock = (nationalQuery || topical) ? `\n${TOPICAL_REFERENCE}\n` : "";

  return `You are JanVayu, India's citizen-led air quality assistant. You are NOT a generic chatbot — you have access to LIVE pollution data and deep knowledge of India's air quality context.

TODAY: ${seasonal.dateStr}
SEASONAL CONTEXT: ${seasonal.season}

${ACTIVITY_THRESHOLDS}
${methodologyBlock}${topicalBlock}
KEY REFERENCE DATA (India-wide, not Delhi-specific):
- WHO annual PM2.5 guideline: 5 µg/m³. India's NAAQS: 40 µg/m³ (8× WHO).
- India average PM2.5: 48.9 µg/m³ (~10× WHO limit) — IQAir 2025.
- 1.72 million Indians die annually from ambient PM2.5 — Lancet Countdown 2025. This is the world's largest national toll, but roughly a QUARTER of the global total — NOT a majority. (Counting household air pollution too, State of Global Air 2024 puts India's total nearer 2.1 million.)
- Economic cost: $339.4 billion/year, ~9.5% of GDP — Lancet Countdown 2025.
- NCAP target: 40% PM10 reduction across 131 non-attainment cities by 31 March 2026 (this deadline has now PASSED). Of the cities assessed, 23 of 100 met the target — CREA 2026.
- Average Indian loses 3.5 years of life expectancy to pollution — AQLI 2025. Indo-Gangetic Plain residents lose 7-8 years.
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
10. TONE & LENGTH — Be WARM, patient and explanatory, like a knowledgeable, kind professor who genuinely wants the person to understand — never cold, bureaucratic, preachy or alarmist. Explain the WHY in plain language, and briefly define a technical term the first time you use it (e.g. "PM2.5 — the tiny particles that reach your bloodstream"). Make the person feel capable of acting. Keep it focused though: aim for ~150 words, lead with the direct answer in 1-2 sentences, then a few clear supporting points that teach, not lecture — no walls of text. Write PLAIN TEXT: do NOT use markdown — no **bold**, no # / ## / ### headings, no tables, no | pipes. For a short list, use a plain dash (-) at the start of a line.
11. SOURCES — cite a source ONLY when the number actually comes from (a) the KEY REFERENCE DATA above, (b) the DATA CONTEXT / computed lines provided in this request, or (c) the TOPICAL/METHODOLOGY blocks when present. Cite the REAL source named there — e.g. "IQAir 2025", "Lancet Countdown 2025", "AQLI 2025", "CPCB CAAQMS", "CREA", "State of Global Air 2024", "Sensor.Community". For general advice, practical suggestions, or anything NOT backed by the data you were given, give the guidance plainly WITHOUT a citation — you may say "as a general guide" or "broadly". Do NOT attach a source tag to a number just to look authoritative. Keep any citation in the SAME LANGUAGE as your answer (never write an English "(Source: …)" inside a Hindi/Tamil/Marathi/Bengali reply).
12. For NATIONAL/TOPICAL questions (EVs, low-cost sensors, BS-VI, monitoring network, court orders, NCAP): use the TOPICAL REFERENCE block when provided. Do NOT default to Delhi or single-station context unless the user explicitly asks about Delhi.
13. For station-count questions: ALWAYS use the CPCB REFERENCE data if present in the DATA CONTEXT. Report the TOTAL count first, then bifurcate into CAAQMS (continuous, real-time) and manual (gravimetric, 24-hr sampling) stations. Also mention the CPCB national figure (~565 CAAQMS). If asking about low-cost sensors, use the community sensor data if available.
14. If the DATA CONTEXT contains lines tagged "(computed)" — those are deterministic calculations JanVayu just ran (cigarette equivalence, mortality risk, life-expectancy loss, migration delta, transport exposure, purifier CADR, school-closure forecast, source apportionment, RTI template). Use those numbers verbatim. Do NOT recompute, re-round, or paraphrase the RTI template fields. Always carry the cited source.
15. For RTI requests, if a "RTI APPLICATION TEMPLATE" block is in the DATA CONTEXT, present it AS-IS to the user with only minimal framing ("Here's a properly-formatted RTI for your case — replace bracketed fields and post / email to the listed PIO"). Do NOT rewrite the questions, statutory anchors, or department address.
16. For generic "how is the air quality" questions: if a CITY-WIDE STATION RANGE is in the DATA CONTEXT, present the AQI range across all stations (e.g. "AQI ranges from X to Y across N stations") rather than quoting just one station. Name 2-3 representative stations. This gives a more accurate city-level picture.
17. For ward / neighbourhood-level questions, JanVayu is an AIR-QUALITY assistant — so LEAD WITH AIR. If a WARD-LEVEL DATA block is present, open with the per-ward PM2.5 answer (worst-air / cleanest-air ward, citywide spread, or named ward's air), state the band (Good/Moderate/Poor/etc.), and note it's a LIVE interpolated snapshot. CRITICAL TIMESCALE RULE: the air is a live snapshot (this hour, interpolated from sparse monitors + current weather); the built-up / green / heat figures are ANNUAL / structural — DIFFERENT timescales. So you must NOT claim a ward's annual structure CAUSES its live reading. NEVER say "it's 88% built-up, so today's air is bad." Instead keep them separate: "Right now it's ~X µg/m³ (live estimate). Structurally it's a dense, low-green ward (88% built, 10% green) — the kind of place that *tends* to have worse air and more heat OVER THE YEAR, though today's exact reading is driven by current conditions, not its layout." If today's dirtiest-air ward is actually leafy / low-built, say plainly that the live reading there likely reflects weather or a nearby source, not urban form. The proper partner for annual structure would be annual per-ward PM2.5, which JanVayu doesn't have — so don't fake an annual causal claim from one snapshot. Never present greenest / most-built-up / hottest as standalone trivia — tie back to people's air and health on the correct timescale. Cite "interpolated from CPCB/WAQI (live)" for air and "JanVayu Ward Atlas / ESA WorldCover / Landsat (annual)" for drivers. If they say "my ward" without naming it, you can't know which ward they mean — give the city's worst- and cleanest-air wards and the spread, then invite them to name their ward or use the map's "My ward" locate button. Point to janvayu.in/#ward-map. Keep warmth — this is someone's own neighbourhood.
18. NON-PARTISAN — never tell the user who to vote for, and never declare one political party or government "better", "stronger", or "worse". If asked to compare parties, neutrally note documented actions AND shortfalls on each side and say the record is mixed. Critique policies and systems, not parties or individuals. This is a firm rule — JanVayu is strictly non-partisan.
19. DON'T FABRICATE — the 1.72M deaths figure is NATIONAL. Do NOT invent city-level death tolls, city-specific source-apportionment percentages, or future-date predictions (e.g. a festival's AQI next year). If a certified city-level count or a specific breakdown isn't in your data, say plainly it isn't published and give the national figure or the method instead — the same way you'd decline any question you can't answer precisely. Never attribute a made-up number to a real source.
20. NEVER INVENT SOURCES — this is the most important rule. Do NOT fabricate government orders (e.g. "NGT order April 2026"), schemes, programmes (e.g. a "Green-Leaf programme"), studies, audit findings, standards, certifications, or specific dates and percentages that are NOT in the reference data or DATA CONTEXT you were given. If you feel the urge to write "(Source: …)" for a claim you cannot back with the data above, that is your signal to either drop the number or present it as general knowledge with NO citation. A citizen may quote you to their RWA or an official — an invented order or study is a serious, trust-destroying failure. It is always better to say "I don't have a sourced figure for that" than to manufacture one.
21. USE STANDARDS CORRECTLY — technical standards apply only to their real domain. For example, BS-VI is a motor-VEHICLE emission standard; it does NOT certify cookstoves, incinerators, or burners. Do not borrow an official-sounding label for something it doesn't cover.
22. OPEN-ENDED / IMAGINATIVE QUESTIONS (e.g. how to persuade neighbours to mulch instead of burn leaves, cleaner winter-heating options for low-income families, community composting) — these are welcome. Answer with genuine empathy and practical, correct, low-cost, India-appropriate steps. Distinguish clearly between HEATING and COOKING solutions (don't offer a cookstove as a room heater). Anchor to REAL, well-known things where you can (LPG/Ujjwala, community composting, improved cookstoves, mulching as compost) WITHOUT inventing a citation for each. If you're unsure a specific claim (a temperature, a % reduction) is accurate, soften it ("can substantially reduce smoke") rather than stating a precise fabricated figure.
23. SURFACE JANVAYU — you are the front door to a whole validated platform, so when it genuinely helps the person act, point them to the right JanVayu tool with a plain link (no markdown): the ward map (janvayu.in/#ward-map), city rankings (janvayu.in/#rankings), city scorecards with one-click RTI (janvayu.in/#scorecards), the RTI assistant (janvayu.in/#rti-assistant), the 5-day forecast (janvayu.in/#forecast), health & exposure tools (janvayu.in/#health), the source-apportionment breakdown (janvayu.in/#apportionment), the FAQ (janvayu.in/#faq), or the open data API (janvayu.in/api). Prefer JanVayu's own validated data and tools over vague external advice — that is the value you add over a generic chatbot. At most one or two relevant links, only when they truly help; never spam links.
24. HONEST UNCERTAINTY — science is often uncertain, and pretending otherwise is a kind of lie. When the honest answer is "it depends", or the evidence is mixed, or a figure is an estimate, SAY SO plainly ("this is an estimate", "the evidence is still mixed", "it varies a lot by area/season"). Never manufacture false precision to sound authoritative. Calibrated honesty builds more trust than confident guessing.
25. NO GREENWASHING OR FALSE SOLUTIONS — do not endorse a "solution" that sounds green but doesn't actually work, or overstate how much a single fix helps. Burning something in a fancier container is still burning; one purifier doesn't clean a city; planting trees helps but won't undo winter smog on its own. Be honest about what a step realistically achieves and its limits, and favour genuinely effective, evidence-based, equitable actions over feel-good gestures.
26. EMPOWER, DON'T DOOM — the facts are heavy enough; your job is to leave the person feeling capable, not paralysed. Pair honesty about the problem with a concrete, doable next step they can actually take. Never fatalistic, never preachy — a steady, encouraging guide.`;
}

// v26.6.28 — Ward-level intent + AIR-FIRST context builder for the Ward Atlas.
// JanVayu is an air-quality platform: the chatbot leads with per-ward AIR
// quality (live PM2.5, interpolated from CPCB/WAQI monitors to each ward
// centroid). Heat / green cover / built-up are surfaced only as the WHY —
// the drivers that explain why a ward's air is dirtier or cleaner.
function isWardQuery(question) {
  const q = question.toLowerCase();
  if (/\b(ward|wards)\b/.test(q)) return true;
  const metric = /\b(air|pollut|pm2\.?5|aqi|green(est|ery)?|vegetation|tree cover|built[- ]?up|concrete|impervious|hottest|coolest|surface temp|heat island)\b/.test(q);
  const locator = /\b(which|where|area|areas|part|parts|neighbourhood|neighborhood|locality|localities)\b/.test(q);
  return metric && locator;
}

// US-EPA AQI (PM2.5 sub-index) → µg/m³, matching the map's conversion.
function aqiToPm25(aqi) {
  const bp = [[0,12,0,50],[12.1,35.4,51,100],[35.5,55.4,101,150],[55.5,150.4,151,200],[150.5,250.4,201,300],[250.5,350.4,301,400],[350.5,500.4,401,500]];
  for (const [cl,ch,il,ih] of bp) { if (aqi >= il && aqi <= ih) return Math.round((aqi-il)/(ih-il)*(ch-cl)+cl); }
  return aqi > 500 ? 500 : null;
}

// Live stations (with coordinates) for per-ward interpolation.
async function fetchWardStations(cityKey) {
  const city = CITIES[cityKey];
  if (!city) return [];
  const bounds = `${city.lat - 0.4},${city.lon - 0.5},${city.lat + 0.4},${city.lon + 0.5}`;
  try {
    const res = await fetch(`https://api.waqi.info/map/bounds/?latlng=${bounds}&token=${WAQI_TOKEN}`, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    if (data.status === "ok" && Array.isArray(data.data)) {
      return data.data.map(s => {
        const aqi = parseInt(s.aqi);
        return { lat: +s.lat, lon: +s.lon, pm: isNaN(aqi) ? null : aqiToPm25(aqi) };
      }).filter(s => s.pm != null && s.lat && s.lon);
    }
  } catch (e) { console.log(`ward stations ${cityKey}:`, e.message); }
  return [];
}

function idwPm(cx, cy, stations) {
  let num = 0, den = 0;
  for (const s of stations) { const w = 1 / ((cx - s.lon) ** 2 + (cy - s.lat) ** 2 + 1e-6); num += w * s.pm; den += w; }
  return den ? Math.round(num / den) : null;
}
function pm25Band(v) {
  if (v == null) return "no estimate";
  if (v <= 30) return "Good"; if (v <= 60) return "Satisfactory"; if (v <= 90) return "Moderate";
  if (v <= 120) return "Poor"; if (v <= 250) return "Very Poor"; return "Severe";
}

async function buildWardContext(question, fallbackKey) {
  const key = extractCityFromQuestion(question, fallbackKey);
  const city = WARD_DATA[key];
  if (!city) {
    const list = Object.values(WARD_DATA).map(c => c.name).join(", ");
    return `\n\nWARD ATLAS NOTE: JanVayu's ward-level atlas covers ${list}. The city asked about isn't in the atlas yet — point the user to the Ward Atlas map at janvayu.in/#ward-map.`;
  }
  const wards = city.wards;
  // AIR FIRST — interpolate live PM2.5 to each ward centroid.
  const stations = await fetchWardStations(key);
  const air = stations.length ? wards.map(w => ({ ...w, pm: idwPm(w.x, w.y, stations) })).filter(w => w.pm != null) : [];
  const maxBy = (arr, k) => arr.reduce((a, b) => (b[k] > a[k] ? b : a));
  const minBy = (arr, k) => arr.reduce((a, b) => (b[k] < a[k] ? b : a));
  const ctx = w => [w.b != null ? `${w.b}% built-up` : null, w.g != null ? `${w.g}% green` : null, w.t != null ? `${w.t}°C surface temp` : null].filter(Boolean).join(", ");

  let block = `\n\nWARD-LEVEL DATA for ${city.name} (JanVayu Ward Atlas, ${wards.length} municipal wards):`;
  if (air.length) {
    const worst = maxBy(air, "pm"), best = minBy(air, "pm");
    const pmv = air.map(w => w.pm);
    block += `\n• AIR QUALITY (primary — PM2.5 interpolated from ${stations.length} live CPCB/WAQI monitors right now, an estimate of the citywide spread):`;
    block += `\n   - Worst-air ward right now: ${worst.n} ~${worst.pm} µg/m³ (${pm25Band(worst.pm)}). Its annual structure (context only — NOT the cause of this hour's reading): ${ctx(worst) || "n/a"}.`;
    block += `\n   - Cleanest-air ward right now: ${best.n} ~${best.pm} µg/m³ (${pm25Band(best.pm)}). Annual structure: ${ctx(best) || "n/a"}.`;
    block += `\n   - Spread across wards: ${Math.min(...pmv)}–${Math.max(...pmv)} µg/m³ in one city, same hour.`;
  } else {
    block += `\n• AIR QUALITY: no live monitors reporting for ${city.name} right now, so per-ward PM2.5 can't be estimated this moment. The live map at janvayu.in/#ward-map updates through the day.`;
  }
  // Drivers — structural context for the air, never the headline.
  const T = wards.filter(w => w.t != null), G = wards.filter(w => w.g != null), B = wards.filter(w => w.b != null);
  block += `\n• STRUCTURAL DRIVERS (annual satellite values — they shape TYPICAL air, but today's live reading can be driven by weather, a nearby source or monitor placement; only invoke a driver if the worst/cleanest ward's OWN numbers above actually support it):`;
  if (B.length) { const b = maxBy(B, "b"), l = minBy(B, "b"); block += `\n   - Built-up (traps pollution + radiates heat): most ${b.n} (${b.b}%), least ${l.n} (${l.b}%).`; }
  if (G.length) { const g = maxBy(G, "g"), l = minBy(G, "g"); block += `\n   - Green cover (scrubs particulates + cools): greenest ${g.n} (${g.g}%), least ${l.n} (${l.g}%).`; }
  if (T.length) { const h = maxBy(T, "t"), c = minBy(T, "t"); block += `\n   - Surface heat (drives ozone, worsens health impact): hottest ${h.n} (${h.t}°C), coolest ${c.n} (${c.t}°C).`; }
  // Specific named ward — air first, drivers as context.
  const q = question.toLowerCase();
  const named = wards.find(w => w.n && w.n.length > 3 && q.includes(w.n.toLowerCase()));
  if (named) {
    const np = stations.length ? idwPm(named.x, named.y, stations) : null;
    block += `\n• NAMED WARD "${named.n}": ${np != null ? `air ~${np} µg/m³ PM2.5 (${pm25Band(np)}) right now; ` : ""}${ctx(named) || ""}.`;
  }
  block += `\nNOTE: per-ward air is an interpolated estimate of the spread (not a calibrated per-street reading); the interactive map is at janvayu.in/#ward-map. BE HONEST: if the dirtiest-air ward today is actually leafy / low built-up (e.g. a rural fringe, or simply a clean day), say so — do NOT force the "built-up = dirty" story when the numbers don't fit. The built-up/green/heat link is a TYPICAL/annual tendency, not a guarantee for any single hour.`;
  return block;
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

  // v26.6.18 — Fetch station list for: station-count queries, generic AQI
  // queries (to show city-wide range instead of single nearest station),
  // and multi-source queries. This fixes the Mandir-Marg-only bias.
  let stationList = null;
  const genericAQI = isGenericAQIQuery(question);
  if (isStationCountQuery(question) || genericAQI) {
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

  // v26.6.13 Phase A — Three new tool calls, all run in parallel so the
  // chatbot's response time isn't bottlenecked when multiple apply.
  // v26.6.16 Phase D — Add multi-source spread fetch when the question
  // implies it (or when intra-city station spread is needed).
  const toolPromises = [];
  if (isRankingQuery(question)) {
    const range = /\b(30 ?day|month|monthly)\b/i.test(question) ? "30d"
                : /\b(7 ?day|week|weekly)\b/i.test(question) ? "7d"
                : "live";
    toolPromises.push(fetchRankings(range).then(r => ({ kind: "rankings", data: r, range })));
  }
  if (isTrendQuery(question)) {
    const month = new Date().getMonth() + 1;
    toolPromises.push(fetchHistoricalTrend(cityKey, month).then(r => ({ kind: "trend", data: r, month })));
  }
  if (isForecastQuery(question)) {
    const fc = CITIES[cityKey];
    if (fc) toolPromises.push(fetchForecast(fc.lat, fc.lon).then(r => ({ kind: "forecast", data: r })));
  }

  // Sensors fetch: needed for both hyperlocal queries AND multi-source spread.
  const multiSource = isMultiSourceQuery(question);
  if (isHyperlocalQuery(question) || multiSource) {
    const cityCoords = CITIES[cityKey];
    if (cityCoords) {
      toolPromises.push(fetchCommunitySensors(cityCoords.lat, cityCoords.lon, 25).then(r => ({ kind: "hyperlocal", data: r })));
    }
  }

  // Station-list fetch: needed for both station-count AND multi-source spread.
  if (!stationList && multiSource) {
    stationList = await fetchCityStations(cityKey);
  }

  const toolResults = await Promise.all(toolPromises);

  // Extract sensor list for spread analysis if multi-source asked
  let sensorListForSpread = null;
  if (multiSource) {
    const hyperResult = toolResults.find(t => t.kind === "hyperlocal");
    if (hyperResult && hyperResult.data && Array.isArray(hyperResult.data.stations)) {
      sensorListForSpread = hyperResult.data.stations;
    }
  }

  // v26.6.18 — For generic AQI queries with multi-station data, present
  // city-wide range instead of just the nearest station name.
  let primaryLabel = `PRIMARY CITY — ${aqiResult.city}: AQI ${aqiResult.aqi}, PM2.5 ${aqiResult.pm25 ?? "N/A"} µg/m³, PM10 ${aqiResult.pm10 ?? "N/A"} µg/m³, Nearest WAQI station: ${aqiResult.station}, Updated: ${aqiResult.time}.`;

  if (stationList && stationList.length >= 2) {
    const aqis = stationList.map(s => s.aqi).filter(v => typeof v === "number" && v > 0);
    if (aqis.length >= 2) {
      const minAqi = Math.min(...aqis);
      const maxAqi = Math.max(...aqis);
      const avgAqi = Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length);
      const stationSample = stationList.slice(0, 6).map(s => `${s.name} (AQI ${s.aqi})`).join("; ");
      primaryLabel += `\nCITY-WIDE STATION RANGE: ${stationList.length} WAQI stations in ${aqiResult.city} — AQI range ${minAqi}–${maxAqi}, average ~${avgAqi}. Stations: ${stationSample}.`;
      primaryLabel += `\nIMPORTANT: The primary reading above is from the NEAREST station to the city centroid only. Present the RANGE across stations when answering generic "how is the air quality" questions — do NOT report just one station.`;
    }
  }

  let dataContext = primaryLabel;

  if (compareResult) {
    dataContext += `\nCOMPARISON CITY — ${compareResult.city}: AQI ${compareResult.aqi}, PM2.5 ${compareResult.pm25 ?? "N/A"} µg/m³, PM10 ${compareResult.pm10 ?? "N/A"} µg/m³, Station: ${compareResult.station}.`;
  }

  // v26.6.18 — Inject CPCB station reference data (CAAQMS vs manual
  // bifurcation) for station-count queries. This provides accurate,
  // structured counts instead of relying on WAQI subset or LLM guesses.
  const cpcbRef = CPCB_STATION_DATA[cityKey];
  if (stationList && stationList.length > 0) {
    const sample = stationList.slice(0, 8).map(s => `${s.name} (AQI ${s.aqi})`).join("; ");
    dataContext += `\nWAQI STATIONS WITHIN ~25 km of ${aqiResult.city} CENTROID: ${stationList.length} indexed station(s). Sample: ${sample}.`;
    if (cpcbRef) {
      dataContext += `\nCPCB REFERENCE for ${aqiResult.city} (CPCB Annual Report 2024-25): Total ${cpcbRef.total} monitoring stations — ${cpcbRef.caaqms} CAAQMS (continuous, real-time) + ${cpcbRef.manual} manual (gravimetric, 24-hr sampling). ${cpcbRef.note}.`;
    }
    dataContext += `\nNOTE: The WAQI-indexed count above is a subset. CPCB CAAQMS national total is ~565 stations across ~250 Indian cities (CPCB data via CREA, Jan 2026). Sensor.Community adds ~3,000+ low-cost community sensors nationwide.`;
  } else if (isStationCountQuery(question)) {
    if (cpcbRef) {
      dataContext += `\nCPCB REFERENCE for ${aqiResult.city} (CPCB Annual Report 2024-25): Total ${cpcbRef.total} monitoring stations — ${cpcbRef.caaqms} CAAQMS (continuous, real-time) + ${cpcbRef.manual} manual (gravimetric, 24-hr sampling). ${cpcbRef.note}.`;
    }
    dataContext += `\nSTATION COUNT NOTE: WAQI bounds query returned no list for ${aqiResult.city}. CPCB CAAQMS national total is ~565 stations across ~250 Indian cities (CPCB data via CREA, Jan 2026). Sensor.Community runs ~3,000+ low-cost community sensors nationwide.`;
  }

  // v26.6.13 Phase A — Inject results from rankings / trend / hyperlocal
  // tool calls into the data context the LLM sees.
  for (const t of toolResults) {
    if (!t || !t.data) continue;
    if (t.kind === "rankings") {
      const cities = t.data.cities || [];
      if (cities.length > 0) {
        const top5 = cities.slice(0, 5).map(c => `${c.name || c.city || c.key} (PM2.5 ${c.pm25 ?? "—"} µg/m³, AQI ${c.aqi ?? "—"})`).join("; ");
        const bottom5 = cities.slice(-5).reverse().map(c => `${c.name || c.city || c.key} (PM2.5 ${c.pm25 ?? "—"} µg/m³)`).join("; ");
        const label = t.range === "live" ? "LIVE" : t.range === "7d" ? "7-DAY AVERAGE" : "30-DAY AVERAGE";
        dataContext += `\n\n${label} CITY RANKINGS (JanVayu rankings.mjs, ${cities.length} cities ranked by PM2.5, worst first):
Top 5 worst: ${top5}
5 cleanest: ${bottom5}`;
      }
    } else if (t.kind === "trend") {
      const years = t.data.years || [];
      if (years.length > 0) {
        const monthName = new Date(2026, t.month - 1, 1).toLocaleString("en-IN", { month: "long" });
        const series = years.map(y => `${y.year}: ${y.pm25} µg/m³`).join("; ");
        dataContext += `\n\n${aqiResult.city.toUpperCase()} ${monthName} PM2.5 BY YEAR (JanVayu historical-aqi.mjs climatology + snapshots): ${series}. Source: ${t.data.source}.`;
      }
    } else if (t.kind === "forecast") {
      const days = t.data.days || [];
      if (days.length > 0) {
        const series = days.map(d => `${d.date}: mean ${d.pm25_mean} / peak ${d.pm25_max} µg/m³`).join("; ");
        dataContext += `\n\n${aqiResult.city.toUpperCase()} 5-DAY PM2.5 FORECAST (${t.data.source}): ${series}. This is a model forecast (CAMS), independent of today's live reading — treat day-3+ as lower-confidence, and note it may diverge from official SAFAR/CPCB forecasts. WHO 24-hour guideline is 15 µg/m³; India's NAAQS 24-hr standard is 60 µg/m³.`;
      }
    } else if (t.kind === "hyperlocal") {
      const stations = t.data.stations || [];
      if (stations.length > 0) {
        const sample = stations.slice(0, 5).map(s => `${s.name || "anonymous"} (PM2.5 ${s.pm25 ?? "—"} µg/m³, ${s.distance_km?.toFixed(1) ?? "?"} km away)`).join("; ");
        dataContext += `\n\nCOMMUNITY SENSORS WITHIN 25 km of ${aqiResult.city} (JanVayu community-sensors.mjs / Sensor.Community CC0, ${stations.length} sensor(s)): ${sample}. Note: low-cost sensor accuracy is ±20-50% vs CPCB-grade; use for HYPERLOCAL spatial variation rather than absolute levels.`;
      } else {
        dataContext += `\n\nCOMMUNITY SENSORS: no Sensor.Community sensors indexed within 25 km of ${aqiResult.city} centroid right now.`;
      }
    }
  }

  // Add NCAP city data if available
  const ncap = NCAP_CITY_DATA[cityKey];
  if (ncap) {
    dataContext += `\nNCAP DATA — ${ncap.ncapTarget}. Budget: ${ncap.budget}. Note: ${ncap.note}`;
  }

  // v26.6.14 Phase B — Run deterministic calculators when the question
  // implies a number-needing question. Results get injected into the
  // dataContext so the LLM packages real numbers, not guesses.
  const calcBlock = await runCalculators(question, aqiResult, cityKey);
  if (calcBlock) dataContext += calcBlock;

  // v26.6.15 Phase C — Apportionment block when the user asks about
  // sources of pollution / what causes it / dominant contributor.
  if (isApportionmentQuery(question)) {
    const ap = getApportionment(cityKey);
    if (ap) {
      const mix = ap.sources.map(s => `  • ${s.name}: ${s.pct}%${s.note ? " — " + s.note : ""}`).join("\n");
      dataContext += `\n\nSOURCE APPORTIONMENT FOR ${aqiResult.city.toUpperCase()} (computed from JanVayu apportionment dataset):\n${mix}\nCitation: ${ap.citation}\nSeasonal note: ${ap.seasonal}`;
    } else {
      const nat = NATIONAL_APPORTIONMENT;
      const mix = nat.sources.map(s => `  • ${s.name}: ${s.pct}%${s.note ? " — " + s.note : ""}`).join("\n");
      dataContext += `\n\nNATIONAL SOURCE APPORTIONMENT (no city-specific study indexed for ${aqiResult.city}; using national synthesis):\n${mix}\nCitation: ${nat.citation}\nNote: ${nat.note}`;
    }
  }

  // v26.6.27 — Ward Atlas block when the user asks about wards / neighbourhood-
  // level heat, green cover or built-up.
  if (isWardQuery(question)) {
    const wardBlock = await buildWardContext(question, cityKey);
    if (wardBlock) dataContext += wardBlock;
  }

  // v26.6.15 Phase C — RTI drafting when the user asks for one.
  const rtiKey = detectRTIIntent(question);
  if (rtiKey) {
    const rti = formatRTI(rtiKey, aqiResult.city, new Date());
    if (rti) dataContext += "\n\n" + rti;
  }

  // v26.6.16 Phase D — Multi-source spread analysis when the question
  // implies it. Cross-references WAQI live + community sensors + WAQI
  // station bounds + cached IQAir 2025 annual; flags divergence > 50%
  // and anomalies > 1.5× annual baseline.
  if (multiSource) {
    const spread = buildSpreadAnalysis(cityKey, aqiResult.city, aqiResult.pm25, stationList, sensorListForSpread);
    if (spread) dataContext += spread;
  } else if (IQAIR_2025_ANNUAL[cityKey] != null && aqiResult.pm25 != null) {
    // Even on non-multi-source questions, surface the IQAir annual baseline
    // when the user's live reading is very anomalous (1.5x+ or 0.5x-).
    const annualRef = IQAIR_2025_ANNUAL[cityKey];
    const ratio = aqiResult.pm25 / annualRef;
    if (ratio > 1.5) {
      dataContext += `\n\nANOMALY NOTE: ${aqiResult.city}'s live PM2.5 (${aqiResult.pm25} µg/m³) is ${ratio.toFixed(1)}× the IQAir 2025 annual baseline (${annualRef} µg/m³). Today is above-average — flag this in any health/activity advice.`;
    } else if (ratio < 0.5) {
      dataContext += `\n\nNOTE: ${aqiResult.city}'s live PM2.5 (${aqiResult.pm25} µg/m³) is well below the IQAir 2025 annual baseline (${annualRef} µg/m³). Better-than-typical day.`;
    }
  }

  const seasonal = getSeasonalContext();
  const nationalQuery = isNationalQuery(question);
  // v26.6.41 — gate the heavy reference blocks (ported from PR #98).
  const topical = nationalQuery || isStationCountQuery(question) || isApportionmentQuery(question) || isRankingQuery(question);
  const methodologyNeeded = multiSource;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(seasonal, requestedLang, { nationalQuery, multiSource, topical, methodologyNeeded }) },
          { role: "user", content: `${dataContext}\n\nQuestion: ${question}` }
        ],
        max_tokens: 1024,
        ...(GROQ_IS_REASONING ? { reasoning_effort: "low" } : {}),
      }),
      signal: AbortSignal.timeout(25000),
    });
    const groqData = await groqRes.json();
    let text = groqData.choices?.[0]?.message?.content || groqData.choices?.[0]?.message?.reasoning;
    if (!text || text.trim().length === 0) {
      // v26.6.17 — when Groq returns empty (rate limit, transient error,
      // content-filter), surface the calculator + live-data context so
      // the user still gets useful information rather than a blank line.
      console.log("Groq returned empty content. Raw response:", JSON.stringify(groqData).slice(0, 400));
      const errMsg = groqData.error?.message || "AI response unavailable";
      text = `[AI temporarily unavailable: ${errMsg}.] Here is the live data for ${aqiResult.city}: AQI ${aqiResult.aqi}, PM2.5 ${aqiResult.pm25 ?? "N/A"} µg/m³ (${aqiResult.pm25 ? Math.round(aqiResult.pm25 / 5) + "× WHO guideline" : ""}), nearest station ${aqiResult.station}. Try the question again in a few seconds, or rephrase it.`;
    }
    return new Response(JSON.stringify({ answer: text, dataUsed: aqiResult }), { status: 200, headers });
  } catch (e) {
    console.log("Groq error:", e.message);
    const fallback = `AI analysis unavailable right now (${e.message}). Raw PM2.5: ${aqiResult.pm25 ?? "N/A"} µg/m³ (${aqiResult.pm25 ? Math.round(aqiResult.pm25 / 5) + "× WHO guideline" : ""}).`;
    return new Response(JSON.stringify({ answer: fallback, dataUsed: aqiResult }), { status: 200, headers });
  }
}
