# Global Skills Reference

These are the shared development skills used across both JanVayu and ImpactMojo when building with Claude Code. They are not product-specific — they define *how* Claude Code approaches any development task in this ecosystem.

---

## 1. Coding Practices

### Constraint-First Prompting

The most important thing to specify is what **not** to do. LLMs default to frameworks and complexity. Both JanVayu and ImpactMojo are deliberately zero-framework.

> "Vanilla JavaScript only. No frameworks. No npm imports in the frontend. No build step."

Without this, you get React components, Webpack configs, and TypeScript interfaces for a project that needs none of them.

### The "Civic Data" Pattern

For any feature that displays public interest data:

```
Write a [feature] for a civic data platform. The data comes from [source].
Display it in plain HTML/CSS/JS with no framework. The audience includes
people who may be accessing this on a 2G connection or a low-end Android phone.
Prioritise load speed over visual complexity.
```

**Why it works:** Specifying the audience (low-end device, slow connection) forces appropriate tradeoffs — no lazy-loaded images, no heavy chart libraries for simple data, progressive enhancement.

### The "Serverless Function" Pattern

For every Netlify Function or Edge Function:

```
Write a Netlify Function (ES module, .mjs) that does [task].
Requirements:
- Handle CORS preflight (OPTIONS)
- Return JSON with appropriate HTTP status codes
- Use try/catch on every external call
- Never hardcode secrets — use process.env
- Include a graceful fallback if the external API fails
- Log errors with console.log, not throw
```

### The "API Proxy" Pattern

For functions that proxy external feeds or APIs:

```
Write a Netlify Function that:
1. First checks a cache for a fresh copy (< 4 hours old)
2. If cache is warm, return immediately from cache
3. If cache is stale or empty, fetch from [source], write to cache, then return
4. If the live fetch fails, return whatever is in the cache (even if stale)
5. Always return something — never a 500 with no body
```

**Key principle:** Stale data is better than no data.

### The "Accessibility Audit" Pattern

After writing any HTML section:

```
Review this HTML for accessibility issues. Check:
- All interactive elements are keyboard-navigable
- All images have meaningful alt text (not "image" or filename)
- Colour contrast meets WCAG AA (4.5:1 for text)
- Form inputs have associated labels
- ARIA roles are used only where semantic HTML is insufficient
List specific fixes, not generic advice.
```

"List specific fixes, not generic advice" is the key constraint.

### The "Refactor for Readability" Pattern

When code has grown complex:

```
Refactor this JavaScript function for readability. Requirements:
- No change in behaviour
- Extract magic numbers into named constants with comments explaining their source
- Replace comment blocks with self-documenting variable names where possible
- Add a JSDoc comment explaining what the function does, its inputs, and its return value
- Do not introduce new dependencies or language features beyond ES2020
```

"No change in behaviour" prevents the AI from rewriting logic and introducing bugs.

### The Debugging Pattern

When a function is misbehaving:

```
This function is returning [error/wrong output].
Here is the function: [code]
Here is the request that causes the issue: [curl or fetch call]
Here is the actual response: [response]
Here is the expected response: [expected]

Do not rewrite the function. Identify the specific line causing the issue
and explain why. Then propose the minimum change to fix it.
```

"Do not rewrite the function" and "minimum change" prevent full rewrites that introduce new bugs.

### What to Avoid Asking an AI to Do

| Ask | Why to avoid |
|-----|-------------|
| "Add TypeScript" | Requires a build step; breaks the zero-framework principle |
| "Improve performance" without constraints | Often results in lazy loading, code splitting, or caching strategies that add complexity |
| "Make this more modern" | Will introduce framework dependencies |
| "Add tests" without specifying the test framework | Will add Jest, Vitest, or similar — all require npm and a build step |
| "Optimise the CSS" | Often removes purposeful CSS variables or consolidates styles that break theming |

---

## 2. Visual Design

### Design Brief

This brief is passed to every AI interaction involving visual design:

```
[Project] is a [civic/educational] platform for [audience].
Its visual language should feel:
- Serious and data-driven (not alarmist, not cheerful)
- Accessible to users on low-end devices and small screens
- Respectful of the communities it serves
- Visually distinct from government portals (bureaucratic)
  and tech products (commercial)

Typography: system fonts only (no Google Fonts CDN calls) for performance.
Density: information-dense but not cluttered. Tables over prose for data.
Mobile-first: the majority of Indian internet users access on mobile.
```

### The "Data Table" Pattern

For any tabular data:

```
Create an HTML table for [dataset]. Requirements:
- Mobile-first: on small screens, show only the 2-3 most important columns;
  hide secondary columns with a CSS class that can be toggled
- Sticky header on scroll
- Alternating row colours using CSS variables (not hardcoded hex)
- Sort indicator on column headers (visual only — no JS sort required)
- A "source" column where each cell is a linked citation
- No external CSS frameworks
```

