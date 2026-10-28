# Claude Code Setup — முழுமையான திறன்கள் குறிப்பு

இந்த பக்கம் JanVayu Claude Code setup-ஆல் செய்யக்கூடிய அனைத்தின் விரிவான குறிப்பாகும் — இது development tools, enforcement mechanisms, AI features, CI/CD automation, deployment infrastructure மற்றும் documentation workflows-ஐ உள்ளடக்கியது.

---

## 1. முக்கிய Development திறன்கள்

### File Operations
- repository-ல் உள்ள **எந்த file-ஐயும் படிக்க** — `index.html`, Netlify Functions, configs, documentation
- **புதிய files-ஐ உருவாக்க** — Netlify Functions, documentation பக்கங்கள், config files
- **ஏற்கனவே உள்ள files-ஐ edit செய்ய** — தொடர்பில்லாத code-ஐ மீண்டும் எழுதாமல் targeted inline edits
- **Filename pattern மூலம் தேட** — glob matching (உதாரணமாக, `**/*.mjs`, `docs/**/*.md`)
- **Content மூலம் தேட** — codebase முழுவதும் regex-ஆல் இயங்கும் full-text search

### Shell & Terminal Access
- dependencies-ஐ நிர்வகிக்க `npm install` run செய்ய
- local development server-க்கு `netlify dev` run செய்ய
- எந்தவொரு destructive அல்லாத shell command-ஐயும் execute செய்ய
- `git`, `gh` (GitHub CLI), `ls`, `mkdir` ஆகியவற்றை பயன்படுத்த
- **Blocked by convention**: `rm -rf`, `git push --force`, `git reset --hard`

### Multi-File Coordination
ஒரு Claude Code session இவை அனைத்தையும் ஒரே நேரத்தில் கையாள முடியும்:
- `index.html` (markup), `app.js` (logic) மற்றும் `styles.css` (styling)
- Netlify Functions (`netlify/functions/*.mjs` அல்லது `*.js`)
- Configuration files (`netlify.toml`, `package.json`, `.editorconfig`)
- Documentation (`docs/**/*.md`, `CHANGELOG.md`, `README.md`)
- Git hooks (`.githooks/pre-commit`, `.githooks/commit-msg`)
- GitHub workflows (`.github/workflows/*.yml`)

---

## 2. Git Workflow திறன்கள்

### Branching & Commits
- feature branches-ஐ உருவாக்க (உதாரணமாக, `claude/feature-name`)
- குறிப்பிட்ட files-ஐ stage செய்ய (தற்செயலாக `.env` அல்லது secrets சேருவதைத் தவிர்க்கும்)
- கட்டாய prefix முறையைப் பின்பற்றும் செய்திகளுடன் commit செய்ய:
  - `Add:` — புதிய feature அல்லது file
  - `Fix:` — bug fix
  - `Update:` — ஏற்கனவே உள்ள feature-ல் மேம்பாடு
  - `Translate:` — translation வேலை
  - `Docs:` — documentation மாற்றங்கள்
  - `Refactor:` — code-ஐ மறுசீரமைத்தல் (நடத்தையில் மாற்றம் இல்லை)
  - `Test:` — test சேர்த்தல்
  - `CI:` — CI/CD pipeline மாற்றங்கள்
  - `Chore:` — பராமரிப்பு வேலைகள்
- 72 எழுத்துகளுக்கு மேல் உள்ள Subject lines, hook-ல் இருந்து ஒரு எச்சரிக்கையைத் தூண்டும் (தடுக்காது); `Merge` என்பதும் அனுமதிக்கப்பட்ட prefix ஆகும்

