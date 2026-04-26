# Translations

JanVayu is committed to accessibility across India's linguistic diversity. The platform currently supports English, Hindi, Tamil, Marathi, and Bengali.

---

## Current Language Support

| Language | Code | Status |
|----------|------|--------|
| English | `en` | Full |
| Hindi (हिन्दी) | `hi` | Full |
| Tamil (தமிழ்) | `ta` | Full |
| Marathi (मराठी) | `mr` | Full |
| Bengali (বাংলা) | `bn` | Full |

---

## How to Contribute a Translation

### Adding a New Language

1. Open an Issue titled: `Translation: Add [Language Name] support`
2. Include:
   - Your name (or handle) and language proficiency
   - Whether you can commit to maintaining translations over time (as content updates)
3. A maintainer will create a branch and provide the source strings to translate

### Improving an Existing Translation

If you notice an inaccurate or awkward translation:

1. Open an Issue with: `Translation: Fix [Language Name] — [specific section/string]`
2. Provide: the current text, the corrected text, and a brief explanation

---

## Translation Principles

- **Accuracy over literalism** — convey the correct meaning in natural language, not word-for-word
- **Preserve technical terms** — terms like PM2.5, AQI, NCAP, GEMM should remain as-is (they are internationally standardised)
- **Use plain language** — the translations should be accessible to the same audience as the English version: educated general public, not specialists
- **Consistency** — use the same translated term for the same concept throughout (e.g., always translate "air quality index" the same way)
- **Neutral tone** — JanVayu is non-partisan; translations must preserve this neutrality

---

## Sensitive Terminology

| English | Notes |
|---------|-------|
| Non-Attainment City | Translate as a city that has "not attained" (failed to meet) national air quality standards |
| Graded Response Action Plan (GRAP) | Use the acronym GRAP; spell out in first use |
| PM2.5 | Keep as PM2.5 across all languages |
| NCAP | Keep as NCAP; spell out National Clean Air Programme on first use |
| CPCB | Keep as CPCB; spell out Central Pollution Control Board on first use |

---

## Live Translated Documentation

Each language lives in a `docs-{lang}/` directory in the repo and is served by a single Docsify shell at `/docs/`, which routes language-specific content via hash routes.

| Language | Live URL | Source Directory |
|----------|----------|------------------|
| English | [/docs/](/docs/) | `docs/` |
| Hindi | [/docs/#/hi/](/docs/#/hi/) | `docs-hi/` |
| Bengali | [/docs/#/bn/](/docs/#/bn/) | `docs-bn/` |
| Marathi | [/docs/#/mr/](/docs/#/mr/) | `docs-mr/` |
| Tamil | [/docs/#/ta/](/docs/#/ta/) | `docs-ta/` |

All spaces sync automatically via GitHub integration when changes are pushed to `main`.

---

## CI: Translation Coverage

A GitHub Actions workflow (`.github/workflows/translations.yml`) runs on every push to `main` that touches docs. It checks:

- **File coverage** — are all English docs mirrored in each language?
- **SUMMARY.md parity** — do all languages have the same page count?
- **Stale detection** — when an English doc changes, which translations weren't updated?

Results appear in the GitHub Actions **Job Summary** tab for each run.

---

## Directory Structure

Each translation directory mirrors the English `docs/` structure exactly:

```
docs-{lang}/
├── README.md
├── SUMMARY.md
├── about/
├── api/
├── claude-code/
├── contributing/
├── data-sources/
├── skills/
├── tech-stack/
├── technical/
└── user-guide/
```

When adding a new English doc, create the corresponding file in all translation directories (even if initially in English — it can be translated later).

---

## Contact

For translation contributions, email [contribute@janvayu.in](mailto:contribute@janvayu.in) with the subject line "Translation Contribution: [Language]".
