# ডেটা সোর্সের ওভারভিউ

JanVayu ১৬০টিরও বেশি পাবলিক সোর্স এবং পেপারের একটি রিডিং লিস্ট থেকে তথ্য সংগ্রহ করে। ফিগারগুলো তাদের মূল সোর্সের সাথে লিঙ্ক করা থাকে, যেখানে সোর্সটি পাবলিক। কিছু ম্যাপ লেয়ার হলো মডেল করা এস্টিমেট (উদাহরণস্বরূপ SatPM2.5, CAMS এবং LongPMInd) এবং সেগুলোকে সেভাবেই লেবেল করা হয়েছে। এই পেজে সোর্সগুলোর প্রধান গ্রুপগুলোর তালিকা দেওয়া হলো।

---

## রিয়েল-টাইম বাতাসের মান

| সোর্স | ধরন | অ্যাক্সেস | ব্যবহারের ক্ষেত্র |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | রিয়েল-টাইম AQI | ফ্রি API | ড্যাশবোর্ড, ম্যাপ, সব শহরের ডেটা |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | অফিসিয়াল AQI | ফ্রি ওয়েব | যাচাইকরণ, অফিসিয়াল রিডিং |
| [OpenAQ](https://openaq.org) | হাইপারলোকাল CPCB এবং কমিউনিটি স্টেশন | ফ্রি API কি | My Neighbourhood প্যানেল এবং চ্যাটবটের হাইপারলোকাল উত্তর (প্রাথমিক সোর্স; Sensor.Community হলো ফলব্যাক) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 পূর্বাভাস (CAMS) | ফ্রি, কোনো কি-এর প্রয়োজন নেই | লাইভ ৫-দিনের পূর্বাভাস প্যানেল, চ্যাটবট "আগামীকাল কি খারাপ হবে?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | সক্রিয়-আগুন শনাক্তকরণ (VIIRS/NOAA-20 NRT) | ফ্রি API কি | ফার্ম ফায়ার ট্র্যাকার (খড় পোড়ানো) |
| [Sensor.Community](https://sensor.community/) | কম খরচের কমিউনিটি সেন্সর (Open Data Commons Database Contents License v1.0-এর অধীনে ডেটা) | ফ্রি | হাইপারলোকাল ফলব্যাক |
| [IMD](https://mausam.imd.gov.in) | আবহাওয়া সংক্রান্ত | ফ্রি | শুধুমাত্র রেফারেন্সের জন্য (সাইট দ্বারা ফেচ করা হয় না) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | পর্যবেক্ষণ করা প্রতি ঘণ্টার স্টেশন রিডিং, ২০০৯ থেকে (CPCB CAAQM + US Embassy), CC BY 4.0 | ফ্রি API কি | পর্যবেক্ষণ করা স্টেশন লেয়ার, এবং মনিটরগুলোর সাথে স্যাটেলাইট ম্যাপ চেক করা। দেখুন [xkdr-air-quality.md](xkdr-air-quality.md) |
| [Open-Meteo আর্কাইভ](https://open-meteo.com/en/docs/historical-weather-api) | প্রতি ঘণ্টার ঐতিহাসিক আবহাওয়া | ফ্রি, কোনো কি-এর প্রয়োজন নেই | ৪৪টি শহরের জন্য আবহাওয়ার প্রভাব দূর করা, 2018–2024। দেখুন [deweathered-national.md](deweathered-national.md) |

---

## স্বাস্থ্য এবং মৃত্যুহার
| উৎস | ধরন | ব্যবহৃত হয় |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | পিয়ার-রিভিউড | ভারত-ভিত্তিক মৃত্যুহার, অর্থনৈতিক ক্ষতি |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | পিয়ার-রিভিউড | রোগের বোঝা, বয়স-মানসম্মত হার |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | পিয়ার-রিভিউড | GEMM পদ্ধতি |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | একাডেমিক | শিশুদের স্বাস্থ্য |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | নির্দেশিকা | PM2.5 এবং PM10 মান |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | গবেষণা | আয়ুষ্কালের অনুমান |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | পিয়ার-রিভিউড | ভারতের জন্য PM2.5-জনিত মৃত্যুর কার্যকারণ অনুমান |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | পিয়ার-রিভিউড | ভারতের বিভিন্ন অঞ্চলে বায়ুমানের অসম উন্নতি |

---

## নীতি ও শাসনব্যবস্থা

| উৎস | ধরন | ব্যবহৃত হয় |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | সরকারি | NCAP-এর শহরভিত্তিক ট্র্যাকিং |
| [MoEFCC](https://moef.gov.in) | সরকারি | NCAP-এর বাজেট, মন্ত্রণালয়ের প্রতিক্রিয়া |
| [Indian Kanoon](https://indiankanoon.org/) | আইনি | সুপ্রিম কোর্ট এবং NGT-এর আদেশ |
| [CAQM](https://caqm.nic.in/) | সরকারি | GRAP-এর আদেশ, NCR-এর নির্দেশিকা |
| [Union Budget documents](https://www.indiabudget.gov.in) | সরকারি | তহবিল বরাদ্দের ট্র্যাকিং |

---

## অর্থনৈতিক ও সামাজিক ডেটা

| উৎস | ব্যবহৃত হয় |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | জিডিপি হ্রাস, উৎপাদনশীলতা |
| [TERI](https://www.teriin.org) | পটভূমি তথ্য (এখানে নির্দিষ্ট কোনো রিপোর্টের নাম দেওয়া নেই) |
| [ILO](https://www.ilo.org) | পটভূমি তথ্য (এখানে নির্দিষ্ট কোনো রিপোর্টের নাম দেওয়া নেই) |
| [PLFS (MoSPI)](https://mospi.gov.in) | ঝুঁকিতে থাকা কর্মীবাহিনীর আকার নির্ধারণ করতে অনানুষ্ঠানিক কর্মসংস্থানের হিসাব ব্যবহার করা হয় |

---

## অনুসন্ধানী ও গবেষণা
| উৎস | ব্যবহৃত হয় |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | শহর-স্তরের উৎস বিশ্লেষণ |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | নীতি বিশ্লেষণ, GRAP মূল্যায়ন |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | শহরের র‍্যাঙ্কিং, বৈশ্বিক কমপ্লায়েন্স ডেটা |
| [UrbanEmissions.info](https://www.urbanemissions.info) | নির্গমন ইনভেন্টরি (ড. শরৎ গুত্তিকুন্ডা) |

---

## গ্রন্থপঞ্জি

রিডিং লিস্ট প্যানেলে সাইটটি যেসব পিয়ার-রিভিউড গবেষণার ওপর নির্ভর করে সেগুলো রাখা আছে, যার প্রতিটি DOI-এর সাথে যুক্ত। এগুলো সবই একসাথে একটি সাইটেশন ফাইল হিসেবে ডাউনলোড করা যায়, Zotero, Mendeley, EndNote বা LaTeX গ্রন্থপঞ্জির জন্য [BibTeX](https://www.janvayu.in/downloads/janvayu-reading-list.bib) বা [RIS](https://www.janvayu.in/downloads/janvayu-reading-list.ris) হিসেবে। `scripts/build-reading-list-bib.py` প্যানেল এবং প্রতিটি DOI-এর Crossref রেকর্ড থেকে উভয় ফাইল তৈরি করে, এবং তালিকার সাথে তাল না মিললে CI ফেইল করে।

অক্টোবর 2026 পর্যন্ত এটি একটি পাবলিক Zotero গ্রুপের দিকে নির্দেশ করত। এটি শেষবার মে মাসে এডিট করা হয়েছিল, যেখানে তালিকার 54টির বিপরীতে 21টি আইটেম ছিল, এবং প্রজেক্টের কেউই আর এতে সাইন ইন করতে পারছিল না, তাই এটি বাতিল করে এমন একটি ফাইলের ব্যবহার শুরু হয় যা কখনো পরিবর্তন হতে পারে না।

---

## সাইটেশন এবং অ্যাট্রিবিউশন

JanVayu প্রাথমিক উৎসগুলোর সাথে লিংক করে। আপনি যদি JanVayu থেকে ডেটা ব্যবহার করেন, তবে JanVayu-কে নয়, বরং মূল উৎসকে (Lancet, CPCB ইত্যাদি) সাইট করুন। JanVayu মূলত প্রতিষ্ঠানগুলোকে জবাবদিহি করার জন্য ডেটা সংগ্রহ করে, তবে এটি নিজস্ব কিছু ডেটাসেটও তৈরি করে (`deweathered-national.json`, `aqi-bulletins.json` এবং `station-observed.json`), এবং সেগুলো এই ফোল্ডারে ডকুমেন্ট করা আছে। পদ্ধতি সম্পর্কে কোনো প্রশ্ন থাকলে মূল গবেষণাপত্রগুলো দেখুন।

**কন্টেন্ট লাইসেন্স:** CC BY-NC-SA 4.0। আপনি অ্যাট্রিবিউশন সহ এবং একই লাইসেন্সের অধীনে অ-বাণিজ্যিক উদ্দেশ্যে কন্টেন্ট শেয়ার এবং পরিবর্তন করতে পারেন।
