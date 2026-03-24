# Translation Guide

JanVayu supports 5 languages: English, Hindi, Tamil, Marathi, and Bengali.

---

## How Translation Works

### UI Text (data-i18n)

```html
<span data-i18n="tagline">Citizen Air Quality Platform</span>
```

Translations are stored in a JavaScript object and applied via `setLanguage()`.

### Documentation

Translated docs live in language-specific directories:
- `docs/` — English (base)
- `docs-hi/` — Hindi
- `docs-ta/` — Tamil
- `docs-mr/` — Marathi
- `docs-bn/` — Bengali

### Simple Language (data-simple)

Currently English-only. Future: `data-simple-hi`, `data-simple-ta`, etc.

---

## Contributing Translations

### Option 1: Translate UI Strings

1. Find elements with `data-i18n` in `index.html`
2. Add the translated string to the language object
3. Test by switching languages in the header

### Option 2: Translate Documentation

1. Pick a file from `docs/` missing in your language directory
2. Create the equivalent file in `docs-{lang}/`
3. Translate while keeping the same structure
4. Submit a PR

### Option 3: Translate Simple Language Text

1. Find elements with `data-simple` attributes
2. Translate to your language

---

## Translation CI

The `translations.yml` GitHub Action checks:
- Which files exist in each language directory
- Coverage percentage per language
- Missing files reported in CI output

---

## Guidelines

- Keep translations natural — don't translate literally
- Air quality terms (PM2.5, AQI, NCAP) can stay in English
- Use the script's own numerals where appropriate
- Test on mobile — some scripts need more horizontal space
- Match the tone: urgent but not alarmist, technical but accessible
