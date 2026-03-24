# மொழிபெயர்ப்புகள்

ImpactMojo தென்னாசிய மொழிகளில் வளர்ச்சிக் கல்வியை அணுகக்கூடியதாக மாற்ற உறுதிபூண்டுள்ளது. மொழிபெயர்ப்புகளில் பங்களிப்பது எப்படி என்பதை இந்த வழிகாட்டி உள்ளடக்குகிறது.

---

## தற்போதைய மொழி ஆதரவு

| மொழி | தளம் | ஆவணங்கள் | கோப்பகம் |
|----------|----------|------|-----------|
| English | முழுமை | முழுமை | `docs-impactmojo/` |
| हिन्दी (Hindi) | முழுமை | முழுமை | `docs-impactmojo-hi/` |
| বাংলা (Bengali) | முழுமை | முழுமை | `docs-impactmojo-bn/` |
| मराठी (Marathi) | முழுமை | முழுமை | `docs-impactmojo-mr/` |
| தமிழ் (Tamil) | முழுமை | முழுமை | `docs-impactmojo-ta/` |
| తెలుగు (Telugu) | தளம் மட்டும் | திட்டமிடப்பட்டது | — |

---

## GitBook இடங்கள்

ஒவ்வொரு மொழிக்கும் ஒத்திசைக்கப்பட்ட GitBook இடம் உள்ளது:

| மொழி | இணைப்பு | ஆதார கோப்பகம் |
|----------|------|-----------------|
| English | [impactmojo.gitbook.io/impactmojo](https://impactmojo.gitbook.io/impactmojo/) | `docs-impactmojo/` |
| Hindi | [impactmojo.gitbook.io/impactmojo/hi](https://impactmojo.gitbook.io/impactmojo/hi/) | `docs-impactmojo-hi/` |
| Bengali | [impactmojo.gitbook.io/impactmojo/bn](https://impactmojo.gitbook.io/impactmojo/bn/) | `docs-impactmojo-bn/` |
| Marathi | [impactmojo.gitbook.io/impactmojo/mr](https://impactmojo.gitbook.io/impactmojo/mr/) | `docs-impactmojo-mr/` |
| Tamil | [impactmojo.gitbook.io/impactmojo/ta](https://impactmojo.gitbook.io/impactmojo/ta/) | `docs-impactmojo-ta/` |

---

## மொழிபெயர்ப்பு கொள்கைகள்

1. **சொல்லுக்குச் சொல் அல்ல, துல்லியம்** — பொருளைத் தெரிவிக்கவும், சொல்லுக்குச் சொல் மொழிபெயர்ப்பு அல்ல
2. **தொழில்நுட்ப சொற்களைப் பாதுகாக்கவும்** — MEL, ToC, RCT, DHS, NFHS போன்ற சொற்களை ஆங்கிலத்தில் வைத்திருங்கள், உதவிகரமான இடங்களில் அடைப்புக்குறிக்குள் ஒலிபெயர்ப்பு சேர்க்கவும்
3. **எளிய மொழி பயன்படுத்தவும்** — ஆங்கில மூலத்தின் அதே வாசிப்பு நிலையை இலக்காகக் கொள்ளுங்கள்
4. **நிலைத்தன்மை** — அனைத்து ஆவணங்களிலும் ஒரு சொல்லுக்கு ஒரே மொழிபெயர்ப்பைப் பயன்படுத்துங்கள்
5. **நடுநிலை தொனி** — கல்வி, கட்சி சாராத குரலை பராமரிக்கவும்

---

## உணர்திறன் சொற்கள்

சில சொற்கள் ஆங்கிலத்தில் வைக்கப்பட வேண்டும் அல்லது கவனமாக கையாளப்பட வேண்டும்:

| ஆங்கில சொல் | வழிகாட்டுதல் |
|-------------|----------|
| MEL (Monitoring, Evaluation, Learning) | சுருக்கத்தை ஆங்கிலத்தில் வைக்கவும்; முதல் பயன்பாட்டில் முழு வடிவத்தை உள்ளூர் மொழியில் வழங்கவும் |
| Theory of Change | ஆங்கிலத்தில் வைக்கவும்; ஒலிபெயர்ப்பு சேர்க்கவும் |
| Randomised Controlled Trial (RCT) | சுருக்கத்தை வைக்கவும்; முழு வடிவத்தை மொழிபெயர்க்கவும் |
| Logframe | ஆங்கிலத்தில் வைக்கவும் |
| Progressive Web App (PWA) | ஆங்கிலத்தில் வைக்கவும் |
| Row-Level Security (RLS) | ஆங்கிலத்தில் வைக்கவும் |
| Supabase, Netlify, GitBook | ஆங்கிலத்தில் வைக்கவும் (தயாரிப்பு பெயர்கள்) |

---

## மொழிபெயர்ப்பில் பங்களிப்பது எப்படி

### புதிய மொழி

1. ஆங்கில கோப்பகத்தை நகலெடுக்கவும்: `cp -r docs-impactmojo/ docs-impactmojo-{lang}/`
2. கோப்பக கட்டமைப்பைப் பாதுகாத்து ஒவ்வொரு `.md` கோப்பையும் மொழிபெயர்க்கவும்
3. மொழிபெயர்க்கப்பட்ட பகுதி தலைப்புகளுடன் `SUMMARY.md` ஐ புதுப்பிக்கவும்
4. Pull request சமர்ப்பிக்கவும்

### ஏற்கனவே உள்ள மொழிபெயர்ப்பை மேம்படுத்துதல்

1. தொடர்புடைய `docs-impactmojo-{lang}/` கோப்பகத்தில் கோப்பிற்கு செல்லவும்
2. மொழிபெயர்ப்பைத் திருத்தவும்
3. `Translate` commit முன்னொட்டுடன் pull request சமர்ப்பிக்கவும்

---

## கோப்பக கட்டமைப்பு

ஒவ்வொரு மொழி கோப்பகமும் ஆங்கில கட்டமைப்பை அப்படியே பிரதிபலிக்கிறது:

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

## CI பணிப்போக்கு

GitHub Actions பணிப்போக்கு `main` க்கு ஒவ்வொரு push இலும் சரிபார்க்கிறது:
- **கோப்பு பரப்பு** — அனைத்து ஆங்கில கோப்புகளும் ஒவ்வொரு மொழிபெயர்ப்பு கோப்பகத்திலும் உள்ளனவா?
- **SUMMARY.md சமநிலை** — அனைத்து மொழிபெயர்ப்புகளிலும் பொருந்தும் பொருளடக்க கட்டமைப்பு உள்ளதா?
- **பழமையான கண்டறிதல்** — ஆங்கில ஆதாரம் மாறிய 30+ நாட்களுக்குப் பிறகு புதுப்பிக்கப்படாத மொழிபெயர்ப்புகளை குறிக்கிறது

---

## தொடர்பு

மொழிபெயர்ப்பு பங்களிப்புகளுக்கு, "Translation Contribution: [Language]" என்ற தலைப்புடன் [hello@impactmojo.in](mailto:hello@impactmojo.in) க்கு மின்னஞ்சல் செய்யவும்.
