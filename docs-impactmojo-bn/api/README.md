# API রেফারেন্স

ImpactMojo প্রমাণীকরণ, টোকেন মিন্টিং এবং প্রিমিয়াম রিসোর্স অ্যাক্সেসের জন্য কিছু এন্ডপয়েন্ট প্রকাশ করে।

**বেস URL:** `https://www.impactmojo.in/.netlify/functions` (Netlify Functions)
**Supabase URL:** `https://<project>.supabase.co/functions/v1` (Edge Functions)

---

## এন্ডপয়েন্ট

### প্রমাণীকরণ

ImpactMojo Supabase Auth ব্যবহার করে। সাইনআপ, লগইন এবং সেশন ম্যানেজমেন্টের জন্য [Supabase Auth API ডকুমেন্টেশন](https://supabase.com/docs/reference/javascript/auth-signup) দেখুন।

### mint-resource-token

**`POST`** `/functions/v1/mint-resource-token`

প্রিমিয়াম টুলে অ্যাক্সেসের জন্য একটি স্বল্প-মেয়াদী JWT তৈরি করে।

**হেডার:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**রিকোয়েস্ট বডি:**
```json
{
  "resource_id": "rq-builder"
}
```

**সফল প্রতিক্রিয়া (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "url": "https://rq-builder.impactmojo.in/?token=eyJhbGciOiJIUzI1NiIs..."
}
```

**ত্রুটি প্রতিক্রিয়া (403):**
```json
{
  "error": "Your subscription tier does not include this resource"
}
```

**টোকেন ক্লেম:**
| ক্লেম | বিবরণ |
|-------|-------------|
| `sub` | ব্যবহারকারী ID (UUID) |
| `resource` | রিসোর্সের নাম (যেমন, `rq-builder`) |
| `tier` | ব্যবহারকারীর সাবস্ক্রিপশন স্তর |
| `exp` | মেয়াদ শেষ (ইস্যুর ৫ মিনিট পরে) |

---

### auth-gate (Edge Function)

**প্রতিটি প্রিমিয়াম টুল সাইটে চলে।** সরাসরি কল করা হয় না — টুলের সমস্ত রিকোয়েস্ট ইন্টারসেপ্ট করে।

**যাচাই প্রবাহ:**
1. বিদ্যমান `resource_session` কুকি চেক করুন
2. কুকি না থাকলে, `?token=` কোয়েরি প্যারামিটার JWT স্বাক্ষর যাচাই করুন
3. রিসোর্স ক্লেম সাইটের `RESOURCE_NAME` এনভায়রনমেন্ট ভেরিয়েবলের সাথে মেলে কিনা নিশ্চিত করুন
4. সফল হলে ২৪-ঘণ্টার `resource_session` কুকি সেট করুন
5. অপ্রমাণীকৃত ব্যবহারকারীদের লগইনে রিডাইরেক্ট করুন

---

## রিসোর্স ID

| রিসোর্স ID | টুল | ন্যূনতম স্তর |
|------------|------|-------------|
| `rq-builder` | Research Question Builder Pro | Practitioner |
| `code-convert` | Statistical Code Converter Pro | Professional |
| `qual-insights` | Qualitative Insights Lab Pro | Professional |
| `vaniscribe` | VaniScribe AI Transcription | Professional |
| `devdata` | DevData Practice | Professional |
| `viz-cookbook` | Viz Cookbook | Professional |
| `devecon-toolkit` | DevEconomics Toolkit | Professional |

---

## ডেটাবেস স্কিমা

### Profiles টেবিল

| কলাম | ধরন | বিবরণ |
|--------|------|-------------|
| `id` | UUID | প্রাইমারি কী (Supabase auth ব্যবহারকারী ID-র সাথে মেলে) |
| `email` | text | ব্যবহারকারীর ইমেইল |
| `full_name` | text | প্রদর্শন নাম |
| `subscription_tier` | enum | `explorer`, `practitioner`, `professional`, `organization` |
| `subscription_status` | enum | `active`, `expired`, `cancelled` |
| `organization_id` | UUID | organizations টেবিলের ফরেন কী (nullable) |

### Organizations টেবিল

| কলাম | ধরন | বিবরণ |
|--------|------|-------------|
| `id` | UUID | প্রাইমারি কী |
| `name` | text | সংস্থার নাম |
| `admin_id` | UUID | profiles-এর ফরেন কী |
| `max_seats` | integer | সর্বাধিক দলের সদস্য |

**Row-Level Security:** সকল টেবিল RLS প্রয়োগ করে। ব্যবহারকারীরা কেবল তাদের নিজস্ব রেকর্ড দেখতে এবং পরিবর্তন করতে পারেন।

---

## রেট লিমিট

| এন্ডপয়েন্ট | সীমা |
|----------|-------|
| Supabase Auth | প্রতি IP-তে ৩০ রিকোয়েস্ট/মিনিট |
| mint-resource-token | Supabase Edge Function সীমা (বিনামূল্যে ৫০০K ইনভোকেশন/মাস) |
| প্রিমিয়াম টুল অ্যাক্সেস | প্রমাণীকৃত হলে কোনো সীমা নেই (২৪-ঘণ্টা সেশন) |

---

## উদাহরণ: সম্পূর্ণ অ্যাক্সেস প্রবাহ

```bash
# 1. Login via Supabase
curl -X POST https://<project>.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: <anon_key>" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. Mint a resource token
curl -X POST https://<project>.supabase.co/functions/v1/mint-resource-token \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"resource_id": "rq-builder"}'

# 3. User is redirected to tool URL with token parameter
# The auth-gate Edge Function validates and sets a session cookie
```
