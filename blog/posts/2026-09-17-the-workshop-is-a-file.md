# The Workshop Is a File Now

**Published:** 17 September 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

JanVayu has offered four free workshops for about a year: a tour of the platform,
an RTI clinic, a ward-map session, and one written for teachers. They are booked
on request, we run them over a video call, and they are genuinely free.

They are also rate-limited by us. We are a small volunteer team, our calendar is
the bottleneck, and a session that needs one of us present is a session that does
not happen when we are busy. A teacher in Nagpur who wants to run the ward-map
exercise on Thursday should not have to wait for our Thursday.

So the four sessions are now four files.

<div class="jv-dgm jv-dgm-wide"><img src="/blog/diagrams/workshop-decks.svg" alt="One Markdown file becomes a whole workshop. The file uses three marks: a line starting with a single hash becomes a step, a line reading hash-bracket-quiz makes that step a graded quiz, and inside a quiz a dash-bracket-x marks the correct option. The same file can be run four ways with no conversion: as a live session where people join with a six-character code and the facilitator sees who is stuck, on a projector, as a printed handout, or translated into another language. JanVayu publishes four decks. Know Your Ward runs thirty minutes and ends with you knowing your own neighbourhood's annual PM2.5. The RTI Clinic runs forty-five minutes and ends with a filed Right to Information request, not a drafted one. The JanVayu Walkthrough runs an hour and ends with an alert set for your own city. Air-Literacy for Educators runs an hour and ends with a lesson and an assessment a teacher can use on Monday. Two limits: a free Workshopy session is capped at forty-five minutes and thirty participants, so the two hour-long decks carry a marked split point; and nothing in the decks depends on that tool, because the content is a text file and stays one."></div>
<div class="jv-dgm jv-dgm-tall"><img src="/blog/diagrams/workshop-decks-tall.svg" alt="" aria-hidden="true"></div>

They live at [janvayu.in/workshops](https://www.janvayu.in/workshops/README.md)
and each one is linked from its session on the
[Workshops panel](https://www.janvayu.in/#workshops).

## What is in them

**Know Your Ward**, 30 minutes. You find your own ward or village on the map,
write down its annual PM2.5, and learn the one distinction that stops people
misreading everything else on that page: the dots are live hourly readings from
roughly 565 monitors, and the shading underneath is a 2024 annual average
estimated from satellite. They answer different questions and must never appear
in the same sentence. It ends with heat and tree cover on the same boundaries,
including the correction we had to make ourselves, that green cover counts
cropland and so tells you almost nothing about trees.

**RTI Clinic**, 45 minutes. It ends with a filed Right to Information request.
Not a drafted one. That distinction is the whole design: a clinic that produces
forty good drafts and no filings has produced nothing, and we have watched that
happen. You pick one of four subjects (the monitors, the money, the polluters,
the schools), the RTI Assistant pre-fills the Public Information Officer and the
statutory anchors, and the last step is the ₹10 payment and the registration
number.

**JanVayu Walkthrough**, 1 hour. The tour: the scale of the problem, why PM2.5
and not AQI, your own number, what that number does to a body, your ward rather
than your city, the instrument record that checks the modelled layers, the
de-weathering result for 44 cities, and the NCAP and GRAP trackers. It ends with
one concrete action, which for most people is setting an alert.

**Air-Literacy for Educators**, 1 hour. Written for Class 9 and above, assuming
no science background in the teacher. The seven learning games, the ward-map
exercise, and the 10-question self-check used as assessment so the teacher does
not have to write one.

## Markdown, and why that matters more than the platform

The files use three marks and no more. A line beginning with `#` is a step. A
line reading `#[quiz]` makes that step a graded quiz. Inside a quiz, `- [x]`
marks the correct option and `- [ ]` marks a wrong one.

That is the authoring format of [Workshopy](https://workshopy.io), which turns
such a file into a live session: participants join with a six-character code and
no account, mark each step done or stuck, and the facilitator watches a dashboard
showing who is where. We tried it and it does what it says.

But the reason we wrote them this way is not Workshopy. It is that a Markdown
file is not a hostage. The same four files open in any text editor, render in
any Markdown viewer, project from a laptop, print onto paper for a room with no
signal, and translate into Marathi or Bhojpuri without asking anyone's
permission. If Workshopy raises its prices or closes, our workshops are four
text files, exactly as they were.

The licence says the same thing. The decks are CC BY-NC-SA 4.0, like the rest of
JanVayu's content, so you may cut them, translate them, and drop in your own
city's figures. Attribute us and share alike.

## Two limits, stated up front

**Workshopy's free plan stops a session at 45 minutes**, with up to 30
participants and one live session at a time. Know Your Ward and the RTI Clinic
fit inside that. The two hour-long decks do not, so each carries a marked split
point where a free session should end. We would rather write that into the file
than let a facilitator discover it at minute 44 with a room watching.

**Every figure in the decks names its source.** That is the rule the rest of this
repository runs on and these files are not exempt. It also means you can check a
number before you edit it, which matters if you are translating.

## The part that will rot, and what we did about it

A workshop deck is exactly the kind of artefact that goes quietly wrong. Nobody
opens it between sessions. It renders perfectly whatever state it is in.

Three specific ways, and `scripts/check-workshop-decks.py` now fails the build on
each:

**A deck path with no file behind it.** The Workshops panel builds its download
link from `data/workshops.json`. Rename a file and the link 404s with nothing on
screen to say so.

**A quiz question with no correct answer.** This is the good one. Workshopy
grades `- [x]` as correct and `- [ ]` as wrong. A question where every option is
`- [ ]` imports without complaint, renders exactly like a working question, and
cannot be answered correctly by anyone in the room. There is nothing to see. We
confirmed the guard catches it by deleting an `x` from a real answer and watching
the build fail.

**A table that has drifted.** The README states each deck's step and quiz count.
Those are now recomputed from the files themselves, so the table cannot describe
a deck that no longer exists in that shape.

The guard is deliberately network-free, like every other check in this
repository. It reads files and asserts relationships between them. It never asks
workshopy.io whether the syntax is still what it was, because a check that can
fail for someone else's reasons gets ignored, and an ignored check is worse than
no check.

## The sessions are still there

None of this replaces the facilitated version. If you would rather we ran it, the
booking form on the [Workshops panel](https://www.janvayu.in/#workshops) still
works, it is still free, and it still comes with one of us on the call. We
schedule around your availability.

What has changed is that our availability is no longer the limit.

---

**If you run one of these**, we would like to know how it went, and particularly
what confused people. The ward-map exercise has already taught us that "green
cover" misleads almost everyone on first contact, which is why the correction is
now written into the deck rather than left to the facilitator to remember. Write
to **contribute@janvayu.in**.

**Sources.** Figures in the decks are the site's own, each named in place:
national and per-ward air from SatPM2.5 V6GL03 (ACAG / Washington University,
2024); the measured station record from the
[India Air Quality Database](https://airquality.xkdr.org) (XKDR Forum, CC BY
4.0); the de-weathering result from `data/deweathered-national.json`, method
after Grange et al. (2018), *Atmospheric Chemistry and Physics* 18, 6223–6239;
mortality from Lancet Countdown 2025; life expectancy from AQLI 2025; the
national average from IQAir 2025; NCAP compliance from CREA, *Tracing the Hazy
Air*, 2026. The decks themselves are in `workshops/`, the guard is
`scripts/check-workshop-decks.py`.
