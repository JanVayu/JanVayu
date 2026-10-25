# வார்டு-நிலை அட்லஸ்: தரவு மற்றும் முறை

> **v26.6.151-ல் நிறுத்தப்பட்டது.** இந்தப் பேனல் இனி வழங்கப்படுவதில்லை. இது செய்த அனைத்தும் [boundary map](boundary-map.md)-ல் உள்ளன. இது 142 நகரங்களுக்கு மட்டுமல்லாமல், முழு நாட்டிற்கும் பொருந்தும்: அனைத்து **68,596 வார்டுகள்** மற்றும் ஆறு பிற நிர்வாக நிலைகளில் வருடாந்திர PM2.5, மேற்பரப்பு வெப்பம், மரங்கள், பசுமை மற்றும் கட்டப்பட்ட பகுதிகள் ஆகியவை உள்ளன. இதன் தொடர்புப் பார்வையும் மாற்றப்பட்டுள்ளது, இப்போது ஒரு நகரத்திற்குள் உள்ள கட்டப்பட்ட பகுதியுடன் ஒப்பிடுவதற்குப் பதிலாக, எந்த நிலையிலும் உள்ள ஐந்து அளவீடுகளில் ஏதேனும் இரண்டை ஒப்பிடுகிறது. `#ward-map` ரூட் இன்னும் வேலை செய்கிறது, இது வரைபடத்தைக் காட்டும் பக்கத்திற்குச் செல்கிறது, எனவே இருக்கும் இணைப்புகள் தொடர்ந்து வேலை செய்யும்.
>
> இது நிறுத்தப்படுவதற்கு முன்பு, **தேசிய ஆதாரங்களில் விடுபட்டிருந்த 14 நகரங்கள்** வரைபடத்தின் வார்டு நிலைக்குள் சேர்க்கப்பட்டன: கொல்கத்தா, மதுரை, ஆசான்சோல், வாரங்கல், துர்காபூர், கரக்பூர், பர்த்வான், ஹால்டியா, மற்றும் வடகிழக்குத் தலைநகரங்களான அகர்தலா, இம்பால், ஷில்லாங், இடாநகர், ஐஸ்வால் மற்றும் கோஹிமா. ஒரு நகரத்திற்கான கோப்புகள் `data/wards/`-ல் அப்படியே உள்ளன.
>
> பேனலின் எண்கள் எவ்வாறு உருவாக்கப்பட்டன என்பதற்கான பதிவாக இந்தப் பக்கம் வைக்கப்பட்டுள்ளது, ஏனெனில் அவை வரைபடத்தின் எண்களிலிருந்து வேறுபடுகின்றன. பேனலின் வெப்பம் ஒரு நகரத்திற்கு ஒரு தெளிவான வானக் காட்சி, மற்றும் வரைபடத்தின் வெப்பம் ஒரு தேசிய பருவகாலத் தொகுப்பு. பின்வருவனவற்றை வரலாறாகப் படியுங்கள், தற்போது உள்ளதை விவரிப்பதாக அல்ல.

**வார்டு-நிலை அட்லஸ்** (*City Data*-ன் கீழ் உள்ள "உங்கள் வார்டு எவ்வளவு மாசுபட்டது?") ஒரு நகரத்தின் ஒவ்வொரு நகராட்சி வார்டையும், மாற்றக்கூடிய ஐந்து லேயர்களுடன் வண்ணமயமாக்கியது. ஒவ்வொரு லேயரின் தரவு எங்கிருந்து வந்தது மற்றும் அது எவ்வாறு கணக்கிடப்பட்டது என்பதை இந்தப் பக்கம் பதிவு செய்கிறது.

ஒரு நகரத்தின் ஒற்றை AQI எண் அண்டைப்பகுதிகளுக்கு இடையிலான பெரிய வேறுபாடுகளை மறைக்கிறது என்பதைக் காட்ட, அட்லஸ் JanVayu-ஐ நகர அளவிலிருந்து வார்டு அளவிலான தெளிவுத்திறனுக்கு மாற்றியது. இது Unmapped.blr-ன் வைஷ்ணவி ஐயர் செய்த பெங்களூரு நகர்ப்புற-வெப்ப வரைபடத்தால் ஈர்க்கப்பட்டது.

---

## நகரங்கள் மற்றும் வார்டு எல்லைகள்

