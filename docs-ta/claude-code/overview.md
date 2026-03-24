# Claude Code — JanVayu எவ்வாறு உருவாக்கப்பட்டது

JanVayu **Claude Code**, Anthropic-ன் software engineering-க்கான அதிகாரபூர்வ CLI agent-ஐ பயன்படுத்தி உருவாக்கப்பட்டது. இந்தப் பிரிவு முழுமையான அமைப்பு, பணிப்பாய்வு மற்றும் கட்டமைப்பை ஆவணப்படுத்துகிறது — உங்கள் சொந்த திட்டங்களுக்கு இதை நகலெடுக்க முடியும்.

---

## Claude Code என்றால் என்ன?

Claude Code ஒரு terminal-அடிப்படையிலான AI coding agent. உங்கள் திட்ட directory-ல் இயக்கினால் இது செய்ய முடியும்:

- கோப்புகளை படிக்கவும் எழுதவும்
- Shell commands இயக்கவும்
- Codebases-ஐ தேடவும்
- Commits மற்றும் pull requests உருவாக்கவும்
- சிக்கலான multi-file refactors நிர்வகிக்கவும்
- முழு சூழலுடன் errors debug செய்யவும்

நீங்கள் என்ன விரும்புகிறீர்கள் என்று விவரிக்கிறீர்கள், Claude அதை செயல்படுத்துகிறது — உங்கள் குறியீட்டை படிக்கிறது, மாற்றங்களை செய்கிறது, tests இயக்குகிறது, பணி முடியும் வரை மீண்டும் மீண்டும் செய்கிறது.

---

## JanVayu-க்கு Claude Code எவ்வாறு பயன்படுத்தப்பட்டது

### ஆரம்ப உருவாக்கம்

முக்கிய தளம் (`index.html`, அனைத்து Netlify Functions, உள்கட்டமைப்பு configs) Claude Code sessions-ல் படிப்படியாக உருவாக்கப்பட்டது:

1. **அம்சத்தை விவரிக்கவும்** — எ.கா., "வயது, நிலைமைகள் மற்றும் வெளிப்புற மணி நேரங்களை எடுக்கும் சுகாதார தாக்க கணிப்பானை சேர்க்கவும்"
2. **Claude ஏற்கனவே உள்ள குறியீட்டை படிக்கிறது** — சூன்ய-framework கட்டுப்பாடு, ஏற்கனவே உள்ள patterns-ஐ புரிந்துகொள்கிறது
3. **Claude செயல்படுத்துகிறது** — `index.html`-ல் inline-ஆக அல்லது புதிய Netlify Function-ஆக
4. **மதிப்பாய்வு மற்றும் மீண்டும் செய்தல்** — சரிசெய்தல்களை கோருதல், edge cases-ஐ சரிசெய்தல்
5. **Claude commit செய்கிறது** — திட்ட மரபுக்கு ஏற்ற commit message prefix-உடன்

### v25.1 AI அம்சங்கள்

நான்கு Gemini-இயக்கப்படும் அம்சங்களும் (Ask JanVayu, Health Advisory, Accountability Brief, Anomaly Detection) Claude Code sessions-ல் உருவாக்கப்பட்டன:

- Claude Netlify Functions (`.mjs` கோப்புகள்) எழுதினார்
- Claude Gemini system prompts-ஐ வடிவமைத்தார்
- Claude `index.html`-ல் frontend UI sections-ஐ சேர்த்தார்
- Claude CHANGELOG entries-ஐ உருவாக்கினார்
- Claude PRs மற்றும் merges-ஐ நிர்வகித்தார்

### ஆவணங்கள்

இந்த முழு GitBook ஆவணங்களும் Claude Code-ஆல் உருவாக்கப்பட்டன — நீங்கள் இப்போது படிக்கும் பக்கம் உட்பட.

---

## Session பணிப்பாய்வு

JanVayu-க்கான வழக்கமான Claude Code session இந்த pattern-ஐ பின்பற்றுகிறது:

