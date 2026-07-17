# The Robots That Keep JanVayu Honest: How Routines Maintain the Platform

**Published:** 18 July 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

A platform that holds *others* accountable with numbers has no business letting its own numbers rot. But websites rot quietly. A statistic that was current last winter is quietly wrong by summer. A "latest research" card ages into a fib. A chatbot, left alone, starts inventing official-sounding sources. None of this announces itself — it just sits there, eroding trust one stale line at a time.

So we decided not to rely on someone remembering. JanVayu now maintains itself with a small fleet of **scheduled routines** — automated sessions that run on a clock, do a specific job of keeping the site honest and current, and then hand their work to a human to review. Here's how it works, and why we built it this way.

## The maintenance loop

Every routine follows the same shape:

<img src="/blog/diagrams/routines-loop.svg" alt="Three routines — weekly fact-check, weekly bot eval, fortnightly staleness — each spawn a fresh session that does the work, opens a review PR that CI runs on, which a human reviews and merges to go live. Automate the vigilance; keep the human on the merge." style="width:100%;max-width:820px;display:block;margin:1.5rem auto;">

A routine fires on schedule. It spins up a **fresh, clean session** — no memory, no accumulated assumptions — that does one well-defined job. It pushes its work to a branch, and a GitHub Action opens a **pull request**. Our normal checks (accessibility, links, Lighthouse, HTML validation) run on it. And then it stops, and waits for a person.

That last part is the whole philosophy: **automate the vigilance, keep the human on the merge.** A routine can catch a stale number at 7 a.m. on a Monday without anyone awake. It cannot decide, on its own, what belongs on a public record read by citizens and journalists. So it never merges itself. Ever.

## The three routines

**1. The weekly fact-check.** Every Monday, a session extracts every checkable statistic and every hard-coded scientific constant from the site — the homepage, the data panels, the calculator code, even the little data files that inject numbers at runtime — and web-verifies each against current primary sources: the Lancet Countdown, IQAir, the Air Quality Life Index, State of Global Air, WHO, CPCB, CREA, NASA. It corrects what's stale, flags what it can't verify, and *never invents*. ([We wrote about the first run](/blog/#/posts/2026-07-17-we-factchecked-ourselves) — it changed 33 numbers, including one our own homepage was quietly serving wrong.)

**2. The weekly bot evaluation.** This one is new, and it exists because of a genuinely uncomfortable discovery. Ask JanVayu, our chatbot, is warm and practical — but when we probed it with the kind of imaginative questions real people ask ("how do I convince my RWA to try mulching instead of burning leaves?"), it did something the rest of the site would never do: it **manufactured authoritative-sounding citations** — a nonexistent "NGT order," a made-up "Green-Leaf programme," a percentage attributed to a study that doesn't exist. Ironic, on a site whose whole identity is *not making things up*.

So we built a test suite. Eighteen adversarial prompts — factual questions, the imaginative ones, multilingual cases in Hindi, Tamil and Bengali, and deliberate traps: fabrication bait, a fake subsidy scheme, an acute-symptom safety case, an off-topic request, a partisan bait, a prompt-injection attempt. Each answer is run through hard **gates** — did it invent a source? misuse a standard (a "BS-VI–certified stove"?) leak markdown? answer a Hindi question with English citations? — and, when a key is available, scored by an LLM judge on grounding, accuracy, empathy, tone and safety, *and compared to a plain LLM with none of JanVayu's grounding*. That comparison is the point: it lets us prove, week over week, that JanVayu is measurably better than a generic chatbot — not just assert it. Every Monday it runs, and if the bot regresses, it opens a PR that tightens the guardrails.

**3. The fortnightly staleness sweep.** The fact-check keeps the *numbers* current, but it doesn't notice that a workshop date has passed, that "our 13-slide deck" is now 14 slides, or that a deadline we describe as "upcoming" quietly elapsed. So twice a month, a session reads every panel and page looking for exactly that kind of ageing — past events, superseded counts, "latest" claims that no longer are — and refreshes them, or flags what needs a human's judgment.

## Why gates, not vibes

The tempting version of "an AI maintains the site" is one where a model reads everything, decides what looks wrong, and edits freely. We deliberately didn't build that. Every routine's most important output isn't the edit — it's the **evidence**: a dated report in the repository showing exactly what was checked, what changed, and why. The bot eval writes down every gate it ran. The fact-check logs every from→to with its source. If you don't trust us, you can read the receipts.

And the gates are *deterministic where it matters most*. "Did the answer contain an invented NGT order?" is a regular-expression check with a yes-or-no answer — no model judgment required, no way to be talked out of it. We save the fuzzy, model-graded scoring for the things that genuinely need judgment (was this *kind*? was this *clear*?), and we keep the non-negotiables — no fabrication, no partisanship, safety first — as rules a machine enforces the same way every single time.

## The point of all of it

This is unglamorous infrastructure, and that's exactly why it matters. Good intentions don't survive a busy month; a routine that runs every Monday does. Honesty, on a platform like this, isn't a one-time audit you can be proud of — it's a discipline that has to keep running after everyone's attention has moved on. The robots don't make JanVayu trustworthy. They make it *stay* trustworthy, on the weeks nobody's looking.

If you spot something they missed — a number that looks off, a chatbot answer that doesn't sit right — [tell us](mailto:contribute@janvayu.in). Being corrected in public, by a person, is still the most important routine of all.
