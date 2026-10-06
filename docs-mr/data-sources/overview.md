# डेटा स्रोतांचा आढावा

JanVayu १६० पेक्षा जास्त सार्वजनिक स्रोत आणि पेपर्सच्या रीडिंग लिस्टचा वापर करते. आकडेवारी सार्वजनिक असलेल्या स्रोतांच्या मूळ लिंकवर जाते. काही मॅप लेयर्स हे मॉडेल केलेले अंदाज आहेत (उदाहरणार्थ SatPM2.5, CAMS आणि LongPMInd) आणि तसे स्पष्टपणे नमूद केलेले आहे. या पेजवर स्रोतांच्या मुख्य गटांची यादी दिली आहे.

---

## रिअल-टाइम हवेची गुणवत्ता

| स्रोत | प्रकार | ॲक्सेस | कशासाठी वापरतात |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | रिअल-टाइम AQI | फ्री API | डॅशबोर्ड, मॅप, सर्व शहरांचा डेटा |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | अधिकृत AQI | फ्री वेब | पडताळणी, अधिकृत मोजमाप |
| [OpenAQ](https://openaq.org) | हायपरलोकल CPCB आणि कम्युनिटी स्टेशन्स | फ्री API की | माय नेबरहूड (My Neighbourhood) पॅनेल आणि चॅटबॉटची हायपरलोकल उत्तरे (प्राथमिक स्रोत; Sensor.Community हा फॉलबॅक आहे) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 अंदाज (CAMS) | फ्री, की ची गरज नाही | लाईव्ह ५-दिवसांचा अंदाज पॅनेल, चॅटबॉट "उद्या हवामान खराब असेल का?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | सक्रिय-आग शोध (VIIRS/NOAA-20 NRT) | फ्री API की | फार्म फायर ट्रॅकर (शेतजमिनीतील कचरा जाळणे) |
| [Sensor.Community](https://sensor.community/) | कमी खर्चाचे कम्युनिटी सेन्सर्स (ओपन डेटा कॉमन्स डेटाबेस कंटेंट्स लायसन्स v1.0 अंतर्गत डेटा) | फ्री | हायपरलोकल फॉलबॅक |
| [IMD](https://mausam.imd.gov.in) | हवामानशास्त्रीय | फ्री | केवळ संदर्भासाठी (साइटवरून फेच केलेले नाही) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | निरीक्षित तासाभराची स्टेशन मोजमापे, २००९ पासून पुढे (CPCB CAAQM + US Embassy), CC BY 4.0 | फ्री API की | निरीक्षित स्टेशन लेयर, आणि मॉनिटर्सच्या तुलनेत सॅटेलाइट मॅप तपासणे. [xkdr-air-quality.md](xkdr-air-quality.md) पहा |
| [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) | तासाभराचा ऐतिहासिक हवामान डेटा | फ्री, की ची गरज नाही | ४४ शहरांसाठी, २०१८-२०२४ दरम्यान हवामानाचा प्रभाव काढून टाकणे. [deweathered-national.md](deweathered-national.md) पहा |

---

## आरोग्य आणि मृत्यूदर
| स्रोत | प्रकार | यासाठी वापरले |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | पीअर-रिव्ह्यूड | भारत-विशिष्ट मृत्यूदर, आर्थिक नुकसान |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | पीअर-रिव्ह्यूड | आजारांचा भार, वयानुसार प्रमाणित दर |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | पीअर-रिव्ह्यूड | GEMM कार्यपद्धती |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | शैक्षणिक | मुलांचे आरोग्य |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | मार्गदर्शक तत्त्व | PM2.5 आणि PM10 मानके |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | संशोधन | आयुर्मानाचा अंदाज |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | पीअर-रिव्ह्यूड | भारतासाठी PM2.5 मुळे होणाऱ्या मृत्यूंचे कारण-परिणाम अंदाज |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | पीअर-रिव्ह्यूड | संपूर्ण भारतातील हवामान सुधारणेतील असमानता |

---

## धोरण आणि प्रशासन

| स्रोत | प्रकार | यासाठी वापरले |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | अधिकृत | NCAP चे शहरानिहाय ट्रॅकिंग |
| [MoEFCC](https://moef.gov.in) | अधिकृत | NCAP बजेट, मंत्रालयांचे प्रतिसाद |
| [Indian Kanoon](https://indiankanoon.org/) | कायदेशीर | सर्वोच्च न्यायालय आणि NGT चे आदेश |
| [CAQM](https://caqm.nic.in/) | अधिकृत | GRAP आदेश, NCR निर्देश |
| [Union Budget documents](https://www.indiabudget.gov.in) | अधिकृत | निधी वाटपाचे ट्रॅकिंग |

---

## आर्थिक आणि सामाजिक डेटा

| स्रोत | यासाठी वापरले |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | GDP नुकसान, उत्पादकता |
| [TERI](https://www.teriin.org) | पार्श्वभूमी संदर्भ (येथे विशिष्ट अहवालाचे नाव दिलेले नाही) |
| [ILO](https://www.ilo.org) | पार्श्वभूमी संदर्भ (येथे विशिष्ट अहवालाचे नाव दिलेले नाही) |
| [PLFS (MoSPI)](https://mospi.gov.in) | बाधित कामगारांची संख्या मोजण्यासाठी अनौपचारिक-रोजगार मोजणी |

---

## तपास आणि संशोधन
| स्रोत | यासाठी वापरले जाते |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | शहर-स्तरीय स्रोत विश्लेषण |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | धोरण विश्लेषण, GRAP मूल्यमापन |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | शहरांची क्रमवारी, जागतिक अनुपालन डेटा |
| [UrbanEmissions.info](https://www.urbanemissions.info) | उत्सर्जन याद्या (Dr. Sarath Guttikunda) |

---

## Zotero संदर्भसूची

JanVayu संदर्भसूची व्यवस्थापनासाठी एक सार्वजनिक Zotero ग्रुप लायब्ररी चालवते:

**[zotero.org/groups/6508140/janvayu/library](https://www.zotero.org/groups/6508140/janvayu/library)**

या लायब्ररीमध्ये साइटवर संदर्भित केलेले काही पेपर्स, अहवाल आणि डेटासेट उपलब्ध आहेत (२ ऑक्टोबर २०२६ रोजी तपासले तेव्हा २१ आयटम्स). 'Reading List' पॅनेलमध्ये अधिक मोठी यादी आहे. संशोधक आणि योगदानकर्ते संदर्भित स्रोत पाहू शकतात, कोणत्याही फॉरमॅटमध्ये (BibTeX, APA, Chicago आणि इतर) संदर्भ एक्सपोर्ट करू शकतात आणि नवीन पेपर्स सुचवू शकतात.

---

## संदर्भ आणि श्रेय

JanVayu प्राथमिक स्रोतांच्या लिंक्स देते. जर तुम्ही JanVayu मधील डेटा पुन्हा वापरत असाल, तर JanVayu ला नाही, तर मूळ स्रोताला (Lancet, CPCB इत्यादी) संदर्भ द्या. JanVayu प्रामुख्याने संस्थांकडून डेटा गोळा करते आणि त्यांना जबाबदार धरते, परंतु ते स्वतःचे काही डेटासेट देखील तयार करते (`deweathered-national.json`, `aqi-bulletins.json` आणि `station-observed.json`), आणि ते या फोल्डरमध्ये डॉक्युमेंट केलेले आहेत. पद्धतीबद्दलच्या प्रश्नांसाठी, मूळ संशोधन पेपर्स पाहा.

**कंटेंट लायसन्स:** CC BY-NC-SA 4.0. तुम्ही हे कंटेंट गैर-व्यावसायिक हेतूंसाठी शेअर आणि ॲडॉप्ट करू शकता, अट एवढीच की तुम्ही योग्य श्रेय दिले पाहिजे आणि ते याच लायसन्स अंतर्गत असले पाहिजे.
