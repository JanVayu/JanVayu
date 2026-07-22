# Testing the Chatbot to Make It Reliable

**Published:** 22 July 2026 | **Author:** Komal, for Team JanVayu | **Reading time:** 5 min

---

These days we ask chatbots almost everything. Sometimes we ask them things that really matter — like whether the air outside is safe to breathe. But a chatbot will give you a confident answer whether it is right or wrong. So the real skill now is not just asking good questions. It is checking the answer you get back. And if you are the one building the chatbot, the job is the same in reverse: test it hard before you ask people to trust it.

That is what we did with **[Ask JanVayu](https://www.janvayu.in/ask/)**, the chatbot that answers questions about the air we breathe in India. For the past three months, trying to break it has been my personal project. Strange as it sounds, that is the kindest thing you can do for a chatbot you want people to trust.

## Ask stuff you know

I began with questions I was sure about and could check: *what is PM2.5, PM10, NCAP, GRAP, emissions, AQI?* Most answers were nice to look at but didn't quite make sense. A few had wrong data — stated with full confidence. I shared every observation with the team.

Then, before testing any further, I made a list of **45 questions I already knew the answers to**, and checked every response against a trusted source — the World Health Organization, the Central Pollution Control Board — the sources the chatbot itself was meant to rely on once the fixes were in.

## Check the source

A good answer does two jobs: it is correct, and it shows where it came from. When I asked my questions again, the chatbot sometimes named its source and sometimes did not — which leaves a reader unsure whether to believe it.

So, drawing on years of working in this field, I wrote down **all the trusted sources the chatbot must draw from** — government bodies, health organisations, research institutes and think tanks — with clear notes on what each one can, and cannot, be trusted for. That list now lives at the heart of how the bot is allowed to answer. In short, it pulls from:

- **Government & regulators** — CPCB, CAQM, State Pollution Control Boards / DPCC, the SAMEER and AIRWISE–SAFAR apps, the PRANA portal, IMD & IITM's Decision Support System, and the National Green Tribunal.
- **Health & global bodies** — WHO, the Health Effects Institute, *The Lancet*, the World Bank, NASA FIRMS (for fires), and the Air Quality Life Index.
- **Research & think tanks** — CREA, CSE, CEEW, World Resources Institute, UrbanEmissions.info, the IITs (Delhi/CERCA, Bombay, Madras, Kanpur), EPIC, and the Clean Air Fund.

The rule is simple: if a number can't be traced to a source like these, the bot shouldn't state it as fact.

## Get weird on purpose

Next, I asked the questions a chatbot *should* be careful with, or refuse outright — medical advice, politics, or whether to buy a particular air purifier. This stage taught me the most. Some answers were too long to read. Some were cluttered. And oddest of all, the chatbot sometimes replied in **Hindi even though I had asked in English**. That one needed an urgent fix.

## Fixed, but not finished

After the JanVayu team worked through the fixes, I re-tested all 45 questions, plus the tricky ones. The change was easy to see: short, clean answers that named their sources.

But new problems appeared. The chatbot hit a token limit when asked the same question about many different cities in a row. And for a few smaller cities, the data simply wasn't available. That is the honest truth of this work: **testing never really finishes.** Each round fixes old problems and introduces you to new ones.

Which is exactly why it's worth doing — and why it never stops.

---

*You can help. If Ask JanVayu ever gives you a number without telling you where it came from — or an answer that just feels off — email us the exact question and answer at [contribute@janvayu.in](mailto:contribute@janvayu.in). Every report makes the next person's answer more trustworthy.*
