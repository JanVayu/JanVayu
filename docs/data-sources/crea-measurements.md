# CREA measurements API

Working note, 18 September 2026. This records a **decision not taken yet** and the
measurements behind it, so nobody has to re-run them.

## Why we looked

`data/deweathered-national.json` covers 44 cities but stops at 2024, because the
XKDR archive's CPCB feed ends **1 September 2025**
(`docs/data-sources/xkdr-air-quality.md`). The method, the code and the weather
data are current; only the pollution data is stale. CREA's API is the obvious
replacement, and it is what hawakahisab.in runs on.

## What CREA gives, probed rather than assumed

| | |
|---|---|
| Base | `https://api.energyandcleanair.org` |
| Access | open, **no API key**, CSV or JSON |
| Currency | `/ncap/ncap_latest_available_date` returned `2026-09-17` |
| Station daily | `/measurements?city_name=<city>&pollutant=pm25&level=station` |
| Station metadata | `/stations?city_name=<city>` with coordinates and source |
| Their own de-weathering | `/ncap/deweathered_yoy`, a **gbm** model trained from 2022 |

**The station id namespaces are shared.** XKDR uses `site_<n>` for 553 of its 558
stations (`cpcb_caaqm`), and CREA returns the same `site_<n>` ids. For Delhi, 39
ids appear in both and **37 are within 500 m** of each other. Two are not and
should be excluded until resolved: `site_107` (Pusa) differs by 2.67 km and
`site_5395` (Lodhi Road) by 0.67 km.

Note CREA writes coordinates as **(lon, lat)** and XKDR as (lat, lon). Decide by
range, never by position.

## The finding that stopped a splice

CREA serves **only** `station_day_mad` at station level. `station_day_absolute`
exists in `/processes` but returns no rows for these stations, and there is no
hourly series. `mad` is an outlier filter (`mad_percentile` 0.7,
`mad_multiplier` 15), so CREA rejects spikes that XKDR passes through.

On Delhi 2024, 13,735 shared station-days, the two agree closely: median
difference **0.000 µg/m³**, 95.7% within 0.1, 99.4% within 1. But the
disagreement is **one-directional**: CREA is never higher.

Annual city means, 2024, same stations and same days:

| city | stations | XKDR | CREA | shift | as % of one year of its trend |
|---|---|---|---|---|---|
| Greater Noida | 2 | 83.66 | 83.66 | +0.000 | 0.0% |
| Varanasi | 4 | 23.15 | 23.11 | −0.036 | 0.3% |
| Delhi | 39 | 104.07 | 103.99 | −0.089 | 5.0% |
| Mumbai | 28 | 34.55 | 34.45 | −0.102 | 12.7% |
| Chandrapur | 2 | 42.33 | 42.21 | −0.126 | 5.3% |
| Chandigarh | 3 | 70.44 | 70.29 | −0.149 | 4.9% |
| Rohtak | 1 | 73.38 | 73.23 | −0.150 | 2.6% |
| Lucknow | 6 | 58.98 | 58.79 | −0.185 | 1.3% |
| Meerut | 3 | 59.67 | 59.30 | −0.369 | 2.5% |
| Bhiwadi | 2 | 80.26 | 79.84 | −0.412 | 5.1% |
| **Hyderabad** | 14 | 32.29 | 31.31 | **−0.980** | **192.2%** |

**So we do not splice.** Joining XKDR before 1 September 2025 to CREA after it
would inject a one-directional step at that date. In cities with large trends
(Meerut, Varanasi, Lucknow) the step is under 3% of a single year's trend and
harmless. In Hyderabad it is **nearly twice** the city's whole annual trend, in
the direction of improvement. A blanket splice would manufacture improvement
precisely where the real trend is smallest.

The Delhi bias is largest in **June** (−0.50) rather than winter, so it does not
mimic a seasonal pattern, but that is a Delhi result and does not generalise.

## What to do instead

Rebuild the whole 2018 to present series **on CREA alone**, and keep XKDR as the
independent cross-check rather than the spine. One source means no step by
construction, and the overlap gives a validation set for free. This is the same
shape as the CPCB bulletin join, where two extractions agreeing on 671 of 671
shared city-days is what licensed the merge.

**One blocker before that is viable.** `city_name=Meerut` returns **zero** rows
from CREA for January 2018 and 2019, though XKDR has Meerut throughout, so
CREA's city naming does not cover our city list. Query **by station id** instead,
which is reliable because the namespaces are shared. Coverage per station and per
year must be confirmed for all 44 cities before committing.

## Attribution

CREA is the Centre for Research on Energy and Clean Air. Their compilation is
what makes this possible and must be credited wherever it is used, as
hawakahisab.in does. Check their licence terms explicitly before ingesting at
scale.
