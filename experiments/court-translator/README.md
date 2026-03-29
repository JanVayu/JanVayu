# Court Petition Translator (Hindi → English)

An AI-powered tool for translating Hindi Supreme Court and High Court petitions into formal legal English.

**Status:** Prototype
**Target repo:** [Varnasr/Experiments](https://github.com/Varnasr/Experiments)

## How it works

1. **Translation:** Hindi text is split into chunks (max 1800 chars each, splitting on paragraph then sentence boundaries) and translated via [Sarvam AI](https://www.sarvam.ai) (`sarvam-translate:v1`, formal mode)
2. **Legal refinement:** The raw translation is refined by Llama 3.3 70B (via Groq) with a legal-terminology-aware prompt that corrects terms like:
   - याचिकाकर्ता → Petitioner
   - प्रतिवादी → Respondent
   - माननीय → Hon'ble
   - अनुच्छेद → Article
   - धारा → Section
   - प्रार्थना → Prayer
   - And many more standard Indian legal English terms

## File structure

```
court-translator/
├── index.html                      # Standalone UI page
├── netlify/
│   └── functions/
│       └── court-translate.mjs     # Serverless translation function
├── netlify.toml                    # Netlify config (functions + headers)
├── .env.example                    # Required environment variables
└── README.md                       # This file
```

## Setup in Experiments repo

1. Copy `index.html` to `Experiments/court-translator/index.html`
2. Copy `netlify/functions/court-translate.mjs` to `Experiments/netlify/functions/court-translate.mjs`
3. Copy `netlify.toml` to `Experiments/netlify.toml`
4. Add env vars to Netlify site settings:
   - `SARVAM_API_KEY` — from [Sarvam AI dashboard](https://dashboard.sarvam.ai)
   - `GROQ_API_KEY` — from [Groq console](https://console.groq.com) (free tier)
5. Deploy via Netlify — the tool will be at `/court-translator/`

## Environment variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `SARVAM_API_KEY` | [dashboard.sarvam.ai](https://dashboard.sarvam.ai) | Hindi-English translation via Sarvam Translate API |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | Legal terminology refinement via Llama 3.3 70B |

## API details

**Endpoint:** `POST /.netlify/functions/court-translate`

**Request:**
```json
{ "text": "Hindi petition text here..." }
```

**Response:**
```json
{
  "translation": "English legal translation...",
  "chunksProcessed": 3,
  "refinementApplied": true
}
```

**Limits:** 50,000 characters max input. Chunks of up to 1800 chars are translated in parallel.
