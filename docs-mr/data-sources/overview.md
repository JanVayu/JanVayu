# डेटा सोर्सेसचा आढावा

JanVayu १६० पेक्षा जास्त सार्वजनिक सोर्सेस आणि पेपर्सच्या रीडिंग लिस्टचा वापर करते. आकडेवारी जिथे सार्वजनिक आहे तिथे त्यांच्या मूळ स्रोताशी जोडलेली असते. काही मॅप लेयर्स हे मॉडेल केलेले अंदाज आहेत (उदा. SatPM2.5, CAMS आणि LongPMInd) आणि त्यांना तसे लेबल दिलेले आहे. या पेजवर सोर्सेसच्या मुख्य गटांची यादी दिली आहे.

---

## रिअल-टाइम हवेची गुणवत्ता

| Source | Type | Access | Used for |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | रिअल-टाइम AQI | मोफत API | डॅशबोर्ड, मॅप, सर्व शहरांचा डेटा |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | अधिकृत AQI | मोफत वेब | पडताळणी, अधिकृत वाचन |
| [OpenAQ](https://openaq.org) | हायपरलोकल CPCB आणि कम्युनिटी स्टेशन्स | मोफत API की | My Neighbourhood पॅनेल आणि चॅटबॉटची हायपरलोकल उत्तरे (प्राथमिक स्रोत; Sensor.Community हा फॉलबॅक आहे) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 अंदाज (CAMS) | मोफत, की नाही | लाईव्ह ५-दिवसांचा अंदाज पॅनेल, चॅटबॉट "उद्या हवामान खराब असेल का?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | सक्रिय-आग शोध (VIIRS/NOAA-20 NRT) | मोफत API की | Farm Fire Tracker (शेतजमिनीतील कचरा जाळणे) |
| [Sensor.Community](https://sensor.community/) | कमी खर्चाचे कम्युनिटी सेन्सर्स (डेटा Open Data Commons Database Contents License v1.0 अंतर्गत) | मोफत | हायपरलोकल फॉलबॅक |
| [IMD](https://mausam.imd.gov.in) | हवामानशास्त्रीय | मोफत | फक्त संदर्भासाठी (साइटद्वारे फेच केलेले नाही) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | निरीक्षण केलेले तासाभराचे स्टेशन वाचन, २००९ पासून पुढे (CPCB CAAQM + US Embassy), CC BY 4.0 | मोफत API की | निरीक्षण केलेले स्टेशन लेयर, आणि मॉनिटर्सच्या तुलनेत सॅटेलाइट मॅप तपासणे. पहा [xkdr-air-quality.md](xkdr-air-quality.md) |
| [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) | तासाभराचा ऐतिहासिक हवामानशास्त्र | मोफत, की नाही | ४४ शहरांसाठी, २०१८-२०२४ मधील हवामानाचा प्रभाव काढून टाकणे. पहा [deweathered-national.md](deweathered-national.md) |

---

## आरोग्य आणि मृत्यू दर
| स्रोत | प्रकार | कशासाठी वापरले जाते |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | पीअर-रिव्ह्यूड | भारत-विशिष्ट मृत्यूदर, आर्थिक खर्च |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | पीअर-रिव्ह्यूड | आजारांचा बोजा, वयानुसार प्रमाणित दर |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | पीअर-रिव्ह्यूड | GEMM कार्यपद्धती |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | शैक्षणिक | मुलांचे आरोग्य |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | मार्गदर्शक तत्त्वे | PM2.5 आणि PM10 मानके |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | संशोधन | आयुर्मान अंदाज |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | पीअर-रिव्ह्यूड | भारतासाठी PM2.5 मुळे होणाऱ्या मृत्यूंचे कारणात्मक अंदाज |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | पीअर-रिव्ह्यूड | संपूर्ण भारतातील हवेच्या गुणवत्तेतील असमान सुधारणा |

---

## धोरण आणि प्रशासन

| स्रोत | प्रकार | कशासाठी वापरले जाते |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | अधिकृत | NCAP शहरनिहाय ट्रॅकिंग |
| [MoEFCC](https://moef.gov.in) | अधिकृत | NCAP बजेट, मंत्रालयाचे प्रतिसाद |
| [Indian Kanoon](https://indiankanoon.org/) | कायदेशीर | सर्वोच्च न्यायालय आणि NGT चे आदेश |
| [CAQM](https://caqm.nic.in/) | अधिकृत | GRAP आदेश, NCR निर्देश |
| [Union Budget documents](https://www.indiabudget.gov.in) | अधिकृत | निधी वाटपाचे ट्रॅकिंग |

---

## आर्थिक आणि सामाजिक डेटा

| स्रोत | कशासाठी वापरले जाते |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | GDP नुकसान, उत्पादकता |
| [TERI](https://www.teriin.org) | पार्श्वभूमी संदर्भ (येथे विशिष्ट अहवालाचे नाव दिलेले नाही) |
| [ILO](https://www.ilo.org) | पार्श्वभूमी संदर्भ (येथे विशिष्ट अहवालाचे नाव दिलेले नाही) |
| [PLFS (MoSPI)](https://mospi.gov.in) | बाधित कामगारांची संख्या मोजण्यासाठी वापरले जाणारे अनौपचारिक-रोजगार आकडे |

---

## शोध आणि संशोधन
| स्रोत | यासाठी वापरले जाते |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | शहर-स्तरीय स्रोत विश्लेषण |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | धोरण विश्लेषण, GRAP मूल्यांकन |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | शहरांचे रँकिंग, जागतिक अनुपालन डेटा |
| [UrbanEmissions.info](https://www.urbanemissions.info) | उत्सर्जन याद्या (Dr. Sarath Guttikunda) |

---

## संदर्भग्रंथसूची

रीडिंग लिस्ट पॅनेलमध्ये साइट ज्या पीअर-रिव्ह्यूड अभ्यासांवर अवलंबून आहे, ते दिलेले आहेत. यातील प्रत्येक DOI शी जोडलेला आहे. हे सर्व एकाच सायटेशन फाईल म्हणून डाउनलोड केले जाऊ शकतात: [BibTeX](https://www.janvayu.in/downloads/janvayu-reading-list.bib) किंवा [RIS](https://www.janvayu.in/downloads/janvayu-reading-list.ris). हे Zotero, Mendeley, EndNote किंवा LaTeX बिब्लिओग्राफीसाठी उपयुक्त आहेत. `scripts/build-reading-list-bib.py` हे पॅनेल आणि प्रत्येक DOI च्या Crossref रेकॉर्डवरून दोन्ही फाईल्स तयार करते. जर त्या यादीशी जुळल्या नाहीत, तर CI (कंटिन्युअस इंटिग्रेशन) फेल होते.

ऑक्टोबर 2026 पर्यंत हे एका सार्वजनिक Zotero ग्रुपकडे निर्देश करत होते. त्याचे शेवटचे संपादन मे महिन्यात झाले होते. यादीतील 54 आयटम्सपैकी तेथे फक्त 21 आयटम्स होते आणि प्रोजेक्टमधील कोणीही त्यात साईन इन करू शकत नव्हते. त्यामुळे ते काढून टाकण्यात आले आणि त्याऐवजी अशी फाईल वापरली जाऊ लागली जी बदलू शकत नाही.

---

## संदर्भ आणि श्रेय

JanVayu प्राथमिक स्रोतांच्या लिंक्स देते. जर तुम्ही JanVayu मधील डेटा पुन्हा वापरत असाल, तर मूळ स्रोताचा संदर्भ द्या (Lancet, CPCB इ.), JanVayu चा नाही. JanVayu प्रामुख्याने डेटा गोळा करते आणि संस्थांना जबाबदार धरते, परंतु ते स्वतःचे काही डेटासेट देखील तयार करते (`deweathered-national.json`, `aqi-bulletins.json` आणि `station-observed.json`), आणि त्यांचे डॉक्युमेंटेशन या फोल्डरमध्ये दिलेले आहे. पद्धतीबद्दलच्या प्रश्नांसाठी, मूळ संशोधन पेपर्स पाहा.

**कंटेंट परवाना:** CC BY-NC-SA 4.0. तुम्ही हा कंटेंट नॉन-कमर्शियल हेतूंसाठी शेअर आणि ॲडॉप्ट करू शकता, परंतु त्यासाठी योग्य श्रेय देणे आणि तोच परवाना वापरणे आवश्यक आहे.
