# How we checked that the site is fast and usable on a phone

**Published:** 8 May 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

On the day we released six Learning Games and refreshed the May 2026 data, we also made the site faster and easier to use on a phone, and began testing its speed and accessibility each time it changes.

## What changes for you

- The site downloads roughly 120 KB less on first load for visitors who do not open the Trends or Live Map panels. That is our estimate from the published sizes of the charting and map code; we have not measured it.
- Every chart now has a text description that a screen reader can read out.
- Buttons are at least 44 px tall on small screens. Some were 40 px before.
- Long web addresses and strings of acronyms no longer force the page to scroll sideways on a phone.

## Loading charts and maps only when you open them

Until this week, the charting code (about 70 KB compressed) and the map code (about 50 KB compressed) loaded on every page view. Most visitors never open the Trends panel, and even fewer open the Live Map. That is about 120 KB that most visits did not use. Both now load when you first open the panel that needs them.

The small bar charts on the dashboard are the exception. They should not lag behind the first screen, so the charting code is fetched in the background just after the page appears. On Safari it waits 1.5 seconds first. The chart and map code comes from outside services, and your browser now refuses to run it if what arrives is not exactly the version we tested, whether it changed by compromise or by mistake.

We expect the saving to be roughly 600 ms on a 3G phone. That is an estimate, which the speed testing described below will put to the test.

## Testing the site as it changes

The site is now tested for speed and accessibility each time it changes, so a change that slows it down on a phone, or that a screen reader cannot use, is flagged to us. The speed test covers the home page, the Ask page, the blog and the PM2.5 page. On a mobile phone the aim is for the first content to appear within 3 seconds and the main content within 4.5 seconds. Pages are checked against the WCAG 2 AA accessibility standard, and every link on the site is checked once a week, so a dead link is noticed.

We also measured how much of the dashboard's English text has a translation. The answer is **0.7%**, which is uncomfortably low, and now a number we can watch rise.

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

The priorities for the third quarter of 2026, in order of expected benefit, are below (the full list is on [the roadmap](https://github.com/JanVayu/JanVayu/blob/main/docs/wiki/Roadmap.md)):

1. Bring the first content to the screen about 200 ms sooner.
2. Fix every remaining accessibility fault, then test more sections: Health, Policy, Workshops and Games.
3. Test each panel on small phones and tablets: iPhone SE and 14, Galaxy, and iPad Mini.
4. Raise translation coverage from 0.7% to a target we can measure, perhaps 60% by the end of the third quarter.
5. Replace the fixed list of 16 cities with CPCB's station list and a searchable city picker.
6. Bring posts from X (Twitter) back into the social feed.

## Why we did it in this order

We released the work you can see first, namely the games, the data refresh and the voices and research updates, and started testing speed and accessibility afterwards. Testing a half-built site wastes effort; testing a working one shows what to fix next. If you are adapting JanVayu for your own city, we suggest the same order.

---

**Repository:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
**Roadmap:** [what we are working on next](https://github.com/JanVayu/JanVayu/blob/main/docs/wiki/Roadmap.md)
