# What changed in today's redesign, and what stayed the same

**Published:** 18 September 2026 | **Author:** Team JanVayu | **Reading time:** 10 min

---

JanVayu has grown by accretion. Every few weeks something arrives that was not there before, it gets a card, and the card goes on the page below the last one. That is a good way to build a public record and a poor way to end up with a page anybody wants to read. This week we stopped adding and spent the time on how the site looks.

Nothing was removed. Every panel, every calculator, every dataset is where it was. What moved is the surface.

*Update, 2 October 2026: on 19 September the homepage body was replaced by the /try layout, so the sections described below as "How JanVayu works" and the nine-group menu bar no longer appear on the homepage. All 58 panels remain reachable from the Index.*

## The first screen is now the air

Most people arrive at JanVayu having been sent a link. Until today the first thing they met was a grid of twelve cards asking who they are: parent, student, doctor, journalist, and so on. It existed because a doctor and a schoolteacher want different things from the same data, and asking is cheaper than guessing.

We spent the first half of this week making that screen better: three cards across instead of four, a line of prose on each instead of a label, all twelve above the fold. It went from bad to decent. Then we deleted it, which is what we should have done first.

The question a person arrives with is whether it is safe to send a child outside. A twelve-option questionnaire between them and a number is a toll, however well it is laid out. The roles were a good idea in the wrong place.

So the front door now asks one question instead of twelve: *What are you breathing, right now?* You get a box for your city, ward or village, and a **Near me** button that reads the nearest station. Once you answer, the headline becomes the answer itself: *A good day to be outside*, *Cut down time outdoors*, *Keep children indoors today*. The reading in micrograms sits under it as the evidence, next to the CPCB band it falls in. Below that come three short pieces of advice, for a child, for somebody with asthma or COPD, and for somebody who was going to go running.

Which sentence you get is decided by the CPCB National AQI thresholds for the PM2.5 24-hour sub-index: 30, 60, 90, 120 and 250 µg/m³. The same reading gets a different adjective on a US scale. Using India's own thresholds means the word on our page is the word in the CPCB bulletin.

The statistic that used to open the page, 1.72 million deaths a year from the Lancet Countdown 2025, is still there. It sits in the panel of figures beside the reading, where a number that large is context.

The twelve roles are still available. All twelve sit in the header switcher, one tap away, with "Show Everything" beside them, and the fuller chooser with its explanations is behind "What these roles mean". A hint points at the control once if you have not picked one. The site now shows you the air first and offers the choice of role second.

*Update, 2 October 2026: between 19 and 22 September the header role switcher and the full-screen chooser were replaced by a single "Who you are" control in the new bar.*

We are least comfortable writing that part down, because the polish came before the question.

## Cards that sit on the page

Almost everything on JanVayu is in a box: a reading, a chart, a tracker, a testimony. Those boxes used to float, each on a soft grey shadow. With four of them on screen that looks considered. With forty it looks like a pile of paper someone knocked over.

The shadows are gone. Each card now rests on a single dark line along its bottom edge, the way a card sits on a table. It is a small change repeated several hundred times, which is the only kind of change that alters how a long page feels. The green is the same green and the type is the same type.

## A table that was cut off, and nobody could tell

Yesterday we published a comparison of JanVayu against the other Indian air-quality sites, including the rows where the others are better. It has ten columns.

On a laptop, three of them were off the edge of the screen. The table sat inside a box that scrolled sideways, and a sideways scrollbar on a page that also scrolls downwards is close to invisible. So the post did not look broken. It looked like a table with seven columns, and a reader comparing us against the others was quietly reading a shorter argument than the one we wrote.

Wide tables now use the full width of the window. We checked five desktop sizes, from 900 to 1600 pixels wide, and nothing is hidden at any of them. At 768 pixels 26 pixels were still hidden, so below that width the table now stacks instead.

A reader found this, and found the earlier fault in the same post: the table printing on top of itself on a phone. Both were invisible on the machines we build on.

## The diagram that was right and out of date at the same time

Partway down the homepage there was a drawing called "How JanVayu works". It showed what we read on the left, what we do with it in the middle, and what you get on the right. It was the clearest thing on the site for anyone deciding whether to trust us.

Every number on it was correct, and an automatic check confirmed that. What the check could not notice was a source we had never added. The drawing listed five live feeds and four satellite datasets. It left out CPCB's own daily bulletin, which we now hold as eleven years across 297 cities, and the measured station readings we check our maps against. Those are the two largest things we built this year. A reader using that drawing to decide what JanVayu is made of was looking at the 2026 version of a 2025 answer, with every figure on it accurate.

