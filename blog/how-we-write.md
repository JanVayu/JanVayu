# How We Write the JanVayu Blog

A short guide for anyone writing a post — so every piece sounds like JanVayu and holds to the same standard. If you read nothing else, read **The three non-negotiables**.

---

## Who this is for

Anyone contributing a blog post: team members, collaborators, guest writers. You don't need to be a designer or a developer — you need to care about getting it right and saying it plainly.

## The voice

JanVayu writes for a **citizen**, not an expert and not an insider. Picture a thoughtful reader who cares about their family's health but has never seen a µg/m³ before. Write to them.

- **Plain over clever.** Short sentences. Everyday words. If a phrase would only impress an engineer or a policy wonk, it doesn't belong in front of a reader. ("Estimated from the nearest monitors," not "inverse-distance weighted interpolation.")
- **Honest over impressive.** The case for clean air is strong enough that it never needs an exaggerated number. Understating and sourcing beats overstating and getting caught.
- **Non-partisan.** We name problems, sources, and the gap between promise and delivery — never a party. Track the money and the record, not the politics.
- **Calm, not alarmist.** The facts are alarming on their own. Let them be. No doom, no hype, no exclamation marks.
- **Specific over vague.** A number with a source and a date beats an adjective. "3.5 years of life expectancy lost (AQLI 2025)" beats "devastating harm."

## The three non-negotiables

These are what separate JanVayu from a marketing site. Never break them.

1. **Every number cites a primary source, in-line.** Name the study or body and the year — Lancet Countdown 2025, IQAir 2025, CREA 2026, WHO, CPCB, AQLI. If you can't source a number, don't use it.
2. **Never invent, never guess.** If a figure can't be verified, leave it out or flag it as unverified. A missing number is fine; a made-up one is not.
3. **Never collapse two honest methods into one.** India's air-pollution death toll is ~1.72 million from ambient PM2.5 (Lancet Countdown 2025) *and* ~2.1 million counting household air pollution (State of Global Air 2024). Both are true. Show both, each labelled with its scope and year — don't merge or cherry-pick.

> The whole site runs a weekly automated fact-check. Assume your post will be checked too. Write it so it passes.

## What a post looks like

Every post is a Markdown file. Start with the title and a one-line byline, exactly like this:

```markdown
# A Clear, Specific Title That Says What the Reader Gets

**Published:** 17 July 2026 | **Author:** Komal, for Team JanVayu | **Reading time:** 5 min

---

Opening paragraph — one or two sentences that tell the reader why this
matters to *them*, before any detail.

## A section heading in plain words

Body text...
```

- **Byline:** credit the actual writer, then the team, in the form **"[Your name], for Team JanVayu"** (e.g. *"Komal, for Team JanVayu"*). This recognises who wrote it while keeping the collective, reviewed-by-the-team voice. If a post is genuinely a group effort with no single author, *"Team JanVayu"* alone is fine.
- **Title:** concrete and specific. "The Citation That Didn't Exist" beats "An Update on Sources." For release round-ups we use the pattern *"What Shipped This Week: X, Y, and Z."*
- **Optional hero image:** only openly-licensed images (Wikimedia Commons / CC). Always include the credit line directly under it — photographer, licence, and link. Example:
  `<small>*Delhi's skyline at sunset. Photo: Name, [CC BY 2.0](link), via Wikimedia Commons.*</small>`
- **Sections:** break the piece with `##` headings written as plain statements, not labels.
- **Close** with a small call to action — invite a correction, a contribution, or a click through to the tool. End on the reader's agency. The standard sign-off is an invitation to email `contribute@janvayu.in`.

## Length

Aim for **a 4–6 minute read** (roughly 700–1,200 words). Put the reading time in the byline — about 200 words per minute. If it's running longer, it's probably two posts.

## Publishing mechanics

1. Save the file in `blog/posts/` named `YYYY-MM-DD-short-slug.md` (e.g. `2026-07-17-what-shipped-walkthrough.md`).
2. Add a link to it at the top of the current month in `blog/_sidebar.md`:
   `  - [Your Full Title](posts/2026-07-17-short-slug.md)`
3. That's it — the blog is a Docsify site, so the file *is* the page. No build step.
4. **Story of the week:** the dashboard surfaces one post a week automatically. To make a post eligible, add it to `data/stories.json` (title, blurb, tag, link) — keep the blurb to one honest sentence.

## Before you publish — a 6-point check

- [ ] Every number has a named source and a year, in-line.
- [ ] Nothing is invented or guessed; anything shaky is flagged, not stated.
- [ ] No two different methods are quietly merged into one figure.
- [ ] No jargon a citizen wouldn't know (or it's explained the first time).
- [ ] It's non-partisan — problems and sources, not parties.
- [ ] It ends with a clear, small invitation to the reader.

## A quick before/after

> **Instead of:** "Leveraging our proprietary IDW interpolation engine, we surface hyperlocal PM2.5 estimates with unprecedented granularity."
>
> **Write:** "We estimate each ward's air from the city's nearest monitors — the citywide pattern, not an exact street-by-street reading, and we say so."

---

Questions, or want a second pair of eyes on a draft? Email **contribute@janvayu.in** — being edited in the open is the whole point.
