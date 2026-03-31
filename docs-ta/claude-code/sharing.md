# பகிர்வு மற்றும் இந்த அமைப்பை நகலெடுத்தல்

இந்தப் பக்கம் JanVayu-ன் Claude Code பணிப்பாய்வை உங்கள் குழுவுடன் பகிர்வது அல்லது உங்கள் சொந்த திட்டத்திற்கு நகலெடுப்பது பற்றி விளக்குகிறது.

---

## உங்கள் குழுவிற்கு

### GitBook-ஐ பகிரவும்

இந்த ஆவணங்கள் GitBook-ல் host செய்யப்பட்டு பொதுவாக பகிரக்கூடியவை. இவற்றைப் புரிந்துகொள்ள வேண்டிய எவருக்கும் GitBook URL-ஐ அனுப்புங்கள்:
- JanVayu எவ்வாறு உருவாக்கப்பட்டது
- Claude Code-ஐ பயன்படுத்தி எவ்வாறு பங்களிப்பது
- மற்றொரு நகரம் அல்லது domain-க்கு JanVayu-ஐ fork செய்வது எப்படி

### புதிய பங்களிப்பாளரை சேர்த்தல்

1. **Repo-ஐ clone செய்யுங்கள்** — `git clone https://github.com/JanVayu/JanVayu.git`
2. **Docs படியுங்கள்** — இந்த GitBook-உடன் தொடங்குங்கள், குறிப்பாக:
   - [தொழில்நுட்ப அடுக்கு கண்ணோட்டம்](../tech-stack/overview.md)
   - [கட்டமைப்பு](../technical/architecture.md)
   - [உள்ளூர் மேம்பாடு](../technical/local-development.md)
3. **Claude Code நிறுவுங்கள்** — `npm install -g @anthropic-ai/claude-code`
4. **Session தொடங்குங்கள்** — `cd JanVayu && claude`
5. **பணிப்பாய்வை பின்பற்றுங்கள்** — [பணிப்பாய்வு](workflow.md)-ல் விவரிக்கப்பட்டுள்ளது

---

## உங்கள் சொந்த திட்டத்திற்கு

### படி 1: கட்டுப்பாடு-முதல் அணுகுமுறையை ஏற்றுக்கொள்ளுங்கள்

JanVayu-லிருந்து மிகவும் மாற்றக்கூடிய பாடம் **கட்டுப்பாடு-முதல் prompting**. Claude Code-ஐ எதையும் உருவாக்கச் சொல்வதற்கு முன்:

1. உங்கள் திட்டம் *பயன்படுத்தாதவை* வரையறுக்கவும் (frameworks, build tools, போன்றவை)
2. உங்கள் code style மற்றும் conventions வரையறுக்கவும்
3. உங்கள் deployment target வரையறுக்கவும்
4. இவற்றை repo root-ல் `CLAUDE.md` கோப்பில் வைக்கவும்

### படி 2: Skill Files உருவாக்கவும்

உங்கள் திட்டம் AI அம்சங்களைப் பயன்படுத்தினால் (எந்த model-ஆக இருந்தாலும் — Gemini, OpenAI, Claude API), ஒவ்வொரு AI interaction-ஐயும் skill file-ஆக ஆவணப்படுத்தவும்:

```markdown
# Skill: [Feature Name]

## Role
[Model எதாக செயல்படுகிறது]

## Data Context
[Prompt-க்கு என்ன நிஜ தரவு செலுத்தப்படுகிறது]

## Output Format
[எதிர்பார்க்கப்படும் துல்லியமான அமைப்பு]

## Constraints
[சொல் வரம்புகள், தொனி, மொழி, என்ன செய்யக் கூடாது]

## Fallback
[AI அழைப்பு தோல்வியடைந்தால் என்ன நடக்கும்]
```

### படி 3: Git Hooks அமைக்கவும்

இவற்றை செயல்படுத்த JanVayu-ன் git hooks-ஐ (`.githooks/`) நகலெடுக்கவும்:
- Commit message conventions
- Commits-ல் ரகசியங்கள் இல்லாமை
- Debug statements இல்லாமை

### படி 4: உருவாக்கும்போதே ஆவணப்படுத்துங்கள்

உங்கள் code-உடன் இணைந்து GitBook docs உருவாக்கவும். Claude Code உங்கள் codebase-லிருந்து ஆவணங்களை உருவாக்க முடியும் — பயன்படுத்துங்கள்.

---

## JanVayu-ஐ மற்றொரு நகரத்திற்கு Fork செய்தல்

JanVayu MIT உரிமம் பெற்றது. மற்றொரு நகரம் அல்லது நாட்டிற்கு fork செய்ய:

1. GitHub-ல் **repo-ஐ fork செய்யுங்கள்**
2. `index.html`-ல் **நகர பட்டியலை புதுப்பிக்கவும்**
3. `anomaly-check.mjs`-ல் **பருவகால அடிப்படை மதிப்புகளை புதுப்பிக்கவும்**
4. உங்கள் பகுதிக்கான **WAQI station IDs-ஐ புதுப்பிக்கவும்**
5. உள்ளூர் மொழிகளுக்கான **strings-ஐ மொழிபெயர்க்கவும்**
6. சூழல் மாறிகளுடன் **உங்கள் சொந்த Netlify site அமைக்கவும்**
7. **விருப்பம்:** Gemini-ஐ மற்றொரு model-உடன் மாற்றவும் (skill files model-agnostic)

இந்த படிகள் அனைத்திலும் Claude Code உதவ முடியும்.

---

## இந்த ஆவணங்களை ஏற்றுமதி செய்தல்

### GitBook Space-ஆக

இந்த ஆவணங்கள் GitHub repo-ல் `docs/` directory-லிருந்து sync ஆகின்றன. `main`-க்கு push செய்யப்படும் எந்த மாற்றங்களும் தானாக GitBook-ஐ புதுப்பிக்கும்.

### PDF-ஆக

GitBook Ultimate plan PDF export-ஐ ஆதரிக்கிறது:
1. GitBook space-ஐ திறக்கவும்
2. **...** menu → **Export as PDF** கிளிக் செய்யவும்
3. PDF-ஐ பகிரவும்

### Markdown-ஆக

Raw Markdown கோப்புகள் repo-ல் `docs/`-ல் உள்ளன — நேரடியாக பகிரவும் அல்லது Markdown render செய்யும் எங்கும் host செய்யவும் (GitHub, Notion, HackMD).
