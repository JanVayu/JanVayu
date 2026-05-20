# Vayu Junction: Connecting the Dots on India's Air-Quality Vocabulary

**Published:** 20 May 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

Twelve days after we shipped the [Learning Games](https://www.janvayu.in/#games) panel with six games, we are adding a seventh: **Vayu Junction**. It is a word-grouping puzzle — sixteen tiles, four hidden groups of four, four strikes allowed. You tap four tiles you think share a hidden connection, hit Submit, and the game either locks them in colour-coded or costs you a strike.

If you have played **BBC's *Only Connect***, the **NYT *Connections*** daily, or the **[*Torchlight*](https://timesofclimatechange.com/torchlight/)** climate puzzle at Times of Climate Change, the mechanic is familiar. What is original is the content: every group is built around India's air-quality vocabulary — the abbreviations, the regulators, the seasonal markers, the policy stages, the cities that keep showing up in IQAir's annual report.

## Why this game now

The dashboard tells you what is happening. The Jeopardy board tells you what to know. Vayu Junction asks a different question: *can you see the relationships?* That is a harder skill, and it is the skill that turns a casually informed citizen into one who can read a CPCB notification, an NCAP scorecard, or a GRAP order and actually understand what is being said.

We watched people play *Connections* and *Torchlight* and noticed the same thing every time: when the puzzle clicks, the player learns a category they did not know they were learning. "Oh — those are all types of carbon." That sticks better than a flash-card. It sticks because the player did the connecting, and the satisfaction of locking in a group is small enough to fit in a metro ride and large enough to be worth coming back for.

## How the puzzles are built

Each puzzle has four groups, each with a difficulty colour: **green** (straightforward), **yellow** (medium), **red** (hard), **purple** (devious misdirects). The misdirects are deliberate. A single tile like `CO` is both a criteria gas *and* the start of `CO2`, `COPD`, or `CO-funded`; a tile like `Diwali` is both a festival and a smog-season trigger; a tile like `RTI` belongs both to "citizen-action acronyms" and to "things that begin with R." The game gives you a near-miss hint ("three of your four belong together — swap one") when you are one tile off, so you get calibrated feedback rather than a flat right/wrong.

Four puzzle sets ship with this release:

### 1. Basics (Easy)

- **Particulate fractions** — PM1 · PM2.5 · PM10 · TSP
- **Criteria gases under NAAQS** — NO₂ · SO₂ · CO · O₃
- **CPCB AQI bands (lower half)** — Good · Satisfactory · Moderate · Poor
- **Indian air-quality regulators** — CPCB · CAQM · MoEFCC · DPCC

If you have read JanVayu for five minutes, you should clear this without a strike.

### 2. Sources, seasons & protection (Medium)

- **PM2.5 combustion sources** — Diesel · Coal · Biomass · Crackers
- **Smog-season months in N India** — November · December · January · Diwali
- **Delhi GRAP stages** — GRAP-I · GRAP-II · GRAP-III · GRAP-IV
- **Mask & filter terms** — N95 · FFP2 · HEPA · CADR

The misdirect here: `Diwali` is a festival, not a month — but it is the peak of the smog season, so it earns its place in that group.

### 3. Names & numbers (Hard)

- **Worst-polluted Indian cities, IQAir 2025** — Loni · Byrnihat · Begusarai · Hajipur
- **NCAP top-performing cities** — Varanasi · Bareilly · Moradabad · Kanpur
- **Air-quality research bodies & reports** — CREA · AQLI · IQAir · Lancet
- **Citizen accountability tools** — Petition · RTI · Audit · Survey

You either know these or you do not — there is no inference path. We picked names that JanVayu readers have seen at least once on the dashboard or in the [Zotero library](https://www.zotero.org/groups/6508140/janvayu/library).

### 4. Devious

- **Types of "___ carbon"** — Black · Brown · Blue · Green
- **Indian vehicle emission standards** — BS-II · BS-III · BS-IV · BS-VI
- **Citizen-action acronyms** — PIL · RTI · FIR · NOC
- **PM-precursor gases** — NOₓ · SOₓ · VOC · NH₃

The hardest puzzle. `Brown` could be a colour or a `___-field site`. `RTI` could be the citizen tool *or* something else entirely if you do not read the brief carefully. `BS-V` is missing from the emission-standards group because **India skipped BS-V** in 2017 and jumped straight from BS-IV to BS-VI — a useful piece of trivia smuggled into a game. The game tells you, in its quiet way, that you should know that.

## What the player walks away with

After three or four runs you should be able to name, without hesitation:

- The four CPCB AQI bands below "Very Poor" and "Severe."
- The four GRAP stages and which one bans construction.
- Four cities that are succeeding under NCAP, and four that are failing.
- The four critical PM-precursor gases.
- That BS-V was skipped.

Those are exactly the building blocks the rest of JanVayu — the dashboard, the policy tracker, the accountability briefs — assumes you already have. Vayu Junction front-loads them in a way the dashboard cannot.

## Try it

The new game lives at the right end of the [Learning Games](https://www.janvayu.in/#games) tab bar. Tap "Vayu Junction" and pick a puzzle. Score is not saved or transmitted. There is no leaderboard. If you find the puzzles too easy, hit "Devious." If a category feels miscalibrated, [open an issue](https://github.com/JanVayu/JanVayu/issues) — the puzzle data lives in a single JS array in `index.html` and is editable in two minutes.

We will add new puzzles every few weeks. If you want one tailored to a city or a school curriculum — RWA association, classroom, journalist desk — write to [contribute@janvayu.in](mailto:contribute@janvayu.in) and we will put it in the rotation.

## Credits

The form is BBC's *Only Connect* via the NYT *Connections* daily and the *[Torchlight](https://timesofclimatechange.com/torchlight/)* climate puzzle at Times of Climate Change. The content is JanVayu's own, written from the same primary sources the rest of the site uses: CPCB, CAQM, IQAir 2025, NCAP scorecards, the Lancet Countdown 2025, CREA's monthly snapshots, and Dr. Sarath Guttikunda's work at UrbanEmissions.info. The classroom-tested Jeopardy clue list that ships in the panel's first game remains the original credit-where-credit-is-due piece of teaching that started us building the games at all.

— *Team JanVayu*
