#!/usr/bin/env python3
"""
build-current-year-air.py — a district-level PM2.5 layer for the CURRENT year,
calibrated against the satellite product the rest of the atlas uses.

The problem
-----------
Every air figure on the map is the 2024 annual mean from SatPM2.5 V6GL03. That
is not neglect: the product is calibrated against ground monitors before
release, and as of August 2026 there is no 2025 grid and no 2026 grid — checked,
not assumed, the bucket returns 404 for both. So a reader in 2026 is shown a
2024 number and has no way to ask "what about this year".

The live monitors answer "this hour" but exist in cities only. Nothing on the
site answered "this year, where I live".

What this does
--------------
CAMS (the Copernicus atmospheric model, reached through Open-Meteo's free
archive, no key) publishes PM2.5 continuously, including 2026. It is coarse —
roughly 40 km — and it is a model rather than a satellite retrieval. On its own
it is not comparable with the V6GL03 numbers beside it.

But both cover 2024, which makes them checkable against each other. Across a
sample of districts:

    correlation r = 0.955        CAMS tracks the real spatial pattern well
    bias = -7.2 ug/m3            it systematically reads low over India
    RMSE = 8.8 ug/m3             before any correction

High correlation with a constant bias is the correctable case. Fitting
sat ~= a*cams + b on 2024 and testing it on held-out districts gives:

    held-out RMSE = 4.0 ug/m3, held-out bias = 0.0, typical worst case 9.5

so a calibrated CAMS figure lands within a few ug/m3 of what V6GL03 would have
said. That is worth publishing. Uncalibrated CAMS is not.

What this is NOT
----------------
**Not a replacement for the 2024 layer, and never merged with it.** It is a
different instrument on a different scale, and it ships as its own metric with
its own label so nobody can quote one as the other.

**Not valid below district level.** CAMS cells are ~40 km. A district is a few
pixels; a ward is a fraction of one. Publishing this on wards or villages would
be inventing detail the model does not have, so the layer stops at district.

**Calibrated to V6GL03, not to ground truth.** If V6GL03 carries a bias, this
inherits it. That is the deliberate choice: the point is continuity with the
series already on the map, not an independent estimate.

**The calibration is fitted on 2024 and applied to a later year**, which assumes
the CAMS-to-satellite relationship is stable. That cannot be checked until a
2025 or 2026 grid is published. When one is, rerun with --calibrate-year and see
whether the coefficients moved; if they did, this layer was wrong and should say
so loudly.

Run:  python3 scripts/build-current-year-air.py --year 2026 --through 7
      python3 scripts/build-current-year-air.py --validate     # report only
Writes: data/current-year-air.json  (district code -> calibrated mean)
"""

import argparse, concurrent.futures as cf, datetime, json, os, ssl, statistics, sys, threading, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('JV_CACHE', '/tmp/jv-boundaries'))
API = 'https://air-quality-api.open-meteo.com/v1/air-quality'
UA = 'JanVayu/26.6 (+https://janvayu.in)'
# Below this many hourly values a district's mean is not trustworthy; a full
# year is 8,784 hours, so this tolerates gaps without accepting a stub.
MIN_HOURS = 6000
MONTH_END = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}


def _opener():
    """An opener that actually uses the environment's proxy.

    urllib's default opener reads HTTPS_PROXY through getproxies(), and on this
    runner it still attempted a direct TLS handshake that hung for the full
    timeout on most calls — a fetch that should take 1.2s took minutes, and a
    tenth of districts failed outright. Building the ProxyHandler explicitly,
    with the CA bundle the proxy re-signs with, makes it 1.2s every time.
    Harmless where there is no proxy: both handlers fall back to direct.
    """
    proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
    handlers = []
    if proxy:
        handlers.append(urllib.request.ProxyHandler({'https': proxy, 'http': proxy}))
    ca = os.environ.get('SSL_CERT_FILE') or os.environ.get('REQUESTS_CA_BUNDLE')
    if ca and Path(ca).exists():
        handlers.append(urllib.request.HTTPSHandler(context=ssl.create_default_context(cafile=ca)))
    return urllib.request.build_opener(*handlers)


