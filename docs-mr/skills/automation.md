# Skill: स्वयंचलन

JanVayu ची नियोजित कार्ये आणि स्वयंचलित प्रक्रिया.

---

## नियोजित कार्ये

### Feed Refresh (प्रत्येक 4 तासांनी)
- **Function:** `scheduled-fetch.mjs`
- Reddit, Twitter/X, Instagram, बातम्या fetch
- Netlify Blobs मध्ये cache
- अपयश झाल्यास जुना cache राखतो

### दैनिक Digest (सकाळी 8 IST)
- **Function:** `daily-digest.mjs`
- सदस्यांच्या शहरांचा AQI fetch
- HTML email तयार करतो
- Resend API ने पाठवतो

---

## स्वयंचलित तपासण्या

### विसंगती शोध
- Page load वर trigger
- 5 शहरांच्या seasonal baseline शी तुलना
- 10-मिनिट cache

### Link तपासणी (CI)
- GitHub Actions (push/PR वर)
- Lychee link checker
- सोशल मीडिया आणि localhost URLs वगळतो

### Dependabot
- मासिक npm अपडेट तपासणी
- GitHub Actions अपडेट तपासणी

---

## निरीक्षण

### Feed आरोग्य
- `feed-status.js` — प्रत्येक feed ची ताजेपणा तपासणी
- Cache मध्ये प्रत्येक feed चा शेवटचा अपडेट वेळ

### त्रुटी logging
- सर्व functions `console.log` ने त्रुटी log करतात
- Netlify Functions logs मध्ये पहा
