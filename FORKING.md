# Forking JanVayu

JanVayu is designed to be forked and adapted for other cities, regions, or countries. This guide explains how.

## License

- **Code** (HTML, CSS, JavaScript, Netlify functions): [MIT License](LICENSE) — use freely, modify, redistribute.
- **Content** (blog posts, docs, data analysis): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — share and adapt for non-commercial use with attribution and same license.
- **Data**: Individual sources retain their original licenses. See [Data Sources](docs/data-sources/overview.md).

## Attribution requirements

If you fork this project, please:

1. **Credit JanVayu** — Include "Based on [JanVayu](https://github.com/JanVayu/JanVayu)" in your README or About page.
2. **Keep the citation file** — Update `CITATION.cff` with your project's details but retain JanVayu as the upstream source.
3. **Don't claim original authorship** — The architecture, design, and content structure were built by JanVayu contributors.
4. **Do change the branding** — Rename the project, update the logo, change colors. Make it yours.

## What to change when forking

### Required changes

| File | What to change |
|------|---------------|
| `CNAME` | Your custom domain |
| `netlify.toml` | Your Netlify site config, domain redirects |
| `.env.example` | Your API keys (Groq, Resend and the rest). `WAQI_TOKEN` is required too and is not listed in the file yet, so add it |
| `index.html` | Logo, project name, city list, color scheme |
| `favicon.svg` | Your icon |
| `og-image.png` | Your social preview image |
| `CITATION.cff` | Your project metadata |
| `package.json` | Your project name/version |

### City data

The WAQI API works globally. To adapt for your country:

1. **`app.js` and `index.html`**: replace the `CITIES` object in `app.js`, and the city list in the hero dropdown, the AQI comparison grid and the role configs in `index.html`
2. **`netlify/functions/air-query.mjs`**: update the `CITIES` object with your cities' coordinates and `getSeasonalContext()` with your local pollution calendar. The clean air programme data it reads as `NCAP_CITY_DATA` is in `netlify/functions/data/reference-data.json`
3. **`netlify/functions/anomaly-check.mjs`** — Update the monitored cities and seasonal baselines
4. CPCB's daily bulletin is specific to India. The fallback in `js/air-sources.js` reads `data/cpcb-latest.json`, which `.github/workflows/cpcb-bulletins.yml` builds from CPCB's PDFs. Replace it with your country's official daily figure, or remove that step and keep the live station and the model estimate

### Content

- Replace health statistics with your country's data (GBD, Lancet)
- Update policy references (NCAP → your country's equivalent)
- Translate UI text via the `data-i18n` system
- Update blog posts with local analysis

### API keys you'll need

| Service | Purpose | Cost |
|---------|---------|------|
| [WAQI](https://aqicn.org/data-platform/token/) | Real-time AQI | Free |
| [Groq](https://console.groq.com) | AI features (`openai/gpt-oss-120b` by default, set by `GROQ_MODEL`) | Free tier |
| [Resend](https://resend.com) | Email digests | Free tier (100/day) |
| [Netlify](https://netlify.com) | Hosting + Functions | Free tier |

Total cost to run a fork: **$0/month** on free tiers.

## Architecture

JanVayu is deliberately simple to fork:

- **Plain files**: `index.html`, `styles.css`, `app.js`, `games.js` and the fragments in `panels/`, with no framework and no bundler. The only build command stamps the version
- **Netlify Functions** — serverless, no server to maintain
- **No database**: Netlify Blobs for caching, and the browser's own storage for a visitor's role, language and theme
- **CDN-hosted libraries** — Chart.js, Leaflet.js loaded from CDN

See [Architecture docs](docs/technical/architecture.md) for the full system design.

## Examples of good forks

If you create a fork for your city/country, open an issue and we'll list it here. We'd love to see JanVayu's approach adapted for:

- Pakistan (similar pollution profile, WAQI coverage exists)
- Bangladesh (Dhaka consistently among worst cities)
- Nepal (Kathmandu valley inversion problem)
- Nigeria/Ghana (growing monitoring infrastructure)
- Any city or region with WAQI API coverage

## Questions?

- Open a [GitHub Discussion](https://github.com/JanVayu/JanVayu/discussions)
- Email: contribute@janvayu.in
