# एक नई भूमिका जोड़ना

भूमिका प्रणाली (role system) `index.html` में `ROLE_CONFIG` जावास्क्रिप्ट ऑब्जेक्ट में कॉन्फ़िगर की गई है।

---

## चरण-दर-चरण

### 1. ROLE_CONFIG में जोड़ें

```javascript
const ROLE_CONFIG = {
    yourRole: {
        icon: '<span class="si si-icon-name"></span>',
        label: 'Role Display Name',
        heading: 'A short, compelling heading for the dashboard',
        description: 'One sentence about what this role gets.',
        actions: [
            {
                icon: '<span class="si si-icon"></span>',
                panel: 'panel-id',
                title: 'Action card title',
                desc: 'What the user will find.',
                cta: 'Action text'
            },
            // 3 actions total
        ],
        panels: [
            { panel: 'panel-id', title: 'Panel Name', desc: 'Short description' },
            // 6 recommended panels
        ]
    }
};
```

### 2. HTML में किसी बदलाव की ज़रूरत नहीं

हेडर में रोल स्विचर `ROLE_CONFIG` से `#rolePopoverGrid` में जनरेट होता है, इसलिए एक नई की (key) वहां अपने आप दिखाई देती है। पुराना फुल-स्क्रीन रोल ओवरले और उसका `role-card` मार्कअप अब मौजूद नहीं है।

### 3. ट्रांसलेशन कीज़ (वैकल्पिक) जोड़ें

ट्रांसलेशन JSON में `data-i18n` कीज़ और संबंधित एंट्रीज़ जोड़ें।

---

## दिशा-निर्देश

- **3 क्रियाएं** — इस भूमिका द्वारा किए जा सकने वाले 3 सबसे प्रभावशाली कार्यों का चयन करें
- **6 पैनल** — सबसे प्रासंगिक पैनलों की सिफारिश करें
- **हेडिंग** — एक्शन-ओरिएंटेड और सशक्त बनाने वाली होनी चाहिए
- **विवरण** — एक वाक्य, ठोस, जिसमें टूल्स/डेटा का उल्लेख हो
- **आइकन** — [Sargam Icons](https://sargamicons.com/) से चुनें
