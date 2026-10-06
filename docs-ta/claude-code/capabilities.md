# Claude Code Setup — முழுமையான திறன்களின் குறிப்பு

இந்த பக்கம் JanVayu Claude Code setup-ஆல் செய்யக்கூடிய அனைத்தின் விரிவான குறிப்பாகும் — இதில் development tools, enforcement mechanisms, AI features, CI/CD automation, deployment infrastructure மற்றும் documentation workflows ஆகியவை அடங்கும்.

---

## 1. முக்கிய Development திறன்கள்

### File Operations
- Repository-யில் உள்ள **எந்த file-ஐயும் படிக்க** — `index.html`, Netlify Functions, configs, documentation
- **புதிய file-களை உருவாக்க** — Netlify Functions, documentation page-கள், config file-கள்
- **ஏற்கனவே உள்ள file-களை edit செய்ய** — தொடர்பில்லாத code-ஐ மீண்டும் எழுதாமல் குறிப்பிட்ட inline edit-களைச் செய்யலாம்
- **Filename pattern மூலம் தேட** — glob matching (உதாரணமாக, `**/*.mjs`, `docs/**/*.md`)
- **Content மூலம் தேட** — codebase முழுவதும் regex-ஆல் இயங்கும் full-text search

### Shell & Terminal Access
- Dependencies-ஐ நிர்வகிக்க `npm install` run செய்யவும்
- Local development server-க்கு `netlify dev` run செய்யவும்
- எந்தவொரு destructive அல்லாத shell command-ஐயும் execute செய்யலாம்
- `git`, `gh` (GitHub CLI), `ls`, `mkdir` ஆகியவற்றைப் பயன்படுத்தலாம்
- **தடைசெய்யப்பட்டது**: `rm -rf`, `git push --force`, `git reset --hard`

### Multi-File Coordination
ஒரு Claude Code session-ல் இவை அனைத்தையும் ஒரே முறை கையாளலாம்:
- `index.html` (markup), `app.js` (logic) மற்றும் `styles.css` (styling)
- Netlify Functions (`netlify/functions/*.mjs` அல்லது `*.js`)
- Configuration file-கள் (`netlify.toml`, `package.json`, `.editorconfig`)
- Documentation (`docs/**/*.md`, `CHANGELOG.md`, `README.md`)
- Git hooks (`.githooks/pre-commit`, `.githooks/commit-msg`)
- GitHub workflows (`.github/workflows/*.yml`)

---

## 2. Git Workflow திறன்கள்

### Branching & Commits
- Feature branch-களை உருவாக்க (உதாரணமாக, `claude/feature-name`)
- குறிப்பிட்ட file-களை மட்டும் stage செய்ய (இதனால் `.env` அல்லது secrets தவறுதலாகச் சேருவதைத் தவிர்க்கலாம்)
- கட்டாய prefix முறையைப் பின்பற்றும் commit message-களுடன் commit செய்யவும்:
  - `Add:` — புதிய feature அல்லது file
  - `Fix:` — bug fix
  - `Update:` — ஏற்கனவே உள்ள feature-ல் மேம்பாடு
  - `Translate:` — மொழிபெயர்ப்பு வேலை
  - `Docs:` — documentation மாற்றங்கள்
  - `Refactor:` — code-ஐ மறுசீரமைத்தல் (behavior மாற்றப்படாது)
  - `Test:` — test-களைச் சேர்த்தல்
  - `CI:` — CI/CD pipeline மாற்றங்கள்
  - `Chore:` — பராமரிப்பு வேலைகள்
- 72 எழுத்துகளுக்கு மேல் உள்ள subject line-கள் hook-லிருந்து ஒரு எச்சரிக்கையைத் தூண்டும் (தடுக்காது); `Merge` என்பதும் அனுமதிக்கப்பட்ட prefix ஆகும்