### Pull Request Management
- சரியான title, summary மற்றும் test plan-உடன் PR-களை உருவாக்க
- multi-PR workflows-ஐ நிர்வகிக்க (உதாரணமாக, முதலில் backend, பிறகு frontend, பிறகு docs)
- PR diffs-ஐ மதிப்பாய்வு செய்து மாற்றங்களை பரிந்துரைக்க
- கருத்துகளைச் சேர்க்கவும் மற்றும் review feedback-க்கு பதிலளிக்கவும்
### Git Hook Enforcement
இந்த செட்டப்பில் தானாகவே இயங்கும் இரண்டு கஸ்டம் git hooks உள்ளன:

**Pre-commit hook** (`.githooks/pre-commit`):
| சரிபார்ப்பு | செயல் |
|-------|--------|
| `.env`, `.env.local`, `.env.production` | **Commit-ஐ தடுக்கும்** |
| `credentials.json`, `*.pem`, `*.key` | **Commit-ஐ தடுக்கும்** |
| `debugger` statements, `breakpoint()` | **Commit-ஐ தடுக்கும்** |
| Merge conflict markers (`<<<<<<<`, `>>>>>>>`) | **Commit-ஐ தடுக்கும்** |
| `console.log`, `console.debug`, `console.warn` | **எச்சரிக்கை** (`// keep` மூலம் தவிர்க்கலாம்) |
| 500 KB-க்கு மேற்பட்ட கோப்புகள் | **எச்சரிக்கை** |

**Commit message hook** (`.githooks/commit-msg`):
| சரிபார்ப்பு | செயல் |
|-------|--------|
| தேவையான முன்னொட்டு இல்லை | **Commit-ஐ தடுக்கும்** |
| Subject line 72 எழுத்துகளுக்கு மேல் | **எச்சரிக்கை** |
| Merge/revert/fixup commits | **விதிமுறைகளைத் தவிர்க்கும்** |

---

## 3. AI-Powered Features (Groq-hosted model)

> **Update, 2 Oct 2026: Groq நிறுவனம் 16 Aug 2026 அன்று Llama 3.3 70B-ஐ நிறுத்தியது (Groq deprecations page); இப்போது functions இயல்பாக `openai/gpt-oss-120b`-ஐப் பயன்படுத்துகின்றன, இதை `GROQ_MODEL` environment variable மூலம் மாற்றலாம்.**

இந்த செட்டப்பில் நான்கு புரொடக்‌ஷன் AI அம்சங்கள் உள்ளன, ஒவ்வொன்றும் ஒரு கட்டமைக்கப்பட்ட skill file-உடன் Netlify Function ஆக உருவாக்கப்பட்டுள்ளன:

### 3.1 Air Quality Assistant (`air-query.mjs`)
- **Input**: நகரத்தின் பெயர் + இயல்பான மொழி கேள்வி
- **Output**: உண்மையான AQI எண்களைக் குறிப்பிட்டு, சுமார் 150 வார்த்தைகளில் துல்லியமான பதில்
- **Languages**: ஆங்கிலம் மற்றும் 9 இந்திய மொழிகள் (இந்தி, தமிழ், பெங்காலி, மராத்தி, தெலுங்கு, குஜராத்தி, கன்னடம், மலையாளம், பஞ்சாபி)
- **முக்கிய நிபந்தனை**: உண்மையான தரவுகளை மட்டுமே மேற்கோள் காட்ட வேண்டும் — பொதுவான ஆலோசனைகள் கூடாது
- **Fallback**: Groq-ல் rate limit தாண்டினால், மூல AQI தரவை வழங்கும்
- **Skill file**: `docs/skills/air-quality-assistant.md`

