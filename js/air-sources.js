/* One place that decides what to say about the air at a place, and where it came from.
 *
 * Until 8 November 2026 the site had one source, WAQI. That day WAQI turned out to be
 * frozen for most Indian cities outside Delhi-NCR (Bengaluru's last reading was 23 June
 * 2026) and wrong-sited for the rest (Delhi stations returned for Bengaluru), and the
 * site had nothing to fall back on, so it showed nothing. This is the fallback chain:
 *
 *   1. live    WAQI station within 30 km that has reported in the last 6 hours
 *              (the proxy enforces both; see netlify/functions/lib/waqi-station.mjs)
 *   2. daily   CPCB's own daily bulletin for the nearest tracked city, within 50 km and
 *              no more than 7 days old, on CPCB's scale, with the number of stations
 *   3. model   an Open-Meteo (CAMS) estimate for the exact point, last resort
 *
 * Every answer says which it is: `kind`, `source`, `scale` and its own age. A daily figure
 * and a model estimate are never returned as `live`, are never put into the city ranking or
 * the alerts, and the page words them differently. Nothing here averages sources together.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.JVAir = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_BULLETIN_KM = 50;
  var MAX_BULLETIN_AGE_DAYS = 7;

  // City names in CPCB's bulletin that differ from the names the site uses.
  var BULLETIN_ALIASES = {
    gurgaon: 'gurugram',
    aurangabad: 'aurangabadmaharashtra',
    mangaluru: 'mangalore',
    belagavi: 'belgaum',
    kalyandombivli: 'kalyan',
    nandedwaghala: 'nanded'
  };

  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

  function haversineKm(lat1, lon1, lat2, lon2) {
    var rad = function (x) { return x * Math.PI / 180; };
    var dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  // The tracked city nearest a point, within maxKm, or null.
  // cities: [{ key, name, lat, lon }]
  function nearestCity(cities, lat, lon, maxKm) {
    var best = null, bestKm = maxKm;
    (cities || []).forEach(function (c) {
      if (typeof c.lat !== 'number' || typeof c.lon !== 'number') return;
      var km = haversineKm(lat, lon, c.lat, c.lon);
      if (km < bestKm) { bestKm = km; best = { city: c, km: km }; }
    });
    return best;
  }

  // The latest CPCB bulletin entry for a city, if it is recent enough.
  function bulletinFor(latest, city, now) {
    if (!latest || !latest.cities || !city) return null;
    var k = norm(city.name);
    var entry = latest.cities[k] || latest.cities[BULLETIN_ALIASES[norm(city.key)] || '~'] ||
      latest.cities[BULLETIN_ALIASES[k] || '~'] || latest.cities[norm(city.key)];
    if (!entry || !entry.days || !entry.days.length) return null;
    var day = entry.days[0];
    var t = Date.parse(day.date + 'T00:00:00+05:30');
    if (!isFinite(t)) return null;
    var ageDays = (now - t) / 86400000;
    if (ageDays > MAX_BULLETIN_AGE_DAYS || ageDays < -1) return null;
    return { entry: entry, day: day, ageDays: ageDays };
  }

  function getJson(fetchFn, url) {
    return fetchFn(url).then(function (r) { return r.json(); }).catch(function () { return null; });
  }

  // reading({ lat, lon, key, name }, deps) -> Promise of one of:
  //   { kind: 'live', source: 'WAQI', scale: 'US AQI', aqi, pm25, pm10, station, distanceKm, asOf, ageHours }
  //   { kind: 'daily', source: 'CPCB daily bulletin', scale: 'CPCB AQI', aqi, category, city, date,
  //     stations, stationsTotal, distanceKm, ageDays }
  //   { kind: 'model', source: 'Open-Meteo (CAMS model)', scale: 'US AQI (model)', aqi, pm25, pm10, asOf }
  //   null when nothing answers
  // deps: { fetch, now, cities, proxy, latestUrl, modelUrl, skip: ['live'] }
  function reading(opts, deps) {
    deps = deps || {};
    var fetchFn = deps.fetch || (typeof fetch === 'function' ? fetch : null);
    var now = deps.now || Date.now();
    var proxy = deps.proxy || '/.netlify/functions/waqi-proxy';
    var latestUrl = deps.latestUrl || '/data/cpcb-latest.json';
    var modelUrl = deps.modelUrl || '/.netlify/functions/air-model';
    var skip = deps.skip || [];
    var lat = Number(opts.lat), lon = Number(opts.lon);
    if (!fetchFn || !isFinite(lat) || !isFinite(lon)) return Promise.resolve(null);

    // The tracked city nearest the point is the slug WAQI is asked for and the city whose
    // bulletin is used. For a place the user named, that is the place itself.
    var keyOk = opts.key && /^[a-z0-9-]+$/i.test(opts.key);
    var near = keyOk
      ? { city: { key: opts.key, name: opts.name || opts.key, lat: lat, lon: lon }, km: 0 }
      : nearestCity(deps.cities, lat, lon, MAX_BULLETIN_KM);

    function live() {
      if (skip.indexOf('live') !== -1) return Promise.resolve(null);
      var url = proxy + '?near=' + lat + ',' + lon + (near ? '&slug=' + encodeURIComponent(near.city.key) : '');
      return getJson(fetchFn, url).then(function (j) {
        if (!j || j.status !== 'ok' || !j.data || j.data.aqi === '-') return null;
        var d = j.data, jv = j.jv || {};
        var aqi = parseInt(d.aqi, 10);
        if (!isFinite(aqi)) return null;
        return {
          kind: 'live', source: 'WAQI', scale: 'US AQI', aqi: aqi,
          iaqi: d.iaqi || {}, station: (d.city && d.city.name) || null,
          distanceKm: jv.distance_km != null ? jv.distance_km : null,
          asOf: (d.time && (d.time.iso || d.time.s)) || null,
          ageHours: jv.age_hours != null ? jv.age_hours : null, raw: d
        };
      });
    }

    function daily() {
      if (!near) return Promise.resolve(null);
      return getJson(fetchFn, latestUrl).then(function (latest) {
        var b = bulletinFor(latest, near.city, now);
        if (!b) return null;
        return {
          kind: 'daily', source: 'CPCB daily bulletin', scale: 'CPCB AQI',
          aqi: b.day.aqi, category: b.day.category, city: b.entry.name, date: b.day.date,
          stations: b.day.stations, stationsTotal: b.day.stations_total,
          distanceKm: Math.round(near.km * 10) / 10, ageDays: Math.floor(b.ageDays)
        };
      });
    }

    function model() {
      return getJson(fetchFn, modelUrl + '?lat=' + lat + '&lon=' + lon).then(function (j) {
        if (!j || j.status !== 'ok' || !j.data || typeof j.data.pm25 !== 'number') return null;
        return {
          kind: 'model', source: 'Open-Meteo (CAMS model)', scale: 'US AQI (model)',
          aqi: j.data.us_aqi, pm25: j.data.pm25, pm10: j.data.pm10, asOf: j.data.time_iso
        };
      });
    }

    return live().then(function (r) {
      return r || daily();
    }).then(function (r) {
      return r || model();
    });
  }

  return {
    reading: reading, nearestCity: nearestCity, bulletinFor: bulletinFor, haversineKm: haversineKm, norm: norm,
    MAX_BULLETIN_KM: MAX_BULLETIN_KM, MAX_BULLETIN_AGE_DAYS: MAX_BULLETIN_AGE_DAYS
  };
});
