# Code Standards

JanVayu uses plain HTML, CSS, and JavaScript. There is no build step, no framework, and no bundler. Keep it that way.

---

## HTML

- Use **semantic HTML5 elements** — `<article>`, `<section>`, `<nav>`, `<main>`, `<header>`, `<footer>`
- All images and icons need `alt` text
- Forms must have proper `<label>` elements (for screen readers)
- Use `aria-label` and `role` attributes where semantic HTML is not sufficient
- Follow WCAG 2.1 AA accessibility guidelines

---

## CSS

- Use **CSS custom properties (variables)** for colours and spacing — do not hardcode hex values outside the `:root` block
- Write mobile-first CSS — base styles target small screens, media queries handle larger breakpoints
- Do not use CSS frameworks (Bootstrap, Tailwind) — the project is vanilla CSS for simplicity and performance

---

## JavaScript

- **Vanilla JavaScript only** — no React, Vue, jQuery, or other frameworks
- Use `async/await` for all asynchronous operations (not callbacks)
- Wrap API calls in `try/catch` — always handle errors gracefully
- Add comments for non-obvious logic
- Do not use ES2022+ features that lack Safari support — check [caniuse.com](https://caniuse.com) when in doubt

---

## Netlify Functions

- Keep each function **focused and single-purpose**
- Return appropriate HTTP status codes (200, 400, 404, 500)
- Never hardcode secrets — use `process.env.VARIABLE_NAME`
- Include CORS headers (`Access-Control-Allow-Origin: *`) on all API functions
- Handle `OPTIONS` preflight requests
- Test locally with `netlify dev` before submitting a PR

---

## Environment Variables

- New environment variables must be:
  - Added to `.env.example` with a placeholder value and a comment
  - Documented in `docs/technical/environment-variables.md`

---

## Performance Guidelines

- Do not add new npm dependencies without discussion — the `package.json` is intentionally minimal
- Avoid loading large third-party scripts synchronously — use `defer` or `async`
- Images should be optimised and served in appropriate formats
- The site must score 90+ on Lighthouse for performance and accessibility

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): short description

Types: feat, fix, docs, style, refactor, test, chore
Scope: dashboard, map, functions, email, policy, data, docs

Examples:
feat(dashboard): add PM10 toggle
fix(email): handle missing city gracefully
docs(contributing): add code standards page
chore(deps): update @netlify/blobs to 8.2.0
```
