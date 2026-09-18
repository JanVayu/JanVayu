# The Site Looks Different Today. Here Is What Changed, and What Did Not

**Published:** 18 September 2026 | **Author:** Team JanVayu | **Reading time:** 8 min

---

JanVayu has grown by accretion. Every few weeks something arrives that was not
there before, and it gets a card, and the card goes on the page below the last
one. That is a good way to build a public record and a poor way to end up with
a page anybody wants to read. This week we stopped adding and spent the time on
how it looks instead.

Nothing was removed. Every panel, every calculator, every dataset is where it
was. What moved is the surface.

## The first screen, which is now the air

Most people arrive at JanVayu having been sent a link. Until today the first
thing they met was a grid of twelve cards asking who they are: parent, student,
doctor, journalist, and so on. It existed because a doctor and a schoolteacher
want genuinely different things from the same data, and asking is cheaper than
guessing.

We spent the first half of this week making that screen better. Three cards
across instead of four, a line of prose on each instead of a label, all twelve
above the fold. It went from bad to decent.

Then we deleted it, which is what we should have done first.

The question a person arrives with is whether it is safe to send a child
outside. They do not arrive asking to be classified, and a twelve-option
questionnaire standing between them and a number is a toll, however well it is
laid out. The roles were a good idea answered in the wrong place.

Nothing about them is gone. All twelve sit in the header switcher, one tap, with
"Show Everything" beside them, and the fuller chooser with its explanations is
still there behind "What these roles mean". A hint points at the control once if
you have not picked one. What changed is that the site now shows you the air
first and offers the lens second.

That correction is the one we are least comfortable writing down, because the
polish came before the question.

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

## Nine menus became six

The navigation bar carried nine groups, which filled it edge to edge and gave a
reader no shape to hold on to. It is now six and an overflow: Dashboard, My Air,
Places, Evidence, Accountability, Act. Health & Trends and Learn merged into
Evidence, because the thing they have in common is what somebody arriving with a
question is actually looking for. Resources and About moved behind the dots.

Every one of the fifty-nine destinations is still reachable. We were not willing
to take that on trust, so there is now a check that records what the navigation
can reach and fails the build if that set ever shrinks. We broke it deliberately
to confirm it fails.

Two faults turned up while doing the work, and the second is the more
embarrassing. The dropdowns opened on hover and on nothing else: no JavaScript
opened them, so tabbing to a group focused a button that did nothing visible,
and the fifty-two destinations inside a menu could not be reached from a keyboard
at all. That had been true for a long time.

## The site was serving two designs at once

Several readers said the page flickered between the old look and the new one on
refresh. We looked at the service worker twice, found nothing, and said so.

It was not the service worker. The homepage inlines a copy of the stylesheet so
the top of the page can paint before the full 125KB file arrives, and that copy
had drifted seventy-seven properties away from the real one — corner radii,
shadows, centred text, a smaller headline, all frozen at the pre-refresh look.
So the first paint drew the old design and the stylesheet then repainted the new
one. Exactly what was reported, by people who could see it happening and were
told it was probably a cache.

The same drift explains a complaint we failed to fix twice. The note under the
headline was cut off mid-line, and both of our fixes edited the copy of the rule
that loses. The live value clamped the note to four and a half lines, so the
fifth was sliced through the middle of its letters. It is five whole lines now,
the last one fading.

There is a check for this too, and it earned its keep within the hour: it caught
the next edit going out of step before it shipped.

## Two things that were wrong for everybody

Choosing Hindi and reloading put you back into English. The language switcher
worked and then quietly undid itself, because the choice was never written down
anywhere. It is now remembered.

And the dyslexia-friendly reading toggle was a 32-pixel button, under the
44-pixel minimum everything around it meets. A reading aid with a small target
is a poor joke on the people most likely to reach for it.

## What we did not touch

No feature was cut. There is still no login, no advertising, no tracking of who
you are and no analytics profile being built about your visit. The role you
pick is stored in your own browser and you can clear it. Everything is still
free, and the data is still yours to download.

## What is still ugly

Plenty. Roughly two thirds of the site's one-off styling has not been touched
yet, which means several panels deeper in still look like the older version.
Charts have not been revisited at all. The map is untouched.

There is also a candidate homepage at [janvayu.in/try](/try), which is a
different answer to the same question: one line, one field, and a sentence you
can act on, with the reading as the evidence for it rather than the point of the
page. It is not the homepage and may never be. Look at it on a phone and tell us
whether it is better than what you get at the front door today.

We would rather ship the parts that are done than hold them until everything
matches. If something looks wrong to you, or worse, looks fine and is missing a
column, tell us: [contribute@janvayu.in](mailto:contribute@janvayu.in) or
[GitHub](https://github.com/JanVayu/JanVayu/issues). The last two design faults
we fixed were both found that way.
