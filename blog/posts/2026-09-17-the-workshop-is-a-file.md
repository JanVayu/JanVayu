# The workshop is a file now

**Published:** 17 September 2026 | **Author:** Team JanVayu | **Reading time:** 6 min

---

JanVayu has offered free workshops since April, and there are now four: a tour of the platform, an RTI clinic, a ward-map session, and one written for teachers. They are booked on request and we run them over a video call.

That limits how many can happen. We are a small volunteer team, our calendar is the bottleneck, and a session that needs one of us present does not happen when we are busy. A teacher in Nagpur who wants to run the ward-map exercise on Thursday should not have to wait for our Thursday.

So each of the four sessions is now a complete, ready-to-run script that anyone can use without us.

<div class="jv-dgm jv-dgm-wide"><img src="/blog/diagrams/workshop-decks.svg" alt="A diagram of one plain text file becoming a whole workshop. The file shown is a short sample in which a line starting with a hash is a step, a quiz is marked as a quiz, and the right answer is ticked. The same file can be run four ways: as a live session where people join with a six-character code and the person leading sees who is stuck, on a projector, as a printed handout, or translated into another language. Four sessions are listed with their length and how each ends. Know Your Ward runs 30 minutes and ends with your own ward's annual PM2.5. The RTI Clinic runs 45 minutes and ends with a filed Right to Information request, not a drafted one. The JanVayu Walkthrough runs an hour and ends with an alert set for your city. Air-Literacy for Educators runs an hour and ends with a lesson and a test a teacher can use on Monday. A note at the foot gives the two limits described on this page: a free Workshopy session stops at 45 minutes and 30 people, so the two hour-long sessions carry a marked split point, and nothing depends on that tool because the content is a text file."></div>
<div class="jv-dgm jv-dgm-tall"><img src="/blog/diagrams/workshop-decks-tall.svg" alt="" aria-hidden="true"></div>

They are at [janvayu.in/workshops](https://www.janvayu.in/workshops/README.md), and each one is linked from its session on the [Workshops panel](https://www.janvayu.in/#workshops).

## What is in them

Know Your Ward takes 30 minutes. You find your own ward or village on the map and write down its annual PM2.5. You also learn the one distinction that stops people misreading the rest of the page: the dots are live hourly readings from roughly 565 monitors, and the shading underneath is a 2024 annual average estimated from satellite. They answer different questions and must never appear in the same sentence. The session ends with heat and tree cover on the same boundaries, including a correction we had to make ourselves: green cover counts cropland, so it tells you almost nothing about trees.

The RTI Clinic takes 45 minutes and ends with a filed Right to Information request, not a drafted one. That is the point of the design. A clinic that produces forty good drafts and no filings has produced nothing, and we have watched that happen. You pick one of four subjects (the monitors, the money, the polluters, the schools), the RTI Assistant pre-fills the Public Information Officer and the legal references, and the last step is the ₹10 payment and the registration number.

The JanVayu Walkthrough takes an hour. It covers the scale of the problem, why PM2.5 and not AQI, your own number, what that number does to a body, your ward rather than your city, the instrument record that checks the modelled layers, the de-weathering result for 44 cities, and the NCAP and GRAP trackers. It ends with one concrete action, which for most people is setting an alert.

Air-Literacy for Educators also takes an hour. It is written for Class 9 and above and assumes no science background in the teacher. It includes the seven learning games, the ward-map exercise, and a 10-question self-check that serves as the assessment, so the teacher does not have to write one.

## Why a plain file

The sessions are written as plain text files, and they run on [Workshopy](https://workshopy.io), a free tool where participants join with a six-character code and no account, mark each step done or stuck, and the person leading watches a dashboard showing who is where. We tried it and it does what it says.

We did not want the workshops to depend on it, though. The same files open in any text editor, project from a laptop, print onto paper for a room with no signal, and translate into Marathi or Bhojpuri without asking anyone's permission. If Workshopy raises its prices or closes, our workshops are exactly what they were.

The licence is CC BY-NC-SA 4.0, like the rest of JanVayu's content, so you may cut the decks, translate them, and drop in your own city's figures. Attribute us and share alike.

## Two limits

Workshopy's free plan stops a session at 45 minutes, with up to 30 participants and one live session at a time. Know Your Ward and the RTI Clinic fit inside that. The two hour-long decks do not, so each marks a split point where a free session should end. We would rather write that into the deck than have the person leading discover it at minute 44 with a room watching.

Every figure in the decks names its source, as it does everywhere on this site. That lets you check a number before you change it, which matters if you are translating.

## Keeping them correct

A workshop deck goes wrong quietly. Nobody opens it between sessions, and it looks fine whatever state it is in. Two failures worried us most. A download link can point at a file that has been renamed, and nothing on screen says so. A quiz question can end up with no correct answer marked, which looks exactly like a working question and cannot be answered correctly by anyone in the room. We now check for both automatically before anything is published. We confirmed the second check works by removing the correct answer from a real question and watching it fail.

The decks also carry the counts of steps and quiz questions in their descriptions, and those are recomputed from the decks themselves, so a description cannot drift from the deck it describes.

## The live sessions continue

None of this replaces the live version. If you would rather we ran it, the booking form on the [Workshops panel](https://www.janvayu.in/#workshops) still works, it is still free, and it still comes with one of us on the call. We schedule around your availability. What has changed is that our availability is no longer the limit.

---

If you run one of these, we would like to know how it went, and especially what confused people. The ward-map exercise has already taught us that "green cover" misleads almost everyone on first contact, which is why the correction is now written into the deck rather than left to the person leading to remember. Write to **contribute@janvayu.in**.

**Sources.** Figures in the decks are the site's own, each named in place: national and per-ward air from SatPM2.5 V6GL03 (ACAG / Washington University, 2024); the measured station record from the [India Air Quality Database](https://airquality.xkdr.org) (XKDR Forum, CC BY 4.0); the de-weathering result from `data/deweathered-national.json`, method after Grange et al. (2018), *Atmospheric Chemistry and Physics* 18, 6223–6239; mortality from Lancet Countdown 2025; life expectancy from AQLI 2025; the national average from IQAir 2025; NCAP compliance from CREA, *Tracing the Hazy Air*, 2026. The decks themselves are in `workshops/`.
