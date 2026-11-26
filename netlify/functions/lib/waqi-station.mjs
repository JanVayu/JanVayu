// A reading from WAQI is only as good as the station behind it, and WAQI's
// feed/geo:<lat>;<lon>/ does not promise that station is near the point asked for.
//
// On 8 November 2026 a reader in Bengaluru pressed "Near me" and was told the air
// was "Very Unhealthy". The station returned was "Dr. Karni Singh Shooting Range,
// Delhi", about 1,730 km away, at AQI 221, while Hombegowda Nagar in Bengaluru read
// 53. The same call answered Mumbai and Pune with a Najafgarh (Delhi) station,
// Kolkata and Patna with a radiation station in Lhasa, and Thiruvananthapuram with
// one in Indonesia. Of the 32 Indian core cities, 28 got a station more than 50 km
// from the city. Nothing errored: the response was status "ok" with a plausible AQI.
//
// So every reading that arrives by coordinates is now measured against the point
// it was asked for, and refused if the station is further than MAX_STATION_KM. A
// city with no station inside that radius shows no live reading, which is true.
//
// The same afternoon turned up a second fault under the first. WAQI's feeds for
// most Indian cities outside Delhi-NCR are frozen: Bengaluru's last reading is from
// 23 June 2026, Mumbai's from 4 March 2025, Pune's from 15 November 2021, each still
// returned with status "ok" and shown by the site as live. Delhi-NCR was current.
// A station that has not reported for MAX_AGE_HOURS is not a live reading either.

import { WAQI_TOKEN } from "./waqi-token.mjs";

// Far enough to reach a station on the edge of a metro area, near enough that the
// reading is still about the place. Callers may ask for less, never for more than
// MAX_ALLOWED_KM.
export const MAX_STATION_KM = 30;
export const MAX_ALLOWED_KM = 50;
// WAQI stations report hourly and some lag; six hours is generous. Older than that
// the number is history, not the air a reader is breathing.
export const MAX_AGE_HOURS = 6;

// Hours since the station's own timestamp (time.iso, which carries its offset), or
// null when the feed gives none, which is then not trusted.
export function ageHours(data, now = Date.now()) {
  const iso = data && data.time && data.time.iso;
  if (typeof iso !== "string") return null;
  const t = Date.parse(iso);
  if (!isFinite(t)) return null;
  return (now - t) / 3600000;
}

export function isFresh(data, maxAgeHours = MAX_AGE_HOURS, now = Date.now()) {
  const h = ageHours(data, now);
  // A timestamp a few minutes in the future is clock skew, not a fault.
  return h !== null && h <= maxAgeHours && h > -1;
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Distance from a point to the station in a WAQI feed's `data`, or null when the
// feed does not say where the station is (which is then not trusted either).
export function distanceToFeed(data, lat, lon) {
  const g = data && data.city && data.city.geo;
  if (!Array.isArray(g) || g.length < 2) return null;
  const a = Number(g[0]);
  const b = Number(g[1]);
  if (!isFinite(a) || !isFinite(b)) return null;
  return haversineKm(Number(lat), Number(lon), a, b);
}

async function feed(path, fetchFn, timeoutMs) {
  try {
    const res = await fetchFn(`https://api.waqi.info/feed/${path}/?token=${WAQI_TOKEN}`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    const json = await res.json();
    if (json && json.status === "ok" && json.data && typeof json.data === "object") return json.data;
  } catch (e) {
    // The message can carry the URL, and the URL carries the token.
    console.log(`waqi-station: ${path.split(";")[0]} failed:`, e && e.name);
  }
  return null;
}

// The nearest trustworthy reading for a point: first WAQI's own nearest-station
// lookup, then the station WAQI files under `slug` (a city name such as
// "bengaluru"), each accepted only if its station lies within maxKm of the point
// and has reported within MAX_AGE_HOURS.
// Returns { data, distanceKm, via } or null.
export async function fetchStationNear({
  lat,
  lon,
  slug = "",
  maxKm = MAX_STATION_KM,
  fetchFn = globalThis.fetch,
  timeoutMs = 8000,
}) {
  lat = Number(lat);
  lon = Number(lon);
  if (!isFinite(lat) || !isFinite(lon)) return null;
  const limit = Math.min(Math.max(Number(maxKm) || MAX_STATION_KM, 1), MAX_ALLOWED_KM);
  const attempts = [["geo", `geo:${lat};${lon}`]];
  if (slug && /^[a-z0-9-]{1,60}$/i.test(slug)) attempts.push(["slug", encodeURIComponent(slug.toLowerCase())]);
  for (const [via, path] of attempts) {
    const data = await feed(path, fetchFn, timeoutMs);
    if (!data) continue;
    if (!isFresh(data)) continue;
    const km = distanceToFeed(data, lat, lon);
    if (km !== null && km <= limit) {
      return { data, distanceKm: Math.round(km * 10) / 10, ageHours: Math.round(ageHours(data) * 10) / 10, via };
    }
  }
  return null;
}