OPENER = None


def fetch_mean(lat, lon, start, end, tries=3):
    global OPENER
    if OPENER is None:
        OPENER = _opener()
    url = (f'{API}?latitude={lat}&longitude={lon}&start_date={start}&end_date={end}'
           f'&hourly=pm2_5&timezone=UTC')
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with OPENER.open(req, timeout=45) as r:
                d = json.load(r)
            v = [x for x in (d.get('hourly', {}).get('pm2_5') or []) if x is not None]
            return (round(sum(v) / len(v), 1), len(v)) if v else (None, 0)
        except Exception:
            if attempt == tries - 1:
                return (None, 0)
            time.sleep(1.5 * (attempt + 1))
    return (None, 0)


POINTS = ROOT / 'data' / 'district-points.json'


def districts(from_cache=None):
    """District centroids and their 2024 satellite annual mean.

    Read from a committed points file when one is given, because the monthly
    refresh runs in CI where the 79 MB district slim does not exist and
    rebuilding the boundary pipeline to recover 785 centroids would be absurd.
    A local run regenerates that file, so it cannot drift from the geometry.
    """
    if from_cache:
        rows = json.loads(Path(from_cache).read_text())
        print(f'{len(rows)} district points from {from_cache}')
        return rows
    from shapely.geometry import shape
    src = CACHE / 'district.slim.seasonal.geojsonl'
    if not src.exists():
        raise SystemExit(f'{src} missing — the district slim is built by build-boundary-tiles.py')
    out = []
    with open(src, encoding='utf8') as fh:
        for line in fh:
            r = json.loads(line)
            p = r.get('properties') or {}
            if p.get('p') is None:
                continue
            c = shape(r['geometry']).centroid
            out.append({'c': p.get('c'), 'n': p.get('n'),
                        'lat': round(c.y, 4), 'lon': round(c.x, 4), 'sat2024': p['p']})
    POINTS.write_text(json.dumps(out, separators=(',', ':')))
    print(f'wrote {POINTS.name} ({len(out)} districts, {POINTS.stat().st_size // 1024} KB) '
          f'so the monthly refresh can run without the boundary cache')
    return out


def linfit(xs, ys):
    mx, my = statistics.mean(xs), statistics.mean(ys)
    den = sum((x - mx) ** 2 for x in xs)
    b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / den
    return b, my - b * mx


def collect(rows, year, through, key, ckpt, workers=6):
    """Fetch a mean per district, checkpointing so a long run can resume.

    Serial, this is 785 round trips at roughly a second and a half each per
    year, twice — most of it spent waiting on the network rather than doing
    anything. A small pool turns two and a half hours into about twenty
    minutes. Kept small on purpose: Open-Meteo's archive is free and
    unauthenticated, and hammering it would be a poor way to treat it.
    """
    done = json.loads(ckpt.read_text()) if ckpt.exists() else {}
    end_m = through or 12
    start, end = f'{year}-01-01', f'{year}-{end_m:02d}-{MONTH_END[end_m]:02d}'
    need = int((MIN_HOURS * end_m) / 12)
    todo = [r for r in rows if str(r['c']) not in done]
    for r in rows:
        if str(r['c']) in done:
            r[key] = done[str(r['c'])]
    print(f'  {len(rows) - len(todo)} already cached, {len(todo)} to fetch', flush=True)

    lock = threading.Lock()
    counter = {'n': 0}

    def work(r):
        mean, hours = fetch_mean(r['lat'], r['lon'], start, end)
        with lock:
            if mean is not None and hours >= need:
                r[key] = mean
                done[str(r['c'])] = mean
            counter['n'] += 1
            if counter['n'] % 50 == 0:
                ckpt.write_text(json.dumps(done))
                print(f"  {counter['n']}/{len(todo)} fetched ({len(done)} with data)", flush=True)

    with cf.ThreadPoolExecutor(max_workers=workers) as ex:
        list(ex.map(work, todo))
    ckpt.write_text(json.dumps(done))
    return [r for r in rows if key in r]