### 3.2 Health Advisory (`health-advisory.mjs`)
- **Input**: நகரம் + வயது + உடல்நலக் குறைபாடுகள் + வெளியே செலவழித்த மணிநேரம்
- **Output**: வண்ணக் குறியிடப்பட்ட ஆபத்து நிலை + உறுதியான பரிந்துரைகள் (3-4 வாக்கியங்கள்)
- **முக்கிய நிபந்தனை**: நேரடியான ஆலோசனை — "வெளியே செல்வதைத் தவிர்க்கலாம்" என்று சொல்லாமல் "உள்ளேயே இருங்கள்" என்று தெளிவாகச் சொல்ல வேண்டும்
- **Pre-AI படி**: AI பதில் வருவதற்கு முன்பே, JavaScript function மூலம் ஆபத்து நிலை கணக்கிடப்பட்டு UI-ல் உடனடியாக வண்ணக் குறியீடு காட்டப்படும்
- **Fallback**: AI விளக்கம் தோல்வியடைந்தாலும் ஆபத்து நிலை காட்டப்படும்
- **Skill file**: `docs/skills/health-advisory.md`
### 3.3 பொறுப்புக்கூறல் அறிக்கை (`accountability-brief.mjs`)
- **உள்ளீடு**: நகரம் + வார்டு/பகுதி + கால அளவு
- **வெளியீடு**: எட்டு பெயரிடப்பட்ட பிரிவுகளுடன் கூடிய கட்டமைக்கப்பட்ட அறிக்கை (பகுதி, காலம், தற்போதைய PM2.5, நிலை, தரவு என்ன காட்டுகிறது, சாத்தியமான மூலங்கள், உள்ளூர் அமைப்புகள் என்ன செய்யலாம், தரவு வரம்பு)
- **அதிகபட்ச வெளியீடு**: 1,024 tokens
- **பார்வையாளர்கள்**: வார்டு கவுன்சிலர்கள், உள்ளூர் பத்திரிகையாளர்கள், RWAs (குடியிருப்போர் நலச் சங்கங்கள்)
- **முக்கிய அம்சம்**: குறிப்பிட்ட உள்ளூர் ஒழுங்குமுறை வழிமுறைகளை (GRAP, RTI மற்றும் நகராட்சி புகார் எண்கள்) உள்ளடக்கியது
- **மாற்று வழி (Fallback)**: AI பகுப்பாய்வு இல்லாமல் மூலத் தரவை வழங்குகிறது
- **திறன் கோப்பு**: `docs/skills/accountability-brief.md`

### 3.4 முரண்பாடு கண்டறிதல் (`anomaly-check.mjs`)
- **உள்ளீடு**: தானியங்கி — டெல்லி, மும்பை, கொல்கத்தா, சென்னை, பெங்களூரு ஆகியவற்றைக் கண்காணிக்கிறது
- **வரம்பு**: PM2.5 > 2× பருவகால அடிப்படை = முரண்பாடு
- **வெளியீடு**: ஒவ்வொரு அதிகப்படியான அளவிற்கும் ஒரு வாக்கிய விளக்கம்
- **பருவகால அடிப்படைகள்**: வெளியிடப்பட்ட CREA அல்லது IQAir புள்ளிவிவரங்கள் அல்ல, JanVayu-வின் கடினக் குறியீடாக்கப்பட்ட தோராயமான வேலை அடிப்படையிலானது (மாறும் வகையில் கணக்கிடப்படவில்லை)
- **மாற்று வழி (Fallback)**: AI விளக்கம் இல்லாமல் முரண்பாடு கொடியை வழங்குகிறது
- **திறன் கோப்பு**: `docs/skills/anomaly-explainer.md`

### பகிரப்பட்ட AI கட்டமைப்பு
நான்கு அம்சங்களும் பகிர்ந்துகொள்வது:
- சேவையகப் பக்கச் செயலாக்கம் மட்டும் (வாடிக்கையாளருக்கு API விசைகள் வெளிப்படுத்தப்படாது)
- CORS முன்கூட்டியே கையாளுதல் (OPTIONS → 204)
- பொருத்தமான நிலை குறியீடுகளுடன் JSON பதில்
- ஒவ்வொரு வெளிப்புற அழைப்பிலும் try/catch
- நேர்த்தியான தரமிறக்கம் — ஒவ்வொரு AI அம்சத்திற்கும் AI அல்லாத மாற்று வழி உள்ளது

---

## 4. Netlify Functions (28 சேவையகமற்ற கையாளுநர்கள்)

