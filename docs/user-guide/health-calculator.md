# Health Impact Calculator

The Health Impact Calculator uses the **Global Exposure Mortality Model (GEMM)** to estimate the health burden of air pollution for any city or region.

---

## What is GEMM?

GEMM (Global Exposure Mortality Model) is a state-of-the-art exposure-response framework developed from pooled epidemiological data across 41 cohorts. It is considered the most accurate model for estimating PM2.5-attributable mortality because it:

- Captures non-linear health effects at high PM2.5 concentrations (unlike earlier linear models)
- Accounts for the full range of disease outcomes
- Reflects real-world evidence from high-pollution settings including South and East Asia

**Primary reference:** Burnett et al. (2018), *PNAS* — "Global estimates of mortality associated with long-term exposure to outdoor fine particle matter"

---

## What the Calculator Estimates

Given a city's annual PM2.5 level and population, the calculator estimates:

| Output | Description |
|--------|-------------|
| **Attributable Deaths** | Annual deaths where PM2.5 exposure is a contributing cause |
| **Ischemic Heart Disease** | Cardiovascular deaths attributable to PM2.5 |
| **Stroke** | Stroke deaths attributable to PM2.5 |
| **COPD** | Chronic obstructive pulmonary disease deaths |
| **Lung Cancer** | Lung cancer deaths attributable to PM2.5 |
| **Lower Respiratory Infections** | LRI deaths, especially in children under 5 |
| **Life Years Lost** | Total years of life lost across the population |

---

## How to Use It

1. Select a city from the dropdown — the current annual PM2.5 average is pre-filled from WAQI/CPCB data
2. Adjust the population figure if needed
3. Optionally, adjust PM2.5 to a counterfactual (e.g., WHO guideline of 5 µg/m³) to see how many deaths could be prevented
4. The calculator updates in real time

---

## Interpreting Results

- Results are **population attributable fractions** — they represent what share of deaths in a given disease category are linked to PM2.5 exposure above the theoretical minimum risk level
- These are **annual estimates** based on chronic long-term exposure, not acute episode effects
- Numbers should be understood as statistical estimates with uncertainty ranges, not precise counts

---

## Key Findings for India

| City | Annual PM2.5 (µg/m³) | WHO Multiple |
|------|---------------------|-------------|
| Delhi | ~100 | 20× |
| Kolkata | ~65 | 13× |
| Mumbai | ~45 | 9× |
| Chennai | ~30 | 6× |
| Bengaluru | ~25 | 5× |
| WHO Guideline | 5 | — |

---

## Interactive Demo

> **Upcoming** — An interactive demo will be embedded here showing how to select a city, adjust population and PM2.5 values, and interpret the GEMM health burden estimates.

<!-- Replace this section with an Arcade embed once recorded -->

---

## Sources

- Burnett et al. (2018), *PNAS* — GEMM methodology
- Global Burden of Disease Study 2021 — disease burden estimates
- Lancet Countdown on Health and Climate Change 2025 — India-specific figures
- IHME GBD Results Tool — age-standardised rates
