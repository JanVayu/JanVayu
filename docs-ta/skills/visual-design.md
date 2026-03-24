# Skill: காட்சி வடிவமைப்பு

JanVayu-ன் காட்சி அடையாளத்தை அடைய பயன்படுத்தப்பட்ட prompting patterns — அவசரம், தரவு அடர்த்தி மற்றும் civic தீவிரத்தை தெரிவிக்க வேண்டிய ஒரு தளத்திற்கு, அரசு website அல்லது tech product போல உணராமல்.

---

## வடிவமைப்பு Brief

இந்த brief காட்சி வடிவமைப்பு சம்பந்தப்பட்ட ஒவ்வொரு AI interaction-க்கும் அனுப்பப்பட்டது:

```
JanVayu is a citizen air quality accountability platform for India.
Its visual language should feel:
- Serious and data-driven (not alarmist, not cheerful)
- Accessible to users on low-end devices and small screens
- Respectful of the communities most harmed by air pollution
- Visually distinct from government portals and tech products

Colour: deep purples and teals as primary palette. AQI categories use
the standard green/yellow/orange/red/purple/maroon scale.

Typography: system fonts only (no Google Fonts CDN calls) for performance.
Density: information-dense but not cluttered. Tables over prose for data.
Mobile-first: the majority of Indian internet users access on mobile.
```

---

## பயன்படுத்தப்பட்ட Prompt Patterns

### 1. "AQI Colour Card" Pattern

```
Design an AQI city card in HTML/CSS. It shows: city name, current AQI number,
AQI category label, PM2.5 value. The background colour should reflect the AQI
category using the standard US EPA colour scale. Use CSS custom properties.
The card should be readable at any of the 6 AQI category colours.
No images. No icons that require a library.
```

### 2. "Data Table" Pattern

```
Create an HTML table for [dataset]. Requirements:
- Mobile-first: on small screens, show only 2-3 most important columns
- Sticky header on scroll
- Alternating row colours using CSS variables
- A "source" column where each cell is a linked citation
- No external CSS frameworks
```

### 3. "Section Header" Pattern

```
Design a section header for a civic data platform. It should include:
- Section number (small, muted)
- Section title (large, bold)
- A one-sentence description in a muted colour
- An optional "last updated" timestamp aligned right
- A subtle border-bottom separator

Use only CSS — no images, icons, or JavaScript. Works at 320px wide.
```

### 4. "Colour for Urgency" Pattern

```
Design a callout box that communicates [low/moderate/high/severe] urgency
without using red for anything below "severe". Use colour, border weight,
and typography weight — not icons or emojis — to convey severity level.
The box must be distinguishable in greyscale (for colour-blind users).
```

### 5. "Chart Accessibility" Pattern

```
Configure this Chart.js chart for accessibility:
- All data points have aria-label attributes
- The chart has a visible title and a text summary of the key finding
  below it (for screen readers)
- Colours are from a colour-blind-safe palette
- Grid lines are subtle
- Tooltips are readable on both light and dark backgrounds
```

---

## CSS கட்டமைப்பு முடிவு

JanVayu `index.html`-ல் `:root` அளவிலான CSS custom properties-உடன் ஒற்றை `<style>` block-ஐ பயன்படுத்துகிறது:

```css
:root {
  --color-aqi-good: #00e400;
  --color-aqi-moderate: #ffff00;
  --color-aqi-unhealthy-sensitive: #ff7e00;
  --color-aqi-unhealthy: #ff0000;
  --color-aqi-very-unhealthy: #8f3f97;
  --color-aqi-hazardous: #7e0023;

  --color-primary: #6d28d9;
  --color-surface: #1e1b4b;
  --color-text: #e2e8f0;
}
```

ஒவ்வொரு design prompt-ம் hardcode மதிப்புகளுக்கு பதிலாக இந்த variable பெயர்களை பயன்படுத்தக் கேட்கப்பட்டது. இது சில வரிகளை மாற்றுவதன் மூலம் முழு வண்ண scheme-ஐ audit செய்யவும் புதுப்பிக்கவும் சாத்தியமாக்கியது.
