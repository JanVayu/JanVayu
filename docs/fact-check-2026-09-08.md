# Fact-check — 8 September 2026

**Method:** each canonical figure in `scripts/stats.json` and the claims built on
them, checked against the primary source rather than against another page of this
site. Restarted after a six-week lapse: the previous round was 27 July 2026, and
the site was still telling visitors its numbers were re-verified *weekly*
(fixed separately in v26.6.177).

**Scope:** the 12 canonical statistics, the NCAP progress figures, and the report
vintages the site cites. Not a sweep of every page.

---

## The one that matters: a half-applied correction left a figure no source supports

The site said, in **ten** places, that 23 (or 27) of **96** NCAP cities with
sufficient data met the 40% PM10 reduction target, and attributed it to CREA.

CREA never said that. From *Tracing the Hazy Air 2026* directly:

> "Out of 102 cities that do have monitoring stations, 100 cities reported 80% or
> more PM10 data coverage."
> "23 cities achieved the revised NCAP target of 40% reduction in PM10."

So the figure is **23 of 100**, out of 102 with monitors, out of 130 cities in
CREA's analysis.

**Where "96" came from.** A different analysis — CSE's NCAP Five-Year Review —
reported **27 of 96**. The July 2026 round found the site carrying that and
corrected the numerator, 27 → 23, in four places. It left the denominator. The
result was a hybrid, 23 of 96, matching neither source, and it has been live
since. Three further places were never touched at all and still said **27 of 96
"(CREA)"**, attributing to CREA a number CREA did not publish.

That is the worst kind of error this site can make, because sourcing is the whole
proposition. All nine corrected to CREA's own figures:

| File | Was | Now |
|---|---|---|
| `index.html` (JSON-LD schema) | 23 of 96 | 23 of the 100 with adequate PM10 data |
| `index.html` (deadline alert) | 23 of 96 | 23 of the 100 |
| `index.html` (accountability table) | 23 of 96 | 23 of the 100 |
| `index.html` (suggested RTI question) | 23 of 96 | 23 of the 100 |
| `index.html` (hero bulletin) | 23 of 96 | 23 of the 100 |
| `panels/faq.html` | 27 of 96 **(CREA)** | 23 of the 100 (CREA, *Tracing the Hazy Air 2026*) |
| `panels/progress.html` | 27 of 96 | 23 of the 100 |
| `walkthrough/deck.html` (slide) | 27 of 96 | 23 of the 100 |
| `walkthrough/deck.html` (speaker note, "cite the CREA figure") | 27 of 96 | 23 of the 100 |
| `netlify/functions/air-query.mjs` (the assistant) | 23 of 96 | 23 of the 100, with the 102/130 chain |
| `games.js` (quiz clue) | 23 of 96 | 23 of the 100 |

**The hero instance is mine.** I rewrote that bulletin on 8 September and carried
"23 of 96" forward unexamined, on the reasoning that the dated facts in it age
fine. They do. That one was wrong before I touched it and I propagated it.

`scripts/check-retracted-claims.py` now refuses any `2x of 96`, so a third round
cannot reintroduce either shape.

**The tenth instance was found by that guard, not by me.** My own greps covered
the HTML, the docs and the assistant; `games.js` carries a quiz clue with the
same sentence in it, and I did not think to look there. This is the third time
in two days that a correction reached every page and missed something quieter.

---

## Checked and unchanged

| Figure | Site | Primary source | Verdict |
|---|---|---|---|
| Annual PM2.5 deaths | 1.72 million | Lancet Countdown 2025 India data sheet: "over 1,718,000 deaths attributable to anthropogenic PM2.5 in India in 2022" | correct |
| Economic cost | $339.4 billion, 9.5% of GDP | same data sheet: "US$ 339.4 billion, the equivalent of 9.5% of gross domestic product" | correct |
| Report vintage (Lancet) | Lancet Countdown **2025** | The 2026 *Europe* report is out; the global report publishes in October. 2025 is still current for India. | current |
| Report vintage (AQLI) | AQLI **2025** | No 2026 edition found at epic.uchicago.edu | current |
| Delhi-NCR life expectancy | up to 8.2 years | AQLI 2025 | correct |
| NCAP non-attainment cities | 131 | CPCB's own published list is *List of 131 Non-Attainment cities*; PIB uses 131 | correct — see note |
| WHO guideline / India NAAQS | 5 / 40 µg/m³ | unchanged | correct |

**Note on 130 vs 131.** CREA's 2026 report analyses **130** cities; CPCB's
published list is **131**. Both are right for their own source. The site cites
CPCB for the city count and CREA for the progress figures, which is consistent.
Recorded here so a later round does not "correct" 131 to 130.

---

## Not verified this round

- **CPCB station count (~565)** — sourced to CREA via the 2026 report; not
  re-derived against a CPCB list. Carried forward.
- **IQAir 2025 figures** (India 6th at 48.9, Delhi 82.2, Loni 112.5) — corrected
  in the 20 July round and re-propagated in v26.6.176; the 2026 edition is not
  due until March 2027. Not independently re-fetched here.
- **Everything outside `stats.json` and the NCAP claims.** This was a targeted
  round, not the full ~80-statistic sweep the earlier ones ran.

---

## What this round says about the process

Two of the three findings were **not new errors**. They were old errors that
survived a correction: the numerator was fixed and the denominator was not, and
three files were missed entirely. The site's continuous checks could not catch
either, because `check-site-figures.py` only polices figures it can recompute
from data in the repo, and no file here holds CREA's denominator.

That is the gap a periodic audit exists to fill, and it is why the six-week lapse
mattered.
