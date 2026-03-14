# PolicyStack

**South Asia policy tracker — schemes, budgets, and governance data.**

[![Part of OpenStacks](https://img.shields.io/badge/Part%20of-OpenStacks-blue)](https://openstacks.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: Early Stage](https://img.shields.io/badge/Status-Early%20Stage-orange)]()

> Tracking government policies, schemes, and budgets across development sectors in South Asia.

---

## Status

**This repository is just getting started.** The vision is documented below, but implementation has not yet begun. Contributions are welcome.

## Vision

PolicyStack will provide structured, open data on government policies and schemes across South Asia:

- **Scheme tracking** — Central and state government schemes across health, education, gender, and climate
- **Budget analysis** — Allocation vs. expenditure data for key programs
- **Policy mapping** — Which policies address which development challenges
- **Implementation status** — Progress tracking against stated targets

### Potential Data Sources

- Union Budget documents (indiabudget.gov.in)
- State budget portals
- NITI Aayog dashboards
- Ministry annual reports
- RTI responses and parliamentary questions
- Open Government Data Platform (data.gov.in)

### Planned Structure

```
PolicyStack/
├── data/
│   ├── schemes/        # Scheme metadata and coverage
│   ├── budgets/        # Budget allocation data
│   └── indicators/     # Implementation indicators
├── scripts/
│   ├── scrapers/       # Data collection scripts
│   └── analysis/       # Analysis templates
├── docs/
│   └── methodology.md  # Data collection methodology
└── sample_data/        # Example datasets
```

## How to Contribute

This is a great repo to contribute to if you have experience with:
- Indian government policy and budget data
- Web scraping government portals
- Policy analysis and public finance
- Data journalism

See the [OpenStacks hub](https://github.com/Varnasr/OpenStacks-for-Change) for ecosystem-wide contribution guidelines.

## How It Connects

PolicyStack is a domain-specific stack in the [OpenStacks](https://openstacks.dev) ecosystem. It will use tools from [EquityStack](https://github.com/Varnasr/EquityStack) (Python analysis) and [FieldStack](https://github.com/Varnasr/FieldStack) (R analysis) for data processing.

## License

MIT — free to use, modify, and share. See [LICENSE](LICENSE).

---

**Created by [Varna Sri Raman](https://github.com/Varnasr)** — Development Economist & Social Researcher
