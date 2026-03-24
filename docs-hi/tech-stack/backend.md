# बैकएंड स्टैक

JanVayu का बैकएंड पूरी तरह सर्वरलेस है — 13 Netlify Functions।

---

## Netlify Functions
- **रनटाइम:** Node.js 18
- **स्थान:** `netlify/functions/`
- 13 फ़ंक्शन: 2 अनुसूचित + 10 ऑन-डिमांड + 1 यूटिलिटी

## Netlify Blobs (कैश)
- `@netlify/blobs` v8.1.0
- Strong consistency
- कैश-फर्स्ट रणनीति: फ़ीड आउटेज = पुराना डेटा (टूटा UI नहीं)

## Resend (ईमेल)
- `resend` v6.9.3
- दैनिक AQI डाइजेस्ट 8 AM IST
- `digest@janvayu.in` से

## WAQI API (क्लाइंट-साइड)
- सीधे ब्राउज़र से कॉल
- हर 10 मिनट में रिफ्रेश
- फ्री-टियर पब्लिक टोकन

विस्तृत जानकारी के लिए [Netlify Functions](../technical/netlify-functions.md) पृष्ठ देखें।
