# RootStack

**Foundational data schemas for the OpenStacks ecosystem.**

[![Part of OpenStacks](https://img.shields.io/badge/Part%20of-OpenStacks-blue)](https://openstacks.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: Early Stage](https://img.shields.io/badge/Status-Early%20Stage-orange)]()

> The database layer for OpenStacks — schemas, seed data, and queries.

---

## Status

**This repository is in early development.** The architecture and goals are documented below, but the actual SQL schemas, seed data, and queries have not yet been implemented. Contributions are welcome to help build this out.

## Vision

RootStack will provide the foundational data layer for the OpenStacks ecosystem:

- **Structured schemas** (PostgreSQL/SQLite) for development sector data
- **Seed datasets** for testing and demonstration
- **Example queries** for common analysis patterns
- **Migration scripts** for schema evolution

### Planned Architecture

```
RootStack (Database) → BridgeStack (API) → ViewStack (Frontend)
```

RootStack feeds data to [BridgeStack](https://github.com/Varnasr/BridgeStack) via SQL, which exposes it through a REST API to [ViewStack](https://github.com/Varnasr/ViewStack).

### Planned Structure

```
RootStack/
├── schemas/
│   ├── tables.sql          # Core table definitions
│   └── migrations/         # Schema version changes
├── seed_data/
│   └── seed_initial.sql    # Test/demo data
├── queries/
│   └── example_queries.sql # Common query patterns
└── docs/
    └── data_dictionary.md  # Field descriptions and relationships
```

## How to Contribute

This is a great repo to contribute to if you have experience with:
- PostgreSQL or SQLite schema design
- Development sector data structures (surveys, indicators, program data)
- Database migration workflows

See the [OpenStacks hub](https://github.com/Varnasr/OpenStacks-for-Change) for ecosystem-wide contribution guidelines.

## How It Connects

| Stack | Role | Link |
|-------|------|------|
| **RootStack** (this repo) | Database schemas & seed data | You are here |
| [BridgeStack](https://github.com/Varnasr/BridgeStack) | API backend (FastAPI) | Consumes RootStack data |
| [ViewStack](https://github.com/Varnasr/ViewStack) | Frontend UI | Displays BridgeStack API data |

## License

MIT — free to use, modify, and share. See [LICENSE](LICENSE).

---

**Created by [Varna Sri Raman](https://github.com/Varnasr)** — Development Economist & Social Researcher
