# अनुवाद

ImpactMojo दक्षिण एशियाई भाषाओं में विकास शिक्षा को सुलभ बनाने के लिए प्रतिबद्ध है। यह गाइड अनुवाद में योगदान करने का तरीका बताती है।

---

## वर्तमान भाषा समर्थन

| भाषा | प्लेटफ़ॉर्म | प्रलेख | निर्देशिका |
|----------|----------|------|-----------|
| English | पूर्ण | पूर्ण | `docs-impactmojo/` |
| हिन्दी (Hindi) | पूर्ण | पूर्ण | `docs-impactmojo-hi/` |
| বাংলা (Bengali) | पूर्ण | पूर्ण | `docs-impactmojo-bn/` |
| मराठी (Marathi) | पूर्ण | पूर्ण | `docs-impactmojo-mr/` |
| தமிழ் (Tamil) | पूर्ण | पूर्ण | `docs-impactmojo-ta/` |
| తెలుగు (Telugu) | केवल प्लेटफ़ॉर्म | नियोजित | — |

---

## GitBook स्पेस

प्रत्येक भाषा का एक सिंक किया गया GitBook स्पेस है:

| भाषा | लिंक | स्रोत निर्देशिका |
|----------|------|-----------------|
| English | [impactmojo.gitbook.io/impactmojo](https://impactmojo.gitbook.io/impactmojo/) | `docs-impactmojo/` |
| Hindi | [impactmojo.gitbook.io/impactmojo/hi](https://impactmojo.gitbook.io/impactmojo/hi/) | `docs-impactmojo-hi/` |
| Bengali | [impactmojo.gitbook.io/impactmojo/bn](https://impactmojo.gitbook.io/impactmojo/bn/) | `docs-impactmojo-bn/` |
| Marathi | [impactmojo.gitbook.io/impactmojo/mr](https://impactmojo.gitbook.io/impactmojo/mr/) | `docs-impactmojo-mr/` |
| Tamil | [impactmojo.gitbook.io/impactmojo/ta](https://impactmojo.gitbook.io/impactmojo/ta/) | `docs-impactmojo-ta/` |

---

## अनुवाद सिद्धांत

1. **शाब्दिकता पर सटीकता** — शब्द-दर-शब्द अनुवाद नहीं, बल्कि अर्थ संप्रेषित करें
2. **तकनीकी शब्द संरक्षित रखें** — MEL, ToC, RCT, DHS, NFHS जैसे शब्द अंग्रेज़ी में रखें, जहाँ सहायक हो कोष्ठक में लिप्यंतरण दें
3. **सरल भाषा का उपयोग करें** — अंग्रेज़ी मूल के समान पठन स्तर को लक्षित करें
4. **निरंतरता** — सभी दस्तावेज़ों में एक शब्द के लिए समान अनुवाद का उपयोग करें
5. **तटस्थ स्वर** — शैक्षिक, गैर-पक्षपातपूर्ण आवाज़ बनाए रखें

---

## संवेदनशील शब्दावली

कुछ शब्दों को अंग्रेज़ी में रखा जाना चाहिए या सावधानी से संभाला जाना चाहिए:

| अंग्रेज़ी शब्द | मार्गदर्शन |
|-------------|----------|
| MEL (Monitoring, Evaluation, Learning) | संक्षिप्त नाम अंग्रेज़ी में रखें; पहले उपयोग पर स्थानीय भाषा में पूर्ण रूप दें |
| Theory of Change | अंग्रेज़ी में रखें; लिप्यंतरण जोड़ें |
| Randomised Controlled Trial (RCT) | संक्षिप्त नाम रखें; पूर्ण रूप का अनुवाद करें |
| Logframe | अंग्रेज़ी में रखें |
| Progressive Web App (PWA) | अंग्रेज़ी में रखें |
| Row-Level Security (RLS) | अंग्रेज़ी में रखें |
| Supabase, Netlify, GitBook | अंग्रेज़ी में रखें (उत्पाद नाम) |

---

## अनुवाद में योगदान कैसे करें

### नई भाषा

1. अंग्रेज़ी निर्देशिका कॉपी करें: `cp -r docs-impactmojo/ docs-impactmojo-{lang}/`
2. निर्देशिका संरचना को संरक्षित करते हुए प्रत्येक `.md` फ़ाइल का अनुवाद करें
3. अनुवादित खंड शीर्षकों के साथ `SUMMARY.md` अपडेट करें
4. एक पुल रिक्वेस्ट सबमिट करें

### मौजूदा अनुवाद में सुधार

1. संबंधित `docs-impactmojo-{lang}/` निर्देशिका में फ़ाइल पर जाएँ
2. अनुवाद संपादित करें
3. `Translate` कमिट उपसर्ग के साथ पुल रिक्वेस्ट सबमिट करें

---

## निर्देशिका संरचना

प्रत्येक भाषा निर्देशिका अंग्रेज़ी संरचना का बिल्कुल अनुसरण करती है:

```
docs-impactmojo-{lang}/
├── README.md
├── SUMMARY.md
├── for-educators/
│   ├── platform-overview.md
│   ├── getting-started.md
│   ├── workshops-and-facilitation.md
│   ├── handouts-guide.md
│   ├── dataverse-guide.md
│   └── faq.md
├── api/
│   └── README.md
├── technical/
│   ├── architecture.md
│   ├── deployment.md
│   └── environment-variables.md
├── contributing/
│   ├── how-to-contribute.md
│   └── translations.md
├── reference/
│   ├── roadmap.md
│   ├── changelog.md
│   └── glossary.md
└── about/
    ├── background.md
    ├── license.md
    └── contact.md
```

---

## CI कार्यप्रवाह

एक GitHub Actions कार्यप्रवाह `main` में प्रत्येक पुश पर जाँच करता है:
- **फ़ाइल कवरेज** — क्या सभी अंग्रेज़ी फ़ाइलें प्रत्येक अनुवाद निर्देशिका में मौजूद हैं?
- **SUMMARY.md समानता** — क्या सभी अनुवादों में मिलान करने वाली विषय सूची संरचना है?
- **पुरानी पहचान** — उन अनुवादों को चिह्नित करता है जो अंग्रेज़ी स्रोत बदलने के 30+ दिनों बाद अपडेट नहीं किए गए

---

## संपर्क

अनुवाद योगदान के लिए, विषय पंक्ति "Translation Contribution: [Language]" के साथ [hello@impactmojo.in](mailto:hello@impactmojo.in) पर ईमेल करें।
