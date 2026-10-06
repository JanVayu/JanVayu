# ইনফ্রাস্ট্রাকচার

JanVayu সম্পূর্ণভাবে Netlify-এর প্ল্যাটফর্মে চলে এবং GitHub হলো এর সোর্স অফ ট্রুথ। এখানে কোনো ট্র্যাডিশনাল সার্ভার, ডেটাবেস বা কন্টেইনার অর্কেস্ট্রেশন নেই।

---

## Netlify

### হোস্টিং

- **CDN:** Netlify-এর গ্লোবাল এজ নেটওয়ার্ক
- **ডিপ্লয় ট্রিগার:** GitHub-এ `main`-এ পুশ করা
- **বিল্ড কমান্ড:** `node scripts/bump-version.mjs` (শুধুমাত্র ভার্সন স্ট্যাম্প; কোনো বান্ডলার নেই)
- **পাবলিশ ডিরেক্টরি:** `.` (রেপোজিটরি রুট)
- **ফাংশনস ডিরেক্টরি:** `netlify/functions/`

### কনফিগারেশন (`netlify.toml`)

```toml
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"
```

### সিকিউরিটি হেডারস

সব পাথ-এ (`/*`) প্রয়োগ করা হয়, তবে দুটি ব্যতিক্রম রয়েছে: `/embed/*` সেট করে `X-Frame-Options = "ALLOWALL"` যাতে যেকোনো অরিজিন থেকে উইজেট ফ্রেম করা যায়, এবং `/walkthrough/*` সেট করে `SAMEORIGIN`:

| হেডার | ভ্যালু | উদ্দেশ্য |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | ক্লিকজ্যাকিং প্রতিরোধ করে |
| `X-Content-Type-Options` | `nosniff` | MIME স্নাইফিং প্রতিরোধ করে |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | রেফারার ডেটা সীমিত করে |

### রিডাইরেক্টস

- `janvayu.in/*` → `www.janvayu.in/:splat` (301; ক্যানোনিকাল URL হলো `www.janvayu.in`)
- অন্যান্য সব রুট → `/index.html` (SPA ফলব্যাক), `/docs`, `/blog`, `/embed`, `/api`, `/ask`, `/status` এবং পার-পলিউশন পেজগুলোর জন্য `netlify.toml`-এর নির্দিষ্ট নিয়মগুলো প্রয়োগ করার পর
- `/robots.txt` এবং `/sitemap.xml` SPA ফলব্যাক বাইপাস করে

---

## GitHub

### রেপোজিটরি

- **রেপো:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **ডিফল্ট ব্রাঞ্চ:** `main`
- **ডিপ্লয়:** `main`-এ পুশ করলে অটো-ডিপ্লয় হয়

### CI/CD

- **GitHub Actions** (`.github/workflows/`, ১৪টি ওয়ার্কফ্লো): `ci.yml` (`index.html`, সাইট ফিগার এবং Netlify ফাংশনগুলোর জন্য গার্ড, সাথে Lychee লিংক চেকার), `link-audit`, `accessibility`, `lighthouse`, `codeql`, `translations`, `quality` এবং অন্যান্য
- **Dependabot** (`dependabot.yml`): GitHub Actions এবং npm-এর জন্য মাসিক আপডেট, যেখানে মাইনর এবং প্যাচ আপডেটগুলো গ্রুপ করা থাকে

### Git Hooks (`.githooks/`)

| হুক | উদ্দেশ্য |
|------|--------|
| `pre-commit` | `.env` ফাইল ব্লক করে, `console.log` ডিবাগ স্টেটমেন্ট চেক করে, মার্জ কনফ্লিক্ট মার্কার শনাক্ত করে, ৫০০ KB-এর বেশি ফাইলের ক্ষেত্রে ওয়ার্নিং দেয় |
| `commit-msg` | কমিট মেসেজ প্রিফিক্স নিশ্চিত করে: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |

### টেমপ্লেটস
- **Issue templates** (বাগ রিপোর্ট, ফিচার রিকোয়েস্ট)
- চেকলিস্টসহ **PR template**
- **Commit message template** (`.gitmessage`)

---

## ডোমেইন ও DNS

- **Domain:** `janvayu.in`
- **Registrar এবং DNS host:** এখানে ডকুমেন্ট করা নেই (এগুলো আলাদা সার্ভিস হতে পারে)
- **HTTPS:** Netlify দ্বারা সার্ভ করা হয়
- **CNAME ফাইল:** রেপোর `CNAME`-এ `www.janvayu.in` আছে; একটি `CNAME` ফাইলের Netlify-এ কোনো প্রভাব নেই, কারণ এটি কাস্টম ডোমেইন তার নিজস্ব ড্যাশবোর্ড থেকে নেয়

---

## SEO

- `robots.txt` — সব ক্রলারকে অ্যালাউ করে
- `sitemap.xml` — সার্চ ইঞ্জিনগুলোর জন্য সাইট ম্যাপ
- `og-image.png` — ওপেন গ্রাফ সোশ্যাল প্রিভিউ ইমেজ
- টাইটেল, ডেসক্রিপশন এবং OG ডেটার জন্য `index.html`-এ মেটা ট্যাগ

---

## খরচ

JanVayu **শূন্য খরচে** চলে:

| সার্ভিস | টিয়ার | মাসিক খরচ |
|---------|------|-------------|
| Netlify (হোস্টিং + ফাংশন) | ফ্রি | $0 |
| GitHub | ফ্রি | $0 |
| WAQI API | ফ্রি (WAQI দ্বারা ইস্যু করা টোকেন) | $0 |
| Groq API | ফ্রি টিয়ার | $0 |
| Resend | ফ্রি প্ল্যান (দৈনিক ১০০ ইমেইলের লিমিট) | $0 |
| Domain (janvayu.in) | বার্ষিক রিনিউয়াল | দাম এখানে রেকর্ড করা নেই |

**মোট:** শুধুমাত্র ডোমেইন রিনিউয়াল, এমন একটি প্ল্যাটফর্মের জন্য যা রিয়েল-টাইম ডেটা, AI ফিচার এবং ইমেইল ডাইজেস্টের মাধ্যমে ১৬০টি শহরে (১৫৭টি ভারতীয়, সাথে বিদেশের তিনটি তুলনামূলক শহর) সেবা দিচ্ছে।
