# योगदान कसे द्यावे

ImpactMojo ओपन सोर्स आहे. आम्ही कोड, आशय, भाषांतरे आणि कल्पनांच्या योगदानाचे स्वागत करतो.

---

## योगदान देण्याचे मार्ग

| प्रकार | कसे |
|------|-----|
| **बग अहवाल** | [GitHub Issue](https://github.com/Varnasr/ImpactMojo/issues) उघडा |
| **वैशिष्ट्य विनंत्या** | [GitHub Discussion](https://github.com/Varnasr/ImpactMojo/discussions) सुरू करा |
| **कोड योगदान** | Fork → branch → PR (खाली कार्यप्रवाह पहा) |
| **आशय योगदान** | अभ्यासक्रम, केस स्टडीज, हँडआउट्स, DevDiscourses |
| **भाषांतरे** | [भाषांतरे](translations.md) पहा |
| **डेटा योगदान** | Dataverse साठी डेटासेट्स |

---

## कोड योगदान कार्यप्रवाह

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/<your-username>/ImpactMojo.git
cd ImpactMojo

# 3. Create a branch
git checkout -b feature/your-feature-name

# 4. Make changes (no build step needed — edit HTML/CSS/JS directly)

# 5. Test locally
# Open index.html in a browser, or use:
npx serve .

# 6. Commit with a clear message
git commit -m "Add: description of your change"

# 7. Push and open a PR
git push origin feature/your-feature-name
```

### कमिट संदेश नियम

| उपसर्ग | यासाठी वापरा |
|--------|---------|
| `Add` | नवीन वैशिष्ट्य किंवा आशय |
| `Fix` | बग दुरुस्ती |
| `Update` | विद्यमान वैशिष्ट्यातील सुधारणा |
| `Translate` | भाषांतर जोडणे किंवा सुधारणा |
| `Docs` | दस्तऐवज बदल |
| `Refactor` | वर्तनात बदल न करता कोड पुनर्रचना |
| `Chore` | देखभाल, अवलंबन, CI |

---

## आशय योगदान

### अभ्यासक्रम
- प्रमुख किंवा पायाभूत अभ्यासक्रम टेम्पलेटचे अनुसरण करा
- प्रमुख संज्ञांचा शब्दकोश समाविष्ट करा
- संबंधित असल्यास दक्षिण आशियाई केस स्टडीज जोडा
- सोप्या भाषेत लिहा — लक्ष्य वाचन पातळी पदवीधर आहे

### केस स्टडीज
- कोणत्याही देशातील वास्तविक कार्यक्रम
- देश, विषय आणि पद्धतीनुसार टॅग करा
- स्रोत आणि संदर्भ समाविष्ट करा

### हँडआउट्स
- प्रत्येक पृष्ठावर एक संकल्पना
- सोपी भाषा, कमीत कमी शब्दजाल
- शक्य असल्यास दृश्य (आकृती, सारणी किंवा प्रवाह चार्ट) समाविष्ट करा
- प्राथमिक स्रोत उद्धृत करा

### Dataverse नोंदी
- समाविष्ट करा: डेटासेट नाव, स्रोत, प्रवेश पद्धत (डाउनलोड/API/MCP), टॅग
- स्पष्ट परवाना असलेल्या मुक्त-प्रवेश डेटासेट्सला प्राधान्य द्या

---

## परवाना

योगदान देऊन, तुम्ही सहमत आहात की:
- **कोड** MIT अंतर्गत परवानाधारित आहे
- **शैक्षणिक आशय** CC BY-NC-ND 4.0 अंतर्गत परवानाधारित आहे

---

## संपर्क

- **GitHub:** [github.com/Varnasr/ImpactMojo](https://github.com/Varnasr/ImpactMojo)
- **ईमेल:** [hello@impactmojo.in](mailto:hello@impactmojo.in)
