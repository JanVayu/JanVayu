# How We Write the JanVayu Blog

A short guide for anyone writing a post, so that every piece sounds like JanVayu and holds to the same standard. If you read nothing else, read the three non-negotiables.

---

## Who this is for

Anyone contributing a blog post: team members, collaborators, guest writers. You don't need to be a designer or a developer. You need to care about getting it right and saying it plainly.

## The voice

JanVayu writes for a **citizen**, not an expert and not an insider. Picture a thoughtful reader who cares about their family's health but has never seen a µg/m³ before. Write to them.

Prefer plain words to clever ones. Use short sentences and everyday words. If a phrase would only impress an engineer or a policy wonk, it doesn't belong in front of a reader. Write "estimated from the nearest monitors" and leave out "inverse-distance weighted interpolation."

Prefer honesty to impressiveness. The case for clean air is strong enough that it never needs an exaggerated number. Understating and sourcing beats overstating and getting caught.

Stay non-partisan. We name problems, sources, and the gap between promise and delivery, and we never name a party. Track the money and the record, not the politics.

Stay calm. The facts are alarming on their own, so let them be. No doom, no hype, no exclamation marks.

Be specific. A number with a source and a date beats an adjective. "3.5 years of life expectancy lost (AQLI 2025)" beats "devastating harm."

## The three non-negotiables

These are what separate JanVayu from a marketing site. Never break them.

1. Every claim cites its source, in-line. Name the study or body and the year (Lancet Countdown 2025, IQAir 2025, CREA 2026, WHO, CPCB, AQLI). Use the original document; if no original is publicly available, a publicly available press report, named as one. If you can't source a claim either way, don't make it.
2. Never invent and never guess. If a figure can't be verified, leave it out or flag it as unverified. A missing number is fine; a made-up one is not.
3. Never merge two honest methods into one figure. India's air-pollution death toll is ~1.72 million from ambient PM2.5 (Lancet Countdown 2025) *and* ~2.1 million counting household air pollution (State of Global Air 2024). Both are true. Show both, each labelled with its scope and year, and don't merge them or pick the one you prefer.

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

The byline credits the actual writer, then the team, in the form **"[Your name], for Team JanVayu"** (for example *"Komal, for Team JanVayu"*). This recognises who wrote it while keeping the collective, reviewed-by-the-team voice. If a post is a group effort with no single author, *"Team JanVayu"* alone is fine.
The title should be concrete and specific. "The Citation That Didn't Exist" beats "An Update on Sources." For a round-up of changes to the site, say what changed for the reader in plain words and leave the engineering out.
A hero image is optional. Use only openly licensed images (Wikimedia Commons or Creative Commons), and always put the credit line directly under it, with the photographer, the licence and a link. Example:
  `<small>*Delhi's skyline at sunset. Photo: Name, [CC BY 2.0](link), via Wikimedia Commons.*</small>`
Break the piece into sections with `##` headings written as plain statements and not as labels.
Close with a small call to action: invite a correction, a contribution, or a click through to the tool. End on what the reader can do. The standard sign-off is an invitation to email `contribute@janvayu.in`.

## Length

Aim for **a 4–6 minute read** (roughly 700–1,200 words). Put the reading time in the byline, at about 200 words per minute. If it's running longer, it's probably two posts.

## Getting it published

Write your draft wherever you're comfortable: a Google Doc, an email, a plain
text file. When it's ready, send it to the team at **contribute@janvayu.in**.
We'll put it live (usually within a day or two), add it to the blog and, if it
fits, feature it in the dashboard's weekly "Story of the week" slot. You don't
need to touch any code.

*Comfortable working in the project yourself?* You can add the post directly.
Just ask and we'll point you to where the posts live and how to list a
new one. It's one file.

## Before you publish: a six-point check

- [ ] Every number has a named source and a year, in-line.
- [ ] Nothing is invented or guessed; anything shaky is flagged, not stated.
- [ ] No two different methods are quietly merged into one figure.
- [ ] No jargon a citizen wouldn't know (or it's explained the first time).
- [ ] It's non-partisan: problems and sources, not parties.
- [ ] It ends with a clear, small invitation to the reader.

## A quick before/after

> **Instead of:** "Leveraging our proprietary IDW interpolation engine, we surface hyperlocal PM2.5 estimates with unprecedented granularity."
>
> **Write:** "We estimate each ward's air from the city's nearest monitors. It shows the citywide pattern and not an exact street-by-street reading, and we say so."

---

Questions, or want a second pair of eyes on a draft? Email **contribute@janvayu.in**. Being edited in the open is the whole point.

---

## Write like a teacher, not like a machine

The voice above is the standard. This section says what that looks like on the page, because the habits that make prose sound machine-written are easy to fall into and hard to see in your own draft.

Explain things the way a good professor would to an intelligent person from another field. Say what happened, why it matters, how the number was worked out and what is still uncertain. Give the reader the reasoning, not only the result. When a figure is calculated, show the calculation. When a source is secondary or two sources disagree, say so once, in the place it matters, and then move on.

Write for people, not for engineers. A reader wants to know what a page tells them and where the data came from. They do not need to know which framework drew the chart, what the file is called, how the page is cached or what the build checks. Leave the machinery out unless the page is written for contributors, and say it in everyday words when it must go in.

**Things to avoid**

- Em dashes. Use a comma, a colon, brackets or a new sentence.
- Sentences built as "not X but Y", "it is not X, it is Y" or "not only X but also Y".
- Self-answering questions ("The result? A drop.") and strings of fragments ("No data. No plan. No change.").
- Lists of exactly three adjectives or nouns by habit, and every paragraph ending on a neat closing line.
- Openers like "It is worth noting", "Importantly", "Moreover", "Furthermore" and closers like "In conclusion" or "Ultimately".
- Filler praise words: robust, crucial, vibrant, landscape, holistic, seamless, empower, unlock, pivotal, nuanced, and the rest of that family.
- Bullet points that start with a bolded label. Write a sentence instead.
- Emoji, anywhere.
- Title Case headings. Use sentence case, and write headings as plain statements.

**Things to do**

- Vary sentence length. A short sentence after a long one reads like a person.
- Use the plain verb: is, has, uses, shows, gives.
- Prefer one concrete detail, with its source and date, to a general claim.
- Say it once. If a point is made, do not restate it in a closing paragraph.
- Leave a loose end if the evidence leaves one.

`python3 scripts/check-writing-tells.py` lists the words and shapes above across the site. It reports and does not block, because a word on the list is sometimes the right one. Run it on your own post before you send it.
