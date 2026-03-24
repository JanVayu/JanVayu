# Translations

ImpactMojo is committed to making development education accessible in South Asian languages. This guide covers how to contribute translations.

---

## Current Language Support

| Language | Platform | Docs | Directory |
|----------|----------|------|-----------|
| English | Full | Full | `docs-impactmojo/` |
| हिन्दी (Hindi) | Full | Full | `docs-impactmojo-hi/` |
| বাংলা (Bengali) | Full | Full | `docs-impactmojo-bn/` |
| मराठी (Marathi) | Full | Full | `docs-impactmojo-mr/` |
| தமிழ் (Tamil) | Full | Full | `docs-impactmojo-ta/` |
| తెలుగు (Telugu) | Platform only | Planned | — |

---

## GitBook Spaces

Each language has a synced GitBook space:

| Language | Link | Source Directory |
|----------|------|-----------------|
| English | [impactmojo.gitbook.io/impactmojo](https://impactmojo.gitbook.io/impactmojo/) | `docs-impactmojo/` |
| Hindi | [impactmojo.gitbook.io/impactmojo/hi](https://impactmojo.gitbook.io/impactmojo/hi/) | `docs-impactmojo-hi/` |
| Bengali | [impactmojo.gitbook.io/impactmojo/bn](https://impactmojo.gitbook.io/impactmojo/bn/) | `docs-impactmojo-bn/` |
| Marathi | [impactmojo.gitbook.io/impactmojo/mr](https://impactmojo.gitbook.io/impactmojo/mr/) | `docs-impactmojo-mr/` |
| Tamil | [impactmojo.gitbook.io/impactmojo/ta](https://impactmojo.gitbook.io/impactmojo/ta/) | `docs-impactmojo-ta/` |

---

## Translation Principles

1. **Accuracy over literalism** — convey the meaning, not word-for-word translation
2. **Preserve technical terms** — keep terms like MEL, ToC, RCT, DHS, NFHS in English with transliteration in parentheses where helpful
3. **Use plain language** — target the same reading level as the English original
4. **Consistency** — use the same translation for a term throughout all documents
5. **Neutral tone** — maintain the educational, non-partisan voice

---

## Sensitive Terminology

Some terms should be kept in English or handled carefully:

| English Term | Guidance |
|-------------|----------|
| MEL (Monitoring, Evaluation, Learning) | Keep abbreviation in English; provide full form in local language on first use |
| Theory of Change | Keep in English; add transliteration |
| Randomised Controlled Trial (RCT) | Keep abbreviation; translate full form |
| Logframe | Keep in English |
| Progressive Web App (PWA) | Keep in English |
| Row-Level Security (RLS) | Keep in English |
| Supabase, Netlify, GitBook | Keep in English (product names) |

---

## How to Contribute a Translation

### New Language

1. Copy the English directory: `cp -r docs-impactmojo/ docs-impactmojo-{lang}/`
2. Translate each `.md` file, preserving the directory structure
3. Update `SUMMARY.md` with translated section titles
4. Submit a pull request

### Improve Existing Translation

1. Navigate to the file in the relevant `docs-impactmojo-{lang}/` directory
2. Edit the translation
3. Submit a pull request with the `Translate` commit prefix

---

## Directory Structure

Each language directory mirrors the English structure exactly:

```
docs-impactmojo-{lang}/
├── README.md
├── SUMMARY.md
├── for-educators/
│   ├── platform-overview.md
│   ├── getting-started.md
│   ├── workshops-and-facilitation.md
│   ├── handouts-guide.md
│   ├── dataverse-guide.md
│   └── faq.md
├── api/
│   └── README.md
├── technical/
│   ├── architecture.md
│   ├── deployment.md
│   └── environment-variables.md
├── contributing/
│   ├── how-to-contribute.md
│   └── translations.md
├── reference/
│   ├── roadmap.md
│   ├── changelog.md
│   └── glossary.md
└── about/
    ├── background.md
    ├── license.md
    └── contact.md
```

---

## CI Workflow

A GitHub Actions workflow checks on every push to `main`:
- **File coverage** — are all English files present in each translation directory?
- **SUMMARY.md parity** — do all translations have matching table of contents structure?
- **Stale detection** — flags translations that haven't been updated in 30+ days after the English source changed

---

## Contact

For translation contributions, email [hello@impactmojo.in](mailto:hello@impactmojo.in) with the subject line "Translation Contribution: [Language]".
