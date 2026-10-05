# Testing the Chatbot to Make It Reliable

**Published:** 22 July 2026 | **Author:** Komal, for Team JanVayu | **Reading time:** 5 min

---

These days we ask chatbots almost everything, sometimes things that matter, like whether the air outside is safe to breathe. A chatbot gives a confident answer whether it is right or wrong. So the skill that counts is checking the answer you get back. For anyone building a chatbot the job is the same in reverse: test it hard before asking people to trust it.

That is what we did with **[Ask JanVayu](https://www.janvayu.in/ask/)**, the chatbot that answers questions about the air we breathe in India. For the past three months, trying to break it has been my personal project. Odd as it sounds, that is the kindest thing you can do for a chatbot you want people to trust.

## Ask what you already know

I began with questions I was sure about and could check: *what is PM2.5, PM10, NCAP, GRAP, emissions, AQI?* Most answers looked good but did not quite make sense. A few had wrong data, stated with full confidence. I shared every observation with the team.

Before testing further, I made a list of **45 questions I already knew the answers to**. I checked every response against a trusted source, the World Health Organization or the Central Pollution Control Board, which are the sources the chatbot itself was meant to rely on once the fixes were in.

## Check the source

A good answer is correct and shows where it came from. When I asked my questions again, the chatbot sometimes named its source and sometimes did not, which leaves a reader unsure whether to believe it.

So, drawing on years of working in this field, I wrote down **all the trusted sources the chatbot must draw from**, with clear notes on what each one can and cannot be trusted for. That list is the standard the bot's answers should meet. It covers three groups.

Government bodies and regulators: CPCB, CAQM, State Pollution Control Boards / DPCC, the SAMEER and AIRWISE–SAFAR apps, the PRANA portal, IMD & IITM's Decision Support System, and the National Green Tribunal.

Health and global bodies: WHO, the Health Effects Institute, *The Lancet*, the World Bank, NASA FIRMS (for fires), and the Air Quality Life Index.

Research groups and think tanks: CREA, CSE, CEEW, World Resources Institute, UrbanEmissions.info, the IITs (Delhi/CERCA, Bombay, Madras, Kanpur), EPIC, and the Clean Air Fund.

The rule is simple. If a number cannot be traced to a source like these, the bot should not state it as fact.

## Ask awkward questions on purpose

Next I asked the questions a chatbot *should* handle with care or refuse outright: medical advice, politics, whether to buy a particular air purifier. This stage taught me the most. Some answers were too long to read. Some were cluttered. And the chatbot sometimes replied in **Hindi even though I had asked in English**. That needed an urgent fix.

## Better, and not finished

After the JanVayu team worked through the fixes, I re-tested all 45 questions plus the tricky ones. The change was easy to see: short, clean answers that named their sources.

New problems appeared. The chatbot hit a token limit when asked the same question about many different cities in a row. And for a few smaller cities, the data simply was not available. Testing never really finishes. Each round fixes old problems and shows you new ones.

---

*You can help. If Ask JanVayu ever gives you a number without telling you where it came from, or an answer that just feels off, email us the exact question and answer at [contribute@janvayu.in](mailto:contribute@janvayu.in). Every report makes the next person's answer more trustworthy.*
