# The Citation That Didn't Exist: How We Found "Krishna et al." Was Really Jaganathan

**Published:** 2 July 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

An accountability platform lives or dies by its citations. If we ask the public to trust a number — 1.72 million deaths a year, a +10 µg/m³ rise causing 8.6% more all-cause mortality — we owe them a source they can open, read, and check. So when we found that one of the most-cited studies on JanVayu pointed to a paper that does not exist, we treated it as a serious defect and fixed it site-wide. This is what happened, because the process is as important as the correction.

## The claim

Across the dashboard FAQ, the "Did You Know" strip, the Reading List, the Ask JanVayu chatbot, a quiz question, the blog and the docs, JanVayu cited an India-first causal study: every +10 µg/m³ of annual PM2.5 is associated with roughly **8.6% higher all-cause mortality**, from a nationwide analysis in *Lancet Planetary Health* (2024). We attributed it to "Krishna et al. (2024)" and, in one place, described it as a "7-district cohort."

Both the name and the description were wrong.

## The catch

The tell was internal inconsistency. Our own anchor card linked a DOI — `10.1016/S2542-5196(24)00248-1` — while the text beside it called the study a small cohort. A difference-in-differences DOI sitting next to a "7-district cohort" description is a contradiction: those are two different study designs. That mismatch is what made us stop and verify rather than trust the label.

## The verification

We resolved the DOI against Crossref, PubMed and the Lancet itself. All three agree:

- The paper is **Jaganathan et al. (2024)**, *"Estimating the effect of annual PM2·5 exposure on mortality in India: a difference-in-differences approach."*
- It is a **nationwide** design across **655 districts, 2009–2019** — not a seven-district cohort.
- There is **no** "Krishna et al. 2024" paper matching this claim. The name was fabricated somewhere upstream; the correct study had been hiding in plain sight under the wrong label, with its real DOI already attached.

## Two bonus errors

Chasing the fake name surfaced two *other* claims pinned to the same non-existent "Krishna 2024" — a child lung-function / ovarian-reserve line and a child-stunting figure — neither of which the mortality paper studies at all. The underlying facts are real and supported by other peer-reviewed work, but a real fact with a fabricated citation is still a broken citation. We removed the specific attributions: the reproductive-health card now credits WHO and peer-reviewed maternal-exposure cohorts, and the stunting line was dropped from the chatbot's reference block.

## What changed, everywhere

The correction touched every current-facing surface at once — the FAQ schema, the Reading List anchor card, the Ask JanVayu backend's methodology block and its mortality-risk calculator comment, the quiz, three earlier blog posts, and the health-data docs in English, Hindi, Bengali and Marathi. "Seven districts / domestic cohort" became "655 districts, difference-in-differences" throughout.

One deliberate exception: historical changelog and version-log entries that mention "Krishna" are left intact. They are dated records of what the site once said. Rewriting history to hide an error is its own kind of dishonesty.

## Why we're writing a whole post about one name

Because the fix is the easy part. The habit is the point. Every number on JanVayu is only as good as the source behind it, and sources rot, get mislabelled, or — as here — get invented. The safeguard is not "trust the citation"; it is "open the citation and check that the paper says what we claim it says." This one was caught by our own contradiction. The next one might not be, which is why we publish our sources in the open and invite anyone to do exactly what we did.

If you spot a claim on JanVayu whose source doesn't check out, tell us: **contribute@janvayu.in**.

---

## Sources

- [Jaganathan et al. (2024), *Lancet Planetary Health* — annual PM2.5 & mortality in India (difference-in-differences)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext)
- [DOI resolver — 10.1016/S2542-5196(24)00248-1](https://doi.org/10.1016/S2542-5196(24)00248-1)
- [JanVayu Zotero library](https://www.zotero.org/groups/6508140/janvayu/library)