கீழே உள்ள அட்டவணைகள் முக்கிய செயல்பாடுகளைப் பட்டியலிடுகின்றன. களஞ்சியத்தில் 28 கையாளுநர் கோப்புகள் மற்றும் ஒரு பகிரப்பட்ட உதவியாளர் (`blob-store.js`) உள்ளன; கையாளுநர்களில் ஐந்து திட்டமிடப்பட்டவை.

### திட்டமிடப்பட்ட செயல்பாடுகள்
| செயல்பாடு | அட்டவணை | நோக்கம் |
|----------|----------|---------|
| `scheduled-fetch.mjs` | ஒவ்வொரு 4 மணி நேரத்திற்கும் | அனைத்து சமூக ஊடகங்கள் மற்றும் செய்தித் தொகுப்புகளை Netlify Blobs cache-க்குள் முன்கூட்டியே பெறுகிறது |
| `daily-digest.mjs` | தினமும் 8:00 AM IST | Resend API வழியாக சந்தாதாரர்களுக்கு AQI மின்னஞ்சல் சுருக்கத்தை அனுப்புகிறது |

### தேவைக்கேற்ப செயல்பாடுகள் (AI)
| செயல்பாடு | முறை | நோக்கம் |
|----------|--------|---------|
| `air-query.mjs` | POST | இயற்கை மொழி AQI கேள்வி-பதில் |
| `health-advisory.mjs` | POST | தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனை |
| `accountability-brief.mjs` | POST | நிர்வாகப் பொறுப்புக்கூறல் அறிக்கைகள் |
| `anomaly-check.mjs` | GET | PM2.5 அதிகப்படியான அளவைக் கண்டறிதல் |
### தேவைக்கேற்ப செயல்பாடுகள் (தரவு)
| செயல்பாடு | முறை | நோக்கம் |
|----------|--------|---------|
| `reddit-feed.js` | GET | காற்றின் தரம் குறித்த Reddit பதிவுகள் (சேமிக்கப்பட்டவை) |
| `twitter-feed.js` | — | **பழையது.** Nitter-ஐப் படிக்கிறது, அதன் பொது நிகழ்வுகள் இல்லை; எதுவும் இதை அழைக்கவில்லை. |
| `youtube-feed.js` | GET | YouTube சேனல் RSS-லிருந்து சேமிக்கப்பட்ட இந்தியாவின் காற்றுத் தர வீடியோக்கள் |
| `instagram-feed.js` | GET | சேமிக்கப்பட்ட Instagram பதிவுகள் |
| `news-proxy.js` | GET | சேமிக்கப்பட்ட செய்தி கட்டுரைகள் |
| `subscribe.js` | POST | மின்னஞ்சல் சந்தா மேலாண்மை |
| `feed-status.js` | GET | ஃபீட் புதுப்பிப்பு நிலை சரிபார்ப்பு |

### பகிரப்பட்ட பயன்பாடு
| செயல்பாடு | நோக்கம் |
|----------|---------|
| `blob-store.js` | Netlify Blobs store தொடக்கநிலை (மற்ற செயல்பாடுகளால் இறக்குமதி செய்யப்படுகிறது) |

### நிலையான செயல்பாடு முறை
ஒவ்வொரு செயல்பாடும் இந்த வார்ப்புருவைப் பின்பற்றுகிறது:
1. CORS preflight கையாளுதல் (`OPTIONS` → `204`)
2. `try/catch`-க்குள் முக்கிய லாஜிக்
3. CORS தலைப்புகளுடன் JSON பதில் பகுதி
4. பிழையில் நேர்த்தியான மாற்று வழி (எப்போதும் காலியான பகுதியுடன் `500`-ஐத் தராது)

---

## 5. CI/CD & ஆட்டோமேஷன்

### GitHub Actions Workflows

