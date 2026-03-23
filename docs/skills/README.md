# Skills & AI Prompts

This section documents the AI skill files — system prompts, instruction patterns, and prompt engineering decisions — used to build and operate JanVayu.

These are not abstract guidelines. They are the actual instructions embedded in the codebase, plus the broader prompting approach used during development. If you are forking JanVayu for another city or another environmental domain, this section is where to start.

---

## What is a Skill File?

A skill file is a structured system prompt that tells an AI model how to behave in a specific context. Instead of writing a generic prompt like "answer questions about air quality", a skill file defines:

- The model's **role and persona**
- The **data it will receive** as context
- The **output format** it must follow
- The **constraints** on tone, length, and claims
- The **failure modes** to avoid

JanVayu uses skill files for all four Gemini-powered features.

---

## Skills in This Section

| Skill | File | Used In |
|-------|------|---------|
| Air Quality Assistant | [air-quality-assistant.md](air-quality-assistant.md) | `air-query.mjs` |
| Public Health Advisor | [health-advisory.md](health-advisory.md) | `health-advisory.mjs` |
| Accountability Brief Writer | [accountability-brief.md](accountability-brief.md) | `accountability-brief.mjs` |
| Anomaly Explainer | [anomaly-explainer.md](anomaly-explainer.md) | `anomaly-check.mjs` |
| Coding Practices | [coding-practices.md](coding-practices.md) | Development workflow |
| Visual Design | [visual-design.md](visual-design.md) | UI/UX decisions |
| Automation | [automation.md](automation.md) | Scheduled tasks and maintenance |

---

## General Prompting Principles Used in JanVayu

These principles guided how all skill files were written:

1. **Ground in real data** — every prompt receives actual live numbers. The model never generates from memory alone.
2. **Specify the output format exactly** — especially for the accountability brief, the model is told the exact structure to produce.
3. **Constrain length** — all prompts include explicit word or token limits to prevent over-generation.
4. **Name the failure mode** — prompts tell the model what not to do (e.g., "do not give generic advice", "do not hedge").
5. **Multilingual by default** — where appropriate, the model is instructed to respond in the user's language.
6. **Fallback gracefully** — every function has a non-AI fallback that returns raw data if the API call fails.
