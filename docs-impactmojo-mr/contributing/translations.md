# भाषांतरे

ImpactMojo दक्षिण आशियाई भाषांमध्ये विकास शिक्षण सुलभ करण्यासाठी वचनबद्ध आहे. हे मार्गदर्शिका भाषांतरात कसे योगदान द्यावे याबद्दल माहिती देते.

---

## सध्याचे भाषा समर्थन

| भाषा | व्यासपीठ | दस्तऐवज | डिरेक्टरी |
|----------|----------|------|-----------|
| English | पूर्ण | पूर्ण | `docs-impactmojo/` |
| हिन्दी (Hindi) | पूर्ण | पूर्ण | `docs-impactmojo-hi/` |
| বাংলা (Bengali) | पूर्ण | पूर्ण | `docs-impactmojo-bn/` |
| मराठी (Marathi) | पूर्ण | पूर्ण | `docs-impactmojo-mr/` |
| தமிழ் (Tamil) | पूर्ण | पूर्ण | `docs-impactmojo-ta/` |
| తెలుగు (Telugu) | केवळ व्यासपीठ | नियोजित | — |

---

## GitBook स्पेसेस

प्रत्येक भाषेचे एक सिंक केलेले GitBook स्पेस आहे:

| भाषा | दुवा | स्रोत डिरेक्टरी |
|----------|------|-----------------|
| English | [impactmojo.gitbook.io/impactmojo](https://impactmojo.gitbook.io/impactmojo/) | `docs-impactmojo/` |
| Hindi | [impactmojo.gitbook.io/impactmojo/hi](https://impactmojo.gitbook.io/impactmojo/hi/) | `docs-impactmojo-hi/` |
| Bengali | [impactmojo.gitbook.io/impactmojo/bn](https://impactmojo.gitbook.io/impactmojo/bn/) | `docs-impactmojo-bn/` |
| Marathi | [impactmojo.gitbook.io/impactmojo/mr](https://impactmojo.gitbook.io/impactmojo/mr/) | `docs-impactmojo-mr/` |
| Tamil | [impactmojo.gitbook.io/impactmojo/ta](https://impactmojo.gitbook.io/impactmojo/ta/) | `docs-impactmojo-ta/` |

---

## भाषांतर तत्त्वे

1. **शब्दशः भाषांतरापेक्षा अचूकता** — अर्थ व्यक्त करा, शब्दाशब्द भाषांतर नाही
2. **तांत्रिक संज्ञा जतन करा** — MEL, ToC, RCT, DHS, NFHS सारख्या संज्ञा इंग्रजीत ठेवा, उपयुक्त असेल तेथे कंसात लिप्यंतरण करा
3. **सोपी भाषा वापरा** — इंग्रजी मूळ इतक्याच वाचन पातळीला लक्ष्य करा
4. **सुसंगतता** — सर्व दस्तऐवजांमध्ये एकाच संज्ञेसाठी एकच भाषांतर वापरा
5. **तटस्थ स्वर** — शैक्षणिक, निष्पक्ष स्वर राखा

---

## संवेदनशील शब्दावली

काही संज्ञा इंग्रजीत ठेवाव्यात किंवा काळजीपूर्वक हाताळाव्यात:

| इंग्रजी संज्ञा | मार्गदर्शन |
|-------------|----------|
| MEL (Monitoring, Evaluation, Learning) | संक्षेप इंग्रजीत ठेवा; पहिल्या वापरावर स्थानिक भाषेत पूर्ण रूप द्या |
| Theory of Change | इंग्रजीत ठेवा; लिप्यंतरण जोडा |
| Randomised Controlled Trial (RCT) | संक्षेप ठेवा; पूर्ण रूपाचे भाषांतर करा |
| Logframe | इंग्रजीत ठेवा |
| Progressive Web App (PWA) | इंग्रजीत ठेवा |
| Row-Level Security (RLS) | इंग्रजीत ठेवा |
| Supabase, Netlify, GitBook | इंग्रजीत ठेवा (उत्पादनांची नावे) |

---

## भाषांतरात योगदान कसे द्यावे

### नवीन भाषा

1. इंग्रजी डिरेक्टरी कॉपी करा: `cp -r docs-impactmojo/ docs-impactmojo-{lang}/`
2. डिरेक्टरी रचना जतन करून प्रत्येक `.md` फाइलचे भाषांतर करा
3. भाषांतरित विभाग शीर्षकांसह `SUMMARY.md` अपडेट करा
4. पुल रिक्वेस्ट सबमिट करा

### विद्यमान भाषांतर सुधारा

1. संबंधित `docs-impactmojo-{lang}/` डिरेक्टरीमधील फाइलवर जा
2. भाषांतर संपादित करा
3. `Translate` कमिट उपसर्गासह पुल रिक्वेस्ट सबमिट करा

---

## डिरेक्टरी रचना

प्रत्येक भाषा डिरेक्टरी इंग्रजी रचनेशी अगदी जुळते:

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

GitHub Actions कार्यप्रवाह प्रत्येक `main` वर पुश केल्यावर तपासतो:
- **फाइल कव्हरेज** — प्रत्येक भाषांतर डिरेक्टरीमध्ये सर्व इंग्रजी फाइल्स उपस्थित आहेत का?
- **SUMMARY.md समानता** — सर्व भाषांतरांची अनुक्रमणिका रचना जुळते का?
- **जुने शोधन** — इंग्रजी स्रोत बदलल्यानंतर ३०+ दिवस अपडेट न झालेली भाषांतरे चिन्हांकित करते

---

## संपर्क

भाषांतर योगदानासाठी, "Translation Contribution: [Language]" या विषयासह [hello@impactmojo.in](mailto:hello@impactmojo.in) वर ईमेल करा.
