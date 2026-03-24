# এনভায়রনমেন্ট ভেরিয়েবল

ImpactMojo Supabase ক্রেডেনশিয়াল, JWT স্বাক্ষর এবং ইমেইল ডেলিভারির জন্য এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করে।

---

## প্রধান সাইট

প্রধান সাইট (impactmojo.in) সম্পূর্ণ স্ট্যাটিক এবং **কোনো সার্ভার-সাইড এনভায়রনমেন্ট ভেরিয়েবল** প্রয়োজন হয় না। Supabase ক্লায়েন্ট ক্রেডেনশিয়াল ফ্রন্টএন্ড JavaScript-এ এম্বেড করা আছে (এগুলি পাবলিক anon key, সিক্রেট নয়)।

---

## Supabase Edge Functions

| ভেরিয়েবল | আবশ্যক | বিবরণ |
|----------|----------|-------------|
| `SUPABASE_URL` | হ্যাঁ | Supabase প্রকল্প URL |
| `SUPABASE_ANON_KEY` | হ্যাঁ | Supabase anonymous/পাবলিক কী |
| `SUPABASE_SERVICE_ROLE_KEY` | হ্যাঁ | Supabase সার্ভিস রোল কী (কেবল সার্ভার-সাইড) |
| `JWT_SECRET` | হ্যাঁ | রিসোর্স টোকেন স্বাক্ষরের জন্য HMAC-SHA256 সিক্রেট |

---

## প্রিমিয়াম টুল সাইট (Netlify Edge Functions)

প্রতিটি প্রিমিয়াম টুল সাইটের প্রয়োজন:

| ভেরিয়েবল | আবশ্যক | বিবরণ |
|----------|----------|-------------|
| `JWT_SECRET` | হ্যাঁ | `mint-resource-token` দ্বারা ব্যবহৃত সিক্রেটের সাথে মিলতে হবে |
| `RESOURCE_NAME` | হ্যাঁ | এই টুলের সনাক্তকারী (যেমন, `rq-builder`, `qual-lab`) |

---

## ইমেইল বিজ্ঞপ্তি (Resend)

| ভেরিয়েবল | আবশ্যক | বিবরণ |
|----------|----------|-------------|
| `RESEND_API_KEY` | হ্যাঁ | [Resend](https://resend.com) থেকে API কী |
| `RESEND_FROM` | হ্যাঁ | যাচাইকৃত প্রেরক ইমেইল ঠিকানা |

**উদাহরণ:** `hello@impactmojo.in`

---

## উদাহরণ `.env` ফাইল

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT Token Signing
JWT_SECRET=your-256-bit-secret

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM=hello@impactmojo.in
```

---

## নিরাপত্তা নোট

- **কখনো `.env` ফাইল কমিট করবেন না** — এগুলি `.gitignore`-এ আছে
- `SUPABASE_SERVICE_ROLE_KEY` RLS বাইপাস করে — কেবল সার্ভার-সাইড ফাংশনে ব্যবহার করুন
- `JWT_SECRET` টোকেন মিন্টিং ফাংশন এবং সকল টুল auth gate-এ অভিন্ন হতে হবে
- `SUPABASE_ANON_KEY` ক্লায়েন্ট-সাইডে প্রকাশ করা নিরাপদ (RLS প্রয়োগ করে)
