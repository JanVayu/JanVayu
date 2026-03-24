# Daily Email Digest

JanVayu sends a daily air quality digest to subscribers every morning at **8:00 AM IST**.

---

## What the Digest Includes

Each email contains:

- Current AQI and PM2.5 for your selected city
- AQI category and health advisory for the day
- Comparison with yesterday's reading
- One-line summary of the key air quality story of the day (from news feeds)
- Link to the full platform for more detail

---

## Subscribing

1. Visit [www.janvayu.in](https://www.janvayu.in) and scroll to the "Stay Informed" section
2. Enter your email address
3. Select your city (or multiple cities)
4. Optionally set an AQI threshold — you'll only receive emails when AQI exceeds your threshold
5. Click Subscribe

Your subscription is stored securely in Netlify Blobs (server-side storage). JanVayu does not share subscriber data with third parties.

---

## Unsubscribing

Each digest email includes an unsubscribe link at the bottom. Click it to remove yourself from the list immediately — no account login required.

You can also unsubscribe by visiting the platform and using the same subscription form with the "Unsubscribe" option.

---

## Technical Details

The digest is sent via [Resend](https://resend.com) from `digest@janvayu.in`. If you do not see the email:

1. Check your spam/junk folder
2. Add `digest@janvayu.in` to your contacts or safe senders list
3. Some corporate email filters block automated emails — try a personal email address

**Send time:** 8:00 AM IST = 2:30 AM UTC. The Netlify scheduled function `daily-digest.mjs` triggers at this time, fetches live AQI, and dispatches personalised emails.
