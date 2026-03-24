# আর্কিটেকচার

ImpactMojo একটি স্ট্যাটিক HTML/CSS/JS সাইট ব্যবহার করে কোনো বিল্ড স্টেপ ছাড়াই, প্রমাণীকরণের জন্য Supabase এবং হোস্টিংয়ের জন্য Netlify দ্বারা সমর্থিত। আর্কিটেকচারটি ইচ্ছাকৃতভাবে হালকা রাখা হয়েছে ধীর সংযোগ এবং পুরনো ডিভাইসের ব্যবহারকারীদের সমর্থন করতে।

---

## সিস্টেম সংক্ষিপ্ত বিবরণ

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  Static HTML/CSS/JS — no build step, no framework            │
│  auth.js · router.js · premium.js · resource-launch.js       │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────┐   ┌───────────────────────────────┐
│    Netlify (Hosting)     │   │     Supabase (Backend)        │
│  Static site deployment  │   │  Auth · Profiles · Progress   │
│  Edge Functions          │   │  Bookmarks · Certificates     │
│  mint-resource-token     │   │  Organizations · Cohorts      │
└─────────────────────────┘   │  Notifications · Payments      │
                              │  21+ PostgreSQL tables          │
                              │  Row-Level Security             │
                              └───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Premium Tool Sites (Separate Deploys)            │
