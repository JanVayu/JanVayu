/* Candidate homepage (/try) — the "one question" direction.
 *
 * Reads the same source the live site reads: CPCB continuous-monitoring data
 * through WAQI, same public token as app.js. Nothing here is a mock; if the
 * network fails the page says so rather than showing a plausible number.
 *
 * The idea being tested is the VERDICT, not the figure. The number is the
 * evidence; the sentence is what a parent came for. Thresholds are CPCB's own
 * National AQI PM2.5 sub-index breakpoints, so the advice is the regulator's
 * and not ours.
 */
(function () {
  'use strict';

  var WAQI_TOKEN = '1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3';

  /* CPCB National AQI, PM2.5 24-hour sub-index breakpoints (µg/m³).
     A reading is placed by the band it falls in, never by a colour picked
     for effect. `ink` is the text colour used for the figure in that band;
     each is checked against both themes rather than assumed. */
  var BANDS = [
    { to: 30,       key: 'good',   label: 'Good',         cls: 'b-good', tone: 'ok' },
    { to: 60,       key: 'sat',    label: 'Satisfactory', cls: 'b-sat', tone: 'ok' },
    { to: 90,       key: 'mod',    label: 'Moderate',     cls: 'b-mod', tone: 'warn' },
    { to: 120,      key: 'poor',   label: 'Poor',         cls: 'b-poor', tone: 'warn' },
    { to: 250,      key: 'vpoor',  label: 'Very poor',    cls: 'b-vpoor', tone: 'bad' },
    { to: Infinity, key: 'severe', label: 'Severe',       cls: 'b-severe', tone: 'bad' }
  ];

  /* One verdict per band. The headline is the answer; `plain` is the reason;
     the three columns answer the same question for the people who ask it
     differently. */
  var VERDICTS = {
    good:   { head: 'A good day to be outside.',
              plain: 'Open the windows. This is the cleanest the air gets here, and in most of northern India it does not last into October.',
              who: [['Fine', 'Outdoor play and school sport are fine.'],
                    ['Fine', 'No precautions needed at this level.'],
                    ['Fine', 'A good day for a run.']] },
    sat:    { head: 'Fine for most people today.',
              plain: 'Ordinary activity is fine. If you are unusually sensitive you may notice it on a long run.',
              who: [['Fine', 'Normal outdoor activity.'],
                    ['Mostly fine', 'Carry your reliever as usual.'],
                    ['Fine', 'No reason to change plans.']] },
    mod:    { head: 'Sensitive groups should take it easy.',
              plain: 'Most people will not notice this. Children, older people and anyone with a lung or heart condition should cut back on hard exercise outdoors.',
              who: [['Go easy', 'Shorten outdoor sport.'],
                    ['Go easy', 'Avoid prolonged exertion outdoors.'],
                    ['Fine', 'Normal activity is fine.']] },
    poor:   { head: 'Cut down time outdoors.',
              plain: 'Prolonged exposure at this level causes breathing discomfort in most people. Shorten what you can, and keep windows shut on the traffic side.',
              who: [['Limit', 'Keep outdoor play short.'],
                    ['Limit', 'Avoid exertion; keep medication to hand.'],
                    ['Go easy', 'Skip the run; a walk is fine.']] },
    vpoor:  { head: 'Keep children indoors today.',
              plain: 'Skip the run. A fitted N95 helps outside; a purifier helps in one room, not a house. If this is your normal, the thing that changes it is not a purifier.',
              who: [['Stay in', 'No outdoor play, no school sport.'],
                    ['Stay in', 'Keep reliever medication to hand.'],
                    ['Brief trips', 'A fitted N95 outdoors. No running.']] },
    severe: { head: 'Stay indoors. This is an emergency-level reading.',
              plain: 'At this level everyone is affected, not only the vulnerable. Keep windows shut, run a purifier if you have one, and avoid going out at all if you can.',
              who: [['Stay in', 'Keep them home; ask about school closure.'],
                    ['Stay in', 'Seek advice early if symptoms start.'],
                    ['Stay in', 'Outdoor exertion is unsafe today.']] }
  };

  /* Berkeley Earth's equivalence, the same one the live site uses:
     22 µg/m³ of PM2.5 over 24 hours is about one cigarette. */
  var UG_PER_CIGARETTE = 22;
  var WHO_GUIDELINE = 5;

  /* Cities polled for the ranking. A short list on purpose: the page must
     answer fast on a phone, and the full ranking is one link away. */
  var CITIES = [
    ['Delhi', 28.6139, 77.2090], ['Ghaziabad', 28.6692, 77.4538], ['Noida', 28.5355, 77.3910],
    ['Gurgaon', 28.4595, 77.0266], ['Faridabad', 28.4089, 77.3178], ['Kanpur', 26.4499, 80.3319],
    ['Lucknow', 26.8467, 80.9462], ['Patna', 25.5941, 85.1376], ['Jaipur', 26.9124, 75.7873],
    ['Ahmedabad', 23.0225, 72.5714], ['Bhopal', 23.2599, 77.4126], ['Nagpur', 21.1458, 79.0882],
    ['Kolkata', 22.5726, 88.3639], ['Mumbai', 19.0760, 72.8777], ['Pune', 18.5204, 73.8567],
    ['Hyderabad', 17.3850, 78.4867], ['Bengaluru', 12.9716, 77.5946], ['Chennai', 13.0827, 80.2707],
    ['Kochi', 9.9312, 76.2673], ['Thiruvananthapuram', 8.5241, 76.9366],
    ['Visakhapatnam', 17.6868, 83.2185], ['Guwahati', 26.1445, 91.7362]
  ];

  var $ = function (id) { return document.getElementById(id); };

  function bandFor(pm) {
    for (var i = 0; i < BANDS.length; i++) { if (pm <= BANDS[i].to) return BANDS[i]; }
    return BANDS[BANDS.length - 1];
  }

  function fetchCity(name, lat, lon) {
    var url = 'https://api.waqi.info/feed/geo:' + lat + ';' + lon + '/?token=' + WAQI_TOKEN;
    return fetch(url)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || j.status !== 'ok' || !j.data) return null;
        var iaqi = j.data.iaqi || {};
        var pm = iaqi.pm25 && typeof iaqi.pm25.v === 'number' ? iaqi.pm25.v : null;
        if (pm === null) return null;
        return {
          name: name, pm: pm, aqi: j.data.aqi,
          station: (j.data.city && j.data.city.name) || null,
          time: (j.data.time && j.data.time.s) || null
        };
      })
      .catch(function () { return null; });
  }

  /* ── The answer ─────────────────────────────────────────────────────── */
  function renderAnswer(r) {
    if (!r) {
      $('stamp').textContent = 'No reading available';
      $('pm').textContent = '—';
      $('verdictText').textContent = 'We could not reach a station just now.';
      $('plain').textContent = 'Rather than show you a number we cannot stand behind, this says nothing. Try again in a moment, or open the full map.';
      $('bandLabel').textContent = '';
      return;
    }

    var b = bandFor(r.pm);
    var v = VERDICTS[b.key];
    var mult = Math.round(r.pm / WHO_GUIDELINE);
    var cigs = (r.pm / UG_PER_CIGARETTE).toFixed(1);

    $('pm').textContent = Math.round(r.pm);
    $('pm').style.color = (b.tone === 'ok') ? 'var(--green)'
                        : (b.tone === 'warn') ? 'var(--caution)' : 'var(--alarm)';

    var when = r.time ? r.time.slice(11, 16) : '';
    $('stamp').textContent = r.name + (when ? ' · ' + when + ' IST' : '');

    var kids = $('scale').children;
    for (var i = 0; i < kids.length; i++) {
      kids[i].className = BANDS[i].cls + (BANDS[i].key === b.key ? ' here' : '');
    }
    $('bandLabel').textContent = b.label + ' · ' + mult + '× the WHO guideline';

    $('verdictText').textContent = v.head;
    $('plain').textContent = v.plain + ' At ' + Math.round(r.pm) +
      ' µg/m³, a day of this is about ' + cigs +
      ' cigarettes of equivalent PM2.5 exposure (Berkeley Earth, 22 µg/m³ per cigarette).';

    for (var k = 0; k < 3; k++) {
      $('w' + (k + 1)).textContent = v.who[k][0];
      $('w' + (k + 1)).style.color = (v.who[k][0] === 'Fine' || v.who[k][0] === 'Mostly fine')
        ? 'var(--green)' : (v.who[k][0] === 'Stay in') ? 'var(--alarm)' : 'var(--caution)';
      $('w' + (k + 1) + 'n').textContent = v.who[k][1];
    }

    $('prov').innerHTML = 'Reading: CPCB continuous monitoring station data via WAQI' +
      (r.station ? ', nearest station <strong>' + r.station.replace(/[<>&]/g, '') + '</strong>' : '') +
      (when ? ', ' + when + ' IST' : '') +
      '. Guidance thresholds: CPCB National AQI health advisory categories. ' +
      'Cigarette equivalence: Berkeley Earth. ' +
      '<a href="/#data-sources">How we know this</a>';
  }

  /* ── The ranking ────────────────────────────────────────────────────── */
  function renderRanking(rows) {
    rows = rows.filter(Boolean).sort(function (a, b) { return b.pm - a.pm; });
    if (!rows.length) { $('worst').textContent = 'No live readings just now.'; return; }

    var top = rows.slice(0, 6).map(function (r) {
      return '<div class="rk"><span>' + r.name + '</span><span>' + Math.round(r.pm) + '</span></div>';
    }).join('');
    $('worst').innerHTML = top;

    var max = rows[0].pm || 1;
    $('bars').innerHTML = rows.map(function (r) {
      var h = Math.max(3, Math.round((r.pm / max) * 100));
      return '<i class="' + bandFor(r.pm).cls + '" style="height:' + h + '%" title="' +
             r.name + ' ' + Math.round(r.pm) + ' µg/m³"></i>';
    }).join('');
    $('chartTitle').textContent = rows.length + ' cities, worst to best, right now';
  }

  /* ── Place lookup ───────────────────────────────────────────────────── */
  function showMatches(q) {
    var box = $('matches');
    q = q.trim().toLowerCase();
    if (q.length < 2) { box.className = 'matches'; box.innerHTML = ''; return; }
    var hits = CITIES.filter(function (c) { return c[0].toLowerCase().indexOf(q) === 0; }).slice(0, 5);
    if (!hits.length) { box.className = 'matches'; box.innerHTML = ''; return; }
    box.innerHTML = hits.map(function (c) {
      return '<li><button type="button" data-lat="' + c[1] + '" data-lon="' + c[2] +
             '" data-name="' + c[0] + '">' + c[0] + '</button></li>';
    }).join('');
    box.className = 'matches on';
  }

  function go(name, lat, lon) {
    $('matches').className = 'matches';
    $('place').value = name;
    $('stamp').textContent = name + ' · reading…';
    fetchCity(name, lat, lon).then(renderAnswer);
  }

  /* ── Wiring ─────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    go('Delhi', 28.6139, 77.2090);

    Promise.all(CITIES.map(function (c) { return fetchCity(c[0], c[1], c[2]); }))
      .then(renderRanking);

    $('place').addEventListener('input', function () { showMatches(this.value); });
    $('matches').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) go(b.dataset.name, parseFloat(b.dataset.lat), parseFloat(b.dataset.lon));
    });
    $('findForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var q = $('place').value.trim().toLowerCase();
      var hit = CITIES.filter(function (c) { return c[0].toLowerCase() === q; })[0] ||
                CITIES.filter(function (c) { return c[0].toLowerCase().indexOf(q) === 0; })[0];
      if (hit) go(hit[0], hit[1], hit[2]);
    });

    $('nearBtn').addEventListener('click', function () {
      if (!navigator.geolocation) { $('stamp').textContent = 'Location not available'; return; }
      $('stamp').textContent = 'Finding you…';
      navigator.geolocation.getCurrentPosition(
        function (p) { go('Your location', p.coords.latitude.toFixed(4), p.coords.longitude.toFixed(4)); },
        function () { $('stamp').textContent = 'Location declined · showing Delhi'; }
      );
    });

    /* The index is a page of links behind one control, not a hover state.
       That is deliberate: the hover-only nav shipped in v26.6.213 left 52
       destinations unreachable from a keyboard. */
    var idx = $('siteIndex'), openBtn = $('indexBtn');
    function openIndex() {
      idx.hidden = false; idx.classList.add('on');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      $('closeIndex').focus();
    }
    function closeIndex() {
      idx.classList.remove('on'); idx.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      openBtn.focus();
    }
    openBtn.addEventListener('click', openIndex);
    $('closeIndex').addEventListener('click', closeIndex);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && idx.classList.contains('on')) closeIndex();
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-open-index]'), function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); openIndex(); });
    });

    var themeBtn = $('themeBtn');
    themeBtn.addEventListener('click', function () {
      var root = document.documentElement;
      var now = root.getAttribute('data-theme');
      var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme',
        now === 'auto' ? (dark ? 'light' : 'dark') : (now === 'dark' ? 'light' : 'dark'));
    });
  });
})();
