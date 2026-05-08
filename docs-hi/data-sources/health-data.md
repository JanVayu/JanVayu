# स्वास्थ्य एवं मृत्यु दर डेटा

JanVayu वायु प्रदूषण के स्वास्थ्य प्रभावों को मापने के लिए कई अंतरराष्ट्रीय स्रोतों का उपयोग करता है।

---

## प्रमुख आँकड़े (मई 2026)

| मेट्रिक | मान | स्रोत |
|---------|-----|-------|
| **वार्षिक PM2.5 मृत्यु (भारत)** | **17.2 लाख / वर्ष** | Lancet Countdown 2025 |
| वैश्विक हिस्सेदारी | वैश्विक PM2.5 मृत्यु का ~70% | Lancet Countdown 2025 |
| औसत भारतीय जीवन-प्रत्याशा हानि | 3.5 वर्ष | AQLI 2025 |
| सिंधु-गंगा मैदान निवासियों की हानि | 7-8 वर्ष | AQLI 2025 |
| WHO 2021 PM2.5 दिशानिर्देश | 5 µg/m³ (वार्षिक) | WHO |
| भारत NAAQS PM2.5 | 40 µg/m³ (वार्षिक) | CPCB |
| Loni, India (विश्व का सर्वाधिक प्रदूषित शहर) | 112.5 µg/m³ (वार्षिक PM2.5) | IQAir 2025 |
| आर्थिक लागत | $339.4 बिलियन (~9.5% GDP) | Lancet Countdown 2025 |

---

## प्रमुख स्रोत

### Lancet Countdown 2025 — मुख्य मृत्यु आँकड़ा

**स्रोत:** *The Lancet Countdown on Health and Climate Change* (2025 रिपोर्ट, भारत अध्याय)
**URL:** [thelancet.com/countdown-health-climate](https://www.thelancet.com/countdown-health-climate)

वार्षिक *Lancet Countdown* नवीनतम exposure-response functions, जनसांख्यिकीय डेटा और PM2.5 exposure surfaces को एक एकीकृत मृत्यु अनुमान में जोड़ता है। 2025 की रिपोर्ट भारत में वार्षिक ambient PM2.5 मृत्यु को **17.2 लाख** पर रखती है — पहले के 15 लाख से अधिक। यह वृद्धि घरेलू बायोमास मृत्यु के पुन-attribution और PM2.5 के उच्च छोर पर कड़ी exposure-response के कारण है। वैश्विक PM2.5 मृत्यु बोझ में भारत की हिस्सेदारी ~70% बनी हुई है।

यह **JanVayu पर मानक मुख्य आँकड़ा** है — डैशबोर्ड पर, स्वास्थ्य प्रभाव पैनल में और README के *Key Statistics* तालिका में।

### Lancet Planetary Health — Krishna et al. (2024) कारण-संबंधी अध्ययन

[DOI: 10.1016/S2542-5196(24)00248-1](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext)

भारतीय cohort डेटा से पहला कारण-निष्कर्ष (causal inference) अनुमान। सात ज़िलों को एक दशक तक track किया और **हर +10 µg/m³ दीर्घकालिक PM2.5 के लिए ~8.6% सर्व-कारण मृत्यु वृद्धि** की dose-response का अनुमान लगाया। जब इस coefficient को भारत के PM2.5 exposure surface पर लागू किया जाता है, तो मॉडल WHO-दिशानिर्देश परिस्थितियों की तुलना में **लगभग 15 लाख** अतिरिक्त वार्षिक मृत्यु को attribute करता है।

> **दो आँकड़ों पर टिप्पणी।** 15 लाख (Krishna et al.) और 17.2 लाख (Lancet Countdown 2025) **दोनों वैध आँकड़े हैं और दोनों JanVayu पर cited हैं** — वे अलग-अलग methods से आते हैं (causal cohort vs. annual synthesis)। डैशबोर्ड hero 17.2 लाख का उपयोग करता है, जो अधिक हाल का और सामान्यतः उद्धृत आँकड़ा है।

### IHME Global Burden of Disease

- वायु प्रदूषण से मृत्यु अनुमान
- जीवन-वर्ष हानि (YLL) डेटा
- देश और राज्य-स्तरीय विश्लेषण

### AQLI 2025 — Air Quality Life Index (UChicago EPIC)

- **URL:** [aqli.epic.uchicago.edu](https://aqli.epic.uchicago.edu/)
- औसत भारतीय 3.5 वर्ष जीवन-प्रत्याशा खोता है
- सिंधु-गंगा मैदान में 7-8 वर्ष की हानि — विश्व में सर्वाधिक

### IQAir World Air Quality Report 2025

- **URL:** [iqair.com/world-air-quality-report](https://www.iqair.com/world-air-quality-report)
- Loni #1 सर्वाधिक प्रदूषित शहर (112.5 µg/m³)
- नई दिल्ली लगातार 8वें वर्ष सर्वाधिक प्रदूषित राजधानी
- केवल 14% वैश्विक शहर WHO 5 µg/m³ दिशानिर्देश को पूरा करते हैं
- भारत का औसत PM2.5: 48.9 µg/m³ (~10× WHO सीमा)

### WHO दिशानिर्देश (2021)

- PM2.5 वार्षिक: **5 µg/m³** (पूर्व मान 10 µg/m³ से कड़ा किया गया)
- PM2.5 24-घंटा: 15 µg/m³
- भारत NAAQS (40 µg/m³ वार्षिक) WHO से **8 गुना अधिक उदार** है

---

*अंतिम अद्यतन: मई 2026 — अंग्रेज़ी संस्करण ([docs/data-sources/health-data.md](../../docs/data-sources/health-data.md)) के साथ पैरिटी।*