**இணைப்பு சரிபார்ப்பு** (`ci.yml`):
- **தூண்டுதல்கள்**: `main`-க்கு புஷ், `main`-க்கு PR-கள்
- **கருவி**: Lychee இணைப்பு சரிபார்ப்பான்
- **தவிர்க்கப்பட்டவை**: localhost, சமூக ஊடக தளங்கள், ரேட்-லிமிட் செய்யப்பட்ட டொமைன்கள், மற்றும் `docs/` மற்றும் `docs-*/` கோப்பகங்கள்
- **கட்டமைப்பு**: 30-வினாடி காலக்கெடு, ஒரு இணைப்புக்கு 2 மறுமுயற்சிகள்

**மொழிபெயர்ப்பு ஒத்திசைவு** (`translations.yml`):
- **தூண்டுதல்கள்**: `docs/`, `docs-hi/`, `docs-bn/`, `docs-mr/`, `docs-ta/`-ல் மாற்றங்கள்
- **சரிபார்ப்புகள்**: 4 மொழிகளில் மொழிபெயர்ப்பு கோப்பு கவரேஜ், SUMMARY.md சமநிலை, பழைய மொழிபெயர்ப்பு கண்டறிதல்
- **அறிக்கைகள்**: ஒரு மொழிக்கு கவரேஜ் சதவீதம்

**ImpactMojo மொழிபெயர்ப்பு ஒத்திசைவு** (`impactmojo-translations.yml`):
- `docs-impactmojo/` கோப்பகங்களுக்கு இதே லாஜிக்

**Dependabot** (`dependabot.yml`):
- **வரம்பு**: GitHub Actions சார்புகள் மற்றும் npm (2 Oct 2026 அன்று npm சேர்க்கப்பட்டது)
- **அதிர்வெண்**: மாதாந்திரம்
- **அதிகபட்ச திறந்த PR-கள்**: ஒரு சூழலியலுக்கு 2; npm minor மற்றும் patch புதுப்பிப்புகள் ஒன்றாகத் தொகுக்கப்படுகின்றன

### Netlify ஆட்டோ-டெப்லாய்
- `main`-க்கு செய்யப்படும் ஒவ்வொரு புஷ்-உம் தானியங்கி டெப்லாயைத் தூண்டுகிறது
- பில்ட் ரெப்போ ரூட்டிலிருந்து (`.`) பப்ளிஷ் ஆகிறது
- செயல்பாடுகள் கோப்பகம்: `netlify/functions/`
- Node.js 22 ரன்டைம் (`netlify.toml`-ல் `NODE_VERSION`)

---

## 6. டெப்லாய்மென்ட் & உள்கட்டமைப்பு

### ஹோஸ்டிங் — Netlify CDN
- Let's Encrypt உடன் தானியங்கி HTTPS
- உலகளாவிய CDN விநியோகம்
- Non-www → www ரீடைரக்ட் (கனானிக்கல் டொமைன்)
- SPA ஃபால்பேக்: அனைத்து ரூட்டுகளும் → `/index.html`
- `/robots.txt` மற்றும் `/sitemap.xml`-க்கான சிறப்பு ரூட்டுகள்
### பாதுகாப்பு தலைப்புகள்
| தலைப்பு | மதிப்பு | நோக்கம் |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | கிளிக்ஜாக்கிங்கைத் தடுக்கிறது |
| `X-Content-Type-Options` | `nosniff` | MIME ஸ்னிஃபிங்கைத் தடுக்கிறது |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ரெஃபரர் தகவலைக் கட்டுப்படுத்துகிறது |

### கேச்சிங் — Netlify Blobs
- வலுவான நிலைத்தன்மை மாதிரி
- சமூக ஊடக ஃபீட்கள் மற்றும் செய்திகளை முன்கூட்டியே கேச் செய்ய திட்டமிடப்பட்ட ஃபங்ஷன்களால் பயன்படுத்தப்படுகிறது
- தேவைக்கேற்ப ஃபங்ஷன்கள் முதலில் கேச்சிலிருந்து படிக்கின்றன, தேவைப்பட்டால் நேரடி தரவைப் பெறுகின்றன
- `@netlify/blobs` பேக்கேஜ் வழியாக அணுகப்படுகிறது