### Pull Request Management
- Structured title, summary மற்றும் test plan-உடன் PR-களை உருவாக்க
- Multi-PR workflow-களை நிர்வகிக்க (உதாரணமாக, முதலில் backend, பிறகு frontend, பின்னர் docs)
- PR diff-களை review செய்து மாற்றங்களை பரிந்துரைக்க
- Comments-ஐ சேர்க்கவும் மற்றும் review feedback-க்கு பதிலளிக்கவும்
### Git Hook Enforcement
இந்த செட்டப்பில் தானாகவே இயங்கும் இரண்டு கஸ்டம் git hooks உள்ளன:

**Pre-commit hook** (`.githooks/pre-commit`):
| Check | Action |
|-------|--------|
| `.env`, `.env.local`, `.env.production` | **Block commit** |
| `credentials.json`, `*.pem`, `*.key` | **Block commit** |
| `debugger` statements, `breakpoint()` | **Block commit** |
| Merge conflict markers (`<<<<<<<`, `>>>>>>>`) | **Block commit** |
| `console.log`, `console.debug`, `console.warn` | **Warn** (bypass with `// keep`) |
| Files > 500 KB | **Warn** |

**Commit message hook** (`.githooks/commit-msg`):
| Check | Action |
|-------|--------|
| Missing required prefix | **Block commit** |
| Subject line > 72 characters | **Warn** |
| Merge/revert/fixup commits | **Skip enforcement** |

---

## 3. AI-Powered Features (Groq-hosted model)

> **Update, 2 Oct 2026: Groq shut down Llama 3.3 70B on 16 Aug 2026 (Groq deprecations page); the functions now default to `openai/gpt-oss-120b`, which can be changed with the `GROQ_MODEL` environment variable.**

இந்த செட்டப்பில் நான்கு புரொடக்‌ஷன் AI அம்சங்கள் உள்ளன, ஒவ்வொன்றும் ஒரு கட்டமைக்கப்பட்ட ஸ்கில் ஃபைலுடன் Netlify Function ஆக செயல்படுத்தப்பட்டுள்ளன:

### 3.1 Air Quality Assistant (`air-query.mjs`)
- **Input**: நகரத்தின் பெயர் + இயல்பான மொழி கேள்வி
- **Output**: உண்மையான AQI எண்களை மேற்கோள் காட்டி, அடிப்படையான பதில் (சுமார் 150 வார்த்தைகள்)
- **Languages**: ஆங்கிலம் மற்றும் ஒன்பது இந்திய மொழிகள் (இந்தி, தமிழ், பெங்காலி, மராத்தி, தெலுங்கு, குஜராத்தி, கன்னடம், மலையாளம், பஞ்சாபி)
- **Key constraint**: உண்மையான தரவை மேற்கோள் காட்ட வேண்டும் — பொதுவான ஆலோசனைகள் இருக்கக்கூடாது
- **Fallback**: Groq-ல் rate limit ஏற்பட்டால் raw AQI தரவை வழங்கும்
- **Skill file**: `docs/skills/air-quality-assistant.md`

