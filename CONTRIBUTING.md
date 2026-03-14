# Contributing to JanVayu

Thank you for your interest in contributing to JanVayu! This citizen-led archive depends on community participation to document India's air quality crisis comprehensively.

## Ways to Contribute

### 🔬 Researchers
- Share datasets and papers on air pollution health impacts
- Help verify and fact-check existing content
- Contribute analysis and visualizations
- Translate research summaries into Indian languages

### 📰 Journalists
- Share verified investigative reports
- Document local air quality stories
- Help archive important media coverage
- Contribute to the accountability tracker

### 💻 Developers
- Report bugs and suggest improvements
- Contribute code fixes and new features
- Build data visualization tools
- Improve accessibility and performance

### 👥 Citizens
- Share firsthand testimonies (anonymized if preferred)
- Document local air quality conditions
- Help translate content into regional languages
- Spread awareness about the archive

### 🎨 Designers
- Improve visual accessibility
- Create infographics and educational materials
- Help with UI/UX improvements

---

## How to Contribute

### For Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/Varnasr/JanVayu.git
   cd JanVayu
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Test your changes locally
   - Ensure the website works on mobile devices

4. **Submit a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Include screenshots if applicable

### For Content Contributions

1. **Open an Issue** describing what you want to contribute
2. **Provide sources** — all content must be verifiable
3. **Include context** — explain why this is relevant

### For Data Contributions

- Ensure data is from a legitimate, verifiable source
- Provide clear attribution and licensing information
- Include methodology documentation if applicable

---

## Content Guidelines

### What We Accept

✅ Verified data from official sources (CPCB, WHO, Lancet, etc.)
✅ Peer-reviewed research papers
✅ Credible journalism from established outlets
✅ Firsthand citizen testimonies (with consent)
✅ Official policy documents and court orders
✅ Accurate translations

### What We Don't Accept

❌ Unverified claims or rumors
❌ Partisan political content
❌ Commercial promotions
❌ Content that violates privacy without consent
❌ Misinformation or pseudoscience

---

## Code Standards

- **HTML:** Semantic, accessible markup
- **CSS:** Use CSS variables for theming
- **JavaScript:** Vanilla JS preferred; no unnecessary dependencies
- **Comments:** Document complex logic
- **Accessibility:** Follow WCAG guidelines

---

## Netlify Functions Development

JanVayu uses [Netlify Functions](https://docs.netlify.com/functions/overview/) for server-side operations such as scheduled data updates and email subscriptions.

### Structure

Netlify Functions are located in the `netlify/functions/` directory. Each function is a standalone module that handles a specific server-side task.

### Local Development

To develop and test Netlify Functions locally:

1. **Install the Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Run the local dev server**
   ```bash
   netlify dev
   ```
   This starts a local server that emulates the Netlify environment, including Functions.

3. **Test functions directly**
   ```bash
   netlify functions:invoke <function-name> --payload '{"key": "value"}'
   ```

### Guidelines

- Keep functions focused and single-purpose
- Handle errors gracefully and return appropriate HTTP status codes
- Do not hardcode secrets — use environment variables (see below)
- Test locally with `netlify dev` before submitting a PR

---

## Environment Variable Setup

### For Local Development

1. **Create a `.env` file** in the project root (this file is gitignored):
   ```bash
   cp .env.example .env
   ```

2. **Required variables:**
   ```
   WAQI_API_TOKEN=<your-waqi-token>
   ```
   The WAQI API token is free to obtain from [aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/). The project's token is public (free tier, read-only), so you can also find it in the frontend source.

3. **Optional variables** (for Netlify Functions features):
   ```
   EMAIL_SERVICE_API_KEY=<your-key>
   NOTIFICATION_SENDER=<sender-email>
   ```
   These are only needed if you are working on email subscription or notification features. They are not required for general frontend development.

### For Production

Production environment variables are managed through the Netlify dashboard and are server-side only. They are never committed to the repository. If you need a new environment variable added for a feature, note it in your pull request description.

---

## Reporting Issues

When reporting bugs:

1. Check if the issue already exists
2. Use the issue template
3. Include:
   - Browser and device information
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if relevant

---

## Community Standards

All contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md).

Key principles:
- Be respectful and inclusive
- Focus on facts, not opinions
- Respect affected communities
- Maintain non-partisan stance

---

## Questions?

- **General questions:** Open a [Discussion](https://github.com/Varnasr/JanVayu/discussions)
- **Bug reports:** Open an [Issue](https://github.com/Varnasr/JanVayu/issues)
- **Direct contact:** [contribute@janvayu.in](mailto:contribute@janvayu.in)

---

Thank you for helping document India's air quality crisis. Every contribution matters.

**जनवायु — क्योंकि हवा सबकी है।**
