# புதிய பேனலைச் சேர்த்தல்

ஜான்வாயூ (JanVayu) பேனல் உள்ளடக்கத்திற்கு HTML `<template>` எலிமெண்ட்களைப் பயன்படுத்துகிறது. பயனர் அங்கு செல்லும்போது ஒவ்வொரு பேனலும் தேவைப்படும்போது லோட் செய்யப்படுகிறது. புதிய பேனல்கள் `index.html`-ல் இருப்பதில்லை: அவற்றில் 19, `panels/*.html`-ல் HTML துண்டுகளாக உள்ளன, அவை தேவைப்படும்போது பெறப்பட்டு `app.js`-ல் உள்ள `LAZY_PANELS` மேப்பில் பதிவு செய்யப்படுகின்றன. பெரிய பேனலுக்கு அந்த முறையைப் பயன்படுத்தவும்; கீழே உள்ள படிகள் `<template>` முறையை விவரிக்கின்றன.

---

## படிப்படியாக

### 1. டெம்ப்ளேட்டை உருவாக்குதல்

`index.html`-ல் புதிய `<template>` எலிமெண்ட்டைச் சேர்க்கவும்:

```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2><span class="si si-your-icon"></span> Panel Title</h2>
        <p data-simple="Plain language description.">
            Technical description of this panel.
        </p>
    </div>
    <!-- Your content here -->
</template>
```

### 2. நேவிகேஷன் லிங்கைச் சேர்த்தல்

`<nav class="section-nav">`-ல், சரியான டிராப்டவுனுக்குக் கீழே சேர்க்கவும்:

```html
<button class="nav-dropdown-link" data-panel="your-panel">Your Panel</button>
```

### 3. மொபைல் நேவிகேஷன் லிங்கைச் சேர்த்தல்

```html
<button class="mobile-nav-item" data-panel="your-panel">Your Panel</button>
```

### 4. எளிய மொழி உரையைச் சேர்த்தல்

தொழில்நுட்ப உள்ளடக்கம் கொண்ட அனைத்து `<p>` டேக்குகளிலும் `data-simple="..."` சேர்க்கவும்.

### 5. ரோல் கான்ஃபிக்ஸில் சேர்க்கவும் (விருப்பத்திற்குரியது)

```javascript
parent: {
    panels: [
        { panel: 'your-panel', title: 'Panel Title', desc: 'Short description' },
    ]
}
```

---

## பொதுவான பேட்டர்ன்கள்

### ஸ்டாட் ஸ்ட்ரிப்
```html
<div class="stat-strip">
    <div class="stat-strip-item">
        <div class="number-callout jv-t-red">169K</div>
        <div class="stat-label">Description</div>
    </div>
</div>
```

### கார்டு
```html
<div class="card mb-2">
    <div class="card-header"><span class="card-title">Title</span></div>
    <div class="card-body">Content</div>
    <div class="card-footer">Source: ...</div>
</div>
```

### இன்போ பாக்ஸ்
```html
<div class="info-box" style="border-left: 3px solid var(--accent);">
    <h4>Heading</h4>
    <p>Content</p>
</div>
```

---

## ஐகான்கள்

ஜான்வாயூ [Sargam Icons](https://sargamicons.com/) v1.6.7-ஐப் பயன்படுத்துகிறது. `<span class="si si-icon-name"></span>`-ஐப் பயன்படுத்தவும்.