### 3.2 Health Advisory (`health-advisory.mjs`)
- **Input**: நகரம் + வயது + உடல்நல நிலைகள் + வெளியே செலவழித்த மணிநேரம்
- **Output**: நிறக் குறியீடு செய்யப்பட்ட ஆபத்து நிலை + உறுதியான பரிந்துரைகள் (3-4 வாக்கியங்கள்)
- **Key constraint**: தயக்கமில்லாத நேரடி ஆலோசனைகள் — "Stay indoors" (உள்ளேயே இருங்கள்) என்று இருக்க வேண்டுமே தவிர "Consider staying indoors" (உள்ளேயே இருக்க யோசிக்கலாம்) என்று இருக்கக்கூடாது
- **Pre-AI step**: AI பதில் வருவதற்கு முன்பே, JavaScript function மூலம் UI-ல் உடனடியாக நிறக் குறியீடு செய்ய ஆபத்து நிலை கணக்கிடப்படுகிறது
- **Fallback**: AI விளக்கம் தோல்வியடைந்தாலும் ஆபத்து நிலை காட்டப்படும்
- **Skill file**: `docs/skills/health-advisory.md`
### 3.3 பொறுப்புக்கூறல் சுருக்கம் (`accountability-brief.mjs`)
- **உள்ளீடு**: நகரம் + வார்டு/பகுதி + காலக்கட்டம்
- **வெளியீடு**: எட்டு பெயரிடப்பட்ட பிரிவுகளைக் கொண்ட கட்டமைக்கப்பட்ட சுருக்கம் (பகுதி, காலக்கட்டம், தற்போதைய PM2.5, நிலை, தரவுகள் என்ன காட்டுகின்றன, சாத்தியமான ஆதாரங்கள், உள்ளூர் அமைப்புகள் என்ன செய்ய முடியும், தரவு வரம்பு)
- **அதிகபட்ச வெளியீடு**: 1,024 டோக்கன்கள்
- **பார்வையாளர்கள்**: வார்டு கவுன்சிலர்கள், உள்ளூர் பத்திரிகையாளர்கள், RWAs (குடியிருப்போர் நலச் சங்கங்கள்)
- **முக்கிய அம்சம்**: குறிப்பிட்ட உள்ளூர் ஒழுங்குமுறை வழிமுறைகளை (GRAP, RTI மற்றும் நகராட்சி புகார் எண்கள்) உள்ளடக்கியது
- **மாற்று வழி**: AI பகுப்பாய்வு இல்லாமல் மூலத் தரவை வழங்குகிறது
- **ஸ்கில் ஃபைல்**: `docs/skills/accountability-brief.md`

### 3.4 முரண்பாடு கண்டறிதல் (`anomaly-check.mjs`)
- **உள்ளீடு**: தானியங்கி — டெல்லி, மும்பை, கொல்கத்தா, சென்னை, பெங்களூரு ஆகியவற்றை கண்காணிக்கும்
- **வரம்பு**: PM2.5 > 2× பருவகால அடிப்படை = முரண்பாடு
- **வெளியீடு**: ஒவ்வொரு திடீர் அதிகரிப்புக்கும் ஒரு வாக்கிய விளக்கம்
- **பருவகால அடிப்படைகள்**: வெளியிடப்பட்ட CREA அல்லது IQAir தரவுகள் அல்லாமல், JanVayu-வின் கடினக் குறியீடாக்கப்பட்ட தோராயமான செயல்பாட்டு அடிப்படைகள் (மாறும் வகையில் கணக்கிடப்படுவதில்லை)
- **மாற்று வழி**: AI விளக்கம் இல்லாமல் முரண்பாடு கொடியை வழங்குகிறது
- **ஸ்கில் ஃபைல்**: `docs/skills/anomaly-explainer.md`

### பகிரப்பட்ட AI கட்டமைப்பு
நான்கு அம்சங்களும் பின்வருவனவற்றைப் பகிர்ந்து கொள்கின்றன:
- சர்வர்-பக்க செயலாக்கம் மட்டுமே (வாடிக்கையாளருக்கு API விசைகள் வழங்கப்படாது)
- CORS ப்ரீஃப்ளைட் கையாளுதல் (OPTIONS → 204)
- பொருத்தமான நிலை குறியீடுகளுடன் JSON பதில்
- ஒவ்வொரு வெளிப்புற அழைப்பிலும் try/catch
- நேர்த்தியான சரிவு — ஒவ்வொரு AI அம்சத்திற்கும் AI அல்லாத மாற்று வழி உள்ளது

---

## 4. Netlify Functions (28 சர்வர்லெஸ் ஹேண்ட்லர்கள்)

கீழே உள்ள அட்டவணைகள் முக்கிய செயல்பாடுகளைப் பட்டியலிடுகின்றன. களஞ்சியத்தில் 28 ஹேண்ட்லர் கோப்புகள் மற்றும் ஒரு பகிரப்பட்ட உதவியாளர் (`blob-store.js`) உள்ளன; இதில் ஐந்து ஹேண்ட்லர்கள் திட்டமிடப்பட்டவை.

