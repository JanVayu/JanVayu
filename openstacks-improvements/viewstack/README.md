# ViewStack

**Frontend UI for OpenStacks data visualisation.**

[![Part of OpenStacks](https://img.shields.io/badge/Part%20of-OpenStacks-blue)](https://openstacks.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: Early Stage](https://img.shields.io/badge/Status-Early%20Stage-orange)]()

> The presentation layer for OpenStacks — interactive dashboards and data exploration.

---

## Status

**This repository is in early development.** The architecture and goals are documented below, but the frontend application has not yet been implemented. Contributions are welcome to help build this out.

## Vision

ViewStack will provide the user-facing layer for exploring OpenStacks data:

- **Interactive dashboards** for development sector indicators
- **Data exploration tools** with filtering and drill-down
- **Chart and map visualisations** for spatial and temporal data
- **Responsive design** for field use on mobile devices

### Planned Architecture

```
RootStack (Database) → BridgeStack (API) → ViewStack (Frontend)
```

ViewStack consumes the [BridgeStack](https://github.com/Varnasr/BridgeStack) REST API to display data stored in [RootStack](https://github.com/Varnasr/RootStack).

### Planned Structure

```
ViewStack/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Page-level views
│   ├── charts/         # Visualisation components
│   └── utils/          # Helper functions
├── public/             # Static assets
├── package.json        # Dependencies
└── vite.config.js      # Build configuration
```

## How to Contribute

This is a great repo to contribute to if you have experience with:
- React, Vue, Svelte, or similar frontend frameworks
- D3.js, Chart.js, or Leaflet for data visualisation
- Responsive design for mobile-first applications
- Accessibility (WCAG) standards

See the [OpenStacks hub](https://github.com/Varnasr/OpenStacks-for-Change) for ecosystem-wide contribution guidelines.

## How It Connects

| Stack | Role | Link |
|-------|------|------|
| [RootStack](https://github.com/Varnasr/RootStack) | Database schemas & seed data | Source of truth |
| [BridgeStack](https://github.com/Varnasr/BridgeStack) | API backend (FastAPI) | Provides data via REST |
| **ViewStack** (this repo) | Frontend UI | You are here |

## License

MIT — free to use, modify, and share. See [LICENSE](LICENSE).

---

**Created by [Varna Sri Raman](https://github.com/Varnasr)** — Development Economist & Social Researcher
