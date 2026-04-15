# JanVayu — Statement of Work for Research Collaborators

**Platform:** [janvayu.in](https://www.janvayu.in) | **Repository:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu) | **Research Library:** [Zotero](https://www.zotero.org/groups/6508140/janvayu/library)

**About JanVayu:** India's independent, citizen-led air quality platform — combining live data, health impact analysis, budget tracking, and government accountability. Non-partisan, CC BY-NC-SA 4.0.

---

## Overview

JanVayu is a platform in active development. It is fully public and open-source, with a small founding team. Collaborators contribute under their own name, with full attribution. Work spans five broad domains: research, policy analysis, content, technical, and community. You do not need to work across all domains — most collaborators anchor in one or two areas.

---

## Workstream A: Research & Data

This is the backbone of the platform's credibility. JanVayu cites only peer-reviewed research, official datasets, and verified RTI responses — no secondary aggregation.

**What this involves:**

- Identifying, reading, and adding papers to the [JanVayu Zotero group](https://www.zotero.org/groups/6508140/janvayu/library), with a focus on PM2.5 health burden, source apportionment, occupational exposure, indoor air, and economic cost
- Translating research findings into platform-legible numbers (e.g., updating GEMM model parameters when new GBD data drops, revising city-level mortality estimates)
- Writing data notes and methodology documentation when numbers are updated
- Compiling state and city-level data that currently has gaps — the platform covers 30+ cities but is thin on second-tier cities and state-level NCAP data
- Supporting the environmental justice section with disaggregated data on caste, gender, occupation, and geography

**Typical deliverable:** Annotated research entry in Zotero + a short update note for the platform changelog.

---

## Workstream B: Policy Analysis & Accountability

This is the platform's core differentiator from a standard AQI dashboard. The accountability and promise-tracking sections require ongoing, substantive policy research.

**What this involves:**

- Updating the Promises vs. Reality tracker when new government statements are made or deadlines pass
- Tracking NCAP fund utilization data (CREA reports, CAG audits, RTI responses) and updating the Budget Tracker
- Monitoring Supreme Court and NGT orders on air quality and updating the Court Orders tracker
- Analyzing sector-specific policies (EVs, industrial standards, brick kilns, crop residue, GRAP) and writing brief assessments
- Writing policy briefs that can go on the blog and be shared with journalists and policymakers
- Reviewing the policy recommendation sections and flagging where evidence has been updated

**Typical deliverable:** Updated tracker entry + one-paragraph evidence note, or a 600–1000 word policy brief for the blog.

---

## Workstream C: Writing & Content

JanVayu launched a blog in April 2026. It needs a consistent stream of substantive, evidence-based writing — not opinion, not advocacy, but grounded analysis written for a citizen audience.

**What this involves:**

- Blog posts on specific policy developments, research findings, or accountability events (600–1500 words, first-person analytical voice, no buzzwords)
- Deep-dive policy reviews of new government documents, schemes, or court orders
- Updating platform explainers (what is GRAP, what is source apportionment, why PM2.5 not AQI)
- Glossary entries and citizen-facing health explainers
- RTI template drafting and updating as procedures change
- Translating or adapting content for Hindi, Tamil, Marathi, or Bengali sections (native speakers preferred for accuracy)

**Typical deliverable:** Blog post or explainer page, ready to publish with sources linked.

---

## Workstream D: Technical

The platform is built in HTML/CSS/JS, hosted on Netlify, with Netlify Functions for serverless features. The repository is public and MIT-licensed.

**What this involves:**

- Moving the live data sections out of demo mode — connecting city-level AQI feeds cleanly for more cities
- Improving mobile performance (there are open GitHub issues for this: [#3](https://github.com/JanVayu/JanVayu/issues/3) and [#4](https://github.com/JanVayu/JanVayu/issues/4) on WCAG 2.1 compliance)
- Building or improving the hyperlocal and AQI forecast sections
- Improving the "Ask JanVayu" AI feature — prompt quality, response accuracy, city-specific context
- Data pipeline work: automated updates for budget tracker tables, court orders, promise tracker
- Any work on the social feeds, alert system, or school closure predictor

**Typical deliverable:** Pull request on the [GitHub repository](https://github.com/JanVayu/JanVayu), with documentation.

---

## Workstream E: Community & Outreach

This is the least developed workstream and arguably the most important for long-term impact.

**What this involves:**

- Building relationships with journalists who cover air quality, health, and environment — sharing platform data and offering to brief them
- Identifying and engaging civil society organizations, RWAs, parent networks, and teacher associations who could use the platform
- Managing citizen voices — collecting and curating testimonials and community observations
- Supporting RTI filing drives or accountability campaigns using platform data
- Outreach to medical communities (doctors, health workers) for the health advisory sections

**Typical deliverable:** Documented partnership, published citizen voice, or media placement.

---

## How Collaboration Works

| Area | What you need |
|---|---|
| Access | GitHub username (for code/docs), Zotero account (for research library) |
| Attribution | All contributors credited by name on the platform and in the repository |
| Communication | Email at [contribute@janvayu.in](mailto:contribute@janvayu.in), [GitHub Discussions](https://github.com/JanVayu/JanVayu/discussions) |
| Commitment | No minimum — do what you can, when you can |
| Compensation | Volunteer-based. If funding is secured, paid roles will be offered to active contributors first |

---

## What JanVayu Does NOT Need

To keep the platform focused: JanVayu does not need general data visualizations that duplicate existing dashboards, AQI apps, or content that is not India-specific. It also does not publish opinion or advocacy content — analysis only.

---

*Last updated: April 2026. Contact: [contribute@janvayu.in](mailto:contribute@janvayu.in)*
