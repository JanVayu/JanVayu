# आरोग्य आणि मृत्यू दर डेटा

JanVayu वायू प्रदूषणाचे आरोग्यावरील परिणाम मोजण्यासाठी अनेक आंतरराष्ट्रीय स्रोत वापरते.

---

## प्रमुख आकडेवारी (मे 2026)

| मेट्रिक | मूल्य | स्रोत |
|---------|-------|-------|
| **वार्षिक PM2.5 मृत्यू (भारत)** | **17.2 लाख / वर्ष** | Lancet Countdown 2025 |
| जागतिक हिस्सा | जागतिक PM2.5 मृत्यूंपैकी ~70% | Lancet Countdown 2025 |
| सरासरी भारतीय आयुर्मान हानी | 3.5 वर्षे | AQLI 2025 |
| सिंधू-गंगा मैदानी रहिवाशांची हानी | 7-8 वर्षे | AQLI 2025 |
| WHO 2021 PM2.5 मार्गदर्शक तत्त्व | 5 µg/m³ (वार्षिक) | WHO |
| भारत NAAQS PM2.5 | 40 µg/m³ (वार्षिक) | CPCB |
| Loni, India (जगातील सर्वाधिक प्रदूषित शहर) | 112.5 µg/m³ (वार्षिक PM2.5) | IQAir 2025 |
| आर्थिक खर्च | $339.4 अब्ज (~9.5% GDP) | Lancet Countdown 2025 |

---

## प्रमुख स्रोत

### Lancet Countdown 2025 — मुख्य मृत्यू आकडा

**स्रोत:** *The Lancet Countdown on Health and Climate Change* (2025 अहवाल, भारत अध्याय)
**URL:** [thelancet.com/countdown-health-climate](https://www.thelancet.com/countdown-health-climate)

वार्षिक *Lancet Countdown* नवीनतम exposure-response functions, लोकसंख्याशास्त्रीय डेटा आणि PM2.5 exposure surfaces एकत्र करून एकल attributable-mortality अंदाज तयार करतो. 2025 चा अहवाल भारतातील वार्षिक ambient PM2.5 मृत्यूंना **17.2 लाख** वर ठेवतो — पूर्वीच्या 15 लाखांपेक्षा जास्त. ही वाढ घरगुती बायोमास मृत्यूंच्या पुनर्-attribution आणि PM2.5 च्या उच्च टोकाला कडक exposure-response मुळे आहे. जागतिक PM2.5 मृत्यू भारात भारताचा वाटा ~70% कायम आहे.

हा **JanVayu वर मानक मुख्य आकडा** आहे — डॅशबोर्डवर, आरोग्य प्रभाव पॅनेलमध्ये आणि README च्या *Key Statistics* तक्त्यात.

### Lancet Planetary Health — Jaganathan et al. (2024) कारण-संबंधित अभ्यास

[DOI: 10.1016/S2542-5196(24)00248-1](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext)

भारतीय cohort डेटा वरून प्रथम causal-inference अंदाज. सात जिल्हे एका दशकात track केले आणि **दर +10 µg/m³ दीर्घकालीन PM2.5 साठी ~8.6% सर्व-कारण मृत्यू वाढ** ची dose-response अंदाज लावली. जेव्हा हा coefficient भारताच्या PM2.5 exposure surface वर लागू केला जातो, मॉडेल WHO-मार्गदर्शक स्थितीच्या तुलनेत **सुमारे 15 लाख** अतिरिक्त वार्षिक मृत्यू attribute करतो.

> **दोन आकड्यांबद्दल टीप.** 15 लाख (Jaganathan et al.) आणि 17.2 लाख (Lancet Countdown 2025) — **दोन्ही वैध आहेत आणि दोन्ही JanVayu वर cited आहेत**. ते वेगवेगळ्या methods मधून येतात (nationwide difference-in-differences vs. annual synthesis). डॅशबोर्ड hero 17.2 लाख वापरतो, जो अधिक अलीकडचा आणि सामान्यतः उद्धृत आकडा आहे.

### IHME Global Burden of Disease

- वायू प्रदूषणामुळे मृत्यू अंदाज
- जीवन-वर्ष हानी (YLL) डेटा
- देश आणि राज्य-स्तरीय विश्लेषण

### AQLI 2025 — Air Quality Life Index (UChicago EPIC)

- **URL:** [aqli.epic.uchicago.edu](https://aqli.epic.uchicago.edu/)
- सरासरी भारतीय 3.5 वर्षे आयुर्मान गमावतो
- सिंधू-गंगा मैदानात 7-8 वर्षांची हानी — जगात सर्वोच्च

### IQAir World Air Quality Report 2025

- **URL:** [iqair.com/world-air-quality-report](https://www.iqair.com/world-air-quality-report)
- Loni #1 सर्वाधिक प्रदूषित शहर (112.5 µg/m³)
- नवी दिल्ली सलग 8 व्या वर्षी सर्वाधिक प्रदूषित राजधानी
- फक्त 14% जागतिक शहरे WHO 5 µg/m³ मार्गदर्शक तत्त्व पूर्ण करतात
- भारताचा सरासरी PM2.5: 48.9 µg/m³ (~10× WHO मर्यादा)

### WHO मार्गदर्शक तत्त्वे (2021)

- PM2.5 वार्षिक: **5 µg/m³** (पूर्वीच्या 10 µg/m³ वरून कडक)
- PM2.5 24-तास: 15 µg/m³
- भारत NAAQS (40 µg/m³ वार्षिक) WHO पेक्षा **8 पट जास्त शिथिल**

---

*शेवटचे अद्यतन: मे 2026 — इंग्रजी आवृत्तीसह ([docs/data-sources/health-data.md](../../docs/data-sources/health-data.md)) parity.*
