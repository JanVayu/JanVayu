# குறியீடு தரநிலைகள்

JanVayu plain HTML, CSS மற்றும் JavaScript-ஐ பயன்படுத்துகிறது. Build படி இல்லை, framework இல்லை, bundler இல்லை. அப்படியே வைத்திருங்கள்.

---

## HTML

- **Semantic HTML5 elements** பயன்படுத்தவும் — `<article>`, `<section>`, `<nav>`, `<main>`, `<header>`, `<footer>`
- அனைத்து images மற்றும் icons-க்கும் `alt` text தேவை
- Forms-க்கு சரியான `<label>` elements இருக்க வேண்டும் (screen readers-க்கு)
- Semantic HTML போதுமானதாக இல்லாத இடங்களில் `aria-label` மற்றும் `role` attributes பயன்படுத்தவும்
- WCAG 2.1 AA அணுகல்தன்மை வழிகாட்டுதல்களை பின்பற்றவும்

---

## CSS

- வண்ணங்கள் மற்றும் இடைவெளிக்கு **CSS custom properties (variables)** பயன்படுத்தவும் — `:root` block-க்கு வெளியே hex மதிப்புகளை hardcode செய்ய வேண்டாம்
- Mobile-first CSS எழுதவும் — அடிப்படை styles சிறிய திரைகளை குறிவைக்கும், media queries பெரிய breakpoints-ஐ கையாளும்
- CSS frameworks (Bootstrap, Tailwind) பயன்படுத்த வேண்டாம் — எளிமை மற்றும் செயல்திறனுக்காக vanilla CSS

---

## JavaScript

- **Vanilla JavaScript மட்டுமே** — React, Vue, jQuery அல்லது பிற frameworks வேண்டாம்
- அனைத்து asynchronous operations-க்கும் `async/await` பயன்படுத்தவும் (callbacks அல்ல)
- API அழைப்புகளை `try/catch`-ல் wrap செய்யவும் — errors-ஐ எப்போதும் அழகாக கையாளவும்
- தெளிவாக இல்லாத logic-க்கு comments சேர்க்கவும்
- Safari ஆதரவு இல்லாத ES2022+ features பயன்படுத்த வேண்டாம் — சந்தேகம் இருந்தால் [caniuse.com](https://caniuse.com) சோதிக்கவும்

---

## Netlify Functions

- ஒவ்வொரு function-ஐயும் **குவிமையமாகவும் ஒற்றை-நோக்கமாகவும்** வைத்திருங்கள்
- பொருத்தமான HTTP status codes திருப்பவும் (200, 400, 404, 500)
- ரகசியங்களை ஒருபோதும் hardcode செய்ய வேண்டாம் — `process.env.VARIABLE_NAME` பயன்படுத்தவும்
- அனைத்து API functions-லும் CORS headers (`Access-Control-Allow-Origin: *`) சேர்க்கவும்
- `OPTIONS` preflight requests-ஐ கையாளவும்
- PR சமர்ப்பிப்பதற்கு முன் `netlify dev`-உடன் உள்ளூரில் சோதிக்கவும்

---

## சூழல் மாறிகள்

- புதிய சூழல் மாறிகள்:
  - placeholder மதிப்பு மற்றும் comment-உடன் `.env.example`-க்கு சேர்க்கப்பட வேண்டும்
  - `docs/technical/environment-variables.md`-ல் ஆவணப்படுத்தப்பட வேண்டும்

---

## செயல்திறன் வழிகாட்டுதல்கள்

- கலந்துரையாடல் இல்லாமல் புதிய npm dependencies சேர்க்க வேண்டாம் — `package.json` வேண்டுமென்றே குறைந்தபட்சமாக உள்ளது
- பெரிய third-party scripts-ஐ synchronous-ஆக ஏற்ற வேண்டாம் — `defer` அல்லது `async` பயன்படுத்தவும்
- Images optimize செய்யப்பட வேண்டும், பொருத்தமான formats-ல் serve செய்யப்பட வேண்டும்
- Site செயல்திறன் மற்றும் அணுகல்தன்மையில் Lighthouse-ல் 90+ score பெற வேண்டும்

---

## Commit Messages

[Conventional Commits](https://www.conventionalcommits.org/) specification-ஐ பின்பற்றவும்:

```
type(scope): short description

Types: feat, fix, docs, style, refactor, test, chore
Scope: dashboard, map, functions, email, policy, data, docs

எடுத்துக்காட்டுகள்:
feat(dashboard): add PM10 toggle
fix(email): handle missing city gracefully
docs(contributing): add code standards page
chore(deps): update @netlify/blobs to 8.2.0
```
