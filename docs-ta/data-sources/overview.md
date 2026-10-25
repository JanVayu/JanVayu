# தரவு ஆதாரங்களின் கண்ணோட்டம்

ஜான்வாயு பொது ஆதாரங்கள் மற்றும் ஆய்வுக் கட்டுரைகளின் வாசிப்புப் பட்டியலை நம்பியுள்ளது. தரவுகள் பொதுவெளியில் உள்ள இடங்களில் அவற்றின் அசல் ஆதாரத்துடன் இணைக்கப்பட்டுள்ளன. சில வரைபட அடுக்குகள் (உதாரணமாக SatPM2.5, CAMS மற்றும் LongPMInd) மாதிரியாக்கப்பட்ட மதிப்பீடுகள் ஆகும், அவை அவ்வாறே குறிக்கப்பட்டுள்ளன. இந்தப் பக்கம் ஆதாரங்களின் முக்கிய குழுக்களைப் பட்டியலிடுகிறது.

---

## நிகழ்நேர காற்றின் தரம்

| ஆதாரம் | வகை | அணுகல் | எதற்குப் பயன்படுத்தப்படுகிறது |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | நிகழ்நேர AQI | இலவச API | டேஷ்போர்டு, வரைபடம், அனைத்து நகரத் தரவுகளும் |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | அதிகாரப்பூர்வ AQI | இலவச இணையதளம் | சரிபார்த்தல், அதிகாரப்பூர்வ அளவீடுகள் |
| [OpenAQ](https://openaq.org) | ஹைப்பர்லோக்கல் CPCB மற்றும் சமூக நிலையங்கள் | இலவச API key | My Neighbourhood பேனல் மற்றும் சாட்பாட்டின் ஹைப்பர்லோக்கல் பதில்கள் (முதன்மை ஆதாரம்; Sensor.Community மாற்று ஆதாரமாகப் பயன்படுத்தப்படுகிறது) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 முன்னறிவிப்பு (CAMS) | இலவசம், key தேவையில்லை | நேரடி 5-நாள் Forecast பேனல், சாட்பாட் "நாளை காற்று மாசு அதிகமாக இருக்குமா?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | செயலில் உள்ள-நெருப்பு கண்டறிதல் (VIIRS/NOAA-20 NRT) | இலவச API key | Farm Fire Tracker (கரும்புத் தள்ளு எரிப்பு) |
| [Sensor.Community](https://sensor.community/) | குறைந்த செலவிலான சமூக சென்சார்கள் (Open Data Commons Database Contents License v1.0 இன் கீழ் தரவு) | இலவசம் | ஹைப்பர்லோக்கல் மாற்று ஆதாரம் |
| [IMD](https://mausam.imd.gov.in) | வானிலை | இலவசம் | குறிப்புக்காக மட்டுமே (தளத்தால் பெறப்படுவதில்லை) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | கவனிக்கப்பட்ட மணிநேர நிலைய அளவீடுகள், 2009 முதல் (CPCB CAAQM + US Embassy), CC BY 4.0 | இலவச API key | கவனிக்கப்பட்ட நிலைய அடுக்கு, மற்றும் மானிட்டர்களுக்கு எதிராக செயற்கைக்கோள் வரைபடத்தைச் சரிபார்த்தல். [xkdr-air-quality.md](xkdr-air-quality.md) ஐப் பார்க்கவும் |
| [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) | மணிநேர வரலாற்று வானிலை | இலவசம், key தேவையில்லை | 44 நகரங்களுக்கான வானிலையின் விளைவை அகற்றுதல், 2018–2024. [deweathered-national.md](deweathered-national.md) ஐப் பார்க்கவும் |

---

## உடல்நலம் மற்றும் இறப்பு விகிதம்
| ஆதாரம் | வகை | எதற்குப் பயன்படுத்தப்படுகிறது |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | Peer-reviewed | இந்தியா சார்ந்த இறப்பு விகிதம், பொருளாதாரச் செலவு |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | Peer-reviewed | நோய்ப்பரவல், வயதுக்கு ஏற்பத் தரப்படுத்தப்பட்ட விகிதங்கள் |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | Peer-reviewed | GEMM வழிமுறை |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | Academic | குழந்தைகளின் ஆரோக்கியம் |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | Guideline | PM2.5 மற்றும் PM10 தரநிலைகள் |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | Research | ஆயுட்கால மதிப்பீடுகள் |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | Peer-reviewed | இந்தியாவுக்கான PM2.5 இறப்பு விகித மதிப்பீடுகள் |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | Peer-reviewed | இந்தியா முழுவதும் சீரற்ற காற்று தர மேம்பாடுகள் |

---

## கொள்கை மற்றும் நிர்வாகம்

| ஆதாரம் | வகை | எதற்குப் பயன்படுத்தப்படுகிறது |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | Official | NCAP நகர வாரியான கண்காணிப்பு |
| [MoEFCC](https://moef.gov.in) | Official | NCAP பட்ஜெட்டுகள், அமைச்சகத்தின் பதில்கள் |
| [Indian Kanoon](https://indiankanoon.org/) | Legal | உச்ச நீதிமன்றம் மற்றும் NGT உத்தரவுகள் |
| [CAQM](https://caqm.nic.in/) | Official | GRAP உத்தரவுகள், NCR வழிகாட்டுதல்கள் |
| [Union Budget documents](https://www.indiabudget.gov.in) | Official | நிதி ஒதுக்கீட்டு கண்காணிப்பு |

---

## பொருளாதார மற்றும் சமூகத் தரவுகள்

| ஆதாரம் | எதற்குப் பயன்படுத்தப்படுகிறது |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | GDP இழப்பு, உற்பத்தித்திறன் |
| [TERI](https://www.teriin.org) | பின்னணி குறிப்பு (இங்கு குறிப்பிட்ட அறிக்கை பெயரிடப்படவில்லை) |
| [ILO](https://www.ilo.org) | பின்னணி குறிப்பு (இங்கு குறிப்பிட்ட அறிக்கை பெயரிடப்படவில்லை) |
| [PLFS (MoSPI)](https://mospi.gov.in) | பாதிக்கப்படக்கூடிய பணியாளர்களின் எண்ணிக்கையை மதிப்பிட முறைசாரா வேலைவாய்ப்பு எண்ணிக்கை |

---

## புலனாய்வு மற்றும் ஆராய்ச்சி
| ஆதாரம் | எதற்காகப் பயன்படுத்தப்படுகிறது |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | நகர அளவிலான ஆதாரப் பகுப்பாய்வு |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | கொள்கை பகுப்பாய்வு, GRAP மதிப்பீடு |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | நகரங்களின் தரவரிசைகள், உலகளாவிய இணக்கத் தரவுகள் |
| [UrbanEmissions.info](https://www.urbanemissions.info) | உமிழ்வுப் பட்டியல்கள் (Dr. Sarath Guttikunda) |

---

## மேற்கோள் பட்டியல்

Reading List பகுதி, இந்தத் தளம் நம்பியிருக்கும் சக மதிப்பாய்வு செய்யப்பட்ட (peer-reviewed) ஆய்வுகளைக் கொண்டுள்ளது; ஒவ்வொன்றும் அதன் DOI உடன் இணைக்கப்பட்டுள்ளது. இவை அனைத்தையும் Zotero, Mendeley, EndNote அல்லது LaTeX மேற்கோள் பட்டியலுக்காக ஒரே கோப்பாக [BibTeX](https://www.janvayu.in/downloads/janvayu-reading-list.bib) அல்லது [RIS](https://www.janvayu.in/downloads/janvayu-reading-list.ris) ஆகப் பதிவிறக்கம் செய்து கொள்ளலாம். `scripts/build-reading-list-bib.py` என்ற ஸ்கிரிப்ட், இந்தப் பகுதி மற்றும் ஒவ்வொரு DOI-இன் Crossref பதிவு ஆகியவற்றிலிருந்து இரண்டு கோப்புகளையும் உருவாக்குகிறது; இவை பட்டியலோடு ஒத்திசைவில்லாமல் போனால் CI தோல்வியடையும்.

அக்டோபர் 2026 வரை இது ஒரு பொது Zotero குழுவைக் குறிப்பதாக இருந்தது. இது கடைசியாக மே மாதத்தில் திருத்தப்பட்டது; பட்டியலில் உள்ள 54 பொருட்களுக்கு எதிராக இதில் 21 பொருட்கள் மட்டுமே இருந்தன. மேலும், திட்டக் குழுவில் உள்ள எவராலும் இதில் உள்நுழைய முடியவில்லை என்பதால், இது கைவிடப்பட்டு, மாறக்கூடிய வாய்ப்பில்லாத ஒரு கோப்பிற்கு மாற்றப்பட்டது.

---

## மேற்கோள் மற்றும் அங்கீகாரம்

JanVayu முதன்மை ஆதாரங்களுடன் இணைக்கிறது. JanVayu-விலிருந்து தரவுகளை நீங்கள் பயன்படுத்தினால், JanVayu-வைக் குறிப்பிடாமல், அசல் ஆதாரத்தை (Lancet, CPCB போன்றவை) மேற்கோள் காட்டுங்கள். JanVayu பெரும்பாலும் தரவுகளைச் சேகரித்து நிறுவனங்களைக் கேள்விக்குள்ளாக்குகிறது; ஆனால், அதுவே சொந்தமாகச் சில தரவுத்தொகுப்புகளையும் (`deweathered-national.json`, `aqi-bulletins.json` மற்றும் `station-observed.json`) உருவாக்குகிறது, அவை இந்த கோப்புறையில் ஆவணப்படுத்தப்பட்டுள்ளன. முறைகள் குறித்த கேள்விகளுக்கு, அசல் ஆராய்ச்சித் தாள்களைப் பார்க்கவும்.

**உள்ளடக்க உரிமம்:** CC BY-NC-SA 4.0. வணிக நோக்கமற்ற பயன்பாடுகளுக்காக, உரிய அங்கீகாரத்துடன் மற்றும் அதே உரிமத்தின் கீழ் உள்ளடக்கத்தைப் பகிரவும் மாற்றியமைக்கவும் உங்களுக்கு அனுமதி உண்டு.
