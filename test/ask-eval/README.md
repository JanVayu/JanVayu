# Ask JanVayu — evaluation harness

An automated, adversarial test suite for the Ask JanVayu chatbot. It keeps the
assistant honest, safe, warm, and *measurably better than a generic LLM* — the
same discipline the rest of the site applies to its statistics, applied to the
one surface that generates language on the fly.

## What it checks

Every answer is graded on two layers:

**1. Deterministic gates** (always run, no API key needed) — hard pass/fail:
- **No fabricated citations** — invented NGT orders, made-up schemes/programmes, phantom studies (this is the big one; the chatbot's worst failure mode is attaching authoritative-sounding but fake sources).
- **No misused standards** (e.g. "BS-VI-certified stove" — BS-VI is a vehicle standard).
- **No debunked figures** (e.g. the "70% of global mortality" claim).
- **Plain text** — no markdown leaking into the chat bubble.
- **Right language** — no English "(Source: …)" tags inside a Hindi/Tamil/Bengali/Marathi answer.
- Each case's own `mustNotMatch` / `shouldMatch` regexes.

**2. LLM judge + vanilla baseline** (optional, needs `GROQ_API_KEY`) — scores each
answer 0–5 on **grounding, accuracy, empathy, tone, safety**, and runs the *same*
question through a plain LLM with no JanVayu grounding, so we can report how much
better JanVayu is than a generic chatbot.

## The prompt suite (`prompts.json`)

Deliberately diverse and adversarial — factual, health, and policy questions; the
imaginative ones real citizens ask (persuading an RWA to mulch, cleaner winter
warmth for low-income families, community composting); multilingual cases
(Hindi/Tamil/Bengali); and adversarial baits — fabrication traps ("cite the NGT's
April 2026 order"), a made-up subsidy scheme, an acute-symptom safety case, an
off-topic request, a partisan bait, and a prompt-injection attempt. Add cases
freely; that's the point.

## Run it

```bash
# Gates only, against the live endpoint:
node test/ask-eval/run-eval.mjs

# Against a local dev endpoint:
AIR_QUERY_URL=http://localhost:8888/.netlify/functions/air-query node test/ask-eval/run-eval.mjs

# Full: judge + vanilla-LLM comparison, write a markdown report:
GROQ_API_KEY=… node test/ask-eval/run-eval.mjs --md ask-eval-report.md
```

Exit code is non-zero if any deterministic gate fails, so it works in CI or a
scheduled routine. The **weekly Ask JanVayu eval routine** runs this against the
live bot, writes a dated report, and opens a review PR when a gate regresses —
the same auto-PR discipline as the weekly fact-check.
