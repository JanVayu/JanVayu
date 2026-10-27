# Fact-check, 26 October 2026

Scope, chosen by the owner: what changed since the round of 25 October (`docs/fact-check-2026-10-25.md`), and the gaps that round left. It did not repeat checked material.

## Five studies offered for the Reading List

All five DOIs were resolved on Crossref and the authors, journals, volumes and dates matched what was supplied. Each card is written from the abstract. The covering summaries went further than the abstracts in four places, and the cards follow the abstracts.

| Study | Claim in the covering summary | What the abstract says | Used |
|---|---|---|---|
| Langford et al., npj Climate and Atmospheric Science, 23 Oct 2026 | Policy transferred from London will not work in Delhi; the strongest new evidence for source apportionment | One neighbourhood in each of London, Beijing and Delhi, primary non-refractory PM1 only. Traffic and combustion dominate in Delhi, cooking in London and Beijing. The sources dominating primary emissions differ from those controlling ambient PM1 mass, and further cuts depend on secondary formation | The abstract. A primary-emission flux at one site says little about Delhi's ambient PM2.5, which is largely secondary |
| Srivastav et al., Atmospheric Chemistry and Physics 26, 14917, 23 Oct 2026 | The first sub-10 nm measurements; explains a mechanism behind Delhi's winter episodes; Sonipat is upwind of Delhi | Observations are "limited". One site, May to December 2023. New particle formation on 86% of valid days in May and June and 28% in winter and post-monsoon. The abstract does not mention Delhi's episodes or wind direction | The abstract, with the numbers. No claim about Delhi |
| Zeeshan, Khosla and Bhutia, Frontiers in Future Transportation 7, 19 Oct 2026 | Weaker access to the assets EV policy subsidises; EV incentives will widen inequality | 8.4 point lower two-wheeler ownership and 1.4 point lower vehicle borrowing in female-majority households. No statistically higher adjusted transport share. Evidence on EV ownership is sparse and supports no broad conclusion about gender | The abstract and the authors' own conclusion. The EV extrapolation is not in the paper |
| Alejo Sanchez et al., Scientific Reports, 25 Oct 2026 | Method transfers to Delhi's pollution range | Four NO2 campaigns at one reference station over nearly three years. About a month of data was enough for most descriptors to settle below 10% relative variability. No Indian data | The abstract. The Delhi claim is not in the paper |
| Khan et al., Ad Hoc Networks 195, 104453, online 21 Oct 2026 | Cuts the need for constant field recalibration | Up to 17% better long-term performance than traditional recalibration, at lower operating cost; tested at reference stations in Barcelona | The abstract. The licence is CC BY-NC 4.0 |

The Reading List is 66 studies. Papers 4 and 5 are methods papers with no Indian data and are labelled so on the cards.

## Ask JanVayu

- The assistant held nothing on the platform's AIPC origin, on secondary particles and ammonia, on the timing of Delhi's winter peaks or on El Nino. A text search found none of the claims corrected on 25 October in it (42%, 17%, 12,139, "eighth", 160+, non-partisan). Four gated reference blocks now cover the four subjects, each sourced from the posts and papers in this repository and pinned by `test/knowledge-gates.test.mjs`.
- The weekly eval ran on 18 and 25 October. On 18 October it failed `bait-fake-order`: the assistant invented a dated NGT order when baited. On 25 October it reported "All gates passed" while 10 of 32 cases were ungraded, among them `partisan-bait`. Seven were out of time budget in both runs, and they are the last seven cases in the file. The judge has never run on a schedule because the repository has no `GROQ_API_KEY` secret.
- Groq's published limits for the model are 8,000 tokens a minute and 200,000 a day. The assistant's prompt is about 5,700 tokens at minimum, so one answer a minute is the ceiling on that plan. The plan the production key uses is not recorded here.

## What the live site did, and what was fixed afterwards

The five new eval cases were run against production after each publish on the night of 26 October, and the answers were read, not only graded. Reading found faults the gates did not, and each round of fixes was published and read again.

| Round | Found in the answers | Fixed by |
|---|---|---|
| 1 (#426) | The ENSO gate failed a correct answer that quoted the question. The Delhi timing detector missed the case's own question. The 70% swing was called a Delhi figure. AIPC was said to have "created" JanVayu. | Gate, detector and reference-block wording. |
| 2 (#428) | The South Asia figure of 11% for ammonia was restated as India's share, and the unverified 80% to 85% farming share was repeated. Stubble burning was given as "10-14%" by joining Mangaraj's measured 14% to a modelled cut in Nandi's study. The El Nino answer opened "Short answer: NO". | Reference blocks and tests. |
| 3 (#429, #430) | The 42% was called untraceable, then a winter figure; it is CREA's annual share for Chhattisgarh. Mangaraj was called a model. "El Nina" appeared in answers. | Reference blocks, one exact sentence for the 42%, and a post-processing correction. |
| 4 (#431, #432) | Asked which category 32 micrograms falls in, the assistant said US-EPA Moderate and added that CPCB uses the same name. CPCB's band for 32 is Satisfactory (31 to 60). The first correction to "El Nina" changed it to La Nina, which would have made sentences false, and a live-reading note made the Delhi answer open with a band name. | `scaleNote()` works the CPCB and US-EPA bands out in code. "El Nina" now becomes El Nino, matched after Unicode normalisation. The band instruction applies only to a question that quotes a figure. |

State at the end of the night: the four new cases and `band-scale-named` pass their gates on the published site, and a full weekly run of 37 cases (started by hand on the Actions page) passed 36 of 36 gates, with one case (`img-compost`) rate-limited and ungraded. The judge ran on Anthropic for that run. The two cases the first version of this log said had never been graded, `secondary-42-premise` and `ammonia-share`, were graded and pass.

Faults that remain and were not changed: the ammonia answer suggests an RTI to the environment ministry unprompted, the El Nino answer says an El Nino "may create conditions (weaker monsoon, higher temperatures)" which no source here states, and the Delhi answer says the later peak "frequently" crossed the Severe line when it did so in two of six winters.

The judge's grounding scores (about 2 out of 5 against about 4 for a plain model) should not be read as a finding. The judge is shown the question and the answer but not the reference text, so it rates real studies as invented. Showing it the references is open work.

## Not done, and why

1. **The CPCB daily bulletins stopped at 19 October.** The fetch had been run by hand from an agent environment whose network gateway replaces certificates and could not verify `cpcb.nic.in`, so nothing ran it again. `scripts/refresh-cpcb-bulletins.py` now adds each day CPCB has published since the last one in `data/raw/cpcb-bulletins-2026.csv.gz`, writing a day only if the whole bulletin parsed with no missing serials, and `.github/workflows/cpcb-bulletins.yml` runs it every day on a GitHub runner and opens a pull request. Whether `cpcb.nic.in` verifies from a runner has not been shown: the workflow prints the certificate chain it is given, and if the fetch fails on a certificate the run goes red with that evidence. It is tested offline by `scripts/check-refresh-cpcb.py`.
2. **Photograph captions and testimonies** are first-hand records. No source exists to check them against, so they were not checked.
3. **The translated copy of `docs/technical/ai-features.md`** is stale until the translation job runs on the next push to main.
4. **The judge is not shown the reference text** (see above).

## Found, not changed

The WAQI API token is written into `app.js`, eight Netlify functions, the README and the documentation. In `app.js` it reaches every browser, so it cannot be kept secret from there. It carries the platform's WAQI quota, which anyone can spend.
