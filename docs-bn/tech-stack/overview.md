# টেক স্ট্যাক পরিচিতি

JanVayu ইচ্ছাকৃতভাবে একটি ন্যূনতম স্ট্যাকে তৈরি — জিরো frontend framework, তিনটি npm dependency, এবং একটি serverless backend। এই পেজ প্রতিটি ব্যবহৃত প্রযুক্তি এবং কেন সেটি বেছে নেওয়া হয়েছে তার মানচিত্র দেয়।

---

## এক নজরে স্ট্যাক

| স্তর | প্রযুক্তি | উদ্দেশ্য |
|-------|-----------|---------|
| **Frontend** | Vanilla HTML/CSS/JS | সিঙ্গেল-পেজ অ্যাপ্লিকেশন (কোনো বিল্ড স্টেপ নেই) |
| **Charts** | Chart.js (CDN) | AQI ট্রেন্ড ভিজুয়ালাইজেশন |
| **Maps** | Leaflet.js + OpenStreetMap (CDN) | ইন্টারেক্টিভ স্টেশন মানচিত্র |
| **Backend** | Netlify Functions (Node.js 18) | Serverless API endpoints |
| **Cache** | Netlify Blobs | Persistent JSON ক্যাশ (strong consistency) |
| **Email** | Resend API | দৈনিক AQI ডাইজেস্ট ডেলিভারি |
| **AI** | Google Gemini 2.5 Flash | NL queries, স্বাস্থ্য পরামর্শ, anomaly detection |
| **Hosting** | Netlify CDN | GitHub `main` থেকে স্বয়ংক্রিয় ডিপ্লয় |
| **CI** | GitHub Actions | লিঙ্ক চেকিং, Dependabot |
| **Domain** | Netlify DNS | janvayu.in কাস্টম ডোমেইন |
| **Development** | Claude Code (Anthropic) | AI-সহায়তা ডেভেলপমেন্ট ওয়ার্কফ্লো |

---

## কেন এই স্ট্যাক?

### জিরো-ফ্রেমওয়ার্ক Frontend

JanVayu-র দর্শকদের মধ্যে ভারতজুড়ে 2G সংযোগ এবং নিম্নমানের Android ডিভাইসের ব্যবহারকারী রয়েছে। React বা Vue এর মতো ফ্রেমওয়ার্ক একটি ফিচার লোড হওয়ার আগেই 40-100 KB JavaScript যোগ করত। পরিবর্তে:

- সম্পূর্ণ অ্যাপটি একটি `index.html` ফাইল (ইনলাইন CSS + JS)
- কোনো transpilation নেই, কোনো bundling নেই, কোনো tree-shaking প্রয়োজন নেই
- Deploy artefact = repo নিজেই
- মৌলিক HTML/JS দক্ষতা সম্পন্ন যেকোনো contributor অবদান রাখতে পারেন

### মাত্র 3টি npm Dependency

```json
{
  "@google/generative-ai": "^0.24.1",
  "@netlify/blobs": "^8.1.0",
  "resend": "^6.9.3"
}
```

তিনটিই শুধু সার্ভার-সাইড (Netlify Functions দ্বারা ব্যবহৃত)। ক্লায়েন্টের কোনো npm dependency নেই — Chart.js এবং Leaflet.js CDN থেকে লোড হয়।

### Serverless Over Server

Netlify Functions একটি persistent server-এর প্রয়োজনীয়তা দূর করে। সুবিধা:
- জিরো ops বোঝা (কোনো সার্ভার প্যাচিং নেই, কোনো স্কেলিং নেই)
- ফ্রি টায়ার JanVayu-র ট্রাফিক কভার করে
- স্বয়ংক্রিয় HTTPS, CDN, এবং edge deployment
- Functions cold-start < 500ms-এ

---

## বিস্তারিত ভাঙ্গন

| বিভাগ | পেজ |
|---------|------|
| Frontend (HTML/CSS/JS, Chart.js, Leaflet) | [Frontend Stack](frontend.md) |
| Backend (Netlify Functions, Blobs, Resend) | [Backend Stack](backend.md) |
| AI Layer (Gemini 2.5 Flash) | [AI Stack](ai-layer.md) |
| Infrastructure (Netlify, GitHub, DNS) | [Infrastructure](infrastructure.md) |
| Development Tools (Claude Code, Git hooks) | [Dev Tooling](dev-tooling.md) |
