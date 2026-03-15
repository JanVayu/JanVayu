# BridgeStack

**API backend bridging OpenStacks data layers.**

[![Part of OpenStacks](https://img.shields.io/badge/Part%20of-OpenStacks-blue)](https://openstacks.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-009688)]()

> The API layer for OpenStacks — connecting database to frontend.

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/Varnasr/BridgeStack.git
cd BridgeStack
pip install -r requirements.txt

# Run the API
uvicorn app.main:app --reload

# Open docs
# http://localhost:8000/docs
```

### With Docker

```bash
docker compose up
```

## Architecture

```
RootStack (SQLite) → BridgeStack (FastAPI) → ViewStack / EquityStack / FieldStack
```

BridgeStack serves as the middleware connecting [RootStack](https://github.com/Varnasr/RootStack) data to all consumer Stacks:

| Stack | Role | Connection |
|-------|------|------------|
| [RootStack](https://github.com/Varnasr/RootStack) | SQLite schemas & seed data | Data source |
| **BridgeStack** (this repo) | REST API (FastAPI) | You are here |
| [ViewStack](https://github.com/Varnasr/ViewStack) | Frontend dashboards | Consumes API |
| [EquityStack](https://github.com/Varnasr/EquityStack) | Python analysis workflows | Consumes API |
| [FieldStack](https://github.com/Varnasr/FieldStack) | R fieldwork tools | Consumes API |
| [InsightStack](https://github.com/Varnasr/InsightStack) | MEL tools | Consumes API |
| [SignalStack](https://github.com/Varnasr/SignalStack) | Curated content | Consumes API |

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Geography

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/geography/states` | List all states (filter: `?region=`) |
| GET | `/geography/states/{id}` | State detail with districts |
| GET | `/geography/districts` | List districts (filter: `?state_id=`, `?tier=`) |
| GET | `/geography/districts/{id}` | District detail |

### Sectors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sectors/` | List all development sectors |
| GET | `/sectors/{id}` | Sector detail |

### Indicators

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/indicators/` | List indicators (filter: `?sector_id=`, `?source=`) |
| GET | `/indicators/{id}` | Indicator detail with values |
| GET | `/indicators/values/` | Query data points (filter: `?indicator_id=`, `?state_id=`, `?year=`) |

### Policies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/policies/schemes` | List schemes (filter: `?sector_id=`, `?status=`, `?level=`) |
| GET | `/policies/schemes/{id}` | Scheme detail with budgets & coverage |
| GET | `/policies/budgets` | Budget data (filter: `?scheme_id=`, `?fiscal_year=`) |
| GET | `/policies/coverage` | Coverage data (filter: `?scheme_id=`, `?state_id=`) |

### Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tools/` | List tools (filter: `?stack=`, `?language=`, `?tool_type=`, `?difficulty=`) |
| GET | `/tools/{id}` | Tool detail |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info and ecosystem map |
| GET | `/health` | Health check |

## Project Structure

```
BridgeStack/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── core/
│   │   ├── config.py        # Settings (env-configurable)
│   │   └── database.py      # SQLite/SQLAlchemy setup
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── geography.py     # States, Districts
│   │   ├── sectors.py       # Development sectors
│   │   ├── indicators.py    # Indicators & values
│   │   ├── policies.py      # Schemes, budgets, coverage
│   │   └── tools.py         # OpenStacks tool catalog
│   ├── schemas/             # Pydantic response schemas
│   │   ├── geography.py
│   │   ├── sectors.py
│   │   ├── indicators.py
│   │   ├── policies.py
│   │   └── tools.py
│   └── routes/              # API route handlers
│       ├── geography.py
│       ├── sectors.py
│       ├── indicators.py
│       ├── policies.py
│       └── tools.py
├── tests/
│   └── test_api.py          # 14 endpoint tests
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Configuration

Environment variables (prefix `BRIDGE_`):

| Variable | Default | Description |
|----------|---------|-------------|
| `BRIDGE_DATABASE_URL` | `sqlite:///./rootstack.db` | Database connection string |
| `BRIDGE_DEBUG` | `false` | Enable debug mode |
| `BRIDGE_CORS_ORIGINS` | `["*"]` | Allowed CORS origins |

## Using with RootStack

To populate the database, clone and run [RootStack](https://github.com/Varnasr/RootStack) setup, then point BridgeStack at the generated SQLite file:

```bash
# In RootStack directory
bash scripts/setup.sh

# Copy the database to BridgeStack
cp rootstack.db ../BridgeStack/

# Start the API
cd ../BridgeStack
uvicorn app.main:app --reload
```

## Running Tests

```bash
pytest tests/ -v
```

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. Areas where contributions are welcome:

- Additional query endpoints and aggregations
- Authentication for write operations
- Pagination and rate limiting
- WebSocket support for real-time data
- PostgreSQL adapter

## License

MIT — free to use, modify, and share. See [LICENSE](LICENSE).

---

**Created by [Varna Sri Raman](https://github.com/Varnasr)** — Development Economist & Social Researcher
