# புதிய பேனலைச் சேர்த்தல்
JanVayu பேனல் உள்ளடக்கத்திற்கு HTML `<template>` கூறுகளைப் பயன்படுத்துகிறது. பயனர் அதற்குக் செல்லும்போது ஒவ்வொரு பேனலும் தேவைக்கேற்ப ஏற்றப்படும். புதிய பேனல்கள் `index.html`-இல் இருக்காது: அவற்றில் 19 பேனல்கள் `panels/*.html`-இல் உள்ள HTML துண்டுகளாகும், அவை தாமதமாகப் பெறப்பட்டு `app.js`-இல் உள்ள `LAZY_PANELS` வரைபடத்தில் பதிவு செய்யப்படுகின்றன. பெரிய பேனலுக்கு அந்த வழியைப் பயன்படுத்தவும்; கீழே உள்ள படிகள் `<template>` வழியை விவரிக்கின்றன.
---
## படிப்படியான வழிமுறைகள்
### 1. டெம்ப்ளேட்டை உருவாக்குதல்
`index.html`-இல் புதிய `<template>` கூறுகளைச் சேர்க்கவும்:
```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2><span><span class="si si-your-icon"></span></span> Panel Title<h2/>
        <p data-simple="சாதாரண மொழி விளக்கம்.">
            இந்த பேனலின் தொழில்நுட்ப விளக்கம்.
        </p>
    </div>
    <!-- உங்கள் உள்ளடக்கம் இங்கே -->
</template>
```
### 2. குறியீட்டுப் பட்டியலில் (Index) சேர்த்தல்
ஒரு பார்வையாளர் பேனலை எப்படி கண்டுபிடிக்கிறார் என்பதுதான் Index. பாரில் உள்ள Index கட்டுப்பாடு ஒவ்வொரு இடத்தின் பட்டியலையும் குழுக்களாகத் திறக்கிறது. `index.html`-இல் உள்ள `#siteIndexGrid`-க்குள் சரியான குழு தலைப்புக்குக் கீழே ஒரு இணைப்பைச் சேர்க்கவும்:
```html
<a href="#your-panel" data-panel="your-panel" onclick="showPanel('your-panel'); closeSiteIndex(); return false;">Your Panel</a>
```
பழைய கீழிறங்கும் நேவிகேஷன் (`<nav class="section-nav">` உடன் `.nav-dropdown-link` பொத்தான்கள்) மற்றும் தனி மொபைல் நேவிகேஷன் (`.mobile-nav-item`) ஆகியவை இனி `index.html` மார்க்அப்பில் இல்லை. அவற்றின் சில CSS மட்டுமே மீதமுள்ளது, எனவே அங்கு சேர்க்க எதுவும் இல்லை.
### 3. இலக்கு எண்ணிக்கையைப் புதுப்பித்தல்
`scripts/check-nav-coverage.py` ஆனது Index-இல் உள்ள இலக்குகள் மற்றும் குழுக்களின் எண்ணிக்கையை `docs/user-guide/overview.md` மற்றும் `docs/user-guide/role-selector.md` ஆகியவற்றில் உள்ள புள்ளிவிவரங்களுடன் ஒப்பிடுகிறது, மேலும் ஒரு இலக்கு அதன் வழியை இழத்தால் தோல்வியடைகிறது. நீங்கள் Index-இல் சேர்க்கும்போது இரண்டு பக்கங்களையும் புதுப்பிக்கவும், பின்னர் சோதனையை இயக்கவும்.
### 4. எளிய மொழி உரையைச் சேர்த்தல்
தொழில்நுட்ப உள்ளடக்கம் கொண்ட அனைத்து `<p>` குறிச்சொற்களிலும் `data-simple="..."` ஐச் சேர்க்கவும்.
### 5. பங்கு அமைப்புகளில் (role configs) சேர்த்தல் (விருப்பத்திற்குரியது)
```javascript
parent: {
    panels: [
        { panel: 'your-panel', title: 'Panel Title', desc: 'Short description' },
    ]
}
```
---
## பொதுவான வடிவங்கள்
### புள்ளிவிவரப் பட்டை (Stat Strip)
```html
<div class="stat-strip">
    <div class="stat-strip-item">
        <div class="number-callout jv-t-red">169K</div>
        <div class="stat-label">Description</div>
   </div>
</div>
```
### அட்டைப்படம் (Card)
```html
<div class="card mb-2">
    <div class="card-header"><span class="card-title">Title</span></div>
    <div class="card-body">Content</div>
    <div class="card-footer">Source: ...</div>
</div>
```
---
### தகவல் பெட்டி
```html
<div class="info-box" style="border-left: 3px solid var(--accent);">
    <h4>தலைப்பு< /h4>
    <p>உள்ளடக்கம்</p>
< /div>
```
---
## ஐகான்கள்
JanVayu [Sargam Icons](https://sargamicons.com/) v1.6.7-ஐப் பயன்படுத்துகிறது. `<span class="si si-icon-name">< /span>` என்பதைப் பயன்படுத்தவும்.