```
1. Repo root-ல் Claude Code-ஐ தொடங்கவும்
   $ claude

2. பணியை விவரிக்கவும்
   > "Delhi, Mumbai, Kolkata, Chennai மற்றும் Bengaluru-க்கான
     பருவகால அடிப்படை மதிப்புகளுக்கு எதிராக PM2.5-ஐ சோதிக்கும்
     anomaly detection banner-ஐ சேர்க்கவும்"

3. Claude codebase-ஐ ஆராய்கிறது
   - ஏற்கனவே உள்ள UI patterns-ஐ புரிந்துகொள்ள index.html படிக்கிறது
   - Code style-க்கு ஏற்கனவே உள்ள Netlify Functions படிக்கிறது
   - கிடைக்கும் dependencies-க்கு package.json சோதிக்கிறது

4. Claude செயல்படுத்துகிறது
   - netlify/functions/anomaly-check.mjs உருவாக்குகிறது
   - index.html-க்கு banner HTML/CSS/JS சேர்க்கிறது
   - Function-ஐ அழைக்க client-side code-ஐ புதுப்பிக்கிறது

5. Claude commit செய்து PR உருவாக்குகிறது
   - Commit message convention-ஐ பின்பற்றுகிறது (Add:, Fix:, போன்றவை)
   - Summary மற்றும் test plan-உடன் PR உருவாக்குகிறது

6. மதிப்பாய்வு, மீண்டும் செய்தல், merge
```

---

## இந்த திட்டத்திற்கான முக்கிய வலிமைகள்

### சூழல் விழிப்புணர்வு
Claude Code உங்கள் முழு codebase-ஐ படிக்கிறது. JanVayu-க்கு, இது புரிந்துகொண்டது:
- சூன்ய-framework கட்டுப்பாடு (React/Vue/Angular இல்லை)
- `index.html`-ல் inline CSS/JS pattern
- Netlify Functions அமைப்பு மற்றும் CORS handling
- Netlify Blobs-ஐ பயன்படுத்தும் cache-first pattern
- Git hooks-ஆல் செயல்படுத்தப்படும் commit message convention

### Multi-File ஒருங்கிணைப்பு
"Ask JanVayu" போன்ற அம்சத்தை சேர்க்க இவற்றில் மாற்றங்கள் தேவை:
- புதிய Netlify Function (`air-query.mjs`)
- Frontend HTML (`index.html`-ல் புதிய section)
- Frontend CSS (chat interface-க்கான styling)
- Frontend JS (function-க்கான fetch call, UI logic)
- CHANGELOG.md (அம்சத்தை ஆவணப்படுத்துதல்)

Claude Code இவை அனைத்தையும் ஒரே session-ல் கையாளுகிறது.

### Git Integration
Claude Code-க்கு native-ஆக:
- `git status`, `git diff`, `git log`
- சரியான messages-உடன் commits உருவாக்குதல்
- `gh` CLI வழியாக branches மற்றும் PRs உருவாக்குதல்
- திட்ட-குறிப்பிட்ட git hooks-ஐ பின்பற்றுதல்

---

## Claude Code-ஆல் முடியாதவை

வெளிப்படைத்தன்மைக்காக, மனித தலையீடு தேவைப்பட்டவை:

| பணி | ஏன் |
|------|-----|
| Netlify dashboard கட்டமைப்பு | சூழல் மாறிகள், domain setup, build settings |
| API key உருவாக்கம் | Google AI Studio, Resend, WAQI கணக்குகள் |
| வடிவமைப்பு முடிவுகள் | எந்த அம்சங்களை உருவாக்குவது, முன்னுரிமை வரிசை |
| உள்ளடக்க மதிப்பாய்வு | தரவு மூல துல்லியம், கொள்கை சரிபார்ப்பு |
| வரிசைப்படுத்தல் சரிபார்ப்பு | Deploy-க்குப் பின் நேரடி site-ஐ சோதித்தல் |
| GitBook கணக்கு அமைப்பு | GitBook space உருவாக்குதல், repo-ஐ இணைத்தல் |
