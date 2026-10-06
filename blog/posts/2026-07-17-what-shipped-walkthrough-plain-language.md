# A longer walkthrough, plainer words and an easier menu

**Published:** 17 July 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

This week added hardly any new panels. Nearly all the work went into making what already exists easier to find, easier to read and better on a phone.

## Two walkthroughs

The [guided walkthrough](/walkthrough/) used to be a single short deck. It is a good ten-minute overview, so we kept it. But a short overview does not help if you are training a newsroom or briefing a class, so there is now a **second, comprehensive deck**: 36 slides across eight chapters (at publication), with a slide for essentially every panel on the site. It covers the live data, the health toll, the economics, the accountability trackers, the tools, and how the numbers are kept honest.

*Update, 2 October 2026: the comprehensive deck now has 38 slides (a village slide was added), and the short deck has 13.*

The landing page lets you choose between the two. Both run in your browser, with speaker notes, a slide overview, fullscreen and print-to-PDF.

## Plainer words

Sentences had crept in that read like release notes. A walkthrough page said it was "built natively… so it never goes stale." A homepage card explained that our text layout "measures text off-DOM… **300× faster than traditional browser text layout**." An API was described as a "CORS-open manifest," and the ward map talked about values being "interpolated (inverse-distance weighted)."

All true, and none of it useful to a person who came to understand their air. It happens because copy gets written by the people who built the thing, who are proud of the engineering. A reader just hears a page justifying itself.

So we rewrote them. The ward map now says its values are "estimated from the nearest monitors" and shows "the citywide pattern, not an exact street-by-street reading," which keeps the caveat and drops the jargon. The API is "a free, open web address… no login." The health calculator's button says "Calculate my risk" instead of naming the statistical model, which is still named in full in the explainer. Our rule from here: if a sentence would only impress an engineer, it does not belong in front of a citizen.

## A menu you can find things in

The **FAQ** and the **Team** page were the last items in a dropdown called "Learn," where nobody thinks to look, and were lost in a ten-item footer. They now sit in an **About** menu (About, Team, FAQ, Contact, GitHub), in the desktop menu bar, the mobile menu and a footer column of their own.

## Fixes for phones

- Dashboard tiles were squeezed into two columns so narrow that titles broke mid-word ("Learnin g Games"). They now stack one per row, each title on a single line.
- The footer left a large empty column beside its links. It now stacks cleanly.
- Tables that forced sideways scrolling on small screens now fold into labelled cards.
- Heading order was checked throughout, so screen readers get a clean outline with no skipped levels.
- The walkthrough preview on the tour page was a sliver of height on phones. It is now tall enough to read a slide.

## Two small features

An **air-quality self-check** of ten questions on the [Workshops](/#workshops) page tests what you know about AQI, sources and protection. It is a companion to the learning games, made for classrooms.

**Story of the week** puts a rotating deep-dive from this blog on the dashboard, so the front page changes between pollution crises.

## Lucknow joins the ward atlas

[How Polluted Is Your Ward?](/#ward-map) now covers **Lucknow**, with 112 municipal wards and boundaries from DataMeet's open spatial data. As in every atlas city, the air layer is estimated live from Lucknow's own monitors and shown as the citywide pattern, not a per-street reading. The satellite heat and green-cover layers were not yet available for Lucknow, and the map said so rather than showing an empty toggle.

*Update, 30 July 2026: Lucknow now has heat, green-cover and built-up satellite layers. The ward atlas panel was later retired and the ward layers are part of the boundary map.*

---

If something still reads like jargon or misbehaves on your phone, [tell us](mailto:contribute@janvayu.in). The fastest fixes usually start with a screenshot.
