# Scheduled checks that keep JanVayu accurate

**Published:** 18 July 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

A platform that holds others to account with numbers cannot let its own numbers go stale. Websites go stale quietly, though. A statistic that was current last winter is wrong by summer. A "latest research" card ages into an error. A chatbot left alone starts inventing official-sounding sources. None of it announces itself.

So we stopped relying on someone remembering. JanVayu now has a few **scheduled routines**: automated checks that run on a fixed timetable, each doing one job to keep the site accurate and current. Then they hand their work to a person to review.

## How each check ends

<img src="/blog/diagrams/routines-loop.svg" alt="Three routines (weekly fact-check, weekly bot eval, fortnightly staleness) each do their work and propose changes, which pass automatic checks and then a human reviews and approves before anything goes live. Automate the vigilance; keep the human on the approval." style="width:100%;max-width:820px;display:block;margin:1.5rem auto;">

A routine starts fresh each time, with no memory and no leftover assumptions, and does one defined job. It proposes its changes, our usual checks run on them (accessibility, links, page speed, valid pages), and then it stops and waits for a person.

That last step is deliberate. A routine can catch a stale number at 7 a.m. on a Monday with nobody awake. It cannot decide what belongs on a public record read by citizens and journalists, so it never publishes its own changes.

## The three routines

**The weekly fact-check.** Every Monday it collects every checkable statistic and every fixed scientific constant on the site, including the small data files that put numbers onto pages as they load. It checks each against current primary sources: the Lancet Countdown, IQAir, the Air Quality Life Index, State of Global Air, WHO, CPCB, CREA and NASA. It corrects what is stale, flags what it cannot verify, and never invents. ([We wrote about the first run](/blog/#/posts/2026-07-17-we-factchecked-ourselves). It changed 33 numbers, including one our own homepage was serving wrongly.)

*Update, 2 October 2026: the scheduled runs stopped after 8 September 2026 because credits ran out; the 2 October 2026 fact-check was run by hand.*

**The weekly chatbot test.** This one exists because of an uncomfortable discovery. Ask JanVayu, our chatbot, is warm and practical. But when we put the imaginative questions real people ask to it ("how do I convince my RWA to try mulching instead of burning leaves?"), it **made up authoritative-sounding citations**: a nonexistent "NGT order," a "Green-Leaf programme" that does not exist, a percentage credited to a study that is not real. That is bad on a site whose identity is not making things up.

So we built a test. It has a set of difficult prompts: factual questions, imaginative ones, cases in Hindi, Tamil and Bengali, and deliberate traps (bait to fabricate, a fake subsidy scheme, an urgent-symptom safety case, an off-topic request, a partisan question, an attempt to hijack the bot's instructions). Every answer must pass strict rules. Did it invent a source? Did it misuse a standard, such as a "BS-VI–certified stove"? Did it answer a Hindi question with English citations? When a scoring key is available, a second model also rates the answers for grounding, accuracy, empathy, tone and safety, and compares them with a plain chatbot that has none of JanVayu's grounding. That comparison lets us show, week after week, that JanVayu does better than a generic chatbot, rather than just saying so. If the bot slips, the routine proposes tighter guardrails.

*Update, 2 October 2026: the test now has 32 cases.*

**The fortnightly check for stale content.** The fact-check keeps numbers current. It does not notice that a workshop date has passed, that "our 13-slide deck" now has 14 slides, or that a deadline called "upcoming" has gone by. Twice a month, a routine reads every panel and page for that kind of ageing: past events, outdated counts, "latest" claims that no longer are. It updates them or flags what needs a person's judgement.

## Rules first, judgement second

An AI that reads everything, decides what looks wrong and edits freely would be the easy design, and we did not build it. The most important output of each routine is the evidence: a dated report showing what was checked, what changed and why. The chatbot test records every rule it ran. The fact-check logs every change from old to new with its source. You can read the receipts.

The strict rules are fixed where it matters most. "Did the answer contain an invented NGT order?" is a plain pattern match with a yes-or-no answer, and no model can be talked out of it. Model scoring is kept for what needs judgement, such as whether an answer was kind or clear. No fabrication, no partisanship and safety first are enforced the same way every time.

## Why bother

Good intentions do not last through a busy month, and a routine that runs every Monday does. For a platform like this, honesty is a discipline that has to keep running after attention has moved on. The routines keep JanVayu trustworthy in the weeks when nobody is looking.

If you spot something they missed, such as a number that looks off or a chatbot answer that does not sit right, [tell us](mailto:contribute@janvayu.in).
