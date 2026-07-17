# What Shipped This Week: A Longer Walkthrough, Plainer Words, and a Menu You Can Actually Navigate

**Published:** 17 July 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

This batch (v26.6.102 to v26.6.115) barely added a panel. Almost all of it went into making what already exists easier to find, easier to read, and pleasant to use on a phone. A mature platform earns more trust from being legible than from growing a fifty-second feature — so this week we cleaned house.

## Two walkthroughs now — pick your depth

The [guided walkthrough](/walkthrough/) used to be a single short deck. It's a good ten-minute overview, so we kept it. But "here's the gist" isn't enough if you're training a newsroom or briefing a class, so there's now a **second, comprehensive deck** — 36 slides across eight chapters, with a slide for essentially every panel on the site: the live data, the health toll, the economics, the accountability trackers, the tools, and how the numbers stay honest.

The landing page lets you choose between the two up front. Both run natively in the browser with speaker notes, a slide overview, fullscreen, and print-to-PDF. The long deck is data-driven, so extending it later is a matter of editing a list, not hand-building slides.

## We caught ourselves lapsing into jargon

Here's an uncomfortable one. Scattered across the site were sentences that read like release notes instead of public writing: a walkthrough page bragging that it was "built natively… so it never goes stale"; a homepage card explaining that our text layout "measures text off-DOM… **300× faster than traditional browser text layout**"; an API described as a "CORS-open manifest"; a ward map that talked about values being "interpolated (inverse-distance weighted)."

All true. All irrelevant to a person who came to understand their air, not our architecture. The reason it creeps in is simple: copy gets written from the *builder's* chair, where the engineering wins feel notable. To the reader they're noise — and a faintly defensive noise, like the page is justifying itself to a skeptic who isn't in the room.

So we did a plain-language pass. The ward map now says its values are "estimated from the nearest monitors" and shows "the citywide pattern, not an exact street-by-street reading" — the honest caveat kept, the jargon gone. The API is "a free, open web address… no login." The health calculator's button says "Calculate my risk" instead of naming the statistical model (the model is still named, in full, in the explainer where it belongs). The rule we're keeping: **if a sentence would only impress an engineer, it doesn't belong in front of a citizen.**

## A menu you can find things in

Two pages people actually look for — the **FAQ** and the **Team** page — were buried as the last items of a dropdown called "Learn," where nobody thinks to look, and lost in a ten-item footer pile. They're now grouped in a proper **About** menu (About · Team · FAQ · Contact · GitHub), present in the desktop nav, the mobile menu, and as its own footer column.

## It behaves on a phone now

A run of small mobile fixes, most of them things that should never have shipped:

- **Dashboard tiles** were squeezed into two columns so narrow that titles broke mid-word — "Learnin g Games." They now stack one per row, each title on a single line.
- **The footer** left a large empty column beside its nav links (three link groups never fill two columns evenly). It stacks cleanly now.
- **Tables** that used to force sideways scrolling on small screens fold into labelled cards.
- **Heading order** was audited end-to-end so screen readers get a clean outline with no skipped levels.
- **The walkthrough preview** on the tour page was crammed into a sliver of height on phones; it's now tall enough to actually read a slide.

## Two small features

- **An air-quality self-check** — ten questions on the [Workshops](/#workshops) page to test what you actually know about AQI, sources, and protection. A companion to the learning games, built for classrooms.
- **Story of the week** — the dashboard now surfaces a rotating deep-dive from this blog, so the front page stays alive between crises without a redeploy.

## Lucknow joins the ward atlas

[How Polluted Is Your Ward?](/#ward-map) now covers **Lucknow** — 112 municipal wards, boundaries from DataMeet's open spatial data. As with every atlas city, the air layer is estimated live from Lucknow's own monitors and shown as the citywide pattern, not a per-street reading. (The satellite heat and green-cover layers aren't available for Lucknow yet, and the map says so plainly rather than showing an empty toggle.)

## Under the hood: we cleaned up our own CSS

The footer and grid layout rules had quietly drifted into a mess — the footer's column count was defined in **six** different places across scattered breakpoints, one of them literally commented "single column" while setting two. That's how a fix can be written and never take effect. We consolidated each layout down to a single source of truth and verified the rendering is pixel-identical at a dozen screen widths. No visual change — just rules that no longer fight each other, so the next fix actually sticks.

---

None of this is glamorous, and that's rather the point. The case for clean air is strong; it deserves a home that's clear, honest, and easy to move around in. If something still reads like jargon or misbehaves on your phone, [tell us](mailto:contribute@janvayu.in) — the fastest fixes usually start with a screenshot.