### மின்னஞ்சல் — Resend API
- தினசரி டைஜஸ்ட் (`daily-digest.mjs`) மற்றும் பிற சர்வர்-சைடு மெயிலர்களுக்கான (`health-monitor.mjs`, `terra-collab.mjs`, `workshop-submit.mjs`) மின்னஞ்சல் விநியோகம்; `subscribe.js` மின்னஞ்சலை அனுப்பாது
- சர்வர்-சைடு மட்டும் (Netlify Functions வழியாக)

### தேவையான சுற்றுச்சூழல் மாறிகள்
| மாறி | நோக்கம் | எங்கு பயன்படுத்தப்படுகிறது |
|----------|---------|------------|
| `GROQ_API_KEY` | Groq-ஹோஸ்ட் செய்யப்பட்ட AI அம்சங்கள் (விருப்பமான `GROQ_MODEL` மூலம் அமைக்கப்படும் மாடல், இயல்புநிலை `openai/gpt-oss-120b`) | `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs` |
| `RESEND_API_KEY` | மின்னஞ்சல் விநியோகம் | `daily-digest.mjs`, `health-monitor.mjs`, `terra-collab.mjs`, `workshop-submit.mjs` |
| `RESEND_FROM` | அனுப்புநரின் மின்னஞ்சல் முகவரி | `daily-digest.mjs` |
| `BLOB_TOKEN` | Netlify Blobs அணுகல் | `blob-store.js` (கேச்சிங் ஃபங்ஷன்களால் இறக்குமதி செய்யப்பட்டது) |
| `NETLIFY_SITE_ID` | தள அடையாளங்காட்டி | Blobs ஸ்டோர் தொடக்கநிலை |
| `WAQI_TOKEN` | காற்றின் தரத் தரவு (சர்வர்-சைடு, பொதுவானது அல்ல) | `waqi-proxy` மற்றும் ஃபங்ஷன்கள், `netlify/functions/lib/waqi-token.mjs` வழியாக |

---

## 7. MCP சர்வர் ஒருங்கிணைப்புகள்

Claude Code ஆனது மாடல் கான்டெக்ஸ்ட் புரோட்டோகால் (MCP) சர்வர்களை ஆதரிக்கிறது, இது உள்ளூர் ஃபைல்சிஸ்டமுக்கு அப்பால் அதன் கருவி அணுகலை விரிவுபடுத்துகிறது. JanVayu உருவாக்கத்தின் போது இவற்றில் எவை பயன்படுத்தப்பட்டன என்பதை இந்த ரெபாசிட்டரி பதிவு செய்யவில்லை; ஒவ்வொன்றையும் எதற்காகப் பயன்படுத்தலாம் என்பதை அட்டவணை பட்டியலிடுகிறது:
| MCP Server | கிடைக்கும் Tools | JanVayu-க்கான Use Case |
|------------|----------------|---------------------|
| **GitHub** | PR management, issue tracking, code search, CI checks | PRs, reviews, issue comments-ஐ நிர்வகிக்கிறது |
| **Notion** | Create pages, query databases, search, update | Project planning, task tracking, meeting notes |
| **Gmail** | Search messages, read threads, create drafts | Features பற்றிய email விவாதங்களைக் குறிப்பிட |
| **Figma** | Get design context, screenshots, metadata | Design mockups-ஐ HTML/CSS-ஆக மாற்ற |
| **Google Calendar** | List events, create events, find free time | Development sessions மற்றும் releases-ஐ திட்டமிட |
| **Excalidraw** | Create views, save checkpoints | Architecture diagrams மற்றும் data flow visualisation |

---

## 8. Documentation Capabilities

