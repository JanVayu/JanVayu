# कोड मानके

JanVayu codebase साठी coding मानके.

---

## सामान्य नियम

- **Vanilla JavaScript** — कोणतेही framework नाही
- **ES2020** — नवीन features नाही (browser compatibility)
- **कोणतेही build step नाही**
- **Client वर कोणतीही npm dependency नाही**

---

## HTML
- Semantic, सुलभ markup
- ARIA roles जिथे आवश्यक
- सर्व images मध्ये alt text

## CSS
- CSS Custom Properties theming साठी
- Mobile-first responsive
- WCAG AA रंग contrast

## JavaScript
- Fetch API (axios नाही)
- DOM API (jQuery नाही)
- प्रत्येक बाह्य कॉल वर try/catch
- console.log debugging साठी (throw नाही)

## Netlify Functions
- CORS preflight हाताळा
- JSON परत करा
- process.env मधून secrets वाचा
- Graceful fallback अनिवार्य

---

## Indentation

| फाइल प्रकार | Indentation |
|-------------|------------|
| HTML, CSS, JS, JSON, YAML | 2 spaces |
| Python | 4 spaces |
| Makefile | Tab |
