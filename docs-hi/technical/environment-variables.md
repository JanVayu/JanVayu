# एनवायरनमेंट वेरिएबल्स
सभी सीक्रेट्स और कॉन्फ़िगरेशन एनवायरनमेंट वेरिएबल्स के माध्यम से प्रबंधित किए जाते हैं। इन्हें **कभी भी रिपॉजिटरी में कमिट नहीं किया जाता है**।
- **लोकल डेवलपमेंट** के लिए: प्रोजेक्ट रूट में एक `.env` फ़ाइल बनाएँ (यह gitignored है)
- **प्रोडक्शन** के लिए: इन्हें [Netlify डैशबोर्ड](https://app.netlify.com) में Site Settings → Environment Variables के अंतर्गत सेट करें
---
## आवश्यक वेरिएबल्स
### `RESEND_API_KEY`
**द्वारा उपयोग किया गया:** `daily-digest.mjs`, `health-monitor.mjs`, `workshop-submit.mjs`, `terra-collab.mjs`
[Resend](https://resend.com) से आपकी API key। सब्सक्राइबर्स को डेली ईमेल डाइजेस्ट भेजने के लिए आवश्यक है।
**इसे कैसे प्राप्त करें:**
1. [resend.com](https://resend.com) पर एक अकाउंट बनाएँ
2. API Keys → Create API Key पर जाएँ
3. key कॉपी करें (यह केवल एक बार दिखाई जाती है)
---
### `RESEND_FROM`
**द्वारा उपयोग किया गया:** `daily-digest.mjs`
डाइजेस्ट ईमेल के लिए वेरिफाइड सेंडर ईमेल एड्रेस। यह वह डोमेन होना चाहिए जिसे आपने Resend में वेरिफाई किया है।
**उदाहरण:** `digest@janvayu.in`
---
### `BLOB_TOKEN`
**द्वारा उपयोग किया गया:** Netlify Blobs को पढ़ने/लिखने वाले सभी फ़ंक्शन्स
Blobs रीड/राइट परमिशन के साथ एक Netlify पर्सनल एक्सेस टोकन।
**इसे कैसे प्राप्त करें:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications) पर जाएँ
2. एक नया टोकन जनरेट करें
3. इसे कॉपी करें (केवल एक बार दिखाई देता है)
---
### `NETLIFY_SITE_ID`
**द्वारा उपयोग किया गया:** Netlify Blobs को पढ़ने/लिखने वाले सभी फ़ंक्शन्स
आपकी Netlify साइट का यूनिक ID।
**इसे कैसे प्राप्त करें:**
1. [app.netlify.com](https://app.netlify.com) पर जाएँ
2. JanVayu साइट खोलें
3. Site Settings → General → Site ID पर जाएँ
4. UUID कॉपी करें (फ़ॉर्मेट: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
---
### `GROQ_API_KEY`
**द्वारा उपयोग किया गया:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`
AI-पावर्ड फ़ीचर्स के लिए Groq API key (यह `openai/gpt-oss-120b` का उपयोग करता है, जो एक ओपन-वेट LLM है; मॉडल को वैकल्पिक `GROQ_MODEL` वेरिएबल के साथ ओवरराइड किया जा सकता है)।
**इसे कैसे प्राप्त करें:**
1. [console.groq.com](https://console.groq.com) पर जाएँ
2. साइन अप या लॉग इन करें
3. API Keys पर जाएँ और एक नई key बनाएँ
JanVayu में AI फ़ीचर्स के लिए फ़्री टियर पर्याप्त है।
---
## वैकल्पिक वेरिएबल्स
साइट इनके बिना भी काम करती है। इनमें से प्रत्येक केवल एक फ़ीचर को बेहतर बनाता है और यदि यह अनुपस्थित है तो कुछ भी खराब नहीं होता है।
### फ़ंक्शन्स द्वारा पढ़े जाने वाले अन्य वेरिएबल्स
कोड इन्हें भी पढ़ता है; प्रत्येक का डिफ़ॉल्ट या फ़ॉलबैक उस फ़ंक्शन में होता है जो इसका उपयोग करता है।
| Variable | द्वारा पढ़ा जाता है | उद्देश्य |
|----------|---------|---------|
| `GROQ_MODEL` | `air-query`, `health-advisory`, `accountability-brief`, `anomaly-check` | Groq मॉडल का नाम; डिफ़ॉल्ट रूप से `openai/gpt-oss-120b` |
| `WAQI_TOKEN` (या `WAQI_API_TOKEN`) | `waqi-proxy` और सीधे WAQI पढ़ने वाले फ़ंक्शन्स | WAQI टोकन। आवश्यक है। स्रोत में कोई फ़ॉलबैक नहीं है |
| `OPENAQ_API_KEY` | `community-sensors` | OpenAQ API key |
| `FIRMS_MAP_KEY` | `fire-tracker` | NASA FIRMS मैप key |
| `WORKSHOP_INBOX_EMAIL` | `workshop-submit`, `terra-collab` | वर्कशॉप सबमिशन के लिए प्राप्तकर्ता; डिफ़ॉल्ट रूप से `contribute@janvayu.in` |
| `ALERT_EMAIL` | `health-monitor` | अपटाइम अलर्ट के लिए कॉमा से अलग किए गए प्राप्तकर्ता |
| `TERRA_COLLAB_SECRET` | `terra-collab` | उस फ़ंक्शन के लिए साझा गुप्त (shared secret) |

### `YOUTUBE_API_KEY`
**द्वारा उपयोग किया जाता है:** `youtube-feed.js`
इसके बिना, वीडियो फ़ीड आठ भारतीय समाचार और पर्यावरण चैनलों की सार्वजनिक RSS फ़ीड पढ़ती है और उन वीडियो को रखती है जिनके शीर्षक में वायु गुणवत्ता का नाम हो। इसके लिए किसी key और कोटा की आवश्यकता नहीं होती है, लेकिन यह केवल उन्हीं चैनलों का कवरेज ढूंढ सकती है जिन्हें हमने सूचीबद्ध किया है, और प्रदूषण के मौसम के बाहर वे चैनल हफ्तों तक वायु के बारे में कुछ भी प्रकाशित नहीं करते हैं — इसलिए, मान लीजिए अगस्त में, फ़ीड वास्तव में खाली रहती है।
इसके साथ, फ़ंक्शन YouTube पर **खोज (search)** भी करता है, जिससे उन चैनलों तक पहुंचा जा सकता है जो सूचीबद्ध नहीं हैं।
**इसे प्राप्त करने का तरीका:**
1. [console.cloud.google.com](https://console.cloud.google.com) पर जाएं और किसी भी Google अकाउंट से साइन इन करें।
2. एक प्रोजेक्ट बनाएं (शीर्ष बार → **New Project**), या कोई मौजूदा प्रोजेक्ट चुनें।
3. **APIs & Services → Library**, **YouTube Data API v3** के लिए खोजें, इसे खोलें, **Enable** पर क्लिक करें।
4. **APIs & Services → Credentials → Create Credentials → API key**। key कॉपी करें।
5. **Edit API key** पर क्लिक करें और **API restrictions** के तहत **Restrict key** → *YouTube Data API v3* चुनें। एप्लिकेशन प्रतिबंधों को **None** के रूप में छोड़ दें: Netlify फ़ंक्शन्स में allow-list करने के लिए कोई निश्चित IP नहीं होता है। इसे केवल एक API तक सीमित रखने का मतलब है कि लीक हुई key सार्वजनिक YouTube डेटा पढ़ने के अलावा कुछ नहीं कर सकती।
6. Netlify में: **Site configuration → Environment variables → Add a variable**, नाम `YOUTUBE_API_KEY` रखें, वैल्यू पेस्ट करें, फिर redeploy करें।
फ़ंक्शन प्रत्येक cache रिफ़िल पर तीन खोज क्वेरी चलाता है, और परिणाम को cache किया जाता है, इसलिए एक व्यस्त दिन में खोज भत्ते का एक छोटा हिस्सा ही उपयोग होता है।
---
> **2 Oct 2026 का अपडेट:** Google का कोटा पेज अब `search.list` को 1 यूनिट प्रति कॉल के हिसाब से, 100 कॉल्स प्रति दिन का अपना अलग बकेट देता है; अलग से 10,000 यूनिट्स प्रति दिन अन्य एंडपॉइंट्स पर लागू होते हैं ([quota cost reference](https://developers.google.com/youtube/v3/determine_quota_cost))। इसलिए हर रिफिल पर तीन क्वेरीज़ 100 दैनिक सर्च में से 3 का उपयोग करती हैं।
**इसे केवल सर्वर-साइड पर पढ़ा जाता है।** यह की (key) Netlify फ़ंक्शन में रहती है और इसे कभी ब्राउज़र में नहीं भेजा जाता। इसे `index.html` में न डालें।
**इसके काम करने की पुष्टि करने के लिए**, फ़ंक्शन को फ़ेच करें और `source` देखें:
```bash
curl -s https://www.janvayu.in/.netlify/functions/youtube-feed | head -c 200
```
`"source": "channel-rss"` का मतलब है कि कोई की सेट नहीं है। `"source": "channel-rss + data-api"` का मतलब है कि की का उपयोग हो रहा है।
---
## WAQI Token (Server-Side)
### WAQI API Token
WAQI API टोकन एक सर्वर-साइड सेटिंग है। यह Netlify साइट सेटिंग्स में `WAQI_TOKEN` एनवायरनमेंट वेरिएबल है, और इस रिपॉजिटरी की किसी भी पेज, स्क्रिप्ट या फ़ंक्शन में यह मौजूद नहीं है। ब्राउज़र केवल `/.netlify/functions/waqi-proxy` के माध्यम से WAQI तक पहुँचता है, जो सर्वर पर टोकन जोड़ता है, केवल सिटी स्लग, कोऑर्डिनेट्स और तीन डिग्री से अधिक चौड़े न होने वाले बाउंडिंग बॉक्स को स्वीकार करता है, और उत्तरों को पाँच मिनट के लिए कैश करता है। अगर कोई टोकन कमिट किया जाता है तो `scripts/check-no-waqi-token.py` बिल्ड को फ़ेल कर देता है। 27 October 2026 तक यह टोकन `app.js`, `js/try-home.js` और आठ फ़ंक्शन्स में लिखा गया था, इसलिए हर विज़िटर के पास यह था; git हिस्ट्री में कॉपी पढ़ने योग्य बनी हुई है, इसलिए जो भी टोकन कभी कमिट किया गया हो, उसे [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) से मिले नए टोकन से बदला जाना चाहिए, और Netlify में `WAQI_TOKEN` को अपडेट किया जाना चाहिए (नया डिप्लॉय इसे ले लेता है)।
फ़ोर्क के लिए, [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) पर अपना खुद का टोकन रजिस्टर करें और इसे `WAQI_TOKEN` के रूप में सेट करें।
---
## लोकल `.env` का उदाहरण
```bash
# ईमेल डाइजेस्ट (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AI फ़ीचर्स (Groq, gpt-oss-120b)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# लाइव रीडिंग (WAQI), waqi-proxy और फ़ंक्शन्स द्वारा पढ़ी जाती हैं
WAQI_TOKEN=your_waqi_token

# वैकल्पिक: वीडियो फ़ीड के लिए YouTube सर्च (फ़्री टियर, कोई कार्ड नहीं)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