**142 நகரங்கள் மற்றும் 9,015 வார்டுகள்** செயல்பாட்டில் இருந்தன, மேலும் **ஒவ்வொரு மாநில மற்றும் யூனியன்-பிரதேசத் தலைநகரமும் வரைபடமாக்கப்பட்டது**. இந்த பட்டியல் ஒரு தேர்ந்தெடுக்கப்பட்ட சிறிய பட்டியல் அல்ல. திறந்த உரிமத்துடன் கூடிய வார்டு எல்லைகளை எங்களால் கண்டுபிடிக்க முடிந்த ஒவ்வொரு நகரமும் இதில் அடங்கும்.

எல்லைகள் வெவ்வேறு உரிமங்களைக் கொண்ட ஆறு மேல்நிலை ஆதாரங்களில் இருந்து வருகின்றன, எனவே ஒவ்வொரு நகரத்தின் கோப்பும் அது உண்மையில் வந்த ஆதாரத்தைப் பதிவு செய்கிறது, மேலும் திரையில் எந்த நகரம் இருந்தாலும், அட்லஸ் அந்த வரைபடத்தின் கீழ் அந்த அங்கீகாரத்தை அச்சிட்டது. அனைத்து ஐந்து லேயர்களும் அனைத்து 142 நகரங்களையும் உள்ளடக்கியிருந்தன.
| நகரம் | வார்டுகள் | எல்லை ஆதாரம் |
|------|-------|-----------------|
| Delhi | 290 | DataMeet |
| Bengaluru | 243 | DataMeet |
| Mumbai | 227 | Mumbai spatial-data project |
| Chennai | 201 | DataMeet |
| Jodhpur | 160 | Swachh Bharat Mission |
| Kota | 150 | Swachh Bharat Mission |
| Hyderabad | 145 | DataMeet |
| Kolkata | 141 | DataMeet |
| Kalyan-Dombivli | 123 | ESRI India Living Atlas |
| Chhatrapati Sambhajinagar | 115 | Swachh Bharat Mission |
| Lucknow | 112 | DataMeet |
| Navi Mumbai | 111 | Swachh Bharat Mission |
| Asansol | 106 | WB AMRUT GIS master plans |
| Kakinada | 101 | ESRI India Living Atlas |
| Coimbatore | 100 | Swachh Bharat Mission |
| Dehradun | 100 | Swachh Bharat Mission |
| Madurai | 100 | ESRI India Living Atlas |
| Prayagraj | 100 | Swachh Bharat Mission |
| Thiruvananthapuram | 100 | Swachh Bharat Mission |
| Agra | 99 | Swachh Bharat Mission |
| Varanasi | 99 | Varanasi Smart City ArcGIS |
| Ghaziabad | 94 | Swachh Bharat Mission |
| Ludhiana | 94 | Swachh Bharat Mission |
| Visakhapatnam | 91 | Swachh Bharat Mission |
| Meerut | 90 | Swachh Bharat Mission |
| Bhopal | 86 | DataMeet |
| Amritsar | 85 | Swachh Bharat Mission |
| Indore | 85 | Swachh Bharat Mission |
| Gorakhpur | 81 | Swachh Bharat Mission |
| Kolhapur | 81 | ESRI India Living Atlas |
| Ajmer | 80 | Swachh Bharat Mission |
| Aligarh | 80 | Swachh Bharat Mission |
| Bareilly | 80 | Swachh Bharat Mission |
| Bikaner | 80 | Swachh Bharat Mission |
| Jalandhar | 80 | Swachh Bharat Mission |
| Jabalpur | 79 | Swachh Bharat Mission |
| Jaipur | 77 | DataMeet |
| Jammu | 75 | Swachh Bharat Mission |
| Srinagar | 75 | ESRI India Living Atlas |
| Kochi | 74 | Swachh Bharat Mission |
| Patna | 71 | Swachh Bharat Mission |
| Bhilai | 70 | ESRI India Living Atlas |
| Firozabad | 70 | Swachh Bharat Mission |
| Moradabad | 70 | Swachh Bharat Mission |
| Raipur | 70 | Swachh Bharat Mission |
| Saharanpur | 70 | ESRI India Living Atlas |
| Udaipur | 70 | Swachh Bharat Mission |
| Bhubaneswar | 67 | Swachh Bharat Mission |
| Hubballi | 67 | Swachh Bharat Mission |
| Korba | 67 | ESRI India Living Atlas |
| Warangal | 67 | ESRI India Living Atlas |
| Bilaspur | 66 | ESRI India Living Atlas |
| Gwalior | 66 | Swachh Bharat Mission |
| Alwar | 65 | Swachh Bharat Mission |
| Mysuru | 65 | Swachh Bharat Mission |
| Vijayawada | 64 | Swachh Bharat Mission |
| Bhiwadi | 60 | Swachh Bharat Mission |
| Erode | 60 | Swachh Bharat Mission |
| Guwahati | 60 | OpenCity / Oorvani (BharatLas) |
| Jhansi | 60 | ESRI India Living Atlas |
| Mangaluru | 60 | Swachh Bharat Mission |
| Nizamabad | 60 | Swachh Bharat Mission |
| Patiala | 60 | Swachh Bharat Mission |
| Salem | 60 | Swachh Bharat Mission |
| Thoothukudi | 60 | Swachh Bharat Mission |
| Vizianagaram | 60 | ESRI India Living Atlas |
| Cuttack | 59 | Swachh Bharat Mission |
| Kanpur | 58 | DataMeet |
| Pune | 58 | DataMeet |
| Belagavi | 57 | Swachh Bharat Mission |
| Guntur | 57 | Swachh Bharat Mission |
| Dhanbad | 55 | Swachh Bharat Mission |
| Kollam | 55 | Swachh Bharat Mission |
| Thrissur | 55 | Swachh Bharat Mission |
| Nellore | 54 | Swachh Bharat Mission |
| Ujjain | 54 | Swachh Bharat Mission |
| Gaya | 53 | Swachh Bharat Mission |
| Ranchi | 53 | Swachh Bharat Mission |
| Kurnool | 52 | Swachh Bharat Mission |
| Agartala | 51 | ESRI India Living Atlas |
| Bathinda | 50 | Swachh Bharat Mission |
| Bhagalpur | 50 | Swachh Bharat Mission |
| Howrah | 50 | WB AMRUT GIS master plans |
| Kalaburagi | 50 | Swachh Bharat Mission |
| Sagar | 50 | ESRI India Living Atlas |
| Ratlam | 49 | ESRI India Living Atlas |
| Ahmedabad | 48 | DataMeet |
| Muzaffarpur | 48 | Swachh Bharat Mission |
| Bihar Sharif | 46 | ESRI India Living Atlas |
| Satna | 46 | ESRI India Living Atlas |
| Arrah | 45 | ESRI India Living Atlas |
| Davanagere | 45 | ESRI India Living Atlas |
| Katihar | 45 | ESRI India Living Atlas |
| Murwara | 45 | ESRI India Living Atlas |
| Durgapur | 43 | WB AMRUT GIS master plans |
| Vasai-Virar | 43 | ESRI India Living Atlas |
| Bidhannagar | 42 | WB AMRUT GIS master plans |
| Silchar | 42 | ESRI India Living Atlas |
| Raurkela | 41 | ESRI India Living Atlas |
| Faridabad | 40 | DataMeet |
| Naya Raipur | 40 | ESRI India Living Atlas |
| Sasaram | 40 | ESRI India Living Atlas |
| Damoh | 39 | ESRI India Living Atlas |
| Tirupati | 39 | Swachh Bharat Mission |
| Nagpur | 38 | Swachh Bharat Mission |
| Siwan | 38 | ESRI India Living Atlas |
| Bardhaman | 35 | WB AMRUT GIS master plans |
| Gurugram | 35 | ESRI India Living Atlas |
| Kharagpur | 35 | WB AMRUT GIS master plans |
| Shivamogga | 35 | ESRI India Living Atlas |
| Tumakuru | 35 | ESRI India Living Atlas |
| Puducherry | 33 | Swachh Bharat Mission |
| Thane | 33 | Swachh Bharat Mission |
| Pimpri Chinchwad | 32 | ESRI India Living Atlas |
| Thanesar | 32 | ESRI India Living Atlas |
| Nanded-Waghala | 31 | ESRI India Living Atlas |
| Panaji (Goa) | 30 | Swachh Bharat Mission |
| Surat | 30 | Swachh Bharat Mission |
| Haldia | 29 | WB AMRUT GIS master plans |
| Chandigarh | 28 | DataMeet |
| Imphal | 28 | ESRI India Living Atlas |
| Shillong | 27 | ESRI India Living Atlas |
| Panipat | 26 | Swachh Bharat Mission |
| Solapur | 26 | Swachh Bharat Mission |
| Shimla | 25 | ESRI India Living Atlas |
| Port Blair | 24 | ESRI India Living Atlas |
| Nashik | 23 | Swachh Bharat Mission |
| Amravati | 22 | Swachh Bharat Mission |
| Rohtak | 22 | Swachh Bharat Mission |
| Ambala | 20 | ESRI India Living Atlas |
| Hisar | 20 | Swachh Bharat Mission |
| Itanagar | 20 | ESRI India Living Atlas |
| Karnal | 20 | ESRI India Living Atlas |
| Sonipat | 20 | Swachh Bharat Mission |
| Aizawl | 19 | ESRI India Living Atlas |
| Gangtok | 19 | Swachh Bharat Mission |
| Kohima | 19 | ESRI India Living Atlas |
| Rajkot | 18 | Swachh Bharat Mission |
| Vadodara | 18 | Swachh Bharat Mission |
| Dharamshala | 17 | ESRI India Living Atlas |
| Jamnagar | 16 | Swachh Bharat Mission |
| Silvassa | 15 | ESRI India Living Atlas |
### ஆறு மேல்நிலை ஆதாரங்கள்

