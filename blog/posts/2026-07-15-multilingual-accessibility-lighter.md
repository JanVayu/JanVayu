# What Shipped This Week: A Working Language Switcher, an Accessibility Sweep, and a Much Lighter Site

**Published:** 15 July 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

This week's updates added few new panels. They fixed things that already existed so they work properly, load faster and reach more people. Here is what changed and why it matters.

## The language switcher did not work, and now it does

JanVayu has offered a five-language interface (English, Hindi, Tamil, Marathi, Bengali) for months. It turned out that almost none of it was reaching readers.

The switcher began by updating a small text label beside the language button. That button shows only a globe icon, so the label did not exist, and the switcher failed before it translated anything. Clicking Hindi, Tamil, Marathi or Bengali did nothing at all.

The fix was small, and the effect is large. The menus, the hero banner and the dropdown menus now change language as soon as you switch. "Reading List" becomes "पठन सूची". Translation work that had been sitting unused is finally visible.

A panel you open after switching language now also appears translated. We translated the **About** panel into all five languages as a model for the rest. We are deliberately not auto-translating the health and legal panels without review, because a mistranslated health instruction is worse than an English one. Those will follow after a checked translation.

## An accessibility sweep

We ran [axe-core](https://github.com/dequelabs/axe-core), a standard WCAG 2.1 AA checker, against the live panels and fixed what it actually flagged, rather than guessing.

Form fields in the health calculator and the urban-heat estimator had visible labels that were not linked to them, so a screen reader announced them as unlabelled. All twelve now have proper names.

Links inside paragraphs were set apart only by colour, which fails readers who are colour-blind. They are now underlined. Buttons and menu links are unchanged. The one remaining chart without a text description now has one.

Status badges were the biggest colour-contrast problem by far. Their text is now darker on the pale light-theme background and brighter in dark mode, and both pass the 4.5:1 contrast ratio. That alone cleared about half of all contrast findings.

A dark-theme contrast pass is [tracked separately](https://github.com/JanVayu/JanVayu/issues/213), because it needs design review, not bulk edits. *Update, 2 October 2026: the dark-theme pass shipped the same day.*

## The rankings now cover 88 cities

The live [City Rankings](https://www.janvayu.in/#rankings) were computed from a fixed list of 27 cities, although the dashboard itself covers around 117. The rankings now cover **88 cities**: the core set plus state capitals and NCAP non-attainment cities. The national picture is no longer a view of the metros alone. A city with no live station nearby drops out, and nothing is filled in by guesswork.

## The site is 42% lighter

The whole platform was a single page that had grown to about 1.59 MB. We moved the heaviest panels (Citizen Voices, Resources, Legal, About and eight more) so that they load only when you open them and are remembered afterwards. The Learning Games and the citizen testimonies were separated out in the same way, and the map's styling no longer holds up the first screen.

*Update, 2 October 2026: this describes the site at the time of writing. The platform is no longer a single HTML file; panels and data load from external fragments and files.*

The main page fell from about 1.59 MB to about **0.92 MB**, a 42% cut in what your browser has to download and process on a first visit. That matters most on the slower mobile connections common across India.

---

*Every figure on JanVayu is sourced and open. Found something off? The code is on [GitHub](https://github.com/JanVayu/JanVayu) and every panel links its sources.*
