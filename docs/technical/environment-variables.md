# Environment Variables

All secrets and configuration are managed through environment variables. They are **never committed to the repository**.

- For **local development**: create a `.env` file in the project root (it is gitignored)
- For **production**: set them in the [Netlify dashboard](https://app.netlify.com) under Site Settings → Environment Variables

---

## Required Variables

### `RESEND_API_KEY`
**Used by:** `daily-digest.mjs`

Your API key from [Resend](https://resend.com). Required for sending daily email digests to subscribers.

**How to get it:**
1. Create an account at [resend.com](https://resend.com)
2. Go to API Keys → Create API Key
3. Copy the key (it is only shown once)

---

### `RESEND_FROM`
**Used by:** `daily-digest.mjs`

The verified sender email address for digest emails. Must be a domain you have verified in Resend.

**Example:** `digest@janvayu.in`

---

### `BLOB_TOKEN`
**Used by:** All functions that read/write Netlify Blobs

A Netlify personal access token with Blobs read/write permissions.

**How to get it:**
1. Go to [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications)
2. Generate a new token
3. Copy it (shown only once)

---

### `NETLIFY_SITE_ID`
**Used by:** All functions that read/write Netlify Blobs

The unique ID of your Netlify site.

**How to get it:**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Open the JanVayu site
3. Go to Site Settings → General → Site ID
4. Copy the UUID (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### `GEMINI_API_KEY`
**Used by:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

Google Gemini API key for AI-powered features.

**How to get it:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a key in a new or existing project

The free tier is sufficient for the AI features in JanVayu.

---

## Public Key (Not a Secret)

### WAQI API Token
The WAQI API token (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) is a **free-tier public key** embedded directly in `index.html`. It is not a secret — WAQI provides these tokens publicly. It is rate-limited by WAQI at the IP level.

If you want to use your own WAQI token (for higher rate limits), register at [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) and replace the token in `index.html`.

---

## Local `.env` Example

```bash
# Email digest (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AI features (Google Gemini)
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
