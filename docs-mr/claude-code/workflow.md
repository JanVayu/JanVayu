# Claude Code विकास कार्यप्रवाह

JanVayu बनवताना वापरलेला दैनंदिन कार्यप्रवाह.

---

## वैशिष्ट्य विकास

### पायरी 1: वैशिष्ट्य परिभाषित करा
```
> एक anomaly detection banner जोडा जे दिल्ली, मुंबई, कोलकाता,
> चेन्नई आणि बेंगलुरु साठी PM2.5 ची seasonal baseline शी तुलना करते
```

### पायरी 2: Claude codebase वाचतो
- `index.html` — विद्यमान UI patterns
- विद्यमान Netlify Functions — कोड शैली
- `package.json` — उपलब्ध dependencies

### पायरी 3: Claude अंमलबजावणी करतो
- `netlify/functions/anomaly-check.mjs` तयार करतो
- `index.html` मध्ये banner HTML/CSS/JS जोडतो

### पायरी 4: पुनरावलोकन आणि सुधारणा
```
> Brief खूप लांब आहे. Gemini output 400 tokens पर्यंत मर्यादित करा.
```

### पायरी 5: Commit आणि PR
Claude `git add`, `git commit`, `git push`, आणि `gh pr create` चालवतो.

---

## Bug Fix कार्यप्रवाह

```
> anomaly-check function WAQI डाउन असताना 500 परत करत आहे.
> त्याने cached data वरून 200 परत केले पाहिजे.
```

Claude किमान बदल करतो — संपूर्ण function पुन्हा लिहित नाही.

---

## प्रभावी prompt patterns

### नवीन वैशिष्ट्यांसाठी
```
[वैशिष्ट्य] जोडा. आवश्यकता:
- [मर्यादा 1]
- [मर्यादा 2]
[संदर्भ फाइल] मधील विद्यमान pattern फॉलो करा.
```

### Bug fix साठी
```
[Function] [स्थिती] वर [त्रुटी] परत करतो.
अपेक्षित: [योग्य वर्तन].
किमान बदल करा.
```
