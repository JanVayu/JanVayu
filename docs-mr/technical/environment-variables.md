# एन्व्हायर्नमेंट व्हेरिएबल्स

सर्व सिक्रेट्स आणि कॉन्फिगरेशन एन्व्हायर्नमेंट व्हेरिएबल्सद्वारे मॅनेज केले जातात. ते **कधीही रिपॉझिटरीमध्ये कमिट केले जात नाहीत**.

- **लोकल डेव्हलपमेंटसाठी**: प्रोजेक्ट रूटमध्ये एक `.env` फाईल तयार करा (ती gitignored आहे)
- **प्रॉडक्शनसाठी**: [Netlify डॅशबोर्ड](https://app.netlify.com) मध्ये Site Settings → Environment Variables अंतर्गत ते सेट करा

---

## आवश्यक व्हेरिएबल्स

### `RESEND_API_KEY`
**वापरणारे:** `daily-digest.mjs`

[Resend](https://resend.com) कडून मिळालेली तुमची API key. सबस्क्रायबर्सना रोजचे ईमेल डायजेस्ट पाठवण्यासाठी आवश्यक आहे.

**ती कशी मिळवायची:**
1. [resend.com](https://resend.com) वर अकाउंट तयार करा
2. API Keys → Create API Key वर जा
3. Key कॉपी करा (ती फक्त एकदाच दाखवली जाते)

---

### `RESEND_FROM`
**वापरणारे:** `daily-digest.mjs`

डायजेस्ट ईमेल्ससाठी व्हेरिफाईड सेंडर ईमेल ॲड्रेस. हे Resend मध्ये तुम्ही व्हेरिफाय केलेले डोमेन असले पाहिजे.

**उदाहरण:** `digest@janvayu.in`

---

### `BLOB_TOKEN`
**वापरणारे:** Netlify Blobs रीड/राईट करणारे सर्व फंक्शन्स

Blobs रीड/राईट परमिशन असलेले Netlify पर्सनल ॲक्सेस टोकन.

**ते कसे मिळवायचे:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications) वर जा
2. नवीन टोकन जनरेट करा
3. ते कॉपी करा (फक्त एकदाच दाखवले जाते)

---

### `NETLIFY_SITE_ID`
**वापरणारे:** Netlify Blobs रीड/राईट करणारे सर्व फंक्शन्स

तुमच्या Netlify साईटचा युनिक आयडी.

**तो कसा मिळवायचा:**
1. [app.netlify.com](https://app.netlify.com) वर जा
2. JanVayu साईट ओपन करा
3. Site Settings → General → Site ID वर जा
4. UUID कॉपी करा (फॉर्मेट: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### `GROQ_API_KEY`
**वापरणारे:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

AI-पॉवर्ड फीचर्ससाठी Groq API key (हे `openai/gpt-oss-120b` वापरते, जे एक ओपन-वेट LLM आहे; ऑप्शनल `GROQ_MODEL` व्हेरिएबल वापरून हे मॉडेल बदलता येते).

**ती कशी मिळवायची:**
1. [console.groq.com](https://console.groq.com) वर जा
2. साईन अप करा किंवा लॉग इन करा
3. API Keys वर जा आणि नवीन key तयार करा

JanVayu मधील AI फीचर्ससाठी फ्री टियर पुरेसा आहे.

---

## ऑप्शनल व्हेरिएबल्स

याशिवायही साईट काम करते. यातील प्रत्येक व्हेरिएबल एकच फीचर सुधारतो आणि तो नसला तरी काहीही बिघडत नाही.

### फंक्शन्सद्वारे रीड केले जाणारे इतर व्हेरिएबल्स

कोड हे सुद्धा रीड करतो; या प्रत्येकासाठी ते वापरणाऱ्या फंक्शनमध्ये एक डिफॉल्ट किंवा फॉलबॅक असतो.
| व्हेरिएबल | वाचते | उद्देश |
|----------|---------|---------|
| `GROQ_MODEL` | `air-query`, `health-advisory`, `accountability-brief`, `anomaly-check` | Groq मॉडेलचे नाव; डीफॉल्ट `openai/gpt-oss-120b` |
| `WAQI_TOKEN`, `WAQI_API_TOKEN` | `rankings`, `push-send`, `waqi-proxy` | WAQI टोकन ओव्हरराइड; फंक्शन्स सोर्समधील टोकन वापरतात |
| `OPENAQ_API_KEY` | `community-sensors` | OpenAQ API की |
| `FIRMS_MAP_KEY` | `fire-tracker` | NASA FIRMS मॅप की |
| `WORKSHOP_INBOX_EMAIL` | `workshop-submit`, `terra-collab` | वर्कशॉप सबमिशनसाठी प्राप्तकर्ता; डीफॉल्ट `contribute@janvayu.in` |
| `ALERT_EMAIL` | `health-monitor` | अपटाइम अलर्टसाठी स्वल्पविरामाने वेगळे केलेले प्राप्तकर्ते |
| `TERRA_COLLAB_SECRET` | `terra-collab` | त्या फंक्शनसाठी सामायिक गुप्त |

### `YOUTUBE_API_KEY`
**वापरकर्ते:** `youtube-feed.js`

याशिवाय, व्हिडिओ फीड आठ भारतीय बातम्या आणि पर्यावरण चॅनेल्सचे सार्वजनिक RSS फीड वाचते आणि ज्यांच्या शीर्षकांमध्ये हवेच्या गुणवत्तेचा उल्लेख असतो असे व्हिडिओ ठेवते. याला कोणत्याही की आणि कोट्याची आवश्यकता नसते, परंतु ते फक्त आम्ही सूचीबद्ध केलेल्या चॅनेल्सचे कव्हरेज शोधू शकते, आणि प्रदूषणाच्या हंगामाबाहेर ती चॅनेल्स आठवडेभर हवेबद्दल काहीही प्रकाशित करत नाहीत — त्यामुळे, उदाहरणार्थ, ऑगस्टमध्ये फीड खरोखरच रिकामी असते.

ही की वापरल्यास, हे फंक्शन YouTube वर **शोध** देखील घेते, ज्यामुळे अशा चॅनेल्सपर्यंत पोहोचता येते ज्यांची कोणीही यादी केलेली नाही.

**ती कशी मिळवायची:**
1. [console.cloud.google.com](https://console.cloud.google.com) वर जा आणि कोणत्याही Google अकाउंटने साइन इन करा.
2. एक प्रोजेक्ट तयार करा (वरची पट्टी → **New Project**), किंवा विद्यमान प्रोजेक्ट निवडा.
3. **APIs & Services → Library**, **YouTube Data API v3** शोधा, ते उघडा आणि **Enable** दाबा.
4. **APIs & Services → Credentials → Create Credentials → API key**. की कॉपी करा.
5. **Edit API key** दाबा आणि **API restrictions** अंतर्गत **Restrict key** → *YouTube Data API v3* निवडा. ॲप्लिकेशन निर्बंध **None** म्हणून सोडा: Netlify फंक्शन्समध्ये allow-list करण्यासाठी कोणतेही निश्चित IP नसते. ते एकाच API पर्यंत मर्यादित ठेवल्यास, लीक झालेली की सार्वजनिक YouTube डेटा वाचण्याशिवाय काहीही करू शकत नाही.
6. Netlify मध्ये: **Site configuration → Environment variables → Add a variable**, नाव `YOUTUBE_API_KEY` द्या, व्हॅल्यू पेस्ट करा आणि नंतर पुन्हा डिप्लॉय करा.

कॅशे रिफिल करताना हे फंक्शन तीन सर्च क्वेरी चालवते, आणि त्याचा निकाल कॅशे केला जातो, त्यामुळे व्यस्त दिवशी सर्च अलाउन्सचा फक्त एक छोटा भाग वापरला जातो.
---
> **२ ऑक्टोबर २०२६ चा अपडेट:** गुगलचे कोटा पेज आता `search.list` ला दिवसाला १०० कॉल्सचा स्वतःचा बकेट देते, प्रति कॉल १ युनिट; दररोजचे वेगळे १०,००० युनिट्स इतर एंडपॉइंट्सना लागू होतात ([quota cost reference](https://developers.google.com/youtube/v3/determine_quota_cost)). त्यामुळे रिफिलच्या वेळी तीन क्वेरी केल्यास १०० डेली सर्चपैकी ३ वापरले जातात.

**हे फक्त सर्व्हर-साइडवर वाचले जाते.** ही की Netlify फंक्शनमध्ये असते आणि ती कधीही ब्राउझरला पाठवली जात नाही, त्यामुळे WAQI टोकनसारखी ती पब्लिक असण्याची गरज नाही. ती `index.html` मध्ये टाकू नका.

**हे काम करत आहे याची खात्री करण्यासाठी**, फंक्शन फेच करा आणि `source` पहा:

```bash
curl -s https://www.janvayu.in/.netlify/functions/youtube-feed | head -c 200
```

`"source": "channel-rss"` याचा अर्थ कोणतीही की सेट केलेली नाही. `"source": "channel-rss + data-api"` याचा अर्थ की वापरात आहे.

---

## क्लायंट-साइड टोकन (सिक्रेट नाही)

### WAQI API टोकन
WAQI API टोकन (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) हे `app.js` आणि `js/try-home.js` मध्ये आणि अनेक Netlify फंक्शन्समध्ये एम्बेड केलेले आहे, त्यामुळे कोणीही ते वाचू शकतो आणि ते गुप्त ठेवता येत नाही. WAQI त्याच्या [terms of service](https://aqicn.org/data-platform/token/) अंतर्गत प्रत्येक नोंदणीकर्त्याला टोकन जारी करते आणि सर्व API ॲक्सेससाठी वैध की आवश्यक असते; डिफॉल्ट कोटा प्रति की सेकंदाला १,००० रिक्वेस्ट्स आहे.

जर तुम्हाला तुमचे स्वतःचे WAQI टोकन वापरायचे असेल (जास्त रेट लिमिट्ससाठी), तर [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) वर नोंदणी करा आणि `index.html` मधील टोकन बदला.

---

## लोकल `.env` उदाहरण

```bash
# ईमेल डायजेस्ट (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=digest@janvayu.in

# Netlify Blobs
BLOB_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AI फीचर्स (Groq, gpt-oss-120b)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ऐच्छिक: व्हिडिओ फीडसाठी YouTube सर्च (फ्री टियर, कार्ड नाही)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
