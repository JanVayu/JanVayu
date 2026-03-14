# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| v25.x   | :white_check_mark: |
| < v25.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in JanVayu, please report it responsibly.

**Email:** [contribute@janvayu.in](mailto:contribute@janvayu.in)

**Subject line:** `[SECURITY] Brief description of the issue`

Please include:
- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- Any suggested fixes, if applicable

**Do not** open a public GitHub issue for security vulnerabilities.

## What Constitutes a Security Issue

The following are considered security issues and should be reported:

- **API key exposure** — Accidental leaking of private API keys or secrets in client-side code
- **Cross-Site Scripting (XSS)** — Injection of malicious scripts through user-facing inputs or URL parameters
- **Injection vulnerabilities** — SQL injection, command injection, or other injection attacks
- **Data leaks** — Unintended exposure of subscriber email addresses, personal data, or server-side configuration

## What Is NOT a Security Issue

- **WAQI API token** — The World Air Quality Index API token used in the frontend is intentionally public. It is a free-tier, read-only token that provides access to publicly available air quality data. Exposure of this token does not constitute a vulnerability.
- **Netlify Functions environment variables** — Environment variables used by Netlify Functions (such as email service credentials) are server-side only and are not exposed to the client. These are managed through Netlify's dashboard and are not included in the repository.

## Response Timeline

| Action                     | Timeframe        |
| -------------------------- | ---------------- |
| Acknowledgment of report   | Within 48 hours  |
| Initial assessment         | Within 1 week    |
| Fix for critical issues    | Within 2 weeks   |
| Fix for non-critical issues| Within 1 month   |

We will keep you informed of our progress and credit you in the fix (unless you prefer to remain anonymous).

## Disclosure

We follow a coordinated disclosure process. Please allow us reasonable time to address the issue before making any public disclosure.
