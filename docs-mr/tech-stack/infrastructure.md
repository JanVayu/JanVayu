# इन्फ्रास्ट्रक्चर

JanVayu पूर्णपणे Netlify च्या प्लॅटफॉर्मवर चालतो, GitHub सत्याचा स्रोत म्हणून. कोणतेही पारंपारिक सर्व्हर, डेटाबेस किंवा container orchestration नाही.

---

## Netlify

### होस्टिंग

- **CDN:** Netlify चे जागतिक edge network
- **Deploy trigger:** GitHub वर `main` वर push
- **Build command:** काहीही नाही (बिल्ड स्टेप नाही)
- **Publish directory:** `.` (repository root)
- **Functions directory:** `netlify/functions/`

### कॉन्फिगरेशन (`netlify.toml`)

```toml
[build]
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

### Security Headers

सर्व प्रतिसादांना लागू:

| Header | मूल्य | उद्देश |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | Clickjacking प्रतिबंधित करतो |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing प्रतिबंधित करतो |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer डेटा मर्यादित करतो |

### Redirects

- `www.janvayu.in` → `janvayu.in` (canonical URL)
- सर्व routes → `/index.html` (SPA fallback)
- `/robots.txt` आणि `/sitemap.xml` SPA fallback bypass करतात

---

## GitHub

### Repository

- **Repo:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **Default branch:** `main`
- **Branch protection:** merge वर ऑटो-deploy

### CI/CD

- **GitHub Actions** workflow (`ci.yml`): push/PR वर Lychee link checker
- **Dependabot** (`dependabot.yml`): npm आणि GitHub Actions अपडेट्ससाठी मासिक तपासणी

### Git Hooks (`.githooks/`)

| Hook | उद्देश |
|------|--------|
| `pre-commit` | `.env` फाइल्स ब्लॉक करतो, `console.log` debug statements तपासतो, merge conflict markers शोधतो, 500 KB पेक्षा मोठ्या फाइल्सवर चेतावणी देतो |
| `commit-msg` | Commit message prefixes लागू करतो: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |

### Templates

- **Issue templates** (bug report, feature request)
- checklist सह **PR template**
- **Commit message template** (`.gitmessage`)

---

## Domain आणि DNS

- **Domain:** `janvayu.in`
- **Registrar:** Netlify DNS द्वारे व्यवस्थापित
- **SSL:** Netlify द्वारे स्वयंचलित Let's Encrypt
- **CNAME file:** कस्टम domain Netlify कडे निर्देशित करतो

---

## SEO

- `robots.txt` — सर्व crawlers ना परवानगी देतो
- `sitemap.xml` — शोध इंजिनांसाठी site map
- `og-image.png` — Open Graph सोशल preview image
- title, description आणि OG data साठी `index.html` मधील Meta tags

---

## खर्च

JanVayu **शून्य खर्चात** चालतो:

| सेवा | टियर | मासिक खर्च |
|---------|------|-------------|
| Netlify (hosting + functions) | Free | $0 |
| GitHub | Free | $0 |
| WAQI API | Free (public token) | $0 |
| Gemini API | Free (AI Studio) | $0 |
| Resend | Free tier | $0 |
| Domain (janvayu.in) | वार्षिक नूतनीकरण | ~$10/वर्ष |

**एकूण: ~$10/वर्ष** रिअल-टाइम डेटा, AI वैशिष्ट्ये आणि ईमेल डायजेस्टसह 40+ शहरांसाठी सेवा देणार्‍या व्यासपीठासाठी.
