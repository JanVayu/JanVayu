# JanVayu scripts

Small build / data / translation scripts. None of these are required for the static site to deploy &mdash; Netlify builds JanVayu directly from `index.html` and the contents of `/blog/`, `/docs/`, `/embed/`, `/pm25/`, etc. These scripts are utilities you can run locally or wire into a workflow.

| Script | Runtime | Purpose | Wired in? |
|---|---|---|---|
| [`build-pollutant-pages.mjs`](build-pollutant-pages.mjs) | Node 20+ | Generates the six per-pollutant SEO pages (`/pm25/`, `/pm10/`, `/co/`, `/no2/`, `/so2/`, `/o3/`) from a single template. Embeds JSON-LD with current `dateModified`. | Manual: `node scripts/build-pollutant-pages.mjs` |
| [`translate-docs.py`](translate-docs.py) | Python 3.10+ | Translation helper for `docs/` → `docs-hi/`, `docs-bn/`, `docs-mr/`, `docs-ta/`. Used to keep multilingual docs in parity with the English source. | Run via `.github/workflows/translations.yml` |
| [`agent-reach-fetch.py`](agent-reach-fetch.py) | Python 3.10+ | Pulls air-quality posts from X/Twitter (via the `bird` CLI), YouTube (via `yt-dlp`), and news sources (via Jina Reader). Outputs JSON for the `feed-ingest` Netlify function. Requires the `TWITTER_AUTH_TOKEN`, `TWITTER_CT0`, `FEED_INGEST_KEY`, and `NETLIFY_SITE_URL` secrets. | **Awaiting secrets activation &mdash; see [issue #45](https://github.com/JanVayu/JanVayu/issues/45)**. Designed to be invoked by a scheduled GitHub Action; no workflow currently calls it. |

## Running locally

```bash
# Pollutant pages
node scripts/build-pollutant-pages.mjs

# Translation propagation
python scripts/translate-docs.py

# Social-media fetch (requires bird, yt-dlp, and the env vars listed above)
python scripts/agent-reach-fetch.py | curl -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $FEED_INGEST_KEY" \
    -d @- "$NETLIFY_SITE_URL/.netlify/functions/feed-ingest"
```

## Deprecated / removed

None at present.

---

*Last updated: May 2026.*
