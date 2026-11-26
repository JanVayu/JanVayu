/* CPCB's daily bulletin, one city at a time. Drawn from data/bulletin-explorer/,
 * which scripts/build-bulletin-explorer.py writes and checks. Every chart has a
 * table of its numbers under it, and no average AQI is computed anywhere: the
 * index reports whichever pollutant scores worst, so its mean is not a quantity.
 */
(function () {
  'use strict';
  var CATS = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe'];
  // The Delhi season palette: each clears 4.7:1 on the chart card.
  var COL = ['#15803d', '#4d7c0f', '#a16207', '#c2410c', '#b91c1c', '#7f1d1d'];
  var INK = '#1f2a24', MUTED = '#4b5a50', GRID = '#d8d6cc';
  var FONT = 'font-family="Inter, system-ui, sans-serif"';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var base = '/data/bulletin-explorer/';
  var citySel = document.getElementById('bx-city');
  var polSel = document.getElementById('bx-pollutant');
  var out = document.getElementById('bx-out');
  var current = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function parse(d) { var p = d.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function longDate(d) { var x = parse(d); return x.getUTCDate() + ' ' + LONG[x.getUTCMonth()] + ' ' + x.getUTCFullYear(); }
  function shortDate(d) { var x = parse(d); return x.getUTCDate() + ' ' + MONTHS[x.getUTCMonth()]; }
  function dayIndex(d) { return Math.round((parse(d) - Date.UTC(2026, 0, 1)) / 864e5); }
  function pols(p) { return (p || '').split('|').filter(Boolean); }

  function wrap(svg, w, h, label) {
    // On a phone the chart keeps a readable width and scrolls; tabindex lets a keyboard reach it.
    return '<div class="jv-dgm" tabindex="0" role="region" aria-label="' + esc(label.split('.')[0]) + ', scrollable"><svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(label) + '">' + svg + '</svg></div>';
  }

  function lineChart(f, pol) {
    var W = 900, L = 44, R = 888, T = 30, B = 230, H = 290;
    var last = dayIndex(f.through), span = Math.max(last, 1);
    var X = function (i) { return L + (R - L) * i / span; };
    var Y = function (v) { return B - (B - T) * Math.min(v, 500) / 500; };
    var s = '<text x="12" y="18" ' + FONT + ' font-size="15" font-weight="700" fill="' + INK + '">' + esc(f.name) + ', CPCB bulletin AQI each day of 2026</text>';
    [100, 200, 300, 400, 500].forEach(function (g) {
      s += '<line x1="' + L + '" y1="' + Y(g) + '" x2="' + R + '" y2="' + Y(g) + '" stroke="' + GRID + '" stroke-width="1"/>';
      s += '<text x="' + (L - 6) + '" y="' + (Y(g) + 4) + '" text-anchor="end" ' + FONT + ' font-size="11.5" fill="' + MUTED + '">' + g + '</text>';
    });
    s += '<line x1="' + L + '" y1="' + B + '" x2="' + R + '" y2="' + B + '" stroke="' + MUTED + '" stroke-width="1"/>';
    // A line joins only consecutive days. A day with no bulletin is a gap, not a zero.
    var seg = [], prev = null;
    f.daily.forEach(function (d) {
      if (d[1] == null) { prev = null; return; }
      var i = dayIndex(d[0]);
      if (prev !== null && i === prev + 1) seg[seg.length - 1].push([i, d[1]]); else seg.push([[i, d[1]]]);
      prev = i;
    });
    seg.forEach(function (sg) {
      if (sg.length < 2) return;
      s += '<polyline fill="none" stroke="' + MUTED + '" stroke-width="1.2" points="' + sg.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(' ') + '"/>';
    });
    f.daily.forEach(function (d) {
      if (d[1] == null) return;
      var on = !pol || pols(d[3]).indexOf(pol) >= 0;
      s += '<circle cx="' + X(dayIndex(d[0])).toFixed(1) + '" cy="' + Y(d[1]).toFixed(1) + '" r="2.6" fill="' + COL[d[2]] + '"' + (on ? '' : ' opacity="0.15"') + '><title>' + esc(shortDate(d[0]) + ': ' + d[1] + ', ' + CATS[d[2]] + ', ' + (d[3] || 'no pollutant named').replace(/\|/g, ', ') + ', ' + d[4] + ' of ' + d[5] + ' stations') + '</title></circle>';
    });
    for (var m = 0; m < 12; m++) {
      var i = dayIndex('2026-' + String(m + 1).padStart(2, '0') + '-01');
      if (i > last) break;
      s += '<text x="' + X(i).toFixed(1) + '" y="' + (B + 16) + '" ' + FONT + ' font-size="11.5" fill="' + MUTED + '">' + MONTHS[m] + '</text>';
    }
    // Stations reporting, as a share of the city's stations, under the axis.
    var sy = B + 30, sh = 20;
    s += '<text x="' + (L - 6) + '" y="' + (sy + 14) + '" text-anchor="end" ' + FONT + ' font-size="10.5" fill="' + MUTED + '">stations</text>';
    f.daily.forEach(function (d) {
      if (!d[5]) return;
      var share = Math.min(1, d[4] / d[5]);
      var x = X(dayIndex(d[0])), h = sh * share;
      s += '<rect x="' + (x - 1).toFixed(1) + '" y="' + (sy + sh - h).toFixed(1) + '" width="2" height="' + h.toFixed(1) + '" fill="' + (share < 1 ? '#b45309' : MUTED) + '"/>';
    });
    s += '<text x="' + R + '" y="' + (sy + sh + 16) + '" text-anchor="end" ' + FONT + ' font-size="10.5" fill="' + MUTED + '">bar height: share of the city’s stations that reported; amber when some did not</text>';
    return wrap(s, W, H, 'Dot chart of ' + f.name + '’s CPCB bulletin AQI for each day of 2026 to ' + longDate(f.through) + ', coloured by category, with the share of stations reporting each day below it. The numbers are in the table under the calendar.');
  }

  function calendar(f, pol) {
    var cw = 26, ch = 22, L = 40, T = 26, W = L + 31 * cw + 8, last = parse(f.through).getUTCMonth();
    var H = T + (last + 1) * ch + 6;
    var byDate = {};
    f.daily.forEach(function (d) { byDate[d[0]] = d; });
    var s = '<text x="12" y="17" ' + FONT + ' font-size="15" font-weight="700" fill="' + INK + '">Each day’s category, month by month</text>';
    for (var m = 0; m <= last; m++) {
      var y = T + m * ch;
      s += '<text x="' + (L - 6) + '" y="' + (y + 15) + '" text-anchor="end" ' + FONT + ' font-size="11.5" fill="' + MUTED + '">' + MONTHS[m] + '</text>';
      var dim = new Date(Date.UTC(2026, m + 1, 0)).getUTCDate();
      for (var day = 1; day <= dim; day++) {
        var key = '2026-' + String(m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var d = byDate[key], x = L + (day - 1) * cw;
        if (!d) {
          if (key <= f.through) s += '<rect x="' + x + '" y="' + y + '" width="' + (cw - 3) + '" height="' + (ch - 3) + '" fill="none" stroke="' + GRID + '"><title>' + shortDate(key) + ': no bulletin figure</title></rect>';
          continue;
        }
        var on = !pol || pols(d[3]).indexOf(pol) >= 0;
        s += '<rect x="' + x + '" y="' + y + '" width="' + (cw - 3) + '" height="' + (ch - 3) + '" fill="' + COL[d[2]] + '"' + (on ? '' : ' opacity="0.15"') + '><title>' + esc(shortDate(key) + ': ' + d[1] + ', ' + CATS[d[2]] + ', ' + (d[3] || 'no pollutant named').replace(/\|/g, ', ') + ', ' + d[4] + ' of ' + d[5] + ' stations') + '</title></rect>';
      }
    }
    return wrap(s, W, H, 'Calendar of ' + f.name + '’s bulletin category for each day of 2026, one row per month. An outlined square is a day with no figure for this city.');
  }

  function key() {
    return '<ul class="key">' + CATS.map(function (c, i) { return '<li><i style="background:' + COL[i] + '"></i>' + c + '</li>'; }).join('') + '</ul>';
  }

  function windowTable(w) {
    var years = Object.keys(w.years).sort().reverse();
    var head = '<tr><th>Year</th>' + CATS.map(function (c) { return '<th class="num">' + c + '</th>'; }).join('') + '<th class="num">Poor or worse</th><th class="num">Days reported</th><th class="num">Median stations</th></tr>';
    var body = years.map(function (y) {
      var v = w.years[y], b = v.by_category;
      return '<tr><td>' + y + '</td>' + b.map(function (n) { return '<td class="num">' + n + '</td>'; }).join('') +
        '<td class="num">' + (b[3] + b[4] + b[5]) + '</td><td class="num">' + v.days + '</td><td class="num">' + v.median_stations + (v.thin ? ' (thin)' : '') + '</td></tr>';
    }).join('');
    return '<div class="wrap" tabindex="0" role="region" aria-label="' + esc(w.label) + ', days by category each year"><table><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
  }

  function windowSentence(f, w) {
    var cur = w.years['2026'];
    if (!cur) return '';
    var pw = cur.by_category[3] + cur.by_category[4] + cur.by_category[5];
    var past = Object.keys(w.years).filter(function (y) { return y !== '2026'; });
    // A leap year has one more day in a window that runs past February, so
    // "comparable" is a figure on nearly every day, not an equal count.
    var full = past.filter(function (y) { return w.years[y].days >= 0.95 * cur.days; });
    var s = 'From ' + w.label + ' this year, CPCB rated ' + esc(f.name) + ' on ' + cur.days + ' days, ' + pw + ' of them Poor or worse.';
    if (full.length) {
      var more = full.filter(function (y) { var b = w.years[y].by_category; return b[3] + b[4] + b[5] > pw; }).length;
      var fewer = full.filter(function (y) { var b = w.years[y].by_category; return b[3] + b[4] + b[5] < pw; }).length;
      var same = full.length - more - fewer;
      s += ' Of the ' + full.length + ' earlier years with a figure on nearly every day of the same window, ' + more + ' had more Poor-or-worse days, ' + fewer + ' had fewer' + (same ? ' and ' + same + ' had the same number.' : '.');
    } else if (past.length) {
      s += ' No earlier year has a figure on nearly every day of this window, so the counts below are not directly comparable.';
    } else {
      s += ' The 2019 to 2025 bulletins have no figure for this city in this window.';
    }
    if (cur.thin) s += ' This year’s figures rest on a median of ' + cur.median_stations + (cur.median_stations === 1 ? ' station' : ' stations') + ', so they describe a place more than a city.';
    return '<p>' + s + '</p>';
  }

  function dailyTable(f) {
    var rows = f.daily.slice().reverse().map(function (d) {
      return '<tr><td>' + shortDate(d[0]) + '</td><td class="num">' + (d[1] == null ? '' : d[1]) + '</td><td>' + CATS[d[2]] + '</td><td>' + esc((d[3] || '').replace(/\|/g, ', ')) + '</td><td class="num">' + d[4] + ' of ' + d[5] + '</td></tr>';
    }).join('');
    return '<details><summary>Show every day (' + f.daily.length + ')</summary><div class="wrap" tabindex="0" role="region" aria-label="Every day of 2026"><table><thead><tr><th>Date</th><th class="num">AQI</th><th>Category</th><th>Prominent pollutant</th><th class="num">Stations reported</th></tr></thead><tbody>' + rows + '</tbody></table></div></details>';
  }

  function render() {
    var f = current;
    if (!f) return;
    var pol = polSel.value;
    var last = f.daily[f.daily.length - 1];
    var cat = f.daily.reduce(function (a, d) { a[d[2]]++; return a; }, [0, 0, 0, 0, 0, 0]);
    var html = '<div class="facts">' +
      '<div class="fact"><b>' + (last[1] == null ? 'none' : last[1]) + '</b><span>' + CATS[last[2]] + ' on ' + shortDate(last[0]) + '</span></div>' +
      '<div class="fact"><b>' + last[4] + ' of ' + last[5] + '</b><span>stations reported that day</span></div>' +
      '<div class="fact"><b>' + (cat[3] + cat[4] + cat[5]) + '</b><span>Poor or worse days of ' + f.daily.length + ' in 2026</span></div>' +
      '<div class="fact"><b>' + esc((last[3] || 'none').replace(/\|/g, ', ')) + '</b><span>prominent pollutant on ' + shortDate(last[0]) + '</span></div>' +
      '</div>';
    if (pol) html += '<p class="note">Days whose prominent pollutant was not ' + esc(pol) + ' are faded. The tables are not filtered.</p>';
    html += lineChart(f, pol) + calendar(f, pol) + key();
    ['season', 'year'].forEach(function (k) {
      var w = f.windows[k];
      if (!w) return;
      html += '<h3>' + esc(w.label.charAt(0).toUpperCase() + w.label.slice(1)) + ', against 2019 to 2025</h3>' + windowSentence(f, w) + windowTable(w);
    });
    html += '<p class="note">Each row counts the days CPCB rated this city between the same two calendar dates in that year. “Thin” means the median number of reporting stations was below 3. Earlier years are counted from UrbanEmissions.Info’s extraction of the bulletins. A difference between years is what the bulletin recorded and does not establish a cause.</p>';
    html += '<h3>Every day</h3>' + dailyTable(f);
    html += '<p class="note">This city’s data: <a href="' + base + esc(citySel.value) + '.json">' + base + esc(citySel.value) + '.json</a>.</p>';
    out.innerHTML = html;
  }

  function load(slug) {
    out.setAttribute('aria-busy', 'true');
    return fetch(base + encodeURIComponent(slug) + '.json').then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (f) {
      current = f;
      var seen = {};
      f.daily.forEach(function (d) { pols(d[3]).forEach(function (p) { seen[p] = (seen[p] || 0) + 1; }); });
      var keep = polSel.value;
      polSel.innerHTML = '<option value="">Any</option>' + Object.keys(seen).sort(function (a, b) { return seen[b] - seen[a]; })
        .map(function (p) { return '<option value="' + esc(p) + '">' + esc(p) + ' (' + seen[p] + ' days)</option>'; }).join('');
      polSel.value = seen[keep] ? keep : '';
      render();
    }).catch(function () {
      out.innerHTML = '<p>This city’s file could not be loaded. The full table is <a href="/data/raw/cpcb-bulletins-2026.csv.gz">the 2026 bulletin file</a>.</p>';
    }).then(function () { out.removeAttribute('aria-busy'); });
  }

  function pick(slug, push) {
    if (!Array.prototype.some.call(citySel.options, function (o) { return o.value === slug; })) slug = 'delhi';
    citySel.value = slug;
    if (push) {
      try { history.replaceState(null, '', '?city=' + encodeURIComponent(slug)); } catch (e) { /* file:// */ }
    }
    load(slug);
  }

  if (!citySel || !out) return;
  citySel.addEventListener('change', function () { pick(citySel.value, true); });
  polSel.addEventListener('change', render);
  var q = (location.search.match(/[?&]city=([a-z0-9-]+)/) || [])[1];
  pick(q || 'delhi', false);
})();
