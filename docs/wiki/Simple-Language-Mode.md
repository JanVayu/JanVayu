# Simple Language Mode

JanVayu contains complex technical content (PM2.5 concentrations, GEMM mortality models, policy acronyms). Simple language mode rewrites this content in plain, jargon-free language accessible to anyone.

---

## How It Works

1. **Toggle** — Click the eye icon in the header, or use the toggle in the glossary panel
2. **Swap** — All elements with `data-simple` attributes have their content replaced with plain-language versions
3. **Persist** — State saved to `sessionStorage`, restored on page reload
4. **Visual indicator** — A green "Simple language" badge appears next to simplified text
5. **Reversible** — Click again to restore technical language

---

## Technical Implementation

### HTML Attributes

Any element can be made simple-mode-aware by adding a `data-simple` attribute:

```html
<p data-simple="Dirty air costs India a lot of money every year.">
    The monetised value of premature deaths from outdoor air pollution in India was $339.4 billion in 2022 (9.5% of GDP).
</p>
```

### JavaScript

```javascript
let simpleMode = sessionStorage.getItem('janvayu-simple-mode') === 'true';

function toggleSimpleMode() {
    simpleMode = !simpleMode;
    sessionStorage.setItem('janvayu-simple-mode', simpleMode);
    applySimpleMode();
}

function applySimpleMode() {
    document.body.classList.toggle('simple-language', simpleMode);
    document.querySelectorAll('[data-simple]').forEach(el => {
        if (simpleMode) {
            if (!el.dataset.technical) el.dataset.technical = el.innerHTML;
            el.innerHTML = el.dataset.simple;
        } else {
            if (el.dataset.technical) el.innerHTML = el.dataset.technical;
        }
    });
}
```

---

## Coverage

- Panel intro paragraphs
- 20 glossary definitions (technical / simple)
- Key insight boxes, alert boxes, pull-quotes
- Budget, policy, health, children, indoor, legal, action panels

### Adding Simple Text

1. Find the element in `index.html`
2. Add `data-simple="Your plain language version here"`
3. Use HTML entities for special characters: `&lt;strong&gt;`, `&amp;`
4. Write for a 12-year-old: short sentences, no acronyms, concrete examples
5. Keep the same meaning — simplify language, not content

### Guidelines

| Technical | Simple |
|-----------|--------|
| PM2.5 concentration of 60 ug/m3 | pollution level of 60 (the WHO yearly guideline is 5; India's yearly limit is 40) |
| GEMM mortality model | a formula that estimates how many people die from pollution |
| source apportionment studies | research into what causes the pollution |
| cost-effectiveness analysis | checking if the money was well spent |
