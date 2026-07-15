# What Shipped This Week: A Working Language Switcher, an Accessibility Sweep, and a Much Lighter Site

**Published:** 15 July 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

This week's releases (v26.6.58 to v26.6.71) were less about new panels and more about the plumbing: making what already exists work properly, load faster, and reach more people. Here is what changed and why it matters.

## The language switcher was broken — now it works

JanVayu has carried a five-language interface (English, Hindi, Tamil, Marathi, Bengali) for months. It turns out almost none of it was reaching users.

The function that applies translations, `setLanguage()`, tried to update a small text label next to the language button on its very first step. But that button is icon-only — a globe — and the label element it was looking for did not exist. So the function threw an error and stopped **before it translated anything**. Clicking Hindi, Tamil, Marathi or Bengali did nothing at all.

It was a one-line guard to fix, and the effect is night and day: the navigation, hero banner, and dropdown menus now translate the moment you switch languages. "Reading List" becomes "पठन सूची". All the translation work that had been sitting dormant is finally visible.

We also wired translation into the panels that now load on demand (see below), so a panel you open *after* switching language still comes up translated. And we translated the **About** panel end-to-end into all five languages as a template for the rest. We are deliberately *not* auto-translating the health and legal panels without review — a mistranslated health instruction is worse than an English one — so those will follow through a checked translation pass.

## An accessibility sweep, measured with the same tool the CI uses

We ran [axe-core](https://github.com/dequelabs/axe-core) (the WCAG 2.1 AA engine our accessibility CI already runs) against the live panels and fixed what it actually flagged, rather than guessing:

- **Form controls** in the health calculator and urban-heat estimator had visible labels that were not programmatically linked — a screen reader announced them as unlabelled. All twelve now carry proper accessible names.
- **Inline links inside paragraphs** were distinguished only by colour, which fails for colour-blind readers. They are now underlined; buttons and nav links are unaffected.
- The one remaining **chart without a text description** got one.
- **Status badges** were the biggest colour-contrast offender by far. They are now theme-aware — darker text on the pale light-theme tint, brighter text in dark mode — and pass the 4.5:1 ratio in both. That alone cleared about half of all contrast findings.

A dark-theme contrast pass is [tracked separately](https://github.com/JanVayu/JanVayu/issues/213); it needs design review, not bulk edits.

## The rankings now cover 88 cities

The live [City Rankings](https://www.janvayu.in/#rankings) were computed from a hardcoded list of 27 cities, even though the dashboard itself covers around 117. We expanded the rankings backend to **88 cities** — the core set plus state capitals and NCAP non-attainment cities — so the national picture is no longer a metro-only view. Cities without a nearby live station simply drop out; nothing is faked.

## The site is 42% lighter

The whole platform is a single HTML file, and it had grown to about 1.59 MB. Over a series of passes we moved the heaviest panels' markup — Citizen Voices, Resources, Legal, About, and eight more — into external fragments that load only when you open them and are cached afterwards. The Learning Games engine and the citizen-testimony data moved out to cacheable external files too, and the map stylesheet no longer blocks the first paint.

The result: `index.html` dropped from ~1.59 MB to about **0.92 MB** — a 42% cut in what your browser downloads and parses on the very first visit, which matters most on the slower mobile connections common across India.

## Under the hood

We also consolidated the copy-pasted CORS handling across the Netlify serverless functions into a single shared helper, so there is one place to change how the API responds — a maintenance win with no user-visible change.

---

*Every figure on JanVayu is sourced and open. Found something off? The code is on [GitHub](https://github.com/JanVayu/JanVayu) and every panel links its sources.*
