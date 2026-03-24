# कसे योगदान द्यायचे

JanVayu हा एक open source प्रकल्प आहे. तुमच्या योगदानाचे स्वागत आहे!

---

## योगदानाचे मार्ग

### 1. कोड योगदान
- Bug fixes
- नवीन वैशिष्ट्ये
- कार्यप्रदर्शन सुधारणा
- Accessibility सुधारणा

### 2. सामग्री योगदान
- डेटा स्रोत जोडणे
- धोरण अपडेट्स
- संशोधन संदर्भ

### 3. अनुवाद
- विद्यमान भाषांमध्ये सुधारणा
- नवीन भाषा जोडणे

### 4. Bug रिपोर्ट
- GitHub Issues मध्ये नोंदवा
- Issue template वापरा

---

## प्रक्रिया

1. Repo fork करा
2. Feature branch तयार करा (`git checkout -b feature/my-feature`)
3. बदल करा
4. `netlify dev` ने locally test करा
5. Commit करा (convention फॉलो करा)
6. Pull request तयार करा

---

## Commit संदेश convention

प्रत्येक commit या prefixes ने सुरू व्हायला हवे:

| Prefix | वापर |
|--------|------|
| `Add` | नवीन वैशिष्ट्य |
| `Fix` | Bug fix |
| `Update` | विद्यमान वैशिष्ट्यात सुधारणा |
| `Translate` | अनुवाद |
| `Docs` | दस्तऐवजीकरण |
| `Refactor` | कोड पुनर्रचना |

---

## Local सेटअप

```bash
git clone https://github.com/YOUR-USERNAME/JanVayu.git
cd JanVayu
npm install
netlify dev
```

तपशीलवार सेटअप: [Local Development](../technical/local-development.md)
