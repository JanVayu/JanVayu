# உள்கட்டமைப்பு

JanVayu முழுவதும் Netlify-ன் platform-ல் இயங்குகிறது, GitHub மூலமாக source of truth ஆக. பாரம்பரிய servers, databases அல்லது container orchestration எதுவும் இல்லை.

---

## Netlify

### Hosting

- **CDN:** Netlify-ன் global edge network
- **Deploy trigger:** GitHub-ல் `main`-க்கு push
- **Build command:** எதுவும் இல்லை (build படி இல்லை)
- **Publish directory:** `.` (repository root)
- **Functions directory:** `netlify/functions/`

### கட்டமைப்பு (`netlify.toml`)

```toml
[build]
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

### பாதுகாப்பு Headers

அனைத்து பதில்களுக்கும் பொருந்தும்:

| Header | மதிப்பு | நோக்கம் |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Clickjacking-ஐ தடுக்கிறது |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing-ஐ தடுக்கிறது |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer தரவை கட்டுப்படுத்துகிறது |

### Redirects

- `www.janvayu.in` → `janvayu.in` (canonical URL)
- அனைத்து routes → `/index.html` (SPA fallback)
- `/robots.txt` மற்றும் `/sitemap.xml` SPA fallback-ஐ தவிர்க்கின்றன

---

## GitHub

### Repository

- **Repo:** [github.com/Varnasr/JanVayu](https://github.com/Varnasr/JanVayu)
- **Default branch:** `main`
- **Branch protection:** merge-ல் தானாக deploy

### CI/CD

- **GitHub Actions** workflow (`ci.yml`): push/PR-ல் Lychee link checker
- **Dependabot** (`dependabot.yml`): GitHub Actions-க்கான மாதாந்திர updates

### Git Hooks (`.githooks/`)

| Hook | நோக்கம் |
|------|---------|
| `pre-commit` | `.env` கோப்புகளை தடுக்கிறது, `console.log` debug statements-ஐ சோதிக்கிறது, merge conflict markers-ஐ கண்டறிகிறது, 500 KB-க்கு மேல் கோப்புகளில் எச்சரிக்கிறது |
| `commit-msg` | Commit message prefixes-ஐ செயல்படுத்துகிறது: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |

### Templates

- **Issue templates** (bug report, feature request)
- checklist-உடன் **PR template**
- **Commit message template** (`.gitmessage`)

---

## Domain & DNS

- **Domain:** `janvayu.in`
- **Registrar:** Netlify DNS வழியாக நிர்வகிக்கப்படுகிறது
- **SSL:** Netlify வழியாக தானாக Let's Encrypt
- **CNAME கோப்பு:** Custom domain-ஐ Netlify-க்கு சுட்டிக்காட்டுகிறது

---

## SEO

- `robots.txt` — அனைத்து crawlers-ஐ அனுமதிக்கிறது
- `sitemap.xml` — search engines-க்கான site map
- `og-image.png` — Open Graph social preview image
- `index.html`-ல் title, description மற்றும் OG data-க்கான Meta tags

---

## செலவு

JanVayu **சூன்ய செலவில்** இயங்குகிறது:

| சேவை | Tier | மாதாந்திர செலவு |
|---------|------|-------------|
| Netlify (hosting + functions) | Free | $0 |
| GitHub | Free | $0 |
| WAQI API | Free (public token) | $0 |
| Gemini API | Free (AI Studio) | $0 |
| Resend | Free tier | $0 |
| Domain (janvayu.in) | ஆண்டு புதுப்பிப்பு | ~$10/ஆண்டு |

**மொத்தம்: ~$10/ஆண்டு** — நிகழ்நேர தரவு, AI அம்சங்கள் மற்றும் மின்னஞ்சல் சுருக்கங்களுடன் 40+ நகரங்களுக்கு சேவை செய்யும் தளத்திற்கு.
