# Workshop decks

Four air-quality workshops, written as plain Markdown so anyone can run them
without asking us first.

| File | Session | Length | Steps | Quizzes |
|---|---|---|---|---|
| `know-your-ward.md` | Know Your Ward | 30 minutes | 6 | 1 |
| `rti-clinic.md` | RTI Clinic | 45 minutes | 7 | 1 |
| `walkthrough.md` | JanVayu Walkthrough | 1 hour | 12 | 1 |
| `educators.md` | Air-Literacy for Educators | 1 hour | 9 | 1 |

Step and quiz counts are checked against the files by
`scripts/check-workshop-decks.py`, so this table cannot drift away from them.

They are served at `https://www.janvayu.in/workshops/<name>.md` and linked from
the Workshops panel.

## How to run one

**Live, with a class.** Import the file into
[Workshopy](https://workshopy.io), which turns Markdown into a live session:
each `#` heading becomes a step, each `#[quiz]` becomes a graded quiz, and
participants join with a six-character code and no account. You get a dashboard
showing who is done and who is stuck.

**On a projector or a handout.** They are ordinary Markdown. Any renderer works,
and so does printing.

**Cut down or translated.** The licence below permits it, and local numbers make
a session better. Every figure names its source so you can check it before you
change it.

## Two constraints worth knowing before you plan

**Workshopy's free plan caps a session at 45 minutes**, with up to 30
participants and one live session at a time. `know-your-ward` and `rti-clinic`
fit inside that. The two one-hour decks do not, so each carries a marked split
point: run the first half free, or run the whole hour on a paid plan.

**Nothing here depends on Workshopy.** It is the tool we happen to use. The
content is a text file and stays one.

## Editing them

Keep three things if you change anything.

**Every figure names its source.** That is the rule the rest of this repository
runs on and these files are not exempt. If you cannot name where a number came
from, take it out rather than rounding it.

**The live-versus-annual distinction survives.** All four decks teach it, because
it is the mistake that turns a good session into a confidently wrong audience.
A live reading and a 2024 annual mean must never appear in one sentence as
though they were the same kind of thing.

**The caveats stay attached to the findings.** The de-weathering result is not
proof that policy caused anything. The cigarette equivalence is a dose
illustration, not a clinical claim. A city missing from the 44 lacks monitors,
not clean air. Dropping those lines makes the decks shorter and worse.

## Licence

CC BY-NC-SA 4.0, like the rest of JanVayu's content. Use them, adapt them,
translate them, teach with them. Attribute JanVayu and share alike.

Corrections and additions: contribute@janvayu.in
