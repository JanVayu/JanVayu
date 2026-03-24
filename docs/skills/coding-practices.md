# Skill: Coding Practices

These are the prompting and development patterns used when building JanVayu's codebase with AI assistance. They are reusable for any civic tech or data-driven web project.

---

## Core Principle: Constraint-First Prompting

When asking an AI to write code for JanVayu, the most important thing to specify is what **not** to do — not what to do. The default behaviour of LLMs is to reach for frameworks, dependencies, and complexity. JanVayu is deliberately zero-framework. Every code prompt started with a constraint:

> "Vanilla JavaScript only. No frameworks. No npm imports in the frontend. No build step."

Without this, you will get React components, Webpack configs, and TypeScript interfaces for a project that needs none of them.

---

## Prompt Patterns Used

### 1. The "Civic Data" Pattern

For any feature that displays public interest data:

```
Write a [feature] for a civic data platform. The data comes from [source].
Display it in plain HTML/CSS/JS with no framework. The audience includes 
people who may be accessing this on a 2G connection or a low-end Android phone.
Prioritise load speed over visual complexity.
```

This prompt produced the AQI dashboard, the city comparison table, and the policy tracker sections.

**Why it works:** Specifying the audience (low-end device, slow connection) forces the AI to make appropriate tradeoffs — no lazy-loaded images, no heavy chart libraries for simple data, progressive enhancement.

---

### 2. The "Serverless Function" Pattern

For every Netlify Function:

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

This is the template behind all 9 functions in `netlify/functions/`. The "graceful fallback" requirement is the most important — it prevents the entire UI feature from breaking when a third-party API (Reddit, Nitter, WAQI) is down.

---

### 3. The "API Proxy" Pattern

For functions that proxy external feeds (Reddit, news, Twitter/X):

```
Write a Netlify Function that:
1. First checks a Netlify Blobs cache for a fresh copy (< 4 hours old)
2. If cache is warm, return immediately from cache
3. If cache is stale or empty, fetch from [source], write to cache, then return
4. If the live fetch fails, return whatever is in the cache (even if stale)
5. Always return something — never a 500 with no body
```

This cache-first pattern ensures that feed outages (Nitter instances going down, Reddit rate limits) result in slightly stale data rather than broken UI.

---

### 4. The "Accessibility Audit" Pattern

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

"List specific fixes, not generic advice" is the key constraint — without it you get a checklist of WCAG guidelines rather than actionable line-specific issues.

---

### 5. The "Refactor for Readability" Pattern

When a section of `index.html` had grown complex:

```
Refactor this JavaScript function for readability. Requirements:
- No change in behaviour
- Extract magic numbers into named constants with comments explaining their source
- Replace comment blocks with self-documenting variable names where possible
- Add a JSDoc comment explaining what the function does, its inputs, and its return value
- Do not introduce new dependencies or language features beyond ES2020
```

The "no change in behaviour" constraint prevents the AI from "improving" things by rewriting the logic, which introduces bugs.

---

## What to Avoid Asking an AI to Do

| Ask | Why to avoid |
|-----|-------------|
| "Add TypeScript" | Requires a build step; breaks the zero-framework principle |
| "Improve performance" without constraints | Often results in lazy loading, code splitting, or caching strategies that add complexity |
| "Make this more modern" | Will introduce framework dependencies |
| "Add tests" without specifying the test framework | Will add Jest, Vitest, or similar — all require npm and a build step |
| "Optimise the CSS" | Often removes purposeful CSS variables or consolidates styles in ways that break theming |

---

## Debugging Pattern

When a Netlify Function was misbehaving:

```
This Netlify Function is returning [error/wrong output]. 
Here is the function: [code]
Here is the request that causes the issue: [curl or fetch call]
Here is the actual response: [response]
Here is the expected response: [expected]

Do not rewrite the function. Identify the specific line causing the issue 
and explain why. Then propose the minimum change to fix it.
```

"Do not rewrite the function" and "minimum change" are the critical constraints. Without them, the AI will refactor the entire function — producing a new set of bugs and making the diff unreadable.