### Multilingual Documentation (5 Languages)
| Language | Directory | Live Path |
|----------|-----------|-----------|
| English | `docs/` | `/docs/` |
| Hindi | `docs-hi/` | `/docs/#/hi/` |
| Bengali | `docs-bn/` | `/docs/#/bn/` |
| Marathi | `docs-mr/` | `/docs/#/mr/` |
| Tamil | `docs-ta/` | `/docs/#/ta/` |

### Documentation Sections (65 English pages; 47 in each translated tree)
- **Claude Code guides** — overview, setup, workflow, sharing, capabilities
- **Skills & AI** — air quality assistant, health advisory, accountability brief, anomaly explainer, coding practices, visual design, automation
- **Tech Stack** — overview, frontend, backend, AI layer, infrastructure, dev tooling
- **Data Sources** — overview, WAQI, health data, policy data
- **Contributing** — contribution guidelines
- **Wiki** — translation guide, role-based landing page, adding a new panel

### Docsify Setup
- `/docs/`-இல் உள்ள Single-page Docsify shell, `docs/` directory-லிருந்து நேரடியாக markdown-ஐ browser-இல் render செய்கிறது
- மொழிபெயர்க்கப்பட்ட மொழிகள் Docsify hash routes (`/docs/#/hi/`, `/docs/#/bn/`, `/docs/#/mr/`, `/docs/#/ta/`) வழியாக route செய்யப்படுகின்றன
- Build step இல்லை, server இல்லை, DB இல்லை — Netlify static files-ஐ மட்டுமே வழங்குகிறது
- Plugins: docsify-themeable (brand theme), docsify-pagination (Prev/Next), docsify-copy-code (code-block copy), Prism.js (syntax highlighting), zoom-image
- Built-in Docsify search (client-side, அனைத்து 5 மொழிகளையும் index செய்கிறது)

---

## 9. Code Quality & Conventions
### கட்டமைப்பு கட்டுப்பாடுகள்
- **மூன்று front-end கோப்புகள்** — `index.html` (markup), `app.js` மற்றும் `styles.css`
- **ஃப்ரேம்வொர்க்குகள் இல்லை** — React, Vue, Angular, Svelte இல்லை
- **பில்ட் ஸ்டெப் இல்லை** — Webpack, Vite, Rollup இல்லை
- **TypeScript இல்லை** — vanilla JavaScript மட்டுமே
- **ES2022 அதிகபட்சம்** (ESLint `ecmaVersion`) — மிகச் சமீபத்திய தொடரியல் இல்லை
- **கிளையண்ட்-சைடு npm பேக்கேஜ்கள் இல்லை** — Chart.js, Leaflet, leaflet.heat மற்றும் PMTiles-க்கு CDN மட்டுமே

### ஃபார்மேட்டிங் தரநிலைகள் (`.editorconfig`)
- HTML, CSS, JS, JSON-க்கு 2-ஸ்பேஸ் இன்டென்டேஷன்
- UTF-8 என்கோடிங்
- LF வரி முடிவுகள்
- கோப்பின் முடிவில் ட்ரெய்லிங் நியூலைன்

### சார்புகள் (குறைந்தபட்சம்)
`package.json`-ல் 3 npm பேக்கேஜ்கள் மட்டுமே:
- `@netlify/blobs` — சர்வர்-சைடு கேஷிங்
- `resend` — ஈமெயில் டெலிவரி
- `web-push` — புஷ் நோட்டிஃபிகேஷன்கள்

---

## 10. Claude Code உருவாக்கியவை vs. மனிதர்கள் செய்ய வேண்டியவை

