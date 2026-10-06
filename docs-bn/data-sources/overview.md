# ডেটা সোর্স ওভারভিউ

JanVayu ১৬০টিরও বেশি পাবলিক সোর্স এবং পেপারের একটি রিডিং লিস্টের ওপর ভিত্তি করে কাজ করে। ফিগারগুলো যেখানেই পাবলিক, সেখানে তাদের মূল সোর্সের সাথে লিংক করা থাকে। কিছু ম্যাপ লেয়ার হলো মডেল করা এস্টিমেট (উদাহরণস্বরূপ SatPM2.5, CAMS এবং LongPMInd) এবং সেগুলোকে সেভাবেই লেবেল করা হয়েছে। এই পেজে সোর্সগুলোর প্রধান গ্রুপগুলোর তালিকা দেওয়া হলো।

---

## রিয়েল-টাইম বাতাসের মান

| সোর্স | ধরন | অ্যাক্সেস | ব্যবহারের ক্ষেত্র |
|--------|------|--------|---------|
| [WAQI](https://waqi.info) | রিয়েল-টাইম AQI | ফ্রি API | ড্যাশবোর্ড, ম্যাপ, সব শহরের ডেটা |
| [CPCB CAAQMS](https://app.cpcbccr.com/ccr/) | অফিসিয়াল AQI | ফ্রি ওয়েব | যাচাইকরণ, অফিসিয়াল রিডিং |
| [OpenAQ](https://openaq.org) | হাইপারলোকাল CPCB এবং কমিউনিটি স্টেশন | ফ্রি API কি | মাই নেইবারহুড প্যানেল এবং চ্যাটবটের হাইপারলোকাল উত্তর (প্রাথমিক সোর্স; Sensor.Community হলো ব্যাকআপ) |
| [Open-Meteo](https://open-meteo.com/) | PM2.5/PM10 পূর্বাভাস (CAMS) | ফ্রি, কোনো কি নেই | লাইভ ৫-দিনের ফোরকাস্ট প্যানেল, চ্যাটবট "আগামীকাল কি খারাপ হবে?" |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) | অ্যাক্টিভ-ফায়ার ডিটেকশন (VIIRS/NOAA-20 NRT) | ফ্রি API কি | ফার্ম ফায়ার ট্র্যাকার (খড় পোড়ানো) |
| [Sensor.Community](https://sensor.community/) | কম খরচের কমিউনিটি সেন্সর (Open Data Commons Database Contents License v1.0-এর অধীনে ডেটা) | ফ্রি | হাইপারলোকাল ব্যাকআপ |
| [IMD](https://mausam.imd.gov.in) | আবহাওয়া সংক্রান্ত | ফ্রি | শুধুমাত্র রেফারেন্সের জন্য (সাইট থেকে ফেচ করা হয় না) |
| [XKDR India Air Quality Database](https://airquality.xkdr.org) | পর্যবেক্ষণ করা ঘণ্টাপ্রতি স্টেশন রিডিং, ২০০৯ সাল থেকে (CPCB CAAQM + ইউএস এম্বাসি), CC BY 4.0 | ফ্রি API কি | পর্যবেক্ষণ করা স্টেশন লেয়ার, এবং মনিটরগুলোর সাথে স্যাটেলাইট ম্যাপ যাচাই করা। দেখুন [xkdr-air-quality.md](xkdr-air-quality.md) |
| [Open-Meteo আর্কাইভ](https://open-meteo.com/en/docs/historical-weather-api) | ঘণ্টাপ্রতি ঐতিহাসিক আবহাওয়া | ফ্রি, কোনো কি নেই | ৪৪টি শহরের জন্য আবহাওয়ার প্রভাব দূর করা, ২০১৮–২০২৪। দেখুন [deweathered-national.md](deweathered-national.md) |

---

## স্বাস্থ্য এবং মৃত্যুহার
| উৎস | ধরন | ব্যবহৃত |
|--------|------|---------|
| [Lancet Countdown 2025](https://lancetcountdown.org) | পিয়ার-রিভিউড | ভারত-ভিত্তিক মৃত্যুহার, অর্থনৈতিক ক্ষতি |
| [IHME GBD 2021](https://vizhub.healthdata.org/gbd-results/) | পিয়ার-রিভিউড | রোগের বোঝা, বয়স-মানসম্মত হার |
| [PNAS (Burnett et al. 2018)](https://doi.org/10.1073/pnas.1803222115) | পিয়ার-রিভিউড | GEMM পদ্ধতি |
| [Harvard T.H. Chan School](https://www.hsph.harvard.edu) | একাডেমিক | শিশুদের স্বাস্থ্য |
| [WHO Air Quality Guidelines 2021](https://www.who.int/publications/i/item/9789240034228) | গাইডলাইন | PM2.5 এবং PM10 মান |
| [AQLI (EPIC)](https://aqli.epic.uchicago.edu) | গবেষণা | আয়ুষ্কালের অনুমান |
| [Lancet Planetary Health, PM2.5 mortality (2024)](https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(24)00248-1/fulltext) | পিয়ার-রিভিউড | ভারতের জন্য PM2.5-জনিত মৃত্যুর কার্যকারণ অনুমান |
| [Science Advances, PM2.5 inequality (2025)](https://www.science.org/doi/10.1126/sciadv.adq1071) | পিয়ার-রিভিউড | ভারতের বিভিন্ন স্থানে বায়ুমানের অসম উন্নতি |

---

## নীতি ও শাসন

| উৎস | ধরন | ব্যবহৃত |
|--------|------|---------|
| [PRANA Portal](https://prana.cpcb.gov.in/) | সরকারি | NCAP-এর শহরভিত্তিক ট্র্যাকিং |
| [MoEFCC](https://moef.gov.in) | সরকারি | NCAP-এর বাজেট, মন্ত্রকের প্রতিক্রিয়া |
| [Indian Kanoon](https://indiankanoon.org/) | আইনি | সুপ্রিম কোর্ট এবং NGT-এর আদেশ |
| [CAQM](https://caqm.nic.in/) | সরকারি | GRAP আদেশ, NCR নির্দেশিকা |
| [Union Budget documents](https://www.indiabudget.gov.in) | সরকারি | তহবিল বরাদ্দের ট্র্যাকিং |

---

## অর্থনৈতিক ও সামাজিক ডেটা

| উৎস | ব্যবহৃত |
|--------|---------|
| [World Bank, Cost of Air Pollution](https://openknowledge.worldbank.org/handle/10986/25013) | জিডিপি ক্ষতি, উৎপাদনশীলতা |
| [TERI](https://www.teriin.org) | পটভূমির রেফারেন্স (এখানে নির্দিষ্ট কোনো রিপোর্টের নাম দেওয়া নেই) |
| [ILO](https://www.ilo.org) | পটভূমির রেফারেন্স (এখানে নির্দিষ্ট কোনো রিপোর্টের নাম দেওয়া নেই) |
| [PLFS (MoSPI)](https://mospi.gov.in) | ঝুঁকিপূর্ণ কর্মশক্তির আকার নির্ধারণে অনানুষ্ঠানিক কর্মসংস্থানের সংখ্যা |

---

## অনুসন্ধানী ও গবেষণা
| উৎস | ব্যবহৃত হয় |
|--------|---------|
| [CREA, Tracing the Hazy Air](https://energyandcleanair.org) | শহরভিত্তিক উৎস বিশ্লেষণ |
| [CSE (Centre for Science and Environment)](https://www.cseindia.org) | নীতি বিশ্লেষণ, GRAP মূল্যায়ন |
| [IQAir World Air Quality Report 2025](https://www.iqair.com/world-air-quality-report) | শহরের র‍্যাঙ্কিং, বৈশ্বিক সম্মতি ডেটা |
| [UrbanEmissions.info](https://www.urbanemissions.info) | নির্গমন ইনভেন্টরি (ড. শরৎ গুত্তিকুন্ডা) |

---

## Zotero বিবলিওগ্রাফি

JanVayu যৌথভাবে বিবলিওগ্রাফি পরিচালনার জন্য একটি পাবলিক Zotero গ্রুপ লাইব্রেরি বজায় রাখে:

**[zotero.org/groups/6508140/janvayu/library](https://www.zotero.org/groups/6508140/janvayu/library)**

এই লাইব্রেরিতে সাইট জুড়ে উল্লেখিত কিছু পেপার, রিপোর্ট এবং ডেটাসেট রাখা আছে (২ অক্টোবর ২০২৬ অনুযায়ী ২১টি আইটেম)। রিডিং লিস্ট প্যানেলে আরও বড় তালিকাটি রয়েছে। গবেষক এবং অবদানকারীরা উল্লেখিত উৎসগুলো ব্রাউজ করতে পারেন, যেকোনো ফরম্যাটে (BibTeX, APA, Chicago ইত্যাদি) সাইটেশন এক্সপোর্ট করতে পারেন এবং নতুন পেপারের প্রস্তাব দিতে পারেন।

---

## সাইটেশন এবং অ্যাট্রিবিউশন

JanVayu প্রাইমারি সোর্সগুলোর লিংক দেয়। আপনি যদি JanVayu থেকে ডেটা পুনরায় ব্যবহার করেন, তবে JanVayu-এর বদলে মূল উৎসটিকে (যেমন Lancet, CPCB ইত্যাদি) সাইট করুন। JanVayu মূলত বিভিন্ন প্রতিষ্ঠানকে জবাবদিহির আওতায় আনতে ডেটা সংগ্রহ করে, তবে এটি নিজস্ব কিছু ডেটাসেটও তৈরি করে (`deweathered-national.json`, `aqi-bulletins.json` এবং `station-observed.json`), এবং সেগুলো এই ফোল্ডারে ডকুমেন্ট করা আছে। পদ্ধতি সম্পর্কিত প্রশ্নের জন্য মূল গবেষণাপত্রগুলো দেখতে পারেন।

**কন্টেন্ট লাইসেন্স:** CC BY-NC-SA 4.0. আপনি অ্যাট্রিবিউশন সহ এবং একই লাইসেন্সের অধীনে অ-বাণিজ্যিক উদ্দেশ্যে কন্টেন্টটি শেয়ার এবং মানিয়ে নিতে পারেন।
