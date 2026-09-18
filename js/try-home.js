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

    applyRole();

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


  /* ── The site's own preferences, kept on the same keys ─────────────────
   * Role, plain language and the dyslexia font already exist on janvayu.in.
   * This page reads and writes the SAME storage keys, so a preference set
   * here survives a move to the rest of the site and back. The dyslexia font
   * is not reimplemented at all: js/dyslexia-font.js is the site's own script,
   * dropped in, and it finds its slot from data-dyslexia-slot on the bar.
   *
   * Each control has to earn its place. A role that only remembers a word is
   * decoration; here it decides WHICH of the three answers is shown first,
   * because the whole point of the page is that the same reading means
   * different things to different people. */

  var ROLES = [
    ['parent',      'Parent',      0], ['woman',       'Woman',       0],
    ['teacher',     'Teacher',     0], ['student',     'Student',     2],
    ['doctor',      'Doctor',      1], ['citizen',     'Citizen',     2],
    ['activist',    'Activist',    2], ['journalist',  'Journalist',  2],
    ['researcher',  'Researcher',  2], ['policymaker', 'Policymaker', 2],
    ['ngo',         'NGO worker',  2], ['business',    'Business',    2]
  ];
  /* the third value is which of the three columns leads for that role:
     0 = a child or over 65, 1 = asthma or a heart condition, 2 = healthy adult */

  var LANGS = [['en','EN','English'],['hi','हि','हिन्दी'],['ta','த','தமிழ்'],
               ['mr','म','मराठी'],['bn','ব','বাংলা']];

  /* This page's own strings, in the five languages the site ships. Kept here
     rather than reaching into app.js's table: that table is loaded by the
     homepage and this page does not load app.js. The site forgets your
     language on reload because it never stores it; this one stores it. */
  var STRINGS = {
    en: { ask:'What are you breathing, right now?', place:'Your city, ward or village',
          near:'Near me', index:'Index', theme:'Theme', plain:'Simple', who:'Who you are',
          filter:'Filter…', everything:'Everything on this site' },
    hi: { ask:'आप अभी क्या साँस ले रहे हैं?', place:'आपका शहर, वार्ड या गाँव',
          near:'मेरे पास', index:'सूची', theme:'थीम', plain:'सरल', who:'आप कौन हैं',
          filter:'छाँटें…', everything:'इस साइट पर सब कुछ' },
    ta: { ask:'இப்போது நீங்கள் என்ன சுவாசிக்கிறீர்கள்?', place:'உங்கள் நகரம், வார்டு அல்லது கிராமம்',
          near:'எனக்கு அருகில்', index:'பட்டியல்', theme:'தீம்', plain:'எளிய', who:'நீங்கள் யார்',
          filter:'வடிகட்டு…', everything:'இந்தத் தளத்தில் உள்ள அனைத்தும்' },
    mr: { ask:'तुम्ही आत्ता काय श्वास घेत आहात?', place:'तुमचे शहर, वॉर्ड किंवा गाव',
          near:'माझ्याजवळ', index:'सूची', theme:'थीम', plain:'सोपे', who:'तुम्ही कोण आहात',
          filter:'गाळा…', everything:'या साइटवरील सर्व काही' },
    bn: { ask:'আপনি এখন কী শ্বাস নিচ্ছেন?', place:'আপনার শহর, ওয়ার্ড বা গ্রাম',
          near:'আমার কাছে', index:'তালিকা', theme:'থিম', plain:'সরল', who:'আপনি কে',
          filter:'ছাঁকুন…', everything:'এই সাইটের সবকিছু' }
  };

  function applyLang(code) {
    var s = STRINGS[code] || STRINGS.en;
    var q = $('q');
    if (q) {
      var f = q.querySelector('[data-full]');
      if (f) f.textContent = s.ask; else q.textContent = s.ask;
    }
    $('place').placeholder = s.place;
    $('nearBtn').textContent = s.near;
    $('indexBtn').textContent = s.index;
    $('themeBtn').textContent = s.theme;
    $('plainBtn').textContent = s.plain;
    $('langLabel').textContent = (LANGS.filter(function (l) { return l[0] === code; })[0] || LANGS[0])[1];
    var flt = $('filter'); if (flt) flt.placeholder = s.filter;
    document.documentElement.lang = code;
    try { localStorage.setItem('janvayu-lang', code); } catch (e) {}
  }

  function leadColumn() {
    var role;
    try { role = localStorage.getItem('janvayu-role'); } catch (e) { role = null; }
    var hit = ROLES.filter(function (r) { return r[0] === role; })[0];
    return hit ? hit[2] : -1;
  }

  function applyRole() {
    var role;
    try { role = localStorage.getItem('janvayu-role'); } catch (e) { role = null; }
    var hit = ROLES.filter(function (r) { return r[0] === role; })[0];
    $('roleLabel').textContent = hit ? hit[1] : (STRINGS[currentLang] || STRINGS.en).who;
    var lead = leadColumn();
    var cols = $('who').querySelectorAll('div');
    for (var i = 0; i < cols.length; i++) {
      if (i === lead) cols[i].setAttribute('data-lead', '');
      else cols[i].removeAttribute('data-lead');
    }
    Array.prototype.forEach.call($('roleGrid').children, function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.role === role));
    });
  }

  function applyPlain(on) {
    document.body.classList.toggle('simple-language', on);
    $('plainBtn').setAttribute('aria-pressed', String(on));
    try { sessionStorage.setItem('janvayu-simple-mode', String(on)); } catch (e) {}
  }

  var currentLang = 'en';

  function wirePreferences() {
    try { currentLang = localStorage.getItem('janvayu-lang') || 'en'; } catch (e) {}
    if (!STRINGS[currentLang]) currentLang = 'en';

    $('roleGrid').innerHTML = ROLES.map(function (r) {
      return '<button type="button" data-role="' + r[0] + '" aria-pressed="false">' + r[1] + '</button>';
    }).join('');
    $('langGrid').innerHTML = LANGS.map(function (l) {
      return '<button type="button" data-lang="' + l[0] + '" aria-pressed="false">' + l[1] + ' ' + l[2] + '</button>';
    }).join('');

    function togglePop(btn, pop) {
      var open = pop.hidden;
      $('rolePop').hidden = true; $('langPop').hidden = true;
      $('roleBtn').setAttribute('aria-expanded', 'false');
      $('langBtn').setAttribute('aria-expanded', 'false');
      if (open) { pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
    }
    $('roleBtn').addEventListener('click', function () { togglePop(this, $('rolePop')); });
    $('langBtn').addEventListener('click', function () { togglePop(this, $('langPop')); });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#roleBtn,#rolePop,#langBtn,#langPop')) {
        $('rolePop').hidden = true; $('langPop').hidden = true;
        $('roleBtn').setAttribute('aria-expanded', 'false');
        $('langBtn').setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('rolePop').hidden || !$('langPop').hidden) {
        $('rolePop').hidden = true; $('langPop').hidden = true;
        $('roleBtn').setAttribute('aria-expanded', 'false');
        $('langBtn').setAttribute('aria-expanded', 'false');
      }
    });

    $('roleGrid').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var was;
      try { was = localStorage.getItem('janvayu-role'); } catch (err) { was = null; }
      try {
        if (was === b.dataset.role) localStorage.removeItem('janvayu-role');
        else localStorage.setItem('janvayu-role', b.dataset.role);
      } catch (err) {}
      applyRole();
      $('rolePop').hidden = true;
      $('roleBtn').setAttribute('aria-expanded', 'false');
    });
    $('langGrid').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      currentLang = b.dataset.lang;
      applyLang(currentLang); applyRole();
      Array.prototype.forEach.call($('langGrid').children, function (x) {
        x.setAttribute('aria-pressed', String(x.dataset.lang === currentLang));
      });
      $('langPop').hidden = true;
      $('langBtn').setAttribute('aria-expanded', 'false');
    });

    var plainOn = false;
    try { plainOn = sessionStorage.getItem('janvayu-simple-mode') === 'true'; } catch (e) {}
    applyPlain(plainOn);
    $('plainBtn').addEventListener('click', function () {
      applyPlain(!document.body.classList.contains('simple-language'));
    });

    applyLang(currentLang);
    applyRole();
    Array.prototype.forEach.call($('langGrid').children, function (x) {
      x.setAttribute('aria-pressed', String(x.dataset.lang === currentLang));
    });

    /* Filtering the index is what "search" means on a page whose content is
       a list of destinations: the thing being searched is right there. */
    var flt = $('filter');
    if (flt) {
      flt.addEventListener('input', function () {
        var q = this.value.trim().toLowerCase(), hits = 0;
        Array.prototype.forEach.call(document.querySelectorAll('#siteIndex .grid section'), function (sec) {
          var shown = 0;
          Array.prototype.forEach.call(sec.querySelectorAll('a'), function (a) {
            var on = !q || a.textContent.toLowerCase().indexOf(q) !== -1;
            a.classList.toggle('hide', !on);
            if (on) shown++;
          });
          sec.classList.toggle('hide', q && !shown);
          hits += shown;
        });
        $('noHits').hidden = !(q && hits === 0);
      });
    }
  }

  /* ── Wiring ─────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    wirePreferences();
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
