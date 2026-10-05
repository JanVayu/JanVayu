# Daily email digest

JanVayu sends a daily air quality digest to subscribers every morning at 8:00 AM IST.

---

## What the digest includes

Each email contains:

- Current AQI and PM2.5 for your selected city
- AQI category and health advisory for the day
- Link to the full platform for more detail

---

## Subscribing

1. Visit [www.janvayu.in](https://www.janvayu.in) and scroll to the "Stay Informed" section
2. Enter your email address
3. Select your city (or multiple cities)
4. Optionally set an AQI threshold (default 200); the digest is still sent daily, and the threshold only switches the email to alert wording when a city exceeds it
5. Click Subscribe

Your subscription is stored on the server (in Netlify Blobs). Your email address is passed to [Resend](https://resend.com), the email delivery service, solely to send the digest; JanVayu does not share subscriber data with anyone else.

---

## Unsubscribing

Each digest email ends with a note telling you to use the unsubscribe option on janvayu.in; the email does not yet contain a one-click unsubscribe link.

To unsubscribe, visit the platform and use the same subscription form with the "Unsubscribe" option. No account login is required.

---

## If the email does not arrive

The digest is sent via [Resend](https://resend.com) from `digest@janvayu.in`. If you do not see the email:

1. Check your spam/junk folder
2. Add `digest@janvayu.in` to your contacts or safe senders list
3. Some corporate email filters block automated emails, so try a personal address

The send time is 8:00 AM IST, which is 2:30 AM UTC. At that time a scheduled job (`daily-digest.mjs`) fetches live AQI and sends the personalised emails.
