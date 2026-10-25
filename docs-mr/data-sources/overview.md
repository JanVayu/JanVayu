# डेटा स्रोतांचा आढावा

जनवायू सार्वजनिक स्रोत आणि पेपर्सच्या 'रीडिंग लिस्ट'वर आधारित आहे. जिथे शक्य असेल तिथे आकडेवारी त्यांच्या मूळ स्रोताशी लिंक केलेली आहे. काही मॅप लेयर्स हे अंदाजित आकडेवारीवर आधारित आहेत (उदा. SatPM2.5, CAMS आणि LongPMInd) आणि तसे लेबल केलेले आहेत. या पानावर स्रोतांचे मुख्य गट दिले आहेत.

---

## रिअल-टाइम हवेची गुणवत्ता

| स्रोत | प्रकार | ॲक्सेस | यासाठी वापरले जाते |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | रिअल-टाइम AQI | मोफत API | डॅशबोर्ड, मॅप, सर्व शहरांचा डेटा |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | अधिकृत AQI | मोफत वेब | पडताळणी, अधिकृत मोजमापे |
| [OpenAQ](https://openaq.org) | हायपरलोकल CPCB आणि कम्युनिटी स्टेशन्स | मोफत API की | 'माय नेबरहूड' पॅनेल आणि चॅटबॉटची हायपरलोकल उत्तरे (प्राथमिक स्रोत; Sensor.Community हा बॅकअप आहे) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 अंदाज (CAMS) | मोफत, की ची गरज नाही | लाईव्ह 5-दिवसांचा अंदाज पॅनेल, चॅटबॉट "उद्या हवा खराब असेल का?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | सक्रिय-आग शोध (VIIRS/NOAA-20 NRT) | मोफत API की | फार्म फायर ट्रॅकर (शेतकऱ्यांनी जाळलेली पेंडी) |
| [Sensor.Community](https://sensor.community/) | कमी किमतीचे कम्युनिटी सेन्सर्स (डेटा Open Data Commons Database Contents License v1.0 अंतर्गत) | मोफत | हायपरलोकल बॅकअप |
| [IMD](https://mausam.imd.gov.in) | हवामानशास्त्रीय | मोफत | केवळ संदर्भासाठी (साइटद्वारे फेच केले जात नाही) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | निरीक्षित तासाभराचे स्टेशन मोजमाप, 2009 पासून (CPCB CAAQM + US Embassy), CC BY 4.0 | मोफत API की | निरीक्षित स्टेशन लेयर, आणि मॉनिटर्सच्या तुलनेत सॅटेलाइट मॅप तपासणे. पहा [xkdr-air-quality.md](xkdr-air-quality.md) |
| [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) | तासाभराचा ऐतिहासिक हवामान डेटा | मोफत, की ची गरज नाही | 44 शहरांसाठी, 2018-2024 या काळातील हवामानाचा प्रभाव काढून टाकणे. पहा [deweathered-national.md](deweathered-national.md) |

---

## आरोग्य आणि मृत्यूदर
| स्रोत | प्रकार | यासाठी वापरले |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | पीअर-रिव्ह्यूड | भारत-विशिष्ट मृत्यूदर, आर्थिक खर्च |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | पीअर-रिव्ह्यूड | आजारांचे ओझे, वयानुसार प्रमाणित दर |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | पीअर-रिव्ह्यूड | GEMM कार्यपद्धती |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | शैक्षणिक | मुलांचे आरोग्य |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | मार्गदर्शक तत्त्वे | PM2.5 आणि PM10 मानके |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | संशोधन | आयुर्मानाचा अंदाज |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | पीअर-रिव्ह्यूड | भारतासाठी PM2.5 मृत्यूदराचे कारण-परिणाम अंदाज |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | पीअर-रिव्ह्यूड | भारतातील असमान हवामान सुधारणा |

---

## धोरण आणि प्रशासन

| स्रोत | प्रकार | यासाठी वापरले |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | अधिकृत | NCAP शहरनिहाय ट्रॅकिंग |
| [MoEFCC](https://moef.gov.in) | अधिकृत | NCAP बजेट, मंत्रालयाची उत्तरे |
| [Indian Kanoon](https://indiankanoon.org/) | कायदेशीर | सर्वोच्च न्यायालय आणि NGT चे आदेश |
| [CAQM](https://caqm.nic.in/) | अधिकृत | GRAP आदेश, NCR निर्देश |
| [Union Budget documents](https://www.indiabudget.gov.in) | अधिकृत | निधी वाटपाचे ट्रॅकिंग |

---

## आर्थिक आणि सामाजिक डेटा

| स्रोत | यासाठी वापरले |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | GDP मधील नुकसान, उत्पादकता |
| [TERI](https://www.teriin.org) | पार्श्वभूमी संदर्भ (येथे विशिष्ट अहवालाचे नाव दिलेले नाही) |
| [ILO](https://www.ilo.org) | पार्श्वभूमी संदर्भ (येथे विशिष्ट अहवालाचे नाव दिलेले नाही) |
| [PLFS (MoSPI)](https://mospi.gov.in) | प्रभावित कामगारांची संख्या निश्चित करण्यासाठी वापरल्या जाणाऱ्या असंघटित-रोजगार मोजणी |

---

## शोध आणि संशोधन
| स्रोत | यासाठी वापरले जाते |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | शहराच्या पातळीवरील स्रोत विश्लेषण |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | धोरण विश्लेषण, GRAP मूल्यमापन |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | शहरांची क्रमवारी, जागतिक अनुपालन डेटा |
| [UrbanEmissions.info](https://www.urbanemissions.info) | उत्सर्जन याद्या (Dr. Sarath Guttikunda) |

---

## संदर्भग्रंथसूची

रीडिंग लिस्ट पॅनेलमध्ये साइट ज्या पीअर-रिव्ह्यूड अभ्यासांवर अवलंबून आहे ते दिले आहेत, ज्यातील प्रत्येकाची लिंक त्याच्या DOI शी जोडलेली आहे. ते सर्व Zotero, Mendeley, EndNote किंवा LaTeX संदर्भग्रंथासाठी एकाच सायटेशन फाईलच्या स्वरूपात डाउनलोड केले जाऊ शकतात: [BibTeX](https://www.janvayu.in/downloads/janvayu-reading-list.bib) किंवा [RIS](https://www.janvayu.in/downloads/janvayu-reading-list.ris). `scripts/build-reading-list-bib.py` हे पॅनेल आणि प्रत्येक DOI च्या Crossref रेकॉर्डवरून दोन्ही फाईल्स तयार करते, आणि जर त्या लिस्टशी जुळत नसतील तर CI फेल होते.

ऑक्टोबर 2026 पर्यंत हे एका पब्लिक Zotero ग्रुपकडे निर्देश करत होते. ते शेवटचे मे महिन्यात एडिट केले गेले होते, लिस्टमधील 54 च्या तुलनेत त्यात 21 आयटम्स होते, आणि प्रोजेक्टमधील कोणीही आता त्यात साइन इन करू शकत नव्हते, त्यामुळे ते बंद करून एका फाईलचा पर्याय निवडण्यात आला जो कधीही बदलू शकत नाही.

---

## संदर्भ आणि श्रेय

JanVayu प्राथमिक स्रोतांना लिंक करते. जर तुम्ही JanVayu मधील डेटा वापरला, तर JanVayu चा नाही तर मूळ स्रोताचा (Lancet, CPCB इत्यादी) संदर्भ द्या. JanVayu बहुतांश डेटा गोळा करते आणि संस्थांना जबाबदार धरते, पण ते स्वतःचे काही डेटासेट देखील तयार करते (`deweathered-national.json`, `aqi-bulletins.json` आणि `station-observed.json`), आणि ते या फोल्डरमध्ये डॉक्युमेंट केलेले आहेत. पद्धतीबद्दलच्या प्रश्नांसाठी, मूळ संशोधन पेपर्स पहा.

**कंटेंट परवाना:** CC BY-NC-SA 4.0. तुम्ही गैर-व्यावसायिक हेतूंसाठी, श्रेय देऊन आणि त्याच परवान्याअंतर्गत हा कंटेंट शेअर आणि वापरू शकता.