### திட்டமிடப்பட்ட செயல்பாடுகள்
| செயல்பாடு | அட்டவணை | நோக்கம் |
|----------|----------|---------|
| `scheduled-fetch.mjs` | ஒவ்வொரு 4 மணி நேரத்திற்கும் | அனைத்து சமூக ஊடகங்கள் மற்றும் செய்தி ஊடகங்களை Netlify Blobs கேச்-க்கு முன்கூட்டியே கொண்டு வரும் |
| `daily-digest.mjs` | தினமும் காலை 8:00 IST | Resend API மூலம் சந்தாதாரர்களுக்கு AQI மின்னஞ்சல் சுருக்கத்தை அனுப்புகிறது |

### தேவைக்கேற்ப செயல்பாடுகள் (AI)
| செயல்பாடு | முறை | நோக்கம் |
|----------|--------|---------|
| `air-query.mjs` | POST | இயல்பான மொழி AQI கேள்வி-பதில் |
| `health-advisory.mjs` | POST | தனிப்பயனாக்கப்பட்ட சுகாதார ஆலோசனைகள் |
| `accountability-brief.mjs` | POST | நிர்வாகப் பொறுப்புக்கூறல் சுருக்கங்கள் |
| `anomaly-check.mjs` | GET | PM2.5 திடீர் அதிகரிப்பு கண்டறிதல் |
### தேவைக்கேற்ப செயல்பாடுகள் (தரவு)
| செயல்பாடு | முறை | நோக்கம் |
|----------|--------|---------|
| `reddit-feed.js` | GET | காற்றின் தரம் குறித்த Reddit பதிவுகள் (தற்காலிகமாக சேமிக்கப்பட்டவை) |
| `twitter-feed.js` | — | **பழையது.** பொது Nitter நிகழ்வுகள் இல்லை; இதை யாரும் பயன்படுத்துவதில்லை. |
| `youtube-feed.js` | GET | YouTube சேனல் RSS-லிருந்து இந்தியாவின் காற்றுத் தர வீடியோக்கள் (தற்காலிகமாக சேமிக்கப்பட்டவை) |
| `instagram-feed.js` | GET | Instagram பதிவுகள் (தற்காலிகமாக சேமிக்கப்பட்டவை) |
| `news-proxy.js` | GET | செய்தி கட்டுரைகள் (தற்காலிகமாக சேமிக்கப்பட்டவை) |
| `subscribe.js` | POST | மின்னஞ்சல் சந்தா மேலாண்மை |
| `feed-status.js` | GET | ஃபீட் (Feed) புதுப்பித்தலுக்கான சரிபார்ப்பு |

### பகிரப்பட்ட பயன்பாடு
| செயல்பாடு | நோக்கம் |
|----------|---------|
| `blob-store.js` | Netlify Blobs ஸ்டோர் தொடக்கம் (மற்ற செயல்பாடுகளால் இறக்குமதி செய்யப்படுகிறது) |

### நிலையான செயல்பாடு முறை
ஒவ்வொரு செயல்பாடும் இந்த டெம்ப்ளேட்டைப் பின்பற்றுகிறது:
1. CORS ப்ரீஃப்ளையிங் கையாளுதல் (`OPTIONS` → `204`)
2. முக்கிய லாஜிக் `try/catch`-க்குள் வைக்கப்பட்டுள்ளது
3. CORS தலைப்புகளுடன் JSON பதில்
4. பிழை ஏற்பட்டால் மாற்று வழி (காலி உடலுடன் ஒருபோதும் `500`-ஐத் திருப்பித் தராது)

---

## 5. CI/CD & ஆட்டோமேஷன்

### GitHub Actions ஒர்க்ஃப்ளோக்கள்

**இணைப்பு சரிபார்த்தல்** (`ci.yml`):
- **தூண்டுதல்கள்**: `main`-க்கு புஷ், `main`-க்கு PR-கள்
- **கருவி**: Lychee இணைப்பு சரிபார்ப்பான்
- **விலக்கப்பட்டவை**: localhost, சமூக ஊடக தளங்கள், ரேட்-லிமிட் செய்யப்பட்ட டொமைன்கள், மற்றும் `docs/` மற்றும் `docs-*/` டைரக்டரிகள்
- **கான்ஃபிக்**: 30 வினாடி டைம்அவுட், ஒரு இணைப்பிற்கு 2 முயற்சிகள்

