# एनवायरनमेंट वेरिएबल्स

सभी सीक्रेट्स और कॉन्फ़िगरेशन एनवायरनमेंट वेरिएबल्स के ज़रिए मैनेज किए जाते हैं। इन्हें **कभी भी रिपॉजिटरी में कमिट नहीं किया जाता**।

- **लोकल डेवलपमेंट** के लिए: प्रोजेक्ट रूट में एक `.env` फ़ाइल बनाएँ (इसे gitignore किया गया है)
- **प्रोडक्शन** के लिए: इन्हें [Netlify डैशबोर्ड](https://app.netlify.com) में Site Settings → Environment Variables के तहत सेट करें

---

## ज़रूरी वेरिएबल्स

### `RESEND_API_KEY`
**द्वारा उपयोग:** `daily-digest.mjs`

[Resend](https://resend.com) से आपका API key। सब्सक्राइबर्स को डेली ईमेल डाइजेस्ट भेजने के लिए ज़रूरी है।

**इसे कैसे प्राप्त करें:**
1. [resend.com](https://resend.com) पर एक अकाउंट बनाएँ
2. API Keys → Create API Key पर जाएँ
3. की (key) कॉपी करें (यह केवल एक बार दिखाई जाती है)

---

### `RESEND_FROM`
**द्वारा उपयोग:** `daily-digest.mjs`

डाइजेस्ट ईमेल के लिए वेरिफाइड सेंडर ईमेल एड्रेस। यह एक ऐसा डोमेन होना चाहिए जिसे आपने Resend में वेरिफाई किया हो।

**उदाहरण:** `digest@janvayu.in`

---

### `BLOB_TOKEN`
**द्वारा उपयोग:** Netlify Blobs को पढ़ने/लिखने वाले सभी फ़ंक्शन्स

Blobs रीड/राइट परमिशन के साथ एक Netlify पर्सनल एक्सेस टोकन।

**इसे कैसे प्राप्त करें:**
1. [Netlify User Settings → Personal Access Tokens](https://app.netlify.com/user/applications) पर जाएँ
2. एक नया टोकन जनरेट करें
3. इसे कॉपी करें (केवल एक बार दिखाया जाता है)

---

### `NETLIFY_SITE_ID`
**द्वारा उपयोग:** Netlify Blobs को पढ़ने/लिखने वाले सभी फ़ंक्शन्स

आपकी Netlify साइट का यूनीक ID।

**इसे कैसे प्राप्त करें:**
1. [app.netlify.com](https://app.netlify.com) पर जाएँ
2. JanVayu साइट खोलें
3. Site Settings → General → Site ID पर जाएँ
4. UUID कॉपी करें (फ़ॉर्मेट: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### `GROQ_API_KEY`
**द्वारा उपयोग:** `air-query.mjs`, `health-advisory.mjs`, `accountability-brief.mjs`, `anomaly-check.mjs`

AI-पावर्ड फ़ीचर्स के लिए Groq API key (यह `openai/gpt-oss-120b` का उपयोग करता है, जो एक ओपन-वेट LLM है; इस मॉडल को वैकल्पिक `GROQ_MODEL` वेरिएबल के साथ ओवरराइड किया जा सकता है)।

**इसे कैसे प्राप्त करें:**
1. [console.groq.com](https://console.groq.com) पर जाएँ
2. साइन अप करें या लॉग इन करें
3. API Keys पर जाएँ और एक नई key बनाएँ

JanVayu में AI फ़ीचर्स के लिए मुफ़्त टियर (free tier) काफ़ी है।

---

## वैकल्पिक वेरिएबल्स

यह साइट इनके बिना भी काम करती है। इनमें से हर एक एक सिंगल फ़ीचर को बेहतर बनाता है और इनके न होने पर कुछ भी खराब नहीं होता।

### फ़ंक्शन्स द्वारा पढ़े जाने वाले अन्य वेरिएबल्स

कोड इन्हें भी पढ़ता है; इनमें से हर एक का इस्तेमाल करने वाले फ़ंक्शन में एक डिफ़ॉल्ट या फ़ॉलबैक होता है।
| वेरिएबल | द्वारा पढ़ा जाता है | उद्देश्य |
|----------|---------|---------|
| `GROQ_MODEL` | `air-query`, `health-advisory`, `accountability-brief`, `anomaly-check` | Groq मॉडल का नाम; डिफ़ॉल्ट रूप से `openai/gpt-oss-120b` होता है |
| `WAQI_TOKEN`, `WAQI_API_TOKEN` | `rankings`, `push-send`, `waqi-proxy` | WAQI टोकन ओवरराइड; फ़ंक्शन सोर्स में मौजूद टोकन का इस्तेमाल करते हैं |
| `OPENAQ_API_KEY` | `community-sensors` | OpenAQ API की |
| `FIRMS_MAP_KEY` | `fire-tracker` | NASA FIRMS मैप की |
| `WORKSHOP_INBOX_EMAIL` | `workshop-submit`, `terra-collab` | वर्कशॉप सबमिशन के लिए प्राप्तकर्ता; डिफ़ॉल्ट रूप से `contribute@janvayu.in` होता है |
| `ALERT_EMAIL` | `health-monitor` | अपटाइम अलर्ट के लिए कॉमा से अलग किए गए प्राप्तकर्ता |
| `TERRA_COLLAB_SECRET` | `terra-collab` | उस फ़ंक्शन के लिए साझा गुप्त (shared secret) |

### `YOUTUBE_API_KEY`
**द्वारा उपयोग किया जाता है:** `youtube-feed.js`

इसके बिना, वीडियो फ़ीड आठ भारतीय समाचार और पर्यावरण चैनलों के सार्वजनिक RSS फ़ीड को पढ़ती है और केवल उन वीडियो को रखती है जिनके शीर्षक में वायु गुणवत्ता का नाम होता है। इसके लिए किसी की (key) या कोटा की आवश्यकता नहीं होती है, लेकिन यह केवल उन्हीं चैनलों की कवरेज ढूंढ सकती है जिन्हें हमने सूचीबद्ध किया है। प्रदूषण के मौसम के बाहर वे चैनल हफ्तों तक वायु गुणवत्ता के बारे में कुछ भी प्रकाशित नहीं करते हैं — इसलिए, मान लीजिए अगस्त में, फ़ीड वास्तव में खाली रहती है।

इसके साथ, फ़ंक्शन YouTube पर **खोज (search)** भी करता है, जिससे उन चैनलों तक पहुँचा जा सकता है जो हमारी सूची में नहीं हैं।

**इसे कैसे प्राप्त करें:**
1. [console.cloud.google.com](https://console.cloud.google.com) पर जाएँ और किसी भी Google अकाउंट से साइन इन करें।
2. एक प्रोजेक्ट बनाएँ (टॉप बार → **New Project**), या किसी मौजूदा प्रोजेक्ट को चुनें।
3. **APIs & Services → Library**, **YouTube Data API v3** खोजें, इसे खोलें, और **Enable** पर क्लिक करें।
4. **APIs & Services → Credentials → Create Credentials → API key**। की (key) कॉपी करें।
5. **Edit API key** पर क्लिक करें और **API restrictions** के तहत **Restrict key** → *YouTube Data API v3* चुनें। एप्लिकेशन प्रतिबंधों को **None** ही रहने दें: Netlify फ़ंक्शन्स में allow-list करने के लिए कोई निश्चित IP नहीं होता है। इसे केवल एक API तक सीमित रखने का मतलब है कि अगर कोई की लीक भी हो जाती है, तो वह केवल सार्वजनिक YouTube डेटा पढ़ सकती है, कुछ और नहीं।
6. Netlify में: **Site configuration → Environment variables → Add a variable**, इसका नाम `YOUTUBE_API_KEY` रखें, वैल्यू पेस्ट करें, और फिर से डिप्लॉय करें।

फ़ंक्शन हर कैश रिफ़िल पर तीन सर्च क्वेरी चलाता है, और परिणाम को कैश कर लिया जाता है, इसलिए एक व्यस्त दिन में सर्च अलाउंस का केवल एक छोटा सा हिस्सा ही इस्तेमाल होता है।
---
> **अपडेट 2 अक्टूबर 2026:** Google के कोटा पेज पर अब `search.list` के लिए रोज़ाना 100 कॉल्स का अपना अलग बकेट है, जिसमें हर कॉल पर 1 यूनिट लगती है; अलग से मिलने वाले 10,000 यूनिट्स प्रति दिन बाकी एंडपॉइंट्स पर लागू होते हैं ([क्वोता कॉस्ट रेफरेंस](https://developers.google.com/youtube/v3/determine_quota_cost))। इसलिए रिफिल होने पर हर तीन क्वेरीज़ 100 रोज़ाना सर्च में से 3 का इस्तेमाल करती हैं।

**इसे केवल सर्वर-साइड पर ही पढ़ा जाता है।** यह की (key) Netlify फ़ंक्शन में रहती है और कभी भी ब्राउज़र को नहीं भेजी जाती, इसलिए इसे WAQI टोकन की तरह पब्लिक करने की ज़रूरत नहीं है। इसे `index.html` में न डालें।

**यह काम कर रहा है या नहीं, इसकी पुष्टि करने के लिए**, फ़ंक्शन को फ़ेच करें और `source` को देखें:

```bash
curl -s https://www.janvayu.in/.netlify/functions/youtube-feed | head -c 200
```

`"source": "channel-rss"` का मतलब है कि कोई की (key) सेट नहीं है। `"source": "channel-rss + data-api"` का मतलब है कि की (key) का इस्तेमाल हो रहा है।

---

## क्लाइंट-साइड टोकन (सीक्रेट नहीं)

### WAQI API टोकन
WAQI API टोकन (`1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3`) `app.js` और `js/try-home.js` में और कई Netlify फ़ंक्शन्स में एम्बेड किया गया है, इसलिए कोई भी इसे पढ़ सकता है और इसे सीक्रेट नहीं रखा जा सकता। WAQI अपने [टर्म्स ऑफ़ सर्विस](https://aqicn.org/data-platform/token/) के तहत हर रजिस्टर्ड यूज़र को टोकन जारी करता है और सभी API एक्सेस के लिए एक वैलिड की (key) की ज़रूरत होती है; डिफ़ॉल्ट कोटा प्रति की (key) प्रति सेकंड 1,000 रिक्वेस्ट्स है।

अगर आप अपना खुद का WAQI टोकन इस्तेमाल करना चाहते हैं (ज़्यादा रेट लिमिट के लिए), तो [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) पर रजिस्टर करें और `index.html` में टोकन को बदल दें।

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

# वैकल्पिक: वीडियो फ़ीड के लिए YouTube सर्च (फ़्री टियर, कोई कार्ड नहीं)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
