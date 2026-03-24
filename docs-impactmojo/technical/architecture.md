# Architecture

ImpactMojo uses a static HTML/CSS/JS site with no build step, backed by Supabase for authentication and Netlify for hosting. The architecture is deliberately lightweight to support users on slow connections and older devices.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  Static HTML/CSS/JS — no build step, no framework            │
│  auth.js · router.js · premium.js · resource-launch.js       │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────┐   ┌───────────────────────────────┐
│    Netlify (Hosting)     │   │     Supabase (Backend)        │
│  Static site deployment  │   │  Auth · Profiles · Progress   │
│  Edge Functions          │   │  Bookmarks · Certificates     │
│  mint-resource-token     │   │  Organizations · Cohorts      │
└─────────────────────────┘   │  Notifications · Payments      │
                              │  21+ PostgreSQL tables          │
                              │  Row-Level Security             │
                              └───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Premium Tool Sites (Separate Deploys)            │
│  VaniScribe · Qual Lab · RQ Builder · Code Converter         │
│  DevData · Viz Cookbook · DevEcon Toolkit                     │
│  Each site: own Netlify deploy + auth-gate Edge Function     │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### Main Site (impactmojo.in)

- **Hosting:** Netlify (static deployment)
- **Frontend:** Vanilla HTML/CSS/JS — no React, no Vue, no build tools
- **Key scripts:** `auth.js`, `router.js`, `premium.js`, `resource-launch.js`
- **No server-side environment variables** needed on the main site

### Authentication & Token Service

- **Provider:** Supabase Auth (email + password)
- **Token generation:** `mint-resource-token` Netlify Edge Function
- **Token type:** JWT (HMAC-SHA256 signed)
- **Token lifetime:** 5 minutes
- **Claims:** user ID, resource name, subscription tier

### Database (Supabase PostgreSQL)

21+ tables including:

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts with subscription tier and status |
| `organizations` | Team accounts with admin and seat limits |
| `course_progress` | Module completion tracking |
| `bookmarks` | Saved resources per user |
| `certificates` | Verifiable completion records |
| `payments` | Payment history and subscription management |
| `cohorts` | Scheduled group learning sessions |
| `notifications` | In-app and email alert queue |
| `user_preferences` | Theme, language, notification settings |

All tables use **Row-Level Security** — users can only view and modify their own records.

### Premium Tool Sites

Each premium tool runs as an independent Netlify deployment:

| Tool | Description |
|------|-------------|
| **RQ Builder Pro** | Research question design workbench |
| **Qual Insights Lab** | AI-assisted qualitative interview analysis |
| **Statistical Code Converter** | Converts between R, Stata, SPSS, and Python |
| **VaniScribe** | AI transcription in 10+ South Asian languages |
| **DevData Practice** | Practice datasets and visualisation recipes |
| **Viz Cookbook** | Data visualisation template library |
| **DevEcon Toolkit** | Interactive development economics analysis apps |

**Why separate deployments?** Isolating each tool allows independent deployment and iteration. One tool going down doesn't affect others or the main site.

### Access Flow (Premium Tools)

```
1. User clicks "Launch Tool" on impactmojo.in
2. Client calls mint-resource-token (POST) with Supabase auth token
3. Edge Function checks subscription tier against resource requirements
4. If authorised: returns JWT token + redirect URL
5. User is redirected to tool site with ?token= parameter
6. Tool's auth-gate Edge Function validates JWT signature
7. If valid: sets 24-hour resource_session cookie
8. User accesses the tool for 24 hours without re-authentication
```

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| No build step | Works on any device; no Node.js needed to contribute |
| Vanilla JS over frameworks | Faster load on slow connections; easier to maintain |
| Separate tool deployments | Fault isolation; independent scaling and iteration |
| Supabase over custom backend | Managed auth, RLS, real-time subscriptions out of the box |
| Short-lived JWTs (5 min) | Minimises window for token misuse; session cookie handles ongoing access |
| Manual UPI payments | Eliminates payment gateway fees for Indian users |

---

## Interactive Demo

> **Upcoming** — An interactive architecture diagram will be embedded here, showing the request flow from browser to Supabase to premium tools.

<!-- Replace this section with an Arcade embed once recorded -->
