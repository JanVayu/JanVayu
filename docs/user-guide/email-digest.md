# Daily email digest

JanVayu sends a daily air quality digest to subscribers every morning at 8:00 AM IST.

---

## What the digest includes

Each email contains:

- A table of your cities with CPCB's category for the current PM2.5, and PM2.5 and PM10 in µg/m³
- The health effects CPCB publishes for the category of the worst city on your list
- A line saying whether any city is above your alert level
- Link to the full platform for more detail

If a station has not reported for over six hours, or its reading is implausibly low, the row says "No reliable reading today" and gives the reason. The email does not print a stale number.

---

## Subscribing

1. Visit [www.janvayu.in](https://www.janvayu.in), open Index and choose AQI Alerts (or go straight to [janvayu.in/#aqi-alerts](https://www.janvayu.in/#aqi-alerts)), and find "Email Digest (Daily)"
2. Enter your email address
3. Select your city (or multiple cities)
4. Optionally choose the PM2.5 level to be alerted at, in µg/m³ on CPCB's categories (the default is 90, Poor or worse); the digest is still sent daily, and the level only switches the email to alert wording when a city exceeds it
5. Click Subscribe

Your subscription is stored on the server (in Netlify Blobs). Your email address is passed to [Resend](https://resend.com), the email delivery service, solely to send the digest; JanVayu does not share subscriber data with anyone else.

---

## Unsubscribing

Each digest email ends with a note pointing you to the Alerts page (janvayu.in/#aqi-alerts); the email does not yet contain a one-click unsubscribe link.

To unsubscribe, visit the platform and use the same subscription form with the "Unsubscribe" option. No account login is required.

---

## If the email does not arrive

The digest is sent via [Resend](https://resend.com) from `digest@janvayu.in`. If you do not see the email:

1. Check your spam/junk folder
2. Add `digest@janvayu.in` to your contacts or safe senders list
3. Some corporate email filters block automated emails, so try a personal address

The send time is 8:00 AM IST, which is 2:30 AM UTC. At that time a scheduled job (`daily-digest.mjs`) fetches live AQI and sends the personalised emails.