| ஆதாரம் | நகரங்கள் | உரிமம் | இது எவ்வாறு பெறப்பட்டது |
|--------|--------|---------|---------------|
| [Swachh Bharat Mission](https://indianopenmaps.com) ULB வார்டுகள் | 74 | பிரதிபலிப்பில் "not-so-open" என குறிக்கப்பட்டுள்ளது; அரசுத் தளத்திலிருந்து பெறப்பட்டது | ஒவ்வொரு நகர்ப்புற உள்ளாட்சி அமைப்பும் (ULB) தனது சொந்த வார்டு வரைபடத்தை SBM-ல் பதிவேற்றியது. ramSeraph உருவாக்கிய சமூகப் பிரதிபலிப்பு, தேசிய வெளியீட்டை (3,675 ULB-கள், 70,416 பலகோணங்கள்) அணுகக்கூடியதாக ஆக்குகிறது |
| [DataMeet Municipal Spatial Data](https://github.com/datameet/Municipal_Spatial_Data) | 13 | CC BY | கைமுறையாகச் சேகரிக்கப்பட்டது; அசல் அட்லஸ் நகரங்கள் |
| **ESRI India Living Atlas வார்டுகள்**, indianopenmaps.com வழியாக | 45 | SBM-ஐப் போன்ற அதே "not-so-open" பிரதிபலிப்பு | 157 நகரங்களில் 9,100 வார்டுகள் உள்ளன, மேலும் SBM-ஐப் போலல்லாமல் இது ஒவ்வொரு மாநிலத்தையும் சென்றடைகிறது. இறுதியாக ஸ்ரீநகர், அகர்தலா, இம்பால், ஷில்லாங், இடாநகர், ஐஸ்வால், கோஹிமா மற்றும் மதுரை ஆகிய நகரங்களை வரைபடமாக்கியது இதுதான் |
| **மேற்கு வங்காள [AMRUT](https://amrut.mohua.gov.in/) GIS முதன்மைத் திட்டங்கள்**, indianopenmaps.com வழியாக | 7 | SBM-ஐப் போன்ற அதே "not-so-open" பிரதிபலிப்பு | AMRUT GIS முதன்மைத் திட்டத் திட்டத்திலிருந்து, 52 மேற்கு வங்காள நகர்ப்புற உள்ளாட்சி அமைப்புகளில் 1,633 வார்டு பலகோணங்கள் |
| BharatLas வழியாக [OpenCity / Oorvani Foundation](https://bharatlas.com) | 1 (கவுகாத்தி) | **ODbL-1.0** | BharatLas-லிருந்து இறக்குமதி செய்யப்பட்டது |
| [Mumbai spatial-data project](https://github.com/sanjanakrishnan/mumbai_spatial_data) · வாரணாசி ஸ்மார்ட் சிட்டி ArcGIS | 2 | திறந்த / அதிகாரப்பூர்வ | கைமுறையாகச் சேகரிக்கப்பட்டது |

எல்லைகள் சுமார் 28 m சகிப்புத்தன்மைக்கு எளிமைப்படுத்தப்பட்டன, ஆயத்தொலைவுகள் முழுமையாக்கப்பட்டன, மேலும் லேபிள்கள் மற்றும் இடைச்செருகலுக்காக (interpolation) பரப்பளவு-எடையிடப்பட்ட மையப் புள்ளி சேமிக்கப்பட்டது. ஒவ்வொரு நகரத்தின் செயலாக்கப்பட்ட கோப்பும் `/data/wards/<city>.json` இல் உள்ளது, மேலும் பேனல் திறக்கப்படும்போது மட்டுமே இது ஏற்றப்படும்.

### என்ன விடுபட்டிருந்தது, ஏன்

**ஒவ்வொரு மாநில மற்றும் யூனியன்-பிரதேசத் தலைநகரமும் வரைபடமாக்கப்பட்டது.** அவற்றில் ஏழு நகரங்கள் Living Atlas லேயருடன் மட்டுமே வந்தன, ஏனெனில் இங்கு அவை இதுவரை வார்டு வரைபடத்தைக் கொண்டிருக்கவில்லை: ஸ்ரீநகர், அகர்தலா, இம்பால், ஷில்லாங், இடாநகர், ஐஸ்வால் மற்றும் கோஹிமா.
**இந்தப் பக்கத்தை வடிவமைத்த ஒரு திருத்தம்.** கொஞ்ச காலமாக இந்தப் பக்கமும், ரோட்மேப்பும், வெளியிடப்பட்ட ஒரு பிளாக்கும் ஸ்வச் பாரத் (Swachh Bharat) தரவுகளில், குறிப்பாக மேற்கு வங்கத்தில், விடுபட்டவை வெளிப்படையாகக் கிடைக்கவில்லை என்று கூறின. அது மூன்று விதமாகத் தவறானது, அதுவும் எப்போதும் ஒரே விதமாகவே தவறாக இருந்தது. `WB_AMRUT_Wards` மற்றும் `LivingAtlas_Wards` ஆகியவையும் அடங்கிய ஒரு GitHub ரிலீஸிலிருந்து நாங்கள் ஒரே ஒரு ஃபைலை (`SBM_Wards.geojsonl.7z`) மட்டுமே டவுன்லோட் செய்துகொண்டிருந்தோம். அந்த ஒரு ஃபைலில் உள்ள குறைபாட்டை உலகத்தின் குறைபாடு என்று தவறாகப் புரிந்துகொண்டோம். அந்த முழு ரிலீஸையும் பட்டியலிட்டபோது மேற்கு வங்கமும் (7 நகரங்கள்) அதன்பிறகு நாங்கள் கைவிட்டிருந்த அனைத்து தலைநகரங்கள் உட்பட மேலும் 45 நகரங்களும் அதில் இருப்பது தெரியவந்தது. ஒரு ஆதாரம் கிடைக்கவில்லை என்று நினைக்கும்போது, எதையும் முடிவுக்கு வருவதற்கு முன் அந்தத் தொகுப்பில் உள்ள அனைத்தையும் பட்டியலிட்டுப் பார்க்க வேண்டும்.

பெரிய நகரங்களில் **Siliguri** மட்டுமே உண்மையான ஒரு குறைபாடாக இருந்தது, அதற்கான ஆதாரங்களும் உறுதியானவை: அது Swachh Bharat-ல் இல்லை; மேற்கு வங்க AMRUT அப்லோடில் 47 வார்டுகளில் 4 வார்டுகள் மட்டுமே உள்ளன, இது ஒரு பகுதி அளவிலான பதிவுதான், முழுமையான நகரம் அல்ல; மேலும் இது Living Atlas லேயரிலும் இல்லை. Siliguri Jalpaiguri Development Authority இரண்டு கிராமப்புறப் பகுதிகளுக்கான மௌசா (வருவாய் கிராமம்) வரைபடங்களை PDF-களாக மட்டுமே வெளியிடுகிறது, இது தவறான அலகு, தவறான வடிவம் மற்றும் தவறான பகுதி. எங்கள் கிராமப்புற லேயர் ஏற்கனவே அதே மௌசாக்களை ஆண்டுதோறும் PM2.5 தரவுகளுடன் பாலிগন (polygons) ஆகக் கொண்டுள்ளது.

ஒரு சிறிய குறைபாடு: சில ULB-கள் உண்மையான நகராட்சி வார்டுகளுக்குப் பதிலாகக் கரடுமுரடான வருவாய் வார்டுகளை அப்லோட் செய்துள்ளன. Silvassa (15), Jamnagar (16), Rajkot மற்றும் Vadodara (தலா 18) ஆகியவை மிகக் குறைவான தரவுகளைக் கொண்டுள்ளன. அவர்கள் வெளியிட்டதை நாங்கள் அப்படியே காட்டினோம், அவர்களைத் தரவிலிருந்து நீக்கவில்லை.

---

## ஐந்து லேயர்கள்
| அடுக்கு | ஆதாரம் | தெளிவுத்திறன் | வகை | குறிப்புகள் |
|-------|--------|-----------|------|-------|
| **காற்றுத் தரம்** (PM2.5) | CPCB / WAQI நேரடி மானிட்டர்கள் | நிலையங்களின் நெட்வொர்க் | நேரடி, இடைக்கணிப்பு செய்யப்பட்டது | ஒவ்வொரு வார்டின் மதிப்பும் நகரத்தின் நேரடி நிலையங்களில் இருந்து, வார்டின் மையத்திற்கான தூரத்தின் அடிப்படையில் கணக்கிடப்படுகிறது. இது நகரத்தின் *பரவலைக்* காட்டுகிறது, அளவீடு செய்யப்பட்ட தெரு அளவிலான அளவீடு அல்ல, மேலும் மானிட்டர்கள் அதிகமாக உள்ள இடங்களில் இது துல்லியமாக இருக்கும். |
| **காற்று, வருடாந்திரம்** (PM2.5) | SatPM2.5 V6GL03 (ACAG / Washington University) | ~1 km | செயற்கைக்கோள், வருடாந்திரம் | 2024-க்கான வருடாந்திர சராசரி PM2.5, முன்கூட்டியே கணக்கிடப்பட்டது. செயற்கைக்கோள் ஏரோசால் தரவு மற்றும் GEOS-Chem வளிமண்டல மாதிரி ஆகியவற்றின் நரம்பியல் நெட்வொர்க் மூலம் கணக்கிடப்பட்டு, தரை மானிட்டர்கள் மூலம் அளவீடு செய்யப்பட்டது. ஒவ்வொரு நகரத்திற்குள்ளும் நிழலிடப்பட்டுள்ளது, லெஜண்டில் முழுமையான µg/m³ மதிப்புகள் உள்ளன. |
| **வெப்பம்** | USGS/NASA Landsat 8/9 (C2 L2) மேற்பரப்பு வெப்பநிலை | ~30 m | செயற்கைக்கோள், நகர அளவிலான ஸ்னாப்ஷாட் | தெளிவான வானம் கொண்ட கோடைகால மதிய நேரத்தின் நில-மேற்பரப்பு வெப்பநிலை. ஒவ்வொரு நகரத்திற்கும் காட்சியின் தேதி சேமிக்கப்பட்டுள்ளது. மேற்பரப்பு வெப்பநிலை காற்று வெப்பநிலையை விட அதிகமாக இருக்கும். நிறங்கள் ஒவ்வொரு நகரத்திற்குள்ளும் அளவிடப்படுகின்றன. |
| **பசுமைப் பரப்பு** | ESA WorldCover 2021 | 10 m | செயற்கைக்கோள், வருடாந்திரம் | ஒவ்வொரு வார்டிலும் தாவரங்கள் (மரம், புதர், புல், விவசாய நிலம், ஈரநிலம்) என வகைப்படுத்தப்பட்டவற்றின் பங்கு. |
| **கட்டமைப்புப் பரப்பு** | ESA WorldCover 2021 | 10 m | செயற்கைக்கோள், வருடாந்திரம் | ஒவ்வொரு வார்டிலும் கட்டப்பட்ட / ஊடுருவ முடியாத மேற்பரப்பாக வகைப்படுத்தப்பட்டவற்றின் பங்கு. |

ஆதாரங்கள்: [ESA WorldCover](https://esa-worldcover.org/) (CC BY 4.0), [Landsat](https://www.usgs.gov/landsat-missions) [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/) வழியாக, [SatPM2.5 V6GL03](https://www.satpm.org/v6-gl-03) (CC BY 4.0).

---

## செயற்கைக்கோள் அடுக்குகள் எவ்வாறு கணக்கிடப்பட்டன

செயற்கைக்கோள் அடுக்குகள் முன்கூட்டியே கணக்கிடப்பட்டு ஒவ்வொரு நகரத்தின் வார்டு எல்லைகளுடன் சேமிக்கப்பட்டன. இந்த பைப்லைன் முழு வரைபடங்களையும் ஒருபோதும் பதிவிறக்கம் செய்யவில்லை.

1. தேவையானதை மட்டும் படித்தல். ஒவ்வொரு நகரத்திற்கும், அதை உள்ளடக்கிய செவ்வகம் மட்டுமே தொலைதூர ESA WorldCover டைல்ஸ் மற்றும் Landsat மேற்பரப்பு-வெப்பநிலை பேண்டிலிருந்து பெறப்பட்டது.
2. வார்டு வாரியாக சராசரி செய்தல். ஒவ்வொரு வார்டு பலகோணமும் கட்டத்தின் மீது வைக்கப்பட்டது. பசுமைப் பரப்பு மற்றும் கட்டமைப்புப் பரப்பிற்கு, ஒவ்வொரு வகுப்பிலும் வார்டின் பிக்சல்களின் பங்கு எண்ணப்பட்டது. வெப்பம் மற்றும் வருடாந்திர PM2.5-க்கு, வார்டின் சராசரி எடுக்கப்பட்டது. ஒரு கட்ட செல்லை விட சிறிய வார்டு அதன் மையத்தில் உள்ள மதிப்பை எடுத்தது.
3. வெப்பக் காட்சியைத் தேர்ந்தெடுத்தல். ஒவ்வொரு நகரத்திற்கும், நகரத்தை உள்ளடக்கிய கோடைகாலத்தில் மிகக் குறைந்த மேகங்களைக் கொண்ட Landsat 8/9 காட்சி தேர்ந்தெடுக்கப்பட்டது, மேலும் செயற்கைக்கோளின் தரப் பட்டையைப் பயன்படுத்தி மேகம் மறைக்கப்பட்டது.
**நேரடி காற்று தர** லேயர் சேமிக்கப்படவில்லை. பேனல் திறக்கப்படும் ஒவ்வொரு முறையும், WAQI bounds endpoint-லிருந்து பிரவுசரில் அது interpolate செய்யப்பட்டது. Ask JanVayu பதிலளிப்பதற்காக, ஆண்டுத் தரவுகளும் Ask JanVayu படிக்கும் ஒரு டேட்டா ஃபைலில் காப்பி செய்யப்பட்டன, இதனால் அது வார்டு (ward) தொடர்பான கேள்விகளுக்குப் பதிலளிக்க முடியும்.

## கவனிக்க வேண்டியவை

இரண்டு காற்று லேயர்களும் வெவ்வேறு கால அளவுகளைக் குறிக்கின்றன, அவற்றை ஒன்றிணைக்கக் கூடாது. "Air quality" என்பது ஒரு நேரடி ஸ்னாப்ஷாட், மற்றும் "Air, yearly" என்பது 2024-ஆம் ஆண்டின் சராசரி. வெப்பம், பசுமை மற்றும் கட்டப்பட்ட பகுதிகள் ஆகியவற்றுடன் ஒப்பிடக்கூடியது வருடாந்திர லேயர் மட்டுமே, ஏனெனில் அது மட்டுமே அதே மெதுவான கால அளவை விவரிக்கிறது.

நேரடி காற்றின் மதிப்பு interpolate செய்யப்படுகிறது, ஒவ்வொரு வார்டுக்கும் தனித்தனியாக அளவிடப்படவில்லை. இந்தியாவில் வார்டு-அடர்த்தியான தரை அளவிலான நெட்வொர்க் (ground network) இல்லை. இந்த லேயர் பரவலைக் காட்டுகிறது, தெரு-மட்ட மதிப்பை அல்ல, மேலும் பேனலும் அதையே கூறுகிறது.

வருடாந்திர லேயர் மாடல் செய்யப்பட்டுள்ளது, மேலும் ~1 km hyperlocal மூலங்களை மென்மையாக்குகிறது. பக்கத்தில் உள்ள ஒரு சூளை, உருக்காலை அல்லது பரபரப்பான சந்திப்பு இதில் காட்டப்படாது. இது தரை அளவிலான மானிட்டர்களுக்கு எதிராக calibrate செய்யப்பட்டுள்ளது, அந்த வார்டில் அளவிடப்படவில்லை.

வெப்பம் என்பது ஒரு வெப்பமான-பருவ நாள், வருடாந்திர சராசரி அல்ல. இது மேற்பரப்பு வெப்பநிலையின் ஸ்னாப்ஷாட், ஒரு நகரத்திற்குள் வார்டுகளை ஒப்பிட பயனுள்ளதாக இருக்கும்.

பசுமை மற்றும் கட்டப்பட்ட பகுதிகள் ஆகியவை 2021-ஆம் ஆண்டின் வருடாந்திர நிலப் பரப்பளவாகும், மேலும் மிகச் சமீபத்திய கட்டுமானங்களைப் பிரதிபலிக்காமல் தாமதமாகலாம்.

ULB பதிவேற்றிய வார்டு எல்லைகள், அந்தந்த ULB பதிவேற்றிய delimitation தேதியைக் கொண்டுள்ளன, இது எல்லா இடங்களிலும் ஒரே ஆண்டாக இருக்காது. கவுகாத்தி 2022 delimitation-ஐக் கொண்டுள்ளது, பல SBM நகரங்கள் பழையவை, மேலும் மேற்கு வங்காள AMRUT லேயர் அந்தத் திட்டத்தின் மாஸ்டர்-பிளான் ஆய்வுகளிலிருந்து வந்ததே தவிர, சமீபத்திய delimitation-லிருந்து அல்ல.

திருவனந்தபுரத்தில் உள்ள ஆறு வார்டுகளில் வெப்ப மதிப்பு இல்லை (100-ல் 6) *இந்த பேனலில்*. [boundary map](boundary-map.md) ஆறு வார்டுகளில் ஐந்திற்கு தேசிய Landsat mosaic-லிருந்து தீர்வு காண்கிறது, இதுவே இந்தக் குறிப்பு கோரிய தீர்வாகும், இருப்பினும் பேனலின் சொந்த நகர-மட்ட முறை இன்னும் இடைவெளியைக் கொண்டுள்ளது. காரணம் மேகம் அல்ல, நாங்கள் முதலில் நினைத்தது போல். அந்த வார்டுகள் நகரத்திற்கு கிடைக்கும் ஒவ்வொரு சீனின் வடக்கு விளிம்பில் உள்ள Landsat கவரேஜ் சீமில் (coverage seam) அமைந்துள்ளன. 8 முன்-பருவமழை மற்றும் 6 முழு-ஆண்டு சீன்களில், ஒவ்வொன்றும் தோராயமாக 5,500 masked பிக்சல்களைத் தருகின்றன, அவற்றில் பூஜ்ஜிய சரியான தரவு உள்ளது. இதைச் சரிசெய்ய இரண்டு Landsat பாதைகளை ஒன்றாக இணைக்க வேண்டும், இந்த முறை அதைச் செய்யவில்லை. அந்த வார்டுகள் நிறமிடப்படாமல், யூகித்து நிரப்பப்படாமல் உள்ளன.
வெப்ப இடைவெளிகள் மற்ற காட்சிகளிலிருந்து நிரப்பப்பட்டன. மிகவும் தெளிவான காட்சி வார்டுகளுக்கு மதிப்பை வழங்கவில்லை என்றால், எந்தக் காட்சியும் மீதம் இல்லாத வரை அடுத்த தெளிவான காட்சிகள் முயற்சிக்கப்பட்டன. ஒன்றுக்கு மேற்பட்ட காட்சிகள் பங்களித்த இடங்களில் தேதிகள் பதிவு செய்யப்பட்டன. காட்சிகள் முதலில் கவரேஜ் மற்றும் இரண்டாவதாக மேகம் ஆகியவற்றின் அடிப்படையில் தரவரிசைப்படுத்தப்பட்டன. ஏனெனில், இரண்டு Landsat பாதைகளில் (டெல்லி WRS-2 பாதைகள் 146 மற்றும் 147-ல் அமைந்துள்ளது) அமைந்துள்ள ஒரு நகரம், அதன் ஐந்தில் ஒரு பகுதியைத் தவறவிடும் மேகம் இல்லாத காட்சியைப் பெறும்.

மேலும் காண்க: [Data sources overview](overview.md) · [Real-time AQI (WAQI)](waqi.md) · [Roadmap](../wiki/Roadmap.md).

---
