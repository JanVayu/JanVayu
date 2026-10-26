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

## Not done, and why

1. **The CPCB bulletins stop at 19 October.** `cpcb.gov.in` fails certificate verification from the agent environment even with the environment's CA bundle, so the fetch could not run. It needs GitHub's runner or a person.
2. **The new eval cases have not run against production.** The new knowledge is not deployed yet, and a live run spends the visitors' token budget. Run `node test/ask-eval/run-eval.mjs --only about-affiliation,secondary-42-premise,ammonia-share,enso-forecast,delhi-winter-timing` after the next publish.
3. **Photograph captions and testimonies** are first-hand records. No source exists to check them against, so they were not checked.
4. **The translated copy of `docs/technical/ai-features.md`** is stale until the translation job runs on the next push to main.

## Found, not changed

The WAQI API token is written into `app.js`, eight Netlify functions, the README and the documentation. In `app.js` it reaches every browser, so it cannot be kept secret from there. It carries the platform's WAQI quota, which anyone can spend.
