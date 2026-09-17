# Raw CPCB bulletin tables

`cpcb-bulletins-2026.csv.gz` is CPCB's daily AQI bulletin for 2026, parsed from
the published PDFs by `scripts/fetch-cpcb-bulletin.py`. 62,851 rows, 260 days,
2026-01-01 to 2026-09-17, 588 distinct city strings, no rows skipped
and no gaps in CPCB's own serial numbering.

It is committed rather than fetched on demand for two reasons. The fetch takes
about five hours, and more importantly `build-aqi-bulletins.py` reads this file
to build the 2026 half of `data/aqi-bulletins.json`, so without it nobody could
rebuild that file from a clone. Passing `--daily <dir>` instead reads a live
fetch's per-day JSON; both paths produce a byte-identical result.

These are Government of India publications and the figures are facts, parsed by
us. The GPL note in `_meta.source` covers the UrbanEmissions extraction that
2015-2025 is built from, and does not apply here.

## The join, and what it cost

Merged into `data/aqi-bulletins.json` in v26.6.202. The two sources disagree
about spelling, not about facts: on 2025-06-10, 2025-07-15 and 2025-08-20,
checked city by city, they agree on the AQI and the station count for all 671
city-days they share.

Case and whitespace folding took 588 raw 2026 strings to 304, of which 270
matched a 2015-2025 city exactly. The rest:

- **Eight cities new to the file**, each with enough days to describe a part
  year: Bhavnagar, Eluru, Guntur, Machilipatnam, Mehsana, Pampore, Rajkot and
  Vadodara. Checked against near-spellings before being called new, because
  that is how a city gets split in two: Khairthal is not Kaithal, Khora is not
  Korba, Nellore is not Vellore.
- **One alias.** `yamuna nagar` is the shipped `Yamunanagar`, 238 days. It is
  the only one, and `--check` fails if an alias target is missing or if the
  aliased spelling survives as a separate city.
- **Byrnihat (Assam) and Byrnihat (Meghalaya)** stay two cities. They share a
  name and are different places, so the trap here is normalisation, not
  ambiguity: stripping the parenthetical would merge them.
- **One row dropped, not guessed.** On 2026-07-10 alone CPCB wrote `Aurangabad`
  with no state qualifier, against `Aurangabad (Bihar)` and
  `Aurangabad (Maharashtra)` in every other table. That day's serials run 1..238
  with no gap, so nothing was lost in parsing; the source itself is
  inconsistent. The 3/3 station count matches Maharashtra, which is evidence and
  not proof, and it is one row in 62,851. It is counted in
  `_meta.unresolved_rows_dropped` rather than silently discarded.
- Cities appearing on only a day or two, `Sri Vijaya Puram` (Port Blair,
  renamed in 2024) among them, fall below the 180-day floor and do not produce a
  year.

## Part years

2015 and 2026 are flagged `partial`, with the measured `coverage` published
beside the flag so a reader can apply their own threshold. The rule is a span
covering less than 95% of the calendar, and it is derived, never asserted.

An earlier rule, "the span reaches both ends of the year", called 2025 partial
because CPCB published no bulletin on 1 January, which would have put a warning
on a year holding 79,356 city-days from 246 cities. The threshold exists to
catch 2015 (from 1 May) and the current year, not a missing New Year's Day.
