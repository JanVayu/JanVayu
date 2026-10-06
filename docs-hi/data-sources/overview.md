# डेटा स्रोतों का अवलोकन

JanVayu 160 से अधिक सार्वजनिक स्रोतों और पेपर्स की एक रीडिंग लिस्ट का उपयोग करता है। जहाँ भी संभव हो, आँकड़े उनके मूल स्रोत से लिंक किए गए हैं। कुछ मैप लेयर्स (उदाहरण के लिए SatPM2.5, CAMS और LongPMInd) अनुमानित मॉडल पर आधारित हैं और उन्हें उसी तरह लेबल किया गया है। यह पेज स्रोतों के मुख्य समूहों की सूची देता है।

---

## रियल-टाइम वायु गुणवत्ता

| स्रोत | प्रकार | एक्सेस | उपयोग |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | रियल-टाइम AQI | फ्री API | डैशबोर्ड, मैप, सभी शहरों का डेटा |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | आधिकारिक AQI | फ्री वेब | सत्यापन, आधिकारिक रीडिंग |
| [OpenAQ](https://openaq.org) | हाइपरलोकल CPCB और कम्युनिटी स्टेशन | फ्री API की | 'My Neighbourhood' पैनल और चैटबॉट के हाइपरलोकल जवाब (प्राथमिक स्रोत; Sensor.Community बैकअप है) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 पूर्वानुमान (CAMS) | फ्री, किसी की (key) की ज़रूरत नहीं | लाइव 5-दिन का पूर्वानुमान पैनल, चैटबॉट "क्या कल हवा खराब होगी?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | सक्रिय-आग का पता लगाना (VIIRS/NOAA-20 NRT) | फ्री API की | फार्म फायर ट्रैकर (पराली जलाना) |
| [Sensor.Community](https://sensor.community/) | कम लागत वाले कम्युनिटी सेंसर (डेटा Open Data Commons Database Contents License v1.0 के तहत) | फ्री | हाइपरलोकल बैकअप |
| [IMD](https://mausam.imd.gov.in) | मौसम संबंधी | फ्री | केवल संदर्भ के लिए (साइट द्वारा प्राप्त नहीं किया जाता) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | 2009 से देखे गए प्रति घंटे के स्टेशन रीडिंग (CPCB CAAQM + अमेरिकी दूतावास), CC BY 4.0 | फ्री API की | ऑब्जर्व्ड स्टेशन लेयर, और मॉनिटर्स के साथ सैटेलाइट मैप की जाँच करना। [xkdr-air-quality.md](xkdr-air-quality.md) देखें |
| [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) | प्रति घंटे का ऐतिहासिक मौसम विज्ञान | फ्री, किसी की (key) की ज़रूरत नहीं | 44 शहरों, 2018-2024 के लिए मौसम के प्रभाव को हटाना। [deweathered-national.md](deweathered-national.md) देखें |

---

## स्वास्थ्य और मृत्यु दर
| स्रोत | प्रकार | उपयोग |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | पीयर-रिव्यूड | भारत-विशिष्ट मृत्यु दर, आर्थिक लागत |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | पीयर-रिव्यूड | रोग का बोझ, आयु-मानकीकृत दरें |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | पीयर-रिव्यूड | GEMM कार्यप्रणाली |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | अकादमिक | बच्चों का स्वास्थ्य |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | दिशानिर्देश | PM2.5 और PM10 मानक |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | रिसर्च | जीवन प्रत्याशा अनुमान |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | पीयर-रिव्यूड | भारत के लिए PM2.5 मृत्यु दर के अनुमान |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | पीयर-रिव्यूड | भारत भर में असमान वायु गुणवत्ता सुधार |

---

## नीति और शासन

| स्रोत | प्रकार | उपयोग |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | आधिकारिक | NCAP शहर-वार ट्रैकिंग |
| [MoEFCC](https://moef.gov.in) | आधिकारिक | NCAP बजट, मंत्रालय की प्रतिक्रियाएं |
| [Indian Kanoon](https://indiankanoon.org/) | कानूनी | सुप्रीम कोर्ट और NGT के आदेश |
| [CAQM](https://caqm.nic.in/) | आधिकारिक | GRAP आदेश, NCR निर्देश |
| [Union Budget documents](https://www.indiabudget.gov.in) | आधिकारिक | फंड आवंटन ट्रैकिंग |

---

## आर्थिक और सामाजिक डेटा

| स्रोत | उपयोग |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | GDP नुकसान, उत्पादकता |
| [TERI](https://www.teriin.org) | बैकग्राउंड संदर्भ (यहाँ किसी विशिष्ट रिपोर्ट का नाम नहीं दिया गया है) |
| [ILO](https://www.ilo.org) | बैकग्राउंड संदर्भ (यहाँ किसी विशिष्ट रिपोर्ट का नाम नहीं दिया गया है) |
| [PLFS (MoSPI)](https://mospi.gov.in) | प्रभावित कार्यबल का आकार तय करने के लिए अनौपचारिक-रोजगार की गणना |

---

## खोजी और रिसर्च
| स्रोत | उपयोग |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | शहर-स्तरीय स्रोत विश्लेषण |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | नीति विश्लेषण, GRAP मूल्यांकन |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | शहर रैंकिंग, वैश्विक अनुपालन डेटा |
| [UrbanEmissions.info](https://www.urbanemissions.info) | उत्सर्जन सूची (Dr. Sarath Guttikunda) |

---

## Zotero बिब्लियोग्राफी

JanVayu बिब्लियोग्राफी प्रबंधन के लिए एक सार्वजनिक Zotero ग्रुप लाइब्रेरी बनाए रखता है:

**[zotero.org/groups/6508140/janvayu/library](https://www.zotero.org/groups/6508140/janvayu/library)**

इस लाइब्रेरी में साइट पर बताए गए कुछ पेपर, रिपोर्ट और डेटासेट मौजूद हैं (2 अक्टूबर 2026 को चेक करने पर 21 आइटम)। रीडिंग लिस्ट पैनल में पूरी सूची दी गई है। शोधकर्ता और योगदानकर्ता बताए गए स्रोतों को देख सकते हैं, किसी भी फॉर्मेट (BibTeX, APA, Chicago आदि) में साइटेशन एक्सपोर्ट कर सकते हैं और नए पेपर सुझा सकते हैं।

---

## साइटेशन और श्रेय

JanVayu प्राथमिक स्रोतों से लिंक करता है। यदि आप JanVayu से डेटा का उपयोग करते हैं, तो JanVayu को नहीं, बल्कि मूल स्रोत (Lancet, CPCB आदि) का हवाला दें। JanVayu मुख्य रूप से डेटा इकट्ठा करता है और संस्थानों को जवाबदेह ठहराता है, लेकिन यह अपने कुछ डेटासेट भी बनाता है (`deweathered-national.json`, `aqi-bulletins.json` और `station-observed.json`), और वे इसी फोल्डर में डॉक्युमेंटेड हैं। तरीके से जुड़े सवालों के लिए, मूल रिसर्च पेपर देखें।

**कंटेंट लाइसेंस:** CC BY-NC-SA 4.0. आप गैर-व्यावसायिक उद्देश्यों के लिए, श्रेय देते हुए और इसी लाइसेंस के तहत कंटेंट को शेयर और उपयोग कर सकते हैं।
