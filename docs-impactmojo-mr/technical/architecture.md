# आर्किटेक्चर

ImpactMojo कोणत्याही बिल्ड स्टेपशिवाय स्टॅटिक HTML/CSS/JS साइट वापरते, प्रमाणीकरणासाठी Supabase आणि होस्टिंगसाठी Netlify सह. धीम्या कनेक्शन आणि जुन्या उपकरणांवरील वापरकर्त्यांना समर्थन देण्यासाठी आर्किटेक्चर जाणूनबुजून हलके ठेवले आहे.

---

## प्रणाली विहंगावलोकन

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

## मुख्य घटक

### मुख्य साइट (impactmojo.in)

- **होस्टिंग:** Netlify (स्टॅटिक डिप्लॉयमेंट)
- **फ्रंटएंड:** व्हॅनिला HTML/CSS/JS — React नाही, Vue नाही, बिल्ड टूल्स नाहीत
- **प्रमुख स्क्रिप्ट्स:** `auth.js`, `router.js`, `premium.js`, `resource-launch.js`
- मुख्य साइटवर **कोणत्याही सर्व्हर-साइड पर्यावरण चलांची** आवश्यकता नाही

### प्रमाणीकरण आणि टोकन सेवा

- **प्रदाता:** Supabase Auth (ईमेल + पासवर्ड)
- **टोकन निर्मिती:** `mint-resource-token` Netlify Edge Function
- **टोकन प्रकार:** JWT (HMAC-SHA256 स्वाक्षरित)
- **टोकन आयुष्य:** ५ मिनिटे
- **दावे:** वापरकर्ता ID, संसाधन नाव, सदस्यत्व स्तर

### डेटाबेस (Supabase PostgreSQL)

२१+ सारण्या यासह:

| सारणी | उद्देश |
|-------|---------|
| `profiles` | सदस्यत्व स्तर आणि स्थितीसह वापरकर्ता खाती |
| `organizations` | प्रशासक आणि सीट मर्यादांसह संघ खाती |
| `course_progress` | मॉड्यूल पूर्णता ट्रॅकिंग |
| `bookmarks` | प्रत्येक वापरकर्त्याची सेव्ह केलेली संसाधने |
| `certificates` | सत्यापनयोग्य पूर्णता नोंदी |
| `payments` | पेमेंट इतिहास आणि सदस्यत्व व्यवस्थापन |
| `cohorts` | अनुसूचित गट शिक्षण सत्रे |
| `notifications` | इन-ॲप आणि ईमेल सूचना रांग |
| `user_preferences` | थीम, भाषा, सूचना सेटिंग्ज |

सर्व सारण्या **Row-Level Security** वापरतात — वापरकर्ते फक्त त्यांच्या स्वतःच्या नोंदी पाहू आणि बदलू शकतात.

### प्रीमियम साधन साइट्स

प्रत्येक प्रीमियम साधन स्वतंत्र Netlify डिप्लॉयमेंट म्हणून चालते:

| साधन | वर्णन |
|------|-------------|
| **RQ Builder Pro** | संशोधन प्रश्न रचना कार्यबेंच |
| **Qual Insights Lab** | AI-सहाय्यित गुणात्मक मुलाखत विश्लेषण |
| **Statistical Code Converter** | R, Stata, SPSS आणि Python दरम्यान रूपांतरण |
| **VaniScribe** | १०+ दक्षिण आशियाई भाषांमध्ये AI ट्रान्सक्रिप्शन |
| **DevData Practice** | सराव डेटासेट्स आणि दृश्यीकरण रेसिपीज |
| **Viz Cookbook** | डेटा दृश्यीकरण टेम्पलेट लायब्ररी |
| **DevEcon Toolkit** | परस्परसंवादी विकास अर्थशास्त्र विश्लेषण ॲप्स |

**स्वतंत्र डिप्लॉयमेंट का?** प्रत्येक साधन वेगळे केल्याने स्वतंत्र तैनाती आणि पुनरावृत्ती शक्य होते. एक साधन बंद पडल्यास इतरांवर किंवा मुख्य साइटवर परिणाम होत नाही.

### प्रवेश प्रवाह (प्रीमियम साधने)

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

## रचना निर्णय

| निर्णय | कारण |
|----------|-----------|
| बिल्ड स्टेप नाही | कोणत्याही उपकरणावर काम करते; योगदानासाठी Node.js आवश्यक नाही |
| फ्रेमवर्कऐवजी व्हॅनिला JS | धीम्या कनेक्शनवर जलद लोड; देखभाल सोपी |
| स्वतंत्र साधन डिप्लॉयमेंट्स | दोष अलगीकरण; स्वतंत्र स्केलिंग आणि पुनरावृत्ती |
| सानुकूल बॅकएंडऐवजी Supabase | व्यवस्थापित auth, RLS, रिअल-टाइम सदस्यत्वे बॉक्सबाहेर |
| अल्पकालीन JWT (५ मि.) | टोकन गैरवापराची विंडो कमी करते; सत्र कुकी सतत प्रवेश हाताळते |
| मॅन्युअल UPI पेमेंट्स | भारतीय वापरकर्त्यांसाठी पेमेंट गेटवे शुल्क काढून टाकते |

---

## परस्परसंवादी डेमो

> **आगामी** — एक परस्परसंवादी आर्किटेक्चर आकृती येथे एम्बेड केली जाईल, ज्यामध्ये ब्राउझरपासून Supabase ते प्रीमियम साधनांपर्यंतचा विनंती प्रवाह दाखवला जाईल.

<!-- Replace this section with an Arcade embed once recorded -->