**மொழிபெயர்ப்பு ஒத்திசைவு** (`translations.yml`):
- **தூண்டுதல்கள்**: `docs/`, `docs-hi/`, `docs-bn/`, `docs-mr/`, `docs-ta/`-ல் மாற்றங்கள்
- **சரிபார்த்தல்கள்**: 4 மொழிகளில் மொழிபெயர்ப்பு கோப்பு கவரேஜ், SUMMARY.md பொருத்தம், பழைய மொழிபெயர்ப்பு கண்டறிதல்
- **அறிக்கைகள்**: ஒவ்வொரு மொழிக்கும் கவரேஜ் சதவீதம்

**ImpactMojo மொழிபெயர்ப்பு ஒத்திசைவு** (`impactmojo-translations.yml`):
- `docs-impactmojo/` டைரக்டரிகளுக்கான அதே லாஜிக்

**Dependabot** (`dependabot.yml`):
- **வரம்பு**: GitHub Actions சார்புகள் மற்றும் npm (2 அக்டோபர் 2026-ல் npm சேர்க்கப்பட்டது)
- **அதிர்வெண்**: மாதாந்திரம்
- **அதிகபட்ச திறந்த PR-கள்**: ஒரு எக்கோசிஸ்டத்திற்கு 2; npm மைனர் மற்றும் பேட்ச் அப்டேட்கள் ஒன்றாக இணைக்கப்பட்டுள்ளன

### Netlify ஆட்டோ-டெப்லாய்
- `main`-க்கு செய்யப்படும் ஒவ்வொரு புஷ்ஷும் தானியங்கி டெப்லாயைத் தூண்டுகிறது
- பில்ட் ரெப்போ ரூட்டிலிருந்து (`.`) பப்ளிஷ் செய்கிறது
- ஃபங்ஷன்ஸ் டைரக்டரி: `netlify/functions/`
- Node.js 22 ரன்டைம் (`netlify.toml`-ல் `NODE_VERSION`)

---

## 6. டெப்லாய்மென்ட் & உள்கட்டமைப்பு

### ஹோஸ்டிங் — Netlify CDN
- Let's Encrypt மூலம் தானியங்கி HTTPS
- உலகளாவிய CDN விநியோகம்
- Non-www → www ரீடைரக்ட் (கனானிக்கல் டொமைன்)
- SPA ஃபால்பேக்: அனைத்து ரூட்களும் → `/index.html`
- `/robots.txt` மற்றும் `/sitemap.xml`-க்கான சிறப்பு ரூட்கள்
### பாதுகாப்பு தலைப்புகள்
| தலைப்பு | மதிப்பு | நோக்கம் |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | கிளிக்ஜேக்கிங்கைத் தடுக்கிறது |
| `X-Content-Type-Options` | `nosniff` | MIME ஸ்னிஃபிங்கைத் தடுக்கிறது |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ரெஃபரர் தகவலைக் கட்டுப்படுத்துகிறது |

### கேஷிங் — Netlify Blobs
- வலுவான நிலைத்தன்மை மாதிரி
- திட்டமிடப்பட்ட செயல்பாடுகள் சமூக ஊடகத் தொகுப்புகள் மற்றும் செய்திகளை முன்கூட்டியே கேஷ் செய்ய இதைப் பயன்படுத்துகின்றன
- தேவைக்கேற்ப இயங்கும் செயல்பாடுகள் முதலில் கேஷிலிருந்து படிக்கின்றன, தேவைப்பட்டால் லைவ் தரவைப் பெறுகின்றன
- `@netlify/blobs` பேக்கேஜ் மூலம் அணுகப்படுகிறது

