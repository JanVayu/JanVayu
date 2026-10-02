# Health Impact Calculator

The Health Impact Calculator gives an individual a simple estimate of the extra mortality risk from their PM2.5 exposure. Its formula is a simplified log-concentration risk score inspired by the **Global Exposure Mortality Model (GEMM)**; it is not the GEMM function itself, and it does not take a city population.

---

## What is GEMM?

GEMM (Global Exposure Mortality Model) is an exposure-response framework developed from pooled epidemiological data across 41 cohorts from 16 countries. It is an alternative to the Global Burden of Disease risk functions: in its authors' comparison, GEMM predicts 8.9 million deaths in 2015 against 4.0 million with the GBD function. It:

- Covers the full global exposure range using outdoor-air cohorts only, unlike functions that borrow smoking or household-fuel risk
- Accounts for the full range of disease outcomes

**Primary reference:** Burnett et al. (2018), *PNAS* — "Global estimates of mortality associated with long-term exposure to outdoor fine particle matter"

---

## What the Calculator Estimates

Given your age, annual PM2.5 exposure, hours spent outdoors daily and any pre-existing condition, the calculator shows:

| Output | Description |
|--------|-------------|
| **Mortality risk** | The extra mortality risk (shown as a percentage) relative to breathing the WHO guideline level of 5 µg/m³ |
| **Life years lost** | An approximate number of years of life lost for you, from that extra risk and your age |
| **Cigarette equivalence** | Cigarettes per day with an equivalent exposure, using the 22 µg/m³ per cigarette rule of thumb |

It does not break results down by disease (heart disease, stroke, COPD, lung cancer, lower respiratory infections) and does not estimate deaths for a whole population.

---

## How to Use It

1. Enter your age
2. Enter your annual average PM2.5 exposure in µg/m³ (the field starts at 100; reference values for the WHO guideline, Delhi and the India NAAQS are shown beside it)
3. Set the hours you spend outdoors daily and choose any pre-existing condition
4. Press **Calculate my risk**

---

## Interpreting Results

- Results are an **individual relative-risk estimate** ("+x% mortality risk"), not population attributable fractions
- These are **annual estimates** based on chronic long-term exposure, not acute episode effects
- Numbers should be understood as statistical estimates with uncertainty ranges, not precise counts

---

## Key Findings for India

| City | Annual PM2.5 (µg/m³) | WHO Multiple |
|------|---------------------|-------------|
| Delhi | 82.2 | ~16× (IQAir 2025) |
| Kolkata | 51 | ~10× (IQAir 2025) |
| WHO Guideline | 5 | — |

---

## Interactive Demo

> **Upcoming** — An interactive demo will be embedded here showing how to enter your age, PM2.5 exposure and outdoor hours, and interpret the risk estimate.

<!-- Replace this section with an Arcade embed once recorded -->

---

## Sources

- Burnett et al. (2018), *PNAS* — GEMM methodology
- Global Burden of Disease Study 2021 — disease burden estimates
- Lancet Countdown on Health and Climate Change 2025 — India-specific figures
- IHME GBD Results Tool — age-standardised rates
