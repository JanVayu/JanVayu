# কীভাবে অবদান রাখবেন

ImpactMojo ওপেন সোর্স। আমরা কোড, বিষয়বস্তু, অনুবাদ এবং ধারণার অবদান স্বাগত জানাই।

---

## অবদানের উপায়

| ধরন | কীভাবে |
|------|-----|
| **বাগ রিপোর্ট** | একটি [GitHub Issue](https://github.com/Varnasr/ImpactMojo/issues) খুলুন |
| **ফিচার অনুরোধ** | একটি [GitHub Discussion](https://github.com/Varnasr/ImpactMojo/discussions) শুরু করুন |
| **কোড অবদান** | Fork → branch → PR (নিচের ওয়ার্কফ্লো দেখুন) |
| **বিষয়বস্তু অবদান** | কোর্স, কেস স্টাডি, হ্যান্ডআউট, DevDiscourses |
| **অনুবাদ** | [অনুবাদ](translations.md) দেখুন |
| **ডেটা অবদান** | Dataverse-এর জন্য ডেটাসেট |

---

## কোড অবদানের ওয়ার্কফ্লো

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/<your-username>/ImpactMojo.git
cd ImpactMojo

# 3. Create a branch
git checkout -b feature/your-feature-name

# 4. Make changes (no build step needed — edit HTML/CSS/JS directly)

# 5. Test locally
# Open index.html in a browser, or use:
npx serve .

# 6. Commit with a clear message
git commit -m "Add: description of your change"

# 7. Push and open a PR
git push origin feature/your-feature-name
```

### কমিট বার্তার নিয়ম

| উপসর্গ | ব্যবহার |
|--------|---------|
| `Add` | নতুন ফিচার বা বিষয়বস্তু |
| `Fix` | বাগ ফিক্স |
| `Update` | বিদ্যমান ফিচারের উন্নতি |
| `Translate` | অনুবাদ সংযোজন বা উন্নতি |
| `Docs` | ডকুমেন্টেশন পরিবর্তন |
| `Refactor` | আচরণ পরিবর্তন ছাড়া কোড পুনর্গঠন |
| `Chore` | রক্ষণাবেক্ষণ, নির্ভরতা, CI |

---

## বিষয়বস্তু অবদান

### কোর্স
- ফ্ল্যাগশিপ বা ভিত্তিমূলক কোর্স টেমপ্লেট অনুসরণ করুন
- মূল শব্দের একটি অভিধান অন্তর্ভুক্ত করুন
- প্রাসঙ্গিক হলে দক্ষিণ এশিয়ার কেস স্টাডি যোগ করুন
- সহজ ভাষায় লিখুন — লক্ষ্য পাঠ্য স্তর স্নাতক

### কেস স্টাডি
- যেকোনো দেশের বাস্তব-বিশ্বের প্রোগ্রাম
- দেশ, বিষয় এবং পদ্ধতি অনুযায়ী ট্যাগ করুন
- উৎস এবং উদ্ধৃতি অন্তর্ভুক্ত করুন

### হ্যান্ডআউট
- প্রতি পৃষ্ঠায় একটি ধারণা
- সহজ ভাষা, ন্যূনতম পরিভাষা
- যেখানে সম্ভব একটি ভিজ্যুয়াল (ডায়াগ্রাম, টেবিল, বা ফ্লোচার্ট) অন্তর্ভুক্ত করুন
- প্রাথমিক উৎস উদ্ধৃত করুন

### Dataverse এন্ট্রি
- অন্তর্ভুক্ত করুন: ডেটাসেটের নাম, উৎস, অ্যাক্সেস পদ্ধতি (ডাউনলোড/API/MCP), ট্যাগ
- স্পষ্ট লাইসেন্সিং সহ উন্মুক্ত-অ্যাক্সেস ডেটাসেট পছন্দ করুন

---

## লাইসেন্সিং

অবদান রাখার মাধ্যমে, আপনি সম্মত হন যে:
- **কোড** MIT লাইসেন্সের অধীনে
- **শিক্ষামূলক বিষয়বস্তু** CC BY-NC-ND 4.0 লাইসেন্সের অধীনে

---

## যোগাযোগ

- **GitHub:** [github.com/Varnasr/ImpactMojo](https://github.com/Varnasr/ImpactMojo)
- **ইমেইল:** [hello@impactmojo.in](mailto:hello@impactmojo.in)