### மின்னஞ்சல் — Resend API
- தினசரி சுருக்கம் (`daily-digest.mjs`) மற்றும் பிற சர்வர்-சைடு மெயிலர்களுக்கான (`health-monitor.mjs`, `terra-collab.mjs`, `workshop-submit.mjs`) மின்னஞ்சல் டெலிவரி; `subscribe.js` மின்னஞ்சல் அனுப்பாது
- சர்வர்-சைடு மட்டும் (Netlify செயல்பாடுகள் மூலம்)

### தேவையான சூழல் மாறிகள்
| மாறி | நோக்கம் | எங்கு பயன்படுத்தப்படுகிறது |
|----------|---------|------------|
| `GROQ_API_KEY` | Groq-ஹோஸ்ட் செய்யப்பட்ட AI அம்சங்கள் (விருப்பமான `GROQ_MODEL` மூலம் மாடல் அமைக்கப்படுகிறது, இயல்புநிலை `openai/gpt-oss-120b`) | `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs` |
| `RESEND_API_KEY` | மின்னஞ்சல் டெலிவரி | `daily-digest.mjs`, `health-monitor.mjs`, `terra-collab.mjs`, `workshop-submit.mjs` |
| `RESEND_FROM` | அனுப்புநரின் மின்னஞ்சல் முகவரி | `daily-digest.mjs` |
| `BLOB_TOKEN` | Netlify Blobs அணுகல் | `blob-store.js` (கேஷிங் செயல்பாடுகளால் இறக்குமதி செய்யப்படுகிறது) |
| `NETLIFY_SITE_ID` | தள அடையாளங்காட்டி | Blobs ஸ்டோர் துவக்கம் |
| `WAQI_TOKEN` | காற்றின் தரத் தரவு (பொதுவானது, வெளியிடுவது பாதுகாப்பானது) | `app.js` மற்றும் செயல்பாடுகளில் ஹார்ட்கோட் செய்யப்பட்டுள்ளது; `rankings.mjs` மட்டுமே `process.env.WAQI_TOKEN`-ஐப் படிக்கிறது |

---

## 7. MCP சர்வர் ஒருங்கிணைப்புகள்

Claude Code ஆனது உள்ளூர் ஃபைல்சிஸ்டமைத் தாண்டி அதன் கருவி அணுகலை விரிவுபடுத்தும் Model Context Protocol (MCP) சர்வர்களை ஆதரிக்கிறது. JanVayu உருவாக்கத்தின் போது இவற்றில் எவை பயன்படுத்தப்பட்டன என்பதை ரெபாசிட்டரி பதிவு செய்யவில்லை; ஒவ்வொன்றையும் எதற்காகப் பயன்படுத்தலாம் என்பதை அட்டவணை பட்டியலிடுகிறது:
| MCP Server | கிடைக்கும் Tools | JanVayu-க்கான பயன்பாடு |
|------------|----------------|---------------------|
| **GitHub** | PR மேலாண்மை, issue கண்காணிப்பு, code search, CI checks | PR-கள், reviews, issue comments-ஐ நிர்வகித்தல் |
| **Notion** | பக்கங்களை உருவாக்குதல், databases-ஐ வினவுதல், தேடுதல், update செய்தல் | Project planning, task tracking, meeting notes |
| **Gmail** | messages-ஐ தேடுதல், threads-ஐ படித்தல், drafts-ஐ உருவாக்குதல் | Features பற்றிய email விவாதங்களை குறிப்பிடுதல் |
| **Figma** | design context, screenshots, metadata-ஐ பெறுதல் | Design mockups-ஐ HTML/CSS-ஆக மாற்றுதல் |
| **Google Calendar** | events-ஐ பட்டியலிடுதல், events-ஐ உருவாக்குதல், free time-ஐ கண்டறிதல் | Development sessions மற்றும் releases-ஐ திட்டமிடுதல் |
| **Excalidraw** | views-ஐ உருவாக்குதல், checkpoints-ஐ சேமித்தல் | Architecture diagrams மற்றும் data flow visualisation |

---

## 8. Documentation Capabilities