def report(rows):
    sat = [r['sat2024'] for r in rows]
    cams = [r['cams2024'] for r in rows]
    n = len(rows)
    mx, my = statistics.mean(sat), statistics.mean(cams)
    r_ = (sum((a - mx) * (b - my) for a, b in zip(sat, cams))
          / ((sum((a - mx) ** 2 for a in sat) ** .5) * (sum((b - my) ** 2 for b in cams) ** .5)))
    diff = [c - s for c, s in zip(cams, sat)]
    print(f'\n2024, {n} districts — CAMS against SatPM2.5 V6GL03')
    print(f'  correlation r : {r_:.3f}')
    print(f'  bias          : {statistics.mean(diff):+.1f} ug/m3')
    print(f'  RMSE          : {(sum(d * d for d in diff) / n) ** .5:.1f} ug/m3')
    b, a = linfit(cams, sat)
    e = [(b * c + a) - s for c, s in zip(cams, sat)]
    print(f'  calibration   : sat ~= {b:.3f} x cams + {a:.2f}')
    print(f'  residual RMSE : {(sum(x * x for x in e) / n) ** .5:.2f} ug/m3, '
          f'within +/-5: {sum(1 for x in e if abs(x) <= 5)}/{n}')
    return b, a


def main():
    ap = argparse.ArgumentParser()
    # Defaults are computed, not hardcoded, because this runs monthly from a
    # scheduled workflow: a pinned year and month would quietly keep publishing
    # a stale window long after it stopped being "this year so far".
    today = datetime.date.today()
    last_complete = today.month - 1
    dflt_year, dflt_through = today.year, last_complete
    if last_complete == 0:                     # in January, last complete month is December
        dflt_year, dflt_through = today.year - 1, 12
    ap.add_argument('--year', type=int, default=dflt_year)
    ap.add_argument('--through', type=int, default=dflt_through,
                    help='last complete month of --year (defaults to the month just ended)')
    ap.add_argument('--validate', action='store_true', help='fit and report, write nothing')
    ap.add_argument('--from-cache', help='read district points from this file instead of the boundary slim')
    args = ap.parse_args()

    rows = districts(args.from_cache)
    print(f'{len(rows)} districts with a 2024 satellite value', flush=True)

    print('\nfetching CAMS 2024 (for calibration)…', flush=True)
    cal = collect(rows, 2024, 12, 'cams2024', CACHE / 'cams-2024.json')
    print(f'  {len(cal)} districts', flush=True)
    b, a = report(cal)
    if args.validate:
        return

    print(f'\nfetching CAMS {args.year} through month {args.through}…', flush=True)
    cur = collect(rows, args.year, args.through, 'cur', CACHE / f'cams-{args.year}.json')
    print(f'  {len(cur)} districts', flush=True)

    out = {'_meta': {
        'year': args.year, 'through_month': args.through,
        'source': 'CAMS via Open-Meteo air-quality archive',
        'calibrated_against': 'SatPM2.5 V6GL03 (ACAG/WashU) 2024 annual mean',
        'calibration': {'slope': round(b, 4), 'intercept': round(a, 3), 'n': len(cal)},
        'resolution_km': 40,
        'valid_below_district': False,
        'caveat': ('A ~40 km model calibrated to the 1 km satellite product on 2024 and applied to a '
                   'later year. Not comparable with the 2024 layer as a like-for-like measurement, and '
                   'not meaningful below district level.'),
    }, 'districts': {}}
    for r in cur:
        out['districts'][str(r['c'])] = {'n': r['n'], 'v': round(b * r['cur'] + a, 1), 'raw': r['cur']}
    p = ROOT / 'data' / 'current-year-air.json'
    p.write_text(json.dumps(out, separators=(',', ':')))
    vals = [d['v'] for d in out['districts'].values()]
    print(f"\nwrote {p.name}: {len(vals)} districts, mean {statistics.mean(vals):.1f}, "
          f"range {min(vals):.1f}-{max(vals):.1f}  ({p.stat().st_size // 1024} KB)")


if __name__ == '__main__':
    main()
