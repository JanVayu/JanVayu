# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v25.1.0] - 2026-03-23

### Added
- **Ask JanVayu (AI)**: Natural language Q&A interface powered by Google Gemini 2.5 Flash — ask air quality questions in English or Hindi, grounded in live WAQI data
- **AI Health Advisory**: Personalised health advisories based on age, health conditions, hours outdoors, and live PM2.5 data — colour-coded by risk level (low/moderate/high/severe)
- **Ward-Level Accountability Brief (AI)**: Generates structured briefs for ward councillors, journalists, and resident groups with seasonal baselines, anomaly detection, and actionable recommendations — downloadable as .txt
- **Anomaly Detection Banner**: Automatic PM2.5 spike detection across 5 metros (Delhi, Mumbai, Kolkata, Chennai, Bengaluru) on page load and every 30 minutes, with one-sentence AI explanations
- **Demo Day mode**: `?demo=true` URL parameter pre-populates all AI features with Delhi/Anand Vihar defaults and shows a "DEMO MODE" badge
- 4 new Netlify Functions: `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`
- `.env.example` file with all required environment variables
- `GEMINI_API_KEY` environment variable documented in README

### Changed
- Added `@google/generative-ai` SDK dependency
- Updated navigation: "Ask JanVayu (AI)" under Tools, "Accountability Brief (AI)" under Accountability
- Health Impact panel now includes AI Health Advisory subsection

### Technical Notes
- All Gemini API calls route through Netlify Functions (never client-side)
- Free tier: 250 requests/day, 10/minute — rate limit fallback always shows raw PM2.5 data
- Seasonal baselines from CREA/IQAir data for anomaly detection (1.5x threshold for briefs, 2x for banner)

## [v25.0.0] - 2026-03-14

### Added
- Server-side auto-updating via Netlify Scheduled Functions for AQI data
- Netlify Functions backend for serverless API endpoints
- Email subscription system for air quality alerts
- City-specific AQI dashboard pages with detailed breakdowns
- Pollutant-level health advisory cards
- Historical AQI trend charts with daily/weekly/monthly views
- Multi-city comparison tool
- Air quality forecast predictions display
- Downloadable AQI reports (PDF export)
- Regional heatmap visualization for AQI across India
- Automated daily data archival pipeline
- Subscriber notification system for hazardous AQI events
- Dark mode support across all pages
- Multilingual support for Hindi and English

### Changed
- Migrated data fetching from client-side polling to server-side scheduled updates
- Improved dashboard load performance with pre-fetched data
- Updated research library with latest 2026 publications

### Fixed
- AQI gauge rendering on mobile viewports
- Intermittent data fetch failures during high-traffic periods
- Timezone handling for IST-based data timestamps

## [v24.0.0] - 2026-01-15

### Added
- Initial public release of JanVayu dashboard
- Real-time AQI monitoring for major Indian cities via WAQI API
- Interactive AQI dashboard with city selector
- Research library with curated air quality studies and reports
- Health impact documentation and advisories
- Accountability tracker for policy commitments
- Citizen testimony archive (anonymized submissions)
- Mobile-responsive design
- CPCB and WHO standard AQI scale reference
- Source attribution and data provenance tracking

### Changed
- N/A (initial release)

### Fixed
- N/A (initial release)

[v25.1.0]: https://github.com/Varnasr/JanVayu/compare/v25.0.0...v25.1.0
[v25.0.0]: https://github.com/Varnasr/JanVayu/releases/tag/v25.0.0
[v24.0.0]: https://github.com/Varnasr/JanVayu/releases/tag/v24.0.0
