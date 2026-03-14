# BridgeStack

**API backend bridging OpenStacks data layers.**

[![Part of OpenStacks](https://img.shields.io/badge/Part%20of-OpenStacks-blue)](https://openstacks.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: Early Stage](https://img.shields.io/badge/Status-Early%20Stage-orange)]()

> The API layer for OpenStacks — connecting database to frontend.

---

## Status

**This repository is in early development.** The architecture and goals are documented below, but the FastAPI application has not yet been implemented. Contributions are welcome to help build this out.

## Vision

BridgeStack will provide a REST API layer connecting [RootStack](https://github.com/Varnasr/RootStack) (database) to [ViewStack](https://github.com/Varnasr/ViewStack) (frontend):

- **FastAPI application** with auto-generated API documentation
- **Data models** mapped to RootStack schemas
- **RESTful endpoints** for querying development sector data
- **Authentication** for write operations

### Planned Architecture

```
RootStack (Database) → BridgeStack (API) → ViewStack (Frontend)
```

### Planned Structure

```
BridgeStack/
├── app/
│   ├── main.py          # FastAPI application entry point
│   ├── routes/          # API endpoint definitions
│   ├── models/          # SQLAlchemy/Pydantic models
│   ├── schemas/         # Request/response schemas
│   └── core/            # Config, database connection, auth
├── tests/               # API tests
├── requirements.txt     # Python dependencies
└── docker-compose.yml   # Local development setup
```

## How to Contribute

This is a great repo to contribute to if you have experience with:
- FastAPI or similar Python web frameworks
- REST API design
- SQLAlchemy and database integrations
- API testing (pytest, httpx)

See the [OpenStacks hub](https://github.com/Varnasr/OpenStacks-for-Change) for ecosystem-wide contribution guidelines.

## How It Connects

| Stack | Role | Link |
|-------|------|------|
| [RootStack](https://github.com/Varnasr/RootStack) | Database schemas & seed data | Provides data to BridgeStack |
| **BridgeStack** (this repo) | API backend (FastAPI) | You are here |
| [ViewStack](https://github.com/Varnasr/ViewStack) | Frontend UI | Consumes BridgeStack API |

## License

MIT — free to use, modify, and share. See [LICENSE](LICENSE).

---

**Created by [Varna Sri Raman](https://github.com/Varnasr)** — Development Economist & Social Researcher
