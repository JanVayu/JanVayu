# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v25.4.0] - 2026-04-12

### Added — Blog & Research Updates

- **Ask JanVayu PWA**: Standalone installable AI chat app at `/ask/` — chat-style interface, city chip selector, typing indicators, offline fallback, service worker caching. Installable on Android/iOS/desktop home screens via browser "Install" prompt.
- **Blog**: New Docsify-powered blog at `/blog/` for data analysis, platform updates, and reflections on India's air quality crisis
  - Inaugural post: "IQAir 2025: India's Air Got Worse" — analysis of the 8th annual World Air Quality Report
  - Markdown-based posts, same Docsify theme as docs, dark mode support
  - Netlify redirects configured for `/blog/` routes
- **Zotero Research Library**: Public bibliography at [zotero.org/groups/janvayu](https://www.zotero.org/groups/6508140/janvayu/library) — linked from README, data sources docs, and health data reference

### Changed — Data & Statistics

- **Key Statistics updated to April 2026**: Most polluted city updated from Byrnihat (IQAir 2024) to Loni, India (112.5 ug/m3, IQAir 2025); added global WHO compliance rate (14%), India average PM2.5 (48.9 ug/m3), and life expectancy loss (3.5 years, AQLI 2025)
- **IQAir 2024 references upgraded to IQAir 2025** across data sources documentation
- **New research papers added** to data sources:
  - Lancet Planetary Health — two causal PM2.5 mortality studies for India (difference-in-differences and multi-city causal modelling)
  - Science Advances — PM2.5 inequality study showing unequal air quality improvements across India

### Changed — Mobile & Accessibility

- **Mobile responsiveness**: 44px touch targets, comprehensive phone layout (768px + 375px breakpoints)
- **Role overlay mobile fix**: Logo shrinks to 56px/44px, content starts from top instead of center (no more cut-off)
- **Mobile header decluttered**: Reduced from 9 to 5 buttons; GitHub, Docs, Simple mode hidden (accessible via hamburger)
- **Language button**: Text labels (EN/हि) replaced with globe icon to prevent wrapping
- **Mobile hamburger menu**: Added Blog, Docs, Zotero, Wiki, Discussions links
- **Accessibility**: Skip-to-content link, `:focus-visible` outlines, `prefers-reduced-motion: reduce`
- **Performance**: Chart.js and Leaflet.js load deferred (were render-blocking)
- **Social feeds (#52)**: Re-enabled at 3x/day (was 12x/day), 75% Netlify credit reduction
- **Ask JanVayu in FAB widget**: Ask JanVayu AI integrated into the green floating button as a third tab (Search / Ask JanVayu / Feedback); city selector, Enter-to-submit, live AQI data grounding
- **Role switcher mobile**: Dropdown moved outside header DOM; renders as proper bottom sheet with backdrop overlay, drag handle, and tap-outside-to-close
- **Hero alert**: Updated from March 2026 to April 2026 with IQAir 2025 data
- **Varnasr purge**: All references to old personal account removed (60+ files)
- **Wiki**: 7 pages pushed to GitHub Wiki
- **Discussions**: 6 seed discussions created; issue #35 closed
- **Blog, Docs, Research Library** links added to site header, footer, and mobile nav
- **v25.4 changelog** added to About & Changelog panel on the website

### Fixed

- Updated CITATION.cff date-released to 2026-04-12
- Synced package.json version to 25.4.0
- Updated sitemap.xml lastmod date and added `/blog/` URL
- Docs link fixed: gitbook.io → local `/docs/`

## [v25.3.0] - 2026-03-24

### Added — Role-Based Landing Page & UX Improvements

- **Role-based landing page**: Personalized entry point with 10 audience roles — parent, student, researcher, policymaker, journalist, activist, doctor, teacher, NGO, and business owner
- **Simple language mode**: Site-wide plain language toggle in the header that switches all content to simple language, with sessionStorage persistence across page navigation
- **Glossary overlay**: Searchable glossary of air quality terms accessible via **Ctrl+K** keyboard shortcut
- **Intro tour**: Guided walkthrough for first-time visitors highlighting key sections and features
- **Role switcher in header navigation**: Allows users to change their selected role at any time from the header
- **Tooltips on all navigation icons**: Descriptive tooltips on hover for all nav icons

### Changed

- All navigation icons now have proper `aria-label` attributes for improved screen reader accessibility

## [v25.2.0] - 2026-03-24

### Added — Documentation & Translations

- **GitBook Documentation**: Complete documentation site with user guides, tech stack reference, contributing guidelines, data source documentation, and AI skills reference
- **Multilingual GitBook Translations**: Full documentation translated into Hindi (`docs-hi/`), Tamil (`docs-ta/`), Marathi (`docs-mr/`), and Bengali (`docs-bn/`)
- **OpenAPI Specification**: API reference docs for all Netlify Function endpoints
- **Interactive Demo Placeholders**: Embedded demo sections in user guide pages (AQI dashboard, health calculator, city comparison, citizen action, policy tracker)
- **Translation CI Workflow**: Automated GitHub Actions workflow for translation coverage tracking and staleness detection
- **Contributing Guide for Translations**: Dedicated documentation for translation contributors
- **Dev Tooling Documentation**: Tech stack and developer tooling reference pages

### Changed

- Improved Bengali translation quality across all documentation sections
- Updated docs README with translation status and GitBook integration details
- Reorganized Claude Code sharing documentation

## [v25.1.0] - 2026-03-23

### Added — AI-Powered Features (Google Gemini 2.5 Flash)

- **Ask JanVayu (AI)**: Natural language Q&A interface grounded in live WAQI data
  - Supports questions in English and Hindi; responds in the user's language
  - Covers 40+ Indian cities with real-time AQI data
  - Concise, data-grounded responses (under 150 words)
  - Endpoint: `POST /.netlify/functions/air-query`

- **AI Health Advisory**: Personalised health guidance based on user profile and live PM2.5 levels
  - Considers age, pre-existing health conditions, and daily hours spent outdoors
  - Colour-coded risk levels: low / moderate / high / severe
  - Evaluates against WHO guideline (5 µg/m³) and user-specific risk factors
  - Provides concrete, actionable recommendations (e.g., "stay indoors until 2 pm")
  - Endpoint: `POST /.netlify/functions/health-advisory`

- **Ward-Level Accountability Brief (AI)**: Structured briefs for local governance and civic action
  - Target audiences: ward councillors, journalists, and resident welfare associations
  - Includes seasonal baselines from CREA/IQAir data with anomaly detection (1.5× threshold)
  - References GRAP stages, RTI powers, and MCD complaint lines for actionable next steps
  - Downloadable as `.txt` files for offline sharing
  - Endpoint: `POST /.netlify/functions/accountability-brief`

- **Anomaly Detection Banner**: Automatic PM2.5 spike monitoring across 5 major metros
  - Monitors Delhi, Mumbai, Kolkata, Chennai, and Bengaluru
  - Runs on page load and refreshes every 30 minutes
  - Triggers at 2× seasonal baseline with one-sentence, month-aware AI explanations (e.g., stubble burning context in Oct–Mar)
  - Dismissible, expandable banner UI for multiple simultaneous alerts
  - 10-minute response caching for performance
  - Endpoint: `GET /.netlify/functions/anomaly-check`

### Added — Infrastructure

- **Demo Day mode**: `?demo=true` URL parameter pre-populates all AI features with Delhi/Anand Vihar defaults and shows a "DEMO MODE" badge
- 4 new Netlify Functions: `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`
- `.env.example` file with all required environment variables including `GEMINI_API_KEY`

### Changed
- Added `@google/generative-ai` SDK dependency (`^0.24.1`)
- Updated navigation: "Ask JanVayu (AI)" under Tools, "Accountability Brief (AI)" under Accountability
- Health Impact panel now includes AI Health Advisory subsection

### Technical Notes
- All Gemini API calls route through Netlify Functions — API keys are never exposed client-side
- Free tier rate limits: 250 requests/day, 10 requests/minute — fallback always returns raw PM2.5 data so users are never left without information
- Seasonal baselines sourced from CREA/IQAir data (1.5× threshold triggers accountability briefs, 2× triggers anomaly banner)
- Maximum output tokens capped at 400 for accountability briefs to keep responses focused

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

[v25.3.0]: https://github.com/JanVayu/JanVayu/compare/v25.2.0...v25.3.0
[v25.2.0]: https://github.com/JanVayu/JanVayu/compare/v25.1.0...v25.2.0
[v25.1.0]: https://github.com/JanVayu/JanVayu/compare/v25.0.0...v25.1.0
[v25.0.0]: https://github.com/JanVayu/JanVayu/releases/tag/v25.0.0
[v24.0.0]: https://github.com/JanVayu/JanVayu/releases/tag/v24.0.0
