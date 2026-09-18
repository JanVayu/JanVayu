# Observed Station Data (XKDR India Air Quality Database)

Every other PM2.5 figure on JanVayu is modelled. This one is measured.

The [India Air Quality Database](https://airquality.xkdr.org) is XKDR Forum's
compilation of India's two continuous monitoring networks into a single table:
the Central Pollution Control Board's CAAQM network and the five US Embassy and
Consulate monitors published through AirNow.

---

## What it holds

| | |
|---|---|
| Readings | 196.5 million hourly |
| Stations | 558 (553 CPCB, 5 US Embassy) |
| Pollutants | 15 |
| Coverage | January 2009 to March 2026 nominally; **the CPCB network ends 1 September 2025** (see below). Bringing the de-weathered trends past that date is scoped in [CREA Measurements API](crea-measurements.md), which also records why the two sources must not be spliced. |
| Licence | **CC BY 4.0** |
| Citation | XKDR Forum (2026). India Air Quality Database. https://airquality.xkdr.org |

Attribution must credit three parties, not one: XKDR Forum, the CPCB CAAQM
network, and the US Department of State via AirNow.

---

## Why it matters here

JanVayu's air layers were, until this source, entirely modelled:

| Layer | What it is |
|---|---|
| 2024 annual map | SatPM2.5 V6GL03, a satellite retrieval |
| Current-year layer | CAMS at ~40 km, bias-corrected onto the 2024 retrieval |
| 1980–2022 history | LongPMInd, a machine-learning reconstruction |

Each is defensible and each is documented as an estimate. None is a reading from
an instrument. That gap is what this closes, and it lets the site do something it
could not do before: **check its own headline layer against the monitors.**

`scripts/build-station-observed.py` does exactly that. For 2024:

- 534 stations reported PM2.5; **284 cleared twelve complete months**
- 276 paired with a district centroid within 50 km
- observed **53.8** vs satellite **51.9** µg/m³
- **r = 0.834**, RMSE 14.3, mean difference **+1.9 µg/m³**

The satellite layer tracks the monitors closely, and reads slightly lower. That
is the expected direction rather than an error: a district-wide mean averages an
urban monitor together with the countryside around it.

---

## Access

Bearer-token API. A key is free and instant from
[airquality.xkdr.org/signup](https://airquality.xkdr.org/signup) (email, name,
and a Cloudflare human check), and carries **no rate limit and no row cap**.

```bash
curl -H "Authorization: Bearer $XKDR_API_KEY" \
  "https://airquality.xkdr.org/v1/measurements?city=Delhi&parameter=PM2.5&start=2024-11-01&end=2024-11-30&agg=daily&format=csv"
```

Endpoints: `/v1/meta`, `/v1/stations`, `/v1/parameters`, `/v1/measurements`,
`/v1/files`. All accept `format=json|csv|parquet`; `agg=hourly|daily|monthly`.
Bulk Parquet is one file per month, under half a gigabyte in total, and DuckDB
can query it in place over HTTP range requests.

A published demo key exists for trying it out, capped at 10,000 rows and 2024
only. `build-station-observed.py` falls back to it, which is enough for its
default year and nothing later.

---

## Traps

**The headline coverage is carried by two monitors.** "January 2009 to March
2026" is true and, taken at face value, badly misleading. Station counts per
month for PM2.5, queried 17 September 2026 on a full-tier key:

| Months | Stations reporting |
|---|---|
| 2023-01 to 2024-12 | 391 rising to 524 |
| **2025-01 to 2025-03** | **4 to 5** |
| 2025-04 to 2025-08 | 321 to 327 |
| 2025-09 | 296, but only 7,803 station-hours, roughly one day |
| **2025-10 to 2026-03** | **2** |

Those last two are `DS1010001` and `DS1010005`, the US Embassy monitors in New
Delhi and Hyderabad, which publish through AirNow independently of CPCB. The
CPCB feed in this archive effectively stops on **1 September 2025**, with a hole
across January to March 2025.

The consequence is concrete: applying the twelve-month completeness rule to 2025
leaves **one station out of 334**, against 284 of 534 for 2024. **2024 is the
most recent year that supports a national annual layer**, and that is why
`build-station-observed.py` defaults to it. Do not read "to March 2026" as
currency, and check station counts per month before choosing any window.

**Timestamps are naive IST.** `collected_at` carries no offset and is Indian
Standard Time. Any sub-daily resampling that assumes UTC will be off by 5½ hours
and will silently misassign night and morning.

**A descriptive User-Agent is required.** The API sits behind Cloudflare, which
rejects Python's default `urllib` agent with a 403. This looks like an egress
denial and is not one.

**Pollutant coverage ends at different dates.** The API's own `/v1/parameters`
reports PM2.5 running to 2026-03 and PM10 to 2025-09, while NO2, SO2, CO, NOx,
NO, Ozone, NH3 and Benzene all stop at 2024-12-31. The headline "2009 to 2026"
is a PM2.5 span. Check before assuming a multi-pollutant year exists.

**62 stations carry no coordinates.** These are decommissioned sites absent from
CPCB's current list. They cannot be joined to any geography.

**Nothing is cleaned.** XKDR publishes readings as received: no gap filling, no
outlier removal. That is correct for research and it means the QC is ours. The
Reading List carries two 2026 papers on precisely this problem (Shafi & Scafetta
on regression imputation for Delhi; Singhal et al. on TimeGAN).

**No warranty, stated explicitly.** XKDR notes the source networks label readings
preliminary and not fully validated, that XKDR has not validated them for
regulatory, legal or health decisions, and to check the source for anything that
matters. Any public claim JanVayu builds on this must carry that caveat forward.

---

## Alternatives considered

| Source | Why not this instead |
|---|---|
| **CPCB CCR portal** | The upstream source, but downloads are capped at roughly one week per station per pollutant. No bulk path. |
| **OpenAQ S3 archive** | Free, no AWS account, gzipped CSV partitioned per location per month. Global rather than India-first, shallower history, and stitching hundreds of location folders is the work XKDR has already done. JanVayu still uses the OpenAQ API for hyperlocal live readings. |
| **data.gov.in** | Historical, but the manual NAMP network (SO2, NO2, RSPM, SPM), not continuous CAAQMS. |
| **SAFAR (IITM)** | Real-time only, a handful of cities. |
| **Dataful** | Commercial compilation from 2015, derived from daily AQI bulletins rather than hourly readings. |

For satellite PM2.5 the position is unchanged: ACAG's global series reaches 2023
(V6.GL.02.04) and the Asia regional V6GL03 bucket still returns 404 for 2025 and
2026, rechecked 17 September 2026. The CAMS-based current-year layer remains the
only way to answer "what about this year" below the station network.