A missing source is not a wrong number, so nothing was going to flag it. We changed the drawing so it is now put together from our data each time the site is rebuilt, which means the list of what we read and what we produce is the actual list. The same drawing appears in our slide deck, and that copy had been drifting away from the homepage. Both now come from one source.

*Update, 2 October 2026: the homepage copy of this drawing was removed on 19 September; the slide-deck copy remains.*

## Nine menus became six

The menu bar carried nine groups, which filled it edge to edge and gave a reader nothing to hold on to. It is now six and an overflow: Dashboard, My Air, Places, Evidence, Accountability, Act. Health & Trends and Learn merged into Evidence, because they cover what somebody arriving with a question is looking for. Resources and About moved behind the dots.

*Update, 2 October 2026: between 19 and 22 September the dropdown menus were replaced by an Index of all 58 panels, with a filter, in the new bar.*

Every one of the fifty-nine destinations is still reachable. We did not want to take that on trust, so an automatic check now records what the menus can reach and stops the site being published if that set ever shrinks. We broke it deliberately to confirm it works.

We also found a fault, and the fault is embarrassing. The dropdowns opened when you hovered over them and in no other way. Somebody using a keyboard could tab to a group, but nothing opened, so the fifty-two destinations inside a menu could not be reached at all. That had been true for a long time.

## The site was showing two designs at once

Several readers said the page flickered between the old look and the new one on refresh. We looked for a cause twice, found nothing, and said so.

The cause was in the homepage itself. It carries a small copy of the styling so the top of the page can appear quickly, and that copy had drifted seventy-seven settings away from the real one: corner radii, shadows, centred text, a smaller headline, all frozen at the pre-refresh look. So the first paint drew the old design and the full styling then repainted the new one. That is what readers reported, and we had told them it was probably their browser's cache.

The same drift explains a complaint we failed to fix twice. The note under the headline was cut off mid-line, and both of our fixes changed the copy that loses. It now shows five whole lines, the last one fading. An automatic check now catches the two copies drifting apart, and it caught the next edit going out of step within the hour.

## Two things that were wrong for everybody

Choosing Hindi and reloading put you back into English. The language switcher worked and then quietly undid itself, because the choice was never saved. It is now remembered.

The dyslexia-friendly reading toggle was a 36 by 32 pixel button, below the 44-pixel minimum that everything around it meets. People most likely to reach for a reading aid were given the smallest target on the page.

## What we did not touch

No feature was cut. There is still no login, no advertising, no tracking of who you are and no analytics profile being built about your visit. The role you pick is stored in your own browser and you can clear it. Everything is still free, and the data is still yours to download.

## Ask JanVayu moved onto the page

Ask JanVayu answers a question about the air in ten Indian languages and names the source of every figure it uses. On the old homepage it was a 34 by 34 pixel icon with two lines of text beside it, and clicking it opened a floating widget. The full version, with the city, the ten languages and the worked examples, was a panel you could only reach through the menu.

It is now a band of its own directly under the first screen, with the question box, nine example questions you can tap, the language picker, and the answer appearing in place. It defaults to whichever place you just searched for, so asking "should I go jogging today?" after looking up Patna is a question about Patna.

Two limits apply. The answers are generated and can be wrong, which is why each one names its source. And while the interface is translated, the advisory text under the verdict is still in English, as the rest of the site's advice has always been. The verdict headline itself is translated, because it is the largest sentence on the page.

## What is still ugly

Plenty. Roughly two thirds of the site's one-off styling has not been touched yet, so several panels deeper in still look like the older version. Charts have not been revisited at all. The map is untouched.

The first screen described above started life as a separate page at [janvayu.in/try](https://www.janvayu.in/try), built to test the idea without touching the front door. That page still works, but it is now the experiment rather than the plan. It was an island, and every link on it dropped you back into the old design, which read as a seam. So we moved the part that was working onto the homepage, and clicking a panel now opens it in place under the same first screen, with the same menu, the same colours and type, and the same five languages.

*Update, 2 October 2026: on 19 September the homepage took on the /try chrome and body, so /try remains only as the candidate page.*

We would rather ship the parts that are done than hold them until everything matches. If something looks wrong to you, or looks fine and is missing a column, tell us: [contribute@janvayu.in](mailto:contribute@janvayu.in) or [GitHub](https://github.com/JanVayu/JanVayu/issues). The last two design faults we fixed were both found that way.