### பல மொழிகளில் ஆவணப்படுத்தல் (5 மொழிகள்)
| மொழி | Directory | Live Path |
|----------|-----------|-----------|
| English | `docs/` | `/docs/` |
| Hindi | `docs-hi/` | `/docs/#/hi/` |
| Bengali | `docs-bn/` | `/docs/#/bn/` |
| Marathi | `docs-mr/` | `/docs/#/mr/` |
| Tamil | `docs-ta/` | `/docs/#/ta/` |

### Documentation பிரிவுகள் (65 English பக்கங்கள்; ஒவ்வொரு மொழிபெயர்க்கப்பட்ட பிரிவிலும் 47)
- **Claude Code guides** — overview, setup, workflow, sharing, capabilities
- **Skills & AI** — air quality assistant, health advisory, accountability brief, anomaly explainer, coding practices, visual design, automation
- **Tech Stack** — overview, frontend, backend, AI layer, infrastructure, dev tooling
- **Data Sources** — overview, WAQI, health data, policy data
- **Contributing** — contribution guidelines
- **Wiki** — translation guide, role-based landing page, புதிய panel-ஐ சேர்த்தல்

### Docsify Setup
- `/docs/`-இல் உள்ள single-page Docsify shell, `docs/` directory-இல் உள்ள markdown-ஐ browser-இல் நேரடியாக render செய்கிறது
- மொழிபெயர்க்கப்பட்ட மொழிகள் Docsify hash routes (`/docs/#/hi/`, `/docs/#/bn/`, `/docs/#/mr/`, `/docs/#/ta/`) மூலம் route செய்யப்படுகின்றன
- build step இல்லை, server இல்லை, DB இல்லை — Netlify static files-ஐ மட்டும் வழங்குகிறது
- Plugins: docsify-themeable (brand theme), docsify-pagination (Prev/Next), docsify-copy-code (code-block copy), Prism.js (syntax highlighting), zoom-image
- Built-in Docsify search (client-side, 5 மொழிகளையும் index செய்கிறது)

---

## 9. Code Quality & Conventions
### கட்டமைப்பு கட்டுப்பாடுகள்
- **மூன்று முன்-முனை கோப்புகள்** — `index.html` (markup), `app.js` மற்றும் `styles.css`
- **ஃப்ரேம்வொர்க்குகள் இல்லை** — React, Vue, Angular, Svelte இல்லை
- **பில்ட் படிநிலை இல்லை** — Webpack, Vite, Rollup இல்லை
- **TypeScript இல்லை** — வெண்ணிலா JavaScript மட்டும்
- **ES2022 அதிகபட்சம்** (ESLint `ecmaVersion`) — புதிய தொடரியல் இல்லை
- **கிளையன்ட்-பக்க npm பேக்கேஜ்கள் இல்லை** — Chart.js, Leaflet, leaflet.heat மற்றும் PMTiles-க்கு CDN மட்டும்

### வடிவமைத்தல் தரநிலைகள் (`.editorconfig`)
- HTML, CSS, JS, JSON-க்கு 2-இடைவெளி இன்டென்டேஷன்
- UTF-8 என்கோடிங்
- LF வரி முடிவுகள்
- கோப்பின் முடிவில் ட்ரெய்லிங் நியூலைன்

### சார்புகள் (குறைந்தபட்சம்)
`package.json`-ல் 3 npm பேக்கேஜ்கள் மட்டுமே:
- `@netlify/blobs` — சர்வர்-பக்க கேஷிங்
- `resend` — மின்னஞ்சல் டெலிவரி
- `web-push` — புஷ் அறிவிப்புகள்

---

## 10. Claude Code உருவாக்கியது vs. மனிதர்கள் செய்ய வேண்டியவை

