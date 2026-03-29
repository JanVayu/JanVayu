// Netlify Function: Hindi → English Supreme Court Petition Translator
// Experiment: court-translator
// Uses Sarvam.ai for base translation + Groq/Llama 3.3 70B for legal terminology refinement

const MAX_CHUNK = 1800; // under Sarvam's 2000 char limit for sarvam-translate:v1

function splitIntoChunks(text) {
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let current = "";

  for (const para of paragraphs) {
    if (para.length === 0) continue;

    if (para.length <= MAX_CHUNK) {
      if (current.length + para.length + 2 <= MAX_CHUNK) {
        current += (current ? "\n\n" : "") + para;
      } else {
        if (current) chunks.push(current);
        current = para;
      }
    } else {
      if (current) { chunks.push(current); current = ""; }
      // Split long paragraph on sentence boundaries (purna viram or period)
      const sentences = para.split(/(?<=[।.])\s*/);
      for (const sentence of sentences) {
        if (!sentence) continue;
        if (sentence.length > MAX_CHUNK) {
          // Hard split for extremely long sentences (rare)
          for (let i = 0; i < sentence.length; i += MAX_CHUNK) {
            chunks.push(sentence.slice(i, i + MAX_CHUNK));
          }
        } else if (current.length + sentence.length + 1 <= MAX_CHUNK) {
          current += (current ? " " : "") + sentence;
        } else {
          if (current) chunks.push(current);
          current = sentence;
        }
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateChunk(text) {
  const res = await fetch("https://api.sarvam.ai/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": process.env.SARVAM_API_KEY,
    },
    body: JSON.stringify({
      input: text,
      source_language_code: "hi-IN",
      target_language_code: "en-IN",
      model: "sarvam-translate:v1",
      mode: "formal",
      numerals_format: "international",
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Sarvam API ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.translated_text;
}

async function refineLegalTranslation(rawTranslation) {
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a legal translation editor specialising in Indian Supreme Court and High Court petitions. Your task is to refine a machine-translated English text so it reads like a professional court document.

Rules:
1. Use standard Indian legal English terminology consistently:
   - Petitioner, Respondent, Hon'ble, Learned (counsel/judge), Petition, Writ Petition, Special Leave Petition
   - Article (of the Constitution), Section (of an Act), Rule, Order, Clause
   - Prayer, Grounds, Cause of Action, Synopsis, List of Dates
   - Judgment, Decree, Order, Appeal, Review, Revision
   - Act, Statute, Ordinance, Regulation, Notification, Gazette
   - Affidavit, Vakalatnama, Memo of Parties, Court Fee
   - "passed an order" (not "gave an order"), "filed a petition" (not "submitted")
   - "disposed of" (not "resolved"), "set aside" (not "cancelled")
2. Preserve case citation formats (AIR, SCC, SCR references) exactly as they appear.
3. Maintain formal legal register — no contractions, no colloquialisms.
4. Preserve the original paragraph structure and section headings.
5. Do NOT add, remove, or summarise any content. Only refine the language.
6. If a Hindi term has no direct English equivalent, keep it transliterated in italics with the English meaning in parentheses on first use.
7. Numbers, dates, and proper nouns must remain unchanged.

Output ONLY the refined English translation. No explanations, no preamble.`,
        },
        {
          role: "user",
          content: rawTranslation,
        },
      ],
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!groqRes.ok) throw new Error(`Groq API ${groqRes.status}`);

  const data = await groqRes.json();
  return data.choices?.[0]?.message?.content || rawTranslation;
}

export default async function handler(req) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), { status: 405, headers });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
  }

  const { text } = body;
  if (!text || !text.trim()) {
    return new Response(JSON.stringify({ error: "text is required" }), { status: 400, headers });
  }

  const trimmed = text.trim();
  if (trimmed.length > 50000) {
    return new Response(JSON.stringify({ error: "Text too long. Maximum 50,000 characters." }), { status: 400, headers });
  }

  const chunks = splitIntoChunks(trimmed);

  // Translate all chunks via Sarvam in parallel
  let rawParts;
  try {
    rawParts = await Promise.all(chunks.map(translateChunk));
  } catch (e) {
    console.log("Sarvam translation error:", e.message); // keep
    return new Response(JSON.stringify({ error: "Translation failed. Please try again." }), { status: 502, headers });
  }

  const rawTranslation = rawParts.join("\n\n");

  // Refine with Groq for legal terminology
  let refined;
  let refinementApplied = true;
  try {
    refined = await refineLegalTranslation(rawTranslation);
  } catch (e) {
    console.log("Groq refinement error:", e.message); // keep
    refined = rawTranslation;
    refinementApplied = false;
  }

  return new Response(JSON.stringify({
    translation: refined,
    chunksProcessed: chunks.length,
    refinementApplied,
  }), { status: 200, headers });
}
