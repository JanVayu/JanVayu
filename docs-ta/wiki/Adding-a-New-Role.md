# புதிய ரோலைச் சேர்த்தல்

ரோல் சிஸ்டம் `index.html` இல் உள்ள `ROLE_CONFIG` JavaScript ஆப்ஜெக்ட்டில் கான்ஃபிகர் செய்யப்பட்டுள்ளது.

---

## படிமுறை

### 1. ROLE_CONFIG இல் சேர்க்கவும்

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

### 2. HTML மாற்றம் தேவையில்லை

ஹெட்டரில் உள்ள ரோல் ஸ்விட்சர் `ROLE_CONFIG` இலிருந்து `#rolePopoverGrid` ஆக உருவாக்கப்படுகிறது, எனவே அங்கு ஒரு புதிய கீ தானாகவே தோன்றும். பழைய ஃபுல்-ஸ்கிரீன் ரோல் ஓவர்லே மற்றும் அதன் `role-card` மார்க்அப் இப்போது இல்லை.

### 3. மொழிபெயர்ப்பு கீகளைச் சேர்க்கவும் (விருப்பத்திற்குரியது)

மொழிபெயர்ப்பு JSON இல் `data-i18n` கீகள் மற்றும் தொடர்புடைய என்ட்ரிக்களைச் சேர்க்கவும்.

---

## வழிகாட்டுதல்கள்

- **3 ஆக்‌ஷன்கள்** — இந்த ரோல் செய்யக்கூடிய 3 மிகச் சிறந்த விஷயங்களைத் தேர்ந்தெடுக்கவும்
- **6 பேனல்கள்** — மிகவும் பொருத்தமான பேனல்களைப் பரிந்துரைக்கவும்
- **தலைப்பு** — செயல்படத் தூண்டும் வகையிலும் அதிகாரமளிக்கும் வகையிலும் இருக்க வேண்டும்
- **விளக்கம்** — ஒரு வாக்கியம், உறுதியானது, டூல்ஸ்/டேட்டாவைக் குறிப்பிட வேண்டும்
- **ஐகான்** — [Sargam Icons](https://sargamicons.com/) இலிருந்து தேர்ந்தெடுக்கவும்