### Claude Code உருவாக்கியது
- Netlify Functions (சர்வர்லெஸ் பேக்கெண்ட்)
- சிங்கிள்-பேஜ் அப்ளிகேஷன் முன் முனை (`index.html`, `app.js`, `styles.css`)
- அனைத்து AI ஸ்கில் ப்ராம்ப்ட்கள் மற்றும் ப்ராம்ப்ட் இன்ஜினியரிங்
- பல மொழி Docsify ஆவணங்கள் (65 ஆங்கிலப் பக்கங்கள்; மொழிபெயர்க்கப்பட்ட ஒவ்வொரு மொழிக்கும் 47)
- கமிட் கட்டாயமாக்க Git ஹூக்குகள்
- GitHub Actions ஒர்க்ஃப்ளோக்கள்
- CHANGELOG உள்ளீடுகள் மற்றும் பதிப்பு மேலாண்மை
- குறியீடு மதிப்பாய்வு மற்றும் இலக்கு மறுசீரமைப்பு
- பக் கண்டறிதல் மற்றும் குறைந்தபட்ச தீர்வுகள்
- PR உருவாக்கம் மற்றும் மேலாண்மை

### மனிதர்களின் தலையீடு தேவை
| பணி | காரணம் |
|------|--------|
| Netlify டேஷ்போர்டு கட்டமைப்பு | சுற்றுச்சூழல் மாறிகள், டொமைன் அமைப்பு, பில்ட் அமைப்புகள் UI-மட்டும் |
| API கீ உருவாக்கம் | Groq Console, Resend, WAQI — கணக்கு உருவாக்கம் தேவை |
| வடிவமைப்பு முடிவுகள் | அம்சம் முன்னுரிமை, தரவு மூலத் தேர்வு, UX திசை |
| உள்ளடக்க மதிப்பாய்வு | தரவு துல்லியம், கொள்கை சரியான தன்மை, சட்ட இணக்கம் |
| வரிசைப்படுத்தல் சரிபார்ப்பு | வரிசைப்படுத்திய பிறகு நேரடி தளத்தின் நடத்தையைச் சரிபார்த்தல் |
| DNS கட்டமைப்பு | தனிப்பயன் டொமைன்களுக்கான டொமைன் பதிவாளர் மாற்றங்கள் |

---

## 11. செலவு விவரம்

| கூறு | செலவு |
|-----------|------|
| Netlify ஹோஸ்டிங் + ஃபங்ஷன்கள் | இலவச அடுக்கு |
| Groq API (இயல்புநிலை `openai/gpt-oss-120b`) | இலவச அடுக்கு |
| Resend மின்னஞ்சல் | இலவச அடுக்கு (ஒரு நாளைக்கு 100 மின்னஞ்சல்கள்) |
| WAQI API | இலவச அடுக்கு |
| GitHub Actions | இலவச அடுக்கு |
| Docsify (docs) | இலவசம் (ஓப்பன் சோர்ஸ், Netlify-லிருந்து வழங்கப்படுகிறது) |
| டொமைன் (`janvayu.in`) | ~$10/ஆண்டு |
| **மொத்தம்** | **~$10/ஆண்டு** (Claude Code-ன் செலவு இதில் அடங்காது) |

---

## சுருக்கம்
---
இந்த Claude Code அமைப்பு, ஒரு உற்பத்தி இணைய தளத்திற்கான முழுமையான மேம்பாட்டுச் சூழலை வழங்குகிறது:
- **28 serverless handlers** (4 AI-powered, 5 scheduled, மீதமுள்ளவை feeds, subscriptions மற்றும் data APIs) மற்றும் ஒரு பகிரப்பட்ட helper
- git hooks மூலம் **தானியங்கி code quality** (secret blocking, commit conventions, debug detection)
- link checking, translation coverage மற்றும் dependency updates-க்கான **CI/CD pipelines**
- `/docs/` இல் ஒரே shell-லிருந்து வழங்கப்படும், **5 மொழிகளில் உள்ள Docsify documentation**
- மரபு மற்றும் ஆவணப்படுத்தலால் செயல்படுத்தப்படும் **Zero-framework architecture**
- GitHub, Notion, Gmail, Figma, Calendar மற்றும் Excalidraw ஆகியவற்றுக்கான **MCP integrations**
- **குறைந்தபட்ச செலவு** — ஏறக்குறைய எல்லாமே இலவச tiers-லேயே இயங்குகின்றன
