# डेटा स्रोतों का अवलोकन

JanVayu 160 से अधिक सार्वजनिक स्रोतों और पेपर्स की एक रीडिंग लिस्ट का उपयोग करता है। जहाँ तक संभव हो, आँकड़े उनके मूल स्रोत से लिंक होते हैं। कुछ मैप लेयर्स अनुमानित हैं (उदाहरण के लिए SatPM2.5, CAMS और LongPMInd) और उन्हें उसी तरह लेबल किया गया है। यह पेज स्रोतों के मुख्य समूहों को सूचीबद्ध करता है।

---

## रीयल-टाइम वायु गुणवत्ता

| स्रोत | प्रकार | एक्सेस | उपयोग |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | रीयल-टाइम AQI | फ्री API | डैशबोर्ड, मैप, सभी शहरों का डेटा |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | आधिकारिक AQI | फ्री वेब | वेरिफिकेशन, आधिकारिक रीडिंग्स |
| [OpenAQ](https://openaq.org) | हाइपरलोकल CPCB और कम्युनिटी स्टेशन | फ्री API की | My Neighbourhood पैनल और चैटबॉट के हाइपरलोकल जवाब (प्राथमिक स्रोत; Sensor.Community बैकअप है) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 पूर्वानुमान (CAMS) | फ्री, बिना की (key) के | लाइव 5-दिवसीय पूर्वानुमान पैनल, चैटबॉट "क्या कल हवा खराब होगी?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | एक्टिव-फायर डिटेक्शन (VIIRS/NOAA-20 NRT) | फ्री API की | फार्म फायर ट्रैकर (पराली जलाना) |
| [Sensor.Community](https://sensor.community/) | कम लागत वाले कम्युनिटी सेंसर (डेटा Open Data Commons Database Contents License v1.0 के तहत) | फ्री | हाइपरलोकल बैकअप |
| [IMD](https://mausam.imd.gov.in) | मौसम संबंधी | फ्री | केवल संदर्भ के लिए (साइट द्वारा प्राप्त नहीं किया जाता) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | देखे गए प्रति घंटा स्टेशन रीडिंग्स, 2009 के बाद (CPCB CAAQM + US Embassy), CC BY 4.0 | फ्री API की | देखे गए स्टेशन लेयर, और मॉनिटरों के साथ सैटेलाइट मैप की जाँच करना। देखें [xkdr-air-quality.md](xkdr-air-quality.md) |
| [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) | प्रति घंटा ऐतिहासिक मौसम विज्ञान | फ्री, बिना की (key) के | 44 शहरों, 2018–2024 के लिए मौसम के प्रभाव को हटाना। देखें [deweathered-national.md](deweathered-national.md) |

---

## स्वास्थ्य और मृत्यु दर
| स्रोत | प्रकार | उपयोग |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | पीयर-रिव्यूड | भारत-विशिष्ट मृत्यु दर, आर्थिक लागत |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | पीयर-रिव्यूड | रोग का बोझ, आयु-मानकीकृत दरें |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | पीयर-रिव्यूड | GEMM कार्यप्रणाली |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | अकादमिक | बच्चों का स्वास्थ्य |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | दिशानिर्देश | PM2.5 और PM10 मानक |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | शोध | जीवन प्रत्याशा अनुमान |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | पीयर-रिव्यूड | भारत के लिए PM2.5 मृत्यु दर के कारण अनुमान |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | पीयर-रिव्यूड | भारत में असमान वायु गुणवत्ता सुधार |

---

## नीति और शासन

| स्रोत | प्रकार | उपयोग |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | आधिकारिक | NCAP शहर-वार ट्रैकिंग |
| [MoEFCC](https://moef.gov.in) | आधिकारिक | NCAP बजट, मंत्रालय के जवाब |
| [Indian Kanoon](https://indiankanoon.org/) | कानूनी | सुप्रीम कोर्ट और NGT आदेश |
| [CAQM](https://caqm.nic.in/) | आधिकारिक | GRAP आदेश, NCR निर्देश |
| [Union Budget documents](https://www.indiabudget.gov.in) | आधिकारिक | फंड आवंटन ट्रैकिंग |

---

## आर्थिक और सामाजिक डेटा

| स्रोत | उपयोग |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | GDP में नुकसान, उत्पादकता |
| [TERI](https://www.teriin.org) | पृष्ठभूमि संदर्भ (यहाँ किसी विशिष्ट रिपोर्ट का नाम नहीं दिया गया है) |
| [ILO](https://www.ilo.org) | पृष्ठभूमि संदर्भ (यहाँ किसी विशिष्ट रिपोर्ट का नाम नहीं दिया गया है) |
| [PLFS (MoSPI)](https://mospi.gov.in) | जोखिम वाली कार्यबल के आकार का अनुमान लगाने के लिए अनौपचारिक-रोजगार गणना |

---

## खोजी और शोध
| स्रोत | उपयोग |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | शहर-स्तर का स्रोत विश्लेषण |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | नीति विश्लेषण, GRAP मूल्यांकन |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | शहरों की रैंकिंग, वैश्विक अनुपालन डेटा |
| [UrbanEmissions.info](https://www.urbanemissions.info) | उत्सर्जन सूची (Dr. Sarath Guttikunda) |

---

## संदर्भ सूची

रीडिंग लिस्ट पैनल में वे पीयर-रिव्यू किए गए अध्ययन शामिल हैं जिन पर यह साइट निर्भर करती है, और हर एक अपने DOI से लिंक है। Zotero, Mendeley, EndNote या LaTeX बिब्लियोग्राफी के लिए इन सभी को एक सिंगल साइटेशन फाइल के रूप में डाउनलोड किया जा सकता है, जो [BibTeX](https://www.janvayu.in/downloads/janvayu-reading-list.bib) या [RIS](https://www.janvayu.in/downloads/janvayu-reading-list.ris) फॉर्मेट में है। `scripts/build-reading-list-bib.py` स्क्रिप्ट पैनल और हर DOI के Crossref रिकॉर्ड से दोनों फाइलें बनाती है, और अगर ये लिस्ट से मेल नहीं खातीं तो CI फेल हो जाता है।

अक्टूबर 2026 तक यह एक पब्लिक Zotero ग्रुप का लिंक था। इसे आखिरी बार मई में एडिट किया गया था, जिसमें लिस्ट के 54 के मुकाबले केवल 21 आइटम थे, और प्रोजेक्ट का कोई भी व्यक्ति अब इसमें साइन इन नहीं कर सकता था, इसलिए इसे एक ऐसी फाइल के पक्ष में बंद कर दिया गया जिसे बदला नहीं जा सकता।

---

## साइटेशन और श्रेय

JanVayu प्राथमिक स्रोतों से लिंक करता है। यदि आप JanVayu से डेटा का उपयोग करते हैं, तो JanVayu के बजाय मूल स्रोत (Lancet, CPCB आदि) का हवाला दें। JanVayu मुख्य रूप से डेटा इकट्ठा करता है और संस्थानों को जवाबदेह ठहराता है, लेकिन यह अपने खुद के कुछ डेटासेट (`deweathered-national.json`, `aqi-bulletins.json` और `station-observed.json`) भी बनाता है, और उनका डॉक्यूमेंटेशन इस फोल्डर में मौजूद है। कार्यप्रणाली से जुड़े सवालों के लिए, मूल रिसर्च पेपर देखें।

**कंटेंट लाइसेंस:** CC BY-NC-SA 4.0. आप इस कंटेंट को गैर-व्यावसायिक उद्देश्यों के लिए, उचित श्रेय देते हुए और इसी लाइसेंस के तहत शेयर और एडाप्ट कर सकते हैं।