### The "Section Header" Pattern

For consistent section headers across pages:

```
Design a section header for a [civic/educational] platform. It should include:
- Section number (small, muted)
- Section title (large, bold)
- A one-sentence description in a muted colour
- An optional "last updated" timestamp aligned right
- A subtle border-bottom separator

Use only CSS — no images, icons, or JavaScript. The header should work
at 320px wide (minimum mobile) without text overflow.
```

### The "Colour for Urgency" Pattern

For callout boxes and alert banners:

```
Design a callout box that communicates [low/moderate/high/severe] urgency
without using red for anything below "severe". Use colour, border weight,
and typography weight — not icons or emojis — to convey severity level.
The box must be distinguishable in greyscale (for colour-blind users).
```

### The "Chart Accessibility" Pattern

For any data visualisations:

```
Configure this chart for accessibility:
- All data points have aria-label attributes
- The chart has a visible title and a text summary of the key finding
  below it (for screen readers and users who cannot interpret charts)
- Colours are from a colour-blind-safe palette
- Grid lines are subtle (not the default grey which overwhelms data lines)
- Tooltips are readable on both light and dark backgrounds
```

### CSS Architecture

Use CSS custom properties at `:root` level. Every design prompt should use variable names rather than hardcode values:

```css
:root {
  --color-primary: #...;
  --color-surface: #...;
  --color-text: #...;
}
```

This makes it possible to audit and update the entire colour scheme by changing a handful of lines.

---

## 3. Automation

### Core Principle: Fail Visibly, Degrade Gracefully

Every automated system is designed with two properties:
1. **Fail visibly** — when something breaks, it logs clearly and returns a meaningful response, not a silent 500
2. **Degrade gracefully** — the UI still renders with stale or partial data rather than going blank

### The "Cache Warmer" Pattern

For functions that pre-fetch data on a schedule:

```
Write a Scheduled Function that fetches [list of feeds] and stores
results in cache. Requirements:
- Fetch all feeds in parallel (Promise.allSettled — not Promise.all,
  so one failure doesn't cancel the others)
- Write a "last-fetch-time" key after each run (ISO timestamp)
- Write a "last-fetch-log" key summarising which feeds succeeded/failed
  and how many items were retrieved
- If a feed fetch fails, write the previous cached value back with an
  error flag rather than writing nothing
```

**Why `Promise.allSettled` not `Promise.all`?** `Promise.all` cancels all pending promises when any one rejects. One timeout should not prevent other feeds from being cached.

### The "Daily Digest" Pattern

For functions that send communications on a schedule:

```
Write a Scheduled Function that:
1. Reads a list of subscribers
2. For each subscriber, fetches relevant data
3. If data meets the subscriber's threshold, send notification
4. Log: total subscribers, sent, skipped, failed
5. Write the log after the run completes
6. Never let a single subscriber failure abort the loop
```

"Never let a single subscriber failure abort the loop" is the most important constraint.

### Monitoring Pattern

```
Write a function that reads cache status keys and returns them as JSON.
This endpoint is called by the client to show "Data last updated: X"
with a warning if the last fetch was too long ago.
```

Observable automation is much easier to debug than silent automation.

### Cron Timing

All scheduled functions use UTC cron expressions with explicit IST offset:

```
IST = UTC + 5:30
8:00 AM IST = 2:30 AM UTC → cron: "30 2 * * *"
```

Always verify UTC conversions before deploying. India does not observe DST, but collaborators in other timezones can introduce off-by-one-hour errors.

---

## 4. General Prompting Principles

These principles guide all skill files and development prompts:

1. **Ground in real data** — every prompt receives actual live numbers, never generates from memory alone
2. **Specify the output format exactly** — tell the model the exact structure to produce
3. **Constrain length** — all prompts include explicit word or token limits
4. **Name the failure mode** — tell the model what not to do (e.g., "do not give generic advice")
5. **Multilingual by default** — where appropriate, respond in the user's language
6. **Fallback gracefully** — every function has a non-AI fallback that returns raw data if the API call fails

---

## Applicability

These skills apply to both projects in the ecosystem:

| Skill Area | JanVayu | ImpactMojo |
|-----------|---------|------------|
| Constraint-first prompting | Zero-framework SPA | Zero-framework static site |
| Serverless function pattern | 13 Netlify Functions | Edge Functions + Supabase Functions |
| API proxy / caching | Netlify Blobs cache | Supabase + tool-side caching |
| Accessibility audit | AQI dashboard, health calculator | Course pages, handouts, tools |
| Visual design | Deep purple/teal civic palette | Educational platform palette |
| Automation | Scheduled feeds, daily digest | Scheduled notifications, cohort reminders |
| Debugging | Netlify Function errors | Edge Function + Supabase errors |

The patterns are architecture-agnostic — they work whether the backend is Netlify Functions + Blobs (JanVayu) or Supabase + Edge Functions (ImpactMojo).