### Claude Code உருவாக்கியவை
- Netlify Functions (சர்வர்லெஸ் பேக்கெண்ட்)
- சிங்கிள்-பேஜ் அப்ளிகேஷன் ஃபிரண்ட் எண்ட் (`index.html`, `app.js`, `styles.css`)
- அனைத்து AI ஸ்கில் ப்ராம்ப்ட்கள் மற்றும் ப்ராம்ப்ட் இன்ஜினியரிங்
- பல மொழி Docsify ஆவணங்கள் (65 ஆங்கிலப் பக்கங்கள்; மொழிபெயர்க்கப்பட்ட ஒவ்வொரு மொழிக்கும் 47)
- கமிட் அமலாக்கத்திற்கான Git ஹூக்ஸ்
- GitHub Actions ஒர்க்ஃப்ளோக்கள்
- CHANGELOG பதிவுகள் மற்றும் வெர்ஷன் மேலாண்மை
- கோட் ரிவியூ மற்றும் இலக்கு ரீஃபாக்டரிங்
- பக் (Bug) கண்டறிதல் மற்றும் சிறிய தீர்வுகள்
- PR உருவாக்கம் மற்றும் மேலாண்மை

### மனிதர்களின் தலையீடு தேவை
| பணி | காரணம் |
|------|--------|
| Netlify டேஷ்போர்டு அமைப்பு | Environment variables, டொமைன் அமைப்பு, பில்ட் அமைப்புகள் UI-ல் மட்டுமே |
| API கீ உருவாக்கம் | Groq Console, Resend, WAQI — கணக்கு உருவாக்க வேண்டும் |
| வடிவமைப்பு முடிவுகள் | அம்சம் முன்னுரிமை, தரவு மூலத் தேர்வு, UX திசை |
| உள்ளடக்க மதிப்பாய்வு | தரவு துல்லியம், கொள்கை துல்லியம், சட்டபூர்வ இணக்கம் |
| டெப்லாய்மென்ட் சரிபார்த்தல் | டெப்லாய் செய்த பிறகு லைவ் தளத்தின் செயல்பாட்டைச் சரிபார்த்தல் |
| DNS அமைப்பு | கஸ்டம் டொமைன்களுக்கான டொமைன் ரெஜிஸ்ட்ரார் மாற்றங்கள் |

---

## 11. செலவு விவரம்

| கூறு | செலவு |
|-----------|------|
| Netlify ஹோஸ்டிங் + ஃபங்ஷன்கள் | Free tier |
| Groq API (default `openai/gpt-oss-120b`) | Free tier |
| Resend ஈமெயில் | Free tier (100 ஈமெயில்கள்/நாள்) |
| WAQI API | Free tier |
| GitHub Actions | Free tier |
| Docsify (docs) | Free (ஓப்பன் சோர்ஸ், Netlify-லிருந்து வழங்கப்படுகிறது) |
| டொமைன் (`janvayu.in`) | ~$10/வருடம் |
| **மொத்தம்** | **~$10/வருடம்** (Claude Code-ன் செலவு இதில் இல்லை) |

---

## சுருக்கம்
---
இந்த Claude Code அமைப்பு ஒரு production web platform-க்கான முழுமையான development environment-ஐ வழங்குகிறது:
- **28 serverless handlers** (4 AI-ஆல் இயங்குபவை, 5 திட்டமிடப்பட்டவை, மீதமுள்ளவை feeds, subscriptions மற்றும் data APIs) மற்றும் ஒரு பகிரப்பட்ட helper
- git hooks மூலம் **தானியங்கி code quality** (secret blocking, commit conventions, debug detection)
- link checking, translation coverage மற்றும் dependency updates-க்கான **CI/CD pipelines**
- **Multilingual Docsify documentation** 5 மொழிகளில், `/docs/` என்ற ஒற்றை shell-லிருந்து வழங்கப்படுகிறது
- வழிகாட்டுதல்கள் மற்றும் ஆவணங்கள் மூலம் கட்டாயமாக்கப்பட்ட **Zero-framework architecture**
- GitHub, Notion, Gmail, Figma, Calendar மற்றும் Excalidraw-க்கான **MCP integrations**
- **மிகக் குறைந்த செலவு** — கிட்டத்தட்ட எல்லாமே free tiers-லேயே இயங்குகின்றன
