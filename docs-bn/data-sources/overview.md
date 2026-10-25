# ডেটা সোর্সের ওভারভিউ

JanVayu জনসমক্ষে থাকা সোর্স এবং গবেষণাপত্রের একটি রিডিং লিস্টের ওপর ভিত্তি করে কাজ করে। যেসব ফিগার পাবলিক সোর্সের, সেগুলো মূল সোর্সের সাথে লিংক করা থাকে। কিছু ম্যাপ লেয়ার হলো মডেল করা এস্টিমেট (উদাহরণস্বরূপ SatPM2.5, CAMS এবং LongPMInd), এবং সেগুলোকে সেভাবেই লেবেল করা হয়েছে। এই পেজে সোর্সগুলোর প্রধান গ্রুপগুলোর তালিকা দেওয়া হলো।

---

## রিয়েল-টাইম বাতাসের মান

| সোর্স | ধরন | অ্যাক্সেস | এর জন্য ব্যবহৃত |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | রিয়েল-টাইম AQI | ফ্রি API | ড্যাশবোর্ড, ম্যাপ, সব শহরের ডেটা |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | অফিসিয়াল AQI | ফ্রি ওয়েব | ভেরিফিকেশন, অফিসিয়াল রিডিং |
| [OpenAQ](https://openaq.org) | হাইপারলোকাল CPCB এবং কমিউনিটি স্টেশন | ফ্রি API কি | মাই নেইবারহুড প্যানেল এবং চ্যাটবটের হাইপারলোকাল উত্তর (প্রাথমিক সোর্স; Sensor.Community হলো ব্যাকআপ) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 পূর্বাভাস (CAMS) | ফ্রি, কোনো কি নেই | লাইভ 5-দিনের ফোরকাস্ট প্যানেল, চ্যাটবটের "আগামীকাল কি খারাপ হবে?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | অ্যাক্টিভ-ফায়ার ডিটেকশন (VIIRS/NOAA-20 NRT) | ফ্রি API কি | ফার্ম ফায়ার ট্র্যাকার (খড় পোড়ানো) |
| [Sensor.Community](https://sensor.community/) | কম খরচের কমিউনিটি সেন্সর (Open Data Commons Database Contents License v1.0-এর অধীনে ডেটা) | ফ্রি | হাইপারলোকাল ব্যাকআপ |
| [IMD](https://mausam.imd.gov.in) | আবহাওয়া সংক্রান্ত | ফ্রি | শুধুমাত্র রেফারেন্সের জন্য (সাইট থেকে ফেচ করা হয় না) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | পর্যবেক্ষণ করা ঘণ্টাপ্রতি স্টেশনের রিডিং, 2009 থেকে (CPCB CAAQM + US Embassy), CC BY 4.0 | ফ্রি API কি | অবজার্ভড স্টেশন লেয়ার, এবং মনিটরগুলোর সাথে স্যাটেলাইট ম্যাপ যাচাই করা। দেখুন [xkdr-air-quality.md](xkdr-air-quality.md) |
| [Open-Meteo আর্কাইভ](https://open-meteo.com/en/docs/historical-weather-api) | ঘণ্টাপ্রতি ঐতিহাসিক আবহাওয়া | ফ্রি, কোনো কি নেই | 44টি শহরের (2018–2024) আবহাওয়ার প্রভাব দূর করা। দেখুন [deweathered-national.md](deweathered-national.md) |

---

## স্বাস্থ্য এবং মৃত্যুহার
| উৎস | ধরন | ব্যবহারের ক্ষেত্র |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | পিয়ার-রিভিউড | ভারত-ভিত্তিক মৃত্যুহার, অর্থনৈতিক ক্ষতি |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | পিয়ার-রিভিউড | রোগের বোঝা, বয়স-মানসম্মত হার |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | পিয়ার-রিভিউড | GEMM পদ্ধতি |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | একাডেমিক | শিশুদের স্বাস্থ্য |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | নির্দেশিকা | PM2.5 এবং PM10 মান |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | গবেষণা | আয়ুষ্কালের অনুমান |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | পিয়ার-রিভিউড | ভারতের জন্য PM2.5 মৃত্যুর কার্যকারণ অনুমান |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | পিয়ার-রিভিউড | ভারতের বিভিন্ন অঞ্চলে বায়ুদূষণের অসম উন্নতি |

---

## নীতি ও শাসনব্যবস্থা

| উৎস | ধরন | ব্যবহারের ক্ষেত্র |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | সরকারি | NCAP-এর শহরভিত্তিক ট্র্যাকিং |
| [MoEFCC](https://moef.gov.in) | সরকারি | NCAP বাজেট, মন্ত্রণালয়ের প্রতিক্রিয়া |
| [Indian Kanoon](https://indiankanoon.org/) | আইনি | সুপ্রিম কোর্ট এবং NGT-এর আদেশ |
| [CAQM](https://caqm.nic.in/) | সরকারি | GRAP আদেশ, NCR নির্দেশিকা |
| [Union Budget documents](https://www.indiabudget.gov.in) | সরকারি | তহবিল বরাদ্দের ট্র্যাকিং |

---

## অর্থনৈতিক ও সামাজিক ডেটা

| উৎস | ব্যবহারের ক্ষেত্র |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | জিডিপি হ্রাস, উৎপাদনশীলতা |
| [TERI](https://www.teriin.org) | পটভূমির রেফারেন্স (এখানে নির্দিষ্ট কোনো রিপোর্টের নাম দেওয়া নেই) |
| [ILO](https://www.ilo.org) | পটভূমির রেফারেন্স (এখানে নির্দিষ্ট কোনো রিপোর্টের নাম দেওয়া নেই) |
| [PLFS (MoSPI)](https://mospi.gov.in) | ঝুঁকিতে থাকা কর্মীবাহিনীর আকার নির্ধারণে ব্যবহৃত অপ্রাতিষ্ঠানিক কর্মসংস্থানের সংখ্যা |

---

## অনুসন্ধানী ও গবেষণা
| উৎস | ব্যবহৃত হয় |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | শহরের স্তরে উৎস বিশ্লেষণ |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | নীতি বিশ্লেষণ, GRAP মূল্যায়ন |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | শহরের র‍্যাঙ্কিং, বৈশ্বিক কমপ্লায়েন্স ডেটা |
| [UrbanEmissions.info](https://www.urbanemissions.info) | নির্গমন ইনভেন্টরি (Dr. Sarath Guttikunda) |

---

## তথ্যসূত্র

Reading List প্যানেলে পিয়ার-রিভিউ করা গবেষণাগুলো রাখা থাকে, যেগুলো এই সাইটটি ব্যবহার করে। এর প্রতিটির সাথে এর DOI লিঙ্ক করা থাকে। এগুলোর সবগুলো একসাথে একটি সাইটেশন ফাইল হিসেবে ডাউনলোড করা যায়: [BibTeX](https://www.janvayu.in/downloads/janvayu-reading-list.bib) বা [RIS](https://www.janvayu.in/downloads/janvayu-reading-list.ris)। এগুলো Zotero, Mendeley, EndNote বা LaTeX বিবলিওগ্রাফির জন্য ব্যবহার করা যায়। `scripts/build-reading-list-bib.py` স্ক্রিপ্টটি প্যানেল এবং প্রতিটি DOI-এর Crossref রেকর্ড থেকে এই দুটি ফাইলই তৈরি করে। আর যদি এগুলোর মধ্যে কোনো অমিল থাকে, তবে CI ফেইল করে।

অক্টোবর 2026 পর্যন্ত এটি একটি পাবলিক Zotero গ্রুপকে নির্দেশ করত। এটি শেষবার মে মাসে এডিট করা হয়েছিল, যেখানে তালিকার 54টির বিপরীতে মাত্র 21টি আইটেম ছিল। প্রজেক্টের কেউই আর সেখানে সাইন ইন করতে পারতেন না। তাই একটি নির্ভরযোগ্য ফাইলের জন্য এটি বাতিল করা হয়।

---

## সাইটেশন এবং স্বীকৃতি

JanVayu প্রাইমারি সোর্সগুলোর সাথে লিঙ্ক করে। আপনি যদি JanVayu থেকে ডেটা ব্যবহার করেন, তবে JanVayu-এর বদলে মূল উৎস (Lancet, CPCB ইত্যাদি) সাইট করুন। JanVayu মূলত প্রতিষ্ঠানগুলো থেকে ডেটা সংগ্রহ করে এবং তাদের জবাবদিহির আওতায় আনে। তবে এটি নিজস্ব কিছু ডেটাসেটও তৈরি করে (`deweathered-national.json`, `aqi-bulletins.json` এবং `station-observed.json`), যেগুলো এই ফোল্ডারে ডকুমেন্ট করা আছে। পদ্ধতি সম্পর্কিত প্রশ্নের জন্য মূল গবেষণাপত্রগুলো দেখতে পারেন।

**কন্টেন্ট লাইসেন্স:** CC BY-NC-SA 4.0। আপনি অ-বাণিজ্যিক উদ্দেশ্যে কন্টেন্টটি শেয়ার এবং মানিয়ে নিতে পারেন, তবে শর্ত হলো যথাযথ স্বীকৃতি দিতে হবে এবং একই লাইসেন্সের অধীনে রাখতে হবে।
