# Skill: Visual Design

These are the prompting patterns used to achieve JanVayu's visual identity — a platform that needs to communicate urgency, data density, and civic seriousness without feeling like a government website or a tech product.

---

## Design Brief (Used Throughout Development)

This brief was passed to every AI interaction involving visual design:

```
JanVayu is a citizen air quality accountability platform for India. 
Its visual language should feel:
- Serious and data-driven (not alarmist, not cheerful)
- Accessible to users on low-end devices and small screens
- Respectful of the communities most harmed by air pollution
- Visually distinct from government portals (which feel bureaucratic) 
  and tech products (which feel commercial)

Colour: deep purples and teals as primary palette. AQI categories use 
the standard green/yellow/orange/red/purple/maroon scale — never deviate 
from this because users are trained to read it.

Typography: system fonts only (no Google Fonts CDN calls) for performance.
Density: information-dense but not cluttered. Tables over prose for data.
Mobile-first: the majority of Indian internet users access on mobile.
```

Keeping this brief consistent across every design prompt produced a coherent visual language without a design system document.

---

## Prompt Patterns Used

### 1. The "AQI Colour Card" Pattern

For city AQI cards:

```
Design an AQI city card in HTML/CSS. It shows: city name, current AQI number, 
AQI category label, PM2.5 value. The background colour should reflect the AQI 
category using the standard US EPA colour scale. Use CSS custom properties 
for colours so they can be set dynamically by JavaScript. The card should 
be readable at any of the 6 AQI category colours, including on dark backgrounds 
(maroon/purple). No images. No icons that require a library.
```

The "readable at any of the 6 AQI category colours" constraint forced the AI to use proper contrast logic — not just white text on a coloured background, which fails on yellow.

---

### 2. The "Data Table" Pattern

For any tabular data (policy tracker, budget tracker, city comparison):

```
Create an HTML table for [dataset]. Requirements:
- Mobile-first: on small screens, show only the 2-3 most important columns; 
  hide secondary columns with a CSS class that can be toggled
- Sticky header on scroll
- Alternating row colours using CSS variables (not hardcoded hex)
- Sort indicator on column headers (visual only — no JS sort required)
- A "source" column where each cell is a linked citation
- No external CSS frameworks
```

The "source column as linked citation" requirement was critical for JanVayu's accountability mission — every data table traces back to a primary source.

---

### 3. The "Section Header" Pattern

JanVayu has 23 sections. Keeping them visually consistent without a component system required a pattern:

```
Design a section header for a civic data platform. It should include:
- Section number (small, muted)
- Section title (large, bold)
- A one-sentence description in a muted colour
- An optional "last updated" timestamp aligned right
- A subtle border-bottom separator

Use only CSS — no images, icons, or JavaScript. The header should work 
at 320px wide (minimum mobile) without text overflow.
```

"Works at 320px without text overflow" caught several wrapping issues before they reached production.

---

### 4. The "Colour for Urgency" Pattern

For callout boxes and alert banners:

```
Design a callout box that communicates [low/moderate/high/severe] urgency 
without using red for anything below "severe". Use colour, border weight, 
and typography weight — not icons or emojis — to convey severity level.
The box must be distinguishable in greyscale (for colour-blind users).
```

"Distinguishable in greyscale" forced the use of border weight and typography as secondary urgency signals — not just colour — which improved accessibility significantly.

---

### 5. The "Chart Accessibility" Pattern

For Chart.js visualisations:

```
Configure this Chart.js chart for accessibility:
- All data points have aria-label attributes
- The chart has a visible title and a text summary of the key finding 
  below it (for screen readers and users who cannot interpret charts)
- Colours are from a colour-blind-safe palette (not default Chart.js colours)
- Grid lines are subtle (not the default grey which overwhelms data lines)
- Tooltips are readable on both light and dark backgrounds
```

The "text summary of the key finding" requirement means every chart on JanVayu has a plain-language sentence below it — useful for accessibility, and also for users who want the takeaway without reading the chart.

---

## CSS Architecture Decision

JanVayu uses a single `<style>` block in `index.html` with CSS custom properties at `:root` level. This was an intentional constraint:

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

Every design prompt was asked to use these variable names rather than hardcode values. This made it possible to audit and update the entire colour scheme by changing a handful of lines.