│  VaniScribe · Qual Lab · RQ Builder · Code Converter         │
│  DevData · Viz Cookbook · DevEcon Toolkit                     │
│  Each site: own Netlify deploy + auth-gate Edge Function     │
└─────────────────────────────────────────────────────────────┘
```

---

## মূল উপাদান

### প্রধান সাইট (impactmojo.in)

- **হোস্টিং:** Netlify (স্ট্যাটিক ডিপ্লয়মেন্ট)
- **ফ্রন্টএন্ড:** ভ্যানিলা HTML/CSS/JS — কোনো React নেই, কোনো Vue নেই, কোনো বিল্ড টুল নেই
- **প্রধান স্ক্রিপ্ট:** `auth.js`, `router.js`, `premium.js`, `resource-launch.js`
- প্রধান সাইটে **কোনো সার্ভার-সাইড এনভায়রনমেন্ট ভেরিয়েবল** প্রয়োজন নেই

### প্রমাণীকরণ ও টোকেন সেবা

- **প্রদানকারী:** Supabase Auth (ইমেইল + পাসওয়ার্ড)
- **টোকেন জেনারেশন:** `mint-resource-token` Netlify Edge Function
- **টোকেন ধরন:** JWT (HMAC-SHA256 স্বাক্ষরিত)
- **টোকেন আয়ুষ্কাল:** ৫ মিনিট
- **ক্লেম:** ব্যবহারকারী ID, রিসোর্সের নাম, সাবস্ক্রিপশন স্তর

### ডেটাবেস (Supabase PostgreSQL)

২১+ টেবিল সহ:

| টেবিল | উদ্দেশ্য |
|-------|---------|
| `profiles` | সাবস্ক্রিপশন স্তর এবং স্থিতি সহ ব্যবহারকারী অ্যাকাউন্ট |
| `organizations` | প্রশাসক এবং সিট সীমা সহ টিম অ্যাকাউন্ট |
| `course_progress` | মডিউল সম্পন্নতা ট্র্যাকিং |
| `bookmarks` | প্রতি ব্যবহারকারীর সংরক্ষিত সংস্থান |
| `certificates` | যাচাইযোগ্য সম্পন্নতা রেকর্ড |
| `payments` | পেমেন্ট ইতিহাস এবং সাবস্ক্রিপশন ব্যবস্থাপনা |
| `cohorts` | নির্ধারিত গ্রুপ শিক্ষণ সেশন |
| `notifications` | ইন-অ্যাপ এবং ইমেইল সতর্কতা সারি |
| `user_preferences` | থিম, ভাষা, বিজ্ঞপ্তি সেটিংস |

সকল টেবিল **Row-Level Security** ব্যবহার করে — ব্যবহারকারীরা কেবল তাদের নিজস্ব রেকর্ড দেখতে এবং পরিবর্তন করতে পারেন।

### প্রিমিয়াম টুল সাইট

প্রতিটি প্রিমিয়াম টুল একটি স্বাধীন Netlify ডিপ্লয়মেন্ট হিসেবে চলে:

| টুল | বিবরণ |
|------|-------------|
| **RQ Builder Pro** | গবেষণা প্রশ্ন ডিজাইন ওয়ার্কবেঞ্চ |
| **Qual Insights Lab** | AI-সহায়তায় গুণগত সাক্ষাৎকার বিশ্লেষণ |
| **Statistical Code Converter** | R, Stata, SPSS এবং Python-এর মধ্যে রূপান্তর |
| **VaniScribe** | ১০+ দক্ষিণ এশীয় ভাষায় AI ট্রান্সক্রিপশন |
| **DevData Practice** | অনুশীলন ডেটাসেট এবং ভিজ্যুয়ালাইজেশন রেসিপি |
| **Viz Cookbook** | ডেটা ভিজ্যুয়ালাইজেশন টেমপ্লেট লাইব্রেরি |
| **DevEcon Toolkit** | ইন্টারেক্টিভ উন্নয়ন অর্থনীতি বিশ্লেষণ অ্যাপ |

**পৃথক ডিপ্লয়মেন্ট কেন?** প্রতিটি টুল আলাদা করা স্বাধীন ডিপ্লয়মেন্ট এবং পুনরাবৃত্তি অনুমোদন করে। একটি টুল বন্ধ হলে অন্যগুলি বা প্রধান সাইট প্রভাবিত হয় না।

### অ্যাক্সেস প্রবাহ (প্রিমিয়াম টুল)

```
1. User clicks "Launch Tool" on impactmojo.in
2. Client calls mint-resource-token (POST) with Supabase auth token
3. Edge Function checks subscription tier against resource requirements
4. If authorised: returns JWT token + redirect URL
5. User is redirected to tool site with ?token= parameter
6. Tool's auth-gate Edge Function validates JWT signature
7. If valid: sets 24-hour resource_session cookie
8. User accesses the tool for 24 hours without re-authentication
```

---

## ডিজাইন সিদ্ধান্ত

| সিদ্ধান্ত | যুক্তি |
|----------|-----------|
| কোনো বিল্ড স্টেপ নেই | যেকোনো ডিভাইসে কাজ করে; অবদান রাখতে Node.js প্রয়োজন নেই |
| ফ্রেমওয়ার্কের বদলে ভ্যানিলা JS | ধীর সংযোগে দ্রুত লোড; রক্ষণাবেক্ষণ সহজ |
| পৃথক টুল ডিপ্লয়মেন্ট | ত্রুটি বিচ্ছিন্নতা; স্বাধীন স্কেলিং এবং পুনরাবৃত্তি |
| কাস্টম ব্যাকএন্ডের বদলে Supabase | ম্যানেজড auth, RLS, রিয়েল-টাইম সাবস্ক্রিপশন বাক্সের বাইরে |
| স্বল্প-মেয়াদী JWT (৫ মিনিট) | টোকেন অপব্যবহারের সুযোগ ন্যূনতম; সেশন কুকি চলমান অ্যাক্সেস পরিচালনা করে |
| ম্যানুয়াল UPI পেমেন্ট | ভারতীয় ব্যবহারকারীদের জন্য পেমেন্ট গেটওয়ে ফি দূর করে |

---

## ইন্টারেক্টিভ ডেমো

> **আসন্ন** — একটি ইন্টারেক্টিভ আর্কিটেকচার ডায়াগ্রাম এখানে এম্বেড করা হবে, যা ব্রাউজার থেকে Supabase থেকে প্রিমিয়াম টুলে রিকোয়েস্ট প্রবাহ দেখাবে।

<!-- Replace this section with an Arcade embed once recorded -->
