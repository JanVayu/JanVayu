# A citation that did not exist: 'Krishna et al.' was really Jaganathan

**Published:** 2 July 2026 | **Author:** Team JanVayu | **Reading time:** 4 min

---

A platform that asks for public trust has to give people sources they can open and check. If we say 1.72 million deaths a year, or that a +10 µg/m³ rise brings 8.6% more all-cause mortality, you should be able to read the study behind it. So when we found that one of the most-cited studies on JanVayu pointed to a paper that does not exist, we treated it as a serious defect and fixed it across the site. Here is what happened.

## The claim

On the dashboard FAQ, the "Did You Know" strip, the Reading List, the Ask JanVayu chatbot, a quiz question, the blog and the docs, JanVayu cited an India-first causal study. Every +10 µg/m³ of annual PM2.5 is associated with roughly **8.6% higher all-cause mortality**, from a nationwide analysis in *Lancet Planetary Health* (2024). We attributed it to "Krishna et al. (2024)" and, in one place, described it as a "7-district cohort."

The name and the description were both wrong.

## How we caught it

Our own anchor card linked a DOI, `10.1016/S2542-5196(24)00248-1`, while the text beside it called the study a small cohort. A difference-in-differences DOI next to a "7-district cohort" description is a contradiction, because those are two different study designs. The mismatch made us stop and check instead of trusting the label.

## What the checks showed

We looked the DOI up on Crossref, PubMed and the Lancet itself. All three agree:

- The paper is **Jaganathan et al. (2024)**, *"Estimating the effect of annual PM2·5 exposure on mortality in India: a difference-in-differences approach."*
- It covers **655 districts, 2009–2019**, nationwide. It is not a seven-district cohort.
- No "Krishna et al. 2024" paper matches this claim. The name was made up somewhere upstream. The right study had been sitting there under the wrong label, with its real DOI already attached.

## Two more errors

Following the false name turned up two other claims pinned to the same non-existent "Krishna 2024": a line on child lung function and ovarian reserve, and a child-stunting figure. The mortality paper studies neither. The underlying facts are real and supported by other peer-reviewed work, but a real fact with a fabricated citation is still a broken citation. We removed the specific attributions. The reproductive-health card now credits WHO and peer-reviewed maternal-exposure cohorts, and the stunting line was dropped from the chatbot's reference material.

## Where it was corrected

The fix went into every page a reader can see: the FAQ, the Reading List anchor card, the Ask JanVayu methodology notes and its mortality-risk calculator, the quiz, three earlier blog posts, and the health-data docs in English, Hindi, Bengali and Marathi. "Seven districts / domestic cohort" became "655 districts, difference-in-differences" throughout.

We left one thing alone on purpose. Dated changelog and version-log entries that mention "Krishna" stay as they were, because they record what the site once said. Rewriting that history to hide the error would be dishonest in its own way.

## Why a whole post for one name

Every number on JanVayu is only as good as its source, and sources get mislabelled, go stale, or, as here, turn out to be invented. A citation can only be trusted once someone has opened it and confirmed that the paper says what we claim. This one was caught by a contradiction on our own page. The next might not be, which is why we publish our sources and invite anyone to do what we did.

If you find a claim on JanVayu whose source does not check out, write to **contribute@janvayu.in**.

---

## Sources

- [Jaganathan et al. (2024), *Lancet Planetary Health*, annual PM2.5 & mortality in India (difference-in-differences)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext)
- [DOI resolver: 10.1016/S2542-5196(24)00248-1](https://doi.org/10.1016/S2542-5196(24)00248-1)
- [JanVayu Zotero library](https://www.zotero.org/groups/6508140/janvayu/library)
