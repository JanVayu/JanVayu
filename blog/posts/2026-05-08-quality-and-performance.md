# How we checked that the site is fast and usable on a phone

**Published:** 8 May 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

On the day we released six Learning Games and refreshed the May 2026 data, we also did some quieter work: we set up automatic checks on the speed and accessibility of the site, and made several changes you will notice on your phone.

## What changes for you

- The site downloads roughly 120 KB less on first load for visitors who do not open the Trends or Live Map panels. That is our estimate from the published sizes of the charting and map code, not a measured run.
- Every chart now has a text description that a screen reader can read out.
- Buttons are at least 44 px tall on small screens. Some were 40 px before.
- Long web addresses and strings of acronyms no longer force the page to scroll sideways on a phone.

## Loading charts and maps only when you open them

Until this week, the charting code (about 70 KB compressed) and the map code (about 50 KB compressed) loaded on every page view. Most visitors never open the Trends panel, and even fewer open the Live Map. That is about 120 KB that most visits did not use. Both now load when you first open the panel that needs them.

The small bar charts on the dashboard are the exception. They should not lag behind the first screen, so the charting code is fetched in the background just after the page appears. Safari does not support the browser feature that does this, so there it waits 1.5 seconds. All three outside scripts are also locked to a fixed fingerprint, so if one of the hosting services ever served different content under the same address, whether by compromise or by mistake, the browser would refuse to run it.

We expect the saving to be roughly 600 ms on a 3G phone, which is our estimate and not a measurement. The speed test we set up the same day will measure it.

## Automatic checks on every change

Five checks now run whenever someone changes the site. They report problems and do not block the change, because legacy problems would otherwise block every change until a clean-up was done, and we cannot fix everything in one pass.

- A speed test on the home page, the Ask page, the blog and the PM2.5 page. For now it only warns. The targets on mobile are a performance score of at least 0.60, first content on screen within 3 seconds, the main content within 4.5 seconds, blocking time of at most 600 ms and layout shift of at most 0.15. Once the site meets them three times in a row, we will make the key ones mandatory.
- An accessibility check against WCAG 2 AA, with each page's violations listed and the three most common problems named.
- A check that the page markup is valid.
- A check on the code for common errors.
- A strict weekly check of every link on the site, which opens an issue if one is dead. The check on each change stays advisory for now.

We also now measure how much of the dashboard's English text can be translated. The answer is **0.7%**, which is uncomfortably low, but we can now track it as it rises. When we have a baseline we will set a minimum.

## Charts for screen readers

Until this week every chart on the site was a blank to screen readers. A chart displayed on screen, and a blind user heard only "graphic". Every chart now has a description. Examples:

- The metro comparison chart: "Bar chart comparing live AQI across the six largest Indian metros (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad)."
- The year-on-year chart: "Line chart comparing month-by-month PM2.5 averages for a chosen Indian city across 2024, 2025, and 2026."
- The Delhi history chart: "Multi-year line chart of Delhi annual average PM2.5 from 2015 to 2025, with the WHO 5 µg/m³ guideline overlay."

A description is the minimum. A spoken version of the data, or a table, would be next.

## Buttons and long words on phones

WCAG 2.5.5 ("Target Size, Enhanced") asks for touch targets of at least 44×44 CSS pixels. Apple's guidelines give 44×44 points and Android's Material guidance gives 48×48 dp, though we have not re-opened Apple's page for this post. Our icon buttons already met this on small screens, and the other buttons did not. They do now.

Long web addresses and strings such as CAAQMS station IDs and NCAP fund codes used to push the page wider than a narrow screen. They now break onto a new line.

The new Air Tambola ticket needed its own fix. Nine columns were too narrow to show two-line terms such as "Lancet 1.72M" on a 360 px Galaxy phone. The ticket now sits in a box at least 540 px wide that scrolls sideways, and does not squeeze.

## What we are working on next

The priorities for the third quarter of 2026, in order of expected benefit, are below (the full list is in [`docs/wiki/Roadmap.md`](https://github.com/JanVayu/JanVayu/blob/main/docs/wiki/Roadmap.md)):

1. Split the panel-specific styling into a file that loads later, which should bring first content about 200 ms sooner.
2. Fix every remaining accessibility violation, then check more addresses: `/#health`, `/#policy`, `/#workshops` and `/#games`.
3. Test each panel on small phones and tablets: iPhone SE and 14, Galaxy, and iPad Mini.
4. Raise translation coverage from 0.7% to a target we can measure, perhaps 60% by the end of the third quarter, and enforce a minimum.
5. Replace the fixed list of 16 cities with CPCB's station list and a searchable city picker.
6. Turn on the Agent-Reach secrets, or move to the Twitter API v2 Basic tier.

## Why we did it in this order

We released the user-visible work first, namely the games, the data refresh and the voices and research updates, and added the checks afterwards. Automatic checks on a half-built site waste effort. On a working site they show what to fix next. If you are forking JanVayu, we suggest the same order.

---

**Repository:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
**Performance roadmap:** [docs/technical/performance-roadmap.md](https://github.com/JanVayu/JanVayu/blob/main/docs/technical/performance-roadmap.md)
**Q3 priorities:** [docs/wiki/Roadmap.md, Phase 6](https://github.com/JanVayu/JanVayu/blob/main/docs/wiki/Roadmap.md)
