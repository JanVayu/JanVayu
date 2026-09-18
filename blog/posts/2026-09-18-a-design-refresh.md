# The Site Looks Different Today. Here Is What Changed, and What Did Not

**Published:** 18 September 2026 | **Author:** Team JanVayu | **Reading time:** 5 min

---

JanVayu has grown by accretion. Every few weeks something arrives that was not
there before, and it gets a card, and the card goes on the page below the last
one. That is a good way to build a public record and a poor way to end up with
a page anybody wants to read. This week we stopped adding and spent the time on
how it looks instead.

Nothing was removed. Every panel, every calculator, every dataset is where it
was. What moved is the surface.

## The first screen

Most people arrive at JanVayu having been sent a link, and the first thing they
meet is a grid of twelve cards asking who they are: parent, student, doctor,
journalist, and so on. It exists because a doctor and a schoolteacher want
genuinely different things from the same data, and asking is cheaper than
guessing.

That screen was the worst-looking part of the site. Twelve small squares of
centred text, four to a row, with the description squeezed underneath in grey.
On a laptop the bottom row fell below the fold, so a third of the choices were
invisible unless you thought to scroll a screen that looked complete.

It now reads left to right, three cards across, each one a small line of prose
rather than a label. All twelve fit on one screen. You can still skip the whole
thing and go straight to the air quality, and that link is where it was.

## Cards that sit on the page

Almost everything on JanVayu is in a box: a reading, a chart, a tracker, a
testimony. Those boxes used to float, each on a soft grey shadow. With four of
them on screen that looks considered. With forty it looks like a pile of paper
someone knocked over.

The shadows are gone. Each card now rests on a single dark line along its
bottom edge, the way a card sits on a table rather than hovers above it. It is
a small change repeated several hundred times, which is the only kind of change
that alters how a long page feels.

The green is the same green. The type is the same type.

## A table that was cut off, and nobody could tell

Last week we published a comparison of JanVayu against the other Indian
air-quality sites, including the rows where the others are better. It has ten
columns.

On a laptop, three of them were off the edge of the screen. The table sat
inside a box that scrolled sideways, and a sideways scrollbar on a page that
also scrolls downwards is close to invisible. So the post did not look broken.
It looked like a table with seven columns, and a reader comparing us against
the others was quietly reading a shorter argument than the one we wrote.

Wide tables now push out past the text column and use the width of the window.
We checked it at five common screen sizes; nothing is hidden at any of them.

This is the second problem in that post found by a reader rather than by us.
The first was the same table printing on top of itself on a phone. Both were
invisible on the machines we build on.

## The diagram that was right and out of date at the same time

Partway down the homepage there is a drawing called "How JanVayu works". It
shows what we read on the left, what we do with it in the middle, and what you
get on the right. It is the clearest thing on the site for anyone deciding
whether to trust us.

Every number on it was correct. We have a check that runs on every change and
refuses the build if a figure on any page stops matching the data behind it,
and that check was passing.

What it could not notice is a source we simply never added. The drawing listed
five live feeds and four satellite datasets. It did not mention CPCB's own
daily bulletin, which we now hold as eleven years across 297 cities, or the
measured station readings we check our maps against. Those are the two largest
things we have built this year. A reader looking at that drawing to decide what
JanVayu is made of was looking at the 2026 version of a 2025 answer, with every
figure on it accurate.

There was no way to catch that, because a missing source is not a wrong number.

So the drawing is no longer drawn. It is assembled from the data files
themselves each time the site is built, which means the list of what we read
and what we produce is the actual list, not a memory of it. The same drawing
appears in our slide deck, and that copy had been drifting away from the
homepage without anyone noticing. Both are now the same picture for the same
reason.

## What we did not touch

No feature was cut. There is still no login, no advertising, no tracking of who
you are and no analytics profile being built about your visit. The role you
pick is stored in your own browser and you can clear it. Everything is still
free, and the data is still yours to download.

## What is still ugly

Plenty. Roughly two thirds of the site's one-off styling has not been touched
yet, which means several panels deeper in still look like the older version.
Charts have not been revisited at all. The map is untouched.

We would rather ship the parts that are done than hold them until everything
matches. If something looks wrong to you, or worse, looks fine and is missing a
column, tell us: [contribute@janvayu.in](mailto:contribute@janvayu.in) or
[GitHub](https://github.com/JanVayu/JanVayu/issues). The last two design faults
we fixed were both found that way.
