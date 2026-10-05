# CREA measurements API

Working note, 18 September 2026. It records a decision not yet taken, and the measurements behind it, so nobody has to repeat them.

## Why we looked

`data/deweathered-national.json` covers 44 cities but stops at 2024, because the XKDR archive's CPCB feed ends **1 September 2025** (see `docs/data-sources/xkdr-air-quality.md`). The method and the weather data are current. Only the pollution data is stale. The API of CREA (the Centre for Research on Energy and Clean Air) is the obvious replacement, and it is what hawakahisab.in runs on.

## What CREA offers, as probed

| | |
|---|---|
| Base | `https://api.energyandcleanair.org` |
| Access | open, **no API key**, CSV or JSON |
| Currency | `/ncap/ncap_latest_available_date` returned `2026-09-17` on 18 Sep 2026 (`2026-10-01` when re-checked on 2 Oct 2026) |
| Station daily | `/measurements?city_name=<city>&pollutant=pm25&level=station` |
| Station metadata | `/stations?city_name=<city>`, with coordinates and source |
| Their own de-weathering | `/ncap/deweathered_yoy`, a **gbm** model trained from 2022 |

The two sources share station identifiers. XKDR uses `site_<n>` for 553 of its 558 stations (`cpcb_caaqm`), and CREA returns the same `site_<n>` ids. For Delhi, 39 ids appear in both and **35 sit within 500 m** of each other. Four do not, and should be excluded until resolved: `site_5395` (Lodhi Road) differs by 0.67 km, `site_107` (Pusa) by 2.67 km, `site_1563` by 2.68 km and `site_105` by 6.53 km. These were re-checked on 2 Oct 2026, and CREA's coordinates may have changed since 18 Sep.

CREA's station JSON writes coordinates as (lon, lat) and XKDR as (lat, lon). Decide by range, never by position.

## The finding that stopped a splice

At station level CREA serves only `station_day_mad`. A `station_day_absolute` series is listed under `/processes` but returns no rows for these stations, and there is no hourly series. "mad" is an outlier filter (`mad_percentile` 0.7, `mad_multiplier` 15), so CREA rejects spikes that XKDR passes through.

On Delhi in 2024, across 13,735 shared station-days, the two agree closely: the median difference is **0.000 µg/m³**, 95.7% fall within 0.1 and 99.4% within 1. But the disagreement runs one way only. CREA is never higher.

Annual city means for 2024, same stations and same days:

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

So we do not splice. Joining XKDR before 1 September 2025 to CREA after it would put a one-way step into the series at that date. In cities with large trends (Meerut, Varanasi, Lucknow) the step is under 3% of a single year's trend and does no harm. In Hyderabad it is nearly twice the city's whole annual trend, and it points toward improvement. A blanket splice would manufacture improvement exactly where the real trend is smallest.

The Delhi bias is largest in June (−0.50), not in winter, so it does not imitate a seasonal pattern. That is a Delhi result and does not carry over to other cities.

## What to do instead

Rebuild the whole 2018-to-present series on CREA alone, and keep XKDR as the independent cross-check, not the backbone. With one source there is no step, and the overlap gives a validation set for free. The CPCB bulletin join worked the same way: two extractions agreeing on 671 of 671 shared city-days is what justified merging them.

One obstacle remains. `city_name=Meerut` returns **zero** rows from CREA for January 2018 and 2019, though XKDR has Meerut throughout, so CREA's city naming does not cover our city list. Query by station id instead, which is reliable because the identifiers are shared. Coverage per station and per year has to be confirmed for all 44 cities before committing.

## Attribution

CREA's compilation makes this possible and must be credited wherever it is used, as hawakahisab.in does. Check their licence terms explicitly before ingesting at scale.
