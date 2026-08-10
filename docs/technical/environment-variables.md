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

### `GROQ_API_KEY`
**Used by:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

Groq API key for AI-powered features (uses Llama 3.3 70B, an open-source LLM).

**How to get it:**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Go to API Keys and create a new key

The free tier is sufficient for the AI features in JanVayu.

---

## Optional Variables

The site works without these. Each one improves a single feature and nothing breaks if it is absent.

### `YOUTUBE_API_KEY`
**Used by:** `youtube-feed.js`

Without it, the video feed reads eight Indian news and environment channels' public RSS feeds and keeps the videos whose titles name air quality. That needs no key and no quota, but it can only find coverage from channels we listed, and outside pollution season those channels publish nothing about air for weeks — so the feed is legitimately empty in, say, August.

With it, the function also **searches** YouTube, which reaches channels nobody listed.

**How to get it:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) and sign in with any Google account.
2. Create a project (top bar → **New Project**), or pick an existing one.
3. **APIs & Services → Library**, search for **YouTube Data API v3**, open it, press **Enable**.
4. **APIs & Services → Credentials → Create Credentials → API key**. Copy the key.
5. Press **Edit API key** and under **API restrictions** choose **Restrict key** → *YouTube Data API v3*. Leave application restrictions as **None**: Netlify functions have no fixed IP to allow-list. Restricting it to one API means a leaked key can do nothing but read public YouTube data.
6. In Netlify: **Site configuration → Environment variables → Add a variable**, name `YOUTUBE_API_KEY`, paste the value, then redeploy.

**No card required.** The free quota is **10,000 units a day** and a search costs **100**, so 100 searches a day cost nothing. The function spends 300 units per cache refill — three queries — and the result is cached, so a busy day uses a fraction of a percent of the allowance.

**It is read server-side only.** The key lives in the Netlify function and is never sent to the browser, so it does not need to be public like the WAQI token. Do not put it in `index.html`.

**To confirm it is working**, fetch the function and look at `source`:

```bash
curl -s https://www.janvayu.in/.netlify/functions/youtube-feed | head -c 200
```

`"source": "channel-rss"` means no key is set. `"source": "channel-rss + data-api"` means the key is in use.

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

# AI features (Groq — Llama 3.3 70B)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: YouTube search for the video feed (free tier, no card)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
