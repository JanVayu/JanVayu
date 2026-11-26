# ইনফ্রাস্ট্রাকচার
JanVayu সম্পূর্ণভাবে Netlify-এর প্ল্যাটফর্মে চলে এবং GitHub হলো এর সোর্স অফ ট্রুথ। এখানে কোনো ঐতিহ্যবাহী সার্ভার, ডেটাবেস বা কন্টেইনার অর্কেস্ট্রেশন নেই।
---
## Netlify
### হোস্টিং
- **CDN:** Netlify-এর গ্লোবাল এজ নেটওয়ার্ক
- **ডিপ্লয় ট্রিগার:** GitHub-এ `main`-এ পুশ করা
- **বিল্ড কমান্ড:** `node scripts/bump-version.mjs` (শুধুমাত্র ভার্সন স্ট্যাম্প; কোনো বান্ডলার নেই)
- **পাবলিশ ডিরেক্টরি:** `.` (রিপোজিটরি রুট)
- **ফাংশনস ডিরেক্টরি:** `netlify/functions/`
### কনফিগারেশন (`netlify.toml`)
```toml
[build]
  command = "node scripts/bump-version.mjs"
  publish = "."
  functions = "netlify/functions"
[build.environment]
  NODE_VERSION = "24"
```
### সিকিউরিটি হেডারস
সব পাথ (`/*`)-এ প্রয়োগ করা হয়, দুটি ব্যতিক্রম ছাড়া: `/embed/*` সেট করে `X-Frame-Options = "ALLOWALL"` যাতে যেকোনো অরিজিন থেকে উইজেট ফ্রেম করা যায়, এবং `/walkthrough/*` সেট করে `SAMEORIGIN`:
| হেডার | ভ্যালু | উদ্দেশ্য |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | ক্লিকজ্যাকিং প্রতিরোধ করে |
| `X-Content-Type-Options` | `nosniff` | MIME স্নাইফিং প্রতিরোধ করে |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | রেফারার ডেটা সীমিত করে |
### রিডাইরেক্টস
- `janvayu.in/*` → `www.janvayu.in/:splat` (301; ক্যানোনিকাল URL হলো `www.janvayu.in`)
- অন্যান্য সব রুট → `/index.html` (SPA ফলব্যাক), `/docs`, `/blog`, `/embed`, `/api`, `/ask`, `/status` এবং প্রতি-পলিউট্যান্ট পেজগুলোর জন্য `netlify.toml`-এর নির্দিষ্ট নিয়মগুলোর পর
- `/robots.txt` এবং `/sitemap.xml` SPA ফলব্যাক বাইপাস করে
---
## GitHub
### রিপোজিটরি
- **রেপো:** [github.com/JanVayu/JanVayu](https://github.com/JanVayu/JanVayu)
- **ডিফল্ট ব্রাঞ্চ:** `main`
- **ডিপ্লয়:** Netlify প্রতিটি `main`-এ পুশ করার পর বিল্ড করে (বিল্ড কখন লাইভ হয় তার জন্য [Deployment](../technical/deployment.md) দেখুন)
### CI/CD
- **GitHub Actions** (`.github/workflows/`, 16 ওয়ার্কফ্লো): `ci.yml` (`index.html`, সাইট ফিগার এবং Netlify ফাংশনগুলোর জন্য গার্ড, ইউনিট টেস্ট এবং Lychee লিংক চেকার), `link-audit`, `accessibility`, `lighthouse`, `codeql`, `translations`, `quality`, `cpcb-bulletins` (দৈনিক CPCB ফেচ), `live-audit` (CPCB-এর বিপরীতে লাইভ রিডিং), `function-health`, `ask-eval`, `current-year-air` এবং অন্যান্য
- **Dependabot** (`dependabot.yml`): GitHub Actions এবং npm-এর জন্য মাসিক আপডেট, যেখানে মাইনর এবং প্যাচ আপডেটগুলো গ্রুপ করা থাকে
### Git Hooks (`.githooks/`)
| হুক | উদ্দেশ্য |
|------|--------|
| `pre-commit` | `.env` ফাইল ব্লক করে, `console.log` ডিবাগ স্টেটমেন্ট চেক করে, মার্জ কনফ্লিক্ট মার্কার শনাক্ত করে, 500 KB-এর চেয়ে বড় ফাইলের ক্ষেত্রে সতর্ক করে |
| `commit-msg` | কমিট মেসেজের প্রিফিক্স বাধ্যতামূলক করে: `Add`, `Fix`, `Update`, `Translate`, `Docs`, `Refactor`, `Test`, `CI`, `Chore`, `Merge` |
### টেমপ্লেট
- **ইস্যু টেমপ্লেট** (বাগ রিপোর্ট, ফিচার রিকোয়েস্ট)
- চেকলিস্টসহ **পিআর টেমপ্লেট**
- **কমিট মেসেজ টেমপ্লেট** (`.gitmessage`)
---
## ডোমেইন ও ডিএনএস
- **ডোমেইন:** `janvayu.in`
- **রেজিস্ট্রার এবং ডিএনএস হোস্ট:** এখানে নথিভুক্ত করা নেই (এগুলো ভিন্ন সার্ভিস হতে পারে)
- **HTTPS:** Netlify দ্বারা সার্ভ করা হয়
- **CNAME ফাইল:** রিপোর `CNAME`-এ `www.janvayu.in` রয়েছে; একটি `CNAME` ফাইলের Netlify-তে কোনো প্রভাব নেই, যা এর নিজস্ব ড্যাশবোর্ড থেকে কাস্টম ডোমেইন গ্রহণ করে
---
## এসইও
- `robots.txt` — সমস্ত ক্রলারকে অনুমতি দেয়
- `sitemap.xml` — সার্চ ইঞ্জিনের জন্য সাইট ম্যাপ
- `og-image.png` — ওপেন গ্রাফ সোশ্যাল প্রিভিউ ইমেজ
- শিরোনাম, বিবরণ এবং OG ডেটার জন্য `index.html`-এ মেটা ট্যাগ
---
## খরচ
JanVayu **শূন্য খরচে** পরিচালিত হয়:
| সার্ভিস | টিয়ার | মাসিক খরচ |
|---------|------|-------------|
| Netlify (হোস্টিং + ফাংশন) | ফ্রি | $0 |
| GitHub | ফ্রি | $0 |
| WAQI API | ফ্রি (WAQI দ্বারা ইস্যু করা টোকেন) | $0 |
| Groq API | ফ্রি টিয়ার | $0 |
| Resend | ফ্রি প্ল্যান (দৈনিক 100 ইমেইলের লিমিট) | $0 |
| ডোমেইন (janvayu.in) | বার্ষিক রিনিউয়াল | দাম এখানে রেকর্ড করা নেই |
**মোট:** শুধুমাত্র ডোমেইন রিনিউয়াল, এমন একটি প্ল্যাটফর্মের জন্য যা রিয়েল-টাইম ডেটা, AI ফিচার এবং ইমেইল ডাইজেস্টসহ 160টি শহরের (157টি ভারতীয়, এবং বিদেশে তিনটি তুলনামূলক শহর) সেবা প্রদান করে।
