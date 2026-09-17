# Raw CPCB bulletin tables

This folder holds a table parsed straight from CPCB's own published PDFs by
`scripts/fetch-cpcb-bulletin.py`, kept because the fetch is slow (about five
hours for a year) and the parse is the expensive part, not the storage.

## `cpcb-bulletins-2026.csv.gz`

62,851 rows, 260 days, 2026-01-01 to 2026-09-17, 588 distinct
city strings, 0 rows skipped by the parser and 0 gaps in CPCB's own serial
numbering. Those last two counts are the check: CPCB numbers its rows 1..N
without gaps, so a parse that drops rows shows as a gap in the sequence rather
than as silence.

They were not always zero. The first run of this backfill lost one city on the
21st of every month, because each page header carries the day of the month as a
bare number and page two begins near serial 21. The parser was fixed in
v26.6.201, those eight days were re-fetched, and the fetch now exits non-zero
on a lossy parse instead of writing the gap into a file nobody reads.

These are Government of India publications and the figures are facts, parsed by
us. The GPL note in `_meta.source` of `data/aqi-bulletins.json` covers the
UrbanEmissions extraction that file is built from, and does not apply here.

## Why this is not in `data/aqi-bulletins.json` yet

The shipped file ends in 2025 and covers 289 cities. Merging 2026 into it is a
name-matching problem rather than a data problem, and it has a silent failure
mode: a city split across two spellings shows a plausible count under each, and
nothing errors.

Folding case and whitespace collapses 588 raw strings to 304, of which
270 match a shipped city exactly. The remaining 34 need a decision each:

- **Genuinely new to the national network**, most of the list. Vadodara
  (228 days), Rajkot (224 days), Bhavnagar (213 days), Mehsana (212 days),
  Eluru, Guntur, Machilipatnam, Perundurai and Pampore appear in 2026 and in no
  earlier year. Plausible, and worth confirming against CPCB's own city list
  rather than assumed.
- **A spelling of a city already present.** `yamuna nagar` (238 days) is the
  shipped `Yamunanagar`. Merge it.
- **A rename.** `sri vijaya puram` is Port Blair, renamed in 2024. Port Blair is
  in no year of the shipped file either.
- **Two that must not be guessed.** `byrnihat (assam)` (149 days) and
  `byrnihat (meghalaya)` (104 days) are two different places sharing a name. And on
  2026-07-10 alone, CPCB wrote `Aurangabad` with no state qualifier, against
  `Aurangabad (Maharashtra)` and `Aurangabad (Bihar)` in every other table. That
  day's serials run 1..238 with no gap, so nothing was dropped and the source
  itself is inconsistent. The 3/3 station count matches Maharashtra, which is
  evidence and not proof, and it is one day in 260.

## The other thing to settle first

2026 is a partial year, 260 days against 364 for 2025. The panel prints days in
each category as counts, with "out of N reported" beside them, so the
denominator is on screen. It is still the same shape as the error corrected in
v26.6.200, where 136 of 235 days and 157 of 366 were set against each other as
if they were the same measurement. A partial year needs marking as one in the
data, not only in the layout.
